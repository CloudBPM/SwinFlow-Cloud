;
(function($, window, document, undefined) {
	var pluginName = "serverGroupEditor";
	var defaults = {
		id : "",
		parent : "",
		owner : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			owner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.painterRow = null;
		this.toolbarRow = null;
		this.basicpropsheet = options.parent.basicpropertySheets;
		this.propsheet = options.parent.propertySheets;

		this.initMainPanel(options);
		this.createToolbar(options);
		this.initCanvas(options);

		this.loading(options);
	};

	Editor.prototype.loading = function(options) {
		var that = this;
		// $("#progressbar").show();
		// $.getJSON(service.api(6), {
		// id : options.id,
		// }).complete(function(data) {
		// that.wfprocess.parseFromJSON(data.responseJSON);
		// that.wfprocess.setContext(that.context);
		// that.repaint();
		// that.setPropertySheet();
		// $("#progressbar").hide();
		// });
	};

	Editor.prototype.getDirty = function() {
		return false;
	};
	
	Editor.prototype.cleanTimeInteval = function() {
	};

	Editor.prototype.initMainPanel = function(options) {
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
		// this.undobutton = this.createTool(g1, "undo" + this.options.id, "撤销",
		// c, "i", "fa fa-reply fa-lg");
		// this.redobutton = this.createTool(g1, "redo" + this.options.id, "恢复",
		// c, "i", "fa fa fa-share fa-lg");

		// var g2 = this.createGroup(parent);
		// this.btnStartup = this.createTool(g2, "start" + this.options.id,
		// "启动",
		// c, "i", "fa fa-play fa-lg");
		// this.btnPause = this.createTool(g2, "pause" + this.options.id, "暂停",
		// c,
		// "i", "fa fa-pause fa-lg");
		// this.btnStop = this.createTool(g2, "stop" + this.options.id, "停止", c,
		// "i", "fa fa-stop fa-lg");
		// this.btnRestart = this.createTool(g2, "restart" + this.options.id,
		// "重启", c, "i", "fa fa-repeat fa-lg");

		var g3 = this.createGroup(parent);
		this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
				c, "i", "fa fa-print fa-lg");

		// this.stack.undoButton = this.undobutton;
		// this.stack.redoButton = this.redobutton;
		// this.disableButton(this.undobutton);
		// this.disableButton(this.redobutton);

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

	Editor.prototype.initCanvas = function(options) {
		var canvasPanel = document.createElement("DIV");
		this.painterRow.appendChild(canvasPanel);

		var w = document.documentElement.clientWidth;
		canvasPanel.id = "infoPanel" + options.id;
		canvasPanel.className = "col";
		canvasPanel.style.width = (w - 568) + "px";// 640;
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginLeft = "4px";
		canvasPanel.style.padding = "0px";

		this.canvasPane = document.createElement("DIV");
		canvasPanel.appendChild(this.canvasPane);

		this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.canvasPane.id = "infoPane" + options.id;
		this.canvasPane.style.margin = "0px";
		this.canvasPane.style.padding = "0px";
		this.canvasPane.style.overflowX = "auto";
		this.canvasPane.style.overflowY = "auto";
		this.canvasPane.style.border = "1px solid #ddd";
		this.canvasPane.style.height = options.parent.tabsHeight + "px";
	};

	Editor.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	Editor.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	Editor.prototype.doClick = function(evt) {
		// if (evt.target == this.undobutton
		// || evt.target.id == ("undo" + this.options.id)) {
		// this.stack.undo();
		// } else if (evt.target == this.redobutton
		// || evt.target.id == ("redo" + this.options.id)) {
		// this.stack.redo();
		// }
		var that = this;
		if (evt.target == this.btnStartup
				|| evt.target.id == ("startup" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.add("active");
			this.btnPause.classList.remove("active");
			this.btnStop.classList.remove("active");
			this.btnRestart.classList.remove("active");
			// $.post(service.api(0), {}, function(data) {
			// $("#progressbar").hide();
			// });
		} else if (evt.target == this.btnPause
				|| evt.target.id == ("pause" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.remove("active");
			this.btnPause.classList.add("active");
			this.btnStop.classList.remove("active");
			that.btnRestart.classList.remove("active");
			// $.post(service.api(1), {}, function(data) {
			// $("#progressbar").hide();
			// });
		} else if (evt.target == this.btnStop
				|| evt.target.id == ("stop" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.remove("active");
			this.btnPause.classList.remove("active");
			this.btnStop.classList.add("active");
			this.btnRestart.classList.remove("active");
			// $.post(service.api(2), {}, function(data) {
			// $("#progressbar").hide();
			// });
		} else if (evt.target == this.btnRestart
				|| evt.target.id == ("restart" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.remove("active");
			this.btnPause.classList.remove("active");
			this.btnStop.classList.remove("active");
			this.btnRestart.classList.add("active");
			// $.post(service.api(3), {}, function(data) {
			// that.btnRestart.classList.remove("active");
			// that.btnStartup.classList.add("active");
			// $("#progressbar").hide();
			// });
		}
	};

	Editor.prototype.setPropertySheet = function() {
		var obj = this.wfprocess;
		if (this.selected != null && this.selected.length > 0) {
			obj = this.selected[0];
		}
		if (this.basicpropsheet != null) {
			this.basicpropsheet.setSheet(obj, this.wfprocess);
		}
		if (this.propsheet != null) {
			this.propsheet.setSheet(obj, this.wfprocess, this.propsheet
					.getCurrTabIndex(obj));
		}
	};

	Editor.prototype.setButtonStatus = function(editorStatus) {
		// if (editorStatus == 0 || editorStatus == 3) { // no selection or
		// // drawing
		// this.setOpStatus(false, false, false, false, false, false, false,
		// false, false);
		// } else if (editorStatus == 1) { // single selection
		// this.setOpStatus(true, true, true, false, false, false, false,
		// false, false);
		// } else if (editorStatus == 2) { // multiple selection
		// this.setOpStatus(true, true, true, true, true, true, true, true,
		// true);
		// }
	}

	Editor.prototype.setOpStatus = function(cp, ct, rm, l, c, r, t, m, b) {
		// if (cp) {
		// this.enableButton(this.copybutton);
		// } else {
		// this.disableButton(this.copybutton);
		// }
		// this.disableButton(this.pastebutton);
		// if (ct) {
		// this.enableButton(this.cutbutton);
		// } else {
		// this.disableButton(this.cutbutton);
		// }
		// if (rm) {
		// this.enableButton(this.deletebutton);
		// } else {
		// this.disableButton(this.deletebutton);
		// }
		// if (l) {
		// this.enableButton(this.lbutton);
		// } else {
		// this.disableButton(this.lbutton);
		// }
		// if (c) {
		// this.enableButton(this.cbutton);
		// } else {
		// this.disableButton(this.cbutton);
		// }
		// if (r) {
		// this.enableButton(this.rbutton);
		// } else {
		// this.disableButton(this.rbutton);
		// }
		// if (t) {
		// this.enableButton(this.tbutton);
		// } else {
		// this.disableButton(this.tbutton);
		// }
		// if (m) {
		// this.enableButton(this.mbutton);
		// } else {
		// this.disableButton(this.mbutton);
		// }
		// if (b) {
		// this.enableButton(this.bbutton);
		// } else {
		// this.disableButton(this.bbutton);
		// }
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