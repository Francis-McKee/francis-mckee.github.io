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
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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

// Handle sign-up
function signupUser(event) {
  event.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    displayMessage("signup-message", "Passwords do not match. Please try again.", true);
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User signed up successfully
      const user = userCredential.user;
      console.log("User signed up:", user);

      // Redirect to a protected page
      window.location.href = "/user/dashboard.html";
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        displayMessage("signup-message", "This email is already registered. Please log in or use a different email.", true);
      } else {
        displayMessage("signup-message", error.message, true);
      }
    });
}

// Attach event listeners
document.getElementById("signup-form").addEventListener("submit", signupUser);
