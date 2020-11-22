/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "processVariablesEditPanel";
	var defaults = {
		id : "",
		entity : "",
		parent : "",
		topparent : "",
		currowner : "",
	};

	var ProcessPropertyPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			entity : "",
			parent : "",
			topparent : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent = options.topparent;
		this.entity = options.entity; // process object
		this.init(options);
	};

	ProcessPropertyPanel.prototype.init = function(options) {
		// confirm message dialog plugin
		var p2 = $(this.element).confirmInfoDialog({
			id : "095",
			title : vendor + " - 提示",
			parent : this,
		});
		this.confirmInfoDialog = p2.data("confirmInfoDialog");
		// initial value dialog
		var plugin1 = $(this.topparent).dataVariableEditDialog({
			id : "var001",
			title : vendor + " - 数据变量编辑器",
			parent : this,
			topparent : this.topparent,
			owner : options.currowner,
		});
		this.initvaluedialog = plugin1.data("dataVariableEditDialog");
		// load sheet
		this.loadPane(options.entity);
	};

	ProcessPropertyPanel.prototype.loadPane = function(entity) {
		this.entity = entity;

		this.table = document.createElement("table");
		this.element.appendChild(this.table);

		this.table.id = "advancedpropertysheet";
		this.table.className = "table table-striped table-hover";

		var tr = this.table.insertRow(0);
		this.newTh(tr, "序号");
		this.newTh(tr, "变量名");
		this.newTh(tr, "类型");
		this.newTh(tr, "是否数组");
		this.newTh(tr, "初始值");
		this.newTh(tr, "被引用统计");
		this.newTh(tr, "备注");

		var count = 0;
		this.entity.sort();
		for (var i = 0; i < this.entity.children.length; i++) {
			if (this.entity.children[i].datatype != undefined) {
				var row = this.table.insertRow(-1);
				var child = this.entity.children[i];
				row.id = this.entity.children[i].id;
				if (this.entity instanceof WfProcess) {
					row.addEventListener("click", this, false);
					row.addEventListener("dblclick", this, false);
				}
				this.newTd(row, 0, child.orderNumber);
				this.newTd(row, 1, Utils.parse(child.name));
				this.newTd(row, 2, Utils.toDataType(child.datatype));
				if (child instanceof ArrayDataVariable) {
					this.newTd(row, 3, yesno[1]);
				} else if (child instanceof DataVariable) {
					this.newTd(row, 3, yesno[0]);
				}
				if (child instanceof ArrayDataVariable) {
					this.newTd(row, 4, child.toValueString());
				} else if (child instanceof DataVariable) {
					this.newTd(row, 4, child.toValueString());
				}
				this.newTd(row, 5, "&nbsp;");
				var s = Utils.parse(child.description);
				if (s != null && s.length > 10) {
					s = s.substring(0, 10) + "...";
				}
				this.newTd(row, 6, s);
				count++;
			}
		}
		if (count < 5) {
			for (var i = 0; i < 5 - count; i++) {
				var row = this.table.insertRow(-1);
				row.id = "-1";
				this.newTd(row, 0, "&nbsp;");
				this.newTd(row, 1, "&nbsp;");
				this.newTd(row, 2, "&nbsp;");
				this.newTd(row, 3, "&nbsp;");
				this.newTd(row, 4, "&nbsp;");
				this.newTd(row, 5, "&nbsp;");
				this.newTd(row, 6, "&nbsp;");
			}
		}
	};

	ProcessPropertyPanel.prototype.newTh = function(row, content) {
		var th = document.createElement('th');
		th.innerHTML = content;
		th.setAttribute("nowrap", "true");
		row.appendChild(th);
	};

	ProcessPropertyPanel.prototype.newTd = function(row, number, content) {
		var cell1 = row.insertCell(number);
		cell1.setAttribute("nowrap", "true");
		cell1.innerHTML = content;
	};

	ProcessPropertyPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	ProcessPropertyPanel.prototype.doClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.options.parent.enableModifyButton();
			this.options.parent.enableRemoveButton();
			var table = evt.target.parentElement.parentElement;
			this.clearProcessSheet(table);
			this.selectRow(evt.target.parentElement);
		}
	};

	ProcessPropertyPanel.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.options.parent.enableModifyButton();
			this.options.parent.enableRemoveButton();
			this.clearProcessSheet(evt.target.parentElement.parentElement);
			this.selectRow(evt.target.parentElement);
			var id = evt.target.parentElement.id;
			if (id != "-1") {
				var datavar = this.entity.seekChildByID(id);
				// curRow.rowIndex
				this.initvaluedialog.setDataVariable(datavar, this.entity);
				this.initvaluedialog.show(true);
			}
		}
	};

	// click plus button to create new data variable
	ProcessPropertyPanel.prototype.addRow = function(evt) {
		var that = this;
		$.getJSON(service.api(2)).complete(
				function(data) {
					that.initvaluedialog.setNewDataVariable(that.entity,
							data.responseText);
					that.initvaluedialog.show(true);
				});
	};

	// click pencil button to modify existing data variable
	ProcessPropertyPanel.prototype.modifyRow = function(evt) {
		if (this.table.rows.length > 0) {
			for (var i = 0; i < this.table.rows.length; i++) {
				if (this.table.rows[i].id != "-1"
						&& this.rowSelected(this.table.rows[i])) {
					this.initvaluedialog.setDataVariable(this.entity
							.seekChildByID(this.table.rows[i].id), this.entity);
					this.initvaluedialog.show(true);
				}
			}
		}
	};

	// click minus button to remove existing data variable
	ProcessPropertyPanel.prototype.removeRow = function(evt) {
		if (this.table.rows.length > 1) {
			for (var i = 0; i < this.table.rows.length; i++) {
				if (this.table.rows[i].id != "-1"
						&& this.rowSelected(this.table.rows[i])) {
					var t = this.entity.seekChildByID(this.table.rows[i].id);
					if (t.datatype == "File") {
						this.confirmInfoDialog.show(
								"您若删除该文件变量，则该变量所附文件将被删除且不可恢复，确定删除吗？", 2,
								this.entity.id, this.entity.owner);
					} else {
						this.confirmInfoDialog.show("您确定要删除该变量吗？", 2,
								this.entity.id, this.entity.owner);
					}
					break;
				}
			}
		}
	};

	ProcessPropertyPanel.prototype.doYesAction = function(e, type, pid, orgid) {
		this.confirmInfoDialog.hide();
		if (this.table.rows.length > 1) {
			for (var i = 0; i < this.table.rows.length; i++) {
				if (this.table.rows[i].id != "-1"
						&& this.rowSelected(this.table.rows[i])) {
					map[this.entity.id].stack.execute(new PMRemoveVariableCmd(
							this.table.rows[i].id, this.entity));
					break;
				}
			}
		}
		if (this.entity.getVariableCount() < 5) {
			for (var i = 0; i < 5 - this.entity.getVariableCount(); i++) {
				var row = this.table.insertRow(-1);
				row.id = "-1";
				this.newTd(row, 0, "&nbsp;");
				this.newTd(row, 1, "&nbsp;");
				this.newTd(row, 2, "&nbsp;");
				this.newTd(row, 3, "&nbsp;");
				this.newTd(row, 4, "&nbsp;");
				this.newTd(row, 5, "&nbsp;");
				this.newTd(row, 6, "&nbsp;");
			}
		}
		if (this.entity.getVariableCount() > 0) {
			this.options.parent.enableModifyButton();
			this.options.parent.enableRemoveButton();
		} else {
			this.options.parent.disabledModifyButton();
			this.options.parent.disabledRemoveButton();
		}
	};

	ProcessPropertyPanel.prototype.doNoAction = function(e, type, pid) {
		this.confirmInfoDialog.hide();
	};

	ProcessPropertyPanel.prototype.clearProcessSheet = function(table) {
		if (table.rows.length > 0) {
			for (var i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
	};

	ProcessPropertyPanel.prototype.selectRow = function(row) {
		row.style.background = "#d1d1e0";
	};

	ProcessPropertyPanel.prototype.rowSelected = function(row) {
		return row.style.background == "rgb(209, 209, 224)";
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new ProcessPropertyPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);