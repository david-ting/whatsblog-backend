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
  return pool.query(`DROP TABLE IF EXISTS comments`);
}

function createTables() {
  return pool.query(
    `CREATE TABLE comments (
  comment_id SMALLSERIAL PRIMARY KEY,
  commenter_id INTEGER REFERENCES users(user_id) NOT NULL,
  post_id INTEGER REFERENCES posts NOT NULL,
  reply_to INTEGER, 
  content JSON NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  reply_counts INTEGER DEFAULT 0
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
