/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "assignmentEditPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var AssignmentEditPanel = function(element, options) {
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

	AssignmentEditPanel.prototype.init = function(options) {
		// rule edit dialog;
		var plugin2 = $(this.topparent).assignmentEditDialog({
			id : "asgn002",
			title : "轩琦科技 - 赋值编辑器",
			parent : this,
			topparent : this.topparent,
		});
		this.assignditdialog = plugin2.data("assignmentEditDialog");

		this.loadPane(options.entity, options.currowner);
	};

	AssignmentEditPanel.prototype.loadPane = function(entity, owner) {
		this.owner = owner;
		this.entity = entity;
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var assignmentsheet = document.createElement("table");
		assignmentsheet.id = "assignmentsheet" + this.options.id;
		assignmentsheet.className = "table table-striped table-hover";

		modalframe.appendChild(assignmentsheet);
		var tr = assignmentsheet.insertRow(0);
		this.newTh(tr, "被赋值变量");
		this.newTh(tr, "数据类型");
		this.newTh(tr, "赋值（表达式）");
		var count = 0;
		for (i = 0; i < this.entity.assignments.length; i++) {
			var row = assignmentsheet.insertRow(-1);
			row.id = this.entity.assignments[i].id;
			if (owner instanceof WfProcess) {
				row.addEventListener("click", this, false);
				row.addEventListener("dblclick", this, false);
			}
			if (this.entity.assignments[i].variable != null) {
				var name = Utils
						.parse(this.entity.assignments[i].variable.name);
				var type = Utils
						.toDataType(this.entity.assignments[i].variable.datatype);
				if (this.entity.assignments[i].arrayIndex != -1 && 
						this.entity.assignments[i].arrayIndex != "") {
					this.newTd(row, 0, name + "["
							+ this.entity.assignments[i].arrayIndex + "]");
				} else {
					this.newTd(row, 0, name);
				}
				this.newTd(row, 1, type);
			} else {
				this.newTd(row, 0, "&nbsp;");
				this.newTd(row, 1, "&nbsp;");
			}
			if (this.entity.assignments[i].value != null) {
				this.newTd(row, 2, this.entity.assignments[i].value.toString());
			} else {
				this.newTd(row, 2, "&nbsp;");
			}
			count++;
		}
		if (count < 5) {
			for (i = 0; i < 5 - count; i++) {
				var row = assignmentsheet.insertRow(-1);
				row.id = "-1";
				this.newTd(row, 0, "&nbsp;");
				this.newTd(row, 1, "&nbsp;");
				this.newTd(row, 2, "&nbsp;");
			}
		}

		this.options.parent.disabledModifyButton();
		this.options.parent.disabledRemoveButton();

	};

	AssignmentEditPanel.prototype.newTh = function(row, content) {
		var th = document.createElement('th');
		th.innerHTML = content;
		th.setAttribute("nowrap", "true");
		row.appendChild(th);
	};

	AssignmentEditPanel.prototype.newTd = function(row, number, content) {
		var cell1 = row.insertCell(number);
		cell1.setAttribute("nowrap", "true");
		cell1.innerHTML = content;
	};

	AssignmentEditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	AssignmentEditPanel.prototype.doClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.options.parent.enableModifyButton();
			this.options.parent.enableRemoveButton();
			var table = evt.target.parentElement.parentElement;
			this.clearSelection(table);
			this.selectRow(evt.target.parentElement);
		}
	};

	AssignmentEditPanel.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.options.parent.enableModifyButton();
			this.options.parent.enableRemoveButton();
			this.clearSelection(evt.target.parentElement.parentElement);
			this.selectRow(evt.target.parentElement);
			var id = evt.target.parentElement.id;
			if (id != "-1") {
				var assignment = this.entity.getAssignmentById(id);
				// curRow.rowIndex
				this.assignditdialog.initDialog(assignment, this.entity,
						this.owner);
				this.assignditdialog.show();
			}
		}
	};

	AssignmentEditPanel.prototype.addRow = function(evt) {
		var assignment = new Assignment();
		assignment.owner = this.entity.owner;
		this.assignditdialog.newVar = true;
		this.assignditdialog.initDialog(assignment, this.entity, this.owner);
		this.assignditdialog.show();
	};

	AssignmentEditPanel.prototype.modifyRow = function(evt) {
		var table = document
				.getElementById("assignmentsheet" + this.options.id);
		if (table.rows.length > 0) {
			for (i = 0; i < table.rows.length; i++) {
				if (table.rows[i].id != "-1" && this.rowSelected(table.rows[i])) {
					this.assignditdialog.newVar = false;
					this.assignditdialog.initDialog(this.owner
							.seekChildByID(table.rows[i].id), this.entity,
							this.owner);
					this.assignditdialog.show();
				}
			}
		}
	};

	AssignmentEditPanel.prototype.removeRow = function(evt) {
		var table = document
				.getElementById("assignmentsheet" + this.options.id);
		if (table.rows.length > 1) {
			for (i = 0; i < table.rows.length; i++) {
				if (table.rows[i].id != "-1" && this.rowSelected(table.rows[i])) {
					map[this.owner.id].stack.execute(new PMRemoveAssignmentCmd(
							table.rows[i].id, this.entity, 0, this.owner));
					break;
				}
			}
		}
		if (this.entity.assignments.length < 5) {
			for (i = 0; i < (5 - this.entity.assignments.length); i++) {
				var row = table.insertRow(-1);
				row.id = "-1";
				this.newTd(row, 0, "&nbsp;");
				this.newTd(row, 1, "&nbsp;");
				this.newTd(row, 2, "&nbsp;");
			}
		}
		this.options.parent.disabledModifyButton();
		this.options.parent.disabledRemoveButton();
	};

	AssignmentEditPanel.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
	};

	AssignmentEditPanel.prototype.selectRow = function(row) {
		row.style.background = "#d1d1e0";
	};

	AssignmentEditPanel.prototype.rowSelected = function(row) {
		return row.style.background == "rgb(209, 209, 224)";
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$
						.data(this, pluginName, new AssignmentEditPanel(this,
								options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);