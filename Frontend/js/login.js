document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  // Default admin credentials
  const defaultAdmin = {
    name: "Admin",
    email: "admin@salonease.com",
    password: "admin123"
  };

  // Store your access token (you can get this from localStorage, sessionStorage, or a secure storage)


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

    // Check if login is default admin
    // if (email === defaultAdmin.email && password === defaultAdmin.password) {
    //   localStorage.setItem("token", "admin-token"); // dummy token for admin
    //   Swal.fire({
    //     icon: 'success',
    //     title: `Hello ${defaultAdmin.name}!`,
    //     text: 'Welcome to SalonEase',
    //     confirmButtonText: 'Continue'
    //   }).then(() => {
    //     window.location.href = "admindashboard.html";
    //   });
    //   return;
    // }

    // Normal login for other users
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

        Swal.fire({
          icon: 'success',
          title: `Hello ${userName}!`,
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
