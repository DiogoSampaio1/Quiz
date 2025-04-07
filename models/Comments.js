const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Função para obter a data atual em Portugal
function getPortugalTime() {
    const now = new Date();
    // Portugal está no UTC+0 (horário de inverno) ou UTC+1 (horário de verão)
    // Vamos usar o UTC+0 como padrão
    return new Date(now.getTime() + (0 * 60 * 60 * 1000));
}

const CommentSchema = new mongoose.Schema({
  comentario: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: getPortugalTime
  },
  updated_at: {
    type: Date,
    default: getPortugalTime
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Middleware para atualizar o updated_at antes de salvar
CommentSchema.pre('save', function(next) {
    this.updated_at = getPortugalTime();
    next();
});

// Middleware para atualizar o updated_at antes de atualizar
CommentSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updated_at: getPortugalTime() });
    next();
});

const Comment = mongoose.model("Comment", CommentSchema, "Comments");

module.exports = Comment;
