/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "omAuthorityGroupEditor";
	var defaults = {
		id : "",
		ownerId : "",
		basicpropsheet : "",
		propsheet : "",
		width : 0,
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
			width : 0,
			height : 0,
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.groups = [];
		this.updatedGroups = [];
		this.selectedGroup = null;
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
		canvasPanel.className = "col";
		canvasPanel.id = "listPanel" + options.id;
		canvasPanel.style.width = options.width + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginLeft = "0px";
		canvasPanel.style.padding = "0px";

		this.tableDivPane = document.createElement("DIV");
		canvasPanel.appendChild(this.tableDivPane);

		this.tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.tableDivPane.id = "convasPane" + options.id;
		this.tableDivPane.className = "table-responsive";
		this.tableDivPane.style.margin = "0px";
		this.tableDivPane.style.padding = "0px";
		this.tableDivPane.style.border = "1px solid #ddd";
		this.tableDivPane.style.height = (options.height - 84) + "px";
		this.tableDivPane.style.borderRadius = "4px";
		this.tableDivPane.style.overflowY = "auto";

		var p2 = $(this.element).confirmInfoDialog({
			id : "g027",
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
		$.getJSON(omservices.api(17, this.options.ownerId), {
			cond : condition,
			ownid : ownerid,
			pn : pageno,
			psz : pagesize,
		}).complete(
				function(data) {
					// var data1 = data.responseJSON;
					// if (data1.status != null && data1.status != ""
					// 		&& data1.status != undefined) {
					// 	if (data1.status == 0 || data1.status == -10) {
					// 		messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
					// 		$("#progressbar").hide();
					// 		return;
					// 	}
					// }
					that.loadData(data.responseJSON);
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
		this.groups = [];
		var objs = currPage.pageEntities;
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				var group = new AuthorityGroup();
				group.parseFromJSON(objs[i], this.options.ownerId);
				this.groups.push(group);
				var row = this.safflist.insertRow(-1);
				row.setAttribute("key", group.id);
				row.addEventListener("click", this, false);
				row.addEventListener("dblclick", this, false);
				this.createCell(0, Utils.parse(group.name), row);
				this.createCell(1, Utils.parse(group.description), row);
				this.createCell(2, customtype[group.type], row);
				this.createCell(3, Utils.getDateTime(new Date(group.createDate).getTime()), row);
			}
			if (objs.length < 20) {
				for (var i = objs.length; i < 20; i++) {
					var row = this.safflist.insertRow(i);
					for (var j = 0; j < 4; j++) {
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
		if (this.groups.length > 0) {
			this.selectRow(this.groups[0].id);
		}
	};

	Editor.prototype.initSaffList = function(options) {
		// document.createElement('tbody');
		for (var i = 0; i < 20; i++) {
			var row = this.safflist.insertRow(i);
			for (var j = 0; j < 4; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
	};

	Editor.prototype.addSaffListHeader = function(options) {
		// $(this.safflist).children().remove();
		var header = this.safflist.createTHead();
		var row = header.insertRow(0);
		this.createHead("权限组名称", row);
		this.createHead("权限组描述", row);
		this.createHead("类型", row);
		this.createHead("创建时间", row);
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
		this.undobutton = this.createTool(group, "undoG" + this.options.id,
				"撤销", "btn btn-default", "i", "fa fa-reply fa-lg");
		// fa-lg: 24px; fa-2x ：32px
		this.redobutton = this.createTool(group, "redoG" + this.options.id,
				"恢复", "btn btn-default", "i", "fa fa fa-share fa-lg");
		this.stack.undoButton = this.undobutton;
		this.stack.redoButton = this.redobutton;
		this.disableButton(this.undobutton);
		this.disableButton(this.redobutton);
	};

	Editor.prototype.createEditGroup = function(parent) {
		var group = this.createGroup(parent);
		this.addUserButton = this.createTool(group, "addauthG"
				+ this.options.id, "添加新权限组", "btn btn-success", "i",
				"fa fa-user-plus fa-lg");
		// fa-lg: 24px; fa-2x ：32px
		this.disableButton(this.addUserButton);
	};

	Editor.prototype.createNavigationGroup = function(parent) {
		var group1 = this.createGroup(parent);
		this.refreshHButton = this.createTool(group1, "refreshG"
				+ this.options.id, "刷新", "btn btn-success", "i",
				"fa fa-refresh fa-lg");
		this.enableButton(this.refreshHButton);

		var group = this.createGroup(parent);
		this.firstPageHButton = this.createTool(group, "firstPageG"
				+ this.options.id, "首页", "btn btn-default", "i",
				"fa fa-step-backward fa-lg");
		this.previousPageHButton = this.createTool(group, "previousPageG"
				+ this.options.id, "前一页", "btn btn-default", "i",
				"fa fa-backward fa-lg");
		this.nextPageHButton = this.createTool(group, "nextPageG"
				+ this.options.id, "后一页", "btn btn-default", "i",
				"fa fa-forward fa-lg");
		this.lastPageHButton = this.createTool(group, "lastPageG"
				+ this.options.id, "末页", "btn btn-default", "i",
				"fa fa-step-forward fa-lg");
		this.disableButton(this.firstPageHButton);
		this.disableButton(this.previousPageHButton);
		this.disableButton(this.nextPageHButton);
		this.disableButton(this.lastPageHButton);

		var group2 = this.createGroup(parent);
		this.pageno = this.createLabel(group2, "G1" + this.options.id, "");
		this.totalpage = this.createLabel(group2, "G2" + this.options.id, "");
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
		this.search.addEventListener('keydown', this, false);// 为回车键加监听事件
		group.appendChild(this.search);

		var searchSpan = document.createElement("span");
		searchSpan.className = "input-group-btn";
		group.appendChild(searchSpan);

		this.searchBtn = this.createTool(searchSpan, "searchG"
				+ this.options.id, "查找权限组", "btn btn-primary", "i",
				"fa fa-search fa-lg");
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
		if (obj == null && this.groups != null && this.groups.length > 0) {
			obj = this.groups[0];
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
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	Editor.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {// 回车键
			evt.preventDefault();// 阻止该事件
			this.doNextPageAction(1);
			this.act = 6;
			return false;
		}
	};

	Editor.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.safflist.focus();
		}
	};

	Editor.prototype.doClick = function(evt) {
		// console.log(evt.target);
		// console.log(evt.target.id);
		// console.log(evt.target.tagName);
		if (evt.target == this.firstPageHButton
				|| (evt.target.id == ("firstPageG" + this.options.id))) {
			this.doNextPageAction(1);
			this.act = 1;
		} else if (evt.target == this.previousPageHButton
				|| (evt.target.id == ("previousPageG" + this.options.id))) {
			this.doNextPageAction(this.currpage.pageNo - 1);
			this.act = 2;
		} else if (evt.target == this.nextPageHButton
				|| (evt.target.id == ("nextPageG" + this.options.id))) {
			this.doNextPageAction(this.currpage.pageNo + 1);
			this.act = 3;
		} else if (evt.target == this.lastPageHButton
				|| (evt.target.id == ("lastPageG" + this.options.id))) {
			this.doNextPageAction(this.currpage.allPagesCount);
			this.act = 4;
		} else if (evt.target == this.refreshHButton
				|| (evt.target.id == ("refreshG" + this.options.id))) {
			this.doNextPageAction(this.currpage.pageNo);
			this.act = 5;
		} else if (evt.target == this.searchBtn
				|| (evt.target.id == ("searchG" + this.options.id))) {
			this.doNextPageAction(1);
			this.act = 6;
		} else if (evt.target == this.undobutton
				|| (evt.target.id == ("undoG" + this.options.id))) {
			this.stack.undo();
		} else if (evt.target == this.redobutton
				|| (evt.target.id == ("redoG" + this.options.id))) {
			this.stack.redo();
		} else if (evt.target == this.addUserButton
				|| (evt.target.id == ("addauthG" + this.options.id))) {
			this.act = 7;
			if (this.getDirty()) {
				this.confirmInfoDialog.show("当前组列表已经修改，是否保存修改？");
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
			this.confirmInfoDialog.show("当前权限组成员列表已经修改，是否保存修改？");
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
		case 7: // add new group
			// this.searchIdNumberDialog.show();
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
		case 7: // add new group
			// this.searchIdNumberDialog.show();
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
		for (var i = 0; i < this.groups.length; i++) {
			if (this.groups[i].id == id) {
				this.setPropertySheet(this.groups[i]);
				this.selectedGroup = this.groups[i];
				break;
			}
		}
	};

	Editor.prototype.updateRow = function(id, prop, value) {
		if (this.safflist.rows.length > 1) {
			for (var i = 0; i < this.safflist.rows.length; i++) {
				if (this.safflist.rows[i].getAttribute("key") == id) {
					if (prop == "name") {
						$(this.safflist.rows[i].cells[0]).text(value);
						break;
					} else if (prop == "description") {
						$(this.safflist.rows[i].cells[1]).text(value);
						break;
					}
				}
			}
		}
	};

	Editor.prototype.addUpdatedGroups = function(obj) {
		var f = false;
		for (var i = 0; i < this.updatedGroups.length; i++) {
			if (this.updatedGroups[i].id == obj.id) {
				f = true;
				break;
			}
		}
		if (!f) {
			this.updatedGroups.push(obj);
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
