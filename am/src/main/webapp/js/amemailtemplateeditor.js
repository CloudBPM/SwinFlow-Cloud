/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "amEmailTemplateEditor";
	var defaults = {
		id : "", // process ID
		basicpropsheet : "",
		propsheet : "",
		owner : "", // organization ID
		width : 0,
		height : 0,
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "", // process ID
			basicpropsheet : "",
			propsheet : "",
			owner : "", // organization ID
			width : 0,
			height : 0,
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.currObject = null;
		this.stack = new CommandStack();
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.init(options);
		this.createToolbar(options);
		this.loading(options.id);
	};

	Editor.prototype.init = function(options) {
		var editorPanel = document.createElement("DIV");
		this.element.appendChild(editorPanel);
		editorPanel.style.margin = "0px";
		editorPanel.style.padding = "0px";
		editorPanel.style.overflow = "auto";
		this.toolbarRow = document.createElement("DIV");
		editorPanel.appendChild(this.toolbarRow);
		this.toolbarRow.className = "row";
		this.toolbarRow.style.margin = "0px";
		this.toolbarRow.style.padding = "0px";
		var painterRow = document.createElement("DIV");
		editorPanel.appendChild(painterRow);
		painterRow.className = "row";
		painterRow.style.margin = "0px";
		painterRow.style.padding = "0px";

		var canvasPanel = document.createElement("DIV");
		painterRow.appendChild(canvasPanel);
		canvasPanel.id = "accAppPane3Div4" + options.id;
		canvasPanel.className = "col";
		canvasPanel.style.width = options.width + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginLeft = "0px";
		canvasPanel.style.padding = "0px";

		var subjectDivPane = document.createElement("DIV");
		subjectDivPane.className = "form-group";
		canvasPanel.appendChild(subjectDivPane);
		this.subjectEidtor = document.createElement("textarea");
		this.subjectEidtor.className = "form-control";
		this.subjectEidtor.setAttribute("placeholder",
				"请输入一个邮件的标题（Subject）.....")
		this.subjectEidtor.addEventListener("change", this, false);
		subjectDivPane.appendChild(this.subjectEidtor);

		var contentDivPane = document.createElement("DIV");
		canvasPanel.appendChild(contentDivPane);
		contentDivPane.className = "form-group";

		this.templateEidtor = document.createElement("textarea");
		contentDivPane.appendChild(this.templateEidtor);
		this.templateEidtor.className = "form-control";
		this.templateEidtor.id = "emailEditorPane" + options.id;
		this.templateEidtor.addEventListener("change", this, false);
		this.templateEidtor.style.height = (this.options.height - 280) + "px";
		this.templateEidtor.setAttribute("placeholder",
				"请输入邮件模板内容，该模板将可被用于发送邮件。");

		var p3 = $(editorPanel).setTestingDialog({
			id : "0162",
			title : "轩琦科技 - 测试",
			parent : this,
		});
		this.setTestingDialog = p3.data("setTestingDialog");

		var p2 = $(editorPanel).messageDialog({
			id : "0163",
			title : "轩琦科技 - 提示",
			parent : this,
		});
		this.messageDialog = p2.data("messageDialog");

	};

	Editor.prototype.loading = function(id) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(6), {
			id : id,
		}).complete(function(data) {
			that.loadData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.saveObject = function() {
		this.stack.save();
	};

	Editor.prototype.loadData = function(jsonobj) {
		this.enditorInstance = CKEDITOR.replace(this.templateEidtor.id, {
			language : 'zh-cn',
			height : this.options.height - 280,
		})
		var that = this;
		this.enditorInstance.on('change', function() {
			that.doChangeContent();
		});
		this.currObject = new EmailTemplate();
		this.currObject.parse(jsonobj);
		// active: 表示该按钮被按过了
		if (this.currObject.status == 0) {
			this.wdbutton.classList.add("active");
		} else if (this.currObject.status == 1) {
			this.rlbutton.classList.add("active");
		}
		this.templateEidtor.value = this.currObject.emailContent;
		this.setPropertySheet();
	};

	Editor.prototype.createToolbar = function(options) {
		var parent = document.createElement("form");
		this.toolbarRow.appendChild(parent);
		parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		parent.style.margin = "0px";
		parent.style.padding = "2px";

		this.createUndoRedoGroup(parent);

		var c = "btn btn-default";
		var group2 = this.createGroup(parent);
		this.sendtestbutton = this.createTool(group2, "sendTest"
				+ this.options.id, "发送测试邮件", "btn btn-default fa-lg", "i",
				"fa fa-paper-plane");

		var g3 = this.createGroup(parent);
		this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
				c, "i", "fa fa-print fa-lg");

		var g7 = this.createGroup(parent);
		this.rlbutton = this.createTool(g7, "release" + this.options.id, "上线",
				c, "i", "fa fa-cloud-upload fa-lg");
		this.wdbutton = this.createTool(g7, "widthdraw" + this.options.id,
				"下线", c, "i", "fa fa-cloud-download fa-lg");

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
		button.removeAttribute("disabled");
	};

	Editor.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	Editor.prototype.setPropertySheet = function() {
		this.subjectEidtor.value = this.currObject.emailSubject;
		// basic property setting
		if (this.basicpropsheet != null) {
			this.basicpropsheet.setSheet(this.currObject);
		}
		// advanced property setting.
		if (this.propsheet != null) {
			this.propsheet.setSheet(this.currObject);
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
		}
	};

	Editor.prototype.doChangeContent = function() {
		map[this.currObject.id].stack.execute(new AMCKEditorCotentChangedCmd(
				this.currObject));
	};

	Editor.prototype.doChange = function(evt) {
		var oldvalue = this.currObject.emailSubject;
		var newvalue = $(this.subjectEidtor).val();
		if (newvalue != oldvalue) {
			map[this.currObject.id].stack.execute(new AMValueChangedCmd(
					this.currObject, "emailSubject", newvalue));
		} else {
			$(this.subjectEidtor).val(oldvalue);
		}
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.undobutton
				|| (evt.target.id == ("undoS" + this.options.id))) {
			this.stack.undo();
		} else if (evt.target == this.redobutton
				|| (evt.target.id == ("redoS" + this.options.id))) {
			this.stack.redo();
		} else if (evt.target == this.printbutton
				|| evt.target.id == ("print" + this.options.id)) {
			console.log("5");
		} else if (evt.target == this.rlbutton
				|| evt.target.id == ("release" + this.options.id)) {
			var that = this;
			$("#progressbar").show();
			$.post(service.api(25), {
				id : this.options.id,
				status : 1,
				ctype : 2,
				lastupdate : Utils.getCurrentDateTime(),
			}, function(data) {
				that.currObject.status = 1;
				that.rlbutton.classList.add("active");
				that.wdbutton.classList.remove("active");
				that.setPropertySheet();
				$("#progressbar").hide();
			});
		} else if (evt.target == this.wdbutton
				|| evt.target.id == ("widthdraw" + this.options.id)) {
			var that = this;
			$("#progressbar").show();
			$.post(service.api(25), {
				id : this.options.id,
				status : 0,
				ctype : 2,
				lastupdate : Utils.getCurrentDateTime(),
			}, function(data) {
				that.currObject.status = 0;
				that.rlbutton.classList.remove("active");
				that.wdbutton.classList.add("active");
				that.setPropertySheet();
				$("#progressbar").hide();
			});
		} else if (evt.target == this.sendtestbutton
				|| evt.target.id == ("sendTest" + this.options.id)) {
			this.setTestingDialog.show(2);
		}
	};

	Editor.prototype.doTestAction = function(o) {
		var that = this;
		$("#progressbar").show();
		$.post(service.api(27), {
			oid : this.options.owner,
			id : this.options.id,
			to : o,
			subj : this.subjectEidtor.value,
			content : this.enditorInstance.getData(),
		}, function(data) {
			if (data.status == "1") {
				that.messageDialog.show("发送成功！");
			} else {
				that.messageDialog.show("发送失败！");
			}
			$("#progressbar").hide();
		});
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
