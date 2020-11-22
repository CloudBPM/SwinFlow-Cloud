/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "assignmentHistoryPane";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		entity : "",
		topparent : "",
	};

	var AssignHistoryPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			parent : "",
			entity : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent = options.topparent;
		this.ruleditdialog;
		this.entity = options.entity;
		this.currpage = null; // by default;
		this.init(options);
	};

	AssignHistoryPanel.prototype.init = function(options) {
		this.entity = options.entity;
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var toolbarDiv = document.createElement("DIV");
		modalframe.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		toolbarDiv.style.padding = "2px";
		this.createNavigationGroup(toolbarDiv);

		var tableDiv = document.createElement("DIV");
		modalframe.appendChild(tableDiv);
		tableDiv.id = "loginhistorypane";
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = (parseInt(options.topparent.style.height) - 82)
				+ "px";

		this.loginhistorylist = document.createElement("table");
		this.loginhistorylist.id = "loginhistorylist";
		this.loginhistorylist.className = "table table-striped table-hover";
		tableDiv.appendChild(this.loginhistorylist);

		this.loading(1, 30, "");
	};

	AssignHistoryPanel.prototype.createNavigationGroup = function(parent) {
		var group1 = this.createGroup(parent);
		this.refreshHButton = this.createTool(group1, "refreshH"
				+ this.options.id, "刷新", "btn btn-success btn-sm", "i",
				"fa fa-refresh");
		this.enableButton(this.refreshHButton);

		var group = this.createGroup(parent);
		this.firstPageHButton = this.createTool(group, "firstPageH"
				+ this.options.id, "首页", "btn btn-default btn-sm", "i",
				"fa fa-step-backward");
		this.previousPageHButton = this.createTool(group, "previousPageH"
				+ this.options.id, "前一页", "btn btn-default btn-sm", "i",
				"fa fa-backward");
		this.nextPageHButton = this.createTool(group, "nextPageH"
				+ this.options.id, "后一页", "btn btn-default btn-sm", "i",
				"fa fa-forward");
		this.lastPageHButton = this.createTool(group, "lastPageH"
				+ this.options.id, "末页", "btn btn-default btn-sm", "i",
				"fa fa-step-forward");

		var group2 = this.createGroup(parent);
		this.pageno = this.createLabel(group2, "l1" + this.options.id, "");
		this.totalpage = this.createLabel(group2, "l2" + this.options.id, "");

	};

	AssignHistoryPanel.prototype.doClick = function(evt) {
		if (evt.target == this.firstPageHButton
				|| (evt.target.tagName == "I" && evt.target.id == ("firstPageH" + this.options.id))) {
			this.loading(1, 30, "");
		} else if (evt.target == this.previousPageHButton
				|| (evt.target.tagName == "I" && evt.target.id == ("previousPageH" + this.options.id))) {
			this.loading(this.currpage.pageNo - 1, 30, "");
		} else if (evt.target == this.nextPageHButton
				|| (evt.target.tagName == "I" && evt.target.id == ("nextPageH" + this.options.id))) {
			this.loading(this.currpage.pageNo + 1, 30, "");
		} else if (evt.target == this.lastPageHButton
				|| (evt.target.tagName == "I" && evt.target.id == ("lastPageH" + this.options.id))) {
			this.loading(this.currpage.allPagesCount, 30, "");
		} else if (evt.target == this.refreshHButton
				|| (evt.target.tagName == "I" && evt.target.id == "refreshH"
						+ this.options.id)) {
			this.loading(1, 30, "");
		}
	};

	AssignHistoryPanel.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	AssignHistoryPanel.prototype.loading = function(pageno, pagesize, condition) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(omservices.api(17, this.options.ownerId), {
			uid : this.entity.user.id,
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

	AssignHistoryPanel.prototype.loadData = function(jsonobj) {
		var currPage = new Page();
		currPage.parseFromJSON(jsonobj);
		this.currpage = currPage;
		$(this.loginhistorylist).children().remove();
		var objs = currPage.pageEntities;
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				var history = new UserLoginHistory();
				history.parseFromJSON(objs[i]);
				var row = this.loginhistorylist.insertRow(-1);
				// row.setAttribute("key", history.id);
				this.createCell(0, history.lastLoginTime, row);
				this.createCell(1, history.lastLogoutTime, row);
				this.createCell(2, history.device, row);
				this.createCell(3, history.deviceManufacturer, row);
				this.createCell(4, history.os, row);
				this.createCell(5, history.osManufacturer, row);
				this.createCell(6, history.browser, row);
				this.createCell(7, history.browserVersion, row);
			}
			if (objs.length < 30) {
				for (var i = objs.length; i < 30; i++) {
					var row = this.loginhistorylist.insertRow(i);
					for (var j = 0; j < 17; j++) {
						this.createCell(j, "&nbsp;", row);
					}
				}
			}
		} else {
			this.initLoginHistoryList();
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

	AssignHistoryPanel.prototype.createTool = function(group, id, title, style,
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

	AssignHistoryPanel.prototype.createLabel = function(group, id, title) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.id = id;
		group.appendChild(label);
		return label;
	};

	AssignHistoryPanel.prototype.addHeader = function() {
		var header = this.loginhistorylist.createTHead();
		var row = header.insertRow(0);
		this.createHead("政府企事业单位名称", row);
		this.createHead("部门名称", row);
		this.createHead("岗位名称", row);
		this.createHead("到岗时间", row);
		this.createHead("到岗备注", row);
		this.createHead("离岗时间", row);
		this.createHead("离岗备注", row);
		this.createHead("是否在岗", row);
	};

	AssignHistoryPanel.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = content;
	};

	AssignHistoryPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	AssignHistoryPanel.prototype.initLoginHistoryList = function() {
		// document.createElement('tbody');
		for (var i = 0; i < 30; i++) {
			var row = this.loginhistorylist.insertRow(i);
			for (var j = 0; j < 17; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
	};

	AssignHistoryPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	AssignHistoryPanel.prototype.doDblClick = function(evt) {
	};

	AssignHistoryPanel.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	AssignHistoryPanel.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new AssignHistoryPanel(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);