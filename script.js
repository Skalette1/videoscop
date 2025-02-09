$(document).ready(function () {
  const video = $('#webcam')[0];
  const overlay = $('#overlay')[0];
  const overlayCC = overlay.getContext('2d');
  const ctrack = new clm.tracker();
  ctrack.init();

  const worker = new Worker('worker.js');
  worker.onmessage = function (event) {
    if (event.data.type === 'modelTrained') {
      console.log('Model trained successfully');
    }
  };

  function getEyesRectangle(positions) {
    const minX = positions[23][0] - 5;
    const maxX = positions[28][0] + 5;
    const minY = positions[24][1] - 5;
    const maxY = positions[26][1] + 5;

    const width = maxX - minX;
    const height = maxY - minY;

    return [minX, minY, width, height];
  }

  function trackingLoop() {
    if (document.hidden) return; 

    requestAnimationFrame(trackingLoop);
    let currentPosition = ctrack.getCurrentPosition();

    overlayCC.clearRect(0, 0, 400, 300);
    if (currentPosition) {
      ctrack.draw(overlay);

      const eyesRect = getEyesRectangle(currentPosition);
      overlayCC.strokeStyle = 'red';
      overlayCC.strokeRect(eyesRect[0], eyesRect[1], eyesRect[2], eyesRect[3]);

      const resizeFactorX = video.videoWidth / video.width;
      const resizeFactorY = video.videoHeight / video.height;

      const eyesCanvas = $('#eyes')[0];
      const eyesCC = eyesCanvas.getContext('2d');

      eyesCC.drawImage(
        video,
        eyesRect[0] * resizeFactorX,
        eyesRect[1] * resizeFactorY,
        eyesRect[2] * resizeFactorX,
        eyesRect[3] * resizeFactorY,
        0,
        0,
        eyesCanvas.width,
        eyesCanvas.height,
      );
    }
  }

  function onStreaming(stream) {
    video.srcObject = stream;
    ctrack.start(video);
    trackingLoop();
  }

  // Обработчик изменения видимости вкладки
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Еслт вкладка свёрнута
      ctrack.stop();
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    } else {
      // Если вкладка активна
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(onStreaming)
        .catch((error) => {
          console.error('Ошибка доступа к камере:', error);
        });
    }
  });

  // Проверка поддержки WebRTC
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(onStreaming)
      .catch((error) => {
        console.error('Ошибка доступа к камере:', error);
      });
  } else {
    console.error('Ваш браузер не поддерживает доступ к камере.');
  }
  const mouse = {
    x: 0,
    y: 0,

    handleMouseMove: function (event) {
      mouse.x = (event.clientX / $(window).width()) * 2 - 1;
      mouse.y = (event.clientY / $(window).height()) * 2 - 1;
    },
  };

  document.onmousemove = mouse.handleMouseMove;

  function getImage() {
    return tf.tidy(function () {
      const image = tf.browser.fromPixels($('#eyes')[0]);
      const batchedImage = image.expandDims(0);
      return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    });
  }

  const dataset = {
    train: {
      n: 0,
      x: null,
      y: null,
    },
    val: {
      n: 0,
      x: null,
      y: null,
    },
  };

  function captureExample() {
    tf.tidy(function () {
      const image = getImage();
      const mousePos = tf.tensor1d([mouse.x, mouse.y]).expandDims(0);

      const subset = dataset[Math.random() > 0.2 ? 'train' : 'val'];

      if (subset.x == null) {
        subset.x = tf.keep(image);
        subset.y = tf.keep(mousePos);
      } else {
        const oldX = subset.x;
        const oldY = subset.y;

        subset.x = tf.keep(oldX.concat(image, 0));
        subset.y = tf.keep(oldY.concat(mousePos, 0));
      }

      subset.n += 1;
    });
  }

  $('body').keyup(function (event) {
    if (event.keyCode == 32) {
      captureExample();
      event.preventDefault();
      return false;
    }
  });

  $('#train').click(function () {
    if (dataset.train.n > 0) {
      worker.postMessage({
        type: 'fitModel',
        train: dataset.train,
        val: dataset.val,
      });
    } else {
      console.error('Недостаточно данных для обучения.');
    }
  });

  let currentModel;

  function moveTarget() {
    if (currentModel == null) {
      return;
    }
    tf.tidy(function () {
      const image = getImage();
      const prediction = currentModel.predict(image);

      const targetWidth = $('#target').outerWidth();
      const targetHeight = $('#target').outerHeight();

      prediction.data().then((prediction) => {
        const x = ((prediction[0] + 1) / 2) * ($(window).width() - targetWidth);
        const y = ((prediction[1] + 1) / 2) * ($(window).height() - targetHeight);

        const $target = $('#target');
        $target.css('left', x + 'px');
        $target.css('top', y + 'px');
      });
    });
  }

  setInterval(moveTarget, 100);

});