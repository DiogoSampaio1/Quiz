// Variáveis para controle
const publishBtn = document.getElementById('publishBtn');
const commentInput = document.getElementById('commentInput');
const commentsSection = document.getElementById('commentsSection');

// Alternar visibilidade do menu lateral
function toggleMenu() {
    const menu = document.getElementById("sidebar");
    const overlay = document.getElementById("menuButton");
    const hamburguer = document.getElementById("closeSidebar");
  
    menu.classList.toggle("open");
    overlay.classList.toggle("show");
  
    setTimeout(() => {
      if (menu.classList.contains("open")) {
        hamburguer.classList.add("disabled");
      } else {
        hamburguer.classList.remove("disabled");
      }
    }, 100);
  }
  
  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
  
  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });
  
  // Fechar menu lateral
  function closeMenu() {
    const menu = document.getElementById("sidebar");
    const overlay = document.getElementById("menuButton");
    const hamburguer = document.getElementById("closeSidebar");
  
    menu.classList.remove("open");
    overlay.classList.remove("show");
    hamburguer.classList.remove("disabled");
  }

// Função para criar um novo comentário
function createComment(commentText, index) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    
    const commentTextP = document.createElement('p');
    commentTextP.textContent = commentText;
    
    const commentActions = document.createElement('div');
    commentActions.classList.add('comment-actions');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.onclick = () => {
        toggleEdit(commentDiv, commentTextP, editBtn, index);
    };

    commentActions.appendChild(editBtn);

    commentDiv.appendChild(commentTextP);
    commentDiv.appendChild(commentActions);

    commentsSection.appendChild(commentDiv);
}

// Função para ativar/desativar modo de edição
function toggleEdit(commentDiv, textElement, editBtn, index) {
    // Cria o campo de texto para edição
    const editTextArea = document.createElement('textarea');
    editTextArea.value = textElement.textContent; // Coloca o texto atual no textarea
    
    // Substitui o parágrafo de texto pelo campo de texto para edição
    commentDiv.insertBefore(editTextArea, textElement);
    textElement.style.display = 'none'; // Esconde o parágrafo

    // Ajusta a altura do textarea
    editTextArea.style.height = `${editTextArea.scrollHeight}px`;

    // Altera o texto do botão para 'Salvar'
    editBtn.textContent = 'Salvar';
    editBtn.onclick = () => saveEdit(commentDiv, editTextArea, textElement, editBtn, index);
}

// Função para salvar a edição
function saveEdit(commentDiv, editTextArea, textElement, editBtn, index) {
    const newText = editTextArea.value.trim();
    if (newText !== '') {
        // Atualiza o conteúdo do comentário com o novo texto
        textElement.textContent = newText;

        // Atualiza o comentário no LocalStorage
        updateCommentInLocalStorage(index, newText);
    } else {
        // Se o campo de texto estiver vazio, mantém o texto original
        textElement.textContent = 'Comentário vazio'; // Adiciona texto padrão
    }

    // Remove o campo de texto de edição e mostra o parágrafo de volta
    editTextArea.remove();
    textElement.style.display = 'block';

    // Altera o botão de volta para 'Editar'
    editBtn.textContent = 'Editar';
    editBtn.onclick = () => toggleEdit(commentDiv, textElement, editBtn, index);
}

// Função para publicar o comentário
publishBtn.onclick = () => {
    const commentText = commentInput.value.trim();

    if (commentText !== '') {
        // Adiciona o comentário ao LocalStorage
        addCommentToLocalStorage(commentText);

        // Cria o comentário na interface
        createComment(commentText, getCommentsFromLocalStorage().length - 1);
        commentInput.value = ''; // Limpa o campo de texto após publicar
    } else {
        alert('Por favor, escreva um comentário antes de publicar.');
    }
};

// Função para armazenar o comentário no LocalStorage
function addCommentToLocalStorage(commentText) {
    // Recupera os comentários existentes ou cria um array vazio
    let comments = getCommentsFromLocalStorage();
    
    // Adiciona o novo comentário ao array
    comments.push({ comment_text: commentText });
    
    // Armazena os comentários novamente no LocalStorage
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Função para obter os comentários do LocalStorage
function getCommentsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('comments')) || [];
}

// Função para atualizar um comentário no LocalStorage
function updateCommentInLocalStorage(index, newText) {
    let comments = getCommentsFromLocalStorage();
    comments[index].comment_text = newText; // Atualiza o texto do comentário
    localStorage.setItem('comments', JSON.stringify(comments)); // Salva de volta no LocalStorage
}

// Função para carregar os comentários do LocalStorage
function loadCommentsFromLocalStorage() {
    const comments = getCommentsFromLocalStorage();

    // Cria os comentários na interface, passando o índice para cada um
    comments.forEach((comment, index) => {
        createComment(comment.comment_text, index);
    });
}


// PASSWORD PARA DEVS
function checkPassword() {
    const passwordInput = document.getElementById("passwordInput").value;
    const correctPassword = "DevToolByDiogo";
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

// Carrega os comentários ao carregar a página
document.addEventListener('DOMContentLoaded', loadCommentsFromLocalStorage);