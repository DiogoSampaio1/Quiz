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
    console.log("API_CONFIG:", window.API_CONFIG);
    console.log("Auth object exists:", !!window.Auth);
    
    // Verifica o usuário atual
    const currentUser = window.Auth ? window.Auth.checkAuthState() : null;
    console.log("Current user from Auth:", currentUser);

    // Adiciona a classe loaded ao container quando a página estiver pronta
    document.querySelector('.container').classList.add('loaded');

    // Variáveis para controle
    const publishBtn = document.getElementById('publishBtn');
    const commentInput = document.getElementById('commentInput');
    const commentsSection = document.getElementById('commentsSection');
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const confirmAlertBtn = document.getElementById('confirm-alert-btn');

    // Variável para controlar o modo de edição
    let currentEditMode = null;

    // Atualiza a UI baseado no estado de autenticação inicial
    if (currentUser) {
        console.log("Usuário está logado, habilitando comentários");
        updateUIForLoggedInUser();
    } else {
        console.log("Usuário não está logado, desabilitando comentários");
        updateUIForLoggedOutUser();
    }

    // Atualiza a UI para usuário logado
    function updateUIForLoggedInUser() {
        if (commentInput) commentInput.disabled = false;
        if (commentInput) commentInput.placeholder = "Deixa a tua avaliação (máximo de 200 caracteres)...";
        if (publishBtn) publishBtn.disabled = false;
    }

    // Atualiza a UI para usuário não logado
    function updateUIForLoggedOutUser() {
        if (commentInput) commentInput.disabled = true;
        if (commentInput) commentInput.placeholder = "Por favor, inicia sessão para deixar uma avaliação";
        if (publishBtn) publishBtn.disabled = true;
    }

    // Função para mostrar alertas
    function showAlert(message) {
        const alertBox = document.getElementById('alert-box');
        const problemSpan = document.getElementById('problem-span');
        if (alertBox && problemSpan) {
            problemSpan.textContent = message;
            alertBox.style.display = 'block';
        } else {
            alert(message);
        }
    }

    // Função para construir URL da API
    function buildApiUrl(endpoint) {
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
        return `${window.API_CONFIG.baseUrl}/${cleanEndpoint}`;
    }

    // Função para obter headers com autenticação
    function getAuthHeaders() {
        const currentUser = window.Auth ? window.Auth.checkAuthState() : null;
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-User-Name': currentUser ? currentUser.username : ''
        };
    }

    // Função para publicar novo comentário
    async function publishComment() {
        const currentUser = window.Auth ? window.Auth.checkAuthState() : null;
        if (!currentUser) {
            showAlert("Por favor, inicia sessão para deixar uma avaliação");
            return;
        }

        const commentText = commentInput.value.trim();
        if (!commentText) {
            showAlert("O comentário não pode estar vazio");
            return;
        }

        try {
            const url = buildApiUrl(window.API_CONFIG.endpoints.comment);
            console.log("Publicando comentário em:", url);
            console.log("Headers:", getAuthHeaders());
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify({
                    comentario: commentText,
                    username: currentUser.username // Incluindo o username no corpo da requisição
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao publicar comentário');
            }

            const newComment = await response.json();
            console.log("Comentário publicado:", newComment);

            // Limpa o input e recarrega os comentários
            commentInput.value = '';
            loadComments();
            
            // Mostra mensagem de sucesso
            showAlert("Comentário publicado com sucesso!");
        } catch (error) {
            console.error('Erro ao publicar comentário:', error);
            showAlert(error.message || 'Erro ao publicar o comentário. Por favor, tente novamente.');
        }
    }

    // Adiciona evento ao botão de publicar
    if (publishBtn) {
        publishBtn.addEventListener('click', publishComment);
    }

    // Adiciona evento de tecla para o input de comentário
    if (commentInput) {
        commentInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                publishComment();
            }
        });
    }

    // Função para mostrar alerta de confirmação
    function showConfirmAlert(message, onConfirm) {
        const alertBoxConfirm = document.getElementById('alert-box-confirm');
        const problemSpanConfirm = document.getElementById('problem-span-confirm');
        const btnSim = document.getElementById('confirm-alert-btn-confirm-sim');
        const btnNao = document.getElementById('confirm-alert-btn-confirm-nao');

        if (alertBoxConfirm && problemSpanConfirm && btnSim && btnNao) {
            problemSpanConfirm.textContent = message;
            alertBoxConfirm.style.display = 'block';

            btnSim.onclick = () => {
                onConfirm();
                alertBoxConfirm.style.display = 'none';
            };

            btnNao.onclick = () => {
                alertBoxConfirm.style.display = 'none';
            };
        }
    }

    // Função para remover comentário com confirmação
    function confirmRemoveComment(commentDiv) {
        showConfirmAlert(
            "Tens a certeza que queres remover este comentário?",
            () => removeComment(commentDiv)
        );
    }

    // Função para remover comentário
    async function removeComment(commentDiv) {
        const commentId = commentDiv.dataset.id;
        const userId = commentDiv.dataset.userId;

        if (!currentUser || currentUser._id !== userId) {
            showAlert("Você não tem permissão para remover este comentário");
            return;
        }

        try {
            const url = buildApiUrl(`${window.API_CONFIG.endpoints.comment}/${commentId}`);
            console.log("Removendo comentário:", url);
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Erro ao remover comentário');
            }

            loadComments();
        } catch (error) {
            console.error('Erro ao remover comentário:', error);
            showAlert('Erro ao remover o comentário. Por favor, tente novamente.');
        }
    }

    // Função para editar comentário
    async function saveEdit(commentDiv, editTextArea) {
        const commentId = commentDiv.dataset.id;
        const userId = commentDiv.dataset.userId;
        const newText = editTextArea.value.trim();

        if (!currentUser || currentUser._id !== userId) {
            showAlert("Você não tem permissão para editar este comentário");
            return;
        }

        if (!newText) {
            showAlert("O comentário não pode estar vazio");
            return;
        }

        try {
            const url = buildApiUrl(`${window.API_CONFIG.endpoints.comment}/${commentId}`);
            console.log("Atualizando comentário:", url);
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify({ comentario: newText })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar comentário');
            }

            loadComments();
        } catch (error) {
            console.error('Erro ao atualizar comentário:', error);
            showAlert('Erro ao atualizar o comentário. Por favor, tente novamente.');
        }
    }

    // Carregar avaliações ao iniciar a página
    async function loadComments() {
        try {
            const url = buildApiUrl(window.API_CONFIG.endpoints.comment);
            console.log("Fetching comments from:", url);
            
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const comentarios = await response.json();
            if (commentsSection) {
                commentsSection.innerHTML = '<h2>Avaliações Publicadas</h2>';
                
                comentarios.forEach((comentario) => {
                    createComment(comentario.comentario, comentario._id, comentario.username, comentario.userId);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
            showAlert('Erro ao carregar avaliações. Por favor, tente novamente mais tarde.');
        }
    }

    // Inicia o carregamento dos comentários
    loadComments();

    // Função para criar um novo comentário
    function createComment(commentText, id, username, userId) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.dataset.id = id;
        commentDiv.dataset.userId = userId;

        const commentHeader = document.createElement('div');
        commentHeader.classList.add('comment-header');
        commentHeader.textContent = username;

        const commentTextP = document.createElement('p');
        commentTextP.textContent = commentText;

        const commentActions = document.createElement('div');
        commentActions.classList.add('comment-actions');

        // Só mostra botões de edição/remoção se for o dono do comentário
        if (currentUser && currentUser._id === userId) {
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.classList.add('edit-btn');
            editBtn.onclick = () => toggleEdit(commentDiv, commentTextP, editBtn);
            commentActions.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Remover';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.onclick = () => confirmRemoveComment(commentDiv);
            commentActions.appendChild(deleteBtn);
        }

        commentDiv.appendChild(commentHeader);
        commentDiv.appendChild(commentTextP);
        commentDiv.appendChild(commentActions);
        commentsSection.appendChild(commentDiv);
    }

    // Atualizar visibilidade do menu lateral
    function toggleMenu() {
        sidebar.classList.toggle("open");
    }

    menuButton.addEventListener("click", toggleMenu);

    closeSidebar.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    // Função para ativar/desativar modo de edição
    function toggleEdit(commentDiv, textElement, editBtn) {
        if (currentEditMode) {
            // Se já existe um comentário em edição, cancela primeiro
            cancelEdit(currentEditMode);
        }

        const editTextArea = document.createElement('textarea');
        const maxLength = 200;
        const originalText = textElement.textContent;
        
        editTextArea.value = originalText;
        editTextArea.maxLength = maxLength;

        const charCountDiv = document.createElement('div');
        charCountDiv.classList.add('char-count');
        charCountDiv.textContent = `${maxLength - editTextArea.value.length} caracteres restantes`;

        // Atualiza o contador de caracteres
        editTextArea.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            charCountDiv.textContent = `${remaining} caracteres restantes`;
        });

        // Substitui o texto pelo textarea
        textElement.style.display = 'none';
        commentDiv.insertBefore(editTextArea, textElement);
        commentDiv.insertBefore(charCountDiv, editTextArea.nextSibling);
        editTextArea.focus();

        // Muda o botão de editar para salvar
        editBtn.textContent = 'Salvar';
        editBtn.classList.remove('edit-btn');
        editBtn.classList.add('save-btn');
        editBtn.onclick = () => saveEdit(commentDiv, editTextArea);

        // Desabilita o botão de remover durante a edição
        const deleteBtn = commentDiv.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.disabled = true;
        }

        // Adiciona botão de cancelar
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.classList.add('cancel-btn');
        cancelBtn.onclick = () => cancelEdit({
            commentDiv,
            textElement,
            editBtn,
            editTextArea,
            charCountDiv,
            cancelBtn,
            originalText
        });
        commentDiv.querySelector('.comment-actions').appendChild(cancelBtn);

        // Adiciona handler para teclas
        editTextArea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveEdit(commentDiv, editTextArea);
            } else if (e.key === 'Escape') {
                cancelEdit({
                    commentDiv,
                    textElement,
                    editBtn,
                    editTextArea,
                    charCountDiv,
                    cancelBtn,
                    originalText
                });
            }
        });

        // Guarda o estado de edição atual
        currentEditMode = {
            commentDiv,
            textElement,
            editBtn,
            editTextArea,
            charCountDiv,
            cancelBtn,
            originalText
        };
    }

    // Função para cancelar edição
    function cancelEdit(editMode) {
        const {
            commentDiv,
            textElement,
            editBtn,
            editTextArea,
            charCountDiv,
            cancelBtn,
            originalText
        } = editMode;

        // Restaura o texto original
        textElement.textContent = originalText;
        textElement.style.display = 'block';

        // Remove elementos de edição
        editTextArea.remove();
        charCountDiv.remove();
        cancelBtn.remove();

        // Restaura o botão de editar
        editBtn.textContent = 'Editar';
        editBtn.classList.remove('save-btn');
        editBtn.classList.add('edit-btn');
        editBtn.onclick = () => toggleEdit(commentDiv, textElement, editBtn);

        // Reabilita o botão de remover
        const deleteBtn = commentDiv.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.disabled = false;
        }

        currentEditMode = null;
    }

    // Adiciona handler para o botão OK do alerta
    if (confirmAlertBtn) {
        confirmAlertBtn.addEventListener('click', function() {
            const alertBox = document.getElementById('alert-box');
            if (alertBox) {
                alertBox.style.display = 'none';
            }
        });
    }
});

function goHome() {
    window.location.href = "../Index.html";
}    