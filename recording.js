const recording = document.querySelector('#recording')
const beginTrain = document.querySelector('#start-training')
const endTrain = document.querySelector('#reset-model')

beginTrain.addEventListener('click', () => {
    recording.style.display = 'inline-block'
})

endTrain.addEventListener('click', () => {
    recording.style.display = 'none'
})

