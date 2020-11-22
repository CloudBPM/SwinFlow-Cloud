/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "dateCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var DateCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	DateCellEditor.prototype.loadEditor = function(tag, entity, prop, isnull) {
		var that = this;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).html();
		$(tag).html("");
		// initialize a date editor
		var divObj = $("<div id='divDate'></div>");
		divObj.appendTo($(tag)).click(function() {
			return false;
		});
		var inputObj = $("<fieldset class='birthdayPicker form-inline'></fieldset>");
		inputObj.appendTo(divObj);

		var date = new Date();
		date.setSeconds(date.getSeconds() + (date.getTimezoneOffset() * 60));
		var defaultdate = "" + date.getFullYear() + "," + (date.getMonth() + 1)
				+ "," + date.getDate();
		if (entity[prop] != undefined && entity[prop] != null
				&& entity[prop] != "") {
			defaultdate = entity[prop];
		}

		$("#divDate").birthdayPicker({
			"defaultDate" : defaultdate,
			"maxYear" : "2025",
			"maxAge" : 100,
			"monthFormat" : "long",
			"dateFormat" : "bigEndian",
		});

		$("select[name='divDate_birth[year]']").focus();

		// look up next editable TD.
		var nextTR = inputObj.closest('tr').next();
		while (nextTR != undefined) {
			var nextTD = nextTR.find("td")[1];
			if (nextTD != undefined) {
				if (nextTD.getAttribute("type") != "-1") {
					break;
				}
			} else {
				return;
			}
			nextTR = $(nextTR).next();
		}

		$(document).click(function() {
			that.changeValue(tag, entity, prop, oldvalue, isnull)
			$("#divDate").hide();
			$("#divDate").remove();
			if (nextTD != undefined) {
				that.options.parent.startToEdit(nextTD);
			}
			$(document).unbind("click");
		});

		$("select[name='divDate_birth[day]']").keydown(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 9) { // Tab key
				event.preventDefault();
				if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
					$("#divDate").hide();
					$("#divDate").remove();
					if (nextTD != undefined) {
						that.options.parent.startToEdit(nextTD);
					}
				} else {
					// inputObj.focus();
					return false;
				}
			}
		}).keyup(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 13) {// enter key
				event.preventDefault();
				if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
					$("#divDate").hide();
					$("#divDate").remove();
					if (nextTD != undefined) {
						that.options.parent.startToEdit(nextTD);
					}
				} else {
					// inputObj.focus();
					return false;
				}
			} else if (keyvalue == 27) {
				$(tag).html(oldvalue);
			}
		}).blur(function() {
			if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
				$("#divDate").hide();
				$("#divDate").remove();
				$(document).unbind("click");
			} else {
				// inputObj.focus();
				return false;
			}
		});

	};

	DateCellEditor.prototype.changeValue = function(tag, entity, prop,
			oldvalue, isnull) {
		var newvalue = $("input[name='divDate_birthDay']").val();
		if (isnull == "n"
				&& (newvalue == null || newvalue == "" || newvalue
						.indexOf("NaN"))) {
			this.options.msg.show("日期属性不能为空或不正确。");
			return false;
		} else {
			if (newvalue != undefined && newvalue != oldvalue) {
				for (x in entity) {
					if (x == prop) {
						map[entity.id].stack.execute(new OMOrgPropChangedCmd(
								entity, prop, newvalue));
						break;
					}
				}
			} else {
				$(tag).html(oldvalue);
			}
			return true;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new DateCellEditor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);