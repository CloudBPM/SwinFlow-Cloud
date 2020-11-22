/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "personEditor";
	var defaults = {
		id : "",
		ownerId : "",
		basicpropsheet : "",
		propsheet : "",
		height : 0,
		parent : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			basicpropsheet : "",
			propsheet : "",
			height : 0,
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.persons = [];
		this.person = new TrainingPerson();
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.currpage = null; // by default;
		this.pagesize = 30;
		this.init(options);
		this.createToolbar(options);
		this.createPersonPane(options);
		this.loading(1, this.pagesize, "", options.ownerId);
	};

	Editor.prototype.init = function(options) {
		this.editorPanel = document.createElement("DIV");
		this.element.appendChild(this.editorPanel);
		this.editorPanel.style.margin = "0px";
		this.editorPanel.style.padding = "0px";
		this.editorPanel.style.overflow = "auto";
		this.toolbarRow = document.createElement("DIV");
		this.editorPanel.appendChild(this.toolbarRow);
		this.toolbarRow.className = "row";
		this.toolbarRow.style.margin = "0px";
		this.toolbarRow.style.padding = "0px";
		this.painterRow = document.createElement("DIV");
		this.editorPanel.appendChild(this.painterRow);
		this.painterRow.className = "row";
		this.painterRow.style.margin = "0px";
		this.painterRow.style.padding = "0px";

		var canvasPanel = document.createElement("DIV");
		this.painterRow.appendChild(canvasPanel);
		var w = document.documentElement.clientWidth;
		canvasPanel.id = "userEditingPanel" + options.id;
		canvasPanel.className = "col";
		canvasPanel.style.width = (w - 568) + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginLeft = "4px";
		canvasPanel.style.padding = "0px";

		this.tableDivPane = document.createElement("DIV");
		canvasPanel.appendChild(this.tableDivPane);

		this.tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.tableDivPane.id = "convasPane" + options.id;
		this.tableDivPane.className = "table-responsive";
		this.tableDivPane.style.margin = "0px";
		this.tableDivPane.style.padding = "0px";
		this.tableDivPane.style.border = "1px solid #ddd";
		this.tableDivPane.style.height = options.height + "px";
		this.tableDivPane.style.borderRadius = "4px";
		this.tableDivPane.style.overflowY = "auto";

		// var p4 = $(this.element).newStaffDetailsDialog({
		// id : "025",
		// title : "云BPM - 添加新职员",
		// parent : this,
		// ownerid : options.ownerId,
		// });
		// this.newStaffDetailsDialog = p4.data("newStaffDetailsDialog");
		//
		// var p4 = $(this.element).searchIdNumberDialog({
		// id : "024",
		// title : "云BPM - 添加新职员",
		// parent : this,
		// ownerid : options.ownerId,
		// newstaffdlg : this.newStaffDetailsDialog,
		// });
		// this.searchIdNumberDialog = p4.data("searchIdNumberDialog");
		//
		// var p2 = $(this.element).confirmInfoDialog({
		// id : "026",
		// title : "云BPM提示",
		// parent : this,
		// });
		// this.confirmInfoDialog = p2.data("confirmInfoDialog");

	};

	Editor.prototype.loading = function(pageno, pagesize, condition, ownerID) {
		// $("#progressbar").show();
		// var that = this;
		// $.getJSON(services.api(2), {
		// pn : pageno,
		// psz : pagesize,
		// }).complete(function(data) {
		// that.loadData(data.responseJSON);
		// $("#progressbar").hide();
		// });
	};

	Editor.prototype.createPersonPane = function(options) {
		var pane = document.createElement("DIV");
		this.tableDivPane.appendChild(pane);
		pane.className = "row";

		var colpane = document.createElement("DIV");
		pane.appendChild(colpane);
		colpane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		var form = document.createElement("form");
		colpane.appendChild(form);
		form.className = "form-horizontal";

		var group1 = document.createElement("DIV");
		form.appendChild(group1);
		group1.className = "form-group";

		this.createLabel(group1, "", "姓", "col-sm-2 control-label", "lastname");

		var div1 = document.createElement("DIV");
		group1.appendChild(div1);
		div1.className = "col-sm-10";

		this.input1 = document.createElement("INPUT");
		div1.appendChild(this.input1);
		this.input1.type = "text";
		this.input1.className = "form-control";
		this.input1.id = "lastname";
		this.input1.setAttribute("placeholder", "请输入姓");
		this.input1.addEventListener("change", this, false);

		var group2 = document.createElement("DIV");
		form.appendChild(group2);
		group2.className = "form-group";

		this.createLabel(group2, "", "名", "col-sm-2 control-label","firstname");

		var div2 = document.createElement("DIV");
		group2.appendChild(div2);
		div2.className = "col-sm-10";

		this.input2 = document.createElement("INPUT");
		div2.appendChild(this.input2);
		this.input2.type = "text";
		this.input2.className = "form-control";
		this.input2.id = "firstname";
		this.input2.setAttribute("placeholder", "请输入名");
		this.input2.addEventListener("change", this, false);

		var g3 = document.createElement("DIV");
		form.appendChild(g3);
		g3.className = "form-group";

		this.createLabel(g3, "", "性别", "col-sm-2 control-label", "gender");

		var div3 = document.createElement("DIV");
		g3.appendChild(div3);
		div3.className = "col-sm-10";

		var label1 = document.createElement("LABEL");
		g3.appendChild(label1);
		label1.className = "radio-inline";

		this.inputM = document.createElement("INPUT");
		label1.appendChild(this.inputM);
		this.inputM.type = "radio";
		this.inputM.id = "male";
		this.inputM.value = "0";
		this.inputM.addEventListener("click", this, false);
		this.inputM.checked = true;

		label1.appendChild(document.createTextNode("男"));

		var label2 = document.createElement("LABEL");
		g3.appendChild(label2);
		label2.className = "radio-inline";

		this.inputFM = document.createElement("INPUT");
		label2.appendChild(this.inputFM);
		this.inputFM.type = "radio";
		this.inputFM.id = "female";
		this.inputFM.value = "1";
		this.inputFM.addEventListener("click", this, false);
		
		label2.appendChild(document.createTextNode("女"));

		var g4 = document.createElement("DIV");
		form.appendChild(g4);
		g4.className = "form-group";

		this.createLabel(g4, "", "生日", "col-sm-2 control-label", "birthday");
		
		var div4 = document.createElement("DIV");
		g4.appendChild(div4);
		div4.className = "col-sm-10";
		
		this.fromDateInput = document.createElement("INPUT");
		div4.appendChild(this.fromDateInput);
		this.fromDateInput.className = "form-control";
		this.fromDateInput.addEventListener("change", this, false);
		var that = this;
		$(this.fromDateInput).datepicker({
			dateFormat : "yy-mm-dd",
			onClose : function() {
				this.dispatchEvent(new Event('change'));
			},
		});
		

		
//		this.statusSelect = document.createElement("SELECT");
//		colDIV2.appendChild(this.statusSelect);
//		this.statusSelect.className = "form-control";
//
//		this.addOptions(this.statusSelect, "- 请选择 -", "-1", 0);
//		this.addOptions(this.statusSelect, "正在执行", "0", 1);
//		this.addOptions(this.statusSelect, "暂停执行", "1", 2);
//		this.addOptions(this.statusSelect, "执行异常", "2", 3);
//		this.addOptions(this.statusSelect, "异常中止", "3", 4);
//		this.addOptions(this.statusSelect, "已经完成", "4", 5);
		
//		$("#inputOrgPhoneNumber").intlTelInput({
//			autoFormat : true,
//			autoHideDialCode : false,
//			defaultCountry : "cn",
//			nationalMode : true,
//			//numberType: "MOBILE",
//			onlyCountries : [ 'cn' ],
//			responsiveDropdown : true,
//			utilsScript : "plugins/intltel/utils.js"
//		});

	};
	
	Editor.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	Editor.prototype.createLabel = function(group, id, title, classname, fors) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.className = classname;
		label.id = id;
		label.setAttribute("for", fors);
		group.appendChild(label);
		return label;
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.loadData = function(jsonobj) {

	};

	Editor.prototype.createToolbar = function(options) {
		var toolbarForm = document.createElement("form");
		toolbarForm.className = "form-inline";
		this.toolbarRow.appendChild(toolbarForm);

		var toolbarDiv = document.createElement("DIV");
		toolbarForm.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		toolbarDiv.style.padding = "2px";
		// this.createEditGroup(toolbarDiv);
		this.createUndoRedoGroup(toolbarDiv);
		// this.createNavigationGroup(toolbarDiv);
		// this.createSearchGroup(toolbarDiv);
	};

	Editor.prototype.createUndoRedoGroup = function(parent) {
		var group = this.createGroup(parent);
		this.undobutton = this.createTool(group, "undoS" + this.options.id,
				"撤销", "btn btn-default", "i", "fa fa-reply fa-lg");
		// fa-lg: 24px; fa-2x ：32px
		this.redobutton = this.createTool(group, "redoS" + this.options.id,
				"恢复", "btn btn-default", "i", "fa fa fa-share fa-lg");
		this.stack.undoButton = this.undobutton;
		this.stack.redoButton = this.redobutton;
		this.disableButton(this.undobutton);
		this.disableButton(this.redobutton);
	};

	Editor.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	Editor.prototype.createTool = function(group, id, title, style, fonttag,
			fontclass) {
		var button = document.createElement("button");
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		group.appendChild(button);
		var icon = document.createElement(fonttag);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		button.appendChild(icon);
		return button;
	};

	Editor.prototype.enableButton = function(button) {
		button.disabled = false;
	};

	Editor.prototype.disableButton = function(button) {
		button.disabled = true;
	};

	Editor.prototype.setPropertySheet = function(obj) {
		if (obj == null && this.person != null) {
			obj = this.person;
		}
		// basic property setting
		if (this.basicpropsheet != null) {
			this.basicpropsheet.tabId = this.options.id;
			this.basicpropsheet.setSheet(obj);
		}
		// advanced property setting.
		if (this.propsheet != null) {
			this.propsheet.tabId = this.options.id;
			this.propsheet.setSheet(obj);
		}
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	Editor.prototype.doChange = function(evt) {
		if (evt.target == this.input1) {
			this.stack.execute(new ValueChangedCmd(this.person, "lastName", this.input1));
		} else if (evt.target == this.input2) {
			this.stack.execute(new ValueChangedCmd(this.person, "firstName", this.input2));
		} else if (evt.target == this.fromDateInput) {
			this.stack.execute(new ValueChangedCmd(this.person, "birthday", this.fromDateInput));
		}
	};
	
	Editor.prototype.doDblClick = function(evt) {
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.undobutton
				|| evt.target.id == ("undoS" + this.options.id)) {
			this.stack.undo();
		} else if (evt.target == this.redobutton
				|| evt.target.id == ("redoS" + this.options.id)) {
			this.stack.redo();
		} else if (evt.target == this.inputM) {
			this.stack.execute(new GenderValueChangedCmd(this.person, 0, this.inputM, this.inputFM));
		} else if (evt.target == this.inputFM) {
			this.stack.execute(new GenderValueChangedCmd(this.person, 1, this.inputM, this.inputFM));
		} else if (evt.target == this.inputBS) {
			this.stack.execute(new GenderValueChangedCmd(this.person, 0, this.inputBS, this.inputMA));
		} else if (evt.target == this.inputMA) {
			this.stack.execute(new GenderValueChangedCmd(this.person, 1, this.inputBS, this.inputMA));
		}
	};

	Editor.prototype.doNextPageAction = function(pageno) {
		if (this.getDirty()) {
			this.confirmInfoDialog.show("当前列表已经修改，是否保存修改？");
		}
	};

	Editor.prototype.doYesAction = function() {
		this.options.parent.doSaveAction();
	};

	Editor.prototype.doNoAction = function() {
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Editor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};
	
})(jQuery, window, document);