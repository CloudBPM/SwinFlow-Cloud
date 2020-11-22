/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "testResultsDisplayPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
	};

	var WebAppPropPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent = options.topparent;
		this.entity = options.entity;
		this.currpage = null; // by default;
		this.init(options);
	};

	WebAppPropPanel.prototype.init = function(options) {
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

//		var toolbarDiv = document.createElement("DIV");
//		modalframe.appendChild(toolbarDiv);
//		toolbarDiv.style.margin = "0px";
//		toolbarDiv.style.padding = "2px";
//		toolbarDiv.style.padding = "2px";
//		this.createNavigationGroup(toolbarDiv);

		var tableDiv = document.createElement("DIV");
		modalframe.appendChild(tableDiv);

		this.displaypane = document.createElement("textarea");
		tableDiv.appendChild(this.displaypane);
		this.displaypane.id = "resultdiv" + options.id;
		this.displaypane.className = "form-control";
		this.displaypane.style.marginTop = "2px"
		this.displaypane.style.height = (parseInt(options.topparent.style.height) - 46)
				+ "px";
		this.displaypane.style.overflowY = "auto";
		this.displaypane.style.overflowX = "auto";
		
		this.displaypane.value = this.entity.toString();
	};
	
	WebAppPropPanel.prototype.outputMsg = function(msg) {
		this.displaypane.value += msg + "\n" ;
	};
	
	WebAppPropPanel.prototype.clear = function() {
		this.displaypane.value = "";
	};

//	WebAppPropPanel.prototype.createNavigationGroup = function(parent) {
//		var group1 = this.createGroup(parent);
//		this.clearAllButton = this.createTool(group1, "clearall"
//				+ this.options.id, "清除所有内容", "btn btn-primary btn-xs", "span",
//				"glyphicon glyphicon-remove");
//		this.enableButton(this.clearAllButton);
//	};
//
//	WebAppPropPanel.prototype.doClick = function(evt) {
//		if (evt.target == this.clearAllButton
//				|| (evt.target.id == ("clearall" + this.options.id))) {
//			this.clear();
//		}
//	};
//	WebAppPropPanel.prototype.createGroup = function(parent) {
//		var group = document.createElement("DIV");
//		group.className = "btn-group";
//		group.style.padding = "2px";
//		group.setAttribute("role", "group");
//		group.setAttribute("aria-label", "");
//		parent.appendChild(group);
//		return group;
//	};
//
//	WebAppPropPanel.prototype.createTool = function(group, id, title, style,
//			fonttag, fontclass) {
//		var button = document.createElement("button");
//		button.className = style;
//		button.setAttribute("title", title);
//		button.type = "button";
//		button.id = id;
//		button.addEventListener('click', this, false);
//		group.appendChild(button);
//		var icon = document.createElement(fonttag);
//		icon.addEventListener('click', this, false);
//		icon.className = fontclass;
//		icon.setAttribute("title", title);
//		icon.id = id;
//		button.appendChild(icon);
//		return button;
//	};
//
//	WebAppPropPanel.prototype.handleEvent = function(e) {
//		switch (e.type) {
//		case "click":
//			this.doClick(e);
//			break;
//		}
//	};
//
//	WebAppPropPanel.prototype.enableButton = function(button) {
//		button.removeAttribute("disabled");
//	};
//
//	WebAppPropPanel.prototype.disableButton = function(button) {
//		button.setAttribute("disabled", "true");
//	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new WebAppPropPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);