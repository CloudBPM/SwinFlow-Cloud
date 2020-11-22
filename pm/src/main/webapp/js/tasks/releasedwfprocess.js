/**
 * This model is workflow process definition class
 */

function ReleasedWfProcess() {
	// build time props
	this.id = null;
	this.code = null;
	this.name = null;
	this.processType = 0;// 0:
	this.workflowType = 0;// 0:
	this.accessLevel = 0;// 0:
	this.authorId = null;
	this.author = null;
	this.description = null;
	this.keywords = null;
	this.purchasePrice = 0;
	this.usagePrice = 0;
	this.lastupdate = null;
	this.parent = null; // folder ID or subprocess point ID
	this.owner = null; // organization ID
	this.children = []; // graph nodes.
	this.classtypename = "ReleasedWfProcess";
	this.status = 0; // 0: unlocked; 1: locked

	this.version = null;
	this.releaserId = null;
	this.releaser = null;
	this.releaseStatement = null;
	this.releaseDate = null;
	// 0: no trial; 1: 1 month trial; 2: 3 months;
	// 3: 6 months; 4: 9 months; 5: 12 months;
	this.trialPeriod = 0;
	this.totalDownloading = 0;
	this.totalUseCounting = 0;
	this.successCounting = 0;
	this.terminationCounting = 0;
	this.suspensionCounting = 0;
	this.likeCounting = 0;
	// 1:deprecated(not use any more);0:still use
	this.deprecated = 1;
	// 1: has icon; 0: no icon
	this.hasIcon = 0;
	this.icon = null;

};

ReleasedWfProcess.prototype = new WorkflowEntity();

ReleasedWfProcess.prototype.addChild = function(task) {
	this.children.push(task);
};

ReleasedWfProcess.prototype.setVariable = function(datavar) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].id == datavar.id) {
			this.children.splice(i, 1);
			this.children.splice(i, 0, datavar);
			break;
		}
	}
};

ReleasedWfProcess.prototype.removeChild = function(obj) {
	if (obj == null)
		return;
	// obj maybe a task and a transition
	if (obj instanceof AbstractTask) {
		if (obj.hasInputs()) {
			for (var j = 0; j < obj.inputs.length; j++) {
				for (var k = 0; k < obj.inputs[j].source.outputs.length; k++) {
					if (obj.inputs[j].id == obj.inputs[j].source.outputs[k].id) {
						obj.inputs[j].source.outputs.splice(k, 1);
						break;
					}
				}
			}
		}
		if (obj.hasOutputs()) {
			for (var j = 0; j < obj.outputs.length; j++) {
				for (k = 0; k < obj.outputs[j].target.inputs.length; k++) {
					if (obj.outputs[j].id == obj.outputs[j].target.inputs[k].id) {
						obj.outputs[j].target.inputs.splice(k, 1);
						break;
					}
				}
			}
		}
		var index = this.children.indexOf(obj);
		if (index > -1) {
			this.children.splice(index, 1);
		}
	} else if (obj instanceof Transition) {
		if (obj.source != null) {
			for (var k = 0; k < obj.source.outputs.length; k++) {
				if (obj.source.outputs[k].id == obj.id) {
					obj.source.outputs.splice(k, 1);
					break;
				}
			}
		}
		if (obj.target != null) {
			for (var k = 0; k < obj.target.inputs.length; k++) {
				if (obj.target.inputs[k].id == obj.id) {
					obj.targt.inputs.splice(k, 1);
					break;
				}
			}
		}
	} else if (obj instanceof DataVariable) {
		this.removeVariableById(obj.id);
	}
};

ReleasedWfProcess.prototype.sort = function() {
	this.children.sort(function(a, b) {
		if (a instanceof DataVariable && b instanceof DataVariable) {
			return a.orderNumber - b.orderNumber;
		}
		return 0;
	});
};

ReleasedWfProcess.prototype.removeVariableById = function(id) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			if (this.children[i].id == id) {
				this.children.splice(i, 1);
				break;
			}
		}
	}
};

