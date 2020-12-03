import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const DB_CONNECTION = process.env.DB_CONNECTION;

const pool = new Pool({
  connectionString: DB_CONNECTION,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

function dropTables() {
  return pool.query(`DROP TABLE IF EXISTS users`);
}

function createTables() {
  return pool.query(
    `CREATE TABLE users (
  user_id SMALLSERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  profile_url TEXT,
  password TEXT NOT NULL
)`
  );
}

(async () => {
  try {
    await dropTables();
    console.log("tables dropped");
    await createTables();
    console.log("tables created");
  } catch (err) {
    console.log(err.message);
  }
})();

//check the connection
// pool
//   .connect()
//   .then((client) => {
//     console.log("pool created");
//     client.release();
//   })
//   .catch((error) => {
//     console.log(error);
//   });
