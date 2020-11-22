/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "propertySheets";
	var defaults = {
		prop : "",
		topparent : "",
		height : 0,
	};

	var PropertySheet = function(element, options) {
		this.element = element;
		this.options = $.extend({
			prop : "",
			topparent : "",
			height : 0,
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent;
		this.panelBody;
		this.processSheet;
		this.addButton;
		this.modifyButton;
		this.removeButton;
		this.processVariablesPlugin = null;
		this.navigationRulePlugin = null;
		this.assignmentRditPlugin = null;
		this.waittaskRditPlugin = null;
		this.manualTaskRditPlugin = null;
		this.systemTaskRditPlugin = null;
		this.subprocessTaskRditPlugin = null;
		this.accessibleVariablesPanePlugin = null;
		this.blankTaskRditPlugin = null;
		this.init(options);
		this.initSheet();
	};

	PropertySheet.prototype.init = function(options) {
		this.topparent = options.topparent;
		var panelDiv = document.createElement("DIV");
		panelDiv.className = "panel panel-default";
		var header = document.createElement("DIV");
		header.className = "panel-heading";
		header.innerHTML = "高级属性";
		panelDiv.appendChild(header);

		var panelToolbar = document.createElement("UL");
		panelToolbar.className = "nav navbar-nav navbar-right";
		panelToolbar.style.paddingRight = "10px";
		header.appendChild(panelToolbar);

		this.addButton = this.createToolbarItem(panelToolbar, "addnew", "添加",
				"glyphicon glyphicon-plus", "btn btn-primary btn-xs");
		this.modifyButton = this.createToolbarItem(panelToolbar, "modify",
				"修改", "glyphicon glyphicon-pencil", "btn btn-primary btn-xs");
		this.removeButton = this.createToolbarItem(panelToolbar, "removeone",
				"删除", "glyphicon glyphicon-minus", "btn btn-danger btn-xs");

		this.panelBody = document.createElement("DIV");
		this.panelBody.className = "table-responsive";
		this.panelBody.id = "adpropertysheetPane";
		this.panelBody.style.overflowX = "auto";
		this.panelBody.style.overflowY = "auto";
		this.panelBody.style.height = options.height;
		panelDiv.appendChild(this.panelBody);

		this.element.appendChild(panelDiv);
	};

	PropertySheet.prototype.createToolbarItem = function(parent, id, title,
			icon, classname) {
		var toolItem = document.createElement("li");
		toolItem.style.padding = "2px";
		parent.appendChild(toolItem);
		var toolButton = document.createElement("button");
		toolItem.appendChild(toolButton);
		toolButton.type = "button";
		toolButton.id = id;
		toolButton.className = classname;
		toolButton.setAttribute("title", title);
		toolButton.setAttribute("disabled", "");
		toolButton.addEventListener("click", this, false);
		var toolSpan = document.createElement("span");
		toolSpan.className = icon;
		toolSpan.id = id;
		toolButton.appendChild(toolSpan);
		return toolButton;
	};

	PropertySheet.prototype.clearSheet = function(options) {
		this.disabledAddButton();
		this.disabledModifyButton();
		this.disabledRemoveButton();
		while (this.panelBody.hasChildNodes()) {
			this.panelBody.removeChild(this.panelBody.lastChild);
		}
	};

	PropertySheet.prototype.initSheet = function(options) {
		var blankSheet = document.createElement("table");
		blankSheet.id = "advancedpropertysheet";
		blankSheet.className = "table table-striped table-hover";
		this.panelBody.appendChild(blankSheet);
		$(blankSheet).children().remove();
		for (i = 0; i < 4; i++) {
			var row = blankSheet.insertRow(-1);
			var cell1 = row.insertCell(0);
			cell1.innerHTML = "&nbsp;";
		}
	};

	PropertySheet.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	PropertySheet.prototype.doClick = function(evt) {
		if (evt.target == this.addButton || evt.target.id == "addnew") {
			this.addRow(evt);
		} else if (evt.target == this.modifyButton || evt.target.id == "modify") {
			this.modifyRow(evt);
		} else if (evt.target == this.removeButton
				|| evt.target.id == "removeone") {
			this.removeRow(evt);
		}
	};

	PropertySheet.prototype.addRow = function(evt) {
		if (this.entity instanceof WebAppService
				|| this.entity instanceof JavaAppService) {
			this.webAppPropPlugin.addRow(evt);
		}
	};

	PropertySheet.prototype.modifyRow = function(evt) {
		if (this.entity instanceof WebAppService
				|| this.entity instanceof JavaAppService) {
			this.webAppPropPlugin.modifyRow(evt);
		}
	};

	PropertySheet.prototype.removeRow = function(evt) {
		if (this.entity instanceof WebAppService
				|| this.entity instanceof JavaAppService) {
			this.webAppPropPlugin.removeRow(evt);
		}
	};

	PropertySheet.prototype.setSheet = function(obj, tabindex) {
		this.entity = obj;
		this.clearSheet();
		if (this.entity instanceof WebAppService) {
			this.disabledAddButton();
			this.disabledModifyButton();
			this.enableRemoveButton()
			if (this.webAppPropPlugin == null) {
				this.initWebAppPropEditPane(this.panelBody);
			} else {
				this.webAppPropPlugin.loadPane(this.entity);
			}
		} else if (this.entity instanceof EmailTemplate) {
			this.disabledAddButton();
			this.disabledModifyButton();
			this.disabledRemoveButton()
			if (this.emlAttachPropPlugin == null) {
				this.initEmailAttachmentPropEditPane(this.panelBody);
			} else {
				this.emlAttachPropPlugin.loadPane(this.entity);
			}
		} else if (this.entity instanceof AndroidAppPlugin) {
			this.disabledAddButton();
			this.disabledModifyButton();
			this.disabledRemoveButton()
			if (this.amAndroidAppPlugin == null) {
				this.initAndroidAppPropEditPane(this.panelBody);
			} else {
				this.amAndroidAppPlugin.loadPane(this.entity);
			}
		} else {
			this.initSheet(this.options);
		}
	};

	PropertySheet.prototype.initEmailAttachmentPropEditPane = function(parent) {
		var plugin = $(parent).emailTempletePropEditPanel({
			id : "atch006",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
		});
		this.emlAttachPropPlugin = plugin.data("emailTempletePropEditPanel");
	};

	PropertySheet.prototype.initWebAppPropEditPane = function(parent) {
		var plugin = $(parent).webAppSevicePropEditPanel({
			id : "wap005",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
		});
		this.webAppPropPlugin = plugin.data("webAppSevicePropEditPanel");
	};

	PropertySheet.prototype.initAndroidAppPropEditPane = function(parent) {
		var plugin = $(parent).androidAppPropEditPanel({
			id : "wap005",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
		});
		this.amAndroidAppPlugin = plugin.data("androidAppPropEditPanel");
	};

	PropertySheet.prototype.getCurrTabIndex = function(obj) {
		if (obj instanceof WebAppService) {
			if (this.webAppPropPlugin != null) {
				return this.webAppPropPlugin.currtabindex;
			}
		} else if (obj instanceof AndroidAppPlugin) {
			if (this.amAndroidAppPlugin != null) {
				return this.amAndroidAppPlugin.currtabindex;
			}
		}
		return 0;
	};

	PropertySheet.prototype.enableAddButton = function() {
		this.addButton.removeAttribute("disabled");
	};

	PropertySheet.prototype.disabledAddButton = function() {
		this.addButton.setAttribute("disabled", "");
	};

	PropertySheet.prototype.enableModifyButton = function() {
		this.modifyButton.removeAttribute("disabled");
	};

	PropertySheet.prototype.disabledModifyButton = function() {
		this.modifyButton.setAttribute("disabled", "");
	};

	PropertySheet.prototype.enableRemoveButton = function() {
		this.removeButton.removeAttribute("disabled");
	};

	PropertySheet.prototype.disabledRemoveButton = function() {
		this.removeButton.setAttribute("disabled", "");
	};

	PropertySheet.prototype.outputMsg = function(msg) {
		if (this.entity instanceof WebAppService) {
			this.webAppPropPlugin.outputMsg(msg);
		}
	}

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new PropertySheet(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);