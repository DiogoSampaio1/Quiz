const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const CommentSchema = new mongoose.Schema({
  comentario: { type: String, required: true }
});

const Comment = mongoose.model("Comment", CommentSchema, "Comments");

module.exports = Comment;
