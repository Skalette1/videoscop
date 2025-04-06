const recording = document.querySelector('#recording');
const pauseIcon = document.querySelector('.pause-icon');
const letterO = document.getElementById('letter-o');

let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let isPaused = false; // Добавляем флаг паузы

const startRecordingButton = document.querySelector('.start-recording');
const pauseRecordingButton = document.getElementById('stop-recording'); // Переименовываем в pause
const finishRecordingButton = document.getElementById('finish-recording');

// Функция для старта записи
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('videoBlob', reader.result);
      };
      reader.readAsDataURL(blob);
    };

    // Добавляем обработчик паузы/возобновления
    mediaRecorder.onpause = () => {
      isPaused = true;
      pauseRecordingButton.textContent = 'RESUME';
    };

    mediaRecorder.onresume = () => {
      isPaused = false;
      pauseRecordingButton.textContent = 'PAUSE';
    };

    mediaRecorder.start(100); // Записываем данные каждые 100мс
    isRecording = true;

    setTimeout(() => {
      const letterO = document.getElementById('letter-o');
      letterO.style.display = 'none';
      recording.style.display = 'inline-block';
    }, 2000);

    pauseRecordingButton.disabled = false;
    finishRecordingButton.disabled = false;
    startRecordingButton.disabled = true;
  } catch (error) {
    console.error('Ошибка при записи экрана:', error);
  }
};

// Обработчик старта записи
startRecordingButton.addEventListener('click', startRecording);

// Обработчик паузы/возобновления
pauseRecordingButton.addEventListener('click', () => {
  if (mediaRecorder && isRecording) {
    if (isPaused) {
      mediaRecorder.resume(); // Возобновляем запись
      recording.style.display = 'inline-block';
      pauseIcon.style.display = 'none';
    } else {
      recording.style.display = 'none';
      pauseIcon.style.display = 'inline-block';
      mediaRecorder.pause(); // Ставим на паузу
    }
  }
});

// Обработчик завершения записи
finishRecordingButton.addEventListener('click', () => {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    isPaused = false;

    letterO.style.display = 'block';
    recording.style.display = 'none';
    pauseIcon.style.display = 'none';

    startRecordingButton.disabled = false;
    pauseRecordingButton.disabled = true;
    finishRecordingButton.disabled = true;
  }
});

//Значок записи
