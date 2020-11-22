;
(function($, window, document, undefined) {
	var pluginName = "dateSelector";
	var defaults = {
		"maxYear" : "2025",
		"minYear" : "1900",
		"defaultYear" : 0,
		"defaultMonth" : 0,
		"defaultDate" : 0,
	};

	var DateSelector = function(element, options) {
		this.element = element;
		this.options = $.extend({
			"maxYear" : "2025",
			"minYear" : "1900",
			"defaultYear" : 0,
			"defaultMonth" : 0,
			"defaultDate" : 0,
		}, defaults, options);
		var today = new Date();
		if (options.defaultYear <= 0) {
			options.defaultYear = today.getFullYear();
		}
		if (options.defaultMonth <= 0) {
			options.defaultMonth = today.getMonth() + 1;
		}
		if (options.defaultDate <= 0) {
			options.defaultDate = today.getDate();
		}
		this._defaults = defaults;
		this._name = pluginName;
		this.loadSelector(options);
	};

	DateSelector.prototype.loadSelector = function(options) {
		var dateSelectorPane = document.createElement("div");
		dateSelectorPane.className = "form-inline";
		this.element.appendChild(dateSelectorPane);

		this.yearselect = document.createElement("select");
		dateSelectorPane.appendChild(this.yearselect);
		this.yearselect.className = "form-control";
		this.yearselect.id = "yearselect";
		this.yearselect.focus();

		this.monthselect = document.createElement("select");
		dateSelectorPane.appendChild(this.monthselect);
		this.monthselect.className = "form-control";
		this.monthselect.id = "monthselect";

		this.dayselect = document.createElement("select");
		dateSelectorPane.appendChild(this.dayselect);
		this.dayselect.className = "form-control";
		this.dayselect.id = "dayselect";

		for (var i = options.minYear; i <= options.maxYear; i++) {
			this.addOptions(this.yearselect, i, i);
		}
		for (var i = 1; i <= 12; i++) {
			var title = (i < 10) ? "0" + i : i;
			this.addOptions(this.monthselect, title, title);
		}
		for (var i = 1; i <= 31; i++) {
			var title = (i < 10) ? "0" + i : i;
			this.addOptions(this.dayselect, title, title);
		}
		this.yearselect.addEventListener("change", this, false);
		this.monthselect.addEventListener("change", this, false);

		if (options.defaultYear != 0 && options.defaultYear <= options.maxYear
				&& options.defaultYear >= options.minYear) {
			this.selectOption(this.yearselect, options.defaultYear);
		}
		if (options.defaultMonth != 0 && options.defaultMonth <= 12
				&& options.defaultMonth >= 1) {
			this.selectOption(this.monthselect, options.defaultMonth);
		}
		if (options.defaultDate != 0 && options.defaultDate <= 31
				&& options.defaultDate >= 1) {
			this.selectOption(this.dayselect, options.defaultDate);
		}

	};

	DateSelector.prototype.setDate = function(date) {
		if (date == null)
			return;
		var d = null;
		if ($.type(date) == "string") {// date is like 2015-09-02, 2016-08-30
			var yyyy = date.substring(0, 4);
			var mm = date.substring(5, 7);
			var dd = date.substring(8, 10);
			var d = new Date(yyyy, mm, dd);
			d.setSeconds(d.getSeconds() + (d.getTimezoneOffset() * 60));
		} else if ($.type(date) == "date") {
			var d = date;
		}
		if (d != null) {
			if (d.getFullYear() != 0 && d.getFullYear() <= this.options.maxYear
					&& d.getFullYear() >= this.options.minYear) {
				this.selectOption(this.yearselect, d.getFullYear());
			}
			if (d.getMonth() + 1 != 0 && d.getMonth() + 1 <= 12
					&& d.getMonth() + 1 >= 1) {
				this.selectOption(this.monthselect, d.getMonth() + 1);
			}
			if (d.getDate() != 0 && d.getDate() <= 31 && d.getDate() >= 1) {
				this.selectOption(this.dayselect, d.getDate());
			}
		}

	};

	DateSelector.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	DateSelector.prototype.doChange = function(evt) {
		if (evt.srcElement == this.monthselect
				|| evt.srcElement == this.yearselect) {
			var y = this.yearselect.options[this.yearselect.selectedIndex].value;
			var m = this.monthselect.options[this.monthselect.selectedIndex].value;
			var d = this.dayselect.options[this.dayselect.selectedIndex].value;
			var selectedDate = new Date(y, m, 0);
			var maxDay = selectedDate.getDate();
			while (this.dayselect.options.length > 0) {
				this.dayselect.options.remove(0);
			}
			for (var i = 1; i <= maxDay; i++) {
				var title = (i < 10) ? "0" + i : i;
				this.addOptions(this.dayselect, title, title);
			}
			this.selectOption(this.dayselect, d);
		}
	};

	DateSelector.prototype.selectOption = function(parent, title) {
		for (var i = 0; i < parent.options.length; i++) {
			if (parseInt(parent.options[i].text) == title) {
				parent.selectedIndex = i;
				break;
			}
		}
	}

	DateSelector.prototype.addOptions = function(parent, title, value) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option);
	};

	DateSelector.prototype.fetchYear = function() {
		return this.yearselect.options[this.yearselect.selectedIndex].value;
	};

	DateSelector.prototype.fetchMonth = function() {
		return this.monthselect.options[this.monthselect.selectedIndex].value;
	};

	DateSelector.prototype.fetchDay = function() {
		return this.dayselect.options[this.dayselect.selectedIndex].value;
	};

	DateSelector.prototype.fetchDateObject = function() {
		return new Date(
				this.yearselect.options[this.yearselect.selectedIndex].value,
				this.monthselect.options[this.monthselect.selectedIndex].value,
				this.dayselect.options[this.dayselect.selectedIndex].value);
	};

	DateSelector.prototype.fetchDateString = function() {
		return this.yearselect.options[this.yearselect.selectedIndex].value
				+ "-"
				+ this.monthselect.options[this.monthselect.selectedIndex].value
				+ "-"
				+ this.dayselect.options[this.dayselect.selectedIndex].value;
	};
	
	DateSelector.prototype.setEnabled = function(enabled) {
		if (enabled) {
			this.yearselect.removeAttribute("disabled");
			this.monthselect.removeAttribute("disabled");
			this.dayselect.removeAttribute("disabled");
		} else {
			this.yearselect.setAttribute("disabled", "true");
			this.monthselect.setAttribute("disabled", "true");
			this.dayselect.setAttribute("disabled", "true");
		}
	}

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new DateSelector(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);
