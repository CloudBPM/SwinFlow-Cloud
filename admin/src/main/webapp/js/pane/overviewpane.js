/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "overviewAllPane";
	var defaults = {
		id : "",
		parent : "",
	};

	var ViewPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	ViewPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		this.element.appendChild(modalframe);

		var lpane = document.createElement("DIV");
		modalframe.appendChild(lpane);
		lpane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		lpane.style.margin = "0px";
		lpane.style.padding = "2px";

		var wfeForm = this.createPanel(lpane, "应用执行服务");

	};

	ViewPanel.prototype.loadData = function(obj) {
	};

	ViewPanel.prototype.createPanel = function(parent, title) {
		var panelDiv = document.createElement("DIV");
		parent.appendChild(panelDiv);
		panelDiv.className = "panel panel-default";

		if (title != "") {
			var panelHeadDiv = document.createElement("DIV");
			panelDiv.appendChild(panelHeadDiv);
			panelHeadDiv.className = "panel-heading";
			panelHeadDiv.innerHTML = title;
		}

		var panelBodyDiv = document.createElement("DIV");
		panelDiv.appendChild(panelBodyDiv);
		panelBodyDiv.className = "panel-body";

		var panelForm = document.createElement("Form");
		panelBodyDiv.appendChild(panelForm);
		panelForm.className = "form-horizontal"
		return panelForm;
	};

	ViewPanel.prototype.createComp = function(parent, title) {
		var gDiv = document.createElement("DIV");
		parent.appendChild(gDiv);
		gDiv.className = "form-group";

		var label = document.createElement("Label");
		gDiv.appendChild(label);
		label.className = "col-sm-3 control-label";
		label.innerHTML = title;

		var colDIV = document.createElement("DIV");
		gDiv.appendChild(colDIV);
		colDIV.className = "col-sm-9";

		var p = document.createElement("P");
		colDIV.appendChild(p);
		p.className = "form-control-static";
		return p;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ViewPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);