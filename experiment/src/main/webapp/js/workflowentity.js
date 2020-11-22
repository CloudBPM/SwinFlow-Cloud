/**
 * This is workflow entity abstract class.
 * 
 * @author Dahai Cao on 20160124
 */

function WorkflowEntity() {
	this.id;
	this.name;
	this.owner;
	this.context = null; // canvas context(2d)
	this.classtypename = "WorkflowEntity";
	this.lastupdate = null;
};

function Page() {
	this.pageNo;
	this.pageSize = 30;
	this.allEntitiesCount = 0;
	this.allPagesCount;
	this.pageIndex = 0;
	this.pageEntities = [];
};

Page.prototype.parseFromJSON = function(json) {
	this.pageNo = json.pageNo;
	this.pageSize = json.pageSize;
	this.allEntitiesCount = json.allEntitiesCount;
	this.allPagesCount = json.allPagesCount;
	this.pageIndex = json.pageIndex;
	if (json.pageEntities.length > 0) {
		for (var i = 0; i < json.pageEntities.length; i++) {
			this.pageEntities.push(json.pageEntities[i]);
		}
	} 
}

function Utils() {
};

// stringify this.value to unicode value.
Utils.stringify = function(stringvalue) {
	if (stringvalue != null && stringvalue != "") {
// var res = [];
// var len = stringvalue.length;
// for (var i = 0; i < len; ++i) {
// res[i] = ("00" + stringvalue.charCodeAt(i).toString(16)).slice(-4);
// }
// return stringvalue ? "\\u" + res.join("\\u") : "";
		return $('<div/>').text(stringvalue).html();
	} else {
		return "";
	}
};

Utils.parse = function(stringvalue) {
	if (stringvalue != null && stringvalue != "") {
// var stringvalue = stringvalue.replace(/\\/g, "%");
// return unescape(stringvalue);
		return $('<div/>').html(stringvalue).text();
	} else {
		return "";
	}
};

Utils.getCurrentDateTime = function() {
	var date = new Date();
	var months = date.getMonth();
	months = months + 1;
	months = months < 10 ? '0' + months : months;
	var days = date.getDate();
	days = days < 10 ? '0' + days : days;
	var hours = date.getHours();
	hours = hours < 10 ? '0' + hours : hours;
	var minutes = date.getMinutes();
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var seconds = date.getSeconds();
	seconds = seconds < 10 ? '0' + seconds : seconds;
	var d = date.getFullYear() + "-" + months + "-" + days + " " + hours + ":"
			+ minutes + ":" + seconds;
	// console.log(d)
	return d;
};

Utils.getDateTime = function(a) {
	var date = new Date(a);
	var months = date.getMonth();
	months = months + 1;
	months = months < 10 ? '0' + months : months;
	var days = date.getDate();
	days = days < 10 ? '0' + days : days;
	var hours = date.getHours();
	hours = hours < 10 ? '0' + hours : hours;
	var minutes = date.getMinutes();
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var seconds = date.getSeconds();
	seconds = seconds < 10 ? '0' + seconds : seconds;
	var d = date.getFullYear() + "-" + months + "-" + days + " " + hours + ":"
			+ minutes + ":" + seconds;
	// console.log(d)
	return d;
};

Utils.getCurrentDate = function() {
	var date = new Date();
	var months = date.getMonth();
	months = months + 1;
	months = months < 10 ? '0' + months : months;
	var days = date.getDate();
	days = days < 10 ? '0' + days : days;
	var d = date.getFullYear() + "-" + months + "-" + days;
	// console.log(d)
	return d;
};

Utils.getDate = function(c) {
	var date = new Date(c);
	var months = date.getMonth();
	months = months + 1;
	months = months < 10 ? '0' + months : months;
	var days = date.getDate();
	days = days < 10 ? '0' + days : days;
	var d = date.getFullYear() + "-" + months + "-" + days;
	// console.log(d)
	return d;
};

Utils.isArray = function(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
};

Utils.toDataType = function(type) {
	if (type == "Integer" || type == "int") {
		return "整数";
	} else if (type == "Double" || type == "double" || type == "float"
			|| type == "Float") {
		return "小数";
	} else if (type == "String") {
		return "字符串";
	} else if (type == "Boolean" || type == "bool") {
		return "真假值";
	} else if (type == "Date") {
		return "日期";
	} else if (type == "Time") {
		return "时间";
	} else if (type == "Currency") {
		return "货币";
	} else {
		return "未知类型";
	}
}



/**
 * Undo Redo stack
 * 
 * @author Dahai Cao on 20160402
 */
function CommandStack() {
	this.commands = [];
	this.stackPosition = -1;
	this.savePosition = -1;
	this.undoButton = null;
	this.redoButton = null;
};

CommandStack.prototype = {
	execute : function(command) {
		this._clearRedo();
		this.redoButton.setAttribute("disabled", "");
		this.undoButton.removeAttribute("disabled");
		command.execute();
		// do something for limiting stack length.
		this.commands.push(command);
		this.stackPosition++;
		this.changed();
	},
	undo : function() {
		this.commands[this.stackPosition].undo();
		this.stackPosition--;
		this.changed();
		if (this.canUndo()) {
			this.undoButton.removeAttribute("disabled");
		} else {
			this.undoButton.setAttribute("disabled", "");
		}
		this.redoButton.removeAttribute("disabled");
	},
	canUndo : function() {
		return this.stackPosition >= 0;
	},
	redo : function() {
		this.stackPosition++;
		this.commands[this.stackPosition].redo();
		this.changed();
		if (this.canRedo()) {
			this.redoButton.removeAttribute("disabled");
		} else {
			this.redoButton.setAttribute("disabled", "");
		}
		this.undoButton.removeAttribute("disabled");
	},
	canRedo : function() {
		return this.stackPosition < this.commands.length - 1;
	},
	save : function() {
		this.savePosition = this.stackPosition;
		this.changed();
	},
	isDirty : function() {
		return this.stackPosition != this.savePosition;
	},
	_clearRedo : function() {
		this.commands = this.commands.slice(0, this.stackPosition + 1);
	},
	changed : function() {
		if (this.isDirty()) {
			$("#saveG").removeClass("disabled");
		} else {
			$("#saveG").addClass("disabled");
		}
	}
};
/**
 * Command class
 * 
 * @author Dahai Cao on 20160402
 */
function Command() {
	this.name;

};

Command.prototype = {
	execute : function() {
	},
	undo : function() {
		// load undo info ...
		this.execute();
	},
	redo : function() {
		// load redo info ...
		this.execute();
	},
};