ReleasedWfProcess.prototype.setContext = function(context) {
	this.context = context;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof AbstractTask) {
			this.children[i].context = context;
			for (j = 0; j < this.children[i].outputs.length; j++) {
				// draw output transitions...
				this.children[i].outputs[j].context = context;
			}
		}
	}
};

ReleasedWfProcess.prototype.fetchWritableDataVars = function() {
	var writableVars = [];
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof StartPoint) {
			for (j = 0; j < this.children[i].accessibleVars.length; j++) {
				for (var k = 0; k < this.children.length; k++) {
					if (this.children[k] instanceof DataVariable) {
						if (this.children[k].id == this.children[i].accessibleVars[j].varId) {
							writableVars.push(this.children[k]);
						}
					}
				}
			}
		}
	}
	return writableVars;
};

ReleasedWfProcess.prototype.fetchReadOnlyDataVars = function() {
	var writableVars = [];
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof EndPoint) {
			for (j = 0; j < this.children[i].accessibleVars.length; j++) {
				for (var k = 0; k < this.children.length; k++) {
					if (this.children[k] instanceof DataVariable) {
						if (this.children[k].id == this.children[i].accessibleVars[j].varId) {
							writableVars.push(this.children[k]);
						}
					}
				}
			}
		}
	}
	return writableVars;
};

ReleasedWfProcess.prototype.getNewNumber = function() {
	var number = -1;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			if (number < 0) {
				number = this.children[i].orderNumber;
			} else {
				if (this.children[i].orderNumber > number)
					number = this.children[i].orderNumber;
			}
		}
	}
	return number + 1;
};

ReleasedWfProcess.prototype.getNewTaskNumber = function() {
	var number = 1;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof AbstractTask) {
			if (!(this.children[i] instanceof StartPoint)
					&& !(this.children[i] instanceof EndPoint)) {
				number++;
			}
		}
	}
	return number;
};

ReleasedWfProcess.prototype.listVariables = function() {
	var variables = [];
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			variables.push(this.children[i]);
		}
	}
	return variables;
};

ReleasedWfProcess.prototype.listVariablesByType = function(datatype) {
	var variables = [];
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			if (datatype == this.children[i].datatype) {
				variables.push(this.children[i]);
			}
		}
	}
	return variables;
};

ReleasedWfProcess.prototype.resortVariables = function() {
	var i = 0, tmparr = [];
	while (i < this.children.length) {
		if (this.children[i] instanceof DataVariable) {
			var tmp = this.children.splice(i, 1); // remove
			if (tmparr.length > 0) {
				var inserted = false;
				for (var j = 0; j < tmparr.length; j++) {
					if (tmparr[j].orderNumber > tmp[0].orderNumber) {
						tmparr.splice(j, 0, tmp[0]); // insert
						inserted = true;
						break;
					}
				}
				if (!inserted) {
					tmparr.push(tmp[0]);
				}
			} else {
				tmparr.push(tmp[0]);
			}
		} else {
			i++;
		}
	}
	this.children = this.children.concat(tmparr);
};

ReleasedWfProcess.prototype.getVariableCount = function() {
	var number = 0;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			number++;
		}
	}
	return number;
};

ReleasedWfProcess.prototype.seekChildByID = function(id) {
	if (id == null)
		return null;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].id == id) {
			return this.children[i];
		}
		if (this.children[i] instanceof AssignTask) {
			for (var j = 0; j < this.children[i].assignments.length; j++) {
				if (this.children[i].assignments[j].id == id) {
					return this.children[i].assignments[j];
				}
			}
		}
	}
	return null;
};

ReleasedWfProcess.prototype.drawToContext = function() {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof AbstractTask) {
			this.children[i].drawToContext();
			for (j = 0; j < this.children[i].outputs.length; j++) {
				// draw output transitions...
				this.children[i].outputs[j].drawToContext();
			}
		}
	}
};

