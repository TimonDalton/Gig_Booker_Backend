const { Pool } = require("pg");

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "test_db",
  password: "admin",
  //use this command to change password: ALTER USER postgres WITH PASSWORD 'admin54312';
  port: 5432,
};

const eventTableName = "test_events_table";//This table will hold the information of all events
const organiserTableName = "test_organisers_table";//This table will hold the information of all organiser users
const contractorTableName = "test_contractor_table";
const chatTableName = "test_chats_table"; //This holds a list of contacts that user is chatting with
const messageTableName = "test_messages_table";//This holds the messages that are exchanged between two contacts

// Connect with a connection pool.


const organisers_table_init_create_query =  `
CREATE TABLE IF NOT EXISTS "${organiserTableName}" (

    organiser_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    location POINT,
    location_name varchar(200),
    bio varchar(2000),

    PRIMARY KEY ("organiser_id")
);`;

const contractor_table_init_create_query =  `
CREATE TABLE IF NOT EXISTS "${contractorTableName}" (

    contractor_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    location POINT,
    location_name varchar(200),
    bio varchar(2000),

    PRIMARY KEY ("contractor_id")
);`;


const events_table_init_create_query =  `
CREATE TABLE IF NOT EXISTS "${eventTableName}" (

    event_id INT GENERATED ALWAYS AS IDENTITY,
    organiser_id INTEGER,
    name VARCHAR(100) NOT NULL,
    starttime  timestamp,
    final_payment NUMERIC(8,2),

    location POINT,
    location_name VARCHAR(200),
    description VARCHAR(2000),

    status VARCHAR(100),

    PRIMARY KEY ("event_id"),
    CONSTRAINT organiser_fk
      FOREIGN KEY("organiser_id") 
	      REFERENCES ${organiserTableName}("organiser_id")
        ON DELETE CASCADE
);`;

const chat_table_init_create_query =  `
CREATE TABLE IF NOT EXISTS "${chatTableName}" (

    PRIMARY KEY ("chat_id"),
    chat_id INT GENERATED ALWAYS AS IDENTITY,
    organiser_id INTEGER,
    name VARCHAR(100) NOT NULL`+
    // ,CONSTRAINT organiser_fk
    //   FOREIGN KEY("organiser_id") 
	  //     REFERENCES ${organiserTableName}("organiser_id")
    //     ON DELETE CASCADE
`);`;

const message_table_init_create_query =  `
CREATE TABLE IF NOT EXISTS "${messageTableName}" (

    message_id INT GENERATED ALWAYS AS IDENTITY,
    chat_id INT,
    organiser_id INTEGER NOT NULL,
    message VARCHAR(2000) NOT NULL,
    time_sent timestamp,
    user_sent BOOLEAN NOT NULL,

    PRIMARY KEY ("message_id"),
    CONSTRAINT chat_fk
      FOREIGN KEY("chat_id") 
	      REFERENCES ${chatTableName}("chat_id")
        ON DELETE CASCADE
);`;
//the on delete cascade means that if parent table entry is deleted then all child table entries will be deleted.
//So if chat is deleted then all messages will also be deleted
//DO NOTE: If parent table already exists this command will not work. So then parent table must be deleted to create child table


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
  try{
    let now = await pool.query(query);
    return now;
  }catch(e){
    console.log("Tried: ");
    console.log(query);
    console.log("Got: ");
    console.log(e);
  }
}

async function initDB(){
    await doQuery(events_table_init_create_query);
    
    await doQuery(organisers_table_init_create_query);

    await doQuery(contractor_table_init_create_query);

    await doQuery(chat_table_init_create_query);

    await doQuery(message_table_init_create_query);
  
}
const tableNames = {
  eventTable:eventTableName,
  orgTable:organiserTableName,
  contTable:contractorTableName,
  chatTable:chatTableName,
  messageTable:messageTableName,
}
module.exports = {
  initDB:initDB,
  dbClientPool:pool,
  doQuery:doQuery,
  tableNames:tableNames,
}