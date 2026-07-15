document.addEventListener('DOMContentLoaded', () => {
    // Redirect user to home workspace if already authenticated
    if (localStorage.getItem('token')) {
        window.location.href = 'home.html';
        return;
    }

    const registerForm = document.getElementById('registerForm');
    const errorAlert = document.getElementById('errorAlert');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hide existing alerts
        errorAlert.style.display = 'none';
        errorAlert.textContent = '';

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            // Post sign-up payloads using the global API endpoint utility
            const data = await api.post('/auth/register', { name, email, password });
            
            // Auto-login user by capturing session parameters directly in LocalStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userId', data._id);

            // Forward verified user directly to their application interface workspace
            window.location.href = 'home.html';
        } catch (error) {
            // Surface errors cleanly into alert interface elements
            errorAlert.textContent = error.message || 'Registration failed. Please try again.';
            errorAlert.style.display = 'block';
        }
    });
});