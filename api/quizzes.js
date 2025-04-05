import Quiz from '../models/Quiz';
import connectToDatabase from '../database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectToDatabase();
      const quizzes = await Quiz.find({});
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar quizzes', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
