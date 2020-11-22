/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "errorMessageDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
		ownerId : "",
		newstaffdlg : "",
	};

	var errorMessageDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			ownerId : "",
			newstaffdlg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.modalframe;
		this.topparent;
		this.init(options);
	};

	errorMessageDialog.prototype.init = function(options) {
		this.topparent = options.topparent;
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
		modaldialogDIV.style.width = "650px"
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
//		saveButton.addEventListener("click", this, false);
		saveButton.setAttribute("data-dismiss", "modal");
		saveButton.innerHTML = "确定";
		dialogFooterDIV.appendChild(saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "Button";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

	};

	errorMessageDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		form.className = "form-horizontal";
		parent.appendChild(form);

		// ID number
		var div2 = document.createElement("div");
		div2.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		form.appendChild(div2);

		this.label2 = document.createElement("label");
		this.label2.className = "control-label";
		div2.appendChild(this.label2);
		
		// ID number
		var div3 = document.createElement("div");
		div3.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		form.appendChild(div3);

		this.label3 = document.createElement("label");
		this.label3.className = "control-label";
		div3.appendChild(this.label3);


	};

	errorMessageDialog.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	errorMessageDialog.prototype.show = function(data) {
//		this.input1.value = "";
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
//		var data = data.responseJSON;//json
		this.label2.innerHTML = "导入成功条数:"+ (data.successCount != null
				&& data.successCount.trim() != "" ? data.successCount
						: "无")+"条";
		this.label3.innerHTML = "错误行信息:第"+ (data.erroneousRowNumber != null
				&& data.erroneousRowNumber.trim() != "" ? data.erroneousRowNumber
						: "无")+"行有错误（必填信息未输入，如该行是空行可忽略！）";
	};

	errorMessageDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	errorMessageDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new errorMessageDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);