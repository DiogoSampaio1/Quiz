import { connectToDatabase } from '../../database'; // Certifique-se de que esta função está correta para conectar ao MongoDB.
import Comment from '../../models/Comment'; // Seu modelo de comentário

export default async function handler(req, res) {
  const { method } = req; // Pega o método HTTP (POST, PUT, DELETE, etc.)

  // Conecta ao banco de dados MongoDB
  await connectToDatabase();

  if (method === 'POST') {
    // Rota POST - Criar Comentário
    const { comentario } = req.body;

    // Verifica se o comentário não está vazio
    if (!comentario || comentario.trim() === "") {
      return res.status(400).json({ message: "Comentário não pode estar vazio." });
    }

    try {
      const newComment = new Comment({ comentario });
      await newComment.save();
      return res.status(201).json(newComment); // Retorna o comentário criado
    } catch (err) {
      return res.status(500).json({ message: "Erro ao salvar o comentário." });
    }

  } else if (method === 'GET') {
    // Rota GET - Obter Comentários
    try {
      const comments = await Comment.find(); // Busca todos os comentários no banco de dados
      if (comments.length === 0) {
        return res.status(404).json({ message: "Nenhum comentário encontrado" });
      }
      return res.status(200).json(comments); // Retorna os comentários encontrados
    } catch (err) {
      return res.status(500).json({ message: "Erro ao buscar comentários." });
    }

  } else if (method === 'PUT') {
    // Rota PUT - Atualizar Comentário
    const { id } = req.query; // Pega o ID do comentário na URL
    const { comentario } = req.body;

    // Verifica se o comentário não está vazio
    if (!comentario || comentario.trim() === "") {
      return res.status(400).json({ message: "Comentário não pode estar vazio." });
    }

    try {
      const updatedComment = await Comment.findByIdAndUpdate(id, { comentario }, { new: true });

      if (!updatedComment) {
        return res.status(404).json({ message: "Comentário não encontrado." });
      }

      return res.status(200).json(updatedComment); // Retorna o comentário atualizado
    } catch (err) {
      return res.status(500).json({ message: "Erro ao atualizar o comentário." });
    }

  } else if (method === 'DELETE') {
    
    // Rota DELETE - Excluir Comentário
    const { id } = req.query; // Pega o ID do comentário na URL

    try {
      const deletedComment = await Comment.findByIdAndDelete(id);

      if (!deletedComment) {
        return res.status(404).json({ message: "Comentário não encontrado." });
      }

      return res.status(200).json({ message: "Comentário removido com sucesso." }); // Retorna uma mensagem de sucesso
    } catch (err) {
      return res.status(500).json({ message: "Erro ao excluir o comentário." });
    }
  } else {
    // Método HTTP não permitido
    return res.status(405).json({ message: `Método ${method} não permitido.` });
  }
}
