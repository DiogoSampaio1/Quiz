import bcrypt from 'bcrypt';
import User from '../models/User';
import connectToDatabase from '../database.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Conecta ao banco de dados
      await connectToDatabase();

      const user = await User.findOne({ username });
      if (!user) {
        console.log("Utilizador não encontrado!");
        return res.status(401).json({ message: "Utilizador não encontrado" });
      }

      console.log("Password Inserida:", password);
      console.log("Password guardada na Database:", user.password);

      // Comparar diretamente as senhas
      const senhaCorreta = await bcrypt.compare(password, user.password);
      console.log("Password correta?", senhaCorreta);

      if (!senhaCorreta) {
        return res.status(401).json({ message: "Password incorreta" });
      }

      res.json({ username: user.username, message: "Login bem-sucedido!" });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro no servidor", error });
    }
  } else {
    // Responde com erro caso não seja uma requisição POST
    res.status(405).json({ message: 'Método não permitido' });
  }
}
