function newWorld(){
	var world = {};
	world.activeZone = {isActive: true, x: 0, y: 0, w: 320, h: 200};
	world.children = [];
	world.update = function(){
		for(var i = 0; i < this.children.length; i++){
			var obj = this.children[i];
			obj.col = false;
		}
		for(var i = 0; i < this.children.length; i++){
			var obj = this.children[i];
			
			obj.pos.x += obj.spd.x;
			for(var j = i + 1; j < this.children.length; j++){
				var obj2 = this.children[j];
				var collide = intersectRR(obj, obj2);
				if(collide && obj2.isSolid){
					obj.pos.x -= obj.spd.x;
					var dx = Math.max(Math.abs(obj.pos.x - obj2.pos.x + (obj.dim.w - obj2.dim.w) / 2) - (obj.dim.w + obj2.dim.w) / 2, 0) * Math.sign(obj.spd.x);
					obj.pos.x += dx;
				obj.col = true;
				obj2.col = true;}
			}
			obj.spd.x = 0;
			
			obj.pos.y += obj.spd.y;
			for(var j = i + 1; j < this.children.length; j++){
				var obj2 = this.children[j];
				var collide = intersectRR(obj, obj2);
				if(collide && obj2.isSolid){
					obj.pos.y -= obj.spd.y;
					var dy = Math.max(Math.abs(obj.pos.y - obj2.pos.y + (obj.dim.h - obj2.dim.h) / 2) - (obj.dim.h + obj2.dim.h) / 2, 0) * Math.sign(obj.spd.y);
					obj.pos.y += dy;
				obj.col = true;
				obj2.col = true;}
			}
			obj.spd.y = 0;
			
			obj.pos.x = Math.floor(obj.pos.x);
			obj.pos.y = Math.floor(obj.pos.y);
		}
	};
	return world;
}
function newBox(x,y,w,h){
	var box = {};
	box.pos = {x: Math.round(x), y: Math.round(y)};
	box.dim = {w: Math.round(w), h: Math.round(h)};
	box.spd = {x: 0, y: 0};
	box.isSolid = true;
	box.layers = [];//layers[ground] = true;
	box.layers[0] = true;
	box.layersCollide = [];//layers[ground] = true;
	box.layersCollide[0] = true;
	return box;
}
function debugDraw(ctx,world, x, y){
	for(var o in world.children){
		var obj = world.children[o];
		if(!obj.clr){
			obj.clr = getRandomColor();
		}
		ctx.fillStyle = obj.clr + (obj.col ? "77" : "33");//"33";
		ctx.fillRect(obj.pos.x,obj.pos.y,obj.dim.w,obj.dim.h);
		ctx.strokeStyle = obj.clr;
		ctx.strokeRect(obj.pos.x,obj.pos.y,obj.dim.w,obj.dim.h);
	}
}

function intersectRR(obj1, obj2){
		for(var l1 in obj1.layers){
			for(var l2 in obj2.layers){
				if(l1 == l2 && obj1.layers[l1] && obj2.layers[l2])
					return (obj1.pos.y < obj2.pos.y + obj2.dim.h) 
					&& (obj1.pos.y + obj1.dim.h > obj2.pos.y) 
					&& (obj1.pos.x + obj1.dim.w > obj2.pos.x) 
					&& (obj1.pos.x < obj2.pos.x + obj2.dim.w);
			}
		}
		return false;
	}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}