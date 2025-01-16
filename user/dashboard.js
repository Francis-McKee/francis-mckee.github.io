// Firebase initialization (from imports.html or a separate Firebase setup file)
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Initialize Firebase Authentication
const auth = getAuth();

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    document.getElementById("user-email").textContent = user.email;
  } else {
    // User is not signed in, redirect to login page
    window.location.href = "login.html";
  }
});

// Handle logout
document.getElementById("logout-button").addEventListener("click", () => {
  signOut(auth).then(() => {
    // Sign-out successful, redirect to login page
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Logout error:", error.message);
    alert("Error: " + error.message);
  });
});
