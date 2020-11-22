/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "listViewPane";
	var defaults = {
		id : "",
		ownerId : "",
		basicpropsheet : "",
		propsheet : "",
		width : 0,
		height : 0,
		parent : "",
	};

	var ListViewPanel = function(element, options) {
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
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;

		this.currpage = null; // by default;
		this.objects = [];
		this.updatedObjects = [];//
		this.person = new TrainingPerson();
		this.pagesize = 30;
		this.headersize = 0;

		this.init(options);
		this.createToolbar(options);
		this.loading(1, this.pagesize, "", options.ownerId);
	};

	ListViewPanel.prototype.init = function(options) {
		var editorPanel = document.createElement("DIV");
		this.element.appendChild(editorPanel);
		editorPanel.style.margin = "0px";
		editorPanel.style.padding = "0px";
		editorPanel.style.overflow = "auto";
		this.toolbarRow = document.createElement("DIV");
		editorPanel.appendChild(this.toolbarRow);
		this.toolbarRow.className = "row";
		this.toolbarRow.style.margin = "0px";
		this.toolbarRow.style.padding = "0px";
		this.painterRow = document.createElement("DIV");
		editorPanel.appendChild(this.painterRow);
		this.painterRow.className = "row";
		this.painterRow.style.margin = "0px";
		this.painterRow.style.padding = "0px";

		var canvasPanel = document.createElement("DIV");
		this.painterRow.appendChild(canvasPanel);

		canvasPanel.id = "userEditingPanel" + options.id;
		canvasPanel.className = "col";
		canvasPanel.style.width = options.width + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginLeft = "4px";
		canvasPanel.style.padding = "0px";

		var tableDivPane = document.createElement("DIV");
		canvasPanel.appendChild(tableDivPane);

		tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		tableDivPane.id = "convasPane" + options.id;
		tableDivPane.className = "table-responsive";
		tableDivPane.style.margin = "0px";
		tableDivPane.style.padding = "0px";
		tableDivPane.style.border = "1px solid #ddd";
		tableDivPane.style.height = options.height + "px";
		tableDivPane.style.borderRadius = "4px";
		tableDivPane.style.overflowY = "auto";

		this.tableList = document.createElement("table");
		this.tableList.id = "safflist";
		this.tableList.className = "table table-striped table-hover";
		tableDivPane.appendChild(this.tableList);

	};

	ListViewPanel.prototype.loading = function(pageno, pagesize, condition,
			ownerID) {
		if (this.options.parent != null) {
			this.options.parent.loading(pageno, pagesize, condition, ownerID);
		}
	};

	ListViewPanel.prototype.loadData = function(jsonobj) {
		var currPage = new Page();
		currPage.parseFromJSON(jsonobj);
		this.currpage = currPage;
		$(this.tableList).children().remove();
		this.objects = [];
		var objs = currPage.pageEntities;
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				if (this.options.parent != null) {
					this.options.parent.createCells(objs[i]);
				}
			}
			if (objs.length < this.pagesize) {
				for (var i = objs.length; i < this.pagesize; i++) {
					var row = this.tableList.insertRow(i);
					for (var j = 0; j < this.headersize; j++) {
						this.createCell(j, "&nbsp;", row);
					}
				}
			}
		} else {
			this.initList(this.options);
		}
		this.addListHeader(this.options);
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
		if (this.objects.length > 0) {
			this.selectRow(this.objects[0].id);
		}
	};

