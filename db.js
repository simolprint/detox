const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});



// Создание таблицы комнат при первом запуске сервера
db.run(
  "CREATE TABLE IF NOT EXISTS beds (id INTEGER PRIMARY KEY AUTOINCREMENT, roomNumber TEXT, roomType TEXT, roomGender TEXT, bedNumber TEXT, bedStatus TEXT)",
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Table 'beds' has been created.");
    }
  }
);


db.run(
  "CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, gender TEXT, bedNumber TEXT, currentDate TEXT, hospitalDate TEXT, dischargeDate TEXT, patientStatus TEXT, program TEXT)",
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Table 'patients' has been created.");
    }
  }
);


db.run(
  "CREATE TABLE IF NOT EXISTS procedurerooms (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start_time TEXT, end_time TEXT, capacity INTEGER, time_per_patient INTEGER, progender TEXT, dostupno TEXT)",
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Table 'procedurerooms' has been created.");
    }
  }
);


db.run(
  "CREATE TABLE IF NOT EXISTS procedures (id INTEGER PRIMARY KEY AUTOINCREMENT, procedure_pacient TEXT, procedure_name TEXT, procedure_time TEXT, is_busy INTEGER DEFAULT 0)",
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Table 'procedures' has been created.");
    }
  }
);


db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT)",
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Table 'users' has been created.");
    }
  }
);





module.exports = db;
