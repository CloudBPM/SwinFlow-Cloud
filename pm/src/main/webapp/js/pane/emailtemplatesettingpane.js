/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "emailTemplateSettingPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var TemplateSettingPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this.imgurl = "http://localhost:8080/api/img/icons/";
		this._name = pluginName;
		this.topparent = options.topparent;
		this.templates = [];
		this.init(options);
	};

	TemplateSettingPanel.prototype.init = function(options) {
		this.entity = options.entity;
		var modalframe = document.createElement("DIV");
		this.element.appendChild(modalframe);
		modalframe.style.margin = "2px";
		modalframe.className = "panel panel-default";

		var tpBodyDiv = document.createElement("div");
		modalframe.appendChild(tpBodyDiv);
		tpBodyDiv.className = "panel-body";

		var urlform = document.createElement("form");
		tpBodyDiv.appendChild(urlform);
		urlform.className = "form-horizontal";
		urlform.setAttribute("role", "form");

		var groupDiv = document.createElement("DIV");
		urlform.appendChild(groupDiv);
		groupDiv.className = "form-group";
		var urlLabel = document.createElement("label");
		groupDiv.appendChild(urlLabel);
		urlLabel.setAttribute("for", "urlvalue" + options.id);
		urlLabel.className = "col-sm-2 control-label";
		urlLabel.innerHTML = "电邮模板列表";

		var selDiv = document.createElement("DIV");
		selDiv.className = "col-sm-10";
		groupDiv.appendChild(selDiv);
		this.templateList = document.createElement("select");
		selDiv.appendChild(this.templateList);
		this.templateList.className = "form-control";
		this.templateList.addEventListener("change", this, false);

		var groupDiv1 = document.createElement("DIV");
		urlform.appendChild(groupDiv1);
		groupDiv1.className = "form-group";

		var tempDiv = document.createElement("DIV");
		tempDiv.className = "col-sm-10";
		groupDiv1.appendChild(tempDiv);

		var contentPanelDiv = document.createElement("DIV");
		contentPanelDiv.className = "panel panel-default";
		tempDiv.appendChild(contentPanelDiv);

		this.templateViewer = document.createElement("div");
		contentPanelDiv.appendChild(this.templateViewer);
		this.templateViewer.id = "viewer" + this.entity.id;
		this.templateViewer.className = "panel-body";
		this.templateViewer.style.height = "280px";
		this.templateViewer.style.overflow = "auto";

		var attachDiv = document.createElement("DIV");
		attachDiv.className = "col-sm-2";
		groupDiv1.appendChild(attachDiv);

		var attachPanelDiv = document.createElement("DIV");
		attachPanelDiv.className = "panel panel-default";
		attachDiv.appendChild(attachPanelDiv);

		this.attBodyDiv = document.createElement("div");
		attachPanelDiv.appendChild(this.attBodyDiv);
		this.attBodyDiv.className = "panel-body";
		this.attBodyDiv.style.height = "280px";
		this.attBodyDiv.style.overflow = "auto";

		var p3 = $(this.element).setEmailTemplateEditDialog({
			id : "01699",
			title : "轩琦科技 - 设置邮件模板",
			parent : this,
			entity : this.entity,
		});
		this.setEmlTplDialog = p3.data("setEmailTemplateEditDialog");

		this.loadingData(this.entity);
	};

	TemplateSettingPanel.prototype.loadingData = function(entity) {
		if (this.options.currowner instanceof WfProcess) {
			this.templateList.disabled = false;
		} else {
			this.templateList.disabled = true;
		}
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(32, entity.owner), {}).complete(function(data) {
			if (data != undefined && data.responseJSON != undefined) {
				that.loadData(entity, data.responseJSON);
			}
			$("#progressbar").hide();
		});
	};

	// entity is EmailSendingTask in wfprocess
	TemplateSettingPanel.prototype.loadData = function(entity, templates) {
		$(this.templateList).find('option').remove();
		this.addOptions(this.templateList, "-请选择-", "-1", 0);
		if (templates != null && templates.length > 0) {
			for (var i = 0; i < templates.length; i++) {
				this.templates[i] = new EmailTemplate();
				this.templates[i].parse(templates[i]);
				this.addOptions(this.templateList, this.templates[i].name,
						this.templates[i].id, i + 1);
			}
			if (entity.templateId != undefined) {
				this.templateList.value = entity.templateId;
			}
		}
		this.templateViewer.innerHTML = entity.template;
		this.addAttachment(this.attBodyDiv, entity.attachments);
		this.addFileVariable(this.attBodyDiv, entity.variables);
	};

	TemplateSettingPanel.prototype.addAttachment = function(parent, attachments) {
		if (attachments != null && attachments.length > 0) {
			for (var i = 0; i < attachments.length; i++) {
				this.setAttachmentICON(parent, attachments[i]);
			}
		}
	};

	TemplateSettingPanel.prototype.addFileVariable = function(parent, variables) {
		if (variables != null && variables.length > 0) {
			for (var i = 0; i < variables.length; i++) {
				if (variables[i] instanceof ArrayDataVariable
						&& variables[i].values != null) {
					for (var j = 0; j < variables[i].values.length; j++) {
						if (variables[i].values[j] instanceof FileConstant)
							this.setAttachmentICON(parent,
									variables[i].values[j]);
					}
				} else if (variables[i] instanceof DataVariable) {
					if (variables[i].value instanceof FileConstant) {
						this.setAttachmentICON(parent, variables[i].value);
					}
				}

			}
		}
	};

	TemplateSettingPanel.prototype.setAttachmentICON = function(parent, fc) {
		var mainDiv = document.createElement("DIV");
		parent.appendChild(mainDiv);
		mainDiv.style.margin = "20px";
		mainDiv.id = "div" + fc.id;
		if (Utils.isIE() == 1) {
			mainDiv.style.styleFloat = "left";
		} else {
			mainDiv.style.cssFloat = "left";
		}

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
			img.src = this.imgurl + suffix + ".png";
		} else {
			img.src = this.imgurl + "other.png";
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

	TemplateSettingPanel.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	TemplateSettingPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	TemplateSettingPanel.prototype.doChangeTemplate = function(newentity) {
		// map[this.options.currowner.id].stack
		// .execute(new PMCKEditorCotentChangedCmd(this.entity, this));
		map[this.options.currowner.id].stack
				.execute(new PMEmailTemplateEditedCmd(this.entity, newentity,
						this.options.currowner));
	};

	TemplateSettingPanel.prototype.doChange = function(evt) {
		if (evt.target == this.templateList) {
			if (this.templateList.value != "-1") {
				for (var i = 0; i < this.templates.length; i++) {
					if (this.templates[i].id == this.templateList.value) {
						// this.editor.setData(this.templates[i].emailContent);
						map[this.options.currowner.id].stack
								.execute(new PMEmailTemplateChangedCmd(
										this.entity, this.templates[i],
										this.options.currowner));
						break;
					}
				}
			}
		}
	};

	TemplateSettingPanel.prototype.addRow = function(evt) {
	};

	TemplateSettingPanel.prototype.modifyRow = function(evt) {
		if (this.setEmlTplDialog != null && this.entity.templateId != null) {
			this.setEmlTplDialog.setEntity(this.entity, this.options.currowner);
			this.setEmlTplDialog.show();
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new TemplateSettingPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);