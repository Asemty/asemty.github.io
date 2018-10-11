function keyPress(evt){
	switch(evt.keyCode) {
        case 37 : break; //left
		case 38 : fieldFill(field, 0); break; //up
		case 39 : break; //right
		case 40 : enterProperties(); break; //down
	}
}
function keyRelease(evt){
	
}
function mouseUp(e){
	switch (e.button) {
		case 0: // Primary button ("left")
		mouseButtons[0] = false;
		break;
		case 2: // Secondary button ("right")
		mouseButtons[1] = false;
		break;
	}
}
function mouseDown(e){
	switch (e.button) {
		case 0: // Primary button ("left")
		mouseButtons[0] = true;
		break;
		case 2: // Secondary button ("right")
		mouseButtons[1] = true;
		break;
	}
}
function mouseMove(evt){
		var x = evt.clientX - canvasRect.left - 4;
		var y = evt.clientY - canvasRect.top - 4;
	if(mouseButtons[1]){
		if(oldMouseButtons[1]){
			fieldDrawLine(field, x - drawFieldCoord.x, y - drawFieldCoord.y, oldMousePos[0] - drawFieldCoord.x, oldMousePos[1] - drawFieldCoord.y, 9, 0);
		}else{
			fieldDrawCircle(field, x - drawFieldCoord.x, y - drawFieldCoord.y, 9, 0);
		}
	}else if(mouseButtons[0]){
		if(oldMouseButtons[0]){
			fieldDrawLine(field, x - drawFieldCoord.x, y - drawFieldCoord.y, oldMousePos[0] - drawFieldCoord.x, oldMousePos[1] - drawFieldCoord.y, 1, 1);
		}else{
			fieldDrawCircle(field, x - drawFieldCoord.x, y - drawFieldCoord.y, 1, 1);
		}
	}
	oldMouseButtons[0] = mouseButtons[0];
	oldMouseButtons[1] = mouseButtons[1];
	oldMousePos = [x, y];
}
function mouseclick(evt,isLeft){
		/*var x = evt.clientX;
		var y = evt.clientY;
	if(isLeft){
		fieldDrawCircle(field, x - drawFieldCoord.x, y - drawFieldCoord.y, 3, 1)
	}else{
		fieldDrawCircle(field, x - drawFieldCoord.x, y - drawFieldCoord.y, 3, 0)
	}*/
}
function update(){
	ctx.fillStyle = fieldColor;
    ctx.fillRect(0,0,cnv.width,cnv.height);
	drawGrid();
	//drawField(drawFieldCoord.x,drawFieldCoord.y, field, true, true);
	drawFields();
}
function start(){
	gridSize = 64, fieldWidth = 6, fieldHeight = 4;
	fieldColor = "#f0e8e0";
	gridColor = "#e0e0d8";
	fieldBorderColor = "#d0d0d0"
	colorsGen();
	canvasRect = cnv.getBoundingClientRect();
	mouseButtons = [false,false];
	oldMouseButtons = [false,false];
	oldMousePos = [0,0];
	
	setProperties(64, 6, 4);
}
function setProperties(grdSz,fldW,fldH){
	gridSize = grdSz, fieldWidth = fldW, fieldHeight = fldH;
	drawFieldCoord = {x: (cnv.width - fieldWidth * gridSize) / 2, y: (cnv.height - fieldHeight * gridSize) / 2, width: fieldWidth * gridSize, height: fieldHeight * gridSize}
	xOffset = drawFieldCoord.x % gridSize;
	yOffset = drawFieldCoord.y % gridSize;
	horisontalLineNumber = Math.floor(cnv.height / gridSize) + 1;
	verticalLineNumber = Math.floor(cnv.width / gridSize) + 1;
	field = startFieldGen(drawFieldCoord.width, drawFieldCoord.height);
}
function enterProperties(){
	var gs = prompt("Введи размерность сетки в пикселях(по умолчанию 64)",64);
	while(!Number.isInteger(Number(gs)) || gs < 0){
		gs = prompt("Не верный ввод, должно быть целое положительное число. \nВведи размерность сетки в пикселях(по умолчанию 64)",64);
	}
	
	var fw = prompt("Сколько ячеек в сетке по ширине будет выделенно для рисования?(по умолчанию 6)",6);
	while(!Number.isInteger(Number(fw)) || fw < 0 ){
		fw = prompt("Не верный ввод, должно быть целое положительное число. \nСколько ячеек в сетке по ширине будет выделенно для рисования?(по умолчанию 6)",6);
	}
	
	var fh = prompt("Сколько ячеек в сетке по высоте будет выделенно для рисования?(по умолчанию 4)",4);
	while(!Number.isInteger(Number(fh)) || fh < 0 ){
		fh = prompt("Не верный ввод, должно быть целое положительное число. \nСколько ячеек в сетке по высоте будет выделенно для рисования?(по умолчанию 4) ",4);
	}
	setProperties(gs, fw, fh);
}
function startFieldGen(w,h){
	var f = {width: w, height: h, data:[]};
	for(var i = 0; i < w; i++){
		f.data[i] = [];
		for(var j = 0; j < h; j++){
			f.data[i][j] = 0;
		}
	}
	return f;
}
function colorsGen(){
	colors = [
		[0,0,0,false], // empty
		[68,68,68,true] // gray
	];
}
function drawGrid(){
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
	
	ctx.beginPath();
	ctx.lineWidth="3";
	ctx.strokeStyle = fieldBorderColor;
	ctx.rect(drawFieldCoord.x, drawFieldCoord.y, drawFieldCoord.width, drawFieldCoord.height);
	ctx.stroke();
}
function drawFields(){
	//drawField(drawFieldCoord.x,drawFieldCoord.y, field, true, true);
	var xx = Math.floor(drawFieldCoord.x / drawFieldCoord.width) + 1,
		yy = Math.floor(drawFieldCoord.y / drawFieldCoord.height) + 1;
		for(var i = -xx; i <= xx; i++ )
			for(var j = -yy; j <= yy; j++ )
				drawField(drawFieldCoord.x + drawFieldCoord.width * i,drawFieldCoord.y + drawFieldCoord.height * j, field, Math.abs(i) % 2 == 1, Math.abs(j) % 2 == 1);
				
}
function drawField( x, y, field, xFlip, yFlip){
	imgData = ctx.getImageData(x, y, field.width, field.height);
	for(var i = 0; i < field.width; i++){
		for(var j = 0; j < field.height; j++){
			c = colors[field.data[xFlip ? field.width - i - 1: i][yFlip ? field.height - j - 1: j]];
			if(c[3]){
				for(var k = 0; k < 3; k++){
					imgData.data[(i + j * field.width) * 4 + k] = c[k];
				}
			}
		}
	}
	ctx.putImageData(imgData, x, y);
}

