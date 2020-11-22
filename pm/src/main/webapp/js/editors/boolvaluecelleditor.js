/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "boolValueCellEditor";
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

	TextCellEditor.prototype.loadEditor = function(tag, entity) {
		var that = this;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).text();
		$(tag).text("");
		var selection = $("<select name='selection' class='form-control'/></select>");
		selection.appendTo($(tag));
		for (x in truefalse) {
			$("<option value='" + x + "'>" + truefalse[x] + "</option>").appendTo(
					$(selection));
		}
		selection.val(entity.value);
		selection.focus();
		selection.keyup(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 13) {// enter key
				event.preventDefault();
				if (that.changeValue(tag, entity, oldvalue)) {
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
				event.preventDefault();
			}
		}).blur(function() {
			if (that.changeValue(tag, entity, oldvalue)) {
				selection.remove();
			} else {
				selection.focus();
				return false;
			}
		})
	};

	TextCellEditor.prototype.changeValue = function(tag, entity, oldvalue) {
		var newvalue = $(tag).children("select").val();
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