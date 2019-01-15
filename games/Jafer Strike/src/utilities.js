function t2p(t){return t*TILE;}//номер тайла в координаты
function p2t(p){return Math.floor(p/TILE);}//координаты в номер тайла
function pcell(x,y){return tcell(p2t(x),p2t(y));}//получение €чейки уровн€ в определЄнных координатах
function tcell(tx,ty){return cells[tx + (ty*MAP.tw)];}//получение €чейки уровн€ по номерам тайлов
function bcell(tx,ty){return backgrounds[tx + (ty*MAP.tw)];}//получение €чейки фона по номерам тайлов
function icell(i,w){return {x: i%w, y: Math.floor(i/w)}}
function bound(x, min, max) {return Math.max(min, Math.min(max, x));}

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
function drawSprite(part,x,y,fh,fv){
	drawImg(part.img, part.ox, part.oy, part.ow, part.oh, x, y, part.width, part.height, fh, fv);
}

function drawAnim(currentAnimation,x,y,w,h,fh,fv){
	if(currentAnimation){
		var pic = currentAnimation.anim.pic;
			img = pic.img,
			frameWidth = pic.c,
			frameHeight = pic.c,
			frameNumber = Math.floor(currentAnimation.counter),
			frame = currentAnimation.anim.frames[frameNumber];
			framesLength = currentAnimation.anim.frames.length;
		drawImg(img,frame[0]*frameWidth,frame[1]*frameHeight,frameWidth,frameHeight,x,y,w,h,fh,fv);
		currentAnimation.counter += currentAnimation.anim.spd;
		if(currentAnimation.counter >= framesLength){
			currentAnimation.counter = 0;
		}
	}
}

function addImage(src, key, width, cellSize){//width-колличество тайлов в строке, cellSize-размер тайла в пиксел€х
	if(typeof images === 'undefined'){
		images = [];
	}
	var pic = {};
	pic.img = new Image();
	pic.img.src = src;
	pic.w = width;
	pic.c = cellSize;
	images[key] = pic;
}

function onScreen(entity){
	return entity && entity.x + entity.width > camera.x 
			  && entity.x < camera.x + camera.width 
			  && entity.y + entity.height  > camera.y
			  && entity.y < camera.y + camera.height;
}

function onBigScreen(entity){
	return entity && entity.x + entity.width > camera.x - camera.width / 3 
			&& entity.x < camera.x + camera.width + camera.width / 3 
			&& entity.y + entity.height > camera.y - camera.height / 3 
			&& entity.y < camera.y + camera.height + camera.height / 3;
}


function intersect(x1,y1,w1,h1,x2,y2,w2,h2){
	return Math.abs(x1 + w1 / 2 - (x2 + w2 / 2)) < (w1 + w2) / 2 && Math.abs(y1 + h1 / 2 - (y2 + h2 / 2)) < (h1 + h2) / 2
}
function intersectPointBox(px,py,bx,by,bw,bh){
	return px >= bx && px <= bx + bw && py >= by && py <= by + bh;
}
function intersectRayRectangle(rayx,rayy,raya,rectx,recty,rectw,recth,isCam){
	if(raya < 0){
		raya += Math.PI * 2 * (Math.floor(Math.abs(raya) / (Math.PI * 2)) + 1);
	}
	var angle = raya % (Math.PI * 2),
		p2 = Math.PI / 2,
		k = Math.tan(angle), x, y;
		var l = angle > p2 && angle < p2 * 3,
			u = angle > Math.PI,
			r = angle > p2 * 3 || angle < p2,
			d = angle < Math.PI;
	if(!intersectPointBox(rayx,rayy,rectx,recty,rectw,recth)){
		if(rayx < rectx + rectw / 2 && r ||
			rayy < recty + recth / 2 && d ||
			rayx > rectx + rectw / 2 && l ||
			rayy > recty + recth / 2 && u){
			var nl = rayx < rectx && r,
			nu = rayy < recty && d,
			r = rayx > rectx + rectw && l,
			d = rayy > recty + recth && u;
			l = nl, u = nu; // костыль!
		}else{
			l = u = r = d = false;
		}
	}
	
	if(l){ // left
		y = k * (rectx - rayx) + rayy;
		if(y >= recty && y <= recty + recth){
			return {x: rectx, y: y, intersect: !isCam};
		}
	}
	
	if(u){ // up
		x = (recty - rayy) / k + rayx;
		if(x >= rectx && x <= rectx + rectw){
			return {x: x, y: recty, intersect: !isCam};
		}
	}
	
	if(r){ //right
		y = k * (rectx + rectw - rayx) + rayy;
		if(y >= recty && y <= recty + recth){
			return {x: rectx + rectw, y: y, intersect: !isCam};
		}
	}
	if(d){ // down
		x = (recty + recth - rayy) / k + rayx;
		if(x >= rectx && x <= rectx + rectw){
			return {x: x, y: recty + recth, intersect: !isCam};
		}
	}
	if(!isCam && intersectPointBox(rayx,rayy,camera.x,camera.y,camera.width,camera.height)){
		return intersectRayRectangle(rayx,rayy,raya,camera.x,camera.y,camera.width,camera.height,true)
	}
	return {x: 0, y: 0};	
}
function drawLine(x1, y1, x2, y2){
	ctx.beginPath();
	ctx.moveTo(x1 - camera.x, y1 - camera.y);
	ctx.lineTo(x2 - camera.x, y2 - camera.y);
	ctx.stroke();
}