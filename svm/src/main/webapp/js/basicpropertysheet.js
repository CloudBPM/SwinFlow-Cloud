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
		var p3 = $(options.topparent).messageDialog({
			id : "016",
			title : "云BPM - 提示",
			parent : this,
		});
		this.messageDialog = p3.data("messageDialog");

		// var plugin1 = $(this.propertysheet).textCellEditor({
		// parent : this,
		// msg : this.messageDialog,
		// });
		// this.editor1 = plugin1.data("textCellEditor");
		//
		// var plugin2 = $(this.propertysheet).textareaCellEditor({
		// parent : this,
		// msg : this.messageDialog,
		// });
		// this.editor2 = plugin2.data("textareaCellEditor");
		//
		// var plugin3 = $(this.propertysheet).processTypeSelectCellEditor({
		// parent : this,
		// msg : this.messageDialog,
		// });
		// this.editor3 = plugin3.data("processTypeSelectCellEditor");
		//
		// var plugin4 = $(this.propertysheet).accessTypeSelectCellEditor({
		// parent : this,
		// msg : this.messageDialog,
		// });
		// this.editor4 = plugin4.data("accessTypeSelectCellEditor");
		//
		// var plugin5 = $(this.propertysheet).yesnoCellEditor({
		// parent : this,
		// msg : this.messageDialog,
		// });
		// this.editor5 = plugin5.data("yesnoCellEditor");
		//
		// var plugin6 = $(this.propertysheet).workflowTypeSelectCellEditor({
		// parent : this,
		// msg : this.messageDialog,
		// });
		// this.editor6 = plugin6.data("priceCellEditor");
		//
		// var plugin7 = $(this.propertysheet).priceCellEditor({
		// parent : this,
		// msg : this.messageDialog,
		// });
		// this.editor7 = plugin7.data("priceCellEditor");
		//
		// var plugin8 = $(this.propertysheet).processNameCellEditor({
		// parent : this,
		// msg : this.messageDialog,
		// });
		// this.editor8 = plugin8.data("processNameCellEditor");
		//
		// var plugin9 = $(this.propertysheet).trialPeriodSelectCellEditor({
		// parent : this,
		// msg : this.messageDialog,
		// });
		// this.editor9 = plugin9.data("trialPeriodSelectCellEditor");
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
		if (obj instanceof ServerInfoDescriptor) {
			for (x in obj) {
				if (x == "name" || x == "status" || x == "serverDatetime"
						|| x == "os" || x == "processors"
						|| x == "totalPhysicalMemory"
						|| x == "freePhysicalMemory"
						|| x == "usedPhysicalMemory" || x == "ipv4"
						|| x == "ipv6" || x == "acceptable" || x == "jdkName"
						|| x == "totalJVMMemory" || x == "freeJVMMemory"
						|| x == "maxJVMMemory" || x == "totalThreads"
						|| x == "peakThreads" || x == "activeThreads"
						|| x == "demonThreads" || x == "mwName"
						|| x == "mwPort") {
					var editable = "-1";
					var keyname = "";
					var isnull = "n";
					if (x == "name") {
						keyname = "服务器机器名";
						editable = "svrname";
						isnull = "n";
					} else if (x == "status") {
						keyname = "状态";
						editable = "svrstatus";
						isnull = "n";
					} else if (x == "serverDatetime") {
						keyname = "服务器时间";
						editable = "svrtime";
						isnull = "n";
					} else if (x == "os") {
						keyname = "操作系统";
						editable = "svros";
						isnull = "n";
					} else if (x == "processors") {
						keyname = "处理器";
						editable = "svrproc";
						isnull = "n";
					} else if (x == "totalPhysicalMemory") {
						keyname = "内存";
						editable = "svrmem";
						isnull = "n";
					} else if (x == "freePhysicalMemory") {
						keyname = "剩余内存";
						editable = "svrfmem";
						isnull = "n";
					} else if (x == "usedPhysicalMemory") {
						keyname = "已用内存";
						editable = "svrumem";
						isnull = "n";
					} else if (x == "ipv4") {
						keyname = "IP v4";
						editable = "svrip4";
						isnull = "n";
					} else if (x == "ipv6") {
						keyname = "IP v6";
						editable = "svrip6";
						isnull = "n";
					} else if (x == "acceptable") {
						keyname = "是否可接受请求";
						editable = "svraccp";
						isnull = "n";
					} else if (x == "jdkName") {
						keyname = "JDK";
						editable = "jdkname";
						isnull = "n";
					} else if (x == "totalJVMMemory") {
						keyname = "JDK内存";
						editable = "jdkmem";
						isnull = "n";
					} else if (x == "freeJVMMemory") {
						keyname = "JDK剩余内存";
						editable = "jdkfmem";
						isnull = "n";
					} else if (x == "maxJVMMemory") {
						keyname = "JDK最大内存";
						editable = "jdkmmem";
						isnull = "n";
					} else if (x == "totalThreads") {
						keyname = "Java总线程";
						editable = "jdkthread";
						isnull = "n";
					} else if (x == "peakThreads") {
						keyname = "Java峰值线程";
						editable = "jdkpthread";
						isnull = "n";
					} else if (x == "activeThreads") {
						keyname = "Java活动线程";
						editable = "jdkathread";
						isnull = "n";
					} else if (x == "demonThreads") {
						keyname = "Java守护线程";
						editable = "jdkdthread";
						isnull = "n";
					} else if (x == "mwName") {
						keyname = "中间件";
						editable = "mwname";
						isnull = "n";
					} else if (x == "mwPort") {
						keyname = "访问端口";
						editable = "mwport";
						isnull = "n";
					}
					if (x == "acceptable") {
						this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
								editable, isnull);
					} else if (x == "totalPhysicalMemory"
							|| x == "freePhysicalMemory"
							|| x == "usedPhysicalMemory"
							|| x == "totalJVMMemory" || x == "freeJVMMemory"
							|| x == "maxJVMMemory") {
						this.setPropertyCell(sheet, x, keyname, Utils.formatBytes(obj[x], 2), editable, isnull);
					} else {
						this.setPropertyCell(sheet, x, keyname, obj[x],
								editable, isnull);
					}
				}
			}
		}
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