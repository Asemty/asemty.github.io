function start(){
	camera = { x: 0, y: 0, scale: 6};
	ctx.scale(camera.scale,camera.scale);
	ctx.imageSmoothingEnabled=false;
	playerInfo = {img: new Image(), width: 8, height: 8};
	bulletInfo = {img: new Image(), width: 8, height: 8};
	playerInfo.img.src = "images/player.png";
	bulletInfo.img.src = "images/bullet.png";
	temp = {};
	temp.hudimg= new Image();
	temp.hudimg.src = "images/hud.png";
	temp.live = 2;
	setupMap("lvl1");
	GRAVITY  = 1/5;
	MAXDX    = 2;      // default max horizontal speed (15 tiles per second)
	MAXDY    = 8;      // default max vertical speed   (60 tiles per second)
	ACCEL    = 0.1;     // default take 1/2 second to reach maxdx (horizontal acceleration)
	FRICTION = 1;     // default take 1/6 second to stop from maxdx (horizontal friction)
	IMPULSE  = 4;
}

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
function update(){
	ctx.fillStyle="#000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	updateEntitis();
	render();
}

function updateEntitis(){
	updatePlayer();
}
function updatePlayer(){
	updateEntity(player);
	if(player.x - camera.x > canvas.width / camera.scale / 2){
		camera.x+= MAXDX;
	}
	if(player.x <= camera.x){
		player.left = false;
		player.dx += MAXDX
	}
	if(player.y >= canvas.height/camera.scale){
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
	if(player.bPressed && player.gun().auto && (!player.gun().delay || player.gun().delay < player.gunCounter)){
			player.shot();
			player.gunCounter = 0;
	}
	if(player.dead){
		player.deadTimer++;
		if(player.deadTimer > 30){
			player.deadTimer = 0;
			if(temp.live>0){
				temp.live--;
				player.dead = false;
				player.x = player.respawnPoint.x;
				player.y = player.respawnPoint.y;
				player.dx = 0;
				player.dy = 0;
			}else{
				gameover();
			}
		}
	}
}
function updateEntity(entity) {
    var wasleft    = entity.dx  < 0,
        wasright   = entity.dx  > 0,
        falling    = entity.falling,
        friction   = FRICTION,
        accel      = ACCEL;
  
    entity.ddx = 0;
    entity.ddy = GRAVITY;
  
    if (entity.left && !entity.dead)
      entity.ddx = entity.ddx - accel;
    else if (wasleft)
      entity.ddx = entity.ddx + friction;
  
    if (entity.right && !entity.dead)
      entity.ddx = entity.ddx + accel;
    else if (wasright)
      entity.ddx = entity.ddx - friction;
  
    if (entity.jump && entity.canJump && !falling && !entity.dead) {
      entity.ddy = entity.ddy - IMPULSE; // an instant big force impulse
      entity.canJump = false;
    }
    entity.dx = bound(entity.dx + entity.ddx, -MAXDX, MAXDX);
    entity.dy = bound(entity.dy + entity.ddy, -MAXDY, MAXDY);
  
    if ((wasleft  && (entity.dx > 0)) ||
        (wasright && (entity.dx < 0))) {
      entity.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
    }
	if(entity.dy < 0 && !entity.jump){
		entity.dy/= 2;
	}

	var tx        = p2t(entity.x + entity.dx),
        ty        = p2t(entity.y),
		ntx       = p2t(entity.x + entity.dx + entity.width),
        nty       = p2t(entity.y + entity.height - 1),
        nx        = ntx != tx,
        ny        = nty != ty,
        cell      = tcell(tx,     ty),
        cellright = tcell(ntx, ty),
        celldown  = tcell(tx,     nty),
        celldiag  = tcell(ntx, nty);
  
	if (entity.dx > 0) {
      if ((cellright && !cell) ||
          (celldiag  && !celldown && ny)) {
        entity.x = t2p(tx + 1) - entity.width;
        entity.dx = 0;
      }else{
		entity.x  = entity.x + entity.dx;
	  }
    }
    else if (entity.dx < 0) {
      if ((cell     && !cellright) ||
          (celldown && !celldiag && ny)) {
        entity.x = t2p(tx + 1);
        entity.dx = 0;
      }else{
		entity.x  = entity.x + entity.dx;
	  }
    }
	
  var   tx        = p2t(entity.x),
        ty        = p2t(entity.y + entity.dy),
		ntx       = p2t(entity.x + entity.width - 1),
        nty       = p2t(entity.y + entity.dy + entity.height),
        nx        = ntx != tx,
        ny        = nty != ty,
        cell      = tcell(tx,     ty),
        cellright = tcell(ntx, ty),
        celldown  = tcell(tx,     nty),
        celldiag  = tcell(ntx, nty);
	if (entity.dy > 0) {
      if ((celldown && !cell) ||
          (celldiag && !cellright && nx)) {
        entity.y = t2p(ty + 1) - entity.height;
        entity.dy = 0;
        entity.falling = false;
        entity.canJump = true;
        ny = 0;
      }else{
		entity.y  = entity.y + entity.dy;
	  }
    }
    else if (entity.dy < 0) {
      if ((cell      && !celldown) ||
          (cellright && !celldiag && nx)) {
        entity.y = t2p(ty + 1);
        entity.dy = 0;
        cell      = celldown;
        cellright = celldiag;
        ny        = 0;
      }else{
		entity.y  = entity.y + entity.dy;
	  }
    }
    entity.falling = ! (celldown || (nx && celldiag));
  
}


function render(){
	renderPlayer();
	renderMap();
	renderHUD();
}

function renderMap(){
	var x, y, cell,bc;
	for(x = 0 ; x < MAP.tw ; x++) {
		if(x * TILE + TILE - camera.x >= 0 && x * TILE - camera.x <= canvas.width)
		for(y = 0 ; y < MAP.th ; y++) {
			if(y * TILE + TILE - camera.y >= 0 && y * TILE - camera.y <= canvas.height){
				cell = tcell(x, y);
				bc = bcell(x,y);
				if (bc) {
					var ic = icell(bc-1,tilesetsWidth);
					drawImg(tilesetsImage, ic.x * TILE, ic.y * TILE, TILE, TILE, x * TILE - camera.x, y * TILE - camera.y , TILE, TILE)
				}
				if (cell) {
					var ic = icell(cell-1,tilesetsWidth);
					drawImg(tilesetsImage, ic.x * TILE, ic.y * TILE, TILE, TILE, x * TILE - camera.x, y * TILE - camera.y , TILE, TILE)
				}
			}
		}
	}
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
			player.respawnPoint.x = player.x;
			player.respawnPoint.y = player.y;
		} else {
			player.setAnim("standAnim");
			player.respawnPoint.x = player.x;
			player.respawnPoint.y = player.y;
		}
		drawAnim(player, player.x - camera.x, player.y - camera.y, player.width, player.height, player.lookleft);
		if(player.bullets){
			for(var i=0;i < player.bullets.length; i++){
				var b = player.bullets[i];
				drawImg(bulletInfo.img, b.ox, b.oy, b.ov, b.oh, player.bullets[i].x - camera.x, player.bullets[i].y - camera.y, b.ov, b.oh, b.h < 0, b.v < 0);
			}
		}
	}
}