/*function hexToRGB(hex) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16),
		a = hex.length == 9 ? parseInt(hex.slice(7, 9), 16) : 0;
	return [r,g,b,a];
}*/

function fieldDrawPixel(field, x, y, colorIndex){
	if(x >= 0 && x < field.width && y >=0 && y < field.height && colorIndex >= 0 && colorIndex < colors.length){
		field.data[Math.floor(x)][Math.floor(y)] = colorIndex;
	}
}

function fieldDrawCircle(field, x, y, r, colorIndex){
	for(var i = -r; i <= r; i++){
		for(var j = -r; j <= r; j++){
			if(Math.hypot(i, j) <= r){
				fieldDrawPixel(field, x + i, y + j, colorIndex);
			}
		}
	}
}

function fieldFill(field, colorIndex){
	for(var i = 0; i < field.width; i++){
		for(var j = 0; j < field.height; j++){
			field.data[i][j] = colorIndex;
		}
	}
}

function fieldDrawLine(field, x, y, x1, y1,  r, colorIndex){
	
	var dx = x1 - x;
	var dy = y1 - y;
	var m = Math.max(Math.abs(dx), Math.abs(dy)) / r * 2;
	if(m != 0){
		
	for(var i = 0; i <= m; i++){
		//fieldDrawPixel(field, i, y + dy * (i - x) / dx + j, colorIndex);
		fieldDrawCircle(field, x + dx * (i/m), y + dy * (i/m), r, colorIndex)
	}}
	else{
		fieldDrawCircle(field,x,y,r,colorIndex);
		fieldDrawCircle(field,x1,y1,r,colorIndex);
	}
}
