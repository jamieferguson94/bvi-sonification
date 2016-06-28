const { mouse2data, getDataIdx } = require('./helper_functions');
const spec2audio = require('./spec_to_audio');
const { makeSpecImage, clearSpecImage } = require('./spec_image');

function playSound(buffer) {
  window.AudioSource = window.AudioCtx.createBufferSource();
  const tmpBuffer = window.AudioBuffer.getChannelData(0);
  for (let i = 0; i < window.AudBuffSiz; i++) {
    tmpBuffer[i] = buffer[i];
  }
  const rampSize = 1024;
  for (let i = 0; i < rampSize; i++) {
    tmpBuffer[i] *= (i / rampSize);
    tmpBuffer[tmpBuffer.length - i - 1] *= (i / rampSize);
  }
  window.AudioSource.buffer = window.AudioBuffer;
  window.AudioSource.connect(window.AudioCtx.destination);
  window.AudioSource.loop = true;
  window.AudioSource.connect(GainNode);
  window.GainNode.connect(window.AudioCtx.destination);
  window.GainNode.gain.value = 1;
  window.AudioSource.start(0);
}

function stopSound() {
  // 3 ways to stop the audio
  // way 1: stop the loop (current sound ends)
  window.AudioSource.loop = false;
  // way 2: cut off the sound
  // window.AudioSource.stop(0);
  // way 3: play a 'blank' sound
  // const buffer = new Array(window.AudBuffSiz).fill(0);
  // playSound(buffer);
}

function playAudio(evt) {
  const mcoo = {};
  mcoo.x = evt.clientX;
  mcoo.y = evt.clientY;
  const dcoo = mouse2data(mcoo);
  const speci = getDataIdx(dcoo.x, dcoo.y, 0);
  const buffer = spec2audio(speci);
  playSound(buffer);
  window.PlayingSpec = speci;
  makeSpecImage(speci);
}

function stopAudio() {
  window.PlayingSpec = -1;
  if (window.AudioSource) {
    stopSound();
  }
  clearSpecImage();
}

function changeAudio(evt) {
  const mcoo = {};
  mcoo.x = evt.clientX;
  mcoo.y = evt.clientY;
  const dcoo = mouse2data(mcoo);
  const speci = getDataIdx(dcoo.x, dcoo.y, 0);
  if ((speci !== window.PlayingSpec) || (window.PlayingSpec < 0)) {
    stopAudio(evt);
    playAudio(evt);
  }
}

let previousPosition = false;
function checkAudio() {
  const indexFinger = document.getElementById('dip_0_1');
  const x = parseInt(indexFinger.offset().left - document.body.scrollLeft(), 10);
  const y = parseInt(indexFinger.offset().top - document.body.scrollTop(), 10);
  const rect = window.ImageCnv.getBoundingClientRect();
  if (x >= rect.left && x <= rect.right && y <= rect.bottom && y >= rect.top) {
    const evt = { clientX: x, clientY: y };
    if (!previousPosition) {
      playAudio(evt);
      previousPosition = true;
    } else {
      changeAudio(evt);
    }
  } else {
    stopAudio('out of bounds');
    previousPosition = false;
  }
}

module.exports = {
  checkAudio,
  playAudio,
  changeAudio,
  stopAudio,
};
