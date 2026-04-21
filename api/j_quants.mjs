/*
  (jq*1) getTradingDayFromJQuants
  (jq*2) getMasterInfo
  (jq*3) getLastDailyInfo
  (jq*4) getHistoricalDailyInfo
  (jq*5) calculateMA
*/

import axios from "axios";
import { config } from "dotenv";
import { setTimeout } from 'timers/promises';
import { getToday, getDayBehind } from "../functions/functions.mjs";

config();

const apiKey = process.env.J_QUANTS_API_KEY;

const client = axios.create({
  baseURL: "https://api.jquants.com",
  headers: { "x-api-key": apiKey },
});

// (jq*1) 
// num ⇨ 1 : last date, 2 : one day before data
const getTradingDayFromJQuants = async num => {
  try {
    const tradingCalendar = await client.get("/v2/markets/calendar", {
      params: {
        from: getDayBehind(15),
        to: getToday(),
      },
    });
    const tradingCalendarFiltered = tradingCalendar.data.data.filter(day => day.HolDiv == 1);
    const lastTradingDay = tradingCalendarFiltered[tradingCalendarFiltered.length - num].Date;
    const splittedLastTradingDay = lastTradingDay.split("-");
    const concattedSplittedLastTradingDay = splittedLastTradingDay.join("");
    return concattedSplittedLastTradingDay;
  } catch(e) {
    console.error("(jq*1) Error", e);
  };
};

// (jq*2)
const getMasterInfo = async (ticker, day) => {
  try {
    const result = await client.get('/v2/equities/master', {
      params: {
        code: ticker,
        date: day,
      },
    });
    return result.data.data[0];
  } catch(e) {
    console.error("(jq*2) Error", e);
  }
};

// (jq*3)
const getLastDailyInfo = async (ticker, day) => {
  try {
    const result = await client.get('/v2/equities/bars/daily', {
      params: {
        code: ticker,
        date: day,
      },
    });
    return result.data.data;
  } catch(e) {
    console.error("(jq*3) Error", e);
  }
};

// (jq*4)
const getHistoricalDailyInfo = async (ticker, toDay) => {
  try {
    const array = await client.get('/v2/equities/bars/daily', {
      params: {
        code: ticker,
        from: getDayBehind(60),
        to: toDay,
      },
    });
    return array.data.data;
  } catch(e) {
    console.error("(jq*4) Error", e);
  }
};

// (jq*5)
const calculateMA = async (ticker, toDay) => {

  let lastDayFlag = false;
  let oneDayBeforeFlag = false;

  const historicalDataArray = await getHistoricalDailyInfo(ticker, toDay);

  const lastCloseVal = historicalDataArray[historicalDataArray.length - 1].C;
  const last5data = historicalDataArray.slice(-5);
  const MA5 = last5data.reduce((accumulator, currentValue) => accumulator + currentValue.AdjC, 0) / 5;
  const last25data = historicalDataArray.slice(-25);
  const MA25 = last25data.reduce((accumulator, currentValue) => accumulator + currentValue.AdjC, 0) / 25;
  if(MA5 > MA25 && lastCloseVal >= MA5) // エントリー条件１：５日線が２５日線よりも上（２５日線を含まない) // エントリー条件２：株価の終値が５日線以上（５日線を含む）
    lastDayFlag = true;

  historicalDataArray.pop();
  const oneDayBeforeCloseVal = historicalDataArray[historicalDataArray.length - 1].C;
  const oneDayBefore5data = historicalDataArray.slice(-5);
  const oneDayBeforeMA5 =  oneDayBefore5data.reduce((accumulator, currentValue) => accumulator + currentValue.C, 0) / 5;
  const oneDayBefore25data = historicalDataArray.slice(-25);
  const oneDayBeforeMA25 =  oneDayBefore25data.reduce((accumulator, currentValue) => accumulator + currentValue.C, 0) /25;
  if(oneDayBeforeMA5 > oneDayBeforeMA25 && oneDayBeforeCloseVal >= oneDayBeforeMA5) // エントリー条件１：５日線が２５日線よりも上（２５日線を含まない) // エントリー条件２：株価の終値が５日線以上（５日線を含む）
    oneDayBeforeFlag = true;

  return !oneDayBeforeFlag && lastDayFlag;
};

export { 
  getTradingDayFromJQuants,
  getMasterInfo,
  getLastDailyInfo,
  getHistoricalDailyInfo,
  calculateMA
};