/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "smsReceversSettingPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var MSGReceversSettingPanel = function(element, options) {
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
		this.topparent = options.topparent;
		this.entity = options.entity;
		this.init(options);
	};

	MSGReceversSettingPanel.prototype.init = function(options) {
		this.entity = options.entity;
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
		this.receiverlist = document.createElement("table");
		this.receiverlist.className = "table table-striped table-hover";
		tableDiv.appendChild(this.receiverlist);

		var plugin = $(this.element).receiverEditDialog({
			id : "pm092",
			title : "轩琦科技 - 设置接收人",
			parent : this,
			msgtype : 0, // SMS
			entity : this.entity,
			currowner : options.currowner,
		});
		this.receiverEditDialog = plugin.data("receiverEditDialog");

		this.loadData(this.entity);
	};

	MSGReceversSettingPanel.prototype.loadData = function(entity) {
		var objs = entity.receivers;
		$(this.receiverlist).children().remove();
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				var row = this.receiverlist.insertRow(-1);
				if (objs[i].receiverType == 0) {
					this.createCell(0, "业务发起人", row);
					this.createCell(1, "", row);
					this.createCell(2, "", row);
					this.createCell(3, "", row);
				} else if (objs[i].receiverType == 1) {
					this.createCell(0, "所有本单位职员", row);
					this.createCell(1, "", row);
					this.createCell(2, "", row);
					this.createCell(3, "", row);
				} else if (objs[i].receiverType == 2) {
					this.createCell(0, "本单位及所有相关单位的所有职员", row);
					this.createCell(1, "", row);
					this.createCell(2, "", row);
					this.createCell(3, "", row);
				} else if (objs[i].receiverType == 3) {
					this.createCell(0, "", row);
					this.createCell(1, objs[i].positionName, row);
					this.createCell(2, objs[i].departmentName, row);
					this.createCell(3, objs[i].organizationName, row);
				}
			}
			if (objs.length < 30) {
				for (var i = objs.length; i < 30; i++) {
					var row = this.receiverlist.insertRow(i);
					for (var j = 0; j < 4; j++) {
						this.createCell(j, "", row);
					}
				}
			}
		} else {
			this.initreceiverlist();
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

	MSGReceversSettingPanel.prototype.addHeader = function() {
		var header = this.receiverlist.createTHead();
		var row = header.insertRow(0);
		this.createHead("短信接收人", row);
		this.createHead("接收人职位", row);
		this.createHead("所在部门", row);
		this.createHead("所在单位", row);
	};

	MSGReceversSettingPanel.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		if (content == "") {
			cell.innerHTML = "&nbsp;";
		} else {
			$(cell).text(content);
		}
	};

	MSGReceversSettingPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	MSGReceversSettingPanel.prototype.initreceiverlist = function() {
		// document.createElement('tbody');
		for (var i = 0; i < 30; i++) {
			var row = this.receiverlist.insertRow(i);
			for (var j = 0; j < 4; j++) {
				this.createCell(j, "", row);
			}
		}
	};

	MSGReceversSettingPanel.prototype.addRow = function(evt) {
		this.receiverEditDialog.show();
	};

	MSGReceversSettingPanel.prototype.modifyRow = function(evt) {
		this.receiverEditDialog.show();
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new MSGReceversSettingPanel(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);