/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "myFavorPane";
	var defaults = {
		id : "",
	};

	var Board = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	Board.prototype.init = function(options) {
		this.board = document.createElement("DIV");
		this.element.appendChild(this.board);
		this.board.innerHTML = "My favorate board";
		this.show(false);
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