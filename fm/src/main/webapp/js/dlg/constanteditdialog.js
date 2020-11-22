;
(function($, window, document, undefined) {
	var pluginName = "uiConstantEditDialog";
	var defaults = {
		id : "",
		title : "",
		topparent : "",
		expdetail : "",
	};

	var ConstantEditDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			topparent : "",
			expdetail : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity;
		this.sheet; // panel body
		this.trueRadio;
		this.falseRadio;
		this.intInput;
		this.realInput;
		this.stringInput;
		this.messageBox;
		this.currentSelect = 1;
		this.returnValue;
		this.returnType;
		this.init(options);
	};

	ConstantEditDialog.prototype.init = function(options) {
		this.topparent = options.topparent;

		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog modal-sm";
		modaldialogDIV.setAttribute("role", "document");
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		modaldialogDIV.appendChild(dialogContentDIV);
		// dialog headding
		var dialogHeaderDIV = document.createElement("div");
		dialogHeaderDIV.className = "modal-header";
		dialogContentDIV.appendChild(dialogHeaderDIV);

		var closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");

		var closeSpan = document.createElement("span");
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";
		closeButton.appendChild(closeSpan);
		dialogHeaderDIV.appendChild(closeButton);

		var titleH4 = document.createElement("h4");
		titleH4.className = "modal-title";
		titleH4.id = "modal" + options.id;
		dialogHeaderDIV.appendChild(titleH4);
		
		var infoIcon = document.createElement("i");
		infoIcon.className = "fa fa-plus-circle fa-lg";
		infoIcon.style.color = "green";
		titleH4.appendChild(infoIcon);

		var info = document.createElement("label");
		info.innerHTML = options.title;
		titleH4.appendChild(info);

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);

		var dialogBodyDIV = document.createElement("div");
		dialogBodyDIV.className = "modal-body";
		dialogForm.appendChild(dialogBodyDIV);

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyFrameDIV.className = "container-fluid";
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);

		var bodyRow = document.createElement("div");
		bodyRow.className = "row";
		bodyRow.id = "bodyrow" + options.id;
		dialogBodyFrameDIV.appendChild(bodyRow);

		// add form panel or main content here...
		this.addContent(options.id, bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		var saveButton = document.createElement("button");
		saveButton.type = "button";
		saveButton.id = "OK" + options.id;
		saveButton.name = "OK" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.innerHTML = "确定";
		saveButton.addEventListener("click", this, false);
		dialogFooterDIV.appendChild(saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "button";
		cancelButton.id = "Cancel" + options.id;
		cancelButton.name = "Cancel" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

		var dialog = $(dialogBodyDIV).alertBox({
			id : options.id,
		});
		this.messageBox = dialog.data("alertBox");
	};

	ConstantEditDialog.prototype.addContent = function(id, parent) {

		// boolean
		var radioContainerDIV = document.createElement("div");
		radioContainerDIV.className = "radio";
		parent.appendChild(radioContainerDIV);

		var booleanLabel = document.createElement("label");
		radioContainerDIV.appendChild(booleanLabel);

		var booleanOptionRadio = document.createElement("input");
		booleanLabel.appendChild(booleanOptionRadio);
		booleanOptionRadio.type = "radio";
		booleanOptionRadio.name = "opt" + id;
		booleanOptionRadio.id = "opt1" + id;
		booleanOptionRadio.setAttribute("value", "1");
		booleanOptionRadio.setAttribute("checked", "true");
		booleanOptionRadio.addEventListener("click", this, false);
		var bLabel = document.createElement("b");
		booleanLabel.appendChild(bLabel);
		bLabel.innerHTML = "真假值" + "&nbsp;&nbsp;";

		var trueLabel = document.createElement("label");
		radioContainerDIV.appendChild(trueLabel);

		this.trueRadio = document.createElement("input");
		trueLabel.appendChild(this.trueRadio);
		this.trueRadio.type = "radio";
		this.trueRadio.name = "inlineRadioOptions" + id;
		this.trueRadio.id = "inlineRadio1" + id;
		this.trueRadio.setAttribute("checked", "true");
		this.trueRadio.setAttribute("value", "t");
		var tLabel = document.createElement("span");
		trueLabel.appendChild(tLabel);
		tLabel.innerHTML = "真" + "&nbsp;&nbsp;&nbsp;&nbsp;";

		var falseLabel = document.createElement("label");
		radioContainerDIV.appendChild(falseLabel);

		this.falseRadio = document.createElement("input");
		falseLabel.appendChild(this.falseRadio);
		this.falseRadio.type = "radio";
		this.falseRadio.name = "inlineRadioOptions" + id;
		this.falseRadio.id = "inlineRadio2" + id;
		this.falseRadio.setAttribute("value", "f");
		var fLabel = document.createElement("span");
		falseLabel.appendChild(fLabel);
		fLabel.innerHTML = "假" + "&nbsp;&nbsp;&nbsp;&nbsp;";

		// integer
		var radioContainerDIV1 = document.createElement("div");
		parent.appendChild(radioContainerDIV1);
		radioContainerDIV1.className = "radio";

		var intLabel = document.createElement("label");
		radioContainerDIV1.appendChild(intLabel);

		var intOptionRadio = document.createElement("input");
		intLabel.appendChild(intOptionRadio);
		intOptionRadio.type = "radio";
		intOptionRadio.name = "opt" + id;
		intOptionRadio.id = "opt2" + id;
		intOptionRadio.setAttribute("value", "2");
		intOptionRadio.addEventListener("click", this, false);
		var iLabel = document.createElement("b");
		intLabel.appendChild(iLabel);
		iLabel.innerHTML = "整数";

		this.intInput = document.createElement("input");
		radioContainerDIV1.appendChild(this.intInput);
		this.intInput.type = "text";
		this.intInput.className = "form-control";
		this.intInput.id = "intvalue" + id;
		this.intInput.name = "intvalue" + id;
		this.intInput.setAttribute("placeholder", "输入一个整数");
		this.intInput.setAttribute("readonly", "true");
		// real
		var radioContainerDIV2 = document.createElement("div");
		parent.appendChild(radioContainerDIV2);
		radioContainerDIV2.className = "radio";

		var realLabel = document.createElement("label");
		radioContainerDIV2.appendChild(realLabel);

		var realOptionRadio = document.createElement("input");
		realLabel.appendChild(realOptionRadio);
		realOptionRadio.type = "radio";
		realOptionRadio.name = "opt" + id;
		realOptionRadio.id = "opt3" + id;
		realOptionRadio.setAttribute("value", "3");
		realOptionRadio.addEventListener("click", this, false);
		var rLabel = document.createElement("b");
		realLabel.appendChild(rLabel);
		rLabel.innerHTML = "小数";

		this.realInput = document.createElement("input");
		radioContainerDIV2.appendChild(this.realInput);
		this.realInput.type = "text";
		this.realInput.className = "form-control";
		this.realInput.id = "realvalue" + id;
		this.realInput.name = "realvalue" + id;
		this.realInput.setAttribute("placeholder", "输入一个小数");
		this.realInput.setAttribute("readonly", "true");
		// string
		var radioContainerDIV3 = document.createElement("div");
		parent.appendChild(radioContainerDIV3);
		radioContainerDIV3.className = "radio";

		var stringLabel = document.createElement("label");
		radioContainerDIV3.appendChild(stringLabel);

		var stringOptionRadio = document.createElement("input");
		stringLabel.appendChild(stringOptionRadio);
		stringOptionRadio.type = "radio";
		stringOptionRadio.name = "opt" + id;
		stringOptionRadio.id = "opt4" + id;
		stringOptionRadio.setAttribute("value", "4");
		stringOptionRadio.addEventListener("click", this, false);
		var sLabel = document.createElement("b");
		stringLabel.appendChild(sLabel);
		sLabel.innerHTML = "字符串";

		this.stringInput = document.createElement("input");
		radioContainerDIV3.appendChild(this.stringInput);
		this.stringInput.type = "text";
		this.stringInput.className = "form-control";
		this.stringInput.id = "stringvalue" + id;
		this.stringInput.name = "stringvalue" + id;
		this.stringInput.setAttribute("placeholder", "输入一个字符串");
		this.stringInput.setAttribute("readonly", "true");
		// null
		var radioContainerDIV4 = document.createElement("div");
		parent.appendChild(radioContainerDIV4);
		radioContainerDIV4.className = "radio";

		var nullLabel = document.createElement("label");
		radioContainerDIV4.appendChild(nullLabel);

		var nullOptionRadio = document.createElement("input");
		nullLabel.appendChild(nullOptionRadio);
		nullOptionRadio.type = "radio";
		nullOptionRadio.name = "opt" + id;
		nullOptionRadio.id = "opt5" + id;
		nullOptionRadio.setAttribute("value", "5");
		nullOptionRadio.addEventListener("click", this, false);
		var nLabel = document.createElement("b");
		nullLabel.appendChild(nLabel);
		nLabel.innerHTML = "空值";

	};

	ConstantEditDialog.prototype.setRule = function(rule) {
		this.entity = rule;
	};

	ConstantEditDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	ConstantEditDialog.prototype.doClick = function(evt) {
		//evt.preventDefault();
		if (evt.target.name == "opt" + this.options.id) {
			this.currentSelect = evt.target.value;
			if (evt.target.value == 1) { // boolean
				this.trueRadio.disabled = false;
				this.falseRadio.disabled = false;
				this.intInput.readOnly = true;
				this.realInput.readOnly = true;
				this.stringInput.readOnly = true;
			} else if (evt.target.value == 2) { // integer
				this.trueRadio.disabled = true;
				this.falseRadio.disabled = true;
				this.intInput.readOnly = false;
				this.realInput.readOnly = true;
				this.stringInput.readOnly = true;
			} else if (evt.target.value == 3) { // real
				this.trueRadio.disabled = true;
				this.falseRadio.disabled = true;
				this.intInput.readOnly = true;
				this.realInput.readOnly = false;
				this.stringInput.readOnly = true;
			} else if (evt.target.value == 4) { // string
				this.trueRadio.disabled = true;
				this.falseRadio.disabled = true;
				this.intInput.readOnly = true;
				this.realInput.readOnly = true;
				this.stringInput.readOnly = false;
			} else if (evt.target.value == 5) { // null
				this.trueRadio.disabled = true;
				this.falseRadio.disabled = true;
				this.intInput.readOnly = true;
				this.realInput.readOnly = true;
				this.stringInput.readOnly = true;
			}
		} else if (evt.target.name == "OK" + this.options.id) {
			if (this.currentSelect == 1) { // boolean
				this.returnType = "boolean";
				var b = $(
						'input[type="radio"][name="inlineRadioOptions'
								+ this.options.id + '"]:checked').val();
				if (b == "t") {
					this.returnValue = "true";
				} else {
					this.returnValue = "false";
				}
				this.hide();
			} else if (this.currentSelect == 2) { // integer
				this.returnType = "int";
				if (this.intInput.value == "") {
					this.messageBox.show(4, "整数值不能为空", false);
				} else {
					this.returnValue = this.intInput.value;
					this.hide();
				}
			} else if (this.currentSelect == 3) { // real
				this.returnType = "float";
				if (this.realInput.value == "") {
					this.messageBox.show(4, "小数值不能为空", false);
				} else {
					this.returnValue = this.realInput.value;
					this.hide();
				}
			} else if (this.currentSelect == 4) { // string
				this.returnType = "String";
				if (this.stringInput.value == "") {
					this.messageBox.show(4, "字符串不能为空", false);
				} else {
					this.returnValue = this.stringInput.value;
					this.hide();
				}
			} else if (this.currentSelect == 5) { // null value
				this.returnValue = "null";
				this.returnType = "null";
				this.hide();
			}
		}
	};

	ConstantEditDialog.prototype.show = function(model) {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : model
		});
	};

	ConstantEditDialog.prototype.hide = function() {
		var c = new UIConstant();
		c.value = this.returnValue;
		c.datatype = this.returnType;
		this.entity.insert(c);
		$(this.modalframe).modal('hide');
		this.options.expdetail.innerHTML = this.entity.toString();
	};

	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new ConstantEditDialog(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);