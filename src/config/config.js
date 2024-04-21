const path = require("path");
if (process.env.NODE_ENV == "Desarrollo") {
  require("dotenv").config({
    path: path.join(__dirname, "../envirome/devEnvirome.env"),
  });
} 
const port = process.env.PORT;
const portdb = process.env.DB_PORT;
const host = process.env.DB_HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATA_BASE;
// Parametros de conexion de db
const dialect = "mysql";
const pool = {
  max: 30,
  min: 0,
  acquire: 30000,
  idle: 10000,
};
module.exports = {
  host,
  user,
  password,
  database,
  dialect,
  pool,
  port,
  portdb,
};
