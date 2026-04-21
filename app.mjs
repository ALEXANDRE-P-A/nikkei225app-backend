import ip from "ip";
import express from "express";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import { 
  mainProcess,
  getIsLoadingFlag,
  getLoadingStatus,
  getCompletedPercentage
} from "./main/main_process.mjs";

import { 
  getTradingDay,
  getS17,
  getS33,
  getTickers
} from "./init/nikkei225_required_collections.mjs";

// mainProcess();

const PORT  = 3000;

const app = express();
app.use(cors()); // Enables CORS for all routes and origins
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ "msg": "Nikkei225 App API" });
});

app.get("/trading_day", (req, res) => {
  if(getIsLoadingFlag())
    res.json({ "loading": getLoadingStatus(), "completed": getCompletedPercentage() });
  else
    res.json({ "date": getTradingDay() });
});

app.get("/s17", (req, res) => {
  if(getIsLoadingFlag())
    res.json({ "loading": getLoadingStatus(), "completed": getCompletedPercentage() });
  else
    res.json({ "s17": getS17() });
});

app.get("/s33", (req, res) => {
  if(getIsLoadingFlag())
    res.json({ "loading": getLoadingStatus(), "completed": getCompletedPercentage() });
  else
    res.json({ "s33": getS33() });
});

app.get("/tickers", (req, res) => {
  if(getIsLoadingFlag())
    res.json({ "loading": getLoadingStatus(), "completed": getCompletedPercentage() });
  else
    res.json({ "tickers": getTickers() });
});

app.listen(PORT, _ => {
  console.log(`App listening at port ${ip.address()}:${PORT}`);
});