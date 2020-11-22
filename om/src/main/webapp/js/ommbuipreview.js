;
(function($, window, document, undefined) {
	var pluginName = "mbUIPreview";
	var defaults = {
        id : "",
        owner : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
            owner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.currObject = null;
		this.canvas = null;
		this.context = null;
		// 0: default status;
		// 1: single selection;
		// 2: multiple selection;
		// 3: draw department;
		this.editorStatus = 0;
		this.moving = false;
		this.resizing = false;
		// d: division; e: department; f: project team
		this.creating = null;
		this.selected = []; // selected objects
		this.mouse0 = null;
		this.mouse1 = null;
		this.mousepressed = false;
		this.sliding = false;
		this.currBoardIndex = -1;

		this.init(options);
		this.shading(options);
		
		this.loading(options);
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
		this.painterRow.style.marginTop = "2px";
		this.painterRow.style.padding = "0px";
	};

    Editor.prototype.loading = function(options) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(38, options.owner), {
            cateid : options.id,
        }).complete(function(data) {
            if (data.responseText != "") {
                var c = JSON.parse(data.responseText);
                var cate = new Category();
                cate.parseFromJSON(c);
                that.currObject = cate.mbUIContent;
                that.currObject.setPreview();
                that.loadData(options);
            }
            $("#progressbar").hide();
        });
    };

	Editor.prototype.loadData = function(options) {
;		var tb = this.currObject.children[0].getTopBar();
        this.initialize();
        this.repaint();
    };

    Editor.prototype.initialize = function() {
        this.currObject.context = this.context;
        if (this.currObject.children.length > 0) {
            var tb = this.currObject.children[this.currObject.selectBoardIndex]
                .getTopBar();
            if (tb != null) {
                var item = tb.getSelectedItem();
                if (item != null) {
                    this.currObject.children[this.currObject.selectBoardIndex]
                        .addChild(item.children);
                } else {
                    item = tb.getFirstItem();
                    if (item != null) {
                        item.setSelected(true);
                        this.currObject.children[this.currObject.selectBoardIndex]
                            .addChild(item.children);
                    }
                }
            }
        }
    };

	Editor.prototype.shading = function(options) {
        var table = document.createElement("table");
        this.painterRow.appendChild(table);
        table.style.width = "100%";

		var tr = document.createElement("tr");
        table.appendChild(tr);

        var td1 = document.createElement("td");
        tr.appendChild(td1);
        td1.style.width = "30%";
        td1.innerHTML = "&nbsp;";

        var td2 = document.createElement("td");
        tr.appendChild(td2);
        td2.style.width = "600px";
		
		var canvasPanel = document.createElement("DIV");
        td2.appendChild(canvasPanel);
		canvasPanel.style.width = "600px";

		this.canvasPane = document.createElement("DIV");
		canvasPanel.appendChild(this.canvasPane);
		this.canvasPane.id = "mbconvasPane" + options.pid;

		this.canvasPane.style.overflowX = "auto";
		this.canvasPane.style.overflowY = "auto";

		this.canvas = document.createElement("canvas");
		this.canvasPane.appendChild(this.canvas);

		this.canvas.id = 'painterconvas' + options.id;
		this.canvas.style.cursor = "default";
		this.canvas.width = 600;
		this.canvas.height = 1100;
		this.context = this.canvas.getContext("2d");
		
		this.canvas.addEventListener("mousedown", this, false);
		this.canvas.addEventListener('mousemove', this, false);
		this.canvas.addEventListener('mouseup', this, false);
		window.addEventListener('keydown', this, true);

		var td3 = document.createElement("DIV");
        tr.appendChild(td3);
        td3.style.width = "30%";

	};

    Editor.prototype.repaint = function() {
        this.context.clearRect(0, 0, 600, 1100);
        this.currObject.drawOnContext();
    };

    Editor.prototype.lookupObjects = function(mouse) {
        return this.currObject.findCovered(mouse.x, mouse.y);
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
	};

	Editor.prototype.setCursor = function(cursor) {
		this.canvas.style.cursor = cursor;
	};

	Editor.prototype.doKeypress = function(evt) {
		// evt = evt || window.event;
		// if (evt.ctrlKey) {
		// if (evt.keyCode == '65') { // A
		// this.selectAllObjects(this.currObject.children);
		// } else if (evt.keyCode == '38') { // up arrow
		// this.move(this.selected, 0, -1);
		// } else if (evt.keyCode == '40') { // down arrow
		// this.move(this.selected, 0, 1);
		// } else if (evt.keyCode == '37') { // left arrow
		// this.move(this.selected, -1, 0);
		// } else if (evt.keyCode == '39') { // right arrow
		// this.move(this.selected, 1, 0);
		// // } else if (evt.keyCode == '67') { // Copy
		// // } else if (evt.keyCode == '86') { // Paste
		// // } else if (evt.keyCode == '88') { // Cut
		// } else if (evt.keyCode == '80') { // Print
		// } else if (evt.keyCode == '122') { // Ctrl + Z: undo
		// this.stack.undo();
		// } else if (evt.keyCode == '121') { // Ctrl + Y: redo
		// this.stack.redo();
		// }
		// } else {
		// if (evt.keyCode == '27') { // Esc key
		// this.disableSelectedObjects(this.currObject.children);
		// } else if (evt.keyCode == '38') { // up arrow
		// this.move(this.selected, 0, -5);
		// } else if (evt.keyCode == '40') { // down arrow
		// this.move(this.selected, 0, 5);
		// } else if (evt.keyCode == '37') { // left arrow
		// this.move(this.selected, -5, 0);
		// } else if (evt.keyCode == '39') { // right arrow
		// this.move(this.selected, 5, 0);
		// } else if (evt.keyCode == '112') { // F1 help
		//
		// }
		// }
		// this.repaint();
	};

	Editor.prototype.doMouseDown = function(evt) {
		Utils.stopDefaultEvent(evt);
		this.mousepressed = true;
		this.mouse0 = this.getPointOnCanvas(evt);
		if (this.editorStatus == 0) { // default status
			var a = this.lookupObjects(this.mouse0);
			if (a != null) {
				if (a instanceof MbTopBarItem) {
                    this.currObject.findCurrentBoard().addChild(a.children);
				}
				this.editorStatus = 1;
			}
			this.repaint();
		} else if (this.editorStatus == 1 || this.editorStatus == 2) {
			// single selection
			if (evt.ctrlKey) {

			} else {
				var a = this.lookupObjects(this.mouse0);
				if (a != null) {
                    if (a instanceof MbTopBarItem) {
                        this.currObject.findCurrentBoard().addChild(a.children);
                    }
                    this.editorStatus = 1;
				}
			}
			this.repaint();
		} else if (this.editorStatus == 3) { // draw department
			this.setCursor("crosshair");
			this.repaint();
		}
	};

	Editor.prototype.doMouseMove = function(evt) {
	};

	Editor.prototype.doMouseUp = function(evt) {
		evt.preventDefault();
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