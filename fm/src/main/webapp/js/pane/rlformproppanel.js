/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "releasedFormPropsPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		tabid : "",
		currowner : "",
	};

	var PropsPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
			tabid : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.tabId = options.tabid;
		this.topparent = options.topparent;
		this.ruleditdialog;
		this.entity = options.entity;
		this.init(options);
	};

	PropsPanel.prototype.init = function(options) {
		this.loadPane(options.entity);
	};

	PropsPanel.prototype.loadPane = function(entity) {
		this.entity = entity;
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var tabDIV = document.createElement("DIV");
		modalframe.appendChild(tabDIV);
		tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);

		var tabLi = document.createElement("li");
		tabUL.appendChild(tabLi);
		tabLi.setAttribute("role", "presentation");
		tabLi.className = "active";

		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#adptab1");
		tabLink.setAttribute("aria-controls", "adptab1");
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = "审核记录";

		var tabContents = document.createElement("DIV");
		tabContents.className = "tab-content";
		tabContents.id = "advancedproptabs";
		tabDIV.appendChild(tabContents);

		this.tabContent = document.createElement("DIV");
		tabContents.appendChild(this.tabContent);
		this.tabContent.setAttribute("data", "adptab1");
		this.tabContent.setAttribute("role", "tabpanel");
		this.tabContent.className = "tab-pane active";
		this.tabContent.id = "adptab1";

		var plugin1 = $(this.tabContent).approvalLogPane({
			id : "adptab1",
			parent : this,
			entity : this.entity,
			topparent : this.element,
			ownerId : this.options.currowner,
		});
		this.approvalLogPane = plugin1.data("approvalLogPane");

		this.tabContent1 = document.createElement("DIV");
		tabContents.appendChild(this.tabContent1);
		this.tabContent1.setAttribute("data", "adptab2");
		this.tabContent1.setAttribute("role", "tabpanel");
		this.tabContent1.className = "tab-pane";
		this.tabContent1.id = "adptab2";


	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new PropsPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);