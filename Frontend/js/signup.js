const authSignup = (function() {

    const apiBase = 'http://localhost:8080';

    // AJAX helper
    async function ajax(url, method = 'GET', data = null) {
        const resp = await fetch(apiBase + url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : null
        });
        return resp.json();
    }

    // Signup form submit handler
    async function signup(event) {
        event.preventDefault();

        const username = document.getElementById('name').value.trim(); // name field
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();
        const errorMsg = document.getElementById('errorMsg');
        if(errorMsg) errorMsg.textContent = '';

        if (!username || !email || !password || !confirmPassword) {
            if(errorMsg) errorMsg.textContent = "Please fill in all fields.";
            return;
        }

        if (password !== confirmPassword) {
            if(errorMsg) errorMsg.textContent = "Passwords do not match.";
            return;
        }

        const registerData = {
            username,
            email,
            password,
            confirmPassword,
            role: "USER"
        };

        try {
            const data = await ajax('/auth/register', 'POST', registerData);
            console.log('Register response:', data);

            // SweetAlert success with dynamic username
            Swal.fire({
                icon: 'success',
                title: `Hello ${username}!`,
                text: 'Registration successful 🎉 You will be redirected to login page.',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = "login.html";
            });

        } catch(err) {
            console.error(err);
            if(errorMsg) errorMsg.textContent = err.message || "Registration failed.";
        }
    }

    return { signup };

})();

// Attach signup form listener
if (document.querySelector("form")) {
    document.querySelector("form").addEventListener('submit', authSignup.signup);
}
