/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "bulletinBoard";
	var defaults = {
		id : "",
		loginpane : "",
		url : "",
	};

	var BulletinBoard = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			loginpane : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	BulletinBoard.prototype.init = function(options) {
		var container = document.createElement("DIV");
		container.className = "container-fluid";
		this.element.appendChild(container);

		var head = document.createElement("DIV");
		head.className = "col-xs-12 col-sm-12 col-md-4 col-lg-4";
		container.appendChild(head);

		var formbody = document.createElement("DIV");
		formbody.className = "col-xs-12 col-sm-12 col-md-4 col-lg-4";
		container.appendChild(formbody);

		var panel = document.createElement("DIV");
		panel.className = "panel panel-default";
		formbody.appendChild(panel);
		panel.style.display = "none";
		panel.style.backgroundColor = "#eee";

		this.messagePane = document.createElement("DIV");
		this.messagePane.className = "panel-body";
		panel.appendChild(this.messagePane);

		this.loadData(this.messagePane, panel, options.loginpane);

	};

	BulletinBoard.prototype.loadData = function(pane, parent, loginpane) {
		$.get(this.options.url, {}).complete(
				function(data) {
					if (data.responseJSON != null) {
						var o = data.responseJSON;
						if (o.pcContent != undefined) {
							if (o.banStartTime > 0 && o.banEndTime > 0) {
								var d = new Date();
								if (d.getTime() < o.banStartTime) {
									parent.style.display = "";
									pane.innerHTML = o.pcContent;
									loginpane.setDisabled(false);
								} else if (d.getTime() >= o.banStartTime
										&& d.getTime() <= o.banEndTime) {
									parent.style.display = "";
									pane.innerHTML = o.pcContent;
									if (o.banned == 1) {
										loginpane.setDisabled(true);
									} else {
										loginpane.setDisabled(false);
									}
								} else if (d.getTime() > o.banEndTime) {
									loginpane.setDisabled(false);
									parent.style.display = "none";
									pane.innerHTML = "";
								}
							}
						}
					} else {
						loginpane.setDisabled(false);
						parent.style.display = "none";
						pane.innerHTML = "";
					}
				});
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new BulletinBoard(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);