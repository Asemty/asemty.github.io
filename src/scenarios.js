scenarios = [];
scenarios["lvl1"] ={
	start: function(){
			this.killFirstBoss = false;
			this.phase = 0;
	},
	update: function(){
		if(this.phase == 0 && camera.x >=1032){
			camera.x = 1032;
			camera.scroll = "static";
			this.phase == 1;
		}
		if(this.phase == 2){
			this.phase == 3;
			camera.scroll = "only_right";
		}
	}
}