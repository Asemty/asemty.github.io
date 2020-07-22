function keyPress(evt){
	switch(evt.keyCode) {
        case 49 : player.attack(timer.currentAct); break; //1
		case 50 : break; //2
		case 51 : break; //3
		case 52 : gen(); break; //4
	}
	for(var i = 0; i < buttons.length; i++){
		if(evt.keyCode == buttons[i].id){
			buttons[i].isPressed = true;
		}
	}
}
function keyRelease(evt){
	for(var i = 0; i < buttons.length; i++){
		if(evt.keyCode == buttons[i].id){
			buttons[i].isPressed = false;
		}
	}
}
function isKey(name){
	for(var i = 0; i < buttons.length; i++){
		if(name == buttons[i].name){
			return buttons[i].isPressed;
		}
	}
	return false;
}
function mouseUp(e){
	switch (e.button) {
		case 0: // Primary button ("left")
		break;
		case 2: // Secondary button ("right")
		break;
	}
}
function mouseDown(e){
	switch (e.button) {
		case 0: // Primary button ("left")
		break;
		case 2: // Secondary button ("right")
		break;
	}
}
function mouseMove(evt){
		var rct = cnv.getBoundingClientRect();
		mouse.x = evt.clientX - rct.left - 3;
		mouse.y = evt.clientY - rct.top - 3;
}

function update(){
	ctx.fillStyle="#fff";
    ctx.fillRect(0,0,cnv.width,cnv.height);
	/*if(isKey("down"))ctx.fillStyle = "#222222"; else ctx.fillStyle = "#ff0000";
    ctx.fillRect(-3 + mouse.x,-3 + mouse.y,6,6);
	ctx.font="20px Georgia";
	ctx.fillStyle="red";
	ctx.fillText("Hello world!",10,25);
	ctx.drawImage(img,0,0,8,8,40,60,80,80);*/
	timer.draw();
	if(monster.health <= 0){
		alert("Congratulate, you win!" + (player.health == 100 ? "\nFlawless victory!" : ""))
		gen();
	}
	if(player.health <= 0){
		alert("Congratulate, you lose!" + (monster.health == 100 ? "\nFlawless lose!" : ""))
		gen();
	}
}

function start(){
	mouse = {x: 0, y: 0};
	buttons = [];
	buttons.push({id: 37, name: "left", isPressed: false});
	buttons.push({id: 38, name: "up", isPressed: false});
	buttons.push({id: 39, name: "right", isPressed: false});
	buttons.push({id: 40, name: "down", isPressed: false});
	
	buttons.push({id: 49, name: "1", isPressed: false});
	buttons.push({id: 50, name: "2", isPressed: false});
	buttons.push({id: 51, name: "3", isPressed: false});
	img = new Image();
	img.src = "images/icons.png";
	enemy = new Image();
	enemy.src = "images/enemy.png"
	gen();
}

