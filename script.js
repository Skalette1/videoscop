document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const guestLoginBtn = document.getElementById('guest-login');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const loginDiv = document.getElementById('login-form');
    const registerDiv = document.getElementById('register-form');

    // Переключение видимости пароля
    const loginPasswordField = document.getElementById('login-password');
    const registerPasswordField = document.getElementById('register-password');
    const passwordIcons = document.querySelectorAll('#password');

    passwordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const passwordField = icon.previousElementSibling; // Получаем поле пароля
            if (passwordField.getAttribute('type') === "password") {
                passwordField.setAttribute('type', 'text');
            } else {
                passwordField.setAttribute('type', 'password');
            }
        });
    });

    // Переключение между формами
    showRegisterBtn.addEventListener('click', () => {
        loginDiv.style.display = 'none';
        registerDiv.style.display = 'block';
    });

    showLoginBtn.addEventListener('click', () => {
        registerDiv.style.display = 'none';
        loginDiv.style.display = 'block';
    });

    // Обработка входа
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!document.getElementById('login-agree').checked) {
            alert('Пожалуйста, согласитесь с политикой конфиденциальности.');
            return;
        }

        const userData = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value,
            remember: document.getElementById('remember-me').checked,
            role: 'user'
        };

        if (userData.remember) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
        }
        window.location.href = 'home.html';
    });

    // Обработка регистрации
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!document.getElementById('register-agree').checked) {
            alert('Пожалуйста, согласитесь с политикой конфиденциальности.');
            return;
        }

        const newUser = {
            username: document.getElementById('register-username').value,
            password: document.getElementById('register-password').value,
            email: document.getElementById('register-email').value,
            name: document.getElementById('register-name').value, // Используем поле name
            role: 'user'
        };

        // Проверка уникальности пользователя
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.email === newUser.email)) {
            alert('Пользователь с таким email уже существует!');
            return;
        }

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = 'home.html';
    });

    // Гостевой вход
    guestLoginBtn.addEventListener('click', () => {
        if (!document.getElementById('login-agree').checked) {
            alert('Пожалуйста, согласитесь с политикой конфиденциальности.');
            return;
        }

        const guestUser = {
            role: 'guest',
            timestamp: new Date().getTime()
        };

        localStorage.setItem('currentUser', JSON.stringify(guestUser));
        window.location.href = 'home.html';
    });

    // Автопроверка авторизации
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'home.html';
    }
});