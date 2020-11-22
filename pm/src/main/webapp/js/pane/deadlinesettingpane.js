/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "deadlineSettingPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var DeadlineSettingPanel = function(element, options) {
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
		this.entity = options.entity;
		this.currpage = null; // by default;
		this.init(options);
	};

	DeadlineSettingPanel.prototype.init = function(options) {
		this.entity = options.entity;
		var mainmodalframeDiv = document.createElement("div");
		this.element.appendChild(mainmodalframeDiv);
		mainmodalframeDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		mainmodalframeDiv.style.padding = "4px";

		var mainmodalframe = document.createElement("div");
		mainmodalframeDiv.appendChild(mainmodalframe);
		mainmodalframe.className = "panel panel-default";

		var modalframe = document.createElement("div");
		mainmodalframe.appendChild(modalframe);
		modalframe.className = "panel-body";

		var deallineform = document.createElement("form");
		modalframe.appendChild(deallineform);
		deallineform.className = "form-inline";

		var dldiv = document.createElement("div");
		deallineform.appendChild(dldiv);
		dldiv.className = "form-group";
		var dllabel = document.createElement("label");
		dldiv.appendChild(dllabel);
		dllabel.setAttribute("for", "deadline" + options.id);
		dllabel.innerHTML = "办结期限";

		this.dlinput = document.createElement("input");
		dldiv.appendChild(this.dlinput);
		this.dlinput.type = "number";
		this.dlinput.className = "form-control";
		this.dlinput.value = this.entity.deadlineDays;
		this.dlinput.id = "deadline" + options.id;
		this.dlinput.setAttribute("placeholder", "请输入数字");
		this.dlinput.setAttribute("min", "0");
		this.dlinput.setAttribute("step", "1");
		this.dlinput.setAttribute("pattern", "^\d*");
		this.dlinput.addEventListener("focusout", this, false);

		var dllabel1 = document.createElement("label");
		dldiv.appendChild(dllabel1);
		dllabel1.setAttribute("for", "alarm" + options.id);
		dllabel1.innerHTML = "个工作日" + "&nbsp;&nbsp;";

		var dllabel11 = document.createElement("label");
		dldiv.appendChild(dllabel11);
		dllabel11.setAttribute("for", "alarm" + options.id);
		dllabel11.innerHTML = "提前";

		this.alminput = document.createElement("input");
		dldiv.appendChild(this.alminput);
		this.alminput.type = "number";
		this.alminput.className = "form-control";
		this.alminput.value = this.entity.alarmDays;
		this.alminput.id = "alarm" + options.id;
		this.alminput.setAttribute("placeholder", "请输入数字");
		this.alminput.setAttribute("min", "0");
		this.alminput.setAttribute("step", "1");
		this.alminput.setAttribute("pattern", "\d*");
		this.alminput.addEventListener("focusout", this, false);

		var dllabel2 = document.createElement("label");
		dldiv.appendChild(dllabel2);
		dllabel2.innerHTML = "个工作日自动提醒" + "&nbsp;&nbsp;";

		var dllabel3 = document.createElement("label");
		dldiv.appendChild(dllabel3);
		dllabel3.innerHTML = "提醒频率";

		this.almselect = document.createElement("select");
		dldiv.appendChild(this.almselect);
		this.almselect.className = "form-control";
		this.almselect.addEventListener("change", this, false);
		this.almselect.addEventListener("keydown", this, false);

		this.addOptions(this.almselect, "每小时", "0", 0);
		this.addOptions(this.almselect, "每天", "1", 1);
		this.addOptions(this.almselect, "每两天", "2", 2);
		this.addOptions(this.almselect, "每周", "3", 3);

		this.almselect.selectedIndex = this.entity.alarmFrequency;

		var dllabel4 = document.createElement("label");
		dldiv.appendChild(dllabel4);
		dllabel4.innerHTML = "提醒方式";

		this.almmthselect = document.createElement("select");
		dldiv.appendChild(this.almmthselect);
		this.almmthselect.className = "form-control";
		this.almmthselect.addEventListener("change", this, false);

		this.addOptions(this.almmthselect, "手机", "0", 0);
		this.addOptions(this.almmthselect, "邮件", "1", 1);

		this.almmthselect.selectedIndex = this.entity.alarmMethod;

		// general message dialog plugin
		var p3 = $(options.topparent).messageDialog({
			id : "0167",
			title : "云BPM - 提示",
			parent : this,
		});
		this.messageDialog = p3.data("messageDialog");
		
		if (this.options.currowner instanceof WfProcess) {
			this.dlinput.disabled = false;
			this.alminput.disabled = false;
			this.almselect.disabled = false;
			this.almmthselect.disabled = false;
		} else {
			this.dlinput.disabled = true;
			this.alminput.disabled = true;
			this.almselect.disabled = true;
			this.almmthselect.disabled = true;
		}

	};

	DeadlineSettingPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		case "focusout":
			this.doFocusout(e);
			break;
		}
	};

	DeadlineSettingPanel.prototype.doChange = function(evt) {
		if (evt.target == this.almselect) {
			map[this.options.currowner.id].stack.execute(new PMValueChangedCmd(
					this.entity, "alarmFrequency",
					this.almselect.options[this.almselect.selectedIndex].value,
					this.options.currowner));
		} else if (evt.target == this.almmthselect) {
			map[this.options.currowner.id].stack
					.execute(new PMValueChangedCmd(
							this.entity,
							"alarmMethod",
							this.almmthselect.options[this.almmthselect.selectedIndex].value,
							this.options.currowner));
		}
	};

	DeadlineSettingPanel.prototype.doFocusout = function(evt) {
		if (evt.target == this.alminput) {
			var v = this.alminput.value;
			var v1 = this.dlinput.value;
			if (parseInt(v) > parseInt(v1)) {
				this.messageDialog.show("办理期限天数不能小于提醒天数");
				this.alminput.focus();
				return false;
			}
			map[this.options.currowner.id].stack.execute(new PMValueChangedCmd(
					this.entity, "alarmDays", this.alminput.value,
					this.options.currowner));
		} else if (evt.target == this.dlinput) {
			map[this.options.currowner.id].stack.execute(new PMValueChangedCmd(
					this.entity, "deadlineDays", this.dlinput.value,
					this.options.currowner));
		}
	};

	DeadlineSettingPanel.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new DeadlineSettingPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);