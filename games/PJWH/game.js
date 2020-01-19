game = {
	start: function(){
		this.map = {width: 5000, height: 5000};
		this.camera = {x: 0, y: 0, width: cnv.width , height: cnv.height, scrollSpd: 50}
		this.characters = [];
		this.characters.push(newChar(20, 35, "player").setPos(40,60));
	},
	step: function(){
		if(isKey("down")){
			this.camera.y += this.camera.scrollSpd;
		}
		if(isKey("up")){
			this.camera.y -= this.camera.scrollSpd;
		}
		if(isKey("left")){
			this.camera.x -= this.camera.scrollSpd;
		}
		if(isKey("right")){
			this.camera.x += this.camera.scrollSpd;
		}
	},
	draw:function(){
		this.drawScrollPads();
		this.drawCharacters();
	},
	drawScrollPads: function(){
		ctx.fillStyle = "#bbbbbb";
		ctx.fillRect(0, cnv.height - 10, cnv.width - 10, 10);
		ctx.fillRect(cnv.width - 10, 0, 10, cnv.height - 10);
		ctx.fillStyle = "#999999";
		ctx.fillRect(0, cnv.height - 10, (cnv.width - 10) * this.camera.width / this.map.width, 10);
		ctx.fillRect(cnv.width - 10, 0, 10, (cnv.height - 10) * this.camera.height / this.map.height);
	},
	drawCharacters: function(){
		for(var i = 0; i < this.characters.length; i++){
			drawCircle(this.characters[i].x, this.characters[i].y, this.characters[i].size, "#dd9999", "#ff0000")
		}
	}
}
game.start();

function newChar(size, dist, side){
	res = {};
	res.setPos = function(x,y){
		this.x = x;
		this.y = y;
		return this;
	}
	res.size = size;
	res.moveDist = dist;
	res.side = side;
	res.x = 0;
	res.y = 0;
	return res;
}

function drawCircle(x, y, rad, inCol, outCol){
	ctx.strokeStyle = outCol;
	ctx.fillStyle = inCol;
	ctx.lineWidth = 2;
		
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, 2 * Math.PI);
	ctx.fill();
	
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, 2 * Math.PI);
	ctx.stroke();
}
