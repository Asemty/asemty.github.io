function start(){
	Input.addKey(27, "esc");
	img = new Image();
	img.src = "images/pic.jpg"
	card = createCard(1,1, CardManager.tribes.mech,1, img, "Заклинатель гнева","После того, как вы разыгры-|ваете демона наносит 1 ед.|урона вашему герою|и получает +2/ +2");
	/*field = FieldManager.createField();
	field.items.push(card);
	field.items.push(card);
	field.items.push(card);*/
	//scale = 1;
}
function step(){
	/*if(Input.isKey("up")) scale += 0.01;
	if(Input.isKey("down")) scale -= 0.01;
	field.scale = scale;
	if(Input.isKeyPress("right")) field.items.push(card);
	if(Input.isKeyPress("left")) field.items.pop();
	if(Input.isKeyPress("lmb")) field.itemGhostIndex--;
	if(Input.isKeyPress("rmb")) field.itemGhostIndex++;*/
	if(Input.isKeyPress("right")){
		gameController.fields.shop.field.items.push(card);
		gameController.fields.table.field.items.push(card);
		gameController.fields.hand.field.items.push(card);
	}
}
function draw(){
	ctx.fillStyle="#eeeeee";
    ctx.fillRect(0,0,cnv.width,cnv.height);
	
	//FieldManager.drawField(field, 640, 400);
	gameController.draw();
	
	/*if(Input.isKeyPress("esc")){
		if(field.cardDrawType == "drawCreature"){
			field.cardDrawType = "drawCard"
		}else{
			field.cardDrawType = "drawCreature"
		}
	}*/
}
