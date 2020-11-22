/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "httpHeaderEditPane";
	var defaults = {
		id : "",
		parent : "",
		height : 0,
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			height : 0,
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.upButton;
		this.downButton;
		this.currRowIndex = -1;
		this.init(options);
	};

	EditPanel.prototype.init = function(options) {
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		// add default header select
		this.addDefaultHeaderSelect(modalframe, options);

		var routeOrderTable = document.createElement("table");
		modalframe.appendChild(routeOrderTable);
		routeOrderTable.style.width = "100%";
		routeOrderTable.id = "reqHeader" + options.id;
		var row = routeOrderTable.insertRow(-1);
		var cell2 = row.insertCell(0);
		cell2.style.padding = 0;
		cell2.style.margin = 0;

		var cell1 = row.insertCell(1);
		cell1.style.padding = 0;
		cell1.style.margin = 0;
		cell1.style.width = "25px";

		var reorderButtonDiv = document.createElement("div");
		cell1.appendChild(reorderButtonDiv);
		reorderButtonDiv.style.margin = "0px";
		reorderButtonDiv.style.paddingTop = "0px";
		reorderButtonDiv.style.paddingBottom = "0px";
		reorderButtonDiv.style.paddingLeft = "2px";
		reorderButtonDiv.style.paddingRight = "2px";
		reorderButtonDiv.style.width = "25px";
		reorderButtonDiv.style.minWidth = "25px";
		reorderButtonDiv.style.maxWidth = "25px";

		this.upButton = document.createElement("button");
		this.upButton.type = "button";
		this.upButton.id = "upHeaderButton" + options.id;
		this.upButton.name = "upHeaderButton" + options.id;
		this.upButton.className = "btn btn-primary btn-xs";
		var upArrow = document.createElement("span");
		upArrow.className = "glyphicon glyphicon-arrow-up";
		upArrow.id = "upHeaderButton" + options.id;
		this.upButton.appendChild(upArrow);
		this.upButton.setAttribute("disabled", "true");
		this.upButton.addEventListener("click", this, false);
		reorderButtonDiv.appendChild(this.upButton);

		this.downButton = document.createElement("button");
		this.downButton.type = "button";
		this.downButton.id = "downHeaderButton" + options.id;
		this.downButton.name = "downHeaderButton" + options.id;
		this.downButton.className = "btn btn-primary btn-xs";
		var downArrow = document.createElement("span");
		downArrow.id = "downHeaderButton" + options.id;
		downArrow.className = "glyphicon glyphicon-arrow-down";
		this.downButton.appendChild(downArrow);
		this.downButton.setAttribute("disabled", "true");
		this.downButton.addEventListener("click", this, false);
		reorderButtonDiv.appendChild(this.downButton);

		// var separateLineDiv = document.createElement("div");
		// separateLineDiv.style.margin = "0px";
		// separateLineDiv.style.padding = "4px";
		// separateLineDiv.style.width = "100%";
		// cell2.appendChild(separateLineDiv);

		this.currPanel = document.createElement("DIV");
		cell2.appendChild(this.currPanel);
		this.currPanel.id = "headers" + options.id;
		this.currPanel.className = "panel panel-default";
		this.currPanel.style.width = "100%";
		this.currPanel.style.marginBottom = "0px";
		this.currPanel.addEventListener("click", this, false);

		var headersDiv = document.createElement("DIV");
		this.currPanel.appendChild(headersDiv);
		headersDiv.className = "table-responsive";
		headersDiv.id = "tablediv" + options.id;
		headersDiv.style.height = options.height + "px";

		this.currTable = document.createElement("TABLE");
		headersDiv.appendChild(this.currTable);
		this.currTable.className = "table table-striped table-hover";

		// general message dialog plugin
		var p3 = $(this.element).messageDialog({
			id : "HEAD0161",
			title : "轩琦科技 - 提示",
			parent : this,
		});
		this.messageDialog = p3.data("messageDialog");

		var plugin1 = $(this.element).headerKeyCellEditor({
			parent : this,
			msg : this.messageDialog,
		});
		this.editor1 = plugin1.data("headerKeyCellEditor");

		var plugin2 = $(this.element).headerValueCellEditor({
			parent : this,
			msg : this.messageDialog,
		});
		this.editor2 = plugin2.data("headerValueCellEditor");

	};

	EditPanel.prototype.setEntity = function(entity) {
		this.entity = entity;
		this.setHeaderSolution(entity.methodName, entity.headerSolution);
		this.refreshHeaderTable(this.currTable, entity.headers);
	};

	EditPanel.prototype.setHeaderSolution = function(method, solution) {
		$(this.dhSelect).find('option').remove();
		this.addOptions(this.dhSelect, "选择自定义请求头", "0", 0);
		if (method == "GET") {
			this.addOptions(this.dhSelect, "普通GET请求", "1", 1);
			this.addOptions(this.dhSelect, "下载文件GET请求", "2", 2);
		} else if (method == "POST") {
			this.addOptions(this.dhSelect, "普通POST请求", "1", 1);
			this.addOptions(this.dhSelect, "下载文件POST请求", "2", 2);
			this.addOptions(this.dhSelect, "上传文件POST请求", "3", 3);
			this.addOptions(this.dhSelect, "上传和下载文件POST请求", "4", 4);
		}
		this.dhSelect.value = solution;
	};

	EditPanel.prototype.setOtherPane = function(pane) {
		this.otherPane = pane;
	};

	EditPanel.prototype.setOtherPane1 = function(pane) {
		this.otherPane1 = pane;
	};

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	// add default header select
	EditPanel.prototype.addDefaultHeaderSelect = function(parent, options) {
		var dhGroupDiv = document.createElement("DIV");
		parent.appendChild(dhGroupDiv);
		dhGroupDiv.className = "form-group";
		dhGroupDiv.style.marginTop = "2px";
		dhGroupDiv.style.marginBottom = "2px";

		var dhDIV = document.createElement("DIV");
		dhGroupDiv.appendChild(dhDIV);
		dhDIV.className = "col-sm-12";

		this.dhSelect = document.createElement("select");
		dhDIV.appendChild(this.dhSelect);
		this.dhSelect.className = "form-control";
		this.dhSelect.id = "dh" + options.id;
		this.dhSelect.addEventListener("change", this, false);
	};

	EditPanel.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.currTable.focus();
			this.startToEdit(evt.target);
		}
	};

	EditPanel.prototype.startToEdit = function(tag) {
		var t = tag.getAttribute("ed");
		if (t == "key") {
			this.editor1.loadEditor(tag, this.entity);
		} else if (t == "val") {
			this.editor2.loadEditor(tag, this.entity);
		}
	};

	EditPanel.prototype.doChange = function(evt) {
		if (evt.target == this.dhSelect) {
			map[this.entity.id].stack
					.execute(new AMWebAppHeaderSolutionChangedCmd(this.entity,
							this.dhSelect.value, this
									.changeHeaders(this.entity.methodName,
											this.dhSelect.value)));
		}
	};

	EditPanel.prototype.changeHeaders = function(m, o) {
		var h = []
		if (m == "GET") {
			if (o == 1) {
				h = this.parseSolution(GetHS1);
			} else if (o == 2) {
				h = this.parseSolution(GetHS2);
			}
		} else if (m == "POST") {
			if (o == 1) {
				h = this.parseSolution(PostHS1);
			} else if (o == 2) {
				h = this.parseSolution(PostHS2);
			} else if (o == 3) {
				h = this.parseSolution(PostHS3);
			} else if (o == 4) {
				h = this.parseSolution(PostHS4);
			}
		}
		return h;
	};

	EditPanel.prototype.doClick = function(evt) {
		evt.preventDefault();
		var element = evt.target;
		if (element.tagName == "DIV") {
			var panelDiv = element.parentElement;
			if (panelDiv.id == ("headers" + this.options.id)) {
				this.currPanel.className = "panel panel-primary";
				this.otherPane.currPanel.className = "panel panel-default";
				if (this.otherPane1 != undefined && this.otherPane1 != null) {
					this.otherPane1.currPanel.className = "panel panel-default";
				}
			}
			this.options.parent.options.parent.enableAddButton();
			return;
		} else if (element.tagName == "TH") {
			var panelDiv = element.parentElement.parentElement.parentElement.parentElement.parentElement;
			if (panelDiv.id == ("headers" + this.options.id)) {
				this.currPanel.className = "panel panel-primary";
				this.otherPane.currPanel.className = "panel panel-default";
				if (this.otherPane1 != undefined && this.otherPane1 != null) {
					this.otherPane1.currPanel.className = "panel panel-default";
				}
			}
			this.options.parent.options.parent.enableAddButton();
			return;
		} else if (element.tagName == "TD") {
			var panelDiv = element.parentElement.parentElement.parentElement.parentElement.parentElement;
			var table = element.parentElement.parentElement.parentElement;
			if (panelDiv.id == ("headers" + this.options.id)) {
				this.currPanel.className = "panel panel-primary";
				this.otherPane.currPanel.className = "panel panel-default";
				if (this.otherPane1 != undefined && this.otherPane1 != null) {
					this.otherPane1.currPanel.className = "panel panel-default";
				}
				this.clearSelection(this.currTable);
				this.selectRow(table, element.parentElement);
			}
			this.options.parent.options.parent.enableAddButton();
			return;
		} else if (element == this.upButton
				|| (evt.target.id == "upHeaderButton" + this.options.id)) {
			map[this.entity.id].stack.execute(new AMUpHeaderOrderChangedCmd(
					this));
		} else if (element == this.downButton
				|| (evt.target.id == "downHeaderButton" + this.options.id)) {
			map[this.entity.id].stack.execute(new AMDownHeaderOrderChangedCmd(
					this));
		} else {
			this.options.parent.options.parent.disableAddButton();
			this.clearSelection(this.currTable);
			this.clearSelection(this.otherPane.currTable);
		}
	};

	EditPanel.prototype.isonfocus = function() {
		if (this.currPanel.className == "panel panel-primary") {
			return true;
		}
		return false;
	};

	EditPanel.prototype.loadRow = function(p) {
		var row = this.currTable.insertRow(this.currTable.rows.length);
		this.createRow(row, p);
	};

	EditPanel.prototype.createRow = function(row, p) {
		row.addEventListener("click", this, false);
		row.addEventListener("dblclick", this, false);

		var cell0 = row.insertCell(0);
		cell0.setAttribute("ed", "key");
		$(cell0).text(p.key);

		var cell2 = row.insertCell(1);
		cell2.setAttribute("ed", "val");
		$(cell2).text(p.value);

		var cell3 = row.insertCell(2);
		cell3.setAttribute("ed", "-1");
		cell3.setAttribute("nowrap", "true");
		var rmspan = document.createElement("i");
		cell3.appendChild(rmspan);

		rmspan.className = "fa fa-minus-circle fa-lg";
		rmspan.style.color = "red";
		rmspan.setAttribute("aria-hidden", "true");
		var that = this;
		rmspan.addEventListener("click", function() {
			that.remove($(this).closest('tr').index() + 1, p);
		});
		return row.rowIndex;
	};

	EditPanel.prototype.addNew = function() {
		map[this.entity.id].stack.execute(new AMAddHeaderCmd(this.entity, this,
				new HTTPHeader()));
	};

	EditPanel.prototype.addNewRow = function(p) {
		if (this.currRowIndex == -1) {
			this.currRowIndex = this.currTable.rows.length - 1;
		} else {
			this.currRowIndex = this.currRowIndex + 1;
		}
		var row = this.currTable.insertRow(this.currRowIndex);
		var i = this.createRow(row, p);
		this.selectRowByIndex(i);
		return this.currRowIndex;
	};

	EditPanel.prototype.remove = function(index, para) {
		map[this.entity.id].stack.execute(new AMRemoveHeaderCmd(this.entity,
				this, para, index));
	};

	EditPanel.prototype.removeRow = function(index) {
		this.currTable.deleteRow(index);
		this.selectRowByIndex(index);
	};

	EditPanel.prototype.selectRow = function(table, row) {
		if (row.rowIndex < table.rows.length - 1) {
			row.style.background = "#d1d1e0";
			this.currRowIndex = row.rowIndex;
			if (row.rowIndex == 1) {
				if (row.rowIndex < table.rows.length - 2) {
					this.disabledutton(this.upButton);
					this.enableButton(this.downButton);
				} else {
					this.disabledutton(this.upButton);
					this.disabledutton(this.downButton);
				}
			} else if (row.rowIndex == table.rows.length - 2) {
				if (row.rowIndex > 1) {
					this.enableButton(this.upButton);
					this.disabledutton(this.downButton);
				} else {
					this.disabledutton(this.upButton);
					this.disabledutton(this.downButton);
				}
			} else if (row.rowIndex > 1 && row.rowIndex < table.rows.length - 2) {
				this.enableButton(this.upButton);
				this.enableButton(this.downButton);
			} else {
				this.disabledutton(this.upButton);
				this.disabledutton(this.downButton);
			}
		} else {
			this.currRowIndex = -1;
			this.disabledutton(this.upButton);
			this.disabledutton(this.downButton);
		}
	};

	EditPanel.prototype.selectRowByIndex = function(index) {
		this.clearSelection(this.currTable);
		if (index >= 1 && index <= this.currTable.rows.length - 2) {
			var row = this.currTable.rows[index];
			row.style.background = "#d1d1e0";
			this.currRowIndex = row.rowIndex;
			if (row.rowIndex == 1) {
				if (row.rowIndex < this.currTable.rows.length - 2) {
					this.disabledutton(this.upButton);
					this.enableButton(this.downButton);
				} else {
					this.disabledutton(this.upButton);
					this.disabledutton(this.downButton);
				}
			} else if (row.rowIndex == this.currTable.rows.length - 2) {
				if (row.rowIndex > 1) {
					this.enableButton(this.upButton);
					this.disabledutton(this.downButton);
				} else {
					this.disabledutton(this.upButton);
					this.disabledutton(this.downButton);
				}
			} else if (row.rowIndex > 1
					&& row.rowIndex < this.currTable.rows.length - 2) {
				this.enableButton(this.upButton);
				this.enableButton(this.downButton);
			} else {
				this.disabledutton(this.upButton);
				this.disabledutton(this.downButton);
			}
		} else {
			this.currRowIndex = -1;
			this.disabledutton(this.upButton);
			this.disabledutton(this.downButton);
		}
	};

	EditPanel.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	EditPanel.prototype.disabledutton = function(button) {
		button.setAttribute("disabled", "");
	};

	EditPanel.prototype.rowSelected = function(row) {
		return row.style.background == "rgb(209, 209, 224)";
	};

	EditPanel.prototype.refreshHeaderTable = function(table, paras) {
		$(table).children().remove();
		if (paras.length > 0) {
			for (var j = 0; j < paras.length; j++) {
				this.loadRow(paras[j]);
			}
		}
		var row = table.insertRow(table.rows.length);
		for (var j = 0; j < 3; j++) {
			var cell1 = row.insertCell(j);
			cell1.innerHTML = "&nbsp;";
		}
		this.addHeaderTableTitle(table);
	};

	EditPanel.prototype.addHeaderTableTitle = function(table) {
		var header = table.createTHead();
		var row = header.insertRow(0);
		row.addEventListener("click", this, false);
		this.createHead("请求头名", row);
		this.createHead("请求头值", row);
		this.createHead(" ", row);
	};

	EditPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = "<font color='red'>"+content+"</font>";
		row.appendChild(th);
	};

	EditPanel.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (var i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
			this.currRowIndex = -1;
		}
	};

	EditPanel.prototype.rowSelected = function(row) {
		return row.style.background == "rgb(209, 209, 224)";
	};

	EditPanel.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	EditPanel.prototype.parseSolution = function(solution) {
		var headers = [];
		for (x in solution) {
			hd = new HTTPHeader();
			hd.key = x;
			hd.value = solution[x];
			headers.push(hd);
		}
		return headers;
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