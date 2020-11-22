// Constant value object
function Constant() {
	this.value = "";
	this.datatype = "Constant";
};

Constant.prototype.toExpressionString = function() {
	return "C@constant@constant";
};

Constant.prototype.toString = function() {
	return this.value;
};

// --------------------------------------------------------
// Null value object
function NullValue() {
	this.value = "null";
	this.datatype = "null";
};

NullValue.prototype.toExpressionString = function() {
	return "N@null@null";
};

NullValue.prototype.toString = function() {
	return "空值";
};

// --------------------------------------------------------
// Unknown value object
function UnknownValue() {
	this.name = null;
	this.value = "unknown";
	this.datatype = "unknown";
};

UnknownValue.prototype.toExpressionString = function() {
	if (this.name != null) {
		return "U@unknown@" + this.name;
	}
	return "U@unknown@unknown";
};

UnknownValue.prototype.toString = function() {
	return "未知数据";
};

// ---------------------------------------------------------

function Operator() {
	this.symbol = null;
};

Operator.prototype.toExpressionString = function() {
	return this.toString();
};

Operator.prototype.toString = function() {
	return this.symbol;
};

Operator.isOperator = function(token) {
	if (token == "+" || token == "-" || token == "*" || token == "/"
			|| token == "%" || token == ">" || token == ">=" || token == "<="
			|| token == "<" || token == "==" || token == "<>" || token == "!"
			|| token == "!=" || token == "&&" || token == "||" || token == "("
			|| token == ")" || token == "[" || token == "]" || token == ","
			|| token == ".") {
		return true;
	}
	return false;
};

Date.prototype.Format = function(fmt) {
	var o = {
		"y+" : this.getFullYear(),
		"M+" : this.getMonth() + 1, // Month, 1月 - 12月
		"d+" : this.getDate(), // Day
		"H+" : this.getHours(), // Hour, 24 hours clock
		"m+" : this.getMinutes(), // Minute
		"s+" : this.getSeconds(), // Second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // Quarter
		"S+" : this.getMilliseconds(), // Millisecond
	};
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			if (k == "y+") {
				fmt = fmt.replace(RegExp.$1, ("" + o[k])
						.substr(4 - RegExp.$1.length));
			} else if (k == "S+") {
				var lens = RegExp.$1.length;
				lens = lens == 1 ? 3 : lens;
				fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(
						("" + o[k]).length - 1, lens));
			} else {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
						: (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
	}
	return fmt;
}
