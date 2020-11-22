/**
 * 
 */

function MbColumn() {
	this.id = null;
	this.name = "MbColumn"; // full name
	this.createDateTime = null;
	this.parent = null; // 
	this.lastupdate = null;
	// true:editing; false:previewing
	this.editing = true;
	this.x0 = 0.5; // top left corner X
	this.y0 = 0.5; // top left corner Y
	this.x1 = 0.5; // bottom right corner X
	this.y1 = 0.5; // bottom right corner X
	this.selected = false; // is selected on canvas
	this.marks = []; // eight corner marks
	this.children = []; // 
	this.context = null;
	this.width = 128;
	this.height = 128;
	this.classtypename = "MbColumn";
};

MbColumn.prototype = new WorkflowEntity();

MbColumn.prototype.addChild = function(board) {
	this.children.push(board);
};

MbColumn.prototype.removeChild = function(child) {
	for (var j = 0; j < this.children.length; j++) {
		if (this.children[j] == child) {
			this.children.splice(j, 1);
			break;
		}
	}
};

MbColumn.prototype.findCovered = function(x, y) {
	var o = null;
	for (var i = 0; i < this.children.length; i++) {
		o = this.children[i].findCovered(x, y);
		if (o != null) {
			return o;
		}
	}
	if (o == null) {
		if (this.x0 <= x && this.x1 >= x && this.y0 <= y && this.y1 >= y) {
			return this;
		}
	}
	return null;
};

MbColumn.prototype.findParent = function(o) {
    for (var i = 0; i < this.children.length; i++) {
        if (o == this.children[i]) {
            return this;
        }
    }
    return null;
};

MbColumn.prototype.removeObject = function(o) {
	for (var i = 0; i < this.children.length; i++) {
		if (o == this.children[i]) {
			this.children.splice(i, 1);
			return this;
		}
	}
	return null;
};

MbColumn.prototype.deselectAll = function() {
	this.selected = false;
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].deselectAll();
	}
};

MbColumn.prototype.setSelected = function(selected) {
	this.selected = selected;
};

MbColumn.prototype.setPreview = function() {
	this.editing = false;
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].setPreview();
	}
};

MbColumn.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name; // full name
	this.createDateTime = json.createDateTime;
	this.parent = json.parent; // 
	this.lastupdate = json.lastupdate;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	if (json.children != null && json.children.length > 0) {
		for (var i = 0; i < json.children.length; i++) {
			var obj = json.children[i];
			if (obj.classtypename == "MbButton") {
				var button = new MbButton();
				button.parseFromJSON(obj);
				this.addChild(button);
			}
		}
	}
	this.width = json.width;
	this.height = json.height;
};

MbColumn.prototype.stringifyforJSON = function() {
	var b = new MbColumn();
	b.id = this.id;
	b.name = this.name; // full name
	b.createDateTime = this.createDateTime;
	b.parent = this.parent; // 
	b.lastupdate = this.lastupdate;
	b.x0 = this.x0; // top left corner X
	b.y0 = this.y0; // top left corner Y
	b.x1 = this.x1; // bottom right corner X
	b.y1 = this.y1; // bottom right corner X
	b.width = this.width;
	b.height = this.height;
	if (this.children != null && this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			var obj = this.children[i];
			if (obj.classtypename == "MbButton") {
				b.addChild(obj.stringifyforJSON());
			}
		}
	}
	return b; 
};

MbColumn.prototype.drawOnContext = function() {
	if (this.editing) {
		var dashedlinecolor = 'rgb(154, 154, 154)';
		var activecolor = 'rgba(222, 253, 215, 0.2)';
		var x0 = this.x0;
		var y0 = this.y0;
		var x1 = this.x1;
		var y1 = this.y0 + this.height;
		this.y1 = y1;
		var tmp = this.context.fillStyle;
		var tmp1 = this.context.strokeStyle;
		Utils.drawingDashedLine(this.context, dashedlinecolor, x0, y0, x1, y0);
		Utils.drawingDashedLine(this.context, dashedlinecolor, x0, y1, x1, y1);
		Utils.drawingDashedLine(this.context, dashedlinecolor, x0, y0, x0, y1);
		Utils.drawingDashedLine(this.context, dashedlinecolor, x1, y0, x1, y1);
		this.context.fillStyle = tmp;
		this.context.strokeStyle = tmp1; // resume old color
		this.marks = [];
		if (this.selected) {
			var f = this.context.fillStyle;
			this.context.fillStyle = activecolor;
			this.context.fillRect(x0 + 1, y0 + 1, x1 - 1 - (x0 + 1), y1 - 1
					- (y0 + 1));
			this.context.fillStyle = f;
			this.marks = Utils.createMarks(x0, y0, x1, y1);
			Utils.drawSelection(this.marks, this.context);
		}
		// children是一个组件。
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].context = this.context;
			this.children[i].x0 = x0 + 8;
			this.children[i].y0 = y0 + 8;
			this.children[i].x1 = x1 - 8;
			this.children[i].y1 = y1 - 8;
			this.children[i].width = x1 - x0 - 16;
			this.children[i].height = y1 - y0 - 16;
			this.children[i].drawOnContext();
		}
	} else {
		var dashedlinecolor = 'rgb(154, 154, 154)';
		var activecolor = 'rgba(222, 253, 215, 0.2)';
		var x0 = this.x0;
		var y0 = this.y0;
		var x1 = this.x1;
		var y1 = this.y0 + this.height;
		this.y1 = y1;
		this.marks = [];
		if (this.selected) {
			var f = this.context.fillStyle;
			this.context.fillStyle = activecolor;
			this.context.fillRect(x0, y0, x1 - x0, y1 - y0);
			this.context.fillStyle = f;
		}
		// children是一个组件。
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].context = this.context;
			this.children[i].x0 = x0;
			this.children[i].y0 = y0;
			this.children[i].x1 = x1;
			this.children[i].y1 = y1;
			this.children[i].width = x1 - x0;
			this.children[i].height = y1 - y0;
			this.children[i].drawOnContext();
		}
	}
};

MbColumn.prototype.isInMark = function(x, y) {
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