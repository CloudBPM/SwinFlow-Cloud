/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "statusBar";
	var defaults = {
		title : "",
	};

	var OMStatusBar = function(element, options) {
		this.element = element;
		this.options = $.extend({
			title : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent;
		this.title = options.title;
		this.init(options);
	    this.progressbar;
	};
	
	OMStatusBar.prototype.init = function(options) {
		var statusbar = document.createElement("DIV");
		statusbar.className = "container-fluid";
		statusbar.id = "status";
		this.element.appendChild(statusbar);
		
		this.createStatusItem1(statusbar);
		this.createStatusItem2(statusbar);
		this.createStatusItem3(statusbar);
	};
	
	OMStatusBar.prototype.createStatusItem1 = function( parent ) {
		var statusItem = document.createElement("DIV");
		parent.appendChild(statusItem);
		statusItem.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
		var labelA = document.createElement("a");
		labelA.setAttribute("href", "http://www.xuanqiyun.com");
		labelA.innerHTML = "杭州轩琦信息科技有限公司 保留所有权利 (c) 2018";
		statusItem.appendChild(labelA);
	};
	
	OMStatusBar.prototype.createStatusItem2 = function( parent ) {
		var statusItem = document.createElement("DIV");
		parent.appendChild(statusItem);
		statusItem.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		statusItem.innerHTML = " ";
	};
	
	OMStatusBar.prototype.createStatusItem3 = function( parent ) {
		var statusItem = document.createElement("DIV");
		parent.appendChild(statusItem);
		statusItem.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
		statusItem.innerHTML = " ";
		
		var plugin = $(statusItem).inProgressBar({
	        id: "001",
        });
		this.progressbar = plugin.data("inProgressBar");
	};
	
	OMStatusBar.prototype.getProgressBar = function( ) {
		return this.progressbar;
	};
	
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new OMStatusBar(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);