/**
 *
 */

;
(function($, window, document, undefined) {
	var pluginName = "dataVariableEditDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		topparent : "",
		owner: "",
	};

	var DataVariableEditDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			topparent : "",
			owner: "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.parent = options.parent;
		this.newVar = false;
		this.init(options);
	};

	DataVariableEditDialog.prototype.init = function(options) {

		this.topparent = options.topparent; // body document object.
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe
				.setAttribute("aria-labelledby", "varModal" + options.id);

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "680px"
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		modaldialogDIV.appendChild(dialogContentDIV);

		// dialog heading
		var dialogHeaderDIV = document.createElement("div");
		dialogHeaderDIV.className = "modal-header";
		dialogContentDIV.appendChild(dialogHeaderDIV);

		var closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");

		var closeSpan = document.createElement("span");
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";
		closeButton.appendChild(closeSpan);
		dialogHeaderDIV.appendChild(closeButton);

		var titleH4 = document.createElement("h4");
		titleH4.className = "modal-title";
		titleH4.id = "varModal" + options.id;
		dialogHeaderDIV.appendChild(titleH4);

		var infoIcon = document.createElement("i");
		infoIcon.className = "fa fa-pencil-square fa-lg";
		infoIcon.style.color = "blue";
		titleH4.appendChild(infoIcon);

		var info = document.createElement("label");
		info.innerHTML = options.title;
		titleH4.appendChild(info);

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);
		dialogForm.setAttribute("enctype", "multipart/form-data");

		var dialogBodyDIV = document.createElement("div");
		dialogBodyDIV.className = "modal-body";
		dialogForm.appendChild(dialogBodyDIV);

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyFrameDIV.className = "container-fluid";
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);

		var dialog = $(dialogBodyDIV).alertBox({
			id : options.id,
		});
		this.messageBox = dialog.data("alertBox");

		var bodyRow = document.createElement("div");
		bodyRow.className = "row";
		bodyRow.id = "bodyrow" + options.id;
		dialogBodyFrameDIV.appendChild(bodyRow);

		// add form panel here...
		this.addContent(bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		var saveButton = document.createElement("button");
		saveButton.type = "button";
		saveButton.className = "btn btn-primary";
		saveButton.id = "OK" + options.id;
		saveButton.name = "OK" + options.id;
		// saveButton.setAttribute("data-dismiss", "modal");
		saveButton.addEventListener("click", this, false);
		saveButton.innerHTML = "确定";
		dialogFooterDIV.appendChild(saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "button";
		cancelButton.id = "CANCEL" + options.id;
		cancelButton.name = "CANCEL" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		cancelButton.addEventListener("click", this, false);
		dialogFooterDIV.appendChild(cancelButton);
	};

	DataVariableEditDialog.prototype.addContent = function(parent) {
		var variableNameDIV = document.createElement("div");
		variableNameDIV.className = "form-group";
		parent.appendChild(variableNameDIV);

		var variableNameLabel = document.createElement("label");
		variableNameLabel.setAttribute("for", "variableInputName");
		variableNameLabel.innerHTML = "变量名";
		variableNameDIV.appendChild(variableNameLabel);

		this.variableNameInput = document.createElement("input");
		variableNameDIV.appendChild(this.variableNameInput);
		this.variableNameInput.type = "text";
		this.variableNameInput.className = "form-control";
		this.variableNameInput.id = "variableInputName" + this.options.id;
		this.variableNameInput.setAttribute("placeholder", "请输入一个变量名，变量名不能为空。");
		this.variableNameInput.addEventListener("change", this, false);

		var variableNameDIV1 = document.createElement("div");
		variableNameDIV1.className = "form-group";
		parent.appendChild(variableNameDIV1);

		var varTypeLabel = document.createElement("label");
		varTypeLabel.setAttribute("for", "variableInputType");
		varTypeLabel.innerHTML = "类型";
		variableNameDIV1.appendChild(varTypeLabel);

		this.varTypeSelect = document.createElement("select");
		variableNameDIV1.appendChild(this.varTypeSelect);
		this.varTypeSelect.id = "variableInputType" + this.options.id;
		this.varTypeSelect.className = "form-control";

		this.addOptions(this.varTypeSelect, datatype["Integer"], "Integer", 0);
		this.addOptions(this.varTypeSelect, datatype["Double"], "Double", 1);
		this.addOptions(this.varTypeSelect, datatype["Boolean"], "Boolean", 2);
		this.addOptions(this.varTypeSelect, datatype["String"], "String", 3);
		this
				.addOptions(this.varTypeSelect, datatype["DateTime"],
						"DateTime", 4);
		this.addOptions(this.varTypeSelect, datatype["Date"], "Date", 5);
		this.addOptions(this.varTypeSelect, datatype["Time"], "Time", 6);
		this.addOptions(this.varTypeSelect, datatype["TimeDuration"],
				"TimeDuration", 7);
		this
				.addOptions(this.varTypeSelect, datatype["Currency"],
						"Currency", 8);
		this
				.addOptions(this.varTypeSelect, datatype["JSONData"],
						"JSONData", 9);
		this.addOptions(this.varTypeSelect, datatype["File"], "File", 10);
		this.addOptions(this.varTypeSelect, datatype["Handwriting"],
				"Handwriting", 11);
		this.varTypeSelect.addEventListener("change", this, false);

		var isArrayDIV1 = document.createElement("DIV");
		isArrayDIV1.className = "checkbox";
		parent.appendChild(isArrayDIV1);

		var isArrayLabel = document.createElement("LABEL");
		isArrayDIV1.appendChild(isArrayLabel);

		this.isArrayInput = document.createElement("INPUT");
		isArrayLabel.appendChild(this.isArrayInput);
		this.isArrayInput.type = "checkbox";
		this.isArrayInput.id = this.options.id + "isAry";
		this.isArrayInput.name = this.options.id + "isAry";
		this.isArrayInput.value = "1";
		this.isArrayInput.addEventListener("click", this, false);

		isArrayLabel.appendChild(document.createTextNode("是否数组"));

		this.specialPropDIV = document.createElement("DIV");
		parent.appendChild(this.specialPropDIV);
		this.specialPropDIV.style.display = "none";

		var plugin0 = $(this.specialPropDIV).specialPropEditPanel({
			id : this.options.id,
			owner : this.options.owner,
			msgbox : this.messageBox,
		});
		this.spPropPane = plugin0.data("specialPropEditPanel");

		this.isArrayDIV = document.createElement("DIV");
		parent.appendChild(this.isArrayDIV);
		this.isArrayDIV.style.display = "none";

		var plugin2 = $(this.isArrayDIV).aryInitValueEditPanel({
			id : this.options.id,
			title : "设定数组初始值",
			owner : this.options.owner,
			topparent : this.topparent,
		});
		this.aryPanel = plugin2.data("aryInitValueEditPanel");

		var variableNameDIV2 = document.createElement("div");
		parent.appendChild(variableNameDIV2);
		variableNameDIV2.className = "form-group";

		var noteLabel = document.createElement("label");
		variableNameDIV2.appendChild(noteLabel);
		noteLabel.setAttribute("for", "");
		noteLabel.innerHTML = "备注";

		this.descriptionTextArea = document.createElement("textarea");
		variableNameDIV2.appendChild(this.descriptionTextArea);
		this.descriptionTextArea.className = "form-control";
		this.descriptionTextArea.setAttribute("rows", "3");
		this.descriptionTextArea.setAttribute("placeholder", "在这里为变量输入备注....");

	};

	DataVariableEditDialog.prototype.addOptions = function(parent, title,
			value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	DataVariableEditDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	DataVariableEditDialog.prototype.removeFiles = function(varid, procid,
			orgid) {
		$("#progressbar").show();
		$.post(service.api2(2, orgid), {
			oid : orgid, // organization id
			pid : procid, // process id
			vid : varid,
		}).complete(function(data) {
			$("#progressbar").hide();
		});
	};

	// finally click OK button
	DataVariableEditDialog.prototype.doClick = function(evt) {
		if (evt.target.name == "CANCEL" + this.options.id) {
			if (this.newVar) {
				if (this.datavar.datatype == "File") {
					evt.preventDefault();
					this.removeFiles(this.datavar.id, this.owner.id,
							this.owner.owner);
				}
			}
			return;
		} else if (evt.target.name == "OK" + this.options.id) {
			if (this.variableNameInput.value == "") {
				this.messageBox.show(4, "变量名不能为空，请输入一个变量名。", false);
				this.variableNameInput.focus();
				Utils.stopBubble(evt);
				return false;
			} else {
				this.datavar.name = Utils
						.stringify(this.variableNameInput.value);
				this.datavar.datatype = this.varTypeSelect.value;
				if (this.datavar.value == null) {
					if (this.datavar.datatype == "Integer") {
						this.datavar.value = new IntegerConstant();
					} else if (this.datavar.datatype == "Double") {
						this.datavar.value = new DoubleConstant();
					} else if (this.datavar.datatype == "Boolean") {
						this.datavar.value = new BooleanConstant();
					} else if (this.datavar.datatype == "String") {
						this.datavar.value = new StringConstant();
					} else if (this.datavar.datatype == "DateTime") {
						var val = new DateTimeConstant();
						val.datatype = this.datavar.datatype;
						val.timetype = 0;
						this.datavar.value = val;
					} else if (this.datavar.datatype == "Date") {
						var val = new DateTimeConstant();
						val.datatype = this.datavar.datatype;
						val.timetype = 1;
						this.datavar.value = val;
					} else if (this.datavar.datatype == "Time") {
						var val = new DateTimeConstant();
						val.datatype = this.datavar.datatype;
						val.timetype = 2;
						this.datavar.value = val;
					} else if (this.datavar.datatype == "TimeDuration") {
						this.datavar.value = new TimeDurationConstant();
					} else if (this.datavar.datatype == "JSONData") {
						this.datavar.value = new JSONConstant();
					} else if (this.datavar.datatype == "File") {
						this.datavar.value = new FileConstant();
					} else if (this.datavar.datatype == "Handwriting") {
						this.datavar.value = new HandwritingConstant();
					} else if (this.datavar.datatype == "Currency") {
						this.datavar.value = new DoubleConstant();
						this.datavar.value.datatype == "Currency";
					}
				}
				this.datavar.description = Utils
						.stringify(this.descriptionTextArea.value);
				this.datavar.currOwner = this.owner.id; // process id
				this.datavar.owner = this.owner.owner; // organization id
				if (this.newVar) {
					map[this.owner.id].stack.execute(new PMCreateVariableCmd(
							this.datavar, this.owner));
					this.hide();
				} else {// update an existing variable
					this.modcmd.update(this.datavar);
					map[this.owner.id].stack.execute(this.modcmd);
					this.hide();
				}
			}
			return;
		} else if (evt.target.id == this.options.id + "isAry") {
			if (evt.target.checked) {
				// now it is an array
				this.isArrayDIV.style.display = "";
				this.specialPropDIV.style.display = "none";
				var v = new ArrayDataVariable();
				v.id = this.datavar.id;
				v.name = this.datavar.name;
				v.orderNumber = this.datavar.orderNumber;
				v.description = this.datavar.description;
				v.datatype = this.varTypeSelect.options[this.varTypeSelect.selectedIndex].value;
				v.owner = this.datavar.owner;
				v.currOwner = this.datavar.currOwner;
				v.values = [];
				this.datavar = v;
			} else {
				// now it is an data variable
				this.isArrayDIV.style.display = "none";
				this.specialPropDIV.style.display = "";
				var v = new DataVariable();
				v.id = this.datavar.id;
				v.name = this.datavar.name;
				v.orderNumber = this.datavar.orderNumber;
				v.description = this.datavar.description;
				v.datatype = this.varTypeSelect.options[this.varTypeSelect.selectedIndex].value;
				v.currOwner = this.datavar.currOwner; // process ID
				v.owner = this.datavar.owner; // organization ID
				if (v.datatype == "Integer") {
					v.value = new IntegerConstant();
				} else if (v.datatype == "Double") {
					v.value = new DoubleConstant();
				} else if (v.datatype == "Boolean") {
					v.value = new BooleanConstant();
				} else if (v.datatype == "String") {
					v.value = new StringConstant();
				} else if (v.datatype == "DateTime") {
					var val = new DateTimeConstant();
					val.datatype = v.datatype;
					val.timetype = 0;
					v.value = val;
				} else if (v.datatype == "Date") {
					var val = new DateTimeConstant();
					val.datatype = v.datatype;
					val.timetype = 1;
					v.value = val;
				} else if (v.datatype == "Time") {
					var val = new DateTimeConstant();
					val.datatype = v.datatype;
					val.timetype = 2;
					v.value = val;
				} else if (v.datatype == "TimeDuration") {
					v.value = new TimeDurationConstant();
				} else if (v.datatype == "JSONData") {
					v.value = new JSONConstant();
				} else if (v.datatype == "File") {
					v.value = new FileConstant();
				} else if (v.datatype == "Handwriting") {
					v.value = new HandwritingConstant();
				} else if (v.datatype == "Currency") {
					v.value = new DoubleConstant();
					v.datatype = "Currency";
				}
				this.datavar = v;
			}
			this.removeFiles(this.datavar.id, this.owner.id, this.owner.owner);
			this.initDialogFields();
		}
	};

	/**
	 * If data type changed, we will create new variable to contain data. if
	 * this.datavar is brand new variable, then create new variable object, if
	 * this.datavar is the existing variable, then create new variable object to
	 * copy all props from the existing variable except for data type and
	 * classtypename. If this.datavar is an array, we only modify the data type
	 * in this.datavar.
	 *
	 * @author Dahai Cao last updated on 2017-10-18
	 */
	DataVariableEditDialog.prototype.doChange = function(evt) {
		if (evt.target == this.variableNameInput) {
			if (this.owner.checkDuplicateName(this.variableNameInput.value)) {
				this.messageBox.show(4, "变量重名，请更改变量名。", false);
				this.variableNameInput.focus();
				evt.preventDefault();
				return false;
			}
			this.datavar.name = Utils.stringify(this.variableNameInput.value);
		} else if (evt.target == this.varTypeSelect) {
			this.datavar.datatype = this.varTypeSelect.value;
			if (this.datavar instanceof ArrayDataVariable) {
				// don't create new variable but only modify data type prop.
				this.datavar.values = [];
			} else {
				this.datavar.datatype = this.varTypeSelect.value;
				if (this.datavar.datatype == "Integer") {
					this.datavar.value = new IntegerConstant();
				} else if (this.datavar.datatype == "Double") {
					this.datavar.value = new DoubleConstant();
				} else if (this.datavar.datatype == "Boolean") {
					this.datavar.value = new BooleanConstant();
				} else if (this.datavar.datatype == "String") {
					this.datavar.value = new StringConstant();
				} else if (this.datavar.datatype == "DateTime") {
					var val = new DateTimeConstant();
					val.datatype = this.datavar.datatype;
					val.timetype = 0;
					this.datavar.value = val;
				} else if (this.datavar.datatype == "Date") {
					var val = new DateTimeConstant();
					val.datatype = this.datavar.datatype;
					val.timetype = 1;
					this.datavar.value = val;
				} else if (this.datavar.datatype == "Time") {
					var val = new DateTimeConstant();
					val.datatype = this.datavar.datatype;
					val.timetype = 2;
					this.datavar.value = val;
				} else if (this.datavar.datatype == "TimeDuration") {
					this.datavar.value = new TimeDurationConstant();
				} else if (this.datavar.datatype == "JSONData") {
					this.datavar.value = new JSONConstant();
				} else if (this.datavar.datatype == "File") {
					this.datavar.value = new FileConstant();
				} else if (this.datavar.datatype == "Handwriting") {
					this.datavar.value = new HandwritingConstant();
				} else if (this.datavar.datatype == "Currency") {
					this.datavar.value = new DoubleConstant();
					this.datavar.value.datatype == "Currency";
				}
			}
			var n = this.owner.getNewNumber();
			if (this.newVar) {
				// if (this.datavar.datatype == "Integer") {
				// 	this.datavar.name = Utils.stringify("整数变量" + n);
				// } else if (this.datavar.datatype == "Double") {
				// 	this.datavar.name = Utils.stringify("小数变量" + n);
				// } else if (this.datavar.datatype == "Boolean") {
				// 	this.datavar.name = Utils.stringify("真假值变量" + n);
				// } else if (this.datavar.datatype == "String") {
				// 	this.datavar.name = Utils.stringify("字符串变量" + n);
				// } else if (this.datavar.datatype == "DateTime") {
				// 	this.datavar.name = Utils.stringify("日期时间变量" + n);
				// } else if (this.datavar.datatype == "Date") {
				// 	this.datavar.name = Utils.stringify("日期变量" + n);
				// } else if (this.datavar.datatype == "Time") {
				// 	this.datavar.name = Utils.stringify("时间变量" + n);
				// } else if (this.datavar.datatype == "TimeDuration") {
				// 	this.datavar.name = Utils.stringify("时间区间变量" + n);
				// } else if (this.datavar.datatype == "JSONData") {
				// 	this.datavar.name = Utils.stringify("JSON数据变量" + n);
				// } else if (this.datavar.datatype == "File") {
				// 	this.datavar.name = Utils.stringify("文件变量" + n);
				// } else if (this.datavar.datatype == "Handwriting") {
				// 	this.datavar.name = Utils.stringify("写字板变量" + n);
				// } else if (this.datavar.datatype == "Currency") {
				// 	this.datavar.name = Utils.stringify("货币变量" + n);
				// }
				this.removeFiles(this.datavar.id, this.owner.id,
						this.owner.owner);
			}
		}
		this.initDialogFields();
	};

	DataVariableEditDialog.prototype.setNewDataVariable = function(process,
			newid) {
		// by default, it is a integer variable
		// because this.varTypeSelect is the integer type.
		this.newVar = true;
		this.owner = process;
		this.datavar = new DataVariable();
		this.datavar.id = newid;
		this.datavar.currOwner = process.id; // process Id;
		this.datavar.owner = process.owner; // organization Id;
		this.datavar.orderNumber = process.getNewNumber();
		this.datavar.datatype = "Integer";
		this.datavar.name = Utils.stringify("数据变量" + this.datavar.orderNumber);
		this.datavar.value = new IntegerConstant();
		this.varTypeSelect.disabled = false;
		this.varTypeSelect.value = this.datavar.datatype;
		this.initDialogFields();
	};

	DataVariableEditDialog.prototype.initDialogFields = function() {
		this.variableNameInput.value = Utils.parse(this.datavar.name);
		this.descriptionTextArea.value = Utils.parse(this.datavar.description);
		if (this.datavar instanceof ArrayDataVariable) {
			this.isArrayInput.checked = true;
		} else {
			this.isArrayInput.checked = false;
		}
		if (this.isArrayInput.checked) {
			this.isArrayDIV.style.display = "";
			this.specialPropDIV.style.display = "none";
			this.aryPanel.setInitValue(this.datavar);
		} else {
			this.isArrayDIV.style.display = "none";
			this.specialPropDIV.style.display = "";
			this.spPropPane.setInitValue(this.datavar);
		}
	};

	DataVariableEditDialog.prototype.setDataVariable = function(orgvar, owner) {
		this.newVar = false;
		this.modcmd = new PMModifyVariableCmd(orgvar, owner);
		this.datavar = orgvar; // originDatavar.clone();
		this.owner = owner; // process object;
		this.varTypeSelect.disabled = true;
		this.varTypeSelect.value = this.datavar.datatype;
		this.initDialogFields();
	};

	DataVariableEditDialog.prototype.show = function(modal) {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : modal
		});
	};

	DataVariableEditDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new DataVariableEditDialog(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);