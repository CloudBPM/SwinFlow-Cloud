/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "propertySheets";
	var defaults = {
		prop : "",
		ownerId : "",
		topparent : "",
		height : 0,
	};

	var PropertySheet = function(element, options) {
		this.element = element;
		this.options = $.extend({
			prop : "",
			ownerId : "",
			topparent : "",
			height : 0,
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent;
		this.initvaluedialog;
		this.organizationEditPlugin = null;
		this.tabId = null;
		this.panelBody;
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
		this.panelBody.id = "adpropertysheetPane";
		this.panelBody.style.height = options.hegith;
		this.panelBody.style.overflowY = "auto";
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
		toolSpan.id = "SPAN" + id;
		toolButton.appendChild(toolSpan);
		return toolButton;
	};

	PropertySheet.prototype.clearSheet = function(options) {
		while (this.panelBody.hasChildNodes()) {
			this.panelBody.removeChild(this.panelBody.lastChild);
		}
	};

	PropertySheet.prototype.initSheet = function(options) {
		var sheetTableBody = document.createElement("DIV");
		this.panelBody.appendChild(sheetTableBody);
		sheetTableBody.className = "table-responsive";
		sheetTableBody.style.overflowX = "auto";
		sheetTableBody.style.overflowY = "auto";

		var blankSheet = document.createElement("table");
		sheetTableBody.appendChild(blankSheet);
		blankSheet.id = "advancedpropertysheet";
		blankSheet.className = "table table-striped table-hover";

		$(blankSheet).children().remove();
		for (var i = 0; i < 6; i++) {
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
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	PropertySheet.prototype.doClick = function(evt) {
		if (evt.target == this.addButton
				|| (evt.target.tagName == "SPAN" && evt.target.id == "SPANaddnew")) {
			this.addRow(evt);
		} else if (evt.target == this.modifyButton
				|| (evt.target.tagName == "SPAN" && evt.target.id == "SPANmodify")) {
			this.modifyRow(evt);
		} else if (evt.target == this.removeButton
				|| (evt.target.tagName == "SPAN" && evt.target.id == "SPANremoveone")) {
			this.removeRow(evt);
		} else {
			if (evt.target.tagName == "TD") {
				var table = evt.target.parentElement.parentElement;
				if (table.rows.length > 0) {
					for (var i = 0; i < table.rows.length; i++) {
						table.rows[i].style.background = "";
					}
				}
				evt.target.parentElement.style.background = "#d1d1e0";
			}
		}
	};

	PropertySheet.prototype.doDblClick = function(evt) {

	};

	PropertySheet.prototype.addRow = function(evt) {
		if (this.entity instanceof Position
			|| this.entity instanceof ProjectRole) {
			this.positionPropsPanelPlugin.addRow(evt);
		}
	};

	PropertySheet.prototype.modifyRow = function(evt) {

	};

	PropertySheet.prototype.removeRow = function (evt) {
		if (this.entity instanceof Position
			|| this.entity instanceof ProjectRole) {
			this.positionPropsPanelPlugin.removeRow(evt);
		}
	};

	PropertySheet.prototype.setSheet = function(obj, currOwner, cate, tabindex) {
		this.entity = obj;
		this.clearSheet();
		this.disabledAddButton();
		this.disabledModifyButton();
		this.disabledRemoveButton();
		if (this.entity instanceof Organization) {
			if (this.organizationEditPlugin == null) {
				this.initOrganizationEditPane(this.panelBody, currOwner);
			} else {
				this.organizationEditPlugin.loadPane(this.entity, currOwner);
			}
		} else if (this.entity instanceof Division) {
			if (this.departmentEditPlugin == null) {
				this.initDepartEditPane(this.panelBody, currOwner);
			} else {
				this.departmentEditPlugin.loadPane(this.entity, currOwner);
			}
		} else if (this.entity instanceof Department) {
			if (this.departmentEditPlugin == null) {
				this.initDepartEditPane(this.panelBody, currOwner);
			} else {
				this.departmentEditPlugin.loadPane(this.entity, currOwner);
			}
		} else if (this.entity instanceof ProjectTeam) {
			if (this.departmentEditPlugin == null) {
				this.initDepartEditPane(this.panelBody, currOwner);
			} else {
				this.departmentEditPlugin.loadPane(this.entity, currOwner);
			}
		} else if (this.entity instanceof Position
				|| this.entity instanceof ProjectRole) {
			if (this.positionPropsPanelPlugin == null) {
				this.initPositionPropPane(this.panelBody);
			} else {
				this.positionPropsPanelPlugin.loadPane(this.entity, tabindex, currOwner);
			}
		} else if (this.entity instanceof Staff) {
			if (this.staffHistoryPanelPlugin == null) {
				this.initStaffHistoryPane(this.panelBody);
			} else {
				this.staffHistoryPanelPlugin.loadPane(this.entity);
			}
		} else if (this.entity instanceof AuthorityGroup) {
			if (this.groupMemberAuthorityPanelPlugin == null) {
				this.initGroupMemberPane(this.panelBody);
			} else {
				this.groupMemberAuthorityPanelPlugin.loadPane(this.entity);
			}
        } else if (this.entity instanceof MobileUI) {
            if (this.mbuiPropsPanelPlugin == null) {
                this.initMbUIPropPane(this.panelBody, cate);
            } else {
                this.mbuiPropsPanelPlugin.loadPane(this.entity, cate);
            }
        } else if (this.entity instanceof MbButton) {
            if (this.mbButtonPropsPanelPlugin == null) {
                this.initMbButtonPropPane(this.panelBody, cate);
            } else {
            	this.mbButtonPropsPanelPlugin.loadPane(this.entity, cate);
            }
		} else if (this.entity instanceof PCDesktopIcon) {
			if (this.pcDesktopUIIconPropPlugin == null) {
				this.initDesktopIconEditPane(this.panelBody, cate);
			} else {
				this.pcDesktopUIIconPropPlugin.loadPane(this.entity, tabindex, currOwner);
			}
		} else {
			this.initSheet();
		}
	};

	PropertySheet.prototype.initOrganizationEditPane = function(parent, currOwner) {
		var plugin = $(parent).organizationEditPanel({
			id : "w014",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			ownerId : this.options.ownerId,
			currOwner : currOwner,
		});
		this.organizationEditPlugin = plugin.data("organizationEditPanel");
	};

	PropertySheet.prototype.initStaffHistoryPane = function(parent) {
		var plugin = $(parent).staffHistoryPanel({
			id : "user015",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			tabid : this.tabId,
			ownerId : this.options.ownerId,
		});
		this.staffHistoryPanelPlugin = plugin.data("staffHistoryPanel");
	};

	PropertySheet.prototype.initGroupMemberPane = function(parent) {
		var plugin = $(parent).groupMemberAuthorityPanel({
			id : "group016",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			tabid : this.tabId,
			ownerId : this.options.ownerId,
		});
		this.groupMemberAuthorityPanelPlugin = plugin
				.data("groupMemberAuthorityPanel");
	};

	PropertySheet.prototype.initPositionPropPane = function(parent) {
		var plugin = $(parent).positionPropsPanel({
			id : "posProp017",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			tabid : this.tabId,
			ownerId : this.options.ownerId,
		});
		this.positionPropsPanelPlugin = plugin.data("positionPropsPanel");
	};

    PropertySheet.prototype.initMbUIPropPane = function(parent, cate) {
        var plugin = $(parent).mbUIPropsPanel({
            id : "mbuiProp018",
            parent : this,
            entity : this.entity,// mbui object
            topparent : this.topparent,
            tabid : this.tabId,
            ownerId : this.options.ownerId,
			category : cate,
        });
        this.mbuiPropsPanelPlugin = plugin.data("mbUIPropsPanel");
    };

    PropertySheet.prototype.initMbButtonPropPane = function(parent, currOwner) {
        var plugin = $(parent).mbButtonPropsPanel({
            id : "mbbtnProp019",
            parent : this,
            entity : this.entity,// mbui object
            topparent : this.topparent,
            tabid : this.tabId,
            ownerId : this.options.ownerId,
			currOwner : currOwner,
        });
        this.mbButtonPropsPanelPlugin = plugin.data("mbButtonPropsPanel");
    };

	PropertySheet.prototype.initDepartEditPane = function(parent, currOwner) {
		var plugin = $(parent).departmentEditPanel({
			id : "deptprop015",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			ownerId : this.options.ownerId,
			currOwner : currOwner,
		});
		this.departmentEditPlugin = plugin.data("departmentEditPanel");
	};

	PropertySheet.prototype.initDesktopIconEditPane = function(parent, currOwner) {
		var plugin = $(parent).pcDesktopUIIconPropsPanel({
			id : "dtprop016",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			ownerId : this.options.ownerId,
			currOwner : currOwner,
		});
		this.pcDesktopUIIconPropPlugin = plugin.data("pcDesktopUIIconPropsPanel");
	};

	PropertySheet.prototype.getCurrTabIndex = function (obj) {
		if (this.entity instanceof Position
			|| this.entity instanceof ProjectRole) {
			if (this.positionPropsPanelPlugin != null) {
				return this.positionPropsPanelPlugin.currtabindex;
			}
		} else if (this.entity instanceof PCDesktopIcon) {
			if (this.pcDesktopUIIconPropPlugin != null) {
				return this.pcDesktopUIIconPropPlugin.currtabindex;
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