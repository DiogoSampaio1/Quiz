// Aplica o dark mode antes da renderização para evitar "flash" de branco
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");

  // 🌓 Dark Mode - Aplica estado inicial
  if (themeToggle) {
      themeToggle.checked = localStorage.getItem("darkMode") === "enabled";

      themeToggle.addEventListener("change", function () {
          document.body.classList.toggle("dark-mode", themeToggle.checked);
          localStorage.setItem("darkMode", themeToggle.checked ? "enabled" : "disabled");
      });
  }

  const confirmBtn = document.getElementById("confirmBtn");
  const startScreen = document.getElementById("startScreen");
  const quizContainer = document.getElementById("quizContainer");
  const usernameInput = document.getElementById("username");
  let selectedAvatar = null;

  // Selecionar avatar
  document.querySelectorAll(".avatar").forEach(avatar => {
      avatar.addEventListener("click", function () {
          document.querySelectorAll(".avatar").forEach(a => a.classList.remove("selected"));
          this.classList.add("selected");
          selectedAvatar = this.getAttribute("data-avatar");
      });
  });

  // Confirmar nome e avatar
  confirmBtn.addEventListener("click", function () {
      const username = usernameInput.value.trim();

      if (username === "" || selectedAvatar === null) {
          alert("Por favor, escolha um nome e um avatar antes de continuar!");
          return;
      }

      // Esconder tela inicial e mostrar quiz
      startScreen.classList.add("hidden");
      quizContainer.classList.remove("hidden");
      quizContainer.style.display = "block"; // Força a exibição

      // Inicializar o quiz imediatamente após mostrar o container
      console.log("Iniciando quiz...");
      initializeQuiz();
  });

  const questions = document.querySelectorAll('.question');
  const resultsDiv = document.getElementById('results');
  const scoreDisplay = document.getElementById('score');

  let currentQuestion = 0;
  let score = 0;
  const delayBetweenQuestions = 2000;

  // Inicializa o quiz para mostrar apenas a primeira pergunta
  function initializeQuiz() {
      questions.forEach((question, index) => {
          if (index === 0) {
              question.classList.add('active'); // Mostra a primeira pergunta
          } else {
              question.classList.remove('active'); // Garante que outras perguntas estejam ocultas
          }
      });

      resultsDiv.classList.add('hidden'); // Oculta os resultados

      // Adiciona eventos de clique aos botões de opções
      document.querySelectorAll('.option').forEach((button) => {
          button.addEventListener('click', selectAnswer);
      });
  }

  // Função para exibir a próxima pergunta
  function showNextQuestion() {
      questions[currentQuestion].classList.remove('active'); // Oculta a pergunta atual
      currentQuestion++;

      if (currentQuestion < questions.length) {
          questions[currentQuestion].classList.add('active'); // Mostra a próxima pergunta
      } else {
          showResults(); // Mostra os resultados ao final
      }
  }

  // Função para exibir o resultado final
  function showResults() {
      resultsDiv.classList.remove('hidden');
      resultsDiv.scrollIntoView({ behavior: 'smooth' });
      scoreDisplay.textContent = `Você acertou ${score} de ${questions.length} perguntas!`;
  }

  // Função para processar a resposta selecionada
  function selectAnswer(e) {
      const selectedButton = e.target;
      const isCorrect = selectedButton.dataset.answer === 'correct';

      // Adiciona a pontuação se a resposta estiver correta
      if (isCorrect) {
          score++;
          selectedButton.classList.add('correct'); // Destaca como resposta correta
      } else {
          selectedButton.classList.add('wrong'); // Destaca como resposta errada
      }

      // Destaca a resposta correta
      const options = questions[currentQuestion].querySelectorAll('.option');
      options.forEach((button) => {
          button.disabled = true; // Desabilita todos os botões após a seleção
          if (button.dataset.answer === 'correct') {
              button.classList.add('correct'); // Destaca a opção correta
          }
      });

      // Espera antes de avançar para a próxima pergunta (2 segundos)
      setTimeout(showNextQuestion, delayBetweenQuestions);
  }
});