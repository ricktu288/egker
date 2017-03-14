var imgproc = {
  canvas: null,
  changeColor: function(cvs) {
      var ctx = cvs.getContext("2d");
      var imageData = ctx.getImageData(0, 0,cvs.width,cvs.height);
      var imageData2 = ctx.createImageData(cvs.width,cvs.height);
      //var T=220;
      var T=215;
      var S=5;
      var R,G,B,R1,G1,B1,A1,maxC,minC,r;
      for (var i=0;i<imageData.height;i++){
          for (var j=0;j<imageData.width;j++){
            R=imageData.data[((i*(imageData.width*4)) + (j*4)) + 0]
            G=imageData.data[((i*(imageData.width*4)) + (j*4)) + 1]
            B=imageData.data[((i*(imageData.width*4)) + (j*4)) + 2]
            
              R1=(T-R);
              G1=(T-G);
              B1=(T-B);
              
              maxC=Math.max(R1,G1,B1);

              if(maxC*S>255) {
                  r=255/maxC;
                  R1=255-R1*r;
                  G1=255-G1*r;
                  B1=255-B1*r;
              } else {
                  R1=255-R1*S;
                  G1=255-G1*S;
                  B1=255-B1*S;
              }
              minC=Math.min(R1,G1,B1);
              R1 -= minC;
              G1 -= minC;
              B1 -= minC;
              A1 = 255 - minC;
              
              R1=Math.round(R1*0.0625)*16;
              G1=Math.round(G1*0.0625)*16;
              B1=Math.round(B1*0.0625)*16;
              A1=Math.round(A1*0.0625)*16;
              
              /*
              R1=Math.round(R1*0.03125)*32;
              G1=Math.round(G1*0.03125)*32;
              B1=Math.round(B1*0.03125)*32;
              */
            imageData2.data[((i*(imageData.width*4)) + (j*4)) + 0]=R1;    //紅色
            imageData2.data[((i*(imageData.width*4)) + (j*4)) + 1]=G1;    //綠色
            imageData2.data[((i*(imageData.width*4)) + (j*4)) + 2]=B1;    //藍色
            imageData2.data[((i*(imageData.width*4)) + (j*4)) + 3]=A1;
            
           
          }
        }
      ctx.putImageData(imageData2, 0, 0);
      //ctx2.putImageData(imageData2, 0, 0);
  },
  rotate: function(canvas) {
    var ctx = canvas.getContext('2d');
    var canvas2 = imgproc.canvas;
    var ctx2 = canvas2.getContext('2d');
    
    canvas2.width=canvas.width;
    canvas2.height=canvas.height;
    
      var imageData = ctx.getImageData(0, 0,canvas.width,canvas.height);
    //var j0=[100,2476];
    var j0=[100,2400];
    
    //drawX(left,"red");
    //drawX(right,"red");
      
    var rotateDetectLength=j0[1]-j0[0];
    
    var threshold=400;
    var j;
      var i1=[];
    var d=threshold*2;
      var R,G,B;
      
      for(var k in j0) {
          j=j0[k];
          for(var i=0;i<imageData.height;i++)
          {
              R=imageData.data[((i*(imageData.width*4)) + (j*4)) + 0];
              G=imageData.data[((i*(imageData.width*4)) + (j*4)) + 1];
              B=imageData.data[((i*(imageData.width*4)) + (j*4)) + 2];
              d*=0.5;
              d+=255*3-R-G-B;
              if(d<threshold)
              {
                  i1[k]=i;
                  break;
              }
          }
      }
      
      var angle=Math.atan((i1[0]-i1[1])/rotateDetectLength);
      ctx2.fillStyle="black";
    ctx2.fillRect(0,0,imageData.width,imageData.height);
    ctx2.save();
    ctx2.translate(0,-i1[0]*Math.cos(angle)-5);
    ctx2.rotate(angle);
    //console.log((j2-j1)/rotateDetectLength);
    ctx2.drawImage(canvas,0,0)
    ctx2.restore();
      
      imageData = ctx2.getImageData(0, 0,canvas2.width,canvas2.height);
      
      d=threshold*2;
      for(var k in j0) {
          j=j0[k];
          for(var i=imageData.height-1;i>0;i--)
          {
              R=imageData.data[((i*(imageData.width*4)) + (j*4)) + 0];
              G=imageData.data[((i*(imageData.width*4)) + (j*4)) + 1];
              B=imageData.data[((i*(imageData.width*4)) + (j*4)) + 2];
              d*=0.5;
              d+=255*3-R-G-B;
              if(d<threshold)
              {
                  i1[k]=i;
                  break;
              }
          }
      }
      
      ctx2.fillStyle="white";
      ctx2.beginPath();
      ctx2.moveTo(2*j0[0]-j0[1],2*i1[0]-i1[1]-5);
      ctx2.lineTo(2*j0[1]-j0[0],2*i1[1]-i1[0]-5);
      ctx2.lineTo(2*j0[1]-j0[0],imageData.height);
      ctx2.lineTo(2*j0[0]-j0[1],imageData.height);
      ctx2.fill();
      
      canvas.height=Math.max(i1[0],i1[1]);
      ctx.drawImage(canvas2,0,0);
      
      
  },
  getEdge: function(imageData, i) {
      var threshold=300;
      var d=threshold*2;
    var hasEnteredPaper=false;
      var paperPos;
    var jump=8;
      for(var j=0;j<imageData.width;j++)
      {
          R=imageData.data[((i*(imageData.width*4)) + (j*4)) + 0];
          G=imageData.data[((i*(imageData.width*4)) + (j*4)) + 1];
          B=imageData.data[((i*(imageData.width*4)) + (j*4)) + 2];
          d*=0.5;
          //d+=255*3-R-G-B;
          d+=255*3-R*1.5-G*1.5;
      if(!hasEnteredPaper)
      {
        if(d<threshold)
        {
          hasEnteredPaper=true;
                  paperPos=j;
          j+=jump;
        }
      }
      else
      {
        if(d>threshold)
        {
                  if(j - paperPos > mm(1) & j - paperPos < mm(10)) {
                      console.log(j)
                      return j;
                  } //else {
                      //throw "invalid edge position: i = " + i + ", j = " + j;
                  //}
        }
      }
      }
      //throw "no edge detected: i = " + i;
  },


  getEdgePlus: function(imageData, i) {
    var step = mm(0.5);
    var e1 = imgproc.getEdge(imageData, i - step);
    var e2 = imgproc.getEdge(imageData, i);
    var e3 = imgproc.getEdge(imageData, i + step);
    if (e1 && e2 && e3 && Math.max(e1, e2, e3) - Math.min(e1, e2, e3) < 3) {
      //throw "edge unstable: i = " + i;
      return (e1 + e2 + e3) / 3;
    }
    
  },


  shear: function(canvas) {
    var ctx = canvas.getContext('2d');
    var canvas2 = imgproc.canvas;
    var ctx2 = canvas2.getContext('2d');
    canvas2.width=canvas.width;
    canvas2.height=canvas.height;
    ctx2.drawImage(canvas,0,0);
    
    if(debugMode) {
      markup.updateCanvas(canvas);
      var ctx_mk = markup.canvas.getContext('2d');
    }
    
      var imageData = ctx.getImageData(0, 0,canvas.width,canvas.height);
      var imageData2 = ctx.createImageData(canvas.width,canvas.height);
      var ey = []; //[mm(50), mm(80), mm(110), mm(140), mm(170), mm(200), mm(230), mm(260)];
      var ex = [];
      
      for (var i = mm(5); i < imageData.height; i += mm(5)) {
        var edge = imgproc.getEdgePlus(imageData, i);
        if (edge) {
          ey.push(i);
          ex.push(edge);
        }
      }
      var edges = [];
      
      for (var k = 0; k < ey.length - 1; k++) {
        var start = (k == 0) ? 0 : ey[k];
        var end = (k == ey.length - 2) ?  imageData.height : ey[k + 1];
        
        if(debugMode) {
          ctx_mk.strokeStyle = (k % 2 == 0) ? 'green' : 'red';
          ctx_mk.beginPath();
          ctx_mk.moveTo(0, start);
        }
        
        for (var i = start; i < end; i++) {
          edges[i] = (i - ey[k]) * (ex[k + 1] - ex[k])/(ey[k + 1] - ey[k]) + ex[k];
          if(debugMode) {
            ctx_mk.lineTo(edges[i], i);
          }
        }
        if(debugMode) {
          ctx_mk.stroke();
        }
      }
      
      if(debugMode) {
        markup.pushImage(1);
      }
      
      var j1;
      for(var i=0;i<imageData.height;i++) {
          j1 = edges[i];
          ctx.drawImage(canvas2,j1,i,imageData.width-j1,1,0,i,imageData.width-j1,1);
      }
  },
  
  preprocess: function(canvas) {
    imgproc.rotate(canvas);
    imgproc.shear(canvas);
  },
  
  postprocess: function(canvas) {
    imgproc.changeColor(canvas);
  }
  
  
}