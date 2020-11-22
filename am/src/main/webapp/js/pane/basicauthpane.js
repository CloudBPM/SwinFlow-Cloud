/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "basicAuthEditPane";
	var defaults = {
		id : "",
		parent : "",
		width : 0,
		height : 0,
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			width : 0,
			height : 0,
		}, defaults, options);
		this._defaults = defaults;
		this.entity = null;
		this._name = pluginName;
		this.init(options);
	};

	EditPanel.prototype.loadPane = function() {
		this.init(this.options);
	};

	EditPanel.prototype.init = function(options) {
		var modalframe = document.createElement("div");
		modalframe.id = options.id;
		this.element.appendChild(modalframe);
		var groupDiv1 = document.createElement("DIV");
		modalframe.appendChild(groupDiv1);
		groupDiv1.className = "form-group";

		var usrLabel = document.createElement("LABEL");
		groupDiv1.appendChild(usrLabel);
		usrLabel.setAttribute("for", "username" + options.id);
		usrLabel.className = "col-sm-2 control-label";
		usrLabel.innerHTML = "用户名";

		var usrDiv = document.createElement("DIV");
		groupDiv1.appendChild(usrDiv);
		usrDiv.className = "col-sm-10";

		this.usrInput = document.createElement("INPUT");
		usrDiv.appendChild(this.usrInput);
		this.usrInput.type = "text";
		this.usrInput.className = "form-control";
		this.usrInput.id = "username" + options.id;
		this.usrInput.addEventListener("change", this, false);

		var groupDiv2 = document.createElement("DIV");
		modalframe.appendChild(groupDiv2);
		groupDiv2.className = "form-group";

		var passLabel = document.createElement("LABEL");
		groupDiv2.appendChild(passLabel);
		passLabel.setAttribute("for", "username" + options.id);
		passLabel.className = "col-sm-2 control-label";
		passLabel.innerHTML = "密码";

		var passDiv = document.createElement("DIV");
		groupDiv2.appendChild(passDiv);
		passDiv.className = "col-sm-10";

		this.passInput = document.createElement("INPUT");
		passDiv.appendChild(this.passInput);
		this.passInput.type = "text";
		this.passInput.className = "form-control";
		this.passInput.id = "password" + options.id;
		this.passInput.addEventListener("change", this, false);

	};

	EditPanel.prototype.loadEntity = function(entity) {
		this.entity = entity;
		this.usrInput.value = this.entity.authorization[0].value;
		this.passInput.value = this.entity.authorization[1].value;
	};

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	EditPanel.prototype.doChange = function(evt) {
		if (evt.target == this.usrInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Username", this.usrInput));
		} else if (evt.target == this.passInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Password", this.passInput));
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EditPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);