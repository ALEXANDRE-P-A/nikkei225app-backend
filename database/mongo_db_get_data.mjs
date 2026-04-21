/*
  (mgdb-g*1) getTradingDayFromDatabase
  (mgdb-g*2) getTickerCodesFromDatabase
  (mgdb-g*3) getSectorsFromDatabase
  (mgdb-g*4) getTickersFromDatabase
*/

import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";
import { 
  nikkei225_db_name, 
  nikkei225CollectionsObj,
  ticker_db_name,
  ticker_collection_name,
  ticker_doc_name,
  setSectorsToObj,
  setTradingDayToObj,
  setTickersToObj,
} from "../init/nikkei225_required_collections.mjs";

config();

const uri = process.env.MONGO_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

// (mgdb-g*1)
const getTradingDayFromDatabase = async _ => {
  try {
    await client.connect();
    const db = client.db(nikkei225_db_name);
    const col = await db.collection(nikkei225CollectionsObj[1].name);
    const doc = await col.findOne({ name: nikkei225CollectionsObj[1].doc.name });
    console.log("got trading day from database");
    await setTradingDayToObj(doc.value);
    return doc.value;
  } catch(e) {
    console.log("(mgdb-g*1) Error", e);
    await client.close();
  };
};

// (mgdb-g*2)
const getTickerCodesFromDatabase = async _ => {
  try {
    await client.connect();
    const db = client.db(ticker_db_name);
    const col = await db.collection(ticker_collection_name);
    const doc = await col.findOne({ name: ticker_doc_name });
    return doc.value;
  } catch(e) {
    console.log("(mgdb-g*2) Error", e);
    await client.close();
  };
};

// (mgdb-g*3)
const getSectorsFromDatabase = async _ => {
  try {
    await client.connect();
    const db = client.db(nikkei225_db_name);
    const col = await db.collection(nikkei225CollectionsObj[2].name);
    const doc1 = await col.findOne({ name: nikkei225CollectionsObj[2].doc1.name });
    const doc2 = await col.findOne({ name: nikkei225CollectionsObj[2].doc2.name });
    await setSectorsToObj(doc1.value, doc2.value)
  } catch(e) {
    console.log("(mgdb-g*3) Error", e);
    await client.close();
  };
};

// (mgdb-g*4)
const getTickersFromDatabase = async _ => {
   try {
    await client.connect();
    const db = client.db(nikkei225_db_name);
    const col = await db.collection(nikkei225CollectionsObj[3].name);
    const doc = await col.findOne({ name: nikkei225CollectionsObj[3].doc.name });
    await setTickersToObj(doc.value);
  } catch(e) {
    console.log("(mgdb-g*4) Error", e);
    await client.close();
  };
};

export { 
  getTradingDayFromDatabase,
  getTickerCodesFromDatabase,
  getSectorsFromDatabase,
  getTickersFromDatabase  
};