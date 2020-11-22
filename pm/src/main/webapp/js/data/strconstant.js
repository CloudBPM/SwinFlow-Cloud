/**
 *
 */

function StringConstant() {
    this.value = "";
    this.datatype = "String";
};

StringConstant.prototype = new Constant();

StringConstant.prototype.clone = function (owner) {
    var d = new StringConstant();
    d.value = this.value;
    return d;
};

StringConstant.prototype.toExpressionString = function () {
    return "C@" + this.datatype + "@"
        + Utils.stringify(this.value);
};

StringConstant.prototype.parseString = function (str) {
    var ary = str.split("@");
    this.datatype = ary[1];
    if (str.length >= 9 && str.indexOf("@") > 0) {
        this.value = str.substring(9, str.length);
    } else {
        this.value = str;
    }
};

StringConstant.prototype.parseObject = function (o) {
    this.datatype = o.datatype;
    this.value = o.value;
};

StringConstant.prototype.toString = function () {
    if (this.value != "") {
        return "\"" + Utils.parse(this.value) + "\"";
    }
    return "";
};