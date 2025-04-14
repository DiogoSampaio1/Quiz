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
    }
}

function clearAuthState() {
    localStorage.removeItem('currentUser');
}

function syncAuthState() {
    const user = checkAuthState();
    if (user) {
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
    window.Auth.syncAuthState();
}); 