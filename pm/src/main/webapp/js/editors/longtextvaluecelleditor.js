/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "longTextCellEditor";
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
		var inputObj = $("<textarea type='text' class='form-control'/></textarea>");
		inputObj.val(oldvalue).appendTo($(tag)).get(0).select();
		inputObj.focus();
		inputObj.click(function() {
			return false;
		}).keypress(function(event) {
			var keyvalue = event.which;
            if (keyvalue == 27) {
				$(tag).text(oldvalue);
				event.preventDefault();
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
		var newvalue = $(tag).children("textarea").val();
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