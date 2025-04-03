window.onload = function() {
    const start = document.getElementsByClassName('start')[0];
    const content = document.getElementsByClassName('container')[0];
    start.addEventListener('click', function() {
        start.style.display = 'none';
        content.style.display = 'block';
    });
};

const form = document.getElementById('quiz-form');
const nextButton = document.getElementById('next-button');
const questionPreview = document.getElementById('question-preview');
const answersPreview = document.getElementById('answers-preview');
const correctAnswerPreview = document.getElementById('correct-answer-preview');
let currentQuestion = 1;
const totalQuestions = 10;  // Definindo o total de perguntas

function updatePreview() {
    const questionText = document.getElementById(`question-text-${currentQuestion}`).value;
    const answers = [
        document.getElementById(`answer-${currentQuestion}-1`).value,
        document.getElementById(`answer-${currentQuestion}-2`).value,
        document.getElementById(`answer-${currentQuestion}-3`).value,
        document.getElementById(`answer-${currentQuestion}-4`).value
    ];
    const correctAnswer = document.getElementById(`correct-answer-${currentQuestion}`).value;

    questionPreview.textContent = questionText; // Atualiza o texto da pergunta na pré-visualização
    answersPreview.innerHTML = '';
    answers.forEach((answer, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${answer}`;
        answersPreview.appendChild(listItem);
    });
    correctAnswerPreview.textContent = `Resposta Correta: Resposta ${correctAnswer}`;
}

function showNextQuestion() {
    // Checando se há mais perguntas para exibir
    if (currentQuestion < totalQuestions) {
        document.getElementById(`question-${currentQuestion}`).style.display = 'none';
        document.getElementById(`answers-${currentQuestion}`).style.display = 'none';
        document.getElementById(`correct-answer-${currentQuestion}`).style.display = 'none';

        currentQuestion++;

        // Exibindo a próxima pergunta, respostas e opção de resposta correta
        document.getElementById(`question-${currentQuestion}`).style.display = 'block';
        document.getElementById(`answers-${currentQuestion}`).style.display = 'block';
        document.getElementById(`correct-answer-${currentQuestion}`).style.display = 'block';

        updatePreview();
    } else {
        nextButton.style.display = 'none';  // Esconde o botão de próxima pergunta
        form.querySelector('[type="submit"]').style.display = 'block';  // Exibe o botão de criar o quiz
    }
}

form.addEventListener('input', updatePreview);
nextButton.addEventListener('click', showNextQuestion);
form.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Quiz Criado com Sucesso!');
    form.reset();
    questionPreview.textContent = '';
    answersPreview.innerHTML = '';
    correctAnswerPreview.textContent = '';
    currentQuestion = 1;

    // Exibe a primeira pergunta novamente
    document.getElementById(`question-${currentQuestion}`).style.display = 'block';
    document.getElementById(`answers-${currentQuestion}`).style.display = 'block';
    document.getElementById(`correct-answer-${currentQuestion}`).style.display = 'block';
});
