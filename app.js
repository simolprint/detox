const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");

app.use(cors());
app.use(express.json());

// Маршрут для входа
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Здесь вы можете проверить имя пользователя и пароль
  const users = [
    { id: 1, role: "manager", username: "Asiyat", password: "111111" },
    { id: 2, role: "cashier", username: "Kassir", password: "222222" },
    { id: 3, role: "worker", username: "Rabotnik", password: "333333" },
  ];
  const user = users.find((user) => user.username === username);
  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ error: "Неправильное имя пользователя или пароль" });
  }

  res.json({ message: "Вход выполнен успешно", user });
});

const patientsRouter = require("./patients");
app.use("/patients", patientsRouter);

const bedRouter = require("./beds");
app.use("/beds", bedRouter);

const procedureroomsRouter = require("./procedurerooms");
app.use("/procedurerooms", procedureroomsRouter);

const proceduresRouter = require("./procedures");
app.use("/procedures", proceduresRouter);

const usersRouter = require("./users");
app.use("/users", usersRouter);


app.post("/clients", (req, res) => {
  const { name, email, phone, address } = req.body;
  const sql =
    "INSERT INTO clients(name, email, phone, address) VALUES (?, ?, ?, ?)";
  db.run(sql, [name, email, phone, address], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Не удалось добавить клиента" });
    }
    res.json({ message: "Клиент успешно добавлен" });
  });
});





app.get("/clients", (req, res) => {
  const sql = "SELECT * FROM clients";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Не удалось получить список клиентов" });
    }
    res.json(rows);
  });
});

// Маршрут для добавления палаты


app.put("/patients/:id", (req, res) => {
  const id = req.params.id;

  // Обновление данных пациента в таблице patients
  const sqlUpdatePatient =
    "UPDATE patients SET dischargeDate = ?, patientStatus = 'Выписан' WHERE id = ?";
  db.run(sqlUpdatePatient, [req.body.dischargeDate, id], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Не удалось выписать пациента" });
    }

    // Освобождение койки в таблице beds
    const sqlUpdateBed =
      "UPDATE beds SET bedStatus = 'Выселена' WHERE bedNumber = ?";
    db.run(sqlUpdateBed, [req.body.bedNumber], (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: "Не удалось обновить статус койки" });
      }

      res.json({ message: "Пациент успешно выписан" });
    });
  });
});


app.delete("/patients/:id", (req, res) => {
  const id = req.params.id;

  // Удаление пациента из таблицы patients
  const sqlDeletePatient = "DELETE FROM patients WHERE id = ?";
  db.run(sqlDeletePatient, [id], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Не удалось удалить пациента" });
    }

    // Освобождение койки в таблице beds
    const sqlUpdateBed =
      "UPDATE beds SET bedStatus = 'Свободна' WHERE bedNumber = ?";
    db.run(sqlUpdateBed, [req.body.bedNumber], (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: "Не удалось обновить статус койки" });
      }

      res.json({ message: "Пациент успешно удален" });
    });
  });
});




const port = 3001;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

module.exports = app;