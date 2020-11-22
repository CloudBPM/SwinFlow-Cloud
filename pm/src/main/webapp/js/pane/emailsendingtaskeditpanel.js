/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "emailSendingTaskEditPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var EmailSendingTaskEditPanel = function(element, options) {
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

	EmailSendingTaskEditPanel.prototype.init = function(options) {
		this.loadPane(options.entity, 0, options.currowner);
	};

	EmailSendingTaskEditPanel.prototype.loadPane = function(entity, tabindex,
			owner) {
		this.currtabindex = tabindex;

		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var tabDIV = document.createElement("DIV");
		modalframe.appendChild(tabDIV);
		tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs advanceproperty-nav-tabs";
		tabUL.id = "emls-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);
		this.newTabHead(tabUL, 0, "邮件接收人", true);
		this.newTabHead(tabUL, 1, "模板设置", false);

		var that = this;
		$("#emls-props-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(7));
			that.setCurrTabIndex(that.currtabindex, owner);
		});

		var tabContents = document.createElement("DIV");
		tabDIV.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "advancedproptabs";

		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		var plugin1 = $(this.tabContent1).emailReceversSettingPane({
			id : "emltab0",
			parent : this.options.parent,
			entity : entity,
			topparent : this.element,
			currowner : owner,
		});
		this.emailReceversSettingPane = plugin1
				.data("emailReceversSettingPane");

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		var plugin2 = $(this.tabContent2).emailTemplateSettingPane({
			id : "emltab1",
			parent : this,
			entity : entity,
			topparent : this.element,
			currowner : owner,
		});
		this.emailTemplateSettingPane = plugin2
				.data("emailTemplateSettingPane");

		$('#emls-props-nav-tabs a[href="#emltab' + this.currtabindex + '"]')
				.tab('show');
		this.setCurrTabIndex(this.currtabindex, owner);
	};

	EmailSendingTaskEditPanel.prototype.newTabHead = function(parent, index,
			caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#emltab" + index);
		tabLink.setAttribute("aria-controls", "emltab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	EmailSendingTaskEditPanel.prototype.newTabContent = function(parent, index,
			active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "emltab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "emltab" + index;
		return tabContent;
	};

	EmailSendingTaskEditPanel.prototype.setCurrTabIndex = function(index, owner) {
		if (owner instanceof WfProcess) {
			if (index == 0) {
				this.options.parent.enableAddButton();
				this.options.parent.disabledModifyButton();
			} else if (index == 1) {
				this.options.parent.disabledAddButton();
				this.options.parent.enableModifyButton();
			} else {
				this.options.parent.disabledAddButton();
				this.options.parent.disabledModifyButton();
			}
		} else {
			this.options.parent.disabledAddButton();
			this.options.parent.disabledModifyButton();
		}
	};

	EmailSendingTaskEditPanel.prototype.newTh = function(row, content) {
		var th = document.createElement('th');
		th.innerHTML = content;
		row.appendChild(th);
	};

	EmailSendingTaskEditPanel.prototype.newTd = function(row, number, content) {
		var cell1 = row.insertCell(number);
		cell1.innerHTML = content;
	};

	EmailSendingTaskEditPanel.prototype.addRow = function(evt) {
		if (this.currtabindex == 0) {
			this.emailReceversSettingPane.addRow(evt);
		} else if (this.currtabindex == 1) {
			this.emailTemplateSettingPane.addRow(evt);
		}
	};

	EmailSendingTaskEditPanel.prototype.modifyRow = function(evt) {
		if (this.currtabindex == 0) {
			this.emailReceversSettingPane.modifyRow(evt);
		} else if (this.currtabindex == 1) {
			this.emailTemplateSettingPane.modifyRow(evt);
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EmailSendingTaskEditPanel(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);