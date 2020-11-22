;
(function($, window, document, undefined) {
	var pluginName = "rlfmEditor";
	var defaults = {
		id : "",
		fid : "",
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
			id : "",// tab ID, e.g., "tab1", "tab2"
			fid : "",
			basicpropsheet : "",
			propsheet : "",
			width : 0,
			height : 0,
			parent : "",
			owner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.painterRow = null;
		this.toolbarRow = null;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;

		this.init(options);
		// this.pallet(options);
		// this.createToolbar(options);

		var currObject = new ReleasedForm();
		currObject.id = options.id;
		currObject.owner = options.ownerId;
		this.currObject = currObject;
		this.loadingObject(options);// loading
		this.selected = null; // the selected object;

		window.addEventListener('keydown', this, true);

		var p4 = $(this.element).previewDialog({
			id : "FM039",
			title : vendor + " - 表单界面预览效果",
			topparent : options.parent, // main content panel
			owner : options.owner,// organization ID
		});
		this.previewDlg = p4.data("previewDialog");

	};

	Editor.prototype.loadingObject = function(options) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(17), {
			id : options.fid
		}).complete(function(data) {
			that.shading(options);
			that.currObject.parseFromJSON(data.responseJSON, 0);
			that.options.parent.currObject = that.currObject;
			$(that.canvasPane).empty();
			//that.canvasPane.appendChild(that.currObject.dom);
			that.currObject.toDom(that.canvasPane);
			that.setPropertySheet();
			if (that.currObject.deprecated != 0) {
				that.options.parent.wdbutton.classList.add("active");
				that.options.parent.wdbutton.disabled = true;
			} else {
				that.options.parent.rlbutton.classList.add("active");
				that.options.parent.rlbutton.disabled = true;
			}
			$("#progressbar").hide();
		});
	};

	Editor.prototype.init = function(options) {
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
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
		canvasPanel.id = "rlfrmCanvasPanelRL" + options.fid;
		canvasPanel.className = "col";
		canvasPanel.style.width = (options.width - 2) + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginTop = "2px";
		canvasPanel.style.padding = "0px";
		canvasPanel.style.position = "relative";

		this.canvasPane = document.createElement("DIV");
		canvasPanel.appendChild(this.canvasPane);

		// root container
		this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.canvasPane.id = "rlfrmCsnnvasPane" + options.fid;
		this.canvasPane.style.margin = "0px";
		this.canvasPane.style.padding = "3px";
		this.canvasPane.style.backgroundColor = "#f6f6f6";
		this.canvasPane.style.overflowX = "auto";
		this.canvasPane.style.overflowY = "auto";
		this.canvasPane.style.border = "1px solid #ddd";
		this.canvasPane.style.height = options.height + "px";
		this.canvasPane.style.position = "relative";

		// Create a new style tag
		this.style = document.createElement("style");
		// Append the style tag to head
		document.head.appendChild(this.style);
		this.style.setAttribute("type", "text/css");
		this.style.appendChild(this.addFormStyle());
		this.style.appendChild(this.addRowStyle());
		this.style.appendChild(this.addColStyle());
		this.style.appendChild(this.addRemoveLabel());
		this.style.appendChild(this.addRemoveHover());

		this.style.appendChild(this.newComponentLabel());
		this.style.appendChild(this.newComponentHover());

		this.style.appendChild(this.addRowMoveHover());
		this.style.appendChild(this.addColHover());
		this.style.appendChild(this.addFormTitleLabel("表单"));
		this.style.appendChild(this.addRowTitleLabel("行"));
		this.style.appendChild(this.addColTitleLabel("列"));
		this.style.appendChild(this.addComponentOutline());
		this.style.appendChild(this.addOptionStyle());
		this.style.appendChild(this.addComHover());
	};

	Editor.prototype.removeStyle = function(v) {
		this.style.removeChild(v);
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "keypress":
			this.doKeypress(e);
			break;
		case "click":
			this.doClick(e);
			break;
		}
	};

	Editor.prototype.setPropertySheet = function() {

		var obj = this.currObject;
		if (this.selected != null) {
			obj = this.selected;
		}
		if (this.basicpropsheet != null) {
			this.basicpropsheet.setSheet(obj, this.currObject);
		}
		if (this.propsheet != null) {
			this.propsheet.setSheet(obj, this.currObject, this.propsheet
					.getCurrTabIndex(obj));
		}
	};

	Editor.prototype.updateDom = function() {
		var obj = this.currObject;
		if (this.selected != null) {
			obj = this.selected;
		}
		if (this.selected != undefined) {
			this.selected.updateDom();
		}
	};

	Editor.prototype.clearAll = function(evt) {
		this.stack.execute(new FMRemoveAllRowsCmd(this.currObject));
	};

	Editor.prototype.doKeypress = function(evt) {
		evt = evt || window.event;
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
		// //
		// }
		// }
		// this.repaint();
		Utils.stopBubble(evt);
	};

	Editor.prototype.addMediaStyle = function() {
		return document
				.createTextNode("@media only preview and (min-width : 321px) {}");
	}

	Editor.prototype.addFormStyle = function() {
		return document
				.createTextNode(".formedit{cursor:default;position:relative;"
						+ "border:1px solid #ccc;background-color:#FAFAFA;"
						+ "box-sizing:border-box;box-shadow:inset 0 1px 13px rgba(0,0,0,.1);"
						+ "border-radius:4px;margin:0px;padding:25px;width:1920px;min-height:790px;overflow:auto;}"
						+ "");
	};

	Editor.prototype.addRowStyle = function() {
		return document
				.createTextNode(".rowedit{display:block;position:relative;"
						+ "border:1px solid #ddd;background-color:#F5F5F5;"
						+ "box-sizing:border-box;border-radius:4px;margin-top:5px; "
						+ "padding:25px 19px 24px;min-height:195px;overflow:auto;}");
	};

	Editor.prototype.addColStyle = function() {
		return document.createTextNode(".coledit{position:relative;"
				+ "border:1px solid #ddd;background-color:#fff;"
				+ "box-sizing:border-box;border-radius:4px;margin-top:5px;"
				+ "padding:25px 19px 24px;min-height:152px;overflow:auto;}");
	};

	Editor.prototype.addRemoveLabel = function() {
		return document
				.createTextNode(".remove{position:absolute;"
						+ "top:5px;right:5px;z-index:10;opacity:.2;background-color:#d9534f;display:inline;"
						+ "padding:.2em .6em .3em;font-size:75%;color:#fff;border-radius:.25em;"
						+ "text-align:center;font-weight:700;line-height:1;white-space:nowrap;text-decoration:none;}");
	};

	Editor.prototype.newComponentLabel = function() {
		return document
				.createTextNode(".newcomponent{position:absolute;"
						+ "top:5px;right:30px;z-index:11;opacity:.2;background-color:#d9534f;display:inline;"
						+ "padding:.2em .6em .3em;font-size:75%;color:#fff;border-radius:.25em;"
						+ "text-align:center;font-weight:700;line-height:1;white-space:nowrap;text-decoration:none;}");
	};

	Editor.prototype.addRowMoveHover = function() {
		return document.createTextNode(".rowedit:hover{cursor:move;}");
	};

	Editor.prototype.addColHover = function() {
		return document.createTextNode(".coledit:hover{cursor:default;}");
	};

	Editor.prototype.addRemoveHover = function() {
		return document
				.createTextNode(".remove:hover{opacity:1;text-decoration:none;color:#fff;cursor:default;}");
	};

	Editor.prototype.newComponentHover = function() {
		return document
				.createTextNode(".newcomponent:hover{opacity:1;text-decoration:none;color:#fff;cursor:default;}");
	};

	Editor.prototype.addFormTitleLabel = function(title) {
		return document.createTextNode(".formtitle::after{content: '" + title
				+ "';border:1px solid #DDD;"
				+ "border-radius:4px 0;background-color:#F5F5F5;"
				+ "left:-1px;padding:3px 7px;"
				+ "position:absolute;color:#9DA0A4;top:-1px;}");
	};

	Editor.prototype.addRowTitleLabel = function(title) {
		return document.createTextNode(".rowtitle::after{content:'" + title
				+ "';border:1px solid #DDD;"
				+ "border-radius:4px 0;background-color:#F5F5F5;"
				+ "left:-1px;padding:3px 7px;"
				+ "position:absolute;color:#9DA0A4;top:-1px;}");
	};

	Editor.prototype.addColTitleLabel = function(title) {
		return document.createTextNode(".coltitle::after{content:'" + title
				+ "';border:1px solid #DDD;"
				+ "border-radius:4px 0;background-color:#F5F5F5;"
				+ "left:-1px;padding:3px 7px;"
				+ "position:absolute;color:#9DA0A4;top:-1px;}");
	};

	Editor.prototype.addComponentOutline = function(title) {
		return document.createTextNode(".comp_outline{position:relative;"
				+ "border:#ddd dashed 1px;background-color:#fff;"
				+ "box-sizing:border-box;visibility:visible!important;"
				+ "border-radius:4px;margin:0px;padding:10px;}");
	};

	Editor.prototype.addOptionStyle = function() {
		return document
				.createTextNode(".checkradioedit{border:1px solid #ddd;"
						+ "background-color:#F5F5F5;padding-left:40px;padding-top:10px;padding-bottom:5px;"
						+ "padding-right:45px;border-radius:4px;}");
	};

	Editor.prototype.addComHover = function() {
		return document.createTextNode(".checkradioedit:hover{cursor:move;}");
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