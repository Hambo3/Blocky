
//https://javascript.info/class-inheritance
//https://dev.to/nitdgplug/learn-javascript-through-a-game-1beh
//https://www.minifier.org/
//"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe C:\z\Git\WG5\index.htm" --allow-file-access-from-files
var fps = 120;
var rf = (function(){
  return window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(cb){
          window.setTimeout(cb, 1000 / fps);
      };
})();

var lastTime;
var now;
var dt = 0;

var slowMo = 1;
var step = 1 / fps;
var sStep = slowMo * step;

var DEBUG;

var GAME;
var GFX;
var SFX;
var MAP;
var AUDIO;
var SPRITES = [];
var PHYSICS = new World();
var canvas;

var IsTouchDevice = window.ontouchstart !== undefined;

//sprite definitions
var spriteDef = {
	'player':{tag:'sprites32',src:[{x:0,y:0}],w:32,h:32},
	'block16':{tag:'sprites16',src:[{x:16,y:0}],w:16,h:16},
	'brick16':{tag:'sprites16',src:[{x:32,y:0}],w:16,h:16},	
	'box16':{tag:'sprites16',src:[{x:48,y:0}],w:16,h:16},
	'ball16':{tag:'sprites16',src:[{x:64,y:0}],w:16,h:16},

	'block32':{tag:'sprites32',src:[{x:32,y:0}],w:32,h:32},
	'brick32':{tag:'sprites32',src:[{x:64,y:0}],w:32,h:32},
	'box32':{tag:'sprites32',src:[{x:96,y:0}],w:32,h:32},
	'ball32':{tag:'sprites32',src:[{x:128,y:0}],w:32,h:32},

	'brick10h':{tag:'sprites16.2',src:[{x:0,y:0}],w:160,h:16},
	'brick10v':{tag:'sprites16.2',src:[{x:0,y:0}],w:16,h:160}
	};

	var spritePal =[
		"#0FFF1B",
		"#000000",
		"#494949",
		"#898989",
		"#ADADAD",
		"#C6C6C6",
		"#FFFFFF",
		"#FF1500",
		"#021BFF",
		"#DA792C",
		"#EA8C2E",
		"#FFC166",
		"rgba(100,173,217,0.6)",
		"rgba(92,160,192,0.6)"			
		];

var spriteData = "7|8|7,4|8|7|0|2,6|0,2|9,6|0,2|12,6|0,4|8,2|0,4|1,6|0,2|1,6|0|7,2|6,4|7,2|2|3,6|2|9,6|10|9|12|13,6|12|0|8,6|0|1|4,3|5,3|1,2|4,3|5,3|1|7|6,6|7|2|3,5|4|2|9,3|10,4|9|12|13,6|12|0|8,6|0|1|4,4|5,2|1,2|4,4|5,2|1|7|6|1|6,2|1|6|7|2|3,5|4|2|9|10|9,6|12|13,6|12|8,8|1|4,5|5|1,2|4,5|5|1|7|6,6|7|2|3,3|4,2|5|2|9|10,6|9|12|13,6|12|8,8|1|4,6|1,2|4,6|1|8,3|1,2|8,3|2|3,2|4,2|5,2|2|9,6|10|9|12|13,6|12|0|8,6|0|1|4,6|1,2|4,6|1|8,8|2|3|4,2|5,3|2|9|10,6|9|12|13,6|12|0|8,6|0|1|4,6|1,2|4,6|1|0|7,2|0,2|7,2|0,2|2,6|0,2|9,4|10|9|0,2|12,6|0,4|8,2|0,4|1,6|0,2|1,6|0";

		
var map = {
	set:"tile",
	size:{
		tile:{width:32, height:32},
		screen:{width:25, height:19},
		world:{width:37, height:24}
	},
	//data:"1,117|0|1,36|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,42",
	data:"1,117|0|1,36|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,11|0,26|1,2|2|1,8|2|0,24|2,2|1|2|1,7|2|1|2|1,21|2,2|1,2|2|1,2|2",
	xdata:[
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	]
};

