/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "basicDataValueCellEditor";
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
		var that = this;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).text();
		$(tag).text("");
		var inputObj = $("<input type='text' class='form-control'/>");
		inputObj.val(oldvalue).appendTo($(tag)).get(0).select();
		var nextTR = inputObj.closest('tr').next();
		while (nextTR != undefined) {
			var nextTD = nextTR.find("td")[1];
			if (nextTD != undefined) {
				if (nextTD.getAttribute("type") != "-1") {
					break;
				}
			} else {
				break;
			}
			nextTR = $(nextTR).next();
		}
		inputObj.focus();
		inputObj.click(function() {
			return false;
		}).keypress(function(event) {
			if (type == "Integer") {
				Utils.blockNonNumbers(this, event, false, true);
			} else if (type == "Double") {
				Utils.blockNonNumbers(this, event, true, true);
			} else if (type == "Currency") {
				Utils.blockNonNumbers(this, event, true, false);
			}
			var keyvalue = event.which;
			if (keyvalue == 13) {// enter key
				event.preventDefault();
				if (that.changeValue(tag, entity, oldvalue)) {
					inputObj.remove();
					if (nextTD != undefined) {
						that.options.parent.startToEdit(nextTD);
					}
				} else {
					inputObj.focus();
					return false;
				}
			} else if (keyvalue == 27) {
				$(tag).text(oldvalue);
			}
		}).blur(function() {
			if (that.changeValue(tag, entity, oldvalue)) {
				inputObj.remove();
			} else {
				inputObj.focus();
				return false;
			}
		})
	};

	TextCellEditor.prototype.changeValue = function(tag, entity, oldvalue) {
		var newvalue = $(tag).children("input").val();
		if (newvalue != oldvalue) {
			entity.value = newvalue;
			this.options.parent.refreshValues();
		} else {
			$(tag).text(oldvalue);
		}
		return true;
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