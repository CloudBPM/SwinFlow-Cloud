/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "blmMainMenuBar";
	var defaults = {
		title : "",
		greeting : "",
		user : "",
	};

	var BDMMainMenuBar = function(element, options) {
		this.element = element;
		this.options = $.extend({
			title : "",
			greeting : "",
			user : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent;
		this.title = options.title;
		this.init(options);
		this.manager = null;
	};

	BDMMainMenuBar.prototype.init = function(options) {
		var menuNav = document.createElement("NAV");
		menuNav.className = "navbar navbar-default navbar-static-top";
		this.element.appendChild(menuNav);

		var mainbar = document.createElement("DIV");
		mainbar.className = "container-fluid";
		menuNav.appendChild(mainbar);

		var barheader = document.createElement("DIV");
		barheader.className = "navbar-header";
		mainbar.appendChild(barheader);

		var headerButton = document.createElement("button");
		headerButton.className = "navbar-toggle collapsed";
		headerButton.type = "button";
		headerButton.className = "navbar-toggle collapsed";
		headerButton.setAttribute("data-toggle", "collapse");
		headerButton.setAttribute("data-target", "#navbar");
		headerButton.setAttribute("aria-expanded", "false");
		headerButton.setAttribute("aria-controls", "navbar");

		barheader.appendChild(headerButton);

		var headerSpan = document.createElement("span");
		headerSpan.className = "sr-only";
		headerButton.appendChild(headerSpan);
		headerSpan = document.createElement("span");
		headerSpan.className = "icon-bar";
		headerButton.appendChild(headerSpan);
		headerSpan = document.createElement("span");
		headerSpan.className = "icon-bar";
		headerButton.appendChild(headerSpan);
		headerSpan = document.createElement("span");
		headerSpan.className = "icon-bar";
		headerButton.appendChild(headerSpan);

		var titleA = document.createElement("a");
		titleA.className = "navbar-brand";
		titleA.setAttribute("href", "http://www.cloudbpm.cn");
		titleA.setAttribute("target", "_blank");
		titleA.innerHTML = "<strong>" + this.title + "</strong>";
		barheader.appendChild(titleA);

		var titleB = document.createElement("a");
		titleB.className = "navbar-brand";
		// titleB.setAttribute("href", "#");
		titleB.innerHTML = "<font style='font-size:16px'>" + options.greeting
				+ "</font>";
		barheader.appendChild(titleB);

		var navbar = document.createElement("DIV");
		navbar.id = "navbar";
		navbar.className = "navbar-collapse collapse";
		mainbar.appendChild(navbar);

		var barUL = document.createElement("ul");
		barUL.className = "nav navbar-nav";
		navbar.appendChild(barUL);

		var barLiItem = document.createElement("li");
		barLiItem.className = "active";
		barUL.appendChild(barLiItem);
		var liA = document.createElement("a");
		liA.setAttribute("href", "#");
		liA.innerHTML = "账房";
		barLiItem.appendChild(liA);

		this.newItem = this.createMenuabarItem("newmodel", barUL,
				"glyphicon glyphicon-plus", "新建", 1, "#");
		this.newItem.className = "disabled";

		this.saveItem = this.createMenuabarItem("saveG", barUL,
				"glyphicon glyphicon-floppy-disk", "保存", 1, "#");
		this.saveItem.className = "disabled";
		
		this.optionsItem = this.createMenuabarItem("optionsG", barUL,
				"glyphicon glyphicon-cog", "选项", 1, "#");
		
		this.customerItem = this.createMenuabarItem("customerG", barUL,
				"glyphicon glyphicon-headphones", "客服", 1, "#");
		
		this.helpItem = this.createMenuabarItem("helpG", barUL,
				"glyphicon glyphicon-question-sign", "帮助", 1, "#");

		var barRightUL = document.createElement("ul");
		barRightUL.className = "nav navbar-nav navbar-right";
		navbar.appendChild(barRightUL);

		var barLiItem = document.createElement("li");
		barRightUL.appendChild(barLiItem);
		barLiItem.className = "dropdown";

		var barLiItemA = document.createElement("A");
		barLiItem.appendChild(barLiItemA);
		barLiItemA.setAttribute("href", "#");
		barLiItemA.className = "dropdown-toggle";
		barLiItemA.setAttribute("data-toggle", "dropdown");
		barLiItemA.setAttribute("role", "button");
		barLiItemA.setAttribute("aria-haspopup", "true");
		barLiItemA.setAttribute("aria-expanded", "false");
		barLiItemA.innerHTML = "其他<span class='caret'></span>";

		var barLiItemUl = document.createElement("UL");
		barLiItem.appendChild(barLiItemUl);
		barLiItemUl.className = "dropdown-menu";

		for (var i = 0; i < otherComponents.length; i++) {
			this.createDropdownItem(otherComponents[i].name, barLiItemUl,
					otherComponents[i].url);
		}

		this.createMenuabarItem("logout", barRightUL,
				"glyphicon glyphicon-log-out", "退出", 1,
				"/login/logout.jsp?usr=" + options.user);

	};

	BDMMainMenuBar.prototype.createDropdownItem = function(name, parent, url) {
		var barLiItemLi = document.createElement("li");
		parent.appendChild(barLiItemLi);
		var barLiItemLiA = document.createElement("A");
		barLiItemLi.appendChild(barLiItemLiA);
		barLiItemLiA.setAttribute("href", url);
		barLiItemLiA.setAttribute("target", "_blank");
		barLiItemLiA.innerHTML = name;
	};

	BDMMainMenuBar.prototype.createMenuabarItem = function(id, parent, icon,
			title, type, url) {
		var barLiItem = document.createElement("li");
		barLiItem.id = id;
		parent.appendChild(barLiItem);
		var liA = document.createElement("a");
		liA.setAttribute("href", url);
		barLiItem.appendChild(liA);

		if (type == 1) { // glyphicon
			var iconSpan = document.createElement("span");
			iconSpan.className = icon;
			iconSpan.addEventListener("click", this, false);
			liA.appendChild(iconSpan);
			var itemTitle = document.createElement("span");
			itemTitle.style.fontSize = "16px";
			itemTitle.addEventListener("click", this, false);
			itemTitle.innerHTML = " " + title;
			liA.appendChild(itemTitle);
		} else if (type == 2) { // font-awesome icon
			var iconI = document.createElement("i");
			iconI.addEventListener("click", this, false);
			iconI.className = icon;
			liA.appendChild(iconI);
			var itemTitle = document.createElement("span");
			itemTitle.addEventListener("click", this, false);
			itemTitle.style.fontSize = "16px";
			itemTitle.innerHTML = " " + title;
			liA.appendChild(itemTitle);
		}
		return barLiItem;
	}

	BDMMainMenuBar.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	BDMMainMenuBar.prototype.setManager = function(manager) {
		this.manager = manager;
	};

	BDMMainMenuBar.prototype.doClick = function(evt) {
		var t = evt.target;
		if ((t.tagName == "LI" && t.id == "newmodel" && t.className == "")
				|| (t.tagName == "A" && t.parentElement.id == "newmodel" && t.parentElement.className == "")
				|| (t.tagName == "SPAN"
						&& t.parentElement.parentElement.id == "newmodel" && t.parentElement.parentElement.className == "")
				|| (t.tagName == "SPAN"
						&& t.parentElement.parentElement.id == "newmodel" && t.parentElement.parentElement.className == "")) {

			if (this.manager != null) {
				this.manager.doCreateNewAction();
			}
		} else if ((t.tagName == "LI" && t.id == "saveG" && t.className == "")
				|| (t.tagName == "A" && t.parentElement.id == "saveG" && t.parentElement.className == "")
				|| (t.tagName == "SPAN"
						&& t.parentElement.parentElement.id == "saveG" && t.parentElement.parentElement.className == "")
				|| (t.tagName == "SPAN"
						&& t.parentElement.parentElement.id == "saveG" && t.parentElement.parentElement.className == "")) {
			if (this.manager != null) {
				this.manager.doSaveAction();
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new BDMMainMenuBar(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);