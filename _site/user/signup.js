// Firebase initialization (from imports.html or a separate Firebase setup file)
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Initialize Firebase Authentication
const auth = getAuth();

// Handle sign-up
function signupUser(event) {
  event.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User signed up successfully
      const user = userCredential.user;
      console.log("User signed up:", user);

      // Redirect to a protected page (replace with your page)
      window.location.href = "/user/dashboard.html";
    })
    .catch((error) => {
      console.error("Sign-up error:", error.message);
      alert("Error: " + error.message);
    });
}

// Attach event listeners
document.getElementById("signup-form").addEventListener("submit", signupUser);
document.getElementById("toggle-signup-password-visibility").addEventListener("click", togglePasswordVisibility);
