/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "variableSelectDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		entity : "",
		currOwner : "",
	};

	var EditDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			entity : "",
			currOwner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = options.entity;
		this.currOwner = options.currOwner;
		this.init(options);
		this.selObjects = [];
	};

	EditDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		this.modalframe.className = "modal fade";
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "rcEditModalLabel");

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "650px"
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		modaldialogDIV.appendChild(dialogContentDIV);

		// dialog heading
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
		dialogHeaderDIV.appendChild(titleH4);

		var infoIcon = document.createElement("i");
		infoIcon.className = "fa fa-pencil-square fa-lg";
		infoIcon.style.color = "green";
		titleH4.appendChild(infoIcon);

		var info = document.createElement("label");
		info.innerHTML = options.title;
		titleH4.appendChild(info);

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);
		dialogForm.className = "form-horizontal";
		dialogForm.setAttribute("role", "form");

		var dialogBodyDIV = document.createElement("div");
		dialogBodyDIV.className = "modal-body";
		dialogForm.appendChild(dialogBodyDIV);

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyFrameDIV.className = "container-fluid";
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);

		var bodyRow = document.createElement("div");
		bodyRow.className = "row";
		dialogBodyFrameDIV.appendChild(bodyRow);

		// body content
		var tableDiv = document.createElement("DIV");
		bodyRow.appendChild(tableDiv);
		tableDiv.id = "tablediv" + options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = "200px";
		this.varlist = document.createElement("table");
		this.varlist.className = "table table-striped table-hover";
		tableDiv.appendChild(this.varlist);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		var saveButton = document.createElement("button");
		saveButton.type = "button";
		saveButton.id = "OK" + options.id;
		saveButton.name = "OK" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.innerHTML = "确定";
		saveButton.addEventListener("click", this, false);
		dialogFooterDIV.appendChild(saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "button";
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

		var dialog = $(bodyRow).alertBox({
			id : "receiverAlert" + this.options.id,
		});
		this.messageBox = dialog.data("alertBox");

		this.loadFileVariables(this.entity, this.currOwner);
	};

	EditDialog.prototype.loadFileVariables = function(entity, currOwner) {
		var that = this;
		$(this.varlist).children().remove();
		for (var i = 0; i < currOwner.children.length; i++) {
			if (currOwner.children[i].datatype == "File"
					|| currOwner.children[i].datatype == "file") {
				var v = currOwner.children[i];
				var row = this.varlist.insertRow(-1);
				var cell = row.insertCell(0);
				cell.setAttribute("nowrap", "true");
				var check = document.createElement("input");
				cell.appendChild(check);
				check.type = "checkbox";
				check.name = "sel_" + v.id;
				check.setAttribute("vid", v.id);
				check.addEventListener("click", function() {
					if (this.checked) {
						var f = false;
						for (var j = 0; j < that.selObjects.length; j++) {
							if ("sel_" + that.selObjects[j].id == this.name) {
								f = true;
								break;
							}
						}
						if (!f) {
							var vid = this.getAttribute("vid");
							that.selObjects.push(currOwner.seekChildByID(vid));
						}
					} else {
						for (var j = 0; j < that.selObjects.length; j++) {
							if ("sel_" + that.selObjects[j].id == this.name) {
								that.selObjects.splice(j, 1);
								break;
							}
						}
					}
				});
				this.createCell(1, v.name, row);
				this.createCell(2, datatype[v.datatype], row);
				this.createCell(3, v.toValueString(), row);
				this.createCell(4, v.description, row);
			}
		}
		this.addHeader();
	};

	EditDialog.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	EditDialog.prototype.addHeader = function() {
		var header = this.varlist.createTHead();
		var row = header.insertRow(0);
		this.createHead("选项", row);
		this.createHead("变量名称", row);
		this.createHead("数据类型", row);
		this.createHead("值", row);
		this.createHead("描述", row);
	};

	EditDialog.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		if (content == "") {
			cell.innerHTML = "&nbsp;";
		} else {
			$(cell).text(content);
		}
	};

	EditDialog.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	EditDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	EditDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true,
		});
	};

	EditDialog.prototype.doClick = function(evt) {
		if (evt.target.id == "OK" + this.options.id) {
			if (this.options.parent.setSelectedVariables != undefined) {
				this.options.parent.setSelectedVariables(this.selObjects);
			}
			this.hide();
		}
	};

	EditDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EditDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);