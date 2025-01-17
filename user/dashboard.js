// Firebase setup and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration (use your own config here)
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
const auth = getAuth(app); // Pass the app to getAuth


// Check if the user is logged in
onAuthStateChanged(auth, (user) => {
  const userEmail = document.getElementById("user-email");
  const protectedContent = document.getElementById("protected-content");
  const logoutButton = document.getElementById("logout-button");

  if (user) {
    // User is logged in
    userEmail.textContent = user.email;
    protectedContent.style.display = "block"; // Show protected content
  } else {
    // No user is logged in, redirect to login page
    window.location.href = "/user/login.html";
  }

  // Logout functionality
  logoutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        window.location.href = "/user/login.html"; // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Error logging out:", error.message);
      });
  });
});

