document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('video-player');
    const frameBackwardBtn = document.getElementById('frame-backward');
    const frameForwardBtn = document.getElementById('frame-forward');
    const playPauseBtn = document.getElementById('play-pause');
    const toggleHeatmapBtn = document.getElementById('toggle-heatmap');
    const heatmapCanvas = document.getElementById('heatmap-canvas');
    const videoSource = document.getElementById('video-source');

    document.getElementById('go-to-home').addEventListener('click', () => window.location.href = 'home.html');
    // Получение URL видео из параметров URL
    const params = new URLSearchParams(window.location.search);
    const videoUrl = params.get('videoUrl');

    if (videoUrl) {
        videoSource.src = videoUrl;
        videoPlayer.load();
    } else {
        alert('Видео не найдено. Пожалуйста, запишите видео.');
        window.location.href = 'index.html'; // Перенаправление на главную страницу, если видео не найдено
    }

    // Обработчик ошибок при загрузке видео
    videoPlayer.onerror = function () {
        alert('Ошибка при загрузке видео. Пожалуйста, проверьте путь к видео.');
    };

    // Проверка, что видео успешно загружено
    videoPlayer.oncanplaythrough = function () {
        console.log('Видео успешно загружено!');
    };

    // Настройка canvas
    const ctx = heatmapCanvas.getContext('2d');
    
    let heatmapEnabled = false;

    // Функция для покадрового перемещения назад
    frameBackwardBtn.addEventListener('click', () => {
        const currentTime = videoPlayer.currentTime;
        videoPlayer.currentTime = Math.max(0, currentTime - (1 / 30)); // 1 кадр назад
    });

    // Функция для покадрового перемещения вперед
    frameForwardBtn.addEventListener('click', () => {
        const currentTime = videoPlayer.currentTime;
        videoPlayer.currentTime = Math.min(videoPlayer.duration, currentTime + (1 / 30)); // 1 кадр вперед
    });

    // Функция для воспроизведения/паузы видео
    playPauseBtn.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
            playPauseBtn.textContent = 'Пауза';
        } else {
            videoPlayer.pause();
            playPauseBtn.textContent = 'Воспроизвести';
        }
    });

    // Переключение тепловой карты
    toggleHeatmapBtn.addEventListener('click', () => {
        heatmapEnabled = !heatmapEnabled;
        if (heatmapEnabled) {
            heatmapCanvas.style.display = 'block';
        } else {
            heatmapCanvas.style.display = 'none';
        }
    });

});

    // Функция для рисования тепловой карты на canvas
    function drawHeatmap() {
        if (heatmapEnabled && !videoPlayer.paused) {
            ctx.clearRect(0, 0, heatmapCanvas.width, heatmapCanvas.height); // Очистить canvas

            // Пример рисования тепловой карты (например, случайная интенсивность)
            ctx.fillStyle = `rgba(255, 0, 0, 0.5)`; // Полупрозрачный красный цвет
            ctx.fillRect(Math.random() * heatmapCanvas.width, Math.random() * heatmapCanvas.height, 50, 50);

            // Повторно рисуем, пока видео не поставлено на паузу
            requestAnimationFrame(drawHeatmap);
        }
    }

    // Обновление размеров canvas при изменении размеров видео
    videoPlayer.addEventListener('resize', () => {
        heatmapCanvas.width = videoPlayer.videoWidth;
        heatmapCanvas.height = videoPlayer.videoHeight;
    });


