document.addEventListener("DOMContentLoaded", function () {
  // Menu Lateral
  const menuButton = document.getElementById("menuButton");
  const sidebar = document.getElementById("sidebar");
  const closeSidebar = document.getElementById("closeSidebar");

  if (!menuButton || !sidebar || !closeSidebar) {
    console.error("Erro: Elementos do menu não encontrados!");
    return;
  }

  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuButton.classList.toggle("fixed", sidebar.classList.contains("open"));
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

  // Botões entrar e etc.
  const formLogin = document.getElementById("formLogin");
  const formRegister = document.getElementById("formRegister");
  const btnLoginModal = document.getElementById("btnLoginModal");
  const userInfo = document.getElementById("user-info");
  const usernameDisplay = document.getElementById("username-display");
  const logoutBtn = document.getElementById("logout-btn");
  const criarContaLink = document.getElementById("criarContaLink");
  const fecharBtns = document.querySelectorAll(".fechar");

  function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = "block";
    } else {
      console.error(`Erro: Modal com id '${id}' não encontrado!`);
    }
  }

  function fecharModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = "none";
    } else {
      console.error(`Erro: Modal com id '${id}' não encontrado!`);
    }
  }

  function mostrarUser(username) {
    if (btnLoginModal) btnLoginModal.style.display = "none";
    if (userInfo) userInfo.style.display = "flex";
    if (usernameDisplay) usernameDisplay.textContent = `Olá, ${username}!`;
  }

  function esconderUser() {
    if (btnLoginModal) btnLoginModal.style.display = "block";
    if (userInfo) userInfo.style.display = "none";
  }

  const loggedUser = localStorage.getItem("username");
  if (loggedUser) {
    mostrarUser(loggedUser);
  } else {
    esconderUser();
  }

  if (btnLoginModal) {
    btnLoginModal.addEventListener("click", function () {
      abrirModal("modalLogin");
    });
  }

  if (criarContaLink) {
    criarContaLink.addEventListener("click", function (event) {
      event.preventDefault();
      fecharModal("modalLogin");
      abrirModal("modalCriarConta");
    });
  }

  fecharBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = btn.closest(".modal");
      if (modal) {
        fecharModal(modal.id);
      }
    });
  });

  if (formLogin) {
    formLogin.addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginSenha").value;

      try {
        const response = await fetch("http://localhost:3333/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error("Falha no login");
        }

        const data = await response.json();
        localStorage.setItem("username", data.username);
        mostrarUser(data.username);
        fecharModal("modalLogin");
      } catch (error) {
        alert("Erro ao fazer login. Verifique suas credenciais.");
      }
    });
  }

  if (formRegister) {
    formRegister.addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("registerUsername").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerSenha").value;

      try {
        const response = await fetch("http://localhost:3333/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro no registo");
        }

        alert("Utilizador registado com sucesso! Faça login.");
        fecharModal("modalCriarConta");
        abrirModal("modalLogin");
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("username");
      esconderUser();
    });
  }

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

  // Tela de boas-vindas (overlay)
  const overlayContainer = document.getElementById("overlay-container");
  const btnFeito = document.getElementById("btnFeito");

  if (overlayContainer && btnFeito) {
    // Verificar se o botão "Entendido!" foi clicado anteriormente
    if (localStorage.getItem("overlayDismissed") !== "true") {
      // Se o overlay não foi descartado, mostre o overlay
      overlayContainer.style.display = "flex";
    } else {
      // Se já foi descartado, esconder o overlay
      overlayContainer.style.display = "none";
    }

    btnFeito.addEventListener("click", function () {
      // Esconde o overlay e marca que foi descartado
      overlayContainer.style.display = "none";
      localStorage.setItem("overlayDismissed", "true");
    });
  }
});

const botaoCriarQuiz = document.getElementById("criarQuiz");

if (botaoCriarQuiz) {
    botaoCriarQuiz.addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("devScreen").style.display = "flex";
    });
};

// PASSWORD PARA DEVS
function checkPassword() {
  const passwordInput = document.getElementById("passwordInput").value;
  const correctPassword = "o";
  const alertBox = document.getElementById("customAlert");

  if (passwordInput === correctPassword) {
      document.getElementById("devScreen").style.display = "none";
  } else {
      alertBox.style.display = "block";
      setTimeout(() => {
          alertBox.style.display = "none";
      }, 2000);
  }
}

function goHome() {
  window.location.href = "../Index.html";
}