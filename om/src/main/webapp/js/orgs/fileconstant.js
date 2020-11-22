/**
 * 
 */

function FileConstant() {
	this.id = "";// file object id
	this.name = "空文件对象"; // file name, abc.doc, bc.pdf;
	this.sufix = ""; // sufix name or extension name .pdf, .txt
	this.size = -1; // long integer
	this.lastupdate = ""; // 2017-10-02 16:01:10
	this.host = ""; // host domain IP address such as www.abc.com
	this.path = ""; // the /de/fg/
	this.url = ""; // this.host+this.path
	this.parent = "";
	this.children = [];

	this.value = "";
	this.datatype = "File";
	this.filetype = "";
	this.operation = "";
};

FileConstant.prototype = new Constant();

FileConstant.prototype.clone = function(owner) {
	var d = new FileConstant();
	d.id = this.id;
	d.name = this.name;
	d.sufix = this.sufix;
	d.size = this.size;
	d.lastupdate = this.lastupdate;
	d.host = this.host;
	d.path = this.path;
	d.filetype = this.filetype;
	d.parent = this.parent;
	d.children = this.children;
	d.operation = this.operation;
	return d;
};

FileConstant.prototype.toExpressionString = function() {
	return "C@" + this.datatype + "@" + this.id + "|" + this.name + "|"
			+ this.sufix + "|" + this.size + "|" + this.lastupdate + "|"
			+ this.host + "|" + this.filetype + "|" +this.path+ "|" + this.parent + "|" +this.children + "|" + this.operation;
};

FileConstant.prototype.parseString = function(str) {
	if (str != null && str != "") {
		var ary = str.split("@");
		this.datatype = ary[1];
		var ary1 = ary[2].split("|");
		this.id = ary1[0];
		this.name = ary1[1];
		this.sufix = ary1[2];
		this.size = ary1[3];
		this.lastupdate = ary1[4];
		this.host = ary1[5];
		this.filetype = ary1[6];
		this.path = ary1[7];
		this.value = "";
	}
};

// 5 Canvas 如何自适应屏幕大小
// http://lvxineye.iteye.com/blog/1671080
FileConstant.prototype.toString = function() {
	return this.name;
};