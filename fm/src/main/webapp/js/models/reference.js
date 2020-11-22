/**
 * 
 */
function Reference() {
	this.id = null;
	this.name = null;
	this.description = null;
	this.createDatetime = null;
	this.lastupdate = null;
	this.parent = null;
	this.owner = null;
	this.classtypename = "Reference";
	//this.children = []; // children.
};

Reference.prototype = new UIComponent();

Reference.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.description = json.description;
	this.createDatetime = json.createDatetime;
	this.lastupdate = json.lastupdate;
	this.parent = json.parent;
	this.owner = json.owner;
	// this.children = []; // children.
};