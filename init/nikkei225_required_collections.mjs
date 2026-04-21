const nikkei225_db_name = "nikkei225_app";

const ticker_db_name = "tickers_db";
const ticker_collection_name = "tickers";
const ticker_doc_name = "nikkei225";

const nikkei225CollectionsObj = [
  { // [0]
    name: "access-history",
    doc: {
      date: "",
      ip: ""
    }
  },
  { // [1]
    name: "trading-day",
    doc: {
      name: "trading_day",
      value: "",
      updatedAt: new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })
    }
  },
  { // [2]
    name: "sectors",
    doc1: {
      name: "s17",
      value: "",
      updatedAt: new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })
    },
    doc2: {
      name: "s33",
      value: "",
      updatedAt: new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })
    }
  },
  { // [3]
    name: "tickers",
    doc: {
      name: "nikkei225",
      value: "",
      updatedAt: new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })
    }
  }
];

const setTradingDayToObj = async string => {
  nikkei225CollectionsObj[1].doc.value = string;
  console.log("trading day is set")
};

const setSectorsToObj = async (s17Array, s33Array) => {
  nikkei225CollectionsObj[2].doc1.value = s17Array;
  nikkei225CollectionsObj[2].doc2.value = s33Array;
  console.log("sector s17 and s33 is set")
};

const setTickersToObj = async array => {
  nikkei225CollectionsObj[3].doc.value = array;
  console.log("tickers is set")
};

const getTradingDay = _ => nikkei225CollectionsObj[1].doc.value;
const getS17 = _ => nikkei225CollectionsObj[2].doc1.value;
const getS33 = _ => nikkei225CollectionsObj[2].doc2.value;
const getTickers = _ => nikkei225CollectionsObj[3].doc.value;

export {
  nikkei225_db_name,
  ticker_db_name,
  ticker_collection_name,
  ticker_doc_name,
  nikkei225CollectionsObj,
  setTradingDayToObj,
  setSectorsToObj,
  setTickersToObj,
  getTradingDay,
  getS17,
  getS33,
  getTickers
};