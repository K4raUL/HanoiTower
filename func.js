var N;	
let Dpos = [];	        // contains numbers of rod (0-init, 1, 2) 
var isSolutionActive;			
var c;					// canvas pointer
var cW, cH;				// canvas width and height
var ctx;				// 2D context of canvas
var canvasData; 		// image data of context    

document.addEventListener('keydown', function (e) {
    var code = e.keyCode;
    if (code == 13) {
        solve();
        var sBtn = document.getElementById("solveBtn").style
        sBtn.backgroundColor = '#CC0000';
        sBtn.color = 'white';
        setTimeout(function(){
            sBtn.backgroundColor = '#F6F8F9';
            sBtn.color = '#CC0000';}, 150);
    }
    else if (code == 46) {
        ClearFun();
        var sBtn = document.getElementById("clearBtn").style
        sBtn.backgroundColor = '#CC0000';
        sBtn.color = 'white';
        setTimeout(function(){
            sBtn.backgroundColor = '#F6F8F9';
            sBtn.color = '#CC0000';}, 150);
    }
    else if (code == 37) {}// step back
    else if (code == 39) {}// step forward
}, false);
      
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
    ctx.clearRect(0, 0, cW, cH);
    canvasData = ctx.getImageData(0, 0, cW, cH);
    document.getElementById("totalP").innerHTML = 0;
	
	DrawInitField();
}

function DrawInitField()
{
    
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
    N = Number(document.getElementById("sizeD").value);
    c = document.getElementById("myC");
    ctx = c.getContext("2d");

    cW = c.width;
    cH = c.height;
    
    ClearFun();
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

