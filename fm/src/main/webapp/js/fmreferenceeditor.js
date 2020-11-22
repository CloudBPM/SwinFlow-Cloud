/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "fmReferenceEditor";
	var defaults = {
		id : "",// form ID
		basicpropsheet : "",
		propsheet : "",
		owner : "", // org ID
		width : 0,
		height : 0,
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			basicpropsheet : "",
			propsheet : "",
			owner : "",
			width : 0,
			height : 0,
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.currObject = null;

		this.newlist = {};
		this.updatedlist = {};
		this.removedlist = {};

		this.stack = new CommandStack();
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.init(options);
		this.createToolbar(options);
		this.loadingRef(options.id);
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
		canvasPanel.id = "refPanel" + options.id;
		canvasPanel.className = "col";
		///canvasPanel.style.width = options.width + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginLeft = "0px";
		canvasPanel.style.padding = "0px";

		// Left panel for tree view
		var leftDivPane = document.createElement("DIV");
		canvasPanel.appendChild(leftDivPane);
		leftDivPane.className = "col-sm-5";
		leftDivPane.style.margin = "0px";
		leftDivPane.style.padding = "2px";

		var lPDivPane = document.createElement("DIV");
		leftDivPane.appendChild(lPDivPane);
		lPDivPane.className = "panel panel-default";
		lPDivPane.id = "convasPane" + options.id;
		lPDivPane.style.overflow = "scroll";
		lPDivPane.style.height = (options.height - 84) + "px";

		this.trvw = document.createElement("DIV");
		this.trvw.id = "detailtree" + options.id;
		this.trvw.style.boxSizing = "border-box";
		lPDivPane.appendChild(this.trvw);
		var that = this;
		this.instance = $(this.trvw).jstree({
			"core" : {
				"multiple" : false,
				"check_callback" : true,
				"data" : {
					"url" : service.api1(8, options.id),
					"dataType" : "json" // needed only if you do not
				}
			},
		}).on('activate_node.jstree', function(e, data) {// click
			var arry = data.node.data.split("|");
			that.addbutton.disabled = false;
			if (arry[0] == "x") { // reference
				that.removebutton.disabled = true;
				that.fillDetail(null);
				that.enableInputs(false);
			} else { // reference detail
				that.removebutton.disabled = false;
				that.loadingRefDtl(data.node.id);
			}
		});

		// right panel for represent class contents.
		var rightBDivPane = document.createElement("DIV");
		canvasPanel.appendChild(rightBDivPane);
		rightBDivPane.className = "col-sm-7";
		rightBDivPane.style.margin = "0px";
		rightBDivPane.style.padding = "2px";

		var rbPDivPane = document.createElement("DIV");
		rightBDivPane.appendChild(rbPDivPane);
		rbPDivPane.id = "convasRPane" + options.id;
		rbPDivPane.className = "panel panel-default";
		rbPDivPane.style.height = (options.height - 84) + "px";
		rbPDivPane.style.overflow = "auto";

		var rbPHDivPane = document.createElement("DIV");
		rbPDivPane.appendChild(rbPHDivPane);
		rbPHDivPane.className = "panel-heading";

		var rbPHHDivPane = document.createTextNode("引用数据明细");
		rbPHDivPane.appendChild(rbPHHDivPane);

		var rPane = document.createElement("DIV");
		rbPDivPane.appendChild(rPane);
		rPane.className = "panel-body";
		rPane.style.overflow = "auto";

		var formPane = document.createElement("FORM");
		rPane.appendChild(formPane);
		formPane.className = "form-horizontal";
		// code
		var group1 = document.createElement("DIV");
		formPane.appendChild(group1);
		group1.className = "form-group";

		var label1 = document.createElement("LABEL");
		group1.appendChild(label1);
		label1.setAttribute("for", "code" + options.id);
		label1.className = "col-sm-2 control-label";
		label1.innerHTML = "编号";

		var codeInputDiv = document.createElement("DIV");
		group1.appendChild(codeInputDiv);
		codeInputDiv.className = "col-sm-10";

		var inputGroup = document.createElement("DIV");
		codeInputDiv.appendChild(inputGroup);
		inputGroup.className = "input-group";

		this.codeInput = document.createElement("INPUT");
		inputGroup.appendChild(this.codeInput);
		this.codeInput.type = "text";
		this.codeInput.className = "form-control";
		this.codeInput.id = "code" + options.id;
		this.codeInput.setAttribute("placeholder", "编号必须保持唯一，不能重复");
		this.codeInput.setAttribute("required", "true");
		this.codeInput.addEventListener("blur", this, false);
		this.codeInput.addEventListener("change", this, false);

		this.helpNode = document.createElement("SPAN");
		codeInputDiv.appendChild(this.helpNode);
		this.helpNode.className = "help-block";
		this.helpNode.id = "code1" + options.id;
		this.helpNode.style.color = "red";

		var groupAddOn = document.createElement("DIV");
		inputGroup.appendChild(groupAddOn);
		groupAddOn.className = "input-group-addon";

		this.codeBtn = document.createElement("SPAN");
		groupAddOn.appendChild(this.codeBtn);
		this.codeBtn.className = "fa fa-random";
		this.codeBtn.id = "getacodeS" + options.id;
		this.codeBtn.setAttribute("title", "自动生成一个编号");

		// text
		var group2 = document.createElement("DIV");
		formPane.appendChild(group2);
		group2.className = "form-group";

		var label2 = document.createElement("LABEL");
		group2.appendChild(label2);
		label2.setAttribute("for", "text" + options.id);
		label2.className = "col-sm-2 control-label";
		label2.innerHTML = "名称";

		var textInputDiv = document.createElement("DIV");
		group2.appendChild(textInputDiv);
		textInputDiv.className = "col-sm-10";

		this.nameInput = document.createElement("INPUT");
		textInputDiv.appendChild(this.nameInput);
		this.nameInput.type = "text";
		this.nameInput.className = "form-control";
		this.nameInput.id = "text" + options.id;
		this.nameInput.setAttribute("placeholder", "请输入名称，名称不能为空");
		this.nameInput.setAttribute("required", "true");
		this.nameInput.addEventListener("blur", this, false);
		this.nameInput.addEventListener("change", this, false);
		this.helpNode1 = document.createElement("SPAN");

		textInputDiv.appendChild(this.helpNode1);
		this.helpNode1.className = "help-block";
		this.helpNode1.style.color = "red";
		this.helpNode1.id = "code2" + options.id;

		// description
		var group3 = document.createElement("DIV");
		formPane.appendChild(group3);
		group3.className = "form-group";

		var label3 = document.createElement("LABEL");
		group3.appendChild(label3);
		label3.setAttribute("for", "desc" + options.id);
		label3.className = "col-sm-2 control-label";
		label3.innerHTML = "备注";

		var descInputDiv = document.createElement("DIV");
		group3.appendChild(descInputDiv);
		descInputDiv.className = "col-sm-10";

		this.descInput = document.createElement("TEXTAREA");
		descInputDiv.appendChild(this.descInput);
		this.descInput.rows = "5";
		this.descInput.className = "form-control";
		this.descInput.id = "desc" + options.id;
		this.descInput.setAttribute("placeholder", "请输入备注");
		this.descInput.addEventListener("blur", this, false);
		this.descInput.addEventListener("change", this, false);
		// status
		var group4 = document.createElement("DIV");
		formPane.appendChild(group4);
		group4.className = "form-group";

		var label4 = document.createElement("LABEL");
		group4.appendChild(label4);
		label4.setAttribute("for", "status" + options.id);
		label4.className = "col-sm-2 control-label";
		label4.innerHTML = "状态";

		var statusRadioDiv = document.createElement("DIV");
		group4.appendChild(statusRadioDiv);
		statusRadioDiv.className = "col-sm-10";

		var label5 = document.createElement("LABEL");
		statusRadioDiv.appendChild(label5);
		label5.className = "radio-inline";

		this.useInput1 = document.createElement("INPUT");
		label5.appendChild(this.useInput1);
		this.useInput1.type = "radio";
		this.useInput1.name = "use" + options.id;
		this.useInput1.id = "use1" + options.id;
		this.useInput1.value = "1";
		this.useInput1.checked = true;
		this.useInput1.addEventListener("click", this, false);

		var useText1 = document.createTextNode("启用");
		label5.appendChild(useText1);

		var label6 = document.createElement("LABEL");
		statusRadioDiv.appendChild(label6);
		label6.className = "radio-inline";

		this.useInput2 = document.createElement("INPUT");
		label6.appendChild(this.useInput2);
		this.useInput2.type = "radio";
		this.useInput2.name = "use" + options.id;
		this.useInput2.id = "use2" + options.id;
		this.useInput2.value = "0";
		this.useInput2.addEventListener("click", this, false);

		var useText2 = document.createTextNode("禁用");
		label6.appendChild(useText2);

		this.enableInputs(false);

	};

	Editor.prototype.loadingRef = function(id) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(10), {
			id : id,
		}).complete(function(data) {
			that.loadReference(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	Editor.prototype.loadingRefDtl = function(id) {
		if (this.newlist[id] != null) {
			this.refdetail = this.newlist[id];
			this.fillDetail(this.refdetail);
			this.enableInputs(true);
		} else if (this.updatedlist[id] != null) {
			this.refdetail = this.updatedlist[id];
			this.fillDetail(this.refdetail);
			this.enableInputs(true);
		} else {
			$("#progressbar").show();
			var that = this;
			$.getJSON(service.api(11), {
				id : id,
			}).complete(function(data) {
				if (data.responseJSON != undefined) {
					that.loadReferenceDetail(data.responseJSON);
				}
				$("#progressbar").hide();
			});
		}
	};

	Editor.prototype.createRefDtlCode = function() {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(9), {}).complete(function(data) {
			that.codeInput.value = data.responseText;
			that.codeInput.dispatchEvent(new Event('change'));
			$("#progressbar").hide();
		});
	};

	Editor.prototype.addReferenceDetail = function(evt) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(2), {}).complete(function(data) {
			that.addDetail(data.responseText);
			$("#progressbar").hide();
		});
	};

	Editor.prototype.addDetail = function(id) {
		this.refdetail = new ReferenceDetail();
		this.refdetail.id = id;
		this.refdetail.name = "新数据";
		this.refdetail.description = null;
		this.refdetail.parentCode = null;
		this.refdetail.status = 1;
		this.refdetail.parent = null;
		this.refdetail.currOwner = this.currObject.id;
		this.refdetail.owner = this.currObject.owner;

		var instance = $("#detailtree" + this.options.id).jstree();
		var parent = instance.get_selected(true)[0];
		var ary = parent.data.split("|");
		if (ary != null && ary.length > 0 && ary[0] != "x") {
			this.refdetail.parentCode = ary[0];
		}
		this.refdetail.parent = parent.id;
		this.stack.execute(new FMAddReferenceCmd(this.currObject, this.newlist,
				this.refdetail));
		this.removebutton.disabled = false;
	};

	Editor.prototype.removeNewDetailFromTree = function(detail) {
		this.enableInputs(false);
		// remove a node.
		$("#detailtree" + this.options.id).jstree('deselect_all', true);
		$("#detailtree" + this.options.id).jstree('select_node', detail.id);
		var instance = $("#detailtree" + this.options.id).jstree();
		var p = instance.get_selected(true)[0];
		$("#detailtree" + this.options.id).jstree('delete_node', p);
	};

	Editor.prototype.updateDetailCode = function(id, code) {
		$("#detailtree" + this.options.id).jstree('select_node', id);
		var instance = $("#detailtree" + this.options.id).jstree();
		var p = instance.get_selected(true)[0];
		var ary = p.data.split("|");
		p.data = code + "|" + ary[1];
		instance.redraw(true);
	};

	Editor.prototype.updateDetailName = function(id, name) {
		$("#detailtree" + this.options.id).jstree('select_node', id);
		var instance = $("#detailtree" + this.options.id).jstree();
		var p = instance.get_selected(true)[0];
		p.text = name;
		instance.redraw(true);
	};

	Editor.prototype.addNewDetailToTree = function(detail) {
		this.codeInput.value = detail.code;
		this.nameInput.value = detail.name;
		this.descInput.value = detail.description;

		if (detail.status == 1) {
			this.useInput1.checked = true;
			this.useInput2.checked = false;
		} else {
			this.useInput1.checked = false;
			this.useInput2.checked = true;
		}
		var node = {
			id : detail.id,
			text : detail.name,
			data : "|" + detail.parentCode,
			icon : "glyphicon glyphicon-file",
		};
		var instance = $("#detailtree" + this.options.id).jstree();
		if (instance.get_selected(true).length == 0) {
			$("#detailtree" + this.options.id).jstree('select_node',
					detail.currOwner);
		}
		var parent = instance.get_selected(true)[0];
		instance.create_node(parent, node, "last");
		instance.redraw(true);
		$("#detailtree" + this.options.id).jstree('deselect_all', true);
		$("#detailtree" + this.options.id).jstree('select_node', node.id);
		this.enableInputs(true);
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.saveObject = function() {
		this.stack.save();
	};

	Editor.prototype.loadReference = function(jsonobj) {
		this.currObject = new Reference();
		this.currObject.parseFromJSON(jsonobj);
		this.setPropertySheet(this.currObject);
	};

	Editor.prototype.loadReferenceDetail = function(jsonobj) {
		this.refdetail = new ReferenceDetail();
		this.refdetail.parseFromJSON(jsonobj);
		this.fillDetail(this.refdetail);
		this.enableInputs(true);
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
		this.createUndoRedoGroup(toolbarDiv);
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

		var group1 = this.createGroup(parent);
		this.addbutton = this.createTool(group1, "addS" + this.options.id,
				"添加", "btn btn-default", "i", "fa fa-plus fa-lg");
		this.removebutton = this.createTool(group1,
				"removeS" + this.options.id, "移除", "btn btn-danger", "i",
				"fa fa-trash fa-lg");
		this.addbutton.disabled = true;
		this.removebutton.disabled = true;

		var group2 = this.createGroup(parent);
		this.refreshbutton = this.createTool(group2, "refreshS"
				+ this.options.id, "刷新", "btn btn-success", "i",
				"fa fa-refresh fa-lg");
	};

	Editor.prototype.fillDetail = function(detail) {
		if (detail != null) {
			this.codeInput.value = detail.code;
			this.nameInput.value = detail.name;
			this.descInput.value = detail.description;
			if (detail.status == 1) {
				this.useInput1.checked = true;
				this.useInput2.checked = false;
			} else {
				this.useInput1.checked = false;
				this.useInput2.checked = true;
			}
		} else {
			this.codeInput.value = "";
			this.nameInput.value = "";
			this.descInput.value = "";
			this.useInput1.checked = true;
			this.useInput2.checked = false;
		}
	}

	Editor.prototype.enableInputs = function(enabled) {
		if (enabled) {
			this.codeInput.disabled = false;
			this.nameInput.disabled = false;
			this.descInput.disabled = false;
			this.useInput1.disabled = false;
			this.useInput2.disabled = false;
			this.codeBtn.addEventListener("click", this, false);
		} else {
			this.codeInput.disabled = true;
			this.nameInput.disabled = true;
			this.descInput.disabled = true;
			this.useInput1.disabled = true;
			this.useInput2.disabled = true;
			this.codeBtn.removeEventListener("click", this);
		}
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
		icon.setAttribute("aria-hidden", "true");
		icon.id = id;
		button.appendChild(icon);
		return button;
	};

	Editor.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	Editor.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	Editor.prototype.setPropertySheet = function() {
		var obj = this.currObject;
		if (this.basicpropsheet != null) {
			this.basicpropsheet.setSheet(obj, this.currObject);
		}
		if (this.propsheet != null) {
			this.propsheet.setSheet(obj, this.currObject, this.propsheet
					.getCurrTabIndex(obj));
		}
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		case "blur":
			this.doBlur(e);
			break;
		}
	};

	Editor.prototype.doChange = function(evt) {
		if (evt.target.id == "code" + this.options.id) {
			if (evt.target.value == "") {
				evt.target.focus();
				this.helpNode.textContent = "编号不能为空，必须填写一个唯一编号";
				return false;
			} else {
				this.helpNode.textContent = "";
			}
			this.stack.execute(new FMReferenceDetailUpdatedCmd(this.refdetail,
					"code",
					document.getElementById("code" + this.options.id).value,
					this.currObject));
		} else if (evt.target.id == "text" + this.options.id) {
			if (evt.target.value == "") {
				evt.target.focus();
				this.helpNode1.textContent = "名称不能为空";
				return false;
			} else {
				this.helpNode1.textContent = "";
			}
			this.stack.execute(new FMReferenceDetailUpdatedCmd(this.refdetail,
					"name",
					document.getElementById("text" + this.options.id).value,
					this.currObject));
		} else if (evt.target.id == "desc" + this.options.id) {
			this.stack.execute(new FMReferenceDetailUpdatedCmd(this.refdetail,
					"description", document.getElementById("desc"
							+ this.options.id).value, this.currObject));
		}
	};

	Editor.prototype.doBlur = function(evt) {
		if (evt.target.id == "code" + this.options.id) {
			if (evt.target.value == "") {
				evt.target.focus();
				this.helpNode.textContent = "编号不能为空，必须填写一个唯一编号";
				return false;
			} else
				this.helpNode.textContent = "";
		} else if (evt.target.id == "text" + this.options.id) {
			if (evt.target.value == "") {
				evt.target.focus();
				this.helpNode1.textContent = "名称不能为空";
				return false;
			} else
				this.helpNode1.textContent = "";
		}
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.codeBtn
				|| evt.target.id == ("getacodeS" + this.options.id)) {
			this.createRefDtlCode();
		} else if (evt.target == this.addbutton
				|| evt.target.id == ("addS" + this.options.id)) {
			this.addReferenceDetail(evt);
		} else if (evt.target == this.removebutton
				|| evt.target.id == ("removeS" + this.options.id)) {
			this.stack.execute(new FMRemoveReferenceCmd(this.currObject,
					this.refdetail));
		} else if (evt.target == this.refreshbutton
				|| evt.target.id == ("refreshS" + this.options.id)) {

		} else if (evt.target == this.useInput1
				|| evt.target.id == ("use1" + this.options.id)) {
			this.stack.execute(new FMReferenceDetailUpdatedCmd(this.refdetail,
					"status", "1", this.currObject));
		} else if (evt.target == this.useInput2
				|| evt.target.id == ("use2" + this.options.id)) {
			this.stack.execute(new FMReferenceDetailUpdatedCmd(this.refdetail,
					"status", "0", this.currObject));
		} else if (evt.target == this.undobutton
				|| (evt.target.id == ("undoS" + this.options.id))) {
			this.stack.undo();
		} else if (evt.target == this.redobutton
				|| (evt.target.id == ("redoS" + this.options.id))) {
			this.stack.redo();
		}
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
