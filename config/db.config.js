module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "Qaz741@852",
  DB: "arbitrage_db",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};