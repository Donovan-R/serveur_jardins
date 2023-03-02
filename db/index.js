const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: process.env.NODE_ENV === 'production' ? true : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
