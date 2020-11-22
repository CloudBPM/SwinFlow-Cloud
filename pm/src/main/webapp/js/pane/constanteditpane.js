/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "constantEditPanel";
	var defaults = {
		id : "",
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	EditPanel.prototype.init = function(options) {
		// --------------------
		// number system for integer
		this.numberPane = document.createElement("div");
		this.element.appendChild(this.numberPane);
		//this.numberPane.className = "row";
		this.numberPane.style.display = "none";

		// var rowDiv1 = document.createElement("div");
		// rowDiv1.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		// this.numberPane.appendChild(rowDiv1);
		//
		// var rDiv1 = document.createElement("div");
		// rowDiv1.appendChild(rDiv1);
		// rDiv1.className = "radio-inline";
		//
		// this.numInput = document.createElement("INPUT");
		// rDiv1.appendChild(this.numInput);
		// this.numInput.type = "radio";
		// this.numInput.name = "numbersystem";
		// this.numInput.value = 0;// decimal
		// this.numInput.addEventListener("click", this, false);
		// rDiv1.appendChild(document.createTextNode("十进制"));
		//
		// var rDiv2 = document.createElement("div");
		// rowDiv1.appendChild(rDiv2);
		// rDiv2.className = "radio-inline";
		//
		// this.numInput1 = document.createElement("INPUT");
		// rDiv2.appendChild(this.numInput1);
		// this.numInput1.type = "radio";
		// this.numInput1.name = "numbersystem";
		// this.numInput1.value = 1;// octonary
		// this.numInput1.addEventListener("click", this, false);
		// rDiv2.appendChild(document.createTextNode("八进制"));
		//
		// var rDiv3 = document.createElement("div");
		// rowDiv1.appendChild(rDiv3);
		// rDiv3.className = "radio-inline";
		//
		// this.numInput2 = document.createElement("INPUT");
		// rDiv3.appendChild(this.numInput2);
		// this.numInput2.type = "radio";
		// this.numInput2.name = "numbersystem";
		// this.numInput2.value = 2;// octonary
		// this.numInput2.addEventListener("click", this, false);
		// rDiv3.appendChild(document.createTextNode("十六进制"));
		//
		// --------------------------
		// always get current time
		this.isCurrDtPane = document.createElement("div");
		this.element.appendChild(this.isCurrDtPane);
		this.isCurrDtPane.className = "row";
		this.isCurrDtPane.style.display = "none";

		var rowDiv6 = document.createElement("div");
		rowDiv6.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.isCurrDtPane.appendChild(rowDiv6);

		var isCurrDiv = document.createElement("DIV");
		rowDiv6.appendChild(isCurrDiv);
		isCurrDiv.className = "checkbox-inline";

		this.isCurrInput = document.createElement("INPUT");
		isCurrDiv.appendChild(this.isCurrInput);
		this.isCurrInput.type = "checkbox";
		this.isCurrInput.id = "isCurr" + options.id;
		this.isCurrInput.name = "isCurr" + options.id;
		this.isCurrInput.checked = false;
		this.isCurrInput.addEventListener("click", this, false);
		isCurrDiv.appendChild(document.createTextNode("始终获取当前日期时间"));

		// --------------------------
		// initial value for integer, double, currency, string,
		this.valuePane = document.createElement("div");
		this.element.appendChild(this.valuePane);
		this.valuePane.className = "row";
		this.valuePane.style.display = "none";

		var rowDiv2 = document.createElement("div");
		rowDiv2.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.valuePane.appendChild(rowDiv2);

		var valLabel = document.createElement("label");
		rowDiv2.appendChild(valLabel);
		valLabel.setAttribute("for", "numbervalue");
		valLabel.innerHTML = "常数值";

		this.valInput = document.createElement("TEXTAREA");
		rowDiv2.appendChild(this.valInput);
		this.valInput.type = "text";
		this.valInput.className = "form-control";
		this.valInput.id = "numbervalue";
		this.valInput.name = "numbervalue";
		this.valInput.setAttribute("placeholder", "请输入初始值");
		this.valInput.addEventListener("change", this, false);
		this.valInput.addEventListener("keypress", this, false);

		// ----------------------------
		// initial value for boolean
		this.bvaluePane = document.createElement("div");
		this.element.appendChild(this.bvaluePane);
		this.bvaluePane.className = "row";
		this.bvaluePane.style.display = "none";

		var rowDiv3 = document.createElement("div");
		rowDiv3.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.bvaluePane.appendChild(rowDiv3);

		var bvalLabel = document.createElement("label");
		rowDiv3.appendChild(bvalLabel);
		bvalLabel.setAttribute("for", "boolval1");
		bvalLabel.innerHTML = "初始值&nbsp;&nbsp;";

		var brDiv1 = document.createElement("div");
		rowDiv3.appendChild(brDiv1);
		brDiv1.className = "radio-inline";

		this.bvalInput1 = document.createElement("INPUT");
		brDiv1.appendChild(this.bvalInput1);
		this.bvalInput1.type = "radio";
		this.bvalInput1.id = "boolval1";
		this.bvalInput1.name = "booleanvalue";
		this.bvalInput1.value = "true";
		this.bvalInput1.addEventListener("click", this, false);
		brDiv1.appendChild(document.createTextNode("真"));

		var brDiv2 = document.createElement("div");
		rowDiv3.appendChild(brDiv2);
		brDiv2.className = "radio-inline";

		this.bvalInput2 = document.createElement("INPUT");
		brDiv2.appendChild(this.bvalInput2);
		this.bvalInput2.type = "radio";
		this.bvalInput2.id = "boolval2";
		this.bvalInput2.name = "booleanvalue";
		this.bvalInput2.value = "false";
		this.bvalInput2.addEventListener("click", this, false);
		brDiv2.appendChild(document.createTextNode("假"));

		// ----------------------------
		// for date time
		this.dtPane = document.createElement("div");
		this.element.appendChild(this.dtPane);
		this.dtPane.className = "row";
		this.dtPane.style.display = "none";

		var rowDiv12 = document.createElement("div");
		rowDiv12.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.dtPane.appendChild(rowDiv12);

		this.datetimeInput = document.createElement("INPUT");
		rowDiv12.appendChild(this.datetimeInput);
		this.datetimeInput.type = "text";
		this.datetimeInput.className = "form-control";

		var that = this;
		$(this.datetimeInput).datetimepicker({
			dateFormat : "yy-mm-dd",
			timeFormat : "HH:mm:ss",
			onClose : function() {
				that.setDateTimeValue(this.value);
			},
		});

		// ----------------------------
		// for date
		this.datePane = document.createElement("div");
		this.element.appendChild(this.datePane);
		this.datePane.className = "row";
		this.datePane.style.display = "none";

		var rowDiv13 = document.createElement("div");
		rowDiv13.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.datePane.appendChild(rowDiv13);

		this.dateInput = document.createElement("INPUT");
		rowDiv13.appendChild(this.dateInput);
		this.dateInput.type = "text";
		this.dateInput.className = "form-control";

		$(this.dateInput).datepicker({
			dateFormat : "yy-mm-dd",
			onClose : function() {
				that.setDateTimeValue(this.value);
			},
		});

		// ----------------------------
		// for time
		this.timePane = document.createElement("div");
		this.element.appendChild(this.timePane);
		this.timePane.className = "row";
		this.timePane.style.display = "none";

		var rowDiv14 = document.createElement("div");
		rowDiv14.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.timePane.appendChild(rowDiv14);

		this.timeInput = document.createElement("INPUT");
		rowDiv14.appendChild(this.timeInput);
		this.timeInput.type = "text";
		this.timeInput.className = "form-control";

		$(this.timeInput).timepicker({
			timeFormat : "HH:mm:ss",
			onClose : function() {
				that.setDateTimeValue(this.value);
			},
		});

		// ----------------------------
		// for time duration
		this.durationPane = document.createElement("div");
		this.element.appendChild(this.durationPane);
		this.durationPane.className = "row";
		this.durationPane.style.display = "none";

		var rowDiv8 = document.createElement("div");
		rowDiv8.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.durationPane.appendChild(rowDiv8);

		var durDiv1 = document.createElement("div");
		rowDiv8.appendChild(durDiv1);
		durDiv1.className = "form-inline";

		var durDiv2 = document.createElement("div");
		durDiv1.appendChild(durDiv2);
		durDiv2.className = "input-group";

		this.dayInput = document.createElement("input");
		durDiv2.appendChild(this.dayInput);
		this.dayInput.type = "text";
		this.dayInput.id = "wDayInput";
		this.dayInput.name = "wwDayInput";
		this.dayInput.value = "0";
		this.dayInput.className = "form-control";
		this.dayInput.addEventListener("change", this, false);
		this.dayInput.addEventListener("keypress", this, false);

		var durDiv3 = document.createElement("div");
		durDiv2.appendChild(durDiv3);
		durDiv3.className = "input-group-btn";

		this.daySelect = document.createElement("select");
		durDiv3.appendChild(this.daySelect);
		this.daySelect.className = "form-control";
		this.daySelect.id = "wDaySelect";
		this.daySelect.name = "wDaySelect";
		this.daySelect.style.borderLeft = "0";
		this.daySelect.style.backgroundColor = "#eeeeee";
		this.daySelect.addEventListener("change", this, false);

		this.addOptions(this.daySelect, largeduration[0], "0", 0);
		this.addOptions(this.daySelect, largeduration[1], "1", 1);
		this.addOptions(this.daySelect, largeduration[2], "2", 2);
		this.addOptions(this.daySelect, largeduration[3], "3", 3);
		this.addOptions(this.daySelect, largeduration[4], "4", 4);

		// hour
		var hourgroup = document.createElement("div");
		durDiv1.appendChild(hourgroup);
		hourgroup.className = "input-group";

		this.hourInput = document.createElement("input");
		hourgroup.appendChild(this.hourInput);
		this.hourInput.type = "text";
		this.hourInput.id = "wHourInput";
		this.hourInput.name = "wHourInput";
		this.hourInput.value = "0";
		this.hourInput.className = "form-control";
		this.hourInput.addEventListener("change", this, false);
		this.hourInput.addEventListener("keypress", this, false);

		var hourLabel = document.createElement("div");
		hourgroup.appendChild(hourLabel);
		hourLabel.innerHTML = largeduration[5];
		hourLabel.className = "input-group-addon";
		hourLabel.setAttribute("for", "wHourInput");

		// minute
		var minutegroup = document.createElement("div");
		durDiv1.appendChild(minutegroup);
		minutegroup.className = "input-group";

		this.minuteInput = document.createElement("input");
		minutegroup.appendChild(this.minuteInput);
		this.minuteInput.type = "text";
		this.minuteInput.id = "wMinuteInput";
		this.minuteInput.name = "wMinuteInput";
		this.minuteInput.className = "form-control";
		this.minuteInput.value = "0";
		this.minuteInput.addEventListener("change", this, false);
		this.minuteInput.addEventListener("keypress", this, false);

		var minuteLabel = document.createElement("div");
		minutegroup.appendChild(minuteLabel);
		minuteLabel.className = "input-group-addon";
		minuteLabel.innerHTML = largeduration[6];
		minuteLabel.setAttribute("for", "wMinuteInput");

		// second
		var secondgroup = document.createElement("div");
		durDiv1.appendChild(secondgroup);
		secondgroup.className = "input-group";

		this.secondInput = document.createElement("input");
		secondgroup.appendChild(this.secondInput);
		this.secondInput.type = "text";
		this.secondInput.id = "wSecondInput";
		this.secondInput.name = "wSecondInput";
		this.secondInput.className = "form-control";
		this.secondInput.value = "0";
		this.secondInput.addEventListener("change", this, false);
		this.secondInput.addEventListener("keypress", this, false);

		var secLabel = document.createElement("div");
		secondgroup.appendChild(secLabel);
		secLabel.className = "input-group-addon";
		secLabel.innerHTML = largeduration[7];
		secLabel.setAttribute("for", "wSecondInput");

		// ----------------------------
		// for File constant
		this.filePane = document.createElement("div");
		this.element.appendChild(this.filePane);
		this.filePane.className = "row";
		this.filePane.style.display = "none";

		var rowDiv9 = document.createElement("div");
		this.filePane.appendChild(rowDiv9);
		rowDiv9.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";

		var fileLabel = document.createElement("label");
		rowDiv9.appendChild(fileLabel);
		fileLabel.setAttribute("for", "drop_zone");
		fileLabel.innerHTML = "上传文件";

		var p3 = $(rowDiv9).uploadPlugin({
			id : "upload0161", // plugin id
			url :  service.api2(0), // uploading arget url
			extpara : "", // extra parameters for uploading
			actnow : "1", // if 1, dochange method will work
			filer : "", // image.* or image/gif, image/jpeg
			multiple : "0", // if 1, input will can select multiple files
			parent : this, // parent plugin
		});
		this.uploadPlugin = p3.data("uploadPlugin");
	};

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		case "keypress":
			this.doKeypress(e);
			break;
		}
	};

	EditPanel.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	EditPanel.prototype.doKeypress = function(event) {
		if (event.target == this.valInput) {
			if (this.constant.datatype == "Integer") {
				Utils.blockNonNumbers(this.valInput, event, false, true);
			} else if (this.constant.datatype == "Double") {
				Utils.blockNonNumbers(this.valInput, event, true, true);
			} else if (this.constant.datatype == "Currency") {
				Utils.blockNonNumbers(this.valInput, event, true, false);
			}
		} else if (event.target == this.dayInput) {
			Utils.blockNonNumbers(this.dayInput, event, false, false);
		} else if (event.target == this.hourInput) {
			Utils.blockNonNumbers(this.hourInput, event, false, false);
		} else if (event.target == this.minuteInput) {
			Utils.blockNonNumbers(this.minuteInput, event, false, false);
		} else if (event.target == this.secondInput) {
			Utils.blockNonNumbers(this.secondInput, event, false, false);
		}
	};

	EditPanel.prototype.doClick = function(evt) {
		// if (evt.target == this.numInput) {
		// 	if (this.numInput.checked) {
		// 		this.constant.numberSystem = 0;
		// 	}
		// } else if (evt.target == this.numInput1) {
		// 	if (this.numInput1.checked) {
		// 		this.constant.numberSystem = 1;
		// 	}
		// } else if (evt.target == this.numInput2) {
		// 	if (this.numInput2.checked) {
		// 		this.constant.numberSystem = 2;
		// 	}
		// } else
		if (evt.target == this.bvalInput1) {
			if (this.bvalInput1.checked) {
				this.constant.value = "true";
			}
		} else if (evt.target == this.bvalInput2) {
			if (this.bvalInput2.checked) {
				this.constant.value = "false";
			}
		} else if (evt.target == this.isCurrInput) {
			if (this.isCurrInput.checked) {
				this.constant.currentDateTime = 1;
				if (this.constant.datatype == "DateTime") {
					this.datetimeInput.disabled = true;
				} else if (this.constant.datatype == "Date") {
					this.dateInput.disabled = true;
				} else if (this.constant.datatype == "Time") {
					this.timeInput.disabled = true;
				}
			} else {
				this.constant.currentDateTime = 0;
				if (this.constant.datatype == "DateTime") {
					this.datetimeInput.disabled = false;
				} else if (this.constant.datatype == "Date") {
					this.dateInput.disabled = false;
				} else if (this.constant.datatype == "Time") {
					this.timeInput.disabled = false;
				}
			}
		}
	};

	EditPanel.prototype.doChange = function(evt) {
		if (evt.target == this.valInput) {
			this.constant.value = this.valInput.value;
		} else if (evt.target == this.dayInput) {
			this.constant.largeDuration = this.dayInput.value;
		} else if (evt.target == this.daySelect) {
			this.constant.largeDurationUnit = this.daySelect.value;
		} else if (evt.target == this.hourInput) {
			this.constant.hours = this.hourInput.value;
		} else if (evt.target == this.minuteInput) {
			this.constant.minutes = this.minuteInput.value;
		} else if (evt.target == this.secondInput) {
			this.constant.seconds = this.secondInput.value;
		} 
	};

	EditPanel.prototype.setDateTimeValue = function(val) {
		var that = this;
		if (that.constant.datatype == "DateTime") {
			var d = new Date(val);
			var h = d.getHours();
			h = (h < 10) ? ("0" + h) : h;
			var m = d.getMinutes();
			m = (m < 10) ? ("0" + m) : m;
			var s = d.getSeconds();
			s = (s < 10) ? ("0" + s) : s;
			that.constant.setValue(d.getFullYear(), d.getMonth() + 1, d
					.getDate(), h, m, s);
		}
		if (that.constant.datatype == "Date") {
			var d = new Date(val);
			that.constant.setValue(d.getFullYear(), d.getMonth() + 1, d
					.getDate(), 0, 0, 0);
		}
		if (that.constant.datatype == "Time") {
			var t = val.split(":");
			that.constant.setValue(0, 0, 0, t[0], t[1], t[2]);
		}
	};
	
	EditPanel.prototype.complete = function(f, loaded, total, data) {
		if (data != null && data.fid != undefined) {
			this.constant.id = data.fid;
		}
		this.constant.name = f.name;
		if (f.name.indexOf(".") > -1) {
			this.constant.sufix = f.name.substring(f.name.indexOf(".") + 1,
					f.name.length);
		}
		this.constant.filetype = (f.type || 'n/a');
		this.constant.lastupdate = f.lastModifiedDate;
		this.constant.size = f.size;
	};

	EditPanel.prototype.setInitValue = function(datatype, orgid, pid) {
		this.owner = orgid;
		this.currOwner = pid;
		var c = null;
		// display:show/hide
		if (datatype == "Integer") {
			c = new IntegerConstant();
			this.numberPane.style.display = "";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (datatype == "Boolean") {
			c = new BooleanConstant();
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (datatype == "Double") {
			c = new DoubleConstant();
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (datatype == "Currency") {
			c = new DoubleConstant();
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (datatype == "String") {
			c = new StringConstant();
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (datatype == "JSONData") {
			c = new JSONConstant();
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (datatype == "DateTime") {
			c = new DateTimeConstant();
			c.datatype = datatype;
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "";
			this.dtPane.style.display = "";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (datatype == "Date") {
			c = new DateTimeConstant();
			c.datatype = datatype;
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (datatype == "Time") {
			c = new DateTimeConstant();
			c.datatype = datatype;
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (datatype == "TimeDuration") {
			c = new TimeDurationConstant();
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "";
			this.filePane.style.display = "none";
		} else if (datatype == "File") {
			c = new FileConstant();
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "";
			var o = new Object();
			o.oid = this.owner;
			o.pid = this.currOwner;
			o.vid = "";
			o.fid = this.constant.id;
			this.uploadPlugin.extpara = o;
		}
		this.constant = c;
		// initializing
		if (datatype == "Boolean") {
			if (c instanceof BooleanConstant) {
				if (c.isTrue()) {
					this.bvalInput1.checked = true;
					this.bvalInput2.checked = false;
				} else {
					this.bvalInput1.checked = false;
					this.bvalInput2.checked = true;
				}
			}
		} else if (datatype == "Double" || datatype == "Currency"
				|| datatype == "String" || datatype == "JSONData") {
			this.valInput.value = c.toString();
		} else if (datatype == "Integer") {
			this.valInput.value = c.toString();
			// if (c.numberSystem == 0) {
			// 	this.numInput.checked = true;
			// 	this.numInput1.checked = false;
			// 	this.numInput2.checked = false;
			// } else if (c.numberSystem == 1) {
			// 	this.numInput.checked = false;
			// 	this.numInput1.checked = true;
			// 	this.numInput2.checked = false;
			// } else if (c.numberSystem == 2) {
			// 	this.numInput.checked = false;
			// 	this.numInput1.checked = false;
			// 	this.numInput2.checked = true;
			// }
		} else if (datatype == "Date") {
			if (c.currentDateTime == 1) {
				this.isCurrInput.checked = true;
				this.dateInput.disabled = true;
			} else {
				this.isCurrInput.checked = false;
				this.dateInput.disabled = false;
			}
			this.dateInput.value = c.toString();
		} else if (datatype == "DateTime") {
			if (c.currentDateTime == 1) {
				this.isCurrInput.checked = true;
				this.datetimeInput.disabled = true;
			} else {
				this.isCurrInput.checked = false;
				this.datetimeInput.disabled = false;
			}
			this.datetimeInput.value = c.toString();
		} else if (datatype == "Time") {
			if (c.currentDateTime == 1) {
				this.isCurrInput.checked = true;
				this.timeInput.disabled = true;
			} else {
				this.isCurrInput.checked = false;
				this.timeInput.disabled = false;
			}
			this.timeInput.value = c.toString();
		} else if (datatype == "TimeDuration") {
			this.daySelect.value = c.largeDurationUnit;
			this.dayInput.value = c.largeDuration;
			this.hourInput.value = c.hours;
			this.minuteInput.value = c.minutes;
			this.secondInput.value = c.seconds;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EditPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);