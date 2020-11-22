/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "openAuthEditPane";
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

	EditPanel.prototype.loadPane = function() {
		this.init(this.options);
	};

	EditPanel.prototype.init = function(options) {
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);
		// consumer key
		var groupDiv1 = document.createElement("DIV");
		modalframe.appendChild(groupDiv1);
		groupDiv1.className = "form-group";
		groupDiv1.style.display = "none";

		var ckLabel = document.createElement("LABEL");
		groupDiv1.appendChild(ckLabel);
		ckLabel.setAttribute("for", "ck" + options.id);
		ckLabel.className = "col-sm-2 control-label";
		ckLabel.innerHTML = "Consumer Key";

		var ckDiv = document.createElement("DIV");
		groupDiv1.appendChild(ckDiv);
		ckDiv.className = "col-sm-10";

		this.ckInput = document.createElement("INPUT");
		ckDiv.appendChild(this.ckInput);
		this.ckInput.type = "text";
		this.ckInput.className = "form-control";
		this.ckInput.id = "ck" + options.id;
		this.ckInput.addEventListener("change", this, false);
		// consumer secret
		var groupDiv2 = document.createElement("DIV");
		modalframe.appendChild(groupDiv2);
		groupDiv2.className = "form-group";
		groupDiv2.style.display = "none";

		var csLabel = document.createElement("LABEL");
		groupDiv2.appendChild(csLabel);
		csLabel.setAttribute("for", "cs" + options.id);
		csLabel.className = "col-sm-2 control-label";
		csLabel.innerHTML = "Consumer Secret";

		var csDiv = document.createElement("DIV");
		groupDiv2.appendChild(csDiv);
		csDiv.className = "col-sm-10";

		this.csInput = document.createElement("INPUT");
		csDiv.appendChild(this.csInput);
		this.csInput.type = "text";
		this.csInput.className = "form-control";
		this.csInput.id = "cs" + options.id;
		this.csInput.addEventListener("change", this, false);
		// token
		var groupDiv3 = document.createElement("DIV");
		modalframe.appendChild(groupDiv3);
		groupDiv3.className = "form-group";
		groupDiv3.style.display = "none";

		var tokenLabel = document.createElement("LABEL");
		groupDiv3.appendChild(tokenLabel);
		tokenLabel.setAttribute("for", "tk" + options.id);
		tokenLabel.className = "col-sm-2 control-label";
		tokenLabel.innerHTML = "Token";

		var tokenDiv = document.createElement("DIV");
		groupDiv3.appendChild(tokenDiv);
		tokenDiv.className = "col-sm-10";

		this.tokenInput = document.createElement("INPUT");
		tokenDiv.appendChild(this.tokenInput);
		this.tokenInput.type = "text";
		this.tokenInput.className = "form-control";
		this.tokenInput.id = "tk" + options.id;
		this.tokenInput.addEventListener("change", this, false);
		// Token Secret
		var groupDiv4 = document.createElement("DIV");
		modalframe.appendChild(groupDiv4);
		groupDiv4.className = "form-group";
		groupDiv4.style.display = "none";

		var tsLabel = document.createElement("LABEL");
		groupDiv4.appendChild(tsLabel);
		tsLabel.setAttribute("for", "ts" + options.id);
		tsLabel.className = "col-sm-2 control-label";
		tsLabel.innerHTML = "Token Secret";

		var tsDiv = document.createElement("DIV");
		groupDiv4.appendChild(tsDiv);
		tsDiv.className = "col-sm-10";

		this.tsInput = document.createElement("INPUT");
		tsDiv.appendChild(this.tsInput);
		this.tsInput.type = "text";
		this.tsInput.className = "form-control";
		this.tsInput.id = "ts" + options.id;
		this.tsInput.addEventListener("change", this, false);
		// signature method
		var groupDiv5 = document.createElement("DIV");
		modalframe.appendChild(groupDiv5);
		groupDiv5.className = "form-group";
		groupDiv5.style.display = "none";

		var smLabel = document.createElement("LABEL");
		groupDiv5.appendChild(smLabel);
		smLabel.setAttribute("for", "sm" + options.id);
		smLabel.className = "col-sm-2 control-label";
		smLabel.innerHTML = "Signature Method";

		var smDiv = document.createElement("DIV");
		groupDiv5.appendChild(smDiv);
		smDiv.className = "col-sm-10";

		this.smSelect = document.createElement("SELECT");
		smDiv.appendChild(this.smSelect);
		this.smSelect.className = "form-control";
		this.smSelect.id = "sm" + options.id;
		this.smSelect.addEventListener("change", this, false);

		this.addOptions(this.smSelect, "HMAC-SHA1", "HMAC-SHA1", 0);
		this.addOptions(this.smSelect, "HMAC-SHA256", "HMAC-SHA256", 1);
		this.addOptions(this.smSelect, "PLAINTEXT", "PLAINTEXT", 2);

		// nonce
		var groupDiv6 = document.createElement("DIV");
		modalframe.appendChild(groupDiv6);
		groupDiv6.className = "form-group";
		groupDiv6.style.display = "none";

		var nonceLabel = document.createElement("LABEL");
		groupDiv6.appendChild(nonceLabel);
		nonceLabel.setAttribute("for", "nonce" + options.id);
		nonceLabel.className = "col-sm-2 control-label";
		nonceLabel.innerHTML = "Nonce";

		var nonceDiv = document.createElement("DIV");
		groupDiv6.appendChild(nonceDiv);
		nonceDiv.className = "col-sm-10";

		this.nonceInput = document.createElement("INPUT");
		nonceDiv.appendChild(this.nonceInput);
		this.nonceInput.type = "text";
		this.nonceInput.className = "form-control";
		this.nonceInput.id = "nonce" + options.id;
		this.nonceInput.addEventListener("change", this, false);
		// version
		var groupDiv7 = document.createElement("DIV");
		modalframe.appendChild(groupDiv7);
		groupDiv7.className = "form-group";
		groupDiv7.style.display = "none";

		var vLabel = document.createElement("LABEL");
		groupDiv7.appendChild(vLabel);
		vLabel.setAttribute("for", "v" + options.id);
		vLabel.className = "col-sm-2 control-label";
		vLabel.innerHTML = "Version";

		var vDiv = document.createElement("DIV");
		groupDiv7.appendChild(vDiv);
		vDiv.className = "col-sm-10";

		this.verInput = document.createElement("INPUT");
		vDiv.appendChild(this.verInput);
		this.verInput.type = "text";
		this.verInput.className = "form-control";
		this.verInput.id = "v" + options.id;
		this.verInput.addEventListener("change", this, false);
		// realm
		var groupDiv8 = document.createElement("DIV");
		modalframe.appendChild(groupDiv8);
		groupDiv8.className = "form-group";
		groupDiv8.style.display = "none";

		var realmLabel = document.createElement("LABEL");
		groupDiv8.appendChild(realmLabel);
		realmLabel.setAttribute("for", "realm" + options.id);
		realmLabel.className = "col-sm-2 control-label";
		realmLabel.innerHTML = "Realm";

		var rDiv = document.createElement("DIV");
		groupDiv8.appendChild(rDiv);
		rDiv.className = "col-sm-10";

		this.realmInput = document.createElement("INPUT");
		rDiv.appendChild(this.realmInput);
		this.realmInput.type = "text";
		this.realmInput.className = "form-control";
		this.realmInput.id = "realm" + options.id;
		this.realmInput.addEventListener("change", this, false);
	};

	EditPanel.prototype.loadEntity = function(entity) {
		this.entity = entity;
		if (this.authorization.length == 8) {
			this.ckInput.value = this.entity.authorization[0].value;
			this.csInput.value = this.entity.authorization[1].value;
			this.tokenInput.value = this.entity.authorization[2].value;
			this.tsInput.value = this.entity.authorization[3].value;
			this.smSelect.value = this.entity.authorization[4].value;
			this.nonceInput.value = this.entity.authorization[5].value;
			this.verInput.value = this.entity.authorization[6].value;
			this.realmInput.value = this.entity.authorization[7].value;
		}
	};

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	EditPanel.prototype.doChange = function(evt) {
		if (evt.target == this.ckInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Consumer Key", this.ckInput));
		} else if (evt.target == this.csInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Consumer Secret", this.csInput));
		} else if (evt.target == this.tokenInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Token", this.tokenInput));
		} else if (evt.target == this.tsInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Token Secret", this.tsInput));
		} else if (evt.target == this.smSelect) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Signature Method", this.smSelect));
		} else if (evt.target == this.nonceInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Nonce", this.nonceInput));
		} else if (evt.target == this.verInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Version", this.verInput));
		} else if (evt.target == this.realmInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Realm", this.realmInput));
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