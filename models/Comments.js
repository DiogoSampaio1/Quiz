const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Comment = mongoose.model("Comment", CommentSchema, "Comments");

module.exports = Comment;
