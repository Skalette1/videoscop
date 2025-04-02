document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login');
  const registerForm = document.getElementById('register');
  const guestLoginBtn = document.getElementById('guest-login');
  const showRegisterBtn = document.getElementById('show-register');
  const showLoginBtn = document.getElementById('show-login');
  const loginDiv = document.getElementById('login-form');
  const registerDiv = document.getElementById('register-form');
  const startTraining = document.getElementById('start-training');
  const container = document.querySelector('.container');
  const cookies = document.querySelector('.cookies');

  const authBtn = {
    signupBtn: document.querySelector('.signup-btn'),
    loginBtn: document.querySelector('.login-btn'),
    loginAgree: document.querySelector('#login-agree'),
    rememberMe: document.querySelector('#remember-me'),
  };

  const agreeWithCookies = document
    .getElementById('agree-with-cookies')
    .addEventListener('click', () => {
      cookies.classList.remove('clicked');
      container.style.opacity = '1';
      authBtn.loginBtn.disabled = false;
      authBtn.signupBtn.disabled = false;
      authBtn.loginAgree.disabled = false;
      authBtn.rememberMe.disabled = false;
      guestLoginBtn.disabled = false;
    });

  //авторизация
  const loginPasswordField = document.getElementById('login-password');
  const registerPasswordField = document.getElementById('register-password');
  const passwordIcons = document.querySelectorAll('#password');

  passwordIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const passwordField = icon.previousElementSibling;
      if (passwordField.getAttribute('type') === 'password') {
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
      return;
    }

    const userData = {
      email: document.getElementById('login-email').value,
      password: document.getElementById('login-password').value,
      remember: document.getElementById('remember-me').checked,
      role: 'user',
    };

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(
      (user) =>
        user.email === userData.email && user.password === userData.password
    );

    if (!foundUser) {
      const errorMessage = (document.querySelector('.error').style.display =
        'flex');
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
      return;
    }

    const newUser = {
      username: document.getElementById('register-username').value,
      password: document.getElementById('register-password').value,
      email: document.getElementById('register-email').value,
      name: document.getElementById('register-name').value,
      role: 'user',
    };

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some((user) => user.email === newUser.email)) {
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
      cookies.classList.toggle('clicked');
      container.style.opacity = '.3';
      authBtn.loginBtn.disabled = true;
      authBtn.signupBtn.disabled = true;
      guestLoginBtn.disabled = true;
      authBtn.loginAgree.disabled = true;
      authBtn.rememberMe.disabled = true;
      return;
    }

    const guestUser = {
      role: 'guest',
      timestamp: new Date().getTime(),
    };

    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    window.location.href = 'home.html';
  });

  const currentUser =
    JSON.parse(localStorage.getItem('currentUser')) ||
    JSON.parse(sessionStorage.getItem('currentUser'));

  if (currentUser && window.location.pathname.endsWith('index.html')) {
    window.location.href = 'home.html';
  } else if (!currentUser && !window.location.pathname.endsWith('index.html')) {
    window.location.href = 'index.html';
  }
});

//sidebar

const sidebar = document.querySelector('.sidebar');
const settingsBtn = document.getElementById('settings-btn');
const removeSidebar = document.querySelector('.remove-sidebar');
settingsBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

removeSidebar.addEventListener('click', () => {
  sidebar.classList.remove('open');
});

//выход из профиля
const exit = document.getElementById('exit');
exit.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('currentUser');
  window.location.href = 'index.html';
});

//блок с загрузкой видео
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

document
  .getElementById('video-uploader')
  .addEventListener('change', function () {
    const fileName = this.files[0] ? this.files[0].name : 'Загрузить видео';
    document.querySelector('.custom-file-upload').textContent = fileName;
  });

const player = document.getElementById('player');
player.addEventListener('click', () => {
  window.location.href = 'player.html';
});

startTraining.addEventListener('click', () => {
  videoUploader.style.display = 'none';
});



// ..тепловая

document.addEventListener('DOMContentLoaded', () => {
    // --- Твои стандартные элементы ---
    const target = document.getElementById('target');
    const hideEyeCheckbox = document.getElementById('hide-eye-checkbox');
    const videoUpload = document.querySelector('.video-upload');
    const videoInput = document.getElementById('video-uploader');
    const uploadedVideo = document.getElementById('uploaded-video');
    const webcam = document.getElementById('webcam');

    // Функция скрыть / показать точку
    const updateEyeVisibility = () => {
        target.style.opacity = hideEyeCheckbox.checked ? '0' : '1';
    };
    hideEyeCheckbox.addEventListener('change', updateEyeVisibility);
    updateEyeVisibility();

    // --- HeatMap система ---

    const canvas = document.getElementById('heatMap');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let recording = false;
    const points = [];

    // Обработка кнопок
    const startButton = document.getElementById('start-training');
    const stopButton = document.getElementById('stop-recording');
    const finishButton = document.getElementById('finish-recording');

    startButton.addEventListener('click', () => {
        recording = true;
        points.length = 0; // очистить перед новой записью
        startButton.disabled = true;
        stopButton.disabled = false;
        finishButton.disabled = false;
        drawHeatMap();
    });

    stopButton.addEventListener('click', () => {
        recording = false;
        startButton.disabled = false;
        stopButton.disabled = true;
    });

    finishButton.addEventListener('click', () => {
        recording = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        finishButton.disabled = true;
    });

    // Основной цикл отрисовки
    function drawHeatMap() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        points.forEach(p => {
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 50);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 50, 0, 2 * Math.PI);
            ctx.fill();
        });

        if (recording) {
            const rect = canvas.getBoundingClientRect();
            const targetX = target.offsetLeft + target.offsetWidth / 2;
            const targetY = target.offsetTop + target.offsetHeight / 2;
            points.push({ x: targetX, y: targetY });
        }

        requestAnimationFrame(drawHeatMap);
    }
});


const newAuth = {
  title: 'Harry Potter',
  body: 'shot',
  userId: 1,
}

fetch('http://217.114.10.197:8000/users', {
  method: 'POST',
  body: JSON.stringify(newAuth),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  }
})
.then((response) => {
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }
  return response.json();
})
.then((data) => {
  console.log(data)
})
.catch((error) => {
  console.error(error)
})
