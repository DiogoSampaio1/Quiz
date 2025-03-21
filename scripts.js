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

document.addEventListener("DOMContentLoaded", function () {
  const btnEntrar = document.getElementById("btnEntrar");
  const btnCriarConta = document.querySelector(".criar-conta-link a");
  const modalLogin = document.getElementById("modalLogin");
  const modalCriarConta = document.getElementById("modalCriarConta");
  const formCriarConta = document.getElementById("formCriarConta");

  // 📌 Definir as funções como globais
  window.abrirModal = function (modalID, fecharModalID = null) {
    if (fecharModalID) {
      fecharModal(fecharModalID);
    }
    const modal = document.getElementById(modalID);
    if (modal) {
      modal.style.display = "block";
    }
  };

  window.fecharModal = function (modalID) {
    const modal = document.getElementById(modalID);
    if (modal) {
      modal.style.display = "none";
    }
  };

  if (btnEntrar && modalLogin) {
    btnEntrar.addEventListener("click", function () {
      abrirModal("modalLogin");
    });
  }

  if (btnCriarConta && modalCriarConta) {
    btnCriarConta.addEventListener("click", function () {
      abrirModal("modalCriarConta", "modalLogin");
    });
  }

  // Fechar modais ao clicar fora
  window.addEventListener("click", function (event) {
    if (event.target === modalLogin) {
      fecharModal("modalLogin");
    }
    if (event.target === modalCriarConta) {
      fecharModal("modalCriarConta");
    }
  });

  // 📌 Criar Conta (Corrigido)
  if (formCriarConta) {
    formCriarConta.addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("registerUsername").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerSenha").value;

      const userData = { username, email, password };

      try {
        const response = await fetch("http://localhost:3333/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        alert("Conta criada com sucesso!");
        fecharModal("modalCriarConta");
        formCriarConta.reset();
      } catch (error) {
        console.error("Erro ao criar conta:", error);
        alert("Erro ao criar conta. Verifique a conexão com o servidor.");
      }
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
