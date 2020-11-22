/**
 * 微服务
 */
;
(function($, window, document, undefined) {
	var pluginName = "amWebAppServiceEditor";
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
		this.element = element, this.options = $.extend({
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
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.status = 99;
		this.init(options);
	};

	Editor.prototype.init = function(options) {
		var p = $(this.element).readonlyTableViewer({
			id : options.id,
			basicpropsheet : options.basicpropsheet,
			propsheet : options.propsheet,
			width : options.width,
			height : options.height,
			parent : this,
			type : "ext",
		});
		this.listViewPane = p.data("readonlyTableViewer");
		this.listViewPane.init();
		this.listViewPane.createToolbar();
		this.listViewPane.headersize = 6;
		this.listViewPane.loading(1, this.listViewPane.pagesize, "",
				options.owner);

		var p3 = $(this.element).submittingDialog({
			id : "006",
			title : vendor + " - 提交意见",
			parent : this,
		});
		this.submittingDialog = p3.data("submittingDialog");
	};

	Editor.prototype.getDirty = function() {
		return false;
	};

	Editor.prototype.loading = function(pageno, pagesize, condition, owner) {
		$("progressbar").show();
		var that = this;
		$.getJSON(service.api(15), {
			pn : pageno,
			psz : pagesize,
			cond : condition,
			status : this.status,
		}).complete(function(data) {
			that.listViewPane.loadData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	Editor.prototype.addExtraButtons = function(parent) {
		var group = this.createGroup(parent);
		this.addButton = this.createSelection(group);
	};

	Editor.prototype.createSelection = function(group) {
		var colDIV2 = document.createElement("DIV");
		group.appendChild(colDIV2);
		colDIV2.className = "col-sm-10";

		this.statusSelect = document.createElement("SELECT");
		colDIV2.appendChild(this.statusSelect);
		this.statusSelect.className = "form-control";
		this.statusSelect.addEventListener("change", this, false);
		this.addOptions(this.statusSelect, "--请选择状态--", -1, 0);
		this.addOptions(this.statusSelect, "全部", 99, 1);
		this.addOptions(this.statusSelect, "已发布", 2, 2);
		this.addOptions(this.statusSelect, "发布待审核", 1, 3);
	};

	Editor.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	Editor.prototype.createCells = function(obj) {
		var was = new WebAppService();
		was.parse(obj);
		this.listViewPane.objects.push(was);
		var row = this.listViewPane.tableList.insertRow(-1);
		row.setAttribute("key", was.id);
		row.addEventListener("click", this, false);
		row.addEventListener("dblclick", this, false);

		this.listViewPane.createCell(0, Utils.parse(was.name), row);
		this.listViewPane.createCell(1, accesstype[was.accessType], row);
		this.listViewPane.createCell(2, was.methodName, row);
		this.listViewPane.createCell(3, Utils.parse(was.createDateTime), row);
		this.listViewPane.createCell(4, onlinestatus[was.status], row);

		var cell = this.listViewPane.createCell(5, null, row);
		var b0 = this.createIcon(cell, was.id, "4", "fa fa-file-o fa-lg",
				"view", "查看", "btn-primary");
		var b1 = this.createIcon(cell, was.id, "0", "fa fa-cloud-upload fa-lg",
				"online", "发布", "");
		var b2 = this.createIcon(cell, was.id, "1",
				"fa fa-cloud-download fa-lg", "offline", "撤回", "");
		var b3 = this.createIcon(cell, was.id, "2",
				"fa fa-thumbs-o-down fa-lg", "sendback", "审核未通过", "");
		this.buttonSelected(was.status, b1, b2, b3);
	};

	Editor.prototype.buttonSelected = function(status, b1, b2, b3) {
		switch (status) {
		case 1: // 发布待审核（或者是已经下线）
			b2.classList.add("active");
			b2.disabled = true;
			break;
		case 2: // 已发布
			b1.classList.add("active");
			b1.disabled = true;
			b3.classList.add("active");
			b3.disabled = true;
			break;
		}
	};

	Editor.prototype.doSubmit = function(id, status, comment) {
		var that = this;
		$("#progressbar").show();
		$.post(service.api(16), {
			status : status,
			wid : id,
			lastupdate : new Date().getTime(),
			owner : this.options.owner,
			userId : this.options.userId,
			userfullname : this.options.userfullname,
			ownername : this.options.ownername,
			comment : comment,
		}).complete(function(data) {
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
			if (this.name == "sendback") {
				that.submittingDialog.show(id, 4);
			} else if (this.name == "online") {
				that.submittingDialog.show(id, 2);
			} else if (this.name == "offline") {
				that.submittingDialog.show(id, 1);
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
		case "change":
			this.doChange(e);
			break;
		}
	};

	Editor.prototype.doChange = function(evt) {
		if (evt.target.value > -1) {
			this.status = evt.target.value;
			this.listViewPane.refresh();
		}
	}

	Editor.prototype.createHeaders = function(row) {
		this.listViewPane.createHead("微服务名称", row);
		this.listViewPane.createHead("类型", row);
		this.listViewPane.createHead("方法名", row);
		this.listViewPane.createHead("创建时间", row);
		this.listViewPane.createHead("状态", row);
		this.listViewPane.createHead("操作", row);
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

	Editor.prototype.setPropertySheet = function() {
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