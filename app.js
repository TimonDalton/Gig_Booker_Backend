var express = require('express')
var session = require('express-session');
const {initDB,dbClientPool} = require("./src/configs/db.config");
const {apply_routes} = require("./src/routes/routes");
const {fileDirInit} = require("./src/configs/file.storage");
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const {initRedisClient} = require('./src/configs/redis');

// import { initDB } from './src/configs/db.config.js';

// const express = require("express");
const { Pool } = require("pg");

(async () => {
    initDB();

  // let a = doQuery(read_all);
  // console.log(a.rows);   
  })();


// const poolResult = await poolDemo();
// console.log("Time with pool: " + poolResult.rows[0]["now"]);

// const clientResult = await clientDemo();
// console.log("Time with client: " + clientResult.rows[0]["now"]);
var app = express()

app.use(session({
  secret: 'skroodado54321',
  resave: false,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use(fileUpload());
fileDirInit();
initRedisClient();

apply_routes(app)

let port = 3000
app.listen(port)
console.log(`Listening on port `+port.toString())


