/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "systemNoticeViewEditor";
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
		this.stack = new CommandStack();
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.init(options);
	};

	Editor.prototype.init = function(options) {
		// basic property sheet plugin
		var p1 = $(this.element).readonlyListViewer({
			id : options.id,
			ownerId : options.owner,
			basicpropsheet : options.basicpropsheet,
			propsheet : options.propsheet,
			width : options.width,
			height : options.height,
			parent : this,
			type : "ext",
		});
		this.listViewPane = p1.data("readonlyListViewer");

		var p2 = $(this.element).createNoticeDialog({
			id : "ndlg" + options.id,
			title : "轩琦科技 - 新建/编辑系统通知",
			parent : this,
			uid : options.uid,
			ownerId : options.owner,
		});
		this.noticeDlg = p2.data("createNoticeDialog");

	};
	
	Editor.prototype.getHeaderSize = function() {
		return 6;
	};

	Editor.prototype.loading = function(pageno, pagesize, condition, ownerID) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(18), {
			pn : pageno,
			psz : pagesize,
			cond : condition,
			owner : ownerID,
		}).complete(function(data) {
			that.listViewPane.loadData(data.responseJSON);
			that.setPropertySheet();
			$("#progressbar").hide();
		});
	};

	Editor.prototype.addExtraButtons = function(p) {
		var group = this.createGroup(p);
		this.addNew = this.createTool(group, "addNewNotice" + this.options.id,
				"发布新系统通知", "btn btn-success", "i", "fa fa-plus fa-lg");
	};

	Editor.prototype.createCells = function(obj) {
		this.listViewPane.headersize = 6;
		var p = new SystemNotice();
		p.parseFromJSON(obj);
		this.listViewPane.objects.push(p);
		var row = this.listViewPane.tableList.insertRow(-1);
		row.setAttribute("key", p.id);
		row.addEventListener("click", this.listViewPane, false);
		row.addEventListener("dblclick", this.listViewPane, false);
		this.listViewPane.createCell(0, Utils.parse(p.name), row);
		this.listViewPane.createCell(1, Utils.parse(p.publisher), row);
		this.listViewPane.createCell(2, Utils.parse(p.createDatetime), row);
		this.listViewPane.createCell(3, Utils.parse(p.lastupdate), row);
		this.listViewPane.createCell(4, noticestatus[p.liveStatus], row);
		var cell = this.listViewPane.createCell(5, "", row);
		var b0 = this.createIcon(cell, p.id, "fa fa-pencil-square-o fa-lg",
				"edit", "修改", "btn-primary", this);
		var b1 = this.createIcon(cell, p.id, "fa fa-cloud-upload fa-lg",
				"announce", "发布", "", this);
		var b2 = this.createIcon(cell, p.id, "fa fa-cloud-download fa-lg",
				"cancel", "撤销", "", this);
		var b3 = this.createIcon(cell, p.id, "fa fa-trash-o fa-lg", "delete",
				"撤销", "btn-danger", this);
		this.buttonSelected(p.liveStatus, b1, b2);
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
		this.listViewPane.createHead("通知标题", row);
		this.listViewPane.createHead("发布人", row);
		this.listViewPane.createHead("发布时间", row);
		this.listViewPane.createHead("最后更新", row);
		this.listViewPane.createHead("发布状态", row);
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
			if (this.id == "announce" + id) {
				$("#progressbar").show();
				$.post(service.api(20), {
					id : id,
					live : 1,
				}).complete(function(data) {
					// that.classList.add("active");
					// that.nextSibling.classList.remove("active");
					// that.disabled = true;
					// that.nextSibling.disabled = false;
					editor.listViewPane.refresh();
					$("#progressbar").hide();
				});
			} else if (this.id == "cancel" + id) {
				$("#progressbar").show();
				$.post(service.api(20), {
					id : id,
					live : 0,
				}, function(data) {
					// that.classList.add("active");
					// that.previousSibling.classList.remove("active");
					// that.disabled = true;
					// that.previousSibling.disabled = false;
					editor.listViewPane.refresh();
					$("#progressbar").hide();
				});
			} else if (this.id == "edit" + id) {
				editor.noticeDlg.show();
			} else if (this.id == "delete" + id) {
				$.post(service.api(21), {
					id : id,
				}, function(data) {
					editor.listViewPane.refresh();
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
//		// basic property setting
//		if (this.basicpropsheet != null) {
//			this.basicpropsheet.setSheet(this.currObject);
//		}
//		// advanced property setting.
//		if (this.propsheet != null) {
//			this.propsheet.setSheet(this.currObject, this.currObject, this.propsheet
//					.getCurrTabIndex(this.currObject));
//		}
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
