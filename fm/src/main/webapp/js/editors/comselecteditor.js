/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "propagatedComponentSelectCellEditor";
	var defaults = {
		parent : "",
	};

	var CellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	CellEditor.prototype.loadEditor = function(tag, entity, prop, isnull,
			value, currOwner, owner) {
		var that = this;
		this.currOwner = currOwner;
		this.owner = owner;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).html();
		$(tag).html("");
		var selection = $("<select name='selection' class='form-control'/></select>");
		selection.appendTo($(tag));
		var lst = this.owner.seekObjects();
		$("<option value=''> -- 请选择 -- </option>").appendTo($(selection));
		$("<option value='0'>系统</option>").appendTo($(selection));
		for (var i = 0; i < lst.length; i++) {
			$("<option value='" + lst[i].id + "'>" + lst[i].title + "</option>")
					.appendTo($(selection));
		}
		selection.val(value);
		selection.focus();
		var nextTR = selection.closest('tr').next();
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

	CellEditor.prototype.changeValue = function(tag, entity, prop, oldvalue,
			isnull) {
		var newvalue = $(tag).children("select").val();
		if (newvalue != oldvalue) {
			map[this.owner.id].stack.execute(new FMRuleValueChangedCmd(entity,
					prop, newvalue, this.currOwner, this.owner));
		} else {
			$(tag).html(oldvalue);
		}
		return true;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new CellEditor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);