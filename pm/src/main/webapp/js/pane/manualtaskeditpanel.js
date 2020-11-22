/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "manualTaskEditPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var ManualTaskEditPanel = function(element, options) {
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

	ManualTaskEditPanel.prototype.init = function(options) {
		this.loadPane(options.entity, 0, options.currowner);
	};

	ManualTaskEditPanel.prototype.loadPane = function(entity, tabindex, owner) {
		this.currtabindex = tabindex;

		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var tabDIV = document.createElement("DIV");
		modalframe.appendChild(tabDIV);
		tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs advanceproperty-nav-tabs";
		tabUL.id = "manualtask-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);
		this.newTabHead(tabUL, 0, "可访问数据", true);
		this.newTabHead(tabUL, 1, "用户界面", false);
		//this.newTabHead(tabUL, 2, "完成期限", false);
		if (owner.workflowType == 2) {
			this.newTabHead(tabUL, 3, "办理人", false);
			if (entity instanceof ManualTaskInstance) {
				this.newTabHead(tabUL, 4, "候选办理人", false);
			}
		}

		var that = this;
		$("#manualtask-props-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(7));
			if (that.currtabindex == 0 || that.currtabindex == 3) {
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
		var plugin1 = $(this.tabContent1).accessibleVariablesPane({
			id : "mtptab0",
			parent : this.options.parent,
			entity : entity,
			topparent : this.element,
			currowner : owner,
		});
		this.accessibleVariablesPane = plugin1.data("accessibleVariablesPane");

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		var plugin2 = $(this.tabContent2).pointUIEditPane({
			id : "mtptab1",
			parent : this,
			entity : entity,
			topparent : this.element,
			currowner : owner,
		});
		this.clientUISettingPane = plugin2.data("pointUIEditPane");

		// this.tabContent3 = this.newTabContent(tabContents, 2, false);
		// var plugin3 = $(this.tabContent3).deadlineSettingPane({
		// 	id : "mtptab2",
		// 	parent : this,
		// 	entity : entity,
		// 	topparent : this.element,
		// 	currowner : owner,
		// });
		// this.deadlineSettingPane = plugin3.data("deadlineSettingPane");

		if (owner.workflowType == 2) {
			this.tabContent4 = this.newTabContent(tabContents, 3, false);
			var plugin4 = $(this.tabContent4).participantSettingPane({
				id: "mtptab3",
				parent: this.options.parent,
				entity: entity,
				topparent: this.element,
				currowner: owner,
			});
			this.participantSettingPane = plugin4.data("participantSettingPane");

			if (entity instanceof ManualTaskInstance) {
				this.tabContent5 = this.newTabContent(tabContents, 4, false);
				var plugin5 = $(this.tabContent5).candidateSettingPane({
					id: "mtptab3",
					parent: this.options.parent,
					entity: entity,
					topparent: this.element,
					currowner: owner,
				});
				this.candidateSettingPane = plugin5.data("candidateSettingPane");
			}
		}

		$('#manualtask-props-nav-tabs a[href="#mtptab' + this.currtabindex + '"]')
				.tab('show');
		if (owner instanceof WfProcess) {
			this.options.parent.enableAddButton();
		} else {
			this.options.parent.disabledAddButton();
		}
		this.options.parent.disabledModifyButton();
		this.options.parent.disabledRemoveButton();
	};

	ManualTaskEditPanel.prototype.newTabHead = function(parent, index, caption,
			active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#mtptab" + index);
		tabLink.setAttribute("aria-controls", "mtptab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	ManualTaskEditPanel.prototype.newTabContent = function(parent, index,
			active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "mtptab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "mtptab" + index;
		return tabContent;
	};

	ManualTaskEditPanel.prototype.addRow = function(evt) {
		if (this.currtabindex == 0) {
			this.accessibleVariablesPane.addRow(evt);
		} else if (this.currtabindex == 3) {
			this.participantSettingPane.addRow(evt);
		}
	};

	ManualTaskEditPanel.prototype.modifyRow = function(evt) {
		if (this.currtabindex == 0) {
			this.accessibleVariablesPane.modifyRow(evt);
		} else if (this.currtabindex == 3) {
			this.participantSettingPane.modifyRow(evt);
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$
						.data(this, pluginName, new ManualTaskEditPanel(this,
								options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);