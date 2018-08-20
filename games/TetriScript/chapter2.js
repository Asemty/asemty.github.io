class Genetic extends Part{
	constructor(){
		super("Genetic");
	}
	keyPress(evt){
		super.keyPress(evt);
		switch(evt.keyCode) {
			case 38:
				//up();
				this.usedColor={r:false,g:false,b:false};
				break;
			case 40:
				//down();
				this.usedColor.g=!this.usedColor.g
				break;
			case 37:
				//left();
				this.usedColor.r=!this.usedColor.r
				break;
			case 39:
				//right();
				this.usedColor.b=!this.usedColor.b
				break;
		}
	}
	start(){
		this.cells=[];
		var startNumber=50;
		for(var i=0;i<startNumber;i++){
			this.cells.push(new Cell(Math.random()*canvas.width/2+canvas.width/4,Math.random()*canvas.height/2+canvas.height/4));
		}
		this.lastNumber=startNumber;
		this.usedColor={r:false,g:false,b:false};
	}
	update(){
		contex.fillStyle="#111111";
		contex.fillRect(0,0,canvas.width,canvas.height);
		var number=0;
		var tempCells=[];
		var averageLiveTime=0;
		for(var i=0;i<this.cells.length;i++){
			if(this.cells[i].isLive){
				contex.fillStyle="#"+Math.floor(this.cells[i].colorR).toString(16)+Math.floor(this.cells[i].colorG).toString(16)+Math.floor(this.cells[i].colorB).toString(16);
				var size = 2 + 8 * (this.cells[i].lifeTime/this.cells[i].lifeTimeMax);
				contex.fillRect(this.cells[i].x-size/2,this.cells[i].y-size/2,size,size);
				//contex.fillRect(this.cells[i].x-this.cells[i].area/2,this.cells[i].y-size/2,this.cells[i].area,size);
				this.cells[i].lifeTime+=Math.max(1,this.lastNumber/50);
				this.cells[i].dirTimer++;
				this.cells[i].childrenTimer++;
				averageLiveTime+=this.cells[i].lifeTimeMax;
				if((this.cells[i].lifeTime>this.cells[i].lifeTimeMax/2 && Math.random()<0.01) || this.cells[i].lifeTime>this.cells[i].lifeTimeMax || Cell.extinction(this.usedColor,this.cells[i])){
					this.cells[i].isLive=false;
					continue;
				}else{
					tempCells.push(this.cells[i]);
				}
				if(this.cells[i].dirTimer>this.cells[i].dirTimerMax){
					this.cells[i].dirTimer=0;
					this.cells[i].dir = Math.random()*Math.PI*2;
				}
				if(this.cells[i].childrenTimer>this.cells[i].childrenTimerMax){
					
					for(var j=0;j<this.cells.length;j++){
						if(Math.sqrt(Math.pow(this.cells[i].x-this.cells[j].x,2) + Math.pow(this.cells[i].y-this.cells[j].y,2))<Math.min(this.cells[i].area,this.cells[j].area)){
							this.cells[i].childrenTimer=0;
							this.cells[j].childrenTimer=0;
							if(this.cells.length<7000)Cell.hybridization(this.cells,this.cells[i],this.cells[j]);
							break;
						}
					}
				}
				this.cells[i].x+=Math.sin(this.cells[i].dir)*this.cells[i].speed;
				this.cells[i].y+=Math.cos(this.cells[i].dir)*this.cells[i].speed;
				if(this.cells[i].x>canvas.width)this.cells[i].x-=canvas.width;
				if(this.cells[i].x<0)this.cells[i].x+=canvas.width;
				if(this.cells[i].y>canvas.height)this.cells[i].y-=canvas.height;
				if(this.cells[i].y<0)this.cells[i].y+=canvas.height;
			}
		}
		
		contex.fillStyle="#fff";
		contex.font = "bold 15px arial,serif";
		contex.fillText("Average Live Time: "+averageLiveTime/this.cells.length,0,45);
		this.cells=tempCells;
 
		contex.fillText("Number: "+this.cells.length,0,15);
		contex.fillText("R: "+this.usedColor.r+";  G: "+this.usedColor.g+";  B: "+this.usedColor.b,0,30);
		this.lastNumber=this.cells.length;
	}
}

class Cell{
	constructor(xx,yy){
		this.dirTimer = 0;
		this.childrenTimer = 0;
		this.dir = Math.random()*Math.PI*2;
		this.lifeTime = 0;
		this.x=xx;
		this.y=yy;
		this.isLive=true;
		
		this.lifeTimeMax = 500;
		this.area = 50;
		this.speed = 3;
		this.dirTimerMax = 4;
		this.childrenTimerMax = 30;
		this.childrenNumberMin = 1;
		this.childrenNumberDispersion = 3;
		this.colorR = Math.random()*16;
		this.colorG = Math.random()*16;
		this.colorB = Math.random()*16;
	}
	
