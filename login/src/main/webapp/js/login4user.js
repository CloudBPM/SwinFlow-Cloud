;
(function($, window, document, undefined) {
	var pluginName = "login";
	var defaults = {
		title : "",
		url : "",
	};

	var Login = function(element, options) {
		this.element = element;
		this.options = $.extend({
			title : "",
			url : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options, 0);
	};

	Login.prototype.init = function(options, tabindex) {
		this.currtabindex = tabindex;

		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);
		modalframe.className = "container-fluid";

		var rowDIV = document.createElement("DIV");
		modalframe.appendChild(rowDIV);
		rowDIV.className = "row";

		var colDIV1 = document.createElement("DIV");
		rowDIV.appendChild(colDIV1);
		colDIV1.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";

		var colDIV2 = document.createElement("DIV");
		rowDIV.appendChild(colDIV2);
		colDIV2.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs login-nav-tabs";
		tabUL.id = "login-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		colDIV2.appendChild(tabUL);
		this.newTabHead(tabUL, 0, "一般登录", true);
		this.newTabHead(tabUL, 1, "短信登录", false);
		this.newTabHead(tabUL, 2, "扫码登录", false);
		var that = this;
		$("#login-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
		});

		var tabContents = document.createElement("DIV");
		colDIV2.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "logintabs";

		this.tabContent0 = this.newTabContent(tabContents, 0, true);
		if ($(this.tabContent0).traditionalLogin != undefined) {
			var plugin0 = $(this.tabContent0).traditionalLogin({
				id : "logintab0",
				url : options.url[0],
			});
			this.traditionalLogin = plugin0.data("traditionalLogin");
		}

		this.tabContent1 = this.newTabContent(tabContents, 1, false);
		if ($(this.tabContent1).verificationCodeLogin != undefined) {
			var plugin1 = $(this.tabContent1).verificationCodeLogin({
				id : "logintab1",
				parent : this,
				topparent : this.element,
				url:options.url[1]
			});
			this.verificationCodeLogin = plugin1.data("verificationCodeLogin");
		}

		this.tabContent2 = this.newTabContent(tabContents, 2, false);
		if ($(this.tabContent2).scanCodeLogin != undefined) {
			var plugin2 = $(this.tabContent2).scanCodeLogin({
				id : "logintab2",
				parent : this,
				topparent : this.element,
				currowner : options.currowner,
				url : options.url[1],
			});
			this.scanCodeLogin = plugin2.data("scanCodeLogin");
		}

		var colDIV3 = document.createElement("DIV");
		rowDIV.appendChild(colDIV3);
		colDIV3.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
	};

	Login.prototype.setDisabled = function(active) {
		this.traditionalLogin.setStatus(active);
		this.verificationCodeLogin.setStatus(active);
		this.scanCodeLogin.setStatus(active);
	};

	Login.prototype.newTabHead = function(parent, index, caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#logintab" + index);
		tabLink.setAttribute("aria-controls", "adptab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "logintab");
		tabLink.innerHTML = caption;
	};

	Login.prototype.newTabContent = function(parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "logintab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "logintab" + index;
		return tabContent;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Login(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);