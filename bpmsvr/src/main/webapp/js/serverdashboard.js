/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "serverDashboard";
	var defaults = {
		id : "",
	};

	var Dashboard = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.init(options);

	};

	Dashboard.prototype.init = function(options) {
		var mainframe = document.createElement("DIV");
		this.element.appendChild(mainframe);
		mainframe.className = "container";
		mainframe.id = "maincontent"

		// tool bar row
		var toolbarRow = document.createElement("DIV");
		mainframe.appendChild(toolbarRow);
		toolbarRow.className = "row";
		toolbarRow.style.margin = "0px";
		toolbarRow.style.padding = "0px";

		this.createToolbar(toolbarRow, options);

		// dash board row
		var dashboardRow = document.createElement("DIV");
		mainframe.appendChild(dashboardRow);
		dashboardRow.className = "row";
		dashboardRow.style.margin = "0px";
		dashboardRow.style.padding = "0px";

		var tabDIV = document.createElement("DIV");
		dashboardRow.appendChild(tabDIV);
		tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabDIV.appendChild(tabUL);
		tabUL.className = "nav nav-tabs serverdb-nav-tabs";
		tabUL.id = "serverdb-input-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		this.newTabHead(tabUL, 0, "系统信息", true);
		this.newTabHead(tabUL, 1, "综合性能", false);
		var that = this;
		$("#serverdb-input-props-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
		});

		var tabContents = document.createElement("DIV");
		tabDIV.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "serverdb" + options.id;

		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		var plugin1 = $(this.tabContent1).overviewPane({
			id : "tab0",
		});
		this.overviewPane = plugin1.data("overviewPane");

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		// var plugin2 = $(this.tabContent2).pointUIEditPane({
		// id : "tab1",
		// parent : this.options.parent,
		// entity : entity,
		// topparent : this.element,
		// currowner : owner,
		// });
		// this.pintUIEditPane = plugin2.data("pointUIEditPane");

		$('#serverdb-input-props-nav-tabs a[href="#tab0"]').tab('show');

		// status bar row
		var statusbarRow = document.createElement("DIV");
		mainframe.appendChild(statusbarRow);
		statusbarRow.className = "row";
		statusbarRow.style.margin = "0px";
		statusbarRow.style.padding = "0px";

		$(statusbarRow).svrStatusBar({
			title : "状态条",
		});
		
		setInterval(this.loadData, 1000, this.overviewPane);
	};
		
	Dashboard.prototype.loadData = function(pane) {
		$("#progressbar").show();
		$.get(service.api(4), {}, function(data) {
			pane.loadData(data);
			$("#progressbar").hide();
		});
	};

	Dashboard.prototype.createToolbar = function(tbrow, options) {
		var parent = document.createElement("DIV");
		tbrow.appendChild(parent);
		parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		parent.style.margin = "0px";
		parent.style.padding = "2px";

		var c = "btn btn-default";
		var g1 = this.createGroup(parent);
		// fa-lg: 24px; fa-2x ：32px
		this.btnStartup = this.createToolItem(g1, "startup" + options.id, "启动",
				c, "i", "fa fa-play fa-lg");
		this.btnPause = this.createToolItem(g1, "pause" + options.id, "暂停", c,
				"i", "fa fa-pause fa-lg");
		this.btnStop = this.createToolItem(g1, "stop" + options.id, "关闭", c,
				"i", "fa fa-stop fa-lg");
		this.btnRestart = this.createToolItem(g1, "restart" + options.id, "重启",
				c, "i", "fa fa-repeat fa-lg");
	};

	Dashboard.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		parent.appendChild(group);
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		return group;
	};

	Dashboard.prototype.createToolItem = function(group, id, title, style,
			fonttag, fontclass) {
		var button = document.createElement("button");
		group.appendChild(button);
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		var icon = document.createElement(fonttag);
		button.appendChild(icon);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.setAttribute("aria-hidden", "true");
		icon.id = id;
		return button;
	};

	Dashboard.prototype.newTabHead = function(parent, index, caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#tab" + index);
		tabLink.setAttribute("aria-controls", "tab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	Dashboard.prototype.newTabContent = function(parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "tab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "tab" + index;
		return tabContent;
	};

	Dashboard.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	Dashboard.prototype.doClick = function(evt) {
		var that = this;
		if (evt.target == this.btnStartup
				|| evt.target.id == ("startup" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.add("active");
			this.btnPause.classList.remove("active");
			this.btnStop.classList.remove("active");
			this.btnRestart.classList.remove("active");
			$.post(service.api(0), {}, function(data) {
				$("#progressbar").hide();
			});
		} else if (evt.target == this.btnPause
				|| evt.target.id == ("pause" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.remove("active");
			this.btnPause.classList.add("active");
			this.btnStop.classList.remove("active");
			that.btnRestart.classList.remove("active");
			$.post(service.api(1), {}, function(data) {
				$("#progressbar").hide();
			});
		} else if (evt.target == this.btnStop
				|| evt.target.id == ("stop" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.remove("active");
			this.btnPause.classList.remove("active");
			this.btnStop.classList.add("active");
			this.btnRestart.classList.remove("active");
			$.post(service.api(2), {}, function(data) {
				$("#progressbar").hide();
			});
		} else if (evt.target == this.btnRestart
				|| evt.target.id == ("restart" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.remove("active");
			this.btnPause.classList.remove("active");
			this.btnStop.classList.remove("active");
			this.btnRestart.classList.add("active");
			$.post(service.api(3), {}, function(data) {
				that.btnRestart.classList.remove("active");
				that.btnStartup.classList.add("active");
				$("#progressbar").hide();
			});
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Dashboard(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);