	static hybridization(cells,c1,c2){
		
		var numberOfChildren=Math.round((c1.childrenNumberMin+c2.childrenNumberMin)/2+Math.random()*(c1.childrenNumberDispersion+c2.childrenNumberDispersion)/2);
		for(var i=0;i<numberOfChildren;i++){
			var ch=new Cell();
			ch.lifeTimeMax = (c1.lifeTimeMax+c2.lifeTimeMax)/2*(0.8+Math.random()*0.4);
			ch.area = (c1.area+c2.area)/2*(0.8+Math.random()*0.4);
			ch.speed = (c1.speed+c2.speed)/2*(0.8+Math.random()*0.4);;
			ch.dirTimerMax = (c1.dirTimerMax+c2.dirTimerMax)/2*(0.8+Math.random()*0.4);;
			ch.childrenTimerMax = (c1.childrenTimerMax+c2.childrenTimerMax)/2*(0.8+Math.random()*0.4);
			ch.childrenNumberMin = (c1.childrenNumberMin+c2.childrenNumberMin)/2*(0.8+Math.random()*0.4);
			ch.childrenNumberDispersion = (c1.childrenNumberDispersion+c2.childrenNumberDispersion)/2*(0.8+Math.random()*0.4);
			ch.colorR = Math.min(15,Math.max(0,(c1.colorR+c2.colorR)/2*(0.8+Math.random()*0.4)));
			ch.colorG = Math.min(15,Math.max(0,(c1.colorG+c2.colorG)/2*(0.8+Math.random()*0.4)));
			ch.colorB = Math.min(15,Math.max(0,(c1.colorB+c2.colorB)/2*(0.8+Math.random()*0.4)));
			ch.x = (c1.x+c2.x)/2-ch.area/2+Math.random()*ch.area;
			ch.y = (c1.y+c2.y)/2-ch.area/2+Math.random()*ch.area;
			cells.push(ch);
		}
	}

	static extinction(uc,c1){
		return ((uc.r && Math.random()*16>c1.colorR) || (uc.g && Math.random()*16>c1.colorG) || (uc.b && Math.random()*16>c1.colorB)) && Math.random()>0.8;
	}
}

