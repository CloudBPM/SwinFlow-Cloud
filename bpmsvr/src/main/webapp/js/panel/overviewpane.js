/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "overviewPane";
	var defaults = {
		id : "",
	};

	var OverviewPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = options.entity;
		this.init(options);
	};

	OverviewPanel.prototype.loadPane = function(entity) {
		this.entity = entity;
		this.init(this.options);
	};

	OverviewPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		this.element.appendChild(modalframe);

		var row1 = document.createElement("DIV");
		modalframe.appendChild(row1);
		row1.className = "row";
		row1.style.marginTop = "2px";

		var col1 = document.createElement("DIV");
		row1.appendChild(col1);
		col1.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		var vmForm = this.createPanel(col1, "服务器");

		var col2 = document.createElement("DIV");
		row1.appendChild(col2);
		col2.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		var jdkForm = this.createPanel(col2, "Java虚拟机");

		var row2 = document.createElement("DIV");
		modalframe.appendChild(row2);
		row2.className = "row";

		var col3 = document.createElement("DIV");
		row2.appendChild(col3);
		col3.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		var mwForm = this.createPanel(col3, "中间件");

		var col4 = document.createElement("DIV");
		row2.appendChild(col4);
		col4.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		var wfeForm = this.createPanel(col4, "流程执行服务");

		var row3 = document.createElement("DIV");
		modalframe.appendChild(row3);
		row3.className = "row";

		var col5 = document.createElement("DIV");
		row3.appendChild(col5);
		col5.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		var teForm = this.createPanel(col5, "事务执行服务");

		this.label1 = this.createComp(vmForm, "机器名");
		this.label2 = this.createComp(vmForm, "处理器");
		this.label3 = this.createComp(vmForm, "日期时间");
		this.label4 = this.createComp(vmForm, "操作系统");
		this.label5 = this.createComp(vmForm, "内存");
		this.label6 = this.createComp(vmForm, "交换区");
		this.label7 = this.createComp(vmForm, "IPv4");
		this.label8 = this.createComp(vmForm, "IPv6");

		this.label9 = this.createComp(jdkForm, "JDK");
		this.label10 = this.createComp(jdkForm, "JVM内存");
		this.label11 = this.createComp(jdkForm, "总线程");
		this.label12 = this.createComp(jdkForm, "峰值线程");
		this.label13 = this.createComp(jdkForm, "活动线程");
		this.label14 = this.createComp(jdkForm, "守护线程");

		this.label15 = this.createComp(mwForm, "名称");
		this.label16 = this.createComp(mwForm, "端口");
		this.label17 = this.createComp(mwForm, "参数");

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

	OverviewPanel.prototype.createPanel = function(parent, title) {
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

	OverviewPanel.prototype.createComp = function(parent, title) {
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

	OverviewPanel.prototype.loadData = function(obj) {
		this.label1.innerHTML = obj.name;
		this.label2.innerHTML = obj.processors;
		this.label3.innerHTML = obj.serverDatetime;
		this.label4.innerHTML = obj.os;
		this.label7.innerHTML = obj.ipv4;
		this.label9.innerHTML = obj.jdkName;
		this.label10.innerHTML = Utils.formatBytes(obj.totalJVMMemory, 2) + "/"
				+ Utils.formatBytes(obj.freeJVMMemory, 2) + "/"
				+ Utils.formatBytes(obj.maxJVMMemory, 2);
		this.label11.innerHTML = obj.totalThreads;
		this.label12.innerHTML = obj.peakThreads;
		this.label13.innerHTML = obj.activeThreads;
		this.label14.innerHTML = obj.demonThreads;

		this.label15.innerHTML = obj.mwName;
		this.label16.innerHTML = obj.mwPort;
		this.label17.innerHTML = obj.mwParameters;

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

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new OverviewPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);