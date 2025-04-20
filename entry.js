document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded!');

  // Получаем элементы DOM
  const recording = document.querySelector('#recording');
  const pauseIcon = document.querySelector('.pause-icon');
  const letterO = document.getElementById('letter-o');
  const startRecordingButton = document.querySelector('.start-recording');
  const pauseRecordingButton = document.getElementById('stop-recording');
  const finishRecordingButton = document.getElementById('finish-recording');
  const recordingButton = document.getElementById('recording-button');
  const nameVideo = document.querySelector('.name-for-video');
  const main = document.querySelector('.main');
  const videoNameInp = document.getElementById('video-name-input');
  const addVideoBtn = document.querySelector('#add-video');

  // Инициализация переменных
  let mediaRecorder;
  let recordedChunks = [];
  let isRecording = false;
  let isPaused = false;
  let startTime;
  let videoBlob = null; // Для хранения записанного видео

  // Скрываем форму ввода имени при загрузке
  nameVideo.style.display = 'none';
  main.style.opacity = '1';

  // Функция начала записи
  const startRecording = async () => {
    try {
      console.log('Запуск записи...');
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: false 
      });
      console.log('Экран доступен, создаём MediaRecorder');
      
      // Очищаем предыдущие записи
      recordedChunks = [];
      videoBlob = null;
      
      mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('Запись остановлена');
        videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
        
        // Показываем форму для ввода имени
        nameVideo.style.display = 'block';
        main.style.opacity = '.1';
        
        // Останавливаем все треки в потоке
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Захватываем данные каждые 100 мс
      console.log('Запись начата');
      
      startTime = Date.now();
      isRecording = true;

      setTimeout(() => {
        letterO.style.display = 'none';
        recording.style.display = 'inline-block';
      }, 2000);

      // Обновляем состояние кнопок
      pauseRecordingButton.disabled = false;
      finishRecordingButton.disabled = false;
      startRecordingButton.disabled = true;
    } catch (error) {
      console.error('Ошибка в startRecording:', error);
    }
  };

  // Обработчик кнопки "Start Recording"
  startRecordingButton.addEventListener('click', startRecording);

  // Обработчик кнопки "Pause/Resume"
  pauseRecordingButton.addEventListener('click', () => {
    if (mediaRecorder && isRecording) {
      if (isPaused) {
        mediaRecorder.resume();
        recording.style.display = 'inline-block';
        pauseIcon.style.display = 'none';
      } else {
        mediaRecorder.pause();
        recording.style.display = 'none';
        pauseIcon.style.display = 'inline-block';
      }
      isPaused = !isPaused;
    }
  });

  // Обработчик кнопки "Finish Recording"
  finishRecordingButton.addEventListener('click', () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      isRecording = false;
      isPaused = false;

      // Обновляем UI
      letterO.style.display = 'block';
      recording.style.display = 'none';
      pauseIcon.style.display = 'none';
      
      // Обновляем состояние кнопок
      startRecordingButton.disabled = false;
      pauseRecordingButton.disabled = true;
      finishRecordingButton.disabled = true;
    }
  });

  // Обработчик кнопки "Add Video" (отправка на сервер)
  addVideoBtn.addEventListener('click', async () => {
    const videoName = videoNameInp.value.trim();
    
    if (!videoName || videoName.length < 3) {
      alert('Please enter a valid video name (at least 3 characters)');
      return;
    }

    if (!videoBlob) {
      alert('No recording available to upload');
      return;
    }

    try {
      console.log('Preparing to upload video...');
      
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
        const sizeMB = Math.round(videoBlob.size / (1024 * 1024));

        const payload = {
          name: videoName,
          length_seconds: Math.min(durationSeconds, 3600), // Макс 1 час
          size: Math.max(1, Math.min(sizeMB, 1000)), // От 1MB до 1GB
          video_base64: base64data
        };

        console.log('Sending video to server...');
        const response = await fetch('http://217.114.10.197:8000/users/me/videos', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload video');
        }

        const result = await response.json();
        console.log('Video uploaded successfully:', result);
        
        // Сбрасываем форму
        nameVideo.style.display = 'none';
        main.style.opacity = '1';
        videoNameInp.value = '';
        videoBlob = null;
        
        alert('Video uploaded successfully!');
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read video file');
      };
      
      reader.readAsDataURL(videoBlob);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert(`Upload failed: ${error.message}`);
    }
    nameVideo.style.display = 'none';
    main.style.opacity = '1';
  });

  // Блокировка кнопки "Add" если поле пустое
  videoNameInp.addEventListener('input', () => {
    addVideoBtn.disabled = !videoNameInp.value.trim();
  });
  addVideoBtn.disabled = true; // Изначально кнопка активна
});