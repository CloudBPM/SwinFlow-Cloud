/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "staffHistoryPanel";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		entity : "",
		topparent : "",
	};

	var StaffHistoryPanel = function(element, options) {
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
		this.tabId = null;
		this.topparent = options.topparent;
		this.ruleditdialog;
		this.entity = options.entity;
		this.init(options);
	};

	StaffHistoryPanel.prototype.init = function(options) {
		this.loadPane(options.entity);
	};

	StaffHistoryPanel.prototype.loadPane = function(entity) {
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
		tabLink.setAttribute("href", "#tab1");
		tabLink.setAttribute("aria-controls", "tab1");
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = "登录历史";

		var tabLi1 = document.createElement("li");
		tabUL.appendChild(tabLi1);
		tabLi1.setAttribute("role", "presentation");

		var tabLink1 = document.createElement("a");
		tabLi1.appendChild(tabLink1);
		tabLink1.setAttribute("href", "#tab2");
		tabLink1.setAttribute("aria-controls", "tab2");
		tabLink1.setAttribute("role", "tab");
		tabLink1.setAttribute("data-toggle", "tab");
		tabLink1.innerHTML = "工作调动";

		var tabContents = document.createElement("DIV");
		tabContents.className = "tab-content";
		tabContents.id = "advancedproptabs";
		tabDIV.appendChild(tabContents);

		this.tabContent = document.createElement("DIV");
		tabContents.appendChild(this.tabContent);
		this.tabContent.setAttribute("data", this.entity.id);
		this.tabContent.setAttribute("role", "tabpanel");
		this.tabContent.className = "tab-pane active";
		this.tabContent.id = "tab1";

		var plugin1 = $(this.tabContent).loginHistoryPane({
			id : this.entity.id,
			parent : this,
			entity : this.entity,
			topparent : this.element,
			ownerId : this.options.ownerId,
		});
		this.loginhistorypane = plugin1.data("loginHistoryPane");

		this.tabContent1 = document.createElement("DIV");
		tabContents.appendChild(this.tabContent1);
		this.tabContent1.setAttribute("data", this.entity.id);
		this.tabContent1.setAttribute("role", "tabpanel");
		this.tabContent1.className = "tab-pane";
		this.tabContent1.id = "tab2";
		
//		var plugin2 = $(this.tabContent1).assignmentHistoryPane({
//			id : "asgn002",
//			parent : this,
//			entity : this.entity,
//			topparent : this.element,
//		    ownerId : this.options.ownerId,
//		});
//		this.assignhistorypane = plugin1.data("assignmentHistoryPane");
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new StaffHistoryPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);