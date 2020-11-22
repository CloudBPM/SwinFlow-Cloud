/**
 * This model is workflow process definition class
 */

function WfProcess() {
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
	this.classtypename = "WfProcess";
	this.status = 0; // 0: unlocked; 1: locked

};

WfProcess.prototype = new WorkflowEntity();

WfProcess.prototype.addChild = function(task) {
	this.children.push(task);
};

WfProcess.prototype.setVariable = function(datavar) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].id == datavar.id) {
			this.children.splice(i, 1);
			this.children.splice(i, 0, datavar);
			break;
		}
	}
};

WfProcess.prototype.sort = function() {
	this.children.sort(function(a, b) {
		if (a instanceof DataVariable && b instanceof DataVariable) {
			return a.orderNumber - b.orderNumber;
		}
		return 0;
	});
};

WfProcess.prototype.addChildren = function(selected) {
	for (var i = 0; i < selected.length; i++) {
		if (selected[i] instanceof AbstractTask) {
			this.addChild(selected[i]);
			if (selected[i].inputs.length > 0) {
				for (j = 0; j < selected[i].inputs.length; j++) {
					selected[i].inputs[j].source
							.addOutput(selected[i].inputs[j]);
				}
			}
			if (selected[i].outputs.length > 0) {
				for (j = 0; j < selected[i].outputs.length; j++) {
					selected[i].outputs[j].target
							.addInput(selected[i].outputs[j]);
				}
			}
		} else if (selected[i] instanceof Transition) {
			selected[i].source.addOutput(selected[i]);
			selected[i].target.addInput(selected[i]);
		}
	}
};

WfProcess.prototype.removeChild = function(obj) {
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
					obj.target.inputs.splice(k, 1);
					break;
				}
			}
		}
	} else if (obj instanceof DataVariable) {
		this.removeVariableById(obj.id);
	}
};

WfProcess.prototype.removeVariableById = function(id) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			if (this.children[i].id == id) {
				this.children.splice(i, 1);
				break;
			}
		}
	}
};

WfProcess.prototype.setContext = function(context) {
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

WfProcess.prototype.fetchWritableDataVars = function() {
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

WfProcess.prototype.fetchReadOnlyDataVars = function() {
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

WfProcess.prototype.getNewNumber = function() {
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

WfProcess.prototype.checkDuplicateName = function(name) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			if (this.children[i].name == name) {
				return true;
			}
		}
	}
	return false;
};

WfProcess.prototype.getNewTaskNumber = function() {
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

WfProcess.prototype.listVariables = function() {
	var variables = [];
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			variables.push(this.children[i]);
		}
	}
	return variables;
};

WfProcess.prototype.listVariablesByType = function(datatype) {
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

WfProcess.prototype.resortVariables = function() {
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

WfProcess.prototype.getVariableCount = function() {
	var number = 0;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			number++;
		}
	}
	return number;
};

WfProcess.prototype.seekChildByID = function(id) {
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
		} else if (this.children[i] instanceof SubprocessPoint) {
			for (var j = 0; j < this.children[i].subprocessInputs.length; j++) {
				if (this.children[i].subprocessInputs[j].id == id) {
					return this.children[i].subprocessInputs[j];
				}
			}
			for (var j = 0; j < this.children[i].subprocessOutputs.length; j++) {
				if (this.children[i].subprocessOutputs[j].id == id) {
					return this.children[i].subprocessOutputs[j];
				}
			}
		}
	}
	return null;
};