ReleasedWfProcess.prototype.parseFromJSON = function(json) {

	this.id = json.id;
	this.code = json.code;
	this.name = json.name;
	this.processType = json.processType;
	this.workflowType = json.workflowType;// 0:
	this.accessLevel = json.accessLevel;// 0:
	this.authorId = json.authorId;
	this.author = json.author;
	this.description = json.description;
	this.keywords = json.keywords;
	this.parent = json.parent;
	this.lastupdate = Utils.getDateTime(json.lastupdate);
	this.owner = json.owner;
	this.status = json.status;
	this.purchasePrice = json.purchasePrice;
	this.usagePrice = json.usagePrice;

	this.version = json.version;
	this.releaserId = json.releaserId;
	this.releaser = json.releaser;
	this.releaseStatement = json.releaseStatement;
	this.releaseDate = Utils.getDateTime(json.releaseDate);
	this.deprecated = json.deprecated;
	this.likeCounting = json.likeCounting;
	this.totalUseCounting = json.totalUseCounting;
	this.successCounting = json.successCounting;
	this.terminationCounting = json.terminationCounting;
	this.suspensionCounting = json.suspensionCounting;
	this.trialPeriod = json.trialPeriod;
	this.totalDownloading = json.totalDownloading;

	if (json.processContent != null) {
		var o = JSON.parse(json.processContent);
		this.parseContentFromJSON(o);
	}
	return this;
};

ReleasedWfProcess.prototype.parseContentFromJSON = function(p) {
	if (p.children != null && p.children.length > 0) {
		for (var i = 0; i < p.children.length; i++) {
			var obj = p.children[i];
			if (obj.classtypename == "StartPoint") {
				var startpoint = new StartPoint();
				startpoint.parse(obj);
				this.addChild(startpoint);
			} else if (obj.classtypename == "EndPoint") {
				var endpoint = new EndPoint();
				endpoint.parse(obj);
				this.addChild(endpoint);
			} else if (obj.classtypename == "AssignTask") {
				var assigntask = new AssignTask();
				assigntask.parse(obj);
				this.addChild(assigntask);
			} else if (obj.classtypename == "ManualTask") {
				var manualtask = new ManualTask();
				manualtask.parse(obj);
				this.addChild(manualtask);
			} else if (obj.classtypename == "SubprocessPoint") {
				var sbp = new SubprocessPoint();
				sbp.parse(obj)
				this.addChild(sbp);
			} else if (obj.classtypename == "SystemTask") {
				var syst = new SystemTask();
				syst.parse(obj, this);
				this.addChild(syst);
			} else if (obj.classtypename == "WaitTask") {
				var wt = new WaitingTask();
				wt.parse(obj);
				this.addChild(wt);
			} else if (obj.classtypename == "EmailReceivingTask") {
				var wt = new EmailReceivingTask();
				wt.parse(obj);
				this.addChild(wt);
			} else if (obj.classtypename == "EmailSendingTask") {
				var wt = new EmailSendingTask();
				wt.parse(obj);
				this.addChild(wt);
			} else if (obj.classtypename == "SMSReceivingTask") {
				var wt = new SMSReceivingTask();
				wt.parse(obj);
				this.addChild(wt);
			} else if (obj.classtypename == "SMSSendingTask") {
				var wt = new SMSSendingTask();
				wt.parse(obj);
				this.addChild(wt);
			} else if (obj.classtypename == "DataVariable") {
				var variable = new DataVariable();
				variable.parse(obj);
				this.addChild(variable);
			} else if (obj.classtypename == "ArrayDataVariable") {
				var variable = new ArrayDataVariable();
				variable.parse(obj);
				this.addChild(variable);
			}
		}
	}
	// parse rule or expression or configure variables
	for (i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof WaitingTask) {
			if (this.children[i].timeRule != null) {
				this.children[i].timeRule.parseExpressionString(this);
			}
		} else if (this.children[i] instanceof AssignTask) {
			for (var k = 0; k < this.children[i].assignments.length; k++) {
				this.children[i].assignments[k].parseAllString(this);
			}
		} else if (this.children[i] instanceof SubprocessPoint) {
			for (var k = 0; k < this.children[i].subprocessInputs.length; k++) {
				this.children[i].subprocessInputs[k].parseValue(this);
			}
			for (var k = 0; k < this.children[i].subprocessOutputs.length; k++) {
				this.children[i].subprocessOutputs[k].parseVariable(this);
			}
		} else if (this.children[i] instanceof SystemTask) {
			var task = this.children[i];
			if (task.pathParameters.length > 0) {
				for (var j = 0; j < task.pathParameters.length; j++) {
					if (task.pathParameters[j].value != null)
						task.pathParameters[j].value
								.parseExpressionString(this);
				}
			}
			if (task.formParameters.length > 0) {
				for (var j = 0; j < task.formParameters.length; j++) {
					if (task.formParameters[j].value != null)
						task.formParameters[j].value
								.parseExpressionString(this);
				}
			}
			if (task.returnString != null && task.returnString != "") {
				var s = task.returnString.split("@");
				if (s.length > 0) {
					task.returnObject = this.seekChildByID(s[0]);
					if (task.returnObject == null) {
						task.returnObject = new DataVariable();
						task.returnObject.datatype = s[1];
						if (s[1] == "File" || s[1] == "file") {
							task.returnObject.value = new FileConstant();
						} else {
							task.returnObject.value = new StringConstant();
						}
					}
					if (s.length > 2) {
						task.returnObject.description = s[2];
					}
				}
			}
		} else if (this.children[i] instanceof EmailSendingTask) {
			var task = this.children[i];
			if (task.variables != null && task.variables.length > 0) {
				var l = [];
				for (var j = 0; j < task.variables.length; j++) {
					l.push(this.seekChildByID(task.variables[j]));
				}
				task.variables = l;
			}
		}
	}
	if (p.children.length > 0) {
		for (var i = 0; i < p.children.length; i++) {
			var child = p.children[i];
			if (child.outputs != undefined) {
				if (child.outputs.length > 0) {
					for (var j = 0; j < child.outputs.length; j++) {
						var output = new Transition();
						output.parse(child.outputs[j], this);
					}
				}
			}
		}
	}
};

