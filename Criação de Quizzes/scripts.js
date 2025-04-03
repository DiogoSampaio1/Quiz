window.onload = function() {
    const start = document.getElementsByClassName('start')[0];
    const content = document.getElementsByClassName('container')[0];

    start.addEventListener('click', function() {
        start.style.display = 'none';  // Ocultar a tela inicial
        content.style.display = 'block'; // Exibir o conteúdo do quiz
    });
};

const form = document.getElementById('quiz-form');
const questionText = document.getElementById('question-text');
const answers = [
    document.getElementById('answer-1'),
    document.getElementById('answer-2'),
    document.getElementById('answer-3'),
    document.getElementById('answer-4')
];
const correctAnswer = document.getElementById('correct-answer');

const questionPreview = document.getElementById('question-preview');
const answersPreview = document.getElementById('answers-preview');
const correctAnswerPreview = document.getElementById('correct-answer-preview');

form.addEventListener('input', updatePreview);

function updatePreview() {
    questionPreview.textContent = questionText.value;
    answersPreview.innerHTML = '';  // Limpar respostas anteriores
    answers.forEach((answer, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${answer.value}`;
        answersPreview.appendChild(listItem);
    });

    const correctOption = correctAnswer.value;
    correctAnswerPreview.textContent = `Resposta Correta: Resposta ${correctOption}`;
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    alert('Quiz Criado com Sucesso!');
    
    form.reset(); 
    questionPreview.textContent = '';
    answersPreview.innerHTML = '';
    correctAnswerPreview.textContent = '';
});