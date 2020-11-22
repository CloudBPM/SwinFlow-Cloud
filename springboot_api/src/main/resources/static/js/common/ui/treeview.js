/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "treeViewer";
	var defaults = {
		title : "",
		topparent : "",
		parent : "",
	};

	var TreeViewer = function(element, options) {
		this.element = element;
		this.options = $.extend({
			title : "",
			topparent : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	TreeViewer.prototype.init = function(options) {
		this.topparent = options.topparent;
		
		this.panelDiv = document.createElement("DIV");
		this.element.appendChild(this.panelDiv);
		this.panelDiv.className = "panel panel-default";
		this.panelDiv.style.marginBottom = "0px";

		// Panel Header DIV
		var panelHeaderDIV = document.createElement("DIV");
		this.panelDiv.appendChild(panelHeaderDIV);
		panelHeaderDIV.className = "panel-heading";
		panelHeaderDIV.innerHTML = options.title;
		
		var panelToolbar = document.createElement("UL");
		panelHeaderDIV.appendChild(panelToolbar);
		panelToolbar.className = "nav navbar-nav navbar-right";
		panelToolbar.style.paddingRight = "10px";

		this.refreshButton = this.createToolbarItem(panelToolbar, "refreshT", "刷新",
				"glyphicon glyphicon-refresh", "btn btn-primary btn-xs");

		// Panel Body DIV
		this.treeviewer = document.createElement("DIV");
		this.panelDiv.appendChild(this.treeviewer);
		this.treeviewer.id = "treeview";
		this.treeviewer.style.overflow = "auto";
		var that = this;
		this.instance = options.parent.loadTreeViewer(this.treeviewer);
		
	};
	
	TreeViewer.prototype.createToolbarItem = function(parent, id, title,
			icon, classname) {
		var toolItem = document.createElement("li");
		toolItem.style.padding = "2px";
		parent.appendChild(toolItem);
		var toolButton = document.createElement("button");
		toolItem.appendChild(toolButton);
		toolButton.type = "button";
		toolButton.id = id;
		toolButton.className = classname;
		toolButton.setAttribute("title", title);
		toolButton.addEventListener("click", this, false);
		var toolSpan = document.createElement("span");
		toolSpan.className = icon;
		toolSpan.id = id;
		toolButton.appendChild(toolSpan);
		return toolButton;
	};
	
	TreeViewer.prototype.doClick = function(evt) {
		if (evt.target == this.refreshButton || evt.target.id == "refreshT") {
			$(this.treeviewer).data('jstree', false).empty();
			this.options.parent.loadTreeViewer(this.treeviewer)
		}
	};
	
	TreeViewer.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new TreeViewer(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);