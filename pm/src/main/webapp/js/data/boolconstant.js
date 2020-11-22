/**
 * 
 */

function BooleanConstant() {
	// "true"/"false"
	this.value = "false";// by default;
	this.datatype = "Boolean";
};

BooleanConstant.prototype = new Constant();

BooleanConstant.prototype.clone = function(owner) {
	var d = new BooleanConstant();
	d.value = this.value;
	return d;
};

BooleanConstant.prototype.isTrue = function() {
	return this.value == "true";
};

BooleanConstant.prototype.toExpressionString = function() {
	return "C@" + this.datatype + "@" + this.value;
};

BooleanConstant.prototype.parseString = function(str) {
	var ary = str.split("@");
	this.datatype = ary[1];
	this.value = ary[2];
};

BooleanConstant.prototype.parseObject = function(o) {
	this.datatype = o.datatype;
	this.value = o.value;
};

BooleanConstant.prototype.toString = function() {
	return truefalse[this.value];
};