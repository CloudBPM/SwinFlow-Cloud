/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "exprEditPanel";
	var defaults = {
		id : "",
		title : "",
		owner : "",
		topparent : "",
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			owner : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = null;
		this.expDetails;
		this.owner = options.owner;
		// 0: assignment;1:input assignment;2:output assignment
		this.type = 0;
		this.topparent;
		this.varselection;
		this.varlistSelect;
		this.init(options);
		this.isReturnParameter = false;
		this.btn;
	};

	EditPanel.prototype.init = function(options) {
		this.topparent = options.topparent;
		var panelLabel = document.createElement("label");
		this.element.appendChild(panelLabel);
		panelLabel.innerHTML = options.title;
		// ----------------
		var procListRow = document.createElement("div");
		this.element.appendChild(procListRow);
		procListRow.className = "row";

		var proclist = document.createElement("div");
		procListRow.appendChild(proclist);
		proclist.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";

		this.varselection = document.createElement("select");
		proclist.appendChild(this.varselection);
		this.varselection.className = "form-control";
		this.varselection.addEventListener("change", this, false);
		// ---------------
		var varListRow = document.createElement("div");
		this.element.appendChild(varListRow);
		varListRow.className = "row";

		var varlist = document.createElement("div");
		varListRow.appendChild(varlist);
		varlist.className = "form-group col-lg-6 col-md-6 col-sm-12 col-xs-12";

		this.varlistSelect = document.createElement("select");
		varlist.appendChild(this.varlistSelect);
		this.varlistSelect.className = "form-control";
		this.varlistSelect.setAttribute("size", "5");
		this.varlistSelect.addEventListener("change", this, false);
		this.varlistSelect.addEventListener("dblclick", this, false);

		var varDetail = document.createElement("div");
		varListRow.appendChild(varDetail);
		varDetail.className = "form-group col-lg-6 col-md-6 col-sm-12 col-xs-12";

		this.vardetailTA = document.createElement("TEXTAREA");
		varDetail.appendChild(this.vardetailTA);
		this.vardetailTA.setAttribute("type", "text");
		this.vardetailTA.id = "typeTextInput" + options.id;
		this.vardetailTA.className = "form-control";
		this.vardetailTA.setAttribute("rows", "4");
		this.vardetailTA.readonly = true;
		// ------------------
		var toolbarRow = document.createElement("div");
		this.element.appendChild(toolbarRow);
		toolbarRow.className = "row";

		var tb = document.createElement("div");
		tb.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		toolbarRow.appendChild(tb);

		var toolbar = document.createElement("DIV");
		tb.appendChild(toolbar);
		toolbar.className = "btn-toolbar";
		toolbar.setAttribute("role", "toolbar");
		toolbar.setAttribute("aria-label", "ptoolbar");

		var c1 = "btn btn-default";
		var c2 = "btn btn-danger";
		var c3 = "btn btn-primary";
		var c4 = "btn btn-success";
		var g1 = this.buttongroup("group1");
		toolbar.appendChild(g1);

		this.btn = this.createICONButton(g1, options.id, "Add2Exp", "添加到公式",
				c4, "i", "glyphicon glyphicon-plus");
		this.btn.disabled = true;
		this.btn18 = this.createButton("常", options.id, "Constant", g1,
				"数值固定的常数（常量）");

		var g3 = this.buttongroup("group3");
		toolbar.appendChild(g3);
		this.btn2 = this.createButton("+", options.id, "Plus", g3, "加上");
		this.btn3 = this.createButton("-", options.id, "Minus", g3, "减去");
		this.btn4 = this.createButton("*", options.id, "Multi", g3, "乘以");
		this.btn5 = this.createButton("/", options.id, "Divd", g3, "除以");
		this.btn6 = this.createButton("%", options.id, "Percen", g3, "求余");
		this.btn7 = this
				.createButton("(", options.id, "LeftBracket", g3, "左括号");
		this.btn8 = this.createButton(")", options.id, "RightBracket", g3,
				"右括号");
		this.btn21 = this.createButton(",", options.id, "Comma", g3, "逗号");
		this.btn19 = this.createButton("[", options.id, "LBRACK", g3, "左中括号");
		this.btn20 = this.createButton("]", options.id, "RBRACK", g3, "右中括号");

		var g4 = this.buttongroup("group3");
		toolbar.appendChild(g4);
		this.createICONButton(g4, options.id, "Check", "检查正确性", c3, "i",
				"glyphicon glyphicon-check");
		this.createICONButton(g4, options.id, "DeleteAll", "全部删除", c2, "i",
				"glyphicon glyphicon-trash");
		// --------------
		var detailRow = document.createElement("div");
		this.element.appendChild(detailRow);
		detailRow.className = "row";

		var expDetailsDIV = document.createElement("div");
		detailRow.appendChild(expDetailsDIV);
		expDetailsDIV.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";

		this.expDetails = document.createElement("div");
		expDetailsDIV.appendChild(this.expDetails);
		this.expDetails.className = "form-control-static";
		this.expDetails.style.borderRadius = "4px";
		this.expDetails.style.border = "1px solid #dddddd";
		this.expDetails.style.height = "100px";
		this.expDetails.style.overflowY = "auto";

		var dialog = $(this.topparent).constantDialog({
			id : "CNT" + options.id,
			title : "设置常数",
			topparent : this.topparent,
			expdetail : this.expDetails,
		});
		this.constantdialog = dialog.data("constantDialog");

	};

	EditPanel.prototype.doClick = function(evt) {
		if (evt.target.id == "buttonAdd2Exp" + this.options.id) {
			if (this.varlistSelect.selectedIndex > -1) {
				if (this.varselection.value == this.owner.id) {
					var v = this.owner.seekChildByID(this.varlistSelect.value);
					if (this.isReturnParameter == true) {
						this.deleteAll();
					}
					this.entity.insert(v);
				} else {
					var sel = this.varlistSelect.value;
					if (sel == "addLastElement") {
						var v = new AddLastElement();
						this.entity.insert(v);
					}
				}
			}
		} else if (evt.target.id == "buttonPlus" + this.options.id) {
			var op = new Operator();
			op.symbol = "+";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonMinus" + this.options.id) {
			var op = new Operator();
			op.symbol = "-";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonMulti" + this.options.id) {
			var op = new Operator();
			op.symbol = "*";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonDivd" + this.options.id) {
			var op = new Operator();
			op.symbol = "/";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonPercen" + this.options.id) {
			var op = new Operator();
			op.symbol = "%";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonLeftBracket" + this.options.id) {
			var op = new Operator();
			op.symbol = "(";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonRightBracket" + this.options.id) {
			var op = new Operator();
			op.symbol = ")";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonLBRACK" + this.options.id) {
			var op = new Operator();
			op.symbol = "[";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonRBRACK" + this.options.id) {
			var op = new Operator();
			op.symbol = "]";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonComma" + this.options.id) {
			var op = new Operator();
			op.symbol = ",";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonConstant" + this.options.id) {
			// this.owner is process object;
			this.constantdialog.setExpression(this.entity, this.owner.owner,
					this.owner.id);
			this.constantdialog.show(true);
		} else if (evt.target.id == "buttonCheck" + this.options.id) {
			console.log("checking....");
		} else if (evt.target.id == "buttonDeleteAll" + this.options.id) {
			this.deleteAll();
		}
		this.updateExpression();
	};

	EditPanel.prototype.buttongroup = function(name) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", name);
		return group;
	};

	EditPanel.prototype.createICONButton = function(group, id, name, title,
			style, fonttag, fontclass) {
		var button = document.createElement("button");
		group.appendChild(button);
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = "button" + name + id;
		button.addEventListener('click', this, false);
		var icon = document.createElement(fonttag);
		button.appendChild(icon);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.setAttribute("aria-hidden", "true");
		icon.id = "button" + name + id;
		return button;
	};

	EditPanel.prototype.createButton = function(actionContent, id, name,
			parent, tooltip) {
		var button = document.createElement("button");
		parent.appendChild(button);
		button.id = "button" + name + id;
		button.name = "button" + name + id;
		button.type = "button";
		button.className = "btn btn-default";
		button.innerHTML = actionContent;
		button.setAttribute("data-toggle", "tooltip");
		button.setAttribute("title", tooltip);
		button.addEventListener("click", this, false);
		return button;
	};

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		case "dblclick":
			this.doDBClick(e);
			break;
		}
	};

	EditPanel.prototype.doChange = function(evt) {
		if (evt.target == this.varlistSelect) {
			if (this.varselection.value == this.owner.id) {
				var v = this.owner.seekChildByID(this.varlistSelect.value);
				this.show(v);
				if (this.varlistSelect.selectedIndex > -1) {
					this.btn.disabled = false;
				} else {
					this.btn.disabled = true;
				}
			} else {
				var sel = this.varlistSelect.value;
				if (sel == "addLastElement") {
					this.show(new AddLastElement());
				}
			}
		} else if (evt.target == this.varselection) {
			if (this.type == 0) {
				this.resetVarListSelect();
			} else {
				this.resetSubprocessVarListSelect(this.type);
			}
		}
	};

	EditPanel.prototype.show = function(v) {
		this.vardetailTA.value = "";
		if (this.varselection.value == this.owner.id) {
			var show = "数据类型：" + Utils.toDataType(v.datatype) + '\r';
			if (v instanceof ArrayDataVariable) {
				show += "值：" + v.toValueString() + '\r';
			} else {
				if (v.value != null)
					show += "值：" + v.toValueString() + '\r';
				else
					show += "值：" + '\r';
			}
			show += "备注：" + Utils.parse(v.description) + '\r';
			this.vardetailTA.value = show;
		} else {
			if (v instanceof ExpFunction) {
				var show = "函数格式：" + v.format + '\r';
				show += "描述：" + v.descrition + '\r';
				this.vardetailTA.value = show;
			}
		}
	};

	EditPanel.prototype.doDBClick = function(evt) {
		if (this.varlistSelect.selectedIndex < 0)
			return;
		if (this.varselection.value == this.owner.id) {
			var v = this.owner.seekChildByID(this.varlistSelect.value);
			this.entity.insert(v);
			this.show(v);
			this.updateExpression();
		} else {
			var sel = this.varlistSelect.value;
			if (sel == "addLastElement") {
				var v = new AddLastElement();
				this.entity.insert(v);
				this.show(v);
			}
			this.updateExpression();
		}
	};

	EditPanel.prototype.deleteAll = function() {
		if (this.entity != null) {
			this.entity.removeAll();
		}
	};

	EditPanel.prototype.resetSelect = function(title, value) {
		this.clearSelectList(this.varselection);
		this.addOptions(this.varselection, title, value, 0);
		this.addOptions(this.varselection, "系统函数", "02", 1);
	};

	EditPanel.prototype.resetVarListSelect = function() {
		this.clearSelectList(this.varlistSelect);
		this.btn.disabled = true;
		if (this.varselection.value == this.owner.id) {
			var j = 0;
			for (i = 0; i < this.owner.children.length; i++) {
				if (this.owner.children[i] instanceof DataVariable) {
					this.addOptions(this.varlistSelect, Utils
							.parse(this.owner.children[i].name),
							this.owner.children[i].id, j);
					j++;
				}
			}
		} else {
			FuncUtil.createFunctionList(this.varlistSelect);
		}
	};

	EditPanel.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		parent.options.add(option, index);
		option.text = title;
		option.value = value;
	};

	// type: 0: input;1:output
	EditPanel.prototype.resetSubprocessVarListSelect = function(type) {
		this.clearSelectList(this.varlistSelect);
		if (this.varselection.value == this.owner.id) {
			if (type == 1) { // input assignment
				var j = 0;
				for (i = 0; i < this.owner.children.length; i++) {
					if (this.owner.children[i] instanceof DataVariable) {
						this.addOptions(this.varlistSelect, Utils
								.parse(this.owner.children[i].name),
								this.owner.children[i].id, j);
						j++;
					}
				}
			} else if (type == 2) { // output assignment
				var list = this.owner.fetchReadOnlyDataVars();
				for (i = 0; i < list.length; i++) {
					this.addOptions(this.varlistSelect, Utils
							.parse(list[i].name), list[i].id, i);
				}
			}
		} else {
			FuncUtil.createFunctionList(this.varlistSelect);
		}
	};

	EditPanel.prototype.clearSelectList = function(sel) {
		$(sel).find('option').remove();
		$(sel).find('optgroup').remove();
	};

	// entrance 1: Assignment expression
	EditPanel.prototype.setGeneralRule = function(exp, owner) {
		this.type = 0;
		this.isReturnParameter = false;
		this.enableButtons();
		this.owner = owner; // process object
		if (exp != null) {
			this.entity = exp;
		} else {
			this.entity = new Expression();
		}
		this.resetSelect(Utils.parse(this.owner.name), this.owner.id);
		this.resetVarListSelect();
		this.updateExpression();
	};

	// entrance 2: subprocess point input/output assignment expression
	EditPanel.prototype.setSubprocessRule = function(rule, owner, type) {
		this.type = type;
		this.isReturnParameter = false;
		this.enableButtons();
		this.owner = owner;
		if (rule != null) {
			this.entity = rule;
		} else {
			this.entity = new Expression();
		}
		this.resetSelect(Utils.parse(this.owner.name), this.owner.id);
		this.resetSubprocessVarListSelect(type);
		this.updateExpression();
	};

	// entrance 3： parameter assignment expression
	EditPanel.prototype.setParameterValue = function(parametername, rule, owner) {
		this.setGeneralRule(rule, owner);
		if (parametername.toLowerCase() == "return") {
			this.isReturnParameter = true;
			this.disableButtons();
		} else {
			this.isReturnParameter = false;
			this.enableButtons();
		}
	};

	EditPanel.prototype.getRule = function() {
		return this.entity;
	};

	EditPanel.prototype.updateExpression = function() {
		this.expDetails.innerHTML = this.entity.toString();
	};

	EditPanel.prototype.disableButtons = function() {
		this.btn2.disabled = true;
		this.btn3.disabled = true;
		this.btn4.disabled = true;
		this.btn5.disabled = true;
		this.btn6.disabled = true;
		this.btn7.disabled = true;
		this.btn8.disabled = true;
		this.btn18.disabled = true;
		this.btn21.disabled = true;
	};

	EditPanel.prototype.enableButtons = function() {
		this.btn2.disabled = false;
		this.btn3.disabled = false;
		this.btn4.disabled = false;
		this.btn5.disabled = false;
		this.btn6.disabled = false;
		this.btn7.disabled = false;
		this.btn8.disabled = false;
		this.btn18.disabled = false;
		this.btn21.disabled = false;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EditPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);