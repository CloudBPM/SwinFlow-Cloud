/**
 * 
 */
function DataVariable() {
	// general properties
	this.id = "Data 001";
	this.name = "Data";
	this.orderNumber = -1;
	this.description = "";
	this.value = null;
	this.classtypename = "DataVariable"; // this is class name
	this.currOwner = null; // process ID
	this.owner = null; // organization ID
	this.datatype = "Data";
};

DataVariable.prototype = new WorkflowEntity();

DataVariable.prototype.clone = function(owner) {
	var v = new DataVariable();
	v.id = this.id;
	v.name = this.name;
	v.orderNumber = this.orderNumber;
	v.description = this.description;
	v.datatype = this.datatype;
	v.value = null;
	if (this.value != null) {
		v.value = this.value.clone(owner);
	}
	v.currOwner = this.currOwner;
	v.owner = this.owner;
	return v;
};

DataVariable.prototype.parse = function(variable) {
	this.id = variable.id;
	this.name = variable.name;
	this.orderNumber = variable.orderNumber; //
	this.description = variable.description;
	this.datatype = variable.datatype;
	if (variable.value != null) {
		if (this.datatype == "Integer" || this.datatype == "int") {
			var c = new IntegerConstant();
			c.parseString(variable.value);
			this.value = c;
		} else if (this.datatype == "Double" || this.datatype == "double"
				|| this.datatype == "Float" || this.datatype == "float") {
			var v = new DoubleConstant();
			v.parseString(variable.value);
			this.value = v;
		} else if (this.datatype == "Boolean" || this.datatype == "boolean") {
			var v = new BooleanConstant();
			v.parseString(variable.value);
			this.value = v;// "true"/"false"/"null"
		} else if (this.datatype == "String") {
			var c = new StringConstant();
			c.parseString(variable.value);
			this.value = c;
		} else if (this.datatype == "DateTime") {
			var c = new DateTimeConstant();
			c.parseString(variable.value);
			this.value = c;
		} else if (this.datatype == "Date") {
			var c = new DateTimeConstant();
			c.parseString(variable.value);
			this.value = c;
		} else if (this.datatype == "Time") {
			var c = new DateTimeConstant();
			c.parseString(variable.value);
			this.value = c;
		} else if (this.datatype == "TimeDuration") {
			var c = new TimeDurationConstant();
			c.parseString(variable.value);
			this.value = c;
		} else if (this.datatype == "Currency") {
			var v = new DoubleConstant();
			v.parseString(variable.value);
			v.datatype = "Currency";
			this.value = v;
		} else if (this.datatype == "JSONData") {
			var v = new JSONConstant();
			v.parseString(variable.value);
			this.value = v;
		} else if (this.datatype == "File") {
			var v = new FileConstant();
			v.parseString(variable.value);
			this.value = v;
		} else if (this.datatype == "Handwriting") {
			var v = new HandwritingConstant();
			v.parseString(variable.value);
			this.value = v;
		} else {
			this.value = new NullValue();
		}
	} else {
		this.value = new NullValue();
	}
	this.currOwner = variable.currOwner;
	this.owner = variable.owner;
};

DataVariable.prototype.parseObject = function(variable) {
	this.id = variable.id;
	this.name = variable.name;
	this.orderNumber = variable.orderNumber; //
	this.description = variable.description;
	this.datatype = variable.datatype;
	if (variable.value != null) {
		if (this.datatype == "Integer" || this.datatype == "int") {
			var c = new IntegerConstant();
			c.parseObject(variable.value);
			this.value = c;
		} else if (this.datatype == "Double" || this.datatype == "double"
			|| this.datatype == "Float" || this.datatype == "float") {
			var v = new DoubleConstant();
			v.parseObject(variable.value);
			this.value = v;
		} else if (this.datatype == "Boolean" || this.datatype == "boolean") {
			var v = new BooleanConstant();
			v.parseObject(variable.value);
			this.value = v;// "true"/"false"/"null"
		} else if (this.datatype == "String") {
			var c = new StringConstant();
			c.parseObject(variable.value);
			this.value = c;
		} else if (this.datatype == "DateTime") {
			var c = new DateTimeConstant();
			c.parseObject(variable.value);
			this.value = c;
		} else if (this.datatype == "Date") {
			var c = new DateTimeConstant();
			c.parseObject(variable.value);
			this.value = c;
		} else if (this.datatype == "Time") {
			var c = new DateTimeConstant();
			c.parseObject(variable.value);
			this.value = c;
		} else if (this.datatype == "TimeDuration") {
			var c = new TimeDurationConstant();
			c.parseObject(variable.value);
			this.value = c;
		} else if (this.datatype == "Currency") {
			var v = new DoubleConstant();
			v.parseObject(variable.value);
			v.datatype = "Currency";
			this.value = v;
		} else if (this.datatype == "JSONData") {
			var v = new JSONConstant();
			v.parseObject(variable.value);
			this.value = v;
		} else if (this.datatype == "File") {
			var v = new FileConstant();
			v.parseObject(variable.value);
			this.value = v;
		} else if (this.datatype == "Handwriting") {
			var v = new HandwritingConstant();
			v.parseObject(variable.value);
			this.value = v;
		} else {
			this.value = new NullValue();
		}
	} else {
		this.value = new NullValue();
	}
	this.currOwner = variable.currOwner;
	this.owner = variable.owner;
};


DataVariable.prototype.stringifyforJSON = function() {
	var a = new DataVariable();
	a.id = this.id;
	a.name = this.name;
	a.orderNumber = this.orderNumber;
	a.datatype = this.datatype;
	a.description = this.description;
	if (this.value != null) {
		a.value = this.value.toExpressionString();
	}
	a.currOwner = this.currOwner; // process ID
	a.owner = this.owner; // organization ID
	return a;
};

DataVariable.prototype.toString = function() {
	return Utils.parse(this.name);
};

DataVariable.prototype.toValueString = function() {
	if (this.value != null)
		return this.value.toString();
	return "Unknown";

};
