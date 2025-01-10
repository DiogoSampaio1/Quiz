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