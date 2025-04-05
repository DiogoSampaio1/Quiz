const API_URL = 'https://quiz-ivory-chi.vercel.app';

// Configurações da API
const API_CONFIG = {
    baseUrl: API_URL,
    endpoints: {
        login: `${API_URL}/api/login`,
        register: `${API_URL}/api/register`,
        validatePassword: `${API_URL}/api/validate-password`,
        quizzes: `${API_URL}/api/quizzes`,
        quiz: `${API_URL}/api/quiz`
    }
};

// Exporta a configuração
window.API_CONFIG = API_CONFIG; 