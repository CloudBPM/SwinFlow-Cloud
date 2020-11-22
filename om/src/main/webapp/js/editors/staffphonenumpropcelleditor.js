/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "staffPhoneNumPropCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var StaffPhoneNumPropCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	StaffPhoneNumPropCellEditor.prototype.loadEditor = function(tabid, tag,
			entity, prop, isnull) {
		var that = this;
		this.tabId = tabid;
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
		}).keydown(
				function(event) {
					var keyvalue = event.which;
					if (keyvalue == 9) { // Tab key
						event.preventDefault();
						if (that.changeValue(tag, entity, prop, oldvalue,
								isnull)) {
							inputObj.remove();
							if (nextTD != undefined) {
								that.options.parent.startToEdit(nextTD);
							}
						} else {
							inputObj.focus();
							return false;
						}
					} else if (keyvalue != 8 && keyvalue != 37
							&& keyvalue != 39 && keyvalue != 46
							&& keyvalue != 36 && keyvalue != 35
							&& !(keyvalue >= 48 && keyvalue <= 57)) {
						return false;
					}
				}).keyup(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 13) {// enter key
				event.preventDefault();
				if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
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
			if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
				inputObj.remove();
			} else {
				inputObj.focus();
				return false;
			}
		})
	};

	StaffPhoneNumPropCellEditor.prototype.changeValue = function(tag, entity,
			prop, oldvalue, isnull) {
		var newvalue = $(tag).children("input").val();
		if (isnull == "n" && (newvalue == null || newvalue == "")) {
			this.options.msg.show("这个属性不能为空。");
			return false;
		} else {
			if (newvalue != oldvalue) {
				map[this.tabId].stack.execute(new StaffPropsChangeCmd(
						this.tabId, entity, prop, newvalue));
			} else {
				$(tag).text(oldvalue);
			}
			return true;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new StaffPhoneNumPropCellEditor(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);