/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "copyWfProcessDialog";
	var defaults = {
		id : "",
		title : "",
		topparent : "",
		owner : "",// organization ID
	};

	var CopyWfProcessDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			topparent : "",
			owner : "",// organization ID
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	CopyWfProcessDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		// this.element.appendChild(this.modalframe);

		this.modalframe.className = "modal fade";
		this.modalframe.id = "avEditorModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "ruleEditModalLabel");

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "650px"
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

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyFrameDIV.className = "container-fluid";
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);

		var bodyRow = document.createElement("div");
		dialogBodyFrameDIV.appendChild(bodyRow);
		bodyRow.className = "row";

		this.loadDialogBody(options, bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		this.saveButton = document.createElement("button");
		this.saveButton.type = "button";
		this.saveButton.id = "OK" + options.id;
		this.saveButton.name = "OK" + options.id;
		this.saveButton.className = "btn btn-primary";
		this.saveButton.innerHTML = "确定";
		this.saveButton.addEventListener("click", this, false);
		dialogFooterDIV.appendChild(this.saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "button";
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

		var dialog = $(bodyRow).alertBox({
			id : "releaseAlert" + options.id,
		});
		this.messageBox = dialog.data("alertBox");

	};

	CopyWfProcessDialog.prototype.loadDialogBody = function(options, parent) {
		var rlform = document.createElement("form");
		parent.appendChild(rlform);
		rlform.className = "form-horizontal";
		rlform.setAttribute("role", "form");
		// target folder
		var groupDiv0 = document.createElement("DIV");
		rlform.appendChild(groupDiv0);
		groupDiv0.className = "form-group";

		var folderDiv1 = document.createElement("DIV");
		groupDiv0.appendChild(folderDiv1);
		folderDiv1.className = "col-sm-12";

		folderTreeDiv1 = document.createElement("DIV");
		folderDiv1.appendChild(folderTreeDiv1);
		folderTreeDiv1.className = "panel panel-default";

		this.folderContentDiv1 = document.createElement("DIV");
		folderTreeDiv1.appendChild(this.folderContentDiv1);
		this.folderContentDiv1.className = "panel-body";
		this.folderContentDiv1.style.height = "400px";
		this.folderContentDiv1.style.margin = "0px";
		this.folderContentDiv1.style.padding = "0px";
		this.folderContentDiv1.style.overflow = "auto";

	};

	CopyWfProcessDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	// type is published folder or general folder
	CopyWfProcessDialog.prototype.show = function(source) {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true,
		});
		var arry = source.data.split("|");
		var that = this;
		// $(this.folderContentDiv1).children().remove();
		// this.instnace.jstree("refresh");
		$(this.folderContentDiv1).data('jstree', false).empty();
		$(this.folderContentDiv1).jstree({
			"core" : {
				"multiple" : false,
				"check_callback" : true,
				"data" : {
					"url" : service.api(26, arry[1]),
					"dataType" : "json"
				}
			},
		}).on('loaded.jstree', function() {
			$(this).jstree('open_all');
		}).on('select_node.jstree', function(e, data) {
			if (arry[0] == "1") { // 1 means it is orgnization ID
				that.saveButton.classList.add("disabled");
			}
		})
	};

	CopyWfProcessDialog.prototype.doClick = function(evt) {
		if (evt.target.id == "OK" + this.options.id) {
			var instance = $(this.folderContentDiv1).jstree();
			var selected = instance.get_selected(true);
			if (selected.length > 0) {
				var t = instance.get_selected(true)[0];
				var arry = t.data.split("|");
				if (arry[0] == "1") {
					this.messageBox.show(4, "该节点不能作为选择，请另选择目标目录", false);
					return;
				} else {
					this.options.parent.copyObjcets(t);
				}
			} else {
				this.messageBox.show(4, "请选择拷贝的目录", false);
				return;
			}
		}
	};

	CopyWfProcessDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$
						.data(this, pluginName, new CopyWfProcessDialog(this,
								options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);