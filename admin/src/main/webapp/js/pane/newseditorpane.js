/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "newsPropsPanel";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		entity : "",
		topparent : "",
		tabid : "",
	};

	var NewsPropsPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			parent : "",
			entity : "",
			topparent : "",
			tabid : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.tabId = options.tabid;
		this.topparent = options.topparent;
		this.ruleditdialog;
		this.entity = options.entity;
		this.init(options);
	};

	NewsPropsPanel.prototype.init = function(options) {
		this.loadPane(options.entity);
	};

	NewsPropsPanel.prototype.loadPane = function(entity) {
		this.entity = entity;
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var tabDIV = document.createElement("DIV");
		modalframe.appendChild(tabDIV);
		tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs newsprop-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);

		var tabLi = document.createElement("li");
		tabUL.appendChild(tabLi);
		tabLi.setAttribute("role", "presentation");
		tabLi.className = "active";

		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#newstab1");
		tabLink.setAttribute("aria-controls", "newstab1");
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = "新闻动态内容";

		var tabLi1 = document.createElement("li");
		tabUL.appendChild(tabLi1);
		tabLi1.setAttribute("role", "presentation");

		var tabLink1 = document.createElement("a");
		tabLi1.appendChild(tabLink1);
		tabLink1.setAttribute("href", "#newstab2");
		tabLink1.setAttribute("aria-controls", "newstab2");
		tabLink1.setAttribute("role", "tab");
		tabLink1.setAttribute("data-toggle", "tab");
		tabLink1.innerHTML = "审核记录";

		var tabContents = document.createElement("DIV");
		tabContents.className = "tab-content";
		tabContents.id = "advancedproptabs";
		tabDIV.appendChild(tabContents);

		this.tabContent = document.createElement("DIV");
		tabContents.appendChild(this.tabContent);
		this.tabContent.setAttribute("data", "newstab1");
		this.tabContent.setAttribute("role", "tabpanel");
		this.tabContent.className = "tab-pane active";
		this.tabContent.id = "newstab1";

		var plugin1 = $(this.tabContent).newsViewPane({
			id : "newstab1",
			parent : this,
			entity : this.entity,
			topparent : this.element,
			ownerId : this.options.ownerId,
		});
		this.newsViewPane = plugin1.data("newsViewPane");

		this.tabContent1 = document.createElement("DIV");
		tabContents.appendChild(this.tabContent1);
		this.tabContent1.setAttribute("data", "newstab2");
		this.tabContent1.setAttribute("role", "tabpanel");
		this.tabContent1.className = "tab-pane";
		this.tabContent1.id = "newstab2";
		
		var plugin2 = $(this.tabContent1).approvalLogPane({
			id : "newstab2",
			parent : this,
			entity : this.entity,
			topparent : this.element,
			ownerId : this.options.ownerId,
		});
		this.approvalLogPane = plugin2.data("approvalLogPane");
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new NewsPropsPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);