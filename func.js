var N;	
let Dpos = [];	        // contains numbers of rod (0-init, 1, 2) 
var isSolutionActive;	
var isDiskActive;		// 0 - no active disk. 1, 2, 3 - number of active canvas + 1		
let c = [];				// canvas pointer
let ctx = [];			// 2D context of canvas
let colors = [0x10FF00FF, 0x1000FFFF, 0xFF1000FF, 0x10FFFFFF, 0xFFFF10FF, 0xCC10FFFF, 0xFF6699FF, 0xFF9910FF, 0x6699FFFF, 0x109966FF];
//				green		 blue		 red		 cyan		yellow		magenta
var cW, cH;				// canvas width and height
var D0_width, D0_height, zeroH, delta;

function mod(n, m) {
  return ((n % m) + m) % m;
}

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
	else if (code == 49 || code == 97) selectDisk(document.getElementById("myC0"));
	else if (code == 50 || code == 98) selectDisk(document.getElementById("myC1"));
	else if (code == 51 || code == 99) selectDisk(document.getElementById("myC2"));	
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
	if (isSolutionActive) {
		isSolutionActive = 0;
		document.getElementById("solveBtn").innerHTML = "Solve!";
		var appBanners = document.getElementsByClassName('step');
		for (var i = 0; i < appBanners.length; i++) {
			appBanners[i].style.display = 'none';
		}
	}
	isDiskActive = 0;
	
    Dpos = [];
	for (var i = 0; i < N; i++) Dpos[i] = 0;
	
	ctx[0].clearRect(0, 0, cW, cH);
	ctx[1].clearRect(0, 0, cW, cH);
	ctx[2].clearRect(0, 0, cW, cH);
    document.getElementById("totalP").innerHTML = 0;
	
	shuffle(colors);
	DrawInitField();
}

function DrawInitField()
{
	D0_width  = cW*0.85;
	D0_height = cH*0.64/(N+1);
	zeroH 	  = cH*0.84;
	delta 	  = 1/(N+1.25);
	
	for (var i = 0; i < N; i++) {
		ctx[0].fillStyle = "#" + (colors[N-i-1]-80).toString(16);
		//ctx[0].strokeStyle = "rgb(255, 0, 0)";		// border
		var tlX = cW/2 - D0_width*(1 - i*delta)/2;
		var tlY = zeroH - (i+1)*D0_height;
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
		ctx[i].lineWidth = 2;
	}
	
    cW = c[0].width;
    cH = c[0].height;
	
	ClearFun();
}

// select or move disk in depending of isDiskAvtive
function selectDisk(sender)
{
	if (isSolutionActive) return;
	
	var elst = document.getElementById("report");
	var iter = 0;
	var sid = sender.id;
	if (sid == "myC0") iter = 0;
	else if (sid == "myC1") iter = 1;
	else if (sid == "myC2") iter = 2;

	// move disk
	if (isDiskActive) {
		if (iter != isDiskActive-1) {
			var startIter = isDiskActive-1;
			// if player tried to put bigger disk above smaller
			if (!MoveDisk(startIter, iter)) {
				elst.style.color = 'red';
				setTimeout(function(){
					elst.style.color = '#F6F8F9';
				}, 1000);
				
				SelectDisk(startIter);
				isDiskActive = 0;
				return;
			}
			
			var score = Number(document.getElementById("totalP").innerHTML)+1;
			document.getElementById("totalP").innerHTML = score;
			
			if (endGame()) {
				elst.style.color = 'green';
				elst.innerHTML = (score == -1 + 2**N) ? 'YOU WON!!! Optimal solution!' : 'YOU WON!!!';
				setTimeout(function(){
					elst.style.color = '#F6F8F9';
					elst.innerHTML = 'Wrong move!';
				}, 2500);
			}
		}
		// drop selection
		else SelectDisk(iter);
		isDiskActive = 0;
	}
	// select disk (set active)
	else {
		if (!SelectDisk(iter)) {
			elst.style.color = 'red';
			elst.innerHTML = 'Empty rod!';
			setTimeout(function(){
				elst.style.color = '#F6F8F9';
				elst.innerHTML = 'Wrong move!';
			}, 1000);	
			return;
		}
		isDiskActive = iter+1;
	}
}

