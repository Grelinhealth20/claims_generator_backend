/**
 * Establishes the connection between our mysql database and sequelize.
 * Synchronises the database with our model by invoking the necessary model.
 * Establishes the Associations among tables.
 */

const dbConfig = require("../config/config.js");
const logger = require("../config/loggerApi.js");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.port,
  dialect: "postgres",
  logging: process.env.NODE_ENV === "production" ? false : console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    schema: process.env.DB_SCHEMA, // 👈 REQUIRED
  },
  pool: dbConfig.pool,
});
sequelize
  .authenticate()
  .then(() => {
    console.log("connected to database..");
    logger.info("Data base connection sucessfull");
  })
  .catch((err) => {
    // console.log("Error" + err);
    logger.error("Data base connection error:", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.ClaimsSubmission = require("./claimsSubmissionModal.js")(sequelize, DataTypes);


db.sequelize
  .sync()
  //  .sync({ force: true })
  //  .sync({ alter: true })
  .then(() => {
     console.log("yes re-sync done!");
    logger.info("re-sync done Sucessfully.");
  })
  .catch((err) => {
    logger.error("re-sync:", err);
  });

module.exports = { db, sequelize };
