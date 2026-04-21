/*
  (mgdb-u*1) checkDatabase
  (mgdb-u*2) dropExistingDatabase
  (mgdb-u*3) createDatabase
  (mgdb-u*4) createCollections
  (mgdb-u*5) createDocuments
*/

import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";
import { 
  nikkei225_db_name, 
  nikkei225CollectionsObj 
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

// (mgdb-u*5)
const createDocuments = async _ => {
  console.log("(*5) creating required documents . . .");
  try {
    await client.connect();
    const db = client.db(nikkei225_db_name);
    for(let i = 0;i < nikkei225CollectionsObj.length;i++){
      const collection = db.collection(nikkei225CollectionsObj[i].name);
      for(let j = 1;j < Object.values(nikkei225CollectionsObj[i]).length;j++){
        console.log(Object.values(nikkei225CollectionsObj[i])[j], j);
        await collection.insertOne(Object.values(nikkei225CollectionsObj[i])[j]);
      }
      console.log(`documents inserted in collection ${nikkei225CollectionsObj[i].name}`);
    }
  } catch(e) {
    console.error("(mgdb-u*5) Error", e);
  };
};

// (mgdb-u*4)
const createCollections = async _ => {
  console.log("(*3) creating required collections . . .");
  try {
    // MongoDBに接続
    await client.connect();
    const db = client.db(nikkei225_db_name);
    // Get an array of collection info objects { name: '...', type: '...', ... }
    const collections = await db.listCollections().toArray();
    // To get just the names as an array of strings
    const collectionNames = collections.map(col => col.name);
    // コレクションを作成
    for(let i = 0;i < nikkei225CollectionsObj.length;i++){
      if(!collectionNames.includes(nikkei225CollectionsObj[i].name)){
        await await db.createCollection(nikkei225CollectionsObj[i].name);
        console.log(`(*3) ${nikkei225CollectionsObj[i].name} collection created in database ${nikkei225_db_name}`);
      }
    }
    await createDocuments(); // (mgdb-u*5)
  } catch(e) {
    console.error("(mgdb-u*4) Error", e);
  };
};

// (mgdb-u*3)
const createDatabase = async _ => {
  console.log(`(mgdb-u*3) creating database ${nikkei225_db_name} . . .`);
  try {
    // MongoDBに接続
    await client.connect();
    const db = client.db(nikkei225_db_name);
    console.log(`database ${nikkei225_db_name} was created successfully`);
    await createCollections(); // (mgdb-u*4)
  } catch (e) {
    console.error("(mgdb-u*3) Error", e);
  };
};

// (mgdb-u*2)
const dropExistingDatabase = async _ => {
  console.log(`(mgdb-u*2) dropping database ${nikkei225_db_name}`);
  try {
    await client.connect();
    // 削除対象のデータベースを取得
    const db = client.db(nikkei225_db_name);
     // データベースを削除
    const result = await db.dropDatabase();
    console.log("Database dropped:", result); // 成功した場合はtrue
  } catch(e) {
    console.error("(mgdb-u*2) Error", e);
  };
};

// (mgdb-u*1)
const checkDatabaseExists = async _ => {
  console.log("(mgdb-u*1) checking if database exists . . .");
  try {
    await client.connect();
    // adminコマンドを使ってすべてのデータベースリストを取得
    const dbList = await client.db().admin().listDatabases();
     // データベース名の配列を作成して存在を確認
    const exists = dbList.databases.some(db => db.name === nikkei225_db_name);
    if(exists)
      return true;
    else
      return false;
  
  } catch(e) {
    console.error("(mgdb-u*1) Error", e);
  };
}

export { 
  checkDatabaseExists,
  createDatabase,
  dropExistingDatabase
};