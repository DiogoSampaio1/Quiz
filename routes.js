const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const router = express.Router(); // Usa o Router do Express

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

    console.log("Antes do hash:", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Depois do hash:", hashedPassword);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("Utilizador salvo no banco:", newUser);

    res.status(201).json({ message: "Utilizador registado com sucesso!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
});

// Rota de Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Utilizador não encontrado!");
      return res.status(401).json({ message: "Utilizador não encontrado" });
    }

    console.log("Password Inserida:", password);
    console.log("Password guardada na Database:", user.password);

    // 🔥 Apenas comparar diretamente!
    const senhaCorreta = await bcrypt.compare(password, user.password);
    console.log("Password correta?", senhaCorreta);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Password incorreta" });
    }

    res.json({ username: user.username, message: "Login bem-sucedido!" });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor", error });
  }
});


module.exports = router;
