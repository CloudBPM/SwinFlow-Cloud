/**
 * Subprocess Point class
 */

function SubprocessPoint() {
	this.id = "Subprocess Point 00";
	this.name = "Subprocess Point";
	this.x0 = 0; // top left corner X
	this.y0 = 0; // top left corner Y
	this.x1 = 0; // bottom right corner X
	this.y1 = 0; // bottom right corner X
	this.status = 0; //
	this.description = null;
	this.isParallelInput = 0; // 0:no; 1:yes
	this.isParallelOutput = 0; // 0:no; 1:yes
	this.currOwner = null; // process ID
	this.owner = null; // organization ID
	this.inputs = []; // input transitions (arcs)
	this.outputs = []; // output transitions (arcs)
	this.marks = []; // eight corner marks
	this.classtypename = "SubprocessPoint";
	this.lastupdate = null;

	// true: synchronization; false: asynchronization;
	this.synchronised = true;
	this.subprocessId = null;
	this.subprocessName = null;
	this.subprocessInputs = [];
	this.subprocessOutputs = [];
};

SubprocessPoint.prototype = new AbstractTask();

SubprocessPoint.prototype.clone = function() {
	var a = new SubprocessPoint();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	// a.status = this.status; //
	a.selected = this.selected; // is selected on canvas
	// a.subprocessId = this.subprocessId;
	// a.synchronised = this.synchronised;
	// for (var i = 0; i < this.subprocessInputs.length; i++) {
	// a.addSubInput(this.subprocessInputs[i]); // .clone()
	// }
	// for (var i = 0; i < this.subprocessOutputs.length; i++) {
	// a.addSubOutput(this.subprocessOutputs[i]); // .clone()
	// }
	return a;
};

SubprocessPoint.prototype.stringifyforJSON = function() {
	var a = new SubprocessPoint();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.description = this.description;
	a.isParallelInput = this.isParallelInput;
	a.isParallelOutput = this.isParallelOutput;
	a.lastupdate = this.lastupdate;
	a.currOwner = this.currOwner; // process ID
	a.owner = this.owner; // organization ID
	a.synchronised = this.synchronised;
	a.subprocessId = this.subprocessId;
	for (var i = 0; i < this.subprocessInputs.length; i++) {
		a.subprocessInputs[i] = this.subprocessInputs[i].toExpressionString();
	}
	for (var i = 0; i < this.subprocessOutputs.length; i++) {
		a.subprocessOutputs[i] = this.subprocessOutputs[i].toExpressionString();
	}
	return a;
};

SubprocessPoint.prototype.getSubInputById = function(id) {
	for (var i = 0; i < this.subprocessInputs.length; i++) {
		if (this.subprocessInputs[i].id == id) {
			return this.subprocessInputs[i];
		}
	}
};

SubprocessPoint.prototype.addSubInput = function(assignment) {
	this.subprocessInputs.push(assignment);
};

SubprocessPoint.prototype.removeSubInput = function(assignment) {
	for (var i = 0; i < this.subprocessInputs.length; i++) {
		if (this.subprocessInputs[i].id == assignment.id
				|| this.subprocessInputs[i] == assignment) {
			this.subprocessInputs.splice(i, 1);
			break;
		}
	}
};

SubprocessPoint.prototype.setSubInput = function(assignment) {
	for (var i = 0; i < this.subprocessInputs.length; i++) {
		if (this.subprocessInputs[i].id == assignment.id
				|| this.subprocessInputs[i] == assignment) {
			this.subprocessInputs.splice(i, 1);
			this.subprocessInputs.splice(i, 0, assignment);
			break;
		}
	}
};

// Subprocess output operations

SubprocessPoint.prototype.getSubOutputById = function(id) {
	for (var i = 0; i < this.subprocessOutputs.length; i++) {
		if (this.subprocessOutputs[i].id == id) {
			return this.subprocessOutputs[i];
		}
	}
};

SubprocessPoint.prototype.addSubOutput = function(assignment) {
	this.subprocessOutputs.push(assignment);
};

SubprocessPoint.prototype.removeSubOutput = function(assignment) {
	for (var i = 0; i < this.subprocessOutputs.length; i++) {
		if (this.subprocessOutputs[i].id == assignment.id
				|| this.subprocessOutputs[i] == assignment) {
			this.subprocessOutputs.splice(i, 1);
			break;
		}
	}
};

SubprocessPoint.prototype.setSubOutput = function(assignment) {
	for (var i = 0; i < this.subprocessOutputs.length; i++) {
		if (this.subprocessOutputs[i].id == assignment.id
				|| this.subprocessOutputs[i] == assignment) {
			this.subprocessOutputs.splice(i, 1);
			this.subprocessOutputs.splice(i, 0, assignment);
			break;
		}
	}
};

// parse JSON string
SubprocessPoint.prototype.parse = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	this.synchronised = json.synchronised;
	this.subprocessId = json.subprocessId;
	this.subprocessName = json.subprocessName;
	this.description = json.description;
	this.isParallelOutput = json.isParallelOutput;
	this.isParallelInput = json.isParallelInput;
	this.lastupdate = Utils.getDateTime(json.lastupdate)
	this.currOwner = json.currOwner; // process ID
	this.owner = json.owner; // organization ID
	if (json.subprocessInputs != null && json.subprocessInputs.length > 0) {
		for (var i = 0; i < json.subprocessInputs.length; i++) {
			var a = json.subprocessInputs[i];
			var asg = new Assignment();
			asg.id = a.id;
			asg.type = a.type;
			asg.arrayIndex = a.arrayIndex;
			asg.variableString = a.variableString; // subprocess variable
			if (a.value != null && a.value != "") { // main process rules
				var r = new Expression();
				r.expressionString = a.value;
				asg.value = r;
			}
			this.addSubInput(asg);
		}
	}
	if (json.subprocessOutputs != null && json.subprocessOutputs.length > 0) {
		for (var i = 0; i < json.subprocessOutputs.length; i++) {
			var a = json.subprocessOutputs[i];
			var asg = new Assignment();
			asg.id = a.id;
			asg.type = a.type;
			asg.arrayIndex = a.arrayIndex;
			asg.variableString = a.variableString; // subprocess variable
			if (a.value != null && a.value != "") { // main process rules
				var r = new Expression();
				r.expressionString = a.value;
				asg.value = r;
			}
			this.addSubOutput(asg);
		}
	}

};

// A function for drawing the particle.
SubprocessPoint.prototype.drawToContext = function() {
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

	BuildTimeUtils.subProcessIcon48x48(this.context, this.x1 - 48, this.y1 - 48);

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

SubprocessPoint.prototype.isInMark = function(x, y) {
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
