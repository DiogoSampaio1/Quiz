import Quiz from '../../models/Quiz';
import connectToDatabase from '../../database';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      await connectToDatabase();
      const quiz = await Quiz.findById(id);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz não encontrado' });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar quiz', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
