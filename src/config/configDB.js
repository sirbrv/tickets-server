const dbConfig = require("./config");
const { Sequelize, DataTypes } = require("sequelize");

let DB_DATABASE = dbConfig.database;
let DB_USER = dbConfig.user;
let DB_PASSWORD = dbConfig.password;
let DB_HOST = dbConfig.host;
let DB_PORT = dbConfig.portdb;
// console.log("bd-puerto...", DB_PORT);
// console.log(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, dbConfig.port);

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: dbConfig.dialect,
  port: DB_PORT,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado a la Base de Datos MqSql.");
  })
  .catch((err) => {
    console.log("Error de Conexión a la BD.." + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.config = require("../models/mysql/config.js")(sequelize, DataTypes);
db.users = require("../models/mysql/users.js")(sequelize, DataTypes);
db.contacts = require("../models/mysql/contacts.js")(sequelize, DataTypes);
db.academys = require("../models/mysql/academys")(sequelize, DataTypes);
db.events = require("../models/mysql/events")(sequelize, DataTypes);
db.students = require("../models/mysql/students.js")(sequelize, DataTypes);
db.studentHistory = require("../models/mysql/studentHistory.js")(
  sequelize,
  DataTypes
);
db.tickets = require("../models/mysql/tickets.js")(sequelize, DataTypes);
db.ventaTickets = require("../models/mysql/ventaTickets")(sequelize, DataTypes);
db.sequelize.sync({ force: false }).then(() => {
  console.log("Inicialización del proyecto terminado correctamente!");
});

module.exports = db;
