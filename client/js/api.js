const API_URL = 'http://localhost:5000/api';

// Helper function to manage standard headers with authorization
function getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// Global API object to handle fetch operations smoothly
const api = {
    // Perform HTTP GET request
    async get(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`GET request error at ${endpoint}:`, error);
            throw error;
        }
    },

    // Perform HTTP POST request
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`POST request error at ${endpoint}:`, error);
            throw error;
        }
    },

    // Perform HTTP PUT request
    async put(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`PUT request error at ${endpoint}:`, error);
            throw error;
        }
    },

    // Perform HTTP DELETE request
    async delete(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`DELETE request error at ${endpoint}:`, error);
            throw error;
        }
    }
};

// Unified response parser and error validator
async function handleResponse(response) {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        // If unauthenticated, kick out to login page
        if (response.status === 401) {
            localStorage.clear();
            if (!window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('register.html')) {
                window.location.href = 'login.html';
            }
        }
        const errorMsg = (data && data.message) || response.statusText;
        throw new Error(errorMsg);
    }
    return data;
}