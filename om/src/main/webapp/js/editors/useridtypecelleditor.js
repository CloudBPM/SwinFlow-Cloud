/**
 * Business category details selection editor
 */
;
(function($, window, document, undefined) {
	var pluginName = "userIdTypeCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var UserPropSelectCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	UserPropSelectCellEditor.prototype.loadEditor = function(tabid, tag,
			entity, prop, isnull) {
		var that = this;
		this.tabId = tabid;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).html();
		$(tag).html("");
		var sel = $("<select name='selection' class='form-control'/></select>");
		sel.appendTo($(tag));
		sel.find('option').remove().end();
		for (x in idtype) {
			$("<option value='" + x + "'>" + idtype[x] + "</option>").appendTo(
					$(sel));
		}
		if (entity instanceof Staff) {
			sel.val(entity.user.idType);
		} else if (entity instanceof User) {
			sel.val(entity.idType);
		}
		sel.focus();
		var nextTR = sel.closest('tr').next();
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
					selection.focus();
					return false;
				}
			}
		}).keyup(function(event) {
			var keyvalue = event.which;
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

	UserPropSelectCellEditor.prototype.changeValue = function(tag, entity,
			prop, oldvalue, isnull) {
		var newvalue = $(tag).children("select").val();
		// var newvalue1 = $(tag).children("select").find("option:selected")
		// .text();
		if (isnull == "n" && (newvalue == null || newvalue == "-1")) {
			this.options.msg.show("当前属性不能为空。");
			return false;
		} else {
			if (newvalue != oldvalue) {
				map[this.tabId].stack.execute(new UserPropsChangeCmd(
						this.tabId, entity, prop, newvalue));
			} else {
				$(tag).html(oldvalue);
			}
			return true;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new UserPropSelectCellEditor(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);