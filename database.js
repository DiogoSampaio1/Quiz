const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    // Verificar se a conexão já foi estabelecida
    if (mongoose.connections[0].readyState) {
      console.log("🌕 Já estamos conectados ao banco de dados.");
      return;
    }

    // Conectar ao banco de dados usando a URL fornecida no arquivo .env
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🌕 Conectado ao banco de dados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    throw new Error("Erro ao conectar ao banco de dados");
  }
}

module.exports = connectToDatabase;
