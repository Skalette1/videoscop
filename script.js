document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const guestLoginBtn = document.getElementById('guest-login');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const loginDiv = document.getElementById('login-form');
    const registerDiv = document.getElementById('register-form');
    const startTraining  = document.getElementById('start-training')

    const loginPasswordField = document.getElementById('login-password');
    const registerPasswordField = document.getElementById('register-password');
    const passwordIcons = document.querySelectorAll('#password');

    passwordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const passwordField = icon.previousElementSibling;
            if (passwordField.getAttribute('type') === "password") {
                passwordField.setAttribute('type', 'text');
            } else {
                passwordField.setAttribute('type', 'password');
            }
        });
    });

    showRegisterBtn.addEventListener('click', () => {
        loginDiv.style.display = 'none';
        registerDiv.style.display = 'block';
    });

    showLoginBtn.addEventListener('click', () => {
        registerDiv.style.display = 'none';
        loginDiv.style.display = 'block';
    });

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

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(user => user.email === userData.email && user.password === userData.password);

        if (!foundUser) {
            alert('Неверный email или пароль.');
            return;
        }

        if (userData.remember) {
            localStorage.setItem('currentUser', JSON.stringify(foundUser)); 
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(foundUser)); 
        }

        window.location.href = 'home.html';
    });

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
            name: document.getElementById('register-name').value,
            role: 'user'
        };

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

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'home.html'; 
    } else if (!currentUser && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html'; 
    }
});

const settings = document.querySelector('#settings-btn');
const sidebar = document.querySelector('.sidebar');

settings.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

const exit = document.getElementById('exit');
exit.addEventListener('click', () => {
    localStorage.removeItem('currentUser'); 
    sessionStorage.removeItem('currentUser'); 
    window.location.href = 'index.html'; 
});


document.addEventListener('DOMContentLoaded', () => {
    const videoUploader = document.getElementById('video-uploader');
    if (videoUploader) {
        videoUploader.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                const uploadedVideo = document.getElementById('uploaded-video');
                if (uploadedVideo) {
                    uploadedVideo.src = url;
                    uploadedVideo.style.display = 'block';
                    uploadedVideo.play();
                }
            }
        });
    }
});

document.getElementById('video-uploader').addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : "Загрузить видео";
    document.querySelector('.custom-file-upload').textContent = fileName;
});

const player = document.getElementById('player')
player.addEventListener('click', () => {
    window.location.href = 'player.html'
})

startTraining.addEventListener('click', () => {
    videoUploader.style.display = 'none'
})

