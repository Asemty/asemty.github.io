d90 = Math.PI / 2;
d45 = d90 / 2;

function getPlayer(x,y){
	res = getObj(x,y);
	res.angle = 0;
	res.moveSpeed = 5;
	res.rotateSpeed = 0.1;
	res.shotTime = 0;
	res.reloadTime = 10;
	res.timeStep = function() {
		if(isKey("a")){
			this.angle -= this.rotateSpeed;
		}
		if(isKey("d")){
			this.angle += this.rotateSpeed;
		}
		if(isKey("w")){
			this.y += Math.sin(this.angle) * this.moveSpeed;
			this.x += Math.cos(this.angle) * this.moveSpeed;
		}
		if(isKey("q")){
			this.y += Math.sin(this.angle - d90) * this.moveSpeed * 0.7;
			this.x += Math.cos(this.angle - d90) * this.moveSpeed * 0.7;
		}
		if(isKey("e")){
			this.y += Math.sin(this.angle + d90) * this.moveSpeed * 0.7;
			this.x += Math.cos(this.angle + d90) * this.moveSpeed * 0.7;
		}
		if(isKey("s")){
			this.y += Math.sin(this.angle + Math.PI) * this.moveSpeed * 0.35;
			this.x += Math.cos(this.angle + Math.PI) * this.moveSpeed * 0.35;
		}
		if(isKeyPressed("space")){
			this.shoot();
		}
		if(this.shotTime > 0){
			this.shotTime--;
		}
	};
	res.draw = function() {
		drawRotatedImage(circle,0,0,40,40,this.x,this.y,40,40,this.angle + d90,20,20);
		/*for(var i = -1; i <= 1; i++){
			drawRotatedImage(arrow,0,0,40,51,this.x,this.y,40,51,this.angle + d90 + d45/2 * i,20,31);
		}*/
		drawRotatedImage(arrow,0,0,40,51,this.x,this.y,40,51,this.angle + d90,20,31);
	};
	res.shoot = function() {
		//if(this.shotTime <= 0){
			gameObjects.push(getBullet(this.x,this.y, this.angle));
			//this.shotTime = this.reloadTime;
		//}
		
	}
	return res;
}

function getBullet(x,y, angle){
	res = getObj(x,y);		
	res.angle = angle;
	res.moveSpeed = 8;
	res.draw = function() {drawRotatedImage(bullet,0,0,40,51,this.x,this.y,40,51,this.angle + d90,20,31);};
	res.timeStep = function() {
			this.y += Math.sin(this.angle) * this.moveSpeed;
			this.x += Math.cos(this.angle) * this.moveSpeed;
			};
	return res;
}

function getAim(x,y){
	res = getObj(x,y);		
	res.enable = true;
	res.draw = function() {if(this.enable)drawRotatedImage(aim,0,0,40,40,this.x,this.y,40,40,0,20,20);};
	res.timeStep = function() {
			for(var i = 0; i < gameObjects.length; i++){
				if(gameObjects[i].angle && ((this.x - gameObjects[i].x) * (this.x - gameObjects[i].x) + (this.y - gameObjects[i].y) * (this.y - gameObjects[i].y)) < 1600){
					this.enable = false;
				}
			}
			};
	return res;
}

function getObj(x,y){
	res = {};
	res.x = x;
	res.y = y;
	res.step = function() {};
	res.draw = function() {};
	res.timeStep = function() {};
	return res;
}