/**
 * 
 */

function TimeDurationConstant() {
	this.value = "";
	this.datatype = "TimeDuration";
	this.largeDuration = 0;
	// 0:workday; 1:day; 2:week: 3:month; 4:quarter
	this.largeDurationUnit = 0;
	this.hours = 0;
	this.minutes = 0;
	this.seconds = 0;
	this.milliseconds = 0;
};

TimeDurationConstant.prototype = new Constant();

TimeDurationConstant.prototype.clone = function(owner) {
	var d = new TimeDurationConstant();
	d.value = this.value;
	d.largeDuration = this.largeDuration;
	d.largeDurationUnit = this.largeDurationUnit
	d.hours = this.hours;
	d.minutes = this.minutes;
	d.seconds = this.seconds;
	d.milliseconds = this.milliseconds;
	return d;
};

// to string for storage.
TimeDurationConstant.prototype.toExpressionString = function() {
	var v = this.largeDuration + "|" + this.largeDurationUnit + "|"
			+ this.hours + "|" + this.minutes + "|" + this.seconds + "|"
			+ this.milliseconds;
	return "C@" + this.datatype + "@" + v;
};

// parse a .
TimeDurationConstant.prototype.parseString = function(str) {
	var ary = str.split("@");
	this.datatype = ary[1];
	var ary1 = ary[2].split("|");
	this.largeDuration = parseInt(ary1[0]);
	// 0:workday; 1:day; 2:week: 3:month; 4:quarter;
	this.largeDurationUnit = parseInt(ary1[1]);
	this.hours = parseInt(ary1[2]);
	this.minutes = parseInt(ary1[3]);
	this.seconds = parseInt(ary1[4]);
	this.milliseconds = parseInt(ary1[5]);
};

TimeDurationConstant.prototype.parseObject = function(o) {
	this.datatype = o.datatype;
	this.largeDuration = o.largeDuration;
	this.largeDurationUnit = o.largeDurationUnit;
	this.hours = o.hours;
	this.minutes = o.minutes;
	this.seconds = o.seconds;
	this.milliseconds = o.milliseconds;

};

// return milliseconds
TimeDurationConstant.prototype.getValue = function() {
	return 0;
};

TimeDurationConstant.prototype.toString = function() {
	return (this.largeDuration == 0 ? "" : this.largeDuration
			+ largeduration[this.largeDurationUnit])
			+ (this.hours == 0 ? "" : this.hours + largeduration[5])
			+ (this.minutes == 0 ? "" : this.minutes + largeduration[6])
			+ (this.seconds == 0 ? "" : this.seconds + largeduration[7])
			+ (this.milliseconds == 0 ? "" : this.milliseconds
					+ largeduration[8]);
};