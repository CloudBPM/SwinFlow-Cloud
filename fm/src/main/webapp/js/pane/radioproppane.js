/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "radioPropPane";
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
		var group4 = document.createElement("div");
		group4.className = "form-group";
		form1.appendChild(group4);

		var label4 = document.createElement("label");
		group4.appendChild(label4);
		label4.setAttribute("for", "default" + options.id);
		label4.className = "col-sm-2 control-label";
		label4.innerHTML = "选项值";

		var selDiv4 = document.createElement("div");
		selDiv4.className = "col-sm-10";
		group4.appendChild(selDiv4);

		this.optionValue = document.createElement("INPUT");
		selDiv4.appendChild(this.optionValue);
		this.optionValue.id = "value" + options.id;
		this.optionValue.name = "value" + options.id;
		this.optionValue.className = "form-control";
		this.optionValue.setAttribute("placeholder", "选项值");
		this.optionValue.addEventListener("change", this, false);

		// option/value
		var group3 = document.createElement("div");
		group3.className = "form-group";
		form1.appendChild(group3);

		var label3 = document.createElement("label");
		group3.appendChild(label3);
		label3.setAttribute("for", "seloptions" + options.id);
		label3.className = "col-sm-2 control-label";
		label3.innerHTML = "选项文本";

		var selDiv3 = document.createElement("div");
		selDiv3.className = "col-sm-10";
		group3.appendChild(selDiv3);

		this.optionText = document.createElement("TEXTAREA");
		selDiv3.appendChild(this.optionText);
		this.optionText.id = "text" + options.id;
		this.optionText.name = "text" + options.id;
		this.optionText.className = "form-control";
		this.optionText.rows = "5";
		this.optionText.setAttribute("placeholder", "选项文本");
		this.optionText.addEventListener("change", this, false);

		this.loadData(this.entity);
		
		if (options.currowner instanceof ReleasedForm) {
			this.optionValue.disabled = true;
			this.optionText.disabled = true;
		}
	};

	BasicPropPanel.prototype.loadData = function(entity) {
		this.optionValue.value = this.entity.initValue;
		this.optionText.value = this.entity.title;
	};

	BasicPropPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	BasicPropPanel.prototype.doChange = function(evt) {
		if (evt.target == this.optionText) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "title", this.optionText.value,
					this.options.currowner));
		} else if (evt.target == this.optionValue) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "initValue", this.optionValue.value,
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