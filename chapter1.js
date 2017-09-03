class Snake extends Part{
	constructor(){
		super("Snake");
	}
	keyPress(evt){
		super.keyPress(evt);
		switch(evt.keyCode) {
			case 38:
				if(this.body.length==0 || this.y-1!=this.body[0].y){
					this.sy=-1;
					this.sx=0;
				}
				this.move(0,-1);
				break;
			case 40:
				if(this.body.length==0 || this.y+1!=this.body[0].y){
					this.sy=1;
					this.sx=0;
				}
				this.move(0,1);
				break;
			case 37:
				if(this.body.length==0 || this.x-1!=this.body[0].x){
					this.sy=0;
					this.sx=-1;
				}
				this.move(-1,0);
				break;
			case 39:
				if(this.body.length==0 || this.x+1!=this.body[0].x){
					this.sy=0;
					this.sx=1;
				}
				this.move(1,0);
				break;
		}
	}
	start(){
		this.pause=false;
		this.body=[];
		this.width=15;
		this.height=20;
		this.offset=4;
		this.cellSize=(canvas.width-this.offset)/this.width;
		this.x=Math.floor(Math.random()*this.width);
		this.y=Math.floor(Math.random()*this.height);
		this.sx=1;
		this.sy=0;
		this.counter=0;
		this.maxCounter=10;
		var spd=prompt("Скорость игры (1-10)");
		
		this.food={x: Math.floor(Math.random()*this.width), y: Math.floor(Math.random()*this.height)};
		while(true){
			if(+spd>=1 && +spd<=10){
				this.maxCounter=23-spd*2;
				break;
			}else{
				spd=prompt("Неверный ввод! Попробуйте ещё раз.\nСкорость игры (1-10)");
			}
		}
	}
	update(){
		contex.fillStyle="#111111";
		contex.fillRect(0,0,canvas.width,canvas.height);
		for(var i=0;i<this.width;i++){
			for(var j=0;j<this.height;j++){
				contex.fillStyle="#223322";
				this.drawCell(i,j);
			}
		}
		contex.fillStyle="#44ff44";
		this.drawCell(this.x,this.y);
		for(var i=0;i<this.body.length;i++){
			contex.fillStyle="#225522";
			this.drawCell(this.body[i].x,this.body[i].y)
		}
		contex.fillStyle="#ff4444";
		this.drawCell(this.food.x,this.food.y);
		if(!this.pause){
			this.counter++;
			if(this.counter>=this.maxCounter){
				this.move(this.sx,this.sy);
			}
		}
	}
	drawCell(xx,yy){
		contex.fillRect(this.cellSize*xx+this.offset,this.cellSize*yy+this.offset,this.cellSize-this.offset/2,this.cellSize-this.offset/2);
	}
	move(xx,yy){
		this.counter=0;
		this.body.unshift({x: this.x,y: this.y});
		if(this.food.x!=this.x+xx || this.food.y!=this.y+yy){
			this.body.pop();
		}else{
			this.refreshFood();
		}
		this.x+=xx;
		this.y+=yy;
		if(this.x>=this.width) this.x = 0;
		if(this.y>=this.height) this.y = 0;
		if(this.x<0) this.x = this.width-1;
		if(this.y<0) this.y = this.height-1;
		for(var i=0;i<this.body.length;i++){
			if(this.x==this.body[i].x && this.y==this.body[i].y){
				var tmp=this.body.length-i;
				for(var j=0;j<tmp;j++){
					this.body.pop();
				}
			}
		}
	}
	refreshFood(){
		var c=this.width*this.height-this.body.length-1;
		if(c==0){
			alert("Поздравляю, вы победили!");
			this.start();
		}else{
			while(true){
				this.food={x: Math.floor(Math.random()*this.width), y: Math.floor(Math.random()*this.height)};
				for(var i=0;i<this.body.length;i++){
					if(this.body[i].x==this.food.x && this.body[i].y==this.food.y){
						break;
					}
				}
				if(i==this.body.length){
					if(this.food.x!=this.x || this.food.y!=this.y)return;
				}
			}
		}
	}	
}

class Template extends Part{
	constructor(){
		super("Template");
	}
	keyPress(evt){
		super.keyPress(evt);
		switch(evt.keyCode) {
			case 38:
				up();
				break;
			case 40:
				down();
				break;
			case 37:
				left();
				break;
			case 39:
				right();
				break;
		}
	}
	start(){
	}
	update(){
		contex.fillStyle="#111111";
		contex.fillRect(0,0,canvas.width,canvas.height);
	}
}

