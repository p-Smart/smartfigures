const sql = require('mysql2/promise')

const pool = sql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  port: '3306',
  database: process.env.DB_NAME,
  connectionLimit: 20,
})

const sqlQuery = async (sql, params=[]) => {
  try{
  var conn = await pool.getConnection()
  const result = await conn.query(sql, params)
  return result
  }
  catch(err){ console.log(err.message) }
  finally{
    await conn.release()
  }
}


module.exports = {
  pool: pool,
  sqlQuery: sqlQuery,
}