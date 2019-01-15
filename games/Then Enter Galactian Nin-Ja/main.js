function keyPress(evt){
	switch(evt.keyCode) {
        case 37 : player.dx = Math.min(-player.moveForce, player.dx * 1.5); break; //left
		case 39 : player.dx = Math.max(player.moveForce, player.dx * 1.5); break; //right
	}
}

function update(){
	ctx.fillStyle="#eeeeee";
    ctx.fillRect(0,0,cnv.width,cnv.height);
	
	//draw wall
	ctx.fillStyle="#aa8";
	ctx.fillRect(0, 0, tower.left, cnv.height);
	ctx.fillRect(tower.right , 0, tower.left, cnv.height);
	//draw lamp
	ctx.fillStyle="#eeeeee";
	for(var i = 0; i < 10; i++){
		ctx.fillRect(tower.left - 20 , tower.lampDist * i + tower.currentHeight % tower.lampDist, 10, 10);
		ctx.fillRect(tower.right + 10 , tower.lampDist * i + tower.currentHeight % tower.lampDist, 10, 10);
	}
	//draw player
	ctx.fillStyle="#224";
	ctx.fillRect(player.x, player.y + tower.currentHeight, player.size, player.size);
	player.step();
	
	tower.currentHeight = Math.max(0, - player.y + cnv.height * 0.3);

	
	if(counter.count++ > counter.maxCount){
		counter.count = 0;
		counter.speed = (tower.currentHeight - counter.lastHeight) / counter.maxCount;
		counter.maxSpeed = Math.max(counter.maxSpeed, counter.speed);
		counter.lastHeight = tower.currentHeight;
	}
	ctx.fillStyle="#eeeeee";
	ctx.font="20px Georgia";
	ctx.fillText("Height: " + tower.currentHeight,10,25);
	ctx.fillText("Speed: " + counter.speed,10,50);
	ctx.fillText("Max speed: " + counter.maxSpeed,10,75);
	
	
    /*ctx.fillRect(-3 + mouse.x,-3 + mouse.y,6,6);
	
	ctx.fillStyle="red";
	
	ctx.drawImage(img,0,0,8,8,40,60,80,80);*/
}
function start(){
	tower = {width: 400, gravity: 1, friction: 0.2, currentHeight: 0, speedTimer: 0, lastHeight: 0};
	counter = {lastHeight: 0, maxCount: 10, count: 0, speed: 0, maxSpeed: 0}
	tower.left = (cnv.width - tower.width) / 2 + 20;
	tower.right = tower.left + tower.width;
	tower.lampDist = cnv.height / 10;
	
	player = {size: 40, jumpForce: 10, moveForce: 15, x: 0, y: 0, dx: 0, dy: 0}
	player.x = (cnv.width - player.size) / 2;
	player.y = cnv.height - player.size;
	player.isDash = false;
	player.maxDashTimer = 30;
	player.dashTimer = player.maxDashTimer;
	player.step = function(){
		this.y += this.dy;
		this.x += this.dx;
		if(this.dx > 0){
			this.dx = Math.max(0, this.dx - tower.friction);
		}
		if(this.dx < 0){
			this.dx = Math.min(0, this.dx + tower.friction);
		}
		
		if(this.maxDashTimer > this.dashTimer){
			this.dashTimer++;
		}
		if(this.y < cnv.height - this.size){
			this.dy += tower.gravity;
		}else{
			this.y = cnv.height - this.size;
			this.dy = 0;
		}
		if(this.x < tower.left){
			this.x = tower.left;
			if(this.dx < -this.moveForce * 0.9){
				this.dy = this.jumpForce * this.dx / this.moveForce;
			}
			this.dx *= -1;
			
		}
		if(this.x > tower.right - this.size){
			this.x = tower.right - this.size;
			if(this.dx > this.moveForce * 0.9){
				this.dy = -this.jumpForce * this.dx / this.moveForce;
			}
			this.dx *= -1;
		}
	}
}