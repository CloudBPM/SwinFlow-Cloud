/**
 * Manual task class
 */

function ManualTask() {
	this.id = "Manual task 00";
	this.name = "Manual task";
	this.x0 = 0; // top left corner X
	this.y0 = 0; // top left corner Y
	this.x1 = 0; // bottom right corner X
	this.y1 = 0; // bottom right corner X
	this.status = 0; //
	this.description = null;
	this.isParallelInput = 0; // 0:no; 1:yes
	this.isParallelOutput = 0; // 0:no; 1:yes
	this.currOwner = null; // process
	this.owner = null; // organization
	this.inputs = []; // input transitions (arcs)
	this.outputs = []; // output transitions (arcs)
	this.marks = []; // eight corner marks
	this.classtypename = "ManualTask";
	this.lastupdate = null;

	this.accessibleVars = []; // accessible variables
	this.participants = [];
	this.deadlineDays = -1;
	this.alarmDays = -1;
	// 0: every hour; 1: every day; 2: every two days; 3: every week;
	this.alarmFrequency = 0;
	// 0: moble; 1: email; 2: QQ; 3: WeChat
	this.alarmMethod = 0;
	// 0: end form; 1: end UI url
	this.uiType = 0;
	// The end UI url of external system.
	this.uiUrl = null;
	// this property describes the form content for manual task accessing
	this.formContent = null; // released form object
	this.expiryHandlerWfProcessId = null;

};

ManualTask.prototype = new AbstractTask();

ManualTask.prototype.clone = function() {
	var a = new ManualTask();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.selected = this.selected; // is selected on canvas
	return a;
};

ManualTask.prototype.cloneAccessibleVarList = function() {
	var vars = [];
	if (this.accessibleVars != null && this.accessibleVars.length > 0) {
		for (var i = 0; i < this.accessibleVars.length; i++) {
			vars.push(this.accessibleVars[i].clone());
		}
	}
	return vars;
};

ManualTask.prototype.cloneParticipantList = function() {
	var parts = [];
	if (this.participants != null && this.participants.length > 0) {
		for (var i = 0; i < this.participants.length; i++) {
			parts.push(this.participants[i].clone());
		}
	}
	return parts;
};

ManualTask.prototype.parse = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	this.description = json.description;
	this.isParallelOutput = json.isParallelOutput;
	this.isParallelInput = json.isParallelInput;
	this.lastupdate = Utils.getDateTime(json.lastupdate);
	this.currOwner = json.currOwner; // process ID
	this.owner = json.owner; // organization ID/
	this.deadlineDays = json.deadlineDays;
	this.alarmDays = json.alarmDays;
	this.alarmFrequency = json.alarmFrequency;
	this.alarmMethod = json.alarmMethod;
	this.uiType = json.uiType;
	this.uiUrl = json.uiUrl;
	this.expiryHandlerWfProcessId = json.expiryHandlerWfProcessId;
	if (json.formContent != null) {
		var f = new ReleasedForm();
		f.parseFormFromJSON(json.formContent);
		this.formContent = f;
	}
	if (json.accessibleVars != null && json.accessibleVars.length > 0) {
		for (var i = 0; i < json.accessibleVars.length; i++) {
			if (json.accessibleVars[i].classtypename == "AccessibleVariable") {
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
	}
	if (json.participants != null && json.participants.length > 0) {
		for (var i = 0; i < json.participants.length; i++) {
			if (json.participants[i].classtypename == "Participant") {
				var p = new Participant();
				p.id = json.participants[i].id;
				p.name = json.participants[i].name;
				p.taskId = json.participants[i].parent;
				p.participationType = json.participants[i].participationType;
				p.organizationId = json.participants[i].organizationId;
				p.organizationName = json.participants[i].organizationName;
				p.departmentId = json.participants[i].departmentId;
				p.departmentName = json.participants[i].departmentName;
				p.positionId = json.participants[i].positionId;
				p.positionName = json.participants[i].positionName;
				p.userId = json.participants[i].userId;
				p.userFullName = json.participants[i].userFullName;
				p.priority = json.participants[i].priority;
				p.currOwner = json.participants[i].currOwner;
				p.owner = json.participants[i].owner;
				this.participants.push(p);
			}
		}
	}
	
};

ManualTask.prototype.stringifyforJSON = function() {
	var a = new ManualTask();
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
	a.accessibleVars = this.accessibleVars;
	a.participants = this.participants;
	a.deadlineDays = this.deadlineDays;
	a.alarmDays = this.alarmDays;
	a.alarmFrequency = this.alarmFrequency;
	a.alarmMethod = this.alarmMethod;
	a.uiType = this.uiType;
	a.uiUrl = this.uiUrl;
	a.expiryHandlerWfProcessId = this.expiryHandlerWfProcessId;
	if (this.formContent != null) {
		//var f = this.formContent.stringifyforJSON();
		a.formContent = this.formContent;
	}
	return a;
};

// A function for drawing the particle.
ManualTask.prototype.drawToContext = function() {
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

	BuildTimeUtils.manualTaskIcon48x48(this.context, this.x1 - 48, this.y1 - 48);

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

ManualTask.prototype.fetchAccessibleVar = function(id) {
	if (this.accessibleVars != null && this.accessibleVars.length > 0) {
		for (var i = 0; i < this.accessibleVars.length; i++) {
			if (this.accessibleVars[i].varId == id) {
				return this.accessibleVars[i];
			}
		}
	}
	return null;
};

ManualTask.prototype.isInMark = function(x, y) {
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

ManualTask.prototype.verify = function(owner) {
	return this.verifyAccessible(owner) && this.verifyBound(owner);
};

ManualTask.prototype.verifyAccessible = function(owner) {
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

ManualTask.prototype.verifyBound = function(owner) {
	if (this.formContent == null) {
		return true;
	}
	var formVars = this.formContent.fetchBoundComponents();
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