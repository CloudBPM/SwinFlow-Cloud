/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "overallReportPane";
	var defaults = {
		id : "",
		ownerid : "",
		parent : "",
		topparent : "",
	};

	var ReportPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerid : "",
			parent : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.currpage = null; // by default;
		this.init(options);
	};

	ReportPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		this.element.appendChild(modalframe);

		var schpane = document.createElement("DIV");
		modalframe.appendChild(schpane);
		schpane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		schpane.style.margin = "0px";
		schpane.style.padding = "2px";

		var schForm = document.createElement("Form");
		schpane.appendChild(schForm);
		schForm.className = "form-horizontal"

		var gDiv2 = document.createElement("DIV");
		schForm.appendChild(gDiv2);
		gDiv2.className = "form-group";
		gDiv2.style.padding = "4px";

		var label3 = document.createElement("Label");
		gDiv2.appendChild(label3);
		label3.className = "col-sm-2 control-label";
		label3.innerHTML = "日期时间区间";

		var label4 = document.createElement("Label");
		gDiv2.appendChild(label4);
		label4.className = "col-sm-1 control-label";
		label4.innerHTML = "从";

		var colDIV3 = document.createElement("DIV");
		gDiv2.appendChild(colDIV3);
		colDIV3.className = "col-sm-4";

		this.fromDateInput = document.createElement("INPUT");
		colDIV3.appendChild(this.fromDateInput);
		this.fromDateInput.className = "form-control";

		$(this.fromDateInput).datetimepicker({
			dateFormat : "yy-mm-dd",
			timeFormat : "HH:mm:ss",
		});

		var label5 = document.createElement("Label");
		gDiv2.appendChild(label5);
		label5.className = "col-sm-1 control-label";
		label5.innerHTML = "到";

		var colDIV4 = document.createElement("DIV");
		gDiv2.appendChild(colDIV4);
		colDIV4.className = "col-sm-4";

		this.toDateInput = document.createElement("INPUT");
		colDIV4.appendChild(this.toDateInput);
		this.toDateInput.className = "form-control";

		$(this.toDateInput).datetimepicker({
			dateFormat : "yy-mm-dd",
			timeFormat : "HH:mm:ss",
		});

		var toolbar = document.createElement("DIV");
		schpane.appendChild(toolbar);
		toolbar.className = "row";
		toolbar.style.margin = "0px";
		toolbar.style.padding = "0px";

		this.createToolbar(options, toolbar);

		var resultForm = this.createPanel(schpane, "");

		var tableDiv = document.createElement("DIV");
		resultForm.appendChild(tableDiv);
		tableDiv.id = "resultdiv" + options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = (parseInt(options.parent.style.height) - 185)
				+ "px";

		this.instancelist = document.createElement("table");
		this.instancelist.className = "table table-striped table-hover";
		tableDiv.appendChild(this.instancelist);

		this.initList();

	};

	ReportPanel.prototype.createToolbar = function(options, toolbar) {
		var parent = document.createElement("DIV");
		toolbar.appendChild(parent);
		parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		parent.style.margin = "0px";
		parent.style.padding = "0px";

		var c = "btn btn-default btn-sm";
		var c1 = "btn btn-danger btn-sm";
		var c2 = "btn btn-warning btn-sm";
		var c4 = "btn btn-success btn-sm";

		var g3 = this.createGroup(parent);
		this.exportbutton = this.createTool(g3, "export" + this.options.id,
				"导出成报表", c, "i", "fa fa-download fa-lg");
		this.exportbutton.disabled = true;
		
		this.createNavigationGroup(parent);
	};

	ReportPanel.prototype.createNavigationGroup = function(parent) {
		var group1 = this.createGroup(parent);
		this.refreshHButton = this.createTool(group1, "refreshH"
				+ this.options.id, "刷新", "btn btn-success btn-sm", "i",
				"fa fa-refresh fa-lg");

		var group = this.createGroup(parent);
		this.firstPageHButton = this.createTool(group, "firstPageH"
				+ this.options.id, "首页", "btn btn-default btn-sm", "i",
				"fa fa-step-backward fa-lg");
		this.previousPageHButton = this.createTool(group, "previousPageH"
				+ this.options.id, "前一页", "btn btn-default btn-sm", "i",
				"fa fa-backward fa-lg");
		this.nextPageHButton = this.createTool(group, "nextPageH"
				+ this.options.id, "后一页", "btn btn-default btn-sm", "i",
				"fa fa-forward fa-lg");
		this.lastPageHButton = this.createTool(group, "lastPageH"
				+ this.options.id, "末页", "btn btn-default btn-sm", "i",
				"fa fa-step-forward fa-lg");

		var group2 = this.createGroup(parent);
		this.pageno = this.createLabel(group2, "l1" + this.options.id, "");
		this.totalpage = this.createLabel(group2, "l2" + this.options.id, "");

	};

	ReportPanel.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		parent.appendChild(group);
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		return group;
	};

	ReportPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	ReportPanel.prototype.createTool = function(group, id, title,
			style, fonttag, fontclass) {
		var button = document.createElement("button");
		group.appendChild(button);
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		var icon = document.createElement(fonttag);
		button.appendChild(icon);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = "i" + id;
		return button;
	};

	ReportPanel.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			var row = evt.target.parentElement;
			var id = row.children[0].innerHTML
			var title = row.children[1].innerHTML;
			this.options.topparent.addNewTabForRPI(title, id,
					this.options.ownerid);
		}
	};

	ReportPanel.prototype.doClick = function(evt) {
		if (evt.target.id == "ifirstPageH" + this.options.id
				|| evt.target.id == "firstPageH" + this.options.id) {
			this.loading(this.entity, 1, 30, "");
		} else if (evt.target.id == "ipreviousPageH" + this.options.id
				|| evt.target.id == "previousPageH" + this.options.id) {
			var condition = "";
			if (this.fromDateInput.value != "") {
				condition += "#" + this.fromDateInput.value;
			} else {
				condition += "#";
			}
			if (this.toDateInput.value != "") {
				condition += "#" + this.toDateInput.value;
			} else {
				condition += "#";
			}
			console.log(condition);
			this.loading(this.currpage.pageNo - 1, 30, condition);
		} else if (evt.target.id == "inextPageH" + this.options.id
				|| evt.target.id == "nextPageH" + this.options.id) {
			var condition = "";
			if (this.fromDateInput.value != "") {
				condition += "#" + this.fromDateInput.value;
			} else {
				condition += "#";
			}
			if (this.toDateInput.value != "") {
				condition += "#" + this.toDateInput.value;
			} else {
				condition += "#";
			}
			console.log(condition);
			this.loading(this.entity, this.currpage.pageNo + 1, 30, condition);
		} else if (evt.target.id == "ilastPageH" + this.options.id
				|| evt.target.id == "lastPageH" + this.options.id) {
			var condition = "";
			if (this.fromDateInput.value != "") {
				condition += "#" + this.fromDateInput.value;
			} else {
				condition += "#";
			}
			if (this.toDateInput.value != "") {
				condition += "#" + this.toDateInput.value;
			} else {
				condition += "#";
			}
			console.log(condition);
			this.loading(this.entity, this.currpage.allPagesCount, 30,
					condition);
		} else if (evt.target.id == "irefreshH" + this.options.id
				|| evt.target.id == "refreshH" + this.options.id) {
			var condition = "";
			if (this.fromDateInput.value != "") {
				condition += "#" + this.fromDateInput.value;
			} else {
				condition += "#";
			}
			if (this.toDateInput.value != "") {
				condition += "#" + this.toDateInput.value;
			} else {
				condition += "#";
			}
			console.log(condition);
			this.loading(this.entity, 1, 30, condition);
		} else if (evt.target.id == "searchBtn" + this.options.id
				|| evt.target.id == "isearchBtn" + this.options.id) {
			var condition = "";
			if (this.fromDateInput.value != "") {
				condition += "#" + this.fromDateInput.value;
			} else {
				condition += "#";
			}
			if (this.toDateInput.value != "") {
				condition += "#" + this.toDateInput.value;
			} else {
				condition += "#";
			}
			// console.log(condition);
			this.loading(this.options.ownerid, 1, 30, condition);
		} else if (evt.target.id == "export" + this.options.id
				|| evt.target.id == "iexport" + this.options.id) {
		} else if (evt.target.id == "resume" + this.options.id
				|| evt.target.id == "iresume" + this.options.id) {
		} else if (evt.target.id == "pause" + this.options.id
				|| evt.target.id == "ipause" + this.options.id) {
		} else if (evt.target.id == "terminate" + this.options.id
				|| evt.target.id == "iterminate" + this.options.id) {

		}
		Utils.stopDefault(evt);
	};

	ReportPanel.prototype.createLabel = function(group, id, title) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.id = id;
		group.appendChild(label);
		return label;
	};

	ReportPanel.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	ReportPanel.prototype.createPanel = function(parent, title) {
		var panelDiv = document.createElement("DIV");
		parent.appendChild(panelDiv);
		panelDiv.className = "panel panel-default";

		if (title != "") {
			var panelHeadDiv = document.createElement("DIV");
			panelDiv.appendChild(panelHeadDiv);
			panelHeadDiv.className = "panel-heading";
			panelHeadDiv.innerHTML = title;
		}

		var panelBodyDiv = document.createElement("DIV");
		panelDiv.appendChild(panelBodyDiv);
		panelBodyDiv.className = "panel-body";
		panelBodyDiv.style.padding = "0px";

		var panelForm = document.createElement("Form");
		panelBodyDiv.appendChild(panelForm);
		panelForm.className = "form-horizontal"
		return panelForm;
	};

	ReportPanel.prototype.loading = function(oid, pageno, pagesize,
			condition) {
		$("#progressbar").show();
		// var that = this;
		// $.get(service.api(1), {
		// 	oid : oid,// org ID
		// 	pn : pageno,
		// 	psz : pagesize,
		// 	cond : condition,
		// }).complete(function(data) {
		// 	that.loadData(data.responseJSON);
		// 	$("#progressbar").hide();
		// });
	};

	ReportPanel.prototype.loadData = function(obj) {
		var currPage = new Page();
		currPage.parseFromJSON(obj);
		this.currpage = currPage;
		$(this.instancelist).children().remove();
		var objs = currPage.pageEntities;
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				var row = this.instancelist.insertRow(-1);
				this.instancelist.addEventListener('dblclick', this, false);
				this.createCell(0, objs[i].instanceId, row);
				this.createCell(1, objs[i].processName, row);
				this.createCell(2, objs[i].processVersion, row);
				this.createCell(3, objs[i].status, row);
				this.createCell(4, objs[i].launcher, row);
				this.createCell(5, objs[i].idType, row);
				this.createCell(6, objs[i].idNumber, row);
				this.createCell(7, objs[i].startTime, row);
				this.createCell(8, objs[i].suspensionTime, row);
				this.createCell(9, objs[i].updateTime, row);
				this.createCell(10, objs[i].server, row);
			}
			if (objs.length < 30) {
				for (var i = objs.length; i < 30; i++) {
					var row = this.instancelist.insertRow(i);
					for (var j = 0; j < 11; j++) {
						this.createCell(j, "&nbsp;", row);
					}
				}
			}
			this.addHeader();
			this.pageno.innerHTML = "第" + this.currpage.pageNo + "页";
			this.totalpage.innerHTML = "/共" + this.currpage.allPagesCount + "页";
		} else {
			this.initList();
		}
		if (this.currpage.allPagesCount <= 1) {
			this.firstPageHButton.disabled = true;
			this.previousPageHButton.disabled = true;
			this.nextPageHButton.disabled = true;
			this.lastPageHButton.disabled = true;
		} else if (this.currpage.allPagesCount > 1) {
			if (this.currpage.pageNo == 1) {
				this.firstPageHButton.disabled = true;
				this.previousPageHButton.disabled = true;
				this.nextPageHButton.disabled = false;
				this.lastPageHButton.disabled = false;
			} else if (this.currpage.pageNo == this.currpage.allPagesCount) {
				this.firstPageHButton.disabled = false;
				this.previousPageHButton.disabled = false;
				this.nextPageHButton.disabled = true;
				this.lastPageHButton.disabled = true;
			} else if (this.currpage.pageNo > 1
					&& this.currpage.pageNo < this.currpage.allPagesCount) {
				this.firstPageHButton.disabled = false;
				this.previousPageHButton.disabled = false;
				this.nextPageHButton.disabled = false;
				this.lastPageHButton.disabled = false;
			}
		}
	};

	ReportPanel.prototype.addHeader = function() {
		var header = this.instancelist.createTHead();
		var row = header.insertRow(0);
		this.createHead("应用名称", row);
		this.createHead("版本", row);
		this.createHead("业务类型", row);
		this.createHead("密级", row);
		this.createHead("流程类型", row);
		this.createHead("发布人", row);
		this.createHead("发布日期", row);
		this.createHead("总业务量", row);
		this.createHead("主动发起", row);
		this.createHead("被动发起", row);
		this.createHead("正在办理", row);
		this.createHead("办结", row);
		this.createHead("异常", row);
		this.createHead("中止", row);
		this.createHead("办结率", row);
		this.createHead("未办结率", row);
		this.createHead("点赞", row);
	};

	ReportPanel.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = content;
	};

	ReportPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	ReportPanel.prototype.initList = function() {
		// document.createElement('tbody');
		for (var i = 0; i < 30; i++) {
			var row = this.instancelist.insertRow(i);
			for (var j = 0; j < 17; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
		this.addHeader();
		this.pageno.innerHTML = "第0页";
		this.totalpage.innerHTML = "/共0页";
		this.firstPageHButton.disabled = true;
		this.previousPageHButton.disabled = true;
		this.nextPageHButton.disabled = true;
		this.lastPageHButton.disabled = true;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new ReportPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);