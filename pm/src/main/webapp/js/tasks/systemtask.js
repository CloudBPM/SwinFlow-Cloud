/**
 * System task class
 */

function SystemTask() {
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
	this.classtypename = "SystemTask";
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
	this.pathParameters = [];
	this.formParameters = [];
	// returnObject should be a variable in this wfprocess
	this.returnObject = null;
	this.pathParameterString = "";
	this.formParameterString = "";
	this.returnString = "";
};

SystemTask.prototype = new AbstractTask();

SystemTask.prototype.getPathParameterByName = function(parametername) {
	for (i = 0; i < this.pathParameters.length; i++) {
		if (this.pathParameters[i].name == parametername) {
			return this.pathParameters[i];
		}
	}
	return null;
};

SystemTask.prototype.setPathParameterValue = function(parametername, value) {
	for (i = 0; i < this.pathParameters.length; i++) {
		if (this.pathParameters[i].name == parametername) {
			this.pathParameters[i].value = value;
		}
	}
};

SystemTask.prototype.getFormParameterByName = function(parametername) {
	for (i = 0; i < this.formParameters.length; i++) {
		if (this.formParameters[i].name == parametername) {
			return this.formParameters[i];
		}
	}
	return null;
};

SystemTask.prototype.setFormParameterValue = function(parametername, value) {
	for (i = 0; i < this.formParameters.length; i++) {
		if (this.formParameters[i].name == parametername) {
			this.formParameters[i].value = value;
		}
	}
};

SystemTask.prototype.clone = function() {
	var a = new SystemTask();
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

SystemTask.prototype.stringifyforJSON = function() {
	var a = new SystemTask();
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
	if (this.pathParameters != null && this.pathParameters.length > 0) {
		a.pathParameterString = this.toParameterString(this.pathParameters);
	}
	if (this.formParameters != null && this.formParameters.length > 0) {
		a.formParameterString = this.toParameterString(this.formParameters);
	}
	if (this.returnObject != null) {
		a.returnString = this.toReturnString();
	}
	return a;
};

SystemTask.prototype.toParameterString = function(parameters) {
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

SystemTask.prototype.toReturnString = function() {
	if (this.returnObject != null) {
		return this.returnObject.id + "@" + this.returnObject.datatype + "@"
				+ this.returnObject.description;
	}
	return "";
};

SystemTask.prototype.parse = function(json, owner) {
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
	this.owner = json.owner; // organization ID

	this.appServiceName = json.appServiceName;
	this.appServiceType = json.appServiceType;
	this.appServiceId = json.appServiceId;
	this.hasSecurityAccessKey = json.hasSecurityAccessKey;
	this.securityAccessKey = json.securityAccessKey;
	this.apiName = json.apiName;
	this.apiMethod = json.apiMethod;
	if (json.pathParameterString != null && json.pathParameterString != "") {
		this.pathParameterString = json.pathParameterString;
		this.pathParameters = this.parseParameters(this.pathParameterString);
	}
	if (json.formParameterString != null && json.formParameterString != "") {
		this.formParameterString = json.formParameterString;
		this.formParameters = this.parseParameters(this.formParameterString);
	}
	if (json.returnString != null && json.returnString != "") {
		this.returnString = json.returnString;
	}
};

SystemTask.prototype.parseParameters = function(strParameters) {
	if (strParameters != null) {
		var st = strParameters.split(";");
		var parameters = [];
		for (i = 0; i < st.length; i++) {
			if (st[i] != "") {
				var strParameter = st[i].split(":");
				var parameter = new Parameter();
				parameter.name = strParameter[0];
				parameter.datatype = strParameter[1];
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
SystemTask.prototype.drawToContext = function() {
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

	BuildTimeUtils.gearIcon48x48(this.context, this.x1 - 48, this.y1 - 48);

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

SystemTask.prototype.isInMark = function(x, y) {
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