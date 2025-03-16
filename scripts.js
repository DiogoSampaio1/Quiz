// Alternar visibilidade do menu lateral
function toggleMenu() {
  const menu = document.getElementById("sidebar");
  const overlay = document.getElementById("menuButton");
  const hamburguer = document.getElementById("closeSidebar");

  menu.classList.toggle("open");
  overlay.classList.toggle("show");

  setTimeout(() => {
    if (menu.classList.contains("open")) {
      hamburguer.classList.add("disabled");
    } else {
      hamburguer.classList.remove("disabled");
    }
  }, 100);
}

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("open");
});

// Fechar menu lateral
function closeMenu() {
  const menu = document.getElementById("sidebar");
  const overlay = document.getElementById("menuButton");
  const hamburguer = document.getElementById("closeSidebar");

  menu.classList.remove("open");
  overlay.classList.remove("show");
  hamburguer.classList.remove("disabled");
}

document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Verifica se o usuário já tem uma preferência salva
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  // Alternar entre dark e light mode ao clicar
  themeToggle.addEventListener("change", function () {
    if (themeToggle.checked) {
      body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  });
});

const quizzes = [
  { imagem: "../Imagens/matematica.png", titulo: "Quiz Matemática 5ºAno", link: "../5ºano/Matemática.html" },
  { imagem: "../Imagens/Historia.jpg", titulo: "Quiz História 9ºAno", link: "../9ºano/História.html" },
  { imagem: "../Imagens/Françês.jpg", titulo: "Quiz Françês 8ºAno", link: "../8ºano/Françês.html" },
  { imagem: "../Imagens/Geografia.jpg", titulo: "Quiz Geografia 7ºAno", link: "../7ºano/Geografia.html" },
  { imagem: "../Imagens/Ingles.png", titulo: "Quiz Inglês 6ºAno", link: "../6ºano/Inglês.html" },
  { imagem: "../Imagens/Físico-Química.jpg", titulo: "Quiz Físico-Química 9ºAno", link: "../9ºano/Fisico-quimica.html" },
  { imagem: "../Imagens/Historia.jpg", titulo: "Quiz História 7ºAno", link: "../7ºano/História.html" },
];

const carousel = document.getElementById("carousel");

// Adiciona os quizzes no carrossel com links clicáveis
quizzes.forEach((quiz) => {
  const item = document.createElement("div");
  item.classList.add("carousel-item");
  item.innerHTML = `
    <a href="${quiz.link}" class="quiz-link">
      <img src="${quiz.imagem}" alt="${quiz.titulo}">
      <p>${quiz.titulo}</p>
    </a>
  `;
  carousel.appendChild(item);
});

let currentIndex = 0;

// Função para mover o carrossel manualmente
function moveCarousel(direction) {
  const totalItems = quizzes.length;
  const visibleItems = 3; // Quantos quizzes aparecem ao mesmo tempo
  const maxIndex = totalItems - visibleItems;

  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = maxIndex;
  } else if (currentIndex > maxIndex) {
    currentIndex = 0;
  }

  carousel.style.transform = `translateX(-${currentIndex * 270}px)`;
}

// Rolar automaticamente a cada 3 segundos
setInterval(() => {
  moveCarousel(1);
}, 3000);


// -------------------------------------------------------------------------------------- DATABASE ----------------------------------------------------------------------

// Exibir modal
function abrirModal(modalId, fecharModalId = null) {
  if (fecharModalId) {
    document.getElementById(fecharModalId).style.display = 'none';
  }
  document.getElementById(modalId).style.display = 'block';
}

// Fechar modal
function fecharModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

document.getElementById('formCriarConta').addEventListener('submit', async function (e) {
  e.preventDefault();  // Impede o comportamento padrão do formulário

  const username = document.getElementById('registerUsername').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const senha = document.getElementById('registerSenha').value.trim();

  console.log("Tentando registrar usuário: ", username, email);  // Para depuração

  const response = await fetch('http://127.0.0.1:5000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, user_password: senha })
  });

  const data = await response.json();
  if (response.ok) {
    alert('Conta criada com sucesso!');
    fecharModal('modalCriarConta');
  } else {
    alert(data.message || 'Erro ao criar conta!');
  }
});

document.getElementById('formLogin').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value.trim();
  const senha = document.getElementById('loginSenha').value.trim();   

  console.log("Tentando fazer login com:", username, senha);
  
  const response = await fetch('http://127.0.0.1:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, user_password: senha })
  });

  const data = await response.json();
  if (response.ok) {
    alert(`Bem-vindo, ${data.username}!`);
    localStorage.setItem('loggedInUser', data.username);
    fecharModal('modalLogin');
    atualizarBotaoLogin();
  } else {
    alert(data.message || 'Nome de utilizador ou user_password inválidos!');
  }
});

// Terminar sessão do utilizador
function logoutUser() {
  fetch('/logout', { method: 'POST' });
  localStorage.removeItem('loggedInUser');
  atualizarBotaoLogin();
}

// Atualizar botões com base no estado de login
function atualizarBotaoLogin() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const btnEntrar = document.getElementById('btnEntrar');
  const btnCriarQuiz = document.getElementById('criarQuiz');

  if (loggedInUser) {
    btnEntrar.textContent = `Olá, ${loggedInUser} (Sair)`;
    btnEntrar.onclick = logoutUser;
    btnCriarQuiz.disabled = false;
  } else {
    btnEntrar.textContent = 'Entrar';
    btnEntrar.onclick = () => abrirModal('modalLogin');
    btnCriarQuiz.disabled = true;
  }
}

// Inicializar página
atualizarBotaoLogin();

// Função Criar Quiz
function CriarQuiz() {
  alert("Função Criar Quiz acionada!");
}

// Função Entrar
function Entrar() {
  alert("Função Entrar acionada!");
}