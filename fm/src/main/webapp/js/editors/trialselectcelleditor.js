/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "trialPeriodSelectCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var SelectCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	SelectCellEditor.prototype.loadEditor = function(tag, entity, prop, isnull,
			owner) {
		var that = this;
		this.owner = owner;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).html();
		$(tag).html("");
		var selection = $("<select name='selection' class='form-control'/></select>");
		selection.appendTo($(tag));
		if (isnull == "y") {
			$("<option value='-1'>- 请选择 -</option>").appendTo($(selection));
		}
		for (x in trialperiod) {
			$("<option value='" + x + "'>" + trialperiod[x] + "</option>")
					.appendTo($(selection));
		}
		selection.val(entity.trialPeriod);
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

	SelectCellEditor.prototype.changeValue = function(tag, entity, prop,
			oldvalue, isnull) {
		var newvalue = $(tag).children("select").val();
		// var newvalue1 = $(tag).children("select").find("option:selected")
		// .text();
		if (isnull == "n" && (newvalue == null || newvalue == "-1")) {
			this.options.msg.show("当前属性不能为空。");
			return false;
		} else {
			if (newvalue != oldvalue) {
				map[this.owner.id].stack.execute(new FMValueChangedCmd(entity,
						prop, newvalue, this.owner));
			} else {
				$(tag).html(oldvalue);
			}
			return true;
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