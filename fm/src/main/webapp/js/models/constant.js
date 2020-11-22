/**
 * Constant value object. This class is from PM project. It was updated in this
 * project
 * 
 * @author Dahai Cao copied on 2017-05-19
 */

function UIConstant() {
	this.value;
	this.datatype;
};

// to string for storage.
UIConstant.prototype.toExpressionString = function() {
	var val = this.value;
	if (this.datatype == "string") {
		val = Utils.stringify(val);
	}
	return "C@" + val + "@" + this.datatype;
};

// parse a .
UIConstant.prototype.parseString = function(str) {
	this.datatype = str.substring(str.lastIndexOf("@") + 1);
	this.value = str.substring(str.indexOf("@") + 1, str.lastIndexOf("@"));
};

UIConstant.prototype.toString = function() {
	var representationValue = this.value;
	if (this.datatype == "string") {
		representationValue = "\"" + Utils.parse(this.value) + "\"";
	} else if (this.datatype == "boolean") {
		representationValue = truefalse[this.value];
	}
	return representationValue;
};

UIConstant.prototype.toRealValue = function() {
	var realValue = this.value;
	if (this.datatype == "string") {
		realValue = Utils.parse(this.value);
	} else if (this.datatype == "boolean") {
		realValue = (this.value === "true");
	} else if (this.datatype == "float") {
		realValue = parseFloat(this.value);
	} else if (this.datatype == "int") {
		realValue = parseInt(this.value);
	} else if (this.datatype == "null") {
		realValue = null;
	}
	return realValue;
};

// --------------------------------------------------------
// JavaScript Null value object
function JSNullValue() {
};

JSNullValue.prototype.toExpressionString = function() {
	return "N@null@null";
};

JSNullValue.prototype.toString = function() {
	return "null";
};

// --------------------------------------------------------
// JavaScript Undefined value object
function UndefinedValue() {
	this.name;
};

UndefinedValue.prototype.toExpressionString = function() {
	if (this.name != null) {
		return "U@" + this.name + "@undefined";
	}
	return "U@undefined@undefined";
};

UndefinedValue.prototype.toString = function() {
	return "undefined";
};

// ---------------------------------------------------------
// JavaScript operator object
function JSOperator() {
	this.symbol = null;
};

JSOperator.prototype.toExpressionString = function() {
	return this.toString();
};

JSOperator.prototype.toString = function() {
	return this.symbol;
};

JSOperator.isOperator = function(token) {
	if (token == "+" || token == "-" || token == "*" || token == "/"
			|| token == "%" || token == ">" || token == ">=" || token == "<="
			|| token == "<" || token == "==" || token == "!=" || token == "!"
			|| token == "&&" || token == "||" || token == "(" || token == ")"
			|| token == ".") {
		return true;
	}
	return false;
};