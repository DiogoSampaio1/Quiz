// Função para verificar se há um usuário logado no localStorage
function checkAuthState() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            console.log('Usuário encontrado:', user); // Debug log
            return user;
        } catch (e) {
            console.error('Erro ao parsear usuário:', e);
            localStorage.removeItem('currentUser'); // Limpa dados inválidos
            return null;
        }
    }
    console.log('Nenhum usuário encontrado no localStorage'); // Debug log
    return null;
}

// Função para salvar o usuário no localStorage
function setAuthState(user) {
    if (user) {
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log('Usuário salvo:', user); // Debug log
        } catch (e) {
            console.error('Erro ao salvar usuário:', e);
        }
    } else {
        localStorage.removeItem('currentUser');
        console.log('Usuário removido do localStorage'); // Debug log
    }
}

// Função para remover o usuário do localStorage
function clearAuthState() {
    localStorage.removeItem('currentUser');
    console.log('Estado de autenticação limpo'); // Debug log
}

// Função para verificar e sincronizar o estado de autenticação
function syncAuthState() {
    const user = checkAuthState();
    if (user) {
        console.log('Estado de autenticação sincronizado:', user);
        return user;
    }
    return null;
}

// Exporta as funções para uso global
window.Auth = {
    checkAuthState,
    setAuthState,
    clearAuthState,
    syncAuthState
};

// Sincroniza o estado de autenticação quando o script é carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js carregado');
    window.Auth.syncAuthState();
}); 