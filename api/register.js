import bcrypt from 'bcrypt';
import User from '../models/User';
import connectToDatabase from '../database';

// Função serverless para o registro
export default async function handler(req, res) {
  // Verifica se a requisição é POST
  if (req.method === 'POST') {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    try {
      // Conecta ao banco de dados
      await connectToDatabase();

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "E-mail já está em uso" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "Utilizador registado com sucesso!", user: newUser });
    } catch (error) {
      console.error("Erro no servidor:", error);
      res.status(500).json({ message: "Erro no servidor", error });
    }
  } else {
    // Responde com erro caso não seja uma requisição POST
    res.status(405).json({ message: 'Método não permitido' });
  }
}