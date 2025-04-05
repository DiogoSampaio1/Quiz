require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Quiz = require("./models/Quiz");
const connectToDatabase = require("./database");
const routes = require("./routes");

// Conecta ao banco de dados
connectToDatabase();

const app = express();

// Configurações do CORS para permitir acesso do frontend
app.use(cors({
  origin: ['http://localhost:3000', 'https://quizgb.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(routes);

// Rota de teste para verificar se a API está funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3333;
  app.listen(port, () => {
    console.log(`⚡ Backend running on http://localhost:${port}`);
  });
}

module.exports = app;