function gen(){
	alert("Hello! \nuse 1 to attack (only in the green zone) \nuse 2 to physical protection \nuse 3 to magic protection")
	monster = {health: 100, attackPower: 5, maxTimer: 400, pic: enemy};
	monster.behaviour = [];
	monster.behaviour.push(vuln(4,7));
	monster.behaviour.push(vuln(50,80));
	monster.behaviour.push(vuln(120,240));
	monster.behaviour.push(att(160));
	monster.behaviour.push(mgc(200));
	monster.hurt = function (){};
	
	timer = {time: 0, monster: monster};
	timer.scaling = 5;
	timer.monsterScale = 1;
	timer.actionBarLength = cnv.width / 2 / timer.scaling;
	timer.currentAct = -1;
	
	timer.draw = function (){
		if(this.monster){
			this.time++;
			if(this.time > this.monster.maxTimer){
				this.time = 0;
			}
		if(Math.abs(this.monsterScale - 1) < 0.05) {this.monsterScale = 1} else{this.monsterScale -= (this.monsterScale - 1) / 5}
			ctx.drawImage(this.monster.pic,0,0,192,192, (cnv.width - 192 * this.monsterScale) / 2, (cnv.height - 192 * this.monsterScale) / 2 , 192 * this.monsterScale, 192 * this.monsterScale);
	//draw monster hp
			ctx.fillStyle = "red";
			ctx.fillRect(10, 10, 400, 40);
			ctx.fillStyle = "green";
			ctx.fillRect(10, 10, 400 * this.monster.health / 100, 40);
	//draw player hp
			ctx.fillStyle = "red";
			ctx.fillRect(10, 600, 400, 40);
			ctx.fillStyle = "green";
			ctx.fillRect(10, 600, 400 * player.health / 100, 40);
	//draw action bar
			var act = getState(this.monster,this.time);
			this.currentAct = act;
			ctx.fillStyle = act > 0 ? "#ff0": (act == 0 ? "#0f0" : "#f00");
			ctx.fillRect(cnv.width / 4 - cnv.height / 8, cnv.height / 32 * 3 , cnv.height / 8, cnv.height / 8);
			if(act == 1){
				player.hurt(this.monster, false);
				ctx.drawImage(img,0,0,64,64,cnv.width / 4 - cnv.height / 8, cnv.height / 32 * 3 , cnv.height / 8, cnv.height / 8);
			};
			if(act == 2){
				player.hurt(this.monster, true);
				ctx.drawImage(img,64,0,64,64,cnv.width / 4 - cnv.height / 8, cnv.height / 32 * 3 , cnv.height / 8, cnv.height / 8);
			};
			
			ctx.strokeStyle = "#000";
			for(var i = 0; i < this.actionBarLength; i++){
				var act = getState(this.monster,(this.time + i) % this.monster.maxTimer);
				ctx.fillStyle = act > 0 ? "#ff0": (act == 0 ? "#0f0" : "#f00");
				ctx.fillRect(cnv.width / 4 + i * this.scaling, cnv.height / 8, this.scaling, cnv.height / 16);
				if(act == 1){
					ctx.drawImage(img,0,0,64,64,cnv.width / 4 + i * this.scaling - cnv.height / 16, cnv.height / 8 + cnv.height / 16, cnv.height / 8, cnv.height / 8);
				}
				if(act == 2){
					ctx.drawImage(img,64,0,64,64,cnv.width / 4 + i * this.scaling - cnv.height / 16, cnv.height / 8 + cnv.height / 16, cnv.height / 8, cnv.height / 8);
				}
			}
			ctx.strokeRect(cnv.width / 4, cnv.height / 8,cnv.width / 2, cnv.height / 16);
			ctx.strokeRect(cnv.width / 4 - cnv.height / 8, cnv.height / 32 * 3 , cnv.height / 8, cnv.height / 8);
	//draw player's buttons
		ctx.drawImage(img,64 * 2,0,64,64,cnv.width / 4 + cnv.width / 8,cnv.height / 6 * 5, 128,128);
		
		ctx.fillStyle = (isKey("2") && !isKey("3") && !isKey("1")) ? "#0f0" : "#f00";
		ctx.fillRect(cnv.width / 4 + cnv.width / 8 * 2 + 32 + 16,cnv.height / 12 * 9, 32,32);
		ctx.drawImage(img,64 * 3,0,64,64,cnv.width / 4 + cnv.width / 8 * 2,cnv.height / 6 * 5, 128,128);
		ctx.fillStyle = (isKey("3") && !isKey("2") && !isKey("1")) ? "#0f0" : "#f00";
		ctx.fillRect(cnv.width / 4 + cnv.width / 8 * 3 + 32 + 16,cnv.height / 12 * 9, 32,32);
		ctx.drawImage(img,64 * 4,0,64,64,cnv.width / 4 + cnv.width / 8 * 3,cnv.height / 6 * 5, 128,128);
		}
	};
	
	player = {health: 100, attackPower: 1};
	player.hurt = function (monster, isMagic){
		if(isMagic){
			if(isKey("3") && !isKey("2") && !isKey("1")){
				timer.monsterScale = 1.2;
			}else{
				player.health -= monster.attackPower;
				timer.monsterScale = 1.7;
			}
		}else{
			if(isKey("2") && !isKey("3") && !isKey("1")){
				timer.monsterScale = 1.2;
			}else{
				player.health -= monster.attackPower;
				timer.monsterScale = 1.7;
			}
		}
	};
	player.attack = function (curAct){
		if(curAct != -1 && !isKey("3") && !isKey("2")){
			timer.monster.health -= this.attackPower;
			timer.monsterScale = 0.7;
		}
	};
	
}

function getState(monster, time){
	if(time < 0 || time >= monster.maxTimer){
		return -1;
	}
	for(var i = 0; i < monster.behaviour.length; i++){
		if((monster.behaviour[i].t == 1 || monster.behaviour[i].t == 2) && monster.behaviour[i].s == time){
			return monster.behaviour[i].t;
		}
	}
	for(var i = 0; i < monster.behaviour.length; i++){
		if(monster.behaviour[i].t == 0 && monster.behaviour[i].s <= time && monster.behaviour[i].f > time){
			return 0;
		}
	}
	return -1;
}

function vuln(s,f){
	return {t:0, s:s, f:f};
}
function att(t){
	return {t:1, s:t};
}
function mgc(t){
	return {t:2, s:t};
}