const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    // Verificar se a conexão já foi estabelecida
    if (mongoose.connections[0].readyState) {
      return;
    }

    // Conectar ao banco de dados usando a URL fornecida no arquivo .env
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    throw new Error("Erro ao conectar ao banco de dados");
  }
}

module.exports = connectToDatabase;
