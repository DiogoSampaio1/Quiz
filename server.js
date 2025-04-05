require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Quiz = require("./models/Quiz");
const connectToDatabase = require("./database");
const routes = require("./routes");

const app = express();

// Configurações do CORS para permitir acesso do frontend
app.use(cors({
  origin: ['http://localhost:3000', 'https://quizgb.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Middleware para tratamento de erros JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }
  next();
});

// Conecta ao banco de dados antes de configurar as rotas
(async () => {
  try {
    await connectToDatabase();
    // Só configura as rotas depois de conectar ao banco
    app.use(routes);

    // Rota de teste para verificar se a API está funcionando
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'API is running' });
    });

    // Rota para capturar erros 404
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    // Para desenvolvimento local
    if (process.env.NODE_ENV !== 'production') {
      const port = process.env.PORT || 3333;
      app.listen(port, () => {
        console.log(`⚡ Backend running on http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
})();

module.exports = app;
