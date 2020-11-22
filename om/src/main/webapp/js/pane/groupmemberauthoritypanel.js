/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "groupMemberAuthorityPanel";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		entity : "",
		topparent : "",
		tabid : "",
	};

	var GroupMemberPanel = function(element, options) {
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

	GroupMemberPanel.prototype.init = function(options) {
		this.loadPane(options.entity);
	};

	GroupMemberPanel.prototype.loadPane = function(entity) {
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
		tabLink.innerHTML = "权限组成员";

		var tabLi1 = document.createElement("li");
		tabUL.appendChild(tabLi1);
		tabLi1.setAttribute("role", "presentation");

		var tabLink1 = document.createElement("a");
		tabLi1.appendChild(tabLink1);
		tabLink1.setAttribute("href", "#tab2");
		tabLink1.setAttribute("aria-controls", "tab2");
		tabLink1.setAttribute("role", "tab");
		tabLink1.setAttribute("data-toggle", "tab");
		tabLink1.innerHTML = "权限列表";

		var tabContents = document.createElement("DIV");
		tabContents.className = "tab-content";
		tabContents.id = "advancedproptabs";
		tabDIV.appendChild(tabContents);

		this.tabContent = document.createElement("DIV");
		tabContents.appendChild(this.tabContent);
		this.tabContent.setAttribute("data", "tab1");
		this.tabContent.setAttribute("role", "tabpanel");
		this.tabContent.className = "tab-pane active";
		this.tabContent.id = "tab1";

		var plugin1 = $(this.tabContent).groupMemberPane({
			id : "tab1",
			parent : this,
			entity : this.entity,
			topparent : this.element,
			tabid : this.tabId,
			ownerId : this.options.ownerId,
		});
		this.loginhistorypane = plugin1.data("groupMemberPane");

		this.tabContent1 = document.createElement("DIV");
		tabContents.appendChild(this.tabContent1);
		this.tabContent1.setAttribute("data", "tab2");
		this.tabContent1.setAttribute("role", "tabpanel");
		this.tabContent1.className = "tab-pane";
		this.tabContent1.id = "tab2";
		
		var plugin2 = $(this.tabContent1).authorityListPane({
			id : "tab2",
			parent : this,
			entity : this.entity,
			topparent : this.element,
			tabid : this.tabId,
			ownerId : this.options.ownerId,
		});
		this.assignhistorypane = plugin2.data("authorityListPane");
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new GroupMemberPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);