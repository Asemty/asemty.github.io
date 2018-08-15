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
		player.use();
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
			tooltip: "Ключ\n\nЛКМ: Открыть интерфейс объекта."
			};
		this.toolBar[1] = {
			drawIcon(x, y ,color, size){
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
			drawGui(){
				ctx.fillStyle = "#777";
				var xx = canvas.width * 0.805, yy = canvas.height * 1.002 - canvas.height * 0.03 * (this.currentEnergy + 1.7), ss = canvas.height * 0.021;
				ctx.beginPath();
				ctx.moveTo(xx, yy);
				ctx.lineTo(xx + ss, yy + ss / 2);
				ctx.lineTo(xx, yy + ss);
				ctx.lineTo(xx, yy);
				ctx.fill();
			},
			click: function(x, y, isLeft, plr){
				var ring = getRingsOnPoint(x, y, true), enrg = plr.storage.getCell(Object.keys(plr.storage.types)[this.currentEnergy]);
				if(ring && ring != this && ring instanceof ResourceProvider){
					if(isLeft){
						plr.storage.transferTo(ring.storage, enrg)
					}else{
						ring.storage.transferTo(plr.storage, enrg)
					}
					
				}
			},
			tooltip: "Манипулятор\n\nЛКМ: Поместить энергию в объект.\nПКМ: Выкачать энергию из объекта.\n Использовать: Сменить энергию.",
			currentEnergy: 0,
			use(plr){
				this.currentEnergy++;
				if(this.currentEnergy == Object.keys(plr.storage.types).length){
					this.currentEnergy = 0;
				}
			}
		}
		this.toolBar[2] = {
			drawIcon: function(x, y ,color, size){
				ctx.strokeStyle = color || "#777";
				ctx.lineWidth = 3;
				ctx.beginPath();      
				ctx.moveTo(x + size * 0, y + size * 0.85);
				ctx.lineTo(x + size * 0.3, y + size * 0.55);
				ctx.lineTo(x + size * 0.1, y + size * 0.35);
				ctx.lineTo(x + size * 0.35, y + size * 0.1);
				ctx.lineTo(x + size * 0.9, y + size * 0.65);
				
				ctx.lineTo(x + size * 0.65, y + size * 0.9);
				ctx.lineTo(x + size * 0.3, y + size * 0.55);
				ctx.moveTo(x + size * 0.45, y + size * 0.7);
				ctx.lineTo(x + size * 0.15, y + size * 1);
				
				ctx.moveTo(x + size * 0.55, y + size * 0.3);
				ctx.lineTo(x + size * 0.6, y + size * 0.25);
				ctx.lineTo(x + size * 0.75, y + size * 0.4);
				ctx.lineTo(x + size * 0.7, y + size * 0.45);
				ctx.stroke();
			},
			draw(){
				
			},
			click: function(cx, cy, isLeft){
				var aims = getRingsOnPoint(cx, cy);
				if(aims.length == 0){
					rings.push(new GhostRing(cx, cy, {rad: 40, actRad: 140,cost: {"laser": 10, "data": 50, "matter": 4, "xchaos": 98, "electricity": 12}}));
				}else{
					if(!(aims[0] instanceof Player))aims[0].dead();
				}
			},
			tooltip: "Молот\n\nЛКМ: Начать/закончить стройку.\nПКМ: Открыть список доступных зданий.",
			menu: new GuiWindow()
		}
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
		
		var tool = this.toolBar[this.currenToolBar];
		if(tool && tool.update){
			tool.update(this);
		}
	}
	draw(){
		var tool = this.toolBar[this.currenToolBar];
		if(tool && tool.draw){
			tool.draw(this);
		}
	}
	drawGui(){
		var size = 45, xStart = (canvas.width - size * 16) / 2;
		for(var i = 0; i < 10; i++){
			var x = xStart + size * 1.5 * (i + (i >= 5 ? 1 : 0)), y = canvas.height * 0.91, color = this.currenToolBar == (i + 1) % 10 ? "#f44" : null;
			fillOctorect(x, y, size, size, "#edc");
			drawOctorect(x, y, size, size, this.currenToolBar == (i + 1) % 10 ? "#f44" : null);
			if((i + 1) % 10 == 0) {
				drawOctorect(x - 5, y - 5, size + 10, size + 10, color);
			}
			if(this.toolBar[(i + 1) % 10]){
				this.toolBar[(i + 1) % 10].drawIcon(x,y,color,size);
				if((i + 1) % 10 == this.currenToolBar && this.toolBar[(i + 1) % 10].drawGui){
					this.toolBar[(i + 1) % 10].drawGui(this);
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
			ctx.fillRect(canvas.width * 0.822, canvas.height * 1.002 - canvas.height * 0.03 * (i + 1.7), canvas.width * 0.156 * res.value / res.maxValue, canvas.height * 0.021);
			drawText(
				canvas.width * 0.9, 
				canvas.height * 1.0125 - canvas.height * 0.03 * (i + 1.7),
				res.type.tooltip + ": " + Math.floor(res.value) + "/" + Math.floor(res.maxValue),
				contrastColor(res.type.color),
				canvas.height * 0.02,
				"center",
				"middle");
			i++;
		}
	}
	click(cx,cy,isLeft){
		var tool = this.toolBar[this.currenToolBar];
		if(tool && tool.click){
			tool.click(cx, cy, isLeft, this);
		}
	}
	use(){
		var tool = this.toolBar[this.currenToolBar];
		if(tool && tool.use){
			tool.use(this);
		}
	}
}
class ResourceProvider extends Ring{
	constructor(x, y, color, size){
		super(x, y, color, size);
		this.aims = [];
		this.sources = [];
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
		return this.activeRadius && {x: this.x, y: this.y, radius: this.activeRadius || 0}
	}
}
class GhostRing extends ResourceProvider{
	constructor(x, y, prot){
		super(x, y, "#bdd", prot.rad || 20);
		this.prot = prot;
		this.storage = new Storage();
		for(var n in prot.cost){
			this.storage.addCell(ResourceType[n],prot.cost[n]);
		}
	}
	draw(){
		var rcm = ringContainsMouse(this);
		if(rcm){
			var yStart = this.y + 1 - 4 * Object.keys(this.storage.types).length, xStart = this.x - this.radius * 2 / 3, i = 0;
			for(var n in this.storage.types){
				var cell = this.storage.types[n];
				var percent = cell.value / cell.maxValue;
				ctx.fillStyle = "#444";
				ctx.fillRect(xStart - camera.x, yStart - camera.y + i * 8, this.radius * 4 / 3, 6);
				ctx.fillStyle = cell.type.color;
				ctx.fillRect(xStart - camera.x, yStart - camera.y + i * 8, this.radius * 4 / 3 * percent, 6);
				i++;
			}
		}
		if(this.prot.actRad){
			drawRing(this.x, this.y, this.prot.actRad, rcm ? "#bdd" : "#fed", 1);
		}
	}
	update(){
		
	}
}
ResourceType = {
	laser: {name: "laser", tooltip: "Лазер", color: "#f44"},
	matter: {name: "matter", tooltip: "Метерия", color: "#4d4"},
	electricity: {name: "electricity", tooltip: "Электричество", color: "#fd4"},
	data: {name: "data", tooltip: "Информация", color: "#4af"},
	xchaos: {name: "xchaos", tooltip: "ХОС", color: "#d7d"}
}
class Storage{
	constructor(){
		this.types = [];
	}
	addCell(type, max, i, o){
		var cell = this.types[type.name] = {type: type, value: 0, maxValue: max || 100};
		cell.maxIn = i || Math.max(cell.maxValue / 25, 1);
		cell.maxOut = o || Math.max(cell.maxValue / 25, 1);
		return this;
	}
	transferTo(stor, enrg){
		var transfer = 0;
		if(!enrg){
			for(var name in this.types){
				if(stor.types[name]){
					var ic = this.types[name], oc = stor.types[name];
					var input = Math.min(oc.maxIn, oc.maxValue - oc.value);
					var output = Math.min(ic.maxOut, ic.value);
					var transferValue = Math.floor(Math.min(input, output));
					ic.value -= transferValue;
					oc.value += transferValue;
					transfer = Math.max(transfer, transferValue);
				}
			}
		}else{
			var name = typeof enrg == "string" ? enrg : enrg.type.name;
			var ic = this.types[name], oc = stor.types[name];
					var input = Math.min(oc.maxIn, oc.maxValue - oc.value);
					var output = Math.min(ic.maxOut, ic.value);
					var transferValue = Math.floor(Math.min(input, output));
					ic.value -= transferValue;
					oc.value += transferValue;
					transfer = transferValue;
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
