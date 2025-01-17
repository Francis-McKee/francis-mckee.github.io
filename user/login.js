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

// Forgot Password functionality
document.getElementById("forgot-password-link").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default link action

  const email = document.getElementById("login-email").value;

  if (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Email sent, notify the user
        alert("Password reset email sent! Check your inbox.");
      })
      .catch((error) => {
        // Handle errors here
        alert("Error: " + error.message);
      });
  } else {
    alert("Please enter your email address.");
  }
});

// Attach event listeners
document.getElementById("login-form").addEventListener("submit", loginUser);