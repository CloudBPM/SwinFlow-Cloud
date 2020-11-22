/**
 * 
 */

function Category() {
	this.id = null;
	this.name = "Category"; // full name
	this.classtypename = "Category";
	this.description = null;
	// 0: organization; 
	// 1: department/project team; 
	// 2: position/project role;
	this.categoryType = 0;
	this.createdDateTime = 0;
	this.lastupdate = 0;
	// 0:no use;1:in use
	this.usageStatus = 1;
	this.rootCategoryId = null;
	this.assignCategoryId = null;
	
	this.mbUIContent = null;
	this.tbUIContent = null;
	this.pcUIContent = null;
	this.parent = null; // 
	this.currOwner = null;
	this.owner = null;
};

Category.prototype = new WorkflowEntity();

Category.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name; // full name
	this.createdDateTime = json.createdDateTime;//
	this.categoryType = json.categoryType;
	this.usageStatus = json.usageStatus;
	this.description = json.description;
	this.lastupdate = json.lastupdate;
	if (json.mbUIContent != null) {
		var ui = new MobileUI();
		ui.parseFromJSON(json.mbUIContent);
		this.mbUIContent = ui;
	}
	this.tbUIContent = null;
	if (json.pcUIContent != null && json.pcUIContent != "") {
		var o = JSON.parse(json.pcUIContent)
		var ui = new PCDesktopUI();
		ui.parseFromJSON(o, 0);
		this.pcUIContent = ui;
	}
	this.parent = json.parent; //
	this.currOwner = json.currOwner;
	this.owner = json.owner;
	this.rootCategoryId = json.rootCategoryId;
	this.assignCategoryId = json.assignCategoryId;
};

Category.prototype.stringifyforJSON = function() {
	var c = new Category();
	c.id = this.id;
	c.name = this.name; // full name
	c.categoryType = this.categoryType;
	c.createdDateTime = this.createdDateTime;//
	c.usageStatus = this.usageStatus;
	c.description = this.description;
	c.lastupdate = this.lastupdate;
	if (this.mbUIContent != null) {
		c.mbUIContent = this.mbUIContent.stringifyforJSON();
	}
	if (this.pcUIContent != null) {
		c.pcUIContent = this.pcUIContent.stringifyforJSON();
	}
	c.tbUIContent = null;
	c.parent = this.parent; //
	c.currOwner = this.currOwner;
	c.owner = this.owner;
	c.rootCategoryId = this.rootCategoryId;
	c.assignCategoryId = this.assignCategoryId;
	return c;
};