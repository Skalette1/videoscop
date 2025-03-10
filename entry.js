let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const finishRecordingButton = document.getElementById('finish-recording');

// Функция для открытия IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("VideoDB", 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("videos")) {
                db.createObjectStore("videos", { keyPath: "id" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Функция для сохранения видео в IndexedDB
async function saveVideoToDB(blob) {
    const db = await openDB();
    const transaction = db.transaction("videos", "readwrite");
    const store = transaction.objectStore("videos");
    store.put({ id: "recordedVideo", blob });
}

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

        mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            await saveVideoToDB(blob); // Сохраняем видео в IndexedDB

            // Переход на страницу плеера
            window.location.href = 'player.html';
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
        await saveVideoToDB(blob); // Сохраняем видео в IndexedDB

        // Переход на страницу плеера
        window.location.href = 'player.html';
    }
});