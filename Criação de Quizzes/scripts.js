let user = document.getElementById("creator-name");

function resetUserName() {
  user.value = "";
}
resetUserName();
document.getElementById("Creator-name").addEventListener("click", function() {
  if (user.value.trim() !== "") { 
    document.getElementById("start").style.display = "none";
    document.getElementById("container").style.display = "block";
  } else {
    alert("Por favor, insira o seu nome antes de avançar!");
  }
});

let title = document.getElementById("quiz-title");
function resetTitleName() {
  title.value = "";
}
resetTitleName();

let currentQuestion = 1;
let quizData = [];

const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const submitBtn = document.getElementById("submit-btn");
const questionInput = document.getElementById("question");
const answer1Input = document.getElementById("answer1");
const answer2Input = document.getElementById("answer2");
const answer3Input = document.getElementById("answer3");
const answer4Input = document.getElementById("answer4");
const correctAnswerSelect = document.getElementById("correct-answer");
const previewContent = document.getElementById("preview-content");
const questionTitle = document.getElementById("question-title");
const messageError = document.getElementById("message-error");
const popup = document.getElementById("popup");

function updatePreview() {
  let previewText = "";
  quizData.forEach((question, index) => {
    previewText += `<strong>Pergunta ${index + 1}:</strong> ${question.question}<br>`;
    previewText += `<strong>Respostas:</strong> ${question.answers.join(", ")}<br>`;
    previewText += `<strong>Resposta Correta:</strong> ${question.correctAnswer}<br><br>`;
  });
  previewContent.innerHTML = previewText;
}

function saveCurrentQuestion() {
    // Verificar se todos os campos foram preenchidos
    if (questionInput.value && answer1Input.value && answer2Input.value && answer3Input.value && answer4Input.value && correctAnswerSelect.value) {
      quizData[currentQuestion - 1] = {
        question: questionInput.value,
        answers: [
          answer1Input.value,
          answer2Input.value,
          answer3Input.value,
          answer4Input.value
        ],
        correctAnswer: `Resposta ${correctAnswerSelect.value}`
      };
      // Esconder a mensagem de erro com animação suave
      messageError.classList.remove("fade-out");
      messageError.style.display = "none"; // Ocultar a mensagem de erro
      return true;
    } else {
      // Exibir a mensagem de erro de forma centralizada e com animação
      messageError.style.display = "block";
      messageError.classList.remove("fade-out");
  
      // Timeout para esconder a mensagem após 3 segundos
      setTimeout(() => {
        messageError.classList.add("fade-out"); // Adiciona a animação de fadeOut
      }, 3000); // Espera 3 segundos antes de desaparecer a mensagem
  
      return false;
    }
  }
  

function loadQuestion() {
  if (currentQuestion <= 10) {
    questionInput.value = quizData[currentQuestion - 1]?.question || "";
    answer1Input.value = quizData[currentQuestion - 1]?.answers[0] || "";
    answer2Input.value = quizData[currentQuestion - 1]?.answers[1] || "";
    answer3Input.value = quizData[currentQuestion - 1]?.answers[2] || "";
    answer4Input.value = quizData[currentQuestion - 1]?.answers[3] || "";
    correctAnswerSelect.value = quizData[currentQuestion - 1]?.correctAnswer?.slice(-1) || "";
  }

  questionTitle.innerText = `Pergunta ${currentQuestion}:`;

  prevBtn.disabled = currentQuestion === 1;
  nextBtn.disabled = currentQuestion === 10;
  submitBtn.disabled = currentQuestion < 10;

  updatePreview();
}

nextBtn.addEventListener("click", () => {
  if (saveCurrentQuestion()) {
    currentQuestion++;
    loadQuestion();
  }
});

prevBtn.addEventListener("click", () => {
  currentQuestion--;
  loadQuestion();
});

submitBtn.addEventListener("click", () => {
  if (saveCurrentQuestion()) {
    const quizTitle = document.getElementById("quiz-title").value
    const quizCreator = document.getElementById("creator-name").value;

    if (!quizTitle) {
      alert("O título do quiz é obrigatório!");
      return;
    }

    const formattedQuiz = {
      titulo: quizTitle, 
      criador: quizCreator,
      perguntas: quizData.map(q => ({
        pergunta: q.question,
        opcoes: q.answers,
        correta: parseInt(q.correctAnswer.replace("Resposta ", "")) - 1
      }))
    };

    // Fazer o fetch
    fetch(API_CONFIG.endpoints.quiz, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formattedQuiz)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Erro ao guardar o quiz.");
      }
      return res.json();
    })
    .then(data => {
      popup.classList.add("show");
      setTimeout(() => {
        window.location.href = "../Index.html"; 
      }, 3000);
    })
    .catch(err => {
      console.error("Erro:", err);
      alert("Houve um erro ao guardar o quiz. Verifica os dados e tenta novamente.");
    });
  }
});

loadQuestion();
