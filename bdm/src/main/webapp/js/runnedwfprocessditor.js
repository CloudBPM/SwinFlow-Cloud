;
(function($, window, document, undefined) {
	var pluginName = "runnedWfProcessEditor";
	var defaults = {
		id : "",
		pid : "",// released process ID
		basicpropsheet : "",
		propsheet : "",
		width : 0,
		height : 0,
		parent : "",
		owner : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			pid : "",// released process
			basicpropsheet : "",
			propsheet : "",
			width : 0,
			height : 0,
			parent : "",
			owner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = options.parent.stack;
		this.painterRow = null;
		this.toolbarRow = null;
		this.wfprocess = new ReleasedWfProcess();
		this.canvas = null;
		this.context = null;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;

		// 0: default status; 1: single selection;
		// 2: multiple selection; 3: draw task; 4: draw transition;
		this.editorStatus = 0;
		this.selected = []; // selected objects
		this.selectionBuffer = []; // temporary store selected objects
		this.transition = null; // temporary transition variable
		this.mouse0 = null;
		this.mouse1 = null;
		this.mousepressed = false;
		this.selArea = null;
		this.moveCmd = null;
		this.resizeCmd = null;

		this.initMainPanel(options);
		this.initCanvas(options);

		this.loading(options);
	};

	Editor.prototype.loading = function(options) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(20, options.owner), {
			id : options.pid,
		}).complete(function(data) {
			that.wfprocess.parseFromJSON(data.responseJSON);
			that.wfprocess.setContext(that.context);
			that.options.parent.wfprocess = that.wfprocess;
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
		this.painterRow.style.marginTop = "2px";
		this.painterRow.style.padding = "0px";
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

	Editor.prototype.initCanvas = function(options) {
		var canvasPanel = document.createElement("DIV");
		this.painterRow.appendChild(canvasPanel);
		canvasPanel.id = "rlprocCanvasPanel" + options.pid;
		canvasPanel.className = "col";
		// 2 (tab content border)
		canvasPanel.style.width = (options.width) + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginLeft = "0px";
		canvasPanel.style.padding = "0px";

		this.canvasPane = document.createElement("DIV");
		canvasPanel.appendChild(this.canvasPane);

		this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.canvasPane.id = "rlprocConvasPane" + options.pid;
		this.canvasPane.style.margin = "0px";
		this.canvasPane.style.padding = "0px";
		this.canvasPane.style.overflowX = "auto";
		this.canvasPane.style.overflowY = "auto";
		this.canvasPane.style.border = "1px solid #ddd";
		this.canvasPane.style.height = options.height + "px";

		this.canvas = document.createElement("canvas");
		this.canvasPane.appendChild(this.canvas);

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
		case "mouseup":
			this.doMouseUp(e);
			break;
		case "mouseout":
			break;
		case "click":
			this.doClick(e);
			break;
		}
	};

	Editor.prototype.doClick = function(evt) {

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