const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Quiz = require("./models/Quiz");

const router = express.Router();

// Rota de Registro
router.post("/register", async (req, res) => {
  console.log("Dados recebidos:", req.body);

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-mail já está em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Utilizador registado com sucesso!", user: newUser });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
});

// Rota de Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Utilizador não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Password incorreta" });
    }

    res.json({ username: user.username, message: "Login bem-sucedido!" });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
});

// Rota para criar quiz
router.post("/quiz", async (req, res) => {
  const { titulo, criador, perguntas } = req.body;

  if (!titulo || !perguntas || perguntas.length !== 10) {
    return res.status(400).json({ message: "É necessário fornecer o título e exatamente 10 perguntas" });
  }

  for (let i = 0; i < perguntas.length; i++) {
    const p = perguntas[i];
    if (!p.pergunta || !Array.isArray(p.opcoes) || p.opcoes.length !== 4 || typeof p.correta !== "number") {
      return res.status(400).json({ message: `Erro na pergunta ${i + 1}. Todos os campos são obrigatórios.` });
    }
  }

  try {
    const novoQuiz = new Quiz({ titulo, criador, perguntas });
    await novoQuiz.save();
    res.status(201).json({ message: "Quiz guardado com sucesso!", quiz: novoQuiz });
  } catch (error) {
    console.error("Erro ao guardar quiz:", error);
    res.status(500).json({ message: "Erro ao guardar o quiz", error: error.message });
  }
});

// Rota para listar quizzes
router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.json(quizzes);
  } catch (error) {
    console.error("Erro ao buscar quizzes:", error);
    res.status(500).json({ message: "Erro ao buscar quizzes", error: error.message });
  }
});

// Rota para buscar quiz específico
router.get("/quiz/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz não encontrado" });
    }
    res.json(quiz);
  } catch (error) {
    console.error("Erro ao buscar quiz:", error);
    res.status(500).json({ message: "Erro ao buscar quiz", error: error.message });
  }
});

// Rota para validar senha
router.post('/validate-password', (req, res) => {
  const correctPassword = "SoProfs!";
  const { password } = req.body;

  if (password === correctPassword) {
    return res.json({ valid: true });
  } else {
    return res.status(400).json({ valid: false, message: 'Senha incorreta' });
  }
});

// Rota para Guardar Comments
router.post('/comments', async (req, res) => { 
  const { comentario } = req.body;
  
  // Verifica se o comentário não está vazio
  if (!comentario || comentario.trim() === "") {
    return res.status(400).send("Comentário não pode estar vazio.");
  }

  try {
    const newComment = new Comment({ comentario });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).send("Erro ao salvar o comentário.");
  }
});

// Rota para Encontrar Comments
router.get("/comments", async (req, res) => {
  try {
    const comentarios = await Comment.find(); // Buscar todos os comentários do banco de dados
    if (comentarios.length === 0) {
      return res.status(404).json({ message: "Nenhum comentário encontrado" });
    }
    res.json(comentarios); // Retorna os comentários encontrados
  } catch (error) {
    console.error("Erro ao encontrar Comentários:", error);
    res.status(500).json({ message: "Erro ao encontrar Comentários", error: error.message });
  }
});

module.exports = router;
