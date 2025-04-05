// URL base da API
const API_BASE_URL = 'https://quiz-ivory-chi.vercel.app';

// Configuração da API
window.API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        login: `${API_BASE_URL}/api/login`,
        register: `${API_BASE_URL}/api/register`,
        validatePassword: `${API_BASE_URL}/api/validate-password`,
        quizzes: `${API_BASE_URL}/api/quizzes`,
        quiz: `${API_BASE_URL}/api/quiz`
    }
}; 