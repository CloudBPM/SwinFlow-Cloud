/**
 * 
 */
function Assignment() {
	this.id = null;
	this.variable = null;
	this.arrayIndex = -1;// if variable is array, this is array index
	this.variableString = null; // the storage string of variable
	this.value = null;
	// 0: Assignment; 1: Subprocess input; 2: Subprocess output
	this.type = 0;
};

Assignment.prototype = new WorkflowEntity();

Assignment.prototype.clone = function(owner) {
	var a = new Assignment();
	a.id = this.id;
	if (this.variable != null) {
		a.variable = this.variable;
	}
	a.variableString = this.variableString;
	a.type = this.type;
	a.arrayIndex = this.arrayIndex;
	if (this.value != null) {
		if (this.value instanceof Expression) {
			a.value = this.value.clone(owner);
		} else {
			var r = new Expression();
			r.expressionString = this.value;
			a.value = r;
		}
	}
	return a;
};

Assignment.prototype.setVariable = function(variable) {
	this.variable = variable;
	if (variable != null) {
		this.variableString = variable.id + "@" + variable.classtypename;
	}
};

Assignment.prototype.getVariable = function(variable) {
	return this.variable;
};

Assignment.prototype.toExpressionString = function() {
	var a = new Assignment();
	a.id = this.id;
	a.type = this.type;
	a.arrayIndex = this.arrayIndex;
	a.variableString = this.variableString;
	if (this.value != null) {
		a.value = this.value.toExpressionString();
	}
	return a;
}

Assignment.prototype.parseAllString = function(process) {
	this.parseVariable(process);
	this.parseValue(process);
};

Assignment.prototype.parseVariable = function(process) {
	if (this.variableString != null && this.variableString != "")
		this.variable = process
				.seekChildByID(this.variableString.split('@')[0]);
};

Assignment.prototype.parseValue = function(process) {
	if (this.value != null) {
		this.value.parseExpressionString(process);
	}
};
