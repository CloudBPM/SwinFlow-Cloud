/**
 * This is an abstract task for being inherited by all task class.
 */

function AbstractTask() {
	this.id = "Abstract Task 0000";
	this.name = "Abstract Task";
	this.classtypename = "AbstractTask";
	this.x0 = 0;
	this.y0 = 0;
	this.x1 = 0;
	this.y1 = 0;
	this.selected = false;
	this.inputs = []; // input transitions (arcs)
	this.outputs = []; // output transitions (arcs)
	// DEFAULT = 0;ENABLED = 1;RUNNING = 2;COMPLETED = 3;
	// UNUSED = 4;EXCEPTION = 5;SKIPPED = 6;TERMINATED = 7;
	this.status = 0; //
	this.lastupdate = null;
};

AbstractTask.prototype = new WorkflowEntity();

AbstractTask.prototype.addInput = function(transition) {
	this.inputs.push(transition);
};

AbstractTask.prototype.addOutput = function(transition) {
	this.outputs.push(transition);
};

AbstractTask.prototype.removeOutput = function(transition) {
	for (i = 0; i < this.outputs.length; i++) {
		if (this.outputs[i].id == transition.id
				|| this.outputs[i] == transition) {
			this.outputs.splice(i, 1);
			break;
		}
	}
};

AbstractTask.prototype.removeInput = function(transition) {
	for (i = 0; i < this.inputs.length; i++) {
		if (this.inputs[i].id == transition.id || this.inputs[i] == transition) {
			this.inputs.splice(i, 1);
			break;
		}
	}
};

AbstractTask.prototype.hasInputs = function() {
	return this.inputs.length > 0;
};

AbstractTask.prototype.hasOutputs = function() {
	return this.outputs.length > 0;
};

AbstractTask.prototype.getOutputById = function(id) {
	for (i = 0; i < this.outputs.length; i++) {
		if (this.outputs[i].id == id) {
			return this.outputs[i];
		}
	}
	return null;
};

AbstractTask.prototype.getNewNumber = function(transition) {
	var number = -1;
	for (i = 0; i < this.outputs.length; i++) {
		if (number < 0) {
			number = this.outputs[i].orderNumber;
		} else {
			if (this.outputs[i].orderNumber > number)
				number = this.outputs[i].orderNumber;
		}
	}
	return number + 1;
};

// A function for drawing the particle.
AbstractTask.prototype.drawToContext = function() {
};
