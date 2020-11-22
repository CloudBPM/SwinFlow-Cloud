/**
 * Start point class
 */

function StartPointInstance() {
	// build time props
	this.id = "Start Point 00";
	this.name = "Start Point";
	this.x0 = 0; // top left corner X
	this.y0 = 0; // top left corner Y
	this.x1 = 0; // bottom right corner X
	this.y1 = 0; // bottom right corner X
	this.description = null;
	this.isParallelOutput = 0; // 0:no; 1:yes
	this.currOwner = null; // process ID
	this.owner = null; // organization ID
	this.inputs = []; // input transitions (arcs)
	this.outputs = []; // output transitions (arcs)
	this.accessibleVars = []; // accessible variables
	this.marks = []; // eight corner marks
	this.classtypename = "StartPointInstance";
	this.lastupdate = null;
	// runtime props
	this.status = 0; //
	// 0: launch form; 1: launch UI url
	this.launchUIType = 0;
	// launch form content (process home page) for process accessing
	this.launchFormContent = null; // released form object
	// The launch UI.
	this.launchUIUrl = null;
	// runtime props
	this.startTime = -1;
	this.endTime = -1;
	this.definitionId = null;
}

StartPointInstance.prototype = new StartPoint();

StartPointInstance.prototype.clone = function() {
	var a = new StartPointInstance();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.selected = this.selected; // is selected on canvas
	return a;
};

StartPointInstance.prototype.cloneAccessibleVarList = function() {
	var vars = [];
	if (this.accessibleVars != null && this.accessibleVars.length > 0) {
		for (var i = 0; i < this.accessibleVars.length; i++) {
			vars.push(this.accessibleVars[i].clone())
		}
	}
	return vars;
};

StartPointInstance.prototype.stringifyforJSON = function() {
	var a = new StartPointInstance();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.description = this.description;
	a.isParallelOutput = this.isParallelOutput;
	a.accessibleVars = this.accessibleVars;
	a.lastupdate = this.lastupdate;
	a.currOwner = this.currOwner; // process ID
	a.owner = this.owner; // organization ID
	a.launchUIType = this.launchUIType;
	a.launchUIUrl = this.launchUIUrl;
	if (this.launchFormContent != null) {
		// var f = this.launchFormContent.stringifyforJSON();
		// a.launchFormContent = f.formContent;
		a.launchFormContent = this.launchFormContent;
	}
	a.startTime = this.startTime;
	a.endTime = this.endTime;
	a.definitionId = this.definitionId;
	return a;
};

StartPointInstance.prototype.parse = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	this.description = json.description;
	this.isParallelOutput = json.isParallelOutput;
	this.lastupdate = Utils.getDateTime(json.lastupdate);
	this.currOwner = json.currOwner; // process ID
	this.owner = json.owner; // organization ID
	this.launchUIType = json.launchUIType;
	this.launchUIUrl = json.launchUIUrl;
	this.status = json.status;
	this.startTime = json.startTime;
	this.endTime = json.endTime;
	this.definitionId = json.definitionId;
	if (json.launchFormContent != null) {
		var f = new ReleasedForm();
		// f.parseFormFromJSON(JSON.parse(json.launchFormContent));
		f.parseFormFromJSON(json.launchFormContent);
		this.launchFormContent = f;
	}
	if (json.accessibleVars != null && json.accessibleVars.length > 0) {
		for (var i = 0; i < json.accessibleVars.length; i++) {
			var av = new AccessibleVariable();
			av.taskId = json.accessibleVars[i].parent;
			av.varId = json.accessibleVars[i].varId;
			av.accessControl = json.accessibleVars[i].accessControl;
			av.currOwner = json.accessibleVars[i].currOwner;
			av.owner = json.accessibleVars[i].owner;
			av.componentId = json.accessibleVars[i].componentId;
			this.accessibleVars.push(av);
		}
	}
};

StartPointInstance.prototype.fetchAccessibleVar = function(id) {
	if (this.accessibleVars != null && this.accessibleVars.length > 0) {
		for (var i = 0; i < this.accessibleVars.length; i++) {
			if (this.accessibleVars[i].varId == id) {
				return this.accessibleVars[i];
			}
		}
	}
	return null;
};

// A function for drawing the part.
StartPointInstance.prototype.drawToContext = function() {
	startIcon48x48(this.status, this.context, this.x0, this.y0);
	this.marks = Utils.createMarks(this.x0, this.y0, this.x1, this.y1);
	if (this.selected) {
		Utils.drawSelection(this.marks, this.context);
	}
};

StartPointInstance.prototype.isInMark = function(x, y) {
	return "default";
};

StartPointInstance.prototype.verify = function(owner) {
	return this.verifyAccessible(owner) && this.verifyBound(owner);
};

StartPointInstance.prototype.verifyAccessible = function(owner) {
	var f = false;
	if (this.accessibleVars != null && this.accessibleVars.length > 0) {
		for (var j = 0; j < this.accessibleVars.length; j++) {
			for (var i = 0; i < owner.children.length; i++) {
				if (owner.children[i] instanceof DataVariable) {
					if (this.accessibleVars[j].varId == owner.children[i].id) {
						f = true;
						break;
					}
				}
			}
			if (f) {
				continue;
			} else {
				return false;
			}
		}
	}
	return true;
};

StartPointInstance.prototype.verifyBound = function(owner) {
	if (this.launchFormContent == null) {
		return true;
	}
	var formVars = this.launchFormContent.fetchBoundComponents();
	if (formVars != null && formVars.length > 0) {
		for (var i = 0; i < formVars.length; i++) {
			var acv = null;
			if (this.accessibleVars != null && this.accessibleVars.length > 0) {
				for (var j = 0; j < this.accessibleVars.length; j++) {
					if (this.accessibleVars[j].varId == formVars[i].varId) {
						acv = this.accessibleVars[j];
						break;
					}
				}
			}
			if (acv == null) {
				return false;
			}
		}
	}
	if (this.accessibleVars != null && this.accessibleVars.length > 0) {
		for (var j = 0; j < this.accessibleVars.length; j++) {
			var fmc = null;
			if (this.accessibleVars[j].componentId != null) {
				if (formVars != null && formVars.length > 0) {
					for (var i = 0; i < formVars.length; i++) {
						if (this.accessibleVars[j].componentId == formVars[i].id) {
							fmc = formVars[i];
							break;
						}
					}
				}
				if (fmc == null) {
					return false;
				}
			}
		}
	}
	return false;
};