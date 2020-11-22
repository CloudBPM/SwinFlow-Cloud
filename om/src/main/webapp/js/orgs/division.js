/**
 * Branch/Division/Institute/Faculty
 */
function Division() {
	this.id = null;
	this.serialNumber = null; // internal code
	this.name = "division"; // full name
	this.abbrName = "division abbr"; // short name
	this.rank = 1; //
	this.address = null;
	this.postCode = null;
	this.phoneNumber = null;
	this.faxNumber = null;
	this.email = null;
	this.createDate = null;
	this.parent = null; // 
	this.status = 3; // 3: not in use; 4: in use
	this.lastupdate = null;
	this.categoryId = null;

	this.x0 = 0; // top left corner X
	this.y0 = 0; // top left corner Y
	this.x1 = 0; // bottom right corner X
	this.y1 = 0; // bottom right corner X
	this.selected = false; // is selected on canvas
	this.isnewparent = false; // temp property
	this.marks = []; // eight corner marks
	this.input = null; // top/left relationships
	this.children = []; // 
	this.classtypename = "Division";
};

Division.prototype = new AbstractDepartment();

Division.prototype.addChild = function(obj) {
	this.children.push(obj);
};

Division.prototype.removeChild = function(obj) {
	if (obj == null)
		return;
	if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			if (obj.id == this.children[i].id) {
				this.children.splice(i, 1);
				break;
			}
		}
	}
};

Division.prototype.clone = function() {
	var d = new Division();
	d.id = this.id;
	d.serialNumber = this.serialNumber; // unique code
	d.name = this.name;
	d.abbrName = this.abbrName; // short name
	d.rank = this.rank; //
	d.address = this.address;
	d.postCode = this.postCode;
	d.phoneNumber = this.phoneNumber;
	d.faxNumber = this.faxNumber;
	d.email = this.email;
	d.status = this.status; // valid; invalid
	d.createDate = this.createDate;
	d.lastupdate = this.lastupdate;
	d.categoryId = this.categoryId;
	d.x0 = this.x0; // top left corner X
	d.y0 = this.y0; // top left corner Y
	d.x1 = this.x1; // bottom right corner X
	d.y1 = this.y1; // bottom right corner X
	d.selected = this.selected; // is selected on canvas
	d.isnewparent = this.isnewparent; // is selected on canvas
	d.marks = []; // eight corner marks
	if (this.input != null) {
		d.input = this.input.clone();
		d.input.target = d;
	}
	d.children = []; // 
	d.parent = this.parent; // is selected on canvas
	d.context = this.context;
	return d;
};

Division.prototype.setParent = function(parent) {
	this.parent = parent;
	this.input = new Relationship();
	this.input.source = parent;
	this.input.target = this;
	this.input.owner = this.owner;
	this.input.context = this.context;
	this.input.updatePosition();
};

Division.prototype.setSelected = function(selected) {
	this.selected = selected;
	if (this.input != null) {
		this.input.selected = selected;
	}
};

Division.prototype.toString = function() {
	return this.name;
};

Division.prototype.generateNewNumber = function() {
	return this.countChildren(this);
};

Division.prototype.countChildren = function(root) {
	var count = 1;
	if (root.children.length > 0) {
		for (var i = 0; i < root.children.length; i++) {
			count = count + this.countChildren(root.children[i]);
		}
	}
	return count;
};

// A function for drawing the particle.
Division.prototype.drawToContext = function() {
	var tmp = this.context.fillStyle;
	if (this.status == 1) {
		this.context.fillStyle = 'rgb(230, 255, 236)';
		if (this.isnewparent) {
			this.context.fillStyle = 'rgb(255, 204, 204)';
			this.isnewparent = false;
		}
	} else {
		this.context.fillStyle = 'rgb(241, 243, 247)';
	}
	this.context.fillRect(this.x0, this.y0, this.x1 - this.x0, this.y1
			- this.y0);
	this.context.fillStyle = tmp;
	tmp = this.context.strokeStyle;
	this.context.strokeStyle = 'rgb(105, 121, 105)';
	if (this.status == 0) {
		this.context.strokeStyle = 'rgb(215, 215, 215)';
	}

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

Division.prototype.isInMark = function(x, y) {
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

Division.prototype.drawToContext1 = function() {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].drawToContext();
	}
};

