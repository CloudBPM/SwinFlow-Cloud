/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "singleSelectPropPane";
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

		// prepend
		var group1 = document.createElement("div");
		group1.className = "form-group";
		form1.appendChild(group1);

		var label1 = document.createElement("label");
		group1.appendChild(label1);
		label1.setAttribute("for", "prepend" + options.id);
		label1.className = "col-sm-2 control-label";
		label1.innerHTML = "前缀";

		var selDiv1 = document.createElement("div");
		selDiv1.className = "col-sm-4";
		group1.appendChild(selDiv1);

		this.prependSel = document.createElement("select");
		selDiv1.appendChild(this.prependSel);
		this.prependSel.id = "prepend" + options.id;
		this.prependSel.name = "prepend" + options.id;
		this.prependSel.className = "select form-control";
		this.prependSel.addEventListener("change", this, false);

		this.addOptions(this.prependSel, "无前缀", "No", 0);
		this.addOptions(this.prependSel, "文字前缀", "Text", 1);
		this.addOptions(this.prependSel, "图标前缀", "Icon", 2);

		var iconDiv1 = document.createElement("div");
		group1.appendChild(iconDiv1);
		iconDiv1.className = "col-sm-6";

		this.prependTextInput = document.createElement("input");
		iconDiv1.appendChild(this.prependTextInput);
		this.prependTextInput.className = "form-control";
		this.prependTextInput.style.display = "none";
		this.prependTextInput.addEventListener("change", this, false);

		this.prependIconDiv = document.createElement("div");
		iconDiv1.appendChild(this.prependIconDiv);
		this.prependIconDiv.className = "input-group";
		this.prependIconDiv.style.display = "none";

		this.prependIconInput = document.createElement("input");
		this.prependIconDiv.appendChild(this.prependIconInput);
		this.prependIconInput.className = "form-control icp1 icp-auto1";
		this.prependIconInput.type = "text";

		var iconSpan = document.createElement("span");
		this.prependIconDiv.appendChild(iconSpan);
		iconSpan.className = "input-group-addon";

		$(".icp-auto1").iconpicker();
		var that = this;

		$('.icp-auto1').on('iconpickerSelected', function(e) {
			that.doInput1(e.iconpickerValue);
		});

		// append
		var group2 = document.createElement("div");
		group2.className = "form-group";
		form1.appendChild(group2);

		var label2 = document.createElement("label");
		group2.appendChild(label2);
		label2.setAttribute("for", "append" + options.id);
		label2.className = "col-sm-2 control-label";
		label2.innerHTML = "后缀";

		var selDiv2 = document.createElement("div");
		selDiv2.className = "col-sm-4";
		group2.appendChild(selDiv2);

		this.appendSel = document.createElement("select");
		selDiv2.appendChild(this.appendSel);
		this.appendSel.id = "append" + options.id;
		this.appendSel.name = "append" + options.id;
		this.appendSel.className = "select form-control";
		this.appendSel.addEventListener("change", this, false);

		this.addOptions(this.appendSel, "无后缀", "No", 0);
		this.addOptions(this.appendSel, "文字后缀", "Text", 1);
		this.addOptions(this.appendSel, "图标后缀", "Icon", 2);

		var iconDiv2 = document.createElement("div");
		group2.appendChild(iconDiv2);
		iconDiv2.className = "col-sm-6";

		this.appendTextInput = document.createElement("input");
		iconDiv2.appendChild(this.appendTextInput);
		this.appendTextInput.className = "form-control";
		this.appendTextInput.style.display = "none";
		this.appendTextInput.addEventListener("change", this, false);

		this.appendIconDiv = document.createElement("div");
		iconDiv2.appendChild(this.appendIconDiv);
		this.appendIconDiv.className = "input-group";
		this.appendIconDiv.style.display = "none";

		this.appendIconInput = document.createElement("input");
		this.appendIconDiv.appendChild(this.appendIconInput);
		this.appendIconInput.className = "form-control icp2 icp-auto2";
		this.appendIconInput.type = "text";

		var iconSpan2 = document.createElement("span");
		this.appendIconDiv.appendChild(iconSpan2);
		iconSpan2.className = "input-group-addon";

		$(".icp-auto2").iconpicker();

		$('.icp-auto2').on('iconpickerSelected', function(e) {
			that.doInput2(e.iconpickerValue);
		});

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
		// var group3040 = document.createElement("div");
		// form1.appendChild(group3040);
		// group3040.className = "form-group";
		//
		// var group3021 = document.createElement("DIV");
		// group3040.appendChild(group3021);
		// group3021.className = "col-sm-2";
		//
		// var group32 = document.createElement("DIV");
		// group3040.appendChild(group32);
		// group32.className = "col-sm-10 radio";
		//
		// var gpLabel32 = document.createElement("LABEL");
		// group32.appendChild(gpLabel32);
		// gpLabel32.className = "control-label";
		//
		// this.gpInput32 = document.createElement("INPUT");
		// gpLabel32.appendChild(this.gpInput32);
		// this.gpInput32.type = "radio";
		// this.gpInput32.name = "ds" + options.id; // data source
		// this.gpInput32.id = "ds3" + options.id; // data source
		// this.gpInput32.value = "2";
		// this.gpInput32.addEventListener("click", this, false);
		// gpLabel32.appendChild(document.createTextNode("微服务数据选项列表（建设中...）"));
		//
		// var group6 = document.createElement("div");
		// form1.appendChild(group6);
		// group6.className = "form-group";
		//
		// var label6 = document.createElement("label");
		// group6.appendChild(label6);
		// label6.setAttribute("for", "msoptions" + options.id);
		// label6.className = "col-sm-2 control-label";
		// label6.innerHTML = "&nbsp;";
		//
		// var selDiv6 = document.createElement("div");
		// group6.appendChild(selDiv6);
		// selDiv6.className = "col-sm-10";
		//
		// this.optionsMs = document.createElement("INPUT");
		// selDiv6.appendChild(this.optionsMs);
		// this.optionsMs.id = "msoptions" + options.id;
		// this.optionsMs.name = "msoptions" + options.id;
		// this.optionsMs.className = "form-control";
		// this.optionsMs.addEventListener("change", this, false);

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
		this.defaultInput.setAttribute("placeholder", "选项默认值为下拉列表中某一个选项值");
		this.defaultInput.addEventListener("change", this, false);

		this.loadData(this.entity);

		if (options.currowner instanceof ReleasedForm) {
			this.prependSel.disabled = true;
			this.prependTextInput.disabled = true;
			this.prependIconInput.disabled = true;
			this.appendSel.disabled = true;
			this.appendTextInput.disabled = true;
			this.appendIconInput.disabled = true;
			this.gpInput30.disabled = true;
			this.optionsTextArea.disabled = true;
			this.gpInput31.disabled = true;
			this.optionsRef.disabled = true;
			this.codeRef.disabled = true;
			//this.gpInput32.disabled = true;
			//this.optionsMs.disabled = true;
			this.defaultInput.disabled = true;
		}
	};

	BasicPropPanel.prototype.loadData = function(entity) {
		this.prependSel.value = this.entity.prependType;
		if (this.entity.prependType == "No") {
			this.prependTextInput.value = null;
			this.prependIconInput.value = null;

			this.prependTextInput.style.display = "none";
			this.prependIconDiv.style.display = "none";
		} else if (this.entity.prependType == "Text") {
			this.prependTextInput.value = this.entity.prepend;
			this.prependIconInput.value = null;

			this.prependTextInput.style.display = "";
			this.prependIconDiv.style.display = "none";
		} else if (this.entity.prependType == "Icon") {
			this.prependTextInput.value = null;
			this.prependIconInput.value = this.entity.prepend;

			this.prependTextInput.style.display = "none";
			this.prependIconDiv.style.display = "";
		}

		this.appendSel.value = this.entity.appendType;
		if (this.entity.appendType == "No") {
			this.appendTextInput.value = null;
			this.appendIconInput.value = null;

			this.appendTextInput.style.display = "none";
			this.appendIconDiv.style.display = "none";

		} else if (this.entity.appendType == "Text") {
			this.appendTextInput.value = this.entity.append;
			this.appendIconInput.value = null;

			this.appendTextInput.style.display = "";
			this.appendIconDiv.style.display = "none";

		} else if (this.entity.appendType == "Icon") {
			this.appendTextInput.value = null;
			this.appendIconInput.value = this.entity.append;

			this.appendTextInput.style.display = "none";
			this.appendIconDiv.style.display = "";
		}
		if (this.entity.dsType == 0) {
			this.gpInput30.checked = true;
			this.gpInput31.checked = false;
			//this.gpInput32.checked = false;
			this.optionsTextArea.disabled = false;
			this.optionsTextArea.value = this.entity.options;
			this.optionsRef.disabled = true;
			this.optionsRef.value = this.entity.refoptions;
			this.codeRef.disabled = true;
			this.codeRef.value = this.entity.refcode;
			//this.optionsMs.disabled = true;
			//this.optionsMs.value = this.entity.msoptions;
		} else if (this.entity.dsType == 1) {
			this.gpInput30.checked = false;
			this.gpInput31.checked = true;
			//this.gpInput32.checked = false;
			this.optionsTextArea.disabled = true;
			this.optionsTextArea.value = this.entity.options;
			this.optionsRef.disabled = false;
			this.optionsRef.value = this.entity.refoptions;
			this.codeRef.disabled = false;
			this.codeRef.value = this.entity.refcode;
			//this.optionsMs.disabled = true;
			//this.optionsMs.value = this.entity.msoptions;
			this.loadOptions(this.options.currowner.owner);
		} else if (this.entity.dsType == 2) {
			this.gpInput30.checked = false;
			this.gpInput31.checked = false;
			//this.gpInput32.checked = true;
			this.optionsTextArea.disabled = true;
			this.optionsTextArea.value = this.entity.options;
			this.optionsRef.disabled = true;
			this.optionsRef.value = this.entity.refoptions;
			this.codeRef.disabled = true;
			this.codeRef.value = this.entity.refcode;
			//this.optionsMs.disabled = false;
			//this.optionsMs.value = this.entity.msoptions;
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
		this.optionsRef.disabled = false;
		this.optionsRef.value = this.entity.refoptions;
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
			//this.optionsMs.disabled = true;
		} else if (evt.target.id == "ds2" + this.options.id) {
			this.optionsTextArea.disabled = true;
			this.optionsRef.disabled = false;
			this.codeRef.disabled = false;
			this.entity.refoptions = this.optionsRef.value;
			this.entity.refcode = this.codeRef.value;
			//this.optionsMs.disabled = true;
		} else if (evt.target.id == "ds3" + this.options.id) {
			this.optionsTextArea.disabled = true;
			this.optionsRef.disabled = true;
			this.codeRef.disabled = true;
			//this.optionsMs.disabled = false;
		}
		map[this.options.currowner.id].stack
				.execute(new FMValueChangedCmd(this.entity, "dsType",
						evt.target.value, this.options.currowner));
	};

	BasicPropPanel.prototype.doInput1 = function(v) {
		map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
				this.entity, "prepend", v, this.options.currowner));
	};

	BasicPropPanel.prototype.doInput2 = function(v) {
		map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
				this.entity, "append", v, this.options.currowner));
	};

	BasicPropPanel.prototype.doChange = function(evt) {
		if (evt.target == this.optionsTextArea) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "options", this.optionsTextArea.value,
					this.options.currowner));
		// } else if (evt.target == this.optionsMs) {
		// 	map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
		// 			this.entity, "msoptions", this.optionsMs.value,
		// 			this.options.currowner));
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
		} else if (evt.target == this.prependSel) {
			map[this.options.currowner.id].stack
					.execute(new FMChangePrependCmd(this.entity,
							evt.target.value, this.options.currowner, this));
		} else if (evt.target == this.appendSel) {
			map[this.options.currowner.id].stack
					.execute(new FMChangeAppendCmd(this.entity,
							evt.target.value, this.options.currowner, this));
		} else if (evt.target == this.prependTextInput) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "prepend", this.prependTextInput.value,
					this.options.currowner));
		} else if (evt.target == this.appendTextInput) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "append", this.appendTextInput.value,
					this.options.currowner));
		}
	};

	// pendtype: prepend or append; pendvalue: No, Text, and Icon
	BasicPropPanel.prototype.update = function(pendtype, pendvalue) {
		if (pendtype == "prepend") {
			if (pendvalue == "No") {
				this.prependTextInput.style.display = "none";
				this.prependIconDiv.style.display = "none";
			} else if (pendvalue == "Text") {
				this.prependTextInput.style.display = "";
				this.prependIconDiv.style.display = "none";
			} else if (pendvalue == "Icon") {
				this.prependTextInput.style.display = "none";
				this.prependIconDiv.style.display = "";
			}
		} else if (pendtype == "append") {
			if (pendvalue == "No") {
				this.appendTextInput.style.display = "none";
				this.appendIconDiv.style.display = "none";
			} else if (pendvalue == "Text") {
				this.appendTextInput.style.display = "";
				this.appendIconDiv.style.display = "none";
			} else if (pendvalue == "Icon") {
				this.appendTextInput.style.display = "none";
				this.appendIconDiv.style.display = "";
			}
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