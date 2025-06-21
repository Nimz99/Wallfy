// Login credentials
const ADMIN_USERNAME = 'nimzbro';
const ADMIN_PASSWORD = '6127';

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('wallfy_admin_logged_in');
    if (isLoggedIn === 'true') {
        // User is already logged in, redirect to admin panel
        window.location.href = 'admin.html';
    }
    
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
    
    // Allow login with Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.tagName === 'INPUT') {
                handleLogin(e);
            }
        }
    });
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Login successful
        localStorage.setItem('wallfy_admin_logged_in', 'true');
        localStorage.setItem('wallfy_admin_username', username);
        localStorage.setItem('wallfy_admin_login_time', new Date().toISOString());
        
        // Show success message briefly before redirecting
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to admin panel after a short delay
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        // Login failed
        showMessage('Invalid username or password', 'error');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Show message
function showMessage(text, type = 'info') {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = text;
    
    // Update styling based on message type
    errorMessage.className = 'error-message';
    if (type === 'success') {
        errorMessage.style.background = '#28a745';
        errorMessage.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.3)';
    } else if (type === 'error') {
        errorMessage.style.background = '#dc3545';
        errorMessage.style.boxShadow = '0 5px 15px rgba(220, 53, 69, 0.3)';
    }
    
    // Show message
    errorMessage.classList.add('show');
    
    // Hide message after 3 seconds
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
} 