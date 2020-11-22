/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "submittingDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
	};

	var Dialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
		this.status = 99;
		this.id = "";
	};

	Dialog.prototype.init = function(options) {
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
		modaldialogDIV.style.overflow = "auto";
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		dialogContentDIV.style.overflow = "auto";
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

	};

	Dialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		form.className = "form-horizontal";
		parent.appendChild(form);

		// 系统通知内容（PC）
		var div3 = document.createElement("div");
		div3.className = "form-group";
		form.appendChild(div3);

		var div31 = document.createElement("div");
		div3.appendChild(div31);
		div31.className = "col-sm-12";

		this.input2 = document.createElement("textarea");
		this.input2.className = "form-control";
		this.input2.rows = "10";
		this.input2.setAttribute("maxlength", "2048");
		this.input2.setAttribute("placeholder", "请输入提交意见、理由、原因，最多2000个中文字");
		div31.appendChild(this.input2);
	};

	Dialog.prototype.show = function(id, status) {
		this.id = id;
		this.status = status;
		this.input2.value = "";
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
		}
	};

	Dialog.prototype.doClick = function(evt) {
		if (evt.target.id == "OKButton" + this.options.id) {
			this.options.parent.doSubmit(this.id, this.status, this.input2.value);
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