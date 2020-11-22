/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "conditionEditPanel";
	var defaults = {
		id : "",
		parent : "",
		currOwner : "",
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			currOwner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.selId = null;
		this.init(options);
	};

	EditPanel.prototype.init = function(options) {
		// this
		var f = this.options.currOwner;
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);
		var row1 = document.createElement("div");
		row1.className = "row";
		modalframe.appendChild(row1);

		// left panel
		var left = document.createElement("div");
		row1.appendChild(left);
		left.className = "col-lg-6 col-md-6 col-sm-6 col-xs-6";

		// form/functions select row
		var selRow = document.createElement("div");
		left.appendChild(selRow);
		selRow.className = "form-group";
		// form/functions select
		this.compSel = document.createElement("SELECT");
		selRow.appendChild(this.compSel);
		this.compSel.className = "form-control";
		this.compSel.addEventListener("change", this, false);
		this.addOptions(this.compSel, f.name, "0", 0);
		this.addOptions(this.compSel, "函数", "1", 1);

		// form/functions list/tree row
		var listRow = document.createElement("div");
		left.appendChild(listRow);
		listRow.className = "form-group";

		this.functionSel = document.createElement("SELECT");
		listRow.appendChild(this.functionSel);
		this.functionSel.className = "form-control";
		this.functionSel.size = "11";
		this.functionSel.style.display = "none";
		this.addOptions(this.functionSel, "opt1", "0", 0);
		this.addOptions(this.functionSel, "opt2", "1", 1);

		this.trvwPnl = document.createElement("DIV");
		listRow.appendChild(this.trvwPnl);
		this.trvwPnl.className = "panel panel-default";
		this.trvwPnl.style.display = "";

		var trvwPnlBdy = document.createElement("DIV");
		this.trvwPnl.appendChild(trvwPnlBdy);
		trvwPnlBdy.style.height = "197px";
		trvwPnlBdy.style.overflow = "scroll";

		this.trvw = document.createElement("DIV");
		this.trvw.id = "formtree";
		this.trvw.style.boxSizing = "border-box";
		trvwPnlBdy.appendChild(this.trvw);
		var that = this;
		this.instance = $(this.trvw).jstree({
			"multiple" : false,
			"core" : {
				"check_callback" : true,
				"data" : f.toTree(),
			},
		}).on('activate_node.jstree', function(e, data) {
			var arry = data.node.data.split("|");
			if (arry[0] == "表单" || arry[0] == "列") {
				that.disableButton(that.btn);
			} else {
				that.enableButton(that.btn);
			}
			that.typeInut.value = arry[0];
			that.valueInut.value = arry[1];
			that.selId = data.node.id;
		}).on("dblclick.jstree", function(e) {
			var instance = $('#formtree').jstree(true);
			var sel = instance.get_selected(true)[0];
			if (sel != null) {
				var selected = instance.is_leaf(sel);
				var arry = sel.data.split("|");
				that.selId = sel.id;
				that.insertNew(sel.id);
				that.updateExpression();
				if (arry[0] == "表单" || arry[0] == "列") {
					that.disableButton(that.btn);
				} else {
					that.enableButton(that.btn);
				}
			}
		}).on('loaded.jstree', function() {
			$(that.instance).jstree('open_all');
		});

		var right = document.createElement("div");
		row1.appendChild(right);
		right.className = "col-lg-6 col-md-6 col-sm-6 col-xs-6";

		var typeRow = document.createElement("div");
		right.appendChild(typeRow);
		typeRow.className = "form-group";
		var typeRowLabel = document.createElement("label");
		typeRow.appendChild(typeRowLabel);
		typeRowLabel.innerHTML = "组件类型";
		this.typeInut = document.createElement("TEXTAREA");
		typeRow.appendChild(this.typeInut);
		this.typeInut.className = "form-control";
		this.typeInut.rows = "4";
		this.typeInut.readOnly = true;

		var valueRow = document.createElement("div");
		right.appendChild(valueRow);
		valueRow.className = "form-group";
		var valueRowLabel = document.createElement("label");
		valueRow.appendChild(valueRowLabel);
		valueRowLabel.innerHTML = "组件值";
		this.valueInut = document.createElement("TEXTAREA");
		valueRow.appendChild(this.valueInut);
		this.valueInut.className = "form-control";
		this.valueInut.rows = "4";
		this.valueInut.readOnly = true;

		// tool bar for expression editing
		var toolbarRow = document.createElement("div");
		modalframe.appendChild(toolbarRow);
		toolbarRow.className = "row";
		
		var tb = document.createElement("div");
		tb.className = "form-inline col-lg-12 col-md-12 col-sm-12 col-xs-12";
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
		this.disableButton(this.btn);
		this.btn18 = this.createICONButton(g1, options.id, "Constant", "常数",
				c1, "i", "glyphicon glyphicon-copyright-mark");

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

		var expRow = document.createElement("div");
		modalframe.appendChild(expRow);
		expRow.className = "row";

		var expDetailsDIV = document.createElement("div");
		expRow.appendChild(expDetailsDIV);
		expDetailsDIV.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		expDetailsDIV.style.marginTop = "10px";

		this.expDetails = document.createElement("div");
		expDetailsDIV.appendChild(this.expDetails);
		this.expDetails.id = "expdetails" + options.id;
		this.expDetails.className = "form-control-static";
		this.expDetails.style.borderRadius = "4px";
		this.expDetails.style.border = "1px solid #dddddd";
		this.expDetails.style.height = "100px";
		this.expDetails.style.padding = "5px";
		this.expDetails.style.overflowY = "auto";

		var dialog = $(modalframe).uiConstantEditDialog({
			id : options.id,
			title : "表单居 - 设置常数",
			topparent : this.topparent,
			expdetail : this.expDetails,
		});
		this.constantdialog = dialog.data("uiConstantEditDialog");

		var msgRow = document.createElement("div");
		modalframe.appendChild(msgRow);
		msgRow.className = "row";

		var msgDIV = document.createElement("div");
		msgRow.appendChild(msgDIV);
		msgDIV.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		msgDIV.style.marginTop = "10px";
		msgDIV.style.height = "50px";

		var msgBox = $(msgDIV).alertBox({
			id : options.id,
		});
		this.messageBox = msgBox.data("alertBox");
	};

	EditPanel.prototype.buttongroup = function(name) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", name);
		return group;
	};

	EditPanel.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
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

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		case "click":
			this.doClick(e);
			break;
		}
		Utils.stopBubble(e);
	};

	EditPanel.prototype.deleteAll = function() {
		if (this.entity != null) {
			this.entity.removeAll();
		}
	};

	EditPanel.prototype.updateExpression = function() {
		this.expDetails.innerHTML = this.entity.toString();
	};

	// ths.entity is a condition object.
	EditPanel.prototype.setRule = function(exp) {
		// this.enableButtons();
		if (exp != null) {
			this.entity = exp.clone(this.options.currOwner);
		} else {
			this.entity = new Expressions();
		}
		this.updateExpression();
	};

	EditPanel.prototype.fetchRule = function() {
		return this.entity;
	};

	EditPanel.prototype.insertNew = function(id) {
		var v = this.options.currOwner.seekObjectByID(id);
		this.entity.insert(v);
	};

	EditPanel.prototype.doClick = function(evt) {
		if (evt.target.id == "buttonAdd2Exp" + this.options.id) {
			this.insertNew(this.selId);
		} else if (evt.target.id == "buttonPlus" + this.options.id) {
			var op = new JSOperator();
			op.symbol = "+";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonMinus" + this.options.id) {
			var op = new JSOperator();
			op.symbol = "-";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonMulti" + this.options.id) {
			var op = new JSOperator();
			op.symbol = "*";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonDivd" + this.options.id) {
			var op = new JSOperator();
			op.symbol = "/";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonPercen" + this.options.id) {
			var op = new JSOperator();
			op.symbol = "%";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonLeftBracket" + this.options.id) {
			var op = new JSOperator();
			op.symbol = "(";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonRightBracket" + this.options.id) {
			var op = new JSOperator();
			op.symbol = ")";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonLT" + this.options.id) { // <
			var op = new JSOperator();
			op.symbol = "<";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonLTEquals" + this.options.id) { // <=
			var op = new JSOperator();
			op.symbol = "<=";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonEquals" + this.options.id) { // ==
			var op = new JSOperator();
			op.symbol = "==";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonGTEquals" + this.options.id) { // >=
			var op = new JSOperator();
			op.symbol = ">=";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonGT" + this.options.id) { // >
			var op = new JSOperator();
			op.symbol = ">";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonLTGT" + this.options.id) { // <>
			var op = new JSOperator();
			op.symbol = "!=";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonNot" + this.options.id) {
			var op = new JSOperator();
			op.symbol = "!";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonAnd" + this.options.id) {
			var op = new JSOperator();
			op.symbol = "&&";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonOr" + this.options.id) {
			var op = new JSOperator();
			op.symbol = "||";
			this.entity.insert(op);
		} else if (evt.target.id == "buttonConstant" + this.options.id) {
			this.constantdialog.setRule(this.entity);
			this.constantdialog.show(true);
		} else if (evt.target.id == "buttonCheck" + this.options.id) {
			this.check(evt);
		} else if (evt.target.id == "buttonDeleteAll" + this.options.id) {
			this.deleteAll();
		}
		this.updateExpression();
	};

	EditPanel.prototype.check = function(evt) {
		try {
			this.messageBox.show(1, eval(this.entity.toRealValue()), 0);
		} catch (exception) {
			this.messageBox.show(4, exception, 1);
		}
	};

	EditPanel.prototype.enableButton = function(button) {
		button.disabled = false;
	};

	EditPanel.prototype.disableButton = function(button) {
		button.disabled = true;
	};

	EditPanel.prototype.doChange = function(e) {
		if (this.compSel.selectedIndex == 0) {
			this.functionSel.style.display = "none";
			this.trvwPnl.style.display = "";
		} else if (this.compSel.selectedIndex == 1) {
			this.functionSel.style.display = "";
			this.trvwPnl.style.display = "none";
		}
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