// remove disk from top of canv0 and place it to canv1
function MoveDisk(canv0, canv1)
{
	var topD0 = Dpos.findIndex(function(element) { 
		return element == canv0; 
	});
	var topD1 = Dpos.findIndex(function(element) { 
		return element == canv1; 
	});
	if (DiskSum(canv0) == 0) return false;
	if (topD0 > topD1 && DiskSum(canv1) != 0) return false;
	Dpos[topD0] = canv1;

	var diskNum = DiskSum(canv0)+1;
	var tlX = cW/2 - D0_width*(1 - (N-1-topD0)*delta)/2;
	var tlY = zeroH - diskNum*D0_height;
	var diW = D0_width*(1 - (N-1-topD0)*delta);
	ctx[canv0].clearRect(tlX-1, tlY-1, diW+2, D0_height);
	
	diskNum = DiskSum(canv1);
	tlX = cW/2 - D0_width*(1 - (N-1-topD0)*delta)/2;
	tlY = zeroH - diskNum*D0_height;
	ctx[canv1].fillStyle = "#" + (colors[topD0]-64).toString(16);
	roundRect(ctx[canv1], tlX, tlY, diW, D0_height, D0_height/2.05, true, true);	
	
	return true;
}

// select/unselect disk (make active/inactive) on top of canv
function SelectDisk(canv)
{
	var diskNum = DiskSum(canv);
	if (diskNum == 0) return false;
	var topD = Dpos.findIndex(function(element) { 
		return element == canv; 
	});

	var opac = isDiskActive ? 64 : 0;
	var tlX = cW/2 - D0_width*(1 - (N-1-topD)*delta)/2;
	var tlY = zeroH - diskNum*D0_height;
	var diW = D0_width*(1 - (N-1-topD)*delta);
	ctx[canv].fillStyle = "#" + (colors[topD]-opac).toString(16);
	ctx[canv].clearRect(tlX-1, tlY-1, diW+2, D0_height);
	roundRect(ctx[canv], tlX, tlY, diW, D0_height, D0_height/2.05, true, true);	
	
	return true;
}

function DiskSum(cid)
{
	var sum = 0;
	for (var i = 0; i < N; i++) {
		if (Dpos[i] == cid) sum++;
	}
	return sum;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function solve()
{
    document.getElementById("solveBtn").innerHTML = !isSolutionActive ? "Return" : "Solve!";
    var appBanners = document.getElementsByClassName('step');
    for (var i = 0; i < appBanners.length; i++) {
        appBanners[i].style.display = !isSolutionActive ? 'inline-block' : 'none';
    }
	
	// clearing
	isDiskActive = 0;
    Dpos = [];
	for (var i = 0; i < N; i++) Dpos[i] = 0;
	ctx[0].clearRect(0, 0, cW, cH);
	ctx[1].clearRect(0, 0, cW, cH);
	ctx[2].clearRect(0, 0, cW, cH);
    document.getElementById("totalP").innerHTML = 0;
	shuffle(colors);
	DrawInitField();   

 	isSolutionActive ^= 1;
    if (!isSolutionActive) return;

	
	for (var i = 1; i < 2**N; i++) {
		var cstep = 0;
		for (var j = 1; j <= N; j++) {
			if (i%(2**j) == 2**(j-1)) {
				cstep = j-1;
				break;
			}
		}
		var newR = (cstep%2) ? mod(Dpos[cstep]+1, 3) : mod(Dpos[cstep]-1, 3);
		MoveDisk(Dpos[cstep], newR);
		Dpos[cstep] = newR;
		
		var score = Number(document.getElementById("totalP").innerHTML)+1;
		document.getElementById("totalP").innerHTML = score;
		await sleep(400);
		if (!isSolutionActive) {
			//ClearFun();
			return;
		}
	}
    stepNext(1);
}

function endGame()
{
    var res = 1;
    Dpos.forEach(function(element) {
      res *= element;
    });
    
    return (res == 1 || res == 2**N) ? true : false;
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

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

