function keyPress(evt){
	switch(evt.keyCode) {
        case 37 : player.jump(0); break; //left
		case 38 : break; //up
		case 39 : player.jump(1); break; //right
		case 40 : break; //down
		case 90 : player.gunPos = ++player.gunPos % 8;
			break;
	}
	for(var i = 0; i < buttons.length; i++){
		if(evt.keyCode == buttons[i].id){
			buttons[i].isPressed = true;
		}
	}
}
function keyRelease(evt){
	for(var i = 0; i < buttons.length; i++){
		if(evt.keyCode == buttons[i].id){
			buttons[i].isPressed = false;
		}
	}
}
function isKey(name){
	for(var i = 0; i < buttons.length; i++){
		if(name == buttons[i].name){
			return buttons[i].isPressed;
		}
	}
	return false;
}
function mouseUp(e){
	switch (e.button) {
		case 0: // Primary button ("left")
		break;
		case 2: // Secondary button ("right")
		break;
	}
}
function mouseDown(e){
	switch (e.button) {
		case 0: // Primary button ("left")
		break;
		case 2: // Secondary button ("right")
		break;
	}
}
function mouseMove(evt){
		var rct = cnv.getBoundingClientRect();
		mouse.x = evt.clientX - rct.left - 3;
		mouse.y = evt.clientY - rct.top - 3;
}

