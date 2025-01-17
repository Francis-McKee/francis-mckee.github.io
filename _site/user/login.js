// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBTiBF5JvaVgEl3R19KNN1RaKaozebiqk",
  authDomain: "fnmckee-authentication.firebaseapp.com",
  projectId: "fnmckee-authentication",
  storageBucket: "fnmckee-authentication.firebasestorage.app",
  messagingSenderId: "66512560822",
  appId: "1:66512560822:web:09f3514888d4e00f0abc17",
  measurementId: "G-KTMMERNNHN"
};

// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

function displayMessage(elementId, message, isError = true) {
  const messageContainer = document.getElementById(elementId);
  messageContainer.textContent = message;
  messageContainer.classList.remove("error", "success");
  messageContainer.classList.add(isError ? "error" : "success");
  messageContainer.style.display = "block";

  // Hide message after 5 seconds
  setTimeout(() => {
    messageContainer.style.display = "none";
  }, 5000);
}

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
      console.log("Error Code:", error.code); // debugging line
      console.log("Error Message:", error.message); // debugging line

      // Map Firebase error codes to custom messages
      let message;
      switch (error.code) {
        case "auth/user-not-found":
          message = "No user found with this email address.";
          break;
        case "auth/wrong-password":
          message = "Invalid password. Please try again.";
          break;
        case "auth/too-many-requests":
          message = "Too many login attempts. Please try again later.";
          break;
        case "auth/invalid-email":
          message = "The email address is not valid.";
          break;
        case "auth/invalid-credential":
          message = "Invalid credentials. Please try logging in again.";
          break;
        default:
          message = "An unexpected error occurred. Please try again.";
      }
      displayMessage("login-message", message, true);
    });
}

// Forgot Password functionality
document.getElementById("forgot-password-link").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default link action

  const email = document.getElementById("login-email").value;

  if (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Email sent, notify the user
        displayMessage("login-message", "Password reset email sent. Please check your inbox.", false);
      })
      .catch((error) => {
        // Handle errors here
        displayMessage("login-message", error.message, true);
      });
  } else {
    displayMessage("login-message", "Please enter your email address to reset your password.", true);
  }
});

// Attach event listeners
document.getElementById("login-form").addEventListener("submit", loginUser);