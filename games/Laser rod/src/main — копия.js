function start(){
	mouse = {x: 0, y: 0, sx: 0, sy: 0};
	backColor = "#ffe";
	camera = {};
	camera.x = 0;
	camera.y = 0;
	rings = [];
	player = new Player(0,0);
	rings.push(player);
	up = down = left = right = false;
	currentGUI = false;
}
function step(){
	draw();
	update();
}
function draw(){
	ctx.fillStyle = backColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < rings.length; i++){
		var r = rings[i];
		r.onScreen = r.x - r.radius < camera.x + canvas.width 
			&& r.x + r.radius > camera.x
			&& r.y - r.radius < camera.y + canvas.height 
			&& r.y + r.radius > camera.y;
		if(r.onScreen){
				drawRing(r.x,r.y,r.radius,ringContainsMouse(r) ? "#f44" : r.color,r.width || 3);
				if(r.draw) r.draw(camera.x, camera.y);
			}
	}
	player.drawGui()
	if(currentGUI) currentGUI.draw();
}
function update(){
	var newRings = [];
	for(var i = 0; i < rings.length; i++){
		var r = rings[i];
		if(r.update) r.update();
		if(r.isLive) newRings.push(r);
	}
	rings = newRings;
	if(currentGUI) currentGUI.update();
}
function mousemove(evt){
	var rect = canvas.getBoundingClientRect();
	mouse.sx = evt.clientX - rect.left;
	mouse.sy = evt.clientY - rect.top;
	mouse.x = mouse.sx + camera.x;
	mouse.y = mouse.sy + camera.y;
	
}
function mouseclick(evt, isLeft){
	evt = evt || window.event
		if (evt.preventDefault) {
			evt.preventDefault()
		} else {
			evt.returnValue = false
		}
	if(currentGUI && mouse.sx > currentGUI.x && mouse.sx < currentGUI.x + currentGUI.width && mouse.sy > currentGUI.y && mouse.sy < currentGUI.y + currentGUI.height){
		currentGUI.click(isLeft);
	}else{
		player.click(mouse.x, mouse.y, isLeft);
	}
}
function keyPress(evt,isPress){
	if(evt.keyCode==38 || evt.keyCode==87){//up & W
		up = isPress;
	}else if(evt.keyCode==40 || evt.keyCode==83){//down & S
		down = isPress;
	}else if(evt.keyCode==37 || evt.keyCode==65){//left & A
		left = isPress;
	}else if(evt.keyCode==39 || evt.keyCode==68){//right & D
		right = isPress;
	}else if(evt.keyCode==69 && isPress){
		player.inventoryButton();
	}
	if(isPress && evt.keyCode >= 48 && evt.keyCode <= 57){
		var newKey = evt.keyCode - 48
		player.currenToolBar = player.currenToolBar == newKey ? 0 : newKey;
	}
}
class Ring{
	constructor(x,y,color,rad){
		this.isLive = true;
		this.x = x;
		this.y = y;
		this.color = color || "#777";
		this.radius = rad || 25;
		this.solid = true;
	}
	dead(){
		this.isLive = false;
	}
}
class Player extends Ring{
	constructor(x,y,color,rad){
		super(x, y ,"#ddf" ,25);
		this.spd = 4;
		
		this.storage = new Storage();
		this.storage.addCell(ResourceType.laser,250,10,10);
		this.storage.addCell(ResourceType.matter,250,10,10);
		this.storage.addCell(ResourceType.electricity,250,10,10);
		this.storage.addCell(ResourceType.data,250,10,10);
		this.storage.addCell(ResourceType.xchaos,250,10,10);
		for(var name in this.storage.types){
			this.storage.addToCell(name, Math.floor(Math.random()*250), true);
		}
		
		this.currenToolBar = 0;
		this.toolBar = [];
		this.toolBar[0] = {
			drawIcon: function(x, y ,color, size){
				ctx.strokeStyle = color || "#777";
				ctx.lineWidth = 3;
				ctx.beginPath();      
				ctx.moveTo(x + size * 0, y + size * 0.85);
				ctx.lineTo(x + size * 0.15, y + size * 0.7);
				ctx.lineTo(x + size * 0.15, y + size * 0.3);
				ctx.lineTo(x + size * 0.6, y + size * 0.2);
				ctx.lineTo(x + size * 0.35, y + size * 0.45);
				ctx.lineTo(x + size * 0.35, y + size * 0.55);
				ctx.lineTo(x + size * 0.45, y + size * 0.65);
				ctx.lineTo(x + size * 0.55, y + size * 0.65);
				ctx.lineTo(x + size * 0.8, y + size * 0.4);
				ctx.lineTo(x + size * 0.7, y + size * 0.85);
				ctx.lineTo(x + size * 0.3, y + size * 0.85);
				ctx.lineTo(x + size * 0.15, y + size * 1);
				ctx.stroke();
			}, 
			click: function(x, y, isLeft){
				
			},
			tooltip: "Ключ\n\nЛКМ: Открыть интерфейс объекта."};
		this.toolBar[1] = {
			drawIcon: function(x, y ,color, size){
				ctx.strokeStyle = color || "#777";
				ctx.lineWidth = 3;
				ctx.beginPath();      
				ctx.moveTo(x + size * 0, y + size * 0.7);
				ctx.lineTo(x + size * 0.65, y + size * 0.25);
				ctx.lineTo(x + size * 0.75, y + size * 0.35);
				ctx.lineTo(x + size * 0.3, y + size * 1);
				
				ctx.moveTo(x + size * 0.2, y + size * 0.5);
				ctx.lineTo(x + size * 0.25, y + size * 0.45);
				ctx.lineTo(x + size * 0.55, y + size * 0.75);
				ctx.lineTo(x + size * 0.5, y + size * 0.8);
				ctx.lineTo(x + size * 0.2, y + size * 0.5);
				
				ctx.moveTo(x + size * 0.4, y + size * 0.4);
				ctx.lineTo(x + size * 0.45, y + size * 0.35);
				ctx.lineTo(x + size * 0.65, y + size * 0.55);
				ctx.lineTo(x + size * 0.6, y + size * 0.6);
				ctx.lineTo(x + size * 0.4, y + size * 0.4);
				
				ctx.moveTo(x + size * 0.68, y + size * 0.28);
				ctx.lineTo(x + size * 0.90, y + size * 0.06);
				ctx.lineTo(x + size * 0.94, y + size * 0.1);
				ctx.lineTo(x + size * 0.72, y + size * 0.32);
				ctx.stroke();
			},
			draw(){
				
			},
			click: function(x, y, isLeft){
				
			},
			tooltip: "Манипулятор\n\nЛКМ: Поместить энергию в объект.\nПКМ: Выкачать энергию из объекта.\n Колесо: Сменить энергию."}
	}
	update(){
		if(up){
			this.y-=this.spd;
		}
		if(down){
			this.y+=this.spd;
		}
		if(left){
			this.x-=this.spd;
		}
		if(right){
			this.x+=this.spd;
		}
		
		camera.x = this.x - canvas.width / 2;
		camera.y = this.y - canvas.height / 2;
		mouse.x = mouse.sx + camera.x;
		mouse.y = mouse.sy + camera.y;
		
	}
	draw(){
		
	}
	drawGui(){
		var size = 45, xStart = (canvas.width - size * 16) / 2;
		for(var i = 0; i < 10; i++){
			var x = xStart + size * 1.5 * (i + (i >= 5 ? 1 : 0)), y = canvas.height * 0.91, color = player.currenToolBar == (i + 1) % 10 ? "#f44" : null;
			fillOctorect(x, y, size, size, "#edc");
			drawOctorect(x, y, size, size, player.currenToolBar == (i + 1) % 10 ? "#f44" : null);
			if((i + 1) % 10 == 0) {
				drawOctorect(x - 5, y - 5, size + 10, size + 10, color);
			}
			if(this.toolBar[(i + 1) % 10]){
				this.toolBar[(i + 1) % 10].drawIcon(x,y,color,size);
				if((i + 1) % 10 == player.currenToolBar && this.toolBar[(i + 1) % 10].draw){
					this.toolBar[(i + 1) % 10].draw();
				}
			}
			drawText(x + 31, y + size - 3, (i + 1) % 10, color);
		}
		var i = 0;
		for(var name in this.storage.types){
			var res = this.storage.types[name];
			ctx.fillStyle = "#222";
			ctx.fillRect(canvas.width * 0.82, canvas.height - canvas.height * 0.03 * (i + 1.7), canvas.width * 0.16, canvas.height * 0.025);
			ctx.fillStyle = res.type.color;
			ctx.fillRect(canvas.width * 0.822, canvas.height * 1.002 - canvas.height * 0.03 * (i + 1.7), canvas.width * 0.156, canvas.height * 0.021);
			drawText(
				canvas.width * 0.9, 
				canvas.height * 1.0125 - canvas.height * 0.03 * (i + 1.7),
				res.type.tooltip + ": " + res.value + "/" +res.maxValue,
				contrastColor(res.type.color),
				canvas.height * 0.02,
				"center",
				"middle");
			i++;
		}
	}
	click(cx,cy){
		var aims = getRingsOnPoint(mouse.x, mouse.y);
		if(aims.length == 0){
			rings.push(new LaserTower(cx,cy));
		}else{
			if(!(aims[0] instanceof Player))aims[0].dead();
		}
	}
	inventoryButton(){
		if(!currentGUI) currentGUI = new GuiWindow();
		else currentGUI = false;
	}
}
class ResourceProvider extends Ring{
	constructor(x, y, color, size){
		super(x, y, color, size);
		this.aims = [];
		this.sources = [];
		this.activeRadius = 80;
		this.storage = new Storage();;
		this.maxIn = 3;
		this.maxOut = 3;
	}
	update(){
		if(!this.init){
			this.init = true;
			var rr = getRingsIntersecRings(this.getActiveRing());
			if(rr.length > 0){
				for(var i = rr.length - 1; i >= 0; i--){
					var aim = rr[i];
					if(aim != this && aim instanceof ResourceProvider && this.storage.haveOverlappingResources(aim.storage)){
						if(this.aims.length < this.maxOut && aim.sources.length < aim.maxIn){
							this.aims.push(aim);
							aim.sources.push(this);
						}
					}
				}
			}
		}
		this.outFlow = 0;
		for(var i = 0; i < this.aims.length; i++){
			var aim = this.aims[i];
			this.outFlow +=this.storage.transferTo(aim.storage);
		}
	}
	draw(){
		if(ringContainsMouse(this)){
			drawRing(this.x, this.y, this.activeRadius, "#7d7", 1);
		}
	}
	getActiveRing(){
		return this.activeRadius && {x: this.x, y: this.y, radius: this.activeRadius}
	}
}
class LaserTower extends ResourceProvider{
		constructor(x,y){
			super(x, y, "#333", 8);
			this.storage.addCell(ResourceType.laser,null,null,4);
		}
		update(){
			super.update();
			if(ringIntersecRing(this.getActiveRing(),player)){
				this.storage.addToCell("laser",6);
			}
		}
		draw(){
			var cell = this.storage.getCell("laser");
			fillRing(this.x, this.y, this.radius * cell.value / cell.maxValue + 0.01, ResourceType.xchaos.color);
			super.draw()
			for(var i = 0; i < this.aims.length; i++){
				var aim = this.aims[i];
				if(this.onScreen || aim.onScreen){
					drawLine(this.x, this.y, aim.x, aim.y, ResourceType.xchaos.color,this.outFlow + 1.2);
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
ResourceType = {
	laser: {name: "laser", tooltip: "Лазер", color: "#f44"},
	matter: {name: "matter", tooltip: "Метерия", color: "#4d4"},
	electricity: {name: "electricity", tooltip: "Электричество", color: "#fd4"},
	data: {name: "data", tooltip: "Информация", color: "#4af"},
	xchaos: {name: "xchaos", tooltip: "ХОС", color: "#505"}
}
class Storage{
	constructor(){
		this.types = [];
	}
	addCell(type, max, i, o){
		this.types[type.name] = {type: type, value: 0, maxValue: max || 100, maxIn: i || 10, maxOut: o || 10};
		return this;
	}
	transferTo(stor){
		var transfer = 0;
		for(var name in this.types){
			if(stor.types[name]){
				var ic = this.types[name], oc = stor.types[name];
				var input = Math.min(oc.maxIn, oc.maxValue - oc.value);
				var output = Math.min(ic.maxOut, ic.value);
				var transferValue = Math.min(input, output);
				ic.value -= transferValue;
				oc.value += transferValue;
				transfer = Math.max(transfer, transferValue);
			}
		}
		return transfer;
	}
	getCell(res){
		var name = typeof res == "string" ? res : res.name
		return this.types[name] || {name: name, value: 0, maxValue:0, maxIn: 0, maxOut: 0};
	}
	addToCell(name, value, ignoreInput){
		var cell = this.getCell(name);
		cell.value = Math.min(cell.maxValue, cell.value + (ignoreInput ? value : Math.min(value,cell.maxIn)));
	}
	removeFromCell(name,value,ignoreOutput){
		var cell = this.getCell(name);
		if(cell.value >= value){
			cell.value -= ignoreOutput ? value : Math.min(value, cell.maxOut);
			return true;
		}else{
			return false;
		}
	}
	haveOverlappingResources(storage){
		for(var name in this.types){
			if(storage.types[name]){
				return true;
			}
		}
		return false;
	}
}
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
class BuildProvider{
	constructor(){
		builds = [];
	}
	buildRegister(name, cls, )
}