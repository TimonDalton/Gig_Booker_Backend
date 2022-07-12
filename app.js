var express = require('express')
var session = require('express-session');
const {initDB,doQuery} = require("./src/configs/db.config");
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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.get('/',function(req,res,next){
    res.send(`
        <p>Home page</p>
    `);
});

app.get('/api/events',async function(req,res,next){
    res.contentType('application/json');
    let data = await doQuery('SELECT * FROM test_events_table');
    console.log(`data rows:`);
    console.log(data.rows);

    let respJson = JSON.stringify(data.rows)
    res.send(respJson);
});
app.post('/api/events',function(req,res,next){
    let data = req.body
    console.log(`api/events post request body:`);
    console.log(data);
    res.send(data);
});

let port = 3000
app.listen(port)
console.log(`Listening on port `+port.toString())


