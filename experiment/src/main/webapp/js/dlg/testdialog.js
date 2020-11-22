/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "testDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
		ownerid : "",
	};

	var TestDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			ownerid : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.modalframe;
		this.topparent;
		this.init(options);
	};

	TestDialog.prototype.init = function(options) {
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
		modaldialogDIV.style.width = "900px"
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

		this.saveButton = document.createElement("button");
		this.saveButton.type = "Button";
		this.saveButton.id = "OKButton" + options.id;
		this.saveButton.className = "btn btn-primary";
		this.saveButton.addEventListener("click", this, false);
		this.saveButton.innerHTML = "添加";
		//this.saveButton.setAttribute("disabled", "");
		dialogFooterDIV.appendChild(this.saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "Button";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

		var dialog = $(dialogBodyDIV).alertBox({
			id : options.id,
		});
		this.messageBox = dialog.data("alertBox");

	};

	TestDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		form.className = "form-horizontal";
		parent.appendChild(form);

		// user name
		var usernamediv = document.createElement("div");
		usernamediv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		form.appendChild(usernamediv);

		var div0 = document.createElement("div");
		div0.className = "form-group";
		usernamediv.appendChild(div0);

		var label0 = document.createElement("label");
		label0.className = "col-sm-3 control-label";
		label0.innerHTML = "账号";
		div0.appendChild(label0);

		var div01 = document.createElement("div");
		div0.appendChild(div01);
		div01.className = "col-sm-9";

		this.inputUserName = document.createElement("input");
		this.inputUserName.className = "form-control";
		this.inputUserName.setAttribute("required", "true");
		this.inputUserName.setAttribute("autofocus", "true");
		this.inputUserName.setAttribute("placeholder", "请输入用户账号");
		this.inputUserName.addEventListener("blur", this, false);
		div01.appendChild(this.inputUserName);


	};

	TestDialog.prototype.show = function(an) {
var van = an;
console.log(van);
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	TestDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	TestDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};
	
	TestDialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		if (evt.target.id == "OKButton" + this.options.id) {
			if (this.inputUserName.value.trim() == "") {
				this.messageBox.show(4, "用户帐号不能为空，请输入一个用户帐号", false);
				return false;
			}
console.log("gggg");
			$("#progressbar").show();
			var that = this;
			$.post(services.api(6), {
				useraccount : that.inputUserName.value, //JSON.stringify(this.staff),
			}).complete(function(data) {
				// refresh user list
				if (data.responseJSON != undefined) {

				} else {
					that.messageBox.show(4, "新用户创建失败", false);
				}
				that.hide();
				$("#progressbar").hide();
			});
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new TestDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);