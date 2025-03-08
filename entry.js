let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const finishRecordingButton = document.getElementById('finish-recording');

// Начало записи
startRecordingButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      document.getElementById('uploaded-video').src = url;
      document.getElementById('uploaded-video').style.display = 'block';

      // Сохранение URL записанного видео в localStorage
      localStorage.setItem('videoUrl', url);

      // Автоматический переход на страницу плеера с передачей URL видео
      window.location.href = `player.html?videoUrl=${encodeURIComponent(url)}`;
    };

    mediaRecorder.start();
    isRecording = true;

    stopRecordingButton.disabled = false;
    finishRecordingButton.disabled = false;
    startRecordingButton.disabled = true;

    dataset.startCollectingData(); // Начинаем сбор данных для тепловой карты
  } catch (error) {
    console.error('Ошибка при записи экрана:', error);
  }
});

// Остановка записи
stopRecordingButton.addEventListener('click', () => {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;

    stopRecordingButton.disabled = true;
    finishRecordingButton.disabled = true;
    startRecordingButton.disabled = false;

    dataset.stopCollectingData(); // Останавливаем сбор данных
  }
});

// Завершение записи
finishRecordingButton.addEventListener('click', async () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      isRecording = false;
  
      stopRecordingButton.disabled = true;
      finishRecordingButton.disabled = true;
      startRecordingButton.disabled = false;
  
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const heatmapData = dataset.getCollectedData(); // Получаем данные тепловой карты
  
      // Сохранение видео в localStorage и автоматический переход
      localStorage.setItem('videoUrl', URL.createObjectURL(blob));
      window.location.href = `player.html?videoUrl=${encodeURIComponent(URL.createObjectURL(blob))}`;
    }
  });
