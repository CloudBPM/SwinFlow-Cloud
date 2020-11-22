/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "parameterNameCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var TextCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	TextCellEditor.prototype.loadEditor = function(tag, entity, headbody) {
		var that = this;
		if ($(tag).attr("ed") == "-1") {
			return;
		}
		var oldvalue = $(tag).text();
		$(tag).text("");
		var inputObj = $("<input type='text' class='form-control'/>");
		inputObj.val(oldvalue).appendTo($(tag)).get(0).select();

		var nextTD = inputObj.closest('td').next('td')[0];
		inputObj.focus();
		inputObj.click(function() {
			return false;
		}).keydown(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 9) { // Tab key
				event.preventDefault();
				if (that.changeValue(tag, entity, oldvalue, headbody)) {
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
				if (that.changeValue(tag, entity, oldvalue, headbody)) {
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
			if (that.changeValue(tag, entity, oldvalue, headbody)) {
				inputObj.remove();
			} else {
				inputObj.focus();
				return false;
			}
		})
	};

	TextCellEditor.prototype.changeValue = function(tag, entity, oldvalue,
			headbody) {
		var loc = entity.findParamPosition(oldvalue, headbody);
		var newvalue = $(tag).children("input").val();
		if (newvalue == null || newvalue == "") {
			this.options.msg.show("参数名不能为空");
			return false;
		} else if (entity.paramDuplicated(newvalue, headbody, loc)) {
			this.options.msg.show("参数名已经存在，请选择新的参数名");
			return false;
		} else {
			if (newvalue != oldvalue) {
				map[entity.id].stack.execute(new AMParaNameChangedCmd(entity,
						oldvalue, newvalue,
						tag.parentElement.parentElement.parentElement,
						tag.parentElement.rowIndex, headbody, loc));
			} else {
				$(tag).text(oldvalue);
			}
			return true;
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