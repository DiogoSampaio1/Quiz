const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Quiz = require("./models/Quiz");
const Comment = require("./models/Comments");

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
        return res.status(400).json({ 
            message: "O comentário não pode estar vazio." 
        });
    }

    // Verifica se o usuário está autenticado
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ 
            message: "Usuário não autenticado." 
        });
    }

    try {
        const newComment = new Comment({ 
            comentario, 
            user: req.session.userId,
            is_deleted: false 
        });
        
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        console.error("Erro ao salvar o comentário:", err);
        res.status(500).json({ 
            message: "Erro ao salvar o comentário.", 
            error: err.message 
        });
    }
});

// Rota para Encontrar Comments (agora filtrando os não apagados)
router.get("/comments", async (req, res) => {
  try {
    const comentarios = await Comment.find({ is_deleted: false }).sort({ createdAt: -1 }); // Busca apenas comentários não apagados
    res.json(comentarios);
  } catch (error) {
    console.error("Erro ao encontrar Comentários:", error);
    res.status(500).json({ message: "Erro ao encontrar Comentários", error: error.message });
  }
});

// Rota para atualizar um comentário
router.put('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { comentario } = req.body;

    if (!comentario || comentario.trim() === "") {
        return res.status(400).json({ message: "Comentário não pode estar vazio." });
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { comentario },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: "Comentário não encontrado." });
        }

        res.json(updatedComment);
    } catch (err) {
        console.error("Erro ao atualizar o comentário:", err);
        res.status(500).json({ message: "Erro ao atualizar o comentário.", error: err.message });
    }
});

// Rota para "apagar" um comentário (soft delete)
router.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { is_deleted: true },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: "Comentário não encontrado." });
        }

        res.json({ message: "Comentário removido com sucesso." });
    } catch (err) {
        console.error("Erro ao remover o comentário:", err);
        res.status(500).json({ message: "Erro ao remover o comentário.", error: err.message });
    }
});

module.exports = router;
