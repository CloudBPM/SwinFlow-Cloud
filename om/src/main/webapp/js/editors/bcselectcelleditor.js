/**
 * Business category selection editor
 */
;
(function($, window, document, undefined) {
	var pluginName = "bcSelectCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var BCSelectCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	BCSelectCellEditor.prototype.loadEditor = function(tag, entity, prop,
			isnull) {
		var that = this;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).html();
		$(tag).html("");
		var sel = $("<select name='selection' class='form-control'/></select>");
		sel.appendTo($(tag));
		if (isnull == "y") {
			$("<option value='-1'>- 请选择 -</option>").appendTo($(sel));
		}
		for (x in category) {
			$("<option value='" + x + "'>" + category[x] + "</option>")
					.appendTo($(sel));
		}
		sel.val(entity.businessCategory);
		sel.focus();
		var nextTR = sel.closest('tr').next();
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

		sel.keydown(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 9) { // Tab key
				event.preventDefault();
				if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
					sel.remove();
					if (nextTD != undefined) {
						that.options.parent.startToEdit(nextTD);
					}
				} else {
					sel.focus();
					return false;
				}
			}
		}).keyup(function(event) {
			var keyvalue = event.which;
			console.log(keyvalue);
			if (keyvalue == 13) {// enter key
				event.preventDefault();
				if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
					sel.remove();
					if (nextTD != undefined) {
						that.options.parent.startToEdit(nextTD);
					}
				} else {
					sel.focus();
					return false;
				}
			} else if (keyvalue == 27) {
				
				$(tag).html(oldvalue);
			}
		}).blur(function() {
			if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
				sel.remove();
			} else {
				sel.focus();
				return false;
			}
		})
	};

	// To Read Select Option Value
	// $('#selectId').val();
	// To Set Select Option Value
	// $('#selectId').val('newValue');
	BCSelectCellEditor.prototype.changeValue = function(tag, entity, prop,
			oldvalue, isnull) {
		var newvalue = $(tag).children("select").val();
		// var newvalue1 = $(tag).children("select").find("option:selected")
		// .text();
		if (isnull == "n" && (newvalue == null || newvalue == "-1")) {
			this.options.msg.show("当前属性不能为空。");
			return false;
		} else {
			if (newvalue != oldvalue) {
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
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new BCSelectCellEditor(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);