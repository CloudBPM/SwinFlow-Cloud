/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "groupMemberPane";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		entity : "",
		topparent : "",
		tabid : "",
	};

	var GroupMemberPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			parent : "",
			entity : "",
			topparent : "",
			tabid : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent = options.topparent;
		this.pagesize = 30;
		this.ruleditdialog;
		this.tabId = options.tabid;
		this.entity = options.entity;
		this.currpage = null; // by default;
		this.init(options);
	};

	GroupMemberPanel.prototype.init = function(options) {
		this.entity = options.entity;
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var toolbarForm = document.createElement("form");
		toolbarForm.className = "form-inline";
		modalframe.appendChild(toolbarForm);

		var toolbarDiv = document.createElement("DIV");
		toolbarForm.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		toolbarDiv.style.padding = "2px";
		this.createEditGroup(toolbarDiv);
		this.createNavigationGroup(toolbarDiv);
		this.createSearchGroup(toolbarDiv);

		var tableDiv = document.createElement("DIV");
		modalframe.appendChild(tableDiv);
		tableDiv.id = "tablediv" + options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = (parseInt(options.topparent.style.height) - 82)
				+ "px";

		this.list = document.createElement("table");
		this.list.className = "table table-striped table-hover";
		tableDiv.appendChild(this.list);

		var p2 = $(this.element).editAuthorityGroupMemberDialog({
			id : "editGroupMember027",
			title : "轩琦科技 - 编辑权限组用户",
			parent : this,
			entity : this.entity,
			ownerId : this.options.ownerId,
		});
		this.editAuthorityGroupMemberDialog = p2
				.data("editAuthorityGroupMemberDialog");

		this.loading(this.entity, 1, 30, "");
	};

	GroupMemberPanel.prototype.createNavigationGroup = function(parent) {
		var group1 = this.createGroup(parent);
		this.refreshHButton = this.createTool(group1, "refreshGM"
				+ this.options.id, "刷新", "btn btn-success btn-sm", "i",
				"fa fa-refresh fa-lg");
		this.enableButton(this.refreshHButton);

		var group = this.createGroup(parent);
		this.firstPageHButton = this.createTool(group, "firstPageGM"
				+ this.options.id, "首页", "btn btn-default btn-sm", "i",
				"fa fa-step-backward fa-lg");
		this.previousPageHButton = this.createTool(group, "previousPageGM"
				+ this.options.id, "前一页", "btn btn-default btn-sm", "i",
				"fa fa-backward fa-lg");
		this.nextPageHButton = this.createTool(group, "nextPageGM"
				+ this.options.id, "后一页", "btn btn-default btn-sm", "i",
				"fa fa-forward fa-lg");
		this.lastPageHButton = this.createTool(group, "lastPageGM"
				+ this.options.id, "末页", "btn btn-default btn-sm", "i",
				"fa fa-step-forward fa-lg");

		var group2 = this.createGroup(parent);
		this.pageno = this.createLabel(group2, "l1" + this.options.id, "");
		this.totalpage = this.createLabel(group2, "l2" + this.options.id, "");

	};

	GroupMemberPanel.prototype.createEditGroup = function(parent) {
		// fa-lg: 24px; fa-2x ：32px
		var group = this.createGroup(parent);
		this.addUserButton = this.createTool(group, "adduserGM"
				+ this.options.id, "添加新职员到权限组", "btn btn-success btn-sm", "i",
				"fa fa-user-plus fa-lg");
		this.enableButton(this.addUserButton);
		var group1 = this.createGroup(parent);
		this.addUserButton = this.createTool(group1, "edituserGM"
				+ this.options.id, "编辑权限组成员", "btn btn-primary btn-sm", "i",
				"fa fa-pencil-square-o fa-lg");
	};

	GroupMemberPanel.prototype.createSearchGroup = function(parent) {
		var group = this.crateSGroup(parent);
		this.search = document.createElement("input");
		this.search.type = "text";
		this.search.className = "form-control input-sm";
		this.search.setAttribute("placeholder", "搜索...");
		this.search.addEventListener('keydown', this, false);// 为回车键加监听事件
		group.appendChild(this.search);

		var searchSpan = document.createElement("span");
		searchSpan.className = "input-group-btn";
		group.appendChild(searchSpan);

		this.searchBtn = this.createTool(searchSpan, "searchGM"
				+ this.options.id, "查找权限组成员", "btn btn-primary btn-sm", "i",
				"fa fa-search fa-lg");
	};

	GroupMemberPanel.prototype.crateSGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	GroupMemberPanel.prototype.doClick = function(evt) {
		if (evt.target == this.firstPageHButton
				|| (evt.target.id == ("firstPageGM" + this.options.id))) {
			this.loading(this.entity, 1, this.pagesize, "");
		} else if (evt.target == this.previousPageHButton
				|| (evt.target.id == ("previousPageGM" + this.options.id))) {
			this.loading(this.entity, this.currpage.pageNo - 1, this.pagesize,
					"");
		} else if (evt.target == this.nextPageHButton
				|| (evt.target.id == ("nextPageGM" + this.options.id))) {
			this.loading(this.entity, this.currpage.pageNo + 1, this.pagesize,
					"");
		} else if (evt.target == this.lastPageHButton
				|| (evt.target.id == ("lastPageGM" + this.options.id))) {
			this.loading(this.entity, this.currpage.allPagesCount,
					this.pagesize, "");
		} else if (evt.target == this.refreshHButton
				|| (evt.target.id == ("refreshGM" + this.options.id))) {
			this.loading(this.entity, this.currpage.pageNo, this.pagesize, "");
		} else if (evt.target == this.searchBtn
				|| (evt.target.id == ("searchGM" + this.options.id))) {
			this.doNextPageAction(1);
		} else if (evt.target == this.addUserButton
				|| (evt.target.id == ("adduserGM" + this.options.id))) {
			this.editAuthorityGroupMemberDialog.show();
		} else if (evt.target == this.addUserButton
				|| (evt.target.id == ("edituserGM" + this.options.id))) {
			this.editAuthorityGroupMemberDialog.show();
		}
	};

	GroupMemberPanel.prototype.doNextPageAction = function(pageno) {
		// if (this.getDirty()) {
		// this.confirmInfoDialog.show("当前职员列表已经修改，是否保存修改？");
		// } else {
		this.loading(this.entity, pageno, this.pagesize, this.search.value);
		// }
	};

	GroupMemberPanel.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	GroupMemberPanel.prototype.loading = function(entity, pageno, pagesize,
			condition) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(omservices.api(18, this.options.ownerId), {
			grpid : entity.id,
			pn : pageno,
			psz : pagesize,
			cond : condition,
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

	GroupMemberPanel.prototype.loadData = function(jsonobj) {
		var currPage = new Page();
		currPage.parseFromJSON(jsonobj);
		this.currpage = currPage;
		$(this.list).children().remove();
		var objs = currPage.pageEntities;
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				var groupmember = new GroupMember();
				groupmember.parseFromJSON(objs[i]);
				var row = this.list.insertRow(-1);
				// row.setAttribute("key", history.id);
				this.createCell(0, groupmember.staffCode, row);
				this.createCell(1, groupmember.userAccount, row);
				this.createCell(2, groupmember.userSurname
						+ groupmember.userGivenName, row);
				this.createCell(3, groupmember.boardDate, row);
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
		this.pageno.innerHTML = "第" + this.currpage.pageNo + "页";
		this.totalpage.innerHTML = "/共" + this.currpage.allPagesCount + "页";
		if (this.currpage.allPagesCount <= 1) {
			this.disableButton(this.firstPageHButton);
			this.disableButton(this.previousPageHButton);
			this.disableButton(this.nextPageHButton);
			this.disableButton(this.lastPageHButton);
		} else if (this.currpage.allPagesCount > 1) {
			if (this.currpage.pageNo == 1) {
				this.disableButton(this.firstPageHButton);
				this.disableButton(this.previousPageHButton);
				this.enableButton(this.nextPageHButton);
				this.enableButton(this.lastPageHButton);
			} else if (this.currpage.pageNo == this.currpage.allPagesCount) {
				this.enableButton(this.firstPageHButton);
				this.enableButton(this.previousPageHButton);
				this.disableButton(this.nextPageHButton);
				this.disableButton(this.lastPageHButton);
			} else if (this.currpage.pageNo > 1
					&& this.currpage.pageNo < this.currpage.allPagesCount) {
				this.enableButton(this.firstPageHButton);
				this.enableButton(this.previousPageHButton);
				this.enableButton(this.nextPageHButton);
				this.enableButton(this.lastPageHButton);
			}
		}
	};

	GroupMemberPanel.prototype.createTool = function(group, id, title, style,
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

	GroupMemberPanel.prototype.createLabel = function(group, id, title) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.id = id;
		group.appendChild(label);
		return label;
	};

	GroupMemberPanel.prototype.addHeader = function() {
		var header = this.list.createTHead();
		var row = header.insertRow(0);
		this.createHead("职员编号", row);
		this.createHead("用户账号", row);
		this.createHead("用户姓名", row);
		this.createHead("入职日期", row);
	};

	GroupMemberPanel.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = content;
	};

	GroupMemberPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	GroupMemberPanel.prototype.initList = function() {
		// document.createElement('tbody');
		for (var i = 0; i < 30; i++) {
			var row = this.list.insertRow(i);
			for (var j = 0; j < 17; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
	};

	GroupMemberPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	GroupMemberPanel.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {// 回车键
			evt.preventDefault();// 阻止该事件
			if (evt.target.value != "") {
				this.doNextPageAction(1);
			}
			return false;
		}
	};

	GroupMemberPanel.prototype.doDblClick = function(evt) {
	};

	GroupMemberPanel.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	GroupMemberPanel.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new GroupMemberPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);