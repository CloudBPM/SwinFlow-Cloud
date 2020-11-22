/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "omStaffEditor";
	var defaults = {
		id : "",
		ownerId : "",
		basicpropsheet : "",
		propsheet : "",
		width : 0,
		height : 0,
		parent : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			basicpropsheet : "",
			propsheet : "",
			width : 0,
			height : 0,
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.init(options);
	};

	Editor.prototype.init = function(options) {
		var p1 = $(this.element).readonlyTableViewer({
			id : options.id,
			ownerId : options.ownerId,
			basicpropsheet : options.basicpropsheet,
			propsheet : options.propsheet,
			width : options.width,
			height : options.height,
			parent : this,
			type : "ext",
		});
		this.listViewPane = p1.data("readonlyTableViewer");
		this.listViewPane.init();
		this.listViewPane.createToolbar();
		this.listViewPane.headersize = 9;
		this.listViewPane.loading(1, this.listViewPane.pagesize, "",
				options.ownerId);

		var p4 = $(this.element).newStaffDetailsDialog({
			id : "025",
			title : vendor + " - 编辑职员信息",
			parent : this,
			ownerId : options.ownerId,
		});
		this.newStaffDetailsDialog = p4.data("newStaffDetailsDialog");

		var p4 = $(this.element).searchIdNumberDialog({
			id : "024",
			title : vendor + " - 搜索职员证件号",
			parent : this,
			ownerId : options.ownerId,
			newstaffdlg : this.newStaffDetailsDialog,
		});
		this.searchIdNumberDialog = p4.data("searchIdNumberDialog");

		// var p5 = $(this.element).importNormalStaffDialog({
		// 	id : "027",
		// 	title : vendor + " - 批量添加新职员",
		// 	parent : this,
		// 	ownerId : options.ownerId,
		// });
		// this.importNormalStaffDialog = p4.data("importNormalStaffDialog");

		var p2 = $(this.element).confirmInfoDialog({
			id : "026",
			title : vendor + " - 提示",
			parent : this,
		});
		this.confirmInfoDialog = p2.data("confirmInfoDialog");

		var p3 = $(this.element).errorMessageDialog({
			id : "027",
			title : vendor + " - 提示",
			parent : this,
		});
		this.errorMessageDialog = p3.data("errorMessageDialog");

	};

	Editor.prototype.addExtraButtons = function(parent) {
		var group = this.createGroup(parent);
		this.createEditGroup(group);
		var group1 = this.createGroup(parent);
		this.createNormalGroup(group1);
	};

	Editor.prototype.createEditGroup = function(parent) {
		var group = this.createGroup(parent);
		this.addUserButton = this.createTool(group, "adduserS"
				+ this.options.id, "添加新职员", "btn btn-success", "i",
				"fa fa-user-plus fa-lg");
	};

	Editor.prototype.createNormalGroup = function(parent) {
		var group = this.createGroup(parent);
		this.importNormalUserButton = this.createTool(group,
				"importnormaluserS" + this.options.id, "一般员工批量添加",
				"btn btn-default", "i", "fa fa-users");
	};

	Editor.prototype.loading = function(pageno, pagesize, condition, ownerid) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(11, this.options.ownerId), {
			cond : condition,
			ownid : ownerid,
			pn : pageno,
			psz : pagesize,
		}).complete(function(data) {
			that.listViewPane.loadData(data.responseJSON);
			that.listViewPane.setPropertySheet();
			$("#progressbar").hide();
		});
	};

	Editor.prototype.createCells = function(obj) {
		var staff = new Staff();
		staff.parseFromJSON(obj, this.options.ownerId);
		this.listViewPane.objects.push(staff);
		var row = this.listViewPane.tableList.insertRow(-1);
		row.setAttribute("key", staff.id);
		row.addEventListener("click", this, false);
		row.addEventListener("dblclick", this, false);

		this.listViewPane.createCell(0, staff.user.name, row);
		this.listViewPane.createCell(1, Utils.parse(staff.user.fullName), row);
		this.listViewPane.createCell(2, staff.user.mobile, row);
		this.listViewPane.createCell(3, staff.workPhoneNumber, row);
		this.listViewPane.createCell(4, staff.workEmail, row);
		this.listViewPane.createCell(5, Utils.parse(staff.officeLocation), row);
		this.listViewPane.createCell(6, workstatus[staff.workStatus], row);
		this.listViewPane.createCell(7, jobstatus[staff.jobStatus], row);

		var cell = this.listViewPane.createCell(8, null, row);
		var b0 = this.createIcon(cell, staff.id, "4", "fa fa-pencil-square-o fa-lg",
				"edit", "编辑", "btn-primary");
	};

	Editor.prototype.createHeaders = function(row) {
		this.listViewPane.createHead("账号", row);
		this.listViewPane.createHead("姓名", row);
		this.listViewPane.createHead("手机", row);
		this.listViewPane.createHead("办公电话", row);
		this.listViewPane.createHead("办公邮件", row);
		this.listViewPane.createHead("办公位置", row);
		this.listViewPane.createHead("当前状态", row);
		this.listViewPane.createHead("在职状态", row);
		this.listViewPane.createHead("操作", row);
	};

	Editor.prototype.createIcon = function(parent, id, num, classname, name,
			title, style) {
		var button = document.createElement("BUTTON");
		parent.appendChild(button);
		button.id = name + id + num;
		button.className = "btn btn-default " + style;
		button.style.borderRadius = "15px";
		button.style.width = "29px";
		button.style.padding = "3px";
		button.title = title;
		button.name = name;
		var that = this;
		button.addEventListener("click", function(evt) {
			var key = this.parentElement.parentElement.getAttribute("key");
			var c = that.listViewPane.getObjectById(key);
			if (this.name == "edit") {
				that.newStaffDetailsDialog.loadData(c);
				that.newStaffDetailsDialog.show();
			}
			Utils.stopBubble(evt);
		});
		var rmspan = document.createElement("SPAN");
		button.appendChild(rmspan);
		rmspan.className = classname;
		rmspan.name = name;
		rmspan.setAttribute("aria-hidden", "true");
		rmspan.setAttribute("data-toggle", "modal");
		rmspan.setAttribute("data-target", "myModal");
		rmspan.title = title;
		rmspan.id = id + "i";
		return button;
	};

	Editor.prototype.handleEvent = function(e) {
		this.listViewPane.handleEvent(e);
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
		Utils.stopBubble(e);
	};

	Editor.prototype.setPropertySheet = function(obj) {
		this.listViewPane.setPropertySheet();
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.addUserButton
				|| (evt.target.id == ("adduserS" + this.options.id))) {
			this.searchIdNumberDialog.show();
		} else if (evt.target == this.importNormalUserButton
				|| (evt.target.id == ("importnormaluserS" + this.options.id))) {
			//this.importNormalStaffDialog.show();
		}
	};

	Editor.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	Editor.prototype.createTool = function(group, id, title, style, fonttag,
			fontclass) {
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

	Editor.prototype.showImportResults = function(data) {
		this.errorMessageDialog.show(data);
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Editor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);
