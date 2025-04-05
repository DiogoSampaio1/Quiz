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

// Rota raiz
app.get('/', (_req, res) => {
  res.json({ message: 'Quiz API is running', docs: '/api/docs' });
});

// Rota de teste para verificar se a API está funcionando
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Middleware para garantir conexão com o banco antes de acessar rotas da API
const ensureDbConnection = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectToDatabase();
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection error' });
  }
};

// Configura as rotas da API com middleware de conexão
app.use('/api', ensureDbConnection, routes);

// Rota para capturar erros 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Tenta conectar ao banco de dados no início
connectToDatabase().catch(console.error);

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3333;
  app.listen(port, () => {
    console.log(`⚡ Backend running on http://localhost:${port}`);
  });
}

module.exports = app;