Division.prototype.parseFromJSON = function(json, parent) {
	this.id = json.id;
	this.serialNumber = json.serialNumber; // unique code
	this.name = json.name; // full name
	this.abbrName = json.abbrName; // short name
	this.address = json.address;
	this.postCode = json.postCode;
	this.phoneNumber = json.phoneNumber;
	this.faxNumber = json.faxNumber;
	this.email = json.email;
	this.rank = json.rank; // 
	this.createDate = json.createDate;//
	this.status = json.status; // 0: cancelled; 1: operating
	this.lastupdate = json.lastupdate;
	if (json.parent != null) {
		this.parent = json.parent;
	}
	this.categoryId = json.categoryId;
	this.x0 = Math.floor(json.x0) + 0.5; // top left corner X
	this.y0 = Math.floor(json.y0) + 0.5; // top left corner Y
	this.x1 = Math.floor(json.x1) + 0.5; // bottom right corner X
	this.y1 = Math.floor(json.y1) + 0.5; // bottom right corner X
	this.setParent(parent);
};

Division.prototype.parseStructureFromJSON = function(json, ownerid) {
	this.id = json.id;
	this.serialNumber = json.serialNumber; // unique code
	this.name = json.name; // full name
	this.abbrName = json.abbrName; // short name
	this.rank = json.rank; // 
	this.createDate = json.createDate;//
	this.status = json.status; // 0: cancelled; 1: operating
	this.lastupdate = json.lastupdate;
	this.categoryId = json.categoryId;
	this.x0 = Math.floor(json.x0) + 0.5; // top left corner X
	this.y0 = Math.floor(json.y0) + 0.5; // top left corner Y
	this.x1 = Math.floor(json.x1) + 0.5; // bottom right corner X
	this.y1 = Math.floor(json.y1) + 0.5; // bottom right corner X

	if (json.parent != undefined && json.parent.id != undefined)
		this.parent = json.parent.id;
	else 
		this.parent = json.parent;

	if (json.children.length > 0) {
		for (var i = 0; i < json.children.length; i++) {
			var p = new Position();
			p.parseFromJSON(json.children[i], this, this, ownerid);
			this.addChild(p);
		}
	}

	// top department has no parent and input.
	if (this.children.length > 0) {
		this.children[0].parent = null;
		this.children[0].input = null;
	}
};

Division.prototype.stringifyforJSON = function() {
	var d = new Division();
	d.id = this.id;
	d.serialNumber = this.serialNumber; // unique code
	d.name = this.name; // full name
	d.abbrName = this.abbrName; // short name
	d.address = this.address;
	d.postCode = this.postCode;
	d.phoneNumber = this.phoneNumber;
	d.faxNumber = this.faxNumber;
	d.email = this.email;
	d.rank = this.rank; // 
	d.createDate = this.createDate;//
	d.status = this.status; // 0: cancelled; 1: operating
	d.lastupdate = this.lastupdate;
	d.categoryId = this.categoryId;
	d.x0 = this.x0; // top left corner X
	d.y0 = this.y0; // top left corner Y
	d.x1 = this.x1; // bottom right corner X
	d.y1 = this.y1; // bottom right corner X
	d.owner = this.owner;
	if (this.parent != undefined) {
		if (this.parent.id != undefined) {
			d.parent = this.parent.id;
		} else {
			d.parent = this.parent;
		}
	}

	if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			d.addChild(this.children[i].stringifyforJSON());
		}
	}
	return d;
};
