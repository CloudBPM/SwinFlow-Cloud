/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "accessHistoryEditPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
		}, defaults, options);
		this._defaults = defaults;
		this.entity = options.entity;
		this._name = pluginName;
		this.pagesize = 30;
		this.init(options);
	};

	EditPanel.prototype.loadPane = function() {
		this.init(this.options);
	};

	EditPanel.prototype.init = function(options) {
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var toolbarForm = document.createElement("form");
		toolbarForm.className = "form-inline";
		modalframe.appendChild(toolbarForm);

		var toolbarDiv = document.createElement("DIV");
		toolbarForm.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
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
		
//		var p2 = $(this.element).editAccessControlDialog({
//			id : "editAccessControl028",
//			title : "轩琦科技 - 访问控制",
//			parent : this,
//			entity : this.entity,
//		});
//		this.editAccessControlDialog = p2.data("editAccessControlDialog");

		this.loading(this.entity, 1, this.pagesize, "");

	};

	EditPanel.prototype.loading = function(entity, pageno, pagesize, condition) {
		this.entity = entity;
//		$("#progressbar").show();
//		var that = this;
//		$.getJSON(service.api(17), {
//			appid : entity.id,
//			pn : pageno,
//			psz : pagesize,
//			cond : condition,
//		}).complete(function(data) {
//		that.loadData(data.responseJSON);
//			$("#progressbar").hide();
//		});
		this.loadData(null);
	};

	EditPanel.prototype.loadData = function(jsonobj) {
		this.currpage = new Page();
		if (jsonobj != null) {
			this.currpage.parseFromJSON(jsonobj);
			$(this.list).children().remove();
			this.currSelectedRow = -1;
		}
		var objs = this.currpage.pageEntities;
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				var acctrl = new AppServiceAccessControl();
				acctrl.parse(objs[i]);
				var row = this.list.insertRow(-1);
				row.addEventListener("click", this, false);
				row.setAttribute("orgid", acctrl.organizationId);
				if (acctrl.organizationName == null) {
					this.createCell(0, "全部", row);
				} else {
					this.createCell(0, acctrl.organizationName, row);
				}
				this.createCell(1, acctrl.createDateTime, row);
				this.createCell(2, acctrl.accessCounting, row);
			}
			if (objs.length < 30) {
				for (var i = objs.length; i < 30; i++) {
					var row = this.list.insertRow(i);
					for (var j = 0; j < 6; j++) {
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

	EditPanel.prototype.createNavigationGroup = function(parent) {
		var group1 = this.createGroup(parent);
		this.refreshHButton = this.createTool(group1, "refreshAC"
				+ this.options.id, "刷新", "btn btn-success btn-sm", "i",
				"fa fa-refresh fa-lg");
		this.enableButton(this.refreshHButton);

		var group = this.createGroup(parent);
		this.firstPageHButton = this.createTool(group, "firstPageAC"
				+ this.options.id, "首页", "btn btn-default btn-sm", "i",
				"fa fa-step-backward fa-lg");
		this.previousPageHButton = this.createTool(group, "previousPageAC"
				+ this.options.id, "前一页", "btn btn-default btn-sm", "i",
				"fa fa-backward fa-lg");
		this.nextPageHButton = this.createTool(group, "nextPageAC"
				+ this.options.id, "后一页", "btn btn-default btn-sm", "i",
				"fa fa-forward fa-lg");
		this.lastPageHButton = this.createTool(group, "lastPageAC"
				+ this.options.id, "末页", "btn btn-default btn-sm", "i",
				"fa fa-step-forward fa-lg");

		var group2 = this.createGroup(parent);
		this.pageno = this.createLabel(group2, "l1" + this.options.id, "");
		this.totalpage = this.createLabel(group2, "l2" + this.options.id, "");
	};

	EditPanel.prototype.createSearchGroup = function(parent) {
		var group = this.crateSGroup(parent);
		this.search = document.createElement("input");
		this.search.type = "text";
		this.search.className = "form-control input-sm";
		this.search.setAttribute("placeholder", "搜索...");
		this.search.addEventListener("keydown", this, false);
		group.appendChild(this.search);

		var searchSpan = document.createElement("span");
		searchSpan.className = "input-group-btn";
		group.appendChild(searchSpan);

		this.searchBtn = this.createTool(searchSpan, "searchAC"
				+ this.options.id, "查找", "btn btn-primary btn-sm", "i",
				"fa fa-search fa-lg");
	};

	EditPanel.prototype.crateSGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	EditPanel.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	EditPanel.prototype.doClick = function(evt) {
		var element = evt.target;
		if (element.tagName == "TD") {
			this.options.parent.options.parent.enableAddButton();
			this.options.parent.options.parent.enableModifyButton();
			this.options.parent.options.parent.enableRemoveButton();
			this.clearSelection(element.parentElement.parentElement);
			this.selectRow(element.parentElement);
		} else {
			if (evt.target == this.firstPageHButton
					|| (evt.target.id == ("firstPageAC" + this.options.id))) {
				this.loading(this.entity, 1, this.pagesize, "");
			} else if (evt.target == this.previousPageHButton
					|| (evt.target.id == ("previousPageAC" + this.options.id))) {
				this.loading(this.entity, this.currpage.pageNo - 1,
						this.pagesize, "");
			} else if (evt.target == this.nextPageHButton
					|| (evt.target.id == ("nextPageAC" + this.options.id))) {
				this.loading(this.entity, this.currpage.pageNo + 1,
						this.pagesize, "");
			} else if (evt.target == this.lastPageHButton
					|| (evt.target.id == ("lastPageAC" + this.options.id))) {
				this.loading(this.entity, this.currpage.allPagesCount,
						this.pagesize, "");
			} else if (evt.target == this.refreshHButton
					|| (evt.target.id == ("refreshAC" + this.options.id))) {
				this.loading(this.entity, this.currpage.pageNo, this.pagesize,
						"");
			} else if (evt.target == this.searchBtn
					|| (evt.target.id == ("searchAC" + this.options.id))) {
				this.loading(this.entity, 1, this.pagesize, this.search.value);
			}
		}
	};

	EditPanel.prototype.createTool = function(group, id, title, style, fonttag,
			fontclass) {
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

	EditPanel.prototype.createLabel = function(group, id, title) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.id = id;
		group.appendChild(label);
		return label;
	};

	EditPanel.prototype.addHeader = function() {
		var header = this.list.createTHead();
		var row = header.insertRow(0);
		this.createHead("组织名称", row);
		this.createHead("应用名称", row);
		this.createHead("访问时间", row);
		this.createHead("请求", row);
		this.createHead("响应", row);
		this.createHead("详细", row);
	};

	EditPanel.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = content;
	};

	EditPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	EditPanel.prototype.initList = function() {
		for (var i = 0; i < 30; i++) {
			var row = this.list.insertRow(i);
			for (var j = 0; j < 6; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
	};

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	EditPanel.prototype.addRow = function(e) {
		//this.editAccessControlDialog.show(this.entity);
	};

	EditPanel.prototype.modifyRow = function(e) {
		//this.editAccessControlDialog.show(this.entity);
	};

	EditPanel.prototype.removeRow = function(e) {
//		if (this.currSelectedRow != -1) {
//			var id = this.list.rows[this.currSelectedRow].getAttribute("orgid");
//			var that = this;
//			$.post(service.api(19), {
//				appid : this.entity.id,
//				orgid : id,
//			}).complete(
//					function(data) {
//						that.loading(that.entity, that.currpage.pageNo,
//								that.pagesize, that.search.value);
//					});
//		}

	};

	EditPanel.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {
			this.loading(this.entity, 1, this.pagesize, evt.target.value);
			evt.preventDefault();
			return false;
		}
	};

	EditPanel.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (var i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
		this.currSelectedRow = -1;
	};

	EditPanel.prototype.selectRow = function(row) {
		row.style.background = "#d1d1e0";
		this.currSelectedRow = row.rowIndex;
	};

	EditPanel.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	EditPanel.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EditPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);