import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
const auth = getAuth();

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

