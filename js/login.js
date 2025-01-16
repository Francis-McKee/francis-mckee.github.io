// Function to toggle password visibility
function togglePasswordVisibility(passwordFieldId, iconId) {
    const passwordField = document.getElementById(passwordFieldId);
    const icon = document.getElementById(iconId);

    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      passwordField.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
}

// Add event listeners for the login form toggle
document.getElementById('login-password-toggle').addEventListener('click', () => {
    togglePasswordVisibility('login-password', 'login-password-toggle');
});

// Add event listeners for the sign-up form toggle
document.getElementById('signup-password-toggle').addEventListener('click', () => {
    togglePasswordVisibility('signup-password', 'signup-password-toggle');
});

// Toggle Between Login and Sign-Up Forms
  document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

// Sign up
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert('User signed up successfully!');
        signupForm.reset();
    } catch (error) {
        alert(error.message);
    }
});

// Login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('User logged in successfully!');
        loginForm.reset();
        document.getElementById('logout-button').style.display = 'block';
    } catch (error) {
        alert(error.message);
    }
});

// Logout
const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', async () => {
    try {
        await auth.signOut();
        alert('User logged out successfully!');
        logoutButton.style.display = 'none';
    } catch (error) {
        alert(error.message);
    }
});

// Redirect or Show Content Based on Authentication State
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is logged in:', user.email);
        // Show protected content
    } else {
        console.log('User is logged out');
        // Redirect or hide protected content
    }
});