/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "decimalsInputEditPanel";
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
		tabUL.className = "nav nav-tabs advanceproperty-nav-tabs";
		tabUL.id = "dcls-input-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);
		this.newTabHead(tabUL, 0, "高级属性", true);
		this.newTabHead(tabUL, 1, "关联规则", false);
		var that = this;
		$("#dcls-input-props-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(7));
			if (that.currtabindex == 1) {
				if (!(owner instanceof ReleasedForm)) {
					that.options.parent.enableAddButton();
				}
			} else {
				that.options.parent.disabledAddButton();
			}
		});

		var tabContents = document.createElement("DIV");
		tabDIV.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "advancedproptabs";

		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		var plugin1 = $(this.tabContent1).decimalsInputPropPane({
			id : "dcltab0",
			parent : this.options.parent,
			entity : entity,
			topparent : this.element,
			currowner : owner,
		});
		this.decimalsInputPropPane = plugin1.data("decimalsInputPropPane");

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		var plugin2 = $(this.tabContent2).decimalsInputAssociatedPane({
			id : "dcltab1",
			parent : this.options.parent,
			entity : entity,
			topparent : this.element,
			currowner : owner,
		});
		this.decimalsInputAssociatedPane = plugin2.data("decimalsInputAssociatedPane");
		// by default
		$('#dcls-input-props-nav-tabs a[href="#dcltab' + this.currtabindex + '"]').tab('show');
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
		tabLink.setAttribute("href", "#dcltab" + index);
		tabLink.setAttribute("aria-controls", "dcltab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	EditPanel.prototype.newTabContent = function(parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "dcltab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "dcltab" + index;
		return tabContent;
	};

	EditPanel.prototype.addRow = function(evt) {
		if (this.currtabindex == 1) {
			this.decimalsInputAssociatedPane.addRow(evt);
		}
	};

	EditPanel.prototype.modifyRow = function(evt) {
	};

	EditPanel.prototype.removeRow = function(evt) {
		if (this.currtabindex == 1) {
			this.decimalsInputAssociatedPane.removeRow(evt);
		}
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