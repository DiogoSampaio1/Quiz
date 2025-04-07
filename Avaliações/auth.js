// Função para verificar se há um usuário logado no localStorage
function checkAuthState() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error('Erro ao parsear usuário:', e);
            return null;
        }
    }
    return null;
}

// Função para salvar o usuário no localStorage
function setAuthState(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

// Função para remover o usuário do localStorage
function clearAuthState() {
    localStorage.removeItem('currentUser');
}

// Exporta as funções para uso global
window.Auth = {
    checkAuthState,
    setAuthState,
    clearAuthState
}; 