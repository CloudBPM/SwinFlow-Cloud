/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "clientUISettingPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var ClientUISettingPanel = function(element, options) {
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
		this.topparent = options.topparent;
		this.init(options);
	};

	ClientUISettingPanel.prototype.init = function(options) {
		this.entity = options.entity;
		if (this.entity.clientAppUrl != undefined)
			this.oldUrl = this.entity.clientAppUrl;
		else
			this.oldUrl = "";
		var modalframe = document.createElement("DIV");
		this.element.appendChild(modalframe);
		
		modalframe.style.margin = "2px";
		modalframe.className = "panel panel-default";

		var tpBodyDiv = document.createElement("div");
		modalframe.appendChild(tpBodyDiv);
		tpBodyDiv.className = "panel-body";
		
		var urlform = document.createElement("form");
		tpBodyDiv.appendChild(urlform);
		urlform.className = "form-horizontal";
		urlform.setAttribute("role", "form");
		var groupDiv = document.createElement("DIV");
		urlform.appendChild(groupDiv);
		groupDiv.className = "form-group";
		
		var urlLabel = document.createElement("label");
		groupDiv.appendChild(urlLabel);
		urlLabel.setAttribute("for", "urlvalue" + options.id);
		urlLabel.className = "col-sm-2 control-label";
		urlLabel.innerHTML = "客户操作界面链接";
		var urlDiv = document.createElement("DIV");
		urlDiv.className = "col-sm-10";
		groupDiv.appendChild(urlDiv);
		this.urlInput = document.createElement("input");
		urlDiv.appendChild(this.urlInput);
		this.urlInput.type = "url";
		this.urlInput.addEventListener("change", this, false);
		this.urlInput.className = "form-control";
		this.urlInput.id = "urlvalue" + options.id;
		this.urlInput.name = "urlvalue" + options.id;
		this.urlInput.value = this.oldUrl;
		this.urlInput.setAttribute("placeholder", "请输入一个工作流办理人员操作界面的链接地址。");
		
		if (this.options.currowner instanceof WfProcess) {
			this.urlInput.disabled = false;
		} else {
			this.urlInput.disabled = true;
		}
	};

	ClientUISettingPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	ClientUISettingPanel.prototype.doChange = function(evt) {
		var newvalue = $(this.urlInput).val();
		if (newvalue != this.oldUrl) {
			map[this.options.currowner.id].stack.execute(new PMValueChangedCmd(
					this.entity, "clientAppUrl", newvalue,
					this.options.currowner));
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new ClientUISettingPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);