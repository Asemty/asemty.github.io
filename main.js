class Menu{
	constructor(){
		this.games=[];
		this.games.push(new Snake());
		this.games.push(new LightCycle());
		this.games.push(new Tetris());
		this.games.push(new Genetic());
		this.currentMenuItem=0;
	}
	keyPress(evt){
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
			case 13:
				this.choose();
				break;
		}
	}
	upd(){
		contex.fillStyle = "#111111";
		contex.fillRect(0, 0, canvas.width, canvas.height);
		contex.fillStyle = "#eeeeaa";
		
		for(var i=0; i < this.games.length; i++){
			contex.font = (i==this.currentMenuItem?"italic bold 35":"20")+"px arial,serif";
			contex.fillText(i+1+". "+this.games[i].name,20,canvas.height/25*(i+1));

		}
	}
	up(){
		if(this.currentMenuItem == 0){
			this.currentMenuItem = this.games.length - 1;
		}else{
			this.currentMenuItem--; 
		}
	}
	down(){
		if(this.currentMenuItem == this.games.length - 1){
			this.currentMenuItem = 0;
		}else{
			this.currentMenuItem++; 
		}
	}
	left(){}
	right(){}
	choose(){
		curentPart=this.games[this.currentMenuItem];
		curentPart.start();
	}
}

function start(){
	menu = new Menu();
	curentPart=menu;
}
function keyPress(evt){
	curentPart.keyPress(evt);
}
function update(){
	curentPart.upd();
}

class Part{
	constructor(name){
		this.name=name;
	}
	
	keyPress(evt){
		if(evt.keyCode == 27){//esc
			this.pause=!this.pause;
		}
		if(evt.keyCode == 13 && this.pause){//enter
			curentPart=menu;
			this.pause=false;
		}
	}
	upd(){
		if(!this.pause){
			this.update();
		}else{
			contex.fillStyle = "#111111";
			contex.fillRect(canvas.width/4, canvas.height/4, canvas.width/2, canvas.height/2);
			contex.fillStyle = "#eeeeaa";
			contex.font = "italic bold 30px arial,serif";
			contex.fillText("Выйти?",canvas.width/5*2,canvas.height/3+50);
			contex.fillText("Enter-да, Esc-нет",canvas.width/4+25,canvas.height/3+120);
		}
	}
}