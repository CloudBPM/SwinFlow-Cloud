/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "basicPropertySheet";
	var defaults = {
		prop : "",
		topparent : "",
	};

	var BasicPropertySheet = function(element, options) {
		this.element = element;
		this.options = $.extend({
			prop : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent;
		this.propertysheet;
		this.entity = null;
		this.owner = null;
		this.routeorderpane;
		this.init(options);
		this.clearSheet();
		this.initSheet();
	};

	BasicPropertySheet.prototype.init = function(options) {
		this.topparent = options.topparent;
		var panelDiv = document.createElement("DIV");
		this.element.appendChild(panelDiv);
		panelDiv.className = "panel panel-default";

		var header = document.createElement("DIV");
		panelDiv.appendChild(header);
		header.className = "panel-heading";
		header.innerHTML = "基本属性";

		var tableDiv = document.createElement("DIV");
		panelDiv.appendChild(tableDiv);
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.id = "basicpropertysheet";

		this.propertysheet = document.createElement("table");
		tableDiv.appendChild(this.propertysheet);
		this.propertysheet.id = "propertysheet";
		this.propertysheet.className = "table table-striped table-hover";

		// general message dialog plugin
//		var p3 = $(options.topparent).messageDialog({
//			id : "016",
//			title : "云BPM - 提示",
//			parent : this,
//		});
//		this.messageDialog = p3.data("messageDialog");
//
//		var plugin1 = $(this.propertysheet).textCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor1 = plugin1.data("textCellEditor");
//
//		var plugin2 = $(this.propertysheet).textareaCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor2 = plugin2.data("textareaCellEditor");
//
//		var plugin3 = $(this.propertysheet).processTypeSelectCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor3 = plugin3.data("processTypeSelectCellEditor");
//
//		var plugin4 = $(this.propertysheet).accessTypeSelectCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor4 = plugin4.data("accessTypeSelectCellEditor");
//
//		var plugin5 = $(this.propertysheet).yesnoCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor5 = plugin5.data("yesnoCellEditor");
//
//		var plugin6 = $(this.propertysheet).workflowTypeSelectCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor6 = plugin6.data("workflowTypeSelectCellEditor");
//
//		var plugin7 = $(this.propertysheet).priceCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor7 = plugin7.data("priceCellEditor");
//
//		var plugin8 = $(this.propertysheet).processNameCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor8 = plugin8.data("processNameCellEditor");
//
//		var plugin9 = $(this.propertysheet).trialPeriodSelectCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor9 = plugin9.data("trialPeriodSelectCellEditor");
	};

	BasicPropertySheet.prototype.initSheet = function(options) {
		for (i = 0; i < 20; i++) {
			var row = this.propertysheet.insertRow(-1);
			var cell1 = row.insertCell(0);
			cell1.innerHTML = "&nbsp;";
		}
	};

	BasicPropertySheet.prototype.clearSheet = function(options) {
		$(this.propertysheet).children().remove();
	};

	// obj is process or task or transition or released process
	// owner is current owner of task or transition
	BasicPropertySheet.prototype.setSheet = function(obj, owner) {
		this.entity = obj;
		this.owner = owner;
		this.clearSheet();
		var sheet = this.propertysheet;
//		if (obj instanceof WfProcess) {
//			for (x in obj) {
//				if (x == "id" || x == "name" || x == "code"
//						|| x == "workflowType" || x == "processType"
//						|| x == "accessLevel" || x == "lastupdate"
//						|| x == "author" || x == "parent" || x == "keywords"
//						|| x == "owner" || x == "purchasePrice"
//						|| x == "usagePrice" || x == "description") {
//					var editable = "-1";
//					var keyname = "";
//					var isnull = "y";
//					if (x == "id") {
//						keyname = "流程标识";
//						editable = "-1";
//						isnull = "n";
//					} else if (x == "code") {
//						keyname = "流程编码";
//						editable = "-1";
//						isnull = "n";
//					} else if (x == "name") {
//						keyname = "流程名称";
//						editable = "pnme";
//						isnull = "n";
//					} else if (x == "processType") {
//						keyname = "业务类型";
//						editable = "prctype";
//						isnull = "n";
//					} else if (x == "workflowType") {
//						keyname = "流程类型";
//						editable = "wftype";
//						isnull = "n";
//					} else if (x == "accessLevel") {
//						keyname = "密级";
//						editable = "acctype";
//						isnull = "n";
//					} else if (x == "description") {
//						keyname = "流程简介";
//						editable = "desc";
//						isnull = "y";
//					} else if (x == "keywords") {
//						keyname = "关键字";
//						editable = "kw";
//						isnull = "n";
//					} else if (x == "author") {
//						keyname = "创建人";
//						editable = "nme";
//						isnull = "n";
//					} else if (x == "purchasePrice") {
//						keyname = "销售价（￥）";
//						editable = "pp";
//						isnull = "n";
//					} else if (x == "usagePrice") {
//						keyname = "租用价（￥）";
//						editable = "up";
//						isnull = "n";
//					} else if (x == "lastupdate") {
//						keyname = "最后更新";
//						editable = "-1";
//						isnull = "n";
//					} else if (x == "parent") {
//						keyname = "文件夹";
//						editable = "-1";
//						isnull = "n";
//					} else if (x == "owner") {
//						keyname = "所有人";
//						editable = "-1";
//						isnull = "n";
//					}
//					if (x == "name" || x == "author" || x == "keywords"
//							|| x == "description") {
//						this.setPropertyCell(sheet, x, keyname,
//								obj[x] != null ? Utils.parse(obj[x]) : "",
//								editable, isnull);
//					} else if (x == "processType") {
//						this.setPropertyCell(sheet, x, keyname,
//								processtype[obj[x]], editable, isnull);
//					} else if (x == "workflowType") {
//						this.setPropertyCell(sheet, x, keyname,
//								workflowtype[obj[x]], editable, isnull);
//					} else if (x == "accessLevel") {
//						this.setPropertyCell(sheet, x, keyname,
//								accesstype[obj[x]], editable, isnull);
//					} else if (x == "parent") {
//						var p = $('#treeview').jstree('get_node', obj[x]);
//						this.setPropertyCell(sheet, x, keyname, p.text,
//								editable, isnull);
//					} else if (x == "owner") {
//						var p = $('#treeview').jstree('get_node', obj[x]);
//						this.setPropertyCell(sheet, x, keyname, p.text,
//								editable, isnull);
//					} else {
//						this.setPropertyCell(sheet, x, keyname, obj[x],
//								editable, isnull);
//					}
//				}
//			}
//		} else if (obj instanceof AbstractTask) {
//			for (x in obj) {
//				if (x == "id" || x == "name" || x == "isParallelInput"
//						|| x == "isParallelOutput" || x == "description"
//						|| x == "lastupdate") {
//					var editable = "-1";
//					var keyname = "";
//					var isnull = "y";
//					if (x == "id") {
//						keyname = "任务标识";
//						editable = "-1";
//						isnull = "n";
//					} else if (x == "name") {
//						keyname = "任务名称";
//						if (!(this.owner instanceof ReleasedWfProcess)) {
//							editable = "nme";
//						}
//						isnull = "n";
//					} else if (x == "isParallelInput") {
//						keyname = "并行输入";
//						if (!(this.owner instanceof ReleasedWfProcess)) {
//							editable = "pin";
//						}
//						isnull = "n";
//					} else if (x == "isParallelOutput") {
//						keyname = "并行输出";
//						if (!(this.owner instanceof ReleasedWfProcess)) {
//							editable = "pout";
//						}
//						isnull = "n";
//					} else if (x == "description") {
//						keyname = "任务简介";
//						if (!(this.owner instanceof ReleasedWfProcess)) {
//							editable = "desc";
//						}
//						isnull = "y";
//					} else if (x == "lastupdate") {
//						keyname = "最后更新";
//						editable = "-1";
//						isnull = "n";
//					}
//					if (x == "name" || x == "description") {
//						this.setPropertyCell(sheet, x, keyname,
//								obj[x] != null ? Utils.parse(obj[x]) : "",
//								editable, isnull);
//					} else if (x == "isParallelInput"
//							|| x == "isParallelOutput") {
//						this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
//								editable, isnull);
//					} else if (x == "id" || x == "lastupdate") {
//						this.setPropertyCell(sheet, x, keyname, obj[x],
//								editable, isnull);
//					}
//				}
//			}
//			this.setPropertyCell(sheet, "order", "连接执行顺序", " ");
//			var row = sheet.insertRow(-1);
//			var cell1 = row.insertCell(0);
//			cell1.colSpan = "2";
//			cell1.style.padding = 0;
//			cell1.whiteSpace = "nowrap";
//			var cellx = $(cell1).routeOrderEditPanel({
//				id : "RO009",
//				task : obj,
//				currOwner : this.owner,
//			});
//			this.routeorderpane = cellx.data("routeOrderEditPanel");
//		} else if (obj instanceof Transition) {
//			for (x in obj) {
//				if (x == "id" || x == "name" || x == "orderNumber"
//						|| x == "description") {
//					var editable = "-1";
//					var keyname = "";
//					var isnull = "y";
//					if (x == "id") {
//						keyname = "连接标识";
//						editable = "-1";
//						isnull = "n";
//					} else if (x == "name") {
//						keyname = "连接名称";
//						if (!(this.owner instanceof ReleasedWfProcess)) {
//							editable = "nme";
//						}
//						isnull = "n";
//					} else if (x == "orderNumber") {
//						keyname = "连接执行顺序号";
//						editable = "-1";
//						isnull = "n";
//					} else if (x == "description") {
//						keyname = "备注";
//						if (!(this.owner instanceof ReleasedWfProcess)) {
//							editable = "desc";
//						}
//						isnull = "y";
//					}
//					if (x == "id" || x == "orderNumber") {
//						this.setPropertyCell(sheet, x, keyname, obj[x],
//								editable, isnull);
//					} else if (x == "name" || x == "description") {
//						this.setPropertyCell(sheet, x, keyname,
//								obj[x] != null ? Utils.parse(obj[x]) : "",
//								editable, isnull);
//					}
//				}
//			}
//		} else if (obj instanceof ReleasedWfProcess) {
//			for (x in obj) {
//				if (x == "id" || x == "name" || x == "code"
//						|| x == "workflowType" || x == "processType"
//						|| x == "accessLevel" || x == "lastupdate"
//						|| x == "author" || x == "parent" || x == "keywords"
//						|| x == "owner" || x == "purchasePrice"
//						|| x == "usagePrice" || x == "description"
//						|| x == "version" || x == "releaser"
//						|| x == "releaseStatement" || x == "releaseDate"
//						|| x == "deprecated" || x == "likeCounting"
//						|| x == "totalUseCounting" || x == "successCounting"
//						|| x == "terminationCounting"
//						|| x == "suspensionCounting" || x == "trialPeriod"
//						|| x == "totalDownloading") {
//					var editable = "-1";
//					var keyname = "";
//					var isnull = "y";
//					if (x == "id") {
//						keyname = "流程标识";
//						isnull = "n";
//					} else if (x == "code") {
//						keyname = "流程编码";
//						isnull = "n";
//					} else if (x == "name") {
//						keyname = "流程名称";
//						isnull = "n";
//					} else if (x == "processType") {
//						keyname = "业务类型";
//						isnull = "n";
//					} else if (x == "workflowType") {
//						keyname = "工作流类型";
//						isnull = "n";
//					} else if (x == "accessLevel") {
//						keyname = "密级";
//						isnull = "n";
//					} else if (x == "description") {
//						keyname = "流程简介";
//						isnull = "y";
//					} else if (x == "keywords") {
//						keyname = "关键字";
//						isnull = "n";
//					} else if (x == "author") {
//						keyname = "创建人";
//						isnull = "n";
//					} else if (x == "purchasePrice") {
//						keyname = "销售价（￥）";
//						editable = "pp";
//						isnull = "n";
//					} else if (x == "usagePrice") {
//						keyname = "租用价（￥）";
//						editable = "up";
//						isnull = "n";
//					} else if (x == "lastupdate") {
//						keyname = "最后更新";
//						isnull = "n";
//					} else if (x == "parent") {
//						keyname = "文件夹";
//						isnull = "n";
//					} else if (x == "owner") {
//						keyname = "所有人";
//						isnull = "n";
//					} else if (x == "version") {
//						keyname = "版本";
//						editable = "nme";
//						isnull = "n";
//					} else if (x == "releaser") {
//						keyname = "发布人";
//						editable = "nme";
//						isnull = "n";
//					} else if (x == "releaseStatement") {
//						keyname = "发布声明";
//						editable = "state";
//						isnull = "n";
//					} else if (x == "releaseDate") {
//						keyname = "发布日期";
//						editable = "-1";
//						isnull = "n";
//					} else if (x == "deprecated") {
//						keyname = "是否下架";
//						editable = "-1";
//						isnull = "n";
//					} else if (x == "likeCounting") {
//						keyname = "点赞人数";
//						isnull = "n";
//					} else if (x == "totalDownloading") {
//						keyname = "下载总计";
//						isnull = "n";
//					} else if (x == "totalUseCounting") {
//						keyname = "使用总计";
//						isnull = "n";
//					} else if (x == "successCounting") {
//						keyname = "成功总计";
//						isnull = "n";
//					} else if (x == "terminationCounting") {
//						keyname = "终止总计";
//						isnull = "n";
//					} else if (x == "suspensionCounting") {
//						keyname = "暂停总计";
//						isnull = "n";
//					} else if (x == "trialPeriod") {
//						keyname = "试用期";
//						editable = "tri";
//						isnull = "n";
//					}
//					if (x == "name" || x == "author" || x == "keywords"
//							|| x == "description") {
//						this.setPropertyCell(sheet, x, keyname,
//								obj[x] != null ? Utils.parse(obj[x]) : "",
//								editable, isnull);
//					} else if (x == "processType") {
//						this.setPropertyCell(sheet, x, keyname,
//								processtype[obj[x]], editable, isnull);
//					} else if (x == "workflowType") {
//						this.setPropertyCell(sheet, x, keyname,
//								workflowtype[obj[x]], editable, isnull);
//					} else if (x == "accessLevel") {
//						this.setPropertyCell(sheet, x, keyname,
//								accesstype[obj[x]], editable, isnull);
//					} else if (x == "trialPeriod") {
//						this.setPropertyCell(sheet, x, keyname,
//								trialperiod[obj[x]], editable, isnull);
//					} else if (x == "deprecated") {
//						this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
//								editable, isnull);
//					} else if (x == "parent") {
//						var p = $('#treeview').jstree('get_node', obj[x]);
//						this.setPropertyCell(sheet, x, keyname, p.text,
//								editable, isnull);
//					} else if (x == "owner") {
//						var p = $('#treeview').jstree('get_node', obj[x]);
//						this.setPropertyCell(sheet, x, keyname, p.text,
//								editable, isnull);
//					} else {
//						this.setPropertyCell(sheet, x, keyname, obj[x],
//								editable, isnull);
//					}
//				}
//			}
//		}
	};

	BasicPropertySheet.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	BasicPropertySheet.prototype.setPropertyCell = function(table, key,
			keydesc, keyvalue, editable, isnull) {
		var row = table.insertRow(-1);
		row.addEventListener("click", this, false);
		row.addEventListener("dblclick", this, false);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		$(cell1).text(keydesc);
		cell1.setAttribute("nowrap", "true");
		cell1.setAttribute("key", key);
		cell1.setAttribute("type", "h");
		$(cell2).text(keyvalue);
		cell2.setAttribute("key", key);
		cell2.setAttribute("type", editable);
		cell2.setAttribute("null", isnull);
	};

	BasicPropertySheet.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.propertysheet.focus();
			this.startToEdit(evt.target);
		}
	};

	BasicPropertySheet.prototype.startToEdit = function(tag) {
		var t = tag.getAttribute("type");
//		if (t == "nme") {
//			this.editor1.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.owner);
//		} else if (t == "pnme") {
//			this.editor8.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.owner);
//		} else if (t == "desc") {
//			this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), "流程简介字数不宜超过1000字", this.owner);
//		} else if (t == "kw") {
//			this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), "关键字以分号隔开隔开", this.owner);
//		} else if (t == "prctype") {
//			this.editor3.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.owner);
//		} else if (t == "wftype") {
//			this.editor6.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.owner);
//		} else if (t == "acctype") {
//			this.editor4.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.owner);
//		} else if (t == "pin") {
//			this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.entity.isParallelInput,
//					this.owner);
//		} else if (t == "pout") {
//			this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.entity.isParallelOutput,
//					this.owner);
//		} else if (t == "dep") {
//			this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.entity.deprecated,
//					this.owner);
//		} else if (t == "pp") {
//			this.editor7.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.owner);
//		} else if (t == "up") {
//			this.editor7.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.owner);
//		} else if (t == "state") {
//			this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), "发布声明字数不宜超过5000字", this.owner);
//		} else if (t == "tri") {
//			this.editor9.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"), this.owner);
//		}
	};

	BasicPropertySheet.prototype.doClick = function(evt) {
		if (evt.target.tagName == "TD") {
			var table = evt.target.parentElement.parentElement;
			this.clearSelection(table);
			evt.target.parentElement.style.background = "#d1d1e0";
		}
	};

	BasicPropertySheet.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new BasicPropertySheet(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);