const express = require("express");
const db = require("./db");

const router = express.Router();

router.post("/schedule", (req, res) => {
  const { patientId, procedureId, date, time } = req.body;
  const sql =
    "INSERT INTO schedule(patientId, procedureId, date, time) VALUES (?, ?, ?, ?)";
  db.run(sql, [patientId, procedureId, date, time], (err) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось добавить запись в расписание" });
    }
    res.json({ message: "Запись успешно добавлена в расписание" });
  });
});

router.get("/schedule", (req, res) => {
  const sql = "SELECT * FROM schedule";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось получить список записей в расписании" });
    }
    res.json(rows);
  });
});

router.delete("/schedule/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM schedule WHERE id = ?";
  db.run(sql, id, (err) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось удалить запись из расписания" });
    }
    res.json({ message: "Запись успешно удалена из расписания" });
  });
});

router.patch("/schedule/:id", (req, res) => {
  const id = req.params.id;
  const { procedureId, date, time } = req.body;
  const sql =
    "UPDATE schedule SET procedureId = ?, date = ?, time = ? WHERE id = ?";
  db.run(sql, [procedureId, date, time, id], (err) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({
          error: "Не удалось изменить информацию о записи в расписании",
        });
    }
    res.json({ message: "Информация о записи в расписании успешно изменена" });
  });
});

module.exports = router;
