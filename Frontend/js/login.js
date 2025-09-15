document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please fill in all fields'
      });
      return;
    }

    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();
      console.log(result); // debug: check backend response

      if (response.ok) {
        // store JWT token
        localStorage.setItem("token", result.data.accessToken);

        const userName = result.data.name || "User";
        const userRole = result.data.role || "USER";

        // Greeting message: Admin vs Normal User
        const greeting = (userRole.toUpperCase() === "ADMIN") ? "Admin" : userName;

        Swal.fire({
          icon: 'success',
          title: `Hello ${greeting}!`,
          text: 'Welcome to SalonEase',
          confirmButtonText: 'Continue'
        }).then(() => {
          if (userRole.toUpperCase() === "ADMIN") {
            window.location.href = "admindashboard.html";
          } else {
            window.location.href = "customerdashboard.html";
          }
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: result.message || 'Invalid credentials'
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again.'
      });
    }
  });
});
