function setupEnemy(entity){
	entity.update = function(){
	/*var onBigSquare = this.x + this.width > camera.x - camera.width / 5 
			&& this.x < camera.x + camera.width + camera.width / 5 
			&& this.y - this.height > camera.y - camera.height / 5 
			&& this.y < camera.y + camera.height + camera.height / 5;
	*/
	
	//entity.cantDead - взаимодействие со снарядами игрока
	//entity.canLeaveScreen - может покинуть экран
	//entity.cantKill - взаимодействие с игроком
	//entity.notNeedPhisic - падение, скорость и т.п.
		var onCameraSquare = this.x + this.width > camera.x - camera.width / 3 
			&& this.x < camera.x + camera.width + camera.width / 3 
			&& this.y + this.height > camera.y - camera.height / 3 
			&& this.y < camera.y + camera.height + camera.height / 3;
		if(onCameraSquare){
			this.onScreen = this.x + this.width > camera.x 
			  && this.x < camera.x + camera.width 
			  && this.y + this.height  > camera.y
			  && this.y < camera.y + camera.height;
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
					if(!player.dead && !this.dead && intersect(this.x, this.y, this.width, this.height, player.x, player.y, player.width, player.height)){
						player.dead = true;
					}
				}
				if(!this.dead 
				&& !this.canLeaveScreen 
				&& !(this.x + this.width > camera.x - camera.width / 3
				  && this.x < camera.x + camera.width + camera.width / 3
				  && this.y + this.height > camera.y - camera.height / 3
				  && this.y < camera.y + camera.height + camera.height / 3)){
					this.dead = true;
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
					if(this.onEndDead){
						this.onEndDead();
					}
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
		gSoldier.runAnim = {spd: 0.3, pic: images["enemy1"], frames: [[0,0],[1,0],[2,0],[3,0]]};
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
	entity.onEndDead = function(){
		createDecorExplosion(this.x, this.y, 8, 8, 3);
	}
}
function createDecorExplosion(x,y,w,h,delay){
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
function createDirectedShot(x,y){
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
		bullet.angle =Math.atan2(y2 - y1, x2 - x1);
		bullet.speed = 2;
		bullet.ai = function(){
			if(pcell(this.x + this.width / 2,this.y + this.height / 2)!=0){
					this.isDead = true;
				}
			this.x += Math.cos(this.angle) * this.speed;
			this.y += Math.sin(this.angle) * this.speed;
		}
		bullet.render = function(){
			drawImg(images["enemy1"].img, 42, 2, 4, 4, this.x - camera.x, this.y - camera.y, this.width, this.height)
		}
		enemies.push(bullet);
}
function setupSpawner(entity, obj){
	entity.template = obj;
	entity.spawnCounter = 0;
	entity.update = function(){
		var onBigSquare = this.x + this.width > camera.x - camera.width / 3 
			&& this.x < camera.x + camera.width + camera.width / 3 
			&& this.y + this.height > camera.y - camera.height / 3 
			&& this.y < camera.y + camera.height + camera.height / 3;
		if(onBigSquare){
			var onScreen = this.x + this.width > camera.x 
			  && this.x < camera.x + camera.width 
			  && this.y + this.height  > camera.y
			  && this.y < camera.y + camera.height;
			  if(!onScreen){
			  this.spawnCounter ++;
				if(this.spawnCounter > 100){
					var children = setupEntity(this.template,this.template.properties.spawn);
					children.lookLeft = player.x < this.x;
					enemies.push(children);
					this.spawnCounter = 0;
				}
			  }
		}
	}
}