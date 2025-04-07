function checkAuthState() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            console.log('Utilizador encontrado:', user); 
            return user;
        } catch (e) {
            console.error('Erro ao parsear Utilizador:', e);
            localStorage.removeItem('currentUser'); 
            return null;
        }
    }
    console.log('Nenhum Utilizador encontrado no localStorage');
    return null;
}

function setAuthState(user) {
    if (user) {
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log('Utilizador salvo:', user); 
        } catch (e) {
            console.error('Erro ao salvar Utilizador:', e);
        }
    } else {
        localStorage.removeItem('currentUser');
        console.log('Utilizador removido do localStorage'); 
    }
}

function clearAuthState() {
    localStorage.removeItem('currentUser');
    console.log('Estado de autenticação limpo');
}

function syncAuthState() {
    const user = checkAuthState();
    if (user) {
        console.log('Estado de autenticação sincronizado:', user);
        return user;
    }
    return null;
}

window.Auth = {
    checkAuthState,
    setAuthState,
    clearAuthState,
    syncAuthState
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js carregado');
    window.Auth.syncAuthState();
}); 