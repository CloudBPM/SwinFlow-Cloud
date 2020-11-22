/**
 * 
 */

function HandwritingConstant() {
	this.name = "空写字板对象"; // signature name
	this.value = "";
	this.datatype = "Handwriting";
};

HandwritingConstant.prototype = new Constant();

HandwritingConstant.prototype.clone = function(owner) {
	var d = new HandwritingConstant();
	d.name = this.name;
	d.value = this.value;
	return d;
};

HandwritingConstant.prototype.toExpressionString = function() {
	return "C@" + this.datatype + "@" + this.name + "@"
			+ Base64.encode(this.value);
};

HandwritingConstant.prototype.parseString = function(str) {
	var ary = str.split("@");
	this.name = ary[1];
	this.datatype = ary[2];
	this.value = Base64.decode(ary[3]);
};

HandwritingConstant.prototype.parseObject = function(o) {
	this.name = o.name;
	this.datatype = o.datatype;
	this.value = o.value;
};

// 5 Canvas 如何自适应屏幕大小
// http://lvxineye.iteye.com/blog/1671080
HandwritingConstant.prototype.toString = function() {
	return this.name;
};