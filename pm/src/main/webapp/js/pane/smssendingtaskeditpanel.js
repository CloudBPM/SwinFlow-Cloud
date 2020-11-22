/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "smsSendingTaskEditPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var SMSSendingTaskEditPanel = function(element, options) {
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

	SMSSendingTaskEditPanel.prototype.init = function(options) {
		this.loadPane(options.entity, 0, options.currowner);
	};

	SMSSendingTaskEditPanel.prototype.loadPane = function(entity, tabindex,
			owner) {
		this.currtabindex = tabindex;

		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var tabDIV = document.createElement("DIV");
		modalframe.appendChild(tabDIV);
		tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs advanceproperty-nav-tabs";
		tabUL.id = "smss-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);
		this.newTabHead(tabUL, 0, "短信接收人", true);
		this.newTabHead(tabUL, 1, "模板设置", false);

		var that = this;
		$("#smss-props-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(7));
			if (that.currtabindex == 0) {
				if (owner instanceof WfProcess) {
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
		var plugin1 = $(this.tabContent1).smsReceversSettingPane({
			id : "smstab0",
			parent : this.options.parent,
			entity : entity,
			topparent : this.element,
			currowner : owner,
		});
		this.smsReceversSettingPane = plugin1.data("smsReceversSettingPane");

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		var plugin2 = $(this.tabContent2).smsTemplateSettingPane({
			id : "smstab1",
			parent : this,
			entity : entity,
			topparent : this.element,
			currowner : owner,
		});
		this.smsTemplateSettingPane = plugin2.data("smsTemplateSettingPane");

		$('#smss-props-nav-tabs a[href="#smstab' + this.currtabindex + '"]').tab(
				'show');
		if (owner instanceof WfProcess) {
			this.options.parent.enableAddButton();
		} else {
			this.options.parent.disabledAddButton();
		}
		this.options.parent.disabledModifyButton();
		this.options.parent.disabledRemoveButton();
	};

	SMSSendingTaskEditPanel.prototype.newTabHead = function(parent, index,
			caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#smstab" + index);
		tabLink.setAttribute("aria-controls", "smstab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	SMSSendingTaskEditPanel.prototype.newTabContent = function(parent, index,
			active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "smstab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "smstab" + index;
		return tabContent;
	};

	SMSSendingTaskEditPanel.prototype.newTh = function(row, content) {
		var th = document.createElement('th');
		th.innerHTML = content;
		row.appendChild(th);
	};

	SMSSendingTaskEditPanel.prototype.newTd = function(row, number, content) {
		var cell1 = row.insertCell(number);
		cell1.innerHTML = content;
	};

	SMSSendingTaskEditPanel.prototype.addRow = function(evt) {
		if (this.currtabindex == 0) {
			this.smsReceversSettingPane.addRow(evt);
		} else if (this.currtabindex == 1) {
			// this.participantSettingPane.addRow(evt);
		}
	};

	SMSSendingTaskEditPanel.prototype.modifyRow = function(evt) {
		if (this.currtabindex == 0) {
			this.smsReceversSettingPane.modifyRow(evt);
		} else if (this.currtabindex == 1) {
			// this.participantSettingPane.modifyRow(evt);
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new SMSSendingTaskEditPanel(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);