/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "positionKPIPane";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		entity : "",
		topparent : "",
		tabid : "",
	};

	var PositionKPIPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			parent : "",
			entity : "",
			topparent : "",
			tabid : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent = options.topparent;
		this.tabId = options.tabid;
		this.entity = options.entity;
		this.init(options);
	};

	PositionKPIPanel.prototype.init = function(options) {
		this.entity = options.entity;
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var form = document.createElement("form");
		modalframe.appendChild(form);
		form.className = "form-horizontal";

		// KPI
		var kpigroup = document.createElement("div");
		form.appendChild(kpigroup);
		kpigroup.style.padding = "2px";
		kpigroup.className = "form-group";

		var kpiLabel = document.createElement("label");
		kpigroup.appendChild(kpiLabel);
		kpiLabel.className = "col-sm-3 control-label";
		kpiLabel.innerHTML = "KPI指标";

		var kpidiv = document.createElement("div");
		kpidiv.className = "col-sm-9 col-xs-12";
		kpigroup.appendChild(kpidiv);

		this.kpiInput = document.createElement("input");
		this.kpiInput.type = "text";
		this.kpiInput.id = "kpiInput" + options.id;
		this.kpiInput.name = "kpiInput" + options.id;
		this.kpiInput.className = "form-control";
		this.kpiInput.setAttribute("placeholder", "KPI指标");
		kpidiv.appendChild(this.kpiInput);

		// KPI权重
		var wgroup = document.createElement("div");
		form.appendChild(wgroup);
		wgroup.style.padding = "2px";
		wgroup.className = "form-group";

		var wLabel = document.createElement("label");
		wgroup.appendChild(wLabel);
		wLabel.className = "col-sm-3 control-label";
		wLabel.innerHTML = "KPI指标";

		var wdiv = document.createElement("div");
		wdiv.className = "col-sm-9 col-xs-12";
		wgroup.appendChild(wdiv);

		this.wInput = document.createElement("input");
		this.wInput.type = "text";
		this.wInput.id = "wInput" + options.id;
		this.wInput.name = "wInput" + options.id;
		this.wInput.className = "form-control";
		this.wInput.setAttribute("placeholder", "KPI权重");
		wdiv.appendChild(this.wInput);
		
		// 目标完成工作量
		var tgroup = document.createElement("div");
		form.appendChild(tgroup);
		tgroup.style.padding = "2px";
		tgroup.className = "form-group";

		var tLabel = document.createElement("label");
		tgroup.appendChild(tLabel);
		tLabel.className = "col-sm-3 control-label";
		tLabel.innerHTML = "目标工作量";

		var tdiv = document.createElement("div");
		tdiv.className = "col-sm-9 col-xs-12";
		tgroup.appendChild(tdiv);

		this.tInput = document.createElement("input");
		this.tInput.type = "text";
		this.tInput.id = "tInput" + options.id;
		this.tInput.name = "tInput" + options.id;
		this.tInput.className = "form-control";
		this.tInput.setAttribute("placeholder", "目标工作量");
		tdiv.appendChild(this.tInput);
		
		// 已经完成工作量
		var cgroup = document.createElement("div");
		form.appendChild(cgroup);
		cgroup.style.padding = "2px";
		cgroup.className = "form-group";

		var cLabel = document.createElement("label");
		cgroup.appendChild(cLabel);
		cLabel.className = "col-sm-3 control-label";
		cLabel.innerHTML = "已经完成工作量";

		var cdiv = document.createElement("div");
		cdiv.className = "col-sm-9 col-xs-12";
		cgroup.appendChild(cdiv);

		this.cInput = document.createElement("input");
		this.cInput.type = "text";
		this.cInput.id = "wInput" + options.id;
		this.cInput.name = "wInput" + options.id;
		this.cInput.readOnly = true;
		this.cInput.className = "form-control";
		this.cInput.setAttribute("placeholder", "已经完成工作量");
		cdiv.appendChild(this.cInput);

	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new PositionKPIPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);