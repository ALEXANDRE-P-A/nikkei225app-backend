import { setTimeout } from 'timers/promises';

import { 
  getTradingDayFromDatabase, 
  getTickerCodesFromDatabase,
  getSectorsFromDatabase,
  getTickersFromDatabase
} from "../database/mongo_db_get_data.mjs";

import { 
  getTradingDayFromJQuants,
  getMasterInfo,
  getLastDailyInfo,
  getHistoricalDailyInfo,
  calculateMA
} from "../api/j_quants.mjs";

import { 
  checkDatabaseExists,
  createDatabase,
  dropExistingDatabase
} from '../database/mongo_db_create_db.mjs';

import { 
  setTradingDayToObj,
  setSectorsToObj,
  setTickersToObj
} from '../init/nikkei225_required_collections.mjs';

let completedItemsCount = 0;
let totalItemsCount = 0;
let isLoadingFlag = false;
let tradingDay = "";

const switchIsLoadingFlag = async bool => {
  isLoadingFlag = bool;
}

const getIsLoadingFlag = _ => isLoadingFlag;

const getLoadingStatus = _ => `${completedItemsCount}/${totalItemsCount}`;

const getCompletedPercentage = _ => `${(completedItemsCount/totalItemsCount*100).toFixed(1)}%`;

const downloadTickersDataFromJQuants = async tradingDay => {

  let tickersArray = [];
  let s17Array = [];
  let s33Array = [];

  console.log("START! download tickers data from J-quants started");

  await switchIsLoadingFlag(true);

  const tickerCodes = await getTickerCodesFromDatabase();
  totalItemsCount = tickerCodes.length;

  for(const ticker of tickerCodes){
    
    const masterInfo = await getMasterInfo(ticker, tradingDay);
    const dailyInfo = await getLastDailyInfo(ticker, tradingDay);

    if(masterInfo === undefined || dailyInfo === undefined){
      console.log(ticker, " unavailable");
      continue;
    }

    /* --- calculateMA logic ---
      trading day (5MA >= AdjustedCloseValue && 5MA > 25MA) == true
      trading day - 1 (5MA >= AdjustedCloseValue && 5MA > 25MA) == false
      then maFlag is TRUE
      otherwise false
    -------------------------- */
    const maFlag = await calculateMA(ticker, tradingDay);    

    const data = {
      code: ticker,
      nameJp: masterInfo.CoName,
      nameEn: masterInfo.CoNameEn,
      s17: Number(masterInfo.S17),
      s33: Number(masterInfo.S33),
      open: dailyInfo[0].AdjO,
      high: dailyInfo[0].AdjH,
      low: dailyInfo[0].AdjL,
      close: dailyInfo[0].AdjC,
      volume: dailyInfo[0].Vo,
      value:  dailyInfo[0].Va,
      flag: maFlag
    }

    tickersArray.push(data);
    s17Array.push(masterInfo.S17);
    s33Array.push(masterInfo.S33);

    completedItemsCount++;
    console.log(`${completedItemsCount}/${totalItemsCount} downloaded ${(completedItemsCount/totalItemsCount*100).toFixed(1)}% completed`);

    await setTimeout(3000);
  }

  // sectors deduplication
  const deduplicationS17 = [ ...new Set(s17Array) ];
  const deduplicationS33 = [ ...new Set(s33Array) ];

  // update sectors variable
  s17Array = deduplicationS17;
  s33Array = deduplicationS33;

  console.log(`DONE! downloaded ${totalItemsCount} tickers data from J-quants SUCCESSFULLY`);

  completedItemsCount = 0;
  totalItemsCount = 0;

  await setSectorsToObj(s17Array, s33Array);
  await setTickersToObj(tickersArray);

  await switchIsLoadingFlag(false);
};

const mainProcess = async _ => {

  let tradingDayDatabase = "";
  const tradingDayJQuants = await getTradingDayFromJQuants(1);

  if(await checkDatabaseExists())
    tradingDayDatabase = await getTradingDayFromDatabase();

  if(tradingDayDatabase === tradingDayJQuants){
    await getSectorsFromDatabase();
    await getTickersFromDatabase();
  } else {
    await setTradingDayToObj(tradingDayJQuants);
    await dropExistingDatabase();
    await downloadTickersDataFromJQuants(tradingDayJQuants);
    await createDatabase();
  }
};

export {
  mainProcess,
  getIsLoadingFlag,
  getLoadingStatus,
  getCompletedPercentage,
};