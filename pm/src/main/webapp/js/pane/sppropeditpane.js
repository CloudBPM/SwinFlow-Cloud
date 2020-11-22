/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "specialPropEditPanel";
	var defaults = {
		id : "",
		owner : "",
		msgbox : "",
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			owner : "",
			msgbox : "",
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
		// this.numInput.id = "number1";
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
		// this.numInput1.id = "number2";
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
		// this.numInput2.id = "number3";
		// this.numInput2.name = "numbersystem";
		// this.numInput2.value = 2;// octonary
		// this.numInput2.addEventListener("click", this, false);
		// rDiv3.appendChild(document.createTextNode("十六进制"));

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
		valLabel.innerHTML = "初始值";

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

		this.inputDiv = document.createElement("div");
		rowDiv9.appendChild(this.inputDiv);
		
		
		var p3 = $(rowDiv9).uploadPlugin({
			id : "upload0161", // plugin id
			url : service.api2(0, options.owner.owner), // uploading arget url
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
			if (this.v.datatype == "Integer") {
				Utils.blockNonNumbers(this.valInput, event, false, true);
			} else if (this.v.datatype == "Double") {
				Utils.blockNonNumbers(this.valInput, event, true, true);
			} else if (this.v.datatype == "Currency") {
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
		// 		this.v.value.numberSystem = 0;
		// 	}
		// } else if (evt.target == this.numInput1) {
		// 	if (this.numInput1.checked) {
		// 		this.v.value.numberSystem = 1;
		// 	}
		// } else if (evt.target == this.numInput2) {
		// 	if (this.numInput2.checked) {
		// 		this.v.value.numberSystem = 2;
		// 	}
		// } else
		if (evt.target == this.bvalInput1) {
			if (this.bvalInput1.checked) {
				var c = new BooleanConstant();
				c.value = "true";
				this.v.value = c;
			}
		} else if (evt.target == this.bvalInput2) {
			if (this.bvalInput2.checked) {
				var c = new BooleanConstant();
				c.value = "false";
				this.v.value = c;
			}
		} else if (evt.target == this.isCurrInput) {
			if (this.isCurrInput.checked) {
				this.v.value.currentDateTime = 1;
				if (this.v.datatype == "DateTime") {
					this.datetimeInput.disabled = true;
				} else if (this.v.datatype == "Date") {
					this.dateInput.disabled = true;
				} else if (this.v.datatype == "Time") {
					this.timeInput.disabled = true;
				}
			} else {
				this.v.value.currentDateTime = 0;
				if (this.v.datatype == "DateTime") {
					this.datetimeInput.disabled = false;
				} else if (this.v.datatype == "Date") {
					this.dateInput.disabled = false;
				} else if (this.v.datatype == "Time") {
					this.timeInput.disabled = false;
				}
			}
		}
	};

	EditPanel.prototype.doChange = function(evt) {
		if (evt.target == this.valInput) {
			this.v.value.value = this.valInput.value;
		} else if (evt.target == this.dayInput) {
			this.v.value.largeDuration = this.dayInput.value;
		} else if (evt.target == this.daySelect) {
			this.v.value.largeDurationUnit = this.daySelect.value;
		} else if (evt.target == this.hourInput) {
			this.v.value.hours = this.hourInput.value;
		} else if (evt.target == this.minuteInput) {
			this.v.value.minutes = this.minuteInput.value;
		} else if (evt.target == this.secondInput) {
			this.v.value.seconds = this.secondInput.value;
		}
	};

	EditPanel.prototype.complete = function(f, loaded, total, data) {
		if (data != null && data.fid != undefined) {
			// due this plugin only allow upload one file.
			this.v.value.id = data.fid;
		}
		this.v.value.name = f.name;
		if (f.name.indexOf(".") > -1) {
			this.v.value.sufix = f.name.substring(f.name.indexOf(".") + 1,
					f.name.length);
		}
		this.v.value.filetype = (f.type || 'n/a');
		this.v.value.lastupdate = f.lastModifiedDate;
		// if the future is on cloud, should update it.
		this.v.value.host = "";
		this.v.value.path = "";
		this.v.value.owner = this.v.owner;
		this.v.value.currOwner = this.v.currOwner;
		this.v.value.size = f.size;
		//this.v.value.vid = this.v.id;
	};

	EditPanel.prototype.setDateTimeValue = function(val) {
		var that = this;
		if (that.v.value.datatype == "DateTime") {
			var d = new Date(val);
			var h = d.getHours();
			h = (h < 10) ? ("0" + h) : h;
			var m = d.getMinutes();
			m = (m < 10) ? ("0" + m) : m;
			var s = d.getSeconds();
			s = (s < 10) ? ("0" + s) : s;
			that.v.value.setValue(d.getFullYear(), d.getMonth() + 1, d
					.getDate(), h, m, s);
		}
		if (that.v.value.datatype == "Date") {
			var d = new Date(val);
			that.v.value.setValue(d.getFullYear(), d.getMonth() + 1, d
					.getDate(), 0, 0, 0);
		}
		if (that.v.value.datatype == "Time") {
			var t = val.split(":");
			that.v.value.setValue(0, 0, 0, t[0], t[1], t[2]);
		}
	};

	EditPanel.prototype.setInitValue = function(v) {
		this.v = v;// v is a data variable object.
		// display:show/hide
		if (v.datatype == "Integer") {
			this.numberPane.style.display = "";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (v.datatype == "Boolean") {
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (v.datatype == "Double") {
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (v.datatype == "Currency") {
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (v.datatype == "String") {
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (v.datatype == "JSONData") {
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (v.datatype == "DateTime") {
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "";
			this.dtPane.style.display = "";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (v.datatype == "Date") {
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (v.datatype == "Time") {
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "";
			this.durationPane.style.display = "none";
			this.filePane.style.display = "none";
		} else if (v.datatype == "TimeDuration") {
			this.numberPane.style.display = "none";
			this.bvaluePane.style.display = "none";
			this.valuePane.style.display = "none";
			this.isCurrDtPane.style.display = "none";
			this.dtPane.style.display = "none";
			this.datePane.style.display = "none";
			this.timePane.style.display = "none";
			this.durationPane.style.display = "";
			this.filePane.style.display = "none";
		} else if (v.datatype == "File") {
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
			o.oid = this.v.owner;
			o.pid = this.v.currOwner;
			o.vid = this.v.id;
			o.fid = this.v.value.id;
			this.uploadPlugin.setEntity(this.v, o);
		}
		// initializing
		if (v.datatype == "Boolean") {
			if (v.value instanceof BooleanConstant) {
				if (v.value.isTrue()) {
					this.bvalInput1.checked = true;
					this.bvalInput2.checked = false;
				} else if (!v.value.isTrue()) {
					this.bvalInput1.checked = false;
					this.bvalInput2.checked = true;
				}
			} else if (v.value instanceof NullValue) {
				this.bvalInput1.checked = false;
				this.bvalInput2.checked = false;
			}
		} else if (v.datatype == "Double" || v.datatype == "Currency"
				|| v.datatype == "String" || v.datatype == "JSONData") {
			if (v.value instanceof NullValue) {
				this.valInput.value = null;
			} else {
				this.valInput.value = v.value.toString();
			}
		} else if (v.datatype == "Integer") {
			if (v.value instanceof NullValue) {
				this.valInput.value = null;
			} else {
				this.valInput.value = v.value.toString();
			}
			// if (v.value.numberSystem == 0) {
			// 	document.getElementById("number1").checked = true;
			// 	document.getElementById("number2").checked = false;
			// 	document.getElementById("number3").checked = false;
			// } else if (v.value.numberSystem == 1) {
			// 	document.getElementById("number1").checked = false;
			// 	document.getElementById("number2").checked = true;
			// 	document.getElementById("number3").checked = false;
			// } else if (v.value.numberSystem == 2) {
			// 	document.getElementById("number1").checked = false;
			// 	document.getElementById("number2").checked = false;
			// 	document.getElementById("number3").checked = true;
			// }
		} else if (v.datatype == "Date") {
			if (v.value.currentDateTime == 1) {
				this.isCurrInput.checked = true;
				this.dateInput.disabled = true;
			} else {
				this.isCurrInput.checked = false;
				this.dateInput.disabled = false;
			}
			this.dateInput.value = v.value.toString();
		} else if (v.datatype == "DateTime") {
			if (v.value.currentDateTime == 1) {
				this.isCurrInput.checked = true;
				this.datetimeInput.disabled = true;
			} else {
				this.isCurrInput.checked = false;
				this.datetimeInput.disabled = false;
			}
			this.datetimeInput.value = v.value.toString();
		} else if (v.datatype == "Time") {
			if (v.value.currentDateTime == 1) {
				this.isCurrInput.checked = true;
				this.timeInput.disabled = true;

			} else {
				this.isCurrInput.checked = false;
				this.timeInput.disabled = false;
			}
			this.timeInput.value = v.value.toString();
		} else if (v.datatype == "TimeDuration") {
			this.daySelect.value = v.value.largeDurationUnit;
			this.dayInput.value = v.value.largeDuration;
			this.hourInput.value = v.value.hours;
			this.minuteInput.value = v.value.minutes;
			this.secondInput.value = v.value.seconds;
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