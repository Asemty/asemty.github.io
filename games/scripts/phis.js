Phis = {};
Phis.createWorld = function(tilemap){
	var world = {};
	world.entities = [];
	world.tileMap = tilemap;
	//x,y,w,h,layers,dead[,collide][,step]
	return world;
}
Phis.step = function(world){
	//Проводим обновление для каждого объекта. Делаем это зарание, что бы при столкновении все были на одной "фазе"
	for(var i = 0; i < world.entities.length; i++){
		if(world.entities[i].step) world.entities[i].step();
		
	}
	var newEntities = [];//Временно храним объекты, которые "живы" и будут дальше существовать. Остальные объекты удаляются
	var ent_i, ent_j;//entity[i] и entity[j]
	for(var i = 0; i < world.entities.length; i++){
		ent_i = world.entities[i];
		for(var j = i + 1; j < world.entities.length; j++){
			//при пересечени обрабатываем функцию столкновения сразу у обоих объектов
			//по этому проверяем пересечение только с далее стоящими в списке
			ent_j = world.entities[j];
			if((world.entities[i].layers & world.entities[j].layers) != 0){//побитовая проверка слоёв
				if(ent_i.x <= ent_j.x + ent_j.w 
				&& ent_j.x <= ent_i.x + ent_i.w
				&& ent_i.y <= ent_j.y + ent_j.h 
				&& ent_j.y <= ent_j.y + ent_i.h){
					if(ent_i.collide) ent_i.collide(ent_j);
					if(ent_j.collide) ent_j.collide(ent_i);
				}
			}
		}
		if(!ent_i.dead) newEntities.push(ent_i)
	}
	world.entities = newEntities;
}
	
Phis.makeEntity = function(entity,x,y,w,h){
	if(!entity) entity = {};
	entity.x		= x;
	entity.y		= y;
	entity.w		= w;
	entity.h		= h;
	entity.layers = 1;
	entity.dead = false;
	entity.start    = {x: x, y: y};
	/*
		entity.collide
		entity.step
	*/
	if()
	entity.dx		= 0;
	entity.dy		= 0;
	
	
	return entity;
}

Phis.updateEntity = function (entity) {
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