/**
 * This model is workflow process definition class
 */

function WfProcessInstance() {
	// build time props
	this.id = null;
	this.code = null;
	this.name = null;
	this.processType = 0;// 0:
	this.workflowType = 0;// 0:
	this.accessLevel = 0;// 0:
	this.author = null;
	this.description = null;
	this.keywords = null;
	this.purchasePrice = 0;
	this.usagePrice = 0;
	this.lastupdate = null;
	this.parent = null; // folder ID or subprocess point ID
	this.owner = null; // organization ID
	this.children = []; // graph nodes.
	this.classtypename = "WfProcessInstance";
	this.status = 0; // 0: unlocked; 1: locked

	this.version = null;
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
	// runtime props
	this.wfProcessId = null;
	this.launchUserId = null;
	this.launchUser = null;
	this.idType = null;
	this.idNumber = null;
	this.mobileNumber = null;
	this.staffLaunched = null;
	/** the time stamp of launching this process instance on server */
	this.launchTime = -1;
	/** the time stamp of initializing this process instance on server */
	this.startTime = -1;
	/**
	 * this is a long integer array due to possible multiple suspension. the
	 * time stamp of launching this process instance on server
	 */
	this.suspensionTime = [];
	/** the array of the time stamp when this process instance was updated */
	this.updateTime = [];
	/** the time stamp of terminating this process instance on server */
	this.terminationTime = -1;
	this.ipv4 = null;
	this.ipv6 = null;
	/** the time stamp of completing this process instance on server */
	this.endTime = -1;
	/** the device which client is launch this process instance */
	this.device = null;
	/** the longitude at which client device is */
	this.longitude = null;
	/** the latitude at which client device is */
	this.latitude = null;

};

WfProcessInstance.prototype = new ReleasedWfProcess();

WfProcessInstance.prototype.addChild = function(task) {
	this.children.push(task);
};

WfProcessInstance.prototype.setVariable = function(datavar) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].id == datavar.id) {
			this.children.splice(i, 1);
			this.children.splice(i, 0, datavar);
			break;
		}
	}
};

WfProcessInstance.prototype.removeChild = function(obj) {
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

WfProcessInstance.prototype.sort = function() {
	this.children.sort(function(a, b) {
		if (a instanceof DataVariable && b instanceof DataVariable) {
			return a.orderNumber - b.orderNumber;
		}
		return 0;
	});
};

WfProcessInstance.prototype.removeVariableById = function(id) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			if (this.children[i].id == id) {
				this.children.splice(i, 1);
				break;
			}
		}
	}
};

WfProcessInstance.prototype.setContext = function(context) {
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

WfProcessInstance.prototype.fetchWritableDataVars = function() {
	var writableVars = [];
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof StartPointInstance) {
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

WfProcessInstance.prototype.fetchReadOnlyDataVars = function() {
	var writableVars = [];
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof EndPointInstance) {
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

WfProcessInstance.prototype.getNewNumber = function() {
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

WfProcessInstance.prototype.getNewTaskNumber = function() {
	var number = 1;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof AbstractTask) {
			if (!(this.children[i] instanceof StartPointInstance)
					&& !(this.children[i] instanceof EndPointInstance)) {
				number++;
			}
		}
	}
	return number;
};

WfProcessInstance.prototype.listVariables = function() {
	var variables = [];
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			variables.push(this.children[i]);
		}
	}
	return variables;
};

WfProcessInstance.prototype.resortVariables = function() {
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

WfProcessInstance.prototype.getVariableCount = function() {
	var number = 0;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof DataVariable) {
			number++;
		}
	}
	return number;
};

WfProcessInstance.prototype.seekChildByID = function(id) {
	if (id == null)
		return null;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].id == id) {
			return this.children[i];
		}
		if (this.children[i] instanceof AssignTaskInstance) {
			for (var j = 0; j < this.children[i].assignments.length; j++) {
				if (this.children[i].assignments[j].id == id) {
					return this.children[i].assignments[j];
				}
			}
		}
	}
	return null;
};

WfProcessInstance.prototype.drawToContext = function() {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof AbstractTask) {
			this.children[i].drawToContext();
			for (j = 0; j < this.children[i].outputs.length; j++) {
				// only draw output transitions...
				this.children[i].outputs[j].drawToContext();
			}
		}
	}
};

WfProcessInstance.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.code = json.code;
	this.name = json.name;
	this.processType = json.processType;
	this.workflowType = json.workflowType;// 0:
	this.accessLevel = json.accessLevel;// 0:
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
	
	// runtime props
	this.wfProcessId = json.wfProcessId;
	this.launchUserId = json.launchUserId;
	this.launchUser = json.launchUser;
	this.idType = json.idType;
	this.idNumber = json.idNumber;
	this.mobileNumber = json.mobileNumber;
	this.staffLaunched = json.staffLaunched;

	this.launchTime = json.launchTime;
	this.startTime = json.startTime;
	this.suspensionTime = json.suspensionTime;
	this.updateTime = json.updateTime;
	this.terminationTime = json.terminationTime;
	this.ipv4 = json.ipv4;
	this.ipv6 = json.ipv6;
	this.endTime = json.endTime;
	this.device = json.device;
	this.longitude = json.longitude;
	this.latitude = json.latitude;

	// if (json.processContent != null) {
	// var o = JSON.parse(json.processContent);
	// this.parseContentFromJSON(o);
	// }
	this.parseContentFromJSON(json);

	return this;
};

