;
(function($, window, document, undefined) {
	var pluginName = "constantEditDialog";
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
		this.modalframe.appendChild(modaldialogDIV);
		modaldialogDIV.className = "modal-dialog modal-sm";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "450px";

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

		// null
		var radioContainerDIV5 = document.createElement("div");
		parent.appendChild(radioContainerDIV5);
		radioContainerDIV5.className = "radio";

		var nullLabel = document.createElement("label");
		radioContainerDIV5.appendChild(nullLabel);

		var nullOptionRadio = document.createElement("input");
		nullLabel.appendChild(nullOptionRadio);
		nullOptionRadio.type = "radio";
		nullOptionRadio.name = "opt" + id;
		nullOptionRadio.id = "opt5" + id;
		nullOptionRadio.value = "6";
		nullOptionRadio.checked = true;
		nullOptionRadio.addEventListener("click", this, false);
		var nLabel = document.createElement("b");
		nullLabel.appendChild(nLabel);
		nLabel.innerHTML = "空值";
		
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
		booleanOptionRadio.value = "1";
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
		this.trueRadio.checked = true;
		this.trueRadio.disabled = true;
		this.trueRadio.value = "t";
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
		this.falseRadio.value = "f";
		this.falseRadio.disabled = true;
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
		intOptionRadio.value = "2";
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
		this.intInput.setAttribute("placeholder", "输入整数...");
		this.intInput.disabled = true;
		this.intInput.addEventListener("keypress", this, false);
		// real/double number
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
		realOptionRadio.value = "3";
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
		this.realInput.setAttribute("placeholder", "输入小数...");
		this.realInput.disabled = true;
		this.realInput.addEventListener("keypress", this, false);

		// cuurency
		var radioContainerDIV3 = document.createElement("div");
		parent.appendChild(radioContainerDIV3);
		radioContainerDIV3.className = "radio";

		var cryLabel = document.createElement("label");
		radioContainerDIV3.appendChild(cryLabel);

		var cryOptionRadio = document.createElement("input");
		cryLabel.appendChild(cryOptionRadio);
		cryOptionRadio.type = "radio";
		cryOptionRadio.name = "opt" + id;
		cryOptionRadio.id = "opt31" + id;
		cryOptionRadio.value = "4";
		cryOptionRadio.addEventListener("click", this, false);
		var cryBLabel = document.createElement("b");
		cryLabel.appendChild(cryBLabel);
		cryBLabel.innerHTML = "金额";

		this.cryInput = document.createElement("input");
		radioContainerDIV3.appendChild(this.cryInput);
		this.cryInput.type = "text";
		this.cryInput.className = "form-control";
		this.cryInput.id = "cryvalue" + id;
		this.cryInput.name = "cryvalue" + id;
		this.cryInput.setAttribute("placeholder", "输入金额...");
		this.cryInput.disabled = true;
		this.cryInput.addEventListener("keypress", this, false);

		// string
		var radioContainerDIV4 = document.createElement("div");
		parent.appendChild(radioContainerDIV4);
		radioContainerDIV4.className = "radio";

		var stringLabel = document.createElement("label");
		radioContainerDIV4.appendChild(stringLabel);

		var stringOptionRadio = document.createElement("input");
		stringLabel.appendChild(stringOptionRadio);
		stringOptionRadio.type = "radio";
		stringOptionRadio.name = "opt" + id;
		stringOptionRadio.id = "opt4" + id;
		stringOptionRadio.value = "5";
		stringOptionRadio.addEventListener("click", this, false);
		var sLabel = document.createElement("b");
		stringLabel.appendChild(sLabel);
		sLabel.innerHTML = "文本";

		this.stringInput = document.createElement("input");
		radioContainerDIV4.appendChild(this.stringInput);
		this.stringInput.type = "text";
		this.stringInput.className = "form-control";
		this.stringInput.id = "stringvalue" + id;
		this.stringInput.name = "stringvalue" + id;
		this.stringInput.setAttribute("placeholder", "输入文本...");
		this.stringInput.disabled = true;
		
		// date time
		var radioContainerDIV6 = document.createElement("div");
		parent.appendChild(radioContainerDIV6);
		radioContainerDIV6.className = "radio";

		var datetimeLabel = document.createElement("label");
		radioContainerDIV6.appendChild(datetimeLabel);
		
		var dtOptionRadio = document.createElement("input");
		datetimeLabel.appendChild(dtOptionRadio);
		dtOptionRadio.type = "radio";
		dtOptionRadio.name = "opt" + id;
		dtOptionRadio.id = "opt6" + id;
		dtOptionRadio.value = "6";
		dtOptionRadio.addEventListener("click", this, false);
		var dtLabel = document.createElement("b");
		datetimeLabel.appendChild(dtLabel);
		dtLabel.innerHTML = "日期时间";
		
		// date
		
		// time
		
		// time duration
		
		// file
		
		// JSON
		
		// hand writing


	};

	ConstantEditDialog.prototype.setRule = function(rule) {
		this.entity = rule;
	};

	ConstantEditDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keypress":
			this.doKeypress(e);
			break;
		}
	};

	ConstantEditDialog.prototype.doKeypress = function(event) {
		if (event.target == this.intInput) {
			Utils.blockNonNumbers(this.intInput, event, false, true);
		} else if (event.target == this.realInput) {
			Utils.blockNonNumbers(this.realInput, event, true, true);
		} else if (event.target == this.cryInput) {
			Utils.blockNonNumbers(this.cryInput, event, true, false);
		}
	};

	ConstantEditDialog.prototype.doClick = function(evt) {
		if (evt.target.name == "opt" + this.options.id) {
			this.currentSelect = evt.target.value;
			if (evt.target.value == 1) { // boolean
				this.trueRadio.disabled = false;
				this.falseRadio.disabled = false;
				this.intInput.disabled = true;
				this.realInput.disabled = true;
				this.stringInput.disabled = true;
				this.cryInput.disabled = true;
			} else if (evt.target.value == 2) { // integer
				this.trueRadio.disabled = true;
				this.falseRadio.disabled = true;
				this.intInput.disabled = false;
				this.realInput.disabled = true;
				this.stringInput.disabled = true;
				this.cryInput.disabled = true;
			} else if (evt.target.value == 3) { // real
				this.trueRadio.disabled = true;
				this.falseRadio.disabled = true;
				this.intInput.disabled = true;
				this.realInput.disabled = false;
				this.stringInput.disabled = true;
				this.cryInput.disabled = true;
			} else if (evt.target.value == 4) { // currency
				this.trueRadio.disabled = true;
				this.falseRadio.disabled = true;
				this.intInput.disabled = true;
				this.realInput.disabled = true;
				this.stringInput.disabled = true;
				this.cryInput.disabled = false;
			} else if (evt.target.value == 5) { // string
				this.trueRadio.disabled = true;
				this.falseRadio.disabled = true;
				this.intInput.disabled = true;
				this.realInput.disabled = true;
				this.stringInput.disabled = false;
				this.cryInput.disabled = true;
			} else if (evt.target.value == 6) { // null
				this.trueRadio.disabled = true;
				this.falseRadio.disabled = true;
				this.intInput.disabled = true;
				this.realInput.disabled = true;
				this.stringInput.disabled = true;
				this.cryInput.disabled = true;
			}
		} else if (evt.target.name == "OK" + this.options.id) {
			if (this.currentSelect == 1) { // boolean
				this.returnType = "Boolean";
				var b = $(
						'input[type="radio"][name="inlineRadioOptions'
								+ this.options.id + '"]:checked').val();
				var c = new BooleanConstant();
				if (b == "t") {
					c.value = "true";
				}
				this.entity.insert(c);
			} else if (this.currentSelect == 2) { // integer
				if (this.intInput.value == "") {
					this.messageBox.show(4, "整数值不能为空", false);
					return;
				} else {
					var c = new IntegerConstant();
					// c.numberSystem = 0/1/2;
					c.value = this.intInput.value;
					this.entity.insert(c);
				}
			} else if (this.currentSelect == 3) { // real
				if (this.realInput.value == "") {
					this.messageBox.show(4, "小数值不能为空", false);
					return;
				} else {
					var c = new DoubleConstant();
					c.value = this.realInput.value;
					this.entity.insert(c);
				}
			} else if (this.currentSelect == 4) { // currency
				if (this.cryInput.value == "") {
					this.messageBox.show(4, "金额值不能为空", false);
					return;
				} else {
					var c = new DoubleConstant();
					c.value = this.cryInput.value;
					this.entity.insert(c);
				}
			} else if (this.currentSelect == 5) { // string
				if (this.stringInput.value == "") {
					this.messageBox.show(4, "文本不能为空", false);
					return;
				} else {
					var c = new StringConstant();
					c.value = this.stringInput.value;
					this.entity.insert(c);
				}
			} else if (this.currentSelect == 6) { // null value
				var c = new NullValue();
				this.entity.insert(c);
			}
			this.hide();
		}
	};

	ConstantEditDialog.prototype.show = function(model) {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : model
		});
	};

	ConstantEditDialog.prototype.hide = function() {
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