WfProcess.prototype.drawToContext = function() {
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

WfProcess.prototype.parseFromJSON = function(process) {
	if (process == null)
		return this;
	var newproc = this;
	newproc.id = process.id;
	newproc.code = process.code;
	newproc.name = process.name;
	newproc.processType = process.processType;
	newproc.workflowType = process.workflowType;// 0:
	newproc.accessLevel = process.accessLevel;// 0:
	newproc.authorId = process.authorId;
	newproc.author = process.author;
	newproc.description = process.description;
	newproc.keywords = process.keywords;
	newproc.parent = process.parent;
	newproc.lastupdate = Utils.getDateTime(process.lastupdate);
	newproc.owner = process.owner;
	newproc.status = process.status;
	newproc.purchasePrice = process.purchasePrice;
	newproc.usagePrice = process.usagePrice;
	if (process.children != null && process.children.length > 0) {
		for (var i = 0; i < process.children.length; i++) {
			var obj = process.children[i];
			if (obj.classtypename == "StartPoint") {
				var startpoint = new StartPoint();
				startpoint.parse(obj);
				newproc.addChild(startpoint);
			} else if (obj.classtypename == "EndPoint") {
				var endpoint = new EndPoint();
				endpoint.parse(obj);
				newproc.addChild(endpoint);
			} else if (obj.classtypename == "AssignTask") {
				var assigntask = new AssignTask();
				assigntask.parse(obj);
				newproc.addChild(assigntask);
			} else if (obj.classtypename == "ManualTask") {
				var manualtask = new ManualTask();
				manualtask.parse(obj);
				newproc.addChild(manualtask);
			} else if (obj.classtypename == "SubprocessPoint") {
				var sbp = new SubprocessPoint();
				sbp.parse(obj)
				newproc.addChild(sbp);
			} else if (obj.classtypename == "SystemTask") {
				var syst = new SystemTask();
				syst.parse(obj, newproc);
				newproc.addChild(syst);
			} else if (obj.classtypename == "WaitTask") {
				var wt = new WaitingTask();
				wt.parse(obj);
				newproc.addChild(wt);
			} else if (obj.classtypename == "EmailReceivingTask") {
				var wt = new EmailReceivingTask();
				wt.parse(obj);
				newproc.addChild(wt);
			} else if (obj.classtypename == "EmailSendingTask") {
				var wt = new EmailSendingTask();
				wt.parse(obj);
				newproc.addChild(wt);
			} else if (obj.classtypename == "SMSReceivingTask") {
				var wt = new SMSReceivingTask();
				wt.parse(obj);
				newproc.addChild(wt);
			} else if (obj.classtypename == "SMSSendingTask") {
				var wt = new SMSSendingTask();
				wt.parse(obj);
				newproc.addChild(wt);
			} else if (obj.classtypename == "DataVariable") {
				var variable = new DataVariable();
				variable.parse(obj);
				newproc.addChild(variable);
			} else if (obj.classtypename == "ArrayDataVariable") {
				var variable = new ArrayDataVariable();
				variable.parse(obj);
				newproc.addChild(variable);
			}
		}
	}
	// parse rule or expression or configure variables
	for (i = 0; i < newproc.children.length; i++) {
		if (newproc.children[i] instanceof WaitingTask) {
			if (newproc.children[i].timeRule != null) {
				newproc.children[i].timeRule.parseExpressionString(newproc);
			}
		} else if (newproc.children[i] instanceof AssignTask) {
			for (var k = 0; k < newproc.children[i].assignments.length; k++) {
				newproc.children[i].assignments[k].parseAllString(newproc);
			}
		} else if (newproc.children[i] instanceof SubprocessPoint) {
			for (var k = 0; k < newproc.children[i].subprocessInputs.length; k++) {
				newproc.children[i].subprocessInputs[k].parseValue(newproc);
			}
			for (var k = 0; k < newproc.children[i].subprocessOutputs.length; k++) {
				newproc.children[i].subprocessOutputs[k].parseVariable(newproc);
			}
		} else if (newproc.children[i] instanceof SystemTask) {
			var task = newproc.children[i];
			if (task.pathParameters.length > 0) {
				for (var j = 0; j < task.pathParameters.length; j++) {
					if (task.pathParameters[j].value != null)
						task.pathParameters[j].value
								.parseExpressionString(newproc);
				}
			}
			if (task.formParameters.length > 0) {
				for (var j = 0; j < task.formParameters.length; j++) {
					if (task.formParameters[j].value != null)
						task.formParameters[j].value
								.parseExpressionString(newproc);
				}
			}
			if (task.returnString != null && task.returnString != "") {
				var s = task.returnString.split("@");
				if (s.length > 0) {
					task.returnObject = newproc.seekChildByID(s[0]);
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
		} else if (newproc.children[i] instanceof EmailSendingTask) {
			var task = newproc.children[i];
			if (task.variables != null && task.variables.length > 0) {
				var l = [];
				for (var j = 0; j < task.variables.length; j++) {
					l.push(newproc.seekChildByID(task.variables[j]))
				}
				task.variables = l;
			}
		}
	}
	if (process.children.length > 0) {
		for (var i = 0; i < process.children.length; i++) {
			var child = process.children[i];
			if (child.outputs != undefined) {
				if (child.outputs.length > 0) {
					for (var j = 0; j < child.outputs.length; j++) {
						var output = new Transition();
						output.parse(child.outputs[j], newproc);
					}
				}
			}
		}
	}
	return newproc;
};

WfProcess.prototype.stringifyforJSON = function() {
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
