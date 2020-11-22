/**
 * 
 */

function IntegerConstant() {
	this.value = "";
	this.datatype = "Integer";
	// 0:decimal;1:octonary;2:hexadecimal
	this.numberSystem = 0;
};

IntegerConstant.prototype = new Constant();

IntegerConstant.prototype.clone = function(owner) {
	var d = new IntegerConstant();
	d.numberSystem = this.numberSystem;
	d.value = this.value;
	return d;
};

IntegerConstant.prototype.toExpressionString = function() {
	return "C@" + this.datatype + "@" + this.numberSystem + "@" + this.value;
};

IntegerConstant.prototype.parseString = function(str) {
	if (str != null && str != "") {
		var ary = str.split("@");
		this.datatype = ary[1];
		//this.numberSystem = ary[2];
		this.value = ary[3];
	}
};

IntegerConstant.prototype.parseObject = function(o) {
	if (o != null && o != "") {
		this.datatype = o.datatype;
		//this.numberSystem = ary[2];
		this.value = o.value;
	}
};

IntegerConstant.prototype.toString = function() {
	return this.value;
};