function update(){
	ctx.fillStyle="#eeeeee";
    ctx.fillRect(0,0,cnv.width,cnv.height);
	/*if(isKey("down"))ctx.fillStyle = "#222222"; else ctx.fillStyle = "#ff0000";
    ctx.fillRect(-3 + mouse.x,-3 + mouse.y,6,6);
	ctx.font="20px Georgia";
	ctx.fillStyle="red";
	ctx.fillText("Hello world!",10,25);
	ctx.drawImage(img,0,0,8,8,40,60,80,80);*/
	drawBackground();
	player.draw();
	debug.drawCollisionCircle(player);
	player.step();
	
	var newEnemies = [];
	for(var i = 0; i < enemies.length; i++){
		enemies[i].draw();
		debug.drawCollisionCircle(enemies[i]);
		enemies[i].step();
		if(isCollide(enemies[i], player)){
			enemies[i].collidePlayer(player);
			player.collide(enemies[i]);
		}
		for(var j = 0; j < bullets.length; j++){
			if(isCollide(enemies[i], bullets[j])){
			enemies[i].collideBullet(bullets[j]);
			bullets[j].collide(enemies[i]);
		}
		}
		if(!enemies[i].isDead){
			newEnemies.push(enemies[i]);
		}
	}
	enemies = newEnemies;
	
	var newBullets = [];
	for(var i = 0; i < bullets.length; i++){
		bullets[i].draw();
		debug.drawCollisionCircle(bullets[i]);
		bullets[i].step();
		if(!bullets[i].isDead){
			newBullets.push(bullets[i]);
		}
	}
	bullets = newBullets;
	
	var newParticles = [];
	for(var i = 0; i < particles.length; i++){
		particles[i].draw();
		debug.drawCollisionCircle(particles[i]);
		particles[i].step();
		if(!particles[i].isDead){
			newBullets.push(particles[i]);
		}
	}
	particles = newParticles;
	
	levelMaind.step();
}
function isCollide(ent1, ent2){
	return Math.hypot(ent1.x - ent2.x, ent1.y - ent2.y) < (ent1.radius + ent2.radius) * p.tile / 16;
}
function start(){
	
	alert("Стрелки: движение \nx: стрельба, z: поворот оружия")
	mouse = {x: 0, y: 0};
	buttons = [];
	buttons.push({id: 37, name: "left", isPressed: false});
	buttons.push({id: 38, name: "up", isPressed: false});
	buttons.push({id: 39, name: "right", isPressed: false});
	buttons.push({id: 40, name: "down", isPressed: false});
	buttons.push({id: 90, name: "z", isPressed: false});
	buttons.push({id: 88, name: "x", isPressed: false});
	img = new Image();
	img.src = "images/kars.png"
	bullets = [];
	particles = [];
	enemies = [];
	p = {tile: 16 * 7};
	tileData = {mapWidth: cnv.width /  p.tile, mapHeight: cnv.height /  p.tile + 1, railOffset: cnv.width / 5, moveSpeed: 0.15, offset: 0};
	player = getPlayer();
	debug = {
		drawCollisionCircleEnable: false, 
		drawCollisionCircle: function(entity){
			if(this.drawCollisionCircleEnable){
				ctx.beginPath();
				ctx.arc(entity.x, entity.y, entity.radius * p.tile / 16, 0, Math.PI * 2);
				ctx.stroke();}
		}
	};
	levelMaind = {
		step:function(){
			if(this.timer++ > 45){
				this.timer = 0;
				var car = getEnemyCart(Math.floor(Math.random() * 5));
				enemies.push(car);
			}
		},
		timer: 0
	}
}
function drawBackground(){
	tileData.offset += tileData.moveSpeed * p.tile;
	if(tileData.offset > p.tile){
		tileData.offset = tileData.offset % p.tile;
	}
	for(var i = 0; i < tileData.mapWidth; i++)
		for(var j = 0; j < tileData.mapHeight; j++){
			ctx.drawImage(img,3 * 16,3 * 16,16,16,i * p.tile, (j - 1) * p.tile + tileData.offset, p.tile, p.tile);
		}
	for(var i = 0; i < 5; i++)
		for(var j = 0; j < tileData.mapHeight; j++){
			ctx.drawImage(img, 3 * 16, 0 * 16, 16, 16, (i + 0.5) * tileData.railOffset - p.tile / 2, (j - 1) * p.tile + tileData.offset, p.tile, p.tile);
		}
}
function getBullet(){
	var bullet = [];
		bullet.isDead = false;
		bullet.lifeTime = 100;
		bullet.speed = 5;
		bullet.radius = 2;
		bullet.draw = function() {
			ctx.drawImage(img,16 * 2,0,16,16,this.x - p.tile / 2,this.y - p.tile / 2, p.tile, p.tile);
			
		}
		bullet.step = function() {
			if(this.lifeTime-- <= 0){
				this.isDead = true;
			}
			this.x += this.dx * this.speed;
			this.y += this.dy * this.speed;
		};
		bullet.collide = function(enemy) {
			
		}
		return bullet;
}
function getParticle(tp){
	var particle = getBullet();
	particle.lifeTime = Math.random() * 25 + 10;
	particle.type = tp;
	particle.draw = function() {
		ctx.drawImage(img,16 * 2,16 * (2 + this.type), 16, 16, this.x - p.tile / 2,this.y - p.tile / 2, p.tile, p.tile);
	}
	particle.dx = (Math.random() - 0.5) * (2 - particle.type);
	particle.dy = Math.random() * 1 + particle.type;
	return particle;
}
function getExplode(){
	var particle = getBullet();
	particle.lifeTime = 16;
	particle.draw = function() {
		ctx.drawImage(img,16 * 2, 16 * (4 + 4 - Math.floor(this.lifeTime / 4)), 16, 16, this.x - p.tile / 2,this.y - p.tile / 2, p.tile, p.tile);
	}
	particle.dx = (Math.random() - 0.5);
	particle.dy = Math.random();
	return particle;
}
function getPlayer(){
	var player = {x: 600, y: cnv.height, gunPos: 0, gunPosChangeDir: 1, timer: 0, xLine: 2, scale: 1, radius: 5};
	player.jumpAnim = {maxJump: 15, curJump:0};
	player.weapon = {bulletSpeed: 2, gunTimerMax: 10, gunTimer: 0};
	player.jumpParticleGen = function(tp) {
		for(var i = 0; i < 4 + 6 * tp; i++){
			var part = getParticle(tp);
			part.x = this.x + p.tile / 3 * (i % 2 == 0 ? 1 : -1);
			part.y = this.y + p.tile / 3;
			particles.push(part);
		}
	};
	player.draw = function() {
		ctx.drawImage(img,0,16 * (Math.floor(++this.timer / 5) + 1),16,16,this.x - p.tile / 2 * this.scale,this.y - p.tile / 2 * this.scale, p.tile * this.scale, p.tile * this.scale);
		ctx.drawImage(img,0,0,16,16,this.x - p.tile / 2,this.y - p.tile / 2 * this.scale, p.tile, p.tile * this.scale);
		ctx.drawImage(img,16,16 * (4 - Math.abs(this.gunPos - 4)),16,16,this.x - p.tile / 2 * this.scale, this.y - p.tile / 2 * this.scale, p.tile * this.scale, p.tile * this.scale);
	}
	player.init = function() {
		return this;
	};
	player.jump = function(dir){
		if(this.jumpAnim.curJump == 0){
			if(dir == 0 && this.xLine > 0){
				this.xLine--;
				this.jumpAnim.curJump = +this.jumpAnim.maxJump;
			}
			if(dir == 1 && this.xLine < 4){
				this.xLine++;
				this.jumpAnim.curJump = -this.jumpAnim.maxJump;
			}
			player.jumpParticleGen(0);
		}
	}
	player.step = function() {
		if(this.timer > 13) this.timer = 0;
		if(this.weapon.gunTimer++ >= this.weapon.gunTimerMax && isKey("x")){
			this.shot();
			this.weapon.gunTimer = 0
		}
		if(this.jumpAnim.curJump == 0){
			if(isKey("up")){this.y -=6;}
			if(isKey("down")){this.y +=6;}
			if(this.y < p.tile / 2) this.y = p.tile / 2;
			if(this.y > (cnv.height - p.tile / 3)) this.y = cnv.height - p.tile / 3;
			this.x = (this.xLine + 0.5) * tileData.railOffset;
		}else{
			this.jumpAnim.curJump -= Math.sign(this.jumpAnim.curJump);
			this.x = (this.xLine + 0.5 + this.jumpAnim.curJump / this.jumpAnim.maxJump) * tileData.railOffset;
			this.scale = 1 + Math.abs(Math.sin(this.jumpAnim.curJump / this.jumpAnim.maxJump * Math.PI)) * 0.4;
			if(this.jumpAnim.curJump == 0){
				player.jumpParticleGen(1);
			}
		}
		
		
	};
	player.collide = function(enemy) {
	}
	player.shot = function() {
		var b1 = getBullet();
		var b2 = getBullet();
		var b3 = getBullet();
		var dx,dy;
		switch(4 - Math.abs(this.gunPos - 4)){
			case 0: dx = 0; dy = -1; break;
			case 1: dx = 0.71; dy = -0.71; break;
			case 2: dx = 1; dy = 0; break;
			case 3: dx = 0.71; dy = 0.71; break;
			case 4: dx = 0; dy = 1; break;
		};
		b1.dx = dx * this.weapon.bulletSpeed;
		b1.dy = dy * this.weapon.bulletSpeed;
		b2.dx = -dx * this.weapon.bulletSpeed;
		b2.dy = dy * this.weapon.bulletSpeed;
		b3.dx = 0;
		b3.dy = -1 * this.weapon.bulletSpeed;
		b1.x = this.x + 16;
		b1.y = this.y;
		b2.x = this.x - 16;
		b2.y = this.y;
		b3.x = this.x;
		b3.y = this.y - 16;
		bullets.push(b1);
		bullets.push(b2);
		bullets.push(b3);
	}
	return player.init();
}
function getEnemy(){
	var enemy = {x: 0, y: 0, radius: 5};
	enemy.isDead = false;
	enemy.draw = function() {
		//ctx.drawImage(img,0,16 * (Math.floor(++this.timer / 5) + 1),16,16,this.x - p.tile / 2 * this.scale,this.y - p.tile / 2 * this.scale, p.tile * this.scale, p.tile * this.scale);
		//ctx.drawImage(img,0,0,16,16,this.x - p.tile / 2,this.y - p.tile / 2 * this.scale, p.tile, p.tile * this.scale);
	}
	enemy.step = function() {
		
	}
	enemy.collidePlayer = function(player) {
		
	}
	enemy.collideBullet = function(bullet) {
		
	}
	return enemy;
}
function getEnemyCart(line){
	var enemy = getEnemy();
	enemy.hp = 3;
	enemy.timer = 0;
	enemy.x = (line + 0.5) * tileData.railOffset;
	enemy.y = -p.tile;
	enemy.draw = function() {
		ctx.drawImage(img,0,16 * (Math.floor(++this.timer / 5) + 1),16,16,this.x - p.tile / 2,this.y - p.tile / 2, p.tile, p.tile);
		ctx.drawImage(img,4 * 16,0,16,16,this.x - p.tile / 2,this.y - p.tile / 2, p.tile, p.tile);
	}
	enemy.step = function() {
		if(this.timer > 13) this.timer = 0;
		this.y += 2;
		if(this.y > cnv.height + p.tile) this.isDead = true;
		if(this.hp <= 0) {
			this.isDead = true;
			this.explode();
		}
	}
	enemy.explode = function(){
		for(var i = 0; i < 7; i++){
			var part = getExplode();
			part.x = this.x + (Math.random() - 0.5) * p.tile / 2;
			part.y = this.y + (Math.random() - 0.5) * p.tile / 2;
			particles.push(part);
		}
	}
	enemy.collidePlayer = function(player) {
		
	}
	enemy.collideBullet = function(bullet) {
		this.hp--;
		bullet.isDead = true;
	}
	return enemy;
}
