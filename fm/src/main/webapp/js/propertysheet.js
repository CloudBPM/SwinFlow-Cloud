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
		this.owner = null;
		this.singleInputEditPlugin = null;
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
		if (this.entity instanceof SingleLineText) {
			this.singleInputEditPlugin.addRow(evt);
		} else if (this.entity instanceof MultipleLineText) {
			this.multipleLineEditPlugin.addRow(evt);
		} else if (this.entity instanceof SingleSelect) {
			this.singleSelectEditPlugin.addRow(evt);
		} else if (this.entity instanceof ListSelect) {
			this.listEditPlugin.addRow(evt);
		} else if (this.entity instanceof CheckBox) {
			this.checkEditPlugin.addRow(evt);
		} else if (this.entity instanceof Radio) {
			this.radioEditPlugin.addRow(evt);
		} else if (this.entity instanceof IntegerInput) {
			this.integerInputPlugin.addRow(evt);
		} else if (this.entity instanceof DecimalsInput) {
			this.decimalsInputPlugin.addRow(evt);
		} else if (this.entity instanceof CurrencyInput) {
			this.currencyInputPlugin.addRow(evt);
        } else if (this.entity instanceof NaturalNumberInput) {
            this.naturalNumberInputPlugin.addRow(evt);
        } else if (this.entity instanceof DateTimeInput) {
            this.datetimeInputPlugin.addRow(evt);
        } else if (this.entity instanceof DateTimeRangeInput) {
            this.dtrangeInputPlugin.addRow(evt);
		//} else if (this.entity instanceof FileDisplayer) {
		//	this.fileDisplayerPlugin.addRow(evt);
		//} else if (this.entity instanceof FilesDisplayer) {
		//	this.filesDisplayerPlugin.addRow(evt);
		}
	};

	PropertySheet.prototype.modifyRow = function(evt) {
	};

	PropertySheet.prototype.removeRow = function(evt) {
		if (this.entity instanceof SingleLineText) {
			this.singleInputEditPlugin.removeRow(evt);
		} else if (this.entity instanceof MultipleLineText) {
			this.multipleLineEditPlugin.removeRow(evt);
		} else if (this.entity instanceof SingleSelect) {
			this.singleSelectEditPlugin.removeRow(evt);
		} else if (this.entity instanceof ListSelect) {
			this.listEditPlugin.removeRow(evt);
		} else if (this.entity instanceof CheckBox) {
			this.checkEditPlugin.removeRow(evt);
		} else if (this.entity instanceof Radio) {
			this.radioEditPlugin.removeRow(evt);
		} else if (this.entity instanceof IntegerInput) {
			this.integerInputPlugin.removeRow(evt);
		} else if (this.entity instanceof DecimalsInput) {
			this.decimalsInputPlugin.removeRow(evt);
		} else if (this.entity instanceof CurrencyInput) {
			this.currencyInputPlugin.removeRow(evt);
        } else if (this.entity instanceof NaturalNumberInput) {
            this.naturalNumberInputPlugin.removeRow(evt);
        } else if (this.entity instanceof DateTimeInput) {
            this.datetimeInputPlugin.removeRow(evt);
        } else if (this.entity instanceof DateTimeRangeInput) {
            this.dtrangeInputPlugin.removeRow(evt);
		//} else if (this.entity instanceof FileDisplayer) {
		//	this.fileDisplayerPlugin.removeRow(evt);
		//} else if (this.entity instanceof FilesDisplayer) {
		//	this.filesDisplayerPlugin.removeRow(evt);
		}
	};

	PropertySheet.prototype.setSheet = function(obj, owner, tabindex) {
		this.entity = obj;
		this.owner = owner;
		this.clearSheet();
		this.disabledAddButton();
		this.disabledModifyButton();
		this.disabledRemoveButton();
		if (this.entity instanceof ReleasedForm) {
			this.disabledAddButton();
			this.disabledModifyButton();
			this.disabledRemoveButton();
			if (this.rlFormPropsPlugin == null) {
				this.initRlFormEditPane(this.panelBody);
			} else {
				this.rlFormPropsPlugin.loadPane(this.entity);
			}
		} else if (this.entity instanceof SingleLineText) {
			if (this.singleInputEditPlugin == null) {
				this.initSingleInputEditPane(this.panelBody);
			} else {
				this.singleInputEditPlugin.loadPane(this.entity, tabindex,
						owner);
			}
		} else if (this.entity instanceof SingleSelect) {
			if (this.singleSelectEditPlugin == null) {
				this.initSingleSelectEditPane(this.panelBody);
			} else {
				this.singleSelectEditPlugin.loadPane(this.entity, tabindex,
						owner);
			}
		} else if (this.entity instanceof MultipleLineText) {
			if (this.multipleLineEditPlugin == null) {
				this.initMultipleLineEditPane(this.panelBody);
			} else {
				this.multipleLineEditPlugin.loadPane(this.entity, tabindex,
						owner);
			}
		} else if (this.entity instanceof CheckBoxes) {
			if (this.checkesEditPlugin == null) {
				this.initCheckboxesEditPane(this.panelBody);
			} else {
				this.checkesEditPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof CheckBox) {
			if (this.checkEditPlugin == null) {
				this.initCheckboxEditPane(this.panelBody);
			} else {
				this.checkEditPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof Radios) {
			if (this.radiosEditPlugin == null) {
				this.initRadiosEditPane(this.panelBody);
			} else {
				this.radiosEditPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof Radio) {
			if (this.radioEditPlugin == null) {
				this.initRadioEditPane(this.panelBody);
			} else {
				this.radioEditPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof Button) {
			if (this.buttonEditPlugin == null) {
				this.initButtonEditPane(this.panelBody);
			} else {
				this.buttonEditPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof LargeButton) {
			if (this.largeButtonEditPlugin == null) {
				this.initLargeButtonEditPane(this.panelBody);
			} else {
				this.largeButtonEditPlugin.loadPane(this.entity, tabindex,
						owner);
			}
		} else if (this.entity instanceof ListSelect) {
			if (this.listEditPlugin == null) {
				this.initListEditPane(this.panelBody);
			} else {
				this.listEditPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof Image) {
			if (this.imageEditPlugin == null) {
				this.initImageEditPane(this.panelBody);
			} else {
				this.imageEditPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof FileUpload) {
			if (this.fileUploadEditPlugin == null) {
				this.initFileUploadEditPane(this.panelBody);
			} else {
				this.fileUploadEditPlugin
						.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof Anchor) {
			if (this.anchorEditPlugin == null) {
				this.initAnchorEditPane(this.panelBody);
			} else {
				this.anchorEditPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof Header) {
			if (this.headerEditPlugin == null) {
				this.initHeaderEditPane(this.panelBody);
			} else {
				this.headerEditPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof Paragraph) {
			if (this.paragraphEditPlugin == null) {
				this.initParagraphEditPane(this.panelBody);
			} else {
				this.paragraphEditPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof StaticList) {
			if (this.staticListEditPlugin == null) {
				this.initStaticListEditPane(this.panelBody);
			} else {
				this.staticListEditPlugin
						.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof PageableTableView) {
			if (this.pageableTableViewPlugin == null) {
				this.initPageableTableViewPane(this.panelBody);
			} else {
				this.pageableTableViewPlugin
					.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof TableView) {
			if (this.tableViewPlugin == null) {
				this.initTableViewPane(this.panelBody);
			} else {
				this.tableViewPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof IntegerInput) {
			if (this.integerInputPlugin == null) {
				this.initIntegerInputPane(this.panelBody);
			} else {
				this.integerInputPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof DecimalsInput) {
			if (this.decimalsInputPlugin == null) {
				this.initDecimalsInputPane(this.panelBody);
			} else {
				this.decimalsInputPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else if (this.entity instanceof CurrencyInput) {
			if (this.currencyInputPlugin == null) {
				this.initCurrencyInputPane(this.panelBody);
			} else {
				this.currencyInputPlugin.loadPane(this.entity, tabindex, owner);
			}
        } else if (this.entity instanceof NaturalNumberInput) {
            if (this.naturalNumberInputPlugin == null) {
                this.initNaturalNumInputPane(this.panelBody);
            } else {
                this.naturalNumberInputPlugin.loadPane(this.entity, tabindex, owner);
            }
        } else if (this.entity instanceof DateTimeInput) {
            if (this.datetimeInputPlugin == null) {
                this.initDatetimeInputPane(this.panelBody);
            } else {
                this.datetimeInputPlugin.loadPane(this.entity, tabindex, owner);
            }
        } else if (this.entity instanceof DateTimeRangeInput) {
            if (this.dtrangeInputPlugin == null) {
                this.initDTRangeInputPane(this.panelBody);
            } else {
                this.dtrangeInputPlugin.loadPane(this.entity, tabindex, owner);
            }
        } else if (this.entity instanceof FileDisplayer) {
            if (this.fileDisplayerPlugin == null) {
                this.initFileDisplayerInputPane(this.panelBody);
            } else {
                this.fileDisplayerPlugin.loadPane(this.entity, tabindex, owner);
            }
		} else if (this.entity instanceof FilesDisplayer) {
			if (this.filesDisplayerPlugin == null) {
				this.initFilesDisplayerInputPane(this.panelBody);
			} else {
				this.filesDisplayerPlugin.loadPane(this.entity, tabindex, owner);
			}
		} else {
			this.initSheet(this.options);
		}
	};

	PropertySheet.prototype.initRlFormEditPane = function(parent) {
		var plugin = $(parent).releasedFormPropsPanel({
			id : "rlf002",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.rlFormPropsPlugin = plugin.data("releasedFormPropsPanel");
	};

	PropertySheet.prototype.initSingleInputEditPane = function(parent) {
		var plugin = $(parent).singleInputEditPanel({
			id : "sinput001",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.singleInputEditPlugin = plugin.data("singleInputEditPanel");
	};

	PropertySheet.prototype.initSingleSelectEditPane = function(parent) {
		var plugin = $(parent).singleSelectEditPanel({
			id : "singsel002",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.singleSelectEditPlugin = plugin.data("singleSelectEditPanel");
	};

	PropertySheet.prototype.initMultipleLineEditPane = function(parent) {
		var plugin = $(parent).multipleLineInputEditPanel({
			id : "minput003",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.multipleLineEditPlugin = plugin.data("multipleLineInputEditPanel");
	};

	PropertySheet.prototype.initCheckboxesEditPane = function(parent) {
		var plugin = $(parent).checkboxesEditPanel({
			id : "chk0041",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.checkesEditPlugin = plugin.data("checkboxesEditPanel");
	};

	PropertySheet.prototype.initCheckboxEditPane = function(parent) {
		var plugin = $(parent).checkboxEditPanel({
			id : "chk004",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.checkEditPlugin = plugin.data("checkboxEditPanel");
	};

	PropertySheet.prototype.initRadiosEditPane = function(parent) {
		var plugin = $(parent).radiosEditPanel({
			id : "rdo0051",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.radiosEditPlugin = plugin.data("radiosEditPanel");
	};

	PropertySheet.prototype.initRadioEditPane = function(parent) {
		var plugin = $(parent).radioEditPanel({
			id : "rdo005",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.radioEditPlugin = plugin.data("radioEditPanel");
	};

	PropertySheet.prototype.initButtonEditPane = function(parent) {
		var plugin = $(parent).buttonEditPanel({
			id : "btn006",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.buttonEditPlugin = plugin.data("buttonEditPanel");
	};

	PropertySheet.prototype.initLargeButtonEditPane = function(parent) {
		var plugin = $(parent).largeButtonEditPanel({
			id : "lgbtn007",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.largeButtonEditPlugin = plugin.data("largeButtonEditPanel");
	};

	PropertySheet.prototype.initListEditPane = function(parent) {
		var plugin = $(parent).listSelectEditPanel({
			id : "lst008",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.listEditPlugin = plugin.data("listSelectEditPanel");
	};

	PropertySheet.prototype.initImageEditPane = function(parent) {
		var plugin = $(parent).imageEditPanel({
			id : "img009",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.imageEditPlugin = plugin.data("imageEditPanel");
	};

	PropertySheet.prototype.initFileUploadEditPane = function(parent) {
		var plugin = $(parent).fileUploadEditPanel({
			id : "fu010",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.fileUploadEditPlugin = plugin.data("fileUploadEditPanel");
	};

	PropertySheet.prototype.initAnchorEditPane = function(parent) {
		var plugin = $(parent).anchorEditPanel({
			id : "ach011",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.anchorEditPlugin = plugin.data("anchorEditPanel");
	};

	PropertySheet.prototype.initHeaderEditPane = function(parent) {
		var plugin = $(parent).headerEditPanel({
			id : "hdr012",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.headerEditPlugin = plugin.data("headerEditPanel");
	};

	PropertySheet.prototype.initParagraphEditPane = function(parent) {
		var plugin = $(parent).paragraphEditPanel({
			id : "p013",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.paragraphEditPlugin = plugin.data("paragraphEditPanel");
	};

	PropertySheet.prototype.initStaticListEditPane = function(parent) {
		var plugin = $(parent).staticListEditPanel({
			id : "slst014",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.staticListEditPlugin = plugin.data("staticListEditPanel");
	};

	PropertySheet.prototype.initPageableTableViewPane = function(parent) {
		var plugin = $(parent).pageableTableViewPanel({
			id : "pgbtv015",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.pageableTableViewPlugin = plugin.data("pageableTableViewPanel");
	};

	PropertySheet.prototype.initTableViewPane = function(parent) {
		var plugin = $(parent).tableViewPanel({
			id : "tbv016",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.tableViewPlugin = plugin.data("tableViewPanel");
	};

	PropertySheet.prototype.initIntegerInputPane = function(parent) {
		var plugin = $(parent).integerInputEditPanel({
			id : "intinput002",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.integerInputPlugin = plugin.data("integerInputEditPanel");
	};

	PropertySheet.prototype.initDecimalsInputPane = function(parent) {
		var plugin = $(parent).decimalsInputEditPanel({
			id : "realinput003",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.decimalsInputPlugin = plugin.data("decimalsInputEditPanel");
	};

	PropertySheet.prototype.initCurrencyInputPane = function(parent) {
		var plugin = $(parent).currencyInputEditPanel({
			id : "currinput004",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.currencyInputPlugin = plugin.data("currencyInputEditPanel");
	};

    PropertySheet.prototype.initNaturalNumInputPane = function(parent) {
        var plugin = $(parent).naturalNumberInputPanel({
            id : "natinput005",
            parent : this,
            entity : this.entity,
            topparent : this.topparent,
            currowner : this.owner,
        });
        this.naturalNumberInputPlugin = plugin.data("naturalNumberInputPanel");
    };

    PropertySheet.prototype.initDatetimeInputPane = function(parent) {
        var plugin = $(parent).datetimeInputPanel({
            id : "dteinput006",
            parent : this,
            entity : this.entity,
            topparent : this.topparent,
            currowner : this.owner,
        });
        this.datetimeInputPlugin = plugin.data("datetimeInputPanel");
    };

    PropertySheet.prototype.initDTRangeInputPane = function(parent) {
        var plugin = $(parent).dtrangeInputPanel({
            id : "dtrinput007",
            parent : this,
            entity : this.entity,
            topparent : this.topparent,
            currowner : this.owner,
        });
        this.dtrangeInputPlugin = plugin.data("dtrangeInputPanel");
    };

    PropertySheet.prototype.initFileDisplayerInputPane = function(parent) {
        var plugin = $(parent).fileDisplayerEditPanel({
            id : "filedisplayer008",
            parent : this,
            entity : this.entity,
            topparent : this.topparent,
            currowner : this.owner,
        });
        this.fileDisplayerPlugin = plugin.data("fileDisplayerEditPanel");
    };

	PropertySheet.prototype.initFilesDisplayerInputPane = function(parent) {
		var plugin = $(parent).filesDisplayerEditPanel({
			id : "filesdisplayer009",
			parent : this,
			entity : this.entity,
			topparent : this.topparent,
			currowner : this.owner,
		});
		this.filesDisplayerPlugin = plugin.data("filesDisplayerEditPanel");
	};

	PropertySheet.prototype.getCurrTabIndex = function(obj) {
		if (obj instanceof SingleLineText) {
			if (this.singleInputEditPlugin != null) {
				return this.singleInputEditPlugin.currtabindex;
			}
		} else if (obj instanceof SingleSelect) {
			if (this.singleSelectEditPlugin != null) {
				return this.singleSelectEditPlugin.currtabindex;
			}
		} else if (obj instanceof ListSelect) {
			if (this.listEditPlugin != null) {
				return this.listEditPlugin.currtabindex;
			}
		} else if (obj instanceof MultipleLineText) {
			if (this.multipleLineEditPlugin != null) {
				return this.multipleLineEditPlugin.currtabindex;
			}
		} else if (obj instanceof CheckBox) {
			if (this.checkEditPlugin != null) {
				return this.checkEditPlugin.currtabindex;
			}
		} else if (obj instanceof CheckBoxes) {
			if (this.checkesEditPlugin != null) {
				return this.checkesEditPlugin.currtabindex;
			}
		} else if (obj instanceof Radios) {
			if (this.radiosEditPlugin != null) {
				return this.radiosEditPlugin.currtabindex;
			}
		} else if (obj instanceof Radio) {
			if (this.radioEditPlugin != null) {
				return this.radioEditPlugin.currtabindex;
			}
		} else if (obj instanceof Button) {
			if (this.buttonEditPlugin != null) {
				return this.buttonEditPlugin.currtabindex;
			}
		} else if (obj instanceof Image) {
			if (this.imageEditPlugin != null) {
				return this.imageEditPlugin.currtabindex;
			}
		} else if (obj instanceof FileUpload) {
			if (this.fileUploadEditPlugin != null) {
				return this.fileUploadEditPlugin.currtabindex;
			}
		} else if (obj instanceof Header) {
			if (this.headerEditPlugin != null) {
				return this.headerEditPlugin.currtabindex;
			}
		} else if (obj instanceof Paragraph) {
			if (this.paragraphEditPlugin != null) {
				return this.paragraphEditPlugin.currtabindex;
			}
		} else if (obj instanceof StaticList) {
			if (this.staticListEditPlugin != null) {
				return this.staticListEditPlugin.currtabindex;
			}
		} else if (obj instanceof PageableTableView) {
			if (this.pageableTableViewPlugin != null) {
				return this.pageableTableViewPlugin.currtabindex;
			}
		} else if (obj instanceof TableView) {
			if (this.tableViewPlugin != null) {
				return this.tableViewPlugin.currtabindex;
			}
		} else if (obj instanceof IntegerInput) {
			if (this.integerInputPlugin != null) {
				return this.integerInputPlugin.currtabindex;
			}
		} else if (obj instanceof DecimalsInput) {
			if (this.decimalsInputPlugin != null) {
				return this.decimalsInputPlugin.currtabindex;
			}
		} else if (obj instanceof CurrencyInput) {
			if (this.currencyInputPlugin != null) {
				return this.currencyInputPlugin.currtabindex;
			}
        } else if (obj instanceof NaturalNumberInput) {
            if (this.naturalNumberInputPlugin != null) {
                return this.naturalNumberInputPlugin.currtabindex;
            }
        } else if (obj instanceof DateTimeInput) {
            if (this.datetimeInputPlugin != null) {
                return this.datetimeInputPlugin.currtabindex;
            }
        } else if (obj instanceof DateTimeRangeInput) {
            if (this.dtrangeInputPlugin != null) {
                return this.dtrangeInputPlugin.currtabindex;
            }
		} else if (obj instanceof FileDisplayer) {
			if (this.fileDisplayerPlugin != null) {
				return this.fileDisplayerPlugin.currtabindex;
			}
		} else if (obj instanceof FilesDisplayer) {
			if (this.filesDisplayerPlugin != null) {
				return this.filesDisplayerPlugin.currtabindex;
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