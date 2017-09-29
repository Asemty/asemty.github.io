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

function intersect(x1,y1,w1,h1,x2,y2,w2,h2){
	return Math.abs(x1 + w1 / 2 - (x2 + w2 / 2)) < (w1 + w2) / 2 && Math.abs(y1 + h1 / 2 - (y2 + h2 / 2)) < (h1 + h2) / 2
}