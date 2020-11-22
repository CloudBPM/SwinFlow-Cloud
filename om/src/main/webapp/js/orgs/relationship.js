/**
 * This is connection link source task and target task.
 */
function Relationship() {
	this.id = "Relationship 00";
	this.name = "Relationship";
	this.x0;
	this.y0;
	this.x1;
	this.y1;
	this.bx = 0;
	this.by = 0;
	this.cx = 0;
	this.cy = 0;

	this.hx = 0; // handle x for changing parent
	this.hy = 0; // handle y for changing parent

	this.source = ""; // organization component
	this.target = ""; // organization component
	this.status = 0;

	this.selected = false;
};

Relationship.prototype = new WorkflowEntity();

Relationship.prototype.clone = function() {
	var a = new Relationship();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0;
	a.y0 = this.y0;
	a.x1 = this.x1;
	a.y1 = this.y1;
	a.bx = this.bx;
	a.by = this.by;
	a.cx = this.cx;
	a.cy = this.cy;
	a.hx = this.hx; // handle x for changing parent
	a.hy = this.hy; // handle y for changing parent

	a.source = this.source; // use original parent
	a.target = this.target; // it should be replaced by new target.

	a.status = this.status;
	a.selected = this.selected;
	a.context = this.context;
	return a;
};

Relationship.prototype.parse = function(t, proc) {

};

Relationship.prototype.copy = function(t) {

};

// A function for drawing the particle.
Relationship.prototype.drawToContext = function() {
	var tmp = this.context.strokeStyle;
	this.context.strokeStyle = 'black';
	this.context.lineWidth = 1;
	this.context.beginPath();
	this.context.moveTo(this.x0, this.y0);
	this.context.lineTo(this.bx, this.by);
	this.context.lineTo(this.cx, this.cy);
	this.context.lineTo(this.x1, this.y1);
	// this.context.closePath();
	this.context.stroke();
	this.context.strokeStyle = tmp;

	if (this.selected) {
		this.marks = Utils.createRelMarks(this.x0, this.y0, this.x1, this.y1,
				this.hx, this.hy);
		this.context.lineWidth = 0.5;
		// this.context.lineJoin = 'round';
		tmp = this.context.strokeStyle;
		var tmp12 = this.context.fillStyle;

		this.context.fillStyle = 'white';
		this.context.strokeStyle = 'black';
		this.context.fillRect(this.marks[0].x0, this.marks[0].y0,
				this.marks[0].width, this.marks[0].height);
		this.context.strokeRect(this.marks[0].x0, this.marks[0].y0,
				this.marks[0].width, this.marks[0].height);
		this.context.fillStyle = tmp12;
		this.context.fillStyle = 'red';
		this.context.fillRect(this.marks[1].x0, this.marks[1].y0,
				this.marks[1].width, this.marks[1].height);
		this.context.strokeRect(this.marks[1].x0, this.marks[1].y0,
				this.marks[1].width, this.marks[1].height);
		this.context.fillStyle = tmp12;
		this.context.fillStyle = 'white';
		this.context.fillRect(this.marks[2].x0, this.marks[2].y0,
				this.marks[2].width, this.marks[2].height);
		this.context.strokeRect(this.marks[2].x0, this.marks[2].y0,
				this.marks[2].width, this.marks[2].height);

		this.context.strokeStyle = tmp; // resume old color
		this.context.fillStyle = tmp12;
	}
};

Relationship.prototype.isInMark = function(x, y) {
	if (this.marks != null && this.marks.length > 0) {
		if (this.marks[1].x0 - 4 <= x
				&& x <= this.marks[1].x0 + this.marks[1].width + 4
				&& this.marks[1].y0 - 4 <= y
				&& y <= this.marks[1].y0 + this.marks[1].height + 4) {
			return this.marks[1].name;
		}
	}
	return "default";
};

Relationship.prototype.updatePosition = function() {
	this.computeCoordinate();
};

// A function for drawing the particle.
Relationship.prototype.computeCoordinate = function() {
	// a means arc, same meaning with Transition
	// console.log(this.source);
	// console.log(this.target);

	this.x0 = Math.floor((this.source.x0 + this.source.x1) / 2) + 0.5;
	// console.log("x0:"+this.x0);
	this.y0 = this.source.y1;
	// console.log("y0:"+this.y0);
	this.x1 = Math.floor((this.target.x0 + this.target.x1) / 2) + 0.5;
	// console.log("x1:"+this.x1);
	this.y1 = this.target.y0;
	// console.log("y1:"+this.y1);
	this.bx = this.x0;
	// console.log("bx:"+this.bx);
	this.by = Math.floor((this.source.y1 + this.target.y0) / 2) + 0.5;
	// console.log("by:"+this.by);
	this.cx = this.x1;
	// console.log("cx:"+this.cx);
	this.cy = Math.floor((this.source.y1 + this.target.y0) / 2) + 0.5;
	// console.log("cy:"+this.cy);

	this.hx = Math.floor((this.bx + this.cx) / 2) + 0.5;
	this.hy = this.cy;

	// console.log("hx:"+this.hx);
	// console.log("hy:"+this.hy);

};
