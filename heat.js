window.heatmap = {
  getHeatColor: function (value, alpha) {
    if (typeof alpha == 'undefined') {
      alpha = 1.0;
    }
    const hue = ((1 - value) * 120).toString(10);
    return 'hsla(' + hue + ',100%,50%,' + alpha + ')';
  },

  fillHeatmap: function (data, model, ctx, width, height, radius) {
    const predictions = model.predict(data.x).arraySync();

    let trueX, trueY, predX, predY, errorX, errorY, error, pointX, pointY;

    for (let i = 0; i < data.n; i++) {
      const dataY = data.y.arraySync();

      trueX = dataY[i][0];
      trueY = dataY[i][1];
      predX = predictions[i][0];
      predY = predictions[i][1];
      errorX = Math.pow(predX - trueX, 2);
      errorY = Math.pow(predY - trueY, 2);
      error = Math.min(Math.sqrt(Math.sqrt(errorX + errorY)), 1);

      pointX = Math.floor((trueX + 0.5) * width);
      pointY = Math.floor((trueY + 0.5) * height);

      ctx.beginPath();
      ctx.fillStyle = this.getHeatColor(error, 0.5);
      ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  },

  drawHeatmap: function (dataset, model) {
    const heatmap = document.getElementById('heatMap');
    const ctx = heatmap.getContext('2d');

    const width = heatmap.width;
    const height = heatmap.height;
    ctx.clearRect(0, 0, width, height);

    this.fillHeatmap(dataset.val, model, ctx, width, height, 30);
    this.fillHeatmap(dataset.train, model, ctx, width, height, 15);
  },

  clearHeatmap: function () {
    const heatmap = document.getElementById('heatMap');
    const ctx = heatmap.getContext('2d');
    ctx.clearRect(0, 0, heatmap.width, heatmap.height);
  },
  drawHeatmapFromData: function (data, ctx, width, height) {
    ctx.clearRect(0, 0, width, height);

    data.forEach((item) => {
      const { target } = item;
      const pointX = Math.floor((target[0] + 0.5) * width);
      const pointY = Math.floor((target[1] + 0.5) * height);

      ctx.beginPath();
      ctx.fillStyle = this.getHeatColor(0.5, 0.5);
      ctx.arc(pointX, pointY, 15, 0, 2 * Math.PI);
      ctx.fill();
    });
  },
};
