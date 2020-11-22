/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "omUserEditor";
	var defaults = {
		id : "",
		ownerId : "",
		basicpropsheet : "",
		propsheet : "",
		height : 0,
		parent : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			basicpropsheet : "",
			propsheet : "",
			height : 0,
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.staffs = [];
		this.updatedStaffs = [];
		this.selectedStaff = null;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.currpage = null; // by default;
		this.pagesize = 30;
		this.init(options);
		this.createToolbar(options);
		this.createUserList(options);
		this.loading(1, this.pagesize, "", options.ownerId);
	};

	Editor.prototype.init = function(options) {
		this.editorPanel = document.createElement("DIV");
		this.element.appendChild(this.editorPanel);
		this.editorPanel.style.margin = "0px";
		this.editorPanel.style.padding = "0px";
		this.editorPanel.style.overflow = "auto";
		this.toolbarRow = document.createElement("DIV");
		this.editorPanel.appendChild(this.toolbarRow);
		this.toolbarRow.className = "row";
		this.toolbarRow.style.margin = "0px";
		this.toolbarRow.style.padding = "0px";
		this.painterRow = document.createElement("DIV");
		this.editorPanel.appendChild(this.painterRow);
		this.painterRow.className = "row";
		this.painterRow.style.margin = "0px";
		this.painterRow.style.padding = "0px";

		var canvasPanel = document.createElement("DIV");
		this.painterRow.appendChild(canvasPanel);
		var w = document.documentElement.clientWidth;
		canvasPanel.id = "userEditingPanel" + options.id;
		canvasPanel.className = "col";
		canvasPanel.style.width = (w - 568) + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginLeft = "4px";
		canvasPanel.style.padding = "0px";

		this.tableDivPane = document.createElement("DIV");
		canvasPanel.appendChild(this.tableDivPane);

		this.tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.tableDivPane.id = "convasPane" + options.id;
		this.tableDivPane.className = "table-responsive";
		this.tableDivPane.style.margin = "0px";
		this.tableDivPane.style.padding = "0px";
		this.tableDivPane.style.border = "1px solid #ddd";
		this.tableDivPane.style.height = options.height + "px";
		this.tableDivPane.style.borderRadius = "4px";
		this.tableDivPane.style.overflowY = "auto";

		var p4 = $(this.element).newStaffDetailsDialog({
			id : "025",
			title : "云BPM - 添加新职员",
			parent : this,
			ownerid : options.ownerId,
		});
		this.newStaffDetailsDialog = p4.data("newStaffDetailsDialog");

		var p4 = $(this.element).searchIdNumberDialog({
			id : "024",
			title : "云BPM - 添加新职员",
			parent : this,
			ownerid : options.ownerId,
			newstaffdlg : this.newStaffDetailsDialog,
		});
		this.searchIdNumberDialog = p4.data("searchIdNumberDialog");

		var p2 = $(this.element).confirmInfoDialog({
			id : "026",
			title : "云BPM提示",
			parent : this,
		});
		this.confirmInfoDialog = p2.data("confirmInfoDialog");

	};

	Editor.prototype.createUserList = function(options) {
		this.safflist = document.createElement("table");
		this.safflist.id = "safflist";
		this.safflist.className = "table table-striped table-hover";
		this.tableDivPane.appendChild(this.safflist);
	};

	Editor.prototype.loading = function(pageno, pagesize, condition, ownerid) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(omservices.api(11, this.options.ownerId), {
			cond : condition,
			ownid : ownerid,
			pn : pageno,
			psz : pagesize,
		}).complete(
				function(data) {
					data = data.responseJSON;
					if (data.status != null && data.status != ""
							&& data.status != undefined) {
						if (data1.status == 0 || data1.status == -10) {
							messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
							return;
						}
					}
					that.loadData(data);

					$("#progressbar").hide();
				});
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.loadData = function(jsonobj) {
		var currPage = new Page();
		currPage.parseFromJSON(jsonobj);
		this.currpage = currPage;
		$(this.safflist).children().remove();
		this.staffs = [];
		var objs = currPage.pageEntities;
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				var staff = new Staff();
				staff.parseFromJSON(objs[i], this.options.ownerId);
				this.staffs.push(staff);
				var row = this.safflist.insertRow(-1);
				row.setAttribute("key", staff.id);
				row.addEventListener("click", this, false);
				row.addEventListener("dblclick", this, false);
				this.createCell(0, staff.user.name, row);
				this.createCell(1, Utils.parse(staff.user.fullName), row);
				this.createCell(2, staff.user.mobile, row);
				this.createCell(3, staff.workPhoneNumber, row);
				this.createCell(4, staff.workEmail, row);
				this.createCell(5, Utils.parse(staff.officeLocation), row);
				this.createCell(6, workstatus[staff.workStatus], row);
				this.createCell(7, jobstatus[staff.jobStatus], row);
				this.createCell(8, "", row);
			}
			if (objs.length < 20) {
				for (var i = objs.length; i < 20; i++) {
					var row = this.safflist.insertRow(i);
					for (var j = 0; j < 9; j++) {
						this.createCell(j, "&nbsp;", row);
					}
				}
			}
		} else {
			this.initSaffList(this.options);
		}
		this.addSaffListHeader(this.options);
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
		if (this.staffs.length > 0) {
			this.selectRow(this.staffs[0].id);
		}
	};

	Editor.prototype.initSaffList = function(options) {
		// document.createElement('tbody');
		for (var i = 0; i < 20; i++) {
			var row = this.safflist.insertRow(i);
			for (var j = 0; j < 12; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
	};

	Editor.prototype.addSaffListHeader = function(options) {
		// $(this.safflist).children().remove();
		var header = this.safflist.createTHead();
		var row = header.insertRow(0);
		this.createHead("账号", row);
		this.createHead("姓名", row);
		this.createHead("手机", row);
		this.createHead("办公电话", row);
		this.createHead("办公邮件", row);
		this.createHead("办公位置", row);
		this.createHead("当前状态", row);
		this.createHead("在职状态", row);
		this.createHead("操作", row);
	};

	Editor.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	Editor.prototype.createCell = function(no, cellname, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = cellname;
	};

	Editor.prototype.createToolbar = function(options) {
		var toolbarForm = document.createElement("form");
		toolbarForm.className = "form-inline";
		this.toolbarRow.appendChild(toolbarForm);

		var toolbarDiv = document.createElement("DIV");
		toolbarForm.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		toolbarDiv.style.padding = "2px";
		this.createEditGroup(toolbarDiv);
		this.createUndoRedoGroup(toolbarDiv);
		this.createNavigationGroup(toolbarDiv);
		this.createSearchGroup(toolbarDiv);
	};

	Editor.prototype.createUndoRedoGroup = function(parent) {
		var group = this.createGroup(parent);
		this.undobutton = this.createTool(group, "undoS" + this.options.id,
				"撤销", "btn btn-default", "i", "fa fa-reply fa-lg");
		// fa-lg: 24px; fa-2x ：32px
		this.redobutton = this.createTool(group, "redoS" + this.options.id,
				"恢复", "btn btn-default", "i", "fa fa fa-share fa-lg");
		this.stack.undoButton = this.undobutton;
		this.stack.redoButton = this.redobutton;
		this.disableButton(this.undobutton);
		this.disableButton(this.redobutton);
	};

	Editor.prototype.createEditGroup = function(parent) {
		var group = this.createGroup(parent);
		this.addUserButton = this.createTool(group, "adduserS"
				+ this.options.id, "添加新职员", "btn btn-success", "i",
				"fa fa-user-plus fa-lg");
		// fa-lg: 24px; fa-2x ：32px
		this.enableButton(this.addUserButton);
	};

	Editor.prototype.createNavigationGroup = function(parent) {
		var group1 = this.createGroup(parent);
		this.refreshHButton = this.createTool(group1, "refreshS"
				+ this.options.id, "刷新", "btn btn-success", "i",
				"fa fa-refresh fa-lg");
		this.enableButton(this.refreshHButton);

		var group = this.createGroup(parent);
		this.firstPageHButton = this.createTool(group, "firstPageS"
				+ this.options.id, "首页", "btn btn-default", "i",
				"fa fa-step-backward fa-lg");
		this.previousPageHButton = this.createTool(group, "previousPageS"
				+ this.options.id, "前一页", "btn btn-default", "i",
				"fa fa-backward fa-lg");
		this.nextPageHButton = this.createTool(group, "nextPageS"
				+ this.options.id, "后一页", "btn btn-default", "i",
				"fa fa-forward fa-lg");
		this.lastPageHButton = this.createTool(group, "lastPageS"
				+ this.options.id, "末页", "btn btn-default", "i",
				"fa fa-step-forward fa-lg");
		this.disableButton(this.firstPageHButton);
		this.disableButton(this.previousPageHButton);
		this.disableButton(this.nextPageHButton);
		this.disableButton(this.lastPageHButton);

		var group2 = this.createGroup(parent);
		this.pageno = this.createLabel(group2, "Sl1" + this.options.id, "");
		this.totalpage = this.createLabel(group2, "Sl2" + this.options.id, "");
	};

	Editor.prototype.createLabel = function(group, id, title) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.id = id;
		group.appendChild(label);
		return label;
	};

	Editor.prototype.createSearchGroup = function(parent) {
		var group = this.crateSGroup(parent);
		this.search = document.createElement("input");
		this.search.type = "text";
		this.search.className = "form-control";
		this.search.setAttribute("placeholder", "搜索...");
		group.appendChild(this.search);

		var searchSpan = document.createElement("span");
		searchSpan.className = "input-group-btn";
		group.appendChild(searchSpan);

		this.searchBtn = this.createTool(searchSpan, "searchS"
				+ this.options.id, "查找职员", "btn btn-primary", "i",
				"fa fa-search");
	};

	Editor.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	Editor.prototype.crateSGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	Editor.prototype.createTool = function(group, id, title, style, fonttag,
			fontclass) {
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

	Editor.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	Editor.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	Editor.prototype.setPropertySheet = function(obj) {
		if (obj == null && this.staffs != null && this.staffs.length > 0) {
			obj = this.staffs[0];
		}
		// basic property setting
		if (this.basicpropsheet != null) {
			this.basicpropsheet.tabId = this.options.id;
			this.basicpropsheet.setSheet(obj);
		}
		// advanced property setting.
		if (this.propsheet != null) {
			this.propsheet.tabId = this.options.id;
			this.propsheet.setSheet(obj);
		}
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	Editor.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.safflist.focus();
		}
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.firstPageHButton
				|| (evt.target.id == ("firstPageS" + this.options.id))) {
			this.doNextPageAction(1);
			this.act = 1;
		} else if (evt.target == this.previousPageHButton
				|| (evt.target.id == ("previousPageS" + this.options.id))) {
			this.doNextPageAction(this.currpage.pageNo - 1);
			this.act = 2;
		} else if (evt.target == this.nextPageHButton
				|| (evt.target.id == ("nextPageS" + this.options.id))) {
			this.doNextPageAction(this.currpage.pageNo + 1);
			this.act = 3;
		} else if (evt.target == this.lastPageHButton
				|| (evt.target.id == ("lastPageS" + this.options.id))) {
			this.doNextPageAction(this.currpage.allPagesCount);
			this.act = 4;
		} else if (evt.target == this.refreshHButton
				|| (evt.target.id == ("refreshS" + this.options.id))) {
			this.doNextPageAction(this.currpage.pageNo);
			this.act = 5;
		} else if (evt.target == this.searchBtn
				|| (evt.target.id == ("searchS" + this.options.id))) {
			this.doNextPageAction(1);
			this.act = 6;
		} else if (evt.target == this.undobutton
				|| (evt.target.id == ("undoS" + this.options.id))) {
			this.stack.undo();
		} else if (evt.target == this.redobutton
				|| (evt.target.id == ("redoS" + this.options.id))) {
			this.stack.redo();
		} else if (evt.target == this.addUserButton
				|| (evt.target.id == ("adduserS" + this.options.id))) {
			this.act = 7;
			if (this.getDirty()) {
				this.confirmInfoDialog.show("当前职员列表已经修改，是否保存修改？");
			} else {
				this.searchIdNumberDialog.show();
			}
		} else if (evt.target.tagName == "TD") {
			var table = evt.target.parentElement.parentElement;
			this.clearProcessSheet(table);
			evt.target.parentElement.style.background = "#d1d1e0";
			var r = evt.target.parentElement;
			this.selectRow(r.getAttribute("key"));
		}
	};

	Editor.prototype.doNextPageAction = function(pageno) {
		if (this.getDirty()) {
			this.confirmInfoDialog.show("当前职员列表已经修改，是否保存修改？");
		} else {
			this.loading(pageno, this.pagesize, this.search.value,
					this.options.ownerId);
		}
	};

	Editor.prototype.doYesAction = function() {
		this.options.parent.doSaveAction();
		this.confirmInfoDialog.hide();
		switch (this.act) {
		case 1: // first
			this.loading(1, this.pagesize, this.search.value,
					this.options.ownerId);
			break;
		case 2: // previous
			this.loading(this.currpage.pageNo - 1, this.pagesize,
					this.search.value, this.options.ownerId);
			break;
		case 3: // next
			this.loading(this.currpage.pageNo + 1, this.pagesize,
					this.search.value, this.options.ownerId);
			break;
		case 4: // last
			this.loading(this.currpage.allPagesCount1, this.pagesize,
					this.search.value, this.options.ownerId);
			break;
		case 5: // refresh
			this.loading(this.currpage.pageNo, this.pagesize,
					this.search.value, this.options.ownerId);
			break;
		case 6: // search
			this.loading(1, this.pagesize, this.search.value,
					this.options.ownerId);
			break;
		case 7: // add new staff
			this.searchIdNumberDialog.show();
			break;
		}

	};

	Editor.prototype.doNoAction = function() {
		this.confirmInfoDialog.hide();
		switch (this.act) {
		case 1: // first
			this.loading(1, this.pagesize, this.search.value,
					this.options.ownerId);
			break;
		case 2: // previous
			this.loading(this.currpage.pageNo - 1, this.pagesize,
					this.search.value, this.options.ownerId);
			break;
		case 3: // next
			this.loading(this.currpage.pageNo + 1, this.pagesize,
					this.search.value, this.options.ownerId);
			break;
		case 4: // last
			this.loading(this.currpage.allPagesCount1, this.pagesize,
					this.search.value, this.options.ownerId);
			break;
		case 5: // refresh
			this.loading(this.currpage.pageNo, this.pagesize,
					this.search.value, this.options.ownerId);
			break;
		case 6: // search
			this.loading(1, this.pagesize, this.search.value,
					this.options.ownerId);
			break;
		case 7: // add new staff
			this.searchIdNumberDialog.show();
			break;
		}

	};

	Editor.prototype.selectRow = function(id) {
		if (this.safflist.rows.length > 1) {
			for (var i = 0; i < this.safflist.rows.length; i++) {
				if (this.safflist.rows[i].getAttribute("key") == id) {
					this.safflist.rows[i].style.background = "#d1d1e0";
				}
			}
		}
		for (var i = 0; i < this.staffs.length; i++) {
			if (this.staffs[i].id == id) {
				this.setPropertySheet(this.staffs[i]);
				this.selectedStaff = this.staffs[i];
				break;
			}
		}
	};

	Editor.prototype.updateRow = function(id, prop, value) {
		if (this.safflist.rows.length > 1) {
			for (var i = 0; i < this.safflist.rows.length; i++) {
				if (this.safflist.rows[i].getAttribute("key") == id) {
					if (prop == "fullName") {
						$(this.safflist.rows[i].cells[1]).text(value);
						break;
					} else if (prop == "jobStatus") {
						$(this.safflist.rows[i].cells[7]).text(value);
						break;
					} else if (prop == "officeLocation") {
						$(this.safflist.rows[i].cells[5]).text(value);
						break;
					} else if (prop == "workEmail") {
						$(this.safflist.rows[i].cells[4]).text(value);
						break;
					} else if (prop == "workPhoneNumber") {
						$(this.safflist.rows[i].cells[3]).text(value);
						break;
					} else if (prop == "mobile") {
						$(this.safflist.rows[i].cells[2]).text(value);
						break;
					}
				}
			}
		}
	};

	Editor.prototype.fetchUpdatedStaffs = function() {
		for (var i = 0; i < this.staffs.length; i++) {
			if (this.staffs[i].dirty) {
				this.updatedStaffs.push(this.staffs[i]);
			}
		}
		return this.updatedStaffs;
	};

	Editor.prototype.addUpdatedStaffs = function(staff) {
		var f = false;
		for (var i = 0; i < this.updatedStaffs.length; i++) {
			if (this.updatedStaffs[i].id == staff.id) {
				f = true;
				break;
			}
		}
		if (!f) {
			this.updatedStaffs.push(staff);
		}
	};

	Editor.prototype.clearProcessSheet = function(table) {
		if (table.rows.length > 0) {
			for (var i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Editor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);
