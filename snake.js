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