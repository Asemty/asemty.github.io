(function(){
	checkDead = function(bullet){
		if(bullet.x > camera.x + camera.width 
			|| bullet.x + bullet.oh < camera.x
			|| bullet.y > camera.y + camera.height 
			|| bullet.y + bullet.ov < camera.y
			|| pcell(bullet.x + bullet.oh / 2,bullet.y + bullet.ov / 2)!=0){
					bullet.isDead = true;
				}
	}
	if(typeof weapons === 'undefined'){
		weapons = [];
	}
	var basicGun = {auto: false, shot: function(player,h,v){
		if(player.bullets.length < 3 && player){
			bullet = {};
			bullet.x = player.x + 2;
			bullet.y = player.y + 2;
			bullet.ox = 2;
			bullet.oy = 2 + 8 * 1;
			bullet.oh = 4;
			bullet.ov = 4;
			bullet.h = h;
			bullet.v = v;
			bullet.spd = 4;
			if(h!= 0 && v!=0){
				bullet.spd = Math.sqrt((bullet.spd * bullet.spd) / 2);
			}
			bullet.upd = function(){
				this.x += this.spd * this.h; 
				this.y += this.spd * this.v;
				checkDead(this);
			};
			player.bullets.push(bullet);
		}
	}}
	weapons.push(basicGun);

	var autoGun = {auto: true, delay: 5, shot: function(player,h,v){
		if(player.bullets.length < 5 && player){
			bullet = {};
			bullet.x = player.x + 2;
			bullet.y = player.y + 2;
			bullet.ox = 2;
			bullet.oy = 2 + 8 * 1;
			bullet.oh = 4;
			bullet.ov = 4;
			bullet.h = h;
			bullet.v = v;
			bullet.spd = 6;
			if(h!= 0 && v!=0){
				bullet.spd = Math.sqrt((bullet.spd * bullet.spd) / 2);
			}
			bullet.upd = function(){
				this.x += this.spd * this.h; 
				this.y += this.spd * this.v;
				checkDead(this);
			};
			player.bullets.push(bullet);
		}
	}}
	weapons.push(autoGun);
	
	var heavyGun = {auto: false, shot: function(player,h,v){
		if(player.bullets.length < 2 && player){
			bullet = {};
			bullet.x = player.x + 1;
			bullet.y = player.y + 1;
			bullet.ox = v==0?1:1+8*2;
			bullet.oy = 1;
			bullet.oh = 6;
			bullet.ov = 6;
			bullet.h = h;
			bullet.v = v;
			bullet.spd = 4;
			bullet.dmg = 2;
			if(h!= 0 && v!=0){
				bullet.spd = Math.sqrt((bullet.spd * bullet.spd) / 2);
			}
			bullet.upd = function(){
				this.x += this.spd * this.h * (this.v != 0?0:1); 
				this.y += this.spd * this.v;
				if((Math.floor((this.x + this.y)/16) % 2) == 0){
					bullet.ox = (v==0?1:1+8*2);
				}else{
					bullet.ox = (v==0?1+8*1:1+8*3);
				}
				checkDead(this);
			};
			player.bullets.push(bullet);
		}
	}}
	weapons.push(heavyGun);
	
	var explosiveGun = {auto: false, shot: function(player,h,v){
		if(player.bullets.length < 1 && player){
			bullet = {};
			bullet.x = player.x + 2;
			bullet.y = player.y + 2;
			bullet.ox = 2;
			bullet.oy = 2 + 8 * 1;
			bullet.oh = 4;
			bullet.ov = 4;
			bullet.h = h;
			bullet.v = v;
			bullet.spd = 4;
			bullet.dy = 0;
			bullet.dmg = 3;
			if(h!= 0 && v!=0){
				bullet.spd = Math.sqrt((bullet.spd * bullet.spd) / 2);
			}
			bullet.upd = function(){
				this.prevx = this.x;
				this.prevy = this.y;
				this.x += this.spd * this.h; 
				this.y += this.spd * (this.v - 0.5) + this.dy;
				this.dy += GRAVITY;
				checkDead(this);
				if(this.isDead){
					explode = createExplode(this.prevx + 2 ,this.prevy + 2, 5);
					explode.additionalEvent = function(){
						var size = 8;
						var x1 = this.x + 4 + Math.sin(this.explPhase * Math.PI / 3) * size;
						var y1 = this.y + 4 + Math.cos(this.explPhase * Math.PI / 3) * size;
						var x2 = this.x + 4 + Math.sin(this.explPhase * Math.PI / 3 + Math.PI) * size;
						var y2 = this.y + 4 + Math.cos(this.explPhase * Math.PI / 3 + Math.PI) * size;
						partExplode1 = createExplode(x1, y1, this.explDelay);
						partExplode2 = createExplode(x2, y2, this.explDelay);
					}
				}
			};
			player.bullets.push(bullet);
		}
	}}
	weapons.push(explosiveGun);
	
	var waveGun = {auto: false, shot: function(player,h,v){
		if(player.bullets.length < 3 && player){
			bullet = {};
			bullet.x = player.x;
			bullet.y = player.y;
			bullet.h = h;
			bullet.v = v;
			bullet.ox = v==0?2:8*1;
			bullet.oy = v==0?8*3:8*3+2;
			bullet.oh = v!=0?4:8;
			bullet.ov = v!=0?8:4;
			bullet.spd = 2;
			bullet.notOneOff = true;
			bullet.dmg = 0.5;
			if(h!= 0 && v!=0){
				bullet.spd = Math.sqrt((bullet.spd * bullet.spd) / 2);
			}
			bullet.upd = function(){
				this.x += this.spd * this.h * (this.v != 0?0:1); 
				this.y += this.spd * this.v;
				this.spd += 0.3;
				checkDead(this);
			};
			player.bullets.push(bullet);
		}
	}}
	weapons.push(waveGun);
	
	var shootGun = {auto: false, shot: function(player,h,v){
	if(player.bullets.length < 6 && player){
		for(var i = 0; i < 5; i++){
			bullet = {};
			bullet.x = player.x + 2;
			bullet.y = player.y + 2;
			bullet.ox = 2;
			bullet.oy = 2 + 8 * 1;
			bullet.oh = 4;
			bullet.ov = 4;
			bullet.h = h + -Math.sign(v)*(-0.2 + 0.1 * i); //я не разобрался, как работает этот алгоритм.
			bullet.v = v + Math.sign(h)*(-0.2 + 0.1 * i);	//для его подбора был использован метод научного тыка
			bullet.spd = 5;
			bullet.dmg = 0.5;
			if(h!= 0 && v!=0){
				bullet.spd = Math.sqrt((bullet.spd * bullet.spd) / 2);
			}
			bullet.upd = function(){
				this.x += this.spd * this.h; 
				this.y += this.spd * this.v;
				checkDead(this);
			};
			player.bullets.push(bullet);
		}
		}
	}}
	weapons.push(shootGun);
	
	var fireGun = {auto: true, delay: 3, shot: function(player,h,v){
		if(player){
			bullet = {};
			bullet.x = player.x;
			bullet.y = player.y;
			bullet.ox = 8 * 1;
			bullet.oy = 8 * 1;
			bullet.oh = 8;
			bullet.ov = 8;
			bullet.h = h;
			bullet.v = 0;
			bullet.doublev = v;
			bullet.spd = 8;
			bullet.notOneOff = true;
			bullet.timer = 0;
			bullet.dmg = 0.15;
			if(h!= 0 && v!=0){
				bullet.spd = Math.sqrt((bullet.spd * bullet.spd) / 2);
			}
			bullet.upd = function(){
				this.x += this.spd * this.h; 
				this.y += this.spd * this.doublev;
				this.spd *= 0.9;
				this.timer++;
				this.ox = 8 * (Math.floor(this.timer/2)%3 + 1);
				if(this.timer == 25){
					this.isDead = true;
				}
			};
			player.bullets.push(bullet);
		}
	}}
	weapons.push(fireGun);
	
	function createExplode(x,y,delay){//x и y-центр взрыва
		explode = {};
		explode.x = x - 4;
		explode.y = y - 4;
		explode.ox = 0;
		explode.oy = 0 + 8 * 2;
		explode.oh = 8;
		explode.ov = 8;
		explode.h = 0;
		explode.v = 0;
		explode.explTimer = 0;
		explode.explDelay = delay;
		explode.explPhase = 0;
		explode.notOneOff = true;
		explode.dmg = 0.07;
		explode.upd = function(){
			if(this.explTimer == this.explDelay){
				this.explTimer = 0;
				this.explPhase++;
				if(this.explPhase == 4){
					this.isDead = true;
					return;
				}
				this.ox = 8 * this.explPhase;
				if(this.additionalEvent){
					this.additionalEvent();
				}
			}
			this.explTimer++;
		}
		player.bullets.push(explode);
		return explode;
	}
}
)()