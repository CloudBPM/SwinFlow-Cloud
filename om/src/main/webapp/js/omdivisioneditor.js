;
(function($, window, document, undefined) {
	var pluginName = "omDivisionEditor";
	var defaults = {
		id : "",
		ownerId : "",
		basicpropsheet : "",
		propsheet : "",
		width : 0,
		height : 0,
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
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.painterRow = null;
		this.toolbarRow = null;
		this.currOwner = null;
		this.canvas = null;
		this.context = null;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;

		// 0: default status; 1: single selection; 2: multiple selection; 3:
		// draw department;
		this.editorStatus = 0;
		this.moving = false;
		this.resizing = false;
		// d: division; e: department; f: project team
		this.creating = null;
		this.tmpdepart = null;
		this.selected = []; // selected objects
		this.mouse0 = null;
		this.mouse1 = null;
		this.mousepressed = false;
		this.selArea = null;
		this.changeParentCmd = null;
		this.moveCmd = null;
		this.resizeCmd = null;

		this.init(options);
		this.pallet(options);
		this.shading(options);
		this.createToolbar(options);
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.init = function(options) {
		var currOwner = new Division();
		currOwner.id = options.id;
		currOwner.owner = options.ownerId;
		this.currOwner = currOwner;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.loading(options);

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

	Editor.prototype.loading = function(options) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(omservices.api(5, this.options.ownerId), {
			id : options.id
		}).complete(
				function(data) {
					var data1 = data.responseJSON;
					// if (data1.status != null && data1.status != ""
					// 		&& data1.status != undefined) {
					// 	if (data1.status == 0 || data1.status == -10) {
					// 		messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
					// 		$("#progressbar").hide();
					// 		return ;
					// 	}
						that.currOwner.parseStructureFromJSON(
								data.responseJSON, options.ownerId);
						that.repaint();
						that.setPropertySheet();
						$("#progressbar").hide();
					// }
				});

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
		this.stack.undoButton = this.undobutton;
		this.stack.redoButton = this.redobutton;
		this.disableButton(this.undobutton);
		this.disableButton(this.redobutton);

		var g2 = this.createGroup(parent);
		// this.copybutton = this.createTool(g2, "copy" + this.options.id, "复制",
		// "btn btn-default", "i", "fa fa-files-o");
		// this.pastebutton = this.createTool(g2, "paste" + this.options.id,
		// "粘贴",
		// c, "i", "fa fa-clipboard");
		// this.cutbutton = this.createTool(g2, "cut" + this.options.id, "剪切",
		// c,
		// "i", "fa fa-scissors");
		this.deletebutton = this.createTool(g2, "delete" + this.options.id,
				"删除", c1, "i", "fa fa-trash-o fa-lg");
		// this.disableButton(this.copybutton);
		// this.disableButton(this.pastebutton);
		// this.disableButton(this.cutbutton);
		this.disableButton(this.deletebutton);

		var g3 = this.createGroup(parent);
		this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
				c, "i", "fa fa-print fa-lg");

		var g5 = this.createGroup(parent);
		this.lbutton = this.createTool(g5, "lalign" + this.options.id, "向左对齐",
				c, "span", "glyphicon glyphicon-object-align-left fa-lg");
		this.cbutton = this.createTool(g5, "valign" + this.options.id, "垂直对齐",
				c, "span", "glyphicon glyphicon-object-align-vertical fa-lg");
		this.rbutton = this.createTool(g5, "ralign" + this.options.id, "向右对齐",
				c, "span", "glyphicon glyphicon-object-align-right fa-lg");

		this.tbutton = this.createTool(g5, "talign" + this.options.id, "顶部对齐",
				c, "span", "glyphicon glyphicon-object-align-top fa-lg");
		this.mbutton = this.createTool(g5, "malign" + this.options.id, "中间对齐",
				c, "span", "glyphicon glyphicon-object-align-horizontal fa-lg");
		this.bbutton = this.createTool(g5, "balign" + this.options.id, "底部对齐",
				c, "span", "glyphicon glyphicon-object-align-bottom fa-lg");
		this.disableButton(this.lbutton);
		this.disableButton(this.cbutton);
		this.disableButton(this.rbutton);
		this.disableButton(this.tbutton);
		this.disableButton(this.mbutton);
		this.disableButton(this.bbutton);

		var g4 = this.createGroup(parent);
		this.showallbutton = this.createTool(g4, "showall" + this.options.id,
				"显示全部", c, "span", "glyphicon glyphicon-eye-open fa-lg");

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

	Editor.prototype.pallet = function(options) {
		var palletPanel = document.createElement("DIV");
		this.painterRow.appendChild(palletPanel);
		palletPanel.id = "accordion" + options.id;
		palletPanel.className = "col";
		palletPanel.style.width = "72px";
		palletPanel.style.margin = "0px";
		palletPanel.style.padding = "0px";
		palletPanel.style.overflowY = "auto";
		palletPanel.style.height = (options.height - 84) + "px";
		var group = document.createElement("DIV");
		palletPanel.appendChild(group);
		group.id = "accordion";
		group.className = "panel-group";
		group.style.margin = "0px";
		group.style.padding = "0px";
		group.style.width = "72px";
		group.style.minWidth = "72px";
		group.style.maxWidth = "72px";

		group.setAttribute('role', 'tablist');// $("input").attr("value","txt");
		group.setAttribute('aria-multiselectable', 'true');

		var taskbar1 = this.createPalletBar("One", "Bsc", true, "in", group);
		taskbar1.appendChild(this.createComponentOnBar("一般职位", "e",
				this.currOwner.id, "img/position_32x32.png"));

	};

	Editor.prototype.createComponentOnBar = function(dptname, type, imgid,
			iconsrc) {
		var componentItem = document.createElement("li");
		componentItem.className = "list-group-item";
		var icon = this.createIcon(dptname, type, imgid, iconsrc, this);
		componentItem.appendChild(icon);
		return componentItem;
	};

	Editor.prototype.createIcon = function(taskname, type, imgid, iconsrc,
			parent) {
		var icon = document.createElement("img");
		icon.id = taskname + " " + imgid;
		icon.setAttribute("src", iconsrc);
		icon.setAttribute("title", taskname);
		icon.setAttribute("type", type);
		icon.setAttribute("draggable", "true");
		icon.addEventListener('click', function(e) {
			if (parent.currOwner.children != undefined
					&& parent.currOwner.children.length > 0) {
				if (Utils.isArray(parent.selected)) {
					if (parent.selected.length > 1) {
						alert("select a single object for new component");
						return;
					} else if (parent.selected.length == 0) {
						alert("select a object for new component");
						return;
					}

				}
			}
			parent.setCursor("crosshair");
			parent.creating = this.getAttribute("type");
			parent.editorStatus = 3; // draw
		});
		icon.addEventListener('dragstart', function(e) {
			parent.creating = this.getAttribute("type");
			e.dataTransfer.setData("Text", e.target.id);
		});
		return icon;
	};

	Editor.prototype.shading = function(options) {
		var canvasPanel = document.createElement("DIV");
		this.painterRow.appendChild(canvasPanel);
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
		this.canvas.style.cursor = "default";
		this.canvas.width = 2400;
		this.canvas.height = 1200;
		this.context = this.canvas.getContext("2d");
		this.currOwner.context = this.context;
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
		case "keydown":
			this.doKeypress(e);
			break;
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			e.preventDefault();
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
			// } else if (evt.target == this.copybutton
			// || evt.target.id == ("copy" + this.options.id)) {
			// } else if (evt.target == this.pastebutton
			// || evt.target.id == ("paste" + this.options.id)) {
			// } else if (evt.target == this.cutbutton
			// || evt.target.id == ("cut" + this.options.id)) {
		} else if (evt.target == this.deletebutton
				|| evt.target.id == ("delete" + this.options.id)) {
			this.deleteDeparts(this.selected);
		} else if (evt.target == this.printbutton
				|| evt.target.id == ("print" + this.options.id)) {
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
		}
	};

	Editor.prototype.setPropertySheet = function() {
		var obj = this.currOwner;
		if (this.selected != null && this.selected.length > 0) {
			obj = this.selected[0];
		}
		if (this.basicpropsheet != null) {
			this.basicpropsheet.setSheet(obj);
		}
		if (this.propsheet != null) {
			this.propsheet.setSheet(obj, this.currOwner);
		}
	};

	Editor.prototype.setCursor = function(cursor) {
		this.canvas.style.cursor = cursor;
	};

	Editor.prototype.doKeypress = function(evt) {
		evt = evt || window.event;
		if (evt.ctrlKey) {
			if (evt.keyCode == '65') { // A
				this.selectAllObjects(this.currOwner.children);
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
			} else if (evt.keyCode == '80') { // Print
			} else if (evt.keyCode == '122') { // Ctrl + Z: undo
				this.stack.undo();
			} else if (evt.keyCode == '121') { // Ctrl + Y: redo
				this.stack.redo();
			}
		} else {
			if (evt.keyCode == '27') { // Esc key
				this.disableSelectedObjects(this.currOwner.children);
			} else if (evt.keyCode == '38') { // up arrow
				this.move(this.selected, 0, -5);
			} else if (evt.keyCode == '40') { // down arrow
				this.move(this.selected, 0, 5);
			} else if (evt.keyCode == '37') { // left arrow
				this.move(this.selected, -5, 0);
			} else if (evt.keyCode == '39') { // right arrow
				this.move(this.selected, 5, 0);
			} else if (evt.keyCode == '112') { // F1 help
				// 
			}
		}
		this.repaint();
	};

	Editor.prototype.move = function(selected, dx, dy) {
		for (var i = 0; i < selected.length; i++) {
			if (selected[i].x0 + dx > 0 && selected[i].x1 + dx < 2400) {
				selected[i].x0 += dx;
				selected[i].x1 += dx;
			}
			if (selected[i].y0 + dy > 0 && selected[i].y1 + dy < 1200) {
				selected[i].y0 += dy;
				selected[i].y1 += dy;
			}
			selected[i].lastupdate = new Date().getTime();// Utils.getCurrentDateTime();
		}
		for (var i = 0; i < selected.length; i++) {
			if (selected[i].input != null) {
				selected[i].input.updatePosition();
			}
			if (selected[i].children.length > 0) {
				for (var j = 0; j < selected[i].children.length; j++) {
					if (!selected[i].children[j].selected) {
						selected[i].children[j].input.updatePosition();
					}
				}
			}
		}
		var bounds = this.getObjectsonBound(selected);
		this.updateScrollbar(bounds, dx, dy);
	};

	Editor.prototype.evalMoveNodes = function(selected, newselected) {
		for (var i = 0; i < selected.length; i++) {
			selected[i].x0 = newselected[i].x0;
			selected[i].x1 = newselected[i].x1;
			selected[i].y0 = newselected[i].y0;
			selected[i].y1 = newselected[i].y1;
			selected[i].lastupdate = newselected[i].lastupdate;
		}
		for (var i = 0; i < selected.length; i++) {
			if (selected[i].input != null) {
				selected[i].input.updatePosition();
			}
			if (selected[i].children.length > 0) {
				for (var j = 0; j < selected[i].children.length; j++) {
					selected[i].children[j].input.updatePosition();
				}
			}
		}
	};

	Editor.prototype.doMouseDown = function(evt) {
		evt.preventDefault();
		// get focus
		$('.nav-tabs a[href="#tab_' + this.currOwner.id + '"]').tab('show');
		// this.canvas.focus();
		this.mousepressed = true;
		this.mouse0 = this.getPointOnCanvas(evt);
		if (this.editorStatus == 0) { // default status
			var a = this.lookupObjects(this.mouse0, this.currOwner.children);
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
		} else if (this.editorStatus == 1 || this.editorStatus == 2) { // single
			// selection
			if (evt.ctrlKey) {
				var a = this
						.lookupObjects(this.mouse0, this.currOwner.children);
				if (a != null) {
					if (this.withinSelected(a)) {
						this.dropoutSelected(a);
						this.deselectNodeInTree(a);
					} else {
						this.dropinSelected(a);
						this.selectNodeInTree(a);
					}
				}
			} else {
				var a = this
						.lookupObjects(this.mouse0, this.currOwner.children);
				if (a != null) {
					if (!this.withinSelected(a)) {
						this.disableSelectedObjects(this.currOwner.children);
						this.deselectAllNodesInTree();
						this.dropinSelected(a);
						this.selectNodeInTree(a);
					}
				} else {
					this.disableSelectedObjects(this.currOwner.children);
					this.deselectAllNodesInTree();
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
		} else if (this.editorStatus == 3) { // draw
			this.setButtonStatus(this.editorStatus);
			this.setCursor("crosshair");
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

	Editor.prototype.dropinSelected = function(obj) {
		obj.setSelected(true);
		this.selected.push(obj);
	};

	Editor.prototype.selectNodeInTree = function(obj) {
		var instance = $('#treeview').jstree();
		$('#treeview').jstree('select_node', obj.id);
		instance.redraw(true); // refresh

	};

	Editor.prototype.deselectAllNodesInTree = function() {
		var instance = $('#treeview').jstree();
		$('#treeview').jstree('deselect_all', true);
		instance.redraw(true); // refresh
	};

	Editor.prototype.deselectNodeInTree = function(obj) {
		var instance = $('#treeview').jstree();
		$('#treeview').jstree('deselect_node', obj.id);
		instance.redraw(true); // refresh
	};

	Editor.prototype.dropoutSelected = function(obj) {
		for (var i = 0; i < this.selected.length; i++) {
			if (this.selected[i].id == obj.id) {
				this.selected[i].setSelected(false);
				this.selected.splice(i, 1);
			}
		}
	};

	Editor.prototype.withinSelected = function(obj) {
		for (var i = 0; i < this.selected.length; i++) {
			if (this.selected[i].id == obj.id) {
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
			if (this.getMouseButton(evt) == "LEFT") { // drag
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
					if (this.canvas.style.cursor == "move") { // moving
						if (this.moveCmd == null) {
							this.moveCmd = new OMMoveDepartCmd(this.selected,
									this.currOwner);
						}
						this.move(this.selected, dx, dy);
						if (dx != 0 || dy != 0) {
							this.moving = true;
						}
						this.mouse0.x = this.mouse1.x;
						this.mouse0.y = this.mouse1.y;
					} else if (this.canvas.style.cursor == "pointer") {
						// change currOwner's parent
						if (this.changeParentCmd == null) {
							this.changeParentCmd = new OMChangeParentCmd(
									this.selected, this.currOwner);
						}
						this.mouse1 = this.getPointOnCanvas(evt);
						var dx = this.mouse1.x - this.mouse0.x;
						var dy = this.mouse1.y - this.mouse0.y;
						if (this.mouse0 != null && this.mouse1 != null) {
							this.moveForChangingParent(this.selected, dx, dy);
							this.setCursor("pointer");
						}
						this.mouse0.x = this.mouse1.x;
						this.mouse0.y = this.mouse1.y;
					} else { // resize
						if (this.mouse0 != null && this.mouse1 != null) {
							if (this.resizeCmd == null) {
								this.resizeCmd = new OMResizeDepartCmd(
										this.selected, this.currOwner);
							}
							for (var i = 0; i < this.selected.length; i++) {
								var a = this.selected[i];
								if (this.canvas.style.cursor == "nw-resize") {
									// default, 100px
									if ((a.x1 - (a.x0 + dx) >= 100)
											|| a.x1 - a.x0 < 100) {
										a.x0 += dx;
									}
									// default, 75px
									if (a.y1 - (a.y0 + dy) >= 75
											|| a.y1 - a.y0 < 75) {
										a.y0 += dy;
									}
								} else if (this.canvas.style.cursor == "n-resize") {
									if (a.y1 - (a.y0 + dy) >= 75
											|| a.y1 - a.y0 < 75) {
										a.y0 += dy;
									}
								} else if (this.canvas.style.cursor == "ne-resize") {
									if ((a.x1 + dx) - a.x0 >= 100
											|| a.x1 - a.x0 < 100) {
										a.x1 += dx;
									}
									if (a.y1 - (a.y0 + dy) >= 75
											|| a.y1 - a.y0 < 75) {
										a.y0 += dy;
									}
								} else if (this.canvas.style.cursor == "e-resize") {
									if ((a.x1 + dx) - a.x0 >= 100
											|| a.x1 - a.x0 < 100) {
										a.x1 += dx;
									}
								} else if (this.canvas.style.cursor == "se-resize") {
									if ((a.x1 + dx) - a.x0 >= 100
											|| a.x1 - a.x0 < 100) {
										a.x1 += dx;
									}
									if ((a.y1 + dy) - a.y0 >= 75
											|| a.y1 - a.y0 < 75) {
										a.y1 += dy;
									}
								} else if (this.canvas.style.cursor == "s-resize") {
									if ((a.y1 + dy) - a.y0 >= 75
											|| a.y1 - a.y0 < 75) {
										a.y1 += dy;
									}
								} else if (this.canvas.style.cursor == "sw-resize") {
									if ((a.x0 + a.x1) - dx >= 100
											|| a.x1 - a.x0 < 100) {
										a.x0 += dx;
									}
									if ((a.y1 + dy) - a.y0 >= 75
											|| a.y1 - a.y0 < 75) {
										a.y1 += dy;
									}
								} else if (this.canvas.style.cursor == "w-resize") {
									if (a.x1 - (a.x0 + dx) >= 100
											|| a.x1 - a.x0 < 100) {
										a.x0 += dx;
									}
								}
								if (a.input != null) {
									a.input.updatePosition();
								}
								if (this.selected[i].children.length > 0) {
									for (var j = 0; j < this.selected[i].children.length; j++) {
										if (!this.selected[i].children[j].selected) {
											this.selected[i].children[j].input
													.updatePosition();
										}
									}
								}
							}
							this.mouse0.x = this.mouse1.x;
							this.mouse0.y = this.mouse1.y;
						}
					}
					this.repaint();
				} else if (this.editorStatus == 3) { // draw
					if (this.mouse0 != null) {
						this.mouse1 = this.getPointOnCanvas(evt);
						if (this.creating == "e") {
							this.tmpdepart = new Position();
							this.tmpdepart.name = Utils.stringify("一般职位"
									+ this.currOwner.generateNewNumber());
						}
						this.tmpdepart.context = this.context;
						this.tmpdepart.x0 = Math.floor(this.mouse0.x) + 0.5;
						this.tmpdepart.y0 = Math.floor(this.mouse0.y) + 0.5;
						this.tmpdepart.x1 = Math.floor(this.mouse1.x) + 0.5;
						this.tmpdepart.y1 = Math.floor(this.mouse1.y) + 0.5;
						this.repaint();
						this.tmpdepart.drawToContext();
					}
				}
			}
		} else {
			if (this.editorStatus == 0) {

			} else if (this.editorStatus == 1 || this.editorStatus == 2) {
				this.setCursor("default");
				var mouse1 = this.getPointOnCanvas(evt);
				var a = this.lookupObjects(mouse1, this.currOwner.children);
				if (a != null && a.selected) {
					this.isRollCoverObject(a, mouse1.x, mouse1.y);
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
				this.selectObjectsInArea(this.currOwner.children,
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
			// this.setPropertySheet();
		} else if (this.editorStatus == 1 || this.editorStatus == 2) {
			if (this.canvas.style.cursor == "move") { // moving
				if (this.selected.length > 0) {
					for (var i = 0; i < this.selected.length; i++) {
						this.isRollCoverObject(this.selected[i], this.mouse0.x,
								this.mouse0.y);
					}
				}
				if (this.moveCmd != null && this.moving == true) {
					this.moveCmd.update(this.selected);
					this.stack.execute(this.moveCmd);
					this.moveCmd = null;
				}
			} else if (this.canvas.style.cursor == "pointer") {
				// change parent;
				if (this.changeParentCmd != null) {
					this.changeParentCmd.update(this.selected);
					this.stack.execute(this.changeParentCmd);
					this.changeParentCmd = null;
				}
			} else {
				if (this.resizeCmd != null) {
					this.resizeCmd.update(this.selected);
					this.stack.execute(this.resizeCmd);
					this.resizeCmd = null;
				}
			}
		} else if (this.editorStatus == 3) { // draw
			if (this.tmpdepart == null) { // drag and drop a new component
				this.mouse1 = this.getPointOnCanvas(evt);
				var part = this.addDepartment(this.mouse1);
				this.doCreationAction(part);
			} else {
				var part = this.drawDepartment(this.tmpdepart);
				this.tmpdepart = null;
				this.doCreationAction(part);
			}
		}
		this.setCursor("default"); // resume cursor to default

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

	Editor.prototype.doDrop = function(evt) {
		evt.preventDefault();
		// var data = evt.dataTransfer.getData("Text");
		if (this.currOwner.children.length > 0) {
			if (this.selected.length > 1) {
				var parent = this.selected[0];
				this.disableSelectedObjects(this.currOwner.children);
				this.deselectAllNodesInTree();
				this.dropinSelected(parent);
				this.selectNodeInTree(parent);
			} else if (this.selected.length == 0) {
				alert("select a object for new component");
				return;
			}
		}
		this.setCursor("crosshair");

		this.mouse1 = this.getPointOnCanvas(evt);
		var part = this.addDepartment(this.mouse1);
		this.doCreationAction(part);

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
		var that = this;
		$.getJSON(omservices.api(1, this.options.ownerId)).complete(
				function(data) {
					var data1 = data.responseJSON;
					// if (data1 != null && data1 != ""
					// 		&& data1 != undefined) {
					// 	if (data1.status == 0 || data1.status == -10) {
					// 		messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
					// 		window.location.reload();
					// 	}
					// }
					var bigid = data.responseText;
					obj.id = bigid.substring(0, bigid.indexOf("|"));
					obj.serialNumber = bigid.substring(
							bigid.indexOf("|") + 1, bigid.length);
					that.addtoGraph(obj);
					bigid = null;
					that = null;
					
				});
	};

	Editor.prototype.addtoGraph = function(part) {
		this.stack.execute(new OMCreatePositionCmd(part, this.selected,
				this.currOwner));
		this.creating = null;
		this.editorStatus = 1
	};

	Editor.prototype.doAllowDrop = function(evt) {
		evt.preventDefault();
	};

	// drawing new one
	Editor.prototype.drawDepartment = function(tmpdepart) {
		var part = null;
		if (tmpdepart instanceof Position) {
			part = new Position();
		}
		part.name = tmpdepart.name;
		part.x0 = Math.floor(tmpdepart.x0) + 0.5;
		part.y0 = Math.floor(tmpdepart.y0) + 0.5;
		part.x1 = Math.floor(tmpdepart.x1) + 0.5;
		part.y1 = Math.floor(tmpdepart.y1) + 0.5;
		part.lastupdate = new Date().getTime();// Utils.getCurrentDateTime();
		part.createDate = new Date().getTime();// Utils.getCurrentDate();
		if (part.x1 - part.x0 < 10) {
			part.x1 = 100 + part.x0;// 
		}
		if (part.y1 - part.y0 < 10) {
			part.y1 = 75 + part.y0;// 
		}
		part.context = this.context;
		part.currOwner = this.currOwner.id;
		part.owner = this.options.ownerId;
		return part;
	};

	// drag and drop or click for adding
	Editor.prototype.addDepartment = function(mouse) {
		var part = null;
		if (this.creating == "e") {
			part = new Position();
			part.name = Utils.stringify("一般职位"
					+ this.currOwner.generateNewNumber());
		}
		part.x0 = Math.floor(mouse.x) + 0.5;
		part.y0 = Math.floor(mouse.y) + 0.5;
		part.x1 = 100 + part.x0; // default, 100px
		part.y1 = 75 + part.y0; // default, 75px
		part.lastupdate = new Date().getTime();//Utils.getCurrentDateTime();
		part.createDate = new Date().getTime();//Utils.getCurrentDate();
		part.context = this.context;
		part.currOwner = this.currOwner.id;
		part.owner = this.options.ownerId;
		return part;
	};

	Editor.prototype.repaint = function() {
		this.context.clearRect(0, 0, 2400, 1200);
		this.currOwner.drawToContext1();
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

	Editor.prototype.lookupObjects = function(mouse, children) {
		var selectedObjects = this.searchGraph(mouse, children);
		if (selectedObjects.length > 0) {
			return selectedObjects[0]; // return first one.
		}
		return null;
	};

	Editor.prototype.searchGraph = function(mouse, children) {
		var selectedObjects = [];
		for (var i = 0; i < children.length; i++) {
			if (this.isCovered(children[i], mouse.x, mouse.y)) {
				selectedObjects.push(children[i]);
			}
			if (children[i].children.length > 0) {
				selectedObjects = selectedObjects.concat(this.searchGraph(
						mouse, children[i].children));
			}
		}
		return selectedObjects;
	};

	Editor.prototype.isCovered = function(obj, x0, y0) {
		if (obj.x0 <= x0 && obj.x1 >= x0 && obj.y0 <= y0 && obj.y1 >= y0) {
			this.setCursor("move");
			return true;
		}
		if (obj.isInMark(x0, y0) != "default") {
			this.setCursor(obj.isInMark(x0, y0));
			return true;
		}
		if (obj.input != null && obj.input.isInMark(x0, y0) != "default") {
			this.setCursor(obj.input.isInMark(x0, y0));
			return true;
		}
		return false;
	};

	Editor.prototype.isRollCoverObject = function(obj, x0, y0) {
		if (obj.x0 <= x0 && obj.x1 >= x0 && obj.y0 <= y0 && obj.y1 >= y0) {
			this.setCursor("move");
		}
		if (obj.isInMark(x0, y0) != "default") {
			this.setCursor(obj.isInMark(x0, y0));
		}
		if (obj.input != null && obj.input.isInMark(x0, y0) != "default") {
			this.setCursor(obj.input.isInMark(x0, y0));
		}
	};

	Editor.prototype.disableSelectedObjects = function(children) {
		for (var i = 0; i < children.length; i++) {
			children[i].setSelected(false);
			if (children[i].children.length > 0) {
				this.disableSelectedObjects(children[i].children);
			}
		}
		this.selected = []; // clear selection
	};

	Editor.prototype.selectAllObjects = function(children) {
		for (var i = 0; i < children.length; i++) {
			children[i].setSelected(true);
			this.selected.push(children[i]);
			if (children[i].children.length > 0) {
				this.selectAllObjects(children[i].children);
			}
		}
	};

	Editor.prototype.selectObjectsInArea = function(children, x0, y0, x1, y1) {
		for (var i = 0; i < children.length; i++) {
			if (x0 <= children[i].x0 && x1 >= children[i].x1
					&& y0 <= children[i].y0 && y1 >= children[i].y1) {
				children[i].setSelected(true);
				this.selected.push(children[i]);
			}
			if (children[i].children.length > 0) {
				this.selectObjectsInArea(children[i].children, x0, y0, x1, y1);
			}
		}
	};

	Editor.prototype.cloneSelectedForMoving = function(selected) {
		var selection = [];
		if (selected.length > 0) {
			for (var i = 0; i < selected.length; i++) {
				selection[i] = selected[i].clone();
			}
		}
		return selection;
	};

	Editor.prototype.cloneSelected = function(selected) {
		var selection = [];
		if (selected.length > 0) {
			for (var i = 0; i < selected.length; i++) {
				selection[i] = selected[i].clone();
				if (selected[i].children.length > 0) {
					for (var j = 0; j < selected[i].children.length; j++) {
						this.cloneChild(selected[i].children[j], selection[i]);
					}
				}
			}
		}
		return selection;
	};

	Editor.prototype.cloneChild = function(node, parent) {
		var obj = node.clone();
		parent.addChild(obj);
		obj.input.source = parent;
		obj.parent = parent;
		if (node.children.length > 0) {
			for (var j = 0; j < node.children.length; j++) {
				this.cloneChild(node.children[j], obj);
			}
		}

	};

	Editor.prototype.inSelected = function(node) {
		for (var i = 0; i < this.selected.length; i++) {
			if (this.selected[i].id == node.id) {
				return true;
			}
		}
		return false;
	};

	Editor.prototype.moveForChangingParent = function(selected, dx, dy) {
		for (var i = 0; i < selected.length; i++) {
			this.moveNode(selected[i], dx, dy);
		}
	};

	Editor.prototype.moveNode = function(node, dx, dy) {
		if (node.input != null) {
			node.input.x0 += dx;
			node.input.y0 += dy;
			var m = {
				x : node.input.x0,
				y : node.input.y0
			};
			var a = this.lookupObjects(m, this.currOwner.children);
			if (a != null) {
				a.isnewparent = true;
			}
			node.input.bx += dx;
			node.input.by += dy;
			node.input.cx += dx;
			node.input.cy += dy;
			node.input.hx += dx;
			node.input.hy += dy;
			node.input.x1 += dx;
			node.input.y1 += dy;
		}
		node.x0 += dx;
		node.y0 += dy;
		node.x1 += dx;
		node.y1 += dy;
		if (node.children.length > 0) {
			for (var j = 0; j < node.children.length; j++) {
				if (!node.children[j].selected) {
					this.moveNode(node.children[j], dx, dy);
				}
			}
		}
	};

	Editor.prototype.evalSelectedPositions = function(selected, newselected) {
		for (var i = 0; i < selected.length; i++) {
			this.evalNodePosition(selected[i], newselected[i]);
		}
	};

	Editor.prototype.evalNodePosition = function(node, newnode) {
		if (node.input != null) {
			node.input.x0 = newnode.input.x0;
			node.input.y0 = newnode.input.y0;
			node.input.bx = newnode.input.bx;
			node.input.by = newnode.input.by;
			node.input.cx = newnode.input.cx;
			node.input.cy = newnode.input.cy;
			node.input.hx = newnode.input.hx;
			node.input.hy = newnode.input.hy;
			node.input.x1 = newnode.input.x1;
			node.input.y1 = newnode.input.y1;
		}
		node.x0 = newnode.x0;
		node.y0 = newnode.y0;
		node.x1 = newnode.x1;
		node.y1 = newnode.y1;
		if (node.children.length > 0) {
			for (var j = 0; j < node.children.length; j++) {
				this.evalNodePosition(node.children[j], newnode.children[j]);
			}
		}
	};

	Editor.prototype.deleteDeparts = function(selected) {
		this.stack.execute(new OMRemoveDepartCmd(selected, 1, this.currOwner));
	};

	Editor.prototype.adjustInputOutput = function(selected) {
		for (var i = 0; i < selected.length; i++) {
			if (selected[i].input != null) {
				selected[i].input.updatePosition();
			}
			if (selected[i].children.length > 0) {
				for (var j = 0; j < selected[i].children.length; j++) {
					if (!selected[i].children[j].selected) {
						selected[i].children[j].input.updatePosition();
					}
				}
			}
		}
	};

	Editor.prototype.leftAlignment = function(selected) {
		if (selected.length > 0) {
			var aCmd = new OMAlignmentDepartCmd(selected, this.currOwner);
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
			var aCmd = new OMAlignmentDepartCmd(selected, this.currOwner);
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
			var aCmd = new OMAlignmentDepartCmd(selected, this.currOwner);
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
			var aCmd = new OMAlignmentDepartCmd(selected, this.currOwner);
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
			var aCmd = new OMAlignmentDepartCmd(selected, this.currOwner);
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
			var aCmd = new OMAlignmentDepartCmd(selected, this.currOwner);
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
				if (selected[i] instanceof AbstractDepartment) {
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
				}
			}
		}
		return bounds;
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