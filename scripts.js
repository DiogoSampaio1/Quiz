function toggleMenu() {
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");
  const hamburguer = document.getElementById("menu-3Barras");

  menu.classList.toggle("open");
  overlay.classList.toggle("show");

  if (menu.classList.contains("open")) {
    hamburguer.classList.add("disabled");
  } else {
    hamburguer.classList.remove("disabled");
  }
}

function closeMenu() {
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");
  const hamburguer = document.getElementById("menu-3Barras");

  menu.classList.remove("open");
  overlay.classList.remove("show");
  hamburguer.classList.remove("disabled");
}

function CriarQuiz() {
  alert("Função Criar Quiz acionada!");
}

function Entrar() {
  alert("Função Entrar acionada!");
}

const destaques = [
  { imagem: 'imagens/exemplo1.jpg', titulo: 'Título do Quiz 1' },
  { imagem: 'imagens/exemplo2.jpg', titulo: 'Título do Quiz 2' },
  { imagem: 'imagens/exemplo3.jpg', titulo: 'Título do Quiz 3' },
];

const destaquesContainer = document.querySelector('.destaques-grid');

destaques.forEach((quiz) => {
  const card = document.createElement('div');
  card.classList.add('destaque-card');
  card.innerHTML = `
    <img src="${quiz.imagem}" alt="${quiz.titulo}" class="destaque-img">
    <p class="destaque-texto">${quiz.titulo}</p>
  `;
  destaquesContainer.appendChild(card);
});

