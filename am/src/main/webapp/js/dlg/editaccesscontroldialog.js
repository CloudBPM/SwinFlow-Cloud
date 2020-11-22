/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "editAccessControlDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
	};

	var ModuleDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.modalframe;
		this.topparent;
		this.init(options);
	};

	ModuleDialog.prototype.init = function(options) {
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
		dialogBodyFrameDIV.appendChild(bodyRow);
		bodyRow.className = "row";
		bodyRow.id = "bodyrow" + options.id;

		var rowDiv = document.createElement("div");
		bodyRow.appendChild(rowDiv);
		rowDiv.className = "col-sm-12";

		// add form panel here...
		this.loadPanel(rowDiv);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		this.saveButton = document.createElement("button");
		this.saveButton.type = "Button";
		this.saveButton.id = "OKButton" + options.id;
		this.saveButton.className = "btn btn-primary";
		this.saveButton.addEventListener("click", this, false);
		this.saveButton.innerHTML = "保存";
		dialogFooterDIV.appendChild(this.saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "Button";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

		var dialog = $(rowDiv).alertBox({
			id : this.options.id,
		});
		this.messageBox = dialog.data("alertBox");

	};

	ModuleDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		parent.appendChild(form);
		form.className = "form-horizontal";
		form.setAttribute("role", "form");
		//
		var redioGroup1 = document.createElement("div");
		form.appendChild(redioGroup1);
		redioGroup1.className = "form-group";

		var redioDIV1 = document.createElement("div");
		redioGroup1.appendChild(redioDIV1);
		redioDIV1.className = "redio";

		var redioLebel1 = document.createElement("label");
		redioDIV1.appendChild(redioLebel1);

		this.redioInput1 = document.createElement("INPUT");
		redioLebel1.appendChild(this.redioInput1);
		this.redioInput1.type = "radio";
		this.redioInput1.name = "orgs";
		this.redioInput1.id = "optionsRadios1" + this.options.id;
		this.redioInput1.value = "0";
		this.redioInput1.addEventListener("click", this, false);

		var redioSPAN1 = document.createElement("SPAN");
		redioLebel1.appendChild(redioSPAN1);
		redioSPAN1.innerHTML = " 所有政府、企事业单位";
		//
		var redioGroup2 = document.createElement("div");
		form.appendChild(redioGroup2);
		redioGroup2.className = "form-group";

		var redioDIV2 = document.createElement("div");
		redioGroup2.appendChild(redioDIV2);
		redioDIV2.className = "redio";

		var redioLebel2 = document.createElement("label");
		redioDIV2.appendChild(redioLebel2);

		this.redioInput2 = document.createElement("INPUT");
		redioLebel2.appendChild(this.redioInput2);
		this.redioInput2.type = "radio";
		this.redioInput2.name = "orgs";
		this.redioInput2.id = "optionsRadios1" + this.options.id;
		this.redioInput2.value = "1";
		this.redioInput2.addEventListener("click", this, false);

		var redioSPAN2 = document.createElement("SPAN");
		redioLebel2.appendChild(redioSPAN2);
		redioSPAN2.innerHTML = " 部分政府、企事业单位";
		// 
		var redioGroup3 = document.createElement("div");
		form.appendChild(redioGroup3);
		redioGroup3.className = "form-group";

		var group = document.createElement("DIV");
		redioGroup3.appendChild(group);
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");

		this.search = document.createElement("input");
		group.appendChild(this.search);
		this.search.type = "text";
		this.search.className = "form-control input-sm";
		this.search.setAttribute("placeholder", "搜索...");
		this.search.addEventListener("keydown", this, false);

		var searchSpan = document.createElement("span");
		group.appendChild(searchSpan);
		searchSpan.className = "input-group-btn";

		this.searchBtn = this.createTool(searchSpan, "searchAC"
				+ this.options.id, "查找", "btn btn-primary btn-sm", "i",
				"fa fa-search");
		// 
		var redioGroup4 = document.createElement("div");
		form.appendChild(redioGroup4);
		redioGroup4.className = "form-group";

		var tableDiv = document.createElement("DIV");
		redioGroup4.appendChild(tableDiv);
		tableDiv.id = "tablediv" + this.options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = "200px";
		this.list = document.createElement("table");
		this.list.className = "table table-striped table-hover";
		tableDiv.appendChild(this.list);

	};

	ModuleDialog.prototype.createTool = function(group, id, title, style,
			fonttag, fontclass) {
		var button = document.createElement("button");
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		group.appendChild(button);
		var icon = document.createElement(fonttag);
		icon.addEventListener('click', this, false);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		button.appendChild(icon);
		return button;
	};

	ModuleDialog.prototype.addHeader = function() {
		var header = this.list.createTHead();
		var row = header.insertRow(0);
		this.createHead(" ", row);
		this.createHead("政府、企事业单位名称", row);
		this.createHead("创建日期", row);
		this.createHead("访问量合计", row);
	};

	ModuleDialog.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = content;
	};

	ModuleDialog.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	ModuleDialog.prototype.initList = function() {
		for (var i = 0; i < 30; i++) {
			var row = this.list.insertRow(i);
			for (var j = 0; j < 4; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
	};

	ModuleDialog.prototype.show = function(entity) {
		this.entity = entity;
		this.initialize(this.entity);
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	ModuleDialog.prototype.initialize = function(entity) {
		this.entity = entity;
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(18), {
			appid : entity.id,
		}).complete(function(data) {
			that.intData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	ModuleDialog.prototype.intData = function(objs) {
		if (objs != null && objs.length > 0) {
			if (objs.length == 1) {
				if (objs[0].organizationId == "ALLORGANIZATIONS") {
					this.redioInput1.checked = true;
					this.redioInput2.checked = false;
					this.search.disabled = true;
					this.searchBtn.disabled = true;
				} else {
					this.redioInput1.checked = false;
					this.redioInput2.checked = true;
					this.search.disabled = false;
					this.searchBtn.disabled = false;
				}
			} else if (objs.length > 1) {
				this.redioInput1.checked = false;
				this.redioInput2.checked = true;
				this.search.disabled = false;
				this.searchBtn.disabled = false;
			}
		} else {
			this.redioInput1.checked = true;
			this.redioInput2.checked = false;
			this.search.disabled = true;
			this.searchBtn.disabled = true;
		}
	};

	ModuleDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	ModuleDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	ModuleDialog.prototype.doClick = function(evt) {
		var that = this;
		if (evt.target == this.redioInput1) {
			this.search.disabled = true;
			this.searchBtn.disabled = true;
			$('input[type=checkbox]').attr('disabled', true);
			this.saveButton.disabled = false;
		} else if (evt.target == this.redioInput2) {
			this.search.disabled = false;
			this.searchBtn.disabled = false;
			$('input[type=checkbox]').attr('disabled', false);
			var checked = $("input[type=checkbox]:checked").length;
			if (checked > 0) {
				this.saveButton.disabled = false;
			} else {
				this.saveButton.disabled = true;
			}
		} else if (evt.target == this.saveButton) {
			evt.preventDefault();
			var acs = [];
			if (this.redioInput1.checked) {
				var acctrl = new AppServiceAccessControl();
				acctrl.appServiceId = this.entity.id;
				acctrl.organizationId = "ALLORGANIZATIONS";
				acctrl.createDateTime = Utils.getCurrentDateTime();
				acctrl.owner = this.entity.owner;
				acs.push(acctrl);
			} else if (this.redioInput2.checked) {
				var testval = [];
				$('input[type=checkbox]:checked').each(function() {
					testval.push($(this).val());
				});
				i = 0;
				while (i < testval.length) {
					var acctrl = new AppServiceAccessControl();
					acctrl.appServiceId = this.entity.id;
					acctrl.organizationId = testval[i];
					acctrl.createDateTime = Utils.getCurrentDateTime();
					acctrl.owner = this.entity.owner;
					acs.push(acctrl);
					i++;
				}
			}// saving...
			$.post(service.api(21), {
				acs : JSON.stringify(acs),
			}).complete(
					function(data) {
						$("#progressbar").hide();
						that.hide();
						that.options.parent.loading(that.entity, 1, 30,
								that.searchBtn.value);
					});
		} else if (evt.target == this.searchBtn
				|| evt.target.id == "searchAC" + this.options.id) {
			if (this.search.value != "") {
				this.loading(this.entity, this.search.value);
			} else {
				this.messageBox.show(4, "搜索对象不能为空，请输入一个搜索对象", false);
			}
			evt.preventDefault();
			return false;
		}
	};

	ModuleDialog.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {
			if (evt.target.value != "") {
				this.loading(this.entity, evt.target.value);
			} else {
				this.messageBox.show(4, "搜索对象不能为空，请输入一个搜索对象", false);
			}
			evt.preventDefault();
			return false;
		}
	};

	ModuleDialog.prototype.loading = function(entity, condition) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(20), {
			appid : entity.id,
			cond : condition,
			ownerid : entity.owner,
		}).complete(function(data) {
			that.loadData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	ModuleDialog.prototype.loadData = function(objs) {
		var that = this;
		$(this.list).children().remove();
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				var acctrl = new AppServiceAccessControl();
				acctrl.parse(objs[i]);
				var row = this.list.insertRow(-1);
				var cell = row.insertCell(0);
				cell.setAttribute("nowrap", "true");
				if (acctrl.createDateTime == null) {
					var check = document.createElement("input");
					cell.appendChild(check);
					check.type = "checkbox";
					check.name = objs[i].organizationId;
					check.value = objs[i].organizationId;
					check.addEventListener("click", function() {
						if (this.checked) {
							that.saveButton.disabled = false;
						}
						var checked = $("input[type=checkbox]:checked").length;
						if (checked > 0) {
							that.saveButton.disabled = false;
						} else {
							that.saveButton.disabled = true;
						}
					});
				} else {
					cell.innerHTML = "已添加";
				}
				this.createCell(1, acctrl.organizationName, row);
				this.createCell(2, acctrl.createDateTime, row);
				this.createCell(3, acctrl.accessCounting, row);
			}
			if (objs.length < 30) {
				for (var i = objs.length; i < 30; i++) {
					var row = this.list.insertRow(i);
					for (var j = 0; j < 4; j++) {
						this.createCell(j, "&nbsp;", row);
					}
				}
			}
		} else {
			this.initList();
		}
		this.addHeader();
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ModuleDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);