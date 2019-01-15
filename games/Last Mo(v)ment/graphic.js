function loadGraphics(){
	circle = new Image();
	circle.src = "images/circle.png";
	arrow = new Image();
	arrow.src = "images/arrow.png";
	bullet = new Image();
	bullet.src = "images/bullet.png";
	aim = new Image();
	aim.src = "images/aim.png";
}

function drawRotatedImage(img, ox, oy, ow, oh, x, y, w, h, a, rx, ry){
	ctx.save();
	ctx.translate( x, y );
	ctx.rotate(a);
	ctx.drawImage( img, ox, oy, ow, oh, -rx, -ry, w, h);
	ctx.restore();
}