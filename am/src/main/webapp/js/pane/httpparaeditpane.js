/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "requestDataEditPane";
	var defaults = {
		id : "",
		parent : "",
		headbody : "",
		height : 0,
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			headbody : "",
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
		this.loadPane();
	};

	EditPanel.prototype.loadPane = function() {
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var routeOrderTable = document.createElement("table");
		routeOrderTable.style.width = "100%";
		modalframe.appendChild(routeOrderTable);
		var row = routeOrderTable.insertRow(-1);
		var cell2 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		cell1.style.padding = 0;
		cell1.style.margin = 0;
		cell1.style.width = "25px";
		cell2.style.padding = 0;
		cell2.style.margin = 0;

		var reorderButtonDiv = document.createElement("div");
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
		this.upButton.id = "upButton" + this.options.id;
		this.upButton.name = "upButton" + this.options.id;
		this.upButton.className = "btn btn-primary btn-xs";
		var upArrow = document.createElement("span");
		upArrow.className = "glyphicon glyphicon-arrow-up";
		upArrow.id = "upButton" + this.options.id;
		this.upButton.appendChild(upArrow);
		this.upButton.setAttribute("disabled", "true");
		this.upButton.addEventListener("click", this, false);
		reorderButtonDiv.appendChild(this.upButton);

		this.downButton = document.createElement("button");
		this.downButton.type = "button";
		this.downButton.id = "downButton" + this.options.id;
		this.downButton.name = "downButton" + this.options.id;
		this.downButton.className = "btn btn-primary btn-xs";
		var downArrow = document.createElement("span");
		downArrow.id = "downButton" + this.options.id;
		downArrow.className = "glyphicon glyphicon-arrow-down";
		this.downButton.appendChild(downArrow);
		this.downButton.setAttribute("disabled", "true");
		this.downButton.addEventListener("click", this, false);
		reorderButtonDiv.appendChild(this.downButton);
		cell1.appendChild(reorderButtonDiv);

		var form = document.createElement("FORM");
		cell2.appendChild(form);
		form.enctype = "multipart/form-data";

		this.currPanel = document.createElement("DIV");
		form.appendChild(this.currPanel);
		this.currPanel.className = "panel panel-default";
		this.currPanel.id = "para" + this.options.id;
		this.currPanel.style.width = "100%";
		this.currPanel.style.marginTop = "2px";
		this.currPanel.addEventListener("click", this, false);

		var parameterDiv = document.createElement("DIV");
		this.currPanel.appendChild(parameterDiv);
		parameterDiv.id = "pr" + this.options.id;
		parameterDiv.className = "table-responsive";
		parameterDiv.style.height = this.options.height + "px";
		parameterDiv.style.overflowY = "auto";

		if (this.currTable == null) {
			this.currTable = document.createElement("TABLE");
		} else
			$(this.currTable).empty();
		parameterDiv.appendChild(this.currTable);
		this.currTable.className = "table table-striped table-hover";

		// general message dialog plugin
		var p3 = $(this.element).messageDialog({
			id : "PARA0161",
			title : "轩琦科技 - 提示",
			parent : this,
		});
		this.messageDialog = p3.data("messageDialog");

		var plugin1 = $(this.element).parameterNameCellEditor({
			parent : this,
			msg : this.messageDialog,
		});
		this.editor1 = plugin1.data("parameterNameCellEditor");

		var plugin2 = $(this.element).parameterDataTypeSelectCellEditor({
			parent : this,
			msg : this.messageDialog,
		});
		this.editor2 = plugin2.data("parameterDataTypeSelectCellEditor");

		var plugin3 = $(this.element).parameterValueCellEditor({
			parent : this,
			msg : this.messageDialog,
		});
		this.editor3 = plugin3.data("parameterValueCellEditor");

		var plugin4 = $(this.element).parameterCommentCellEditor({
			parent : this,
			msg : this.messageDialog,
		});
		this.editor4 = plugin4.data("parameterCommentCellEditor");

	}

	EditPanel.prototype.setEntity = function(entity) {
		this.entity = entity;
		if (this.options.headbody == 1) { // get request head parameters
			this.initTable(this.currTable, entity.pathParams);
		} else if (this.options.headbody == 2) { // post request body form
			// data
			this.initTable(this.currTable, entity.formParams);
		}
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
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	EditPanel.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.currTable.focus();
			this.startToEdit(evt.target);
		}
	};

	EditPanel.prototype.startToEdit = function(tag) {
		var t = tag.getAttribute("ed");
		if (t == "nam") {
			this.editor1.loadEditor(tag, this.entity, this.options.headbody);
		} else if (t == "type") {
			this.editor2.loadEditor(tag, this.entity, this.options.headbody);
		} else if (t == "val") {
			if (tag.previousSibling.innerText != formdatatype["file"]
					&& tag.previousSibling.innerText != formdatatype["File"]) {
				this.editor3
						.loadEditor(tag, this.entity, this.options.headbody);
			}
		} else if (t == "cmt") {
			this.editor4.loadEditor(tag, this.entity, this.options.headbody);
		}
	};

	EditPanel.prototype.doClick = function(evt) {
		var element = evt.target;
		if (element.tagName == "DIV") {
			evt.preventDefault();
			var panelDiv = element.parentElement;
			if (panelDiv.id == ("para" + this.options.id)) {
				this.currPanel.className = "panel panel-primary";
				this.otherPane.currPanel.className = "panel panel-default";
				if (this.otherPane1 != undefined && this.otherPane1 != null) {
					this.otherPane1.currPanel.className = "panel panel-default";
				}
			}
			this.options.parent.enableAddButton();
			return;
		} else if (element.tagName == "TH") {
			evt.preventDefault();
			var panelDiv = element.parentElement.parentElement.parentElement.parentElement.parentElement;
			if (panelDiv.id == ("para" + this.options.id)) {
				this.currPanel.className = "panel panel-primary";
				this.otherPane.currPanel.className = "panel panel-default";
				if (this.otherPane1 != undefined && this.otherPane1 != null) {
					this.otherPane1.currPanel.className = "panel panel-default";
				}
			}
			this.options.parent.enableAddButton();
			return;
		} else if (element.tagName == "TD") {
			evt.preventDefault();
			var panelDiv = element.parentElement.parentElement.parentElement.parentElement.parentElement;
			var table = element.parentElement.parentElement.parentElement;
			if (panelDiv.id == ("para" + this.options.id)) {
				this.currPanel.className = "panel panel-primary";
				this.otherPane.currPanel.className = "panel panel-default";
				if (this.otherPane1 != undefined && this.otherPane1 != null) {
					this.otherPane1.currPanel.className = "panel panel-default";
				}
				this.clearSelection(this.currTable);
				this.selectRow(table, element.parentElement);
			}
			this.options.parent.enableAddButton();
			return;
		} else if (element.tagName == "INPUT") {
			if (element.type == "file" || element.type == "File") {
			}
		} else if (element == this.upButton
				|| (evt.target.id == "upButton" + this.options.id)) {
			evt.preventDefault();
			map[this.entity.id].stack.execute(new AMUpOrderChangedCmd(this));
		} else if (element == this.downButton
				|| (evt.target.id == "downButton" + this.options.id)) {
			evt.preventDefault();
			map[this.entity.id].stack.execute(new AMDownOrderChangedCmd(this));
		} else {
			evt.preventDefault();
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

	EditPanel.prototype.initTable = function(table, paras) {
		if (paras.length > 0) {
			for (var j = 0; j < paras.length; j++) {
				this.loadRow(paras[j]);
			}
		}
		var row = table.insertRow(table.rows.length);
		for (var j = 0; j < 5; j++) {
			var cell1 = row.insertCell(j);
			cell1.innerHTML = "&nbsp;";
		}
		this.addTableHead(table);
	};

	EditPanel.prototype.addTableHead = function(table) {
		var header = table.createTHead();
		var row = header.insertRow(0);
		row.addEventListener("click", this, false);
		if (this.options.headbody == 1) {
			this.createBlueHead("请求参数", row);
			this.createBlueHead("请求参数类型", row);
			this.createBlueHead("请求参数值", row);
			this.createBlueHead("请求参数注释", row);
			this.createBlueHead(" ", row);
		} else if (this.options.headbody == 2) {
			this.createHead("表单参数", row);
			this.createHead("表单参数类型", row);
			this.createHead("表单参数值", row);
			this.createHead("表单参数注释", row);
			this.createHead(" ", row);
		}
	};

	EditPanel.prototype.createBlueHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = "<font color='blue'>" + content + "</font>";
		row.appendChild(th);
	};

	EditPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	EditPanel.prototype.loadRow = function(p) {
		var row = this.currTable.insertRow(this.currTable.rows.length);
		this.createRow(row, p);
	};

	EditPanel.prototype.createRow = function(row, p) {
		row.addEventListener("click", this, false);
		row.addEventListener("dblclick", this, false);

		var cell0 = row.insertCell(0);
		cell0.setAttribute("ed", "nam");
		cell0.setAttribute("nowrap", "true");
		$(cell0).text(p.name);

		var cell1 = row.insertCell(1);
		cell1.setAttribute("ed", "type");
		cell1.setAttribute("nowrap", "true");
		if (this.options.headbody == 1) {
			$(cell1).text(pathdatatype[p.datatype]);
		} else if (this.options.headbody == 2) {
			if (p.datatype == "file" || p.datatype == "File") {
				$(cell1).text(formdatatype["File"]);
			} else {
				$(cell1).text(formdatatype[p.datatype]);
			}
		}

		var cell2 = row.insertCell(2);
		cell2.setAttribute("ed", "val");
		cell2.setAttribute("nowrap", "true");
		if (this.options.headbody == 1) {
			$(cell2).text(p.value);
		} else if (this.options.headbody == 2) {
			if (p.datatype == "file" || p.datatype == "File") {
				var input = document.createElement("input");
				input.className = "form-control";
				input.style.height = "27px";
				input.style.padding = "0px";
				input.type = "File";
				input.name = p.name;
				input.multiple = true;
				cell2.appendChild(input);
			} else
				$(cell2).text(p.value);
		}

		var cell3 = row.insertCell(3);
		cell3.setAttribute("ed", "cmt");
		cell3.setAttribute("nowrap", "true");
		$(cell3).text(p.comments);

		var cell4 = row.insertCell(4);
		cell4.setAttribute("ed", "-1");
		cell4.setAttribute("nowrap", "true");
		var rmspan = document.createElement("i");
		cell4.appendChild(rmspan);

		rmspan.className = "fa fa-minus-circle fa-lg";
		rmspan.style.color = "red";
		rmspan.setAttribute("aria-hidden", "true");
		var that = this;
		rmspan.addEventListener("click", function() {
			that.remove($(this).closest('tr').index() + 1, p);
		});
		return row.rowIndex;
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

	EditPanel.prototype.removeRow = function(index) {
		this.currTable.deleteRow(index);
		this.selectRowByIndex(index);
	};

	EditPanel.prototype.remove = function(index, para) {
		map[this.entity.id].stack.execute(new AMRemoveParaCmd(this.entity,
				this, para, index, this.options.headbody));
	};

	EditPanel.prototype.addNew = function() {
		var para = new Parameter();
		para.name = "p" + (this.currTable.rows.length - 1);
		// get unique parameter name
		para.name = this.entity.generateUniqueParaName(para.name,
				this.options.headbody);
		map[this.entity.id].stack.execute(new AMAddParaCmd(this.entity, this,
				para, this.options.headbody));
	};

	EditPanel.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (var i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
			this.currRowIndex = -1;
		}
	};

	EditPanel.prototype.selectRow = function(table, row) {
		if (row.rowIndex >= 1 && row.rowIndex <= table.rows.length - 2) {
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