// Firebase setup and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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

// Helper function to handle Firebase error codes
function handleFirebaseError(error, type) {
  let message;
  switch (error.code) {
    case "auth/invalid-email":
      message = `${type} email address is not valid.`;
      break;
    case "auth/operation-not-allowed":
      message = "This email address is already in use by another account.";
      break;
    case "auth/requires-recent-login":
      message = "Please log in again to change your email.";
      break;
    case "auth/too-many-requests":
      message = "Too many requests. Please try again later.";
      break;
    case "auth/invalid-credential":
      message = "The password is incorrect. Please try again.";
      break;
    case "auth/user-not-found":
      message = "No user found with the provided credentials.";
      break;
    default:
      message = "An unexpected error occurred.";
  }
  return message;
}

// Function to display Firebase error message
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

// Function to handle email change
document.getElementById("change-email-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const newEmail = document.getElementById("new-email").value;
  const password = document.getElementById("password").value;
  const user = auth.currentUser;

  // Check if the new email is the same as the current email
  if (newEmail === user.email) {
    displayMessage("email-change-message", "Your new email address cannot be the same as your current email.", true);
    return; // Stop further execution if the email is the same
  }

  // Reauthenticate the user
  const credential = EmailAuthProvider.credential(user.email, password);

  reauthenticateWithCredential(user, credential)
    .then(() => {
      // Reauthentication successful, now update email
      updateEmail(user, newEmail)
        .then(() => {
          document.getElementById("email-change-message").textContent = "Email updated successfully!";
        })
        .catch((error) => {
          console.log("Error Code:", error.code); // debugging line
          console.log("Error Message:", error.message); // debugging line
          
          // Use the helper function to get the error message
          let message = handleFirebaseError(error, 'Email update');
          displayMessage("email-change-message", message, true);
        });
    })
    .catch((error) => {
      // Use the helper function to get the error message
      let message = handleFirebaseError(error, 'Reauthentication');
      displayMessage("email-change-message", message, true);
    });
});