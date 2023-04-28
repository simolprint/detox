const express = require("express");
const db = require("./db");


const router = express.Router();

router.post("/patients", (req, res) => {
  const {
    name,
    phone,
    gender,
    bedNumber,
    currentDate,
    hospitalDate,
    dischargeDate,
    patientStatus,
  } = req.body;
  const sql =
    "INSERT INTO patients(name, phone, gender, bedNumber,  currentDate, hospitalDate, dischargeDate, patientStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(
    sql,
    [
      name,
      phone,
      gender,
      bedNumber,
      currentDate,
      hospitalDate,
      dischargeDate,
      patientStatus,
    ],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Не удалось добавить пациента" });
      }
      res.json({ message: "Пациент успешно добавлен" });
    }
  );
});



router.get("/patients", (req, res) => {
  const sql = "SELECT * FROM patients";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось получить список пациентов" });
    }
    res.json(rows);
  });
});

// Обработчик удаления пациента

router.delete("/patients/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM patients WHERE id = ?";
  db.run(sql, id, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Не удалось удалить Пациента" });
    }
    res.json({ message: "ПациенТ успешно удален" });
  });
});



router.patch("/patients/:id/status", (req, res) => {
  const id = req.params.id;
  const newStatus = req.body.status;

  const sql = "UPDATE patients SET patientStatus = ? WHERE id = ?";
  db.run(sql, [newStatus, id], (err) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось изменить статус пациента" });
    }
    res.json({ message: "Статус пациента успешно изменен" });
  });
});


// Обработчик выписки пациента


router.patch("/patients/:id/status", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE patients SET patientStatus = ? WHERE id = ?";

  db.get(`SELECT patientStatus FROM patients WHERE id = ${id}`, (err, row) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось получить информацию о койке" });
    }

    const newStatus =
      row.patientStatus === "Бронь"
        ? "Лежит"
        : row.patientStatus === "Лежит"
        ? "Выписан"
        : "";

    db.run(sql, [newStatus, id], (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: "Не удалось изменить статус койки" });
      }

      res.json({ message: "Статус койки успешно изменен" });
    });
  });
});


router.patch("/patients/:id/info", (req, res) => {
  const id = req.params.id;
  const {
    name,
    phone,
    gender,
    bedNumber,
    currentDate,
    hospitalDate,
    dischargeDate,
    patientStatus,
  } = req.body;

  const sql =
    "UPDATE patients SET name = ?, phone = ?, gender = ?, bedNumber = ?, currentDate = ?, hospitalDate = ?, dischargeDate = ?, patientStatus = ? WHERE id = ?";

  db.run(
    sql,
    [
      name,
      phone,
      gender,
      bedNumber,
      currentDate,
      hospitalDate,
      dischargeDate,
      patientStatus,
      id,
    ],
    (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: "Не удалось изменить информацию о пациенте" });
      }
      res.json({ message: "Информация о пациенте успешно изменена" });
    }
  );
});


module.exports = router;


const express = require("express");
const db = require("./db");
const morgan = require("morgan");

const router = express.Router();

router.use(morgan("combined"));

router.post("/patients", (req, res) => {
  const {
    name,
    phone,
    gender,
    bedNumber,
    currentDate,
    hospitalDate,
    dischargeDate,
    patientStatus,
  } = req.body;

  const sql =
    "INSERT INTO patients(name, phone, gender, bedNumber,  currentDate, hospitalDate, dischargeDate, patientStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  db.run(
    sql,
    [
      name,
      phone,
      gender,
      bedNumber,
      currentDate,
      hospitalDate,
      dischargeDate,
      patientStatus,
    ],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Не удалось добавить пациента" });
      }
      res.json({ message: "Пациент успешно добавлен" });
    }
  );
});

router.get("/patients", (req, res) => {
  const sql = "SELECT * FROM patients";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось получить список пациентов" });
    }
    res.json(rows);
  });
});

router.delete("/patients/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM patients WHERE id = ?";

  db.run(sql, id, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Не удалось удалить Пациента" });
    }
    res.json({ message: "Пациент успешно удален" });
  });
});

router.patch("/patients/:id/status", (req, res) => {
  const id = req.params.id;
  const newStatus = req.body.status;

  const sql = "UPDATE patients SET patientStatus = ? WHERE id = ?";

  db.run(sql, [newStatus, id], (err) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось изменить статус пациента" });
    }
    res.json({ message: "Статус пациента успешно изменен" });
  });
});

router.patch("/patients/:id/info", (req, res) => {
  const id = req.params.id;
  const {
    name,
    phone,
    gender,
    bedNumber,
    currentDate,
    hospitalDate,
    dischargeDate,
    patientStatus,
  } = req.body;

  const sql =
    "UPDATE patients SET name = ?, phone = ?, gender = ?, bedNumber = ?, currentDate = ?, hospitalDate = ?, dischargeDate = ?, patientStatus = ? WHERE id = ?";

  db.run(
    sql,
    [
      name,
      phone,
      gender,
      bedNumber,
      currentDate,
      hospitalDate,
      dischargeDate,
      patientStatus,
      id,
    ],
    (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: "Не удалось изменить информацию о пациенте" });
      }
      res.json({ message: "Информация о пациенте успешно изменена" });
    }
  );
});

module.exports = router;
