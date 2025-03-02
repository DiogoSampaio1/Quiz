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

// Destaques para exibir categorias
const destaques = [
  { imagem: 'imagens/exemplo1.jpg', titulo: 'Título do Quiz 1' },
  { imagem: 'imagens/exemplo2.jpg', titulo: 'Título do Quiz 2' },
  { imagem: 'imagens/exemplo3.jpg', titulo: 'Título do Quiz 3' },
];

const destaquesContainer = document.querySelector('.destaques-grid');

// Gerar cartões de destaques
destaques.forEach((quiz) => {
  const card = document.createElement('div');
  card.classList.add('destaque-card');
  card.innerHTML = `
    <img src="${quiz.imagem}" alt="${quiz.titulo}" class="destaque-img">
    <p class="destaque-texto">${quiz.titulo}</p>
  `;
  destaquesContainer.appendChild(card);
});