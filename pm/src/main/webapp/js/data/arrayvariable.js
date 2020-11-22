/**
 * This is actually a variable data constant list. All elements in array have
 * same data type.
 */

function ArrayDataVariable() {
	this.id = null;
	this.name = null;
	this.orderNumber = -1;
	this.description = null;
	// values is always used to store constants.
	this.values = [];
	this.datatype = null;
	this.classtypename = "ArrayDataVariable";
	this.currOwner = null;
	this.owner = null;
};

ArrayDataVariable.prototype = new DataVariable();

ArrayDataVariable.prototype.clone = function(owner) {
	var b = new ArrayDataVariable();
	b.id = this.id;
	b.name = this.name;
	b.orderNumber = this.orderNumber;
	b.description = this.description;
	if (this.values != null && this.values.length > 0) {
		for (var i = 0; i < this.values.length; i++) {
			b.values.push(this.values[i].clone(owner));
		}
	}
	b.datatype = this.datatype;
	b.currOwner = this.currOwner;
	b.owner = this.owner;
	return b;
};

ArrayDataVariable.prototype.stringifyforJSON = function() {
	var a = new ArrayDataVariable();
	a.id = this.id;
	a.name = this.name;
	a.orderNumber = this.orderNumber;
	a.description = this.description;
	if (this.values != null && this.values.length > 0) {
		var exp = "";
		for (var i = 0; i < this.values.length; i++) {
			if (exp == "") {
				exp = this.values[i].toExpressionString();
			} else {
				exp = exp + ","
						+ this.values[i].toExpressionString();
			}
		}
		a.values = exp;
	}
	a.datatype = this.datatype;
	a.currOwner = this.currOwner; // process ID
	a.owner = this.owner; // organization ID
	return a;
};

ArrayDataVariable.prototype.parse = function(variable) {
	this.id = variable.id;
	this.name = variable.name;
	this.orderNumber = variable.orderNumber; //
	this.description = variable.description;
	this.datatype = variable.datatype;
	if (variable.values != null && variable.values.length > 0) {
		var val = variable.values.split(",");
		for (var i = 0; i < val.length; i++) {
			if (this.datatype == "Integer" || this.datatype == "int") {
				var v = new IntegerConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			} else if (this.datatype == "Double" || this.datatype == "double"
				|| this.datatype == "Float" || this.datatype == "float") {
				var v = new DoubleConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			} else if (this.datatype == "Currency") {
				var v = new DoubleConstant();
				v.parseObject(val[i]);
				v.datatype = "Currency";
				this.values.push(v);
			} else if (this.datatype == "Boolean" || this.datatype == "boolean") {
				var v = new BooleanConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			} else if (this.datatype == "String") {
				var v = new StringConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			} else if (this.datatype == "Date") {
				var v = new DateConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			} else if (this.datatype == "Time") {
				var v = new TimeConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			} else if (this.datatype == "DateTime") {
				var v = new DateTimeConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			} else if (this.datatype == "TimeDuration") {
				var v = new TimeDurationConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			} else if (this.datatype == "JSONData") {
				var v = new JSONConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			} else if (this.datatype == "File") {
				var v = new FileConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			} else if (this.datatype == "Handwriting") {
				var v = new HandwritingConstant();
				v.parseObject(val[i]);
				this.values.push(v);
			}
		}
	}
	this.currOwner = variable.currOwner;
	this.owner = variable.owner;
};

ArrayDataVariable.prototype.parse = function(variable) {
	this.id = variable.id;
	this.name = variable.name;
	this.orderNumber = variable.orderNumber; //
	this.description = variable.description;
	this.datatype = variable.datatype;
	if (variable.values != null && variable.values.length > 0) {
		var val = variable.values.split(",");
		for (var i = 0; i < val.length; i++) {
			if (this.datatype == "Integer" || this.datatype == "int") {
				var v = new IntegerConstant();
				v.parseString(val[i]);
				this.values.push(v);
			} else if (this.datatype == "Double" || this.datatype == "double"
					|| this.datatype == "Float" || this.datatype == "float") {
				var v = new DoubleConstant();
				v.parseString(val[i]);
				this.values.push(v);
			} else if (this.datatype == "Currency") {
				var v = new DoubleConstant();
				v.parseString(val[i]);
				v.datatype = "Currency";
				this.values.push(v);
			} else if (this.datatype == "Boolean" || this.datatype == "boolean") {
				var v = new BooleanConstant();
				v.parseString(val[i]);
				this.values.push(v);
			} else if (this.datatype == "String") {
				var v = new StringConstant();
				v.parseString(val[i]);
				this.values.push(v);
			} else if (this.datatype == "Date") {
				var v = new DateConstant();
				v.parseString(val[i]);
				this.values.push(v);
			} else if (this.datatype == "Time") {
				var v = new TimeConstant();
				v.parseString(val[i]);
				this.values.push(v);
			} else if (this.datatype == "DateTime") {
				var v = new DateTimeConstant();
				v.parseString(val[i]);
				this.values.push(v);
			} else if (this.datatype == "TimeDuration") {
				var v = new TimeDurationConstant();
				v.parseString(val[i]);
				this.values.push(v);
			} else if (this.datatype == "JSONData") {
				var v = new JSONConstant();
				v.parseString(val[i]);
				this.values.push(v);
			} else if (this.datatype == "File") {
				var v = new FileConstant();
				v.parseString(val[i]);
				this.values.push(v);
			} else if (this.datatype == "Handwriting") {
				var v = new HandwritingConstant();
				v.parseString(val[i]);
				this.values.push(v);
			}
		}
	}
	this.currOwner = variable.currOwner;
	this.owner = variable.owner;
};

ArrayDataVariable.prototype.toString = function() {
	return Utils.parse(this.name);
};

ArrayDataVariable.prototype.toValueString = function() {
	if (this.values != null && this.values.length > 0) {
		var exp = "[";
		for (var i = 0; i < this.values.length; i++) {
			if (exp == "[") {
				exp += this.values[i].toString();
			} else {
				exp += "," + this.values[i].toString();
			}
		}
		return exp + "]";
	} else
		return "[]";

};