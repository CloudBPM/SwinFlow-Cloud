/**
 * 
 */

function DateTimeConstant() {
	this.value = new Date();// Date type
	this.datatype = "DateTime";
	// 0: not current date time stamp; 1: current date time stamp;
	this.currentDateTime = 1;
};

DateTimeConstant.prototype = new Constant();

DateTimeConstant.prototype.clone = function(owner) {
	var d = new DateTimeConstant();
	if (this.currentDateTime == 1) {
		d.value = new Date();
	} else {
		d.value = this.value;// Date type
	}
	d.currentDateTime = this.currentDateTime;
	d.datatype = this.datatype;
	return d;
};

DateTimeConstant.prototype.toExpressionString = function() {
	if (this.datatype == "DateTime") {
		return "C@" + this.datatype + "@" + this.currentDateTime + "@"
				+ this.value.getFullYear() + "|" + this.value.getMonth() + "|"
				+ this.value.getDate() + "|" + this.value.getHours() + "|"
				+ this.value.getMinutes() + "|" + this.value.getSeconds();
	} else if (this.datatype == "Date") {
		return "C@" + this.datatype + "@" + this.currentDateTime + "@"
				+ this.value.getFullYear() + "|" + this.value.getMonth() + "|"
				+ this.value.getDate();
	} else if (this.datatype == "Time") {
		return "C@" + this.datatype + "@" + this.currentDateTime + "@"
				+ this.value.getHours() + "|" + this.value.getMinutes() + "|"
				+ this.value.getSeconds();
	}
};

DateTimeConstant.prototype.parseString = function(str) {
	var ary = str.split("@");
	this.datatype = ary[1];
	this.currentDateTime = ary[2];
	if (ary[2] == "1") {
		this.value = new Date();
	} else {
		var ds = ary[3].split("|");
		if (this.datatype == "DateTime") {
			this.value = new Date();
			this.value.setFullYear(ds[0], ds[1], ds[2]);
			this.value.setHours(ds[3], ds[4], ds[5]);
		} else if (this.datatype == "Date") {
			this.value = new Date();
			this.value.setFullYear(ds[0], ds[1], ds[2]);
		} else if (this.datatype == "Time") {
			this.value = new Date();
			this.value.setHours(ds[0], ds[1], ds[2]);
		}

	}
};

DateTimeConstant.prototype.parseObject = function(o) {
	this.datatype = o.datatype;
	this.currentDateTime = o.currentDateTime;
	if (this.currentDateTime == "1") {
		this.value = new Date();
	} else {
		// var ds = ary[3].split("|");
		// if (this.datatype == "DateTime") {
		// 	this.value = new Date();
		// 	this.value.setFullYear(ds[0], ds[1], ds[2]);
		// 	this.value.setHours(ds[3], ds[4], ds[5]);
		// } else if (this.datatype == "Date") {
		// 	this.value = new Date();
		// 	this.value.setFullYear(ds[0], ds[1], ds[2]);
		// } else if (this.datatype == "Time") {
		// 	this.value = new Date();
		// 	this.value.setHours(ds[0], ds[1], ds[2]);
		// }

	}
}

DateTimeConstant.prototype.parseDateFromUI = function(o) {
	this.datatype = o.datatype;
	if (this.currentDateTime == "1") {
		this.value = new Date();
	} else {
		var v = o.fetchValue();
		if (this.datatype == "DateTime") {
			this.value = new Date(v);
			this.value.setFullYear(ds[0], ds[1], ds[2]);
			this.value.setHours(ds[3], ds[4], ds[5]);
		} else if (this.datatype == "Date") {
			var ds = v.split("-");
			this.value = new Date();
			this.value.setFullYear(ds[0], ds[1], ds[2]);
		} else if (this.datatype == "Time") {
			var ds = v.split(":");
			this.value = new Date();
			this.value.setHours(ds[0], ds[1], ds[2]);
		}

	}

}

DateTimeConstant.prototype.fetchValue = function() {
	if (this.currentDateTime == 0) {
		return this.value;
	} else {
		return this.value = new Date();
	}
};

// 2017-10-01 23:59:59:59 0
// MM is 1 - 12;
DateTimeConstant.prototype.setValue = function(yyyy, MM, dd, HH, min, ss) {
	this.currentDateTime = 0;
	if (this.datatype == "DateTime") {
		this.value = new Date(yyyy, MM - 1, dd, HH, min, ss);
	} else if (this.datatype == "Date") {
		this.value = new Date();
		this.value.setFullYear(yyyy, MM - 1, dd);
	} else if (this.datatype == "Time") {
		this.value = new Date();
		this.value.setHours(HH, min, ss);
	}
};

DateTimeConstant.prototype.toString = function() {
	if (this.currentDateTime == 1) {
		this.value = new Date();
	}
	if (this.value != null) {
		if (this.datatype == "DateTime") {
			return this.value.Format("yyyy-MM-dd HH:mm:ss");
		} else if (this.datatype == "Date") {
			return this.value.Format("yyyy-MM-dd");
		} else if (this.datatype == "Time") {
			return this.value.Format("HH:mm:ss");
		}
	}
	return null;
};