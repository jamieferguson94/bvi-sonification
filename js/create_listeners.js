const { playAudio, changeAudio, stopAudio } = require('./audio');

let ClickStatus = false;
function createListeners() {
  window.ImageCnv.addEventListener('mousedown', (evt) => {
    if (window.DataReady) {
      ClickStatus = true;
      playAudio(evt);
    }
  }, false);
  window.ImageCnv.addEventListener('mouseup', (evt) => {
    if (window.DataReady) {
      ClickStatus = false;
      stopAudio(evt);
    }
  }, false);
  window.ImageCnv.addEventListener('mousemove', (evt) => {
    if (window.DataReady) {
      if (ClickStatus) {
        changeAudio(evt);
      }
    }
  }, false);
}

module.exports = createListeners;
