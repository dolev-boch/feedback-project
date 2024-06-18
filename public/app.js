document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const messageDiv = document.getElementById("message");
  const loggedInContent = document.getElementById("loggedInContent");
  const greetingDiv = document.getElementById("greeting");
  const logoutLink = document.getElementById("logout");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${username}&password=${password}`,
      });

      const data = await response.text();
      messageDiv.innerHTML = data; // Display response message

      // Check if login was successful
      if (response.ok && data.includes("successful")) {
        greetingDiv.textContent = `Hello ${username} - You are already logged in.`;
        loggedInContent.style.display = "block";
        loginForm.style.display = "none"; // Hide login form
      }
    } catch (error) {
      console.error("Error during login:", error);
      messageDiv.innerHTML = "<h1>Server error</h1>"; // Display server error message
    }
  });

  // Logout functionality
  logoutLink.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/logout", {
        method: "POST",
      });

      if (response.ok) {
        loggedInContent.style.display = "none";
        loginForm.style.display = "block"; // Show login form again
        messageDiv.textContent = "You have been logged out.";
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  });
});
