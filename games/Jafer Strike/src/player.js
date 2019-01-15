function keyPress(evt, isPress){
	if(evt.keyCode==38 || evt.keyCode==87){//up & W
		up(isPress);
	}else if(evt.keyCode==40 || evt.keyCode==83){//down & S
		down(isPress);
	}else if(evt.keyCode==37 || evt.keyCode==65){//left & A
		left(isPress);
	}else if(evt.keyCode==39 || evt.keyCode==68){//right & D
		right(isPress);
	}else if(evt.keyCode==74 || evt.keyCode==90){//J & Z
		aButton(isPress);
	}else if(evt.keyCode==72 || evt.keyCode==88){//H & X
		bButton(isPress);
	}else if(evt.keyCode==13 || evt.keyCode==70){//enter & F
		startButton(isPress);
	}
}
function up(p){
	player.lookup = p
}
function down(p){
		player.lookdown = p
}
function left(p){
		player.left = p;
}
function right(p){
		player.right = p;
}
function aButton(p){
		player.jump = p;
}
function bButton(p){
		if(p && !player.gun().auto){
			player.shot();
		}
		player.bPressed = p;
}
function startButton(p){
	if(p){
		player.currentGun++;
		if(player.currentGun == weapons.length){
			player.currentGun = 0;
		}
	}
}

function setupPlayer(entity, obj){
	entity.standAnim = {spd: 0, pic: images["player"], frames: [[0,0]]};
	entity.runAnim = {spd: 0.3, pic: images["player"], frames: [[0,0],[1,0],[2,0],[3,0]]};
	entity.jumpAnim = {spd: 0, pic: images["player"], frames: [[1,0]]};
	entity.deadAnim = {spd: 0, pic: images["player"], frames: [[4,0]]};
	entity.currentAnimation = {anim: entity.standAnim, counter: 0};
	entity.setAnim = function(newAnim){
		if(this[newAnim] && this[newAnim] != this.currentAnimation.anim){
			this.currentAnimation.anim = this[newAnim];
			this.currentAnimation.counter = 0;
		}
	};
	entity.bullets=[];
	entity.gunCounter = 0;
	entity.currentGun = 0;
	entity.immune = 0;
	entity.shot = function(){
		if(!player.dead){
			var h = 0, v = 0;
			if(!player.lookup && !player.lookdown){
				h = player.lookleft?-1:1;
			}else{
				if(player.lookup){
					v = -1;
				}else if(player.lookdown){
					v = 1;
				}
				if(player.left){
					h = -1;
				}else if(player.right){
					h = 1;
				}
			}
			weapons[this.currentGun].shot(player,h,v);
			this.gunCounter = 0;
		}
	}
	entity.kill = function(){
		if(!this.dead && this.immune <= 0 && !debug.immortal){
				this.dead = true;
		}
	}
	entity.gun = function(){
		return weapons[this.currentGun];
	}
	entity.spawn = function(){
		this.y = -this.height;
		this.x = camera.x + TILE * 3;
		this.immune = FRAMERATE * 2;
	}
	entity.deadTimer = 0;
	entity.live = 200;
}
function renderPlayer(){
	if(player){
		if(player.dx < 0) {
			player.lookleft = true;
			player.setAnim("runAnim");
		} else if(player.dx > 0){
			player.lookleft = false;
		} else {
			player.setAnim("standAnim");
		}
		if(player.dead){
			player.setAnim("deadAnim");
		} else if(player.falling){
			player.setAnim("jumpAnim");
		} else if(player.dx != 0){
			player.setAnim("runAnim");
		} else {
			player.setAnim("standAnim");
		}
		if(player.immune < 0 || Math.floor(player.immune / 3) % 2 == 0)drawAnim(player.currentAnimation, player.x - camera.x, player.y - camera.y, player.width, player.height, player.lookleft);
		if(player.bullets){
			for(var i=0;i < player.bullets.length; i++){
				var b = player.bullets[i];
				drawImg(images["bullet"].img, b.ox, b.oy, b.ov, b.oh, player.bullets[i].x - camera.x, player.bullets[i].y - camera.y, b.ov, b.oh, b.h < 0, b.v < 0);
			}
		}
	}
}
function updatePlayer(){
	updateEntity(player);
	if(player.x <= camera.x){
		player.left = false;
		player.dx = MAXDX
	}
	if(player.x + player.width >= camera.x + camera.width){
		player.right = false;
		player.dx = -MAXDX
	}
	if(player.x + player.width <= camera.x){
		player.dead = true;
	}
	if(player.x - player.width >= camera.x + camera.width){
		player.dead = true;
	}
	if(player.y - camera.y >= camera.height){
		player.dead = true;
	}
	if(player.bullets){
		var newBullets = [];
		for(var i=0;i < player.bullets.length; i++){
			player.bullets[i].upd();
			if(!player.bullets[i].isDead){
				newBullets.push(player.bullets[i]);
			}
		}
		player.bullets = newBullets;
	}
	player.gunCounter++;
	if(player.immune > 0) player.immune --;
	if(player.bPressed && player.gun().auto && (!player.gun().delay || player.gun().delay < player.gunCounter)){
			player.shot();
			player.gunCounter = 0;
	}
	if(player.dead){
		player.deadTimer++;
		if(player.deadTimer > 30){
			player.deadTimer = 0;
			if(player.live>0){
				player.live--;
				player.dead = false;
				player.dx = 0;
				player.dy = 0;
				player.spawn()
			}else{
				gameover();
			}
		}
	}
}
