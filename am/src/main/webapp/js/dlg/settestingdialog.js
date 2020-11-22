/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "setTestingDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		topparent : "", // process manager plugin handler
	};

	var Dialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = null;
		this.entityId = null;
		this.isFolder = false;
		this.modalframe;
		this.topparent;
		this.init(options);
	};

	Dialog.prototype.init = function(options) {
		this.topparent = options.topparent;
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		// dialog
		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "renameModal"
				+ options.id);

		var modaldialogDIV = document.createElement("div");
		this.modalframe.appendChild(modaldialogDIV);
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "650px"

		var dialogContentDIV = document.createElement("div");
		modaldialogDIV.appendChild(dialogContentDIV);
		dialogContentDIV.className = "modal-content";

		// dialog headding
		var dialogHeaderDIV = document.createElement("div");
		dialogContentDIV.appendChild(dialogHeaderDIV);
		dialogHeaderDIV.className = "modal-header";

		var closeButton = document.createElement("button");
		dialogHeaderDIV.appendChild(closeButton);
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");

		var closeSpan = document.createElement("span");
		closeButton.appendChild(closeSpan);
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";

		var titleH4 = document.createElement("h4");
		dialogHeaderDIV.appendChild(titleH4);
		titleH4.className = "modal-title";
		titleH4.id = "renameModal" + options.id;

		var infoIcon = document.createElement("i");
		titleH4.appendChild(infoIcon);
		infoIcon.className = "fa fa-pencil-square fa-lg";
		infoIcon.style.color = "blue";

		var info = document.createElement("label");
		titleH4.appendChild(info);
		info.innerHTML = options.title;

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);

		var dialogBodyDIV = document.createElement("div");
		dialogForm.appendChild(dialogBodyDIV);
		dialogBodyDIV.className = "modal-body";

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);
		dialogBodyFrameDIV.className = "container-fluid";

		var bodyRow = document.createElement("div");
		dialogBodyFrameDIV.appendChild(bodyRow);
		bodyRow.className = "row";
		bodyRow.id = "bodyrow" + options.id;

		// add form panel here...
		this.loadPanel(bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogForm.appendChild(dialogFooterDIV);
		dialogFooterDIV.className = "modal-footer";

		this.saveButton = document.createElement("button");
		dialogFooterDIV.appendChild(this.saveButton);
		this.saveButton.type = "Button";
		this.saveButton.id = "renameOKButton" + options.id;
		this.saveButton.className = "btn btn-primary";
		this.saveButton.addEventListener("click", this, false);
		// saveButton.setAttribute("data-dismiss", "modal");
		this.saveButton.innerHTML = "确定";

		var cancelButton = document.createElement("button");
		dialogFooterDIV.appendChild(cancelButton);
		cancelButton.type = "Button";
		cancelButton.id = "renameCancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
	};

	Dialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		parent.appendChild(form);

		// --
		var radiosDIV3 = document.createElement("div");
		form.appendChild(radiosDIV3);
		radiosDIV3.className = "form-group";

		this.radiosLabel3 = document.createElement("label");
		radiosDIV3.appendChild(this.radiosLabel3);
		this.radiosLabel3.setAttribute("for", "entityname" + this.options.id);
		this.radiosLabel3.className = "control-label";

		this.nameInput = document.createElement("input");
		radiosDIV3.appendChild(this.nameInput);
		this.nameInput.type = "text";
		this.nameInput.className = "form-control";
		this.nameInput.addEventListener('keydown', this, false);// 为回车键加监听事件

		var dialog = $(parent).alertBox({
			id : "renameAlert" + this.options.id,
		});
		this.messageBox = dialog.data("alertBox");

	};

	// type is 1: sms; 2: email
	Dialog.prototype.show = function(type) {
		if (type == 1) {
			this.radiosLabel3.innerHTML = "请输入手机号：";
			this.nameInput.value = "";
			this.nameInput.setAttribute("placeholder",
					"请输入一个真实的手机号，如150XXXXXXXX。");
			this.msg = "手机号不能为空";
		} else if (type == 2) {
			this.radiosLabel3.innerHTML = "请输入电子邮箱地址：";
			this.nameInput.value = "";
			this.nameInput.setAttribute("placeholder",
					"请输入一个真实的电子邮箱地址，如xxx@xuanqiyun.com。");
			this.msg = "电子邮箱地址不能为空";
		}
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	Dialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	Dialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	Dialog.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {// 回车键
			evt.preventDefault();// 阻止该事件
			if (evt.target.value != "") {
				this.options.parent.doTestAction(evt.target.value);
				this.hide();// close dialog earlier to show progress bar
				return false;
			} else {
				this.messageBox.show(4, this.msg, false);
				return;
			}
		}
	};

	Dialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		if (evt.target == this.saveButton) {
			var newname = this.nameInput.value;
			if (newname == "") {
				this.messageBox.show(4, this.msg, false);
				return;
			}
			this.options.parent.doTestAction(newname);
			this.hide();// close dialog earlier to show progress bar
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Dialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);