function linkCanvases() {
  window.GasCnv = document.getElementById('GasCanvas');
  const GasCtx = window.GasCnv.getContext('2d');
  const GCwidth = GasCtx.canvas.width;
  const GCheight = GasCtx.canvas.height;
  window.ImgOffX = 5;
  window.ImgOffY = 4;
  window.GasWidth = GCwidth - (window.ImgOffX * 2);
  window.GasHeight = GCheight - (window.ImgOffY * 2);

  window.StarCnv = document.getElementById('StarCanvas');
  const StarCtx = window.StarCnv.getContext('2d');
  const SCwidth = StarCtx.canvas.width;
  const SCheight = StarCtx.canvas.height;
  window.StarWidth = SCwidth - (window.ImgOffX * 2);
  window.StarHeight = SCheight - (window.ImgOffY * 2);
}

module.exports = linkCanvases;
