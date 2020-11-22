/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "datetimeCellEditor";
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
		var editing = 1;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).text();
		$(tag).text("");
		var inputObj = $("<input type='text' class='form-control'/>");

		inputObj.datetimepicker({
			dateFormat : "yy-mm-dd",
			timeFormat : "HH:mm:ss",
			onClose : function() {
				that.changeValue(tag, entity, oldvalue);
				editing = 0;
				inputObj.remove();
				that.options.parent.refreshValues();
			},
		});
		inputObj.val(oldvalue).appendTo($(tag)).get(0).select();
		inputObj.focus();
		inputObj.click(function() {
			editing = 1;
			return false;
		}).keypress(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 13) {// enter key
				event.preventDefault();
				that.changeValue(tag, entity, oldvalue);
				inputObj.remove();
			} else if (keyvalue == 27) {
				$(tag).text(oldvalue);
			}
		}).blur(function() {
			that.changeValue(tag, entity, oldvalue);
			if (editing == 0) {
				inputObj.remove();
				that.options.parent.refreshValues();
			}
		})
	};

	TextCellEditor.prototype.changeValue = function(tag, entity, oldvalue) {
		var newvalue = $(tag).children("input").val();
		if (newvalue != oldvalue) {
			var d = new Date(newvalue);
			var h = d.getHours();
			h = (h < 10) ? ("0" + h) : h;
			var m = d.getMinutes();
			m = (m < 10) ? ("0" + m) : m;
			var s = d.getSeconds();
			s = (s < 10) ? ("0" + s) : s;
			entity.setValue(d.getFullYear(), d.getMonth() + 1, d.getDate(), h,
					m, s);
		}
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