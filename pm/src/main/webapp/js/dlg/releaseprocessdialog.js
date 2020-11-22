/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "releaseWfProcessDialog";
	var defaults = {
		id : "",
		title : "",
		topparent : "",
		owner : "",// organization ID
		uid: "",
		uname: "",
	};

	var ReleaseProcessDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			topparent : "",
			owner : "",// organization ID
			uid: "",
			uname: "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	ReleaseProcessDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

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

		var dialog = $(bodyRow).alertBox({
			id : "releaseAlert" + options.id,
		});
		this.messageBox = dialog.data("alertBox");

	};

	ReleaseProcessDialog.prototype.loadDialogBody = function(options, parent) {
		var rlform = document.createElement("form");
		parent.appendChild(rlform);
		rlform.className = "form-horizontal";
		rlform.setAttribute("role", "form");
		// released process name
		var groupDiv1 = document.createElement("DIV");
		rlform.appendChild(groupDiv1);
		groupDiv1.className = "form-group";
		var nameLabel = document.createElement("label");
		groupDiv1.appendChild(nameLabel);
		nameLabel.className = "col-sm-3 control-label";
		nameLabel.innerHTML = "流程名称";

		var nameDiv1 = document.createElement("DIV");
		groupDiv1.appendChild(nameDiv1);
		nameDiv1.className = "col-sm-9";
		this.procName = document.createElement("input");
		nameDiv1.appendChild(this.procName);
		this.procName.className = "form-control";
		this.procName.readOnly = true;
		// target folder
		var groupDiv0 = document.createElement("DIV");
		rlform.appendChild(groupDiv0);
		groupDiv0.className = "form-group";
		var fodlerLabel = document.createElement("label");
		groupDiv0.appendChild(fodlerLabel);
		fodlerLabel.className = "col-sm-3 control-label";
		fodlerLabel.innerHTML = "发布目录";

		var folderDiv1 = document.createElement("DIV");
		groupDiv0.appendChild(folderDiv1);
		folderDiv1.className = "col-sm-9";

		folderTreeDiv1 = document.createElement("DIV");
		folderDiv1.appendChild(folderTreeDiv1);
		folderTreeDiv1.className = "panel panel-default";

		this.folderContentDiv1 = document.createElement("DIV");
		folderTreeDiv1.appendChild(this.folderContentDiv1);
		this.folderContentDiv1.className = "panel-body";
		this.folderContentDiv1.style.height = "100px";
		this.folderContentDiv1.style.margin = "0px";
		this.folderContentDiv1.style.padding = "0px";
		this.folderContentDiv1.style.overflow = "auto";

		var that = this;
		var instance = $(this.folderContentDiv1).jstree({
			"core" : {
				"multiple" : false,
				"check_callback" : true,
				"data" : {
					"url" : service.api(21, that.options.owner),
					"dataType" : "json"
				}
			},
		}).on('select_node.jstree', function(e, data) {
			if (data.node.data != "") {
			}
		});
		// release version
		var groupDiv2 = document.createElement("DIV");
		rlform.appendChild(groupDiv2);
		groupDiv2.className = "form-group";
		var verLabel = document.createElement("label");
		groupDiv2.appendChild(verLabel);
		verLabel.className = "col-sm-3 control-label";
		verLabel.innerHTML = "发布版本";

		var verDiv1 = document.createElement("DIV");
		groupDiv2.appendChild(verDiv1);
		verDiv1.className = "col-sm-9";
		this.verNo = document.createElement("input");
		verDiv1.appendChild(this.verNo);
		this.verNo.className = "form-control";
		// release note
		var groupDiv3 = document.createElement("DIV");
		rlform.appendChild(groupDiv3);
		groupDiv3.className = "form-group";
		var descLabel = document.createElement("label");
		groupDiv3.appendChild(descLabel);
		descLabel.className = "col-sm-3 control-label";
		descLabel.innerHTML = "发布声明";

		var noteDiv = document.createElement("DIV");
		groupDiv3.appendChild(noteDiv);
		noteDiv.className = "col-sm-9";
		this.verNote = document.createElement("textarea");
		this.verNote.setAttribute("rows", "8");
		noteDiv.appendChild(this.verNote);
		this.verNote.className = "form-control";

		// releaser organization
		var groupDiv4 = document.createElement("DIV");
		rlform.appendChild(groupDiv4);
		groupDiv4.className = "form-group";
		var rlrLabel = document.createElement("label");
		groupDiv4.appendChild(rlrLabel);
		rlrLabel.className = "col-sm-3 control-label";
		rlrLabel.innerHTML = "发布人/单位";

		var rlrDiv = document.createElement("DIV");
		groupDiv4.appendChild(rlrDiv);
		rlrDiv.className = "col-sm-9";
		this.releaser = document.createElement("input");
		rlrDiv.appendChild(this.releaser);
		this.releaser.className = "form-control";

		// purchase price
		var groupDiv5 = document.createElement("DIV");
		groupDiv5.style.display = "none";
		rlform.appendChild(groupDiv5);
		groupDiv5.className = "form-group";
		var rlrLabel5 = document.createElement("label");
		groupDiv5.appendChild(rlrLabel5);
		rlrLabel5.className = "col-sm-3 control-label";
		rlrLabel5.innerHTML = "购买价格（￥）";

		var priceDiv = document.createElement("DIV");
		groupDiv5.appendChild(priceDiv);
		priceDiv.className = "col-sm-9";
		this.purchasePriceInput = document.createElement("input");
		priceDiv.appendChild(this.purchasePriceInput);
		this.purchasePriceInput.type = "number";
		this.purchasePriceInput.value = "0.00";
		this.purchasePriceInput.className = "form-control";

		// usage price
		var groupDiv6 = document.createElement("DIV");
		groupDiv6.style.display = "none";
		rlform.appendChild(groupDiv6);
		groupDiv6.className = "form-group";
		var rlrLabel6 = document.createElement("label");
		groupDiv6.appendChild(rlrLabel6);
		rlrLabel6.className = "col-sm-3 control-label";
		rlrLabel6.innerHTML = "使用价格（￥）";

		var usagepriceDiv = document.createElement("DIV");
		groupDiv6.appendChild(usagepriceDiv);
		usagepriceDiv.className = "col-sm-9";
		this.usagePriceInput = document.createElement("input");
		usagepriceDiv.appendChild(this.usagePriceInput);
		this.usagePriceInput.type = "number";
		this.usagePriceInput.value = "0.00";
		this.usagePriceInput.className = "form-control";
	};

	ReleaseProcessDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	ReleaseProcessDialog.prototype.setWfProcess = function(process) {
		this.wfprocess = process;
		this.folderContentDiv1.id = "publishingtree" + this.wfprocess.id;
		this.procName.value = this.wfprocess.name;
		this.usagePriceInput.value = this.wfprocess.usagePrice;
		this.purchasePriceInput.value = this.wfprocess.purchasePrice;
		this.releaser.value = this.options.uname;
	};

	ReleaseProcessDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true,
		});
	};

	ReleaseProcessDialog.prototype.doClick = function(evt) {
		if (evt.target.id == "OK" + this.options.id) {
			if (this.verNo.value == "") {
				this.messageBox.show(4, "版本号不能为空。", false);
				return;
			}
			if (this.releaser.value == "") {
				this.messageBox.show(4, "发布人/单位不能为空。", false);
				return;
			}
			var instance = $("#publishingtree" + this.wfprocess.id).jstree();
			var selected = instance.get_selected(true);
			if (selected.length > 0) {
				var parentfolder = instance.get_selected(true)[0];
				var arry = parentfolder.data.split("|");
				var ver = this.verNo.value;
				if (arry[0] == "1") {
					this.messageBox.show(4, "请选择发布的目录", false);
					return;
				} else {
					var that = this;
					$.post(service.api(14), {
						pid : this.wfprocess.id,
						v : ver,
						vn : this.verNote.value,
						rl : this.releaser.value,
						rid : this.options.uid,
						pp : this.purchasePriceInput.value,
						up : this.usagePriceInput.value,
						pfd : parentfolder.id, // parent folder ID
						orgid : this.wfprocess.owner,
					}, function(data) {
						// create a tree view node
						var node = {
							id : data.id,
							text : Utils.parse(that.wfprocess.name + "(" + ver
									+ ")"),
							data : "3|" + that.wfprocess.owner + "|"
									+ that.wfprocess.code + "|R|" + ver,
							icon : "glyphicon glyphicon-fire",
						}; // parent: data.parent.id,
						// var parent = instance.get_selected(true)[0];
						var instance = $('#treeview').jstree();
						var parentNode = instance.get_node(parentfolder.id);
						instance.create_node(parentNode, node, "last");
						instance.redraw(true);
						$('#treeview').jstree('deselect_all', true);
						$('#treeview').jstree('select_node', data.id);
						// open an editor
						that.options.topparent.mainContentPlugin.addNewTab(
								that.wfprocess.name, data.id,
								that.wfprocess.owner, "R");
						$("#progressbar").hide();
						that.hide();
					});
				}
			} else {
				this.messageBox.show(4, "请选择发布的目录", false);
				return;
			}

		}
	};

	ReleaseProcessDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new ReleaseProcessDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);