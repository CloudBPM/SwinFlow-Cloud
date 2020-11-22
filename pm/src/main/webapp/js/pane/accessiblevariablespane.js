/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "accessibleVariablesPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var AccessibleVariablesPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = options.entity;
		this.init(options);
	};

	AccessibleVariablesPanel.prototype.loadPane = function(entity) {
		this.entity = entity;
		this.init(this.options);
	};

	AccessibleVariablesPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		this.element.appendChild(modalframe);

		var tableDiv = document.createElement("DIV");
		modalframe.appendChild(tableDiv);
		tableDiv.id = "tablediv" + options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = (parseInt(options.topparent.style.height) - 44)
				+ "px";// 82
		this.variablelist = document.createElement("table");
		this.variablelist.className = "table table-striped table-hover";
		tableDiv.appendChild(this.variablelist);

		var plugin = $(this.element).accessibleVaiableEditDialog({
			id : "pm091",
			title : "轩琦科技 - 可访问变量编辑",
			parent : this,
			currowner :this.options.currowner,
		});
		this.accessibleVaiableEditDialog = plugin
				.data("accessibleVaiableEditDialog");

		this.loadData(this.entity);
	};

	AccessibleVariablesPanel.prototype.loadData = function(entity) {
		this.accessibleVaiableEditDialog.loadData(entity);
		var objs = entity.accessibleVars;
		$(this.variablelist).children().remove();
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				var row = this.variablelist.insertRow(-1);
				var v = this.options.currowner.seekChildByID(objs[i].varId);
				this.createCell(0, v.name, row);
				this.createCell(1, Utils.toDataType(v.datatype), row);
				this.createCell(2, acsctrl[objs[i].accessControl], row);
			}
			if (objs.length < 30) {
				for (var i = objs.length; i < 30; i++) {
					var row = this.variablelist.insertRow(i);
					for (var j = 0; j < 3; j++) {
						this.createCell(j, "", row);
					}
				}
			}
		} else {
			this.initVariableList();
		}
		this.addHeader();
		if (this.options.currowner instanceof WfProcess) {
			if (objs.length > 0) {
				this.options.parent.disabledAddButton();
				this.options.parent.enableModifyButton();
			} else {
				this.options.parent.enableAddButton();
				this.options.parent.disabledModifyButton();
			}
		}
	};

	AccessibleVariablesPanel.prototype.addHeader = function() {
		var header = this.variablelist.createTHead();
		var row = header.insertRow(0);
		this.createHead("变量名", row);
		this.createHead("数据类型", row);
		this.createHead("访问控制", row);
	};

	AccessibleVariablesPanel.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		if (content == "") {
			cell.innerHTML = "&nbsp;";
		} else {
			$(cell).text(content);
		}
	};

	AccessibleVariablesPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	AccessibleVariablesPanel.prototype.initVariableList = function() {
		// document.createElement('tbody');
		for (var i = 0; i < 30; i++) {
			var row = this.variablelist.insertRow(i);
			for (var j = 0; j < 3; j++) {
				this.createCell(j, "", row);
			}
		}
	};

	AccessibleVariablesPanel.prototype.addRow = function(evt) {
		this.accessibleVaiableEditDialog.show();
	};

	AccessibleVariablesPanel.prototype.modifyRow = function(evt) {
		this.accessibleVaiableEditDialog.show();
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new AccessibleVariablesPanel(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);