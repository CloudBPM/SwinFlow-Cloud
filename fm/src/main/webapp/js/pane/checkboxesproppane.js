/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "checkboxesPropPane";
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
		var group4 = document.createElement("div");
		group4.className = "form-group";
		form1.appendChild(group4);

		var label4 = document.createElement("label");
		group4.appendChild(label4);
		label4.setAttribute("for", "default" + options.id);
		label4.className = "col-sm-2 control-label";
		label4.innerHTML = "默认选择";

		var selDiv4 = document.createElement("div");
		selDiv4.className = "col-sm-10";
		group4.appendChild(selDiv4);

		this.loadData(options, this.entity, selDiv4);
	};

	BasicPropPanel.prototype.loadData = function(options, entity, parent) {
		if (entity.children.length > 0) {
			for (var i = 0; i < entity.children.length; i++) {
				var checkDiv = document.createElement("DIV");
				parent.appendChild(checkDiv);
				checkDiv.className = "checkbox";
				var checkLabel = document.createElement("LABEL");
				checkDiv.appendChild(checkLabel);
				var checkInput = document.createElement("INPUT");
				checkLabel.appendChild(checkInput);
				checkInput.value = entity.children[i].id;
				checkInput.type = "checkbox";
				checkInput.addEventListener("click", this, false);
				checkLabel.appendChild(document
						.createTextNode(entity.children[i].title));
				if (entity.children[i].checked == 1) {
					checkInput.checked = true;
				}
				if (options.currowner instanceof ReleasedForm) {
					checkInput.disabled = true;
				}
			}
		}
	};

	BasicPropPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	BasicPropPanel.prototype.doClick = function(evt) {
		if (this.entity.children.length > 0) {
			for (var i = 0; i < this.entity.children.length; i++) {
				if (this.entity.children[i].id == evt.target.value) {
					var c = 0;
					if (evt.target.checked) {
						c = 1;
					}
					var ch = this.options.currowner
							.seekObjectByID(evt.target.value);
					map[this.options.currowner.id].stack
							.execute(new FMValueChangedCmd(ch, "checked", c,
									this.options.currowner));
				}
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