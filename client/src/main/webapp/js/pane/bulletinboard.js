/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "newsBoard";
	var defaults = {
		id : "",
		parent : "",
		userId : "",
	};

	var Board = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			userId : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	Board.prototype.init = function(options) {
		this.board = document.createElement("DIV");
		this.element.appendChild(this.board);
		this.show(false);

		var panel = document.createElement("DIV");
		this.board.appendChild(panel);
		panel.className = "container-fluid";

		// row0
		var panelRow0 = document.createElement("DIV");
		panel.appendChild(panelRow0);
		panelRow0.className = "row";

		var panelCol0 = document.createElement("DIV");
		panelRow0.appendChild(panelCol0);
		panelCol0.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		this.createTitle(panelCol0, "fa fa-newspaper-o", "新闻动态", "#f3331e");

		// row1
		var panelRow1 = document.createElement("DIV");
		panel.appendChild(panelRow1);
		panelRow1.className = "row";

		var panelCol1 = document.createElement("DIV");
		panelRow1.appendChild(panelCol1);
		panelCol1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		var tabDIV = document.createElement("DIV");
		panelCol1.appendChild(tabDIV);
		tabDIV.style.marginTop = "4px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs nav-justified news-nav-tabs";
		tabUL.id = "news-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);
        // 0: 公开新闻；1：内部新闻；2：通知公告；3：文献资料；
		this.newTabHead(tabUL, 0, "公开新闻", true);
		this.newTabHead(tabUL, 1, "内部新闻", false);
		this.newTabHead(tabUL, 2, "通知公告", false);
		this.newTabHead(tabUL, 3, "文献资料", false);

		var that = this;
		$("#news-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			that.currtabindex = parseInt($(this).attr('href').substring(8));
			if (that.currtabindex == 0) {
				that.newsListPane1.loading("", "0", options.userId, 0, 6);
                that.newsListPane1.getMoreNews("","0",options.userId,6);
			} else if (that.currtabindex == 1) {
				that.newsListPane2.loading("", "1", options.userId, 0, 6);
                that.newsListPane2.getMoreNews("","1",options.userId,6);
			} else if (that.currtabindex == 2) {
				that.newsListPane3.loading("", "2", options.userId, 0, 6);
                that.newsListPane3.getMoreNews("","2",options.userId,6);
			} else if (that.currtabindex == 3) {
				that.newsListPane4.loading("", "3", options.userId, 0, 6);
                that.newsListPane4.getMoreNews("","3",options.userId,6);
			}
		});

		var tabContents = document.createElement("DIV");
		tabDIV.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "newstabs";

		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		if ($(this.tabContent1).newsListPane != undefined) {
			var plugin1 = $(this.tabContent1).newsListPane({
				id : "newstab0",
				parent : options.parent,
				owner : options.owner,
			});
			this.newsListPane1 = plugin1.data("newsListPane");
			this.newsListPane1.loading("", "0", options.userId, 0, 6);
			this.newsListPane1.getMoreNews("","0",options.userId,6)
		}

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		if ($(this.tabContent2).newsListPane != undefined) {
			var plugin2 = $(this.tabContent2).newsListPane({
				id: "newstab1",
				parent : options.parent,
				owner : options.owner,
			});
			this.newsListPane2 = plugin2.data("newsListPane");
			this.newsListPane2.loading("", "1", options.userId, 0, 6);
		}

		this.tabContent3 = this.newTabContent(tabContents, 2, false);
		if ($(this.tabContent3).newsListPane != undefined) {
			var plugin3 = $(this.tabContent3).newsListPane({
				id: "newstab2",
				parent : options.parent,
				owner : options.owner,
			});
			this.newsListPane3 = plugin3.data("newsListPane");
			this.newsListPane3.loading("", "2", options.userId, 0, 6);

		}

		this.tabContent4 = this.newTabContent(tabContents, 3, false);
		if ($(this.tabContent4).newsListPane != undefined) {
			var plugin4 = $(this.tabContent4).newsListPane({
				id: "newstab3",
				parent : options.parent,
				owner : options.owner,
			});
			this.newsListPane4 = plugin4.data("newsListPane");
			this.newsListPane4.loading("", "3", options.userId, 0, 6);
			// this.getMoreNews("","3",options.userId,6)
		}
	};


	Board.prototype.createTitle = function(parent, icon, title, color) {
		var titleSpan = document.createElement("SPAN");
		parent.appendChild(titleSpan);

		var h3 = document.createElement("H3");
		titleSpan.appendChild(h3);
		h3.className = "page-header";
		h3.style.margin = "0";

		var span = document.createElement("SPAN");
		h3.appendChild(span);
		span.className = icon;
		span.setAttribute("aria-hidden","true");
		span.style.color = color;

		var text = document.createTextNode(" " + title);
		h3.appendChild(text);

		return titleSpan;
	};

	Board.prototype.newTabHead = function(parent, index, caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#newstab" + index);
		tabLink.setAttribute("aria-controls", "newstab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	Board.prototype.newTabContent = function(parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "newstab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "newstab" + index;
		return tabContent;
	};

	Board.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	Board.prototype.show = function(show) {
		if (show) {
			this.board.style.display = "";
		} else {
			this.board.style.display = "none";
		}
	};

	Board.prototype.doClick = function(evt) {

	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Board(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);