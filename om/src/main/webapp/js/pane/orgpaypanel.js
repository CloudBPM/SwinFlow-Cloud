/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "orgPaymentManagementPane";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		entity : "",
		topparent : "",
	};

	var ManagementPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			parent : "",
			entity : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = options.entity;
		this.init(options);
	};

	ManagementPanel.prototype.init = function(options) {
		this.entity = options.entity;
		// bank account info
		var mainmodalframe = document.createElement("div");
		this.element.appendChild(mainmodalframe);
		mainmodalframe.className = "panel panel-default";
		mainmodalframe.style.marginTop = "2px";

		var panelbody = document.createElement("div");
		mainmodalframe.appendChild(panelbody);
		panelbody.className = "panel-body";

		var accountform = document.createElement("form");
		panelbody.appendChild(accountform);
		accountform.className = "form-horizontal";

		// account number
		var accountgroup = document.createElement("div");
		accountform.appendChild(accountgroup);
		accountgroup.style.padding = "2px";
		accountgroup.className = "form-group";

		var accountLabel = document.createElement("label");
		accountgroup.appendChild(accountLabel);
		accountLabel.className = "col-sm-3 control-label";
		accountLabel.innerHTML = "开户银行账号";

		var accountdiv = document.createElement("div");
		accountdiv.className = "col-sm-9 col-xs-12";
		accountgroup.appendChild(accountdiv);

		this.accountInput = document.createElement("input");
		this.accountInput.type = "text";
		this.accountInput.id = "accountInput" + this.options.id;
		this.accountInput.name = "accountInput" + this.options.id;
		this.accountInput.className = "form-control";
		this.accountInput.setAttribute("placeholder", "请输入开户行账户");
		accountdiv.appendChild(this.accountInput);

		// account name
		var accountnamegroup = document.createElement("div");
		accountnamegroup.style.padding = "2px";
		accountnamegroup.className = "form-group";
		accountform.appendChild(accountnamegroup);

		var accountnameLabel = document.createElement("label");
		accountnameLabel.className = "col-sm-3 control-label";
		accountnameLabel.innerHTML = "开户银行账户名";
		accountnamegroup.appendChild(accountnameLabel);

		var accountnameDiv = document.createElement("div");
		accountnameDiv.className = "col-sm-9 col-xs-12";
		accountnamegroup.appendChild(accountnameDiv);

		this.accountNameInput = document.createElement("input");
		this.accountNameInput.type = "text";
		this.accountNameInput.id = "accountnameInput" + this.options.id;
		this.accountNameInput.name = "accountnameInput" + this.options.id;
		this.accountNameInput.className = "form-control";
		this.accountNameInput.setAttribute("placeholder", "请输入开户行账户名");
		accountnameDiv.appendChild(this.accountNameInput);

		// account address
		var accountaddressgroup = document.createElement("div");
		accountaddressgroup.style.padding = "2px";
		accountaddressgroup.className = "form-group";
		accountform.appendChild(accountaddressgroup);

		var accountaddressLabel = document.createElement("label");
		accountaddressLabel.className = "col-sm-3 control-label";
		accountaddressLabel.innerHTML = "开户银行地址";
		accountaddressgroup.appendChild(accountaddressLabel);

		var accountaddressDiv = document.createElement("div");
		accountaddressDiv.className = "col-sm-9 col-xs-12";
		accountaddressgroup.appendChild(accountaddressDiv);

		this.accountAddressInput = document.createElement("input");
		this.accountAddressInput.type = "text";
		this.accountAddressInput.id = "accountaddressInput" + this.options.id;
		this.accountAddressInput.name = "accountaddressInput" + this.options.id;
		this.accountAddressInput.className = "form-control";
		this.accountAddressInput.setAttribute("placeholder", "请输入开户行地址");
		accountaddressDiv.appendChild(this.accountAddressInput);
		
		
		this.addListeners();

		this.setEntity(this.entity);
	};
	
	ManagementPanel.prototype.addListeners = function() {
		this.accountInput.addEventListener("change", this, false);
		this.accountNameInput.addEventListener("change", this, false);
		this.accountAddressInput.addEventListener("change", this, false);
	}

	ManagementPanel.prototype.removeListeners = function() {
		this.accountInput.removeEventListener("change", this, false);
		this.accountNameInput.removeEventListener("change", this, false);
		this.accountAddressInput.removeEventListener("change", this, false);
	}

	ManagementPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	ManagementPanel.prototype.doChange = function(evt) {
		if (evt.target == this.accountInput) {
			map[this.entity.id].stack.execute(new OMOrgTextPropChangedCmd(
					this.entity, "bankAccountNumber", this.accountInput.value));
		} else if (evt.target == this.accountNameInput) {
			map[this.entity.id].stack
					.execute(new OMOrgTextPropChangedCmd(this.entity,
							"bankAccountName", this.accountNameInput.value));
		} else if (evt.target == this.accountAddressInput) {
			map[this.entity.id].stack
					.execute(new OMOrgTextPropChangedCmd(this.entity,
							"bankAddress", this.accountAddressInput.value));
		}
	};
	
	ManagementPanel.prototype.setEntity = function(entity) {
		this.accountInput.value = Utils.parse(entity.bankAccountNumber);
		this.accountNameInput.value = Utils.parse(entity.bankAccountName);
		this.accountAddressInput.value = Utils.parse(entity.bankAddress);
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ManagementPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);