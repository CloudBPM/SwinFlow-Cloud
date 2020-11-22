/**
 * 
 */
function Authority() {
	this.id = null;
	this.name = null;
	this.description = null;
	this.type = 0;
	this.parent = null;
};

Authority.prototype = new WorkflowEntity();

Authority.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.description = json.description;
	this.type = json.type;
	if (json.parent != undefined)
		this.parent = json.parent.id;
};