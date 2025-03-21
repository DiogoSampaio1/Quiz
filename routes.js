const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const router = express.Router();

router.post("/api/register", async (req, res) => {
  console.log("Dados recebidos:", req.body);

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    // Verificar se o e-mail já está cadastrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-mail já está em uso" });
    }

    // Criar novo usuário
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
});

module.exports = router;
