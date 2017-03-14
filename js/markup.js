var markup = {
  canvas: null,
  canvas2: null,
  updateCanvas: function(canvas) {
    var ctx = canvas.getContext('2d');
    var canvas2 = markup.canvas;
    var ctx2 = markup.canvas.getContext('2d');
    canvas2.width=canvas.width;
    canvas2.height=canvas.height;
    ctx2.drawImage(canvas,0,0);
  },
  drawX: function(x,color)
  {
    var ctx = markup.canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x,canvas.height);
    ctx.strokeStyle=color;
    ctx.lineWidth = debugMode ? 1 : 2;
    ctx.stroke();
  },

  drawY: function(y,color)
  {
    var ctx = markup.canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(canvas.width,y);
    ctx.strokeStyle=color;
    ctx.lineWidth = debugMode ? 1 : 2;
    ctx.stroke();
  },

  drawLine: function(x1,y1,x2,y2,color)
  {
    var ctx = markup.canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle=color;
    ctx.lineWidth = debugMode ? 1 : 2;
    ctx.stroke();
  },
  pushImage: function(ratio, format) {
    markup.canvas2.width = markup.canvas.width * ratio;
    markup.canvas2.height = markup.canvas.height * ratio;
    markup.canvas2.getContext("2d").drawImage(markup.canvas, 0, 0, markup.canvas2.width, markup.canvas2.height);
    imgLog_img(markup.canvas2.toDataURL(), format);
    
  }
}