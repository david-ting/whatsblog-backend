import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const DB_CONNECTION = process.env.DB_CONNECTION;

export const escapedStr = (str: string) => {
  return str.replace(/'/g, "''");
};

export const pool = new Pool({
  connectionString: DB_CONNECTION,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
