const mongoose = require("mongoose"); 
const bcrypt = require("bcrypt"); 

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Garante que o e-mail seja único
  password: { type: String, required: true }, // Mantemos a senha, mas vamos criptografá-la antes de salvar
}, { timestamps: true }); // Adiciona `createdAt` e `updatedAt` automaticamente


const User = mongoose.model("Utilizadores", UserSchema, "Utilizadores"); 
module.exports = User;