//	ListViewPanel.prototype.refreshRow = function(p) {
//		if (this.tableList.rows.length > 1) {
//			this.addUpdatedObjects(p);
//			for (var i = 0; i < this.tableList.rows.length; i++) {
//				if (this.tableList.rows[i].getAttribute("key") == p.id) {
//					this.tableList.rows[i].cells[0].innerText = p.id;
//					this.tableList.rows[i].cells[1].innerText = Utils
//							.parse(p.lastName);
//					this.tableList.rows[i].cells[2].innerText = Utils
//							.parse(p.firstName);
//					this.tableList.rows[i].cells[3].innerText = gender[p.gender];
//					this.tableList.rows[i].cells[4].innerText = p.birthday;
//					this.tableList.rows[i].cells[5].innerText = Utils
//							.parse(p.address);
//					this.tableList.rows[i].cells[6].innerText = Utils
//							.parse(p.postcode);
//					this.tableList.rows[i].cells[7].innerText = p.degree;
//					this.tableList.rows[i].cells[8].innerText = Utils
//							.parse(p.mobile);
//					this.tableList.rows[i].cells[9].innerText = p.introduction;
//					this.tableList.rows[i].cells[10].innerText = p.lastupdate;
//					break;
//				}
//			}
//		}
//	};

	ListViewPanel.prototype.initList = function(options) {
		for (var i = 0; i < this.pagesize; i++) {
			var row = this.tableList.insertRow(i);
			for (var j = 0; j < this.headersize; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
	};

	ListViewPanel.prototype.addListHeader = function(options) {
		var header = this.tableList.createTHead();
		var row = header.insertRow(0);
		if (this.options.parent != null)
			this.options.parent.createHeaders(row);

	};

	ListViewPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	ListViewPanel.prototype.createCell = function(no, cellname, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = cellname;
	};

	ListViewPanel.prototype.createToolbar = function(options) {
		var toolbarForm = document.createElement("form");
		toolbarForm.className = "form-inline";
		this.toolbarRow.appendChild(toolbarForm);

		var toolbarDiv = document.createElement("DIV");
		toolbarForm.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		toolbarDiv.style.padding = "2px";
		this.createUndoRedoGroup(toolbarDiv);
		this.createNavigationGroup(toolbarDiv);
		this.createSearchGroup(toolbarDiv);
	};

	ListViewPanel.prototype.createUndoRedoGroup = function(parent) {
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

	ListViewPanel.prototype.createNavigationGroup = function(parent) {
		var group1 = this.createGroup(parent);
		this.refreshHButton = this.createTool(group1, "refreshS"
				+ this.options.id, "刷新", "btn btn-success fa-lg", "i",
				"fa fa-refresh");
		this.enableButton(this.refreshHButton);

		var group = this.createGroup(parent);
		this.firstPageHButton = this.createTool(group, "firstPageS"
				+ this.options.id, "首页", "btn btn-default fa-lg", "i",
				"fa fa-step-backward");
		this.previousPageHButton = this.createTool(group, "previousPageS"
				+ this.options.id, "前一页", "btn btn-default fa-lg", "i",
				"fa fa-backward");
		this.nextPageHButton = this.createTool(group, "nextPageS"
				+ this.options.id, "后一页", "btn btn-default fa-lg", "i",
				"fa fa-forward");
		this.lastPageHButton = this.createTool(group, "lastPageS"
				+ this.options.id, "末页", "btn btn-default fa-lg", "i",
				"fa fa-step-forward");
		this.disableButton(this.firstPageHButton);
		this.disableButton(this.previousPageHButton);
		this.disableButton(this.nextPageHButton);
		this.disableButton(this.lastPageHButton);

		var group2 = this.createGroup(parent);
		this.pageno = this.createLabel(group2, "Sl1" + this.options.id, "");
		this.totalpage = this.createLabel(group2, "Sl2" + this.options.id, "");
	};

	ListViewPanel.prototype.createLabel = function(group, id, title) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.id = id;
		group.appendChild(label);
		return label;
	};

	ListViewPanel.prototype.createSearchGroup = function(parent) {
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

		this.searchBtn = this.createTool(searchSpan, "searchS"
				+ this.options.id, "查找", "btn btn-primary", "i",
				"fa fa-search fa-lg");

	};

	ListViewPanel.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	ListViewPanel.prototype.crateSGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	ListViewPanel.prototype.createTool = function(group, id, title, style,
			fonttag, fontclass) {
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

	ListViewPanel.prototype.enableButton = function(button) {
		button.disabled = false;
	};

	ListViewPanel.prototype.disableButton = function(button) {
		button.disabled = true;
	};

	ListViewPanel.prototype.setPropertySheet = function(obj) {
		if (obj == null && this.objects != null && this.objects.length > 0) {
			obj = this.objects[0];
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

	ListViewPanel.prototype.handleEvent = function(e) {
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

	ListViewPanel.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {// 回车键
			evt.preventDefault();// 阻止该事件
			if (evt.target.value != "") {
				this.doNextPageAction(1);
				this.act = 6;
			}
			return false;
		}
	};

	ListViewPanel.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.tableList.focus();
		}
	};

	ListViewPanel.prototype.doClick = function(evt) {
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
		} else if (evt.target.tagName == "TD") {
			var table = evt.target.parentElement.parentElement;
			this.clearProcessSheet(table);
			evt.target.parentElement.style.background = "#d1d1e0";
			var r = evt.target.parentElement;
			this.selectRow(r.getAttribute("key"));
		}
	};

	ListViewPanel.prototype.doNextPageAction = function(pageno) {
		this.loading(pageno, this.pagesize, this.search.value,
				this.options.ownerId);
	};

	ListViewPanel.prototype.selectRow = function(id) {
		if (this.tableList.rows.length > 1) {
			for (var i = 0; i < this.tableList.rows.length; i++) {
				if (this.tableList.rows[i].getAttribute("key") == id) {
					this.tableList.rows[i].style.background = "#d1d1e0";
				}
			}
		}
		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].id == id) {
				this.setPropertySheet(this.objects[i]);
				break;
			}
		}
	};

