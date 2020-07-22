function start(){
	
	world = Phis.createWorld();
	for(var i = 0; i < 20000; i++){
		world.entities.push({x:0,y:0,w:10,h:10,layers:0,dead:false});
	}
	var start = new Date().getTime();
	Phis.step(world);
	var end = new Date().getTime();
	alert(end - start + " ms")
	/*img = new Image();
	img.src = "images/player.png";*/
	/*world = newWorld();
	
	for(var i = 0; i < 200; i++){
		world.children.push(newBox(Math.random()*500+30,Math.random()*500+30,Math.random()*150+10,Math.random()*150+10));
	}
	world.children.push(newBox(0,0,25,25));
	Input.addKey(27, "esc");
	spd = 5;*/
}
function step(){
	/*if(Input.isKey("up")){world.children[200].spd.y -= spd;}
	if(Input.isKey("down")){world.children[200].spd.y += spd;}
	if(Input.isKey("left")){world.children[200].spd.x -= spd;}
	if(Input.isKey("right")){world.children[200].spd.x += spd;}
	world.update();*/
}
function draw(){
	/*ctx.fillStyle="#000000";
    ctx.fillRect(0,0,cnv.width,cnv.height);
	debugDraw(ctx, world,0,0);
	ctx.font="20px Georgia";
	ctx.fillStyle="red";
	ctx.fillText(Math.round(world.children[0].pos.x) + ".." + Math.round(world.children[0].pos.y),10,25);
	/*ctx.drawImage(img,0,0,8,8,40,60,80,80);
	
	if(Input.isKey("esc"))ctx.fillStyle = "#222222"; else ctx.fillStyle = "#ff00ff";
    ctx.fillRect(-6 + Input.mouse.x,-6 + Input.mouse.y,12,12);*/
}
	
