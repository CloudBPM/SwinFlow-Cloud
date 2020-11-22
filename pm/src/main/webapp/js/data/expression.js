/**
 * 
 */

function Expression() {
	this.value = null;
	// this array is used to store rule expression factors.
	this.expression = [];
	// this string is used to store the expression string in repository.
	this.expressionString;
	// this string is used to store the exception info during calculation.
	this.exception;
};

Expression.prototype = new WorkflowEntity();

Expression.prototype.insert = function(factor) {
	if (factor != null) {
		this.expression.push(factor);
		this.toExpressionString();
	}
};

Expression.prototype.removeAll = function() {
	return this.expression = [];
};

Expression.prototype.count = function() {
	return this.expression.length;
};

Expression.prototype.isNullRule = function() {
	if (this.count() == 0)
		return true;
	else if (this.count() == 1)
		return this.expression[0] instanceof NullValue;
	return false;
};

Expression.prototype.isConstant = function() {
	if (this.count() == 1) {
		return this.expression[0] instanceof Constant;
	} else
		return false;
};

Expression.prototype.clone = function(process) {
	var exp = new Expression();
	exp.value = this.value;
	exp.expressionString = this.expressionString
	exp.exception = this.exception;
	exp.parseExpressionString(process);
	return exp;
};

Expression.prototype.parseExpressionString = function(owner) {
	if (this.expressionString == null || this.expressionString == "")
		return;
	this.expression = [];
	var exp = this.expressionString.split('#');
	for (var i = 0; i < exp.length; i++) {
		var token = exp[i];
		if (Operator.isOperator(token)) {
			var op = new Operator();
			op.symbol = token;
			this.insert(op);
		} else if (token.indexOf("@") > 0) {
			var m = null;// monomial
			var f = token.split("@"); // factor
			if (f[0] == "V") { // var
				m = owner.seekChildByID(f[1]);
			} else if (f[0] == "N") { // null
				m = new NullValue();
			} else if (f[0] == "F") { // null
				m = FuncUtil.searchFunction(f[1]);
			} else if (f[0] == "C") { // constant
				if (f[1] == "Boolean" || f[1] == "boolean") {
					m = new BooleanConstant();
				} else if (f[1] == "Integer" || f[1] == "int") {
					m = new IntegerConstant();
				} else if (f[1] == "Double" || f[1] == "double"
						|| f[1] == "Float" || f[1] == "float") {
					m = new DoubleConstant();
				} else if (f[1] == "Currency") {
					m = new DoubleConstant();
					m.datatype = "Currency";
				} else if (f[1] == "String") {
					m = new StringConstant();
				} else if (f[1] == "DateTime" || f[1] == "Date"
						|| f[1] == "Time") {
					m = new DateTimeConstant();
				} else if (f[1] == "File") {
					m = new FileConstant();
				} else if (f[1] == "TimeDuration") {
					m = new TimeDurationConstant();
				} else if (f[1] == "Handwriting") {
					m = new HandwritingConstant();
				} else if (f[1] == "JSONData") {
					m = new JSONConstant();
				}
				m.parseString(token);
			}
			this.insert(m);
		}
	}

};

Expression.prototype.toExpressionString = function() {
	var content = "";
	if (this.expression.length == 0) {
		this.expressionString = "";
		return this.expressionString;
	}
	for (var i = 0; i < this.expression.length; i++) {
		var e = this.expression[i];
		if (e instanceof Operator) {
			if (content == "") {
				content = e.toExpressionString();
			} else {
				content = content + "#" + e.toExpressionString();
			}
		} else if (e instanceof NullValue) {
			if (content == "") {
				content = e.toExpressionString();
			} else {
				content = content + "#" + e.toExpressionString();
			}
		} else if (e instanceof Constant) {
			if (content == "") {
				content = e.toExpressionString();
			} else {
				content = content + "#" + e.toExpressionString();
			}
		} else if (e instanceof DataVariable){ // || e instanceof AbastractTask) {
			if (e instanceof Parameter) {// return value from system task
				if (content == "") {
					content = "P@" + e.datatype + "@" + e.classtypename;
				} else {
					content = content + "#P@" + e.datatype + "@"
							+ e.classtypename;
				}
			} else {
				if (content == "") {
					content = "V@" + e.id + "@" + e.classtypename;
				} else {
					content = content + "#V@" + e.id + "@" + e.classtypename;
				}
			}
		} else if (e instanceof ExprFunction){
			if (content == "") {
				content = "F@" + e.id;
			} else {
				content = content + "#F@" + e.id;
			}
		}
	}

	this.expressionString = content;
	return this.expressionString;
};

/**
 * 
 * @author Dahai CAO
 * @date 2011-9-29 下午07:25:21
 * @return
 * @see java.lang.Object#toString()
 */
Expression.prototype.toString = function() {
	var displayValue = "";
	for (var i = 0; i < this.expression.length; i++) {
		if (this.expression[i] != null) {
			displayValue += this.expression[i].toString();
		}
	}
	return displayValue;
}
