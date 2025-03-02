const questions = document.querySelectorAll('.question');
const resultsDiv = document.getElementById('results');
const scoreDisplay = document.getElementById('score');

let currentQuestion = 0;
let score = 0;
const delayBetweenQuestions = 4000; 

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

// Adiciona eventos de clique aos botões de opções depois que o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
  initializeQuiz();

  // Adiciona o evento de clique aos botões de opções
  document.querySelectorAll('.option').forEach((button) => {
    button.addEventListener('click', selectAnswer);
  });
});
