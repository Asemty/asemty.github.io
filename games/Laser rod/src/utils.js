function ringContainsPoint(r, x, y){
	return Math.sqrt(Math.pow(r.x - x,2) + Math.pow(r.y - y,2)) <= r.radius;
}
function ringContainsMouse(r){
	return ringContainsPoint(r,mouse.x, mouse.y);
}
function drawRing(x,y,rad,color,width){
		ctx.strokeStyle = color || "#777";
		ctx.lineWidth = width || 3;
		ctx.beginPath();      
		ctx.arc(x - camera.x, y - camera.y, rad || 25, 0, Math.PI*2);            
		ctx.stroke();
}
function fillRing(x,y,rad,color){
		ctx.fillStyle = color || "#777";
		ctx.beginPath();      
		ctx.arc(x - camera.x, y - camera.y, rad || 25, 0, Math.PI*2);            
		ctx.fill();
}
function drawLine(x1,y1,x2,y2,color,width){
		ctx.strokeStyle = color || "#777";
		ctx.lineWidth = width || 3;
		ctx.beginPath();      
		ctx.moveTo(x1 - camera.x, y1 - camera.y);
		ctx.lineTo(x2 - camera.x, y2 - camera.y);       
		ctx.stroke();
}
function drawOctorect(x, y, w, h, color, width, proportion){
	var p = (proportion || 0.1) * (w + h) / 2;
		ctx.strokeStyle = color || "#777";
		ctx.lineWidth = width || 3;
		ctx.beginPath();      
		ctx.moveTo(x + p, y);
		ctx.lineTo(x + w - p, y);
		ctx.lineTo(x + w, y + p); 
		ctx.lineTo(x + w, y + h - p); 
		ctx.lineTo(x + w - p, y + h);
		ctx.lineTo(x + p, y + h); 
		ctx.lineTo(x, y + h - p);
		ctx.lineTo(x, y + p);
		ctx.lineTo(x + p, y);
		ctx.stroke();
}
function fillOctorect(x, y, w, h, color, proportion){
	var p = (proportion || 0.1) * (w + h) / 2;
		ctx.fillStyle = color || "#777";
		ctx.beginPath();      
		ctx.moveTo(x + p, y);
		ctx.lineTo(x + w - p, y);
		ctx.lineTo(x + w, y + p); 
		ctx.lineTo(x + w, y + h - p); 
		ctx.lineTo(x + w - p, y + h);
		ctx.lineTo(x + p, y + h); 
		ctx.lineTo(x, y + h - p);
		ctx.lineTo(x, y + p);
		ctx.lineTo(x + p, y);
		ctx.fill();
}
function drawText(x, y, str, color, size, horAlign, verAlign){
	ctx.textAlign = horAlign || "left";
    ctx.textBaseline = verAlign || "alphabetic";
	ctx.font = (size || 20) + "px Lucida Console";
	ctx.fillStyle = color || "#777";
	ctx.fillText(str, x, y);
}
function contrastColor(color){
	return "#fff"
}
function ringIntersecRing(r, c){
	return Math.sqrt(Math.pow(r.x - c.x,2) + Math.pow(r.y - c.y,2)) <= r.radius + c.radius;
}
function getRingsOnPoint(x,y,firstOnly){
	var intersectRings = [];
	for(var i = 0; i < rings.length; i++){
		if(ringContainsPoint(rings[i],x,y)) {
			if(firstOnly){
				return rings[i];
			} else {
				intersectRings.push(rings[i]);
			}
		}
	}
	return intersectRings;
}
function getRingsIntersecRings(r){
	var intersectRings = [];
	for(var i = 0; i < rings.length; i++){
		if(ringIntersecRing(rings[i],r)) intersectRings.push(rings[i]);
	}
	return intersectRings;
}