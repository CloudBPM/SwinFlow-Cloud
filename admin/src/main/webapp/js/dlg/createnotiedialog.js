/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "createNoticeDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		uid : "",
		ownerId : "",
	};

	var CreateNoticeDialog = function(element, options) {
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

	CreateNoticeDialog.prototype.init = function(options) {
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

	};

	CreateNoticeDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		form.className = "form-horizontal";
		parent.appendChild(form);

		// 通知标题
		var div2 = document.createElement("div");
		div2.className = "form-group";
		form.appendChild(div2);

		var label2 = document.createElement("label");
		label2.className = "col-sm-1 control-label";
		label2.innerHTML = "标题";
		div2.appendChild(label2);

		var div21 = document.createElement("div");
		div2.appendChild(div21);
		div21.className = "col-sm-11";

		this.input1 = document.createElement("input");
		this.input1.className = "form-control";
		this.input1.setAttribute("required", "true");
		this.input1.setAttribute("autofocus", "true");
		this.input1.setAttribute("maxlength", "256");
		this.input1.setAttribute("placeholder", "请输入标题，最多256个中文字");
		div21.appendChild(this.input1);

		// 系统通知内容（PC）
		var div3 = document.createElement("div");
		div3.className = "form-group";
		form.appendChild(div3);

		var label3 = document.createElement("label");
		label3.className = "col-sm-1 control-label";
		label3.innerHTML = "内容";
		div3.appendChild(label3);

		var div31 = document.createElement("div");
		div3.appendChild(div31);
		div31.className = "col-sm-11";

		this.input2 = document.createElement("textarea");
		this.input2.className = "form-control";
		this.input2.rows = "10";
		this.input2.setAttribute("required", "true");
		this.input2.setAttribute("maxlength", "2048");
		this.input2.setAttribute("placeholder", "请输入通知内容，最多2000个中文字");
		div31.appendChild(this.input2);

		// 是否强制退出或禁止登录（PC/Mobile）
		var div4 = document.createElement("div");
		div4.className = "form-group";
		form.appendChild(div4);

		var label4 = document.createElement("label");
		label4.className = "col-sm-1 control-label";
		label4.innerHTML = "&nbsp;";
		div4.appendChild(label4);

		var gColDiv41 = document.createElement("DIV");
		div4.appendChild(gColDiv41);
		gColDiv41.className = "checkbox col-sm-11";

		var gLabel3 = document.createElement("label");
		gColDiv41.appendChild(gLabel3);
		this.inputvalue3 = document.createElement("INPUT");
		gLabel3.appendChild(this.inputvalue3);
		this.inputvalue3.type = "checkbox";
		this.inputvalue3.id = "forceexit";
		var that = this;
		this.inputvalue3.addEventListener("click", function(evt) {
			if (this.checked) {
				that.fromDateInput.disabled = false;
				that.toDateInput.disabled = false;
			} else {
				that.fromDateInput.disabled = true;
				that.toDateInput.disabled = true;
			}
		});
		gLabel3.appendChild(document.createTextNode("在以下时间段内禁止登录系统或强制退出系统"));

		// 强制退出或禁止登录的时间段。
		var div5 = document.createElement("div");
		div5.className = "form-group";
		form.appendChild(div5);

		this.createTimePeriod(div5);

	};

	CreateNoticeDialog.prototype.createTimePeriod = function(gDiv2) {
		var label3 = document.createElement("Label");
		gDiv2.appendChild(label3);
		label3.className = "col-sm-1 control-label";
		label3.innerHTML = "&nbsp;";

		var label4 = document.createElement("Label");
		gDiv2.appendChild(label4);
		label4.className = "col-sm-1 control-label";
		label4.innerHTML = "从";

		var colDIV3 = document.createElement("DIV");
		gDiv2.appendChild(colDIV3);
		colDIV3.className = "col-sm-4";

		this.fromDateInput = document.createElement("INPUT");
		colDIV3.appendChild(this.fromDateInput);
		this.fromDateInput.className = "form-control";
		this.fromDateInput.disabled = true;

		$(this.fromDateInput).datetimepicker({
			dateFormat : "yy-mm-dd",
			timeFormat : "HH:mm:ss",
		});

		var label5 = document.createElement("Label");
		gDiv2.appendChild(label5);
		label5.className = "col-sm-1 control-label";
		label5.innerHTML = "到";

		var colDIV4 = document.createElement("DIV");
		gDiv2.appendChild(colDIV4);
		colDIV4.className = "col-sm-5";

		this.toDateInput = document.createElement("INPUT");
		colDIV4.appendChild(this.toDateInput);
		this.toDateInput.className = "form-control";
		this.toDateInput.disabled = true;

		$(this.toDateInput).datetimepicker({
			dateFormat : "yy-mm-dd",
			timeFormat : "HH:mm:ss",
		});
	};

	CreateNoticeDialog.prototype.show = function(entity) {
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

	CreateNoticeDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	CreateNoticeDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	CreateNoticeDialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		if (this.input1.value.trim() == "") {
			this.messageBox.show(4, "系统通知标题不能为空", false);
			return false;
		}
		if (this.input2.value.trim() == "") {
			this.messageBox.show(4, "系统通知内容不能为空", false);
			return false;
		}
		if (this.inputvalue3.checked) {
			if (this.fromDateInput.value == "" || this.toDateInput.value == "") {
				this.messageBox.show(4, "时间区间不能为空", false);
				return false;
			} else {
				var from = new Date(Date.parse(this.fromDateInput.value));
				var to = new Date(Date.parse(this.toDateInput.value));
				if (from.getTime() > to.getTime()) {
					this.messageBox.show(4, "起始时间不能晚于结束时间", false);
					return false;
				}
			}

		}
		var that = this;
		if (evt.target.id == "OKButton" + this.options.id) {
			if (this.entity == undefined || this.entity == null) {
				this.entity = new SystemNotice();
				this.entity.id = null;
				this.entity.name = this.input1.value;// title
				this.entity.pcContent = this.input2.value;// content
				this.entity.mobileContent = this.input2.value;// content
				this.entity.keywords = null;
				this.entity.publisherId = this.options.uid;
				this.entity.publisherd = null;
				this.entity.liveStatus = 1;
				this.entity.createDatetime = Utils.getCurrentDateTime();
				this.entity.lastupdate = Utils.getCurrentDateTime();
				this.entity.organizationName = null;
				this.entity.owner = this.options.ownerId;
				if (this.inputvalue3.checked) {
					this.entity.banned = 1;
					this.entity.banStartTime = this.fromDateInput.value;
					this.entity.banEndTime = this.toDateInput.value;
				} else {
					this.entity.banned = 0;
					this.entity.banStartTime = null;
					this.entity.banEndTime = null;
				}
				this.entity.level = 0;
			} else {
				this.entity.name = this.input1.value;// title
				this.entity.pcContent = this.input2.value;// content
				this.entity.mobileContent = this.input2.value;// content
				this.entity.publisherId = this.options.uid;
				this.entity.lastupdate = Utils.getCurrentDateTime();
				this.entity.owner = this.options.ownerId;
				if (this.inputvalue3.checked) {
					this.entity.banned = 1;
					this.entity.banStartTime = this.fromDateInput.value;
					this.entity.banEndTime = this.toDateInput.value;
				} else {
					this.entity.banned = 0;
					this.entity.banStartTime = null;
					this.entity.banEndTime = null;
				}
				this.entity.level = 0;
			}
			$.post(service.api(19), {
				note : JSON.stringify(this.entity),
			}, function(data) {
				$("#progressbar").hide();
				that.options.parent.loading(1, 30, "", that.options.ownerId);
				that.hide();
			});
		}
	};

	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new CreateNoticeDialog(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);