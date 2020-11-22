/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "noticeViewPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var Editor = function(element, options) {
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
	};

	Editor.prototype.init = function(entity) {
		this.loadPane(entity);
	};

	Editor.prototype.loadPane = function(entity) {
		this.entity = entity;
		var editorPanel = document.createElement("DIV");
		this.element.appendChild(editorPanel);
		editorPanel.style.padding = "2px";

		var panelDiv = document.createElement("DIV");
		editorPanel.appendChild(panelDiv);
		panelDiv.className = "panel panel-default";

		var panelBodyDiv = document.createElement("DIV");
		panelDiv.appendChild(panelBodyDiv);
		panelBodyDiv.className = "panel-body";
		panelBodyDiv.id = "tablediv" + this.entity.id;

		panelBodyDiv.innerHTML = this.entity.pcContent;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Editor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);
