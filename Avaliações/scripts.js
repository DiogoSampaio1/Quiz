// Espera o DOM carregar antes de aplicar o dark mode
document.addEventListener("DOMContentLoaded", function () {
    // Aplica o dark mode se estiver ativado
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

     // 🌓 Modo Escuro - Aplica estado inicial
     if (themeToggle) {
        themeToggle.checked = localStorage.getItem("darkMode") === "enabled";

        themeToggle.addEventListener("change", function () {
            document.body.classList.toggle("dark-mode", themeToggle.checked);
            localStorage.setItem("darkMode", themeToggle.checked ? "enabled" : "disabled");
        });
    }
});

//Alerts de Probelmas
function showAlert(message) {
    document.getElementById("problem-span").textContent = message;
    document.getElementById("alert-box").style.display = 'flex';
}

function closeAlert() {
    document.getElementById("alert-box").style.display = 'none';
}


//Alters de Confirmações
function ShowConfirmAlert(message, commentDiv, index) {
    document.getElementById("problem-span-confirm").textContent = message;
    document.getElementById("alert-box-confirm").style.display = "flex";

    document.getElementById("confirm-alert-btn-confirm-sim").onclick = () => goAheadAlert(commentDiv, index);
    document.getElementById("confirm-alert-btn-confirm-nao").onclick = closeConfirmAlert;
}


function closeConfirmAlert() {
    document.getElementById("alert-box-confirm").style.display = "none";
}

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
    const editTextArea = document.createElement('textarea');
    const maxLength = 200; 
    
    editTextArea.value = textElement.textContent;
    editTextArea.maxLength = maxLength; 

    const charCountDiv = document.createElement('div');
    charCountDiv.classList.add('char-count');
    charCountDiv.textContent = `${maxLength - editTextArea.value.length} caracteres restantes`;

    commentDiv.insertBefore(editTextArea, textElement);
    commentDiv.insertBefore(charCountDiv, editTextArea.nextSibling); 

    textElement.style.display = 'none'; 
    editTextArea.style.height = `${editTextArea.scrollHeight}px`;

    editBtn.textContent = 'Salvar';
    editBtn.classList.remove('edit-btn');
    editBtn.classList.add('save-btn');
    editBtn.onclick = () => saveEdit(commentDiv, editTextArea, textElement, editBtn, index);

    const deleteBtn = commentDiv.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.disabled = true;
    }

    editTextArea.addEventListener('input', () => {
        const remainingChars = maxLength - editTextArea.value.length;
        charCountDiv.textContent = `${remainingChars} caracteres restantes`;

        if (remainingChars < 0) {
            charCountDiv.style.color = 'red';
        } else {
            charCountDiv.style.color = ''; 
        }

        editTextArea.style.height = 'auto';
        editTextArea.style.height = `${editTextArea.scrollHeight}px`;
    });
}


function saveEdit(commentDiv, editTextArea, textElement, editBtn, index) {
    const newText = editTextArea.value.trim();

    if (newText !== '') {
        textElement.textContent = newText;
        updateCommentInLocalStorage(index, newText);
        editTextArea.remove();
        textElement.style.display = 'block';
        editBtn.textContent = 'Editar';
        editBtn.classList.remove('save-btn');
        editBtn.classList.add('edit-btn');
        editBtn.onclick = () => toggleEdit(commentDiv, textElement, editBtn, index);
        
        const deleteBtn = commentDiv.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.disabled = false;
        }
    } else {
        showAlert("O comentário não pode estar vazio!");

        editTextArea.value = textElement.textContent;

        editTextArea.style.display = 'block';
        textElement.style.display = 'none';

        editBtn.textContent = 'Salvar';
        editBtn.classList.remove('edit-btn');
        editBtn.classList.add('save-btn');
        editBtn.onclick = () => saveEdit(commentDiv, editTextArea, textElement, editBtn, index);
    }
}


function removeComment(commentDiv, index) {
    ShowConfirmAlert('Tens a certeza que queres remover este comentário?', commentDiv, index);
}


function goAheadAlert(commentDiv, index) {
    removeCommentFromLocalStorage(index);
    commentDiv.remove();
    closeConfirmAlert();
}



publishBtn.onclick = () => {
    const commentText = commentInput.value.trim();
    if (commentText !== '') {
        addCommentToLocalStorage(commentText);
        createComment(commentText, getCommentsFromLocalStorage().length - 1);
        commentInput.value = '';
    } else {
        showAlert("Tens de inserir um comentário para avaliar");
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