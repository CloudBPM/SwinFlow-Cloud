/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "blankEditPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var BlankEditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	BlankEditPanel.prototype.init = function(options) {
		this.loadPane();
	};

	BlankEditPanel.prototype.loadPane = function() {
		var table = document.createElement("table");
		table.className = "table table-striped table-hover";
		this.element.appendChild(table);
		for (i = 0; i < 5; i++) {
			var row = table.insertRow(-1);
			row.id = "-1";
			this.newTd(row, 0, "&nbsp;");
		}
	};

	BlankEditPanel.prototype.newTd = function(row, number, content) {
		var cell1 = row.insertCell(number);
		cell1.innerHTML = content;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new BlankEditPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);