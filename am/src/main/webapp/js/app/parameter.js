/**
 * 
 */

function Parameter() {
	this.name = "para";
	this.datatype = "String";
	this.value = null;
	this.comments = null;
};

Parameter.prototype.toString = function() {
	return this.name + ":" + this.datatype + ":"
			+ (this.value == null ? "" : this.value) + ":" + this.comments;
};

Parameter.prototype.toStringForConsole = function() {
	return this.name + "=" + (this.value == null ? "" : this.value);
};

Parameter.prototype.toExpressionString = function() {
	if (this.value != null && this.value != "")
		return this.name + ":" + this.datatype + ":"
				+ this.value.toExpressionString() + ":" + this.comments;
	else
		return this.name + ":" + this.datatype + "::" + this.comments;
};
