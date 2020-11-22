;
(function($, window, document, undefined) {
	var pluginName = "constantDialog";
	var defaults = {
		id : "",
		title : "",
		topparent : "",
		expdetail : "",
	};

	var ConstantEditDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			topparent : "",
			expdetail : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	ConstantEditDialog.prototype.init = function(options) {
		this.topparent = options.topparent;

		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

		var modaldialogDIV = document.createElement("div");
		this.modalframe.appendChild(modaldialogDIV);
		modaldialogDIV.className = "modal-dialog modal-sm";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "450px";

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
		var dialogBodyDIV = document.createElement("div");
		dialogBodyDIV.className = "modal-body";
		dialogContentDIV.appendChild(dialogBodyDIV);

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyFrameDIV.className = "container-fluid";
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);

		var bodyRow = document.createElement("div");
		bodyRow.className = "row";
		bodyRow.id = "bodyrow" + options.id;
		dialogBodyFrameDIV.appendChild(bodyRow);

		// add form panel or main content here...
		this.addContent(options.id, bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogContentDIV.appendChild(dialogFooterDIV);

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
		cancelButton.id = "Cancel" + options.id;
		cancelButton.name = "Cancel" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.addEventListener("click", this, false);
		dialogFooterDIV.appendChild(cancelButton);

		var dialog = $(dialogBodyDIV).alertBox({
			id : options.id,
		});
		this.messageBox = dialog.data("alertBox");
	};

	ConstantEditDialog.prototype.addContent = function(id, parent) {
		var datatypeDIV1 = document.createElement("div");
		parent.appendChild(datatypeDIV1);
		datatypeDIV1.className = "form-group";

		var varTypeLabel = document.createElement("label");
		datatypeDIV1.appendChild(varTypeLabel);
		varTypeLabel.setAttribute("for", "dtSelect" + id);
		varTypeLabel.innerHTML = "常数类型";

		this.dtSelect = document.createElement("select");
		datatypeDIV1.appendChild(this.dtSelect);
		this.dtSelect.id = "dtSelect" + id;
		this.dtSelect.className = "form-control";

		this.addOptions(this.dtSelect, datatype["Integer"], "Integer", 0);
		this.addOptions(this.dtSelect, datatype["Double"], "Double", 1);
		this.addOptions(this.dtSelect, datatype["Boolean"], "Boolean", 2);
		this.addOptions(this.dtSelect, datatype["String"], "String", 3);
		this.addOptions(this.dtSelect, datatype["DateTime"], "DateTime", 4);
		this.addOptions(this.dtSelect, datatype["Date"], "Date", 5);
		this.addOptions(this.dtSelect, datatype["Time"], "Time", 6);
		this.addOptions(this.dtSelect, datatype["TimeDuration"],
				"TimeDuration", 7);
		this.addOptions(this.dtSelect, datatype["Currency"], "Currency", 8);
		this.addOptions(this.dtSelect, datatype["JSONData"], "JSONData", 9);
		// this.addOptions(this.dtSelect, datatype["File"], "File", 10);
		// this.addOptions(this.dtSelect, datatype["Handwriting"],
		// "Handwriting",
		// 11);
		this.dtSelect.addEventListener("change", this, false);

		var valueDIV1 = document.createElement("div");
		parent.appendChild(valueDIV1);
		valueDIV1.className = "form-group";

		var plugin0 = $(valueDIV1).constantEditPanel({
			id : id,
		});
		this.constantPane = plugin0.data("constantEditPanel");

	};

	ConstantEditDialog.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	ConstantEditDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	ConstantEditDialog.prototype.doChange = function(evt) {
		this.constantPane.setInitValue(this.dtSelect.value, this.owner,
				this.currOwner);
	};

	ConstantEditDialog.prototype.doClick = function(evt) {
		if (evt.target.name == "OK" + this.options.id) {
			if (this.constantPane.constant.datatype == "Double"
					|| this.constantPane.constant.datatype == "Currency"
					|| this.constantPane.constant.datatype == "String"
					|| this.constantPane.constant.datatype == "JSONData"
					|| this.constantPane.constant.datatype == "Integer") {
				if (this.constantPane.constant.value == "") {
					this.messageBox.show(4, "值不能为空。", false);
					return;
				}
			}
			this.expr.insert(this.constantPane.constant);
			this.options.expdetail.innerHTML = this.expr.toString();
			this.hide();
		} else if (evt.target.name == "Cancel" + this.options.id) {
			this.hide();
		}
	};

	ConstantEditDialog.prototype.setExpression = function(entity, orgid, pid) {
		this.expr = entity;
		this.owner = orgid;
		this.currOwner = pid;
		this.constantPane.setInitValue(this.dtSelect.value, orgid, pid);
	};

	ConstantEditDialog.prototype.show = function(model) {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : model
		});
	};

	ConstantEditDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new ConstantEditDialog(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);