;
(function($, window, document, undefined) {
	var pluginName = "navigationRuleEditPanel";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var NavigationRulePanel = function(element, options) {
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
		this.navigationEditButton;
		this.navRuleDetail;
		this.ruleditdialog;
		this.entity = options.entity; // transition
		this.init(options);
	};

	NavigationRulePanel.prototype.init = function(options) {
		// rule edit dialog;
		var plugin2 = $(this.topparent).ruleEditModalDialog({
			id : options.id,
			title : "轩琦科技 - 表达式编辑器",
			parent : this,
			topparent : this.topparent,
		});
		this.ruleditdialog = plugin2.data("ruleEditModalDialog");
		this.loadPane(options.entity, options.currowner);
	};

	NavigationRulePanel.prototype.loadPane = function(entity, owner) {
		this.owner = owner;
		this.entity = entity; // transition

		var mainmodalframeDiv = document.createElement("div");
		mainmodalframeDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		mainmodalframeDiv.style.padding = "4px";
		this.element.appendChild(mainmodalframeDiv);

		var mainmodalframe = document.createElement("div");
		mainmodalframe.className = "panel panel-default";
		mainmodalframeDiv.appendChild(mainmodalframe);

		var modalframe = document.createElement("div");
		modalframe.className = "panel-body";
		mainmodalframe.appendChild(modalframe);

		var radioOptionDiv = document.createElement("div");
		radioOptionDiv.className = "radio-inline";
		modalframe.appendChild(radioOptionDiv);

		var radioOptionLabel = document.createElement("label");
		radioOptionDiv.appendChild(radioOptionLabel);

		this.radioOption = document.createElement("input");
		this.radioOption.type = "radio";
		this.radioOption.name = "navigationRuleOption" + this.options.id;
		this.radioOption.id = "condtionOptions1" + this.options.id;
		this.radioOption.setAttribute("value", "1");
		this.radioOption.setAttribute("checked", "true");
		radioOptionLabel.appendChild(this.radioOption);

		var radioOptionTxt = document.createElement("label");
		radioOptionTxt.innerHTML = "无条件转移";
		radioOptionLabel.appendChild(radioOptionTxt);

		var radioOptionDiv1 = document.createElement("div");
		radioOptionDiv1.className = "radio-inline";
		modalframe.appendChild(radioOptionDiv1);

		var radioOptionLabel1 = document.createElement("label");
		radioOptionDiv1.appendChild(radioOptionLabel1);

		this.radioOption1 = document.createElement("input");
		this.radioOption1.type = "radio";
		this.radioOption1.name = "navigationRuleOption" + this.options.id;
		this.radioOption1.id = "condtionOptions2" + this.options.id;
		this.radioOption1.setAttribute("value", "2");
		radioOptionLabel1.appendChild(this.radioOption1);

		var radioOptionTxt1 = document.createElement("label");
		radioOptionTxt1.innerHTML = "有条件转移";
		radioOptionLabel1.appendChild(radioOptionTxt1);

		var navigationRuleDiv1 = document.createElement("div");
		navigationRuleDiv1.className = "form-group";
		modalframe.appendChild(navigationRuleDiv1);

		var navigationRuleLabel1 = document.createElement("label");
		navigationRuleLabel1.setAttribute("for", "navigationRuledetails"
				+ this.options.id);
		navigationRuleLabel1.className = "control-label";
		navigationRuleLabel1.innerHTML = "条件设定";
		navigationRuleDiv1.appendChild(navigationRuleLabel1);

		var rulesettinggroup = document.createElement("div");
		rulesettinggroup.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12 input-group";
		navigationRuleDiv1.appendChild(rulesettinggroup);

		var buttongspan = document.createElement("span");
		buttongspan.className = "input-group-btn";
		rulesettinggroup.appendChild(buttongspan);

		this.navigationEditButton = document.createElement("button");
		this.navigationEditButton.type = "button";
		this.navigationEditButton.id = "navigationEditButton" + this.options.id;
		this.navigationEditButton.name = "navigationEditButton"
				+ this.options.id;
		this.navigationEditButton.className = "btn btn-primary";
		this.navigationEditButton.innerHTML = "编辑";
		this.navigationEditButton.setAttribute("disabled", "true");
		this.navigationEditButton.addEventListener("click", this, false);
		buttongspan.appendChild(this.navigationEditButton);

		this.navRuleDetail = document.createElement("input");
		this.navRuleDetail.type = "text";
		this.navRuleDetail.className = "form-control";
		this.navRuleDetail.style.width = "100%";
		this.navRuleDetail.setAttribute("readonly", "");
		this.navRuleDetail.id = "navigationRuledetails" + this.options.id;
		rulesettinggroup.appendChild(this.navRuleDetail);

		this.radioOption.addEventListener("click", this, false);
		this.radioOption1.addEventListener("click", this, false);
		this.navRuleDetail.addEventListener("dblclick", this, false);

		this.setTransition(entity, owner);

	};

	NavigationRulePanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	NavigationRulePanel.prototype.doDblClick = function(evt) {
		if (this.radioOption1.checked) {
			this.ruleditdialog.initialDialog(this.entity, this.owner);
			this.ruleditdialog.show();
		}
	};

	NavigationRulePanel.prototype.doClick = function(evt) {
		if (evt.target.id == "condtionOptions1" + this.options.id) { // unconditional
			// handler
			map[this.owner.id].stack.execute(new PMNavigationChangeCmd(
					this.entity, this, true, this.owner));
		} else if (evt.target.id == "condtionOptions2" + this.options.id) { // conditional
			// handler
			map[this.owner.id].stack.execute(new PMNavigationChangeCmd(
					this.entity, this, false, this.owner));
		} else if (evt.target.id == "navigationEditButton" + this.options.id) {
			// navigation rule editing
			// show rule edit dialog ...
			this.ruleditdialog.initialDialog(this.entity, this.owner);
			this.ruleditdialog.show();
		}
	};

	NavigationRulePanel.prototype.setTransition = function(transition, owner) {
		if ((transition.source.isParallelOutput != undefined && transition.source.isParallelOutput == true)
				|| (transition.target.isParallelInput != undefined && transition.target.isParallelInput == true)) {
			this.navigationEditButton.disabled = true;
			this.radioOption.disabled = true;
			this.radioOption1.disabled = true;
			return;
		}
		if (transition.alwaysTrue) {
			this.radioOption.checked = true; // unconditional
			this.navigationEditButton.disabled = true;
		} else {
			this.radioOption1.checked = true; // conditional
			if (owner instanceof WfProcess) {
				this.navigationEditButton.disabled = false;
			}
		}
		if (owner instanceof WfProcess) {
			this.radioOption.disabled = false;
			this.radioOption1.disabled = false;
		} else {
			this.radioOption.disabled = true;
			this.radioOption1.disabled = true;
		}
		// show the existing navigation rule on the panel
		if (transition.navigationRule != null) {
			this.updateDetails(transition.navigationRule);
		}
	};

	NavigationRulePanel.prototype.getTransition = function() {
		return this.entity;
	};

	NavigationRulePanel.prototype.updateDetails = function(rule) {
		// $(this.navRuleDetail).val(rule.toString());
		if (rule != null)
			this.navRuleDetail.value = rule.toString();
		else
			this.navRuleDetail.value = "";
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$
						.data(this, pluginName, new NavigationRulePanel(this,
								options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);