/**
 * 
 */
function ReferenceDetail() {
	this.id = null;
	this.code = null;
	this.name = null;
	this.description = null;
	this.parentCode = null;
	this.status = 1;
	this.parent = null;
	this.currOwner = null;
	this.owner = null;
	this.customColumn1 = null;
	this.customColumn2 = null;
	this.customColumn3 = null;
	this.classtypename = "ReferenceDetail";
	// this.children = []; // children.
};

ReferenceDetail.prototype = new UIComponent();

ReferenceDetail.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.code = json.code;
	this.name = json.name;
	this.description = json.description;
	this.parentCode = json.parentCode;
	this.status = json.status;
	this.parent = json.parent;
	this.currOwner = json.currOwner;
	this.owner = json.owner;
	this.customColumn1 = json.customColumn1;
	this.customColumn2 = json.customColumn2;
	this.customColumn3 = json.customColumn3;
	// this.children = []; // children.
};