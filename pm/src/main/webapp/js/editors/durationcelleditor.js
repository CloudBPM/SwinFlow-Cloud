/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "timeDurationCellEditor";
	var defaults = {
		parent : "",
	};

	var TextCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	TextCellEditor.prototype.loadEditor = function(tag, entity, type) {
		this.v = entity;
		var that = this;
		if ($(tag).attr("type") == "h") {
			return;
		}
		this.editing = 1;
		var oldvalue = $(tag).text();
		$(tag).text("");

		this.durDiv1 = document.createElement("div");
		tag.appendChild(this.durDiv1);
		this.durDiv1.className = "form-inline";
		this.durDiv1.addEventListener("mouseleave", this, false);

		var durDiv2 = document.createElement("div");
		this.durDiv1.appendChild(durDiv2);
		durDiv2.className = "input-group";

		this.dayInput = document.createElement("input");
		durDiv2.appendChild(this.dayInput);
		this.dayInput.type = "text";
		this.dayInput.name = "wwDayInput";
		this.dayInput.value = this.v.largeDuration;
		this.dayInput.className = "form-control";
		this.dayInput.style.width = "60px";
		this.dayInput.addEventListener("change", this, false);
		this.dayInput.addEventListener("keypress", this, false);
		this.dayInput.addEventListener("blur", this, false);
		this.dayInput.focus();

		var durDiv3 = document.createElement("div");
		durDiv2.appendChild(durDiv3);
		durDiv3.className = "input-group-btn";

		this.daySelect = document.createElement("select");
		durDiv3.appendChild(this.daySelect);
		this.daySelect.className = "form-control";
		this.daySelect.name = "wDaySelect";
		this.daySelect.style.borderLeft = "0";
		this.daySelect.style.backgroundColor = "#eeeeee";
		this.daySelect.addEventListener("change", this, false);
		this.daySelect.addEventListener("blur", this, false);

		this.addOptions(this.daySelect, largeduration[0], "0", 0);
		this.addOptions(this.daySelect, largeduration[1], "1", 1);
		this.addOptions(this.daySelect, largeduration[2], "2", 2);
		this.addOptions(this.daySelect, largeduration[3], "3", 3);
		this.addOptions(this.daySelect, largeduration[4], "4", 4);

		this.daySelect.value = this.v.largeDurationUnit;

		// hour
		var hourgroup = document.createElement("div");
		this.durDiv1.appendChild(hourgroup);
		hourgroup.className = "input-group";

		this.hourInput = document.createElement("input");
		hourgroup.appendChild(this.hourInput);
		this.hourInput.type = "text";
		this.hourInput.name = "wHourInput";
		this.hourInput.value = this.v.hours;
		this.hourInput.className = "form-control";
		this.hourInput.style.width = "60px";
		this.hourInput.addEventListener("change", this, false);
		this.hourInput.addEventListener("keypress", this, false);
		this.hourInput.addEventListener("blur", this, false);

		var hourLabel = document.createElement("div");
		hourgroup.appendChild(hourLabel);
		hourLabel.innerHTML = largeduration[5];
		hourLabel.className = "input-group-addon";
		hourLabel.setAttribute("for", "wHourInput");

		// minute
		var minutegroup = document.createElement("div");
		this.durDiv1.appendChild(minutegroup);
		minutegroup.className = "input-group";

		this.minuteInput = document.createElement("input");
		minutegroup.appendChild(this.minuteInput);
		this.minuteInput.type = "text";
		this.minuteInput.name = "wMinuteInput";
		this.minuteInput.className = "form-control";
		this.minuteInput.style.width = "60px";
		this.minuteInput.value = this.v.minutes;
		this.minuteInput.addEventListener("change", this, false);
		this.minuteInput.addEventListener("keypress", this, false);
		this.minuteInput.addEventListener("blur", this, false);

		var minuteLabel = document.createElement("div");
		minutegroup.appendChild(minuteLabel);
		minuteLabel.className = "input-group-addon";
		minuteLabel.innerHTML = largeduration[6];
		minuteLabel.setAttribute("for", "wMinuteInput");

		// second
		var secondgroup = document.createElement("div");
		this.durDiv1.appendChild(secondgroup);
		secondgroup.className = "input-group";

		this.secondInput = document.createElement("input");
		secondgroup.appendChild(this.secondInput);
		this.secondInput.type = "text";
		this.secondInput.name = "wSecondInput";
		this.secondInput.className = "form-control";
		this.secondInput.style.width = "60px";
		this.secondInput.value = this.v.seconds;
		this.secondInput.addEventListener("change", this, false);
		this.secondInput.addEventListener("keypress", this, false);
		this.secondInput.addEventListener("blur", this, false);

		var secLabel = document.createElement("div");
		secondgroup.appendChild(secLabel);
		secLabel.className = "input-group-addon";
		secLabel.innerHTML = largeduration[7];
		secLabel.setAttribute("for", "wSecondInput");
	};

	TextCellEditor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		case "keypress":
			this.doKeypress(e);
			break;
		case "blur":
			this.doBlur(e);
			break;
		case "mouseleave":
			this.doMouseleave(e);
			break;
		}
	};

	TextCellEditor.prototype.doMouseleave = function(event) {
		this.editing = 0;
	};

	TextCellEditor.prototype.doBlur = function(event) {
		// detect if document's focus is on day input.
		// $(this).is(':focus');
		// this.dayInput === document.activeElement 
		if (this.editing == 0) {
			$(this.durDiv1).remove();
			this.options.parent.refreshValues();
		}
	};

	TextCellEditor.prototype.doKeypress = function(event) {
		var keyvalue = event.which;
		if (keyvalue == 13) {// enter key
			event.preventDefault();
			if (event.target == this.dayInput) {
				this.dayInput.dispatchEvent(new Event('change'));
				this.editing = 1;
				this.daySelect.focus();
			} else if (event.target == this.daySelect) {
				this.daySelect.dispatchEvent(new Event('change'));
				this.editing = 1;
				this.hourInput.focus();
			} else if (event.target == this.hourInput) {
				this.hourInput.dispatchEvent(new Event('change'));
				this.editing = 1;
				this.minuteInput.focus();
			} else if (event.target == this.minuteInput) {
				this.minuteInput.dispatchEvent(new Event('change'));
				this.editing = 1;
				this.secondInput.focus();
			} else if (event.target == this.secondInput) {
				this.secondInput.dispatchEvent(new Event('change'));
				this.editing = 0;
				// this.dayInput.focus();
				$(this.durDiv1).remove();
				this.options.parent.refreshValues();
			}
			return;
		} else if (keyvalue == 27) { // ESC
			event.preventDefault();
			this.editing = 0;
			$(this.durDiv1).remove();
			this.options.parent.refreshValues();
			return;
		} else if (keyvalue == 9) { // Tab
			if (event.target == this.dayInput) {
				this.dayInput.dispatchEvent(new Event('change'));
				this.editing = 1;
				this.daySelect.focus();
			} else if (event.target == this.daySelect) {
				this.daySelect.dispatchEvent(new Event('change'));
				this.editing = 1;
				this.hourInput.focus();
			} else if (event.target == this.hourInput) {
				this.hourInput.dispatchEvent(new Event('change'));
				this.editing = 1;
				this.minuteInput.focus();
			} else if (event.target == this.minuteInput) {
				this.minuteInput.dispatchEvent(new Event('change'));
				this.editing = 1;
				this.secondInput.focus();
			} else if (event.target == this.secondInput) {
				this.secondInput.dispatchEvent(new Event('change'));
				this.editing = 1;
				this.dayInput.focus();
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
			}
		}

	};

	TextCellEditor.prototype.doChange = function(evt) {
		if (evt.target == this.dayInput) {
			this.v.largeDuration = this.dayInput.value;
		} else if (evt.target == this.daySelect) {
			this.v.largeDurationUnit = this.daySelect.value;
		} else if (evt.target == this.hourInput) {
			this.v.hours = this.hourInput.value;
		} else if (evt.target == this.minuteInput) {
			this.v.minutes = this.minuteInput.value;
		} else if (evt.target == this.secondInput) {
			this.v.seconds = this.secondInput.value;
		}
	};

	TextCellEditor.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new TextCellEditor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);