class Minefield extends Part{
	constructor(){
		super("Minefield");
	}
	start(){
		var enteredDiff = prompt("Сложность: (0-5)");
		while(true){
			if(enteredDiff>=0 && enteredDiff<=5){
				this.dif = (13 + 2 * enteredDiff) / 100;
				break;
			}else{
				enteredDiff = prompt("Неверный ввод! Попробуйте ещё раз.\nСложность: (0-5)");
			}
		}
		this.cells = [];
		this.nextCells = [];
		this.w = 15 + enteredDiff * 2;
		this.size = canvas.width / this.w;
		this.h = Math.floor(canvas.height / this.size) - 1;
		this.offset = (canvas.height - this.size * (this.h + 1)) / 2;
		this.cursor = {x: 0, y: 0};
		this.data = {mine: 0, flaged: 0, opened: 0, cellsNumb: this.w * this.h};
		this.gameIsOver = false;
		
		for(var i = 0; i < this.w; i++){
			this.cells[i] = [];
			for(var j = 0; j < this.h; j++){
				var push = Math.random() <= this.dif;
				if(push) this.data.mine++;
				this.cells[i][j] = {flaged: false, opened: false, mine: push ? -1: 0};
			}
		}
		for(var i = 0; i < this.w; i++){
			for(var j = 0; j < this.h; j++){
				if(this.cells[i][j].mine == 0){
					var l = i > 0, r = i < this.w - 1, u = j > 0, d = j < this.h - 1;
					this.cells[i][j].mine = 
					((l && this.cells[i - 1][j].mine == -1) ? 1 : 0) +
					((r && this.cells[i + 1][j].mine == -1) ? 1 : 0) +
					((u && this.cells[i][j - 1].mine == -1) ? 1 : 0) +
					((d && this.cells[i][j + 1].mine == -1) ? 1 : 0) +
					((l && u && this.cells[i - 1][j - 1].mine == -1) ? 1 : 0) +
					((l && d && this.cells[i - 1][j + 1].mine == -1) ? 1 : 0) +
					((r && u && this.cells[i + 1][j - 1].mine == -1) ? 1 : 0) +
					((r && d && this.cells[i + 1][j + 1].mine == -1) ? 1 : 0);
				}
			}
		}
	}
	update(){
		contex.fillStyle="#111111";
		contex.fillRect(0,0,canvas.width,canvas.height);
		contex.font = "bold " + Math.floor(this.size / 2) + "px arial,serif";
		for(var i = 0; i < this.w; i++){
			for(var j = 0; j < this.h; j++){
				if(!this.cells[i][j].opened && !(this.gameIsOver && !(this.cells[i][j].flaged && this.cells[i][j].mine == -1))){
					contex.fillStyle = "darkGray";
					contex.fillRect(i * this.size, j * this.size,this.size,this.size);
					contex.fillStyle = "#7dd";
					contex.fillRect(i * this.size + 1, j * this.size + 1 ,this.size - 2,this.size - 2);
					if(this.cells[i][j].flaged){
						contex.strokeStyle = "black";
						this.drawFlag(i * this.size, j * this.size)
					}
				}else{
					contex.fillStyle = "darkGray";
					contex.fillRect(i * this.size, j * this.size,this.size,this.size);
					contex.fillStyle = "#dff";
					contex.fillRect(i * this.size + 1, j * this.size + 1 ,this.size - 2,this.size - 2);
					if(this.cells[i][j].mine == -1){
						contex.fillStyle = "red";
						contex.fillRect(i * this.size + this.size / 4, j * this.size  + this.size / 4 , this.size / 2, this.size / 2);
					}else if(this.cells[i][j].mine != 0){
						contex.fillStyle = "#333";
						contex.fillText(this.cells[i][j].mine, (i + 0.4) * this.size, (j + 0.7) * this.size );
					}
				}
				if(this.cursor.x == i && this.cursor.y == j ){
					contex.lineWidth = 5;
					contex.strokeStyle = "crimson";
					contex.strokeRect(i * this.size + 3, j * this.size + 3, this.size - 6, this.size - 6);
				}
				/*for(var c =0; c < this.nextCells.length; c++){
					if(this.nextCells[c][0] == i && this.nextCells[c][1] == j ){
						contex.lineWidth = 5;
						contex.strokeStyle = "green";
						contex.strokeRect(i * this.size + 3, j * this.size + 3, this.size - 6, this.size - 6);
					}
				}*/
			}
		}
		contex.font = "bold " + Math.min(this.size, 21) + "px arial,serif";
		contex.fillStyle = "#ddd";
		contex.fillText("Arrow: move, Space: open, F: flag, R: restart " + (this.data.mine - this.data.flaged) + " bombs left",0, canvas.height - this.offset);
		if(this.nextCells.length != 0){
			var oc = this.nextCells;
			this.nextCells = [];
			for(var i = 0; i < oc.length ; i++){
				this.openCell(oc[i][0],oc[i][1]);
			}
		}
		if(this.gameIsOver == 2) this.gameOver();
		if(this.gameIsOver == 1) this.gameIsOver = 2;
	}
	keyPress(evt){
		super.keyPress(evt);
		switch(evt.keyCode) {
			case 32:
				//space();
				this.openCell(this.cursor.x,this.cursor.y)
				break;
			case 70:
				//f();
				this.placeFlag(this.cursor.x,this.cursor.y);
				break;
			case 82:
				//r();
				this.start();
				break;
			case 38:
				//up();
				this.cursor.y--;
				if(this.cursor.y == -1){
					this.cursor.y = this.h - 1;
				}
				break;
			case 40:
				//down();
				this.cursor.y++;
				if(this.cursor.y == this.h){
					this.cursor.y = 0;
				}
				break;
			case 37:
				//left();
				this.cursor.x--;
				if(this.cursor.x == -1){
					this.cursor.x = this.w - 1;
				}
				break;
			case 39:
				//right();
				this.cursor.x++;
				if(this.cursor.x == this.w){
					this.cursor.x = 0;
				}
				break;
		}
	}
	openCell(x,y){
		if(x > -1 && x < this.w && y > -1 && y < this.h){
			var cell = this.cells[x][y];
			if(!cell.opened){
				if(cell.mine == -1){
					if(this.data.flaged == 0 && this.data.opened == 0){
						this.placeFlag(x, y);
					}else this.gameIsOver = 1;
				}else {
					if(cell.flaged) this.placeFlag(x, y);
					cell.opened = true;
					this.data.opened ++;
					if(cell.mine == 0){
						this.nextCells.push([x - 1,y - 1]);
						this.nextCells.push([x - 1,y]);
						this.nextCells.push([x - 1,y + 1]);
						this.nextCells.push([x,y - 1]);
						this.nextCells.push([x,y + 1]);
						this.nextCells.push([x + 1,y - 1]);
						this.nextCells.push([x + 1,y]);
						this.nextCells.push([x + 1,y + 1]);
					}
					if(this.data.opened == this.data.cellsNumb - this.data.mine){
						alert("Вы выжили! Попробуете ещё раз?");
						this.start();
					}
				}
			}
		}
		
	}
	
	placeFlag(x, y){
		var cell = this.cells[x][y];
		if(!cell.opened){
			cell.flaged = !cell.flaged;
			this.data.flaged += cell.flaged ? 1 : -1;
		}
	}
	drawFlag(x,y){
		contex.lineWidth = this.size / 25;
		var s = this.size;
		contex.beginPath();
		contex.moveTo(x + s * 0.23, y + s * 0.81)
		contex.lineTo(x + s * 0.23, y + s * 0.19)
		contex.lineTo(x + s * 0.5, y + s * 0.19)
		contex.lineTo(x + s * 0.69, y + s * 0.3)
		contex.lineTo(x + s * 0.5, y + s * 0.41)
		contex.lineTo(x + s * 0.23, y + s * 0.41)
		contex.stroke();
	}
	gameOver(){
		alert("Мне жаль, но вы погибли(")
		this.start();
	}
}
