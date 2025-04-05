export default async function handler(req, res) {
    const correctPassword = 'SoProfs!';
  
    if (req.method === 'POST') {
      const { password } = req.body;
  
      if (password === correctPassword) {
        return res.json({ valid: true });
      } else {
        return res.status(400).json({ valid: false, message: 'Senha incorreta' });
      }
    } else {
      res.status(405).json({ message: 'Método não permitido' });
    }
  }
  