function setupWalkerTank(x, y){
	var obj = {};
	obj.x = x;
    obj.y = y;
	obj.width = 20;
    obj.height = 7;
	var entity = setupEntity(obj)
	//setupEnemy(entity);
	
	entity.live = 45;
	entity.notNeedPhisic = true;
	entity.animCounter = 0;
	entity.maxGunCharge = FRAMERATE * 1.5;
	entity.jumpCounter = 0;
	entity.ox = 0;
	entity.oy = 0;
	entity.stateTimer = 0;
	entity.isLeft = false;
	entity.damageDelay = 0;
	entity.sprite = {img: images["bosses"].img, ox: 16, oy: 0, ow: 20, oh: 8, width: 20, height: 8};
	
	entity.parts = [];
	var ldl = {};
		ldl.sprite = {img: images["bosses"].img, ox: 0, oy: 0, ow: 8, oh: 16, width: 8, height: 16};
		ldl.sx = -4;
		ldl.sy = 5;
		ldl.ox = 0;
		ldl.oy = 0;
		ldl.fh = false;
		ldl.fv = false;
		ldl.fixed = false;
	entity.parts["leftDownLeg"] = ldl;
		
	var rdl = {};
		rdl.sprite = ldl.sprite;
		rdl.sx = 15;
		rdl.sy = 5;
		rdl.ox = 0;
		rdl.oy = 0;
		rdl.fh = true;
		rdl.fv = false;
		rdl.fixed = false;
	entity.parts["rightDownLeg"] = rdl;
	
	var lul = {};
		lul.sprite = {img: images["bosses"].img, ox: 8, oy: 0, ow: 8, oh: 8, width: 8, height: 8};
		lul.sx = 3;
		lul.sy = 7;
		lul.ox = 0;
		lul.oy = 0;
		lul.fh = false;
		lul.fv = false;
		lul.fixed = false;
	entity.parts["leftUpLeg"] = lul;
	
	var rul = {};
		rul.sprite = lul.sprite;
		rul.sx = 8;
		rul.sy = 7;
		rul.ox = 0;
		rul.oy = 0;
		rul.fh = true;
		rul.fv = false;
		rul.fixed = false;
	entity.parts["rightUpLeg"] = rul;
	
	var mg = {};
		mg.sprite = {img: images["bosses"].img, ox: 16, oy: 8, ow: 24, oh: 8, width: 24, height: 8};
		mg.sx = 3;
		mg.sy = -1;
		mg.ox = 0;
		mg.oy = 0;
		mg.fh = false;
		mg.fv = false;
		mg.fixed = true;
	entity.parts["mainGun"] = mg;
	
	var eg = {};
		eg.sprite = {img: images["bosses"].img, ox: 8, oy: 8, ow: 8, oh: 8, width: 8, height: 8};
		eg.sx = 0;
		eg.sy = -6;
		eg.ox = 0;
		eg.oy = 0;
		eg.fh = false;
		eg.fv = false;
		eg.fixed = true;
	entity.parts["extraGun"] = eg;
	
	entity.render = function(){
		if(this.state == this.states.gunCharge && !!this.gunAimPointDown){
			if(this.maxGunCharge - this.gunCharge > 3){
				ctx.strokeStyle = "white";
			}else{
				ctx.strokeStyle = "red";
			}
			var xx = this.x + this.ox + this.width / 2, yy = this.y + this.oy + 3;
			drawLine(xx, yy, this.gunAimPointDown.x, this.gunAimPointDown.y);
			drawLine(xx, yy, this.gunAimPointUp.x, this.gunAimPointUp.y);
		}
		if(this.damageDelay == 0){
			for(var prtNm in this.parts){
				var prt = this.parts[prtNm];
				var ax = 0,ay = 0;
				if(prt.fixed){
					ax = this.ox;
					ay = this.oy;
					if(this.isLeft){
						ax += - (prt.sprite.width - this.width) - prt.sx * 2;
						ay += 0;
					}
				}
				drawSprite(prt.sprite,
				this.x + prt.sx + prt.ox + ax - camera.x,
				this.y + prt.sy + prt.oy + ay - camera.y,
				prt.fixed && this.isLeft ? !prt.fh : prt.fh, prt.fv);
			}
			drawSprite(this.sprite, this.x + this.ox - camera.x, this.y + this.oy - camera.y, this.isLeft);
		}
		ctx.fillStyle = "#fff";
		ctx.font="bold 3px arial";
		ctx.fillText("Boss: " + this.live,camera.width - 15,3);
	}
	entity.update = function(){
		if(!this.dead){
			if(this.damageDelay == 0){
				for(var i = 0; i < player.bullets.length; i++){
					var bullet = player.bullets[i];
					if(!bullet.isDead && intersect(this.x + this.ox, this.y + this.oy, this.width, this.height, bullet.x, bullet.y, bullet.oh, bullet.ov)){
						if(!bullet.notOneOff) bullet.isDead = true;
						this.live -= bullet.dmg || 1;
						this.damageDelay = 2;
						if(this.live <= 0){
							this.dead = true;
						}
					}
				}
			}else{
				this.damageDelay--;
			}
			if(!this.dead && intersect(this.x + this.ox, this.y + this.oy, this.width, this.height, player.x, player.y, player.width, player.height)){
				player.kill();
			}
			this.animCounter ++;
			this.ai();
		}else{
			this.damageDelay = 0;
			if(!this.deadCounter){
				this.deadCounter = 0;
			}
			if(this.deadCounter < 150){
				this.deadCounter ++;
				if(this.deadCounter % 5 == 0){
					for(var i = 0; i < 3; i++){
						createDecorExplosion(this.x - 5 + (this.width + 10) * Math.random() - 4, this.y - 5 + (this.height * 3) * Math.random() - 4, 8, 8, 4);
					}
				}
			}else{
				this.isDead = true;
				scenario.phase = 2;
			}
			
		}
		
		var lul = this.parts["leftUpLeg"],
			rul = this.parts["rightUpLeg"],
			ldl = this.parts["leftDownLeg"],
			rdl = this.parts["rightDownLeg"];
		
		/*if(player.lookup){
			this.state = this.states.jumpReady;
		}else{
			if(this.state == this.states.jumpReady){
				this.state = this.states.jump;
			}
		}*/
		/*if(player.lookdown){
			if(this.tmpData != this.isLeft){
				this.flip();
				this.tmpData = this.isLeft;
			}
			entity.granadeAttack();
		}else{
			//this.tmpData = !this.isLeft;
		}*/
		
		lul.ox = (ldl.ox + this.ox) / 2;
		rul.ox = (rdl.ox + this.ox) / 2;
		lul.oy = (ldl.oy + this.oy) / 2;
		rul.oy = (rdl.oy + this.oy) / 2;
		
		if(this.dy == 0){
			this.dx = 0;
		}
		var legLevel = this.y + 13 + Math.max(ldl.sy + ldl.oy, rdl.sy + rdl.oy);
		this.falling = pcell(this.x, legLevel) == 0;
		if(this.falling) {
			this.dy += GRAVITY;
			this.dy = bound(this.dy, -MAXDY, MAXDY)
		}else{
			this.dy = 0;
			this.y -= legLevel % TILE;
		}
		this.y += this.dy;
		this.x += this.dx;
		
	}
	entity.flip = function(side){
		if(!side || side != -1 && side != 1){
			this.isLeft = !this.isLeft;
		}else{
			this.isLeft = side == -1
		}
	}
	entity.granadeAttack = function(){//граната, создающая огненную волну
		var dx = (player.x + player.width / 2 - (this.x + this.width / 2)) / (- 3 / GRAVITY * 2);
		var bullet = createFallingShot(this.x, this.y, -dx, -3);
		bullet.onDead = function(){
			/*var exp = createFireExplode(this.x + 2, this.y + 2, 3);
			exp.additionalEvent = function(){
				createFireExplode(this.x + 4, this.y - this.explPhase * 12 + 4, this.explDelay);
			}*/
			createMovingFire(this.x - 4,(Math.floor(this.y / TILE)) * TILE - 8, 3, 6, true, 3);
			createMovingFire(this.x + 4,(Math.floor(this.y / TILE)) * TILE - 8, 3, 6, false, 3);
		}
		bullet.render = function(){
			if(typeof this.timer === 'undefined' || this.timer == 11){
				this.timer = -1;
			}
			this.timer++;
			drawImg(images["enemy1"].img, 8 * Math.floor((this.timer - 1) / 3), 16, 8, 8, this.x - camera.x, this.y - camera.y, this.width, this.height)
		}
	}
	entity.throwGranade = function(){//выстрел 5ю гранатами, с направленным вверх взрывом
				var maxNum = 5;
				for(var num = 0; num < maxNum; num++){
					var left = (this.x + this.width / 2) < (camera.x + camera.width / 2)
					var dx = (this.x - camera.x - camera.width / maxNum * num) / (- 5 / GRAVITY * 2);
					var bullet = createFallingShot(this.x, this.y, dx, -5);
					bullet.onDead = function(){
						var exp = createFireExplode(this.x + 2, this.y + 2, 3);
						exp.additionalEvent = function(){
							createFireExplode(this.x + 4, this.y - this.explPhase * 12 + 4, this.explDelay);
						}
					}
				}
			}
	entity.landing = function(){
		switch(this.landingPhase){
			case "start": 
				this.states.setDelay(this, FRAMERATE, this.states.jumpReady);
				this.landingPhase = "shoot";
				break;
			case "shoot":
				this.states.setDelay(this, FRAMERATE / 3, this.states.gunCharge);
				this.gunCharge = 0;
				this.landingPhase = "fireGranade";
				break;
			case "fireGranade": 
				this.states.setDelay(this, FRAMERATE, this.states.jumpReady,this.granadeAttack());
				if(this.jumpCounter < 2){
					this.jumpCounter++;
				}else{
					this.jumpCounter = 0;
					this.landingPhase = "verticalExplosion";
					this.toPlayer = false;
				}
				break;
			case "verticalExplosion": 
				this.states.setDelay(this, FRAMERATE, this.states.jumpReady,this.throwGranade());
					if(this.jumpCounter < 2){
						this.jumpCounter++;
					}else{
						this.jumpCounter = 0;
						this.landingPhase = "shoot";
					}
				break;
		}
	}
	entity.ai = function(){
		if(!this.states){
			this.states = {};
			this.states.maxJump = function(ent){
				ent.dy = -5;
				ent.y -= 1;
				var left = (ent.x + ent.width / 2) > (camera.x + camera.width / 2);
				ent.dx = (camera.x + (left ? ent.width : camera.width - ent.width * 2) - ent.width - (ent.x - ent.width)) / (- ent.dy / GRAVITY * 2);
			}
			this.states.playerJump = function(ent){
				ent.dy = -5;
				ent.y -= 1;
				ent.dx = (player.x + player.width / 2 - (ent.x + ent.width / 2)) / (- ent.dy / GRAVITY * 2);
			}
			this.states.onFly = function(ent){
				ent.oy = -5;
				if(player.x < ent.x){
					ent.flip(-1)
				}else{
					ent.flip(1)
				}
				if(ent.dy == 0){
					ent.state = this.states.idle;
					ent.landing();
				}
			}
			this.states.idle = function(ent){
				ent.oy += (Math.sin(ent.animCounter * 0.15) - ent.oy) / 2;
			}
			this.states.jumpReady = function(ent){
				ent.oy += (8 - ent.oy) / 20;
				if(Math.abs(8 - ent.oy) < 1.5){
					ent.state = ent.states.jump;
				}
			}
			this.states.jump = function(ent){
				ent.oy += (-4 - ent.oy) / 2;
				ent.state = this.states.onFly;
				if(!ent.falling){
					if(!ent.toPlayer){
						ent.states.maxJump(ent);
					} else {
						ent.states.playerJump(ent);
					}
				}
			}
			this.states.setDelay = function(ent, d, fun, evn){
				ent.delayNextState = d;
				ent.nextState = fun;
				ent.nextEvent = evn;
			}
			this.states.gunCharge = function(ent){
				ent.oy += (8 - ent.oy) / 20;
				if(ent.gunCharge < ent.maxGunCharge){
					ent.gunCharge ++;
					var aimX = this.x + this.ox + this.width / 2, aimY = this.y + this.oy + 3;
					ent.gunAimPointUp = intersectRayRectangle(
						aimX,
						aimY,
						(ent.isLeft ? Math.PI : 0) - Math.PI / 6 + Math.PI / 6 * ent.gunCharge / ent.maxGunCharge,
						player.x,
						player.y,
						player.width,
						player.height);
					ent.gunAimPointDown = intersectRayRectangle(
						aimX,
						aimY,
						(ent.isLeft ? Math.PI : 0) + Math.PI / 6 - Math.PI / 6 * ent.gunCharge / ent.maxGunCharge,
						player.x,
						player.y,
						player.width,
						player.height);
					if(ent.maxGunCharge - ent.gunCharge < 3 && (ent.gunAimPointUp.intersect || ent.gunAimPointDown.intersect)){
						player.kill();
					}
				}else{
					ent.toPlayer = true;
					ent.state = ent.states.idle;
					ent.states.setDelay(ent, FRAMERATE, this.states.jumpReady)
				}
			}
			
			this.state = this.states.jump;
			this.landingPhase = "start";
		}
		//if(this.tmp % 10 == 0)this.states.throwGranade(this, Math.floor(this.tmp / 10) % 10, 10);
		this.state(this);
		if(this.delayNextState == 0){
				if(this.nextState)this.state = this.nextState;
				if(this.nextEvent)this.nextEvent();
			}
		this.delayNextState--;
	}
	
	return entity;
}
