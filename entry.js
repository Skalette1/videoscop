
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

const startRecordingButton = document.querySelector('.start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const finishRecordingButton = document.getElementById('finish-recording');


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

      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('videoBlob', reader.result); 
      };
      reader.readAsDataURL(blob);

      window.location.href = 'player.html';
    };

    mediaRecorder.start();
    isRecording = true;

    stopRecordingButton.disabled = false;
    finishRecordingButton.disabled = false;
    startRecordingButton.disabled = true;
  } catch (error) {
    console.error('Ошибка при записи экрана:', error);
  }
});

stopRecordingButton.addEventListener('click', () => {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;

    stopRecordingButton.disabled = true;
    finishRecordingButton.disabled = true;
    startRecordingButton.disabled = false;
  }
});

finishRecordingButton.addEventListener('click', async () => {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;

    stopRecordingButton.disabled = true;
    finishRecordingButton.disabled = true;
    startRecordingButton.disabled = false;

    const blob = new Blob(recordedChunks, { type: 'video/webm' });

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem('videoBlob', reader.result); 
    };
    reader.readAsDataURL(blob);

            window.location.href = 'player.html';
  }
});
