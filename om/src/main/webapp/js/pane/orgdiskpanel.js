/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "orgDiskManagementPane";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		entity : "",
		topparent : "",
	};

	var ManagementPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			parent : "",
			entity : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = options.entity;
		this.init(options);
	};

	ManagementPanel.prototype.init = function(options) {
		this.entity = options.entity;
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);
		modalframe.className = "panel panel-default";
		modalframe.style.marginTop = "2px";
		var panelBody = document.createElement("div");
		modalframe.appendChild(panelBody);
		panelBody.className = "panel-body";
		
		
		
		
	};
	
	ManagementPanel.prototype.setEntity = function(entity) {
	};


	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ManagementPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);