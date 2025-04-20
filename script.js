document.addEventListener('DOMContentLoaded', () => {
  // Элементы авторизации
  const loginForm = document.getElementById('login');
  const registerForm = document.getElementById('register');
  const guestLoginBtn = document.getElementById('guest-login');
  const showRegisterBtn = document.getElementById('show-register');
  const showLoginBtn = document.getElementById('show-login');
  const loginDiv = document.getElementById('login-form');
  const registerDiv = document.getElementById('register-form');
  const container = document.querySelector('.container');
  const cookies = document.querySelector('.cookies');

  const authBtn = {
    signupBtn: document.querySelector('.signup-btn'),
    loginBtn: document.querySelector('.login-btn'),
    loginAgree: document.querySelector('#login-agree'),
    rememberMe: document.querySelector('#remember-me'),
  };

  // Согласие на cookies
  document
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

  // Переключение между формами
  showRegisterBtn.addEventListener('click', () => {
    loginDiv.style.display = 'none';
    registerDiv.style.display = 'block';
  });

  showLoginBtn.addEventListener('click', () => {
    registerDiv.style.display = 'none';
    loginDiv.style.display = 'block';
  });

  // Логин
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!authBtn.loginAgree.checked) return;

    const userData = {
      login: document.getElementById('login-email').value,
      password: document.getElementById('login-password').value,
    };

    fetch('http://217.114.10.197:8000/users/me/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: userData.login,
        password: userData.password,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then((data) => {
        const token = data.access_token;
        sessionStorage.setItem('access_token', token);
        if (userData.remember) localStorage.setItem('access_token', token);
        window.location.href = 'home.html';
      })
      .catch((err) => {
        console.error('Login error:', err);
        alert('Error during login');
      });
  });

  // регистрация
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!document.getElementById('register-agree').checked) return;

    const newUserData = {
      login: document.getElementById('register-username').value,
      email: document.getElementById('register-email').value,
      password: document.getElementById('register-password').value,
    };

    const moksData = {
      login: 'username123', // Для будущего входа
      email: 'user@example.com', // Для коммуникации
      password: 'yourpassword123',
    };

    fetch('http://217.114.10.197:8000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUserData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then(() => {
        window.location.href = 'home.html';
      })
      .catch((err) => {
        console.error('Registration error:', err);
        alert('Error during registration');
      });
  });

  // Гостевой вход
  guestLoginBtn.addEventListener('click', () => {
    const guestData = {
      email: 'guest@videoscop.com',
      password: 'guestpassword',
    };
    sessionStorage.setItem('active-user', JSON.stringify(guestData));
    if (!authBtn.loginAgree.checked) {
      cookies.style.display = 'flex';
    } else {
      window.location.href = 'home.html';
    }
  });

  // Загрузка видео
  const removeVideoBtn = document.getElementById('remove-video');
  const videoUploader = document.getElementById('video-uploader');
  const uploadedVideo = document.getElementById('uploaded-video');
  const customUploadBtn = document.querySelector('.custom-file-upload');
  const startTraining = document.getElementById('start-training');

  videoUploader?.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && uploadedVideo) {
      uploadedVideo.src = URL.createObjectURL(file);
      uploadedVideo.style.display = 'block';
      uploadedVideo.play();
      removeVideoBtn.style.display = 'block';
      customUploadBtn.style.display = 'none';
    }
  });

  removeVideoBtn?.addEventListener('click', () => {
    if (uploadedVideo) {
      uploadedVideo.pause();
      uploadedVideo.src = '';
      uploadedVideo.style.display = 'none';
    }
    videoUploader.value = '';
    removeVideoBtn.style.display = 'none';
    customUploadBtn.style.display = 'flex';
  });

  startTraining?.addEventListener('click', () => {
    if (videoUploader) {
      videoUploader.style.display = 'none';
    }
  });

  // Тепловая карта
  const canvas = document.getElementById('heatMap');
  const ctx = canvas?.getContext('2d');
  if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let recording = false;
    const points = [];

    const startButton = document.getElementById('start-training');
    const stopButton = document.getElementById('stop-recording');
    const finishButton = document.getElementById('finish-recording');
    const recordingButton = document.getElementById('recording-button');

    startButton?.addEventListener('click', () => {
      recording = true;
      points.length = 0;
      startButton.disabled = true;
      stopButton.disabled = false;
      finishButton.disabled = false;
      drawHeatMap();
    });

    stopButton?.addEventListener('click', () => {
      recording = false;
      startButton.disabled = false;
      stopButton.disabled = true;
    });

    finishButton?.addEventListener('click', () => {
      recording = false;
      startButton.disabled = false;
      stopButton.disabled = true;
      finishButton.disabled = true;
      if (recordingButton) recordingButton.style.display = 'none';
    });
  }
});

// const backToHome = document.querySelector('#player').addEventListener('click',() => window.location.href = 'home.html')
