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
		mouse_x = evt.clientX;
		mouse_y = evt.clientY;
	}
}
function update(){
	ctx.fillStyle="red";
	var r = step;
	var a = r;
	var x = Math.cos(a) * step, y = -Math.sin(a) * step;
    ctx.fillRect(x - 1 + cnv.width / 2, y - 1 + cnv.height / 2, Math.log(step), Math.log(step));
	step += 1;
}
function start(){
	ctx.fillStyle="#eeeeee";
    ctx.fillRect(0,0,cnv.width,cnv.height);
	step = 1;
}