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
		contex.fillStyle=this.getSimpleColor(7);
		contex.fillRect(this.cellSize*this.player.x,this.cellSize*this.player.y,this.cellSize,this.cellSize);
		if(this.counter<0){
			contex.strokeStyle="white";
			contex.lineWidth=this.cellSize/2;
			contex.strokeRect(this.cellSize*this.player.x+this.counter,this.cellSize*this.player.y+this.counter,this.cellSize-this.counter*2,this.cellSize-this.counter*2);
		}
		for(var i=0;i<this.enemy.length;i++){
			contex.fillStyle=this.getSimpleColor(this.enemy[i].color);
			contex.fillRect(this.cellSize*this.enemy[i].x,this.cellSize*this.enemy[i].y,this.cellSize,this.cellSize);
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