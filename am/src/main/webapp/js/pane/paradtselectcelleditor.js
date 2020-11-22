/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "parameterDataTypeSelectCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var DataTypeCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	DataTypeCellEditor.prototype.loadEditor = function(tag, entity, headbody) {
		var that = this;
		$(tag).html("");
		var p = entity.findParam($(tag).prev('td').text(), headbody);
		var oldvalue = p.datatype;
		var selection = $("<select name='selection' class='form-control'/></select>");
		selection.appendTo($(tag));
		if (headbody == 1) {
			for (x in pathdatatype) {
				$("<option value='" + x + "'>" + pathdatatype[x] + "</option>")
						.appendTo($(selection));
			}
		} else if (headbody == 2) {
			for (x in formdatatype) {
				$("<option value='" + x + "'>" + formdatatype[x] + "</option>")
						.appendTo($(selection));
			}
		}
		selection.val(p.datatype);

		selection.focus();
		var nextTD = selection.closest('td').next('td')[0];

		selection.keydown(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 9) { // Tab key
				event.preventDefault();
				if (that.changeValue(tag, entity, oldvalue, headbody)) {
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
				if (that.changeValue(tag, entity, oldvalue, headbody)) {
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
			if (that.changeValue(tag, entity, oldvalue, headbody)) {
				selection.remove();
			} else {
				selection.focus();
				return false;
			}
		})
	};

	DataTypeCellEditor.prototype.changeValue = function(tag, entity, oldvalue,
			headbody) {
		var loc = entity.findParamPosition($(tag).prev('td').text(), headbody);
		var newvalue = $(tag).children("select").val();
		if (newvalue != oldvalue) {
			map[entity.id].stack.execute(new AMParaDataTypeChangedCmd(entity,
					oldvalue, newvalue,
					tag.parentElement.parentElement.parentElement,
					tag.parentElement.rowIndex, loc, headbody));
		} else {
			if (headbody == 1) {
				$(tag).text(pathdatatype[oldvalue]);
			} else if (headbody == 2) {
				$(tag).text(formdatatype[oldvalue]);
			}
		}
		return true;
	};

	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new DataTypeCellEditor(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);