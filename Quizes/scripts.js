// Aplica o dark mode antes da renderização para evitar "flash" de branco
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
  
  document.addEventListener("DOMContentLoaded", function () {
      const themeToggle = document.getElementById("theme-toggle");
      const menuButton = document.getElementById("menuButton");
      const sidebar = document.getElementById("sidebar");
      const mainContent = document.querySelector("main");
      const indice = document.querySelector(".selecao-anos");
      const anoCheckboxes = document.querySelectorAll(".ano-checkbox");
      const anoSections = document.querySelectorAll(".Ano-escolar");
  
      // 🌓 Modo Escuro - Aplica estado inicial
      if (themeToggle) {
          themeToggle.checked = localStorage.getItem("darkMode") === "enabled";
  
          themeToggle.addEventListener("change", function () {
              document.body.classList.toggle("dark-mode", themeToggle.checked);
              localStorage.setItem("darkMode", themeToggle.checked ? "enabled" : "disabled");
          });
      }
  
      // 🍔 Menu Lateral - Toggle ao clicar
      if (menuButton && sidebar) {
          menuButton.addEventListener("click", function () {
              sidebar.classList.toggle("open");
              mainContent.classList.toggle("sidebar-open");
              indice.classList.toggle("selecao-anos-ajustada");
              document.querySelector("footer").classList.toggle("footer-ajustado");
              document.querySelector("h1").classList.toggle("h1-ajustado");
  
              menuButton.classList.toggle("fixed", sidebar.classList.contains("open"));
          });
      }
  
      // 📌 Filtragem por ano escolar
      if (anoCheckboxes.length > 0) {
          anoCheckboxes.forEach(checkbox => {
              checkbox.addEventListener("change", updateSectionsVisibility);
          });
  
          function updateSectionsVisibility() {
              const anosSelecionados = Array.from(anoCheckboxes)
                  .filter(checkbox => checkbox.checked)
                  .map(checkbox => checkbox.value);
  
                anoSections.forEach(section => {
                    section.style.display = anosSelecionados.length > 0 && anosSelecionados.includes(section.id) ? "block" : "none";
                });
                
          }
      }
      
      document.querySelectorAll(".selecao-anos input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = true;
    });

    // Carregar quizzes criados pelos usuários
    async function loadUserQuizzes() {
        try {
            const response = await fetch(API_CONFIG.endpoints.quizzes);
            if (!response.ok) throw new Error('Erro ao carregar quizzes');
            
            const quizzes = await response.json();
            const container = document.getElementById('user-quizzes-container');
            
            quizzes.forEach(quiz => {
                const quizCard = document.createElement('div');
                quizCard.className = 'disciplina-card';
                quizCard.innerHTML = `
                    <a href="../Criação de Quizzes/play.html?id=${quiz._id}">
                        <img src="../Imagens/user-quiz.png" alt="${quiz.titulo}">
                        <p>${quiz.titulo} (Criado por: ${quiz.criador || 'Anônimo'})</p>
                    </a>
                `;
                container.appendChild(quizCard);
            });
        } catch (error) {
            console.error('Erro ao carregar quizzes:', error);
        }
    }

    // Carregar os quizzes quando a página carregar
    loadUserQuizzes();
  });