function makeSpecImage(speci) {
  // Find the dimensions of the spectrum window and work out the scaling parameters
  const binwid = window.SCwidth / window.DataDepth;
  const yscal = window.SCheight / window.DataMax; // Always go down to zero, regardless of DataMin

  // Loop over all the data bins from low-frequency/red to high/blue and draw rectangles
  let x1 = 0;
  for (let i = 0; i < window.DataDepth; i++) {
    let x2 = Math.ceil((i + 1) * binwid);
    if (x2 > window.SCwidth) {
      x2 = window.SCwidth;
    }
    let y = window.DataCube[speci + (i * window.DataHeight * window.DataWidth)] * yscal;
    if (y > window.SCheight) {
      y = window.SCheight;
    }
    // Get the colour...
    const b = Math.floor(255 * i / (window.DataDepth - 1));
    const r = Math.floor(255 - b);
    const g = 255 - Math.floor((r + b) / 2);

    // Draw a rectangle
    const col = `rgb(${r},${g},${b})`;
    window.SpecCtx.fillStyle = col;
    window.SpecCtx.fillRect(x1, window.SCheight - y, (x2 - x1), y);
    x1 = x2;
  }
}

function clearSpecImage() {
  window.SpecCtx.fillStyle = 'white';
  window.SpecCtx.fillRect(0, 0, window.SCwidth, window.SCheight);
}

module.exports = {
  makeSpecImage,
  clearSpecImage,
};
