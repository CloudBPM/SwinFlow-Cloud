/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "multipleLineInputPropPane";
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

		// default value
		var group3 = document.createElement("div");
		group3.className = "form-group";
		form1.appendChild(group3);

		var label3 = document.createElement("label");
		group3.appendChild(label3);
		label3.setAttribute("for", "default" + options.id);
		label3.className = "col-sm-2 control-label";
		label3.innerHTML = "默认值";

		var selDiv3 = document.createElement("div");
		selDiv3.className = "col-sm-10";
		group3.appendChild(selDiv3);

		this.defaultText = document.createElement("TEXTAREA");
		selDiv3.appendChild(this.defaultText);
		this.defaultText.id = "default" + options.id;
		this.defaultText.name = "default" + options.id;
		this.defaultText.className = "form-control";
		this.defaultText.setAttribute("placeholder", "默认值为文本框中的初始值");
		this.defaultText.addEventListener("change", this, false);
		this.defaultText.rows = "5";

		this.loadData(this.entity);
		
		if (options.currowner instanceof ReleasedForm) {
			this.defaultText.disabled = true;
		}
	};

	BasicPropPanel.prototype.loadData = function(entity) {
		this.defaultText.value = this.entity.initValue;
	};

	BasicPropPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	BasicPropPanel.prototype.doChange = function(evt) {
		if (evt.target == this.defaultText) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "initValue", this.defaultText.value,
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