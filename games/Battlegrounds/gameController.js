gameController = {};
gameController.init = function(){
	this.fields = {};
	this.fields.shop = {x: 640, y: 100, field: FieldManager.createField(), isDrawLevel: true};
	this.fields.shop.field.cardDrawType = "drawCreature";
	this.fields.shop.field.scale = 0.8;
	this.fields.table = {x: 640, y: 200, field: FieldManager.createField()};
	this.fields.table.field.cardDrawType = "drawCreature";
	this.fields.table.field.scale = 0.8;
	this.fields.hand = {x: 640, y: 460, field: FieldManager.createField()};
	this.fields.hand.field.scale = 0.8;
	this.draw = function(){
		this.drawField(this.fields.shop);
		this.drawField(this.fields.table);
		this.drawField(this.fields.hand);
	}
	this.drawField = function(data){
		FieldManager.drawField(data.field, data.x, data.y);
	}
	
}
gameController.init();
