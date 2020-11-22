/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "tableViewPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var EditPanel = function(element, options) {
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

	EditPanel.prototype.init = function(options) {
		this.loadPane(options.entity, 0, options.currowner);
	};

	EditPanel.prototype.loadPane = function(entity, tabindex, owner) {
		this.currtabindex = tabindex;

		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var tabDIV = document.createElement("DIV");
		modalframe.appendChild(tabDIV);
		tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs ptbv-props-nav-tabs";
		tabUL.id = "ptbv-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);
		this.newTabHead(tabUL, 0, "高级属性", true);
		this.newTabHead(tabUL, 1, "组件关联", false);
		var that = this;
		$("#ptbv-props-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(7));
		});

		var tabContents = document.createElement("DIV");
		tabDIV.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "advancedproptabs";

		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		var plugin1 = $(this.tabContent1).tableViewPropPane({
			id : "ptvtab0",
			parent : this.options.parent,
			entity : entity,
			topparent : this.element,
			currowner : owner,
		});
		//this.tableViewPropPane = plugin1.data("tableViewPropPane");

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		// var plugin2 = $(this.tabContent2).clientUISettingPane({
		// id : "ptvtab1",
		// parent : this,
		// entity : entity,
		// topparent : this.element,
		// currowner : owner,
		// });
		// this.clientUISettingPane = plugin2.data("clientUISettingPane");

		// by default
		$('#ptbv-props-nav-tabs a[href="#ptvtab' + this.currtabindex + '"]')
				.tab('show');
		this.options.parent.disabledAddButton();
		this.options.parent.disabledRemoveButton();
	};

	EditPanel.prototype.newTabHead = function(parent, index, caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#ptvtab" + index);
		tabLink.setAttribute("aria-controls", "ptvtab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	EditPanel.prototype.newTabContent = function(parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "ptvtab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "ptvtab" + index;
		return tabContent;
	};

	EditPanel.prototype.addRow = function(evt) {
	};

	EditPanel.prototype.modifyRow = function(evt) {
	};
	
	EditPanel.prototype.removeRow = function(evt) {
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