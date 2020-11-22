/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "mySettingPane";
	var defaults = {
		id : "",
	};

	var Board = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	Board.prototype.init = function(options) {
		this.board = document.createElement("DIV");
		this.element.appendChild(this.board);
		this.show(false);

		var tabDIV = document.createElement("DIV");
		this.board.appendChild(tabDIV);
		tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs my-nav-tabs";
		tabUL.id = "my-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);

		this.newTabHead(tabUL, 0, "基本信息", true);
		this.newTabHead(tabUL, 1, "实时监控", false);
		this.newTabHead(tabUL, 2, "工作状态", false);

		var tabContents = document.createElement("DIV");
		tabContents.className = "tab-content";
		tabContents.id = "advancedproptabs";
		tabDIV.appendChild(tabContents);


		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		// var plugin1 = $(this.tabContent1).desktopAppIconSettingPane({
		// 	id: "devicetab0",
		// 	parent: this,
		// 	entity: this.entity,
		// 	topparent: this.element,
		// 	tabid: this.tabId,
		// 	ownerId: this.options.ownerId,
		// });
		// this.desktopAppIconSettingPane = plugin1.data("desktopAppIconSettingPane");

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		// var plugin2 = $(this.tabContent2).desktopAppSettingPane({
		// 	id: "devicetab1",
		// 	parent: this,
		// 	entity: this.entity,
		// 	topparent: this.element,
		// 	tabid: this.tabId,
		// 	ownerId: this.options.ownerId,
		// });
		// this.desktopAppSettingPane = plugin2.data("desktopAppSettingPane");

		this.tabContent3 = this.newTabContent(tabContents, 2, false);

	};

	Board.prototype.newTabHead = function (parent, index, caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#devicetab" + index);
		tabLink.setAttribute("aria-controls", "devicetab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	Board.prototype.newTabContent = function (parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "devicetab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "devicetab" + index;
		return tabContent;
	};

	Board.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	Board.prototype.show = function(show) {
		if (show) {
			this.board.style.display = "";
		} else {
			this.board.style.display = "none";
		}
	};

	Board.prototype.doClick = function(evt) {

	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Board(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);