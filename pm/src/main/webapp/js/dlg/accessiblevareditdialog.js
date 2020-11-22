/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "accessibleVaiableEditDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		currowner : "",
	};

	var AccessibleVaiableEditDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.currOwner = options.currowner;
		this.init(options);
	};

	AccessibleVaiableEditDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		this.modalframe.className = "modal fade";
		this.modalframe.id = "avEditorModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "ruleEditModalLabel");

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "700px"
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
		titleH4.id = "editModalLabel" + options.id;
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

		var dialogBodyDIV = document.createElement("div");
		dialogBodyDIV.className = "modal-body";
		dialogForm.appendChild(dialogBodyDIV);

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyFrameDIV.className = "container-fluid";
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);

		var bodyRow = document.createElement("div");
		bodyRow.className = "row";
		bodyRow.id = "bodyrow" + options.id;
		dialogBodyFrameDIV.appendChild(bodyRow);

		var tableDiv = document.createElement("DIV");
		bodyRow.appendChild(tableDiv);
		tableDiv.id = "tablediv" + options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = "600px";
		this.variablelist = document.createElement("table");
		this.variablelist.className = "table table-striped table-hover";
		tableDiv.appendChild(this.variablelist);

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

	};

	AccessibleVaiableEditDialog.prototype.loadData = function(entity) {
		var that = this;
		this.cmd = new PMAccessibleVarListChangedCmd(entity, this.currOwner);
		var newobjs = entity.cloneAccessibleVarList();
		this.nwobjs = newobjs;
		var vars = this.currOwner.listVariables();
		$(this.variablelist).children().remove();
		if (vars != null && vars.length > 0) {
			for (var i = 0; i < vars.length; i++) {
				var f = false;
				for (var j = 0; j < newobjs.length; j++) {
					if (vars[i].id == newobjs[j].varId) {
						f = true;
						break;
					}
				}
				var row = this.variablelist.insertRow(-1);
				var cell = row.insertCell(0);
				cell.setAttribute("nowrap", "true");
				var check = document.createElement("input");
				cell.appendChild(check);
				check.type = "checkbox";
				check.name = vars[i].id;
				check.id = "chk" + vars[i].id;
				check.setAttribute("value", vars[i].id);
				if (f) {
					check.checked = true;
				}
				check
						.addEventListener(
								"click",
								function() {
									if (this.checked) {
										if (entity instanceof StartPoint
												|| entity instanceof EndPoint
												|| entity instanceof ManualTask) {
											document.getElementById("ctrl1"
													+ this.name).disabled = false;
											document.getElementById("ctrl2"
													+ this.name).disabled = false;
										}
										var a = new AccessibleVariable();
										a.taskId = entity.id;
										a.varId = this.name;
										a.accessControl = parseInt($(
												'input[name='
														+ this.name
														+ '][type=radio]:checked')
												.val());
										a.currOwner = entity.currOwner;
										a.owner = entity.owner;
										that.addAccessibleVar(a, newobjs);
									} else {
										document.getElementById("ctrl1"
												+ this.name).disabled = true;
										document.getElementById("ctrl2"
												+ this.name).disabled = true;
										that.removeAccessibleVar(this.name,
												newobjs);
									}
								});
				this.createCell(1, vars[i].name, row);
				this.createCell(2, Utils.toDataType(vars[i].datatype), row);

				var cell1 = row.insertCell(3);
				cell1.setAttribute("nowrap", "true");

				var grp = document.createElement("label");
				cell1.appendChild(grp);
				// read only
				var r1 = document.createElement("input");
				grp.appendChild(r1);
				r1.type = "radio";
				r1.name = vars[i].id;
				r1.id = "ctrl1" + vars[i].id;
				r1.checked = true;
				r1.setAttribute("value", "0");
				if (entity instanceof StartPoint || entity instanceof EndPoint) {
					r1.disabled = true;
				} else {
					if (!f) {
						r1.disabled = true;
					}
				}
				if (entity instanceof ManualTask) {
					for (var j = 0; j < newobjs.length; j++) {
						if (vars[i].id == newobjs[j].varId
								&& newobjs[j].accessControl == 0) {
							r1.checked = true;
							break;
						}
					}
				}

				r1.addEventListener("click", function() {
					for (var i = 0; i < newobjs.length; i++) {
						if (newobjs[i].varId == this.name) {
							newobjs[i].accessControl = 0;
							break;
						}
					}
				});
				var rlebl = document.createElement("span");
				grp.appendChild(rlebl);
				rlebl.innerHTML = "只读" + "&nbsp;&nbsp;";
				// editable
				var grp1 = document.createElement("label");
				cell1.appendChild(grp1);
				var r2 = document.createElement("input");
				grp1.appendChild(r2);
				r2.type = "radio";
				r2.name = vars[i].id;
				r2.id = "ctrl2" + vars[i].id;
				r2.setAttribute("value", "1");
				if (entity instanceof StartPoint || entity instanceof EndPoint) {
					r2.disabled = true;
				} else {
					if (!f) {
						r2.disabled = true;
					}
				}
				if (entity instanceof ManualTask) {
					for (var j = 0; j < newobjs.length; j++) {
						if (vars[i].id == newobjs[j].varId
								&& newobjs[j].accessControl == 1) {
							r2.checked = true;
							break;
						}
					}
				}
				r2.addEventListener("click", function() {
					for (var i = 0; i < newobjs.length; i++) {
						if (newobjs[i].varId == this.name) {
							newobjs[i].accessControl = 1;
							break;
						}
					}
				});
				var wlebl = document.createElement("span");
				grp1.appendChild(wlebl);
				wlebl.innerHTML = "可写";
				if (entity instanceof EndPoint) {
					r1.checked = true;
					r2.checked = false;
				} else if (entity instanceof StartPoint) {
					r1.checked = false;
					r2.checked = true;
				}

			}
		}
		this.addHeader();
	};

	AccessibleVaiableEditDialog.prototype.addAccessibleVar = function(dv, list) {
		list.push(dv);
	};

	AccessibleVaiableEditDialog.prototype.removeAccessibleVar = function(id,
			list) {
		for (var i = 0; i < list.length; i++) {
			if (list[i].varId == id) {
				list.splice(i, 1);
				break;
			}
		}
	};

	AccessibleVaiableEditDialog.prototype.addHeader = function() {
		var header = this.variablelist.createTHead();
		var row = header.insertRow(0);
		this.createHead("选项", row);
		this.createHead("变量名", row);
		this.createHead("数据类型", row);
		this.createHead("访问控制", row);
	};

	AccessibleVaiableEditDialog.prototype.createCell = function(no, content,
			row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		if (content == "") {
			cell.innerHTML = "&nbsp;";
		} else {
			$(cell).text(content);
		}
	};

	AccessibleVaiableEditDialog.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	AccessibleVaiableEditDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	AccessibleVaiableEditDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true,
		});
	};

	AccessibleVaiableEditDialog.prototype.doClick = function(evt) {
		if (evt.target.id == "OK" + this.options.id) {
			this.cmd.update(this.nwobjs);
			map[this.currOwner.id].stack.execute(this.cmd);
			// console.log(this.nwobjs);
			this.hide();
		}
	};

	AccessibleVaiableEditDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new AccessibleVaiableEditDialog(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);