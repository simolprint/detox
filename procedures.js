const express = require("express");
const db = require("./db");

const router = express.Router();

// Обработчик для записи процедуры
router.post("/procedures", async (req, res) => {
  try {
    const { procedure_pacient, procedure_name, procedure_time, is_busy } =
      req.body;

    const sql =
      "INSERT INTO procedures (procedure_pacient, procedure_name, procedure_time, is_busy) VALUES (?, ?, ?, ?)";
    const values = [procedure_pacient, procedure_name, procedure_time, is_busy];

    await db.run(sql, values);

    res.json({
      message: "Данные успешно добавлены в таблицу procedures",
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ error: "Не удалось добавить данные в таблицу procedures" });
  }
});


router.get("/procedures", (req, res) => {
  const sql = "SELECT * FROM procedures";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Не удалось получить список Проц" });
    }
    res.json(rows);
  });
});




router.post("/procedures/:id/status", async (req, res) => {
  const { procedure_pacient } = req.body;
  const sql =
    "UPDATE procedures SET procedure_pacient = ?, is_busy = ? WHERE id = ?";
  const params = [procedure_pacient, 1, req.params.id];
  db.run(sql, params, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Не удалось обновить процедуру" });
    }
    res.json({
      id: req.params.id,
      procedure_pacient,
      is_busy: 1,
    });
  });
});


router.post("/procedures/:procedure_pacient/delete", async (req, res) => {
  const sql =
    "UPDATE procedures SET procedure_pacient = NULL, is_busy = 0 WHERE procedure_pacient = ?";
  const params = [req.params.procedure_pacient];
  db.run(sql, params, function (err) {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось удалить пациента из процедуры" });
    }
    res.json({ message: "Пациент успешно удален из процедуры" });
  });
});


router.get("/procedures/:patient_name/windows", async (req, res) => {
  const sql = `
    SELECT procedure_name, procedure_time 
    FROM procedures 
    WHERE procedure_pacient = ?`;
  const params = [req.params.patient_name];
  db.all(sql, params, function (err, rows) {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось получить временные окошки для пациента" });
    }
    res.json({ windows: rows });
  });
});



router.get("/procedures/:id/windows", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM procedurerooms WHERE id = ${id} AND is_busy = 0 ORDER BY id ASC LIMIT 1`;
    const windows = await db.all(sql);

    if (windows.length === 0) {
      return res.status(404).json({ error: "Нет доступных окон" });
    }

    res.json({ windowId: windows[0].id });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ error: "Не удалось получить список доступных окон" });
  }
});





router.get("/procedures", async (req, res) => {
  try {
    const { procedure_name } = req.query;
    const filteredProcedures = proceduresData.filter(
      (procedure) => procedure.procedure_name === procedure_name
    );
    res.json(filteredProcedures);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Ошибка получения фильтра процедур" });
  }
});

//фильтрование 


module.exports = router;
