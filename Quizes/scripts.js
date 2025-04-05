// Espera o DOM carregar antes de aplicar o dark mode
document.addEventListener("DOMContentLoaded", function () {
    // Aplica o dark mode se estiver ativado
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    console.log("API_CONFIG:", window.API_CONFIG); // Debug log

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
});