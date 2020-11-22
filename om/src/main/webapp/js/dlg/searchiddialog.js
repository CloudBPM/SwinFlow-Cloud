/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "searchIdNumberDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
		ownerId : "",
		newstaffdlg : "",
	};

	var SearchIdNumberDialog = function(element, options) {
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

	SearchIdNumberDialog.prototype.init = function(options) {
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
		saveButton.type = "button";
		saveButton.id = "OKButton" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.addEventListener("click", this, false);
		// saveButton.setAttribute("data-dismiss", "modal");
		saveButton.innerHTML = "确定";
		dialogFooterDIV.appendChild(saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "CancelButton";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

	};

	SearchIdNumberDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		form.className = "form-horizontal";
		parent.appendChild(form);

		// -- list
		var div1 = document.createElement("div");
		form.appendChild(div1);
		div1.className = "form-group";

		var label1 = document.createElement("label");
		div1.appendChild(label1);
		label1.setAttribute("for", "searchtype");
		label1.className = "col-sm-2 control-label";
		label1.innerHTML = "搜索条件";

		var div11 = document.createElement("div");
		div1.appendChild(div11);
		div11.className = "col-sm-10";

		this.searchSelect = document.createElement("select");
		div11.appendChild(this.searchSelect);
		this.searchSelect.className = "form-control";

		this.addOptions(this.searchSelect, "手机号", "0", 0);
		this.addOptions(this.searchSelect, "身份证号", "1", 1);
		// this.addOptions(this.searchSelect, "护照号", "2", 2);
		// this.addOptions(this.searchSelect, "军官证", "3", 3);


		// ID number
		var div2 = document.createElement("div");
		div2.className = "form-group";
		form.appendChild(div2);

		var label2 = document.createElement("label");
		label2.className = "col-sm-2 control-label";
		label2.innerHTML = "搜索号码";
		div2.appendChild(label2);

		var div21 = document.createElement("div");
		div2.appendChild(div21);
		div21.className = "col-sm-10";

		this.input1 = document.createElement("input");
		this.input1.className = "form-control";
		this.input1.setAttribute("required", "true");
		this.input1.setAttribute("autofocus", "true");
		this.input1.addEventListener("keydown", this, false);
		this.input1.setAttribute("placeholder", "请输入设定的搜索条件号码，号码不能为空。");
		div21.appendChild(this.input1);

	};

	SearchIdNumberDialog.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	SearchIdNumberDialog.prototype.show = function() {
		this.input1.value = "";
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	SearchIdNumberDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	SearchIdNumberDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	SearchIdNumberDialog.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13 && evt.target == this.input1) {// enter key
			evt.preventDefault();
			if (evt.target.value.trim() != "") {
				this.doSearch(evt);
			}
			return false;
		}
	};

	SearchIdNumberDialog.prototype.doClick = function(evt) {
		if (this.input1.value.trim() == "") {
			return false;
		}
		var that = this;
		if (evt.target.id == "OKButton" + this.options.id) {
			this.doSearch(evt);
		}
	};

	SearchIdNumberDialog.prototype.doSearch = function(evt) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(12, this.options.ownerId), {
			idnumber : this.input1.value.trim(),
			numbertype : this.searchSelect.value,
			ownerid : this.options.ownerId,
		}).complete(
				function(data) {
					data = data.responseJSON;
					if (data != undefined && data.status != undefined
							&& data.status != null && data.status != "") {
						if (data.status == 0 || data.status == -10) {
							messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
							return;
						}
					}
					var staff = data;
					var newStaff = new Staff();
					if (staff != undefined) {
						newStaff.parseFromJSON(staff);
					} else {
						newStaff.user = new User();
						newStaff.user.idNumber = that.input1.value.trim();
					}
					that.options.newstaffdlg.loadData(newStaff);
					that.options.newstaffdlg.show();
					that.hide();
					$("#progressbar").hide();
				});
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new SearchIdNumberDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);