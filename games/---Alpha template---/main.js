function start(){
	img = new Image();
	img.src = "images/player.png";
	Input.addKey(27, "esc");
}
function step(){}
function draw(){
	ctx.fillStyle="#eeeeee";
    ctx.fillRect(0,0,cnv.width,cnv.height);
	ctx.font="20px Georgia";
	ctx.fillStyle="red";
	ctx.fillText("Hello world!",10,25);
	ctx.drawImage(img,0,0,8,8,40,60,80,80);
	
	if(Input.isKey("esc"))ctx.fillStyle = "#222222"; else ctx.fillStyle = "#ff00ff";
    ctx.fillRect(-6 + Input.mouse.x,-6 + Input.mouse.y,12,12);
	}
