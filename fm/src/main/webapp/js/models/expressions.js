/**
 * This class is from PM project. It was updated in this project
 * 
 * @author Dahai Cao copied on 2017-05-19
 */

function Expressions() {
	this.value = null;
	this.datatype = null;
	this.desc;
	// this array is used to store rule expression factors.
	this.expression = [];
	// this string is used to store the expression string in repository.
	this.expressionString;
	// this string is used to store the exception info during calculation.
	this.exception;
	this.currOwner = null;
};

Expressions.prototype = new WorkflowEntity();

Expressions.prototype.insert = function(factor) {
	if (factor != null) {
		this.expression.push(factor);
		this.toExpressionString();
	}
};

Expressions.prototype.isNull = function() {
	if (this.expressionString == "" || this.expression == null
			|| this.expression.length == 0) {
		return true;
	}
	return false;
};

Expressions.prototype.removeAll = function() {
	this.expressionString = "";
	this.expression = [];
};

Expressions.prototype.count = function() {
	return this.expression.length;
};

Expressions.prototype.isNullRule = function() {
	if (this.count() == 0)
		return true;
	else if (this.count() == 1)
		return this.expression[0] instanceof JSNullValue;
	return false;
};

Expressions.prototype.isConstant = function() {
	if (this.count() == 1) {
		return this.expression[0] instanceof UIConstant;
	} else
		return false;
};

Expressions.prototype.clone = function(owner) {
	var rule = new Expressions();
	rule.value = this.value;
	rule.datatype = this.datatype;
	rule.desc = this.desc;
	rule.expression = [];
	rule.expressionString = this.expressionString;
	rule.exception = this.exception;
	rule.currOwner = this.currOwner;
	rule.parseExpressionString(owner);
	return rule;
};

Expressions.prototype.parseFromJSON = function(json) {
	this.value = json.value;
	this.datatype = json.datatype;
	this.desc = json.desc;
	this.expression = [];
	this.expressionString = json.expressionString;
	this.exception = json.exception;
	this.currOwner = json.currOwner;
};

Expressions.prototype.parseExpressionString = function(owner) {
	if (this.expressionString == null || this.expressionString == "")
		return;
	this.expression = [];
	var exp = this.expressionString.split('#');
	for (var i = 0; i < exp.length; i++) {
		var token = exp[i];
		if (JSOperator.isOperator(token)) {
			var op = new JSOperator();
			op.symbol = token;
			this.insert(op);
		} else if (token.indexOf("@") > 0) {
			var monomial = null;
			var factor = token.split("@");
			if (factor[0] == "V") { // var
				monomial = owner.seekObjectByID(factor[1]);
			} else if (factor[0] == "N") { // null
				monomial = new JSNullValue();
			} else if (factor[0] == "C") { // constant
				monomial = new UIConstant();
				monomial.value = factor[1];
				monomial.datatype = factor[2];
			}
			this.insert(monomial);
		}
	}
};

Expressions.prototype.toExpressionString = function() {
	var content = "";
	if (this.expression.length == 0) {
		this.expressionString = "";
		return this.expressionString;
	}
	for (var i = 0; i < this.expression.length; i++) {
		var e = this.expression[i];
		if (e instanceof JSOperator) {
			if (content == "") {
				content = e.toExpressionString();
			} else {
				content = content + "#" + e.toExpressionString();
			}
		} else if (e instanceof JSNullValue) {
			if (content == "") {
				content = e.toExpressionString();
			} else {
				content = content + "#" + e.toExpressionString();
			}
		} else if (e instanceof UIConstant) {
			if (content == "") {
				content = e.toExpressionString();
			} else {
				content = content + "#" + e.toExpressionString();
			}
		} else if (e instanceof UIComponent) {
			if (content == "") {
				content = "V@" + e.id + "@" + e.classtypename;
			} else {
				content = content + "#V@" + e.id + "@" + e.classtypename;
			}
		}
	}
	this.expressionString = content;
	return this.expressionString;
};

Expressions.prototype.toRealValue = function() {
	var content = "";
	if (this.expression.length == 0) {
		return "";
	}
	for (var i = 0; i < this.expression.length; i++) {
		var e = this.expression[i];
		if (e instanceof JSOperator) {
			if (content == "") {
				content = e.toString();
			} else {
				content = content + e.toString();
			}
		} else if (e instanceof JSNullValue) {
			if (content == "") {
				content = e.toString();
			} else {
				content = content + e.toString();
			}
		} else if (e instanceof UIConstant) {
			if (content == "") {
				content = e.toRealValue();
			} else {
				content = content + e.toRealValue();
			}
		} else if (e instanceof UIComponent) {
			if (content == "") {
				content = e.toRealValue();
			} else {
				content = content + e.toRealValue();
			}
		}
	}
	// console.log(content);
	return content;
};

/**
 * 
 * @author Dahai CAO
 * @date 2011-9-29 下午07:25:21
 * @return
 * @see java.lang.Object#toString()
 */
Expressions.prototype.toString = function() {
	var displayValue = "";
	if (this.expression != null) {
		for (var i = 0; i < this.expression.length; i++) {
			if (this.expression[i] != null) {
				displayValue += this.expression[i].toString();
			}
		}
	}
	return displayValue;
}
