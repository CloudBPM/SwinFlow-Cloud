/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "listSelectPropPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var BasicPropPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = options.entity;
		this.init(options);
	};

	BasicPropPanel.prototype.loadPane = function(entity) {
		this.entity = entity;
		this.init(this.options);
	};

	BasicPropPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		modalframe.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		modalframe.style.padding = "4px";
		this.element.appendChild(modalframe);

		var form1 = document.createElement("form");
		form1.className = "form-horizontal";
		modalframe.appendChild(form1);

		// option/value
		var group201 = document.createElement("div");
		form1.appendChild(group201);
		group201.className = "form-group";

		var group20 = document.createElement("DIV");
		group201.appendChild(group20);
		group20.className = "col-sm-2";

		var group30 = document.createElement("DIV");
		group201.appendChild(group30);
		group30.className = "col-sm-10 radio";

		var gpLabel30 = document.createElement("LABEL");
		group30.appendChild(gpLabel30);
		gpLabel30.className = "control-label";

		this.gpInput30 = document.createElement("INPUT");
		gpLabel30.appendChild(this.gpInput30);
		this.gpInput30.type = "radio";
		this.gpInput30.name = "ds" + options.id; // data source
		this.gpInput30.id = "ds1" + options.id; // data source
		this.gpInput30.checked = true;
		this.gpInput30.value = "0";
		this.gpInput30.addEventListener("click", this, false);
		gpLabel30.appendChild(document.createTextNode("直接输入选项列表"));

		// option/value
		var group3 = document.createElement("div");
		form1.appendChild(group3);
		group3.className = "form-group";

		var label3 = document.createElement("label");
		group3.appendChild(label3);
		label3.setAttribute("for", "seloptions" + options.id);
		label3.className = "col-sm-2 control-label";
		label3.innerHTML = "&nbsp;";

		var selDiv3 = document.createElement("div");
		selDiv3.className = "col-sm-10";
		group3.appendChild(selDiv3);

		this.optionsTextArea = document.createElement("TEXTAREA");
		selDiv3.appendChild(this.optionsTextArea);
		this.optionsTextArea.id = "seloptions" + options.id;
		this.optionsTextArea.name = "seloptions" + options.id;
		this.optionsTextArea.className = "form-control";
		this.optionsTextArea.rows = "5";
		this.optionsTextArea.setAttribute("placeholder",
				"每个选项由选项值和选项文本构成，中间以半角冒号(:)隔开，加回车换行。如：\n01:中国\n02:美国\n");
		this.optionsTextArea.addEventListener("change", this, false);

		// reference data
		var group301 = document.createElement("DIV");
		form1.appendChild(group301);
		group301.className = "form-group";

		var group302 = document.createElement("DIV");
		group301.appendChild(group302);
		group302.className = "col-sm-2";

		var group31 = document.createElement("DIV");
		group301.appendChild(group31);
		group31.className = "col-sm-10 radio";

		var gpLabel31 = document.createElement("LABEL");
		group31.appendChild(gpLabel31);
		gpLabel31.className = "control-label";

		this.gpInput31 = document.createElement("INPUT");
		gpLabel31.appendChild(this.gpInput31);
		this.gpInput31.type = "radio";
		this.gpInput31.name = "ds" + options.id; // data source
		this.gpInput31.id = "ds2" + options.id; // data source
		this.gpInput31.value = "1";
		this.gpInput31.addEventListener("click", this, false);
		gpLabel31.appendChild(document.createTextNode("引用数据选项列表"));

		// reference data setting
		var group5 = document.createElement("div");
		form1.appendChild(group5);
		group5.className = "form-group";

		var label5 = document.createElement("label");
		group5.appendChild(label5);
		label5.setAttribute("for", "refoptions" + options.id);
		label5.className = "col-sm-2 control-label";
		label5.innerHTML = "&nbsp;";

		var selDiv5 = document.createElement("div");
		group5.appendChild(selDiv5);
		selDiv5.className = "col-sm-5";

		this.optionsRef = document.createElement("SELECT");
		selDiv5.appendChild(this.optionsRef);
		this.optionsRef.id = "refoptions" + options.id;
		this.optionsRef.name = "refoptions" + options.id;
		this.optionsRef.className = "form-control";
		this.optionsRef.addEventListener("change", this, false);

		this.loadOptions(this.options.currowner.owner);

		var selDiv51 = document.createElement("div");
		group5.appendChild(selDiv51);
		selDiv51.className = "col-sm-5";

		this.codeRef = document.createElement("INPUT");
		selDiv51.appendChild(this.codeRef);
		this.codeRef.id = "refcode" + options.id;
		this.codeRef.name = "refcode" + options.id;
		this.codeRef.className = "form-control";
		this.codeRef.addEventListener("change", this, false);

		// micro-service
		var group3040 = document.createElement("div");
		form1.appendChild(group3040);
		group3040.className = "form-group";

		var group3021 = document.createElement("DIV");
		group3040.appendChild(group3021);
		group3021.className = "col-sm-2";

		var group32 = document.createElement("DIV");
		group3040.appendChild(group32);
		group32.className = "col-sm-10 radio";

		var gpLabel32 = document.createElement("LABEL");
		group32.appendChild(gpLabel32);
		gpLabel32.className = "control-label";

		this.gpInput32 = document.createElement("INPUT");
		gpLabel32.appendChild(this.gpInput32);
		this.gpInput32.type = "radio";
		this.gpInput32.name = "ds" + options.id; // data source
		this.gpInput32.id = "ds3" + options.id; // data source
		this.gpInput32.value = "2";
		this.gpInput32.addEventListener("click", this, false);
		gpLabel32.appendChild(document.createTextNode("微服务数据选项列表（建设中...）"));

		var group6 = document.createElement("div");
		form1.appendChild(group6);
		group6.className = "form-group";

		var label6 = document.createElement("label");
		group6.appendChild(label6);
		label6.setAttribute("for", "msoptions" + options.id);
		label6.className = "col-sm-2 control-label";
		label6.innerHTML = "&nbsp;";

		var selDiv6 = document.createElement("div");
		group6.appendChild(selDiv6);
		selDiv6.className = "col-sm-10";

		this.optionsMs = document.createElement("INPUT");
		selDiv6.appendChild(this.optionsMs);
		this.optionsMs.id = "msoptions" + options.id;
		this.optionsMs.name = "msoptions" + options.id;
		this.optionsMs.className = "form-control";
		this.optionsMs.addEventListener("change", this, false);

		// option/value
		var group3 = document.createElement("div");
		group3.className = "form-group";
		form1.appendChild(group3);

		var label3 = document.createElement("label");
		group3.appendChild(label3);
		label3.setAttribute("for", "seloptions" + options.id);
		label3.className = "col-sm-2 control-label";
		label3.innerHTML = "选项列表";

		var selDiv3 = document.createElement("div");
		selDiv3.className = "col-sm-10";
		group3.appendChild(selDiv3);

		this.optionsTextArea1 = document.createElement("TEXTAREA");
		selDiv3.appendChild(this.optionsTextArea1);
		this.optionsTextArea1.id = "msseloptions" + options.id;
		this.optionsTextArea1.name = "msseloptions" + options.id;
		this.optionsTextArea1.className = "form-control";
		this.optionsTextArea1.rows = "5";
		this.optionsTextArea1.setAttribute("placeholder",
				"每个选项由选项值和选项文本构成，中间以半角冒号(:)隔开，加回车换行。如：\n01:中国\n02:美国\n");
		this.optionsTextArea1.addEventListener("change", this, false);

		// default value
		var group4 = document.createElement("div");
		group4.className = "form-group";
		form1.appendChild(group4);

		var label4 = document.createElement("label");
		group4.appendChild(label4);
		label4.setAttribute("for", "default" + options.id);
		label4.className = "col-sm-2 control-label";
		label4.innerHTML = "默认值";

		var selDiv4 = document.createElement("div");
		selDiv4.className = "col-sm-10";
		group4.appendChild(selDiv4);

		this.defaultInput = document.createElement("INPUT");
		selDiv4.appendChild(this.defaultInput);
		this.defaultInput.id = "default" + options.id;
		this.defaultInput.name = "default" + options.id;
		this.defaultInput.className = "form-control";
		this.defaultInput.setAttribute("placeholder",
				"选项默认值为下拉列表中某一或多个选项值，选项值之间以逗号隔开。");
		this.defaultInput.addEventListener("change", this, false);

		this.loadData(this.entity);
		
		if (options.currowner instanceof ReleasedForm) {
			this.gpInput30.disabled = true;
			this.optionsTextArea.disabled = true;
			this.gpInput31.disabled = true;
			this.optionsRef.disabled = true;
			this.codeRef.disabled = true;
			this.gpInput32.disabled = true;
			this.optionsMs.disabled = true;
			this.optionsTextArea1.disabled = true;
			this.defaultInput.disabled = true;
		}
		
	};

	BasicPropPanel.prototype.loadData = function(entity) {
		if (this.entity.dsType == 0) {
			this.gpInput30.checked = true;
			this.gpInput31.checked = false;
			this.gpInput32.checked = false;
			this.optionsTextArea.disabled = false;
			this.optionsTextArea.value = this.entity.options;
			this.optionsRef.disabled = true;
			this.optionsRef.value = this.entity.refoptions;
			this.optionsMs.disabled = true;
			this.optionsRef.value = this.entity.msoptions;
			this.codeRef.disabled = true;
			this.codeRef.value = this.entity.refcode;
		} else if (this.entity.dsType == 1) {
			this.gpInput30.checked = false;
			this.gpInput31.checked = true;
			this.gpInput32.checked = false;
			this.optionsTextArea.disabled = true;
			this.optionsTextArea.value = this.entity.options;
			this.optionsRef.disabled = false;
			this.optionsRef.value = this.entity.refoptions;
			this.optionsMs.disabled = true;
			this.optionsRef.value = this.entity.msoptions;
			this.codeRef.disabled = false;
			this.codeRef.value = this.entity.refcode;
		} else if (this.entity.dsType == 2) {
			this.gpInput30.checked = false;
			this.gpInput31.checked = false;
			this.gpInput32.checked = true;
			this.optionsTextArea.disabled = true;
			this.optionsTextArea.value = this.entity.options;
			this.optionsRef.disabled = true;
			this.optionsRef.value = this.entity.refoptions;
			this.optionsMs.disabled = false;
			this.optionsRef.value = this.entity.msoptions;
			this.codeRef.disabled = true;
			this.codeRef.value = this.entity.refcode;
		}
		this.defaultInput.value = this.entity.initValue;
	};

	BasicPropPanel.prototype.loadOptions = function(id) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(13), {
			id : id, // organization Id
		}).complete(function(data) {
			that.loadReferences(that, data.responseJSON);
			$("#progressbar").hide();
		});
	};

	BasicPropPanel.prototype.loadReferences = function(parent, data) {
		if (data != null && data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				parent.addOptions(parent.optionsRef, data[i].name, data[i].id,
						i);
			}
		}
	};

	BasicPropPanel.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	BasicPropPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		case "click":
			this.doClick(e);
			break;
		}
	};

	BasicPropPanel.prototype.doClick = function(evt) {
		if (evt.target.id == "ds1" + this.options.id) {
			this.optionsTextArea.disabled = false;
			this.optionsRef.disabled = true;
			this.codeRef.disabled = true;
			this.optionsMs.disabled = true;
		} else if (evt.target.id == "ds2" + this.options.id) {
			this.optionsTextArea.disabled = true;
			this.optionsRef.disabled = false;
			this.codeRef.disabled = false;
			this.optionsMs.disabled = true;
			this.entity.refoptions = this.optionsRef.value;
			this.entity.refcode = this.codeRef.value;
		} else if (evt.target.id == "ds3" + this.options.id) {
			this.optionsTextArea.disabled = true;
			this.optionsRef.disabled = true;
			this.optionsMs.disabled = false;
			this.codeRef.disabled = true;
		}
		map[this.options.currowner.id].stack
				.execute(new FMValueChangedCmd(this.entity, "dsType",
						evt.target.value, this.options.currowner));
	};

	BasicPropPanel.prototype.doChange = function(evt) {
		if (evt.target == this.optionsTextArea) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "options", this.optionsTextArea.value,
					this.options.currowner));
		} else if (evt.target == this.optionsMs) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "msoptions", this.optionsMs.value,
					this.options.currowner));
		} else if (evt.target == this.optionsRef) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "refoptions", this.optionsRef.value,
					this.options.currowner));
		} else if (evt.target == this.codeRef) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "refcode", this.codeRef.value,
					this.options.currowner));
		} else if (evt.target == this.defaultInput) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "initValue", this.defaultInput.value,
					this.options.currowner));
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new BasicPropPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);