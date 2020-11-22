/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "httpAuthEditPane";
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
		authlabel.className = "col-sm-2 control-label";
		authlabel.innerHTML = "认证类型";

		var authTyepDIV = document.createElement("DIV");
		authTypeGroupDiv.appendChild(authTyepDIV);
		authTyepDIV.className = "col-sm-10";

		this.authSelect = document.createElement("select");
		authTyepDIV.appendChild(this.authSelect);
		this.authSelect.className = "form-control";
		this.authSelect.id = "authtype" + options.id;
		this.authSelect.addEventListener("change", this, false);

		this.addOptions(this.authSelect, AuthenticationType[0], "0", 0);
		this.addOptions(this.authSelect, AuthenticationType[1], "1", 1);
		this.addOptions(this.authSelect, AuthenticationType[2], "2", 2);
		//this.addOptions(this.authSelect, AuthenticationType[3], "3", 3);

		this.authTypePane = document.createElement("DIV");
		authTabBody.appendChild(this.authTypePane);
		this.authTypePane.style.margin = "0px";
		this.authTypePane.style.padding = "0px";
	};

	EditPanel.prototype.setEntity = function(entity) {
		this.entity = entity;
		this.authSelect.value = entity.authenticationType;
		this.showAuthorizationPane(entity.authenticationType);
	};

	EditPanel.prototype.authHeaders = function(newvalue) {
		var newAuths = [];
		// https://tools.ietf.org/html/rfc2617 for details
		if (newvalue == 1) {// basic auth
			newAuths.push(this.createHeader("Username", ""));
			newAuths.push(this.createHeader("Password", ""));
		} else if (newvalue == 2) {// digest auth
			// challenge = "Digest" digest-challenge
			// digest-challenge = 1#( realm | [ domain ] | nonce |
			// [ opaque ] |[ stale ] | [ algorithm ] |
			// [ qop-options ] | [auth-param] )
			// domain = "domain" "=" <"> URI ( 1*SP URI ) <">
			// URI = absoluteURI | abs_path
			// nonce = "nonce" "=" nonce-value
			// nonce-value = quoted-string
			// opaque = "opaque" "=" quoted-string
			// stale = "stale" "=" ( "true" | "false" )
			// algorithm = "algorithm" "=" ( "MD5" | "MD5-sess" |
			// token )
			// qop-options = "qop" "=" <"> 1#qop-value <">
			// qop-value = "auth" | "auth-int" | token
			newAuths.push(this.createHeader("Username", ""));
			newAuths.push(this.createHeader("Realm", ""));
			newAuths.push(this.createHeader("Password", ""));
			// newAuths.push(this.createHeader("Nonce", ""));
			// newAuths.push(this.createHeader("Algorithm", ""));
			// newAuths.push(this.createHeader("qop", ""));
			// newAuths.push(this.createHeader("Nonce Count", ""));
			// newAuths.push(this.createHeader("Client Nonce", ""));
			// newAuths.push(this.createHeader("Opaque", ""));
		} else if (newvalue == 3) {// open auth
		// newAuths.push(this.createHeader("Consumer Key", ""));
		// newAuths.push(this.createHeader("Consumer Secret", ""));
		// newAuths.push(this.createHeader("Token", ""));
		// newAuths.push(this.createHeader("Token Secret", ""));
		// newAuths.push(this.createHeader("Signature Method", ""));
		// newAuths.push(this.createHeader("Nonce", ""));
		// newAuths.push(this.createHeader("Version", ""));
		// newAuths.push(this.createHeader("Realm", ""));
		}
		return newAuths;
	}

	EditPanel.prototype.createHeader = function(key, value) {
		var header = new HTTPHeader();
		header.key = key;
		header.value = value;
		return header;
	}

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	EditPanel.prototype.doChange = function(evt) {
		if (evt.target == this.authSelect) {
			map[this.entity.id].stack
					.execute(new AMWebAppAuthorizationChangedCmd(this.entity,
							this.authSelect.selectedIndex, this
									.authHeaders(this.authSelect.selectedIndex)));
		}
	};

	EditPanel.prototype.showAuthorizationPane = function(selectedIndex) {
		$(this.authTypePane).empty();
		if (selectedIndex == 0) {
			// no pane
		} else if (selectedIndex == 1) {
			this.addBasicAuth(this.authTypePane, this.options);
			this.bauthpane.loadEntity(this.entity);
		} else if (selectedIndex == 2) {
			this.addDigestAuth(this.authTypePane, this.options);
		} else if (selectedIndex == 3) {
			this.addOAuth1(this.authTypePane, this.options);
		}
	}

	EditPanel.prototype.addBasicAuth = function(parent, options) {
		if (this.bauthpane == undefined || this.bauthpane == null) {
			var cellx = $(parent).basicAuthEditPane({
				id : "BAUTH" + options.id,
				parent : this,
				width : options.width,
				height : options.height,
			});
			this.bauthpane = cellx.data("basicAuthEditPane");
		} else {
			this.bauthpane.loadPane();
		}

	};

	EditPanel.prototype.addDigestAuth = function(parent, options) {
		if (this.dauthpane == undefined || this.dauthpane == null) {
			var cellx = $(parent).digestAuthEditPane({
				id : "DAUTH" + options.id,
				parent : this,
			});
			this.dauthpane = cellx.data("digestAuthEditPane");
		} else {
			this.dauthpane.loadPane();
		}
	};

	EditPanel.prototype.addOAuth1 = function(parent, options) {
		if (this.oauthpane == undefined || this.oauthpane == null) {
			var cellx = $(parent).openAuthEditPane({
				id : "OAUTH" + options.id,
				parent : this,
			});
			this.oauthpane = cellx.data("openAuthEditPane");
		} else {
			this.oauthpane.loadPane();
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