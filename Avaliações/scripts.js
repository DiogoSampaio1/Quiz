document.body.classList.add('js-loading');

function removePreloader() {
    const preloader = document.getElementById('preloader');
    const container = document.querySelector('.container');
    
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300); 
    }
    
    if (container) {
        setTimeout(() => {
            container.classList.add('visible');
            document.body.classList.remove('js-loading');
        }, 100);
    }
}

window.addEventListener('load', removePreloader);

document.addEventListener("DOMContentLoaded", function () {
    
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    const currentUser = window.Auth ? window.Auth.checkAuthState() : null;
    console.log("Current user from Auth:", currentUser);

    document.querySelector('.container').classList.add('loaded');

    const themeToggle = document.getElementById("theme-toggle");
    const publishBtn = document.getElementById('publishBtn');
    const commentInput = document.getElementById('commentInput');
    const commentsSection = document.getElementById('commentsSection');
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const confirmAlertBtn = document.getElementById('confirm-alert-btn');

    let currentEditMode = null;

     // 🌓 Modo Escuro - Aplica estado inicial
     if (themeToggle) {
        themeToggle.checked = localStorage.getItem("darkMode") === "enabled";

        themeToggle.addEventListener("change", function () {
            document.body.classList.toggle("dark-mode", themeToggle.checked);
            localStorage.setItem("darkMode", themeToggle.checked ? "enabled" : "disabled");
        });
    }

    if (currentUser) {
        console.log("Utilizador está logado, comentários habilitados");
        updateUIForLoggedInUser();
    } else {
        console.log("Utilizador não está logado, comentários desabilitados");
        updateUIForLoggedOutUser();
    }

    function updateUIForLoggedInUser() {
        if (commentInput) commentInput.disabled = false;
        if (commentInput) commentInput.placeholder = "Deixa a tua avaliação (máximo de 200 caracteres)...";
        if (publishBtn) publishBtn.disabled = false;
    }

    function updateUIForLoggedOutUser() {
        if (commentInput) commentInput.disabled = true;
        if (commentInput) commentInput.placeholder = "Por favor, inicia sessão para deixar uma avaliação";
        if (publishBtn) publishBtn.disabled = true;
    }

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

    function buildApiUrl(endpoint) {
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
        return `${window.API_CONFIG.baseUrl}/${cleanEndpoint}`;
    }

    function getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

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
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify({
                    comentario: commentText,
                    username: currentUser.username
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao publicar comentário');
            }

            const newComment = await response.json();

            commentInput.value = '';
            loadComments();
            
            showAlert("Comentário publicado com sucesso!");
        } catch (error) {
            console.error('Erro ao publicar comentário:', error);
            showAlert(error.message || 'Erro ao publicar o comentário. Por favor, tente novamente.');
        }
    }

    if (publishBtn) {
        publishBtn.addEventListener('click', publishComment);
    }

    if (commentInput) {
        commentInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                publishComment();
            }
        });
    }

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

    function confirmRemoveComment(commentDiv) {
        showConfirmAlert(
            "Tens a certeza que queres remover este comentário?",
            () => removeComment(commentDiv)
        );
    }

    async function removeComment(commentDiv) {
        const commentId = commentDiv.dataset.id;
        const username = commentDiv.dataset.username;

        const currentUser = window.Auth ? window.Auth.checkAuthState() : null;
        if (!currentUser || currentUser.username !== username) {
            showAlert("Você não tem permissão para remover este comentário");
            return;
        }

        try {
            const url = buildApiUrl(`${window.API_CONFIG.endpoints.comment}/${commentId}`);
            
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

    async function saveEdit(commentDiv, editTextArea) {
        const commentId = commentDiv.dataset.id;
        const username = commentDiv.dataset.username;
        const newText = editTextArea.value.trim();

        const currentUser = window.Auth ? window.Auth.checkAuthState() : null;
        if (!currentUser || currentUser.username !== username) {
            showAlert("Você não tem permissão para editar este comentário");
            return;
        }

        if (!newText) {
            showAlert("O comentário não pode estar vazio");
            return;
        }

        try {
            const url = buildApiUrl(`${window.API_CONFIG.endpoints.comment}/${commentId}`);
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify({ 
                    comentario: newText,
                    username: currentUser.username
                })
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

    async function loadComments() {
        try {
            const url = buildApiUrl(window.API_CONFIG.endpoints.comment);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const comentarios = await response.json();
            if (commentsSection) {
                commentsSection.innerHTML = '<h2>Avaliações Publicadas</h2>';
                
                comentarios.forEach((comentario) => {
                    createComment(comentario.comentario, comentario._id, comentario.username);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
            showAlert('Erro ao carregar avaliações. Por favor, tente novamente mais tarde.');
        }
    }

    loadComments();

    function createComment(commentText, id, username) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.dataset.id = id;
        commentDiv.dataset.username = username;

        const commentHeader = document.createElement('div');
        commentHeader.classList.add('comment-header');
        commentHeader.textContent = username;

        const commentTextP = document.createElement('p');
        commentTextP.textContent = commentText;

        const commentActions = document.createElement('div');
        commentActions.classList.add('comment-actions');

        if (currentUser && currentUser.username === username) {
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

    function toggleMenu() {
        sidebar.classList.toggle("open");
    }

    menuButton.addEventListener("click", toggleMenu);

    closeSidebar.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    function toggleEdit(commentDiv, textElement, editBtn) {
        if (currentEditMode) {
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

        editTextArea.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            charCountDiv.textContent = `${remaining} caracteres restantes`;
        });

        textElement.style.display = 'none';
        commentDiv.insertBefore(editTextArea, textElement);
        commentDiv.insertBefore(charCountDiv, editTextArea.nextSibling);
        editTextArea.focus();

        editBtn.textContent = 'Salvar';
        editBtn.classList.remove('edit-btn');
        editBtn.classList.add('save-btn');
        editBtn.onclick = () => saveEdit(commentDiv, editTextArea);

        const deleteBtn = commentDiv.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.disabled = true;
        }

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

        textElement.textContent = originalText;
        textElement.style.display = 'block';

        editTextArea.remove();
        charCountDiv.remove();
        cancelBtn.remove();

        editBtn.textContent = 'Editar';
        editBtn.classList.remove('save-btn');
        editBtn.classList.add('edit-btn');
        editBtn.onclick = () => toggleEdit(commentDiv, textElement, editBtn);

        const deleteBtn = commentDiv.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.disabled = false;
        }

        currentEditMode = null;
    }

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