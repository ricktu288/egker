var files;
var files_i;
var zip;
var startDate;
var fileIndex;
var canvas;
var debugMode;

function mm(x) {
  return parseInt(x * 11.81102361);
}

imgproc.canvas = document.createElement('canvas');
noteproc.canvas = document.createElement('canvas');
markup.canvas = document.createElement('canvas');
markup.canvas2 = document.createElement('canvas');
canvas = document.createElement('canvas');

function log(msg) {
  document.getElementById('log').innerHTML += msg;
}

function imgLog_msg(msg) {
  document.getElementById('imgLog').appendChild(document.createTextNode(msg));
  document.getElementById('imgLog').appendChild(document.createElement('br'));
}

function imgLog_img(url) {
  var img = document.createElement('img');
  img.src = url;
  document.getElementById('imgLog').appendChild(img);
  document.getElementById('imgLog').appendChild(document.createElement('br'));
}


window.addEventListener('dragenter', function(e) {
  e.stopPropagation();
  e.preventDefault();
}, false);
window.addEventListener('dragover', function(e) {
  e.stopPropagation();
  e.preventDefault();
}, false);
window.addEventListener('drop', function(e) {
  e.stopPropagation();
  e.preventDefault();
  doDrop(e);
}, false);
document.getElementById('complete').addEventListener('click', complete, false);


function doDrop(e) {
  var dt = e.dataTransfer;
  files = [].slice.call(dt.files);
  files.sort(function(a,b) {
    if (a.name < b.name) {
        return -1;
    } else {
        return 1;
    }
  });
  console.log(files);
  files_i=0;
  
  zip = new JSZip();
  startDate=(new Date())*1;
  fileIndex = 1;
  
  document.getElementById('finish').style.display = 'none';
  document.getElementById('log').innerHTML = '';
  document.getElementById('imgLog').innerHTML = '';
  document.getElementById('progress').max = files.length;
  document.getElementById('progress').value = 0;
  document.getElementById('progress').style.display = '';
  
  debugMode = document.getElementById('debugMode').checked;
  loadFiles();
  
}


function loadFiles()
{
	var fr = new FileReader;
	fr.onloadend = function(str){
	//console.log(str)
	var img = new Image();  
  
	img.onload = function(){
		canvas.width = img.width;
		canvas.height = img.height;
		canvas.getContext("2d").drawImage(img,0,0)
    
        try {
            noteproc.run(canvas, pushCrop);
            files_i++;
            document.getElementById('progress').value = files_i;
            log('<br>');
            
            if(files_i<files.length)
            {
              setTimeout(loadFiles,100);
            } else {
              finish();
            }
            
        } catch (e) {
            log(e);
        }
	}
	
	img.src = str.target.result;
	};
	
  
  log(files[files_i].name + ': ');
  imgLog_msg(files[files_i].name);
  
	fr.readAsDataURL(files[files_i]);
}

function pushCrop(url, fieldIndex, depth) {
  var fileName=startDate+fileIndex;
  fileIndex++;
  zip.folder("images").file(fileName+".egker", url.substr(url.indexOf(',')+1), {base64: true});
  
  
  var fieldRef=data[dataNames.indexOf(fieldNames[fieldIndex])];
  
  pushData(fileName, fieldRef, depth);
}

function pushData(data, ref, depth) {
  console.log([data, ref, depth]);
	if (depth == 0) {
        ref.push(data);
    } else {
        if (typeof ref[ref.length - 1] == "number") {
            ref.push([]);
        }
        pushData(data, ref[ref.length - 1], depth - 1);
    }
}

function finish() {
  document.getElementById('progress').style.display = 'none';
  document.getElementById('finish').style.display = '';
}

function complete()
{
	var dataStr="data="+JSON.stringify(data);
	zip.folder("backups").file(startDate+".js", dataStr);
	zip.file("data.js", dataStr);
  
  zip.generateAsync({type:"blob"}).then(function (blob) {
    saveAs(blob, "result.zip");
  });
}
