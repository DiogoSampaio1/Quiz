require("dotenv").config();
import connectToDatabase from "./database";

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
  origin: ['http://localhost:3000', 'https://quizgb.netlify.app', 'http://quizgb.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Middleware para preflight requests
app.options('*', cors());

app.use(express.json());

// Middleware para tratamento de erros JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }
  next();
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

// Rota raiz
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Quiz API is running',
    docs: '/api/docs',
    endpoints: {
      login: { path: '/api/login', method: 'POST' },
      register: { path: '/api/register', method: 'POST' },
      quizzes: { path: '/api/quizzes', method: 'GET' },
      createQuiz: { path: '/api/quiz', method: 'POST' },
      getQuiz: { path: '/api/quiz/:id', method: 'GET' },
      password: { path: '/api/validate-password', method: 'POST' }
    }
  });
});

// Rota de teste para verificar se a API está funcionando
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Aplica o middleware de conexão com o banco e as rotas
app.use('/api', ensureDbConnection, routes);

// Redirecionamento de rotas antigas para novas com prefixo /api
app.all('/login', (req, res) => res.redirect(307, '/api/login'));
app.all('/register', (req, res) => res.redirect(307, '/api/register'));
app.all('/quiz', (req, res) => res.redirect(307, '/api/quiz'));
app.all('/quizzes', (req, res) => res.redirect(307, '/api/quizzes'));
app.all('/validate-password', (req, res) => res.redirect(307, '/api/validate-password'));

// Rota para capturar erros 404
app.use('*', (req, res) => {
  const endpoints = {
    login: { path: '/api/login', method: 'POST' },
    register: { path: '/api/register', method: 'POST' },
    quizzes: { path: '/api/quizzes', method: 'GET' },
    createQuiz: { path: '/api/quiz', method: 'POST' },
    getQuiz: { path: '/api/quiz/:id', method: 'GET' },
    password: { path: '/api/validate-password', method: 'POST' }
  };

  // Verifica se a rota existe mas o método está errado
  const path = req.originalUrl.replace(/\/$/, ''); // Remove trailing slash if present
  const endpoint = Object.values(endpoints).find(e => e.path === path);
  
  if (endpoint) {
    return res.status(405).json({
      message: `Method ${req.method} not allowed for this route`,
      error: `This endpoint only accepts ${endpoint.method} requests`,
      correctUsage: `Use ${endpoint.method} ${path}`,
      availableEndpoints: endpoints
    });
  }

  // Se a rota não existe
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableEndpoints: endpoints,
    help: 'Make sure you are using the correct HTTP method for each endpoint'
  });
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
