const mongoose = require("mongoose"); 
const bcrypt = require("bcrypt"); 

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Garante que o e-mail seja único
  password: { type: String, required: true }, // Mantemos a senha, mas vamos criptografá-la antes de salvar
}, { timestamps: true }); // Adiciona `createdAt` e `updatedAt` automaticamente

// Middleware para criptografar a senha antes de salvar
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // Substitui o password pelo hash
  }
  next();
});

const User = mongoose.model("Utilizadores", UserSchema, "Utilizadores"); 
module.exports = User;
