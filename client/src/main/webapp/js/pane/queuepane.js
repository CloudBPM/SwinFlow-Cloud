/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "queuePane";
	var defaults = {
		id : "",
		uid : "",
		parent : "",
	};

	var Board = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			uid : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	Board.prototype.init = function(options) {
		this.board = document.createElement("DIV");
		this.element.appendChild(this.board);
		this.show(false);

		var panel = document.createElement("DIV");
		this.board.appendChild(panel);
		panel.className = "container-fluid";

		var panelRow1 = document.createElement("DIV");
		panel.appendChild(panelRow1);
		panelRow1.className = "row";

		var panelCol4 = document.createElement("DIV");
		panelRow1.appendChild(panelCol4);
		panelCol4.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		this.createTitle(panelCol4, "fa fa-briefcase", "待办", "#652514");

		// row0
		var panelRow1 = document.createElement("DIV");
		panel.appendChild(panelRow1);
		panelRow1.className = "row";

		var panelCol1 = document.createElement("DIV");
		panelRow1.appendChild(panelCol1);
		panelCol1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		if ($(panelCol4).myWorkListPanelforPC != undefined) {
			var board = $(panelCol4).myWorkListPanelforPC({
				id : "workItemPanel",
				parent : this,
				uid : options.uid,
				topparent : options.parent,
				source : 1,
			});
			this.workItemPane = board.data("myWorkListPanelforPC");
		}
	};

	Board.prototype.refresh = function() {
		this.workItemPane.refresh();
	};

	Board.prototype.createTitle = function(parent, icon, title, color) {
		var titleSpan = document.createElement("SPAN");
		parent.appendChild(titleSpan);

		var h3 = document.createElement("H3");
		titleSpan.appendChild(h3);
		h3.className = "page-header";
		h3.style.margin = "0";

		var span = document.createElement("SPAN");
		h3.appendChild(span);
		span.className = icon;
		span.setAttribute("aria-hidden","true");
		span.style.color = color;

		var text = document.createTextNode(" " + title);
		h3.appendChild(text);

		return titleSpan;
	};

	Board.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	Board.prototype.show = function(show) {
		if (show) {
			this.workItemPane.refresh();
			this.board.style.display = "";
		} else {
			this.board.style.display = "none";
		}
	};

	Board.prototype.doClick = function(evt) {

	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Board(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);