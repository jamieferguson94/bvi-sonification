function linkCanvases() {
  window.ImageCnv = document.getElementById('ImageCanvas');
  const ImageCtx = window.ImageCnv.getContext('2d');
  const ICwidth = ImageCtx.canvas.width;
  const ICheight = ImageCtx.canvas.height;
  window.ImgOffX = 5;
  window.ImgOffY = 4;
  window.ImageWidth = ICwidth - (window.ImgOffX * 2);
  window.ImageHeight = ICheight - (window.ImgOffY * 2);

  const SpecCnv = document.getElementById('SpecCanvas');
  window.SpecCtx = SpecCnv.getContext('2d');
  window.SCwidth = window.SpecCtx.canvas.width;
  window.SCheight = window.SpecCtx.canvas.height;
}

module.exports = linkCanvases;
