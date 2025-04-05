const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://quiz-ivory-chi.vercel.app';

// Configurações da API
const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        login: `${API_BASE_URL}/api/login`,
        register: `${API_BASE_URL}/api/register`,
        validatePassword: `${API_BASE_URL}/api/validate-password`,
        quizzes: `${API_BASE_URL}/api/quizzes`,
        quiz: `${API_BASE_URL}/api/quiz`
    }
};

// Exporta a configuração para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} else {
    window.API_CONFIG = API_CONFIG;
} 