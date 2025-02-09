importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');

function createModel() {
  const model = tf.sequential();
  model.add(
    tf.layers.conv2d({
      kernelSize: 5,
      filters: 20,
      strides: 1,
      activation: 'relu',
      inputShape: [150, 200, 3],
    }),
  );

  model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2],
  }));

  model.add(tf.layers.flatten());
  model.add(tf.layers.dropout(0.2));
  model.add(tf.layers.dense({
    units: 2,
    activation: 'tanh',
  }));

  model.compile({
    optimizer: tf.train.adam(0.0005),
    loss: 'meanSquaredError',
  });

  return model;
}

self.onmessage = function (event) {
  if (event.data.type === 'fitModel') {
    const train = event.data.train;
    const val = event.data.val;

    const model = createModel();
    const batchSize = Math.floor(train.n * 0.1) || 4;

    model.fit(train.x, train.y, {
      batchSize: batchSize,
      epochs: 20,
      shuffle: true,
      validationData: [val.x, val.y],
    }).then(() => {
      self.postMessage({ type: 'modelTrained' });
    });
  }
};   