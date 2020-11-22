/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "assignmentEditDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		topparent : "",
	};

	var AssignmentEditDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.rule;
		this.owner;
		this.modalframe;
		this.topparent = options.topparent;
		this.newVar = false;
		this.init(options);
	};

	AssignmentEditDialog.prototype.init = function(options) {
		this.topparent = options.topparent;
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);
		this.modalframe.className = "modal fade";
		this.modalframe.id = "ruleEditorModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "ruleEditModalLabel");

		var modaldialogDIV = document.createElement("div");
		this.modalframe.appendChild(modaldialogDIV);
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "680px";

		var dialogContentDIV = document.createElement("div");
		modaldialogDIV.appendChild(dialogContentDIV);
		dialogContentDIV.className = "modal-content";

		// dialog heading
		var dialogHeaderDIV = document.createElement("div");
		dialogContentDIV.appendChild(dialogHeaderDIV);
		dialogHeaderDIV.className = "modal-header";

		var closeButton = document.createElement("button");
		dialogHeaderDIV.appendChild(closeButton);
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");

		var closeSpan = document.createElement("span");
		closeButton.appendChild(closeSpan);
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";

		var titleH4 = document.createElement("h4");
		dialogHeaderDIV.appendChild(titleH4);
		titleH4.className = "modal-title";
		titleH4.id = "ruleEditModalLabel" + options.id;

		var infoIcon = document.createElement("i");
		titleH4.appendChild(infoIcon);
		infoIcon.className = "fa fa-pencil-square fa-lg";
		infoIcon.style.color = "green";

		var info = document.createElement("label");
		titleH4.appendChild(info);
		info.innerHTML = options.title;

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);

		var dialogBodyDIV = document.createElement("div");
		dialogForm.appendChild(dialogBodyDIV);
		dialogBodyDIV.className = "modal-body";

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);
		dialogBodyFrameDIV.className = "container-fluid";

		var bodyRow = document.createElement("div");
		dialogBodyFrameDIV.appendChild(bodyRow);
		bodyRow.className = "row";

		var variableNameLabel = document.createElement("label");
		bodyRow.appendChild(variableNameLabel);
		variableNameLabel.innerHTML = "被赋值变量";

		var row1 = document.createElement("div");
		bodyRow.appendChild(row1);
		row1.className = "row";

		var varSelectDIV = document.createElement("DIV");
		row1.appendChild(varSelectDIV);
		varSelectDIV.className = "form-group col-lg-8 col-md-8 col-sm-12 col-xs-12";

		this.variableSelect = document.createElement("select");
		varSelectDIV.appendChild(this.variableSelect);
		this.variableSelect.className = "form-control";
		this.variableSelect.addEventListener('change', this, false);

		var noSelectDIV = document.createElement("DIV");
		row1.appendChild(noSelectDIV);
		noSelectDIV.className = "form-group col-lg-4 col-md-4 col-sm-12 col-xs-12";

		this.noSelect = document.createElement("select");
		noSelectDIV.appendChild(this.noSelect);
		this.noSelect.className = "form-control";
		this.noSelect.disabled = true;

		var bodyRow2 = document.createElement("div");
		dialogBodyFrameDIV.appendChild(bodyRow2);
		bodyRow2.className = "row";

		// add form panel here...
		var p = $(bodyRow2).exprEditPanel({
			id : options.id,
			title : "赋值表达式",
			rule : "",
			owner : "",
			topparent : this.modalframe,
		});

		this.ruleEditPanel = p.data("exprEditPanel");

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogForm.appendChild(dialogFooterDIV);
		dialogFooterDIV.className = "modal-footer";

		var saveButton = document.createElement("button");
		dialogFooterDIV.appendChild(saveButton);
		saveButton.type = "button";
		saveButton.id = "AssignOK" + options.id;
		saveButton.name = "AssignOK" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.innerHTML = "确定";
		saveButton.addEventListener("click", this, false);

		var cancelButton = document.createElement("button");
		dialogFooterDIV.appendChild(cancelButton);
		cancelButton.type = "button";
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");

	};

	AssignmentEditDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	AssignmentEditDialog.prototype.doChange = function(evt) {
		if (evt.target == this.variableSelect) {
			$(this.noSelect).find('option').remove();
			var a = null;
			if (this.assignmentType == 1) {
				a = this.subprocess.seekChildByID(this.variableSelect.value);
			} else if (this.assignmentType == 0 || this.assignmentType == 2) {
				a = this.mainprocess.seekChildByID(this.variableSelect.value);
			}
			if (a instanceof ArrayDataVariable) {
				this.noSelect.disabled = false;
				this.addOptions(this.noSelect, "", "-1", 0);
				if (a.values.length > 0) {
					for (var i = 1; i <= a.values.length; i++) {
						this.addOptions(this.noSelect, (i - 1) + "", (i - 1)
								+ "", i);
					}
				}
			} else {
				this.noSelect.disabled = true;
			}
		} else if (evt.target == this.noSelect) {
			this.entity.arrayIndex = this.noSelect.value;
		}
	};

	AssignmentEditDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true,
		});
	};

	AssignmentEditDialog.prototype.doClick = function(evt) {
		if (evt.target.name == "AssignOK" + this.options.id) {
			if (this.newVar) {
				this.createNewAssignment(this.assignmentType);
			} else {
				// this.entity is an assignment.
				if (this.assignmentType == 1) {
					this.entity.setVariable(this.subprocess
							.seekChildByID(this.variableSelect.value));
					this.entity.arrayIndex = this.noSelect.value;
					this.entity.value = this.ruleEditPanel.getRule();
					this.modcmd.update(this.entity);
					map[this.mainprocess.id].stack.execute(this.modcmd);
				} else if (this.assignmentType == 0 || this.assignmentType == 2) {
					this.entity.setVariable(this.mainprocess
							.seekChildByID(this.variableSelect.value));
					this.entity.arrayIndex = this.noSelect.value;
					this.entity.value = this.ruleEditPanel.getRule();
					this.modcmd.update(this.entity);
					map[this.mainprocess.id].stack.execute(this.modcmd);
				} else if (this.assignmentType == 3) {// system task updating
					map[this.owner.id].stack
							.execute(new PMParameterInitialValueChangedCmd(
									this.entity, this.parameterName,
									this.ruleEditPanel.getRule(), this.owner,
									this.paratype));
				} else if (this.assignmentType == 4) {// wait task updating
					map[this.owner.id].stack
							.execute(new PMWaitDelayRuleEditCmd(this.entity,
									this.ruleEditPanel.getRule(),
									this.options.parent, this.owner));
				}
				this.hide();
			}
		}
	};

	AssignmentEditDialog.prototype.createNewAssignment = function(
			assignmentType) {
		var that = this;
		$.getJSON(service.api(2)).complete(
				function(data) {
					// that.entity is an assignment.
					that.entity.id = data.responseText;
					if (assignmentType == 1) {
						that.entity.setVariable(that.subprocess
								.seekChildByID(that.variableSelect.value));
					} else if (assignmentType == 0 || assignmentType == 2) {
						that.entity.setVariable(that.mainprocess
								.seekChildByID(that.variableSelect.value));
					}
					that.entity.type = assignmentType;
					that.entity.arrayIndex = that.noSelect.value;
					that.entity.value = that.ruleEditPanel.getRule();
					map[that.mainprocess.id].stack
							.execute(new PMCreateAssignmentCmd(that.parent,
									that.entity, assignmentType,
									that.mainprocess));
					that.hide();
				});
	};

	AssignmentEditDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	/**
	 * access 1: Assignment edit dialog initializing
	 * 
	 * @param assignment,
	 *            it is assignment
	 * @param parent,
	 *            it is Assign task.
	 * @param owner,
	 *            it is current process of the assign task.
	 */
	AssignmentEditDialog.prototype.initDialog = function(assignment, parent,
			owner) {
		this.assignmentType = 0;
		if (!this.newVar) {
			this.modcmd = new PMModifyAssignmentCmd(assignment, parent,
					this.assignmentType, owner, null);
		}
		this.entity = assignment; // assignment
		this.parent = parent; // assign task
		this.mainprocess = owner; // process object
		$(this.variableSelect).find('option').remove();
		for (var i = 0; i < owner.children.length; i++) {
			if (owner.children[i] instanceof DataVariable) {
				this.addOptions(this.variableSelect, Utils
						.parse(owner.children[i].name), owner.children[i].id,
						owner.children[i].orderNumber);
			}
		}
		if (assignment.variable != null && assignment.variable.id != null) {
			this.variableSelect.value = assignment.variable.id;
		}
		var r = assignment.value;
		if (r != null) {
			this.rule = r.clone(this.mainprocess); // clone as a new rule
		} else {
			this.rule = new Expression(); // rule
		}
		// set element index of array;
		$(this.noSelect).find('option').remove();
		if (assignment.variable instanceof ArrayDataVariable) {
			this.noSelect.disabled = false;
			this.addOptions(this.noSelect, "", "-1", 0);
			if (assignment.variable.values.length > 0) {
				for (var i = 1; i <= assignment.variable.values.length; i++) {
					this.addOptions(this.noSelect, (i - 1) + "", (i - 1) + "",
							i);
				}
			}
			this.noSelect.value = assignment.arrayIndex;
		} else {
			this.noSelect.disabled = true;
			this.noSelect.selectedIndex = -1;
		}
		// set evaluation value
		this.ruleEditPanel.setGeneralRule(this.rule, owner);
	};

	AssignmentEditDialog.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	/**
	 * access 2: SubprocessInput edit dialog initializing
	 * 
	 * @param assignment,
	 *            it is assignment
	 * @param parent,
	 *            it is Subprocess point task.
	 * @param mainprocess,
	 *            it is the process of current subprocess-point-task.
	 * @param subprocess,
	 *            it is the subprocess which needs to be accessed.
	 * 
	 */
	AssignmentEditDialog.prototype.initInputDialog = function(assignment,
			parent, mainprocess, subprocess) {
		this.assignmentType = 1;
		if (!this.newVar) {
			this.modcmd = new PMModifyAssignmentCmd(assignment, parent,
					this.assignmentType, mainprocess, subprocess);
		}
		this.entity = assignment; // assignment
		this.parent = parent; // subprocess point
		this.mainprocess = mainprocess;
		this.subprocess = subprocess; // subprocess
		$(this.variableSelect).find('option').remove();
		var list = subprocess.fetchWritableDataVars();
		for (var i = 0; i < list.length; i++) {
			if (list[i] instanceof DataVariable) {
				this.addOptions(this.variableSelect, Utils.parse(list[i].name),
						list[i].id, list[i].orderNumber);
			}
		}
		if (assignment.variable != null && assignment.variable.id != null) {
			this.variableSelect.value = assignment.variable.id;
		}
		var r = assignment.value;
		if (r != null) {
			this.rule = r.clone(this.mainprocess); // clone as a new rule
		} else {
			this.rule = new Expression(); // rule
		}
		// set element index of array;
		$(this.noSelect).find('option').remove();
		if (assignment.variable instanceof ArrayDataVariable) {
			this.noSelect.disabled = false;
			this.addOptions(this.noSelect, "", "-1", 0);
			if (assignment.variable.values.length > 0) {
				for (var i = 1; i <= assignment.variable.values.length; i++) {
					this.addOptions(this.noSelect, (i - 1) + "", (i - 1) + "",
							i);
				}
			}
			this.noSelect.value = assignment.arrayIndex;
		} else {
			this.noSelect.disabled = true;
			this.noSelect.selectedIndex = -1;
		}
		this.ruleEditPanel.setSubprocessRule(this.rule, mainprocess,
				this.assignmentType);
	};

	/**
	 * access 3: SubprocessOutput edit dialog initializing
	 * 
	 * @param assignment,
	 *            it is assignment
	 * @param parent,
	 *            it is Assign task or Subprocess point task.
	 * @param mainprocess,
	 *            it is the process of current subprocess-point-task.
	 * @param subprocess,
	 *            it is the subprocess which needs to be accessed.
	 */
	AssignmentEditDialog.prototype.initOutputDialog = function(assignment,
			parent, mainprocess, subprocess) {
		this.assignmentType = 2;
		if (!this.newVar) {
			this.modcmd = new PMModifyAssignmentCmd(assignment, parent,
					this.assignmentType, mainprocess, subprocess);
		}
		this.entity = assignment; // assignment
		this.parent = parent; // subprocess point
		this.mainprocess = mainprocess;
		this.subprocess = subprocess; // subprocess
		$(this.variableSelect).find('option').remove();
		for (var i = 0; i < mainprocess.children.length; i++) {
			if (mainprocess.children[i] instanceof DataVariable) {
				this.addOptions(this.variableSelect, Utils
						.parse(mainprocess.children[i].name),
						mainprocess.children[i].id,
						mainprocess.children[i].orderNumber);
			}
		}
		if (assignment.variable != null && assignment.variable.id != null) {
			this.variableSelect.value = assignment.variable.id;
		}
		var r = assignment.value;
		if (r != null) {
			this.rule = r.clone(this.subprocess); // clone as a new rule
		} else {
			this.rule = new Expression(); // rule
		}
		$(this.noSelect).find('option').remove();
		if (assignment.variable instanceof ArrayDataVariable) {
			this.noSelect.disabled = false;
			this.addOptions(this.noSelect, "", "-1", 0);
			if (assignment.variable.values.length > 0) {
				for (var i = 1; i <= assignment.variable.values.length; i++) {
					this.addOptions(this.noSelect, (i - 1) + "", (i - 1) + "",
							i);
				}
			}
			this.noSelect.value = assignment.arrayIndex;
		} else {
			this.noSelect.disabled = true;
			this.noSelect.selectedIndex = -1;
		}
		this.ruleEditPanel.setSubprocessRule(this.rule, this.subprocess,
				this.assignmentType);
	};

	/**
	 * access 4: System task parameter edit dialog initializing
	 * 
	 * @param entity,
	 *            api object
	 * @param parameterName,
	 *            parameter name
	 * @param owner,
	 *            it is current process of the system task.
	 * @param paratype
	 */
	AssignmentEditDialog.prototype.setParameter = function(entity,
			parameterName, owner, paratype) {
		this.assignmentType = 3;
		this.entity = entity; // api object
		this.owner = owner; // process object
		this.paratype = paratype;
		this.parameterName = parameterName;
		if (entity instanceof SystemTask) {
			var para = null;
			if (this.paratype == 0) { // parameter
				para = entity.getPathParameterByName(parameterName);
			} else if (this.paratype == 1) { // extra parameter
				para = entity.getFormParameterByName(parameterName);
			} else if (this.paratype == 2) { // attachment

			}
			if (para != null && para.value != null && para.value != "") {
				this.rule = para.value.clone(owner); // clone as a new rule
			} else {
				this.rule = new Expression(); // rule
			}
		}
		this.ruleEditPanel.setParameterValue(this.parameterName, this.rule,
				this.owner);
	};

	/**
	 * access 5: Wait task time rule edit dialog initializing
	 * 
	 * @param entity,
	 *            wait task object
	 * @param owner,
	 *            it is current process of the wait task.
	 */
	AssignmentEditDialog.prototype.initTimeRuleDialog = function(entity, owner) {
		this.assignmentType = 4;
		this.entity = entity;
		if (entity instanceof WaitingTask) {
			var r = entity.timeRule;
			if (r != null) {
				this.rule = r.clone(owner); // clone as a new rule
			} else {
				this.rule = new Expression(); // rule
			}
		}
		this.owner = owner // process object
		this.ruleEditPanel.setGeneralRule(this.rule, this.owner);
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new AssignmentEditDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);