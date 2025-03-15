// Aplica o dark mode antes da renderização para evitar "flash" de branco
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menuButton");
  const sidebar = document.getElementById("sidebar");
  const closeSidebar = document.getElementById("closeSidebar");

  // 🌓 Dark Mode - Aplica estado inicial
  if (themeToggle) {
      themeToggle.checked = localStorage.getItem("darkMode") === "enabled";

      themeToggle.addEventListener("change", function () {
          document.body.classList.toggle("dark-mode", themeToggle.checked);
          localStorage.setItem("darkMode", themeToggle.checked ? "enabled" : "disabled");
      });
  }

  // 🍔 Menu lateral - Toggle ao clicar
  if (menuButton && sidebar) {
      menuButton.addEventListener("click", function () {
          sidebar.classList.toggle("open");
      });
  }

  if (closeSidebar && sidebar) {
      closeSidebar.addEventListener("click", function () {
          sidebar.classList.remove("open");
      });
  }
});

document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector("main");

    menuButton.addEventListener("click", function () {
        sidebar.classList.toggle("open");
        mainContent.classList.toggle("sidebar-open");
    });
});
