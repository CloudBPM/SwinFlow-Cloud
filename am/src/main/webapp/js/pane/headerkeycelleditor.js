/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "headerKeyCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var SelectionCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	SelectionCellEditor.prototype.loadEditor = function(tag, entity) {
		var that = this;
		var oldvalue = $(tag).html();
		$(tag).html("");
		var selection = $("<select name='selection' class='form-control'/></select>");
		selection.appendTo($(tag));
		for (x in headkeys) {
			$("<option value='" + x + "'>" + headkeys[x] + "</option>")
					.appendTo($(selection));
		}
		selection.val(oldvalue);
		selection.focus();

		var nextTD = selection.closest('td').next('td')[0];
		selection.focus();
		selection.click(function() {
			return false;
		}).keydown(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 9) { // Tab key
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
			}
		}).keyup(function(event) {
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
				$(tag).text(oldvalue);
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

	SelectionCellEditor.prototype.changeValue = function(tag, entity, oldvalue) {
		var newvalue = $(tag).children("select").val();
		var loc = entity.findHeaderPosition(oldvalue);
		if (newvalue == null || newvalue == "") {
			this.options.msg.show("请求头不能为空");
			return false;
		} else if (entity.paramDuplicated(newvalue, loc)) {
			this.options.msg.show("请求头已经存在，请选择新的请求头");
			return false;
		} else {
			if (newvalue != oldvalue) {
				map[entity.id].stack.execute(new AMHeaderNameChangedCmd(entity,
						oldvalue, newvalue,
						tag.parentElement.parentElement.parentElement,
						tag.parentElement.rowIndex, loc));
			} else {
				$(tag).text(oldvalue);
			}
			return true;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$
						.data(this, pluginName, new SelectionCellEditor(this,
								options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);