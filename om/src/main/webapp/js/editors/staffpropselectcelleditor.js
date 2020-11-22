/**
 * Business category details selection editor
 */
;
(function($, window, document, undefined) {
	var pluginName = "staffPropSelectCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var StaffPropSelectCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	StaffPropSelectCellEditor.prototype.loadEditor = function(tabid, tag,
			entity, prop, isnull) {
		var that = this;
		this.tabId = tabid;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).html();
		$(tag).html("");
		var sel = $("<select name='staffPropSelectCellEditor' class='form-control'/></select>");
		sel.appendTo($(tag));
		sel.find('option').remove().end();
		if (prop == "professionalTitle") {
			for (x in stafftitle) {
				$("<option value='" + x + "'>" + stafftitle[x] + "</option>").appendTo(
						$(sel));
			}
			sel.val(entity.professionalTitle);
		} else if (prop == "workType") {
			for (x in worktype) {
				$("<option value='" + x + "'>" + worktype[x] + "</option>")
						.appendTo($(sel));
			}
			sel.val(entity.workType);
		} else if (prop == "jobStatus") {
			for (x in jobstatus) {
				$("<option value='" + x + "'>" + jobstatus[x] + "</option>")
						.appendTo($(sel));
			}
			sel.val(entity.jobStatus);
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

	StaffPropSelectCellEditor.prototype.changeValue = function(tag, entity,
			prop, oldvalue, isnull) {
		var newvalue = $(tag).children("select").val();
		// var newvalue1 = $(tag).children("select").find("option:selected")
		// .text();
		if (isnull == "n" && (newvalue == null || newvalue == "-1")) {
			this.options.msg.show("当前属性不能为空。");
			return false;
		} else {
			if (newvalue != oldvalue) {
				map[this.tabId].stack.execute(new StaffPropsChangeCmd(
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
				$.data(this, pluginName, new StaffPropSelectCellEditor(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);