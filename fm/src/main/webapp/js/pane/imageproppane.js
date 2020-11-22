/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "imagePropPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var BasicPropPanel = function(element, options) {
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
		this.entity = options.entity;
		this.init(options);
	};

	BasicPropPanel.prototype.loadPane = function(entity) {
		this.entity = entity;
		this.init(this.options);
	};

	BasicPropPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		modalframe.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		modalframe.style.padding = "4px";
		this.element.appendChild(modalframe);

		var form1 = document.createElement("form");
		form1.className = "form-horizontal";
		modalframe.appendChild(form1);

		// option/value
		var group3 = document.createElement("div");
		group3.className = "form-group";
		form1.appendChild(group3);

		this.loadData(this.entity);
		
		if (options.currowner instanceof ReleasedForm) {
			
		}
	};

	BasicPropPanel.prototype.loadData = function(entity) {

	};

	BasicPropPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	BasicPropPanel.prototype.doChange = function(evt) {

	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new BasicPropPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);