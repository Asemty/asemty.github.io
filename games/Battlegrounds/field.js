CardManager = {};
CardManager.cardSize = {width: 160, height: 250, offset: 5, statSize: 30, picHeight: 150, nameHeight: 20, discriptionHeight: 55, creaturePicWidth: 110};
CardManager.cardSize.update = function(){
	this.mainWidth = this.width - this.offset * 2;
	this.nameX = this.offset * 2;
	this.nameY = this.picHeight - this.nameHeight;
	this.nameWidth = this.width - this.offset * 4;
	this.discriptionY = this.picHeight + this.offset * 2;
	this.statsY = this.height - this.statSize;
	this.hpX = this.width - this.statSize;
	this.tribeX = this.statSize + this.offset;
	this.tribeY = this.statsY + this.offset;
	this.tribeWidth = this.width - (this.statSize + this.offset) * 2
	this.tribeHeight = this.statSize - this.offset * 2;
	this.creatureWidth = this.creaturePicWidth + this.offset * 2;
	this.creatureHeight = this.picHeight + this.offset * 2;
	this.cratureStatsY = this.creatureHeight - this.statSize;
	this.cratureHpX = this.creatureWidth - this.statSize;
	this.creatureImageX = (this.mainWidth - this.creaturePicWidth) / 2 * 3; //тут не очень хорошо (mainWidth)
	this.creatureImageWidth = this.creaturePicWidth * 3;
	this.cardToCreatureOffset = (this.mainWidth - this.creaturePicWidth) / 2;
	this.creatureLevelX = (this.creatureWidth - this.statSize) / 2;
	this.creatureLevelY = - this.statSize / 3;
}
CardManager.cardSize.update();

CardManager.cardColor = {border: "black", common: "gray", triple: "gold", transper: "#000000aa", textColor: "white"}
CardManager.cardFonts = {a15:"15px Arial", a10:"10px Arial"};
CardManager.tribes = {none: "", murloc: "Мурлок", demon: "Демон", beast: "Зверь", mech: "Механизм"};
CardManager.drawCard = function(card, x, y, scale){
	ctx.save();
	ctx.translate(x - this.cardSize.width / 2 * scale,y);
	ctx.scale(scale, scale);
	ctx.fillStyle = this.cardColor.triple;
	ctx.fillRect(0, 0, this.cardSize.width, this.cardSize.height);
	ctx.strokeStyle = this.cardColor.border;
	ctx.lineWidth = 2;
	ctx.strokeRect(0, 0, this.cardSize.width, this.cardSize.height);
	
	//stats
	drawTextRect(0, this.cardSize.statsY, this.cardSize.statSize, this.cardSize.statSize, card.att)
	drawTextRect(this.cardSize.hpX, this.cardSize.statsY, this.cardSize.statSize, this.cardSize.statSize, card.hp)
	if(card.tribe != this.tribes.none) drawTextRect(this.cardSize.tribeX, this.cardSize.tribeY, this.cardSize.tribeWidth, this.cardSize.tribeHeight, card.tribe, true)
	//picture
	ctx.drawImage(card.pic, 0,0,450,450, this.cardSize.offset, this.cardSize.offset, this.cardSize.mainWidth, this.cardSize.picHeight);
	ctx.strokeRect(this.cardSize.offset, this.cardSize.offset, this.cardSize.mainWidth, this.cardSize.picHeight);
	//name
	drawTextRect(this.cardSize.nameX, this.cardSize.nameY, this.cardSize.nameWidth, this.cardSize.nameHeight, card.name)
	//discription
	drawTextRect(this.cardSize.offset, this.cardSize.discriptionY, this.cardSize.mainWidth, this.cardSize.discriptionHeight, card.discription, true)
	//level
	drawTextRect(0, this.cardSize.creatureLevelY, this.cardSize.statSize, this.cardSize.statSize, card.level);
	ctx.restore();
}
CardManager.drawCreature = function(card, x, y, scale, isDrawLevel){
	ctx.save();
	ctx.translate(x - this.cardSize.creatureWidth / 2 * scale,y);
	ctx.scale(scale, scale);
	ctx.fillStyle = this.cardColor.triple;
	ctx.fillRect(0, 0, this.cardSize.creatureWidth, this.cardSize.creatureHeight);
	ctx.strokeStyle = this.cardColor.border;
	ctx.lineWidth = 2;
	ctx.strokeRect(0, 0, this.cardSize.creatureWidth, this.cardSize.creatureHeight);
	
	//picture
	ctx.drawImage(card.pic, this.cardSize.creatureImageX, 0, this.cardSize.creatureImageWidth, 450, this.cardSize.offset, this.cardSize.offset, this.cardSize.creaturePicWidth, this.cardSize.picHeight);
	ctx.strokeRect(this.cardSize.offset, this.cardSize.offset, this.cardSize.creaturePicWidth, this.cardSize.picHeight);
	//stats
	drawTextRect(0, this.cardSize.cratureStatsY, this.cardSize.statSize, this.cardSize.statSize, card.att)
	drawTextRect(this.cardSize.cratureHpX, this.cardSize.cratureStatsY, this.cardSize.statSize, this.cardSize.statSize, card.hp)
	//level
	if(isDrawLevel) drawTextRect(this.cardSize.creatureLevelX, this.cardSize.creatureLevelY, this.cardSize.statSize, this.cardSize.statSize, card.level);
	ctx.restore();
}

