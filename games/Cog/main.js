function start(){
	img = new Image();
	img.src = "images/player.png";
	Input.addKey(27, "esc");
	
	cogH = 20;
	cog = [getCog(350,350,12),getCog(350,350,18),getCog(350,350,24)];
	
}
function step(){
	if(Input.isKey("left"))cog[0].angle -= 0.01;
	if(Input.isKey("right"))cog[0].angle += 0.01;
}
function draw(){
	ctx.fillStyle="#eeeeee";
    ctx.fillRect(0,0,cnv.width,cnv.height);
	for(var i in cog){
		drawCog(cog[i]);
	}
}

function drawCog(c){
	ctx.beginPath();
	for(var i = 0; i < c.n; i++){
		ctx.arc(c.x, c.y, c.ir, Math.PI / c.n * i * 2 + c.angle, Math.PI / c.n * (i * 2 + 1) + c.angle);
		ctx.arc(c.x, c.y, c.or, Math.PI / c.n * (i * 2 + 1) + c.angle, Math.PI / c.n * (i + 1) * 2 + c.angle);
	}
    ctx.arc(c.x, c.y, c.ir, c.angle, Math.PI / c.n + c.angle);

    ctx.stroke();
}
function getCog(x,y,n){
	var r = n * cogH / 4.5;
	return {x: x, y: y, ir: r - 10, or: r + 10, n: n, angle:0};
}