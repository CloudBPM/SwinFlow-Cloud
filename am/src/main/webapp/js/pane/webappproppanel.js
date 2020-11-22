/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "webAppSevicePropEditPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var AdvPropEditPanel = function(element, options) {
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
		this.newTabHead(tabUL, 0, "显示测试结果", true);
		this.newTabHead(tabUL, 1, "访问控制", false);
		this.newTabHead(tabUL, 2, "实时监测", false);
		this.newTabHead(tabUL, 3, "预警设置", false);
		this.newTabHead(tabUL, 4, "访问历史记录", false);
		this.newTabHead(tabUL, 5, "审核记录", false);
		var that = this;
		$("#advanceproperty-props-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(7));
			that.options.parent.disabledAddButton();
			that.options.parent.disabledModifyButton();
			if (that.currtabindex == 0) {
				if (that.displayPane.displaypane.value != "") {
					that.options.parent.enableRemoveButton();
				} else {
					that.options.parent.disabledRemoveButton();
				}
			} else {
				that.options.parent.disabledRemoveButton();
			}
		});

		var tabContents = document.createElement("DIV");
		tabDIV.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "advancedproptabs";

		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		if ($(this.tabContent1).testResultsDisplayPane != undefined) {
			var plugin1 = $(this.tabContent1).testResultsDisplayPane({
				id : "adptab0",
				parent : this.options.parent,
				entity : entity,
				topparent : this.element,
			});
			this.displayPane = plugin1.data("testResultsDisplayPane");
		}

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		if ($(this.tabContent2).accessControlEditPane != undefined) {
			var plugin2 = $(this.tabContent2).accessControlEditPane({
				id : "adptab1",
				parent : this,
				entity : entity,
				topparent : this.element,
			});
			this.accessControlPane = plugin2.data("accessControlEditPane");
		}

		this.tabContent3 = this.newTabContent(tabContents, 2, false);

		this.tabContent4 = this.newTabContent(tabContents, 3, false);

		this.tabContent5 = this.newTabContent(tabContents, 4, false);
		if ($(this.tabContent5).accessHistoryEditPane != undefined) {
			var plugin5 = $(this.tabContent5).accessHistoryEditPane({
				id : "adptab4",
				parent : this,
				entity : entity,
				topparent : this.element,
				currowner : this.options.currowner,
			});
			this.accessHistoryEditPane = plugin5.data("accessHistoryEditPane");
		}

		this.tabContent6 = this.newTabContent(tabContents, 5, false);
		// note: how to add service here
		if ($(this.tabContent6).approvalLogPane != undefined) {
			var plugin5 = $(this.tabContent6).approvalLogPane({
				id : "adptab5",
				parent : this,
				entity : entity,
				topparent : this.element,
				ownerId : this.options.currowner,
			});
			this.approvalLogPane = plugin5.data("approvalLogPane");
		}
		// note: how to add service here

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
		if (this.currtabindex == 1) {
		}
	};

	AdvPropEditPanel.prototype.removeRow = function(evt) {
		if (this.currtabindex == 0) {
			this.displayPane.clear();
		}
	};

	AdvPropEditPanel.prototype.outputMsg = function(msg) {
		if (this.entity instanceof WebAppService) {
			this.displayPane.outputMsg(msg);
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