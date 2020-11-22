/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "authorityListPane";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		entity : "",
		topparent : "",
		tabid : "",
	};

	var AuthorityListPanel = function(element, options) {
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
		this.tabId = options.tabid;
		this.topparent = options.topparent;
		this.ruleditdialog;
		this.entity = options.entity;
		this.init(options);
	};

	AuthorityListPanel.prototype.init = function(options) {
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
		
		var p2 = $(this.element).eidtAuthorityListDialog({
			id : "editAuth026",
			title : "轩琦科技 - 编辑权限列表",
			parent : this,
			entity : this.entity,
			ownerId : options.ownerId,
		});
		this.eidtAuthorityListDialog = p2.data("eidtAuthorityListDialog");

		this.loading(this.entity);
	};

	AuthorityListPanel.prototype.createNavigationGroup = function(parent) {
		var group1 = this.createGroup(parent);
		this.refreshHButton = this.createTool(group1, "refreshAuth"
				+ this.options.id, "刷新", "btn btn-success btn-sm", "i",
				"fa fa-refresh fa-lg");
		this.enableButton(this.refreshHButton);

		var group = this.createGroup(parent);
		this.editAuthButton = this.createTool(group, "editAuth"
				+ this.options.id, "编辑权限列表", "btn btn-primary btn-sm", "i",
				"fa fa-pencil-square-o fa-lg");
		// fa-lg: 24px; fa-2x ：32px
		if (this.entity.type == "0") {
			this.disableButton(this.editAuthButton);
		} else {
			this.enableButton(this.editAuthButton);
		}
		this.enableButton(this.editAuthButton);
	};

	AuthorityListPanel.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	AuthorityListPanel.prototype.loading = function(entity) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(omservices.api(20, this.options.ownerId), {}).complete(
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

	AuthorityListPanel.prototype.loadData = function(jsonobj) {
		$(this.list).children().remove();
		if (jsonobj.length > 0) {
			for (var i = 0; i < jsonobj.length; i++) {
				var auth = new Authority();
				auth.parseFromJSON(jsonobj[i]);
				var row = this.list.insertRow(-1);
				var cell1 = row.insertCell(0);
				var icon = document.createElement("i");
				icon.style.color = "green";
				if (this.entity.existAuthId(auth.id)) {
					icon.className = "fa fa-circle";
				} else {
					icon.className = "fa fa-circle-thin";
				}
				icon.setAttribute("aria-hidden", "true");
				cell1.appendChild(icon);
				this.createCell(1, Utils.parse(auth.name), row);
				this.createCell(2, Utils.parse(auth.description), row);
			}
			if (jsonobj.length < 30) {
				for (var i = jsonobj.length; i < 30; i++) {
					var row = this.list.insertRow(i);
					for (var j = 0; j < 3; j++) {
						this.createCell(j, "&nbsp;", row);
					}
				}
			}
		} else {
			this.initList();
		}
		this.addHeader();
	};

	AuthorityListPanel.prototype.createTool = function(group, id, title, style,
			fonttag, fontclass) {
		var button = document.createElement("button");
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		group.appendChild(button);
		var icon = document.createElement(fonttag);
		icon.addEventListener('click', this, false);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		button.appendChild(icon);
		return button;
	};

	AuthorityListPanel.prototype.createLabel = function(group, id, title) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.id = id;
		group.appendChild(label);
		return label;
	};

	AuthorityListPanel.prototype.addHeader = function() {
		var header = this.list.createTHead();
		var row = header.insertRow(0);
		this.createHead("", row);
		this.createHead("权限名称", row);
		this.createHead("权限描述", row);
	};

	AuthorityListPanel.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = content;
	};

	AuthorityListPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	AuthorityListPanel.prototype.initList = function() {
		// document.createElement('tbody');
		for (var i = 0; i < 30; i++) {
			var row = this.list.insertRow(i);
			for (var j = 0; j < 3; j++) {
				var cell1 = row.insertCell(j);
				cell1.innerHTML = "&nbsp;";
			}
		}
	};

	AuthorityListPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	AuthorityListPanel.prototype.doClick = function(evt) {
		if (evt.target == this.refreshHButton
				|| (evt.target.id == ("refreshH" + this.options.id))) {
			this.loading(this.entity);
		} else if (evt.target == this.editAuthButton
				|| (evt.target.id == ("editAuth" + this.options.id))) {
			this.eidtAuthorityListDialog.show();
		}
	};

	AuthorityListPanel.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	AuthorityListPanel.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new AuthorityListPanel(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);