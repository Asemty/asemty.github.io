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
		for(var i=0;i<this.cells.length;i++){
			if(this.cells[i].isLive){
				contex.fillStyle="#"+Math.floor(this.cells[i].colorR).toString(16)+Math.floor(this.cells[i].colorG).toString(16)+Math.floor(this.cells[i].colorB).toString(16);
				var size = 2 + 8 * (this.cells[i].lifeTime/this.cells[i].lifeTimeMax);
				contex.fillRect(this.cells[i].x-size/2,this.cells[i].y-size/2,size,size);
				//contex.fillRect(this.cells[i].x-this.cells[i].area/2,this.cells[i].y-size/2,this.cells[i].area,size);
				this.cells[i].lifeTime+=Math.max(1,this.lastNumber/50);
				this.cells[i].dirTimer++;
				this.cells[i].childrenTimer++;
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
		this.cells=tempCells;
		contex.fillStyle="#fff";
		contex.font = "bold 15px arial,serif";
		contex.fillText("Number:"+this.cells.length,0,15);
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