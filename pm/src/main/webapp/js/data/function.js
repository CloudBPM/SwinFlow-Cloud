/**
 * 
 */
function FuncUtil() {
};

FuncUtil.createFunctionList = function(list) {
	var group = FuncUtil.addGroupLabel(list, f_group[0]); // 数组函数
	FuncUtil
			.addGroupOptions(group, f_array["addLastElement"], "addLastElement");
	FuncUtil
			.addGroupOptions(group, f_array["addHeadElement"], "addHeadElement");
	FuncUtil.addGroupOptions(group, f_array["insertElement"], "insertElement");
	var group1 = FuncUtil.addGroupLabel(list, f_group[1]); // 文本函数
	FuncUtil.addGroupOptions(group1, f_str["search"], "search");
	FuncUtil.addGroupOptions(group1, f_str["addLastText"], "addLastText");
	FuncUtil.addGroupOptions(group1, f_str["addHeadTexr"], "addHeadTexr");
	FuncUtil.addGroupOptions(group1, f_str["insertText"], "insertText");
	var group1 = FuncUtil.addGroupLabel(list, f_group[2]); // 日期函数
	var group2 = FuncUtil.addGroupLabel(list, f_group[3]); // 数学函数
	var group3 = FuncUtil.addGroupLabel(list, f_group[4]); // JSON函数
	var group4 = FuncUtil.addGroupLabel(list, f_group[5]); // 文件函数
	var group5 = FuncUtil.addGroupLabel(list, f_group[6]); // 手写文本函数
	var group6 = FuncUtil.addGroupLabel(list, f_group[7]); // 其他函数
};

FuncUtil.addGroupLabel = function(parent, title) {
	var group = document.createElement("OPTGROUP");
	parent.appendChild(group);
	group.setAttribute("label", title);
	return group;
};

FuncUtil.addGroupOptions = function(parent, title, value) {
	var option = document.createElement("option");
	parent.appendChild(option);
	option.text = title;
	option.value = value;
};

FuncUtil.searchFunction = function(f) {
	if (f == "addLastElement") {
		return new AddLastElement();
	}

};

function ExprFunction() {
	this.id = "";
	this.name = "";
	this.format = "";
	this.descrition = "";
	this.classtypename = "Function";
	this.parameters = [];
	this.returned = "";
};

ExprFunction.prototype = new WorkflowEntity();

ExprFunction.prototype.toExpressionString = function() {
	return "F@" + this.id;
};

ExprFunction.prototype.parseString = function(str) {
	var ary = str.split("@");
	this.id = ary[1];
};

ExprFunction.prototype.toString = function() {
	return this.name;
};

function AddLastElement() {
	this.id = "addLastElement";
	this.name = "添加元素";
	this.format = "添加元素（元素）";
	this.descrition = "添加一个元素到数组的尾端。";
	this.classtypename = "AddLastElement";
};

AddLastElement.prototype = new ExprFunction();

AddLastElement.prototype.toExpressionString = function() {
	return "F@" + this.id;
};

AddLastElement.prototype.parseString = function(str) {
	var ary = str.split("@");
	this.id = ary[1];
};

AddLastElement.prototype.toString = function() {
	return this.name;
};
