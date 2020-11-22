/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "participantSettingPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var ParticipantSettingPanel = function(element, options) {
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

	ParticipantSettingPanel.prototype.init = function(options) {
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
		this.participantlist = document.createElement("table");
		this.participantlist.className = "table table-striped table-hover";
		tableDiv.appendChild(this.participantlist);

		var plugin = $(this.element).participantEditDialog({
			id : "pm091",
			title : "轩琦科技 - 安排办理人或办理岗位",
			parent : this,
			entity : this.entity,
			currowner : options.currowner,
		});
		this.participantEditDialog = plugin.data("participantEditDialog");

		this.loadData(this.entity);
	};

	ParticipantSettingPanel.prototype.loadData = function(entity) {
		var objs = entity.participants;
		$(this.participantlist).children().remove();
		if (objs != null && objs.length > 0) {
			for (var i = 0; i < objs.length; i++) {
				var row = this.participantlist.insertRow(-1);
				if (objs[i].participationType == 1) {
					this.createCell(0, "流程发起者（创建人）", row);
					this.createCell(1, "", row);
					this.createCell(2, priority[objs[i].priority], row);
					this.createCell(3, "", row);
					this.createCell(4, "", row);
				} else if (objs[i].participationType == 0) {
					this.createCell(0, "", row);
					this.createCell(1, objs[i].positionName, row);
					this.createCell(2, priority[objs[i].priority], row);
					this.createCell(3, objs[i].departmentName, row);
					this.createCell(4, objs[i].organizationName, row);
				}
			}
			if (objs.length < 30) {
				for (var i = objs.length; i < 30; i++) {
					var row = this.participantlist.insertRow(i);
					for (var j = 0; j < 5; j++) {
						this.createCell(j, "", row);
					}
				}
			}
		} else {
			this.initParticipantList();
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

	ParticipantSettingPanel.prototype.addHeader = function() {
		var header = this.participantlist.createTHead();
		var row = header.insertRow(0);
		this.createHead("办理人", row);
		this.createHead("办理岗位", row);
		this.createHead("办理优先级", row);
		this.createHead("所在部门", row);
		this.createHead("政府企事业单位", row);
	};

	ParticipantSettingPanel.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		if (content == "") {
			cell.innerHTML = "&nbsp;";
		} else {
			$(cell).text(content);
		}
	};

	ParticipantSettingPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	ParticipantSettingPanel.prototype.initParticipantList = function() {
		// document.createElement('tbody');
		for (var i = 0; i < 30; i++) {
			var row = this.participantlist.insertRow(i);
			for (var j = 0; j < 5; j++) {
				this.createCell(j, "", row);
			}
		}
	};

	ParticipantSettingPanel.prototype.addRow = function(evt) {
		this.participantEditDialog.show();
	};

	ParticipantSettingPanel.prototype.modifyRow = function(evt) {
		this.participantEditDialog.show();
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ParticipantSettingPanel(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);