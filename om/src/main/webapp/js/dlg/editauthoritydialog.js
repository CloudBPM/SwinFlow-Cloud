/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "eidtAuthorityListDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
		entity : "",
		ownerId : "",
	};

	var EidtAuthorityListDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			entity : "",
			ownerId : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = null;
		this.modalframe;
		this.topparent;
		this.init(options);
	};

	EidtAuthorityListDialog.prototype.init = function(options) {
		this.entity = options.entity;
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
		modaldialogDIV.style.width = "750px"
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

	};

	EidtAuthorityListDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		form.className = "form-horizontal";
		parent.appendChild(form);

		var listDiv = document.createElement("DIV");
		form.appendChild(listDiv);
		listDiv.id = "listDiv" + this.options.id;
		listDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		var toolbarDiv = document.createElement("DIV");
		listDiv.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		toolbarDiv.style.padding = "2px";
		this.createNavigationGroup(toolbarDiv);

		var tableDiv = document.createElement("DIV");
		listDiv.appendChild(tableDiv);
		tableDiv.id = "tablediv" + this.options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";

		this.list = document.createElement("table");
		this.list.className = "table table-striped table-hover";
		tableDiv.appendChild(this.list);

		this.loading(this.entity);
	};

	EidtAuthorityListDialog.prototype.loading = function(entity) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(omservices.api(20, this.options.ownerId), {}).complete(
				function(data) {
					var data = data.responseJSON;
					if (data != undefined && data.status != undefined
							&& data.status != null && data.status != "") {
						if (data.status == 0 || data.status == -10) {
							messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
							return;
						}
					}
					that.loadData(data);

					$("#progressbar").hide();
				});
	};

	EidtAuthorityListDialog.prototype.loadData = function(jsonobj) {
		$(this.list).children().remove();
		if (jsonobj.length > 0) {
			for (var i = 0; i < jsonobj.length; i++) {
				var auth = new Authority();
				auth.parseFromJSON(jsonobj[i]);
				var row = this.list.insertRow(-1);
				var cell1 = row.insertCell(0);
				var checkInput = document.createElement("input");
				checkInput.type = "checkbox";
				checkInput.name = "authorities";
				checkInput.value = auth.id;
				checkInput.checked = this.entity.existAuthId(auth.id);
				checkInput.addEventListener('change', this, false);
				cell1.appendChild(checkInput);
				this.createCell(1, Utils.parse(auth.name), row);
				this.createCell(2, Utils.parse(auth.description), row);
			}
			if (jsonobj.length < 15) {
				for (var i = jsonobj.length; i < 15; i++) {
					var row = this.list.insertRow(i);
					for (var j = 0; j < 3; j++) {
						this.createCell(j, "&nbsp;", row);
					}
				}
			}
		} else {
			this.initList();
		}
		this.addHeader();
	};

	EidtAuthorityListDialog.prototype.initList = function() {
		// document.createElement('tbody');
		for (var i = 0; i < 15; i++) {
			var row = this.list.insertRow(i);
			for (var j = 0; j < 3; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
	};

	EidtAuthorityListDialog.prototype.createNavigationGroup = function(parent) {
		var group2 = this.createGroup(parent);
		var selectAllLabel = document.createElement("label");
		group2.appendChild(selectAllLabel);
		this.inputAllSelect = document.createElement("input");
		this.inputAllSelect.id = "selectAll" + this.options.id;
		this.inputAllSelect.setAttribute("title", "选择全部权限");
		this.inputAllSelect.type = "checkbox";
		this.inputAllSelect.addEventListener('change', this, false);
		this.inputAllSelect.value = "0";
		selectAllLabel.appendChild(this.inputAllSelect);
		var selectAllText = document.createElement("text");
		selectAllText.innerHTML = "全选";
		selectAllLabel.appendChild(selectAllText);

	};

	EidtAuthorityListDialog.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	EidtAuthorityListDialog.prototype.createCell = function(no, cellname, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = cellname;
	};

	EidtAuthorityListDialog.prototype.addHeader = function() {
		var header = this.list.createTHead();
		var row = header.insertRow(0);
		this.createHead("", row);
		this.createHead("权限名称", row);
		this.createHead("权限描述", row);
	};

	EidtAuthorityListDialog.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	EidtAuthorityListDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	EidtAuthorityListDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	EidtAuthorityListDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	EidtAuthorityListDialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		var that = this;
		if (evt.target.id == "OKButton" + this.options.id) {
			this.entity.clearChangedAuthIds();
			$("#progressbar").show();
			$.post(omservices.api(19, this.options.ownerId), {
				group : JSON.stringify(this.entity),
			}).complete(
					function(data) {
						data = data.responseJSON;
						if (data != undefined && data.status != undefined
								&& data.status != null && data.status != "") {
							if (data.status == 0 || data.status == -10) {
								messageDialog
										.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
							} else	if (data.status == 1) {
								that.entity.authoritiesIds = data.authids;
								that.options.parent.loading(that.entity);
								that.hide();
							}
						}
						$("#progressbar").hide();
					});
		}
	};

	EidtAuthorityListDialog.prototype.doChange = function(evt) {
		var that = this;
		var allauth = [];
		var cmd = "add";
		if (evt.target == this.inputAllSelect
				|| evt.target.id == ("selectAll" + this.options.id)) {
			if (this.inputAllSelect.checked) {
				$(':checkbox').each(function() {
					this.checked = true;
					if (this.value != "0") {
						that.entity.putAddedAuthId(this.value);
					}
				});
			} else {
				$(':checkbox').each(function() {
					this.checked = false;
					if (this.value != "0") {
						that.entity.putRemovedAuthId(this.value);
					}
				});
			}
		} else if (evt.target.name == "authorities") {
			if (evt.target.checked) {
				that.entity.putAddedAuthId(evt.target.value);
			} else {
				that.entity.putRemovedAuthId(evt.target.value);
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EidtAuthorityListDialog(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);