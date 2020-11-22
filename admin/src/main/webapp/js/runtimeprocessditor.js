;
(function($, window, document, undefined) {
	var pluginName = "runtimeWfProcessEditor";
	var defaults = {
		id : "",
		owner : "",
		parent : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			owner : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.painterRow = null;
		this.toolbarRow = null;
		this.wfprocess = new WfProcessInstance();
		this.canvas = null;
		this.context = null;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		// 0: default status; 1: single selection;
		// 2: multiple selection; 3: draw task; 4: draw transition;
		this.editorStatus = 0;
		this.moving = false;
		this.creating = null;
		this.selected = []; // selected objects
		this.selectionBuffer = []; // temporary store selected objects
		this.transition = null; // temporary transition variable
		this.mouse0 = null;
		this.mouse1 = null;
		this.mousepressed = false;
		this.selArea = null;
		this.changeParentCmd = null;
		this.moveCmd = null;
		this.resizeCmd = null;

		this.initMainPanel(options);
		this.createToolbar(options);
		this.initPallet(options);
		this.initCanvas(options);

		this.loading(options);
	};

	Editor.prototype.loading = function(options) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(3), {
			id : options.id,
		}).complete(function(data) {
			that.wfprocess.parseFromJSON(data.responseJSON);
			that.wfprocess.setContext(that.context);
			that.repaint();
			that.setPropertySheet();
			$("#progressbar").hide();
		});
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
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
		this.undobutton = this.createTool(g1, "undo" + this.options.id, "撤销",
				c, "i", "fa fa-reply fa-lg");
		this.redobutton = this.createTool(g1, "redo" + this.options.id, "恢复",
				c, "i", "fa fa fa-share fa-lg");

		var g2 = this.createGroup(parent);
		this.copybutton = this.createTool(g2, "copy" + this.options.id, "复制",
				c, "i", "fa fa-files-o fa-lg");
		this.pastebutton = this.createTool(g2, "paste" + this.options.id, "粘贴",
				c, "i", "fa fa-clipboard fa-lg");
		this.cutbutton = this.createTool(g2, "cut" + this.options.id, "剪切", c,
				"i", "fa fa-scissors fa-lg");
		this.deletebutton = this.createTool(g2, "delete" + this.options.id,
				"删除", c1, "i", "fa fa-trash-o fa-lg");

		var g3 = this.createGroup(parent);
		this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
				c, "i", "fa fa-print fa-lg");

		var g4 = this.createGroup(parent);
		this.lbutton = this.createTool(g4, "lalign" + this.options.id, "向左对齐",
				c, "span", "glyphicon glyphicon-object-align-left fa-lg");
		this.cbutton = this.createTool(g4, "valign" + this.options.id, "垂直对齐",
				c, "span", "glyphicon glyphicon-object-align-vertical fa-lg");
		this.rbutton = this.createTool(g4, "ralign" + this.options.id, "向右对齐",
				c, "span", "glyphicon glyphicon-object-align-right fa-lg");
		this.tbutton = this.createTool(g4, "talign" + this.options.id, "顶部对齐",
				c, "span", "glyphicon glyphicon-object-align-top fa-lg");
		this.mbutton = this.createTool(g4, "malign" + this.options.id, "中间对齐",
				c, "span", "glyphicon glyphicon-object-align-horizontal fa-lg");
		this.bbutton = this.createTool(g4, "balign" + this.options.id, "底部对齐",
				c, "span", "glyphicon glyphicon-object-align-bottom fa-lg");

		var g5 = this.createGroup(parent);
		this.vbutton = this.createTool(g5, "verify" + this.options.id, "检查正确性",
				c, "i", "fa fa-check-square-o fa-lg");
		this.sbutton = this.createTool(g5, "refresh" + this.options.id,
				"刷新", "btn btn-default", "i", "fa fa-refresh fa-lg");

		this.stack.undoButton = this.undobutton;
		this.stack.redoButton = this.redobutton;
		this.disableButton(this.undobutton);
		this.disableButton(this.redobutton);

		this.disableButton(this.copybutton);
		this.disableButton(this.pastebutton);
		this.disableButton(this.cutbutton);
		this.disableButton(this.deletebutton);

		this.disableButton(this.lbutton);
		this.disableButton(this.cbutton);
		this.disableButton(this.rbutton);
		this.disableButton(this.tbutton);
		this.disableButton(this.mbutton);
		this.disableButton(this.bbutton);
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

	Editor.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	Editor.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	Editor.prototype.initPallet = function(options) {
		var palletPanel = document.createElement("DIV");
		palletPanel.id = "accordion" + options.id;
		palletPanel.className = "col";
		palletPanel.style.width = "72px";
		palletPanel.style.margin = "0px";
		palletPanel.style.padding = "0px";
		palletPanel.style.overflowY = "auto";
		palletPanel.style.height = (options.height - 84) + "px";
		var group = document.createElement("DIV");
		group.id = "accordion";
		group.className = "panel-group";
		group.style.margin = 0 + "px";
		group.style.padding = 0 + "px";
		group.style.width = 72 + "px";
		group.style.minWidth = 72 + "px";
		group.style.maxWidth = 72 + "px";

		group.setAttribute('role', 'tablist');// $("input").attr("value","txt");
		group.setAttribute('aria-multiselectable', 'true');

		var taskbar1 = this.createPalletBar("One", "基本", true, "in", group);
		var taskbar2 = this.createPalletBar("Two", "高级", false, "", group);
		var taskbar3 = this.createPalletBar("Three", "定制", false, "", group);

		taskbar1.appendChild(this.component("连接", this.options.id, "tr")); //
		taskbar1.appendChild(this.component("起点", this.options.id, "st"));
		taskbar1.appendChild(this.component("终点", this.options.id, "ed"));
		taskbar1.appendChild(this.component("人工参与任务", this.options.id, "man"));
		taskbar1.appendChild(this.component("系统自动任务", this.options.id, "sys"));
		taskbar1.appendChild(this.component("赋值任务", this.options.id, "ass"));

		taskbar2.appendChild(this.component("延迟等待任务", this.options.id, "wait"));
		taskbar2.appendChild(this.component("发送短信", this.options.id, "smsout"));
		taskbar2.appendChild(this.component("查收短信", this.options.id, "smsin"));
		taskbar2.appendChild(this.component("发送邮件", this.options.id, "eout"));
		taskbar2.appendChild(this.component("查收邮件", this.options.id, "ein"));
		taskbar2.appendChild(this.component("子流程调用", this.options.id, "sub"));

		palletPanel.appendChild(group);
		this.painterRow.appendChild(palletPanel);
	};

	Editor.prototype.component = function(title, id, iconname) {
		var com = document.createElement("li");
		com.className = "list-group-item";
		var icon = this.createIcon(title, id, iconname, this);
		com.appendChild(icon);
		return com;
	};

	Editor.prototype.createIcon = function(title, imgid, iconname, parent) {
		var canvas = document.createElement("canvas");
		canvas.id = iconname + imgid;
		canvas.style.cursor = "default";
		canvas.width = 33;
		canvas.height = 33;
		canvas.setAttribute("Title", title);
		var context = canvas.getContext("2d");
		if (iconname == "tr") {
			transitionIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "st") {
			startIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "ed") {
			endIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "man") {
			manualTaskIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "sys") {
			gearIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "ass") {
			assignIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "wait") {
			clockIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "sub") {
			subProcessIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "smsout") {
			mobileSendingIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "smsin") {
			mobileReceivingIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "ein") {
			emailReceivingIcon32x32(context, 0.5, 0.5);
		} else if (iconname == "eout") {
			emailSendingIcon32x32(context, 0.5, 0.5);
		}
		canvas.setAttribute("draggable", "true");
		canvas.addEventListener('click', function(e) {
			parent.creating = iconname;
			if (iconname == "tr") {
				parent.editorStatus = 4; // draw transition
			} else {
				parent.editorStatus = 3; // draw task
			}
		});
		canvas.addEventListener('dragstart', function(e) {
			parent.creating = iconname;
			e.dataTransfer.setData("Text", e.target.id);
		});
		return canvas;
	};

	Editor.prototype.createPalletBar = function(id, barname, expanded, clpin,
			parent) {
		var panel = document.createElement("DIV");
		parent.appendChild(panel);

		panel.className = "panel panel-default";
		var panelHeading = document.createElement("DIV");
		panel.appendChild(panelHeading);
		panelHeading.className = "panel-heading";
		panelHeading.setAttribute("role", "tab");
		panelHeading.id = "heading" + id;

		var h4title = document.createElement("h4");
		panelHeading.appendChild(h4title);
		h4title.className = "panel-title";

		var atitle = document.createElement("a");
		h4title.appendChild(atitle);
		atitle.setAttribute("role", "button");
		atitle.setAttribute("data-toggle", "collapse");
		atitle.setAttribute("data-parent", "#accordion");
		atitle.setAttribute("href", "#collapse" + id);
		atitle.setAttribute("aria-expanded", "" + expanded + "");
		atitle.setAttribute("aria-controls", "collapse" + id);
		atitle.text = barname;

		var panelBody = document.createElement("DIV");
		panel.appendChild(panelBody);
		panelBody.id = "collapse" + id;
		panelBody.className = "panel-collapse collapse " + clpin;
		panelBody.setAttribute("role", "tabpanel");
		panelBody.setAttribute("aria-labelledby", "heading" + id);

		var componentList = document.createElement("ul");
		panelBody.appendChild(componentList);
		componentList.className = "list-group";

		return componentList;
	};

	Editor.prototype.initCanvas = function(options) {
		var canvasPanel = document.createElement("DIV");
		this.painterRow.appendChild(canvasPanel);

		var w = document.documentElement.clientWidth;
		canvasPanel.id = "canvasPanel" + options.id;
		canvasPanel.className = "col";
		canvasPanel.style.width = (options.width - 76) + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginLeft = "4px";
		canvasPanel.style.padding = "0px";

		this.canvasPane = document.createElement("DIV");
		canvasPanel.appendChild(this.canvasPane);

		this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.canvasPane.id = "convasPane" + options.id;
		this.canvasPane.style.margin = "0px";
		this.canvasPane.style.padding = "0px";
		this.canvasPane.style.overflowX = "auto";
		this.canvasPane.style.overflowY = "auto";
		this.canvasPane.style.border = "1px solid #ddd";
		this.canvasPane.style.height = (options.height - 84) + "px";

		this.canvas = document.createElement("canvas");
		this.canvasPane.appendChild(this.canvas);

		this.canvas.id = 'painterconvas' + options.id;
		// this.canvas.style.cursor = "crosshair";
		this.canvas.style.cursor = "default";
		this.canvas.width = 1200;
		this.canvas.height = 800;
		this.context = this.canvas.getContext("2d");
		this.wfprocess.setContext(this.context);
		this.repaint();
		this.canvas.addEventListener("mousedown", this, false);
		this.canvas.addEventListener('mousemove', this, false);
		this.canvas.addEventListener('mouseup', this, false);
		this.canvas.addEventListener('mouseout', this, false);
		this.canvas.addEventListener('drop', this, false);
		this.canvas.addEventListener('dragover', this, false);
		this.canvas.addEventListener('dragstart', this, false);
		window.addEventListener('keydown', this, true);
	};

	Editor.prototype.getPointOnCanvas = function(evt) {
		var mouse = {
			x : evt.clientX - this.canvas.getBoundingClientRect().left,
			y : evt.clientY - this.canvas.getBoundingClientRect().top,
		};
		return mouse;
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "mousedown":
			this.doMouseDown(e);
			break;
		case "mousemove":
			this.doMouseMove(e);
			break;
		case "mouseup":
			this.doMouseUp(e);
			break;
		case "mouseout":
			break;
		case "drop":
			this.doDrop(e);
			break;
		case "dragover":
			this.doAllowDrop(e);
			break;
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeypress(e);
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
		} else if (evt.target == this.copybutton
				|| evt.target.id == ("copy" + this.options.id)) {
		} else if (evt.target == this.pastebutton
				|| evt.target.id == ("paste" + this.options.id)) {
		} else if (evt.target == this.cutbutton
				|| evt.target.id == ("cut" + this.options.id)) {
		} else if (evt.target == this.deletebutton
				|| evt.target.id == ("delete" + this.options.id)) {
			if (this.selected != null && this.selected.length > 0) {
				this.stack.execute(new PMRemoveCmd(this.selected,
						this.wfprocess, this));
			}
		} else if (evt.target == this.printbutton
				|| evt.target.id == ("print" + this.options.id)) {
			console.log("5");
		} else if (evt.target == this.lbutton
				|| evt.target.id == ("lalign" + this.options.id)) {
			this.leftAlignment(this.selected);
		} else if (evt.target == this.cbutton
				|| evt.target.id == ("valign" + this.options.id)) {
			this.centerAlignment(this.selected);
		} else if (evt.target == this.rbutton
				|| evt.target.id == ("ralign" + this.options.id)) {
			this.rightAlignment(this.selected);
		} else if (evt.target == this.tbutton
				|| evt.target.id == ("talign" + this.options.id)) {
			this.topAlignment(this.selected);
		} else if (evt.target == this.mbutton
				|| evt.target.id == ("malign" + this.options.id)) {
			this.middleAlignment(this.selected);
		} else if (evt.target == this.bbutton
				|| evt.target.id == ("balign" + this.options.id)) {
			this.bottomAlignment(this.selected);
		} else if (evt.target == this.vbutton
				|| evt.target.id == ("verify" + this.options.id)) {
			console.log("12");
		} else if (evt.target == this.sbutton
				|| evt.target.id == ("refresh" + this.options.id)) {
			this.loading(this.options);
		}
	};

	Editor.prototype.doDrop = function(evt) {
		evt.preventDefault();
		var data = evt.dataTransfer.getData("Text");
		this.selectionBuffer = this.cloneSelectedObjects(this.selected);
		this.disableSelectedObjects();
		var mouse = this.getPointOnCanvas(evt);
		var part = this.addTask(mouse);
		this.doCreationAction(part);
	};

	Editor.prototype.doAllowDrop = function(evt) {
		evt.preventDefault();
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

	Editor.prototype.doKeypress = function(evt) {
		evt = evt || window.event;
		if (evt.ctrlKey) {
			if (evt.keyCode == '65') { // A
				this.selectAllObjects(this.wfprocess.children);
			} else if (evt.keyCode == '38') { // up arrow
				this.move(this.selected, 0, -1);
			} else if (evt.keyCode == '40') { // down arrow
				this.move(this.selected, 0, 1);
			} else if (evt.keyCode == '37') { // left arrow
				this.move(this.selected, -1, 0);
			} else if (evt.keyCode == '39') { // right arrow
				this.move(this.selected, 1, 0);
				// } else if (evt.keyCode == '67') { // Copy
				// } else if (evt.keyCode == '86') { // Paste
				// } else if (evt.keyCode == '88') { // Cut
			} else if (evt.keyCode == '46') { // Delete
				if (this.selected != null && this.selected.length > 0) {
					this.stack.execute(new PMRemoveCmd(this.selected,
							this.wfprocess, this));
				}
			} else if (evt.keyCode == '80') { // Print
			} else if (evt.keyCode == '122') { // Ctrl + Z: undo
				this.stack.undo();
			} else if (evt.keyCode == '121') { // Ctrl + Y: redo
				this.stack.redo();
			}
		} else {
			if (evt.keyCode == '27') { // Esc key
				this.disableSelectedObjects();
				if (this.editorStatus == 4) {
					this.transition = null;
					this.editorStatus = 0;
					this.setButtonStatus(this.editorStatus);
				}
			} else if (evt.keyCode == '38') { // up arrow
				this.move(this.selected, 0, -5);
			} else if (evt.keyCode == '40') { // down arrow
				this.move(this.selected, 0, 5);
			} else if (evt.keyCode == '37') { // left arrow
				this.move(this.selected, -5, 0);
			} else if (evt.keyCode == '39') { // right arrow
				this.move(this.selected, 5, 0);
			} else if (evt.keyCode == '112') { // F1 help

			}
		}
		this.repaint();
	};

	Editor.prototype.move = function(selected, dx, dy) {
		for (var i = 0; i < selected.length; i++) {
			if (selected[i] instanceof AbstractTask) {
				if (selected[i].x0 + dx > 0 && selected[i].x1 + dx < 2400) {
					selected[i].x0 += dx;
					selected[i].x1 += dx;
					if (selected[i].inputs.length > 0) {
						for (var j = 0; j < selected[i].inputs.length; j++) {
							selected[i].inputs[j].x1 += dx;
							if (selected[i].inputs[j].bendpoints != null) {
								selected[i].inputs[j].bendpoints.x += dx;
							} else {
								selected[i].inputs[j].bendpoints = null;
							}
							selected[i].inputs[j].updatePosition();
						}
					}
					if (selected[i].outputs.length > 0) {
						for (var j = 0; j < selected[i].outputs.length; j++) {
							selected[i].outputs[j].x0 += dx;
							if (selected[i].outputs[j].bendpoints != null) {
								selected[i].outputs[j].bendpoints.x += dx;
							} else {
								selected[i].outputs[j].bendpoints = null;
							}
							selected[i].outputs[j].updatePosition();
						}
					}
				}
				if (selected[i].y0 + dy > 0 && selected[i].y1 + dy < 1200) {
					selected[i].y0 += dy;
					selected[i].y1 += dy;
					if (selected[i].inputs.length > 0) {
						for (var j = 0; j < selected[i].inputs.length; j++) {
							selected[i].inputs[j].y1 += dy;
							if (selected[i].inputs[j].bendpoints != null) {
								selected[i].inputs[j].bendpoints.y += dy;
							} else {
								selected[i].inputs[j].bendpoints = null;
							}
							selected[i].inputs[j].updatePosition();
						}
					}
					if (selected[i].outputs.length > 0) {
						for (var j = 0; j < selected[i].outputs.length; j++) {
							selected[i].outputs[j].y0 += dy;
							if (selected[i].outputs[j].bendpoints != null) {
								selected[i].outputs[j].bendpoints.y += dy;
							} else {
								selected[i].outputs[j].bendpoints = null;
							}
							selected[i].outputs[j].updatePosition();
						}
					}
				}
			}
		}
		var bounds = this.getObjectsonBound(selected);
		this.updateScrollbar(bounds, dx, dy);
	};

	Editor.prototype.moveTransitions = function(selected, dx, dy) {
		for (var i = 0; i < selected.length; i++) {
			if (selected[i] instanceof Transition) {
				if (selected[i].bendpoints == null) {
					selected[i].bendpoints = {
						x : Math.floor((selected[i].x0 + selected[i].x1) / 2) + 0.5,
						y : Math.floor((selected[i].y0 + selected[i].y1) / 2) + 0.5
					};
				}
				selected[i].bendpoints.x += dx;
				selected[i].bendpoints.y += dy;
				selected[i].updatePosition();
			}
		}
		var bounds = this.getObjectsonBound(selected);
		this.updateScrollbar(bounds, dx, dy);
	};

	Editor.prototype.evalMoveNodes = function(selected, newselected) {
		for (var i = 0; i < selected.length; i++) {
			if (selected[i] != null) {
				selected[i].x0 = newselected[i].x0;
				selected[i].x1 = newselected[i].x1;
				selected[i].y0 = newselected[i].y0;
				selected[i].y1 = newselected[i].y1;
				selected[i].selected = newselected[i].selected;
				if (newselected[i] instanceof AbstractTask) {
					if (newselected[i].inputs.length > 0) {
						for (var j = 0; j < newselected[i].inputs.length; j++) {
							selected[i].inputs[j].x0 = newselected[i].inputs[j].x0;
							selected[i].inputs[j].y0 = newselected[i].inputs[j].y0;
							selected[i].inputs[j].x1 = newselected[i].inputs[j].x1;
							selected[i].inputs[j].y1 = newselected[i].inputs[j].y1;
							selected[i].inputs[j].selected = newselected[i].inputs[j].selected;
							if (newselected[i].inputs[j].bendpoints != null) {
								selected[i].inputs[j].bendpoints = {
									x : newselected[i].inputs[j].bendpoints.x,
									y : newselected[i].inputs[j].bendpoints.y,
								};
							} else {
								selected[i].inputs[j].bendpoints = null;
							}
							if (newselected[i].inputs[j].points.length > 0) {
								for (var k = 0; k < newselected[i].inputs[j].points.length; k++) {
									selected[i].inputs[j].points[k] = {
										x1 : newselected[i].inputs[j].points[k].x1,
										y1 : newselected[i].inputs[j].points[k].y1,
									}
								}
							}
							selected[i].inputs[j].updatePosition();
						}
					}
					if (newselected[i].outputs.length > 0) {
						for (var j = 0; j < newselected[i].outputs.length; j++) {
							selected[i].outputs[j].x0 = newselected[i].outputs[j].x0;
							selected[i].outputs[j].y0 = newselected[i].outputs[j].y0;
							selected[i].outputs[j].x1 = newselected[i].outputs[j].x1;
							selected[i].outputs[j].y1 = newselected[i].outputs[j].y1;
							selected[i].outputs[j].selected = newselected[i].outputs[j].selected;
							if (newselected[i].outputs[j].bendpoints != null) {
								selected[i].outputs[j].bendpoints = {
									x : newselected[i].outputs[j].bendpoints.x,
									y : newselected[i].outputs[j].bendpoints.y,
								};
							} else {
								selected[i].outputs[j].bendpoints = null;
							}
							if (newselected[i].outputs[j].points.length > 0) {
								for (var k = 0; k < newselected[i].outputs[j].points.length; k++) {
									selected[i].outputs[j].points[k] = {
										x1 : newselected[i].outputs[j].points[k].x1,
										y1 : newselected[i].outputs[j].points[k].y1,
									}
								}
							}
							newselected[i].outputs[j].updatePosition();
						}
					}
				} else if (newselected[i] instanceof Transition) {
					if (newselected[i].bendpoints != null) {
						selected[i].bendpoints = {
							x : newselected[i].bendpoints.x,
							y : newselected[i].bendpoints.y,
						};
					} else {
						selected[i].bendpoints = null;
					}
					selected[i].updatePosition();
				}
			}
		}
	};

	Editor.prototype.resumeSelectedNodes = function(newselected) {
		this.selected = [];
		for (var j = 0; j < newselected.length; j++) {
			for (var i = 0; i < this.wfprocess.children.length; i++) {
				if (newselected[j].id == this.wfprocess.children[i].id) {
					this.wfprocess.children[i].selected = true;
					this.selected.push(this.wfprocess.children[i]);
					break;
				}
				if (this.wfprocess.children[i].outputs != undefined
						&& this.wfprocess.children[i].outputs.length > 0) {
					for (var k = 0; k < this.wfprocess.children[i].outputs.length; k++) {
						if (newselected[j].id == this.wfprocess.children[i].outputs[k].id) {
							this.wfprocess.children[i].outputs[k].selected = true;
							this.selected
									.push(this.wfprocess.children[i].outputs[k]);
							break;
						}
					}
				}
			}
		}
	};

	Editor.prototype.doMouseDown = function(evt) {
		evt.preventDefault();
		var mouse = this.getPointOnCanvas(evt);
		$('.nav-tabs a[href="#tab_' + this.options.id + '"]').tab('show');
		this.mousepressed = true;
		this.mouse0 = this.getPointOnCanvas(evt);
		if (this.editorStatus == 0) { // default status
			var a = this.lookupObjects(this.mouse0);
			if (a != null) {
				this.dropinSelected(a);
				this.editorStatus = 1;
				this.setButtonStatus(this.editorStatus);
				this.repaint();
			} else {
				this.selArea = {
					x0 : this.mouse0.x,
					y0 : this.mouse0.y,
					x1 : 0,
					y1 : 0,
				};
			}
			this.setPropertySheet();
		} else if (this.editorStatus == 1 || this.editorStatus == 2) {
			if (evt.ctrlKey) {
				var a = this.lookupObjects(this.mouse0);
				if (a != null) {
					if (this.withinSelected(a)) {
						this.dropoutSelected(a);
					} else {
						this.dropinSelected(a);
					}
				}
			} else {
				var a = this.lookupObjects(this.mouse0);
				if (a != null) {
					if (!this.withinSelected(a)) {
						this.disableSelectedObjects();
						this.dropinSelected(a);
					}
				} else {
					this.disableSelectedObjects();
				}
			}
			if (this.selected.length == 0) {
				this.editorStatus = 0;
			} else if (this.selected.length == 1) {
				this.editorStatus = 1;
			} else if (this.selected.length > 1) {
				this.editorStatus = 2;
			}
			this.setButtonStatus(this.editorStatus);
			for (var i = 0; i < this.selected.length; i++) {
				this.isRollCoverObject(this.selected[i], this.mouse0.x,
						this.mouse0.y);
			}
			this.setPropertySheet();
			this.repaint();
		} else if (this.editorStatus == 3) { // draw task
			this.selectionBuffer = this.cloneSelectedObjects(this.selected);
			this.disableSelectedObjects();
			this.setButtonStatus(this.editorStatus);
			this.repaint();
		} else if (this.editorStatus == 4) { // draw transition
			var a = this.lookupObjects(mouse);
			if (this.transition == null) {
				if (a != null && a instanceof AbstractTask) {
					this.selectionBuffer = this
							.cloneSelectedObjects(this.selected);
					this.disableSelectedObjects();
					this.transition = new Transition();
					this.transition.context = this.context;
					this.transition.source = a;
					this.transition.x0 = Math.floor((a.x0 + a.x1) / 2) + 0.5;
					this.transition.y0 = Math.floor((a.y0 + a.y1) / 2) + 0.5;
				}
			} else {
				if (!this.existed(this.transition, a)) {
					if (a != null) {
						var part = this.addTransition(mouse, a);
						this.doCreationAction(part);
					}
				} else {
					this.transition = null;
				}
			}
			this.repaint();
		}
		// code below prevents the mouse down from having an effect on the main
		// browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} else if (evt.returnValue) { // standard
			evt.returnValue = false;
		} // older IE
	};

	Editor.prototype.existed = function(transition, selectedTarget) {
		var s = transition.source;
		for (i = 0; i < s.outputs.length; i++) {
			if (s.outputs[i].target.id == selectedTarget.id) {
				return true;
			}
		}
		return false;
	};

	Editor.prototype.getMouseButton = function(event) {
		var button;
		if (event.which == null) {
			/* IE case */
			button = (event.button < 2) ? "LEFT"
					: ((event.button == 4) ? "MIDDLE" : "RIGHT");
		} else {
			/* All others */
			button = (event.which < 2) ? "LEFT"
					: ((event.which == 2) ? "MIDDLE" : "RIGHT");
		}
		return button;
	};

	Editor.prototype.doMouseMove = function(evt) {
		evt.preventDefault();
		if (this.mousepressed) {
			if (this.editorStatus == 0) {
				this.mouse1 = this.getPointOnCanvas(evt);
				this.selArea = {
					x0 : Math.floor(this.mouse0.x) + 0.5,
					y0 : Math.floor(this.mouse0.y) + 0.5,
					x1 : Math.floor(this.mouse1.x) + 0.5,
					y1 : Math.floor(this.mouse1.y) + 0.5,
				};
				var bounds = this.getObjectsonBound(this.selected);
				this.updateScrollbar(bounds, dx, dy);
				this.repaint();
			} else if (this.editorStatus == 1 || this.editorStatus == 2) {
				this.mouse1 = this.getPointOnCanvas(evt);
				var dx = this.mouse1.x - this.mouse0.x;
				var dy = this.mouse1.y - this.mouse0.y;
				if (this.canvas.style.cursor == "move") {
					if (this.moveCmd == null || this.moveCmd == undefined) {
						this.moveCmd = new PMMoveTaskCmd(this.selected,
								this.wfprocess);
					}
					this.move(this.selected, dx, dy);
					this.mouse0.x = this.mouse1.x;
					this.mouse0.y = this.mouse1.y;
				} else if (this.canvas.style.cursor == "pointer") { // moving
					if (this.moveCmd == null || this.moveCmd == undefined) {
						this.moveCmd = new PMMoveTransitionBendPointCmd(
								this.selected, this.wfprocess);
					}
					this.moveTransitions(this.selected, dx, dy);
					this.mouse0.x = this.mouse1.x;
					this.mouse0.y = this.mouse1.y;
				} else { // resize
					if (this.mouse0 != null && this.mouse1 != null) {
						if (this.resizeCmd == null) {
							this.resizeCmd = new PMResizeTaskShapeCmd(
									this.selected, this.wfprocess);
						}
						for (var i = 0; i < this.selected.length; i++) {
							if (!(this.selected[i] instanceof StartPoint)
									&& !(this.selected[i] instanceof EndPoint)) {
								var a = this.selected[i];
								var dw = 168; // default, 168px
								var dh = 128; // default, 128px
								if (this.canvas.style.cursor == "nw-resize") {
									if ((a.x1 - (a.x0 + dx) >= dw)
											|| a.x1 - a.x0 < dw) {
										a.x0 += dx;
									}
									if (a.y1 - (a.y0 + dy) >= dh
											|| a.y1 - a.y0 < dh) {
										a.y0 += dy;
									}
								} else if (this.canvas.style.cursor == "n-resize") {
									if (a.y1 - (a.y0 + dy) >= dh
											|| a.y1 - a.y0 < dh) {
										a.y0 += dy;
									}
								} else if (this.canvas.style.cursor == "ne-resize") {
									if ((a.x1 + dx) - a.x0 >= dw
											|| a.x1 - a.x0 < dw) {
										a.x1 += dx;
									}
									if (a.y1 - (a.y0 + dy) >= dh
											|| a.y1 - a.y0 < dh) {
										a.y0 += dy;
									}
								} else if (this.canvas.style.cursor == "e-resize") {
									if ((a.x1 + dx) - a.x0 >= dw
											|| a.x1 - a.x0 < dw) {
										a.x1 += dx;
									}
								} else if (this.canvas.style.cursor == "se-resize") {
									if ((a.x1 + dx) - a.x0 >= dw
											|| a.x1 - a.x0 < dw) {
										a.x1 += dx;
									}
									if ((a.y1 + dy) - a.y0 >= dh
											|| a.y1 - a.y0 < dh) {
										a.y1 += dy;
									}
								} else if (this.canvas.style.cursor == "s-resize") {
									if ((a.y1 + dy) - a.y0 >= dh
											|| a.y1 - a.y0 < dh) {
										a.y1 += dy;
									}
								} else if (this.canvas.style.cursor == "sw-resize") {
									if ((a.x0 + a.x1) - dx >= dw
											|| a.x1 - a.x0 < dw) {
										a.x0 += dx;
									}
									if ((a.y1 + dy) - a.y0 >= dh
											|| a.y1 - a.y0 < dh) {
										a.y1 += dy;
									}
								} else if (this.canvas.style.cursor == "w-resize") {
									if (a.x1 - (a.x0 + dx) >= dw
											|| a.x1 - a.x0 < dw) {
										a.x0 += dx;
									}
								}
							}
						}
						this.mouse0.x = this.mouse1.x;
						this.mouse0.y = this.mouse1.y;
					}
				}
				this.repaint();
			}
		} else {
			if (this.editorStatus == 0) {

			} else if (this.editorStatus == 1 || this.editorStatus == 2) {
				this.canvas.style.cursor = "default";
				var mouse1 = this.getPointOnCanvas(evt);
				var a = this.lookupObjects(mouse1);
				if (a != null && a.selected) {
					this.isRollCoverObject(a, mouse1.x, mouse1.y);
				}
			} else if (this.editorStatus == 4) { // draw transition
				if (this.transition != null) {
					var mouse = this.getPointOnCanvas(evt);
					var o = this.transition.source;
					if (o != null
							&& !(mouse.x < o.x1 && mouse.x > o.x0
									&& mouse.y < o.y1 && mouse.y > o.y0)) {
						var temp = new Transition();
						temp.x0 = this.transition.x0;
						temp.y0 = this.transition.y0;
						temp.x1 = mouse.x;
						temp.y1 = mouse.y;
						temp.source = o;
						temp.target = null;
						temp.updatePosition();
						temp.context = this.context;
						this.repaint();
						temp.drawToContext();
					}
				}
			}
		}
		// code below prevents the mouse down from having an effect on the main
		// browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} // standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} // older IE
	};

	Editor.prototype.doMouseUp = function(evt) {
		evt.preventDefault();
		this.mousepressed = false;
		if (this.editorStatus == 0) {
			if (this.selArea != null) {
				this.selectObjectsInArea(this.wfprocess.children,
						this.selArea.x0, this.selArea.y0, this.selArea.x1,
						this.selArea.y1);
				this.selArea = null;
			}
			if (this.selected.length > 0) {
				this.editorStatus = 1;
			}
			this.setButtonStatus(this.editorStatus);
			this.canvas.style.cursor = "default";
			this.repaint();
			this.setPropertySheet();
		} else if (this.editorStatus == 1 || this.editorStatus == 2) {
			if (this.canvas.style.cursor == "move"
					|| this.canvas.style.cursor == "pointer") {
				if (this.selected.length > 0) {
					for (var i = 0; i < this.selected.length; i++) {
						this.isRollCoverObject(this.selected[i], this.mouse0.x,
								this.mouse0.y);
					}
				}
				if (this.moveCmd != null) {
					this.moveCmd.update(this.selected);
					this.stack.execute(this.moveCmd);
					this.moveCmd = null;
				}
			} else {
				if (this.resizeCmd != null) {
					this.resizeCmd.update(this.selected);
					this.stack.execute(this.resizeCmd);
					this.resizeCmd = null;
				}
			}
			// if (this.moving) {
			// if (this.selected instanceof AbstractTask) {
			// if (this.movecmd != undefined) {
			// this.movecmd.update(this.selected);
			// this.stack.execute(this.movecmd);
			// }
			// this.movecmd = null;
			// } else if (this.selected instanceof Transition) {
			// if (this.movecmd != undefined) {
			// this.movecmd.update(this.selected);
			// this.stack.execute(this.movecmd);
			// }
			// this.movecmd = null;
			// }
			// this.moving = false;
			// }
		} else if (this.editorStatus == 3) { // draw task
			var mouse = this.getPointOnCanvas(e);
			var part = this.addTask(mouse);
			this.doCreationAction(part);
		}
		this.canvas.style.cursor = "default"; // resume cursor to default

		this.mouse0 = null;
		this.mouse1 = null;
		// code below prevents the mouse down from having an effect on the main
		// browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} // standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} // older IE
	};

	Editor.prototype.doCreationAction = function(obj) {
		// var that = this;
		// $.getJSON(service.api(2)).complete(function(data) {
		// 	obj.id = data.responseText;
		// 	that.addtoGraph(obj);
		// });
	};

	Editor.prototype.addtoGraph = function(part) {
		if (part instanceof AbstractTask) {
			this.stack.execute(new PMCreateTaskCmd(part, this.wfprocess, this));
		} else if (part instanceof Transition) {
			this.stack.execute(new PMCreateTransitionCmd(part, this.wfprocess,
					this));
			this.transition = null;
		}
		this.creating = null;
		this.editorStatus = 1;
	};

	Editor.prototype.addTask = function(mouse) {
		var task = null;
		if (this.creating == "st") {
			task = new StartPoint();
			task.name = Utils.stringify("起点");
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 48;
			task.y1 = task.y0 + 48;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		} else if (this.creating == "ed") {
			task = new EndPoint();
			task.name = Utils.stringify("终点");
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 48;
			task.y1 = task.y0 + 48;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		} else if (this.creating == "man") {
			task = new ManualTask();
			task.name = Utils.stringify("人工任务"
					+ this.wfprocess.getNewTaskNumber());
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 168;// 250;
			task.y1 = task.y0 + 128;// 200;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		} else if (this.creating == "sys") {
			task = new SystemTask();
			task.name = Utils.stringify("系统任务"
					+ this.wfprocess.getNewTaskNumber());
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 168;
			task.y1 = task.y0 + 128;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		} else if (this.creating == "ass") {
			task = new AssignTask();
			task.name = Utils.stringify("赋值"
					+ this.wfprocess.getNewTaskNumber());
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 168;
			task.y1 = task.y0 + 128;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		} else if (this.creating == "wait") {
			task = new WaitingTask();
			task.name = Utils.stringify("延迟"
					+ this.wfprocess.getNewTaskNumber());
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 168;
			task.y1 = task.y0 + 128;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		} else if (this.creating == "sub") {
			task = new SubprocessPoint();
			task.name = Utils.stringify("子流程"
					+ this.wfprocess.getNewTaskNumber());
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 168;
			task.y1 = task.y0 + 128;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		} else if (this.creating == "ein") {
			task = new EmailReceivingTask();
			task.name = Utils.stringify("查收邮件"
					+ this.wfprocess.getNewTaskNumber());
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 168;
			task.y1 = task.y0 + 128;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		} else if (this.creating == "eout") {
			task = new EmailSendingTask();
			task.name = Utils.stringify("发送邮件"
					+ this.wfprocess.getNewTaskNumber());
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 168;
			task.y1 = task.y0 + 128;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		} else if (this.creating == "smsin") {
			task = new SMSReceivingTask();
			task.name = Utils.stringify("查收短信"
					+ this.wfprocess.getNewTaskNumber());
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 168;
			task.y1 = task.y0 + 128;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		} else if (this.creating == "smsout") {
			task = new SMSSendingTask();
			task.name = Utils.stringify("发送短信"
					+ this.wfprocess.getNewTaskNumber());
			task.x0 = Math.floor(mouse.x) + 0.5;
			task.y0 = Math.floor(mouse.y) + 0.5;
			task.x1 = task.x0 + 168;
			task.y1 = task.y0 + 128;
			task.context = this.context;
			task.selected = true;
			task.currOwner = this.wfprocess.id;
			task.owner = this.options.owner;
			task.lastupdate = Utils.getCurrentDateTime();
		}

		return task;
	};

	Editor.prototype.addTransition = function(mouse, target) {
		var t = new Transition();
		var n = this.transition.source.getNewNumber();
		t.name = Utils.stringify("连接" + n);
		t.orderNumber = n;
		t.x0 = this.transition.x0;
		t.y0 = this.transition.y0;
		t.x1 = Math.floor((target.x0 + target.x1) / 2) + 0.5;
		t.y1 = Math.floor((target.y0 + target.y1) / 2) + 0.5;
		t.context = this.context;
		t.source = this.transition.source;
		t.target = target;
		t.selected = true;
		t.currOwner = this.wfprocess.id;
		t.owner = this.options.owner;
		t.lastupdate = Utils.getCurrentDateTime();
		t.updatePosition();
		return t;
	};

	Editor.prototype.repaint = function() {
		this.context.clearRect(0, 0, 2400, 1200);
		this.wfprocess.drawToContext();
		if (this.selArea != null) {
			Utils.drawDashedLine(this.canvas, this.selArea.x0, this.selArea.y0,
					this.selArea.x1, this.selArea.y0); // h: l->r
			Utils.drawDashedLine(this.canvas, this.selArea.x0, this.selArea.y1,
					this.selArea.x1, this.selArea.y1); // h: l->r
			Utils.drawDashedLine(this.canvas, this.selArea.x1, this.selArea.y0,
					this.selArea.x1, this.selArea.y1); // v: u->d
			Utils.drawDashedLine(this.canvas, this.selArea.x0, this.selArea.y0,
					this.selArea.x0, this.selArea.y1); // v: u->d
		}
	};

	Editor.prototype.cloneSelectedObjects = function(sel) {
		// this clone only clone a position and selected status.
		var selection = [];
		if (sel.length > 0) {
			for (var i = 0; i < sel.length; i++) {
				selection[i] = sel[i].clone();
				if (sel[i] instanceof AbstractTask) {
					if (sel[i].inputs.length > 0) {
						for (var j = 0; j < sel[i].inputs.length; j++) {
							selection[i].addInput(sel[i].inputs[j].clone());
						}
					}
					if (sel[i].outputs.length > 0) {
						for (var j = 0; j < sel[i].outputs.length; j++) {
							selection[i].addOutput(sel[i].outputs[j].clone());
						}
					}
				}
			}
		}
		return selection;
	};

	Editor.prototype.lookupObjects = function(mouse) {
		var children = this.wfprocess.children;
		var selectedObjects = [];
		for (i = 0; i < children.length; i++) {
			if (children[i] instanceof AbstractTask) {
				if (this.isRollCoverObject(children[i], mouse.x, mouse.y)) {
					selectedObjects.push(children[i]);
				}
				if (children[i].outputs.length > 0) {
					for (j = 0; j < children[i].outputs.length; j++) {
						if (this.isRollCoverObject(children[i].outputs[j],
								mouse.x, mouse.y)) {
							selectedObjects.push(children[i].outputs[j]);
						}
					}
				}
			}
		}
		if (selectedObjects.length > 0) {
			return selectedObjects[0];
		} else {
			return null;
		}
	};

	Editor.prototype.isRollCoverObject = function(obj, x0, y0) {
		if (obj instanceof AbstractTask) {
			if (obj.x0 <= x0 && obj.x1 >= x0 && obj.y0 <= y0 && obj.y1 >= y0) {
				this.canvas.style.cursor = "move";
				return true;
			}
			if (obj.isInMark(x0, y0) != "default") {
				this.canvas.style.cursor = obj.isInMark(x0, y0);
				return true;
			}
		} else if (obj instanceof Transition) {
			if (obj.isInMark(x0, y0) != "default") {
				this.canvas.style.cursor = obj.isInMark(x0, y0);
			}
			var precision = 2.0;
			if (obj.bendpoints == null) {
				if ((x0 >= obj.x0 - precision && x0 <= obj.x1 + precision
						&& y0 <= obj.y1 + precision && y0 >= obj.y0 - precision)
						|| (x0 >= obj.x1 - precision
								&& x0 <= obj.x0 + precision
								&& y0 <= obj.y1 + precision && y0 >= obj.y0
								- precision)
						|| (x0 >= obj.x0 - precision
								&& x0 <= obj.x1 + precision
								&& y0 <= obj.y0 + precision && y0 >= obj.y1
								- precision)
						|| (x0 >= obj.x1 - precision
								&& x0 <= obj.x0 + precision
								&& y0 <= obj.y0 + precision && y0 >= obj.y1
								- precision)) {
					//
					if (obj.x1 != obj.x0) {
						var k = 1.0 * (obj.y1 - obj.y0) / (obj.x1 - obj.x0);
						var d = Math.abs(k * x0 - y0 + obj.y0 - k * obj.x0)
								/ (1 + k * k);
						if (d <= precision) {
							return true;
						}
					} else if (obj.x1 == obj.x0) {
						if (x0 - obj.x0 <= precision) {
							return true;
						}
					}
				}
			} else {
				if ((x0 >= obj.x0 - precision
						&& x0 <= obj.bendpoints.x + precision
						&& y0 <= obj.bendpoints.y + precision && y0 >= obj.y0
						- precision)
						|| (x0 >= obj.bendpoints.x - precision
								&& x0 <= obj.x0 + precision
								&& y0 <= obj.bendpoints.y + precision && y0 >= obj.y0
								- precision)
						|| (x0 >= obj.x0 - precision
								&& x0 <= obj.bendpoints.x + precision
								&& y0 <= obj.y0 + precision && y0 >= obj.bendpoints.y
								- precision)
						|| (x0 >= obj.bendpoints.x - precision
								&& x0 <= obj.x0 + precision
								&& y0 <= obj.y0 + precision && y0 >= obj.bendpoints.y
								- precision)
						|| (x0 >= obj.bendpoints.x - precision
								&& x0 <= obj.x1 + precision
								&& y0 <= obj.y1 + precision && y0 >= obj.bendpoints.y
								- precision)
						|| (x0 >= obj.x1 - precision
								&& x0 <= obj.bendpoints.x + precision
								&& y0 <= obj.y1 + precision && y0 >= obj.bendpoints.y
								- precision)
						|| (x0 >= obj.bendpoints.x - precision
								&& x0 <= obj.x1 + precision
								&& y0 <= obj.bendpoints.y + precision && y0 >= obj.y1
								- precision)
						|| (x0 >= obj.x1 - precision
								&& x0 <= obj.bendpoints.x + precision
								&& y0 <= obj.bendpoints.y + precision && y0 >= obj.y1
								- precision)) {
					if (obj.bendpoints.x != obj.x0) {
						var k = 1.0 * (obj.bendpoints.y - obj.y0)
								/ (obj.bendpoints.x - obj.x0);
						var d = Math.abs(k * x0 - y0 + obj.y0 - k * obj.x0)
								/ (1 + k * k);
						if (d <= precision) {
							return true;
						}
					} else if (obj.bendpoints.x == obj.x0) {
						if (x0 - obj.x0 <= precision) {
							return true;
						}
					}
					if (obj.x1 != obj.bendpoints.x) {
						var k = 1.0 * (obj.y1 - obj.bendpoints.y)
								/ (obj.x1 - obj.bendpoints.x);
						var d = Math.abs(k * x0 - y0 + obj.y1 - k * obj.x1)
								/ (1 + k * k);
						if (d <= precision) {
							return true;
						}
					} else if (obj.x1 == obj.bendpoints.x) {
						if (x0 - obj.bendpoints.x <= precision) {
							return true;
						}
					}
					/*
					 * if (a.getCurveLine() != null &&
					 * a.getCurveLine().contains(x0, y0)) { return true; }
					 */
				}
			}
		}
		return false;
	};

	Editor.prototype.disableSelectedObjects = function() {
		var children = this.wfprocess.children;
		for (i = 0; i < children.length; i++) {
			if (children[i] instanceof AbstractTask) {
				children[i].selected = false;
				if (children[i] != null && children[i] instanceof AbstractTask
						&& children[i].hasOutputs()) {
					for (j = 0; j < children[i].outputs.length; j++) {
						// draw output transitions...
						if (children[i].outputs[j].selected) {
							children[i].outputs[j].selected = false;
						}
					}
				}
			}
		}
		this.selected = []; // clear selected objects
	};

	Editor.prototype.selectAllObjects = function(children) {
		for (var i = 0; i < children.length; i++) {
			children[i].selected = true;
			this.selected.push(children[i]);
			if (children[i] != null && children[i] instanceof AbstractTask
					&& children[i].hasOutputs()) {
				for (j = 0; j < children[i].outputs.length; j++) {
					children[i].outputs[j].selected = true;
					this.selected.push(children[i].outputs[j]);
				}
			}
		}
	};

	Editor.prototype.selectObjectsInArea = function(children, x0, y0, x1, y1) {
		for (var i = 0; i < children.length; i++) {
			if (x0 <= children[i].x0 && x1 >= children[i].x1
					&& y0 <= children[i].y0 && y1 >= children[i].y1) {
				children[i].selected = true;
				this.selected.push(children[i]);
			}
			if (children[i] != null && children[i] instanceof AbstractTask
					&& children[i].hasOutputs()) {
				for (j = 0; j < children[i].outputs.length; j++) {
					if (x0 <= children[i].outputs[j].x0
							&& x1 >= children[i].outputs[j].x1
							&& y0 <= children[i].outputs[j].y0
							&& y1 >= children[i].outputs[j].y1) {
						children[i].outputs[j].selected = true;
						this.selected.push(children[i].outputs[j]);
					}
				}
			}
		}
	};

	Editor.prototype.dropinSelected = function(obj) {
		obj.selected = true;
		this.selected.push(obj);
	};

	Editor.prototype.withinSelected = function(obj) {
		for (var i = 0; i < this.selected.length; i++) {
			if (this.selected[i].id == obj.id) {
				return true;
			}
		}
		return false;
	};

	Editor.prototype.dropoutSelected = function(obj) {
		for (var i = 0; i < this.selected.length; i++) {
			if (this.selected[i].id == obj.id) {
				this.selected[i].selected = false;
				this.selected.splice(i, 1);
			}
		}
	};

	Editor.prototype.updateScrollbar = function(aObjs, dx, dy) {
		var r = {
			x : this.canvasPane.scrollLeft,
			y : this.canvasPane.scrollTop,
			width : this.canvasPane.clientWidth,
			height : this.canvasPane.clientHeight,
		};
		if (aObjs[0] != null && aObjs[0].y0 < r.y && r.y > 0) {
			this.scrollUp(dy); // top bound
		}
		if (aObjs[1] != null && aObjs[1].y1 > r.y + r.height) {
			this.scrollDown(dy); // bottom bound
		}
		if (aObjs[2] != null && aObjs[2].x0 > 0 && aObjs[2].x0 < r.x) {
			this.scrollLeft(dx); // left bound
		}
		if (aObjs[3] != null && aObjs[3].x1 > r.x + r.width) {
			this.scrollRight(dx); // right bound
		}
	};

	Editor.prototype.scrollUp = function(dy) {
		if (this.canvasPane.scrollTop + dy > 0)
			this.canvasPane.scrollTop = this.canvasPane.scrollTop + dy;
		else
			this.canvasPane.scrollTop = 0;
	};

	Editor.prototype.scrollDown = function(dy) {
		if (this.canvasPane.scrollTop + dy < 1200)
			this.canvasPane.scrollTop = this.canvasPane.scrollTop + dy;
		else
			this.canvasPane.scrollTop = 1200;
	};

	Editor.prototype.scrollLeft = function(dx) {
		if (this.canvasPane.scrollLeft + dx > 0)
			this.canvasPane.scrollLeft = this.canvasPane.scrollLeft + dx;
		else
			this.canvasPane.scrollLeft = 0;
	};

	Editor.prototype.scrollRight = function(dx) {
		if (this.canvasPane.scrollLeft + dx < 2400)
			this.canvasPane.scrollLeft = this.canvasPane.scrollLeft + dx;
		else
			this.canvasPane.scrollLeft = 2400;
	};

	Editor.prototype.getObjectsonBound = function(selected) {
		var bounds = []; // 0: top; 1: bottom; 2: left; 3: right
		if (selected.length > 0) {
			bounds[0] = bounds[1] = bounds[2] = bounds[3] = selected[0];
			for (var i = 0; i < selected.length; i++) {
				if (selected[i] instanceof AbstractTask) {
					var tmp = 0;
					if (selected[i].y0 < bounds[0].y0) {
						bounds[0] = selected[i];
					}
					if (selected[i].y1 > bounds[1].y1) {
						bounds[1] = selected[i];
					}
					if (selected[i].x0 < bounds[2].x0) {
						bounds[2] = selected[i];
					}
					if (selected[i].x1 > bounds[3].x1) {
						bounds[3] = selected[i];
					}
				} else if (selected[i] instanceof Transition) {
					if (selected[i].bendpoints != undefined
							&& selected[i].bendpoints != null) {
						if (selected[i].bendpoints.y < bounds[0].y0) {
							bounds[0] = selected[i];
						}
						if (selected[i].bendpoints.y > bounds[1].y1) {
							bounds[1] = selected[i];
						}
						if (selected[i].bendpoints.x < bounds[2].x0) {
							bounds[2] = selected[i];
						}
						if (selected[i].bendpoints.x > bounds[3].x1) {
							bounds[3] = selected[i];
						}
					}
				}
			}
		}
		return bounds;
	};

	Editor.prototype.adjustInputOutput = function(selected) {
		for (var i = 0; i < selected.length; i++) {
			if (selected[i] instanceof AbstractTask) {
				if (selected[i].inputs.length > 0) {
					for (var j = 0; j < selected[i].inputs.length; j++) {
						selected[i].inputs[j].updatePosition();
					}
				}
				if (selected[i].outputs.length > 0) {
					for (var j = 0; j < selected[i].outputs.length; j++) {
						selected[i].outputs[j].updatePosition();
					}
				}
			} else if (selected[i] instanceof Transition) {
				selected[i].updatePosition();
			}
		}
	};

	Editor.prototype.leftAlignment = function(selected) {
		if (selected.length > 0) {
			var aCmd = new PMAlignmentNodesCmd(selected, this.wfprocess);
			var bounds = this.getObjectsonBound(selected);
			var lb = bounds[2].x0;//
			for (var i = 0; i < selected.length; i++) {
				var w = selected[i].x1 - selected[i].x0;
				selected[i].x0 = lb;
				selected[i].x1 = lb + w;
			}
			this.adjustInputOutput(selected);
			aCmd.update(selected);
			this.stack.execute(aCmd);
			aCmd = null;
		}
	};

	Editor.prototype.centerAlignment = function(selected) {
		if (selected.length > 0) {
			var aCmd = new PMAlignmentNodesCmd(selected, this.wfprocess);
			var bounds = this.getObjectsonBound(selected);
			var lb = bounds[0].x0;//
			for (var i = 0; i < selected.length; i++) {
				var w = selected[i].x1 - selected[i].x0;
				selected[i].x0 = lb;
				selected[i].x1 = lb + w;
			}
			this.adjustInputOutput(selected);
			aCmd.update(selected);
			this.stack.execute(aCmd);
			aCmd = null;
		}
	};

	Editor.prototype.rightAlignment = function(selected) {
		if (selected.length > 0) {
			var aCmd = new PMAlignmentNodesCmd(selected, this.wfprocess);
			var bounds = this.getObjectsonBound(selected);
			var lb = bounds[3].x0;//
			for (var i = 0; i < selected.length; i++) {
				var w = selected[i].x1 - selected[i].x0;
				selected[i].x0 = lb;
				selected[i].x1 = lb + w;
			}
			this.adjustInputOutput(selected);
			aCmd.update(selected);
			this.stack.execute(aCmd);
			aCmd = null;
		}
	};

	Editor.prototype.topAlignment = function(selected) {
		if (selected.length > 0) {
			var aCmd = new PMAlignmentNodesCmd(selected, this.wfprocess);
			var bounds = this.getObjectsonBound(selected);
			var tb = bounds[0].y0;//
			for (var i = 0; i < selected.length; i++) {
				var h = selected[i].y1 - selected[i].y0;
				selected[i].y0 = tb;
				selected[i].y1 = tb + h;
			}
			this.adjustInputOutput(selected);
			aCmd.update(selected);
			this.stack.execute(aCmd);
			aCmd = null;
		}
	};

	Editor.prototype.middleAlignment = function(selected) {
		if (selected.length > 0) {
			var aCmd = new PMAlignmentNodesCmd(selected, this.wfprocess);
			var bounds = this.getObjectsonBound(selected);
			var tb = bounds[2].y0;
			for (var i = 0; i < selected.length; i++) {
				var h = selected[i].y1 - selected[i].y0;
				selected[i].y0 = tb;
				selected[i].y1 = tb + h;
			}
			this.adjustInputOutput(selected);
			aCmd.update(selected);
			this.stack.execute(aCmd);
			aCmd = null;
		}
	};

	Editor.prototype.bottomAlignment = function(selected) {
		if (selected.length > 0) {
			var aCmd = new PMAlignmentNodesCmd(selected, this.wfprocess);
			var bounds = this.getObjectsonBound(selected);
			var tb = bounds[1].y0;
			for (var i = 0; i < selected.length; i++) {
				var h = selected[i].y1 - selected[i].y0;
				selected[i].y0 = tb;
				selected[i].y1 = tb + h;
			}
			this.adjustInputOutput(selected);
			aCmd.update(selected);
			this.stack.execute(aCmd);
			aCmd = null;
		}
	};

	Editor.prototype.setButtonStatus = function(editorStatus) {
		if (editorStatus == 0 || editorStatus == 3) { // no selection or
			// drawing
			this.setOpStatus(false, false, false, false, false, false, false,
					false, false);
		} else if (editorStatus == 1) { // single selection
			this.setOpStatus(true, true, true, false, false, false, false,
					false, false);
		} else if (editorStatus == 2) { // multiple selection
			this.setOpStatus(true, true, true, true, true, true, true, true,
					true);
		}
	}

	Editor.prototype.setOpStatus = function(cp, ct, rm, l, c, r, t, m, b) {
		if (cp) {
			this.enableButton(this.copybutton);
		} else {
			this.disableButton(this.copybutton);
		}
		this.disableButton(this.pastebutton);
		if (ct) {
			this.enableButton(this.cutbutton);
		} else {
			this.disableButton(this.cutbutton);
		}
		if (rm) {
			this.enableButton(this.deletebutton);
		} else {
			this.disableButton(this.deletebutton);
		}
		if (l) {
			this.enableButton(this.lbutton);
		} else {
			this.disableButton(this.lbutton);
		}
		if (c) {
			this.enableButton(this.cbutton);
		} else {
			this.disableButton(this.cbutton);
		}
		if (r) {
			this.enableButton(this.rbutton);
		} else {
			this.disableButton(this.rbutton);
		}
		if (t) {
			this.enableButton(this.tbutton);
		} else {
			this.disableButton(this.tbutton);
		}
		if (m) {
			this.enableButton(this.mbutton);
		} else {
			this.disableButton(this.mbutton);
		}
		if (b) {
			this.enableButton(this.bbutton);
		} else {
			this.disableButton(this.bbutton);
		}
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