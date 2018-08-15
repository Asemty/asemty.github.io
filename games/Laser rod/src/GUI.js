class GuiWindow{
	constructor(){
		this.width = 600;
		this.height = 400;
		this.x = (canvas.width - this.width) / 2;
		this.y = (canvas.height - this.height) / 2;
		this.units = [];
		this.addUnit(new GuiButton(30,30,40,40).addOnClickEvent(
			function(){
				currentGUI = false;
			}));
	}
	draw(){
		fillOctorect(this.x, this.y, this.width, this.height, "#fed", 0.05);
		drawOctorect(this.x, this.y, this.width, this.height, null, null , 0.05);
		for(var i = 0; i < this.units.length; i++){
			if(this.units[i].draw)this.units[i].draw(this.x, this.y);
		}
	}
	update(){
		for(var i = 0; i < this.units.length; i++){
			if(this.units[i].update)this.units[i].update();
		}
	}
	click(isLeft){
		var x =- this.x + mouse.sx;
		var y =- this.y + mouse.sy;
		for(var i = 0; i < this.units.length; i++){
			var unit = this.units[i];
			if(unit.click && unit.x < x && unit.x + unit.width > x && unit.y < y && unit.y + unit.height > y){
				unit.click(isLeft);
			}
		}
	}
	addUnit(unit){
		this.units.push(unit);
		return this;
	}
	
}
class GuiButton {
	constructor(x, y, w, h){
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}
	draw(xx, yy){
		fillOctorect(this.x + xx, this.y + yy, this.width, this.height, "#edc");
		drawOctorect(this.x + xx, this.y + yy, this.width, this.height);
	}
	update(){
		
	}
	click(){
		
	}
	addOnClickEvent(fun){
		this.click = fun;
		return this;
	}
}
//class GuiBuildWindow