WfProcessInstance.prototype.parseContentFromJSON = function(p) {
	if (p.children != null && p.children.length > 0) {
		for (var i = 0; i < p.children.length; i++) {
			var obj = p.children[i];
			if (obj.classtypename == "StartPointInstance") {
				var startpoint = new StartPointInstance();
				startpoint.parse(obj);
				this.addChild(startpoint);
			} else if (obj.classtypename == "EndPointInstance") {
				var endpoint = new EndPointInstance();
				endpoint.parse(obj);
				this.addChild(endpoint);
			} else if (obj.classtypename == "AssignTaskInstance") {
				var assigntask = new AssignTaskInstance();
				assigntask.parse(obj);
				this.addChild(assigntask);
			} else if (obj.classtypename == "ManualTaskInstance") {
				var manualtask = new ManualTaskInstance();
				manualtask.parse(obj);
				this.addChild(manualtask);
			} else if (obj.classtypename == "SubprocessPointInstance") {
				var sbp = new SubprocessPointInstance();
				sbp.parse(obj)
				this.addChild(sbp);
			} else if (obj.classtypename == "SystemTaskInstance") {
				var syst = new SystemTaskInstance();
				syst.parse(obj, this);
				this.addChild(syst);
			} else if (obj.classtypename == "WaitTaskInstance") {
				var wt = new WaitingTaskInstance();
				wt.parse(obj);
				this.addChild(wt);
			} else if (obj.classtypename == "EmailReceivingTaskInstance") {
				var wt = new EmailReceivingTaskInstance();
				wt.parse(obj);
				this.addChild(wt);
			} else if (obj.classtypename == "EmailSendingTaskInstance") {
				var wt = new EmailSendingTaskInstance();
				wt.parse(obj);
				this.addChild(wt);
			} else if (obj.classtypename == "SMSReceivingTaskInstance") {
				var wt = new SMSReceivingTaskInstance();
				wt.parse(obj);
				this.addChild(wt);
			} else if (obj.classtypename == "SMSSendingTaskInstance") {
				var wt = new SMSSendingTaskInstance();
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
		if (this.children[i] instanceof WaitingTaskInstance) {
			if (this.children[i].timeRule != null) {
				this.children[i].timeRule.parseExpressionString(this);
			}
		} else if (this.children[i] instanceof AssignTaskInstance) {
			for (var k = 0; k < this.children[i].assignments.length; k++) {
				this.children[i].assignments[k].parseAllString(this);
			}
		} else if (this.children[i] instanceof SubprocessPointInstance) {
			for (var k = 0; k < this.children[i].subprocessInputs.length; k++) {
				this.children[i].subprocessInputs[k].parseValue(this);
			}
			for (var k = 0; k < this.children[i].subprocessOutputs.length; k++) {
				this.children[i].subprocessOutputs[k].parseVariable(this);
			}
		} else if (this.children[i] instanceof SystemTaskInstance) {
			var task = this.children[i];
			if (task.parameters.length > 0) {
				for (var j = 0; j < task.parameters.length; j++) {
					if (task.parameters[j].value != null)
						task.parameters[j].value.parseExpressionString(this);
				}
			}
			if (task.extraParameters.length > 0) {
				for (var j = 0; j < task.extraParameters.length; j++) {
					if (task.extraParameters[j].value != null)
						task.extraParameters[j].value
								.parseExpressionString(this);
				}
			}

		}
	}
	if (p.children.length > 0) {
		for (var i = 0; i < p.children.length; i++) {
			var child = p.children[i];
			if (child.outputs != undefined) {
				if (child.outputs.length > 0) {
					for (var j = 0; j < child.outputs.length; j++) {
						var output = new TransitionInstance();
						output.parse(child.outputs[j], this);
					}
				}
			}
		}
	}
};

WfProcessInstance.prototype.stringifyforJSON = function() {
	var proc = new WfProcessInstance();
	proc.id = this.id;
	proc.code = this.code;
	proc.name = this.name;
	proc.processType = this.processType;// 0:
	proc.workflowType = this.workflowType;// 0:
	proc.accessLevel = this.accessLevel;// 0:
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
	proc.releaser = this.releaser;
	proc.releaseStatement = this.releaseStatement;
	proc.releaseDate = this.releaseDate;
	proc.deprecated = this.deprecated;
	proc.trialPeriod = this.trialPeriod;
	
	// runtime props
	proc.wfProcessId = this.wfProcessId;
	proc.launchUserId = this.launchUserId;
	proc.launchTime = this.launchTime;
	proc.startTime = this.startTime;
	proc.suspensionTime = this.suspensionTime;
	proc.updateTime = this.updateTime;
	proc.terminationTime = this.terminationTime;
	proc.ipv4 = this.ipv4;
	proc.ipv6 = this.ipv6;
	proc.endTime = this.endTime;
	proc.device = this.device;
	proc.longitude = this.longitude;
	proc.latitude = this.latitude;

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
