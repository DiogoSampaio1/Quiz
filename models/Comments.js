const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Função para obter a data atual em Portugal (UTC+1)
function getPortugalTime() {
    const now = new Date();
    // Portugal está em UTC+1 (horário de verão)
    return new Date(now.getTime() + (1 * 60 * 60 * 1000));
}

const CommentSchema = new mongoose.Schema({
  comentario: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  username: {
    type: String,
    required: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: getPortugalTime
  }
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
