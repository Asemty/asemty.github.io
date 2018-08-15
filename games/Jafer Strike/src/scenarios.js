scenarios = [];
scenarios["lvl1"] ={
	start: function(){
			this.killFirstBoss = false;
			this.phase = 0;
			this.phaseTimer = 0;
	},
	update: function(){
		if(this.phase == 0 && camera.x >=1032){
			camera.x = 1032;
			camera.scroll = "static";
			this.phase = 1;
			this.phaseTimer = 0;
		}
		if(this.phase == 1){
			if(this.phaseTimer < 120){
				this.phaseTimer++;
				
			}else if(this.phaseTimer == 120){
				this.phaseTimer++;
				var boss = setupWalkerTank(1200, -9);
				boss.vs = -20;
				boss.flip(-1);
				enemies.push(boss);
			}
		}
		if(this.phase == 2){
			this.phase == 3;
			camera.scroll = "only_right";
		}
	},
	render: function(){
		if(this.phase == 1){
			if(this.phaseTimer < 120){
				drawDropArrow(1192, 88);
				drawDropArrow(1212, 88);
			}	
		}
	}
}
function drawDropArrow(x, y){
	if(typeof arrowSprite === "undefined"){
		var arrowSprite = {img: images["enemy1"].img, ox: 0, oy: 24, ow: 8, oh: 8, width: 8, height: 8}
	}
	drawSprite(arrowSprite, x - camera.x, y - camera.y);
}