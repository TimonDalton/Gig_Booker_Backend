var express = require('express')
var session = require('express-session');
var bodyParser = require('body-parser')
const {initDB,doQuery} = require("./src/configs/db.config");

const  {EventOrganiser} = require('./src/models/eventOrganiser_class');
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
var jsonParser = bodyParser.json()

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

app.get('/api/getEvent',jsonParser,async function(req,res,next){
    res.contentType('application/json');
    let data = await doQuery('SELECT * FROM test_events_table');
    console.log(`data rows:`);
    console.log(data.rows);

    let respJson = JSON.stringify(data.rows)
    res.send(respJson);
});

app.post('/api/createEvent',function(req,res,next){
    let data = req.body;

    console.log(`api/createEvent post request body:`);
    console.log(data);
    res.send(data);
});

app.post('/api/login',jsonParser,async function(req,res,next){
    let orgLogin = new EventOrganiser();
    orgLogin.createFromJSON(req.body);
    
    // id SERIAL,
    // name VARCHAR(100) NOT NULL,
    // password VARCHAR(100) NOT NULL,
    let user_read = {}
    try{
        user_read = await doQuery(`SELECT name,password FROM test_organisers_table WHERE name = '${orgLogin.name}'`);
        console.log(`DB res: `);
        console.log(user_read);
    }catch(e){
        console.log("db read error: ");
        console.log(e);
    }
    console.log(`api/login post request body:`);
    // console.log(req.body);
    if (user_read.rowCount == 0){
        console.log("a---------------");
        res.status(403).json({"message":"No account exists"});
    }else{
        if (user_read.rows[0]["password"] == orgLogin.password){
            console.log("b---------------");
            res.status(200).json({"message":"Logged in Successfully"});
        }else{
            console.log("c---------------");
            res.status(403).json({"message":"Wrong account details"});
        }
    }
});
app.post('/api/signup',jsonParser,async function(req,res,next){
    console.log("--------------");
    let data = req.body
    let postdata = new EventOrganiser();
    postdata.createFromJSON(req.body);
    let q = `SELECT name FROM test_organisers_table WHERE name ='${postdata.name}';`;
    console.log(q);
    let selectRes;
    try{
        selectRes = await doQuery(q);
    }catch(e){
        console.log(`Error with await db select signup post`);console.log(e);
        res.status(403).json({"message":"Bad data"});
        return;
    }
    if (selectRes.rowCount != 0){
        console.log("In /api/signup, account already exists.");
        res.status(403).json({"message":"Username already in use"});
    }else{
        q = `INSERT INTO test_organisers_table (name,password) VALUES ('${postdata.name}','${postdata.password}');`;
        console.log(q);
        try{
            await doQuery(q);
        }catch(e){
            console.log(`Error with await db insert signup post`);console.log(e);
            res.status(403).json({"message":"Bad data"});
            return;
        }
        console.log(`api/signup post request body inserted:`);
        console.log(postdata);
        res.status(200).json({"message":"Account Created"});
    }
});


app.use(jsonParser,function(req,res){
    console.log(`${req.method} request @${req.url} not found`);
    console.log()
    // console.log(req);
    res.sendStatus(404).body("Page not found -_-");
});

let port = 3000
app.listen(port)
console.log(`Listening on port `+port.toString())


