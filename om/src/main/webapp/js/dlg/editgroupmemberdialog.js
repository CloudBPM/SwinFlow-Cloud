/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "editAuthorityGroupMemberDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
		entity : "",
		ownerId : "",
	};

	var EditGroupMemberDialog = function(element, options) {
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
		this.modalframe;
		this.topparent;
		this.init(options);
	};

	EditGroupMemberDialog.prototype.init = function(options) {
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
		modaldialogDIV.style.width = "750px";
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
		this.saveButton.type = "OKButton";
		this.saveButton.id = "OKButton" + options.id;
		this.saveButton.className = "btn btn-primary";
		this.saveButton.addEventListener("click", this, false);
		this.saveButton.innerHTML = "确定";
		this.disableButton(this.saveButton);

		dialogFooterDIV.appendChild(this.saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "CancelButton";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

	};

	EditGroupMemberDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		form.className = "form-horizontal";
		parent.appendChild(form);

		// search data
		// search the left
		var groupG = document.createElement("DIV");
		form.appendChild(groupG);
		groupG.className = "form-group";
		groupG.setAttribute("role", "search");
		groupG.setAttribute("aria-label", "");

		var searchDiv1 = document.createElement("DIV");
		groupG.appendChild(searchDiv1);
		searchDiv1.id = "searchDivLeft" + this.options.id;
		searchDiv1.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		var group0 = this.crateSGroup(searchDiv1);
		this.searchLeft = document.createElement("input");
		group0.appendChild(this.searchLeft);
		this.searchLeft.type = "text";
		this.searchLeft.className = "form-control";
		this.searchLeft.setAttribute("placeholder", "搜索...");
		this.searchLeft.addEventListener('input', this, false);// 为回车键加监听事件

		var searchSpanLeft = document.createElement("span");
		searchSpanLeft.className = "input-group-btn";
		group0.appendChild(searchSpanLeft);

		this.searchLeftBtn = this.createTool(searchSpanLeft, "searchSL"
				+ this.options.id, "刷新", "btn btn-success", "i",
				"fa fa-refresh fa-lg");

		// search the right
		var searchDiv2 = document.createElement("DIV");
		groupG.appendChild(searchDiv2);
		searchDiv2.id = "searchDivRight" + this.options.id;
		searchDiv2.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		var group1 = this.crateSGroup(searchDiv2);
		this.searchRight = document.createElement("input");
		group1.appendChild(this.searchRight);
		this.searchRight.type = "text";
		this.searchRight.className = "form-control";
		this.searchRight.setAttribute("placeholder", "搜索...");
		this.searchRight.addEventListener('input', this, false);// 为回车键加监听事件

		var searchSpanRight = document.createElement("span");
		searchSpanRight.className = "input-group-btn";
		group1.appendChild(searchSpanRight);

		this.searchRightBtn = this.createTool(searchSpanRight, "searchSR"
				+ this.options.id, "刷新", "btn btn-success", "i",
				"fa fa-refresh fa-lg");
		// search data

		var group2 = document.createElement("DIV");
		form.appendChild(group2);
		group2.className = "form-group";
		group2.setAttribute("role", "search");
		group2.setAttribute("aria-label", "");

		var listDiv = document.createElement("DIV");
		group2.appendChild(listDiv);
		listDiv.id = "listDiv" + this.options.id;
		listDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		var leftDiv = document.createElement("DIV");
		listDiv.appendChild(leftDiv);
		leftDiv.className = "col-lg-5 col-md-5 col-sm-5 col-xs-5";
		leftDiv.style.margin = "0px";
		leftDiv.style.padding = "0px";
		this.leftSelect = document.createElement("select");
		leftDiv.appendChild(this.leftSelect);
		this.leftSelect.setAttribute("multiple", "multiple");
		this.leftSelect.style.height = "400px";
		this.leftSelect.className = "form-control";

		// ---------------------------------------------------------
		this.createMiddleButtons(listDiv);
		this.disableButton(this.removeAllButton);
		this.disableButton(this.removeOneButton);
		this.disableButton(this.addOneButton);
		this.disableButton(this.addAllButton);
		// ---------------------------------------------------------

		var rightDiv = document.createElement("DIV");
		listDiv.appendChild(rightDiv);
		rightDiv.className = "col-lg-5 col-md-5 col-sm-5 col-xs-5";
		rightDiv.style.margin = "0px";
		rightDiv.style.padding = "0px";

		this.rightSelect = document.createElement("select");
		rightDiv.appendChild(this.rightSelect);
		this.rightSelect.setAttribute("multiple", "multiple");
		this.rightSelect.style.height = "400px";
		this.rightSelect.className = "form-control";

		this.loading(this.entity);
	};

	// create <<, <, >, >> buttons
	EditGroupMemberDialog.prototype.createMiddleButtons = function(listDiv) {
		var middleDiv = document.createElement("DIV");
		listDiv.appendChild(middleDiv);
		middleDiv.className = "col-lg-2 col-md-2 col-sm-2 col-xs-2";
		middleDiv.style.margin = "0px";
		middleDiv.style.paddingLeft = "32px";

		var removeAllButtonDiv = document.createElement("DIV");
		middleDiv.appendChild(removeAllButtonDiv);
		removeAllButtonDiv.style.padding = "2px";

		this.removeAllButton = document.createElement("button");
		removeAllButtonDiv.appendChild(this.removeAllButton);
		this.removeAllButton.id = "removeAllButton" + this.options.id;
		this.removeAllButton.className = "btn btn-primary ";
		this.removeAllButton.addEventListener('click', this, false);
		var icon1 = document.createElement("i");
		this.removeAllButton.appendChild(icon1);
		icon1.id = "removeAllButtonI" + this.options.id;
		icon1.className = "fa fa-angle-double-right";
		icon1.setAttribute("aria-hidden", "true");
		icon1.setAttribute("title", "移除左侧所有选项");

		var removeOneButtonDiv = document.createElement("DIV");
		middleDiv.appendChild(removeOneButtonDiv);
		removeOneButtonDiv.style.padding = "2px";

		this.removeOneButton = document.createElement("button");
		removeOneButtonDiv.appendChild(this.removeOneButton);
		this.removeOneButton.id = "removeOneButton" + this.options.id;
		this.removeOneButton.className = "btn btn-primary ";
		this.removeOneButton.style.width = "34px";
		this.removeOneButton.addEventListener('click', this, false);
		var icon2 = document.createElement("i");
		this.removeOneButton.appendChild(icon2);
		icon2.id = "removeOneButtonI" + this.options.id;
		icon2.className = "fa fa-angle-right";
		icon2.setAttribute("aria-hidden", "true");
		icon2.setAttribute("title", "移除左侧中一个或多个选项");

		var addOneButtonDiv = document.createElement("DIV");
		middleDiv.appendChild(addOneButtonDiv);
		addOneButtonDiv.style.padding = "2px";

		this.addOneButton = document.createElement("button");
		addOneButtonDiv.appendChild(this.addOneButton);
		this.addOneButton.id = "addOneButton" + this.options.id;
		this.addOneButton.className = "btn btn-primary ";
		this.addOneButton.style.width = "34px";
		this.addOneButton.addEventListener('click', this, false);
		var icon3 = document.createElement("i");
		this.addOneButton.appendChild(icon3);
		icon3.id = "addOneButtonI" + this.options.id;
		icon3.className = "fa fa-angle-left";
		icon3.setAttribute("aria-hidden", "true");
		icon3.setAttribute("title", "添加一个或多个选项到右侧");

		var addAllButtonDiv = document.createElement("DIV");
		middleDiv.appendChild(addAllButtonDiv);
		addAllButtonDiv.style.padding = "2px";

		this.addAllButton = document.createElement("button");
		addAllButtonDiv.appendChild(this.addAllButton);
		this.addAllButton.id = "addAllButton" + this.options.id;
		this.addAllButton.className = "btn btn-primary ";
		this.addAllButton.addEventListener('click', this, false);
		var icon4 = document.createElement("i");
		this.addAllButton.appendChild(icon4);
		icon4.id = "addAllButtonI" + this.options.id;
		icon4.className = "fa fa-angle-double-left";
		icon4.setAttribute("aria-hidden", "true");
		icon4.setAttribute("title", "添加所有选项到左侧");
	};

	EditGroupMemberDialog.prototype.crateSGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	EditGroupMemberDialog.prototype.createTool = function(group, id, title,
			style, fonttag, fontclass) {
		var button = document.createElement("button");
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		group.appendChild(button);
		var icon = document.createElement(fonttag);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		button.appendChild(icon);
		return button;
	};

	EditGroupMemberDialog.prototype.loading = function(entity) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(omservices.api(21, this.options.ownerId), {
			grpid : entity.id,
			owner : entity.owner,
		}).complete(
				function(data) {
					data = data.responseJSON;
					if (data.status != null && data.status != ""
							&& data.status != undefined) {
						if (data.status == 0 || data.status == -10) {
							messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
							return;
						}
					}
					that.loadData(data);

					$("#progressbar").hide();
				});
	};

	EditGroupMemberDialog.prototype.loadData = function(data) {
		while (this.leftSelect.length > 0) {
			this.leftSelect.remove(this.leftSelect.length - 1);
		}
		while (this.rightSelect.length > 0) {
			this.rightSelect.remove(this.rightSelect.length - 1);
		}
		this.editList = new GroupMemberEditList()
		this.editList.parseFromJSON(data, this.entity.owner);
		this.searchLeftValue(this.searchLeft.value);
		this.searchRightValue(this.searchRight.value);
		this.setButtonStatus();
	}

	EditGroupMemberDialog.prototype.setButtonStatus = function() {
		if (this.leftSelect.options.length > 0) {
			this.enableButton(this.removeAllButton);
			if (this.leftSelect.selectedIndex > -1) {
				this.enableButton(this.removeOneButton);
			} else {
				this.disableButton(this.removeOneButton);
			}
		} else {
			this.disableButton(this.removeAllButton);
			this.disableButton(this.removeOneButton);
		}
		if (this.rightSelect.options.length > 0) {
			this.enableButton(this.addAllButton);
			if (this.rightSelect.selectedIndex > -1) {
				this.enableButton(this.addOneButton);
			} else {
				this.disableButton(this.addOneButton);
			}
		} else {
			this.disableButton(this.addOneButton);
			this.disableButton(this.addAllButton);
		}
	}

	EditGroupMemberDialog.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		option.name = "option";
		option.addEventListener('click', this, false);
		parent.options.add(option, index);
	};

	EditGroupMemberDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	EditGroupMemberDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	EditGroupMemberDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "input":
			this.doKeydown(e);
			break;
		}
	};

	EditGroupMemberDialog.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (evt.target == this.searchLeft) {
			while (this.leftSelect.length > 0) {
				this.leftSelect.remove(this.leftSelect.length - 1);
			}
			this.searchLeftValue(this.searchLeft.value);
			this.setButtonStatus();
		} else if (evt.target == this.searchRight) {
			while (this.rightSelect.length > 0) {
				this.rightSelect.remove(this.rightSelect.length - 1);
			}
			this.searchRightValue(this.searchRight.value);
			this.setButtonStatus();
		}
		return false;
	};

	EditGroupMemberDialog.prototype.searchLeftValue = function(value) {
		if (value != "") {
			var lst = this.editList.searchLeftList(value);
			for (var j = 0; j < lst.length; j++) {
				var gm = this.editList.findMember(lst[j].staffId);
				var n = this.createOptionTitle(gm);
				this.addOptions(this.leftSelect, n, gm.staffId, 0);
			}
			this.leftSelect.selectedIndex = 0;
		} else {
			for (var j = 0; j < this.editList.leftList.length; j++) {
				var gm = this.editList.leftList[j];
				var n = this.createOptionTitle(gm);
				this.addOptions(this.leftSelect, n, gm.staffId, 0);
			}
			this.leftSelect.selectedIndex = 0;
		}
	};

	EditGroupMemberDialog.prototype.searchRightValue = function(value) {
		if (value != "") {
			var lst = this.editList.searchRightList(value);
			for (var j = 0; j < lst.length; j++) {
				var gm = this.editList.findMember(lst[j].staffId);
				var n = this.createOptionTitle(gm);
				this.addOptions(this.rightSelect, n, gm.staffId, 0);
			}
			this.rightSelect.selectedIndex = 0;
		} else {
			for (var j = 0; j < this.editList.rightList.length; j++) {
				var gm = this.editList.rightList[j];
				var n = this.createOptionTitle(gm);
				this.addOptions(this.rightSelect, n, gm.staffId, 0);
			}
			this.rightSelect.selectedIndex = 0;
		}
	};

	EditGroupMemberDialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		if (evt.target == this.removeAllButton
				|| evt.target.id == "removeAllButton" + this.options.id
				|| evt.target.id == "removeAllButtonI" + this.options.id) {
			var ids = [];
			var i = 0;
			while (i < this.leftSelect.length) {
				ids.push(this.leftSelect.options[i].value);
				i++;
			}
			while (this.leftSelect.length > 0) {
				this.leftSelect.remove(this.leftSelect.length - 1);
			}
			for (var j = 0; j < ids.length; j++) {
				var gm = this.editList.findMember(ids[j]);
				var n = this.createOptionTitle(gm);
				this.addOptions(this.rightSelect, n, gm.staffId, 0);
				this.editList.removedMemberIds.push(gm.staffId);
			}
			this.setButtonStatus();
			this.enableButton(this.saveButton);
		} else if (evt.target == this.removeOneButton
				|| evt.target.id == "removeOneButton" + this.options.id
				|| evt.target.id == "removeOneButtonI" + this.options.id) {
			var ids = $(this.leftSelect).val();
			for (var k = 0; k < ids.length; k++) {
				for (var i = 0; i < this.leftSelect.length; i++) {
					if (this.leftSelect.options[i].value == ids[k]) {
						this.leftSelect.remove(i);
						break;
					}
				}
			}
			for (var j = 0; j < ids.length; j++) {
				var gm = this.editList.findMember(ids[j]);
				var n = this.createOptionTitle(gm);
				this.addOptions(this.rightSelect, n, gm.staffId, 0);
				this.editList.removedMemberIds.push(gm.staffId);
			}
			this.setButtonStatus();
			this.enableButton(this.saveButton);
		} else if (evt.target == this.addOneButton
				|| evt.target.id == "addOneButton" + this.options.id
				|| evt.target.id == "addOneButtonI" + this.options.id) {
			var ids = $(this.rightSelect).val();
			for (var k = 0; k < ids.length; k++) {
				for (var i = 0; i < this.rightSelect.length; i++) {
					if (this.rightSelect.options[i].value == ids[k]) {
						this.rightSelect.remove(i);
						break;
					}
				}
			}
			for (var j = 0; j < ids.length; j++) {
				var gm = this.editList.findMember(ids[j]);
				var n = this.createOptionTitle(gm);
				this.addOptions(this.leftSelect, n, gm.staffId, 0);
				this.editList.addedMemberIds.push(gm.staffId);
			}
			this.setButtonStatus();
			this.enableButton(this.saveButton);
		} else if (evt.target == this.addAllButton
				|| evt.target.id == "addAllButton" + this.options.id
				|| evt.target.id == "addAllButtonI" + this.options.id) {
			var ids = [];
			var i = 0;
			while (i < this.rightSelect.length) {
				ids.push(this.rightSelect.options[i].value);
				i++;
			}
			while (this.rightSelect.length > 0) {
				this.rightSelect.remove(this.rightSelect.length - 1);
			}
			for (var j = 0; j < ids.length; j++) {
				var gm = this.editList.findMember(ids[j]);
				var n = this.createOptionTitle(gm);
				this.addOptions(this.leftSelect, n, gm.staffId, 0);
				this.editList.addedMemberIds.push(gm.staffId);
			}
			this.setButtonStatus();
			this.enableButton(this.saveButton);
		} else if (evt.target.name == "option") {
			if (this.leftSelect.selectedIndex > -1
					|| this.rightSelect.selectedIndex > -1) {
				this.setButtonStatus();
			}
		} else if (evt.target.id == ("OKButton" + this.options.id)) {
			this.editList.clearChangedStaffIds();
			var that = this;
			$("#progressbar").show();
			$
					.post(omservices.api(22, this.options.ownerId), {
						editlist : JSON.stringify(this.editList),
					})
					.complete(
							function(data) {
								data = data.responseJSON;
								if (data.status != null && data.status != ""
										&& data.status != undefined) {
									if (data.status == 0 || data.status == -10) {
										messageDialog
												.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
										return;
									}
								}
								if (data.status == "1") {
									that.options.parent.loading(that.entity, 1,
											30, "");
									that.hide();
								}

								$("#progressbar").hide();
							});
		} else if (evt.target == this.searchLeftBtn
				|| evt.target.id == ("searchSL" + this.options.id)) {
			this.loading(this.entity);
		} else if (evt.target == this.searchRightBtn
				|| evt.target.id == ("searchSR" + this.options.id)) {
			this.loading(this.entity);
		}
	};

	EditGroupMemberDialog.prototype.createOptionTitle = function(obj) {
		var cd = "无";
		if (obj.staffCode != null && obj.staffCode != ""
				&& obj.staffCode != "null") {
			cd = obj.staffCode;
		}
		var n = obj.staffFullName + "(" + cd + ")";
		return n;
	};

	EditGroupMemberDialog.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	EditGroupMemberDialog.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EditGroupMemberDialog(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);