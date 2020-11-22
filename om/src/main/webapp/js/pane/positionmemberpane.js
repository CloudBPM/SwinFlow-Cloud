/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "jobAssignmentPane";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		entity : "",
		topparent : "",
		tabid : "",
	};

	var PositionMemberPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			parent : "",
			entity : "",
			topparent : "",
			tabid : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent = options.topparent;
		this.tabId = options.tabid;
		this.entity = options.entity;
		this.init(options);
	};

	PositionMemberPanel.prototype.init = function(options) {
		this.entity = options.entity;
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var toolbarForm = document.createElement("form");
		toolbarForm.className = "form-inline";
		modalframe.appendChild(toolbarForm);

		var toolbarDiv = document.createElement("DIV");
		toolbarForm.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		toolbarDiv.style.padding = "2px";
		this.createEditGroup(toolbarDiv);
		this.createNavigationGroup(toolbarDiv);

		var tableDiv = document.createElement("DIV");
		modalframe.appendChild(tableDiv);
		tableDiv.id = "tablediv" + options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = (parseInt(options.topparent.style.height) - 82)
				+ "px";

		this.list = document.createElement("table");
		this.list.className = "table table-striped table-hover";
		tableDiv.appendChild(this.list);

		var p2 = $(this.element).editJobAssignmentDialog({
			id : "editJA028",
			title : "轩琦科技 - 更新职员列表",
			parent : this,
			entity : this.entity,
			ownerId : this.options.ownerId,
		});
		this.editJobAssignmentDialog = p2.data("editJobAssignmentDialog");

		this.loading(this.entity, 1, 30, "");
	};

	PositionMemberPanel.prototype.createNavigationGroup = function(parent) {
		var group1 = this.createGroup(parent);
		this.refreshHButton = this.createTool(group1, "refreshGM"
				+ this.options.id, "刷新", "btn btn-success btn-sm", "i",
				"fa fa-refresh fa-lg");
		this.enableButton(this.refreshHButton);
		// delete all multiple page navigation button on 20160916 15:21
	};

	PositionMemberPanel.prototype.createEditGroup = function(parent) {
		var group = this.createGroup(parent);
		this.addUserButton = this.createTool(group, "adduserGM"
				+ this.options.id, "添加新职员到该职位", "btn btn-success btn-sm", "i",
				"fa fa-user-plus fa-lg");
		var group1 = this.createGroup(parent);
		this.editUserButton = this.createTool(group1, "edituserGM"
				+ this.options.id, "编辑该职位职员", "btn btn-primary btn-sm", "i",
				"fa fa-pencil-square-o fa-lg");
		// fa-lg: 24px; fa-2x ：32px
		this.enableButton(this.addUserButton);
	};

	PositionMemberPanel.prototype.crateSGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	PositionMemberPanel.prototype.doClick = function(evt) {
		if (evt.target == this.refreshHButton
				|| (evt.target.id == ("refreshGM" + this.options.id))) {
			this.loading(this.entity)
		} else if (evt.target == this.addUserButton
				|| (evt.target.id == ("adduserGM" + this.options.id))) {
			this.editJobAssignmentDialog.show();
		} else if (evt.target == this.editUserButton
				|| (evt.target.id == ("edituserGM" + this.options.id))) {
			this.editJobAssignmentDialog.show();
		}
	};

	PositionMemberPanel.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	PositionMemberPanel.prototype.loading = function(entity) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(omservices.api(23, this.options.ownerId), {
			positionid : entity.id,
			owner : entity.owner,
		}).complete(
				function(data) {
					data = data.responseJSON;
					if (data.status != null && data.status != ""
							&& data.status != undefined) {
						if (data.status == 0 || data.status == -10) {
							messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
							return;
						}
					}
					that.loadData(data);

					$("#progressbar").hide();
				});
	};

	PositionMemberPanel.prototype.loadData = function(jsonobj) {
		$(this.list).children().remove();
		if (jsonobj != null && jsonobj.length > 0) {
			for (var i = 0; i < jsonobj.length; i++) {
				var jobassignment = new JobAssignment();
				jobassignment.parseFromJSON(jsonobj[i]);
				var row = this.list.insertRow(-1);
				this.createCell(0, jobassignment.staffCode, row);
				this.createCell(1, jobassignment.userName, row);
				this.createCell(2, jobassignment.staffFullName, row);
				this.createCell(3, Utils.getDateTime(new Date(jobassignment.onJobDate).getTime()), row);
			}
			if (jsonobj.length < 10) {
				for (var i = jsonobj.length; i < 10; i++) {
					var row = this.list.insertRow(i);
					for (var j = 0; j < 4; j++) {
						this.createCell(j, "&nbsp;", row);
					}
				}
			}
		} else {
			this.initList();
		}
		this.addHeader();
	};

	PositionMemberPanel.prototype.createTool = function(group, id, title,
			style, fonttag, fontclass) {
		var button = document.createElement("button");
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		group.appendChild(button);
		var icon = document.createElement(fonttag);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		button.appendChild(icon);
		return button;
	};

	PositionMemberPanel.prototype.addHeader = function() {
		var header = this.list.createTHead();
		var row = header.insertRow(0);
		this.createHead("职员编号", row);
		this.createHead("用户账号", row);
		this.createHead("用户姓名", row);
		this.createHead("入职日期", row);
	};

	PositionMemberPanel.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = content;
	};

	PositionMemberPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	PositionMemberPanel.prototype.initList = function() {
		// document.createElement('tbody');
		for (var i = 0; i < 10; i++) {
			var row = this.list.insertRow(i);
			for (var j = 0; j < 4; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
	};

	PositionMemberPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	PositionMemberPanel.prototype.doDblClick = function(evt) {
	};

	PositionMemberPanel.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	PositionMemberPanel.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$
						.data(this, pluginName, new PositionMemberPanel(this,
								options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);