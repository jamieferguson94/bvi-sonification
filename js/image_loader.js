var FITS = astro.FITS;

new FITS("data/cube4_stck.fits", function() {

  var hdu = this.getHDU();
  var fits = hdu.data;
  DataCube = fits._getFrame(fits.buffer, fits.bitpix, fits.bzero, fits.bscale);
  DataReady = true;

  var dx = fits.width, dy = fits.height, dz = fits.depth;
  DataWidth = dx;
  DataHeight = dy;
  DataDepth = dz;
  var xmag = 3, ymag = xmag;
  
  var tmpCopy = DataCube.slice();
  tmpCopy.sort();
  DataMin = tmpCopy[0];
  DataMax = tmpCopy[tmpCopy.length - 1];

  var width = xmag * dx, height = ymag * dy;
    
  var canvas = d3.select("#ImageCanvas")
    //.append("canvas")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "canvas");

  var ctx = canvas.node().getContext("2d");

  var scale = {
    r: d3.scale.linear().domain([0, 2e3]).range([0, 255]),
    g: d3.scale.linear().domain([0, 2e3]).range([0, 255]),
    b: d3.scale.linear().domain([0, 2e3]).range([0, 255])
  };

  var channel = d3.scale.threshold().domain([20, 40]).range(["b", "g", "r"]);

  function redraw() {

    var imageData = ctx.getImageData(0, 0, xmag * dx, ymag * dy);
    var data = imageData.data;
    
      for (var y = 0; y < dy; ++y) {
      for (var v = 0; v < ymag; ++v) {
        for (var x = 0; x < dx; ++x) {
        for (var u = 0; u < xmag; ++u) {
          var index = ((y * ymag + v) * (dx * xmag) + (x * xmag + u)) * 4;
          var color = {r: 0, g: 0, b: 0};
          for (var z = 0; z < dz; ++z) color[channel(z)] += DataCube[z*dx*dy + y*dx + x];
          // flipped colors!!! [hack!]
          data[index]   = scale.r(color.b);
          data[++index] = scale.g(color.g);
          data[++index] = scale.b(color.r);
          data[++index] = 255;
        }};
      }};

    ctx.putImageData(imageData, 0, 0);
    linkCanvases();
    initAudio();
    createListeners();
    //main_leap();
  };

  redraw();
})
