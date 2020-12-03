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
  return pool.query(`DROP TABLE IF EXISTS posts`);
}

function createTables() {
  return pool.query(
    `CREATE TABLE posts (
  post_id SMALLSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  header_image_url TEXT,
  blog_type VARCHAR(20) NOT NULL,
  content JSON NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL,
  user_id INTEGER REFERENCES users
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