class LightCycle extends Part{
	constructor(){
		super("LightCycle");
		this.cycleSize=1.5;
	}
	keyPress(evt){
		super.keyPress(evt);
		switch(evt.keyCode) {
			case 38:
				this.player.dir=0;
				break;
			case 40:
				this.player.dir=1;
				break;
			case 37:
				this.player.dir=2;
				break;
			case 39:
				this.player.dir=3;
				break;
		}
	}
	start(){
		this.counter=-100;
		this.maxCounter=2;
		this.width=120;
		this.height=160;
		this.cellSize=canvas.width/this.width;
		this.map=[];
		for(var i=0;i<this.width;i++){
			this.map[i]=[];
			for(var j=0;j<this.height;j++){
				this.map[i][j]=0;
			}
		}
		this.player={	x: Math.floor(Math.random()*this.width/8*6+this.width/8),
						y: Math.floor(Math.random()*this.height/8*6+this.height/8),
						color: 7,
						dir: Math.floor(Math.random()*4)};
		var enemyNumber=prompt("Количество противников (0-9)");
		while(true){
			if(+enemyNumber>=0 && +enemyNumber<=9){
				break;
			}else{
				enemyNumber=prompt("Неверный ввод! Попробуйте ещё раз.\nКоличество противников (0-9)");
			}
		}
		this.enemy=[];
		for(var i=0;i<enemyNumber;i++){
			this.enemy[i]={	x: Math.floor(Math.random()*this.width/8*6+this.width/8),
							y: Math.floor(Math.random()*this.height/8*6+this.height/8),
							color: Math.floor(Math.random()*6)+1,
							dir: Math.floor(Math.random()*4),
							isLive: true};
		}
	}
	update(){
		contex.fillStyle="#111111";
		contex.fillRect(0,0,canvas.width,canvas.height);
		var lastColor=0;
		for(var i=0;i<this.width;i++){
			for(var j=0;j<this.height;j++){
				if(this.map[i][j]!=0){
					if(lastColor!= this.map[i][j]){
						contex.fillStyle=this.getSimpleColor(this.map[i][j]);
						lastColor=this.map[i][j];
					}
					contex.fillRect(this.cellSize*i,this.cellSize*j,this.cellSize,this.cellSize);
				}
			}
		}
		contex.fillStyle="white";
		contex.beginPath();
		switch(this.player.dir){
			case 0: var angleFromDir = Math.PI/2*2;
				break;
			case 1: var angleFromDir = Math.PI/2*0;
				break;
			case 2: var angleFromDir = Math.PI/2*1;
				break;
			case 3: var angleFromDir = Math.PI/2*3;
				break;
		}
		contex.moveTo(	Math.cos(Math.PI/2+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.player.x+this.cellSize/2,
						Math.sin(Math.PI/2+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.player.y+this.cellSize/2);
		contex.lineTo(	Math.cos(-Math.PI/3+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.player.x+this.cellSize/2,
						Math.sin(-Math.PI/3+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.player.y+this.cellSize/2);
		contex.lineTo(	Math.cos(-Math.PI/3*2+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.player.x+this.cellSize/2,
						Math.sin(-Math.PI/3*2+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.player.y+this.cellSize/2);
		contex.closePath();
		contex.fill();
		if(this.counter<0){
			contex.strokeStyle="white";
			contex.lineWidth=this.cellSize/2;
			contex.strokeRect(this.cellSize*this.player.x+this.counter,this.cellSize*this.player.y+this.counter,this.cellSize-this.counter*2,this.cellSize-this.counter*2);
		}
		for(var i=0;i<this.enemy.length;i++){
			contex.fillStyle=this.getSimpleColor(this.enemy[i].color);
			contex.beginPath();
			switch(this.enemy[i].dir){
				case 0: var angleFromDir = Math.PI/2*2;
					break;
				case 1: var angleFromDir = Math.PI/2*0;
					break;
				case 2: var angleFromDir = Math.PI/2*1;
					break;
				case 3: var angleFromDir = Math.PI/2*3;
					break;
			}
			contex.moveTo(	Math.cos(Math.PI/2+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.enemy[i].x+this.cellSize/2,
							Math.sin(Math.PI/2+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.enemy[i].y+this.cellSize/2);
			contex.lineTo(	Math.cos(-Math.PI/3+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.enemy[i].x+this.cellSize/2,
							Math.sin(-Math.PI/3+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.enemy[i].y+this.cellSize/2);
			contex.lineTo(	Math.cos(-Math.PI/3*2+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.enemy[i].x+this.cellSize/2,
							Math.sin(-Math.PI/3*2+angleFromDir)*this.cellSize*this.cycleSize+this.cellSize*this.enemy[i].y+this.cellSize/2);
			contex.closePath();
			contex.fill();
		}
		this.counter++
		if(this.counter>=this.maxCounter){
			this.counter=0;
			this.map[this.player.x][this.player.y]=this.player.color;
			this.player.x+=this.player.dir==2?-1:this.player.dir==3?1:0;
			this.player.y+=this.player.dir==0?-1:this.player.dir==1?1:0;
			if(this.player.x<0 || this.player.y<0 || this.player.x>=this.width || this.player.y>=this.height || this.map[this.player.x][this.player.y]!=0){
						alert("Вы погибли в светомотокатастрофе...")
						this.start();
					}
			for(var i=0;i<this.enemy.length;i++){
				if(this.enemy[i].isLive){
					this.tryTurn(this.enemy[i]);
					this.map[this.enemy[i].x][this.enemy[i].y]=this.enemy[i].color;
					this.enemy[i].x+=this.enemy[i].dir==2?-1:this.enemy[i].dir==3?1:0;
					this.enemy[i].y+=this.enemy[i].dir==0?-1:this.enemy[i].dir==1?1:0;
					if(this.enemy[i].x<0 || this.enemy[i].y<0 || this.enemy[i].x>=this.width || this.enemy[i].y>=this.height || this.map[this.enemy[i].x][this.enemy[i].y]!=0){
						this.enemy[i].isLive=false;
						for(var j=0;j<this.enemy.length;j++){
							if(this.enemy[j].isLive) break;
							if(j==this.enemy.length-1){
								alert("Поздравляю, вы победили!")
								this.start();
							}
						}
					}
				}
			}
		}
	}
	tryTurn(cycle){
		for(var i=1;i<11;i++){
			var nx = (cycle.dir==2?-1:cycle.dir==3?1:0)*i+cycle.x;
			var ny = (cycle.dir==0?-1:cycle.dir==1?1:0)*i+cycle.y;
			if(nx<0 || ny<0 || nx>=this.width || ny>=this.height || this.map[nx][ny]!=0){
					break;
			}
		}
		if((i<7 && Math.random()<0.3) || i<2){
			cycle.dir = (cycle.dir>1?(cycle.y>this.height/2?0:1):(cycle.x>this.width/2?0:1))+(cycle.dir>1?0:2);
		}
	}
	getSimpleColor(col){
		return "#"+((col & 4)!=0?"ff":"00")+((col & 2)!=0?"ff":"00")+((col & 1)!=0?"ff":"00");
	}
}

class Tetris extends Part{
	constructor(){
		super("Tetris");
		this.figures = [
		[	[[0,0],[0,-1],[1,0],[1,-1]]],//O
		[	[[0,0],[0,-1],[0,-2],[1,0]],//L
			[[-1,0],[0,0],[1,0],[1,-1]],
			[[1,0],[1,-1],[1,-2],[0,-2]],
			[[-1,0],[-1,-1],[0,-1],[1,-1]]],
		[	[[0,0],[1,0],[1,-1],[1,-2]],//J
			[[-1,-1],[0,-1],[1,-1],[1,0]],
			[[0,0],[0,-1],[0,-2],[1,-2]],
			[[-1,-1],[-1,0],[0,0],[1,0]]],
		[	[[0,0],[0,-1],[1,-1],[1,-2]],//Z
			[[-1,-1],[0,-1],[0,0],[1,0]]],
		[	[[0,-2],[0,-1],[1,-1],[1,0]],//S
			[[-1,0],[0,0],[0,-1],[1,-1]]],
		[	[[0,0],[0,-1],[0,-2],[0,-3]],//I
			[[-1,0],[0,0],[1,0],[2,0]]],
		[	[[0,0],[0,-1],[0,-2],[1,-1]],//T
			[[-1,0],[0, 0],[1,0],[0,-1]],
			[[0,0],[0,-1],[0,-2],[-1,-1]],
			[[-1,-1],[0,-1],[1,-1],[0,0]]]];
		this.colors = ["#bbb","#00b","#0b0","#0bb","#b0b","#b00","#bb0"];
	}
	keyPress(evt){
		super.keyPress(evt);
		switch(evt.keyCode) {
			case 38:
				this.up();
				break;
			case 40:
				this.down();
				break;
			case 37:
				this.left();
				break;
			case 39:
				this.right();
				break;
		}
	}
	start(){
		this.counter=-100;
		this.maxCounter=60;
		this.lineSmasher=0;
		this.width=10;
		this.height=20;
		this.cellSize=canvas.height/this.height;
		this.offset=4;
		this.bottle =[];
		this.figure={type: -1, x:-1, y:-1, rot:0};
		this.newFigure=Math.floor(Math.random()*this.figures.length);
		this.createFigures();
		this.score=0;
		this.lines=0;
		this.fullLines=[];
		for(var i=0;i<this.width;i++){
			this.bottle[i]=[];
			for(var j=0;j<this.height;j++){
				this.bottle[i][j]=0;
			}
		}
	}
	update(){
		contex.fillStyle="#111";
		contex.fillRect(0,0,canvas.width,canvas.height);
		for(var i=0;i<this.width;i++){
			for(var j=0;j<this.height;j++){
				if(this.bottle[i][j]==0){
					contex.fillStyle="#232";
				}else{
					contex.fillStyle=this.bottle[i][j];
				}
				this.drawCell(i,j);
			}
		}
		if(this.lineSmasher==0){
			this.counter++;
		}else{
			this.lineSmasher--;
			contex.fillStyle="#fff";
			for(var i=0;i<this.fullLines.length;i++){
				contex.fillRect(0,this.cellSize*this.fullLines[i]+this.offset,this.cellSize*this.width*(1-this.lineSmasher/this.maxCounter),this.cellSize-this.offset/2);
				if(this.lineSmasher == 0){
					this.deleteLine(this.fullLines[i]);
					this.lines++;
					this.score+=100*this.fullLines.length;
				}
			}
			if(this.lineSmasher == 0){
				if(Math.floor((this.lines-this.fullLines.length)/30)!=Math.floor(this.lines/30)){
					this.speedUp();
				}
				this.fullLines=[];
			}
		}
		if(this.counter>this.maxCounter){
			this.counter=0;
			this.moveDown();
		}
		contex.fillStyle="#fff";
		contex.font="bold 15px arial";
		contex.fillText("Lines: " + this.lines,this.width*this.cellSize+6,this.cellSize);
		contex.fillText("Score: " + this.score,this.width*this.cellSize+6,this.cellSize*2);
		
		if(this.counter<0){
			contex.fillStyle="#ffd";
			contex.font="bold 70px arial";
			contex.fillText("Start!",this.width/3*this.cellSize,this.cellSize*this.height/2);
		}
		if(this.figure.type!=-1){
			for(var i=0;i<this.figures[this.figure.type][this.figure.rot].length;i++){
				contex.fillStyle=this.colors[this.figure.type];
				this.drawCell(this.figure.x+this.figures[this.figure.type][this.figure.rot][i][0],this.figure.y+this.figures[this.figure.type][this.figure.rot][i][1]);
			}
		}
		if(this.newFigure!=-1){
			for(var i=0;i<this.figures[this.newFigure][0].length;i++){
				contex.fillStyle=this.colors[this.newFigure];
				this.drawCell(11.5+this.figures[this.newFigure][0][i][0],18+this.figures[this.newFigure][0][i][1]);
			}
		}
	}
	drawCell(xx,yy){
		contex.fillRect(this.cellSize*xx+this.offset,this.cellSize*yy+this.offset,this.cellSize-this.offset/2,this.cellSize-this.offset/2);
	}
	createFigures(){
		this.figure.type=this.newFigure;
		this.figure.x=5;
		this.figure.y=1;
		this.figure.rot=0;
		this.newFigure=Math.floor(Math.random()*this.figures.length);
	}
	moveDown(){                                 
		if(this.figure.type!=-1){
		var canMoveDown=true;
			for(var i=0;i<this.figures[this.figure.type][this.figure.rot].length;i++){
				if(this.figure.y+this.figures[this.figure.type][this.figure.rot][i][1]+1>=0){
					canMoveDown&=this.figure.y+1!=this.height 
					&& this.bottle	[this.figure.x+this.figures[this.figure.type][this.figure.rot][i][0]]
									[this.figure.y+this.figures[this.figure.type][this.figure.rot][i][1]+1] == 0;
				}
			}
			if(canMoveDown){
				this.figure.y++;
			}else{
				for(var i=0;i<this.figures[this.figure.type][this.figure.rot].length;i++){
					if(this.figure.y+this.figures[this.figure.type][this.figure.rot][i][1]>=0){
						this.bottle	[this.figure.x+this.figures[this.figure.type][this.figure.rot][i][0]]
								[this.figure.y+this.figures[this.figure.type][this.figure.rot][i][1]] = this.colors[this.figure.type];
						
					}else{
						alert("Мне жаль,вы проиграли.\nВаш счёт: " + this.score + "\nУдаленно " + this.lines + " строк");
						this.start();
						return;
					}
				}
				this.linesCheck();
				this.createFigures();
			}
		}
	}
	shear(side){
		if(this.figure.type!=-1){
			var canShear=true;
			for(var i=0;i<this.figures[this.figure.type][this.figure.rot].length;i++){
				if(this.figure.y+this.figures[this.figure.type][this.figure.rot][i][1]>=0){
					canShear &=this.figure.x+this.figures[this.figure.type][this.figure.rot][i][0]+side>=0 
							&& this.figure.x+this.figures[this.figure.type][this.figure.rot][i][0]+side<this.width
							&& this.bottle	[this.figure.x+this.figures[this.figure.type][this.figure.rot][i][0] + side]
											[this.figure.y+this.figures[this.figure.type][this.figure.rot][i][1]] == 0;
				}
			}
			if(canShear){
				this.figure.x+=side;
			}
		}
	}
	rotate(){
		if(this.figure.type!=-1){
			var newRotate=this.figure.rot==this.figures[this.figure.type].length-1?0:this.figure.rot+1;
			var canRotate=true;
			for(var i=0;i<this.figures[this.figure.type][newRotate].length;i++){
				if(this.figure.y+this.figures[this.figure.type][newRotate][i][1]>=0){
					canRotate &=this.figure.x+this.figures[this.figure.type][newRotate][i][0]>=0 
							&& this.figure.x+this.figures[this.figure.type][newRotate][i][0]<this.width
							&& this.bottle	[this.figure.x+this.figures[this.figure.type][newRotate][i][0]]
											[this.figure.y+this.figures[this.figure.type][newRotate][i][1]] == 0;
				}
			}
			if(canRotate){
				this.figure.rot=newRotate;
			}
		}
	}
	linesCheck(){
		if(this.fullLines.length == 0){
			for(var i=this.height-1;i>=0;i--){
				for(var j=0;j<this.width;j++){
					if(this.bottle[j][i] == 0) break;
				}
				if(j==this.width)this.fullLines.unshift(i);
			}
			if(this.fullLines.length>0){
				this.lineSmasher=this.maxCounter;
			}
		}
		
	}
	deleteLine(n){
		for(var j=n;j>0;j--){
			for(var i=0;i<this.width;i++){
				this.bottle[i][j]=this.bottle[i][j-1];
			}
		}
		for(var i=0;i<this.width;i++){
				this.bottle[i][0]=0;
			}
	}
	speedUp(){
		this.maxCounter-=5;
		var col='#'+Math.round(Math.random()*7+3).toString(16)+Math.round(Math.random()*7+3).toString(16)+Math.round(Math.random()*7+3).toString(16);
		for(var i=0;i<this.width;i++){
			for(var j=0;j<this.height;j++){
				if(this.bottle[i][j]!=0){
					this.bottle[i][j]=col;
				}
			}
		}
	}
	up(){
	if(this.counter>=0 && this.lineSmasher==0){
			this.rotate();
		}}
	down(){
		if(this.counter>=0 && this.lineSmasher==0){
			this.counter=0;
			this.moveDown();
		}
	}
	left(){
		if(this.counter>=0 && this.lineSmasher==0){
			this.shear(-1);
		}
	}
	right(){
		if(this.counter>=0 && this.lineSmasher==0){
			this.shear(1);
		}
	}
}
	
class SeaFight extends Part{
	constructor(){
		super("SeaFight");
	}
	keyPress(evt){
		super.keyPress(evt);
		switch(evt.keyCode) {
			case 38:
				up();
				break;
			case 40:
				down();
				break;
			case 37:
				left();
				break;
			case 39:
				right();
				break;
		}
	}
	start(){
		this.playerMap=[];
		this.enemyMap=[];
		this.playerTarget=[];
		this.enemyTarget=[];
		for(var i=0;i<10;i++){
			this.playerMap[i]=[];
			this.enemyMap[i]=[];
			this.playerTarget[i]=[];
			this.enemyTarget[i]=[];
			for(var j=0;j<10;j++){
				this.playerMap[i][j]=0;
				this.enemyMap[i][j]=0;
				this.playerTarget[i][j]=0;
				this.enemyTarget[i][j]=0;
			}
		}
		this.phase=0;
		this.twoPlayer=confirm("Играть с компьютером(Ok) или с вторым игроком(Отмена)?");
		
	}
	buildField(){
		
	}
	update(){
		contex.fillStyle="#111111";
		contex.fillRect(0,0,canvas.width,canvas.height);
	}
}