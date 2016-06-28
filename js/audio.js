const { mouse2data, getDataIdx } = require('./helper_functions');
const spec2audio = require('./spec_to_audio');
const { makeSpecImage, clearSpecImage } = require('./spec_image');

function playAudio(evt) {
  const mcoo = {};
  mcoo.x = evt.clientX;
  mcoo.y = evt.clientY;
  const dcoo = mouse2data(mcoo);
  const speci = getDataIdx(dcoo.x, dcoo.y, 0);
  window.AudioSource = window.AudioCtx.createBufferSource();
  spec2audio(speci);
  window.PlayingSpec = speci;
  window.AudioSource.start(0);
  makeSpecImage(speci);
}

function stopAudio() {
  window.PlayingSpec = -1;
  if (window.AudioSource) {
    // AudioSource.stop(0);
    // GainNode.gain.value = 0;
    window.AudioSource = window.AudioCtx.createBufferSource();
    const tmpBuffer = AudioBuffer.getChannelData(0);
    for (let i = 0; i < window.AudBuffSiz; i++) {
      tmpBuffer[i] = 0.0;
    }
    // AudioSource.buffer = AudioBuffer;
    window.AudioSource.connect(window.AudioCtx.destination);
    window.AudioSource.loop = true;
    window.AudioSource.start(0);
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
