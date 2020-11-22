/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "accessControlEditPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
		}, defaults, options);
		this._defaults = defaults;
		this.entity = options.entity;
		this._name = pluginName;
		this.pagesize = 30;
		this.init(options);
	};

	EditPanel.prototype.loadPane = function() {
		this.init(this.options);
	};

	EditPanel.prototype.init = function(options) {
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var toolbarForm = document.createElement("form");
		toolbarForm.className = "form-inline";
		modalframe.appendChild(toolbarForm);

		var toolbarDiv = document.createElement("DIV");
		toolbarForm.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		toolbarDiv.style.padding = "2px";

		var tableDiv = document.createElement("DIV");
		modalframe.appendChild(tableDiv);
		tableDiv.id = "tablediv" + options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = (parseInt(options.topparent.style.height) - 82)
				+ "px";
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EditPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);