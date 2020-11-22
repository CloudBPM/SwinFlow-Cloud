/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "adminNewsList";
	var defaults = {
		id : "",
		owner : "",
		userId : "",
		userfullname : "",
		ownername : "",
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
			owner : "",
			userId : "",
			userfullname : "",
			ownername : "",
			basicpropsheet : "",
			propsheet : "",
			width : 0,
			height : 0,
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.currObject = null;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.newsStatus = 99;
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
		this.listViewPane.createToolbar();
		this.listViewPane.headersize = 5;
		this.listViewPane.loading(1, this.listViewPane.pagesize, "",
				options.owner);

		var p2 = $(this.element).confirmInfoDialog({ // 确认对话框
			id : "005",
			title : vendor + " - 提示",
			parent : this,
		});
		this.confirmInfoDialog = p2.data("confirmInfoDialog");

		var p2 = $(this.element).createNewsDialog({ // 确认对话框
			id : "006",
			title : vendor + " - 发布动态",
			parent : this,
			userId : options.userId,
			userfullname : options.userfullname,
			ownerName : options.ownername,
			ownerId : options.owner,
		});
		this.createNewsDialog = p2.data("createNewsDialog");

		var p3 = $(this.element).submittingDialog({
			id : "006",
			title : vendor + " - 提交意见",
			parent : this,
		});
		this.submittingDialog = p3.data("submittingDialog");
	};

	// 获取本单位全部新闻列表
	Editor.prototype.loading = function(pageno, pagesize, condition, owner) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api("36"), {
			pn : pageno,
			psz : pagesize,
			cond : condition,
			organizationId : owner, // 根据不同的机构查询新闻
			newsState : this.newsStatus, // 查询所有符合状态的新闻
		}).complete(function(data) {
			that.listViewPane.loadData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	Editor.prototype.addExtraButtons = function(parent) {
		var group = this.createGroup(parent);
		this.addButton = this.createTool(group, "addNews" + this.options.id,
				"添加动态", "btn btn-default btn-success", "addNews",
				"fa fa-plus fa-lg");
		var group1 = this.createGroup(parent);
		this.createSelection(group1);
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

	Editor.prototype.selectNewsState = function(parent) {
		var group = this.createGroup(parent);
		this.addButton = this.createSelection(group);
	};

	Editor.prototype.createSelection = function(group) {
		var colDIV2 = document.createElement("DIV");
		group.appendChild(colDIV2);
		colDIV2.className = "col-sm-12";

		this.statusSelect = document.createElement("SELECT");
		colDIV2.appendChild(this.statusSelect);
		this.statusSelect.className = "form-control";
		this.statusSelect.addEventListener("change", this, false);
		// 新闻状态： 0:未发布；1：发布待审核；2：已发布；3：已撤回；4：审核未通过
		this.addOptions(this.statusSelect, "全部", 99, 0);
		this.addOptions(this.statusSelect, "未发布", 0, 1);
		this.addOptions(this.statusSelect, "发布待审核", 1, 2);
		this.addOptions(this.statusSelect, "已发布", 2, 3);
		this.addOptions(this.statusSelect, "已撤回", 3, 5);
		this.addOptions(this.statusSelect, "审核未通过", 4, 4);

	};

	Editor.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	Editor.prototype.createCells = function(obj) {
		var titleLength = 10; // 设置新闻标题的长度
		var contentLength = 20; // 设置新闻内容的长度
		var news = new News();
		news.parseFromJSON(obj);
		this.listViewPane.objects.push(news);
		var row = this.listViewPane.tableList.insertRow(-1);
		row.setAttribute("key", news.id);
		row.addEventListener("click", this, false);
		row.addEventListener("dblclick", this, false);

		var partTitle = null; // 控制标题长度
		if (news.title.length > titleLength) {
			partTitle = news.title.substring(0, titleLength) + "...";
		} else {
			partTitle = news.title;
		}
		this.listViewPane.createCell(0, Utils.parse(partTitle), row);

		var partContent = null;
		if (this.removeHTMLTag(news.content).length > contentLength) {
			partContent = this.removeHTMLTag(news.content).substring(0,
					contentLength)
					+ "...";
		} else {
			partContent = news.content;
		}

		this.listViewPane.createCell(1, Utils.parse(partContent), row);
		this.listViewPane.createCell(2, Utils.parse(Utils
				.getDateTime(news.lastUpdate)), row);
		this.listViewPane.createCell(3, onlinestatus[news.newsState], row);

		// 创建操作按钮
		var cell = this.listViewPane.createCell(4, "", row);
		var b1 = this.createIcon(cell, news.id, "0",
				"fa fa-pencil-square-o fa-lg", "viewNewsDetails", "修改动态",
				"btn-primary");
		var b2 = this.createIcon(cell, news.id, "1",
				"fa fa-cloud-upload fa-lg", "publishNews", "申请发布动态", "");
		var b3 = this.createIcon(cell, news.id, "2",
				"fa fa-cloud-download fa-lg", "removeNews", "撤回动态", "");
		var b4 = this.createIcon(cell, news.id, "3", "fa fa-trash-o fa-lg",
				"deleteNews", "删除动态", "btn-danger");
		// 新闻状态： 0:未发布；1：发布待审核；2：已发布；3：已撤回；4：审核未通过；
		this.buttonSelected(news.newsState, b1, b2, b3, b4);
	};

	Editor.prototype.buttonSelected = function(status, b1, b2, b3, b4) {
		// 新闻状态： 0:未发布；1：发布待审核；2：已发布；3：已撤回；4：审核未通过；
		switch (status) {
		case 0:// 未发布，发布按钮1可以点，撤回按钮2不可以点
			b3.classList.add("active");
			b3.disabled = true;
			break;
		case 1:// 发布待审核，发布按钮1不可以点，撤回按钮2可以点
			b2.classList.add("active");
			b2.disabled = true;
			b1.classList.add("active");
			b1.disabled = true;
			break;
		case 2:// 已发布，发布按钮1不可以点，撤回按钮2可以点
			b2.classList.add("active");
			b2.disabled = true;
			b1.classList.add("active");
			b1.disabled = true;
			break;
		case 3:// 已撤回
			b3.classList.add("active");
			b3.disabled = true;
			break;
		case 4:// 审核未通过
			b3.classList.add("active");
			b3.disabled = true;
			break;
		default:
			break;
		}
	};

	// 发布和下架新闻，即修改新闻的状态
	Editor.prototype.doSubmit = function(id, status, comment) {
		var that = this;
		$("#progressbar").show();
		$.post(service.api(9), {
			status : status,
			newsId : id,
			comment : comment,
			lastUpdate : (new Date()).getTime(),
			owner : this.options.owner,
			userId : this.options.userId,
			userfullname : this.options.userfullname,
			ownername : this.options.ownername,
		}, function(data) {
			that.submittingDialog.hide();
			that.listViewPane.refresh();
			$("#progressbar").hide();
		});
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
			if (this.name == "publishNews") {
				that.submittingDialog.show(id, 1);
			} else if (this.name == "removeNews") {
				that.submittingDialog.show(id, 3);
			} else if (this.name == "deleteNews") {
				that.delNewsid = id;
				that.confirmInfoDialog.show("您确定删除该动态吗？（请谨慎执行此操作，数据不可恢复！）");
			} else if (this.name == "viewNewsDetails") {// 修改新闻动态内容
				var o = that.listViewPane.getCurrentSelected();
				if (o) {
					that.createNewsDialog.loadData(o, false);
				} else {
					that.createNewsDialog.loadData(new News(), true);
				}
				that.createNewsDialog.show();
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
		case "change":
			this.doChange(e);
			break;
		}
		Utils.stopBubble(e);
	};

	Editor.prototype.doNoAction = function(evt) {
		Utils.stopBubble(evt);
		this.confirmInfoDialog.hide();
	};

	Editor.prototype.doYesAction = function(evt) { // 确认删除新闻
		Utils.stopBubble(evt);
		var that = this;
		that.confirmInfoDialog.hide();
		var newsId = this.delNewsid;
		$.getJSON(service.api("10"), {
			newsId : newsId,
			oid : this.options.owner,
		}).complete(function(data) {
			if (data.responseJSON.status == "1") {
				that.listViewPane.refresh(); // 刷新界面
			}
		});
	};

	Editor.prototype.saveObjects = function(currObject, create) {
		this.createNewsDialog.hide();
		var that = this;
		if (create) {
			$("#progressbar").show();
			$.post(service.api(14), {// 14: create;
				currObject : JSON.stringify(currObject),
			}).complete(function(data) {
				that.listViewPane.refresh();
				$("#progressbar").hide();
			});
		} else {
			$("#progressbar").show();
			$.post(service.api(11), {// 11: modify;
				currObject : JSON.stringify(currObject),
			}).complete(function(data) {
				that.listViewPane.refresh();
				$("#progressbar").hide();
			});
		}
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.addButton
				|| (evt.target.id == ("addNews" + this.options.id))) {
			this.createNewsDialog.loadData(new News(), true);
			this.createNewsDialog.show();
		}
	};

	Editor.prototype.doChange = function(evt) {
		this.newsStatus = evt.target.value;
		this.listViewPane.refresh();
	}

	Editor.prototype.createHeaders = function(row) {
		this.listViewPane.createHead("标题", row);
		this.listViewPane.createHead("内容", row);
		this.listViewPane.createHead("更新时间", row);
		this.listViewPane.createHead("状态", row);
		this.listViewPane.createHead("操作", row);
	};

	Editor.prototype.setPropertySheet = function() {
		// // basic property setting
		// if (this.basicpropsheet != null) {
		// this.basicpropsheet.setSheet(this.currObject);
		// }
		// // advanced property setting.
		// if (this.propsheet != null) {
		// this.propsheet.setSheet(obj, this.currObject, this.propsheet
		// .getCurrTabIndex(obj));
		// }
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.removeHTMLTag = function(str) {
		str = str.replace(/<\/?[^>]*>/g, ''); // 去除HTML tag
		str = str.replace(/[ | ]*\n/g, '\n'); // 去除行尾空白
		str = str.replace(/\n[\s| | ]*\r/g, '\n'); // 去除多余空行
		str = str.replace(/&nbsp;/ig, '');// 去掉&nbsp;
		str = str.replace(/\s/g, ''); // 将空格去掉
		return str;
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
