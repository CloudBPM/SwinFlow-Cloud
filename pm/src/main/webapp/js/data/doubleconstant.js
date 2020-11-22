/**
 * 
 */
function DoubleConstant() {
	this.value = "";
	this.datatype = "Double";
};

DoubleConstant.prototype = new Constant();

DoubleConstant.prototype.clone = function(owner) {
	var d = new DoubleConstant();
	d.value = this.value;
	return d;
};

DoubleConstant.prototype.toExpressionString = function() {
	return "C@" + this.datatype + "@" + this.value;
};

DoubleConstant.prototype.parseString = function(str) {
	var ary = str.split("@");
	this.datatype = ary[1];
	this.value = ary[2];
};

DoubleConstant.prototype.parseObject = function(o) {
	this.datatype = o.datatype;
	this.value = o.value;
};

DoubleConstant.prototype.toString = function() {
	return this.value;
};