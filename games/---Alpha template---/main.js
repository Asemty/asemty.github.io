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
	ctx.drawImage(img,0,0,8,8,40,60,80,80);
}
function start(){
	img = new Image();
	img.src = "images/player.png"
}