﻿function keyPress(evt){
	switch(evt.keyCode) {
        case 37 : break; //left
		case 38 : break; //up
		case 39 : break; //right
		case 40 : break; //down
	}
	for(var i = 0; i < buttons.length; i++){
		if(evt.keyCode == buttons[i].id){
			buttons[i].isPressed = true;
		}
	}
}
function keyRelease(evt){
	for(var i = 0; i < buttons.length; i++){
		if(evt.keyCode == buttons[i].id){
			buttons[i].isPressed = false;
		}
	}
}
function isKey(name){
	for(var i = 0; i < buttons.length; i++){
		if(name == buttons[i].name){
			return buttons[i].isPressed;
		}
	}
	return false;
}
function mouseUp(e){
	switch (e.button) {
		case 0: // Primary button ("left")
		break;
		case 2: // Secondary button ("right")
		break;
	}
}
function mouseDown(e){
	switch (e.button) {
		case 0: // Primary button ("left")
		break;
		case 2: // Secondary button ("right")
		break;
	}
}
function mouseMove(evt){
		var rct = cnv.getBoundingClientRect();
		mouse.x = evt.clientX - rct.left - 3;
		mouse.y = evt.clientY - rct.top - 3;
}

function update(){
	ctx.fillStyle="#eeeeee";
    ctx.fillRect(0,0,cnv.width,cnv.height);
	if(isKey("down"))ctx.fillStyle = "#222222"; else ctx.fillStyle = "#ff0000";
    ctx.fillRect(-3 + mouse.x,-3 + mouse.y,6,6);
	ctx.font="20px Georgia";
	ctx.fillStyle="red";
	ctx.fillText("Hello world!",10,25);
	ctx.drawImage(img,0,0,8,8,40,60,80,80);
}
function start(){
	mouse = {x: 0, y: 0};
	buttons = [];
	buttons.push({id: 37, name: "left", isPressed: false});
	buttons.push({id: 38, name: "up", isPressed: false});
	buttons.push({id: 39, name: "right", isPressed: false});
	buttons.push({id: 40, name: "down", isPressed: false});
	img = new Image();
	img.src = "images/player.png"
}