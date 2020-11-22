;
(function($, window, document, undefined) {
	var pluginName = "waitingTaskEditPanel";
	var defaults = {
		id : "",
		parent : "",
		topparent : "",
		currowner : "",
	};

	var WaitingTaskPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			topparent : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent = options.topparent;
		this.init(options);
	};

	WaitingTaskPanel.prototype.init = function(options) {
		// rule edit dialog;
		var plugin2 = $(this.topparent).assignmentEditDialog({
			id : options.id,
			title : "规则编辑器",
			parent : this,
			topparent : this.topparent,
		});
		this.ruleditdialog = plugin2.data("assignmentEditDialog");
		this.loadPane(options.entity, options.currowner);
	};

	WaitingTaskPanel.prototype.loadPane = function(entity, owner) {
		this.owner = owner;
		this.entity = entity;
		var mainmodalframeDiv = document.createElement("div");
		this.element.appendChild(mainmodalframeDiv);
		mainmodalframeDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		mainmodalframeDiv.style.padding = "4px";

		var mainmodalframe = document.createElement("div");
		mainmodalframeDiv.appendChild(mainmodalframe);
		mainmodalframe.className = "panel panel-default";
		mainmodalframe.style.border = "0";

		var modalframe = document.createElement("div");
		mainmodalframe.appendChild(modalframe);
		modalframe.className = "panel-body";

		var daysgrouplabel = document.createElement("label");
		modalframe.appendChild(daysgrouplabel);
		daysgrouplabel.innerHTML = "等待时段设定";

		var watingtasksettingform = document.createElement("form");
		modalframe.appendChild(watingtasksettingform);
		watingtasksettingform.className = "form-inline";

		// option1 : setting fixed delay
		var radioOptionDiv = document.createElement("div");
		watingtasksettingform.appendChild(radioOptionDiv);
		radioOptionDiv.className = "radio";

		var radioOptionLabel = document.createElement("label");
		radioOptionDiv.appendChild(radioOptionLabel);

		this.radioOption = document.createElement("input");
		this.radioOption.type = "radio";
		this.radioOption.name = "waitingSettingOption" + this.options.id;
		this.radioOption.id = "waitCondtionOptions1" + this.options.id;
		this.radioOption.setAttribute("value", "1");
		this.radioOption.addEventListener("click", this, false);
		radioOptionLabel.appendChild(this.radioOption);

		var radioOptionTxt = document.createElement("label");
		radioOptionTxt.innerHTML = "固定时间段";
		radioOptionLabel.appendChild(radioOptionTxt);

		var watingtaskDiv = document.createElement("div");
		radioOptionDiv.appendChild(watingtaskDiv);
		var daysgroup = document.createElement("div");
		daysgroup.style.padding = "2px";
		daysgroup.className = "form-group";
		watingtaskDiv.appendChild(daysgroup);

		this.dayInput = document.createElement("input");
		this.dayInput.type = "text";
		this.dayInput.id = "wDayInput" + this.options.id;
		this.dayInput.name = "wwDayInput" + this.options.id;
		this.dayInput.value = "0";
		this.dayInput.className = "form-control";
		this.dayInput.setAttribute("placeholder", "请输入一个正整数值...");

		daysgroup.appendChild(this.dayInput);

		this.daySelect = document.createElement("select");
		this.daySelect.className = "form-control";
		this.daySelect.id = "wDaySelect" + this.options.id;
		this.daySelect.name = "wDaySelect" + this.options.id;

		this.addOptions(this.daySelect, largeduration[0], "0", 0);
		this.addOptions(this.daySelect, largeduration[1], "1", 1);
		this.addOptions(this.daySelect, largeduration[2], "2", 2);
		this.addOptions(this.daySelect, largeduration[3], "3", 3);
		this.addOptions(this.daySelect, largeduration[4], "4", 4);
		daysgroup.appendChild(this.daySelect);

		// hour
		var hourgroup = document.createElement("div");
		hourgroup.className = "input-group";
		hourgroup.style.padding = "2px";
		watingtaskDiv.appendChild(hourgroup);

		this.hourInput = document.createElement("input");
		this.hourInput.type = "text";
		this.hourInput.id = "wHourInput" + this.options.id;
		this.hourInput.name = "wHourInput" + this.options.id;
		this.hourInput.value = "0";
		this.hourInput.className = "form-control";
		this.hourInput.setAttribute("placeholder", "请输入小时数...");

		hourgroup.appendChild(this.hourInput);

		var hourLabel = document.createElement("div");
		hourLabel.innerHTML = largeduration[5];
		hourLabel.className = "input-group-addon";
		// hourLabel.setAttribute("for", "waitingTaskHourInput" +
		// this.options.id);
		hourgroup.appendChild(hourLabel);
		// minute
		var minutegroup = document.createElement("div");
		minutegroup.className = "input-group";
		minutegroup.style.padding = "2px";
		watingtaskDiv.appendChild(minutegroup);

		this.minuteInput = document.createElement("input");
		this.minuteInput.type = "text";
		this.minuteInput.id = "wMinuteInput" + this.options.id;
		this.minuteInput.name = "wMinuteInput" + this.options.id;
		this.minuteInput.className = "form-control";
		this.minuteInput.setAttribute("placeholder", "请输入分钟数...");
		this.minuteInput.value = "0";
		minutegroup.appendChild(this.minuteInput);

		var minuteLabel = document.createElement("div");
		minuteLabel.className = "input-group-addon";
		minuteLabel.innerHTML = largeduration[6];
		minuteLabel.setAttribute("for", "wMinuteInput" + this.options.id);
		minutegroup.appendChild(minuteLabel);
		// second
		var secondgroup = document.createElement("div");
		secondgroup.className = "input-group";
		secondgroup.style.padding = "2px";
		watingtaskDiv.appendChild(secondgroup);

		this.secondInput = document.createElement("input");
		this.secondInput.type = "text";
		this.secondInput.id = "wSecondInput" + this.options.id;
		this.secondInput.name = "wSecondInput" + this.options.id;
		this.secondInput.className = "form-control";
		this.secondInput.value = "0";
		this.secondInput.setAttribute("placeholder", "请输入秒数...");
		secondgroup.appendChild(this.secondInput);

		var secondLabel = document.createElement("div");
		secondLabel.className = "input-group-addon";
		secondLabel.innerHTML = largeduration[7];
		secondLabel.setAttribute("for", "wSecondInput" + this.options.id);
		secondgroup.appendChild(secondLabel);

		// millisecond
		var millisecondgroup = document.createElement("div");
		millisecondgroup.className = "input-group";
		millisecondgroup.style.padding = "2px";
		watingtaskDiv.appendChild(millisecondgroup);

		this.millisecondInput = document.createElement("input");
		this.millisecondInput.type = "text";
		this.millisecondInput.id = "wMillisecondInput" + this.options.id;
		this.millisecondInput.name = "wMillisecondInput" + this.options.id;
		this.millisecondInput.className = "form-control";
		this.millisecondInput.value = "0";
		this.millisecondInput.setAttribute("placeholder", "请输入毫秒数...");
		millisecondgroup.appendChild(this.millisecondInput);

		var millisecondLabel = document.createElement("div");
		millisecondLabel.className = "input-group-addon";
		millisecondLabel.innerHTML = largeduration[8];
		millisecondLabel.setAttribute("for", "wMillisecondInput"
				+ this.options.id);
		millisecondgroup.appendChild(millisecondLabel);

		// option2 : setting variable delay
		var radioOptionDiv1 = document.createElement("div");
		radioOptionDiv1.className = "radio";
		watingtasksettingform.appendChild(radioOptionDiv1);

		var radioOptionLabel1 = document.createElement("label");
		radioOptionDiv1.appendChild(radioOptionLabel1);

		this.radioOption1 = document.createElement("input");
		this.radioOption1.type = "radio";
		this.radioOption1.name = "waitingSettingOption" + this.options.id;
		this.radioOption1.id = "waitCondtionOptions2" + this.options.id;
		this.radioOption1.setAttribute("value", "2");
		this.radioOption1.addEventListener("click", this, false);
		radioOptionLabel1.appendChild(this.radioOption1);

		var radioOptionTxt1 = document.createElement("label");
		radioOptionTxt1.innerHTML = "非固定时间段";
		radioOptionLabel1.appendChild(radioOptionTxt1);

		var watingtaskVariableDiv = document.createElement("div");
		radioOptionDiv1.appendChild(watingtaskVariableDiv);
		// watingtaskVariableDiv.className = "col-lg-12 col-md-12 col-sm-12
		// col-xs-12";

		var variablesettinggroup = document.createElement("div");
		variablesettinggroup.className = "input-group";
		variablesettinggroup.style.padding = "2px";
		watingtaskVariableDiv.appendChild(variablesettinggroup);

		var buttongspan = document.createElement("span");
		buttongspan.className = "input-group-btn";
		variablesettinggroup.appendChild(buttongspan);

		this.waitVariableButton = document.createElement("button");
		this.waitVariableButton.type = "button";
		this.waitVariableButton.id = "waitVariableButton" + this.options.id;
		this.waitVariableButton.name = "waitVariableButton" + this.options.id;
		this.waitVariableButton.className = "btn btn-primary";
		this.waitVariableButton.innerHTML = "编辑";
		this.waitVariableButton.setAttribute("disabled", "true");
		this.waitVariableButton.addEventListener("click", this, false);
		buttongspan.appendChild(this.waitVariableButton);

		this.waitVariableDetail = document.createElement("input");
		this.waitVariableDetail.type = "text";
		this.waitVariableDetail.className = "form-control";
		this.waitVariableDetail.style.width = "100%";
		this.waitVariableDetail.setAttribute("readonly", "");
		this.waitVariableDetail.id = "waitVariableSettingDetails"
				+ this.options.id;
		variablesettinggroup.appendChild(this.waitVariableDetail);

		var variableselectgroup = document.createElement("div");
		variableselectgroup.className = "form-group";
		variableselectgroup.style.padding = "2px";
		watingtaskVariableDiv.appendChild(variableselectgroup);

		this.timeUnitSelect = document.createElement("select");
		this.timeUnitSelect.className = "form-control";
		this.timeUnitSelect.id = "wDaySelect" + this.options.id;
		this.timeUnitSelect.name = "wDaySelect" + this.options.id;
		// 0:workday; 1:day; 2:week; 3:month; 4:quarter(3 months);
		// 5:hour; 6:minute; 7:second; 8:millisecond;
		this.addOptions(this.timeUnitSelect, largeduration[0], "0", 0);
		this.addOptions(this.timeUnitSelect, largeduration[1], "1", 1);
		this.addOptions(this.timeUnitSelect, largeduration[2], "2", 2);
		this.addOptions(this.timeUnitSelect, largeduration[3], "3", 3);
		this.addOptions(this.timeUnitSelect, largeduration[4], "4", 4);
		this.addOptions(this.timeUnitSelect, largeduration[5], "5", 5);
		this.addOptions(this.timeUnitSelect, largeduration[6], "6", 6);
		this.addOptions(this.timeUnitSelect, largeduration[7], "7", 7);
		this.addOptions(this.timeUnitSelect, largeduration[8], "8", 8);

		variableselectgroup.appendChild(this.timeUnitSelect);

		this.setTask(this.entity, owner);

		this.addListeners();

	};

	WaitingTaskPanel.prototype.addListeners = function() {
		this.dayInput.addEventListener("focusout", this, false);
		this.dayInput.addEventListener("keypress", this, false);
		this.daySelect.addEventListener("change", this, false);
		this.hourInput.addEventListener("focusout", this, false);
		this.hourInput.addEventListener("keypress", this, false);
		this.minuteInput.addEventListener("focusout", this, false);
		this.minuteInput.addEventListener("keypress", this, false);
		this.secondInput.addEventListener("focusout", this, false);
		this.secondInput.addEventListener("keypress", this, false);
		this.millisecondInput.addEventListener("focusout", this, false);
		this.millisecondInput.addEventListener("keypress", this, false);

		this.timeUnitSelect.addEventListener("change", this, false);
	}

	WaitingTaskPanel.prototype.removeListeners = function() {
		this.dayInput.removeEventListener("focusout", this, false);
		this.dayInput.removeEventListener("keypress", this, false);
		this.daySelect.removeEventListener("change", this, false);
		this.hourInput.removeEventListener("focusout", this, false);
		this.hourInput.removeEventListener("keypress", this, false);
		this.minuteInput.removeEventListener("focusout", this, false);
		this.minuteInput.removeEventListener("keypress", this, false);
		this.secondInput.removeEventListener("focusout", this, false);
		this.secondInput.removeEventListener("keypress", this, false);
		this.millisecondInput.removeEventListener("focusout", this, false);
		this.millisecondInput.removeEventListener("keypress", this, false);
		this.timeUnitSelect.removeEventListener("change", this, false);
	}

	WaitingTaskPanel.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	WaitingTaskPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		case "focusout":
			this.doFocusout(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		case "keypress":
			this.doKeypress(e);
			break;
		}
	};

	WaitingTaskPanel.prototype.doKeypress = function(event) {
		var keyvalue = event.which;
		if (keyvalue == 13 || keyvalue == 9) {// Enter key or Tab key
			event.preventDefault();
			if (event.target == this.dayInput) {
				this.dayInput.dispatchEvent(new Event('change'));
				this.daySelect.focus();
			} else if (event.target == this.daySelect) {
				this.daySelect.dispatchEvent(new Event('change'));
				this.hourInput.focus();
			} else if (event.target == this.hourInput) {
				this.hourInput.dispatchEvent(new Event('change'));
				this.minuteInput.focus();
			} else if (event.target == this.minuteInput) {
				this.minuteInput.dispatchEvent(new Event('change'));
				this.secondInput.focus();
			} else if (event.target == this.secondInput) {
				this.secondInput.dispatchEvent(new Event('change'));
				this.millisecondInput.focus();
			}
			return;
		} else {
			if (event.target == this.dayInput) {
				Utils.blockNonNumbers(this.dayInput, event, false, false);
			} else if (event.target == this.hourInput) {
				Utils.blockNonNumbers(this.hourInput, event, false, false);
			} else if (event.target == this.minuteInput) {
				Utils.blockNonNumbers(this.minuteInput, event, false, false);
			} else if (event.target == this.secondInput) {
				Utils.blockNonNumbers(this.secondInput, event, false, false);
			} else if (event.target == this.millisecondInput) {
				Utils.blockNonNumbers(this.millisecondInput, event, false,
						false);
			}
		}

	};

	WaitingTaskPanel.prototype.doDblClick = function(evt) {
		if (this.radioOption1.checked) {
			this.ruleditdialog.initialDialog(this.entity, this.owner);
			this.ruleditdialog.show();
		}
	};

	WaitingTaskPanel.prototype.doClick = function(evt) {
		// specific time (fixed time duration)
		if (evt.target.id == "waitCondtionOptions1" + this.options.id) {
			map[this.entity.currOwner].stack
					.execute(new PMDelayOptionChangeCmd(this.entity, this,
							true, this.owner));
		} else if (evt.target.id == "waitCondtionOptions2" + this.options.id) {
			// variable time duration
			map[this.entity.currOwner].stack
					.execute(new PMDelayOptionChangeCmd(this.entity, this,
							false, this.owner));
		} else if (evt.target.id == "waitVariableButton" + this.options.id) {
			// show rule edit dialog ...
			this.ruleditdialog.initTimeRuleDialog(this.entity, this.owner);
			this.ruleditdialog.show();
		}
	};

	WaitingTaskPanel.prototype.doFocusout = function(evt) {
		if (evt.target == this.dayInput) {
			if (this.entity.largeDuration != this.dayInput.value) {
				map[this.entity.currOwner].stack.execute(new PMValueChangedCmd(
						this.entity, "largeDuration", this.dayInput.value,
						this.owner));
			}
		} else if (evt.target == this.hourInput) {
			if (this.entity.hours != this.hourInput.value) {
				map[this.entity.currOwner].stack
						.execute(new PMValueChangedCmd(this.entity, "hours",
								this.hourInput.value, this.owner));
			}
		} else if (evt.target == this.minuteInput) {
			if (this.entity.minutes != this.minuteInput.value) {
				map[this.entity.currOwner].stack.execute(new PMValueChangedCmd(
						this.entity, "minutes", this.minuteInput.value,
						this.owner));
			}
		} else if (evt.target == this.secondInput) {
			if (this.entity.seconds != this.secondInput.value) {
				map[this.entity.currOwner].stack.execute(new PMValueChangedCmd(
						this.entity, "seconds", this.secondInput.value,
						this.owner));
			}
		} else if (evt.target == this.millisecondInput) {
			if (this.entity.milliseconds != this.millisecondInput.value) {
				map[this.entity.currOwner].stack.execute(new PMValueChangedCmd(
						this.entity, "milliseconds",
						this.millisecondInput.value, this.owner));
			}
		}
	};

	WaitingTaskPanel.prototype.doChange = function(evt) {
		if (evt.target == this.daySelect) {
			map[this.entity.currOwner].stack.execute(new PMValueChangedCmd(
					this.entity, "largeDurationUnit",
					this.daySelect.options[this.daySelect.selectedIndex].value,
					this.owner));
		} else if (evt.target == this.timeUnitSelect) {
			map[this.entity.currOwner].stack
					.execute(new PMValueChangedCmd(
							this.entity,
							"timeUnit",
							this.timeUnitSelect.options[this.timeUnitSelect.selectedIndex].value,
							this.owner));
		}
	};

	WaitingTaskPanel.prototype.setTask = function(task, owner) {
		this.entity = task; // wait task
		if (this.entity.specificDuration) {
			this.radioOption.checked = true; // specific;
		} else {
			this.radioOption1.checked = true // variable
		}

		this.enable(this.radioOption);
		this.enable(this.radioOption1);
		this.disabled(this.waitVariableButton);
		this.disabled(this.timeUnitSelect);
		this.disabled(this.dayInput);
		this.disabled(this.daySelect);
		this.disabled(this.hourInput);
		this.disabled(this.minuteInput);
		this.disabled(this.secondInput);
		this.disabled(this.millisecondInput);

		this.dayInput.value = this.entity.largeDuration;
		this.hourInput.value = this.entity.hours;
		this.minuteInput.value = this.entity.minutes;
		this.secondInput.value = this.entity.seconds;
		this.millisecondInput.value = this.entity.milliseconds;

		this.daySelect.selectedIndex = this.entity.largeDurationUnit;
		this.timeUnitSelect.selectedIndex = this.entity.timeUnit;
		if (this.entity.timeRule != null) {
			this.updateDetails(this.entity.timeRule);
		}

		this.setSpecific(this.entity.specificDuration);

		if (owner instanceof ReleasedWfProcess) {
			this.disabled(this.radioOption);
			this.disabled(this.radioOption1);
			this.disabled(this.waitVariableButton);
			this.disabled(this.timeUnitSelect);
			this.disabled(this.dayInput);
			this.disabled(this.daySelect);
			this.disabled(this.hourInput);
			this.disabled(this.minuteInput);
			this.disabled(this.secondInput);
			this.disabled(this.millisecondInput);
		}
	};

	WaitingTaskPanel.prototype.setSpecific = function(specific) {
		if (specific) {
			this.disabled(this.waitVariableButton);
			this.disabled(this.timeUnitSelect);

			this.enable(this.dayInput);
			this.enable(this.daySelect);
			this.enable(this.hourInput);
			this.enable(this.minuteInput);
			this.enable(this.secondInput);
			this.enable(this.millisecondInput);
		} else {
			this.enable(this.waitVariableButton);
			this.enable(this.timeUnitSelect);

			this.disabled(this.dayInput);
			this.disabled(this.daySelect);
			this.disabled(this.hourInput);
			this.disabled(this.minuteInput);
			this.disabled(this.secondInput);
			this.disabled(this.millisecondInput);
		}
	};

	WaitingTaskPanel.prototype.enable = function(component) {
		component.disabled = false;
	};

	WaitingTaskPanel.prototype.disabled = function(component) {
		component.disabled = true;
	};

	WaitingTaskPanel.prototype.updateDetails = function(rule) {
		// $(this.navRuleDetail).val(rule.toString());
		if (rule != null)
			this.waitVariableDetail.value = rule.toString();
		else
			this.waitVariableDetail.value = "";
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new WaitingTaskPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);