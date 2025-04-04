const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const PerguntaSchema = new mongoose.Schema({
  pergunta: { type: String, required: true },
  opcoes: { type: [String], required: true }, // 4 opções
  correta: { type: Number, required: true }    // Índice da correta
});

const QuizSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  criador: { type: String }, // opcional: quem criou o quiz
  perguntas: { type: [PerguntaSchema], required: true } // até 10 perguntas
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", QuizSchema, "Quizzes");

module.exports = Quiz;
