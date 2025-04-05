import Quiz from '../models/Quiz';
import connectToDatabase from '../database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { titulo, criador, perguntas } = req.body;

    if (!titulo || !perguntas || perguntas.length !== 10) {
      return res.status(400).json({ message: 'É necessário fornecer o título e exatamente 10 perguntas' });
    }

    for (let i = 0; i < perguntas.length; i++) {
      const p = perguntas[i];
      if (!p.pergunta || !Array.isArray(p.opcoes) || p.opcoes.length !== 4 || typeof p.correta !== 'number') {
        return res.status(400).json({ message: `Erro na pergunta ${i + 1}. Todos os campos são obrigatórios.` });
      }
    }

    try {
      await connectToDatabase();
      const novoQuiz = new Quiz({ titulo, criador, perguntas });
      await novoQuiz.save();
      res.status(201).json({ message: 'Quiz guardado com sucesso!', quiz: novoQuiz });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao guardar quiz', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
