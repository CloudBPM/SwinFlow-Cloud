/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "emailCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var EamilCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	EamilCellEditor.prototype.loadEditor = function(tag, entity, prop, isnull) {
		var that = this;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).text();
		$(tag).text("");
		var inputObj = $("<input type='email' class='form-control'/>");
		inputObj.val(oldvalue).appendTo($(tag)).get(0).select();
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
		inputObj.focus();
		inputObj.click(function() {
			return false;
		}).keydown(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 9) { // Tab key
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

	EamilCellEditor.prototype.changeValue = function(tag, entity, prop,
			oldvalue, isnull) {
		var newvalue = $(tag).children("input").val();
		if (isnull == "n" && (newvalue == null || newvalue == "")) {
			this.options.msg.show("当前属性不能为空。");
			return false;
		} else {
			if (newvalue != oldvalue) {
				for (x in entity) {
					if (x == prop) {
						map[entity.id].stack
								.execute(new OMOrgTextPropChangedCmd(entity,
										prop, newvalue));
						break;
					}
				}
			} else {
				$(tag).text(oldvalue);
			}
			return true;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EamilCellEditor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);