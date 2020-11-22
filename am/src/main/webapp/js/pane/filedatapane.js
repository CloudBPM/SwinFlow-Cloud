/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "fileUploadEditPane";
	var defaults = {
		id : "",
		parent : "",
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
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
		this.element.appendChild(modalframe);
		var groupDiv1 = document.createElement("DIV");
		modalframe.appendChild(groupDiv1);
		groupDiv1.className = "form-group";

		var usrLabel = document.createElement("LABEL");
		groupDiv1.appendChild(usrLabel);
		usrLabel.setAttribute("for", "fileupload" + options.id);
		usrLabel.className = "col-sm-2 control-label";
		usrLabel.innerHTML = "表单文件参数";

		var usrDiv = document.createElement("DIV");
		groupDiv1.appendChild(usrDiv);
		usrDiv.className = "col-sm-9";

		this.usrInput = document.createElement("INPUT");
		usrDiv.appendChild(this.usrInput);
		this.usrInput.type = "file";
		this.usrInput.className = "form-control btn-default";
		this.usrInput.id = "fileupload" + options.id;
		this.usrInput.addEventListener("change", this, false);

	};

	EditPanel.prototype.setEntity = function(entity) {
		this.entity = entity;
	};

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	EditPanel.prototype.doChange = function(evt) {
		// if (evt.target == this.usrInput) {
		// map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
		// this.entity, "Username", this.usrInput));
		// } else if (evt.target == this.passInput) {
		// map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
		// this.entity, "Password", this.passInput));
		// }
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