/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "systemHelpViewEditor";
	var defaults = {
		id : "",
		uid : "",
		owner : "",
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
			uid : "",
			owner : "",
			basicpropsheet : "",
			propsheet : "",
			width : 0,
			height : 0,
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.knowledges = [];
		this.knowledge = new KnowledgePage();
		this.stack = new CommandStack();
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.init(options);
	};

	Editor.prototype.init = function(options) {
		// basic property sheet plugin
		var p1 = $(this.element).readonlyTableViewer({
			id : options.id,
			ownerId : options.owner,
			basicpropsheet : options.basicpropsheet,
			propsheet : options.propsheet,
			width : options.width,
			height : options.height,
			parent : this,
			type : "ext",
		});
		this.listViewPane = p1.data("readonlyTableViewer");
		this.listViewPane.init();
		this.listViewPane.pagesize = 10;		
		this.listViewPane.createToolbar();
		this.listViewPane.headersize = 6;
		this.listViewPane.loading(1, this.listViewPane.pagesize, "*");

		var p2 = $(this.element).createHelpDialog({
			id : "ndlg" + options.id,
			title : "轩琦科技 - 新增系统帮助",
			parent : this,
			uid : options.uid,
			ownerId : options.owner,
		});
		this.noticeDlg = p2.data("createHelpDialog");

	};

	Editor.prototype.loading = function(pageno, pagesize, condition) { // 获取新闻列表
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api("37"), {
			pn : pageno,
			psz : pagesize,
			cond : condition,
			newsState : this.newsStatus, // 查询所有符合状态的新闻
		}).complete(function(data) {
			that.listViewPane.loadData(data.responseJSON);
			that.setPropertySheet();
			$("#progressbar").hide();
		});
	};

	Editor.prototype.addExtraButtons = function(p) {
		var group = this.createGroup(p);
		this.addNew = this.createTool(group, "addNewNotice" + this.options.id,
				"发布新系统帮助", "btn btn-success", "i", "fa fa-plus fa-lg");
	};

	Editor.prototype.createCells = function(obj) {
		if (obj == null)
			return;
		 var p = new KnowledgePage();
		 p.parseFromJSON(obj);
		 this.listViewPane.objects.push(p);
		 var row = this.listViewPane.tableList.insertRow(-1);
		 row.setAttribute("key", p.id);
		 row.addEventListener("click", this.listViewPane, false);
		 row.addEventListener("dblclick", this.listViewPane, false);
		 this.listViewPane.createCell(0, Utils.parse(p.industryName), row);
		 this.listViewPane.createCell(1, Utils.parse(p.industryContent), row);
		 this.listViewPane.createCell(2, Utils.getDateTime(p.recordingTime),
		 row);
		 this.listViewPane.createCell(3, Utils.parse(p.industryType), row);
		 this.listViewPane.createCell(4, Utils.parse(p.industryUser), row);
		 var cell = this.listViewPane.createCell(5, "", row);
		 var b3 = this.createIcon(cell, p.id, "fa fa-trash-o fa-lg", "delete",
		 "删除", "btn-danger", this);
	};

	Editor.prototype.buttonSelected = function(live, b1, b2) {
		if (live == 0) {
			b1.classList.remove("active");
			b1.disabled = false;
			b2.classList.add("active");
			b2.disabled = true;
		} else if (live == 1) {
			b1.classList.add("active");
			b1.disabled = true;
			b2.classList.remove("active");
			b2.disabled = false;
		}
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
		Utils.stopBubble(e);
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.addNew
				|| (evt.target.id == ("addNewNotice" + this.options.id))) {
			this.noticeDlg.show();
		}
	};

	Editor.prototype.createHeaders = function(row) {
		this.listViewPane.createHead("常见问题", row);
		this.listViewPane.createHead("解决方案", row);
		this.listViewPane.createHead("发布时间", row);
		this.listViewPane.createHead("问题类型", row);
		this.listViewPane.createHead("发布人", row);
		this.listViewPane.createHead("操作", row);
	};

	Editor.prototype.createIcon = function(parent, id, classname, name, title,
			style, editor) {
		var button = document.createElement("BUTTON");
		parent.appendChild(button);
		button.id = name + id;
		button.className = "btn btn-default " + style;
		button.style.borderRadius = "15px";
		button.style.width = "29px";
		button.style.padding = "3px";
		button.title = title;
		button.addEventListener("click", function(evt) {
			var that = this;
			if (this.id == "delete" + id) {
				$.getJSON(service.api("27"), {
					id : id,
				}).complete(function(data) {
					window.location.reload();
					$("#progressbar").hide();
				});
			}
			Utils.stopBubble(evt);
		});
		button.name = name;
		var rmspan = document.createElement("i");
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

	Editor.prototype.setPropertySheet = function() {
		// // basic property setting
		// if (this.basicpropsheet != null) {
		// this.basicpropsheet.setSheet(this.currObject);
		// }
		// // advanced property setting.
		// if (this.propsheet != null) {
		// this.propsheet.setSheet(this.currObject, this.currObject,
		// this.propsheet
		// .getCurrTabIndex(this.currObject));
		// }
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
