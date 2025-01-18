import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Get the login link element
const loginLink = document.getElementById("login-link");

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in
      loginLink.textContent = "My Dashboard";
      loginLink.href = "/user/dashboard.html";
    } else {
      // User is logged out
      loginLink.textContent = "Login";
      loginLink.href = "/user/login.html";
    }
});