function renderHUD(){
	if(player){
		for(var i = 0; i < temp.live; i++){
			drawImg(temp.hudimg, 0, 0, 8, 8, 10*i, 2, 8, 8);
		}
		var p = icell(player.currentGun + 1,4);
		drawImg(temp.hudimg, 8*p.x, 8*p.y, 8, 8, 2, 10, 8, 8);
		if(camera.x < canvas.width / camera.scale){
			ctx.fillStyle = "#fff";
			ctx.font="bold 3px arial";
			ctx.fillText("WASD или стрелки-движение, J/Z-прыжок, H/X-стрельба, F/ENTER-циклическая смена оружия",50 - camera.x,30 - camera.y);
			}
	}
}

function setupMap(name){
	curentMap = getMap(name);
	MAP = { tw: curentMap.width, th: curentMap.height };
	TILE = curentMap.tileheight;
	tilesetsImage = new Image();
	tilesetsImage.src=curentMap.tilesets[0].image.substring(3);
	tilesetsWidth = curentMap.tilesets[0].columns;
	cells = curentMap.layers[0].data;
	objects = curentMap.layers[1].objects;
	backgrounds = curentMap.layers[2].data;
	var entity;
	for(var n = 0 ; n < objects.length ; n++) {
		obj = objects[n];
		entity = setupEntity(obj);
		switch(obj.type) {
			case "player"   : player = entity; break;
			case "monster"  : monsters.push(entity); break;
			case "treasure" : treasure.push(entity); break;
		}
    }
}

