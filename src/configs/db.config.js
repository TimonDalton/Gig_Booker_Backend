const { Pool } = require("pg");

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "test_db",
  password: "admin",
  //use this command to change password: ALTER USER postgres WITH PASSWORD 'admin54312';
  port: 5432,
};

const eventTableName = "test_events_table";
const organiserTableName = "test_organisers_table";
const performerTableName = "";

// Connect with a connection pool.

const events_table_init_create_query =  `
CREATE TABLE IF NOT EXISTS "${eventTableName}" (

    id SERIAL NOT NULL,
    organiser_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    startime  timestamp,
    final_payment NUMERIC(8,2),

    location POINT,
    location_name VARCHAR(200),
    description VARCHAR(2000),

    status VARCHAR(100),

    PRIMARY KEY ("id")
);`;

const organisers_table_init_create_query =  `
CREATE TABLE IF NOT EXISTS "${organiserTableName}" (

    id SERIAL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    location POINT,
    location_name varchar(200),
    bio varchar(2000),

    PRIMARY KEY ("id")
);`;

const insert_str_events = `
    INSERT INTO "${eventTableName}" (name,startime,final_payment,location,location_name,description,status,organiser_id)
    VALUES ('Loftus Park Jam','2016-06-22 19:10:25-07',2500,'2.4,5.1','Loftus park','Kom speel kitaar. Ons kort kitaar. Soos in ons het n kort kitaar. ','artist undecided',1) 
  ;
`;
const insert_str_organisers = `
  INSERT INTO ${organiserTableName} (name,password,location,location_name,bio)
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

    // await doQuery(insert_str_events);

    // await doQuery(insert_str_organisers);
    // await doQuery(insert_str_organisers);
    // let a = await doQuery(read_all);
    // console.log(a.rows);
        
    // const poolResult = await poolDemo();
    // console.log("Time with pool: " + poolResult.rows[0]["now"]);
  
    // const clientResult = await clientDemo();
    // console.log("Time with client: " + clientResult.rows[0]["now"]);
  
}
const tableNames = {
  eventTable:eventTableName,
  orgTable:organiserTableName,
}
module.exports = {
  initDB:initDB,
  dbClientPool:pool,
  doQuery:doQuery,
  tableNames:tableNames,
}