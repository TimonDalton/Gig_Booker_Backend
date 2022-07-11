const { Pool, Client } = require("pg");

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "test_db",
  password: "Granatabomb5",
  port: 5432,
};

// Connect with a connection pool.

const organisers_table_init_create_query =  `
CREATE TABLE IF NOT EXISTS "test_table" (
  "id" SERIAL,
  "name" VARCHAR(100) NOT NULL,
  "role" VARCHAR(15) NOT NULL,
  PRIMARY KEY ("id")
);`;
const insert = `
  INSERT INTO test_table (name,role)
  VALUES ('skooda','snooba');
`;
const read_all = `
  SELECT * FROM test_table;
`;
const pool = new Pool(credentials);

async function poolDemo() {
  const now = await pool.query("SELECT * FROM Organisers");
  
  return now;
}

// Connect with a client.

async function clientDemo() {
  const client = new Client(credentials);
  await client.connect();
  const now = await client.query("SELECT * FROM Organisers");
  await client.end();

  return now;
}

async function doQuery(query){  
  let now = await pool.query(query);
  return now;
}

async function initDB(){
  await doQuery(organisers_table_init_create_query);
}

// Use a self-calling function so we can use async / await.

(async () => {
  initDB();
  await doQuery(insert);
  let a = await doQuery(read_all);
  console.log(a.rows);
  
  
  
  // const poolResult = await poolDemo();
  // console.log("Time with pool: " + poolResult.rows[0]["now"]);

  // const clientResult = await clientDemo();
  // console.log("Time with client: " + clientResult.rows[0]["now"]);

  await pool.end();

})();