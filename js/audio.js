const { mouse2data, getDataEMManga, getDataStarManga } = require('./helper_functions');
const { AudioEMLines, AudioStarLine } = require('./audio_class');

function playGasAudio(evt) {
  if (window.currentAudio) {
    window.currentAudio.stopSound();
  }
  const mcoo = {};
  mcoo.x = evt.clientX;
  mcoo.y = evt.clientY;
  const dcoo = mouse2data(mcoo, 'gas');
  const { ew, vel } = getDataEMManga(dcoo.x, dcoo.y);
  window.currentAudio = new AudioEMLines();
  window.currentAudio.changeSound(ew, vel);
  window.currentAudio.playSound();
  window.PlayingSpec = dcoo;
}

function stopGasAudio() {
  window.PlayingSpec = -1;
  if (window.currentAudio) {
    window.currentAudio.stopSound();
    window.currentAudio = undefined;
  }
}

function changeGasAudio(evt) {
  const mcoo = {};
  mcoo.x = evt.clientX;
  mcoo.y = evt.clientY;
  const dcoo = mouse2data(mcoo, 'gas');
  const { ew, vel } = getDataEMManga(dcoo.x, dcoo.y);
  if (window.currentAudio) {
    if ((dcoo.x !== window.PlayingSpec.x) || (dcoo.y !== window.PlayingSpec.y) || (window.PlayingSpec < 0)) {
      window.currentAudio.changeSound(ew, vel);
    }
  }
}

function playStarAudio(evt) {
  if (window.currentAudio) {
    window.currentAudio.stopSound();
  }
  const mcoo = {};
  mcoo.x = evt.clientX;
  mcoo.y = evt.clientY;
  const dcoo = mouse2data(mcoo, 'star');
  const vel = getDataStarManga(dcoo.x, dcoo.y);
  window.currentAudio = new AudioStarLine(window.StarBaseFreq, 10);
  if (vel) {
    window.currentAudio.changeSound(1, vel);
  } else {
    window.currentAudio.changeSound(0, vel);
  }
  window.currentAudio.playSound();
  window.PlayingSpec = dcoo;
}

function stopStarAudio() {
  window.PlayingSpec = -1;
  if (window.currentAudio) {
    window.currentAudio.stopSound();
    window.currentAudio = undefined;
  }
}

function changeStarAudio(evt) {
  const mcoo = {};
  mcoo.x = evt.clientX;
  mcoo.y = evt.clientY;
  const dcoo = mouse2data(mcoo, 'star');
  const vel = getDataStarManga(dcoo.x, dcoo.y);
  if (window.currentAudio) {
    if ((dcoo.x !== window.PlayingSpec.x) || (dcoo.y !== window.PlayingSpec.y) || (window.PlayingSpec < 0)) {
      if (vel) {
        window.currentAudio.changeSound(1, vel);
      } else {
        window.currentAudio.changeSound(0, vel);
      }
    }
  }
}

module.exports = {
  playGasAudio,
  changeGasAudio,
  stopGasAudio,
  playStarAudio,
  changeStarAudio,
  stopStarAudio,
};
