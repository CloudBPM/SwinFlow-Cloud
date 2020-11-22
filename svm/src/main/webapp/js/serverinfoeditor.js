;
(function($, window, document, undefined) {
	var pluginName = "bpmServerEditor";
	var defaults = {
		id : "", // server ID
		basicpropsheet : "",
		propsheet : "",
		owner : "", // organization ID
		width : 0,
		height : 0,
		ip : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "", // server ID
			basicpropsheet : "",
			propsheet : "",
			owner : "", // organization ID
			width : 0,
			height : 0,
			ip : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.painterRow = null;
		this.toolbarRow = null;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.serverinfo = new ServerInfoDescriptor();

		this.initMainPanel(options);
		this.createToolbar(options);
		this.initCanvas(options);

		this.timeinterval = setInterval(this.loading, 1000, options, this);
	};

	Editor.prototype.loading = function(options, parent) {
		// console.log(options.ip);
		$("#progressbar").show();
		// url = "http://" + ip + ":" + port + "/bpmsvr/service11/api" + n + "";
		$.get(mysvr.api("localhost", "8080", 4), {}).complete(function(data) {
			parent.serverinfo.parseFromJSON(data.responseJSON);
			parent.setPropertySheet();
			parent.egnPane.loadData(parent.serverinfo);
			$("#progressbar").hide();
		});
	};

	Editor.prototype.getDirty = function() {
		return false;
	};

	Editor.prototype.cleanTimeInteval = function() {
		this.timeinterval = window.clearInterval(this.timeinterval);
		this.timeinterval = null;
	};

	Editor.prototype.initMainPanel = function(options) {
		var editorPanel = document.createElement("DIV");
		this.element.appendChild(editorPanel);
		editorPanel.style.margin = "0px";
		editorPanel.style.padding = "0px";
		editorPanel.style.overflow = "auto";

		this.toolbarRow = document.createElement("DIV");
		editorPanel.appendChild(this.toolbarRow);
		this.toolbarRow.className = "row";
		this.toolbarRow.style.margin = "0px";
		this.toolbarRow.style.padding = "0px";

		this.painterRow = document.createElement("DIV");
		editorPanel.appendChild(this.painterRow);
		this.painterRow.className = "row";
		this.painterRow.style.margin = "0px";
		this.painterRow.style.padding = "0px";
	};

	Editor.prototype.createToolbar = function(options) {
		var parent = document.createElement("DIV");
		this.toolbarRow.appendChild(parent);
		parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		parent.style.margin = "0px";
		parent.style.padding = "2px";

		var c = "btn btn-default";
		var c1 = "btn btn-dangerous";
		var g1 = this.createGroup(parent);
		var g2 = this.createGroup(parent);
		this.btnStartup = this.createTool(g2, "start" + this.options.id, "启动",
				c, "i", "fa fa-play fa-lg");
		this.btnPause = this.createTool(g2, "pause" + this.options.id, "暂停", c,
				"i", "fa fa-pause fa-lg");
		this.btnStop = this.createTool(g2, "stop" + this.options.id, "停止", c,
				"i", "fa fa-stop fa-lg");
		this.btnRestart = this.createTool(g2, "restart" + this.options.id,
				"重启", c, "i", "fa fa-repeat fa-lg");

		var g3 = this.createGroup(parent);
		this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
				c, "i", "fa fa-print fa-lg");
	};

	Editor.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		parent.appendChild(group);
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		return group;
	};

	Editor.prototype.createTool = function(group, id, title, style, fonttag,
			fontclass) {
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
		icon.id = id;
		return button;
	};

	Editor.prototype.initCanvas = function(options) {
		var canvasPanel = document.createElement("DIV");
		this.painterRow.appendChild(canvasPanel);

		canvasPanel.id = "infoPanel" + options.id;
		canvasPanel.className = "col";
		canvasPanel.style.width = options.width + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.padding = "0px";

		this.canvasPane = document.createElement("DIV");
		canvasPanel.appendChild(this.canvasPane);

		this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.canvasPane.id = "infoPane" + options.id;
		this.canvasPane.style.margin = "0px";
		this.canvasPane.style.padding = "0px";
		this.canvasPane.style.height = (options.height - 84) + "px";

		var tabDIV = document.createElement("DIV");
		this.canvasPane.appendChild(tabDIV);
		// tabDIV.style.margin = "1px";

		var tabUL = document.createElement("UL");
		tabUL.className = "nav nav-tabs server-nav-tabs";
		tabUL.id = "server-props-nav-tabs";
		tabUL.setAttribute("role", "tablist");
		tabDIV.appendChild(tabUL);
		this.newTabHead(tabUL, 0, "服务器当前状态", true);
		this.newTabHead(tabUL, 1, "流程查询", false);
		this.newTabHead(tabUL, 2, "实时数据", false);
		this.newTabHead(tabUL, 3, "运行数据统计", false);
		var that = this;
		$("#server-props-nav-tabs").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			// that.currtabindex = parseInt($(this).attr('href').substring(4));
			// if (that.currtabindex == 0 || that.currtabindex == 2) {
			// if (owner instanceof WfProcess) {
			// that.options.parent.enableAddButton();
			// }
			// } else {
			// that.options.parent.disabledAddButton();
			// }
		});

		var tabContents = document.createElement("DIV");
		tabDIV.appendChild(tabContents);
		tabContents.className = "tab-content";
		tabContents.id = "serverinfotabs";

		this.tabContent1 = this.newTabContent(tabContents, 0, true);
		var plugin1 = $(this.tabContent1).engineInfoPane({
			id : "svrtab0",
			pid : options.id,
			basicpropsheet : options.basicpropsheet,
			propsheet : options.propsheet,
			width : options.width,
			height : (options.height - 130),
			parent : this,
		});
		this.egnPane = plugin1.data("engineInfoPane");

		this.tabContent2 = this.newTabContent(tabContents, 1, false);
		var plugin1 = $(this.tabContent2).searchConditionPane({
			id : "svrtab0",
			pid : options.id,
			basicpropsheet : options.basicpropsheet,
			propsheet : options.propsheet,
			width : options.width,
			height : (options.height - 130),
			parent : this,
		});
		this.schPane = plugin1.data("searchConditionPane");

		this.tabContent3 = this.newTabContent(tabContents, 2, false);

		this.tabContent4 = this.newTabContent(tabContents, 3, false);

		$('#server-props-nav-tabs a[href="#svrtab' + this.currtabindex + '"]')
				.tab('show');

	};

	Editor.prototype.newTabHead = function(parent, index, caption, active) {
		var tabLi = document.createElement("li");
		parent.appendChild(tabLi);
		if (active)
			tabLi.className = "active";
		tabLi.setAttribute("role", "presentation");
		var tabLink = document.createElement("a");
		tabLi.appendChild(tabLink);
		tabLink.setAttribute("href", "#svrtab" + index);
		tabLink.setAttribute("aria-controls", "svrtab" + index);
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("data-toggle", "tab");
		tabLink.innerHTML = caption;
	};

	Editor.prototype.newTabContent = function(parent, index, active) {
		var tabContent = document.createElement("DIV");
		parent.appendChild(tabContent);
		tabContent.setAttribute("data", "svrtab" + index);
		tabContent.setAttribute("role", "tabpanel");
		if (active)
			tabContent.className = "tab-pane active";
		else
			tabContent.className = "tab-pane";
		tabContent.id = "svrtab" + index;
		return tabContent;
	};

	Editor.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	Editor.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	Editor.prototype.doClick = function(evt) {
		var that = this;
		if (evt.target == this.btnStartup
				|| evt.target.id == ("startup" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.add("active");
			this.btnPause.classList.remove("active");
			this.btnStop.classList.remove("active");
			this.btnRestart.classList.remove("active");
			// $.post(service.api(0), {}, function(data) {
			// $("#progressbar").hide();
			// });
		} else if (evt.target == this.btnPause
				|| evt.target.id == ("pause" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.remove("active");
			this.btnPause.classList.add("active");
			this.btnStop.classList.remove("active");
			that.btnRestart.classList.remove("active");
			// $.post(service.api(1), {}, function(data) {
			// $("#progressbar").hide();
			// });
		} else if (evt.target == this.btnStop
				|| evt.target.id == ("stop" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.remove("active");
			this.btnPause.classList.remove("active");
			this.btnStop.classList.add("active");
			this.btnRestart.classList.remove("active");
			// $.post(service.api(2), {}, function(data) {
			// $("#progressbar").hide();
			// });
		} else if (evt.target == this.btnRestart
				|| evt.target.id == ("restart" + this.options.id)) {
			$("#progressbar").show();
			this.btnStartup.classList.remove("active");
			this.btnPause.classList.remove("active");
			this.btnStop.classList.remove("active");
			this.btnRestart.classList.add("active");
			// $.post(service.api(3), {}, function(data) {
			// that.btnRestart.classList.remove("active");
			// that.btnStartup.classList.add("active");
			// $("#progressbar").hide();
			// });
		}
	};

	Editor.prototype.setPropertySheet = function() {
		var obj = this.serverinfo;
		if (this.basicpropsheet != null) {
			this.basicpropsheet.setSheet(obj);
		}
		if (this.propsheet != null) {
			this.propsheet.setSheet(obj, this.serverinfo, this.propsheet
					.getCurrTabIndex(obj));
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Editor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);