/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "ruleEditPanel";
	var defaults = {
		id : "",
		topparent : "",
	};

	var RuleEditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.expDetails;
		this.constantdialog;
		this.topparent;
		this.varselection;
		this.varlistSelect;
		this.init(options);
		this.btn;
	};

	RuleEditPanel.prototype.init = function(options) {
		this.topparent = options.topparent;

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

		// var list row;
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
		this.vardetailTA.setAttribute("rows", "5");
		this.vardetailTA.readonly = true;

		// tool bar row

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
		this.btn19 = this.createButton("[", options.id, "LBRACK", g3, "左中括号");
		this.btn20 = this.createButton("]", options.id, "RBRACK", g3, "右中括号");

		this.btn9 = this.createButton("<", options.id, "LT", g3, "小于"); // <
		this.btn10 = this.createButton("<=", options.id, "LTEquals", g3,
				"小于或等于"); // <=
		this.btn11 = this.createButton("==", options.id, "Equals", g3, "恒等于"); // ==
		this.btn12 = this.createButton(">=", options.id, "GTEquals", g3,
				"大于或等于"); // >=
		this.btn13 = this.createButton(">", options.id, "GT", g3, "大于"); // >
		this.btn14 = this.createButton("!=", options.id, "LTGT", g3, "不等于"); // <>
		this.btn15 = this.createButton("!", options.id, "Not", g3, "取非");
		this.btn16 = this.createButton("&&", options.id, "And", g3, "求与");
		this.btn17 = this.createButton("||", options.id, "Or", g3, "求或");

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

	RuleEditPanel.prototype.doClick = function(evt) {
		if (evt.target.id == "buttonAdd2Exp" + this.options.id) {
			if (this.varlistSelect.selectedIndex > -1) {
				this.entity.insert(this.owner
						.seekChildByID(this.varlistSelect.value));
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
		} else if (evt.target.id == "buttonLT" + this.options.id) { // <
			var op = new Operator();
			op.symbol = "<";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonLTEquals" + this.options.id) { // <=
			var op = new Operator();
			op.symbol = "<=";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonEquals" + this.options.id) { // ==
			var op = new Operator();
			op.symbol = "==";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonGTEquals" + this.options.id) { // >=
			var op = new Operator();
			op.symbol = ">=";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonGT" + this.options.id) { // >
			var op = new Operator();
			op.symbol = ">";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonLTGT" + this.options.id) { // <>
			var op = new Operator();
			op.symbol = "!=";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonNot" + this.options.id) {
			var op = new Operator();
			op.symbol = "!";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonAnd" + this.options.id) {
			var op = new Operator();
			op.symbol = "&&";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonOr" + this.options.id) {
			var op = new Operator();
			op.symbol = "||";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonLBRACK" + this.options.id) {
			var op = new Operator();
			op.symbol = "[";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonRBRACK" + this.options.id) {
			var op = new Operator();
			op.symbol = "]";
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

	RuleEditPanel.prototype.buttongroup = function(name) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", name);
		return group;
	};

	RuleEditPanel.prototype.createICONButton = function(group, id, name, title,
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

	RuleEditPanel.prototype.createButton = function(actionContent, id, name,
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

	RuleEditPanel.prototype.handleEvent = function(e) {
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

	RuleEditPanel.prototype.doChange = function(evt) {
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

			}
		} else if (evt.target == this.varselection) {
			this.resetVarListSelect();
		}
	};

	RuleEditPanel.prototype.doDBClick = function(evt) {
		if (this.varlistSelect.selectedIndex < 0)
			return;
		var v = this.owner.seekChildByID(this.varlistSelect.value);
		this.entity.insert(v);
		this.show(v);
		this.updateExpression();
	};

	RuleEditPanel.prototype.deleteAll = function() {
		if (this.entity != null) {
			this.entity.removeAll();
		}
	};

	RuleEditPanel.prototype.resetVarListSelect = function() {
		this.clearSelectList(this.varlistSelect);
		if (this.varselection.value == this.owner.id) {
			for (i = 0; i < this.owner.children.length; i++) {
				if (this.owner.children[i] instanceof DataVariable) {
					this.addOptions(this.varlistSelect, Utils
							.parse(this.owner.children[i].name),
							this.owner.children[i].id, i);
				}
			}
		} else {
			FuncUtil.createFunctionList(this.varlistSelect);
		}
	};

	RuleEditPanel.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		parent.options.add(option, index);
		option.text = title;
		option.value = value;
	};

	RuleEditPanel.prototype.clearSelectList = function(sel) {
		$(sel).find('option').remove();
		$(sel).find('optgroup').remove();
	};

	RuleEditPanel.prototype.setGeneralRule = function(rule, owner) {
		this.owner = owner;
		if (rule != null) {
			this.entity = rule;
		} else {
			this.entity = new Expression();
		}
		this.clearSelectList(this.varselection);
		this.addOptions(this.varselection, Utils.parse(this.owner.name),
				this.owner.id, 0);
		this.addOptions(this.varselection, "系统函数", "02", 1);
		this.resetVarListSelect();
		this.updateExpression();
	};

	RuleEditPanel.prototype.getRule = function() {
		return this.entity;
	};

	RuleEditPanel.prototype.updateExpression = function() {
		this.expDetails.innerHTML = this.entity.toString();
	};

	RuleEditPanel.prototype.show = function(v) {
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
			this.vardetailTA.value = "";
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new RuleEditPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);