/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "checkboxAssociatedPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var AssociatedPropPanel = function(element, options) {
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
		this.selIndex = -1;
		this.entity = options.entity;
		this.init(options);
	};

	AssociatedPropPanel.prototype.loadPane = function(entity) {
		this.entity = entity;
		this.init(this.options);
	};

	AssociatedPropPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		modalframe.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		modalframe.style.padding = "4px";
		this.element.appendChild(modalframe);

		var ruleDiv = document.createElement("table");
		modalframe.appendChild(ruleDiv);
		ruleDiv.style.width = "100%"
		ruleDiv.style.padding = "0px";

		var row = ruleDiv.insertRow(-1);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		cell1.style.padding = 0;
		cell1.style.margin = 0;
		cell2.style.padding = 0;
		cell2.style.margin = 0;
		cell2.style.width = "25px";
		cell2.style.verticalAlign = "top";

		var ruleListDiv = document.createElement("DIV");
		cell1.appendChild(ruleListDiv);
		ruleListDiv.className = "table-responsive";
		ruleListDiv.style.overflowY = "scroll";
		ruleListDiv.style.height = "105px";
		ruleListDiv.id = "tablediv" + options.id;

		this.ruletable = document.createElement("TABLE");
		ruleListDiv.appendChild(this.ruletable);
		this.ruletable.className = "table table-hover table-striped";

		var rightDiv = document.createElement("DIV");
		cell2.appendChild(rightDiv);
		rightDiv.style.width = "25px";
		rightDiv.id = "r" + options.id;
		rightDiv.style.margin = "0px";
		rightDiv.style.padding = "0px";

		var buttonDiv = document.createElement("div");
		rightDiv.appendChild(buttonDiv);
		buttonDiv.style.margin = "0px";
		buttonDiv.style.paddingTop = "0px";
		buttonDiv.style.paddingBottom = "0px";
		buttonDiv.style.paddingLeft = "2px";
		buttonDiv.style.paddingRight = "2px";
		buttonDiv.style.width = "24px";
		buttonDiv.style.minWidth = "24px";
		buttonDiv.style.maxWidth = "25px";

		this.upButton = document.createElement("button");
		buttonDiv.appendChild(this.upButton);
		this.upButton.type = "button";
		this.upButton.id = "upButton" + options.id;
		this.upButton.name = "upButton" + options.id;
		this.upButton.className = "btn btn-primary btn-xs";
		var upArrow = document.createElement("span");
		upArrow.className = "glyphicon glyphicon-arrow-up";
		upArrow.id = "upButton" + options.id;
		this.upButton.appendChild(upArrow);
		this.upButton.setAttribute("disabled", "true");
		this.upButton.addEventListener("click", this, false);

		this.downButton = document.createElement("button");
		buttonDiv.appendChild(this.downButton);
		this.downButton.type = "button";
		this.downButton.id = "downButton" + options.id;
		this.downButton.name = "downButton" + options.id;
		this.downButton.className = "btn btn-primary btn-xs";
		var downArrow = document.createElement("span");
		downArrow.id = "downButton" + options.id;
		downArrow.className = "glyphicon glyphicon-arrow-down";
		this.downButton.appendChild(downArrow);
		this.downButton.setAttribute("disabled", "true");
		this.downButton.addEventListener("click", this, false);

		var plugin40 = $(modalframe).conditionDialog({
			id : "cdn401",
			title : "表单居 - 条件或表达式编辑",
			parent : this,
			currOwner : this.options.currowner,
		});
		this.dlg40 = plugin40.data("conditionDialog");

		var plugin41 = $(this).checkboxBehaviorSelectCellEditor({
			parent : this,
		});
		this.editor41 = plugin41.data("checkboxBehaviorSelectCellEditor");

		var plugin42 = $(this).propagatedComponentSelectCellEditor({
			parent : this,
		});
		this.editor42 = plugin42.data("propagatedComponentSelectCellEditor");

		var plugin43 = $(this).componentBehaviorSelectCellEditor({
			parent : this,
		});
		this.editor43 = plugin43.data("componentBehaviorSelectCellEditor");

		this.loadData(this.entity, this.ruletable);
	};

	// entity is an UI component
	AssociatedPropPanel.prototype.loadData = function(entity, comptable) {
		this.rules = entity.rules;
		if (this.rules.length > 0) {
			for (var i = 0; i < this.rules.length; i++) {
				var row = this.ruletable.insertRow(-1);
				row.addEventListener("click", this, false);
				row.addEventListener("dblclick", this, false);
				this.createCell(0, (i + 1), row, "n");
				this.createCell(1, checkboxbehaviors[this.rules[i].behavior],
						row, "bh");
				this.createCell(2, (this.rules[i].conditions == null ? ""
						: this.rules[i].conditions.toString()), row, "cdtn1");
				if (this.rules[i].tComId != null) {
					if (this.rules[i].tComId != "0") {
						var t = this.options.currowner
								.seekObjectByID(this.rules[i].tComId);
						if (t != null)
							this.createCell(3, t.title, row, "com1");
						else
							this.createCell(3, "", row, "com1");
					} else {
						this.createCell(3, "系统", row, "com1");
					}
				} else {
					this.createCell(3, "", row, "com1");
				}
				this.createCell(4, combehaviors[this.rules[i].tComAction], row,
						"act1");
				this.createCell(5, (this.rules[i].tComExpressions == null ? ""
						: this.rules[i].tComExpressions.toString()), row,
						"cdtn2");
				if (this.rules[i].eComId != null) {
					if (this.rules[i].eComId != "0") {
						var e = this.options.currowner
								.seekObjectByID(this.rules[i].eComId);
						if (e != null)
							this.createCell(6, e.title, row, "com2");
						else
							this.createCell(6, "", row, "com2");
					} else
						this.createCell(6, "系统", row, "com2");
				} else {
					this.createCell(6, "", row, "com2");
				}
				this.createCell(7, combehaviors[this.rules[i].eComAction], row,
						"act2");
				this.createCell(8, (this.rules[i].eComExpressions == null ? ""
						: this.rules[i].eComExpressions.toString()), row,
						"cdtn3");
			}
			if (this.rules.length < 30) {
				for (var i = this.rules.length; i < 30; i++) {
					var row = this.ruletable.insertRow(i);
					for (var j = 0; j < 9; j++) {
						this.createCell(j, "", row);
					}
				}
			}
			this.addHeader(comptable);
			this.selectRow(comptable, this.selIndex);
		} else {
			for (var j = 0; j < 30; j++) {
				var row = this.ruletable.insertRow(-1);
				for (var i = 0; i < 9; i++) {
					this.createCell(i, "", row, "n");
				}
			}
			this.addHeader(comptable);
		}
		this.options.parent.enableAddButton();
	};

	AssociatedPropPanel.prototype.addHeader = function(comptable) {
		var header = comptable.createTHead();
		var row = header.insertRow(0);
		this.createHead("序号", row);
		this.createHead("组件行为", row);
		this.createHead("关联条件", row);
		this.createHead("条件符合时影响", row);
		this.createHead("动作", row);
		this.createHead("表达式", row);
		this.createHead("条件不符时影响", row);
		this.createHead("动作", row);
		this.createHead("表达式", row);
	};

	AssociatedPropPanel.prototype.createCell = function(no, content, row, edit) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.setAttribute("ed", edit);
		if (content == "") {
			cell.innerHTML = "&nbsp;";
		} else {
			$(cell).text(content);
		}
	};

	AssociatedPropPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	AssociatedPropPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	AssociatedPropPanel.prototype.enableUpDownButtons = function(index) {
		if (index > 0) {
			if (index == 1) {
				this.upButton.disabled = true;
				if (this.rules.length > 1)
					this.downButton.disabled = false;
				else
					this.downButton.disabled = true;
			} else if (index == this.rules.length) {
				if (this.rules.length > 1)
					this.upButton.disabled = false;
				else
					this.upButton.disabled = true;
				this.downButton.disabled = true;
			} else {
				this.upButton.disabled = false;
				this.downButton.disabled = false;
			}
		} else {
			this.upButton.disabled = true;
			this.downButton.disabled = true;
		}
	};

	AssociatedPropPanel.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.ruletable.focus();
			this.selIndex = evt.target.parentElement.rowIndex;
			this.startToEdit(evt.target,
					evt.target.parentNode.children[0].innerHTML);
			if (!(this.options.currowner instanceof ReleasedForm)) {
				this.enableUpDownButtons(this.selIndex);
			}
		}
	};

	AssociatedPropPanel.prototype.startToEdit = function(tag, number) {
		if (this.options.currowner instanceof ReleasedForm) {
			return;
		}
		var t = tag.getAttribute("ed");
		var r = this.entity.fetchRuleByNum(number);
		if (t == "bh") {
			this.editor41.loadEditor(tag, r, "behavior", "n", r.behavior,
					this.entity, this.options.currowner);
		} else if (t == "cdtn1") {
			this.dlg40.show(r, this.entity, this.options.currowner, 1);
		} else if (t == "cdtn2") {
			this.dlg40.show(r, this.entity, this.options.currowner, 2);
		} else if (t == "cdtn3") {
			this.dlg40.show(r, this.entity, this.options.currowner, 3);
		} else if (t == "com1") {
			this.editor42.loadEditor(tag, r, "tComId", "y", r.tComId,
					this.entity, this.options.currowner);
		} else if (t == "com2") {
			this.editor42.loadEditor(tag, r, "eComId", "y", r.eComId,
					this.entity, this.options.currowner);
		} else if (t == "act1") {
			this.editor43.loadEditor(tag, r, "tComAction", "n", r.tComAction,
					this.entity, this.options.currowner);
		} else if (t == "act2") {
			this.editor43.loadEditor(tag, r, "eComAction", "n", r.eComAction,
					this.entity, this.options.currowner);
		}
	};

	AssociatedPropPanel.prototype.doClick = function(evt) {
		if (evt.target.tagName == "TD") {
			var table = evt.target.parentElement.parentElement;
			this.clearSelection(table);
			evt.target.parentElement.style.background = "#d1d1e0";
			this.selIndex = evt.target.parentElement.rowIndex;
			if (!(this.options.currowner instanceof ReleasedForm)) {
				this.enableUpDownButtons(this.selIndex);
				this.options.parent.enableRemoveButton();
			}
		} else {
			if (evt.target == this.upButton
					|| evt.target.id == ("upButton" + this.options.id)) {
				map[this.entity.currOwner].stack.execute(new FMRorderUpRuleCmd(
						this.entity, this.selIndex));
			} else if (evt.target == this.downButton
					|| evt.target.id == ("downButton" + this.options.id)) {
				map[this.entity.currOwner].stack
						.execute(new FMRorderDownRuleCmd(this.entity,
								this.selIndex));
			}
		}
	};

	AssociatedPropPanel.prototype.selectRow = function(table, index) {
		this.clearSelection(table);
		if (table.rows.length > 0 && index != -1) {
			for (var i = 0; i < table.rows.length; i++) {
				if (i == index) {
					table.rows[i].style.background = "#d1d1e0";
					break;
				}
			}
			if (!(this.options.currowner instanceof ReleasedForm)) {
				this.options.parent.enableRemoveButton();
				this.enableUpDownButtons(this.selIndex);
			}
		}
	};

	AssociatedPropPanel.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (var i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
	};

	AssociatedPropPanel.prototype.addRow = function(evt) {
		map[this.entity.currOwner].stack.execute(new FMCreateRuleCmd(
				this.entity, new PropagateRule(), this.selIndex));
	};

	AssociatedPropPanel.prototype.removeRow = function(evt) {
		if (this.ruletable.rows.length > 0) {
			var r = 0;
			for (var i = 0; i < this.ruletable.rows.length; i++) {
				if (this.ruletable.rows[i].style.backgroundColor == "rgb(209, 209, 224)") {
					r = this.ruletable.rows[i].children[0].innerHTML;
					this.selIndex = i;
					break;
				}
			}
			map[this.options.currowner.id].stack.execute(new FMRemoveRuleCmd(
					this.entity, this.entity.fetchRuleByNum(r), this.selIndex));
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$
						.data(this, pluginName, new AssociatedPropPanel(this,
								options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);