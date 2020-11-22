/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "emailTempletePropEditPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
	};

	var AdvPropEditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	AdvPropEditPanel.prototype.init = function(options) {
		this.loadPane(options.entity, 0);
	};

	AdvPropEditPanel.prototype.loadPane = function(entity, tabindex) {
		this.entity = entity;
		this.currtabindex = tabindex;

		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var tabDIV = document.createElement("DIV");
		modalframe.appendChild(tabDIV);
		tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs advanceproperty-nav-tabs";
		tabUL.id = "advanceproperty-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);
		this.newTabHead(tabUL, 0, "邮件模板附件", true);
		this.newTabHead(tabUL, 1, "访问历史记录", false);
		var that = this;
		$("#advanceproperty-props-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(7));
			// if (that.currtabindex == 0) {
			// that.options.parent.enableAddButton();
			// that.options.parent.disabledModifyButton();
			// that.options.parent.disabledRemoveButton();
			// } else {
			// that.options.parent.disabledAddButton();
			// that.options.parent.disabledModifyButton();
			// that.options.parent.disabledRemoveButton();
			// }
		});

		var tabContents = document.createElement("DIV");
		tabDIV.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "advancedproptabs";

		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		if ($(this.tabContent1).emailAttachmentPane != undefined) {
			var plugin1 = $(this.tabContent1).emailAttachmentPane({
				id : "adptab0",
				parent : this.options.parent,
				entity : entity,
				topparent : this.element,
			});
			this.emailAttachmentPane = plugin1.data("emailAttachmentPane");
		}

		this.tabContent2 = this.newTabContent(tabContents, 1, false);

		$(
				'#advanceproperty-props-nav-tabs a[href="#adptab'
						+ this.currtabindex + '"]').tab('show');
	};

	AdvPropEditPanel.prototype.newTabHead = function(parent, index, caption,
			active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#adptab" + index);
		tabLink.setAttribute("aria-controls", "adptab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "adptab");
		tabLink.innerHTML = caption;
	};

	AdvPropEditPanel.prototype.newTabContent = function(parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "adptab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "adptab" + index;
		return tabContent;
	};

	AdvPropEditPanel.prototype.newTh = function(row, content) {
		var th = document.createElement('th');
		th.innerHTML = content;
		row.appendChild(th);
	};

	AdvPropEditPanel.prototype.newTd = function(row, number, content) {
		var cell1 = row.insertCell(number);
		cell1.innerHTML = content;
	};

	AdvPropEditPanel.prototype.addRow = function(evt) {
		if (this.currtabindex == 0) {
		}
	};

	AdvPropEditPanel.prototype.modifyRow = function(evt) {
	};

	AdvPropEditPanel.prototype.removeRow = function(evt) {
		if (this.currtabindex == 0) {
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new AdvPropEditPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);