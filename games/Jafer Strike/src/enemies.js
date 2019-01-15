function setupEnemy(entity){
	entity.update = function(){
	//entity.cantDead - не умирает от снарядов игрока(по умолчанию - умирает)
	//entity.canLeaveScreen - может покинуть экран и выжить(по умолчанию погибает покинув экран)
	//entity.cantKill - не способен убить игрока(по умолчанию способен)
	//entity.notNeedPhisic - падение, скорость и т.п.
	
		/*var onCameraSquare = this.x + this.width > camera.x - camera.width / 3 
			&& this.x < camera.x + camera.width + camera.width / 3 
			&& this.y + this.height > camera.y - camera.height / 3 
			&& this.y < camera.y + camera.height + camera.height / 3;*/
		if(onBigScreen(this)){
			this.onScreen = onScreen(this);
			if(!this.notNeedPhisic)updateEntity(this);
			if(!this.dead){
				if(this.ai){
					this.ai();
				}
				if(!this.cantDead){
					for(var i = 0; i < player.bullets.length; i++){
						var bullet = player.bullets[i];
						if(!bullet.isDead && intersect(this.x, this.y, this.width, this.height, bullet.x, bullet.y, bullet.oh, bullet.ov)){
							if(!bullet.notOneOff){
								bullet.isDead = true;
							}
							if(this.live){
								this.live -= bullet.dmg || 1;
							}
							if(!this.live || this.live <= 0){
								this.dead = true;
							}
						}
					}
				}
				if(!this.cantKill){
					if(!this.dead && intersect(this.x, this.y, this.width, this.height, player.x, player.y, player.width, player.height)){
						player.kill();
					}
				}
				if(!this.dead 
				&& !this.canLeaveScreen 
				&& !onBigScreen(this)){
					this.dead = true;
					if(!debug.deadOutScreen){
						debug.deadOutScreen = 1;
					}else{
						debug.deadOutScreen += 1;
					}
				}
			}else{
				if(!this.deathCounter){
					this.deathCounter = 0;
					if(this.onStartDead){
						this.onStartDead();
					}
				}
				this.deathCounter ++;
				if(this.deathCounter >= (this.maxDeathCounter ? this.maxDeathCounter : 10)){
					this.isDead = true;
				}
			}
		}
	};
}
function setupSoldier(entity, obj){
	setupEnemy(entity);
	if(typeof gSoldier === 'undefined'){
		gSoldier = {};
		gSoldier.standAnim = {spd: 0, pic: images["enemy1"], frames: [[0,0]]};
		gSoldier.runAnim = {spd: 0.3, pic: images["enemy1"], frames: [[0,0],[1,0],[2,0],[1,0]]};
		gSoldier.jumpAnim = {spd: 0, pic: images["enemy1"], frames: [[1,0]]};
		
		gSoldier.ai = {};
		gSoldier.ai.run = function(){
			if(this.lookLeft){
				this.left = true;
				this.right = false;
			}else{
				this.left = false;
				this.right = true;
			}
			if(!this.falling && this.jump == true){
				this.jump = false;
				if(this.x == this.onJumpX){
					this.lookLeft = !this.lookLeft
				}
			}
			if(pcell(this.x + this.dx + (this.lookLeft ? 0 : this.width), this.y + this.height / 2) != 0 || Math.random() < 0.03){
				this.jump = true;
				this.onJumpX = this.x
			}
		};
		gSoldier.ai.runAndShot = function(){
			if(!this.AICounter){
				this.AICounter = 0;
			}
			this.AICounter++;
			if(this.AICounter > 0 && this.AICounter < 100){
				if(this.lookLeft){
					this.left = true;
					this.right = false;
				}else{
					this.left = false;
					this.right = true;
				}
				if(pcell(this.x + this.dx + (this.lookLeft ? 0 : this.width), this.y + this.height / 2) != 0){
				this.lookLeft = !this.lookLeft
				}
			} else if(this.AICounter == 100){
				this.left = false;
				this.right = false;
			} else if(this.AICounter == 115){
				if(this.onScreen)createDirectedShot(this.x + 2, this.y + 2);
			} else if(this.AICounter == 130){
				this.AICounter = 0;
			}
		};
		gSoldier.ai.stand = function(){
			if(!this.AICounter){
				this.AICounter = 0;
			}
			this.AICounter++;
			if(this.AICounter > 0 && this.AICounter < 100){
				this.jump = false;
			} else if(this.AICounter == 100){
				this.jump = true;
			} else if(this.AICounter >= 105){
				this.AICounter = 0;
				if(this.onScreen)createDirectedShot(this.x + 2, this.y + 2);
			}
		};
	}
	entity.currentAnimation = {anim: gSoldier.standAnim, counter: 0};
	entity.setAnim = function(newAnim){
		if(gSoldier[newAnim] && gSoldier[newAnim] != this.currentAnimation.anim){
			this.currentAnimation.anim = gSoldier[newAnim];
			this.currentAnimation.counter = 0;
		}
	};
	if(obj.properties.ai != null && gSoldier.ai[obj.properties.ai] != null){
		entity.ai = gSoldier.ai[obj.properties.ai];
	}
	if(entity.ai == gSoldier.ai.run){
		entity.accel = ACCEL * 0.5;
	}else if(entity.ai == gSoldier.ai.runAndShot){
		entity.accel = ACCEL * 0.3;
	}
	entity.render = function(){
		drawAnim(this.currentAnimation, this.x - camera.x, this.y - camera.y, this.width, this.height, this.lookLeft);
		if(this.dx < 0) {
			this.lookleft = true;
			this.setAnim("runAnim");
		} else if(this.dx > 0){
			this.lookleft = false;
		} else {
			this.setAnim("standAnim");
		}
		if(this.dead){
			this.setAnim("deadAnim");
		} else if(this.falling){
			this.setAnim("jumpAnim");
		} else if(this.dx != 0){
			this.setAnim("runAnim");
		} else {
			this.setAnim("standAnim");
		}
	};
	entity.onStartDead = function(){
		this.jump = true;
		this.dy = -2;
		this.left = false;
		this.right = false;
	}
	entity.onDead = function(){
		createDecorExplosion(this.x, this.y, 8, 8, 3);
	}
}
function setupSpawner(entity, obj){
	entity.template = obj;
	entity.spawnCounter = 0;
	entity.update = function(){
		var onBigSquare = onBigScreen(this);
		if(onBigSquare){
			  if(!onScreen(this)){
			  this.spawnCounter ++;
				if(this.spawnCounter > 100){
					var children = setupEntity(this.template,this.template.properties.spawn);//если не передать имя спаунер будет создавать спаунеры
					children.lookLeft = player.x < this.x;
					enemies.push(children);
					this.spawnCounter = 0;
				}
			  }
		}
	}
}

