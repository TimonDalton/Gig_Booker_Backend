// const express = require("express");
const { Pool } = require("pg");

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "test_db",
  password: "Granatabomb5",
  port: 5432,
};

// Connect with a connection pool.

const events_table_init_create_query =  `
CREATE TABLE IF NOT EXISTS "test_events_table" (

    id SERIAL,
    name VARCHAR(100) NOT NULL,
    startime  timestamp,
    final_payment INTEGER,

    location POINT,
    location_name varchar(200),
    description varchar(2000),

    status VARCHAR(100),
    organiser_id INTEGER,

    PRIMARY KEY ("id")
);`;

const organisers_table_init_create_query =  `
CREATE TABLE IF NOT EXISTS "test_organisers_table" (

    id SERIAL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    location POINT,
    location_name varchar(200),
    bio varchar(2000),

    PRIMARY KEY ("id")
);`;

const insert_str_events = `
  
    INSERT INTO test_events_table (name,startime,final_payment,location,location_name,description,status,organiser_id)
    VALUES ('skooda','2016-06-22 19:10:25-07',2500,'2.4,5.1','snooba','snooba place is da best snooka place','artist undecided',1) 
  ;
`;
const insert_str_organisers = `

  INSERT INTO test_organisers_table (name,password,location,location_name,bio)
  VALUES ('Johann SilverHand','JohannSilver12345','2.2,5.1','snooba', 'Ek is staal. Noem my staal skouer man.') 
;
`;
const read_all = `
  SELECT * FROM test_table;
`;

var pool = new Pool(credentials);

async function doQuery(query){
    let now = await pool.query(query);
    return now;
}
// async function doQueryWithClient(query,client){
//     let now = await pool.query(query);
//     return now;
//   }

async function initDB(){
    await doQuery(events_table_init_create_query);
    // await doQuery(insert_str_events);
    
    await doQuery(organisers_table_init_create_query);
    // await doQuery(insert_str_organisers);
    // let a = await doQuery(read_all);
    // console.log(a.rows);
        
    // const poolResult = await poolDemo();
    // console.log("Time with pool: " + poolResult.rows[0]["now"]);
  
    // const clientResult = await clientDemo();
    // console.log("Time with client: " + clientResult.rows[0]["now"]);
  
}

async function insert_dummy_data_to_DB() {
    await   doQuery(insert_str_organisers);
    await   doQuery(insert_str_events);
}
(async () => {
    initDB();

  })();

let a = doQuery(read_all);
console.log(a.rows);   

// const poolResult = await poolDemo();
// console.log("Time with pool: " + poolResult.rows[0]["now"]);

// const clientResult = await clientDemo();
// console.log("Time with client: " + clientResult.rows[0]["now"]);

var express = require('express')
var session = require('express-session')

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


