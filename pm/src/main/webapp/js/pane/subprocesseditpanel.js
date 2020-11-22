/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "subprocessSettingEditPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var SubprocessEditPanel = function(element, options) {
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
		this.topparent = options.topparent;
		this.ruleditdialog;

		this.init(options);
	};

	SubprocessEditPanel.prototype.init = function(options) {
		// rule edit dialog;
		var plugin2 = $(this.topparent).assignmentEditDialog({
			id : "asgn003",
			title : "轩琦科技 - 赋值编辑器",
			parent : this,
			topparent : this.topparent,
		});
		this.assignditdialog = plugin2.data("assignmentEditDialog");

		var plugin3 = $(this.topparent).processServiceStoreDialog({
			id : options.id,
			title : "轩琦科技 - 应用商店",
			parent : this,
			topparent : this.topparent,
		});
		this.procstoredialog = plugin3.data("processServiceStoreDialog");

		this.loadPane(options.entity, options.currowner);
	};

	SubprocessEditPanel.prototype.loadPane = function(entity, owner) {
		this.owner = owner;
		this.entity = entity;
		var mainmodalframeDiv = document.createElement("div");
		this.element.appendChild(mainmodalframeDiv);
		mainmodalframeDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		mainmodalframeDiv.style.padding = "4px";

		var mainmodalframe = document.createElement("div");
		mainmodalframeDiv.appendChild(mainmodalframe);
		mainmodalframe.className = "panel panel-default";

		var modalframe = document.createElement("div");
		mainmodalframe.appendChild(modalframe);
		modalframe.className = "panel-body";

		var suprocesssettingform = document.createElement("form");
		modalframe.appendChild(suprocesssettingform);
		suprocesssettingform.className = "form-horizontal";

		// synchronization setting: synchronous and asynchronous
		var synchronizationGroupDiv = document.createElement("div");
		suprocesssettingform.appendChild(synchronizationGroupDiv);
		synchronizationGroupDiv.className = "form-group";

		var synchronizationLabel = document.createElement("label");
		synchronizationGroupDiv.appendChild(synchronizationLabel);
		synchronizationLabel.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12 control-label";
		synchronizationLabel.innerHTML = "运行模式";

		var synchronousGroupDiv = document.createElement("div");
		synchronizationGroupDiv.appendChild(synchronousGroupDiv);
		synchronousGroupDiv.className = "col-lg-10 col-md-10 col-sm-12 col-xs-12";

		// synchronous subprocess
		var radioOptionDiv = document.createElement("div");
		synchronousGroupDiv.appendChild(radioOptionDiv);
		radioOptionDiv.className = "radio-inline";

		var radioOptionLabel = document.createElement("label");
		radioOptionDiv.appendChild(radioOptionLabel);

		this.radioOption = document.createElement("input");
		radioOptionLabel.appendChild(this.radioOption);
		this.radioOption.type = "radio";
		this.radioOption.name = "synchronizationOption" + this.options.id;
		this.radioOption.id = "synchronizationOptions1" + this.options.id;
		this.radioOption.addEventListener("click", this, false);

		var radioOptionTxt = document.createElement("label");
		radioOptionLabel.appendChild(radioOptionTxt);
		radioOptionTxt.innerHTML = "子应用同步运行";
		// asynchronous subprocess
		var radioOptionDiv1 = document.createElement("div");
		synchronousGroupDiv.appendChild(radioOptionDiv1);
		radioOptionDiv1.className = "radio-inline";

		var radioOptionLabel1 = document.createElement("label");
		radioOptionDiv1.appendChild(radioOptionLabel1);

		this.radioOption1 = document.createElement("input");
		radioOptionLabel1.appendChild(this.radioOption1);
		this.radioOption1.type = "radio";
		this.radioOption1.name = "synchronizationOption" + this.options.id;
		this.radioOption1.id = "synchronizationOptions2" + this.options.id;
		this.radioOption1.addEventListener("click", this, false);

		var radioOptionTxt1 = document.createElement("label");
		radioOptionLabel1.appendChild(radioOptionTxt1);
		radioOptionTxt1.innerHTML = "子应用异步运行";

		// subprocess list
		var subprocessListGroupDiv = document.createElement("div");
		suprocesssettingform.appendChild(subprocessListGroupDiv);
		subprocessListGroupDiv.className = "form-group";

		var suprocessLabel = document.createElement("label");
		subprocessListGroupDiv.appendChild(suprocessLabel);
		suprocessLabel.setAttribute("for", "subprocesslist" + this.options.id);
		suprocessLabel.className = "col-sm-2 control-label";
		suprocessLabel.innerHTML = "选择子应用";

		var subprocessListDiv = document.createElement("div");
		subprocessListGroupDiv.appendChild(subprocessListDiv);
		subprocessListDiv.className = "col-sm-10";

		var group = document.createElement("DIV");
		subprocessListDiv.appendChild(group);
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");

		this.subprocessInput = document.createElement("INPUT");
		group.appendChild(this.subprocessInput);
		this.subprocessInput.className = "form-control";
		this.subprocessInput.id = "subprocesslist" + this.options.id;
		this.subprocessInput.setAttribute("placeholder", "选择并设置子应用服务....");
		this.subprocessInput.readOnly = true;

		// open application service market
		var searchSpan = document.createElement("span");
		group.appendChild(searchSpan);
		searchSpan.className = "input-group-btn";

		this.searchBtn = this.createTool(searchSpan, "searchProcBtn"
				+ this.options.id, "打开应用商店查找可用的SaaS应用服务", "btn btn-primary", "i",
				"fa fa-search fa-lg");

		// subprocess input parameters and output parameters setting.
		var inputoutputGroupDiv = document.createElement("div");
		inputoutputGroupDiv.className = "form-group";
		suprocesssettingform.appendChild(inputoutputGroupDiv);

		// inputs
		var suprocessInputDiv = document.createElement("div");
		suprocessInputDiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		inputoutputGroupDiv.appendChild(suprocessInputDiv);

		this.suprocessInputPanel = document.createElement("div");
		this.suprocessInputPanel.className = "panel panel-default";
		this.suprocessInputPanel.id = "subprocessInputDiv" + this.options.id;
		this.suprocessInputPanel.addEventListener("click", this, false);
		suprocessInputDiv.appendChild(this.suprocessInputPanel);

		var suprocessInputHeading = document.createElement("div");
		suprocessInputHeading.className = "panel-heading";
		suprocessInputHeading.innerHTML = "当前主应用传入数据到子应用";
		suprocessInputHeading.id = "subprocessInputHeading" + this.options.id;
		suprocessInputHeading.addEventListener("click", this, false);
		this.suprocessInputPanel.appendChild(suprocessInputHeading);

		var suprocessInputListDiv = document.createElement("div");
		suprocessInputListDiv.className = "table-responsive";
		this.suprocessInputPanel.appendChild(suprocessInputListDiv);

		this.subprocessInputTable = document.createElement("table");
		this.subprocessInputTable.className = "table table-striped table-hover";
		suprocessInputListDiv.appendChild(this.subprocessInputTable);

		var tr1 = this.subprocessInputTable.insertRow(0);
		this.newTh(tr1, "子应用的过程变量");
		this.newTh(tr1, "类型");
		this.newTh(tr1, "赋值");

		// outputs
		var suprocessOutputDiv = document.createElement("div");
		suprocessOutputDiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		inputoutputGroupDiv.appendChild(suprocessOutputDiv);

		this.suprocessOutputPanel = document.createElement("div");
		this.suprocessOutputPanel.className = "panel panel-default";
		this.suprocessOutputPanel.id = "subprocessOutputDiv" + this.options.id;
		this.suprocessOutputPanel.addEventListener("click", this, false);
		suprocessOutputDiv.appendChild(this.suprocessOutputPanel);

		var suprocessOutputHeading = document.createElement("div");
		suprocessOutputHeading.className = "panel-heading";
		suprocessOutputHeading.innerHTML = "子应用返回数据到当前主应用";
		suprocessOutputHeading.id = "subprocessOutputHeading" + this.options.id;
		suprocessOutputHeading.addEventListener("click", this, false);
		this.suprocessOutputPanel.appendChild(suprocessOutputHeading);

		var suprocessOutputListDiv = document.createElement("div");
		suprocessOutputListDiv.className = "table-responsive";
		this.suprocessOutputPanel.appendChild(suprocessOutputListDiv);

		this.subprocessOutputTable = document.createElement("table");
		this.subprocessOutputTable.className = "table table-striped table-hover";
		suprocessOutputListDiv.appendChild(this.subprocessOutputTable);

		var tr2 = this.subprocessOutputTable.insertRow(0);
		tr2.addEventListener("click", this, false);
		this.newTh(tr2, "当前主应用的过程变量");
		this.newTh(tr2, "类型");
		this.newTh(tr2, "返回值赋值");

		this.setTask(this.entity);
	};

	SubprocessEditPanel.prototype.createTool = function(group, id, title,
			style, fonttag, fontclass) {
		var button = document.createElement("button");
		group.appendChild(button);
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		var icon = document.createElement(fonttag);
		button.appendChild(icon);
		icon.addEventListener('click', this, false);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		return button;
	};

	SubprocessEditPanel.prototype.setTask = function(entity) {
		if (entity.synchronised) {
			this.radioOption.checked = true;
		} else {
			this.radioOption1.checked = true;
		}
		if (entity.subprocessId != null && entity.subprocessId.trim() != "") {
			this.subprocessInput.value = entity.subprocessName;
			this.loadSubprocess(entity.subprocessId);
			this.procstoredialog.setProcess(entity.subprocessId, entity.owner);
		}
		if (this.owner instanceof ReleasedWfProcess) {
			this.searchBtn.disabled = true;
			this.radioOption.disabled = true;
			this.radioOption1.disabled = true;
		}
	};

	SubprocessEditPanel.prototype.loadSubprocess = function(subprocessId) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(20, this.entity.owner), {
			id : subprocessId,
		}).complete(function(data) {
			if (data.responseJSON != null) {
				that.loading(data.responseJSON);
			}
			$("#progressbar").hide();
		});
	};

	SubprocessEditPanel.prototype.loading = function(json) {
		this.curSubprocess = new ReleasedWfProcess();
		this.curSubprocess.parseFromJSON(json);
		this.subprocessInput.value = this.curSubprocess.name;
		this.parseForSubprocess(this.curSubprocess);
		this.loadingInputOutputs();
	};

	SubprocessEditPanel.prototype.setProcSearchResult = function(subprocessId,
			subprocessName) {
		map[this.owner.id].stack.execute(new PMSubprocessChangeCmd(this.entity,
				subprocessId, subprocessName, this.owner));
	};

	SubprocessEditPanel.prototype.parseForSubprocess = function(process) {
		if (process != null) {
			// parsing... (important !)
			for (var i = 0; i < this.entity.subprocessInputs.length; i++) {
				this.entity.subprocessInputs[i].parseVariable(process);
			}
			for (var i = 0; i < this.entity.subprocessOutputs.length; i++) {
				if (this.entity.subprocessOutputs[i].value != null) {
					this.entity.subprocessOutputs[i].parseValue(process);
				}
			}
		}
	};

	SubprocessEditPanel.prototype.loadingInputOutputs = function() {
		// show ...
		this.clearSubInputTable();
		for (var i = 0; i < this.entity.subprocessInputs.length; i++) {
			var row0 = this.subprocessInputTable.insertRow(-1);
			var a = this.entity.subprocessInputs[i];
			row0.id = a.id;
			row0.addEventListener("click", this, false);
			row0.addEventListener("dblclick", this, false);
			var nm = Utils.parse(a.variable.name);
			if (a.arrayIndex != -1 && a.arrayIndex != "") {
				nm += "[" + a.arrayIndex + "]";
			}
			this.newTd(row0, 0, nm);
			this.newTd(row0, 1, Utils.toDataType(a.variable.datatype));
			if (a.value != null) {
				this.newTd(row0, 2, a.value.toString());
			} else {
				this.newTd(row0, 2, "&nbsp;");
			}
		}
		this.clearSubOutputTable();
		for (var i = 0; i < this.entity.subprocessOutputs.length; i++) {
			var row0 = this.subprocessOutputTable.insertRow(-1);
			var b = this.entity.subprocessOutputs[i];
			row0.id = b.id;
			row0.addEventListener("click", this, false);
			row0.addEventListener("dblclick", this, false);
			var nm = Utils.parse(b.variable.name);
			if (b.arrayIndex != -1 && b.arrayIndex != "") {
				nm += "[" + b.arrayIndex + "]";
			}
			this.newTd(row0, 0, nm);
			this.newTd(row0, 1, Utils.toDataType(b.variable.datatype));
			if (b.value != null) {
				this.newTd(row0, 2, b.value.toString());
			} else {
				this.newTd(row0, 2, "&nbsp;");
			}
		}
	};

	SubprocessEditPanel.prototype.newTh = function(row, content) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	SubprocessEditPanel.prototype.newTd = function(row, number, content) {
		var cell1 = row.insertCell(number);
		cell1.setAttribute("nowrap", "true");
		cell1.innerHTML = content;
	};

	SubprocessEditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	SubprocessEditPanel.prototype.setPanelStatus = function(syn) {
		if (syn) {
			// this.entity.synchronised = true;
			this.suprocessInputPanel.className = "panel panel-default";
			this.suprocessOutputPanel.className = "panel panel-default";
			this.options.parent.disabledAddButton();
			this.options.parent.disabledModifyButton();
			this.options.parent.disabledRemoveButton();
			this.clearSelection(this.subprocessInputTable);
			this.clearSelection(this.subprocessOutputTable);
		} else {
			// this.entity.synchronised = false;
			this.suprocessInputPanel.className = "panel panel-default";
			this.suprocessOutputPanel.className = "panel panel-default";
			this.options.parent.disabledAddButton();
			this.options.parent.disabledModifyButton();
			this.options.parent.disabledRemoveButton();
			this.clearSelection(this.subprocessInputTable);
			this.clearSelection(this.subprocessOutputTable);
		}
	};

	SubprocessEditPanel.prototype.doClick = function(evt) {
		evt.preventDefault();
		var element = evt.target;
		if (element.id == "synchronizationOptions1" + this.options.id) {
			// this.setPanelStatus(true);
			map[this.owner.id].stack.execute(new PMSynchronizationChangeCmd(
					this.entity, this, true, this.owner));
			return;
		} else if (element.id == "synchronizationOptions2" + this.options.id) {
			// this.setPanelStatus(false);
			map[this.owner.id].stack.execute(new PMSynchronizationChangeCmd(
					this.entity, this, false, this.owner));
			return;
		} else if (element == this.searchBtn
				|| (element.tagName == "I" && element.id == "searchProcBtn"
						+ this.options.id)) {
			this.procstoredialog.show();
			return;
		}
		if (this.owner instanceof WfProcess) {
			if (this.entity.synchronised) {
				if (element.tagName == "DIV") {
					if (element.id == ("subprocessInputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.suprocessOutputPanel.className = "panel panel-default";
					} else if (element.id == ("subprocessInputHeading" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.suprocessOutputPanel.className = "panel panel-default";
					} else if (element.id == ("subprocessOutputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-default";
						this.suprocessOutputPanel.className = "panel panel-primary";
					} else if (element.id == ("subprocessOutputHeading" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-default";
						this.suprocessOutputPanel.className = "panel panel-primary";
					}
					this.options.parent.enableAddButton();
				} else if (element.tagName == "TH") {
					// panel div
					var panelDiv = element.parentElement.parentElement.parentElement.parentElement.parentElement;
					if (panelDiv.id == ("subprocessInputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.suprocessOutputPanel.className = "panel panel-default";
					} else if (panelDiv.id == ("subprocessOutputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-default";
						this.suprocessOutputPanel.className = "panel panel-primary";
					}
					this.options.parent.enableAddButton();
				} else if (element.tagName == "TD") {
					// panel div
					var panelDiv = element.parentElement.parentElement.parentElement.parentElement.parentElement;
					if (panelDiv.id == ("subprocessInputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.suprocessOutputPanel.className = "panel panel-default";
					} else if (panelDiv.id == ("subprocessOutputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-default";
						this.suprocessOutputPanel.className = "panel panel-primary";
					}
					this.options.parent.enableAddButton();
					this.options.parent.enableModifyButton();
					this.options.parent.enableRemoveButton();
					this.clearSelection(element.parentElement.parentElement);
					this.selectRow(element.parentElement);
				} else {
					this.options.parent.disabledAddButton();
					this.options.parent.disabledModifyButton();
					this.options.parent.disabledRemoveButton();
					this.clearSelection(this.subprocessInputTable);
					this.clearSelection(this.subprocessOutputTable);
				}
			} else {
				if (element.tagName == "DIV") {
					if (element.id == ("subprocessInputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.options.parent.enableAddButton();
					} else if (element.id == ("subprocessInputHeading" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.options.parent.enableAddButton();
					} else if (element.id == ("subprocessOutputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.options.parent.disabledAddButton();
					} else if (element.id == ("subprocessOutputHeading" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.options.parent.disabledAddButton();
					}
				} else if (element.tagName == "TH") {
					var panelDiv = element.parentElement.parentElement.parentElement.parentElement.parentElement;
					if (panelDiv.id == ("subprocessInputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.suprocessOutputPanel.className = "panel panel-default";
						this.options.parent.enableAddButton();
					} else if (panelDiv.id == ("subprocessOutputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.suprocessOutputPanel.className = "panel panel-default";
						this.options.parent.disabledAddButton();
						this.options.parent.disabledModifyButton();
						this.options.parent.disabledRemoveButton();
					}
				} else if (element.tagName == "TD") {
					var panelDiv = element.parentElement.parentElement.parentElement.parentElement.parentElement;
					if (panelDiv.id == ("subprocessInputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.suprocessOutputPanel.className = "panel panel-default";
						this.options.parent.enableAddButton();
						this.options.parent.enableModifyButton();
						this.options.parent.enableRemoveButton();
						this
								.clearSelection(element.parentElement.parentElement);
						this.selectRow(element.parentElement);
					} else if (panelDiv.id == ("subprocessOutputDiv" + this.options.id)) {
						this.suprocessInputPanel.className = "panel panel-primary";
						this.suprocessOutputPanel.className = "panel panel-default";
						this.options.parent.disabledAddButton();
						this.options.parent.disabledModifyButton();
						this.options.parent.disabledRemoveButton();
					}
				}
			}
		}
	};

	SubprocessEditPanel.prototype.clearSubInputTable = function() {
		while (this.subprocessInputTable.rows.length > 1) {
			this.subprocessInputTable.deleteRow(1);
		}
	};

	SubprocessEditPanel.prototype.clearSubOutputTable = function() {
		while (this.subprocessOutputTable.rows.length > 1) {
			this.subprocessOutputTable.deleteRow(1);
		}
	};

	SubprocessEditPanel.prototype.addRow = function(evt) {
		if (this.suprocessInputPanel.className == "panel panel-primary") {
			var assignment = new Assignment();
			assignment.parent = this.entity.id;
			assignment.currOwner = this.entity.currOwner;
			assignment.owner = this.entity.owner;
			this.assignditdialog.newVar = true;
			this.assignditdialog.initInputDialog(assignment, this.entity,
					this.owner, this.curSubprocess);
			this.assignditdialog.show();
		} else if (this.suprocessOutputPanel.className == "panel panel-primary") {
			var assignment = new Assignment();
			assignment.parent = this.entity.id;
			assignment.currOwner = this.entity.currOwner;
			assignment.owner = this.entity.owner;
			this.assignditdialog.newVar = true;
			this.assignditdialog.initOutputDialog(assignment, this.entity,
					this.owner, this.curSubprocess);
			this.assignditdialog.show();
		}
	};

	SubprocessEditPanel.prototype.modifyRow = function(evt) {
		if (this.suprocessInputPanel.className == "panel panel-primary") {
			if (this.subprocessInputTable.rows.length > 1) {
				for (var i = 1; i < this.subprocessInputTable.rows.length; i++) {
					if (this.subprocessInputTable.rows[i].id != "-1"
							&& this
									.rowSelected(this.subprocessInputTable.rows[i])) {
						this.assignditdialog.newVar = false;
						this.assignditdialog
								.initInputDialog(
										this.entity
												.getSubInputById(this.subprocessInputTable.rows[i].id),
										this.entity, this.owner,
										this.curSubprocess);
						this.assignditdialog.show();
					}
				}
			}
		} else if (this.suprocessOutputPanel.className == "panel panel-primary") {
			if (this.subprocessOutputTable.rows.length > 1) {
				for (var i = 1; i < this.subprocessOutputTable.rows.length; i++) {
					if (this.subprocessOutputTable.rows[i].id != "-1"
							&& this
									.rowSelected(this.subprocessOutputTable.rows[i])) {
						this.assignditdialog.newVar = false;
						this.assignditdialog
								.initOutputDialog(
										this.entity
												.getSubOutputById(this.subprocessOutputTable.rows[i].id),
										this.entity, this.owner,
										this.curSubprocess);
						this.assignditdialog.show();
					}
				}
			}
		}
	};

	SubprocessEditPanel.prototype.doDblClick = function(evt) {
		if (this.owner instanceof WfProcess) {
			if (evt.target.tagName == "TD") {
				this.clearSelection(evt.target.parentElement.parentElement);// table
				this.selectRow(evt.target.parentElement);// tr
				var id = evt.target.parentElement.id;
				if (id != "-1") {
					if (this.entity.synchronised) {
						this.options.parent.enableModifyButton();
						this.options.parent.enableRemoveButton();
						if (this.suprocessInputPanel.className == "panel panel-primary") {
							this.assignditdialog.newVar = false;
							this.assignditdialog.initInputDialog(this.entity
									.getSubInputById(id), this.entity,
									this.owner, this.curSubprocess);
							this.assignditdialog.show();
						} else if (this.suprocessOutputPanel.className == "panel panel-primary") {
							this.assignditdialog.newVar = false;
							this.assignditdialog.initOutputDialog(this.entity
									.getSubOutputById(id), this.entity,
									this.owner, this.curSubprocess);
							this.assignditdialog.show();
						}
					} else {
						if (evt.target.parentElement.parentElement == this.subprocessInputTable) {
							this.options.parent.enableAddButton();
							this.options.parent.enableModifyButton();
							this.options.parent.enableRemoveButton();
							this.assignditdialog.newVar = false;
							this.assignditdialog.initInputDialog(this.entity
									.getSubInputById(id), this.entity,
									this.owner, this.curSubprocess);
							this.assignditdialog.show();
						} else {
							this.options.parent.disabledAddButton();
							this.options.parent.disabledModifyButton();
							this.options.parent.disabledRemoveButton();
						}
					}
				}
			}
		}
	};

	SubprocessEditPanel.prototype.removeRow = function(evt) {
		if (this.suprocessInputPanel.className == "panel panel-primary") {
			if (this.subprocessInputTable.rows.length > 1) {
				for (var i = 0; i < this.subprocessInputTable.rows.length; i++) {
					if (this.subprocessInputTable.rows[i].id != "-1"
							&& this
									.rowSelected(this.subprocessInputTable.rows[i])) {
						map[this.entity.currOwner].stack
								.execute(new PMRemoveAssignmentCmd(
										this.subprocessInputTable.rows[i].id,
										this.entity, 1, this.owner));
						break;
					}
				}
			}
		} else if (this.suprocessOutputPanel.className == "panel panel-primary") {
			if (this.subprocessOutputTable.rows.length > 1) {
				for (var i = 0; i < this.subprocessOutputTable.rows.length; i++) {
					if (this.subprocessOutputTable.rows[i].id != "-1"
							&& this
									.rowSelected(this.subprocessOutputTable.rows[i])) {
						map[this.entity.currOwner].stack
								.execute(new PMRemoveAssignmentCmd(
										this.subprocessOutputTable.rows[i].id,
										this.entity, 2, this.owner));
						break;
					}
				}
			}
		}
		this.options.parent.disabledModifyButton();
		this.options.parent.disabledRemoveButton();
	};

	SubprocessEditPanel.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (var i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
	};

	SubprocessEditPanel.prototype.selectRow = function(row) {
		row.style.background = "#d1d1e0";
	};

	SubprocessEditPanel.prototype.rowSelected = function(row) {
		return row.style.background == "rgb(209, 209, 224)";
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$
						.data(this, pluginName, new SubprocessEditPanel(this,
								options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);