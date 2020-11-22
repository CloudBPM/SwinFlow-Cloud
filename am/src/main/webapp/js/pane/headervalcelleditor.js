/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "headerValueCellEditor";
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

	TextCellEditor.prototype.loadEditor = function(tag, entity) {
		var that = this;
		if ($(tag).attr("ed") == "-1") {
			return;
		}
		var oldvalue = $(tag).text();
		$(tag).text("");
		var inputObj = $("<input type='text' list='myoptions' autocomplete='off' class='form-control'/>");
		var v = "TE";
		v = v.replace('-', '');
		// convert a string to js variable using window[v] or eval(v);
		var a = window[v];
		// console.log(a);
		if (a != undefined) {
			var dataListObj = $("<datalist id='myoptions' class='form-control'/>");
			// inputObj.on("input",function(e) {
			// if (inputObj.val()!="") {
			// inputObj.val(inputObj.val()+";"+this.value);
			// } else {
			// inputObj.val(this.value);
			// }
			// console.log(inputObj.val());
			// });
			dataListObj.val(oldvalue).appendTo($(inputObj));
			for (x in window[v]) {
				$("<option value='" + x + "'>").appendTo($(dataListObj));
			}
		}
		inputObj.val(oldvalue).appendTo($(tag)).get(0).select();

		var nextTR = inputObj.closest('tr').next();
		var nextTD = nextTR.find("td")[0];

		inputObj.focus();
		inputObj.click(function() {
			return false;
		}).keydown(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 9) { // Tab key
				event.preventDefault();
				if (that.changeValue(tag, entity, oldvalue)) {
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
				if (that.changeValue(tag, entity, oldvalue)) {
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
			if (that.changeValue(tag, entity, oldvalue)) {
				inputObj.remove();
			} else {
				inputObj.focus();
				return false;
			}
		})
	};

	TextCellEditor.prototype.changeValue = function(tag, entity, oldvalue) {
		var loc = entity.findHeaderPosition($(tag).prev('td').text());
		var newvalue = $(tag).children("input").val();
		if (newvalue == null || newvalue == "") {
			this.options.msg.show("请求头值不能为空");
			return false;
		} else {
			if (newvalue != oldvalue) {
				map[entity.id].stack.execute(new AMHeaderValueChangedCmd(
						entity, oldvalue, newvalue,
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
				$.data(this, pluginName, new TextCellEditor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);