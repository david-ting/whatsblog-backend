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
  return pool.query(`DROP TABLE IF EXISTS likes_dislikes`);
}

function createTables() {
  return pool.query(
    `CREATE TABLE likes_dislikes (
  likes_dislikes_id SMALLSERIAL PRIMARY KEY,
  is_like BOOLEAN NOT NULL,
  user_id INTEGER REFERENCES users NOT NULL,
  post_id INTEGER REFERENCES posts NOT NULL,
  created_at TIMESTAMPTZ NOT NULL),
  UNIQUE (user_id, post_id)`
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