function setupEntity(obj) {
    var entity = {};
    entity.x		= obj.x;
    entity.y		= obj.y;
	entity.width	= obj.width;
    entity.height	= obj.height;
    entity.dx		= 0;
    entity.dy		= 0;
    entity.left     	= obj.properties && obj.properties.dir == -1 || 0;
	entity.right     	= obj.properties && obj.properties.dir == 1 || 0;
    entity.start    = { x: obj.x, y: obj.y }
	switch(obj.type){
		case "player": setupPlayer(entity, obj); break;
	}
    return entity;
  }
function setupPlayer(entity, obj){
	entity.standAnim = {spd: 0, pic: playerInfo, frames: [[0,0]]};
	entity.runAnim = {spd: 0.3, pic: playerInfo, frames: [[0,0],[1,0],[2,0],[3,0]]};
	entity.jumpAnim = {spd: 0, pic: playerInfo, frames: [[1,0]]};
	entity.deadAnim = {spd: 0, pic: playerInfo, frames: [[4,0]]};
	entity.currentAnimation = {anim: entity.standAnim, counter: 0};
	entity.setAnim = function(newAnim){
		if(this[newAnim] && this[newAnim] != this.currentAnimation.anim){
			this.currentAnimation.anim = this[newAnim];
			this.currentAnimation.counter = 0;
		}
	};
	entity.gunCounter = 0;
	entity.currentGun = 0;
	entity.shot = function(){
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
	entity.gun = function(){
		return weapons[this.currentGun];
	}
	
	entity.deadTimer = 0;
	
	entity.respawnPoint = {x: entity.x, y: entity.y}
	entity.respawnPoint.y = entity.y;
}
function getMap(name){return TileMaps[name]};
function t2p(t){return t*TILE;}//номер тайла в координаты
function p2t(p){return Math.floor(p/TILE);}//координаты в номер тайла
function pcell(x,y){return tcell(p2t(x),p2t(y));}//получение ячейки уровня в определённых координатах
function tcell(tx,ty){return cells[tx + (ty*MAP.tw)];}//получение ячейки уровня по номерам тайлов
function bcell(tx,ty){return backgrounds[tx + (ty*MAP.tw)];}//получение ячейки фона по номерам тайлов
function icell(i,w){return {x: i%w, y: Math.floor(i/w)}}
function bound(x, min, max) {// загнать число в рамки
    return Math.max(min, Math.min(max, x));
  }
  
function up(p){
	if(player){
		player.lookup = p
	}
}
function down(p){
if(player){
		player.lookdown = p
	}
}
function left(p){
	if(player){
		player.left = p;
	}
}
function right(p){
	if(player){
		player.right = p;
	}
}
function aButton(p){
	if(player){
		player.jump = p;
	}
}
function bButton(p){
		if(player && !player.bullets){
			player.bullets=[];
		}
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
function gameover(){
	temp.live = 2;
	setupMap("lvl1");
	camera.x = 0;
	camera.y = 0;
}

function drawImg(img,ox,oy,ow,oh,cx,cy,cw,ch,fh,fv){
	if(fh || fv){
		ctx.save();
		ctx.translate(cx+(fh?cw:0),cy+(fv?ch:0));
		ctx.scale(fh?-1:1, fv?-1:1)
		ctx.drawImage(img,ox,oy,ow,oh,0,0,cw,ch);
		ctx.restore();
	}else{
		ctx.drawImage(img,ox,oy,ow,oh,cx,cy,cw,ch);
	}
}
function drawAnim(entity,x,y,w,h,fh,fv){
	if(entity && entity.currentAnimation){
		var img = entity.currentAnimation.anim.pic.img,
			frameWidth = entity.currentAnimation.anim.pic.width,
			frameHeight = entity.currentAnimation.anim.pic.height,
			frameNumber = Math.floor(entity.currentAnimation.counter),
			frame = entity.currentAnimation.anim.frames[frameNumber];
			framesLength = entity.currentAnimation.anim.frames.length;
		drawImg(img,frame[0]*frameWidth,frame[1]*frameHeight,frameWidth,frameHeight,x,y,w,h,fh,fv);
		entity.currentAnimation.counter += entity.currentAnimation.anim.spd;
		if(entity.currentAnimation.counter >= framesLength){
			entity.currentAnimation.counter = 0;
		}
	}
}
