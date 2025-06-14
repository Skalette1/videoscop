let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let isPaused = false;
let stream;

const startRecordingButton = document.querySelector('.start-recording');
const pauseRecordingButton = document.getElementById('stop-recording');
const finishRecordingButton = document.getElementById('finish-recording');
const recording = document.querySelector('#recording');
const pauseIcon = document.querySelector('.pause-icon');
const letterO = document.getElementById('letter-o');
const nameVideo = document.querySelector('.name-for-video');
const main = document.querySelector('.main');
const addVideoBtn = document.getElementById('add-video');
const videoNameInput = document.getElementById('video-name-input');

if (nameVideo) nameVideo.style.display = 'none';
if (main) main.style.opacity = '1';

function showNameInput() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const reader = new FileReader();
  reader.onloadend = () => {
    localStorage.setItem('videoBlob', reader.result);
    if (nameVideo) nameVideo.style.display = 'block';
    if (main) main.style.opacity = '.1';
  };
  reader.readAsDataURL(blob);
}

function resetRecordingState() {
  if (mediaRecorder) mediaRecorder.stop();
  if (stream) stream.getTracks().forEach(track => track.stop());
  isRecording = false;
  isPaused = false;
  recordedChunks = [];
  if (letterO) letterO.style.display = 'block';
  if (recording) recording.style.display = 'none';
  if (pauseIcon) pauseIcon.style.display = 'none';
  startRecordingButton.disabled = false;
  pauseRecordingButton.disabled = true;
  finishRecordingButton.disabled = true;
}

async function restartStream() {
  try {
    const newStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    stream = newStream;

    stream.oninactive = () => {
      console.warn('Поток стал неактивным, возможно, камера была отключена.');
      alert('Захват экрана был прерван. Пожалуйста, начните запись заново.');
      resetRecordingState();
    };

    return true;
  } catch (error) {
    console.error('Ошибка при перезапуске потока:', error);
    alert('Не удалось перезапустить захват экрана. Пожалуйста, попробуйте снова.');
    return false;
  }
}

async function initializeRecording() {
  if (!stream || !stream.active) {
    const restarted = await restartStream();
    if (!restarted) return;
  }
  mediaRecorder = new MediaRecorder(stream);
  recordedChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) recordedChunks.push(event.data);
  };

  mediaRecorder.onerror = (event) => {
    console.error('Ошибка MediaRecorder:', event.error);
    alert('Произошла ошибка при записи: ' + event.error.message);
    resetRecordingState();
  };

  mediaRecorder.onstop = showNameInput;
  mediaRecorder.start(100);
  isRecording = true;
  isPaused = false;

  setTimeout(() => {
    if (recording) recording.style.display = 'inline-block';
  }, 2000);

  pauseRecordingButton.disabled = false;
  finishRecordingButton.disabled = false;
  startRecordingButton.disabled = true;
}

startRecordingButton.addEventListener('click', async () => {
  try {
    if (!isRecording) {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      await initializeRecording();
    } else if (isPaused) {
      if (mediaRecorder.stream && mediaRecorder.stream.active) {
        mediaRecorder.resume();
        if (recording) recording.style.display = 'inline-block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        console.log('Recording resumed');
      } else {
        const restarted = await restartStream();
        if (restarted) {
          await initializeRecording();
          console.log('Recording resumed after stream restart');
        }
      }
      isPaused = false;
    }
  } catch (error) {
    console.error('Ошибка при записи экрана:', error);
    alert('Ошибка доступа к экрану: ' + error.message);
    resetRecordingState();
  }
});

pauseRecordingButton.addEventListener('click', () => {
  if (mediaRecorder && isRecording) {
    if (!isPaused) {
      mediaRecorder.pause();
      if (recording) recording.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'inline-block';
      console.log('Recording paused');
    }
    isPaused = true;
  }
});

finishRecordingButton.addEventListener('click', () => {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    isRecording = false;
    isPaused = false;

    if (letterO) letterO.style.display = 'block';
    if (recording) recording.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'none';

    startRecordingButton.disabled = false;
    pauseRecordingButton.disabled = true;
    finishRecordingButton.disabled = true;
  }
});

addVideoBtn.addEventListener('click', () => {
  const name = videoNameInput.value.trim();
  if (name.length < 3) {
    alert('Введите название не короче 3 символов');
    return;
  }

  localStorage.setItem('videoName', name);
  if (nameVideo) nameVideo.style.display = 'none';
  if (main) main.style.opacity = '1';
  videoNameInput.value = '';
});