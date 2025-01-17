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
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

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