function createDecorExplosion(x,y,w,h,delay){//взрыв при смерти вражеского солдата. Не убивает игрока.
	var explosion = {};
	explosion.x = x;
	explosion.y = y;
	explosion.width = w;
	explosion.height = h;
	explosion.counter = 0;
	explosion.delay = delay;
	explosion.update = function(){
		this.counter++;
		if(this.counter >= this.delay * 4){
			this.isDead = true;
		}
	}
	explosion.render = function(){
		drawImg(images["bullet"].img, Math.floor(explosion.counter / this.delay)*8, 16, 8, 8, this.x - camera.x, this.y - camera.y, this.width, this.height)
	}
	enemies.push(explosion);
}
function createDirectedShot(x,y){//выстрел бегающе-стреляющего и стоящего солдата
		bullet = {};
		bullet.x = x;
		bullet.y = y;
		bullet.width = 4;
		bullet.height = 4;
		setupEnemy(bullet);
		bullet.notNeedPhisic = true;
		bullet.cantDead = true;
		
		var x1 = bullet.x + 2,
			y1 = bullet.y + 2,
			x2 = player.x + player.width / 2,
			y2 = player.y + player.height / 2;
		bullet.angle = Math.atan2(y2 - y1, x2 - x1);
		bullet.speed = 2;
		bullet.ai = function(){
			if(pcell(this.x + this.width / 2,this.y + this.height / 2)!=0){
					this.isDead = true;
				}
			this.x += Math.cos(this.angle) * this.speed;
			this.y += Math.sin(this.angle) * this.speed;
		}
		bullet.render = function(){
			drawImg(images["enemy1"].img, 34, 2, 4, 4, this.x - camera.x, this.y - camera.y, this.width, this.height)
		}
		enemies.push(bullet);
		return bullet;
}
function createFireExplode(x,y,delay){//x и y-центр взрыва, просто взрыв с возможностью дополнительного действия
	explode = {};
	explode.x = x - 4;
	explode.y = y - 4;
	explode.width = 8;
	explode.height = 8;
	setupEnemy(explode);
	explode.notNeedPhisic = true;
	explode.cantDead = true;
	explode.explTimer = 0;
	explode.explDelay = delay;
	explode.explPhase = 0;
	explode.notOneOff = true;
	explode.dmg = 0.07;
	explode.ai = function(){
		if(this.explTimer == this.explDelay){
			this.explTimer = 0;
			this.explPhase++;
			if(this.explPhase == 4){
				this.isDead = true;
				return;
			}
			if(this.additionalEvent){
				this.additionalEvent();
			}
		}
		this.explTimer++;
	}
	explode.render = function(){
		drawImg(images["enemy1"].img, 32 + 8 * this.explPhase, 16, 8, 8, this.x - camera.x, this.y - camera.y, this.width, this.height)
	}
	enemies.push(explode);
	return explode;
}
function createFallingShot(x,y,dx,dy){//снаряд, летящий по параболической траектории
		bullet = {};
		bullet.x = x;
		bullet.y = y;
		bullet.width = 4;
		bullet.height = 4;
		bullet.dx = dx;
		bullet.dy = dy;
		setupEnemy(bullet);
		bullet.notNeedPhisic = true;
		bullet.cantDead = true;
		bullet.ai = function(){
			if(pcell(this.x + this.width / 2,this.y + this.height / 2)!=0){
					this.isDead = true;
				}
			this.x += dx;
			this.y += dy;
			dy += GRAVITY;
		}
		bullet.render = function(){
			drawImg(images["enemy1"].img, 42, 2, 4, 4, this.x - camera.x, this.y - camera.y, this.width, this.height)
		}
		enemies.push(bullet);
		return bullet;
}
function createMovingFire(x,y,delay, maxPhase, left, createPhase){//maxPhase - на которой огонь тухнет, createPhase - на которой создаёт новый огонь,delay - время одной фазы
	explode = {};
	explode.x = x;
	explode.y = y;
	explode.width = 8;
	explode.height = 8;
	setupEnemy(explode);
	explode.notNeedPhisic = true;
	explode.cantDead = true;
	explode.delay = delay;
	explode.explTimer = 0;
	explode.explPhase = 0;
	explode.maxPhase = maxPhase;
	explode.isLeft = left;
	explode.createPhase = createPhase;
	explode.ai = function(){
		if(this.explTimer == this.delay){
			this.explTimer = 0;
			this.explPhase++;
			if(this.explPhase == this.maxPhase){
				this.isDead = true;
				return;
			}
			if(this.explPhase == this.createPhase){
				var nx = this.x + (this.isLeft ? -8 : 8);
				if(nx > camera.x - this.width && nx < camera.x + camera.width && pcell(nx + (!this.isLeft ? this.width : 0),this.y) == 0 && pcell(nx + (!this.isLeft ? this.width : 0),this.y + 8) != 0){
					var f = createMovingFire(nx,this.y,this.delay, this.maxPhase, this.isLeft, this.createPhase);
					f.render = this.render;
					f.additionalEvent = this.additionalEvent;
				}
			}
			if(this.additionalEvent){
				this.additionalEvent();
			}
		}
		this.explTimer++;
	}
	explode.render = function(){
		drawImg(images["enemy1"].img, 8 * (this.explPhase ? (this.explPhase - 1) % 3 + 1 : 0), 8, 8, 8, this.x - camera.x, this.y - camera.y, this.width, this.height, this.isLeft)
	}
	enemies.push(explode);
	return explode;
}