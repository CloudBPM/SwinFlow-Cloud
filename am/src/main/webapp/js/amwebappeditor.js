;
(function($, window, document, undefined) {
	var pluginName = "amMicroServiceEditor";
	var defaults = {
		id : "", // micro-service ID
		userId : "",
		userfullname : "",
		ownername : "",
		basicpropsheet : "",
		propsheet : "",
		owner : "", // organization ID
		width : 0,
		height : 0,
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",// process ID
			userId : "",
			userfullname : "",
			ownername : "",
			basicpropsheet : "",
			propsheet : "",
			owner : "", // organization ID
			width : 0,
			height : 0,
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.currObject = null;
		this.init(options);
		this.shading(options);
		this.createToolbar(options);
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.init = function(options) {
		var editorPanel = document.createElement("DIV");
		this.element.appendChild(editorPanel);
		editorPanel.style.margin = "0px";
		editorPanel.style.padding = "0px";
		editorPanel.style.overflow = "auto";
		this.toolbarRow = document.createElement("DIV");
		editorPanel.appendChild(this.toolbarRow);
		this.toolbarRow.className = "row";
		this.toolbarRow.style.margin = "0px";
		this.toolbarRow.style.padding = "0px";
		this.painterRow = document.createElement("DIV");
		editorPanel.appendChild(this.painterRow);
		this.painterRow.className = "row";
		this.painterRow.style.margin = "0px";
		this.painterRow.style.padding = "0px";
		
		// general message dialog plugin
		var p3 = $(this.element).messageDialog({
			id : "00523",
			title : "轩琦科技 - 提示",
			parent : this,
		});
		this.messageDialog = p3.data("messageDialog");
		
		var p3 = $(this.element).submittingDialog({
			id : "006",
			title : vendor + " - 提交意见",
			parent : this,
		});
		this.submittingDialog = p3.data("submittingDialog");
	};

	Editor.prototype.createToolbar = function(options) {
		var parent = document.createElement("DIV");
		this.toolbarRow.appendChild(parent);
		parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		parent.style.margin = "0px";
		parent.style.padding = "2px";

		var c = "btn btn-default";
		var c1 = "btn btn-dangerous";
		var g1 = this.createGroup(parent);
		// fa-lg: 24px; fa-2x ：32px
		this.undobutton = this.createTool(g1, "undo" + this.options.id, "撤销",
				c, "i", "fa fa-reply fa-lg");
		this.redobutton = this.createTool(g1, "redo" + this.options.id, "恢复",
				c, "i", "fa fa fa-share fa-lg");

		var g3 = this.createGroup(parent);
		this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
				c, "i", "fa fa-print fa-lg");

		this.stack.undoButton = this.undobutton;
		this.stack.redoButton = this.redobutton;
		this.disableButton(this.undobutton);
		this.disableButton(this.redobutton);

		var group1 = this.createGroup(parent);
		this.addbutton = this.createTool(group1, "addNewRow" + this.options.id,
				"添加", "btn btn-success", "i", "fa fa-plus fa-lg");
		this.disableButton(this.addbutton);

		var group2 = this.createGroup(parent);
		this.sendtestbutton = this.createTool(group2, "sendTest"
				+ this.options.id, "发送测试请求", "btn btn-default", "i",
				"fa fa-paper-plane fa-lg");

		var g7 = this.createGroup(parent);
		this.rlbutton = this.createTool(g7, "release" + this.options.id,
				"申请发布服务", c, "i", "fa fa-cloud-upload fa-lg");
		this.wdbutton = this.createTool(g7, "widthdraw" + this.options.id,
				"撤回服务", c, "i", "fa fa-cloud-download fa-lg");
	};

	Editor.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		parent.appendChild(group);
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		return group;
	};

	Editor.prototype.createTool = function(group, id, title, style, fonttag,
			fontclass) {
		var button = document.createElement("button");
		group.appendChild(button);
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		var icon = document.createElement(fonttag);
		button.appendChild(icon);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		return button;
	};

	Editor.prototype.shading = function(options) {
		var canvasPanel = document.createElement("DIV");
		this.painterRow.appendChild(canvasPanel);

		canvasPanel.id = "webappPanel" + options.id;
		canvasPanel.className = "col";
		canvasPanel.style.width = options.width + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.padding = "0px";

		this.canvasPane = document.createElement("DIV");
		canvasPanel.appendChild(this.canvasPane);

		this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.canvasPane.id = "webappPane" + options.id;
		this.canvasPane.style.margin = "0px";
		this.canvasPane.style.padding = "0px";
		this.canvasPane.style.overflowX = "auto";
		this.canvasPane.style.overflowY = "auto";
		this.canvasPane.style.height = (options.height - 84) + "px";

		this.canvas = document.createElement("DIV");
		this.canvasPane.appendChild(this.canvas);

		var tabDIV = document.createElement("DIV");
		this.canvasPane.appendChild(tabDIV);
		tabDIV.style.margin = "0px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs ms-nav-tabs";
		tabUL.id = "ms-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);
		this.newTabHead(tabUL, 0, "微服务", true);
		this.newTabHead(tabUL, 1, "详细介绍", false);
		this.newTabHead(tabUL, 2, "更新记录", false);
		this.newTabHead(tabUL, 3, "用户反馈", false);
		this.newTabHead(tabUL, 4, "访问量统计", false);

		var that = this;
		$("#ms-props-nav-tabs").on("click", "a", function(e) {
			// e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(4));
		});

		var tabContents = document.createElement("DIV");
		tabDIV.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "mstabs";

		// 130 is 126 (2 tab height + tool bar height)
		// + 4 (2 gap height + 2 tab border height)
		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		if ($(this.tabContent1).amRestfulAppServiceEditor != undefined) {
			var plugin1 = $(this.tabContent1).amRestfulAppServiceEditor({
				id : "tab1",
				appid : options.id,
				basicpropsheet : options.basicpropsheet,
				propsheet : options.propsheet,
				width : options.width,
				height : (options.height - 130),
				parent : this,
			});
			this.amRAppEditor = plugin1.data("amRestfulAppServiceEditor");
		}

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		// if ($(this.tabContent2).orgDiskManagementPane != undefined) {
		// var plugin2 = $(this.tabContent2).orgDiskManagementPane({
		// id : "tab1",
		// parent : this,
		// entity : this.currOwner,
		// topparent : this.element,
		// });
		// this.orgDiskManagementPane = plugin2.data("orgDiskManagementPane");
		// }
		//
		this.tabContent3 = this.newTabContent(tabContents, 2, false);
		// if ($(this.tabContent3).orgPaymentManagementPane != undefined) {
		// var plugin3 = $(this.tabContent3).orgPaymentManagementPane({
		// id : "tab2",
		// parent : this,
		// entity : this.currOwner,
		// topparent : this.element,
		// });
		// this.orgPaymentManagementPane = plugin3
		// .data("orgPaymentManagementPane");
		// }
		//
		this.tabContent4 = this.newTabContent(tabContents, 3, false);

		this.tabContent5 = this.newTabContent(tabContents, 4, false);

		// console.log(this.currtabindex);

		$('#ms-props-nav-tabs a[href="#tab' + this.currtabindex + '"]').tab(
				'show');

	};

	Editor.prototype.newTabHead = function(parent, index, caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#tab" + index);
		tabLink.setAttribute("aria-controls", "tab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	Editor.prototype.newTabContent = function(parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "tab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "tab" + index;
		return tabContent;
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "keydown":
			this.doKeypress(e);
			break;
		case "click":
			this.doClick(e);
			break;
		}
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.sendtestbutton
				|| (evt.target.id == ("sendTest" + this.options.id))) {
			var that = this;
			if (this.currObject.methodName == "GET") {
				var act = new TestGETAction(this.amRAppEditor.propsheet,
						service.sendreq(0), this.currObject)
				act.doGet();
			} else if (this.currObject.methodName == "POST") {
				var files = [];
				if (this.currObject.hasFileFields() == 1) {
					var list = document.getElementsByTagName("input");
					if (list.length > 0) {
						for (var i = 0; i < list.length; i++) {
							if (list[i].type == "file"
									&& list[i].files.length > 0) {
								for (var j = 0; j < list[i].files.length; j++) {
									files.push(list[i].files[j]);
								}
							}
						}
					}
				}
				console.log(files);
				var act = new TestPOSTAction(this.amRAppEditor.propsheet,
						service.sendreq(1), this.currObject, files);
				act.doPost();
			}
		} else if (evt.target == this.addbutton
				|| (evt.target.id == ("addNewRow" + this.options.id))) {
			if (this.amRAppEditor.headerspane.isonfocus()) {
				this.amRAppEditor.headerspane.addNew();
			} else if (this.amRAppEditor.paraspane.isonfocus()) {
				this.amRAppEditor.paraspane.addNew();
			} else if (this.amRAppEditor.formdatapane != undefined
					&& this.amRAppEditor.formdatapane != null
					&& this.amRAppEditor.formdatapane.isonfocus()) {
				this.amRAppEditor.formdatapane.addNew();
			}
			return;
		} else if (evt.target == this.undobutton
				|| evt.target.id == ("undo" + this.options.id)) {
			this.stack.undo();
		} else if (evt.target == this.redobutton
				|| evt.target.id == ("redo" + this.options.id)) {
			this.stack.redo();
		} else if (evt.target == this.printbutton
				|| evt.target.id == ("print" + this.options.id)) {
			console.log("5");
		} else if (evt.target == this.rlbutton
				|| evt.target.id == ("release" + this.options.id)) {
			if (this.amRAppEditor.verify()) {
				this.submittingDialog.show(this.amRAppEditor.currObject.id, 1);
			} else {
				this.messageDialog.show("您的微服务信息不全，不能申请上线到微服务库！");
			}
		} else if (evt.target == this.wdbutton
				|| evt.target.id == ("widthdraw" + this.options.id)) {
			this.submittingDialog.show(
					this.amRAppEditor.currObject.id, 0);
		}
		Utils.stopBubble(evt);
	};
	
	// 发布和下架业务流程应用，即修改业务流程应用的状态
	Editor.prototype.doSubmit = function(id, status, comment) {
		var that = this;
		$("#progressbar").show();
		$.post(service.api(14), {
			id : id,
			d : status,
			lastupdate : (new Date()).getTime(),
			userId : this.options.userId,
			userfullname : this.options.userfullname,
			ownername : this.options.ownername,
			owner : this.options.owner,
			comment : comment,
		}, function(data) {
			if (status == 1) { // 点击上线按钮
				that.rlbutton.classList.add("active");
				that.rlbutton.disabled = true;
				that.wdbutton.classList.remove("active");
				that.wdbutton.disabled = false;
			} else { // 点击下线按钮
				that.wdbutton.classList.add("active");
				that.wdbutton.disabled = true;
				that.rlbutton.classList.remove("active");
				that.rlbutton.disabled = false;
			}
			that.amRAppEditor.currObject.status = status;
			that.setPropertySheet();
			that.submittingDialog.hide();
			$("#progressbar").hide();
		});
	};

	Editor.prototype.setPropertySheet = function() {
		this.amRAppEditor.setPropertySheet();
	};

	Editor.prototype.doKeypress = function(evt) {
		evt = evt || window.event;
		if (evt.ctrlKey) {
		}
	};

	Editor.prototype.enableAddButton = function() {
		this.enableButton(this.addbutton);
	};

	Editor.prototype.disableAddButton = function() {
		this.disableButton(this.addbutton);
	};

	Editor.prototype.enableButton = function(button) {
		button.disabled = false;
	};

	Editor.prototype.disableButton = function(button) {
		button.disabled = true;
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