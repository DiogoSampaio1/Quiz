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
    const userInfo = document.getElementById("userInfo");
    const userAvatar = document.getElementById("userAvatar");
    const userNameDisplay = document.getElementById("userName");
    let selectedAvatar = null;
    let alertTimeout;

    // Selecionar avatar
    document.querySelectorAll(".avatar").forEach(avatar => {
        avatar.addEventListener("click", function () {
            document.querySelectorAll(".avatar").forEach(a => a.classList.remove("selected"));
            this.classList.add("selected");
            selectedAvatar = this.getAttribute("data-avatar");
        });
    });

    // Adiciona o elemento de aviso no HTML
    const alertMessage = document.createElement("div");
    alertMessage.id = "alertMessage";
    alertMessage.classList.add("hidden");
    alertMessage.innerHTML = "<p>Por favor, escolha um nome e um avatar antes de continuar!</p>";
    document.body.appendChild(alertMessage);

    function showAlertMessage() {
        clearTimeout(alertTimeout);
        alertMessage.style.display = "block";
        alertMessage.style.opacity = "1";

        alertTimeout = setTimeout(() => {
            alertMessage.style.opacity = "0";
            setTimeout(() => {
                alertMessage.style.display = "none";
            }, 500);
        }, 3000);
    }

    // Confirmar nome e avatar
    confirmBtn.addEventListener("click", function () {
        const username = usernameInput.value.trim();

        if (username === "" || selectedAvatar === null) {
            showAlertMessage();
            return;
        }

        // Exibir nome e avatar no canto superior direito
        userAvatar.src = selectedAvatar;
        userAvatar.alt = "Avatar do usuário"; 
        userAvatar.style.display = "block"; 
        userNameDisplay.textContent = username;
        userInfo.classList.remove("hidden");

        // Esconder tela inicial e mostrar quiz
        startScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        quizContainer.style.display = "block";

        console.log("Iniciando quiz...");
        initializeQuiz();
    });

    document.getElementById('confirmBtn').addEventListener('click', () => {
        document.getElementById('back-home-btn').style.display = 'flex';
    })
    
    const questions = Array.from(document.querySelectorAll(".question"));
    const resultsDiv = document.getElementById("results");
    const scoreDisplay = document.getElementById("score");

    let currentQuestion = 0;
    let score = 0;
    const delayBetweenQuestions = 2000;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function initializeQuiz() {
        shuffleArray(questions);
        questions.forEach((question, index) => {
            // Atualiza o número da pergunta dinamicamente
            const questionTitle = question.querySelector("h2");
            questionTitle.textContent = `${index + 1}. ${questionTitle.textContent.substring(questionTitle.textContent.indexOf(" ") + 1)}`;
            
            quizContainer.appendChild(question);
            question.classList.remove("active");
        });
    
        questions[0].classList.add("active");
        resultsDiv.classList.add("hidden");
    
        document.querySelectorAll(".option").forEach((button) => {
            button.addEventListener("click", selectAnswer);
        });
    }    

    function showNextQuestion() {
        questions[currentQuestion].classList.remove("active");
        currentQuestion++;

        if (currentQuestion < questions.length) {
            questions[currentQuestion].classList.add("active");
        } else {
            showResults();
        }
    }

    function showResults() {
        resultsDiv.classList.remove("hidden");
        resultsDiv.scrollIntoView({ behavior: "smooth" });
        scoreDisplay.textContent = `Você acertou ${score} de ${questions.length} perguntas!`;
        
        document.getElementById("back-home-btn").style.display = "none";
        document.getElementById("returnButton").classList.remove("hidden");
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.answer === "correct";

        if (isCorrect) {
            score++;
            selectedButton.classList.add("correct");
        } else {
            selectedButton.classList.add("wrong");
        }

        const options = questions[currentQuestion].querySelectorAll(".option");
        options.forEach((button) => {
            button.disabled = true;
            if (button.dataset.answer === "correct") {
                button.classList.add("correct");
            }
        });

        setTimeout(showNextQuestion, delayBetweenQuestions);
    }
});
