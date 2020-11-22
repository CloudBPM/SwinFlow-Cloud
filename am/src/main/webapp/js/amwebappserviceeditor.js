/**
 * 
 */
(function($, window, document, undefined) {
	var pluginName = "amRestfulAppServiceEditor";
	var defaults = {
		id : "",
		appid : "",
		basicpropsheet : "",
		propsheet : "",
		width : 0,
		height : 0,
		parent : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			appid : "",
			basicpropsheet : "",
			propsheet : "",
			width : 0,
			height : 0,
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.currObject = null;
		this.stack = options.parent.stack;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.init(options);
	};

	Editor.prototype.init = function(options) {
		var editorPanel = document.createElement("DIV");
		this.element.appendChild(editorPanel);
		editorPanel.id = "accAppPane3Div4" + options.appid;
		editorPanel.style.width = (options.width) + "px";
		editorPanel.style.margin = "0px";
		editorPanel.style.padding = "0px";

		var contentPanel = document.createElement("DIV");
		editorPanel.appendChild(contentPanel);
		contentPanel.className = "col";
		contentPanel.style.margin = "0px";
		contentPanel.style.marginTop = "2px";
		contentPanel.style.padding = "0px";

		var cntDivPanel = document.createElement("DIV");
		contentPanel.appendChild(cntDivPanel);
		cntDivPanel.className = "panel panel-default";
		cntDivPanel.id = "accAppPane4" + options.appid;
		cntDivPanel.style.height = options.height + "px";
		cntDivPanel.style.marginBottom = "0px";
		cntDivPanel.style.overflowX = "auto";
		cntDivPanel.style.overflowY = "auto";

		var bodyDivPane = document.createElement("DIV");
		cntDivPanel.appendChild(bodyDivPane);
		bodyDivPane.className = "panel-body";

		var requestForm = document.createElement("form");
		bodyDivPane.appendChild(requestForm);
		requestForm.className = "form-horizontal";
		requestForm.id = "restfulapp" + options.appid;
		requestForm.setAttribute("role", "form");

		var restfulDiv = document.createElement("DIV");
		requestForm.appendChild(restfulDiv);
		restfulDiv.className = "checkbox col-sm-2";

		var restfulLabel = document.createElement("LABEL");
		restfulDiv.appendChild(restfulLabel);

		this.checkInput = document.createElement("input");
		restfulLabel.appendChild(this.checkInput);
		this.checkInput.type = "checkbox";
		var note = "如果该Web应用服务是表现层状态转化（Representational State Transfer）风格的，就是RESTful Web应用服务";
		this.checkInput.setAttribute("title", note);
		this.checkInput.id = "restful" + options.id;
		this.checkInput.addEventListener('click', this, false);

		var text = document.createElement("text");
		restfulLabel.appendChild(text);
		text.innerHTML = "RESTful";
		text.setAttribute("title", note);

		var methodDiv = document.createElement("DIV");
		requestForm.appendChild(methodDiv);
		methodDiv.className = "col-sm-2";

		var mGroupDiv = document.createElement("DIV");
		methodDiv.appendChild(mGroupDiv);
		mGroupDiv.className = "form-group";

		this.mthdSelect = document.createElement("SELECT");
		mGroupDiv.appendChild(this.mthdSelect);
		this.mthdSelect.className = "selectpicker form-control";
		this.mthdSelect.setAttribute("data-live-search", "true");
		this.mthdSelect.setAttribute("title", "请选择一个HTTP请求方法");
		this.mthdSelect.addEventListener("change", this, false);

		this.addOptions(this.mthdSelect, "GET", "GET", 0);
		this.addOptions(this.mthdSelect, "POST", "POST", 1);

		var hostDiv = document.createElement("DIV");
		requestForm.appendChild(hostDiv);
		hostDiv.className = "col-sm-4";

		var hostGroupDiv = document.createElement("DIV");
		hostDiv.appendChild(hostGroupDiv);
		hostGroupDiv.className = "form-group";

		var pGroupDiv = document.createElement("DIV");
		hostGroupDiv.appendChild(pGroupDiv);
		pGroupDiv.className = "input-group";

		var hostGroupDiv = document.createElement("DIV");
		pGroupDiv.appendChild(hostGroupDiv);
		hostGroupDiv.className = "input-group-addon";
		hostGroupDiv.innerHTML = "HTTP://";

		this.hostInput = document.createElement("INPUT");
		pGroupDiv.appendChild(this.hostInput);
		this.hostInput.className = "form-control";
		this.hostInput.setAttribute("placeholder", "请输入请求主机(:端口)");
		this.hostInput.addEventListener("change", this, false);

		var urlDiv = document.createElement("DIV");
		requestForm.appendChild(urlDiv);
		urlDiv.className = "col-sm-4";

		var urlGroupDiv = document.createElement("DIV");
		urlDiv.appendChild(urlGroupDiv);
		urlGroupDiv.className = "form-group";

		this.urlInput = document.createElement("INPUT");
		urlGroupDiv.appendChild(this.urlInput);
		this.urlInput.className = "form-control";
		this.urlInput.setAttribute("placeholder", "请输入请求的虚拟目录路径");
		this.urlInput.addEventListener("change", this, false);

		// request parameter pane
		var paraDiv = document.createElement("DIV");
		requestForm.appendChild(paraDiv);
		paraDiv.style.margin = "0px";
		paraDiv.style.padding = "0px";
		if (Utils.isIE() == 1) {
			paraDiv.style.styleFloat = "left";
		} else {
			paraDiv.style.cssFloat = "left";
		}
		paraDiv.style.width = "49%";

		this.addParaPane(paraDiv, options);

		var headerTabDiv = document.createElement("DIV");
		requestForm.appendChild(headerTabDiv);
		headerTabDiv.style.margin = "0px";
		headerTabDiv.style.padding = "0px";
		if (Utils.isIE() == 1) {
			headerTabDiv.style.styleFloat = "right";
		} else {
			headerTabDiv.style.cssFloat = "right";
		}
		headerTabDiv.style.width = "50%";

		this.addHeaderPane(headerTabDiv, options);

		this.loadingWebAppService(options.appid);
	};

	Editor.prototype.loadingWebAppService = function(id) {
		this.currObject = null;
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(15), {
			id : id,
		}).complete(function(data) {
			that.loadWebAppServiceData(data.responseJSON);
			if (that.currObject.status != 1) {
				that.options.parent.wdbutton.classList.add("active");
				that.options.parent.wdbutton.disabled = true;
			} else {
				that.options.parent.rlbutton.classList.add("active");
				that.options.parent.rlbutton.disabled = true;
			}
			$("#progressbar").hide();
		});
	};

	Editor.prototype.loadWebAppServiceData = function(json) {
		this.currObject = new WebAppService();
		this.currObject.parse(json);
		this.options.parent.currObject = this.currObject;
		this.paraspane.setEntity(this.currObject);
		this.headerspane.setEntity(this.currObject);
		this.authpane.setEntity(this.currObject);
		this.resppane.setEntity(this.currObject);
		this.hostInput.value = this.currObject.host;
		if (this.currObject.restful == 0)
			this.checkInput.checked = false;
		else
			this.checkInput.checked = true;
		this.urlInput.value = this.currObject.url;
		this.mthdSelect.value = this.currObject.methodName;
		this.showFormDataPane(this.currObject.methodName);
		this.setPropertySheet();
	};

	Editor.prototype.verify = function() {
		if (this.currObject.methodName == ""
				|| this.currObject.methodName == null) {
			return false;
		}
		if (this.currObject.host == "" || this.currObject.host == null) {
			return false;
		}
		if (this.currObject.url == "" || this.currObject.url == null) {
			return false;
		}
		return true;
	};

	Editor.prototype.addParaPane = function(parent, options) {
		var cellx = $(parent).requestDataEditPane({
			id : "P" + options.appid,
			parent : this,
			headbody : 1,
			height : (options.height - 108),
		});
		this.paraspane = cellx.data("requestDataEditPane");
	};

	Editor.prototype.addHeaderPane = function(headerTabDiv, options) {
		var headerTabHead = document.createElement("UL");
		headerTabDiv.appendChild(headerTabHead);
		headerTabHead.className = "nav nav-tabs";
		headerTabHead.setAttribute("role", "tablist");

		// Request header tab header
		var headTabLI = document.createElement("LI");
		headTabLI.className = "active";
		headerTabHead.appendChild(headTabLI);
		headTabLI.setAttribute("role", "presentation");

		var headTabA = document.createElement("A");
		headTabLI.appendChild(headTabA);
		headTabA.setAttribute("href", "#Headers" + options.appid);
		headTabA.setAttribute("role", "tab");
		headTabA.setAttribute("data-toggle", "tab");
		headTabA.innerHTML = "请求头";

		// Request authentication tab header
		var authTabLI = document.createElement("LI");
		headerTabHead.appendChild(authTabLI);
		authTabLI.setAttribute("role", "presentation");

		var authTabA = document.createElement("A");
		authTabLI.appendChild(authTabA);
		authTabA.setAttribute("href", "#Auth" + options.appid);
		authTabA.setAttribute("role", "tab");
		authTabA.setAttribute("data-toggle", "tab");
		authTabA.innerHTML = "请求头（安全认证）";

		// Request body tab header
		var bodyTabLI = document.createElement("LI");
		headerTabHead.appendChild(bodyTabLI);
		bodyTabLI.setAttribute("role", "presentation");

		var bodyTabA = document.createElement("A");
		bodyTabLI.appendChild(bodyTabA);
		bodyTabA.setAttribute("href", "#Body" + options.appid);
		bodyTabA.setAttribute("role", "tab");
		bodyTabA.setAttribute("data-toggle", "tab");
		bodyTabA.innerHTML = "请求体";

		// Response type setting tab
		var resTabLI = document.createElement("LI");
		headerTabHead.appendChild(resTabLI);
		resTabLI.setAttribute("role", "presentation");

		var respTabA = document.createElement("A");
		resTabLI.appendChild(respTabA);
		respTabA.setAttribute("href", "#Resp" + options.appid);
		respTabA.setAttribute("role", "tab");
		respTabA.setAttribute("data-toggle", "tab");
		respTabA.innerHTML = "响应类型";

		// Tab contents
		var tabContents = document.createElement("DIV");
		headerTabDiv.appendChild(tabContents);
		tabContents.className = "tab-content";

		var headersTab = document.createElement("DIV");
		tabContents.appendChild(headersTab);
		headersTab.setAttribute("role", "tabpanel");
		headersTab.className = "tab-pane active";
		headersTab.id = "Headers" + options.appid;

		this.addHeaderTab(headersTab, options);

		var authTab = document.createElement("DIV");
		tabContents.appendChild(authTab);
		authTab.setAttribute("role", "tabpanel");
		authTab.className = "tab-pane";
		authTab.id = "Auth" + options.appid;

		this.addHeaderAuthTab(authTab, options);

		this.bodyTab = document.createElement("DIV");
		tabContents.appendChild(this.bodyTab);
		this.bodyTab.setAttribute("role", "tabpanel");
		this.bodyTab.className = "tab-pane";
		this.bodyTab.id = "Body" + options.appid;

		this.respTab = document.createElement("DIV");
		tabContents.appendChild(this.respTab);
		this.respTab.setAttribute("role", "tabpanel");
		this.respTab.className = "tab-pane";
		this.respTab.id = "Resp" + options.appid;

		this.addRespTab(this.respTab, options);

		this.headerspane.setOtherPane(this.paraspane);
		this.paraspane.setOtherPane(this.headerspane);
	};

	Editor.prototype.addHeaderTab = function(parent, options) {
		var cellx = $(parent).httpHeaderEditPane({
			id : "H" + options.appid,
			parent : this,
			height : (options.height - 186),
		});
		this.headerspane = cellx.data("httpHeaderEditPane");
	};

	Editor.prototype.addHeaderAuthTab = function(parent, options) {
		var cellx = $(parent).httpAuthEditPane({
			id : "HA" + options.appid,
			parent : this,
			width : options.width,
			height : (options.height - 148),
		});
		this.authpane = cellx.data("httpAuthEditPane");
	};

	Editor.prototype.addRespTab = function(parent, options) {
		var cellx = $(parent).httpResponseEditPane({
			id : "RP" + options.appid,
			parent : this,
			width : options.width,
			height : (options.height - 148),
		});
		this.resppane = cellx.data("httpResponseEditPane");
	};

	Editor.prototype.addBodyTab = function(parent, options) {
		// form data
		var cellx = $(parent).requestDataEditPane({
			id : "FD" + options.appid,
			parent : this,
			headbody : 2,
			height : (options.height - 150),
		});
		this.formdatapane = cellx.data("requestDataEditPane");
		// // form file data
		// var cellx = $(parent).fileUploadEditPane({
		// id : "FLD" + options.appid,
		// parent : this,
		// headbody : 2,
		// });
		// this.formfiledatapane = cellx.data("fileUploadEditPane");
	};

	Editor.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.saveObject = function() {
		this.stack.save();
	};

	Editor.prototype.setPropertySheet = function() {
		// basic property setting
		if (this.basicpropsheet != null) {
			this.basicpropsheet.setSheet(this.currObject);
		}
		// advanced property setting.
		if (this.propsheet != null) {
			this.propsheet.setSheet(this.currObject, this.propsheet
					.getCurrTabIndex(this.currObject));
		}
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	Editor.prototype.doChange = function(evt) {
		if (evt.target == this.mthdSelect) {
			this.stack
					.execute(new AMWebAppMethodChangedCmd(
							this.currObject,
							this.mthdSelect.options[this.mthdSelect.selectedIndex].value));
		} else if (evt.target == this.urlInput) {
			this.stack.execute(new AMWebAppURLChangedCmd(this.currObject,
					"url", this.urlInput.value));
		} else if (evt.target == this.hostInput) {
			this.stack.execute(new AMWebAppHostChangedCmd(this.currObject,
					"host", this.hostInput.value));
		}
	};

	Editor.prototype.showFormDataPane = function(select) {
		$(this.bodyTab).empty();
		if (select == "POST") {
			if (this.formdatapane == null) {
				this.addBodyTab(this.bodyTab, this.options);
			} else {
				this.formdatapane.loadPane();
				// this.formfiledatapane.loadPane();
			}
			this.headerspane.setOtherPane1(this.formdatapane);
			this.paraspane.setOtherPane1(this.formdatapane);
			this.formdatapane.setOtherPane(this.paraspane);
			this.formdatapane.setOtherPane1(this.headerspane);
			this.formdatapane.setEntity(this.currObject);
			// this.formfiledatapane.setEntity(this.currObject);
		}
	};

	Editor.prototype.initHeaderSolution = function(entity) {
		this.headerspane.setEntity(entity);
	};

	Editor.prototype.changeHeaders = function(headers) {
		this.headerspane
				.refreshHeaderTable(this.headerspane.currTable, headers);
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.checkInput) {
			var isRESTful = 0;
			if (evt.target.checked) {
				isRESTful = 1;
			}
			this.stack.execute(new AMRESTfulRequestSettingChangedCmd(
					this.currObject, isRESTful, evt.target));
		}
	};

	Editor.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
	};

	Editor.prototype.enableAddButton = function() {
		this.options.parent.enableAddButton();
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