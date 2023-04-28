const express = require("express");
const db = require("./db");

const router = express.Router();


router.post("/procedures", async (req, res) => {
  const {
    procedure_name,
    start_time,
    end_time,
    capacity,
    time_per_patient,
    progender,
    dostupno,
  } = req.body;

  // Проверка входных параметров
  if (
    !procedure_name ||
    !start_time ||
    !end_time ||
    !capacity ||
    !time_per_patient ||
    !progender ||
    !dostupno
  ) {
    return res
      .status(400)
      .json({ error: "Не указаны все необходимые параметры" });
  }

  // Получение списка кабинетов для данной процедуры
  const cabinets = await db.all(
    "SELECT id FROM cabinets WHERE procedure_name = ?",
    [procedure_name]
  );

  // Создание временных окошек для каждого кабинета
  const interval = time_per_patient * 60 * 1000; // интервал между пациентами в миллисекундах
  const num_windows = Math.floor((end_time - start_time) / interval); // количество временных окошек, которое можно создать
  const windows = []; // массив для хранения временных окошек

  for (let i = 0; i < cabinets.length; i++) {
    for (let j = 0; j < num_windows; j++) {
      const start = start_time + j * interval;
      const end = start + interval;

      windows.push({
        cabinet_id: cabinets[i].id,
        procedure_name,
        procedure_time: `${new Date(start).toISOString()}/${new Date(
          end
        ).toISOString()}`,
        is_busy: 0,
        progender,
        dostupno,
      });
    }
  }

  // Вставка временных окошек в таблицу procedures
  const sql =
    "INSERT INTO procedures (cabinet_id, procedure_name, procedure_time, is_busy, progender, dostupno) VALUES (?, ?, ?, ?, ?, ?)";

  db.run("BEGIN TRANSACTION");

  for (let i = 0; i < windows.length; i++) {
    const window = windows[i];
    db.run(sql, [
      window.cabinet_id,
      window.procedure_name,
      window.procedure_time,
      window.is_busy,
      window.progender,
      window.dostupno,
    ]);
  }

  db.run("COMMIT", (err) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось создать временные окошки" });
    }

    res.json({ message: "Временные окошки успешно созданы" });
  });
});


// Обработчик для получения списка процедурных кабинетов
router.post("/procedurerooms", (req, res) => {
  const {
    name,
    start_time,
    end_time,
    capacity,
    time_per_patient,
    progender,
    dostupno,
  } = req.body;
  const sql =
    "INSERT INTO procedurerooms(name, start_time, end_time, capacity, time_per_patient, progender, dostupno) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.run(
    sql,
    [
      name,
      start_time,
      end_time,
      capacity,
      time_per_patient,
      progender,
      dostupno,
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

router.get("/procedurerooms", (req, res) => {
  const sql = "SELECT * FROM procedurerooms";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Не удалось получить список Проц" });
    }
    res.json(rows);
  });
});


module.exports = router;
