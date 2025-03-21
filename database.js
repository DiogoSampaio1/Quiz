const mongoose = require("mongoose");

function connectToDatabase() {
    mongoose.connect(
        "mongodb+srv://DiogoS:TESTE@quizgb.ck3lw.mongodb.net/",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );

    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("🌕 Connected to the database!"));
}

module.exports = connectToDatabase;
