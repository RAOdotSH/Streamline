let rangeText = document.getElementById('rangeText')
let slider = document.getElementById('playbackSlider')
let clearButton = document.getElementById('clearButton')
let slideValue = document.querySelector('span')

const defaultSpeed = 1.0
const lowerLimit = 0
const higherLimit = 16

//setting the slider value to rangeText value
const changeSpeed = () => {
  let value = parseFloat(rangeText.value)
  value = Math.round(value * 10) / 10
  if (value < lowerLimit) value = lowerLimit
  if (value > higherLimit) value = higherLimit
  setSpeed(value)
}
rangeText.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return
  changeSpeed()
  updateSlider()
})

//adding show class, setting rangeText value to slider value
const updateSlider = () => {
  let value = slider.value
  slideValue.textContent = value
  slideValue.style.left =
    ((value - slider.min) / (slider.max - slider.min)) * 100 + '%'
  slideValue.classList.add('show')
  rangeText.value = value
  changeSpeed()
}
slider.addEventListener('input', updateSlider)
slider.addEventListener('click', updateSlider)
slider.addEventListener('blur', () => {
  slideValue.classList.remove('show')
})

//setting speed
function setSpeed(speed) {
  slider.value = speed
  let speedString = speed.toString()
  if (speedString.indexOf('.') === 1) speedString += '.0'
  rangeText.value = speed
  updatePlaybackSpeed(speed)
  slideValue.classList.add('show')
}

function getPlaybackSpeed() {
  chrome.tabs.query(
    {
      active: true,
      status: 'complete',
    },
    (tabs) => {
      if (tabs.length == 0) {
        setTimeout(getPlaybackSpeed, 100)
        return
      }

      let tab = tabs[0]
      chrome.tabs.sendMessage(tab.id, { message: 'get playback speed' })
    }
  )
}

getPlaybackSpeed()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == 'current speed') {
    let speed = request.speed
    setSpeed(request.speed)
  }
})

function updatePlaybackSpeed(speed) {
  chrome.tabs.getSelected(undefined, (tab) => {
    chrome.tabs.sendMessage(tab.id, {
      message: 'set playback speed',
      speed: speed,
    })
  })
}

clearButton.addEventListener('click', () => {
  setSpeed(defaultSpeed)
  updateSlider()
})
