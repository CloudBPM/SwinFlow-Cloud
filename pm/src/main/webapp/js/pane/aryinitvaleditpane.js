/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "aryInitValueEditPanel";
	var defaults = {
		id : "",
		owner : "",
		msgbox : "",
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			owner : "",
			msgbox : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.selIndex = -1;
		this.init(options);
	};

	EditPanel.prototype.init = function(options) {

		var toolbarRow = document.createElement("div");
		this.element.appendChild(toolbarRow);
		toolbarRow.className = "row";

		var tb = document.createElement("div");
		tb.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		toolbarRow.appendChild(tb);

		var toolbar = document.createElement("DIV");
		tb.appendChild(toolbar);
		toolbar.className = "btn-toolbar";
		toolbar.setAttribute("role", "toolbar");
		toolbar.setAttribute("aria-label", "ptoolbar");

		var c2 = "btn btn-primary btn-xs";
		var c4 = "btn btn-success btn-xs";

		var g1 = this.buttongroup("group1");
		toolbar.appendChild(g1);
		this.btn0 = this.createICONButton(g1, options.id, "Add", "添加数组元素", c4,
				"i", "glyphicon glyphicon-plus");

		var g2 = this.buttongroup("group2");
		toolbar.appendChild(g2);
		this.btn1 = this.createICONButton(g2, options.id, "Up", "上移", c2, "i",
				"glyphicon glyphicon-arrow-up");
		this.btn2 = this.createICONButton(g2, options.id, "Down", "下移", c2,
				"i", "glyphicon glyphicon-arrow-down");

		var aryDetailsDIV = document.createElement("div");
		this.element.appendChild(aryDetailsDIV);
		aryDetailsDIV.className = "form-group table-responsive";
		aryDetailsDIV.style.borderRadius = "4px";
		aryDetailsDIV.style.border = "1px solid #dddddd";
		aryDetailsDIV.style.height = "150px";
		aryDetailsDIV.style.overflowY = "auto";

		this.aryDetailsTable = document.createElement("TABLE");
		aryDetailsDIV.appendChild(this.aryDetailsTable);
		this.aryDetailsTable.className = "table table-hover table-striped";

		// general message dialog plugin
		var p3 = $(this.element).confirmInfoDialog({
			id : "0162",
			title : vendor + " - 提示",
			parent : this,
		});
		this.messageDialog = p3.data("confirmInfoDialog");

		var plugin = $(this.element).basicDataValueCellEditor({
			parent : this,
		});
		this.editor = plugin.data("basicDataValueCellEditor");

		var plugin1 = $(this.element).boolValueCellEditor({
			parent : this,
		});
		this.editor1 = plugin1.data("boolValueCellEditor");

		var plugin2 = $(this.element).longTextCellEditor({
			parent : this,
		});
		this.editor2 = plugin2.data("longTextCellEditor");

		var plugin3 = $(this.element).datetimeCellEditor({
			parent : this,
		});
		this.editor3 = plugin3.data("datetimeCellEditor");

		var plugin4 = $(this.element).dateCellEditor({
			parent : this,
		});
		this.editor4 = plugin4.data("dateCellEditor");

		var plugin5 = $(this.element).timeCellEditor({
			parent : this,
		});
		this.editor5 = plugin5.data("timeCellEditor");

		var plugin6 = $(this.element).timeDurationCellEditor({
			parent : this,
		});
		this.editor6 = plugin6.data("timeDurationCellEditor");

		var plugin7 = $(this.element).fileObjectCellEditor({
			parent : this,
		});
		this.editor7 = plugin7.data("fileObjectCellEditor");
	};

	EditPanel.prototype.setInitValue = function(v) {
		this.v = v; // variable object
		this.refreshValues();
	};

	EditPanel.prototype.refreshValues = function() {
		var v = this.v;
		$(this.aryDetailsTable).children().remove();
		if (v.values != null && v.values.length > 0) {
			for (var i = 0; i < v.values.length; i++) {
				var row = this.aryDetailsTable.insertRow(i);
				row.addEventListener("click", this, false);
				row.addEventListener("dblclick", this, false);
				row.setAttribute("indx", i + "");
				row.setAttribute("datatype", v.datatype);
				if (v.datatype == "Integer") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				} else if (v.datatype == "Double") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				} else if (v.datatype == "Boolean") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				} else if (v.datatype == "String") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				} else if (v.datatype == "DateTime") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				} else if (v.datatype == "Date") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				} else if (v.datatype == "Time") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				} else if (v.datatype == "TimeDuration") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				} else if (v.datatype == "JSONData") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				} else if (v.datatype == "File") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].name, row, "y");
					if (v.values[i].size == -1) {
						this.createCell(3, "", row, "h");
					} else {
						this.createCell(3, Utils.formatBytes(v.values[i].size,
								2), row, "h");
					}
					if (v.values[i].lastupdate == null
							|| v.values[i].lastupdate == "") {
						this.createCell(4, "", row, "h");
					} else {
						this.createCell(4, Utils
								.convertGMTDateTime(v.values[i].lastupdate),
								row, "h");
					}
					if (v.values[i].id != "") {
						var cell = row.insertCell(5);
						cell.setAttribute("nowrap", "true");
						cell.style.textAlign = "left";
						cell.setAttribute("type", "h");
						this.createOpertionPane(cell, v.values[i].id);
					} else {
						this.createCell(5, "", row, "h");
					}
				} else if (v.datatype == "Handwriting") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				} else if (v.datatype == "Currency") {
					this.createColumns(row, i);
					this.createCell(2, v.values[i].toString(), row, "y");
				}
			}
			if (this.selIndex > -1) {
				this.selectRow(this.selIndex);
			}
		} else {
			this.selIndex = -1;
		}
		this.enableUpDownBtn(this.selIndex);
	};

	EditPanel.prototype.createColumns = function(row, i) {
		var cell = row.insertCell(0);
		cell.setAttribute("nowrap", "true");
		cell.setAttribute("type", "h");
		cell.style.width = "20px";
		var btn = this.createRemoveIcon(cell);
		var cell1 = row.insertCell(1);
		cell1.setAttribute("nowrap", "true");
		cell1.setAttribute("type", "h");
		cell1.style.width = "20px";
		cell1.innerHTML = i.toString();
	};

	EditPanel.prototype.createRemoveIcon = function(parent) {
		var rmspan = document.createElement("i");
		parent.appendChild(rmspan);
		rmspan.className = "fa fa-minus-circle fa-lg";
		rmspan.style.color = "red";
		rmspan.name = "rmArrayElmt";
		rmspan.setAttribute("aria-hidden", "true");
		rmspan.setAttribute("data-toggle", "modal");
		rmspan.setAttribute("data-target", "myModal");
		rmspan.addEventListener("click", this, false);
		return rmspan;
	};

	EditPanel.prototype.createOpertionPane = function(cell, id) {
		var that = this;
		var btnDiv = document.createElement("DIV");
		cell.appendChild(btnDiv);
		btnDiv.className = "col-lg-2 col-md-2 col-sm-2 col-xs-2";

		var cancelBtn = document.createElement("button");
		btnDiv.appendChild(cancelBtn);
		cancelBtn.type = "button";
		cancelBtn.className = "btn btn-default";
		cancelBtn.style.borderRadius = "15px";
		cancelBtn.style.width = "28px";
		cancelBtn.style.padding = "2px";

		var iconC = document.createElement("i");
		cancelBtn.appendChild(iconC);
		iconC.id = "iconC" + id;
		iconC.className = "fa fa-trash fa-lg";
		iconC.setAttribute("aria-hidden", "true");
		iconC.style.color = "red";
		iconC
				.addEventListener(
						"click",
						function(evt) {
							var r = evt.target.parentElement.parentElement.parentElement.parentElement;
							var k = r.getAttribute("indx");
							r = parseInt(k);
							that.selIndex = k;
							if (that.v.values[r].id != null
									&& that.v.values[r].id != "") {
								that.messageDialog.show("该删除不可恢复，您确定要删除吗？");
							} else {
								if (that.uploadPlugin.uploadAction.completed == 0) {
									that.uploadPlugin.uploadAction.doCancel();
								} else if (that.uploadAction.completed == 1) {
									that.messageDialog.show("该删除不可恢复，您确定要删除吗？");
								}
							}
						}, false);

		var span = document.createElement("span");
		btnDiv.appendChild(span);
		span.innerHTML = "&nbsp;&nbsp;"

		var previewBtn = document.createElement("button");
		btnDiv.appendChild(previewBtn);
		previewBtn.type = "button";
		previewBtn.className = "btn btn-default";
		previewBtn.style.borderRadius = "15px";
		previewBtn.style.width = "28px";
		previewBtn.style.padding = "2px";

		iconP = document.createElement("i");
		previewBtn.appendChild(iconP);
		iconP.id = "iconP" + id;
		iconP.className = "fa fa-download fa-lg";
		iconP.setAttribute("aria-hidden", "true");
		iconP
				.addEventListener(
						"click",
						function(evt) {
							$("#progressbar").show();
							var r = evt.target.parentElement.parentElement.parentElement.parentElement;
							var k = r.getAttribute("indx");
							r = parseInt(k);
							var fd = new FormData();
							fd.append('oid', that.v.owner);
							fd.append('path', that.v.values[r].owner + "/pm/"
									+ that.v.values[r].currOwner + "/"
									+ that.v.values[r].id + "_"
									+ that.v.values[r].name);
							fd.append('fname', that.v.values[r].name);
							var xhh = new XMLHttpRequest();
							xhh.open("post", service.api2(3, that.v.owner),
									true);
							xhh.responseType = 'blob'
							xhh.onreadystatechange = function() {
								if (xhh.readyState == 4) {
									if (xhh.status == 200) {
										var contenttype = xhh
												.getResponseHeader("Content-Type");
										var name = xhh
												.getResponseHeader("Content-disposition");
										if (name != null) {
											var filename = name.substring(21,
													name.length);
											filename = decodeURI(filename,
													"utf-8");
											that.saveFile(this.response,
													filename, contenttype);
										}
									}
								}
								$("#progressbar").hide();
							};
							xhh.send(fd);
						}, false);
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

	EditPanel.prototype.startToEdit = function(tag) {
		var t = tag.parentElement.getAttribute("datatype");
		var n = tag.parentElement.cells[1].innerHTML;
		if (t == "Integer" || t == "String" || t == "Double" || t == "Currency") {
			this.editor.loadEditor(tag, this.v.values[n], t);
		} else if (t == "Boolean") {
			this.editor1.loadEditor(tag, this.v.values[n], t);
		} else if (t == "JSONData") {
			this.editor2.loadEditor(tag, this.v.values[n], t);
		} else if (t == "DateTime") {
			this.editor3.loadEditor(tag, this.v.values[n], t);
		} else if (t == "Date") {
			this.editor4.loadEditor(tag, this.v.values[n], t);
		} else if (t == "Time") {
			this.editor5.loadEditor(tag, this.v.values[n], t);
		} else if (t == "TimeDuration") {
			this.editor6.loadEditor(tag, this.v.values[n], t);
		} else if (t == "File") {
			this.editor7.loadEditor(tag, this.v.values[n], t, this.v.owner,
					this.v.currOwner, this.v.id);
		} else if (t == "Handwriting") {

		}
	};

	EditPanel.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			var r = evt.target.parentElement;
			this.clearSelection(r.parentElement);
			r.style.background = "#d1d1e0";
			this.selIndex = r.rowIndex;
			this.enableUpDownBtn(-1);
			this.startToEdit(evt.target);
		}
	};

	EditPanel.prototype.doClick = function(evt) {
		if (evt.target.name == "buttonAdd" + this.options.id
				|| evt.target.name == "iconAdd" + this.options.id) {
			this.addNewValue(evt, this.v);
			this.refreshValues();
			Utils.stopBubble(evt);
			return;
		} else if (evt.target.name == "buttonUp" + this.options.id
				|| evt.target.name == "iconUp" + this.options.id) {
			var obj = this.v.values[this.selIndex - 1];
			this.v.values[this.selIndex - 1] = this.v.values[this.selIndex];
			this.v.values[this.selIndex] = obj;
			this.selIndex = this.selIndex - 1;
			this.refreshValues();
			Utils.stopBubble(evt);
			return;
		} else if (evt.target.name == "buttonDown" + this.options.id
				|| evt.target.name == "iconDown" + this.options.id) {
			var obj = this.v.values[this.selIndex + 1];
			this.v.values[this.selIndex + 1] = this.v.values[this.selIndex];
			this.v.values[this.selIndex] = obj;
			this.selIndex = this.selIndex + 1;
			this.refreshValues();
			Utils.stopBubble(evt);
			return;
		}
		if (evt.target.name == "rmArrayElmt") {
			this.removeFileObject(evt, this);
			return;
		}
		if (evt.target.tagName == "TD") {
			var r = evt.target.parentElement;
			this.clearSelection(r.parentElement);
			r.style.background = "#d1d1e0";
			this.selIndex = r.rowIndex;
			this.enableUpDownBtn(this.selIndex);
		}
	};

	EditPanel.prototype.doYesAction = function(evt) {
		this.messageDialog.hide();
		var that = this;
		$("#progressbar").show();
		$.post(service.api2(1, this.v.owner), {
			pid : this.v.currOwner,
			vid : this.v.id,
			fid : this.v.values[this.selIndex].id,
		}).complete(function(data) {
			if (data.responseJSON.status != -5) {
				that.v.values[that.selIndex] = new FileConstant();
				that.refreshValues();
				$("#progressbar").hide();
			} else {
				window.location.replace("/login/");
			}
		});
	};

	EditPanel.prototype.doNoAction = function(evt) {
		this.messageDialog.hide();
	};

	EditPanel.prototype.saveFile = function(blob, fileName, contenttype) {
		var b = Utils.getBrowserType();
		if (b == "Chrome") {
			var link = document.createElement('a');
			var file = new Blob([ blob ], {
				type : contenttype
			});
			link.href = window.URL.createObjectURL(file);
			link.download = fileName;
			link.click();
		} else if (b == "FF") {
			var file = new File([ blob ], fileName, {
				type : contenttype
			});
			var url = URL.createObjectURL(file);
			// window.location.href = url;
			parent.location.href = url;
		} else if (Utils.isIE()) {
			var file = new Blob([ blob ], {
				type : 'application/force-download'
			});
			window.navigator.msSaveBlob(file, fileName);
		}
	};

	EditPanel.prototype.removeFileObject = function(evt, parent) {
		var row = evt.target.parentElement.parentElement;
		$("#progressbar").show();
		$.post(service.api2(1), {
			oid : this.v.owner, // organization id
			pid : this.v.currOwner, // process id
			vid : this.v.id,
			fid : this.v.values[parent.selIndex].id,
		}).complete(function(data) {
			if (row.rowIndex > -1) {
				if (parent.selIndex == parent.v.values.length - 1) {
					parent.selIndex = parent.selIndex - 1;
				}
				parent.v.values.splice(row.rowIndex, 1);
			}
			parent.refreshValues();
			$("#progressbar").hide();
		});
	};

	EditPanel.prototype.selectRow = function(indx) {
		this.clearSelection(this.aryDetailsTable);
		this.aryDetailsTable.rows[indx].style.background = "#d1d1e0";
		this.enableUpDownBtn(indx);
	};

	EditPanel.prototype.enableUpDownBtn = function(indx) {
		if (indx > -1) {
			if (indx == 0) {
				if (this.v.values.length > 1) {
					this.btn1.disabled = true;
					this.btn2.disabled = false;
				} else {
					this.btn1.disabled = true;
					this.btn2.disabled = true;
				}
			} else if (indx == this.v.values.length - 1) {
				if (this.v.values.length > 1) {
					this.btn1.disabled = false;
					this.btn2.disabled = true;
				} else {
					this.btn1.disabled = true;
					this.btn2.disabled = true;
				}
			} else if (indx > 0 && indx < this.v.values.length - 1) {
				this.btn1.disabled = false;
				this.btn2.disabled = false;
			}
		} else if (indx > -1) {
			this.btn1.disabled = true;
			this.btn2.disabled = true;
		}
	};

	EditPanel.prototype.addNewValue = function(evt, v) {
		if (v.datatype == "Integer") {
			v.values.push(new IntegerConstant());
		} else if (v.datatype == "Double") {
			v.values.push(new DoubleConstant());
		} else if (v.datatype == "Boolean") {
			v.values.push(new BooleanConstant());
		} else if (v.datatype == "String") {
			v.values.push(new StringConstant());
		} else if (v.datatype == "DateTime") {
			var val = new DateTimeConstant();
			val.datatype = v.datatype;
			v.values.push(val);
		} else if (v.datatype == "Date") {
			var val = new DateTimeConstant();
			val.datatype = v.datatype;
			v.values.push(val);
		} else if (v.datatype == "Time") {
			var val = new DateTimeConstant();
			val.datatype = v.datatype;
			v.values.push(val);
		} else if (v.datatype == "TimeDuration") {
			v.values.push(new TimeDurationConstant());
		} else if (v.datatype == "JSONData") {
			v.values.push(new JSONConstant());
		} else if (v.datatype == "File") {
			v.values.push(new FileConstant());
		} else if (v.datatype == "Handwriting") {
			v.values.push(new HandwritingConstant());
		} else if (v.datatype == "Currency") {
			var val = new DoubleConstant();
			val.datatype = "Currency";
			v.values.push(val);
		}
	};

	EditPanel.prototype.createCell = function(no, content, row, type) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		if (content == "") {
			cell.innerHTML = "&nbsp;";
		} else {
			$(cell).text(content);
		}
		cell.style.textAlign = "left";
		cell.setAttribute("type", type);
	};

	EditPanel.prototype.buttongroup = function(name) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", name);
		return group;
	};

	EditPanel.prototype.createICONButton = function(group, id, name, title,
			style, fonttag, fontclass) {
		var button = document.createElement("button");
		group.appendChild(button);
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.name = "button" + name + id;
		button.addEventListener('click', this, false);
		var icon = document.createElement(fonttag);
		button.appendChild(icon);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.setAttribute("aria-hidden", "true");
		icon.name = "icon" + name + id;
		icon.addEventListener('click', this, false);
		return button;
	};

	EditPanel.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
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