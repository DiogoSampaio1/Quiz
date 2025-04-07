document.addEventListener("DOMContentLoaded", function () {
    console.log("API_CONFIG:", window.API_CONFIG);

    // Variáveis para controle
    const publishBtn = document.getElementById('publishBtn');
    const commentInput = document.getElementById('commentInput');
    const commentsSection = document.getElementById('commentsSection');
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');

    // Carregar avaliações ao iniciar a página
    loadComments();

    // Alternar visibilidade do menu lateral
    function toggleMenu() {
        sidebar.classList.toggle("open");
    }

    menuButton.addEventListener("click", toggleMenu);

    closeSidebar.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    // Função para carregar avaliações da API
    async function loadComments() {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.avaliacoes}`);
            if (!response.ok) throw new Error('Erro ao carregar avaliações');
            
            const avaliacoes = await response.json();
            commentsSection.innerHTML = '<h2>Avaliações Publicadas</h2>';
            
            avaliacoes.forEach((avaliacao, index) => {
                createComment(avaliacao.texto, avaliacao._id);
            });
        } catch (error) {
            console.error('Erro:', error);
            showAlert('Erro ao carregar avaliações. Tente novamente mais tarde.');
        }
    }

    // Função para criar um novo comentário
    function createComment(commentText, id) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.dataset.id = id;

        const commentTextP = document.createElement('p');
        commentTextP.textContent = commentText;

        const commentActions = document.createElement('div');
        commentActions.classList.add('comment-actions');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.classList.add('edit-btn');
        editBtn.onclick = () => {
            toggleEdit(commentDiv, commentTextP, editBtn);
        };
        commentActions.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Remover';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => {
            removeComment(commentDiv);
        };
        commentActions.appendChild(deleteBtn);

        commentDiv.appendChild(commentTextP);
        commentDiv.appendChild(commentActions);
        commentsSection.appendChild(commentDiv);
    }

    // Função para ativar/desativar modo de edição
    function toggleEdit(commentDiv, textElement, editBtn) {
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
        editBtn.onclick = () => saveEdit(commentDiv, editTextArea, textElement, editBtn);

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

    // Função para salvar edição
    async function saveEdit(commentDiv, editTextArea, textElement, editBtn) {
        const newText = editTextArea.value.trim();
        const commentId = commentDiv.dataset.id;

        if (newText === '') {
            showAlert("O comentário não pode estar vazio!");
            return;
        }

        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.avaliacoes}/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ texto: newText })
            });

            if (!response.ok) throw new Error('Erro ao atualizar avaliação');

            textElement.textContent = newText;
            editTextArea.remove();
            textElement.style.display = 'block';
            editBtn.textContent = 'Editar';
            editBtn.classList.remove('save-btn');
            editBtn.classList.add('edit-btn');
            editBtn.onclick = () => toggleEdit(commentDiv, textElement, editBtn);

            const deleteBtn = commentDiv.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.disabled = false;
            }

            const charCountDiv = commentDiv.querySelector('.char-count');
            if (charCountDiv) {
                charCountDiv.remove();
            }
        } catch (error) {
            console.error('Erro:', error);
            showAlert('Erro ao atualizar avaliação. Tente novamente.');
        }
    }

    // Função para remover comentário
    function removeComment(commentDiv) {
        ShowConfirmAlert('Tens a certeza que queres remover este comentário?', commentDiv);
    }

    // Função para confirmar remoção
    async function goAheadAlert(commentDiv) {
        const commentId = commentDiv.dataset.id;

        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.avaliacoes}/${commentId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erro ao remover avaliação');

            commentDiv.remove();
            closeConfirmAlert();
        } catch (error) {
            console.error('Erro:', error);
            showAlert('Erro ao remover avaliação. Tente novamente.');
        }
    }

    // Publicar novo comentário
    publishBtn.onclick = async () => {
        const commentText = commentInput.value.trim();
        
        if (commentText === '') {
            showAlert("Tens de inserir um comentário para avaliar");
            return;
        }

        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.avaliacoes}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ texto: commentText })
            });

            if (!response.ok) throw new Error('Erro ao publicar avaliação');

            const novaAvaliacao = await response.json();
            createComment(commentText, novaAvaliacao._id);
            commentInput.value = '';
        } catch (error) {
            console.error('Erro:', error);
            showAlert('Erro ao publicar avaliação. Tente novamente.');
        }
    };
});

// Funções de alerta
function showAlert(message) {
    document.getElementById("problem-span").textContent = message;
    document.getElementById("alert-box").style.display = 'flex';
}

function closeAlert() {
    document.getElementById("alert-box").style.display = 'none';
}

function ShowConfirmAlert(message, commentDiv) {
    document.getElementById("problem-span-confirm").textContent = message;
    document.getElementById("alert-box-confirm").style.display = "flex";

    document.getElementById("confirm-alert-btn-confirm-sim").onclick = () => goAheadAlert(commentDiv);
    document.getElementById("confirm-alert-btn-confirm-nao").onclick = closeConfirmAlert;
}

function closeConfirmAlert() {
    document.getElementById("alert-box-confirm").style.display = "none";
}

// Funções de autenticação
function checkPassword() {
    const passwordInput = document.getElementById("passwordInput").value;
    const alertBox = document.getElementById("customAlert");

    fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.validatePassword}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: passwordInput })
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            document.getElementById("devScreen").style.display = "none";
        } else {
            alertBox.style.display = "block";
            setTimeout(() => {
                alertBox.style.display = "none";
            }, 2000);
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        alertBox.textContent = "Erro ao validar a senha";
        alertBox.style.display = "block";
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 2000);
    });
}

function goHome() {
    window.location.href = "../Index.html";
}    