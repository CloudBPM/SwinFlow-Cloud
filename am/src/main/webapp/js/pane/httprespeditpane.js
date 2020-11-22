/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "httpResponseEditPane";
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
		this._name = pluginName;
		this.init(options);
	};

	EditPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		this.element.appendChild(modalframe);
		modalframe.className = "panel panel-default";
		modalframe.id = "authTabBody" + options.id;
		modalframe.style.height = options.height + "px";
		modalframe.style.margin = "0px";
		modalframe.style.marginTop = "2px";
		modalframe.style.padding = "0px";
		modalframe.style.overflowX = "auto";
		modalframe.style.overflowY = "auto";

		var authTabBody = document.createElement("DIV");
		modalframe.appendChild(authTabBody);
		authTabBody.className = "panel-body";

		var authTypeGroupDiv = document.createElement("DIV");
		authTabBody.appendChild(authTypeGroupDiv);
		authTypeGroupDiv.className = "form-group";

		var authlabel = document.createElement("label");
		authTypeGroupDiv.appendChild(authlabel);
		authlabel.setAttribute("for", "authtype" + options.id);
		authlabel.className = "col-sm-3 control-label";
		authlabel.innerHTML = "返回类型";

		var authTyepDIV = document.createElement("DIV");
		authTypeGroupDiv.appendChild(authTyepDIV);
		authTyepDIV.className = "col-sm-9";

		this.respSelect = document.createElement("select");
		authTyepDIV.appendChild(this.respSelect);
		this.respSelect.className = "form-control";
		this.respSelect.id = "authtype" + options.id;
		this.respSelect.addEventListener("change", this, false);

		this.addOptions(this.respSelect, returntype[0], "0", 0);
		this.addOptions(this.respSelect, returntype[1], "1", 1);
		this.addOptions(this.respSelect, returntype[2], "2", 2);
		
		var rDescGroupDiv = document.createElement("DIV");
		authTabBody.appendChild(rDescGroupDiv);
		rDescGroupDiv.className = "form-group";
		
		var rDesclabel = document.createElement("label");
		rDescGroupDiv.appendChild(rDesclabel);
		rDesclabel.setAttribute("for", "authtype" + options.id);
		rDesclabel.className = "col-sm-3 control-label";
		rDesclabel.innerHTML = "注释";
		
		var rDescDIV = document.createElement("DIV");
		rDescGroupDiv.appendChild(rDescDIV);
		rDescDIV.className = "col-sm-9";
		
		this.respTextArea = document.createElement("TextArea");
		rDescDIV.appendChild(this.respTextArea);
		this.respTextArea.className = "form-control";
		this.respTextArea.id = "rdesc" + options.id;
		this.respTextArea.className = "form-control";
		this.respTextArea.addEventListener("change", this, false);

	};

	EditPanel.prototype.setEntity = function(entity) {
		this.entity = entity;
		this.respSelect.value = entity.returnType;
		this.respTextArea.value = entity.returnTypeDescription;
	};

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	EditPanel.prototype.doChange = function(evt) {
		if (evt.target == this.respSelect) {
			map[this.entity.id].stack.execute(new AMWebAppReturnTypeChangedCmd(
					this.entity, this.respSelect.value));
		} else if (evt.target == this.respTextArea) {
			map[this.entity.id].stack.execute(new AMWebAppReturnDescChangedCmd(
					this.entity, this.respTextArea.value));
		}
	};

	EditPanel.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
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