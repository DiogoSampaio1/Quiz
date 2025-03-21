require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const connectToDatabase = require("./database");
const routes = require("./routes"); // 🔥 Importa as rotas corretamente

connectToDatabase();

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());
app.use(routes); // ✅ Agora `routes` está definido corretamente

app.use("/api", routes);

app.listen(port, () => {
  console.log(`⚡ Backend deu início em http://localhost:${port}`);
});