ReleasedWfProcess.prototype.stringifyforJSON = function() {
	var proc = new WfProcess();
	proc.id = this.id;
	proc.code = this.code;
	proc.name = this.name;
	proc.processType = this.processType;// 0:
	proc.workflowType = this.workflowType;// 0:
	proc.accessLevel = this.accessLevel;// 0:
	proc.authorId = this.authorId;
	proc.author = this.author;
	proc.description = this.description;
	proc.keywords = this.keywords;
	proc.parent = this.parent; // folder ID or subprocess point ID
	proc.owner = this.owner; // organization ID
	proc.lastupdate = this.lastupdate;
	proc.status = this.status;
	proc.purchasePrice = this.purchasePrice;
	proc.usagePrice = this.usagePrice;

	proc.version = this.version;
	proc.releaserId = this.releaserId;
	proc.releaser = this.releaser;
	proc.releaseStatement = this.releaseStatement;
	proc.releaseDate = this.releaseDate;
	proc.deprecated = this.deprecated;
	proc.trialPeriod = this.trialPeriod;

	if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i] instanceof AbstractTask) {
				proc.children[i] = this.children[i].stringifyforJSON();
				if (this.children[i].outputs.length > 0) {
					for (var j = 0; j < this.children[i].outputs.length; j++) {
						proc.children[i].outputs[j] = this.children[i].outputs[j]
								.stringifyforJSON();
					}
				}
			} else if (this.children[i] instanceof DataVariable) {
				proc.children[i] = this.children[i].stringifyforJSON();
			}
		}
	}
	return proc;
};