//	// update
//	ListViewPanel.prototype.updatedRow = function(id, prop, value) {
//		if (this.tableList.rows.length > 1) {
//			for (var i = 0; i < this.tableList.rows.length; i++) {
//				if (this.tableList.rows[i].getAttribute("key") == id) {
//					if (prop == "lastName") {
//						$(this.tableList.rows[i].cells[1]).text(value);
//						break;
//					} else if (prop == "firstName") {
//						$(this.tableList.rows[i].cells[2]).text(value);
//						break;
//					} else if (prop == "gender") {
//						$(this.tableList.rows[i].cells[3]).text(value);
//						break;
//					} else if (prop == "birthday") {
//						$(this.tableList.rows[i].cells[4]).text(value);
//						break;
//					} else if (prop == "address") {
//						$(this.tableList.rows[i].cells[5]).text(value);
//						break;
//					} else if (prop == "postcode") {
//						$(this.tableList.rows[i].cells[6]).text(value);
//						break;
//					} else if (prop == "degree") {
//						$(this.tableList.rows[i].cells[7]).text(value);
//						break;
//					} else if (prop == "mobile") {
//						$(this.tableList.rows[i].cells[8]).text(value);
//						break;
//					} else if (prop == "introduction") {
//						$(this.tableList.rows[i].cells[9]).text(value);
//						break;
//					} else if (prop == "lastupdate") {
//						$(this.tableList.rows[i].cells[10]).text(value);
//						break;
//					}
//				}
//			}
//		}
//	};

	ListViewPanel.prototype.fetchUpdatedObjects = function() {
		for (var i = 0; i < this.objects.length; i++) {
			if (this.persons[i].dirty) {
				this.updatedObjects.push(this.objects[i]);
			}
		}
		return this.updatedObjects;
	};

	ListViewPanel.prototype.addUpdatedObjects = function(o) {
		var f = false;
		for (var i = 0; i < this.updatedObjects.length; i++) {
			if (this.updatedObjects[i].id == o.id) {
				f = true;
				break;
			}
		}
		if (!f) {
			this.updatedObjects.push(o);
		}
	};

	ListViewPanel.prototype.clearProcessSheet = function(table) {
		if (table.rows.length > 0) {
			for (var i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ListViewPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);
