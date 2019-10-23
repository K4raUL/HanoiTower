var N;	
let Dpos = [];	        // contains numbers of rod (0-init, 1, 2) 
var isSolutionActive;			
let c = [];				// canvas pointer
let ctx = [];			// 2D context of canvas
var cW, cH;				// canvas width and height

document.addEventListener('keydown', function (e) {
    var code = e.keyCode;
    if (code == 13) {
        solve();
		timeoutStyle(document.getElementById("solveBtn").style);
    }
    else if (code == 46) {
        ClearFun();
		timeoutStyle(document.getElementById("clearBtn").style);
    }
    else if (code == 37) {
		if (isSolutionActive) {
			timeoutStyle(document.getElementById("stepbackw").style);
		}
		else {
			timeoutStyle(document.getElementById("undoBtn").style);
		}
		stepNext(-1);
	}
    else if (code == 39) {
		if (isSolutionActive) {
			timeoutStyle(document.getElementById("stepforw").style);
		}
		else {
			timeoutStyle(document.getElementById("redoBtn").style);
		}
		stepNext(1);
	}
}, false);
  
function timeoutStyle(elemStyle)
{
	elemStyle.backgroundColor = '#CC0000';
	elemStyle.color = 'white';
	setTimeout(function(){
		elemStyle.backgroundColor = '#F6F8F9';
		elemStyle.color = '#CC0000';
	}, 150);	
}
  
function setSizeD()
{
    var v = document.getElementById("level").value;
    N = Number(v);
    document.getElementById("sizeD").innerHTML = v;
    ClearFun();   
}
      
function ClearFun()
{
    Dpos = [];
    ctx[0].clearRect(0, 0, cW, cH);
	ctx[1].clearRect(0, 0, cW, cH);
	ctx[2].clearRect(0, 0, cW, cH);
    document.getElementById("totalP").innerHTML = 0;
	
	DrawInitField();
}

function DrawInitField()
{
	var D0_width  = cW*0.85;
	var D0_height = cH*0.64/(N+1);
	var delta = 1/(N+1.25);
	
	ctx[0].lineWidth = 2;
	
	for (var i = 0; i < N; i++) {
		ctx[0].fillStyle = "rgba(255, 255, 0, 0.8)";
		//ctx[0].strokeStyle = "rgb(255, 0, 0)";		// border
		var tlX = cW/2 - D0_width*(1 - i*delta)/2;
		var tlY = cH*0.84 - (i+1)*D0_height;
		roundRect(ctx[0], tlX, tlY, D0_width*(1 - i*delta), D0_height, D0_height/2.05, true, true);		
	}
}

function setRange(sender)
{
    var val = sender.value;
    if (val == NaN || val == null || val == undefined || val < 4) val = 4;
    else if (val > 10) val = 10;
    sender.value = val;
}

function Init()
{
    N = 4;
    c[0] = document.getElementById("myC0");
	c[1] = document.getElementById("myC1");
	c[2] = document.getElementById("myC2");
	
	for (var i = 0; i < 3; i++) {
		c[i].width = window.innerWidth*0.78/3.;     // equals window dimension
		c[i].height = window.innerHeight*0.975;
		ctx[i] = c[i].getContext("2d");
	}
	
    cW = c[0].width;
    cH = c[0].height;
	
	ClearFun();
}

function selectDisk(sender)
{
	
}

function solve()
{
    isSolutionActive ^= 1;
    
    document.getElementById("solveBtn").innerHTML = isSolutionActive ? "Return" : "Solve!";
    var appBanners = document.getElementsByClassName('step');
    for (var i = 0; i < appBanners.length; i++) {
        appBanners[i].style.display = isSolutionActive ? 'inline-block' : 'none';
    }
    
    if (!isSolutionActive) return;
    
    ClearFun();
    stepNext(1);
}

function endGame()
{
    var res = 1;
    Dpos.forEach(function(element) {
      res *= element;
    });
    
    return (res == 1 || res == 2**N) ? 1 : 0;
}

function stepNext(dir)
{
    
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}


