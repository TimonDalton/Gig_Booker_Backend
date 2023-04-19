var express = require('express')
var session = require('express-session');
const {initDB,dbClientPool} = require("./src/configs/db.config");
const {apply_routes} = require("./src/routes/routes");
const {fileDirInit} = require("./src/configs/file.storage");
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const RedisStore = require('connect-redis').default;
const {initRedisClient,getClient} = require('./src/configs/redis');
const {createClient} = require('redis');

// import { initDB } from './src/configs/db.config.js';

// const express = require("express");
const { Pool } = require("pg");

redisClient = createClient();
(async () => {
    await initDB();
    await initRedisClient(redisClient);

  })();


// console.log(RedisStore);
var app = express()

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

app.use(session({
  store: redisStore,
  secret: 'skroodado54321',
  resave: false,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use(fileUpload());
fileDirInit();

apply_routes(app)

let port = 3000
app.listen(port)
console.log(`Listening on port `+port.toString())


