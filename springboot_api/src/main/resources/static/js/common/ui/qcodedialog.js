/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "qCodeDialog";
	var defaults = {
		id : "",
	};

	var QrCodeDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = null;
		this.modalframe;
		this.init(options);
	};

	QrCodeDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		// dialog
		this.modalframe.className = "modal fade";
		this.modalframe.id = "qrcodeModal";
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "qrcodeModal");

		var modaldialogDIV = document.createElement("div");
		this.modalframe.appendChild(modaldialogDIV);
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "200px"

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
		closeButton.setAttribute("data-keyboard", "true");

		var closeSpan = document.createElement("span");
		closeButton.appendChild(closeSpan);
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";

		var titleH4 = document.createElement("h4");
		dialogHeaderDIV.appendChild(titleH4);
		titleH4.className = "modal-title";

		var infoIcon = document.createElement("i");
		titleH4.appendChild(infoIcon);
		infoIcon.className = "fa fa-qrcode fa-lg";
		infoIcon.style.color = "blue";

		var info = document.createElement("label");
		titleH4.appendChild(info);
		info.innerHTML = "&nbsp;扫码同步";

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

		// add form panel here...
		this.loadPanel(bodyRow);

		// // dialog footer
		// var dialogFooterDIV = document.createElement("div");
		// dialogForm.appendChild(dialogFooterDIV);
		// dialogFooterDIV.className = "modal-footer";
		//
		// this.saveButton = document.createElement("button");
		// dialogFooterDIV.appendChild(this.saveButton);
		// this.saveButton.type = "Button";
		// this.saveButton.id = "renameOKButton" + options.id;
		// this.saveButton.className = "btn btn-primary";
		// this.saveButton.addEventListener("click", this, false);
		// this.saveButton.setAttribute("data-dismiss", "modal");
		// this.saveButton.innerHTML = "关闭";
	};

	QrCodeDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		parent.appendChild(form);

		this.ip_addr = document.location.hostname;
		if (this.ip_addr == "localhost" || this.ip_addr == "127.0.0.1") {
			//ajax获取局域网ip
			//this.getServerIp();
		} else {
			this.ipQrCode = document.createElement("div");
			form.appendChild(this.ipQrCode);
			this.ipQrCode.id = "serverIpQrCode";
			this.ipQrCode.src = this.drawQrCode(this.ipQrCode, this.ip_addr);

			var infoDiv1 = document.createElement("DIV");
			form.appendChild(infoDiv1);
			infoDiv1.style.textAlign = "center";
			infoDiv1.innerHTML = "扫码更新移动端连接网址";

		}

	};

	QrCodeDialog.prototype.drawQrCode = function(parent, message) {
		var qrcode = new QRCode(parent, {
			width : 170,
			height : 170,
		});
		qrcode.makeCode(message);
		return qrcode;
	};

	QrCodeDialog.prototype.show = function() {
		$(this.modalframe).modal("show");
	};

	QrCodeDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new QrCodeDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);