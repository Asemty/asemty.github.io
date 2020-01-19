Input = {}
Input.init = function(){//Эта функция вызывается автоматически в конце файла
	document.addEventListener("keydown",(evt) => {Input.keyDownUp(evt)});
	document.addEventListener("keyup",(evt) => {Input.keyDownUp(evt)});
	var cnv = document.getElementById("cnv");// использование canvas'а с именем "cnv" берётся по умолчанию. Так же используется в mouseMove
	cnv.addEventListener("contextmenu", (event) => {event.preventDefault();});//выключаем стандартное действие
	cnv.onmousemove = (evt) => {Input.mouseMove(evt)};
	cnv.onmouseup = (evt) => {Input.mouseDownUp(evt)};
	cnv.onmousedown = (evt) => {Input.mouseDownUp(evt)};
	if(postupdate)postupdate.push(() => {Input.update()});//этот код должен выполняться после каждой стандартной итеррации цикла 
	
	this.mouse = {x: 0, y: 0};//храним координаты мыши. закрывать запись нет смысла, они обновляются при каждом сдвиге
	this.buttons = [];
	this.addKey(1000, "lmb");//импользуем id не существующих кнопок для мыши.
	this.addKey(1001, "cmb");
	this.addKey(1002, "rmb");
	this.addKey(37, "left");
	this.addKey(38, "up");
	this.addKey(39, "right");
	this.addKey(40, "down");
};

Input.keyDownUp = function(evt){//используем одну функцию для нажатий и отжатий кнопки
	if(this.buttons[evt.keyCode]) this.buttons[evt.keyCode].isPressed = evt.type == "keydown";
};
Input.mouseDownUp = function(evt){
	if(evt.button >= 0 && evt.button <= 2){
		this.buttons[evt.button + 1000].isPressed = evt.type == "mousedown";
	}
};
Input.mouseMove = function(evt, bcr){
	var bcr = document.getElementById("cnv").getBoundingClientRect();//расположение canvas'а. 
	this.mouse.x = evt.clientX - bcr.left;
	this.mouse.y = evt.clientY - bcr.top;
};
Input.update = function(){//вызывается автоматически, если успешно поместили в postupdate(см.init)
	for(var i in this.buttons){
		this.buttons[i].last = this.buttons[i].isPressed;
	}
};
Input.addKey = function(id, name){
	this.buttons[id] = {name: name, isPressed: false, last: false};
};
Input.isKey = function(name){ //удерживается ли кнопка
	for(var i in this.buttons){
		if(name == this.buttons[i].name){
			return this.buttons[i].isPressed;
		}
	}
	return false;
};
Input.isKeyPress = function(name){// была ли нажата кнопка между прошлей и текущей итеррацией цикла
	for(var i in this.buttons){
		if(name == this.buttons[i].name){
			return this.buttons[i].isPressed && !this.buttons[i].last;
		}
	}
	return false;
};
Input.isKeyRelease = function(name){// была ли отпущенна кнопка между прошлей и текущей итеррацией цикла
	for(var i in this.buttons){
		if(name == this.buttons[i].name){
			return !this.buttons[i].isPressed && this.buttons[i].last;
		}
	}
	return false;
}
Input.init();