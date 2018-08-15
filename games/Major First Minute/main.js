function keyPress(evt){
	switch(evt.keyCode) {
        case 37 : break; //left
		case 38 : break; //up
		case 39 : break; //right
		case 40 : break; //down
	}
}
function keyRelease(evt){
	
}
function click(evt){
	if(evt.which == 1){
		var x = evt.clientX;
		var y = evt.clientY;
		
	}
}
function update(){
	ctx.fillStyle="#eeeeee";
    ctx.fillRect(0,0,cnv.width,cnv.height);
	ctx.font="20px Georgia";
	ctx.fillStyle="red";
	ctx.fillText("Hello world!",10,25);
	//ctx.drawImage(img,0,0,128,128,40,60,128,128);
	for(var i = 0; i < map.units.length; i++){
		var unit = map.units[i];
		if(MathUtils.intersectORC(cam, unit.pos)){
			ctx.drawImage(img,0,0,128,128,unit.pos.x - 64,unit.pos.y - 112,128,128);
			ctx.beginPath();
			ctx.strokeStyle = "green";
			ctx.ellipse(unit.pos.x,unit.pos.y,unit.pos.r,unit.pos.r / 2,0,0,2*Math.PI);
			ctx.stroke();
		}
	}
}
function start(){
	img = new Image();
	img.src = "images/tauros.png"
	constGen();
	map = new Map(1000, 1000);
	cam = {x: 0, y: 0, w: width, h: height};
	map.units.push(new Unit(100,250))
}
function constGen(){
	width = cnv.width;
	height = cnv.height;
}
class Map{
	constructor(w, h){
		this.width = w;
		this.height = h;
		this.units = new Array();
	}
}
class Unit{
	constructor(x, y){
		this.pos = {x: x, y: y, r: 50};
	}
}