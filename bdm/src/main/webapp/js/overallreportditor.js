;
(function($, window, document, undefined) {
	var pluginName = "overallReportEditor";
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
		this.basicpropsheet = options.parent.basicpropertySheets;
		this.propsheet = options.parent.propertySheets;

		this.initMainPanel(options);
		this.createToolbar(options);
		this.initCanvas(options);

		// this.loading(options);
	};

	Editor.prototype.loading = function(options) {
		var that = this;
		// $("#progressbar").show();
		// $.getJSON(service.api(20), {
		// 	id : options.id,
		// }).complete(function(data) {
		// 	that.wfprocess.parseFromJSON(data.responseJSON);
		// 	that.wfprocess.setContext(that.context);
		// 	that.repaint();
		// 	that.setPropertySheet();
		// 	$("#progressbar").hide();
		// });
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
		var g3 = this.createGroup(parent);
		this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
				c, "i", "fa fa-print fa-lg");

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

		var w = document.documentElement.clientWidth;
		canvasPanel.id = "canvasPanel" + options.id;
		canvasPanel.className = "col";
		canvasPanel.style.width = (w - 568) + "px";// 640;
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
		this.canvasPane.style.height = options.parent.tabsHeight + "px";

		var tabDIV = document.createElement("DIV");
		this.canvasPane.appendChild(tabDIV);
		// tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs overallreport-nav-tabs";
		tabUL.id = "overallreport-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);

		var tabContents = document.createElement("DIV");
		tabDIV.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "overallreporttabs";

		this.newTabHead(tabUL, 0, "业务运行汇总", true);
		this.newTabHead(tabUL, 1, "业务运行图", false);

		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		var plugin1 = $(this.tabContent1).overallReportPane({
			id : "tab0" + options.id,
			ownerid : options.id,
			parent : this.canvasPane,
			topparent : options.parent,
		});
		this.egnPane = plugin1.data("overallReportPane");

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
//		var plugin2 = $(this.tabContent2).overviewAllPane({
//			id : "tab1" + options.id,
//			parent : "",
//		});
//		this.schPane = plugin2.data("overviewAllPane");

		var that = this;
		$("#overallreport-props-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(4));
		});
		$(
				'#overallreport-props-nav-tabs a[href="#overallreporttab'
						+ this.currtabindex + '"]').tab('show');

	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.printbutton
				|| evt.target.id == ("print" + this.options.id)) {
			console.log("5");
		}
	};

	Editor.prototype.setPropertySheet = function() {
		// var obj = this.wfprocess;
		// if (this.basicpropsheet != null) {
		// this.basicpropsheet.setSheet(obj, this.wfprocess);
		// }
		// if (this.propsheet != null) {
		// this.propsheet.setSheet(obj, this.wfprocess, this.propsheet
		// .getCurrTabIndex(obj));
		// }
	};
	
	Editor.prototype.newTabHead = function(parent, index, caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#tab" + index + this.options.id);
		tabLink.setAttribute("aria-controls", "tab" + index + this.options.id);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	Editor.prototype.newTabContent = function(parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "tab" + index + this.options.id);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "tab" + index + this.options.id;
		return tabContent;
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