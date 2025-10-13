import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: String(process.env.PGPASSWORD),
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT) || 5432
});


export default pool;

