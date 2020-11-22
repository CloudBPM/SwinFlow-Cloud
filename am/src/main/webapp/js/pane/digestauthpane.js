/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "digestAuthEditPane";
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
		this._name = pluginName;
		this.init(options);
	};

	EditPanel.prototype.loadPane = function() {
		this.init(this.options);
	};

	EditPanel.prototype.init = function(options) {
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);
		// user name
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
		// password
		var groupDiv2 = document.createElement("DIV");
		modalframe.appendChild(groupDiv2);
		groupDiv2.className = "form-group";

		var passLabel = document.createElement("LABEL");
		groupDiv2.appendChild(passLabel);
		passLabel.setAttribute("for", "password" + options.id);
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
		// realm
		var groupDiv3 = document.createElement("DIV");
		modalframe.appendChild(groupDiv3);
		groupDiv3.className = "form-group";

		var realmLabel = document.createElement("LABEL");
		groupDiv3.appendChild(realmLabel);
		realmLabel.setAttribute("for", "realm" + options.id);
		realmLabel.className = "col-sm-2 control-label";
		realmLabel.innerHTML = "作用域(Realm)";

		var realmDiv = document.createElement("DIV");
		groupDiv3.appendChild(realmDiv);
		realmDiv.className = "col-sm-10";

		this.realmInput = document.createElement("INPUT");
		realmDiv.appendChild(this.realmInput);
		this.realmInput.type = "text";
		this.realmInput.className = "form-control";
		this.realmInput.id = "realm" + options.id;
		this.realmInput.addEventListener("change", this, false);
		// nonce
		var groupDiv4 = document.createElement("DIV");
		modalframe.appendChild(groupDiv4);
		groupDiv4.className = "form-group";
		groupDiv4.style.display = "none";

		var nonceLabel = document.createElement("LABEL");
		groupDiv4.appendChild(nonceLabel);
		nonceLabel.setAttribute("for", "nonce" + options.id);
		nonceLabel.className = "col-sm-2 control-label";
		nonceLabel.innerHTML = "Nonce";

		var nonceDiv = document.createElement("DIV");
		groupDiv4.appendChild(nonceDiv);
		nonceDiv.className = "col-sm-10";

		this.nonceInput = document.createElement("INPUT");
		nonceDiv.appendChild(this.nonceInput);
		this.nonceInput.type = "text";
		this.nonceInput.className = "form-control";
		this.nonceInput.id = "nonce" + options.id;
		this.nonceInput.addEventListener("change", this, false);
		// algorithm
		var groupDiv5 = document.createElement("DIV");
		modalframe.appendChild(groupDiv5);
		groupDiv5.className = "form-group";
		groupDiv5.style.display = "none";

		var algorithmLabel = document.createElement("LABEL");
		groupDiv5.appendChild(algorithmLabel);
		algorithmLabel.setAttribute("for", "algorithm" + options.id);
		algorithmLabel.className = "col-sm-2 control-label";
		algorithmLabel.innerHTML = "Algorithm";

		var algDiv = document.createElement("DIV");
		groupDiv5.appendChild(algDiv);
		algDiv.className = "col-sm-10";

		this.algorithmInput = document.createElement("INPUT");
		algDiv.appendChild(this.algorithmInput);
		this.algorithmInput.type = "text";
		this.algorithmInput.className = "form-control";
		this.algorithmInput.id = "algorithm" + options.id;
		this.algorithmInput.addEventListener("change", this, false);
		// qop
		var groupDiv6 = document.createElement("DIV");
		modalframe.appendChild(groupDiv6);
		groupDiv6.className = "form-group";
		groupDiv6.style.display = "none";

		var qopLabel = document.createElement("LABEL");
		groupDiv6.appendChild(qopLabel);
		qopLabel.setAttribute("for", "qop" + options.id);
		qopLabel.className = "col-sm-2 control-label";
		qopLabel.innerHTML = "qop";

		var qopDiv = document.createElement("DIV");
		groupDiv6.appendChild(qopDiv);
		qopDiv.className = "col-sm-10";

		this.qopInput = document.createElement("INPUT");
		qopDiv.appendChild(this.qopInput);
		this.qopInput.type = "text";
		this.qopInput.className = "form-control";
		this.qopInput.id = "qop" + options.id;
		this.qopInput.addEventListener("change", this, false);
		// nonce count
		var groupDiv7 = document.createElement("DIV");
		modalframe.appendChild(groupDiv7);
		groupDiv7.className = "form-group";
		groupDiv7.style.display = "none";

		var ncLabel = document.createElement("LABEL");
		groupDiv7.appendChild(ncLabel);
		ncLabel.setAttribute("for", "nc" + options.id);
		ncLabel.className = "col-sm-2 control-label";
		ncLabel.innerHTML = "Nonce count";

		var ncDiv = document.createElement("DIV");
		groupDiv7.appendChild(ncDiv);
		ncDiv.className = "col-sm-10";

		this.ncInput = document.createElement("INPUT");
		ncDiv.appendChild(this.ncInput);
		this.ncInput.type = "text";
		this.ncInput.className = "form-control";
		this.ncInput.id = "nc" + options.id;
		this.ncInput.addEventListener("change", this, false);
		// client nonce
		var groupDiv8 = document.createElement("DIV");
		modalframe.appendChild(groupDiv8);
		groupDiv8.className = "form-group";
		groupDiv8.style.display = "none";

		var cnLabel = document.createElement("LABEL");
		groupDiv8.appendChild(cnLabel);
		cnLabel.setAttribute("for", "cn" + options.id);
		cnLabel.className = "col-sm-2 control-label";
		cnLabel.innerHTML = "Client nonce";

		var cnDiv = document.createElement("DIV");
		groupDiv8.appendChild(cnDiv);
		cnDiv.className = "col-sm-10";

		this.cnInput = document.createElement("INPUT");
		cnDiv.appendChild(this.cnInput);
		this.cnInput.type = "text";
		this.cnInput.className = "form-control";
		this.cnInput.id = "cn" + options.id;
		this.cnInput.addEventListener("change", this, false);
		// opaque
		var groupDiv9 = document.createElement("DIV");
		modalframe.appendChild(groupDiv9);
		groupDiv9.className = "form-group";
		groupDiv9.style.display = "none";

		var opaqueLabel = document.createElement("LABEL");
		groupDiv9.appendChild(opaqueLabel);
		opaqueLabel.setAttribute("for", "opaque" + options.id);
		opaqueLabel.className = "col-sm-2 control-label";
		opaqueLabel.innerHTML = "Opaque";

		var opaqueDiv = document.createElement("DIV");
		groupDiv9.appendChild(opaqueDiv);
		opaqueDiv.className = "col-sm-10";

		this.opaqueInput = document.createElement("INPUT");
		opaqueDiv.appendChild(this.opaqueInput);
		this.opaqueInput.type = "text";
		this.opaqueInput.className = "form-control";
		this.opaqueInput.id = "opaque" + options.id;
		this.opaqueInput.addEventListener("change", this, false);
	};

	EditPanel.prototype.loadEntity = function(entity) {
		this.entity = entity;
		if (this.authorization.length == 9) {
			this.usrInput.value = this.entity.authorization[0].value;
			this.realmInput.value = this.entity.authorization[1].value;
			this.passInput.value = this.entity.authorization[2].value;
			this.nonceInput.value = this.entity.authorization[3].value;
			this.algorithmInput.value = this.entity.authorization[4].value;
			this.qopInput.value = this.entity.authorization[5].value;
			this.ncInput.value = this.entity.authorization[6].value;
			this.cnInput.value = this.entity.authorization[7].value;
			this.opaqueInput.value = this.entity.authorization[8].value;
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
		if (evt.target == this.usrInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Username", this.usrInput));
		} else if (evt.target == this.passInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Password", this.passInput));
		} else if (evt.target == this.realmInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Realm", this.realmInput));
		} else if (evt.target == this.nonceInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Nonce", this.nonceInput));
		} else if (evt.target == this.algorithmInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Algorithm", this.algorithmInput));
		} else if (evt.target == this.qopInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "qop", this.qopInput));
		} else if (evt.target == this.ncInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Nonce count", this.ncInput));
		} else if (evt.target == this.cnInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Client nonce", this.cnInput));
		} else if (evt.target == this.opaqueInput) {
			map[this.entity.id].stack.execute(new AMWebAuthHeaderChangedCmd(
					this.entity, "Opaque", this.opaqueInput));

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