/*****************************/
function Start(canvasBody)
{	
	// Create the canvas
	canvas = document.createElement("canvas");
	if(canvas.getContext)
	{
		ctx = canvas.getContext("2d");
		canvas.width = (map.size.screen.width * map.size.tile.width);
		canvas.height = (map.size.screen.height * map.size.tile.height);

		var b = document.getElementById(canvasBody);
    	b.appendChild(canvas);

		MAP = new MapManger(ctx, map, new Vector2(0,0));

		if(map.size.world.height > map.size.world.width){
			MAP.maxScale = map.size.world.width/map.size.screen.width;
		}
		else{
			MAP.maxScale = map.size.world.height/map.size.screen.height;
		}

		DEBUG = new DebugEdit(MAP.screenCtx, 400, 600 ,'#fff', 5);

		//offscreen renderer
		GFX = new Render(MAP.osCanvas.ctx);	
		SFX = new Render(MAP.screenCtx, map.size.screen.width* map.size.tile.width, 
			map.size.screen.height* map.size.tile.height);	

		Input.Init(canvas, IsTouchDevice, SFX);

		SPRITES = new SpritePreProcessor(null, spriteDef);	

		preInit();
	}
}

function preInit(){
	MAP.Init(true);

	Generate('sprites16', 2);
	Generate('sprites32', 4);
	Generate1();	
	init();
}


function Generate1(){
	var g = document.createElement('canvas');
	var gctx = g.getContext('2d');
	var gx = new Render(gctx);      

	var s = SPRITES.Get('brick16', 0);
	for (var i = 0; i < 10; i++) {
		gx.Sprite(8+(i*16), 8, s, 1, 0);
	}
	for (var i = 0; i < 10; i++) {
		gx.Sprite(8, 8+(i*16), s, 1, 0);
	}
	SPRITES.assets['sprites16.2'] = g;
}

function Generate(tagname, sz){
	var g = document.createElement('canvas');
	var gctx = g.getContext('2d');
	var gx = new Render(gctx);      
	
	var spr = Util.Unpack(spriteData);
	//var sz = 4;

	for (var i = 0; i < spr.length; i++) {
		if(spr[i]>0){
			var c = parseInt(i % 56);
			var r = parseInt(i / 56);
			gx.Box(c*sz, r*sz, sz, sz, spritePal[spr[i]]);
		}
	}

	SPRITES.assets[tagname] = g;
}

function init()
{  
	lastTime = 0;

	GAME = new Blocky(canvas);

	FixedLoop();  
}

function SlowMo(mo){
	sStep = mo * step;
}

function FixedLoop(){
	if(Input.IsSingle('Escape') ) {

	}

//debug	
if(Input.IsSingle('KeyY') ) {
	slowMo+=1;
	SlowMo(slowMo);		
}
else if(Input.IsSingle('KeyT') ) {
	if(slowMo-1 > 0){
		slowMo-=1;
		SlowMo(slowMo);
	}
}

// if(Input.IsDown('KeyX') ) {
// 	MAP.Zoom(0.01);
// 	GAME.offset = MAP.ScrollTo(new Vector2(17.5*32,13.5*32), 0.01);
// }
// else if(Input.IsDown('KeyZ') ) {
// 	MAP.Zoom(-0.01);
// 	GAME.offset = MAP.ScrollTo(new Vector2(17.5*32,13.5*32), 0.01);
// }
//debug		
	now = timestamp();
	dt = dt + Math.min(1, (now - lastTime) / 1000);
	while (dt > sStep) {
	  dt = dt - sStep;
	  update(step);
	}

	render();
				
	lastTime = now;
	rf(FixedLoop);
}

function timestamp() {
	var wp = window.performance;
	return wp && wp.now ? wp.now() : new Date().getTime();
}

// Update game objects
function update(dt) {
	GAME.Update(dt);
};

function render() {
	GAME.Render();

	DEBUG.Render(true,true);
};

onkeydown = function(e)
{
    Input.Pressed(e, true);
};

onkeyup = function(e)  {
    Input.Pressed(e, false);
    Input.Released(e, true);
};

onblur = function(e)  {
    Input.pressedKeys = {};
};


window.onload = function() {
	Start("canvasBody");
}

