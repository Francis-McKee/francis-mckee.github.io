// Firebase initialization (from imports.html or a separate Firebase setup file)
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Initialize Firebase Authentication
const auth = getAuth();

// Handle login
function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User logged in successfully
      const user = userCredential.user;
      console.log("User logged in:", user);

      // Redirect to a protected page (replace with your page)
      window.location.href = "/user/dashboard.html";
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      alert("Error: " + error.message);
    });
}

// Password visibility toggle
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("login-password");
  const toggleIcon = document.getElementById("toggle-login-password-visibility");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  }
}

// Attach event listeners
document.getElementById("login-form").addEventListener("submit", loginUser);
document.getElementById("toggle-login-password-visibility").addEventListener("click", togglePasswordVisibility);

