/**
 * System task class
 */

function SystemTaskInstance() {
	this.id = "System Task 00";
	this.name = "System Task";
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
	this.classtypename = "SystemTaskInstance";
	this.lastupdate = null;

	this.appServiceName = "";
	// 1: micro service; 2: Java app service
	this.appServiceType = 0;
	this.appServiceId = null;
	// 0:no security key;1:has
	this.hasSecurityAccessKey = 0;
	this.securityAccessKey = null;
	this.apiName = null;
	this.apiMethod = null;
	this.parameterString = "";
	this.extraParameterString = "";
	this.fileAttachments = "";
	this.parameters = [];
	this.extraParameters = [];
	this.attachments = [];
	// runtime props
	this.startTime = -1;
	this.endTime = -1;
	this.definitionId = null;
};

SystemTaskInstance.prototype = new SystemTask();

SystemTaskInstance.prototype.getParameterByName = function(parametername) {
	for (i = 0; i < this.parameters.length; i++) {
		if (this.parameters[i].name == parametername) {
			return this.parameters[i];
		}
	}
	return null;
};

SystemTaskInstance.prototype.setParameterValue = function(parametername, value) {
	for (i = 0; i < this.parameters.length; i++) {
		if (this.parameters[i].name == parametername) {
			this.parameters[i].value = value;
		}
	}
};

SystemTaskInstance.prototype.getExtraParameterByName = function(parametername) {
	for (i = 0; i < this.extraParameters.length; i++) {
		if (this.extraParameters[i].name == parametername) {
			return this.extraParameters[i];
		}
	}
	return null;
};

SystemTaskInstance.prototype.setExtraParameterValue = function(parametername,
		value) {
	for (i = 0; i < this.extraParameters.length; i++) {
		if (this.extraParameters[i].name == parametername) {
			this.extraParameters[i].value = value;
		}
	}
};

SystemTaskInstance.prototype.clone = function() {
	var a = new SystemTaskInstance();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.status = this.status; //
	a.selected = this.selected; // is selected on canvas
	return a;
};

SystemTaskInstance.prototype.stringifyforJSON = function() {
	var a = new SystemTaskInstance();
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

	a.appServiceType = this.appServiceType;
	a.appServiceId = this.appServiceId;
	a.appServiceName = this.appServiceName;
	a.hasSecurityAccessKey = this.hasSecurityAccessKey;
	a.securityAccessKey = this.securityAccessKey;
	a.apiName = this.apiName;
	a.apiMethod = this.apiMethod;
	if (this.parameters != null && this.parameters.length > 0) {
		a.parameterString = this.toParameterString(this.parameters);
	}
	if (this.extraParameters != null && this.extraParameters.length > 0) {
		a.extraParameterString = this.toParameterString(this.extraParameters);
	}
	if (this.attachments != null && this.attachments.length > 0) {

	}
	a.startTime = this.startTime;
	a.endTime = this.endTime;
	a.definitionId = this.definitionId;
	return a;
};

SystemTaskInstance.prototype.toParameterString = function(parameters) {
	var parameterStr = "";
	if (parameters.length > 0) {
		for (i = 0; i < parameters.length; i++) {
			if (parameterStr == "") {
				parameterStr = parameters[i].toExpressionString();
			} else {
				parameterStr = parameterStr + ";"
						+ parameters[i].toExpressionString();
			}
		}
	}
	return parameterStr;
};

SystemTaskInstance.prototype.parse = function(json, owner) {
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

	this.appServiceName = json.appServiceName;
	this.appServiceType = json.appServiceType;
	this.appServiceId = json.appServiceId;
	this.hasSecurityAccessKey = json.hasSecurityAccessKey;
	this.securityAccessKey = json.securityAccessKey;
	this.apiName = json.apiName;
	this.apiMethod = json.apiMethod;
	this.status = json.status;
	if (json.parameterString != null && json.parameterString != "") {
		this.parameterString = json.parameterString;
		this.parameters = this.parseParameters(this.parameterString, owner);
	}
	if (json.extraParameterString != null && json.extraParameterString != "") {
		this.extraParameterString = json.extraParameterString;
		this.extraParameters = this.parseParameters(this.extraParameterString,
				owner);
	}
	if (json.fileAttachments != null && json.fileAttachments != "") {
		this.fileAttachments = json.fileAttachments;
		// this.attachments = [];
	}
	this.startTime = json.startTime;
	this.endTime = json.endTime;
	this.definitionId = json.definitionId;
};

SystemTaskInstance.prototype.parseParameters = function(strParameters, owner) {
	if (strParameters != null) {
		var st = strParameters.split(";");
		var parameters = [];
		for (i = 0; i < st.length; i++) {
			if (st[i] != "") {
				var strParameter = st[i].split(":");
				var parameter = new Parameter();
				parameter.name = strParameter[0];
				parameter.dataType = strParameter[1];
				if (strParameter[2] != null && strParameter[2] != "") {
					var r = new Expression();
					r.expressionString = strParameter[2];
					parameter.value = r;
				}
				parameter.comments = strParameter[3];
				parameters.push(parameter);
			}
		}
		return parameters;
	}
	return null;
};

// A function for drawing the particle.
SystemTaskInstance.prototype.drawToContext = function() {
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

	gearIcon48x48(this.status, this.context, this.x1 - 48, this.y1 - 48);

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

SystemTaskInstance.prototype.isInMark = function(x, y) {
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