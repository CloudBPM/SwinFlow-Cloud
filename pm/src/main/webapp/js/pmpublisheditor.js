;
(function($, window, document, undefined) {
	var pluginName = "pmProcessPublishEditor";
	var defaults = {
		id : "", // process ID
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
			id : "", // process ID
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
		this.painterRow = null;
		this.toolbarRow = null;
		this.currOwner = null;
		this.canvas = null;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.wfprocess = new WfProcess();

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

		var g6 = this.createGroup(parent);
		this.pbutton = this.createTool(g6, "preview" + this.options.id, "预览",
				c, "i", "fa fa-coffee fa-lg");

		this.stack.undoButton = this.undobutton;
		this.stack.redoButton = this.redobutton;
		this.disableButton(this.undobutton);
		this.disableButton(this.redobutton);

		var g7 = this.createGroup(parent);
		this.rlbutton = this.createTool(g7, "release" + this.options.id,
				"申请上线应用", c, "i", "fa fa-cloud-upload fa-lg");
		this.wdbutton = this.createTool(g7, "widthdraw" + this.options.id,
				"下线应用", c, "i", "fa fa-cloud-download fa-lg");
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

		canvasPanel.id = "rlpcanvasPanel" + options.id;
		canvasPanel.className = "col";
		canvasPanel.style.width = options.width + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.padding = "0px";

		this.canvasPane = document.createElement("DIV");
		canvasPanel.appendChild(this.canvasPane);

		this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.canvasPane.id = "rlprocPane" + options.id;
		this.canvasPane.style.margin = "0px";
		this.canvasPane.style.padding = "0px";
		this.canvasPane.style.height = (options.height - 84) + "px";

		var tabUL = document.createElement("UL");
		this.canvasPane.appendChild(tabUL);
		tabUL.className = "nav nav-tabs rlp-nav-tabs";
		tabUL.id = "rlp-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		this.newTabHead(tabUL, 0, "已版本化应用", true);
		if (pversion > 2) {
			this.newTabHead(tabUL, 1, "详细介绍", false);
			this.newTabHead(tabUL, 2, "版本更新记录", false);
			this.newTabHead(tabUL, 3, "用户反馈", false);
			this.newTabHead(tabUL, 4, "运行数据统计", false);
		}
		var that = this;
		$("#rlp-props-nav-tabs").on("click", "a", function(e) {
			// e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(7));
			// console.log($(this).attr('href').substring(7));
			that.setPropertySheet();
		});

		var tabContents = document.createElement("DIV");
		this.canvasPane.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "rlptabs";

		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		if ($(this.tabContent1).releasedWfProcessEditor != undefined) {
			var plugin1 = $(this.tabContent1).releasedWfProcessEditor({
				id : "rlptab1",
				pid : options.id,
				basicpropsheet : options.basicpropsheet,
				propsheet : options.propsheet,
				width : options.width,
				height : (options.height - 130),
				parent : this,
				owner : options.owner,
			});
			// 130 is 126 (2 tab height + tool bar height)
			// + 4 (2 gap height + 2 tab border height)
			this.releasedWfProcessEditor = plugin1
					.data("releasedWfProcessEditor");
		}
		if (pversion > 2) {
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
		}
		$('#rlp-props-nav-tabs a[href="#rlptab' + this.currtabindex + '"]')
				.tab('show');

	};

	Editor.prototype.newTabHead = function(parent, index, caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#rlptab" + index);
		tabLink.setAttribute("aria-controls", "rlptab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	Editor.prototype.newTabContent = function(parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "rlptab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "rlptab" + index;
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
		if (evt.target == this.undobutton
				|| evt.target.id == ("undo" + this.options.id)) {
			this.stack.undo();
		} else if (evt.target == this.redobutton
				|| evt.target.id == ("redo" + this.options.id)) {
			this.stack.redo();
		} else if (evt.target == this.printbutton
				|| evt.target.id == ("print" + this.options.id)) {
			console.log("5");
		} else if (evt.target == this.pbutton
				|| evt.target.id == ("preview" + this.options.id)) {

		} else if (evt.target == this.rlbutton
				|| evt.target.id == ("release" + this.options.id)) {
			if (approval == 0) {
				// 自动审核
				this.doSubmit(this.releasedWfProcessEditor.wfprocess.id, 2, "自动审核通过");
			} else {
				// 手工审核
				this.submittingDialog.show(this.releasedWfProcessEditor.wfprocess.id, 0);
			}
			//this.submittingDialog.show(
			//		this.releasedWfProcessEditor.wfprocess.id, 0);
		} else if (evt.target == this.wdbutton
				|| evt.target.id == ("widthdraw" + this.options.id)) {
			if (approval == 0) {
				// 自动审核
				this.doSubmit(this.releasedWfProcessEditor.wfprocess.id, 1, "自动审核撤下");
			} else {
				// 手工审核
				this.submittingDialog.show(this.releasedWfProcessEditor.wfprocess.id, 1);
			}
			//this.submittingDialog.show(
			//		this.releasedWfProcessEditor.wfprocess.id, 1);
		}
	};

	// 发布和下架业务流程应用，即修改业务流程应用的状态
	Editor.prototype.doSubmit = function(id, status, comment) {
		var that = this;
		$("#progressbar").show();
		$.post(service.api(23), {
			id : id,
			d : status,
			userId : this.options.userId,
			userfullname : this.options.userfullname,
			ownername : this.options.ownername,
			owner : this.options.owner,
			comment : comment,
		}, function(data) {
			if (approval == 1) {
				if (status == 0) { // 点击上线按钮
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
				that.releasedWfProcessEditor.wfprocess.deprecated = status;
				that.setPropertySheet();
				that.submittingDialog.hide();
			} else {
				if (status == 2) { // 点击上线按钮
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
				that.releasedWfProcessEditor.wfprocess.deprecated = status;
				that.setPropertySheet();
			}
			$("#progressbar").hide();
		});
	};

	Editor.prototype.doKeypress = function(evt) {
		evt = evt || window.event;
		if (evt.ctrlKey) {
		}
	};

	Editor.prototype.setPropertySheet = function() {
		this.releasedWfProcessEditor.setPropertySheet();
	};

	Editor.prototype.setButtonStatus = function(editorStatus) {
		this.releasedWfProcessEditor.setButtonStatus(editorStatus);
	};

	Editor.prototype.evalMoveNodes = function(selected, newselected) {
		this.releasedWfProcessEditor.evalMoveNodes(selected, newselected);
	};

	Editor.prototype.setOpStatus = function(cp, ct, rm, l, c, r, t, m, b) {
	};

	Editor.prototype.enableButton = function(button) {
		button.disabled = false;
	};

	Editor.prototype.disableButton = function(button) {
		button.disabled = true;
	};

	Editor.prototype.repaint = function() {
		this.releasedWfProcessEditor.repaint();
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