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
    VALUES ('Loftus Park Jam','2016-06-22 19:10:25-07',2500,'2.4,5.1','Loftus park','Kom speel kitaar. Ons kort kitaar. Soos in ons het n kort kitaar. ','artist undecided',1) 
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

    await doQuery(insert_str_events);

    await doQuery(insert_str_organisers);
    // await doQuery(insert_str_organisers);
    // let a = await doQuery(read_all);
    // console.log(a.rows);
        
    // const poolResult = await poolDemo();
    // console.log("Time with pool: " + poolResult.rows[0]["now"]);
  
    // const clientResult = await clientDemo();
    // console.log("Time with client: " + clientResult.rows[0]["now"]);
  
}

module.exports = {
  initDB:initDB,
  doQuery:doQuery,
}