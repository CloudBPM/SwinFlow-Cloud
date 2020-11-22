/**
 * End point class
 */

function EndPoint() {
	this.id = "End Point 00"; // top left corner X
	this.name = "End Point"; // top left corner Y
	this.x0 = 0; // top left corner X
	this.y0 = 0; // top left corner Y
	this.x1 = 0; // bottom right corner X
	this.y1 = 0; // bottom right corner X
	this.status = 0; //
	this.description = null;
	this.isParallelInput = 0;// 0:no; 1:yes
	this.currOwner = null; // process ID
	this.owner = null; // organization ID
	this.inputs = []; // input transitions (arcs)
	this.outputs = []; // output transitions (arcs)
	this.accessibleVars = []; // accessible variables
	this.marks = []; // eight corner marks
	this.classtypename = "EndPoint";
	this.lastupdate = null;

	// 0: end form; 1: end UI url
	this.endUIType = 0;
	// The end UI url of external system.
	this.endUIUrl = null;
	// end form content (process end page) for process accessing
	this.endFormContent = null; // released form object
};

EndPoint.prototype = new AbstractTask();

EndPoint.prototype.clone = function() {
	var a = new EndPoint();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.selected = this.selected; // is selected on canvas
	return a;
};

EndPoint.prototype.cloneAccessibleVarList = function() {
	var vars = [];
	if (this.accessibleVars != null && this.accessibleVars.length > 0) {
		for (var i = 0; i < this.accessibleVars.length; i++) {
			vars.push(this.accessibleVars[i].clone())
		}
	}
	return vars;
};

EndPoint.prototype.parse = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	this.description = json.description;
	this.isParallelInput = json.isParallelInput;
	this.lastupdate = Utils.getDateTime(json.lastupdate)
	this.currOwner = json.currOwner; // process ID
	this.owner = json.owner; // organization ID
	this.endUIType = json.endUIType;
	this.endUIUrl = json.endUIUrl;
	if (json.endFormContent != null) {
		var f = new ReleasedForm();
		//f.parseFormFromJSON(JSON.parse(json.endFormContent));
		f.parseFormFromJSON(json.endFormContent);
		this.endFormContent = f;
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

EndPoint.prototype.stringifyforJSON = function() {
	var a = new EndPoint();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.description = this.description;
	a.isParallelInput = this.isParallelInput;
	a.lastupdate = this.lastupdate;
	a.currOwner = this.currOwner; // process ID
	a.owner = this.owner; // organization ID
	a.accessibleVars = this.accessibleVars;
	a.endUIType = this.endUIType;
	a.endUIUrl = this.endUIUrl;
	if (this.endFormContent != null) {
		//var f = this.endFormContent.stringifyforJSON();
		//a.endFormContent = f.formContent;
		a.endFormContent = this.endFormContent;
	}
	return a;
};

EndPoint.prototype.fetchAccessibleVar = function(id) {
	if (this.accessibleVars != null && this.accessibleVars.length > 0) {
		for (var i = 0; i < this.accessibleVars.length; i++) {
			if (this.accessibleVars[i].varId == id) {
				return this.accessibleVars[i];
			}
		}
	}
	return null;
};

// A function for drawing the particle.
EndPoint.prototype.drawToContext = function() {
	BuildTimeUtils.endIcon48x48(this.context, this.x0, this.y0);
	this.marks = Utils.createMarks(this.x0, this.y0, this.x1, this.y1);
	if (this.selected) {
		Utils.drawSelection(this.marks, this.context);
	}
};

EndPoint.prototype.isInMark = function(x, y) {
	return "default";
};

EndPoint.prototype.verify = function(owner) {
	return this.verifyAccessible(owner) && this.verifyBound(owner);
};

EndPoint.prototype.verifyAccessible = function(owner) {
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

EndPoint.prototype.verifyBound = function(owner) {
	if (this.endFormContent == null) {
		return true;
	}
	var formVars = this.endFormContent.fetchBoundComponents();
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