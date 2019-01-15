function keyPress(evt){
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
function isKeyPressed(name){
	for(var i = 0; i < buttons.length; i++){
		if(name == buttons[i].name){
			return buttons[i].isPressed && !buttons[i].lastPressed;
		}
	}
	return false;
}
function isKeyReleased(name){
	for(var i = 0; i < buttons.length; i++){
		if(name == buttons[i].name){
			return !buttons[i].isPressed && buttons[i].lastPressed;
		}
	}
	return false;
}
function anyKey(){
	for(var i = 0; i < buttons.length; i++){
		if(buttons[i].isPressed) return true;
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
function mouseclick(evt,isLeft){
	if(evt.which == 1){
		var x = evt.clientX;
		var y = evt.clientY;
	}
}

function start(){
	inputsGen();
	fieldDrawGen();
	loadGraphics();
	gameObjects = [];
	gameObjects.push(getPlayer(500,300));
	for(var i = 0; i < 30; i++){
		gameObjects.push(getAim(Math.random() * 1000 + 140,Math.random() * 600 + 60));
	}
}
function update(){
	ctx.fillStyle=fieldColor;
    ctx.fillRect(0,0,cnv.width,cnv.height);
	drawGrid();
	step();
	draw();
	
    /*ctx.fillRect(-3 + mouse.x,-3 + mouse.y,6,6);
	ctx.font="20px Georgia";
	ctx.fillStyle="red";
	ctx.fillText("Hello world!",10,25);*/
	
	//ctx.drawImage(img,0,0,41,52,40,60,41,52);
}
function step(){
	for(var i = 0; i < buttons.length; i++){
		buttons[i].lastPressed = buttons[i].isPressed;
	}
	for(var i = 0; i < gameObjects.length; i++){
		gameObjects[i].step();
	}
	if(anyKey()){
		for(var i = 0; i < gameObjects.length; i++){
			gameObjects[i].timeStep();
		}	
	}
}
function draw(){
	for(var i = 0; i < gameObjects.length; i++){
		gameObjects[i].draw();
	}
}
function inputsGen(){
	mouse = {x: 0, y: 0};
	buttons = [];
	buttons.push({id: 37, name: "left", isPressed: false, lastPressed: false});
	buttons.push({id: 38, name: "up", isPressed: false, lastPressed: false});
	buttons.push({id: 39, name: "right", isPressed: false, lastPressed: false});
	buttons.push({id: 40, name: "down", isPressed: false, lastPressed: false});
	
	buttons.push({id: 87, name: "w", isPressed: false, lastPressed: false});
	buttons.push({id: 65, name: "a", isPressed: false, lastPressed: false});
	buttons.push({id: 83, name: "s", isPressed: false, lastPressed: false});
	buttons.push({id: 68, name: "d", isPressed: false, lastPressed: false});
	buttons.push({id: 81, name: "q", isPressed: false, lastPressed: false});
	buttons.push({id: 69, name: "e", isPressed: false, lastPressed: false});
	buttons.push({id: 70, name: "f", isPressed: false, lastPressed: false});
	
	buttons.push({id: 32, name: "space", isPressed: false});
	
}
function fieldDrawGen(){
	gridSize = 32;
	guideLineFrequency = 4;
	xOffset = 0, yOffset = 0;
	xGuideOffset = 0, yGuideOffset = 0;
	horisontalLineNumber = Math.floor(cnv.height / gridSize) + 1;
	verticalLineNumber = Math.floor(cnv.width / gridSize) + 1;
	
	fieldColor = "#403050";
	gridColor = "#483858";
	guideLineColor = "#504060"
}
function gridStep(){
	if(xOffset == gridSize){
		xOffset = 0;
		xGuideOffset++;
	}else if(xOffset == -1){
		xOffset = gridSize - 1;
		xGuideOffset--;
	}
	if(yOffset == gridSize){
		yOffset = 0;
		yGuideOffset++;
	}else if(yOffset == -1){
		yOffset = gridSize - 1;
		yGuideOffset--;
	}
	
	if(xGuideOffset == guideLineFrequency){
		xGuideOffset = 0;
	}else if(xGuideOffset == -1){
		xGuideOffset = guideLineFrequency - 1;
	}
	
	if(yGuideOffset == guideLineFrequency){
		yGuideOffset = 0;
	}else if(yGuideOffset == -1){
		yGuideOffset = guideLineFrequency - 1;
	}
}
function drawGrid(){
	gridStep();
	ctx.lineWidth="2";
	ctx.beginPath();
	ctx.strokeStyle = gridColor;
	for(var i = 0; i < verticalLineNumber; i++){
		ctx.moveTo(i * gridSize + xOffset, 0);
		ctx.lineTo(i * gridSize + xOffset, cnv.height);
	}
	for(var i = 0; i < horisontalLineNumber; i++){
		ctx.moveTo(0, i * gridSize + yOffset);
		ctx.lineTo(cnv.width, i * gridSize + yOffset);
	}
	ctx.stroke();
	
	ctx.lineWidth="3";
	ctx.beginPath();
	ctx.strokeStyle = guideLineColor;
	for(var i = xGuideOffset; i < verticalLineNumber + xGuideOffset; i+=guideLineFrequency){
		ctx.moveTo(i * gridSize + xOffset, 0);
		ctx.lineTo(i * gridSize + xOffset, cnv.height);
	}
	for(var i = yGuideOffset; i < horisontalLineNumber + yGuideOffset; i+=guideLineFrequency){
		ctx.moveTo(0, i * gridSize + yOffset);
		ctx.lineTo(cnv.width, i * gridSize + yOffset);
	}
	ctx.stroke();
}