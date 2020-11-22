/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "loginMenuBar";
	var defaults = {
		title : "",
		greeting : "",
		user : "",
	};

	var MainMenuBar = function(element, options) {
		this.element = element;
		this.options = $.extend({
			title : "",
			greeting : "",
			user : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.title = options.title;
		this.init(options);
	};

	MainMenuBar.prototype.init = function(options) {
		var menuNav = document.createElement("NAV");
		this.element.appendChild(menuNav);
		menuNav.className = "navbar navbar-default navbar-static-top";

		var mainbar = document.createElement("DIV");
		menuNav.appendChild(mainbar);
		mainbar.className = "container";

		var barhead = document.createElement("DIV");
		mainbar.appendChild(barhead);
		barhead.className = "navbar-header";

		var headbutton = document.createElement("button");
		barhead.appendChild(headbutton);
		headbutton.className = "navbar-toggle collapsed";
		headbutton.type = "button";
		headbutton.setAttribute("data-toggle", "collapse");
		headbutton.setAttribute("data-target", "#navbar");
		headbutton.setAttribute("aria-expanded", "false");
		headbutton.setAttribute("aria-controls", "navbar");

		var headSpan = document.createElement("span");
		headbutton.appendChild(headSpan);
		headSpan.className = "sr-only";
		headSpan = document.createElement("span");
		headbutton.appendChild(headSpan);
		headSpan.className = "icon-bar";
		headSpan = document.createElement("span");
		headbutton.appendChild(headSpan);
		headSpan.className = "icon-bar";
		headSpan = document.createElement("span");
		headbutton.appendChild(headSpan);
		headSpan.className = "icon-bar";

		var titleA = document.createElement("a");
		barhead.appendChild(titleA);
		titleA.className = "navbar-brand";
		titleA.setAttribute("href", "http://www.xuanqiyun.com");
		titleA.setAttribute("target", "_blank");
		titleA.innerHTML = options.title;

		var navbar = document.createElement("DIV");
		mainbar.appendChild(navbar);
		navbar.className = "navbar-collapse collapse";

		var barul = document.createElement("ul");
		navbar.appendChild(barul);
		barul.className = "nav navbar-nav";

		var barul2 = document.createElement("ul");
		navbar.appendChild(barul2);
		barul2.className = "nav navbar-nav navbar-right";

		var bbs = document.createElement("li");
		barul2.appendChild(bbs);
		bbs.className = "nav navbar-nav navbar-right";

		var bbsA = document.createElement("a");
		bbs.appendChild(bbsA);
		bbsA.href = "#";
		bbsA.innerHTML = "论坛";

		var readme = document.createElement("li");
		barul2.appendChild(readme);
		readme.className = "nav navbar-nav navbar-right";

		var readmeA = document.createElement("a");
		readme.appendChild(readmeA);
		readmeA.href = "http://www.xuanqiyun.com";
		readmeA.innerHTML = "帮助与文档";

		var homepage = document.createElement("li");
		barul2.appendChild(homepage);
		homepage.className = "nav navbar-nav navbar-right";

		var homepageA = document.createElement("a");
		homepage.appendChild(homepageA);
		homepageA.href = "http://www.xuanqiyun.com";
		homepageA.innerHTML = "首页";
	}

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new MainMenuBar(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);