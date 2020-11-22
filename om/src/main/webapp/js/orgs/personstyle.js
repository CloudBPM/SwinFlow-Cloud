function PersonStyle(){
	//this.id = null;
	this.rightwidth = null;
	this.leftwidth = null;
	this.height = null;
}
PersonStyle.prototype.stringifyforJSON = function() {
	var p = new personstyle();
	//p.id = this.id;
	p.rightwidth = this.rightwidth;
	p.leftwidth = this.leftwidth;
	p.height = this.height;
}
PersonStyle.prototype.parseFromJSON = function(json) {
	//this.id = json.id;
	this.rightwidth = json.rightwidth;
	this.leftwidth = json.leftwidth;
	this.height = json.height;
}
