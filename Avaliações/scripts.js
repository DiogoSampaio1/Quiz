// Adiciona classe js-loading ao body imediatamente
document.body.classList.add('js-loading');

// Função para remover o preloader e mostrar o conteúdo
function removePreloader() {
    const preloader = document.getElementById('preloader');
    const container = document.querySelector('.container');
    
    // Remove o preloader com fade
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300); // Tempo igual à transição CSS
    }
    
    // Mostra o conteúdo com fade
    if (container) {
        setTimeout(() => {
            container.classList.add('visible');
            document.body.classList.remove('js-loading');
        }, 100);
    }
}

// Espera todos os recursos carregarem
window.addEventListener('load', removePreloader);

document.addEventListener("DOMContentLoaded", function () {
    // Adiciona a classe loaded ao container quando a página estiver pronta
    document.querySelector('.container').classList.add('loaded');

    console.log("API_CONFIG:", window.API_CONFIG);

    // Variáveis para controle
    const publishBtn = document.getElementById('publishBtn');
    const commentInput = document.getElementById('commentInput');
    const commentsSection = document.getElementById('commentsSection');
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');

    // Função para construir URL da API
    function buildApiUrl(endpoint) {
        return `${window.API_CONFIG.baseUrl}${endpoint}`;
    }

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
            const response = await fetch(buildApiUrl(window.API_CONFIG.endpoints.comment));
            if (!response.ok) throw new Error('Erro ao carregar avaliações');
            
            const comentarios = await response.json();
            commentsSection.innerHTML = '<h2>Avaliações Publicadas</h2>';
            
            comentarios.forEach((comentario) => {
                createComment(comentario.comentario, comentario._id);
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
            const response = await fetch(buildApiUrl(`${window.API_CONFIG.endpoints.comment}/${commentId}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comentario: newText })
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
        showConfirmAlert('Tens a certeza que queres remover este comentário?', commentDiv);
    }

    // Função para confirmar remoção
    async function goAheadAlert(commentDiv) {
        const commentId = commentDiv.dataset.id;

        try {
            const response = await fetch(buildApiUrl(`${window.API_CONFIG.endpoints.comment}/${commentId}`), {
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
            const response = await fetch(buildApiUrl(window.API_CONFIG.endpoints.comment), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comentario: commentText })
            });

            if (!response.ok) throw new Error('Erro ao publicar avaliação');

            const novoComentario = await response.json();
            createComment(commentText, novoComentario._id);
            commentInput.value = '';
        } catch (error) {
            console.error('Erro:', error);
            showAlert('Erro ao publicar avaliação. Tente novamente.');
        }
    };

    // Funções de alerta
    function showAlert(message) {
        document.getElementById("problem-span").textContent = message;
        document.getElementById("alert-box").style.display = 'flex';
    }

    function closeAlert() {
        document.getElementById("alert-box").style.display = 'none';
    }

    function showConfirmAlert(message, commentDiv) {
        document.getElementById("problem-span-confirm").textContent = message;
        document.getElementById("alert-box-confirm").style.display = "flex";

        document.getElementById("confirm-alert-btn-confirm-sim").onclick = () => goAheadAlert(commentDiv);
        document.getElementById("confirm-alert-btn-confirm-nao").onclick = closeConfirmAlert;
    }

    function closeConfirmAlert() {
        document.getElementById("alert-box-confirm").style.display = "none";
    }
});

function goHome() {
    window.location.href = "../Index.html";
}    