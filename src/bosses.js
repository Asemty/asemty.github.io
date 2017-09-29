function setupWalkerTank(x, y){
	var obj = {};
	obj.x = x;
    obj.y = y;
	obj.width = 19;
    obj.height = 7;
	var entity = setupEntity(obj)
	//setupEnemy(entity);
	
	entity.live = 100;
	entity.notNeedPhisic = true;
	entity.animCounter = 0;
	entity.ox = 0;
	entity.oy = 0;
	entity.sprite = {img: images["bosses"].img, ox: 16, oy: 0, ow: 19, oh: 8, width: 16, height: 8};
	
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
		for(var prtNm in this.parts){
			var prt = this.parts[prtNm];
			drawSprite(prt.sprite,
			this.x + prt.sx + prt.ox + (prt.fixed ? this.ox : 0) - camera.x,
			this.y + prt.sy + prt.oy + (prt.fixed ? this.oy : 0) - camera.y,
			prt.fh, prt.fv);
		}
		drawSprite(this.sprite, this.x + this.ox - camera.x, this.y + this.oy - camera.y);
	}
	entity.update = function(){
		for(var i = 0; i < player.bullets.length; i++){
			var bullet = player.bullets[i];
			if(!bullet.isDead && intersect(this.x + this.ox, this.y + this.oy, this.width, this.height, bullet.x, bullet.y, bullet.oh, bullet.ov)){
				if(!bullet.notOneOff) bullet.isDead = true;
				this.live -= bullet.dmg || 1;
				if(this.live <= 0){
					this.isDead = true;
				}
			}
		}
		if(!player.dead && !this.dead && intersect(this.x + this.ox, this.y + this.oy, this.width, this.height, player.x, player.y, player.width, player.height)){
			player.dead = true;
		}
		this.animCounter ++;
		this.oy = Math.sin(this.animCounter * 0.1) * 1.2;
		var lul = this.parts["leftUpLeg"],
			rul = this.parts["rightUpLeg"],
			ldl = this.parts["leftDownLeg"],
			rdl = this.parts["rightDownLeg"];
		lul.oy = Math.sin(this.animCounter * 0.1);
		rul.oy = Math.sin(this.animCounter * 0.1);
		
		var legLevel = this.y + 13 + Math.max(ldl.sy + ldl.oy, rdl.sy + rdl.oy);
		this.falling = pcell(this.x, legLevel) == 0;
		if(this.falling) {
			this.dy += GRAVITY/2;
			this.dy = bound(this.dy, -MAXDY, MAXDY)
		}else{
			this.dy = 0;
			this.y -= legLevel % TILE;
		}
		this.y += this.dy;
		
	}
	return entity;
}
