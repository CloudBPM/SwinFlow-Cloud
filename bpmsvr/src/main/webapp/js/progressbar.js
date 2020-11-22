/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "inProgressBar";
	var defaults = {
		id : "",
	};

	var InProgressBar = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent;
		this.title = options.title;
		this.init(options);
		this.value = 100;
		this.bar;
	};

	InProgressBar.prototype.init = function(options) {
		var progressbar = document.createElement("DIV");
		progressbar.className = "progress";
		progressbar.id = "progressbar";
		progressbar.style.display = "none";
		this.element.appendChild(progressbar);

		this.bar = document.createElement("DIV");
		this.bar.className = "progress-bar progress-bar-striped active";
		this.bar.setAttribute("role", "progressbar");
		this.bar.setAttribute("aria-valuenow", 100);
		this.bar.setAttribute("aria-valuemin", 0);
		this.bar.setAttribute("aria-valuemax", 100);
		this.bar.style.width = "100%";
		progressbar.appendChild(this.bar);
		
		var span = document.createElement("span");
		span.className = "sr-only";
		span.innerHTML = "处理中...";
		this.bar.appendChild(span);
	};

	//InProgressBar.prototype.setCurrentValue = function(val) {
	//	this.bar.setAttribute("aria-valuenow", val);
	//};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new InProgressBar(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);