document.addEventListener('DOMContentLoaded', () => {
    // Redirect user to home workspace if already authenticated
    if (localStorage.getItem('token')) {
        window.location.href = 'home.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const errorAlert = document.getElementById('errorAlert');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hide existing alerts
        errorAlert.style.display = 'none';
        errorAlert.textContent = '';

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            // Post authentication credentials using the API utility
            const data = await api.post('/auth/login', { email, password });
            
            // Store session parameters securely in browser LocalStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userId', data._id);

            // Forward verified user directly to their application interface workspace
            window.location.href = 'home.html';
        } catch (error) {
            // Surface errors cleanly into alert interface elements
            errorAlert.textContent = error.message || 'Login failed. Please verify credentials.';
            errorAlert.style.display = 'block';
        }
    });
});