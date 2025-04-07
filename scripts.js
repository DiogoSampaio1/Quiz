document.addEventListener("DOMContentLoaded", function () {
  console.log("API_CONFIG:", window.API_CONFIG);
  console.log("Auth object exists:", !!window.Auth); 

  function buildApiUrl(endpoint) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${window.API_CONFIG.baseUrl}/${cleanEndpoint}`;
  }

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

  function mostrarUser(userData) {
    if (btnLoginModal) btnLoginModal.style.display = "none";
    if (userInfo) userInfo.style.display = "flex";
    if (usernameDisplay) usernameDisplay.textContent = `Olá, ${userData.username}!`;
    // Salva os dados do usuário no Auth
    if (window.Auth) {
      window.Auth.setAuthState(userData);
      console.log("Usuário salvo no Auth:", userData); // Debug log
    }
  }

  function esconderUser() {
    if (btnLoginModal) btnLoginModal.style.display = "block";
    if (userInfo) userInfo.style.display = "none";
    // Limpa os dados do usuário no Auth
    if (window.Auth) {
      window.Auth.clearAuthState();
      console.log("Estado de autenticação limpo"); // Debug log
    }
  }

  // Verifica se há usuário salvo no Auth
  if (window.Auth) {
    console.log("Verificando estado de autenticação..."); // Debug log
    const userData = window.Auth.checkAuthState();
    console.log("Estado de autenticação:", userData); // Debug log
    if (userData) {
      console.log("Usuário encontrado, atualizando UI"); // Debug log
      mostrarUser(userData);
    } else {
      console.log("Nenhum usuário encontrado, escondendo UI"); // Debug log
      esconderUser();
    }
  } else {
    console.error("Auth não está disponível!"); // Debug log
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
        const url = buildApiUrl(window.API_CONFIG.endpoints.login);
        console.log("Tentando login em:", url);
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: 'include', // Important for CORS with credentials
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Falha no login");
        }

        const userData = await response.json();
        console.log("Login bem sucedido:", userData);
        
        // Salva os dados completos do usuário
        mostrarUser({
          _id: userData._id,
          username: userData.username,
          email: userData.email
        });
        fecharModal("modalLogin");
      } catch (error) {
        console.error("Erro no login:", error);
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
        const url = buildApiUrl(window.API_CONFIG.endpoints.register);
        console.log("Tentando registro em:", url);
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: 'include', // Important for CORS with credentials
          body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro no registo");
        }

        alert("Utilizador registado com sucesso! Faça login.");
        fecharModal("modalCriarConta");
        abrirModal("modalLogin");
      } catch (error) {
        console.error("Erro no registro:", error);
        alert(error.message);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
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
    if (localStorage.getItem("overlayDismissed") !== "true") {
      overlayContainer.style.display = "flex";
    } else {
      overlayContainer.style.display = "none";
    }

    btnFeito.addEventListener("click", function () {
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

// Função para verificar a senha
async function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;

    try {
        const url = 'https://quiz-ivory-chi.vercel.app/api/validate-password';
        console.log("Validando senha em:", url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        if (!response.ok) {
            throw new Error('Senha incorreta');
        }

        const data = await response.json();
        
        if (data.valid) {
            // Redireciona para a página de criação de quiz
            window.location.href = "../Criação de Quizzes/Index.html";
        } else {
            showAlert("Senha incorreta!");
        }
    } catch (error) {
        console.error('Erro ao validar senha:', error);
        showAlert("Senha incorreta!");
    }
}

// Função para mostrar alerta
function showAlert(message) {
    const customAlert = document.getElementById('customAlert');
    if (customAlert) {
        customAlert.textContent = message;
        customAlert.style.display = 'block';
        setTimeout(() => {
            customAlert.style.display = 'none';
        }, 3000);
    }
}

// Função para voltar à página inicial
function goHome() {
    window.location.href = "Index.html";
}