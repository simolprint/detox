const express = require("express");
const db = require("./db");

const router = express.Router();

router.post("/beds", (req, res) => {
  const { roomNumber, roomType, roomGender, bedNumber, bedStatus } = req.body;
  const sql =
    "INSERT INTO beds(roomNumber, roomType, roomGender, bedNumber, bedStatus) VALUES (?, ?, ?, ?, ?)";
  db.run(
    sql,
    [roomNumber, roomType, roomGender, bedNumber, bedStatus],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Не удалось добавить койку" });
      }
      res.json({ message: "Койка успешно добавлена" });
    }
  );
});

router.delete("/beds/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM beds WHERE id = ?";
  db.run(sql, id, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Не удалось удалить койку" });
    }
    res.json({ message: "Койка успешно удалена" });
  });
});

router.get("/beds", (req, res) => {
  const sql = "SELECT * FROM beds WHERE bedNumber IS NOT NULL";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Не удалось получить список коек" });
    }
    res.json(rows);
  });
});


router.patch("/beds/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE beds SET bedStatus = ? WHERE id = ?";

  db.get(`SELECT bedStatus FROM beds WHERE id = ${id}`, (err, row) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось получить информацию о койке" });
    }

    const newStatus =
      row.bedStatus === "Свободна"
        ? "Занята"
        : row.bedStatus === "Занята"
        ? "Свободна"
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






module.exports = router;
