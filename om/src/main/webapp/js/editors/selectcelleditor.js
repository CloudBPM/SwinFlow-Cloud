/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "selectCellEditor";
	var defaults = {
		parent : "",
		msg: "",
	};

	var SelectCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg: "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	SelectCellEditor.prototype.loadEditor = function(tag, entity, prop, isnull) {
		var that = this;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).html();
		$(tag).html("");
		var selection = $("<select name='selection'/></select>");
		$("<option value='-1'>- 请选择 -</option>").appendTo($(selection));
		$("<option value='0'>否</option>").appendTo($(selection));
		$("<option value='1'>是</option>").appendTo($(selection));

		var nextTR = selection.closest('tr').next();
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
		
		selection.keydown(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 9) { // Tab key
				event.preventDefault();
				if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
					selection.remove();
					if (nextTD != undefined) {
						that.options.parent.startToEdit(nextTD);
					}
				} else {
					selection.focus();				
					return false;
				}
			}
		}).keyup(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 13) {// enter key
				event.preventDefault();
				if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
					selection.remove();
					if (nextTD != undefined) {
						that.options.parent.startToEdit(nextTD);
					}
				} else {
					selection.focus();				
					return false;
				}
			} else if (keyvalue == 27) {
				$(tag).html(oldvalue);
			}
		}).blur(function() {
			if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
				selection.remove();
			} else {
				selection.focus();				
				return false;
			}
		})
	};

	SelectCellEditor.prototype.changeValue = function(tag, entity, prop, oldvalue, isnull) {
		var newvalue = $(tag).children("input").val();
		if (isnull == "n" && (newvalue == null || newvalue == "")) {
			this.options.msg.show("这个属性不能为空。");
			return false;
		} else {
			if (newvalue != oldvalue) {
				$(tag).html(newvalue);
				this.setProp(entity, prop, newvalue);
			} else {
				$(tag).html(oldvalue);
			}
			return true;
		}
	};

	SelectCellEditor.prototype.setProp = function(obj, prop, newvalue) {
		for (x in obj) {
			if (x == prop) {
				obj[x] = newvalue; // cmd
				break;
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new SelectCellEditor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);