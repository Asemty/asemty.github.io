function keyPress(evt){
	switch(evt.keyCode) {
        case 27:
			pause=!pause;
            break;
		case 38:
			if(body.length==0 || y-1!=body[0].y){
				sy=-1;
				sx=0;
			}
			move(0,-1);
			pause=false;
            break;
		case 40:
			if(body.length==0 || y+1!=body[0].y){
				sy=1;
				sx=0;
			}
			move(0,1);
			pause=false;
            break;
		case 37:
			if(body.length==0 || x-1!=body[0].x){
				sy=0;
				sx=-1;
			}
			move(-1,0);
			pause=false;
            break;
		case 39:
			if(body.length==0 || x+1!=body[0].x){
				sy=0;
				sx=1;
			}
			move(1,0);
			pause=false;
            break;
	}
}
function update(){
	contex.fillStyle="#111111";
    contex.fillRect(0,0,canvas.width,canvas.height);
	for(var i=0;i<width;i++){
		for(var j=0;j<height;j++){
			contex.fillStyle="#223322";
			drawCell(i,j);
		}
	}
	contex.fillStyle="#44ff44";
    drawCell(x,y);
	for(var i=0;i<body.length;i++){
		contex.fillStyle="#225522";
		drawCell(body[i].x,body[i].y)
	}
	contex.fillStyle="#ff4444";
    drawCell(food.x,food.y);
	if(!pause){
		counter++;
		if(counter>=maxCounter){
			move(sx,sy);
		}
	}
}
function drawCell(xx,yy){
	contex.fillRect(cellSize*xx+offset,cellSize*yy+offset,cellSize-offset/2,cellSize-offset/2);
}
function move(xx,yy){
	counter=0;
	body.unshift({x: x,y: y});
	if(food.x!=x+xx || food.y!=y+yy){
		body.pop();
	}else{
		refreshFood();
	}
	x+=xx;
	y+=yy;
	if(x>=width) x = 0;
	if(y>=height) y = 0;
	if(x<0) x = width-1;
	if(y<0) y = height-1;
	for(var i=0;i<body.length;i++){
		if(x==body[i].x && y==body[i].y){
			tmp=body.length-i;
			for(var j=0;j<tmp;j++){
				body.pop();
			}
		}
	}
}
function refreshFood(){
	c=width*height-body.length-1;
	if(c==0){
		alert("Поздравляю, вы победили!");
		start();
	}else{
		while(true){
			food={x: Math.floor(Math.random()*width), y: Math.floor(Math.random()*height)};
			for(var i=0;i<body.length;i++){
				if(body[i].x==food.x && body[i].y==food.y){
					break;
				}
			}
			if(i==body.length){
				if(food.x!=x || food.y!=y)return;
			}
		}
	}
}
function start(){
	pause=true;
	body=[];
	width=15;
	height=20;
	offset=4;
	cellSize=(canvas.width-offset)/width;
	x=Math.floor(Math.random()*width);
	y=Math.floor(Math.random()*height);
	sx=1;
	sy=0;
	counter=0;
	maxCounter=10;
	spd=prompt("Скорость игры (1-10)");
	
	food={x: Math.floor(Math.random()*width), y: Math.floor(Math.random()*height)};
	while(true){
		if(+spd>=1 && +spd<=10){
			maxCounter=23-spd*2;
			break;
		}else{
			spd=prompt("Неверный ввод! Попробуйте ещё раз.\nСкорость игры (1-10)");
		}
	}
}