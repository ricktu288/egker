var noteproc = {
  canvas: null,
  getFieldIndex: function(canvas) {
    var ctx = canvas.getContext('2d');
      var top1 = mm(4.9); //===================
      var left = mm(0);
      var right = mm(100);
      var fieldWidth = mm(4); //===================
      var imageData = ctx.getImageData(0, 0,canvas.width,canvas.height); 
    markup.drawY(top1,"red");
    var threshold=400;
    //var jump=8;
    var i=top1;
    //drawY(i+threshold*0.1,"blue");
    //ctx.beginPath();
    //ctx.moveTo(imageData.width,i);
      var R,G,B;
    var d=0;
    for(var j=right;j>left;j--)
    {
      R=imageData.data[((i*(imageData.width*4)) + (j*4)) + 0];
      G=imageData.data[((i*(imageData.width*4)) + (j*4)) + 1];
      B=imageData.data[((i*(imageData.width*4)) + (j*4)) + 2];
      d*=0.5
      d+=255*3-R-G-B;
      //ctx.lineTo(j,i+d*0.1);
          if(d>threshold)
          {
              //linesFoundV.push(j);
              //d=threshold*0.5;
              //j+=jump;
              //drawLine(j , top1 - mm(1), j, top1 + mm(1), "red");
              markup.drawLine((parseInt((j-left)/fieldWidth)+0.5) * fieldWidth, 0, (parseInt((j-left)/fieldWidth)+0.5) * fieldWidth, top1 + mm(1), "red");
              return parseInt((j-left)/fieldWidth);
          }
      
    }
      //return linesFoundV;
  },

  getColumnNum: function(canvas) {
    var ctx = canvas.getContext('2d');
      var top1 = mm(5); //===================
      var left = mm(100);
      var right = mm(105);
      var imageData = ctx.getImageData(0, 0,canvas.width,canvas.height); 
    var threshold=350;
    //var jump=8;
    var i=top1;
    //drawY(i+threshold*0.1,"blue");
    //ctx.beginPath();
    //ctx.moveTo(imageData.width,i);
      var R,G,B;
    var d=0;
    for(var j=right;j>left;j--)
    {
      R=imageData.data[((i*(imageData.width*4)) + (j*4)) + 0];
      G=imageData.data[((i*(imageData.width*4)) + (j*4)) + 1];
      B=imageData.data[((i*(imageData.width*4)) + (j*4)) + 2];
      d*=0.5
      d+=255*3-R-G-B;
      //ctx.lineTo(j,i+d*0.1);
          if(d>threshold)
          {
              return 2;
          }
      
    }
      return 1;
  },

  getLayerCuts: function(canvas, left, right) {
    var ctx = canvas.getContext('2d');
    var top = mm(8); //===================
      var layerWidth = mm(2); //===================
      //var right = left + layerWidth * 4; //===================
      var bottom = canvas.height - mm(1);
      var imageData = ctx.getImageData(0, 0,canvas.width,canvas.height);
    var threshold=400;
      var R,G,B;
    var d=0;
      //var j0;
      var currentLayer=-1;
      var currentLayer_temp=-1;
      var currentLayer_temp_temp;
      var minLayerHeight=mm(1); //===================
      var scanLeft = left + mm(0.5); //===================
      var currentLayerHeight=0;
      var lastLayerMark=-1;
      var result=[];
      
      markup.drawLine(scanLeft, top, scanLeft, bottom, "green");
      
      for (var i = top; i < bottom; i++) {
          d=0;
          currentLayer_temp_temp=-1;
          for(var j=right;j>scanLeft;j--)
          {
              R=imageData.data[((i*(imageData.width*4)) + (j*4)) + 0];
              G=imageData.data[((i*(imageData.width*4)) + (j*4)) + 1];
              B=imageData.data[((i*(imageData.width*4)) + (j*4)) + 2];
              d*=0.5
              d+=255*3-R-G-B;
              //ctx.lineTo(j,i+d*0.1);
              if(d>threshold)
              {
                  //drawLine(left + , layerCuts[i].y, colLeft + (layerCuts[i].depth + 0.5) * mm(2), layerCuts[i+1].y, "red");
                  currentLayer_temp_temp=parseInt((j-mm(0.25)-left)/layerWidth);
                  break;
              }
          }
          
          if (currentLayer_temp_temp == currentLayer_temp) {
              currentLayerHeight++;
          } else {
              currentLayer_temp = currentLayer_temp_temp;
              currentLayerHeight=0;
          }
          
          if (currentLayer_temp != -1 && currentLayerHeight >= minLayerHeight) {
              lastLayerMark=i;
              
              if (currentLayer != currentLayer_temp) {
                  currentLayer = currentLayer_temp;
                  result.push({y: i - minLayerHeight, depth: currentLayer});
              }
          }
      }
      //drawY(lastLayerMark);
      result.push({y: lastLayerMark});
      return result;
  },
  
  crop: function(canvas, x,y,x1,y1,fieldIndex, depth, pushCrop)
  {
    var ctx = markup.canvas.getContext('2d');
      ctx.beginPath();
      ctx.strokeStyle = "blue";
    ctx.rect(x,y,x1-x,y1-y);
      ctx.stroke(); 
      
    noteproc.canvas.width=x1-x;
    noteproc.canvas.height=y1-y;
    noteproc.canvas.getContext("2d").drawImage(canvas,x,y,x1-x,y1-y,0,0,x1-x,y1-y);
    imgproc.postprocess(noteproc.canvas);
    var url=noteproc.canvas.toDataURL();
    
    if(!debugMode) {
      pushCrop(url, fieldIndex, depth);
    }
    
    
    /*
    var fileName=startDate+fileIndex;
    fileIndex++;
    zip.folder("images").file(fileName+".egker", url.substr(url.indexOf(',')+1), {base64: true});
    
    
    var fieldRef=getFieldRef(fieldIndex);
      
      pushData(fileName, fieldRef, depth);
      
      */
  },
  
  
  run: function(canvas, pushCrop)
  {
    imgproc.preprocess(canvas);
    
    markup.updateCanvas(canvas);
    
    var fieldIndex=noteproc.getFieldIndex(canvas);
      
      var columnNum = noteproc.getColumnNum(canvas);
      var leftEdge = mm(0.2);
      var midEdge = leftEdge + mm(102.8);
      var oneColWidth = mm(202.5);
      var twoColWidth = mm(102);
    for(var column=0;column<columnNum;column++)
    {
      var colLeft=column==0 ? leftEdge : midEdge;
          var layerRight=colLeft + mm(8); //===================
          var cropLeft=colLeft + mm(8.3); //===================
      if (columnNum == 1) {
          var colRight = leftEdge + oneColWidth;
      } else if (column == 0) {
          var colRight = leftEdge + twoColWidth;
      } else {
          var colRight = midEdge + twoColWidth;
      }
      //var fieldLeft=column==0?linesFoundV[0]-leftD:linesFoundV[0]-middleRightD;
      //var fieldRight=column==0?linesFoundV[0]-middleLeftD:linesFoundV[0];
      
          var layerCuts = noteproc.getLayerCuts(canvas, colLeft, layerRight);
          
          for (var i = 0; i < layerCuts.length - 1; i++) {
              markup.drawLine(colLeft + (layerCuts[i].depth + 0.5) * mm(2), layerCuts[i].y, colLeft + (layerCuts[i].depth + 0.5) * mm(2), layerCuts[i+1].y, "red");
              noteproc.crop(canvas, cropLeft, layerCuts[i].y, colRight, layerCuts[i+1].y, fieldIndex, layerCuts[i].depth, pushCrop);
          }
      
      log(fieldNames[fieldIndex] + ' ');
    }
    
    //imgproc.changeColor(markup.canvas);
    markup.pushImage(debugMode ? 1 : 0.4, debugMode ? null : "image/jpeg");
    
    
  }
  
}