(function(){
	checkDead = function(bullet){
		if(bullet.x > camera.x + canvas.width / camera.scale 
			|| bullet.x + bullet.oh < camera.x
			|| bullet.y > camera.y + canvas.height / camera.scale 
			|| bullet.y + bullet.ov < camera.y
			|| pcell(bullet.x,bullet.y)!=0){
					bullet.isDead = true;
				}
	}
	if(typeof weapons === 'undefined'){
		weapons = [];
	}
	var standartGun = {auto: false, shot: function(player,h,v){
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
			bullet.spd = 5;
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
	weapons.push(standartGun);

	var machineGun = {auto: true, delay: 5, shot: function(player,h,v){
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
	weapons.push(machineGun);
	
	var heavyGun = {auto: false, shot: function(player,h,v){
		if(player.bullets.length < 2 && player){
			bullet = {};
			bullet.x = player.x + 1;
			bullet.y = player.y + 1;
			bullet.ox = v==0?1:1+8*1;
			bullet.oy = 1;
			bullet.oh = 6;
			bullet.ov = 6;
			bullet.h = h;
			bullet.v = v;
			bullet.spd = 4;
			bullet.addDmg = 2;
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
}
)()