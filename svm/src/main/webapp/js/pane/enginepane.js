/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "engineInfoPane";
	var defaults = {
		id : "",
		pid : "",
		basicpropsheet : "",
		propsheet : "",
		width : 0,
		height : 0,
		parent : "",
	};

	var ViewPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			pid : "",
			basicpropsheet : "",
			propsheet : "",
			width : 0,
			height : 0,
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
		lpane.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		lpane.style.margin = "0px";
		lpane.style.padding = "2px";

		var wfeForm = this.createPanel(lpane, "流程执行服务");

		var rpane = document.createElement("DIV");
		modalframe.appendChild(rpane);
		rpane.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		rpane.style.margin = "0px";
		rpane.style.padding = "2px";

		var teForm = this.createPanel(rpane, "事务执行服务");

		// this.label18 = this.createComp(wfeForm, "流程执行服务名");
		this.label19 = this.createComp(wfeForm, "状态");
		this.label20 = this.createComp(wfeForm, "已运行");
		this.label21 = this.createComp(wfeForm, "重启次数");
		this.label22 = this.createComp(wfeForm, "运行实例");
		this.label23 = this.createComp(wfeForm, "排队实例");
		this.label24 = this.createComp(wfeForm, "完成实例");
		this.label25 = this.createComp(wfeForm, "暂停实例");
		this.label26 = this.createComp(wfeForm, "终止实例");
		this.label27 = this.createComp(wfeForm, "吞吐量");
		this.label28 = this.createComp(wfeForm, "成功率");

		this.label29 = this.createComp(teForm, "状态");
		this.label30 = this.createComp(teForm, "已运行");
		this.label32 = this.createComp(teForm, "运行事务");
		this.label33 = this.createComp(teForm, "排队事务");
		this.label34 = this.createComp(teForm, "完成事务");
		this.label35 = this.createComp(teForm, "暂停事务");
		this.label36 = this.createComp(teForm, "终止事务");
		this.label37 = this.createComp(teForm, "吞吐量");
		this.label38 = this.createComp(teForm, "成功率");

	};

	ViewPanel.prototype.loadData = function(obj) {
		this.label19.innerHTML = obj.peStatus;
		this.label20.innerHTML = obj.peRunned;
		this.label21.innerHTML = obj.peRestarted;
		this.label22.innerHTML = obj.peRunning;
		this.label23.innerHTML = obj.peQueuing;
		this.label24.innerHTML = obj.peCompleted;
		this.label25.innerHTML = obj.peSuspended;
		this.label26.innerHTML = obj.peTerminated;
		this.label27.innerHTML = obj.peThroughout;
		this.label28.innerHTML = obj.peSuccessRate;

		this.label29.innerHTML = obj.teStatus;
		this.label30.innerHTML = obj.teRunned;
		this.label32.innerHTML = obj.teRunning;
		this.label33.innerHTML = obj.teQueuing;
		this.label34.innerHTML = obj.teCompleted;
		this.label35.innerHTML = obj.teSuspended;
		this.label36.innerHTML = obj.teTerminated;
		this.label37.innerHTML = obj.teThroughout;
		this.label38.innerHTML = obj.teSuccessRate;
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