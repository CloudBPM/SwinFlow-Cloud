/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "fileDisplayerPropPane";
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

		// var label1 = document.createElement("label");
		// group1.appendChild(label1);
		// label1.setAttribute("for", "prepend" + options.id);
		// label1.className = "col-sm-2 control-label";
		// label1.innerHTML = "前缀";
		//
		// var selDiv1 = document.createElement("div");
		// selDiv1.className = "col-sm-4";
		// group1.appendChild(selDiv1);
		//
		// this.prependSel = document.createElement("select");
		// selDiv1.appendChild(this.prependSel);
		// this.prependSel.id = "prepend" + options.id;
		// this.prependSel.name = "prepend" + options.id;
		// this.prependSel.className = "select form-control";
		// this.prependSel.addEventListener("change", this, false);
		//
		// this.addOptions(this.prependSel, "无前缀", "No", 0);
		// this.addOptions(this.prependSel, "文字前缀", "Text", 1);
		// this.addOptions(this.prependSel, "图标前缀", "Icon", 2);
		//
		// var iconDiv1 = document.createElement("div");
		// group1.appendChild(iconDiv1);
		// iconDiv1.className = "col-sm-6";
		//
		// this.prependTextInput = document.createElement("input");
		// iconDiv1.appendChild(this.prependTextInput);
		// this.prependTextInput.className = "form-control";
		// this.prependTextInput.style.display = "none";
		// this.prependTextInput.addEventListener("change", this, false);
		//
		// this.prependIconDiv = document.createElement("div");
		// iconDiv1.appendChild(this.prependIconDiv);
		// this.prependIconDiv.className = "input-group";
		// this.prependIconDiv.style.display = "none";
		//
		// this.prependIconInput = document.createElement("input");
		// this.prependIconDiv.appendChild(this.prependIconInput);
		// this.prependIconInput.className = "form-control icp1 icp-auto1";
		// this.prependIconInput.type = "text";
		//
		// var iconSpan = document.createElement("span");
		// this.prependIconDiv.appendChild(iconSpan);
		// iconSpan.className = "input-group-addon";
		//
		// $(".icp-auto1").iconpicker();
		// var that = this;
		//
		// $('.icp-auto1').on('iconpickerSelected', function(e) {
		// 	that.doInput1(e.iconpickerValue);
		// });
		//
		// // append
		// var group2 = document.createElement("div");
		// group2.className = "form-group";
		// form1.appendChild(group2);
		//
		// var label2 = document.createElement("label");
		// group2.appendChild(label2);
		// label2.setAttribute("for", "append" + options.id);
		// label2.className = "col-sm-2 control-label";
		// label2.innerHTML = "后缀";
		//
		// var selDiv2 = document.createElement("div");
		// selDiv2.className = "col-sm-4";
		// group2.appendChild(selDiv2);
		//
		// this.appendSel = document.createElement("select");
		// selDiv2.appendChild(this.appendSel);
		// this.appendSel.id = "append" + options.id;
		// this.appendSel.name = "append" + options.id;
		// this.appendSel.className = "select form-control";
		// this.appendSel.addEventListener("change", this, false);
		//
		// this.addOptions(this.appendSel, "无后缀", "No", 0);
		// this.addOptions(this.appendSel, "文字后缀", "Text", 1);
		// this.addOptions(this.appendSel, "图标后缀", "Icon", 2);
		//
		// var iconDiv2 = document.createElement("div");
		// group2.appendChild(iconDiv2);
		// iconDiv2.className = "col-sm-6";
		//
		// this.appendTextInput = document.createElement("input");
		// iconDiv2.appendChild(this.appendTextInput);
		// this.appendTextInput.className = "form-control";
		// this.appendTextInput.style.display = "none";
		// this.appendTextInput.addEventListener("change", this, false);
		//
		// this.appendIconDiv = document.createElement("div");
		// iconDiv2.appendChild(this.appendIconDiv);
		// this.appendIconDiv.className = "input-group";
		// this.appendIconDiv.style.display = "none";
		//
		// this.appendIconInput = document.createElement("input");
		// this.appendIconDiv.appendChild(this.appendIconInput);
		// this.appendIconInput.className = "form-control icp2 icp-auto2";
		// this.appendIconInput.type = "text";
		//
		// var iconSpan2 = document.createElement("span");
		// this.appendIconDiv.appendChild(iconSpan2);
		// iconSpan2.className = "input-group-addon";
		//
		// $(".icp-auto2").iconpicker();
		//
		// $('.icp-auto2').on('iconpickerSelected', function(e) {
		// 	that.doInput2(e.iconpickerValue);
		// });
		//
		// // default value
		// var group3 = document.createElement("div");
		// group3.className = "form-group";
		// form1.appendChild(group3);
		//
		// var label3 = document.createElement("label");
		// group3.appendChild(label3);
		// label3.setAttribute("for", "default" + options.id);
		// label3.className = "col-sm-2 control-label";
		// label3.innerHTML = "默认值";
		//
		// var selDiv3 = document.createElement("div");
		// selDiv3.className = "col-sm-10";
		// group3.appendChild(selDiv3);
		//
		// this.defaultInput = document.createElement("INPUT");
		// selDiv3.appendChild(this.defaultInput);
		// this.defaultInput.id = "default" + options.id;
		// this.defaultInput.name = "default" + options.id;
		// this.defaultInput.className = "form-control";
		// this.defaultInput.setAttribute("placeholder", "默认值为文本框中的初始值");
		// this.defaultInput.addEventListener("change", this, false);
		
		this.loadData(this.entity);
		
		// if (options.currowner instanceof ReleasedForm) {
		// 	this.prependSel.disabled = true;
		// 	this.prependTextInput.disabled = true;
		// 	this.prependIconInput.disabled = true;
		// 	this.appendSel.disabled = true;
		// 	this.appendTextInput.disabled = true;
		// 	this.appendIconInput.disabled = true;
		// 	this.defaultInput.disabled = true;
		// }

	};

	BasicPropPanel.prototype.loadData = function(entity) {
		// this.prependSel.value = this.entity.prependType;
		// if (this.entity.prependType == "No") {
		// 	this.prependTextInput.value = null;
		// 	this.prependIconInput.value = null;
		//
		// 	this.prependTextInput.style.display = "none";
		// 	this.prependIconDiv.style.display = "none";
		// } else if (this.entity.prependType == "Text") {
		// 	this.prependTextInput.value = this.entity.prepend;
		// 	this.prependIconInput.value = null;
		//
		// 	this.prependTextInput.style.display = "";
		// 	this.prependIconDiv.style.display = "none";
		// } else if (this.entity.prependType == "Icon") {
		// 	this.prependTextInput.value = null;
		// 	this.prependIconInput.value = this.entity.prepend;
		//
		// 	this.prependTextInput.style.display = "none";
		// 	this.prependIconDiv.style.display = "";
		// }
		//
		// this.appendSel.value = this.entity.appendType;
		// if (this.entity.appendType == "No") {
		// 	this.appendTextInput.value = null;
		// 	this.appendIconInput.value = null;
		//
		// 	this.appendTextInput.style.display = "none";
		// 	this.appendIconDiv.style.display = "none";
		//
		// } else if (this.entity.appendType == "Text") {
		// 	this.appendTextInput.value = this.entity.append;
		// 	this.appendIconInput.value = null;
		//
		// 	this.appendTextInput.style.display = "";
		// 	this.appendIconDiv.style.display = "none";
		//
		// } else if (this.entity.appendType == "Icon") {
		// 	this.appendTextInput.value = null;
		// 	this.appendIconInput.value = this.entity.append;
		//
		// 	this.appendTextInput.style.display = "none";
		// 	this.appendIconDiv.style.display = "";
		// }
		// this.defaultInput.value = this.entity.initValue;
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
		}
	};

	BasicPropPanel.prototype.doInput1 = function(v) {
		// map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
		// 		this.entity, "prepend", v, this.options.currowner));
	};

	BasicPropPanel.prototype.doInput2 = function(v) {
		// map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
		// 		this.entity, "append", v, this.options.currowner));
	};

	BasicPropPanel.prototype.doChange = function(evt) {
		// if (evt.target == this.defaultInput) {
		// 	map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
		// 			this.entity, "initValue", this.defaultInput.value,
		// 			this.options.currowner));
		// } else if (evt.target == this.prependSel) {
		// 	map[this.options.currowner.id].stack
		// 			.execute(new FMChangePrependCmd(this.entity,
		// 					evt.target.value, this.options.currowner, this));
		// } else if (evt.target == this.appendSel) {
		// 	map[this.options.currowner.id].stack
		// 			.execute(new FMChangeAppendCmd(this.entity,
		// 					evt.target.value, this.options.currowner, this));
		// } else if (evt.target == this.prependTextInput) {
		// 	map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
		// 			this.entity, "prepend", this.prependTextInput.value,
		// 			this.options.currowner));
		// } else if (evt.target == this.appendTextInput) {
		// 	map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
		// 			this.entity, "append", this.appendTextInput.value,
		// 			this.options.currowner));
		// }
	};

	// pendtype: prepend or append; pendvalue: No, Text, and Icon
	BasicPropPanel.prototype.update = function(pendtype, pendvalue) {
		// if (pendtype == "prepend") {
		// 	if (pendvalue == "No") {
		// 		this.prependTextInput.style.display = "none";
		// 		this.prependIconDiv.style.display = "none";
		// 	} else if (pendvalue == "Text") {
		// 		this.prependTextInput.style.display = "";
		// 		this.prependIconDiv.style.display = "none";
		// 	} else if (pendvalue == "Icon") {
		// 		this.prependTextInput.style.display = "none";
		// 		this.prependIconDiv.style.display = "";
		// 	}
		// } else if (pendtype == "append") {
		// 	if (pendvalue == "No") {
		// 		this.appendTextInput.style.display = "none";
		// 		this.appendIconDiv.style.display = "none";
		// 	} else if (pendvalue == "Text") {
		// 		this.appendTextInput.style.display = "";
		// 		this.appendIconDiv.style.display = "none";
		// 	} else if (pendvalue == "Icon") {
		// 		this.appendTextInput.style.display = "none";
		// 		this.appendIconDiv.style.display = "";
		// 	}
		// }

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