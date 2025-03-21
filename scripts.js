document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menuButton");
  const sidebar = document.getElementById("sidebar");
  const closeSidebar = document.getElementById("closeSidebar");

  if (!menuButton || !sidebar || !closeSidebar) {
    console.error("Erro: Elementos do menu não encontrados!");
    return;
  }

  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  // Tema Escuro
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode", themeToggle.checked);
      localStorage.setItem("darkMode", themeToggle.checked ? "enabled" : "disabled");
    });
  }
});

// Carrossel
const carousel = document.getElementById("carousel");
const quizzes = [
  { imagem: "Imagens/matematica.png", titulo: "Quiz Matemática 5ºAno", link: "5ºano/Matemática.html" },
  { imagem: "Imagens/Historia.jpg", titulo: "Quiz História 9ºAno", link: "9ºano/História.html" },
  { imagem: "Imagens/Françês.jpg", titulo: "Quiz Francês 8ºAno", link: "8ºano/Francês.html" },
  { imagem: "Imagens/Geografia.jpg", titulo: "Quiz Geografia 7ºAno", link: "7ºano/Geografia.html" },
  { imagem: "Imagens/Ingles.png", titulo: "Quiz Inglês 6ºAno", link: "6ºano/Inglês.html" },
  { imagem: "Imagens/Físico-Química.jpg", titulo: "Quiz Físico-Química 9ºAno", link: "9ºano/Fisico-quimica.html" },
  { imagem: "Imagens/Historia.jpg", titulo: "Quiz História 7ºAno", link: "7ºano/História.html" },
];

if (carousel) {
  quizzes.forEach((quiz) => {
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    item.innerHTML = `<a href="${quiz.link}"><img src="${quiz.imagem}" alt="${quiz.titulo}"><p>${quiz.titulo}</p></a>`;
    carousel.appendChild(item);
  });

  let currentIndex = 0;
  const itemWidth = 270;

  function moveCarousel(direction) {
    currentIndex = (currentIndex + direction + quizzes.length) % quizzes.length;
    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  setInterval(() => moveCarousel(1), 3000);
}