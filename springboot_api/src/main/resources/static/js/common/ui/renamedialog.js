/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "renameEditDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		topparent : "", // process manager plugin handler
	};

	var RenameDialog = function(element, options) {
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

	RenameDialog.prototype.init = function(options) {
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

	RenameDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		parent.appendChild(form);

		// --
		var radiosDIV3 = document.createElement("div");
		form.appendChild(radiosDIV3);
		radiosDIV3.className = "form-group";

		var radiosLabel3 = document.createElement("label");
		radiosDIV3.appendChild(radiosLabel3);
		radiosLabel3.setAttribute("for", "entityname" + this.options.id);
		radiosLabel3.className = "control-label";
		radiosLabel3.innerHTML = "新名称";

		this.nameInput = document.createElement("input");
		radiosDIV3.appendChild(this.nameInput);
		this.nameInput.type = "text";
		this.nameInput.setAttribute("placeholder", "请输入一个名称，名称不能为空。")
		this.nameInput.name = "entityname" + this.options.id;
		this.nameInput.className = "form-control";
		this.nameInput.setAttribute("value", "");
		this.nameInput.id = "entityname" + this.options.id;
		this.nameInput.addEventListener('keydown', this, false);// 为回车键加监听事件

		var dialog = $(parent).alertBox({
			id : "renameAlert" + this.options.id,
		});
		this.messageBox = dialog.data("alertBox");

	};

	RenameDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	RenameDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	RenameDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	RenameDialog.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {// 回车键
			evt.preventDefault();// 阻止该事件
			if (evt.target.value != "") {
				this.options.parent.doRenameAction(this.entity, this.entityId,
						evt.target.value);
				this.hide();// close dialog earlier to show progress bar
				return false;
			} else {
				this.messageBox.show(4, "名称不能为空", false);
				return;
			}
		}
	};

	// if wfprocess object is open, this method will be called.
	RenameDialog.prototype.setEntity = function(obj) {
		this.entity = obj;
		this.nameInput.value = Utils.parse(obj.name);
	};

	// if the wf process editor did not open; this dialog only has wrprocess id.
	RenameDialog.prototype.setEntityId = function(id, name, data) {
		this.entityId = id;
		var arry = data.split("|");
		if (arry[0] == "2") { // type
			this.isFolder = true;
		}
		this.type = arry[2];
		this.nameInput.value = name;
	};

	RenameDialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		if (evt.target == this.saveButton) {
			var newname = this.nameInput.value;
			if (newname == "") {
				this.messageBox.show(4, "名称不能为空", false);
				return;
			}
			this.options.parent.doRenameAction(this.entity, this.entityId,
					newname,this.type);
			this.hide();// close dialog earlier to show progress bar
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new RenameDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);