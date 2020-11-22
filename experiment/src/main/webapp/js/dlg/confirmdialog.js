;
(function($, window, document, undefined) {
	var pluginName = "confirmInfoDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
	};

	var ConfirmDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.dialogBody;
		this.init(options);
	};

	ConfirmDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "gridSystemModalLabel");

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		modaldialogDIV.appendChild(dialogContentDIV);

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
		titleH4.id = "gridSystemModalLabel" + options.id;

		var infoIcon = document.createElement("i");
		infoIcon.className = "fa fa-info-circle";
		infoIcon.style.color = "blue";
		titleH4.appendChild(infoIcon);

		var info = document.createElement("label");
		info.innerHTML = options.title;
		titleH4.appendChild(info);
		dialogHeaderDIV.appendChild(titleH4);

		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);

		var dialogBodyDIV = document.createElement("div");
		dialogBodyDIV.className = "modal-body";
		dialogForm.appendChild(dialogBodyDIV);

		// add form panel or main content here...
		this.dialogBody = document.createElement("span");
		dialogBodyDIV.appendChild(this.dialogBody);

		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		var yesButton = document.createElement("button");
		yesButton.type = "button";
		yesButton.id = "YESButton" + options.id;
		yesButton.name = "YESButton" + options.id;
		yesButton.className = "btn btn-primary";
		yesButton.innerHTML = "是";
		yesButton.addEventListener("click", this, false);
		dialogFooterDIV.appendChild(yesButton);

		var noButton = document.createElement("button");
		noButton.type = "button";
		noButton.id = "NOButton" + options.id;
		noButton.name = "NOButton" + options.id;
		noButton.className = "btn btn-primary";
		noButton.innerHTML = "否";
		noButton.addEventListener("click", this, false);
		dialogFooterDIV.appendChild(noButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "button";
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);
	};

	ConfirmDialog.prototype.show = function(message) {
		this.dialogBody.innerHTML = message;
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	ConfirmDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	ConfirmDialog.prototype.doClick = function(evt) {
		if (evt.target.id == "YESButton" + this.options.id) {
			this.options.parent.doYesAction();
		} else if (evt.target.id == "NOButton" + this.options.id) {
			this.options.parent.doNoAction();
		}
	};

	ConfirmDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ConfirmDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);