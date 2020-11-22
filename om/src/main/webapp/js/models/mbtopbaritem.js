/**
 * 
 */
function MbTopBarItem() {
	this.id = null;
	this.name = "MbTopBarItem"; // full name
	this.createDateTime = null;
	this.parent = null; // parent object Id
	this.lastupdate = null;
	// true:editing; false:previewing
	this.editing = true;
	this.width = 20;
	this.height = 56;
	this.x0 = 0.5; // top left corner X
	this.y0 = 0.5; // top left corner Y
	this.x1 = this.width + 0.5; // bottom right corner X
	this.y1 = this.height + 0.5; // bottom right corner X
	this.selected = false; // is selected on canvas
	this.marks = []; // eight corner marks
	this.children = new MbContentPanel(); // 
	this.context = null;
	this.classtypename = "MbTopBarItem";
	this.fontsize = 16;
	this.fontfamilty = "Arial Black";

};

MbTopBarItem.prototype = new WorkflowEntity();

MbTopBarItem.prototype.findCovered = function(x, y) {
	if (this.x0 <= x && this.x1 >= x && this.y0 <= y && this.y1 >= y) {
		return this;
	}
	return null;
};

MbTopBarItem.prototype.setSelected = function(selected) {
	this.selected = selected;
};

MbTopBarItem.prototype.deselectAll = function() {
	this.selected = false;
};

MbTopBarItem.prototype.setPreview = function() {
	this.editing = false;
    this.children.setPreview();
};

MbTopBarItem.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name; // full name
	this.createDateTime = json.createDateTime;
	this.parent = json.parent; // 
	this.lastupdate = json.lastupdate;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	this.width = json.width;
	this.height = json.height;
	this.fontsize = json.fontsize;
	this.fontfamilty = json.fontfamilty;
	if (json.children != null) {
		var pane = new MbContentPanel();
		pane.parseFromJSON(json.children);
		this.children = pane;
	}
};

MbTopBarItem.prototype.stringifyforJSON = function() {
	var b = new MbTopBarItem();
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
	b.fontsize = this.fontsize;
	b.fontfamilty = this.fontfamilty;
	if (this.children != null) {
		b.children = this.children.stringifyforJSON();
	}
	return b;
};

MbTopBarItem.prototype.drawOnContext = function() {
	if (this.editing) {
		// 留给写字的高度是52，再留出4个留白。
		var dashedlinecolor = 'rgb(154, 154, 154)';
		var activecolor = 'rgba(222, 253, 215, 0.5)';
		// x0,y0,x1,y1是指文字的位置
		var x0 = this.x0 + 4; // 4 is margin
		var y0 = this.y0 + 4; // 4 is margin
		var x1 = this.x1 - 4; // 4 is margin
		var y1 = this.y1 - 4; // 4 is margin
		var ft = this.context.font;
		this.context.font = this.fontsize + "px " + this.fontfamilty;
		if (this.name != "") {
			this.width = this.context.measureText(this.name).width;
		}
		var y = Math.round((y0 + y1) / 2) + 3 + 0.5;
		this.context.fillText(this.name, x0, y);
		this.x1 = Math.round(x0 + this.width + 4) + 0.5;
		this.context.font = ft;
		var tmp = this.context.fillStyle;
		var tmp1 = this.context.strokeStyle;
		Utils.drawingDashedLine(this.context, dashedlinecolor, this.x0,
				this.y0, this.x1, this.y0);
		Utils.drawingDashedLine(this.context, dashedlinecolor, this.x0,
				this.y1, this.x1, this.y1);
		Utils.drawingDashedLine(this.context, dashedlinecolor, this.x0,
				this.y0, this.x0, this.y1);
		Utils.drawingDashedLine(this.context, dashedlinecolor, this.x1,
				this.y0, this.x1, this.y1);
		this.context.fillStyle = tmp;
		this.context.strokeStyle = tmp1; // resume old color
		this.marks = [];
		if (this.selected) {
			var f = this.context.fillStyle;
			this.context.fillStyle = activecolor;
			this.context.fillRect(this.x0 + 1, this.y0 + 1, this.x1 - 1
					- (this.x0 + 1), this.y1 - 1 - (this.y0 + 1));
			this.context.fillStyle = f;

			var ft = this.context.font;
			this.context.font = this.fontsize + "px " + this.fontfamilty;
			this.context.fillText(this.name, x0, y);
			this.context.font = ft;

			this.marks = Utils.createMarks(this.x0, this.y0, this.x1, this.y1);
			Utils.drawSelection(this.marks, this.context);
		}
	} else {
		// 留给写字的高度是52，再留出4个留白。
		var activecolor = 'rgba(222, 253, 215, 0.5)';
		var fontcolor = 'rgb(0, 0, 0)';
		// x0,y0,x1,y1是指文字的位置
		var x0 = this.x0;
		var y0 = this.y0;
		var x1 = this.x1;
		var y1 = this.y1;
		var ft = this.context.font;
		var f1 = this.context.fillStyle;
		this.context.fillStyle = fontcolor;
		this.context.font = this.fontsize + "px " + this.fontfamilty;
		if (this.name != "") {
			this.width = this.context.measureText(this.name).width;
		}
		var y = Math.round((y0 + y1) / 2) + 3 + 0.5;
		this.context.fillText(this.name, x0, y);
		this.x1 = Math.round(x0 + this.width + 4) + 0.5;
		this.context.font = ft;
		this.context.fillStyle = f1;

		if (this.selected) {
			var f = this.context.fillStyle;
			this.context.fillStyle = activecolor;
			this.context.fillRect(this.x0 + 1, this.y0 + 1, this.x1 - 1
					- (this.x0 + 1), this.y1 - 1 - (this.y0 + 1));
			this.context.fillStyle = f;

			var fontcolor = 'rgb(0, 0, 0)';
			var f1 = this.context.fillStyle;
			this.context.fillStyle = fontcolor;
			var ft = this.context.font;
			this.context.font = this.fontsize + "px " + this.fontfamilty;
			this.context.fillText(this.name, x0, y);
			this.context.font = ft;
			this.context.fillStyle = f1;
		}
	}
};

MbTopBarItem.prototype.isInMark = function(x, y) {
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
