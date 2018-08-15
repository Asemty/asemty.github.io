class BuildProvider{
	constructor(){
		this.builds = [];
		this.buildRegister("Лазерная башня", LaserTower, "Устройсто передачи лазерной энергии", {"laser": 5,"matter": 1}, 8, 80);
	}
	buildRegister(name, cls, rad, tooltip, cost, actRad){
		this.builds[name] = {cls: cls, tooltip: tooltip, cost: cost, rad: rad, actRad: actRad};
	}
	getBuildsNames(){
		return Object.keys(this.builds);
	}
	getBuildByName(name){
		return this.builds[name];
	}
	getBuildByNumber(n){
		return this.builds[Object.keys(this.builds)[n]];
	}
}
class LaserTower extends ResourceProvider{
		constructor(x,y){
			super(x, y, "#333", 8);
			this.storage.addCell(ResourceType.laser,null,null,4);
			this.activeRadius = 80;
		}
		update(){
			super.update();
			if(ringIntersecRing(this.getActiveRing(),player)){
				this.storage.addToCell("laser",6);
			}
		}
		draw(){
			var cell = this.storage.getCell("laser");
			fillRing(this.x, this.y, this.radius * cell.value / cell.maxValue + 0.01, ResourceType.laser.color);
			super.draw()
			for(var i = 0; i < this.aims.length; i++){
				var aim = this.aims[i];
				if(this.onScreen || aim.onScreen){
					drawLine(this.x, this.y, aim.x, aim.y, ResourceType.laser.color,this.outFlow + 1.2);
				}
			}
		}
		dead(){
			super.dead();
			for(var i = 0; i < this.sources.length; i++){
				var source = this.sources[i];
				source.aims.splice(source.aims.indexOf(this));
			}
		}
}