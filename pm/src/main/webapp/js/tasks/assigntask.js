/**
 * Assign task class
 */

function AssignTask() {
	// build time props
	this.id = "Assign Task 00";
	this.name = "Assign Task";
	this.x0 = 0; // top left corner X
	this.y0 = 0; // top left corner Y
	this.x1 = 0; // bottom right corner X
	this.y1 = 0; // bottom right corner X
	this.description = null;
	this.isParallelInput = 0; // 0:no; 1:yes
	this.isParallelOutput = 0; // 0:no; 1:yes
	this.currOwner = null; // process ID
	this.owner = null; // organization ID
	this.inputs = []; // input transitions (arcs)
	this.outputs = []; // output transitions (arcs)
	this.marks = []; // eight corner marks
	this.classtypename = "AssignTask";
	this.lastupdate = null;
	// runtim props
	this.status = 0; //
	this.assignments = [];
};

AssignTask.prototype = new AbstractTask();

AssignTask.prototype.addAssignment = function(assignment) {
	this.assignments.push(assignment);
};

AssignTask.prototype.getAssignmentById = function(id) {
	for (var i = 0; i < this.assignments.length; i++) {
		if (this.assignments[i].id == id) {
			return this.assignments[i];
		}
	}
};

AssignTask.prototype.removeAssignment = function(assignment) {
	for (var i = 0; i < this.assignments.length; i++) {
		if (this.assignments[i].id == assignment.id
				|| this.assignments[i] == assignment) {
			this.assignments.splice(i, 1);
			break;
		}
	}
};

AssignTask.prototype.setAssignment = function(assignment) {
	for (var i = 0; i < this.assignments.length; i++) {
		if (this.assignments[i].id == assignment.id
				|| this.assignments[i] == assignment) {
			this.assignments.splice(i, 1);
			this.assignments.splice(i, 0, assignment);
			break;
		}
	}
};

AssignTask.prototype.setAssignment = function(assignment) {
	for (var i = 0; i < this.assignments.length; i++) {
		if (this.assignments[i].id == assignment.id
				|| this.assignments[i] == assignment) {
			this.assignments.splice(i, 1);
			this.assignments.splice(i, 0, assignment);
			break;
		}
	}
};

AssignTask.prototype.clone = function() {
	var a = new AssignTask();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.selected = this.selected; // is selected on canvas
	// for (i = 0; i < this.assignments.length; i++) {
	// a.addAssignment(this.assignments[i].clone());
	// }
	return a;
};

AssignTask.prototype.stringifyforJSON = function() {
	var a = new AssignTask();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.description = this.description;
	a.isParallelInput = this.isParallelInput;
	a.isParallelOutput = this.isParallelOutput;
	a.currOwner = this.currOwner; // process ID
	a.owner = this.owner; // organization ID
	a.lastupdate = this.lastupdate;
	for (var i = 0; i < this.assignments.length; i++) {
		a.assignments[i] = this.assignments[i].toExpressionString();
	}
	return a;
};

AssignTask.prototype.parse = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	this.description = json.description;
	this.isParallelOutput = json.isParallelOutput;
	this.isParallelInput = json.isParallelInput;
	this.lastupdate = Utils.getDateTime(json.lastupdate)
	this.currOwner = json.currOwner; // process ID
	this.owner = json.owner; // organization ID
	if (json.assignments != null && json.assignments.length > 0) {
		for (var i = 0; i < json.assignments.length; i++) {
			var a = json.assignments[i];
			var asg = new Assignment();
			asg.id = a.id;
			asg.arrayIndex = a.arrayIndex;
			asg.owner = this.owner;
			asg.variableString = a.variableString;
			if (a.value != null && a.value != "") {
				var r = new Expression();
				r.expressionString = a.value;
				asg.value = r;
			}
			this.addAssignment(asg);
		}
	}
};

// A function for drawing the particle.
AssignTask.prototype.drawToContext = function() {
	var tmp = this.context.fillStyle;
	var tmp1 = this.context.strokeStyle;

	var cornerRadius = 8;
	this.context.beginPath();
	this.context.moveTo(this.x0 + cornerRadius, this.y0);
	this.context.lineTo(this.x1 - cornerRadius, this.y0);
	this.context.arcTo(this.x1, this.y0, this.x1, this.y0 + cornerRadius,
			cornerRadius);
	this.context.lineTo(this.x1, this.y1 - cornerRadius);
	this.context.arcTo(this.x1, this.y1, this.x1 - cornerRadius, this.y1,
			cornerRadius);
	this.context.lineTo(this.x0 + cornerRadius, this.y1);
	this.context.arcTo(this.x0, this.y1, this.x0, this.y1 - cornerRadius,
			cornerRadius);
	this.context.lineTo(this.x0, this.y0 + cornerRadius);
	this.context.arcTo(this.x0, this.y0, this.x0 + cornerRadius, this.y0,
			cornerRadius);
	this.context.closePath();
	this.context.fillStyle = 'rgb(244, 250, 255)';
	this.context.fill();
	this.context.strokeStyle = 'rgb(196, 210, 237)';
	this.context.stroke();
	this.context.moveTo(this.x0 + 1, this.y0 + 30);
	this.context.lineTo(this.x1 - 1, this.y0 + 30);
	this.context.stroke();

	this.context.fillStyle = tmp;
	this.context.strokeStyle = tmp1; // resume old color

	BuildTimeUtils.assignIcon48x48(this.context, this.x1 - 48, this.y1 - 48);

	var label = new TaskTextLabel(this.x0, this.y0, this.x1, this.y1,
			this.context);
	label.outputText(this.name, "C");

	var label1 = new TaskTextLabel(this.x0, this.y0 + 30, this.x1, this.y1,
			this.context);
	label1.outputText(this.description, "C");

	this.marks = Utils.createMarks(this.x0, this.y0, this.x1, this.y1);
	if (this.selected) {
		Utils.drawSelection(this.marks, this.context);
	}
};

AssignTask.prototype.isInMark = function(x, y) {
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