function createCard(att, hp, tribe, level, pic, name, discription){
	card = {};
	card.pic = pic;
	card.discription = discription;
	card.name = name;
	card.att = att;
	card.hp = hp;
	card.tribe = tribe;
	card.level = level;
	card.effects = {};
	card.buffs = {};
	card.drawCard = function(){
		
	};
	return card;
}

function drawTextRect(x,y,w,h,txt, isSmall){
	ctx.fillStyle = CardManager.cardColor.transper;
	ctx.fillRect(x, y, w, h);
	ctx.strokeStyle = CardManager.cardColor.border;
	ctx.lineWidth  = 2;
	ctx.strokeRect(x, y, w, h);
	
	ctx.font = isSmall ? CardManager.cardFonts.a10 : CardManager.cardFonts.a15;
	ctx.fillStyle = CardManager.cardColor.textColor;
	ctx.textAlign = "center"; 
	ctx.textBaseline  = "middle"; 
	var strings = txt.toString().split("|");
	for(var i = 0; i < strings.length; i++){
		ctx.fillText(strings[i], x + w / 2, y + h / 2 + (i - (strings.length - 1) / 2) * 12);
	}
}

FieldManager = {type: {card: "drawCard", creature: "drawCreature"}};
FieldManager.drawField = function(field, x, y){// centr position
	var n = field.items.length + (field.itemGhostIndex >= 0 ? 1 : 0)
		for(var i = 0; i < n; i++){
			var item = (field.itemGhostIndex < 0 || i < field.itemGhostIndex) ? field.items[i] : field.items[i - 1];//TODO если ghost больше length + 1, тогда item[i] может быть outOfRange(т.к. item[i-1] никогда не наступит)
			var offset = field.xOffset + (field.cardDrawType == FieldManager.type.card ? CardManager.cardSize.width : CardManager.cardSize.creatureWidth);
			if(i != field.itemGhostIndex) CardManager[field.cardDrawType](item, x + ((i - (n - 1) / 2) * offset), y, field.scale);
			else drawTextRect(x + ((i - (n - 1) / 2) * offset) - 15, y, 30, 30, "");
		}
}
FieldManager.clickChecker = function(field, fieldX, fieldY, clickX, clickY){
	var x = clickX - fieldX, y = clickY - fieldY;
	var offset = field.xOffset + CardManager.cardSize.width;
	if(y < 0 || y > (field.cardDrawType == FieldManager.type.card ? CardManager.cardSize.height : CardManager.cardSize.creatureHeight)){ return -1};
	var index = x / TODO
	return index;
}

/*TODO FieldManager.getCoordCardPos for draw, click, drag
class controller getFieldIdAndIndex -> message or dragNdrop*/

FieldManager.createField = function(){ 
	field = {};
	field.items = [];
	field.itemGhostIndex = -1;
	field.scale = 1;
	field.xOffset = 0;
	field.cardDrawType = FieldManager.type.card;
	return field;
}