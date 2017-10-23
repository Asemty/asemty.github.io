function start(){
	GRAVITY  = 1/5;
	MAXDX    = 2;      
	MAXDY    = 8;     
	ACCEL    = 0.1;     
	FRICTION = 1;     
	IMPULSE  = 4;

	camera = { x: 0, y: 0, scale: 6, scroll: "only_right"};
	camera.width = canvas.width / camera.scale;
	camera.height = canvas.height / camera.scale;
	ctx.scale(camera.scale,camera.scale);
	ctx.imageSmoothingEnabled = false;
	addImage("images/player.png","player",5,8)
	addImage("images/bullet.png","bullet",4,8)
	addImage("images/hud.png","hud",4,8)
	addImage("images/enemy1.png","enemy1",8,8)
	addImage("images/bosses.png","bosses")
	
	startGame();
	
	/////////////////////Temp////////////////////
	//player.x = 960;
	//camera.x = 948;
	//enemies.push(setupWalkerTank(1080,32));
}
function startGame(lvl){
	if(!lvl) var lvl = "lvl1";
	enemies = [];
	treasures = [];
	spawners = [];
	
	camera.scroll = "only_right";
	scenario = scenarios[lvl];
	scenario.start();
	setupMap(lvl);
	player.live = 2;
}

function setupMap(name){
	curentMap = getMap(name);
	MAP = { tw: curentMap.width, th: curentMap.height };
	TILE = curentMap.tileheight;
	tilesetsImage = new Image();
	tilesetsImage.src = curentMap.tilesets[0].image.substring(3);
	tilesetsWidth = curentMap.tilesets[0].columns;
	cells = curentMap.layers[0].data;
	objects = curentMap.layers[1].objects;
	backgrounds = curentMap.layers[2].data;
	var entity;
	for(var n = 0 ; n < objects.length ; n++) {
		obj = objects[n];
		entity = setupEntity(obj);
		switch(obj.type) {
			case "player"	: player = entity; break;
			case "enemy"  	: enemies.push(entity); break;
			case "treasure"	: treasures.push(entity); break;
			case "spawner"	: spawners.push(entity); break;
		}
    }
}
function setupEntity(obj, name) {
    var entity = {};
    entity.x		= obj.x;
    entity.y		= obj.y;
	entity.width	= obj.width;
    entity.height	= obj.height;
    entity.dx		= 0;
    entity.dy		= 0;
    entity.start    = { x: obj.x, y: obj.y }
	if(obj.properties) entity.lookLeft = obj.properties.lookLeft;
	if(!name){
		var name = obj.name;
	}
	switch(name){
		case "player": setupPlayer(entity, obj); break;
		case "soldier": setupSoldier(entity, obj); break;
		case "spawner": setupSpawner(entity, obj); break;
	}
    return entity;
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
		if(!this.dead && this.immune <= 0){
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
}

function update(){
	ctx.fillStyle="#000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	updateEntities();
	updateCamera();
	scenario.update();
	render();
}
function updateEntities(){
	updatePlayer();
	var newEnemies = [];
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].update)enemies[i].update();
		if(!enemies[i].isDead){
			newEnemies.push(enemies[i]);
		}else if(enemies[i].onDead){
			enemies[i].onDead();
		}
	}
	enemies = newEnemies;
	
	var newTreasures = [];
	for(var i = 0; i < treasures.length; i++){
		if(treasures[i].update)treasures[i].update();
		if(!treasures[i].isDead){
			newTreasures.push(treasures[i]);
		}
	}
	treasures = newTreasures;
	
	for(var i = 0; i < spawners.length; i++){
		if(spawners[i].update)spawners[i].update();
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
function updateEntity(entity) {
    var wasleft    = entity.dx  < 0,
        wasright   = entity.dx  > 0,
        falling    = entity.falling,
        friction   = FRICTION,
        accel      = entity.accel || ACCEL;
  
    entity.ddx = 0;
    entity.ddy = !entity.noFall && GRAVITY;
  
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
function updateCamera(){
	switch(camera.scroll){
		case "only_right":
			if(player.x - camera.x > camera.width / 2){
				camera.x += MAXDX;
			}
			break;
		case "const_right":
			camera.x += MAXDX / 4*3;
			break;
		case "static":
			break;
	}
}

function render(){
	renderPlayer();
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].render 
			&& enemies[i].x + enemies[i].width > camera.x 
			&& enemies[i].x < camera.x + camera.width 
			&& enemies[i].y + enemies[i].height > camera.y 
			&& enemies[i].y < camera.y + camera.height){
				enemies[i].render();
		}
	}
	renderMap();
	scenario.render();
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
function renderHUD(){
	for(var i = 0; i < player.live; i++){
		drawImg(images["hud"].img, 0, 0, 8, 8, 10*i, 2, 8, 8);
	}
	var p = icell(player.currentGun + 1,4);
	drawImg(images["hud"].img, 8*p.x, 8*p.y, 8, 8, 2, 10, 8, 8);
	if(camera.x < camera.width){
		ctx.fillStyle = "#fff";
		ctx.font="bold 3px arial";
		ctx.fillText("WASD или стрелки-движение, J/Z-прыжок, H/X-стрельба, F/ENTER-циклическая смена оружия",50 - camera.x,30 - camera.y);
		}
	
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

function gameover(){
	camera.x = 0;
	camera.y = 0;
	startGame();
}

function getMap(name){return TileMaps[name]};