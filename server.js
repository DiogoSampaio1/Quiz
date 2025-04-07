require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Quiz = require("./models/Quiz");
const connectToDatabase = require("./database");
const routes = require("./routes");

const app = express();

app.use(cors({
  origin: ['https://quizgb.netlify.app', 'https://quiz-ivory-chi.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }
  next();
});

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

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.use('/api', ensureDbConnection, routes);

app.all('/login', (req, res) => res.redirect(307, '/api/login'));
app.all('/register', (req, res) => res.redirect(307, '/api/register'));
app.all('/quiz', (req, res) => res.redirect(307, '/api/quiz'));
app.all('/quizzes', (req, res) => res.redirect(307, '/api/quizzes'));
app.all('/validate-password', (req, res) => res.redirect(307, '/api/validate-password'));

app.use('*', (req, res) => {
  const endpoints = {
    login: { path: '/api/login', method: 'POST' },
    register: { path: '/api/register', method: 'POST' },
    quizzes: { path: '/api/quizzes', method: 'GET' },
    createQuiz: { path: '/api/quiz', method: 'POST' },
    getQuiz: { path: '/api/quiz/:id', method: 'GET' },
    password: { path: '/api/validate-password', method: 'POST' }
  };

  const path = req.originalUrl.replace(/\/$/, ''); 
  const endpoint = Object.values(endpoints).find(e => e.path === path);
  
  if (endpoint) {
    return res.status(405).json({
      message: `Method ${req.method} not allowed for this route`,
      error: `This endpoint only accepts ${endpoint.method} requests`,
      correctUsage: `Use ${endpoint.method} ${path}`,
      availableEndpoints: endpoints
    });
  }

  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableEndpoints: endpoints,
    help: 'Make sure you are using the correct HTTP method for each endpoint'
  });
});

connectToDatabase().catch(console.error);

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3333;
  app.listen(port, () => {
    console.log(`⚡ Backend running on http://localhost:${port}`);
  });
}

module.exports = app;
