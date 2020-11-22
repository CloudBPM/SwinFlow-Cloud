/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "setEmailTemplateEditDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
	};

	var SetEmailTemplateEditDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.currOwner = options.currowner;
		this.init(options);
	};

	SetEmailTemplateEditDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		this.modalframe.className = "modal fade";
		this.modalframe.id = "avEditorModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "ruleEditModalLabel");

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "1000px"
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		modaldialogDIV.appendChild(dialogContentDIV);

		// dialog heading
		var dialogHeaderDIV = document.createElement("div");
		dialogHeaderDIV.className = "modal-header";
		dialogContentDIV.appendChild(dialogHeaderDIV);

		var closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");

		var closeSpan = document.createElement("span");
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";
		closeButton.appendChild(closeSpan);
		dialogHeaderDIV.appendChild(closeButton);

		var titleH4 = document.createElement("h4");
		titleH4.className = "modal-title";
		titleH4.id = "editModalLabel" + options.entity.id;
		dialogHeaderDIV.appendChild(titleH4);

		var infoIcon = document.createElement("i");
		infoIcon.className = "fa fa-pencil-square fa-lg";
		infoIcon.style.color = "green";
		titleH4.appendChild(infoIcon);

		var info = document.createElement("label");
		info.innerHTML = options.title;
		titleH4.appendChild(info);

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);

		var dialogBodyDIV = document.createElement("div");
		dialogBodyDIV.className = "modal-body";
		dialogForm.appendChild(dialogBodyDIV);

		this.createBody(dialogBodyDIV, options);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		var saveButton = document.createElement("button");
		saveButton.type = "button";
		saveButton.id = "OK" + options.id;
		saveButton.name = "OK" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.innerHTML = "确定";
		saveButton.addEventListener("click", this, false);
		dialogFooterDIV.appendChild(saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "button";
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

	};

	SetEmailTemplateEditDialog.prototype.createBody = function(parent, options) {
		var bodyRow1 = document.createElement("div");
		parent.appendChild(bodyRow1);
		bodyRow1.className = "row";
		
		var subjDiv = document.createElement("DIV");
		subjDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		bodyRow1.appendChild(subjDiv);

		var groupDiv = document.createElement("DIV");
		subjDiv.appendChild(groupDiv);
		groupDiv.className = "form-group";
		
		this.subjectInput = document.createElement("INPUT");
		groupDiv.appendChild(this.subjectInput);
		this.subjectInput.className = "form-control";
		this.subjectInput.setAttribute("placeholder", "请输入邮件标题");
		this.subjectInput.addEventListener("change", this, false);
		
		var bodyRow2 = document.createElement("div");
		parent.appendChild(bodyRow2);
		bodyRow2.className = "row";

		var editorDiv = document.createElement("DIV");
		bodyRow2.appendChild(editorDiv);
		editorDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		
		var groupDiv1 = document.createElement("DIV");
		editorDiv.appendChild(groupDiv1);
		groupDiv1.className = "form-group";

		this.tplEidtor = document.createElement("DIV");
		groupDiv1.appendChild(this.tplEidtor);
		this.tplEidtor.id = "tempeditor";
		//this.tplEidtor.addEventListener("change", this, false);

		if (this.editor == null || this.editor == undefined) {
			this.editor = CKEDITOR.replace("tempeditor", {
				language : 'zh-cn',
			});
			var that = this;
			this.editor.on('change', function() {
				// that.doChangeContent();
			});
		}

		var bodyRow3 = document.createElement("div");
		parent.appendChild(bodyRow3);
		bodyRow3.className = "row";

		var attachPane = document.createElement("DIV");
		bodyRow3.appendChild(attachPane);
		attachPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		attachPane.style.marginTop = "2px";

		this.formPane = document.createElement("DIV");
		attachPane.appendChild(this.formPane);
		this.formPane.className = "form-control";
		this.formPane.style.overflow = "auto";
		this.formPane.style.height = "150px";
	};

	// entity is EmailSendingTask in wfprocess
	// currOwner is wfprocess object
	SetEmailTemplateEditDialog.prototype.setEntity = function(entity, currOwner) {
		this.entity = entity.cloneTemplate();
		this.subjectInput.value = this.entity.subject;
		this.currOwner = currOwner;
		if (this.editor != null)
			this.editor.setData(this.entity.template);
		this.refershAttachments(this.entity);
	};

	SetEmailTemplateEditDialog.prototype.refershAttachments = function(entity) {
		$(this.formPane).children().remove();
		this.addAttachment(this.formPane, entity.attachments)
		this.addFileVariable(this.formPane, entity.variables);
		this.setAddICON(this.formPane);
	};

	SetEmailTemplateEditDialog.prototype.addAttachment = function(parent,
			attachments) {
		if (attachments != null && attachments.length > 0) {
			for (var i = 0; i < attachments.length; i++) {
				this.setAttachmentICON(parent, attachments[i]);
			}
		}
	};

	SetEmailTemplateEditDialog.prototype.addFileVariable = function(parent,
			variables) {
		if (variables != null && variables.length > 0) {
			for (var i = 0; i < variables.length; i++) {
				if (variables[i] instanceof DataVariable
						&& (variables[i].datatype == "File" || variables[i].datatype == "file")) {
					this.setFileICON(parent, variables[i]);
				}
			}
		}
	};

	SetEmailTemplateEditDialog.prototype.setAttachmentICON = function(parent,
			fc) {
		var mainDiv = document.createElement("DIV");
		parent.appendChild(mainDiv);
		mainDiv.style.margin = "20px";
		mainDiv.style.width = "64px";
		mainDiv.style.height = "64px";
		mainDiv.id = "div" + fc.id;
		if (Utils.isIE() == 1) {
			mainDiv.style.styleFloat = "left";
		} else {
			mainDiv.style.cssFloat = "left";
		}

		var panelToolbar = document.createElement("UL");
		mainDiv.appendChild(panelToolbar);
		panelToolbar.className = "nav navbar-nav navbar-right";
		panelToolbar.style.paddingRight = "1px";

		var delDiv = document.createElement("DIV");
		panelToolbar.appendChild(delDiv);
		this.createToolbarItem(panelToolbar, "del_" + fc.id, "删除",
				"glyphicon glyphicon-minus", "btn btn-danger btn-xs", "f");

		var box = document.createElement("DIV");
		mainDiv.appendChild(box);
		box.style.width = "64px";
		box.style.height = "64px";
		box.style.display = "block";
		box.style.display = "table-cell";
		box.style.verticalAlign = "middle";
		box.id = "box" + fc.id;

		var img = document.createElement("IMG");
		box.appendChild(img);
		img.id = "img" + fc.id;
		img.title = fc.name;
		img.style.width = "64px";
		img.style.height = "64px";
		var suffix = fc.suffix;// 获取文件后缀
		if (suffix == "avi" || suffix == "bmp" || suffix == "doc"
				|| suffix == "docx" || suffix == "fla" || suffix == "gif"
				|| suffix == "html" || suffix == "jpeg" || suffix == "jpg"
				|| suffix == "jsf" || suffix == "midi" || suffix == "mov"
				|| suffix == "mp3" || suffix == "mpeg" || suffix == "pdf"
				|| suffix == "png" || suffix == "ppt" || suffix == "pptx"
				|| suffix == "proj" || suffix == "psd" || suffix == "pst"
				|| suffix == "pub" || suffix == "rar" || suffix == "xml"
				|| suffix == "txt" || suffix == "wav" || suffix == "wma"
				|| suffix == "wmv" || suffix == "xls" || suffix == "xlsx"
				|| suffix == "zip") {
			img.src = this.options.parent.imgurl + suffix + ".png";
		} else {
			img.src = this.options.parent.imgurl + "other.png";
		}

		var title = document.createElement("DIV");
		mainDiv.appendChild(title);
		title.id = "title" + fc.id;
		if (fc.name.length > 5) {
			var ff = fc.name.substring(0, 5) + "...";
			title.innerHTML = "<p>" + ff + "</p>";
		} else {
			title.innerHTML = "<p>" + fc.name + "</p>";
		}
	};

	SetEmailTemplateEditDialog.prototype.setFileICON = function(parent,
			variable) {
		var mainDiv = document.createElement("DIV");
		parent.appendChild(mainDiv);
		mainDiv.style.margin = "20px";
		mainDiv.style.width = "64px";
		mainDiv.style.height = "64px";
		mainDiv.id = "div" + variable.id;
		if (Utils.isIE() == 1) {
			mainDiv.style.styleFloat = "left";
		} else {
			mainDiv.style.cssFloat = "left";
		}

		var panelToolbar = document.createElement("UL");
		mainDiv.appendChild(panelToolbar);
		panelToolbar.className = "nav navbar-nav navbar-right";
		panelToolbar.style.paddingRight = "1px";

		var delDiv = document.createElement("DIV");
		panelToolbar.appendChild(delDiv);
		this.createToolbarItem(panelToolbar, "del_" + variable.id, "删除",
				"glyphicon glyphicon-minus", "btn btn-danger btn-xs", "v");

		var box = document.createElement("DIV");
		mainDiv.appendChild(box);
		box.style.width = "64px";
		box.style.height = "64px";
		box.style.display = "block";
		box.style.display = "table-cell";
		box.style.verticalAlign = "middle";
		box.id = "box" + variable.id;

		var img = document.createElement("IMG");
		box.appendChild(img);
		img.id = "img" + variable.id;
		img.title = variable.name;
		img.style.width = "64px";
		img.style.height = "64px";
		img.src = this.options.parent.imgurl + "other.png";

		var title = document.createElement("DIV");
		mainDiv.appendChild(title);
		title.id = "title" + variable.id;
		if (variable.name.length > 5) {
			var ff = variable.name.substring(0, 5) + "...";
			title.innerHTML = "<p>" + ff + "</p>";
		} else {
			title.innerHTML = "<p>" + variable.name + "</p>";
		}
	};

	SetEmailTemplateEditDialog.prototype.setAddICON = function(parent) {
		var mainDiv = document.createElement("DIV");
		parent.appendChild(mainDiv);
		mainDiv.style.margin = "20px";
		mainDiv.id = "div" + "";
		if (Utils.isIE() == 1) {
			mainDiv.style.styleFloat = "left";
		} else {
			mainDiv.style.cssFloat = "left";
		}

		var delDiv = document.createElement("DIV");
		mainDiv.appendChild(delDiv);
		var panelToolbar = document.createElement("UL");
		delDiv.appendChild(panelToolbar);
		panelToolbar.className = "nav navbar-nav navbar-right";
		panelToolbar.style.paddingRight = "1px";

		this.createToolbarItem(panelToolbar, "add_", "添加",
				"glyphicon glyphicon-plus", "btn btn-success btn-xs", "x");

		var box = document.createElement("DIV");
		mainDiv.appendChild(box);
		box.style.width = "64px";
		box.style.height = "64px";
		box.style.display = "block";
		box.style.display = "table-cell";
		box.style.verticalAlign = "middle";
		box.id = "box" + "";

		var img = document.createElement("IMG");
		box.appendChild(img);
		img.id = "img_" + "";
		img.title = "添加新的文件变量";
		img.style.width = "64px";
		img.style.height = "64px";
		img.src = this.options.parent.imgurl + "clip.jpg";
		img.addEventListener("click", this, false);
		img.addEventListener('dragover', this, false);
		img.addEventListener('drop', this, false);
	};

	SetEmailTemplateEditDialog.prototype.createToolbarItem = function(parent,
			id, title, icon, classname, t) {
		var toolItem = document.createElement("li");
		toolItem.style.padding = "0px";
		parent.appendChild(toolItem);
		var toolButton = document.createElement("button");
		toolItem.appendChild(toolButton);
		toolButton.type = "button";
		toolButton.id = id;
		toolButton.className = classname;
		toolButton.setAttribute("title", title);
		toolButton.addEventListener("click", this, false);
		toolButton.setAttribute("tp", t);
		var toolSpan = document.createElement("span");
		toolSpan.className = icon;
		toolSpan.id = id;
		toolSpan.setAttribute("tp", t);
		toolButton.appendChild(toolSpan);
		return toolButton;
	};

	SetEmailTemplateEditDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	SetEmailTemplateEditDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true,
		});
	};
	
	SetEmailTemplateEditDialog.prototype.doChange = function(evt) {
		if (evt.target == this.subjectInput) {
			this.entity.subject = this.subjectInput.value;
		}
	};

	SetEmailTemplateEditDialog.prototype.doClick = function(evt) {
		if (evt.target.id == "OK" + this.options.id) {
			this.entity.template = this.editor.getData();
			if (this.options.parent.doChangeTemplate != undefined) {
				this.options.parent.doChangeTemplate(this.entity);
			}
			this.hide();
		} else if (evt.target.id.indexOf("del_") == 0) {
			var id = evt.target.id.substring(evt.target.id.indexOf("_") + 1,
					evt.target.id.length);
			if (evt.target.getAttribute("tp") == "f") {
				for (var j = 0; j < this.entity.attachments.length; j++) {
					if (this.entity.attachments[j].id == id) {
						this.entity.attachments.splice(j, 1);
						break;
					}
				}
			} else if (evt.target.getAttribute("tp") == "v") {
				for (var j = 0; j < this.entity.variables.length; j++) {
					if (this.entity.variables[j].id == id) {
						this.entity.variables.splice(j, 1);
						break;
					}
				}
			}
			this.refershAttachments(this.entity);
		} else if (evt.target.id.indexOf("add_") == 0
				|| evt.target.id.indexOf("img_") == 0) {
			if (this.varSelDialog == null) {
				var p3 = $(this.element).variableSelectDialog({
					id : "016100",
					title : "轩琦科技 - 选择变量",
					parent : this,
					entity : this.entity,
					currOwner : this.currOwner,
				});
				this.varSelDialog = p3.data("variableSelectDialog");
			}
			this.varSelDialog.show();
		}
	};

	SetEmailTemplateEditDialog.prototype.setSelectedVariables = function(v) {
		this.entity.variables = v;
		this.refershAttachments(this.entity);
	};

	SetEmailTemplateEditDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new SetEmailTemplateEditDialog(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);