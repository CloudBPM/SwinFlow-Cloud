/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "smsTemplateSettingPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var TemplateSettingPanel = function(element, options) {
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

	TemplateSettingPanel.prototype.init = function(options) {
		this.entity = options.entity;
		if (this.entity.template != undefined)
			this.oldTempl = this.entity.template;
		else
			this.oldTempl = "";
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
		urlLabel.innerHTML = "短信模板列表";

		var smsSelDiv = document.createElement("DIV");
		smsSelDiv.className = "col-sm-10";
		groupDiv.appendChild(smsSelDiv);
		this.templateList = document.createElement("select");
		smsSelDiv.appendChild(this.templateList);
		this.templateList.className = "form-control";
		this.templateList.id = "stpl" + options.id;
		this.templateList.name = "stpl" + options.id;

		this.addOptions(this.templateList, "-请选择-", "-1", 0);

		this.templateList.addEventListener("change", this, false);

		var groupDiv1 = document.createElement("DIV");
		urlform.appendChild(groupDiv1);
		groupDiv1.className = "form-group";

		var tempDiv = document.createElement("DIV");
		tempDiv.className = "col-sm-12";
		groupDiv1.appendChild(tempDiv);
		this.templateEidtor = document.createElement("textarea");
		tempDiv.appendChild(this.templateEidtor);
		this.templateEidtor.className = "form-control";
		this.templateEidtor.id = "tempeditor" + options.id;
		this.templateEidtor.name = "tempeditor" + options.id;
		this.templateEidtor.setAttribute("rows", "10");

		this.loadingData(this.entity);
	};

	TemplateSettingPanel.prototype.loadingData = function(entity) {
		if (this.options.currowner instanceof WfProcess) {
			this.templateList.disabled = false;
			this.templateEidtor.disabled = false;
		} else {
			this.templateList.disabled = true;
			this.templateEidtor.disabled = true;
		}

		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(33, entity.owner), {}).complete(function(data) {
			if (data != undefined && data.responseJSON != undefined) {
				that.loadData(entity, data.responseJSON);
			}
			$("#progressbar").hide();
		});
	};

	// entity is EmailSendingTask in wfprocess
	TemplateSettingPanel.prototype.loadData = function(entity, templates) {
		$(this.templateList).find('option').remove();
		this.templates = [];
		this.addOptions(this.templateList, "-请选择-", "-1", 0);
		if (templates != null && templates.length > 0) {
			for (var i = 0; i < templates.length; i++) {
				this.templates[i] = new SMSTemplate();
				this.templates[i].parse(templates[i]);
				this.addOptions(this.templateList, this.templates[i].name,
						this.templates[i].id, i + 1);
			}
			if (entity.templateId != undefined) {
				this.templateList.value = entity.templateId;
			}
		}
		this.templateEidtor.value = entity.template;
	};

	TemplateSettingPanel.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	TemplateSettingPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	TemplateSettingPanel.prototype.doChange = function(evt) {
		if (evt.target == this.templateEidtor) {
			var newvalue = $(this.templateEidtor).val();
			if (newvalue != this.oldTempl) {
				map[this.options.currowner.id].stack
						.execute(new PMValueChangedCmd(this.entity, "template",
								newvalue, this.options.currowner));
			}
		} else if (evt.target == this.templateList) {
			if (this.templateList.value != "-1") {
				for (var i = 0; i < this.templates.length; i++) {
					if (this.templates[i].id == this.templateList.value) {
						map[this.options.currowner.id].stack
								.execute(new PMSMSTemplateChangedCmd(
										this.entity, this.templates[i],
										this.options.currowner));
						break;
					}
				}
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new TemplateSettingPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);