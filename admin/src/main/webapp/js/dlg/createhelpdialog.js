/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "createHelpDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		uid : "",
		ownerId : "",
	};

	var createHelpDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			uid : "",
			ownerId : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	createHelpDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		// dialog
		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "800px"
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		modaldialogDIV.appendChild(dialogContentDIV);

		// dialog headding
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
		titleH4.id = "modal" + options.id;
		dialogHeaderDIV.appendChild(titleH4);

		var infoIcon = document.createElement("i");
		infoIcon.className = "fa fa-plus-circle fa-lg";
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
		bodyRow.className = "row";
		bodyRow.id = "bodyrow" + options.id;
		dialogBodyFrameDIV.appendChild(bodyRow);

		// add form panel here...
		this.loadPanel(bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		var saveButton = document.createElement("button");
		saveButton.type = "Button";
		saveButton.id = "OKButton" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.addEventListener("click", this, false);
		// saveButton.setAttribute("data-dismiss", "modal");
		saveButton.innerHTML = "确定";
		dialogFooterDIV.appendChild(saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "Button";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

		var dialog = $(bodyRow).alertBox({
			id : "myalert" + options.id,
		});
		this.messageBox = dialog.data("alertBox");
		
		var p3 = $(this.element).returnMessageDialog({
            id: "027",
            title: "系统帮助 - 提示",
            parent: this,
        });
        this.returnMessageDialog = p3.data("returnMessageDialog");

	};

	createHelpDialog.prototype.loadPanel = function(parent) {
		//create a form
		var form1 = document.createElement("form");
		form1.className = "form-inline";
		parent.appendChild(form1);

		//create danger_name
		this.DIV3 = document.createElement("DIV");
		form1.appendChild(this.DIV3);
		this.DIV3.className = "row";
		this.DIV3.style.marginTop = "10px";

		this.divAddress1 = document.createElement("DIV");
		this.DIV3.appendChild(this.divAddress1);
		this.divAddress1.className = "col-sm-2";

		var labelName = document.createElement("LABEL");
		this.divAddress1.appendChild(labelName);
		labelName.className = "control-label";
		labelName.id = "labelName"+this.options.id;
		labelName.innerHTML = "常见问题:";

		this.divAddress1_1 = document.createElement("DIV");
		this.DIV3.appendChild(this.divAddress1_1);
		this.divAddress1_1.className = "col-sm-10";
		this.divAddress1_1.id = "address";

		var inputName = document.createElement("input");
		this.divAddress1_1.appendChild(inputName);
		inputName.style.width = "500px";
		inputName.id = "name"+this.options.id;
		inputName.className = "form-control";
		inputName.type = "text";
		inputName.setAttribute("placeholder", "请输入常见问题");

		//create danger_name
		this.DIV5 = document.createElement("DIV");
		form1.appendChild(this.DIV5);
		this.DIV5.className = "row";
		this.DIV5.style.marginTop = "10px";

		this.divAddress3 = document.createElement("DIV");
		this.DIV5.appendChild(this.divAddress3);
		this.divAddress3.className = "col-sm-2";

		var labelCode = document.createElement("LABEL");
		this.divAddress3.appendChild(labelCode);
		labelCode.id="labelCode"+this.options.id;
		labelCode.className = "control-label";
		labelCode.innerHTML = "问题类型:";

		this.divAddress3_1 = document.createElement("DIV");
		this.DIV5.appendChild(this.divAddress3_1);
		this.divAddress3_1.className = "col-sm-10";
		this.divAddress3_1.id = "address";

		var inputCode = document.createElement("input");
		this.divAddress3_1.appendChild(inputCode);
		inputCode.style.width = "500px";
		inputCode.id = "code"+this.options.id;
		inputCode.className = "form-control";
		inputCode.type = "text";
		inputCode.setAttribute("placeholder", "请输入问题类型");
		//create danger_name
		this.DIV6 = document.createElement("DIV");
		form1.appendChild(this.DIV6);
		this.DIV6.className = "row";
		this.DIV6.style.marginTop = "10px";

		this.divAddress4 = document.createElement("DIV");
		this.DIV6.appendChild(this.divAddress4);
		this.divAddress4.className = "col-sm-2";

		var labelType = document.createElement("LABEL");
		this.divAddress4.appendChild(labelType);
		labelType.id="labelType"+this.options.id;
		labelType.className = "control-label";
		labelType.innerHTML = "解决方案:";

		this.divAddress4_1 = document.createElement("DIV");
		this.DIV6.appendChild(this.divAddress4_1);
		this.divAddress4_1.className = "col-sm-10";
		this.divAddress4_1.id = "address";

		var inputType = document.createElement("textarea");
		this.divAddress4_1.appendChild(inputType);
		inputType.id = "type"+this.options.id;
		inputType.className = "form-control";
		inputType.type = "text";
		inputType.setAttribute("placeholder", "请输入解决方案");
		inputType.style.maxWidth = "500px";
		inputType.style.maxHeight = "300px";
		inputType.style.minWidth = "500px";
		inputType.style.minHeight = "300px";
//		inputType.style.width = "500px";
//		inputType.style.height = "300px";

	
	};

	createHelpDialog.prototype.show = function(entity) {
		if (entity != undefined && entity != null) {
			this.entity = entity;
			this.input1.value = entity.name;
			this.input2.value = entity.mobileContent;
		}
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	createHelpDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	createHelpDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	createHelpDialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		console.log(this.options.uid);
		var name = document.getElementById("name"+this.options.id).value;
		var code = document.getElementById("code"+this.options.id).value;
		var type = document.getElementById("type"+this.options.id).value;
			if (name == "") {
				this.messageBox.show(4, "常见问题不能为空", false);
				return false;
			} else if (code == "") {
				this.messageBox.show(4, "问题类型不能为空", false);
				return false;
			} else if (type == "") {
				this.messageBox.show(4, "解决方案不能为空", false);
				return false;
			} else if (name != "" && code != "" && type != "") {
				this.saving(name,code,type,this.options.uid);
//				window.location.reload();
			}else {
				return;
			}
		
	
	};
	
	createHelpDialog.prototype.saving = function(name, code, type,uid) {
		$("#progressbar").show();
		var that = this;
//		console.log("111");
		//$.getJSON(pseservice.api(7, "mainContent"), {
		$.getJSON(service.api("28"), {
			name : name, // user id
			code : code,
			type : type,
			uid : uid,
		}).complete(function(data) {
			that.returnMessageDialog.show();
//			that.loadData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new createHelpDialog(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);