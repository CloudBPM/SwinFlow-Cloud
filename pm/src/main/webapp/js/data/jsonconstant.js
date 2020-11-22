/**
 * 
 */

function JSONConstant() {
	this.name = "空JSON对象";
	this.value = "";
	this.datatype = "JSONData";
};

JSONConstant.prototype = new Constant();

JSONConstant.prototype.clone = function(owner) {
	var d = new JSONConstant();
	d.name = this.name;
	d.value = this.value;
	return d;
};

// to string for storage.
JSONConstant.prototype.toExpressionString = function() {
	return "C@" + this.datatype + "@" + Base64.encode(this.value);
};

JSONConstant.prototype.parseString = function(str) {
	var ary = str.split("@");
	this.datatype = ary[1];
	this.value = Base64.decode(ary[2]);
};

JSONConstant.prototype.parseObject = function(o) {
	this.datatype = o.datatype;
	this.value = o.value;
};

JSONConstant.prototype.toJSON = function() {
	return JSON.stringify(this.value);
};

JSONConstant.prototype.fetchJSON = function() {
	return JSON.parse(this.value);
};

JSONConstant.prototype.toString = function() {
	if (this.value != null && this.value != "")
		return this.value;
	return this.name;
};
