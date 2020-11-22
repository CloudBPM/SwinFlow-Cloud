/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "searchConditionPane";
	var defaults = {
		id : "",
		pid : "",
		basicpropsheet : "",
		propsheet : "",
		width : 0,
		height : 0,
		parent : "",
	};

	var SearchConditionPanel = function(element, options) {
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

	SearchConditionPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		this.element.appendChild(modalframe);

		var schpane = document.createElement("DIV");
		modalframe.appendChild(schpane);
		schpane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		schpane.style.margin = "0px";
		schpane.style.padding = "2px";

		var schForm = this.createPanel(schpane, "");

		var gDiv = document.createElement("DIV");
		schForm.appendChild(gDiv);
		gDiv.className = "form-group";

		var label1 = document.createElement("Label");
		gDiv.appendChild(label1);
		label1.className = "col-sm-2 control-label";
		label1.innerHTML = "搜索条件";

		var colDIV = document.createElement("DIV");
		gDiv.appendChild(colDIV);
		colDIV.className = "col-sm-10";

		var sDiv = document.createElement("DIV");
		colDIV.appendChild(sDiv);
		sDiv.className = "input-group";

		this.searchInput = document.createElement("INPUT");
		sDiv.appendChild(this.searchInput);
		this.searchInput.className = "form-control";
		this.searchInput.type = "text";
		this.searchInput.setAttribute("placeholder",
				"流程名称；政府企事业单位名称；流程发起人（姓名、证件号等）");

		var sSpan = document.createElement("SPAN");
		sDiv.appendChild(sSpan);
		sSpan.className = "input-group-btn";

		this.sButton = document.createElement("BUTTON");
		sSpan.appendChild(this.sButton);
		this.sButton.className = "btn btn-primary";

		var i = document.createElement("I");
		this.sButton.appendChild(i);
		i.className = "fa fa-search fa-lg";

		// 
		var gDiv1 = document.createElement("DIV");
		schForm.appendChild(gDiv1);
		gDiv1.className = "form-group";

		var label2 = document.createElement("Label");
		gDiv1.appendChild(label2);
		label2.className = "col-sm-2 control-label";
		label2.innerHTML = "流程状态";

		var colDIV2 = document.createElement("DIV");
		gDiv1.appendChild(colDIV2);
		colDIV2.className = "col-sm-10";

		this.statusSelect = document.createElement("SELECT");
		colDIV2.appendChild(this.statusSelect);
		this.statusSelect.className = "form-control";

		this.addOptions(this.statusSelect, "- 请选择 -", "-1", 0);
		this.addOptions(this.statusSelect, "正在执行", "0", 1);
		this.addOptions(this.statusSelect, "暂停执行", "1", 2);
		this.addOptions(this.statusSelect, "执行异常", "2", 3);
		this.addOptions(this.statusSelect, "终止异常", "3", 4);
		this.addOptions(this.statusSelect, "已经完成", "4", 5);
		// 
		var gDiv2 = document.createElement("DIV");
		schForm.appendChild(gDiv2);
		gDiv2.className = "form-group";

		var label3 = document.createElement("Label");
		gDiv2.appendChild(label3);
		label3.className = "col-sm-2 control-label";
		label3.innerHTML = "启动时间";

		var label4 = document.createElement("Label");
		gDiv2.appendChild(label4);
		label4.className = "col-sm-1 control-label";
		label4.innerHTML = "从";

		var colDIV3 = document.createElement("DIV");
		gDiv2.appendChild(colDIV3);
		colDIV3.className = "col-sm-4";

		this.fromDateInput = document.createElement("INPUT");
		colDIV3.appendChild(this.fromDateInput);
		this.fromDateInput.className = "form-control";

		$(this.fromDateInput).datetimepicker({
			dateFormat : "yy-mm-dd",
			timeFormat : "HH:mm:ss",
		});

		var label5 = document.createElement("Label");
		gDiv2.appendChild(label5);
		label5.className = "col-sm-1 control-label";
		label5.innerHTML = "到";

		var colDIV4 = document.createElement("DIV");
		gDiv2.appendChild(colDIV4);
		colDIV4.className = "col-sm-4";

		this.toDateInput = document.createElement("INPUT");
		colDIV4.appendChild(this.toDateInput);
		this.toDateInput.className = "form-control";

		$(this.toDateInput).datetimepicker({
			dateFormat : "yy-mm-dd",
			timeFormat : "HH:mm:ss",
		});

		var resultForm = this.createPanel(schpane, "");
	};

	SearchConditionPanel.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	SearchConditionPanel.prototype.createPanel = function(parent, title) {
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

	SearchConditionPanel.prototype.loadData = function(obj) {
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new SearchConditionPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);