/**
 * 
 */

function Position() {
	this.id = null;
	this.serialNumber = null; // unique code
	this.name = "general position";
	this.abbrName = "position abbr"; // short name

	this.rank = 0; // 
	this.createDate = null;//
	this.status = 3; // 3: not in use; 4: in use
	this.parent = null; // 
	this.lastupdate = null;
	this.staff = [];
	this.categoryId = null;
	this.calenderId = null;
	this.x0 = 0; // top left corner X
	this.y0 = 0; // top left corner Y
	this.x1 = 0; // bottom right corner X
	this.y1 = 0; // bottom right corner X
	this.currOwner = null;
	this.selected = false; // is selected on canvas
	this.isnewparent = false; // temp property
	this.marks = []; // eight corner marks
	this.input = null; // top/left relationships
	this.children = []; // 
	this.classtypename = "Position";
};

Position.prototype = new AbstractPosition();

Position.prototype.addChild = function(position) {
	this.children.push(position);
};

Position.prototype.clone = function() {
	var d = new Position();
	d.id = this.id;
	d.serialNumber = this.serialNumber; // unique code
	d.name = this.name;
	d.abbrName = this.abbrName; // short name
	d.status = this.status; // valid; invalid
	d.rank = this.rank; //
	d.createDate = this.createDate;
	d.lastupdate = this.lastupdate;
	d.categoryId = this.categoryId;
	d.calenderId = this.calenderId;
	d.x0 = this.x0; // top left corner X
	d.y0 = this.y0; // top left corner Y
	d.x1 = this.x1; // bottom right corner X
	d.y1 = this.y1; // bottom right corner X
	d.currOwner = this.currOwner;
	d.selected = this.selected; // is selected on canvas
	d.isnewparent = this.isnewparent; // is selected on canvas
	d.input = this.input; // is selected on canvas
	d.parent = this.parent; // is selected on canvas

	return d;
};

Position.prototype.setParent = function(parent) {
	this.parent = parent;
	this.input = new Relationship();
	this.input.source = parent;
	this.input.target = this;
	this.input.owner = this.owner;
	this.input.context = this.context;
	this.input.updatePosition();
};

Position.prototype.removeChild = function(child) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].id == child.id) {
			this.children.splice(i, 1);
			return;
		}
	}
};

Position.prototype.setSelected = function(selected) {
	this.selected = selected;
	if (this.input != null) {
		this.input.selected = selected;
	}
};

Position.prototype.toString = function() {
	return this.name;
};

// A function for drawing the particle.
Position.prototype.drawToContext = function() {
	var tmp = this.context.fillStyle;
	if (this.isnewparent) {
		this.context.fillStyle = 'rgb(255, 204, 204)';
		this.isnewparent = false;
	} else {
		this.context.fillStyle = 'rgb(242,245,251)';
	}
	this.context.fillRect(this.x0, this.y0, this.x1 - this.x0, this.y1
			- this.y0);
	this.context.fillStyle = tmp;
	tmp = this.context.strokeStyle;
	this.context.strokeStyle = 'rgb(89, 127, 171)';
	this.context.strokeRect(this.x0, this.y0, this.x1 - this.x0, this.y1
			- this.y0);
	this.context.strokeStyle = tmp; // resume old color

	if (this.input != null) {
		this.input.drawToContext();
	}

	// output name
	var label = new TextLabel(this.x0, this.y0, this.x1, this.y1, this.context);
	label.outputText(this.name, "C");

	this.marks = Utils.createMarks(this.x0, this.y0, this.x1, this.y1);
	if (this.selected) {
		Utils.drawSelection(this.marks, this.context);
	}

	for (var i = 0; i < this.children.length; i++) {
		this.children[i].drawToContext();
	}

};

Position.prototype.isInMark = function(x, y) {
	if (this.marks != null && this.marks.length > 0) {
		for (var i = 0; i < this.marks.length; i++) {
			if (this.marks[i].x0 - 4 <= x
					&& x <= this.marks[i].x0 + this.marks[i].width + 4
					&& this.marks[i].y0 - 4 <= y
					&& y <= this.marks[i].y0 + this.marks[i].height + 4) {
				return this.marks[i].name;
			}
		}
	}
	return "default";
};

Position.prototype.parseFromJSON = function(json, parent, currOnwer, ownerid) {
	this.id = json.id;
	this.serialNumber = json.serialNumber; // unique code
	this.name = json.name;
	this.abbrName = json.abbrName; // short name
	this.rank = json.rank; // 
	this.createDate = json.createDate;//
	this.status = json.status; // 0: cancelled; 1: operating
	this.lastupdate = json.lastupdate;
	this.staff = [];
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	this.context = currOnwer.context;
	this.currOwner = currOnwer.id;
	this.owner = ownerid;
	this.categoryId = json.categoryId;
	this.calenderId = json.officeCalendarID;
	this.setParent(parent);
	
	if (json.children.length > 0) {
		for (var i = 0; i < json.children.length; i++) {
			var p = new Position()
			p.parseFromJSON(json.children[i], this, currOnwer, ownerid);
			this.addChild(p);
		}
	}
};

Position.prototype.stringifyforJSON = function() {
	var p = new Position();
	p.id = this.id;
	p.serialNumber = this.serialNumber; // unique code
	p.name = this.name;
	p.abbrName = this.abbrName; // short name
	p.rank = this.rank; // 
	p.createDate = this.createDate;//
	p.status = this.status; // 0: cancelled; 1: operating
	p.lastupdate = this.lastupdate;
	p.staff = this.staff;
	p.x0 = this.x0; // top left corner X
	p.y0 = this.y0; // top left corner Y
	p.x1 = this.x1; // bottom right corner X
	p.y1 = this.y1; // bottom right corner X
	p.owner = this.owner;
	p.categoryId = this.categoryId;
	p.calenderId = this.calenderId;
	if (this.parent != null) {
		p.parent = this.parent.id;
	}
	if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			p.addChild(this.children[i].stringifyforJSON());
		}
	}
	return p;
};