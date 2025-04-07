// Variáveis para controle
const publishBtn = document.getElementById('publishBtn');
const commentInput = document.getElementById('commentInput');
const commentsSection = document.getElementById('commentsSection');
const menuButton = document.getElementById('menuButton');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');

// Alternar visibilidade do menu lateral
function toggleMenu() {
    sidebar.classList.toggle("open");
}

menuButton.addEventListener("click", toggleMenu);

closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
});

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
    editBtn.classList.add('edit-btn');
    editBtn.onclick = () => {
        toggleEdit(commentDiv, commentTextP, editBtn, index);
    };
    commentActions.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Remover';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => {
        removeComment(commentDiv, index);
    };
    commentActions.appendChild(deleteBtn);

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
    // Altera o texto do botão para 'Salvar' e muda a classe
    editBtn.textContent = 'Salvar';
    editBtn.classList.remove('edit-btn');
    editBtn.classList.add('save-btn');
    editBtn.onclick = () => saveEdit(commentDiv, editTextArea, textElement, editBtn, index);

    // Desabilita o botão de remover durante a edição
    const deleteBtn = commentDiv.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.disabled = true;
    }
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
    // Altera o botão de volta para 'Editar' e muda a classe
    editBtn.textContent = 'Editar';
    editBtn.classList.remove('save-btn');
    editBtn.classList.add('edit-btn');
    editBtn.onclick = () => toggleEdit(commentDiv, textElement, editBtn, index);

    // Reabilita o botão de remover após a edição
    const deleteBtn = commentDiv.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.disabled = false;
    }
}

// Função para remover um comentário
function removeComment(commentDiv, index) {
    if (confirm('Tem certeza que deseja remover este comentário?')) {
        removeCommentFromLocalStorage(index);
        commentDiv.remove();
        // Recarrega os comentários para atualizar os índices no LocalStorage (opcional, dependendo da necessidade)
        // commentsSection.innerHTML = '';
        // loadCommentsFromLocalStorage();
    }
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
    let comments = getCommentsFromLocalStorage();
    comments.push({ comment_text: commentText });
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Função para obter os comentários do LocalStorage
function getCommentsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('comments')) || [];
}

// Função para atualizar um comentário no LocalStorage
function updateCommentInLocalStorage(index, newText) {
    let comments = getCommentsFromLocalStorage();
    if (comments[index]) {
        comments[index].comment_text = newText;
        localStorage.setItem('comments', JSON.stringify(comments));
    }
}

// Função para remover um comentário do LocalStorage
function removeCommentFromLocalStorage(index) {
    let comments = getCommentsFromLocalStorage();
    if (index >= 0 && index < comments.length) {
        comments.splice(index, 1);
        localStorage.setItem('comments', JSON.stringify(comments));
    }
}

// Função para carregar os comentários do LocalStorage
function loadCommentsFromLocalStorage() {
    const comments = getCommentsFromLocalStorage();
    comments.forEach((comment, index) => {
        createComment(comment.comment_text, index);
    });
}

// PASSWORD PARA DEVS
function checkPassword() {
    const passwordInput = document.getElementById("passwordInput").value;
    const correctPassword = "g";
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