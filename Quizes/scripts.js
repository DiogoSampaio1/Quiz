// Aplica o dark mode antes da renderização para evitar "flash" de branco
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector("main");
    const indice = document.querySelector(".indice");

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
            indice.classList.toggle("indice-ajustada");
            document.querySelector("footer").classList.toggle("footer-ajustado");
            document.querySelector("h1").classList.toggle("h1-ajustado");

            if (sidebar.classList.contains("open")) {
                menuButton.classList.add("fixed");
            } else {
                menuButton.classList.remove("fixed");
            }
        });
        
    }
});
