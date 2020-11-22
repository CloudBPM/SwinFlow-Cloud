/**
 * 
 */
function MbSearchBar() {
	this.id = null;
	this.name = "MbSearchBar"; // full name
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
	this.classtypename = "MbSearchBar";
};

MbSearchBar.prototype = new WorkflowEntity();

MbSearchBar.prototype.findCovered = function(x, y) {
	if (this.x0 <= x && this.x1 >= x && this.y0 <= y && this.y1 >= y) {
		return this;
	}
	return null;
};

MbSearchBar.prototype.findParent = function(o) {
    return null;
};

MbSearchBar.prototype.deselectAll = function() {
	this.selected = false;
};

MbSearchBar.prototype.setSelected = function(selected) {
	this.selected = selected;
};

MbSearchBar.prototype.setPreview = function() {
	this.editing = false;
};

MbSearchBar.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name; // full name
	this.createDateTime = json.createDateTime;
	this.parent = json.parent; // 
	this.lastupdate = json.lastupdate;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
};

MbSearchBar.prototype.stringifyforJSON = function() {
	var b = new MbSearchBar();
	b.id = this.id;
	b.name = this.name; // full name
	b.createDateTime = this.createDateTime;
	b.parent = this.parent; // 
	b.lastupdate = this.lastupdate;
	b.x0 = this.x0; // top left corner X
	b.y0 = this.y0; // top left corner Y
	b.x1 = this.x1; // bottom right corner X
	b.y1 = this.y1; // bottom right corner X
	return b; 
};

// A function for drawing the particle.
MbSearchBar.prototype.drawOnContext = function() {
	if (this.editing) {
		var lw = this.context.lineWidth;
		var linecolor = 'rgb(154, 154, 154)';
		var fillcolor = 'rgb(245, 245, 245)';
		var activecolor = 'rgba(222, 253, 215, 0.5)';
		var height = 64;
		var dashedlinecolor = 'rgb(154, 154, 154)';
		var x0 = this.x0 + 4; // 4 is margin
		var y0 = this.y0 + 4; // 4 is margin
		var x1 = this.x1 - 4; // 4 is margin
		var y1 = this.y0 + height - 4; // 4 is margin
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
			this.context.fillRect(x0+1, y0+1, x1-1-(x0+1), y1-1-(y0+1));
			this.context.fillStyle = f;
			
			this.marks = Utils.createMarks(x0, y0, x1, y1);
			Utils.drawSelection(this.marks, this.context);
		}

		this.context.lineWidth = 1;
		this.context.strokeStyle = linecolor;
		this.context.beginPath();
		// arc(cx,cy,radius,start_angle,end_angle,direction);
		this.context.arc(x0 + 50, y0 + 28, 20, 1.5 * Math.PI, 0.5 * Math.PI, 1);
		this.context.moveTo(x0 + 50, y0 + 8);
		this.context.lineTo(x1 - 50, y0 + 8);
		this.context.arc(x1 - 50, y0 + 28, 20, 1.5 * Math.PI, 0.5 * Math.PI, 0);
		this.context.lineTo(x0 + 50, y0 + 48);
		this.context.stroke();
		this.context.closePath();
		this.context.fillStyle = fillcolor;
		this.context.fill();
		this.context.lineWidth = lw;
		this.context.fillStyle = tmp;
	} else {
		var lw = this.context.lineWidth;
		var linecolor = 'rgb(154, 154, 154)';
		var fillcolor = 'rgb(245, 245, 245)';
		var activecolor = 'rgba(222, 253, 215, 0.5)';
		var height = 64;
		var x0 = this.x0 + 4; // 4 is margin
		var y0 = this.y0 + 4; // 4 is margin
		var x1 = this.x1 - 4; // 4 is margin
		var y1 = this.y0 + height - 4; // 4 is margin
		this.y1 = y1;

		if (this.selected) {
			var f = this.context.fillStyle;
			this.context.fillStyle = activecolor;
			this.context.fillRect(x0+1, y0+1, x1-1-(x0+1), y1-1-(y0+1));
			this.context.fillStyle = f;
		}

		this.context.lineWidth = 1;
		this.context.strokeStyle = linecolor;
		this.context.beginPath();
		// arc(cx,cy,radius,start_angle,end_angle,direction);
		this.context.arc(x0 + 50, y0 + 28, 20, 1.5 * Math.PI, 0.5 * Math.PI, 1);
		this.context.moveTo(x0 + 50, y0 + 8);
		this.context.lineTo(x1 - 50, y0 + 8);
		this.context.arc(x1 - 50, y0 + 28, 20, 1.5 * Math.PI, 0.5 * Math.PI, 0);
		this.context.lineTo(x0 + 50, y0 + 48);
		this.context.stroke();
		this.context.closePath();
		this.context.fillStyle = fillcolor;
		this.context.fill();
		this.context.lineWidth = lw;
		this.context.fillStyle = tmp;
	}
};

MbSearchBar.prototype.isInMark = function(x, y) {
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