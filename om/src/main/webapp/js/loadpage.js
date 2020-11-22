(function($, window, document, undefined) {
	var pluginName = "omHomePage";
	var defaults = {
		id : "",
		title : "",
		ownerId : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			ownerId : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.currObject = null;

		this.init(options);
		this.loading(options);
	};

	Editor.prototype.init = function(options) {
		var homePage = new HomePageTemplate();
		homePage.id = options.id;
		this.currObject = homePage;
	};

	Editor.prototype.loadPage = function(skinId, imgURL, orgTitle, newsText) {
		this.mainframe = document.createElement("DIV");
		this.mainframe.id = "pageHTML";
		this.mainframe.className = "container-fluid";
		this.mainframe.id = "maincontent"
		this.mainframe.style.backgroundImage = imgURL;
		this.mainframe.style.backgroundColor = "#f3f3f3";
		this.mainframe.style.height = "800px";

		this.element.appendChild(this.mainframe);

		this.pagePreview = document.createElement("DIV");
		this.mainframe.appendChild(this.pagePreview);

		this.pagePreview.className = "container-fluid";

		var div1 = document.createElement("DIV");
		this.pagePreview.appendChild(div1);
		div1.className = "row home-banner embed-responsive-banner embed-responsive-new";

//		var image = document.createElement("IMG")
//		div1.appendChild(image);
//		//image.src = imgURL;
//		image.style.width = "100%";
//		image.style.height = "250px";

		var div2 = document.createElement("DIV");
		div2.className = "navbar-collapse collapse";
		div2.role = "navigation";
		this.pagePreview.appendChild(div2);
		div2.style.position = "relative";
		div2.style.margin = "30px";

		var ul = document.createElement("UL");
		ul.style.overflow = "hidden";
		ul.className = "nav navbar-nav";
		ul.style.position = "absolute";
		ul.style.left = "35%";
		ul.style.top = "50%";
		ul.style.transform = "translate(0,-50%)";

		div2.appendChild(ul);

		var li1 = document.createElement("LI");
		ul.appendChild(li1);
		li1.className = "hidden-sm hidden-md";
		li1.style.cssFloat = "left";
		li1.style.textAlign = "center";

		var a1 = document.createElement("A");
		li1.appendChild(a1);
		a1.innerHTML = "首页";
		a1.style.fontSize = "20px";
		a1.addEventListener('click', this, false);

		var li2 = document.createElement("LI");
		ul.appendChild(li2);
		li2.style.cssFloat = "left";
		li2.style.textAlign = "center";

		var a2 = document.createElement("A");
		li2.appendChild(a2);
		a2.innerHTML = "公司简介";
		a2.style.fontSize = "20px";
		a2.addEventListener('click', this, false);

		var li3 = document.createElement("LI");
		ul.appendChild(li3);
		li3.style.cssFloat = "left";
		li3.style.textAlign = "center";

		var a3 = document.createElement("A");
		li3.appendChild(a3);
		a3.innerHTML = "新产品";
		a3.style.fontSize = "20px";
		a3.addEventListener('click', this, false);

		var li4 = document.createElement("LI");
		ul.appendChild(li4);

		var a4 = document.createElement("A");
		li4.appendChild(a4);
		a4.innerHTML = "新闻公告";
		a4.style.fontSize = "20px";
		a4.addEventListener('click', this, false);

		var div3 = document.createElement("DIV");
		div3.style.marginTop = "50px";
		this.pagePreview.appendChild(div3);

		var div31 = document.createElement("DIV");
		div3.appendChild(div31);

		var a31 = document.createElement("A");
		div31.appendChild(a31);
		a31.innerHTML = orgTitle;

		var div4 = document.createElement("DIV");
		this.pagePreview.appendChild(div4);
		var p = document.createElement("P");
		div4.appendChild(p);
		p.innerHTML = newsText;

		this.div5 = document.createElement("DIV");
		this.div5.style.visibllity = false;
		this.div5.style.display = "none";

		this.div6 = document.createElement("DIV");
		this.div6.style.visibllity = false;
		this.div6.style.display = "none";

		this.div7 = document.createElement("DIV");
		this.div7.style.visibllity = false;
		this.div7.style.display = "none";

		this.div8 = document.createElement("DIV");
		this.div8.style.visibllity = false;
		this.div8.style.display = "none";

		if ($(maincontent).firstPagePane != undefined) {
			var board = $(maincontent).firstPagePane({
				id : "firstPagePane",
				parent : this,
				ownerId : this.options.ownerId,
			});
			this.firstPagePane = board.data("firstPagePane");
		}

		if ($(maincontent).orgInformationPane != undefined) {
			var board = $(maincontent).orgInformationPane({
				id : "orgInformationPane",
				parent : this,
				ownerId : this.options.ownerId,
			});
			this.orgInformationPane = board.data("orgInformationPane");
		}

		if ($(maincontent).orgProductsPane != undefined) {
			var board = $(maincontent).orgProductsPane({
				id : "orgProductsPane",
				parent : this,
				ownerId : this.options.ownerId,
			});
			this.orgProductsPane = board.data("orgProductsPane");
		}

		if ($(maincontent).orgNewsPanel != undefined) {
			var board = $(maincontent).orgNewsPanel({
				id : "orgNewsPanel",
				parent : this,
				ownerId : this.options.ownerId,
			});
			this.orgNewsPanel = board.data("orgNewsPanel");
		}

	};

	Editor.prototype.loading = function(options) {

		var that = this;
		var searchUrl = window.location.href;
		var org = searchUrl.split("=");
		var orgText = decodeURI(org[1]);

		if (/.*[\u4e00-\u9fa5]+.*$/.test(orgText)) {
			var cmd = 1;
		} else {
			cmd = 2;
		}

		// $("#progressbar").show();
		// $.get(omservices.api(cmd, this.options.ownerId), {
		// 	org : orgText,
		// }).complete(
		// 		function(data) {
		// 			if (data != undefined && data.status != undefined
		// 					&& data.status != null && data.status != "") {
		// 				if (data.status == 0 || data.status == -10) {
		// 					messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
		// 					return;
		// 				}
		// 			}
		// 			if (data.responseJSON != null) {
		// 				that.loadData(data.responseJSON);
		// 			}
		// 			$("#progressbar").hide();
		//
		// 		});

	};

	Editor.prototype.loadData = function(jsonobj) {
		this.currObject.parseFromJSON(jsonobj);
		// this.setPropertySheet();

		var skinId = this.currObject.Skin;
		var imgURL = "http://localhost:8080/om/img/2.jpg";
		var orgTitle = this.currObject.orgTitle;
		var newsText = "欢迎使用轩琦信息科技有限公司制作网页，您可以通过简单便捷的操作制定让您满意的公司主页。";
		this.loadPage(skinId, imgURL, orgTitle, newsText);
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

	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.undobutton
				|| (evt.target.id == ("undoS" + this.options.id))) {
			this.stack.undo();
		} else if (evt.target == this.redobutton
				|| (evt.target.id == ("redoS" + this.options.id))) {
			this.stack.redo();
		} else if (evt.target == this.previewButton
				|| (evt.target.id == ("preview" + this.options.id))) {
			window.open("test.html?orgId=" + this.currObject.owner);
		} else if (evt.target.outerText == "首页"
				|| evt.target.outerText == "公司简介"
				|| evt.target.outerText == "新产品"
				|| evt.target.outerText == "新闻公告") {
			this.loadPane(evt.target);
		} else if (evt.target.id == "退出") {
			this.div5.style.visibllity = false;
			this.div5.style.display = "none";
			this.propsheet.panelBody.style.visibllity = true;
			this.propsheet.panelBody.style.display = "block";
			this.propsheet.element.style.visibllity = true;
			this.propsheet.element.style.display = "block";
		} else if (evt.target.id == "退出简介") {
			this.div6.style.visibllity = false;
			this.div6.style.display = "none";
			this.propsheet.panelBody.style.visibllity = true;
			this.propsheet.panelBody.style.display = "block";
			this.propsheet.element.style.visibllity = true;
			this.propsheet.element.style.display = "block";
		} else if (evt.target.id == "退出产品") {
			this.div7.style.visibllity = false;
			this.div7.style.display = "none";
			this.propsheet.panelBody.style.visibllity = true;
			this.propsheet.panelBody.style.display = "block";
			this.propsheet.element.style.visibllity = true;
			this.propsheet.element.style.display = "block";
		} else if (evt.target.id == "退出公告") {
			this.div8.style.visibllity = false;
			this.div8.style.display = "none";
			this.propsheet.panelBody.style.visibllity = true;
			this.propsheet.panelBody.style.display = "block";
			this.propsheet.element.style.visibllity = true;
			this.propsheet.element.style.display = "block";
		}
	};

	Editor.prototype.hiddenAll = function() {
		this.div5.style.visibllity = false;
		this.div5.style.display = "none";
		this.div6.style.visibllity = false;
		this.div6.style.display = "none";
		this.div7.style.visibllity = false;
		this.div7.style.display = "none";
		this.div8.style.visibllity = false;
		this.div8.style.display = "none";
	}

	Editor.prototype.loadPane = function(item) {
		this.hiddenAll();

		if (item.outerText == "首页") {
			this.div5 = this.firstPagePane.newsPanelBody;
			this.pagePreview.appendChild(this.div5);
			this.div5.style.visibllity = true;
			this.div5.style.display = "block";
		} else if (item.outerText == "公司简介") {
			this.div6 = this.orgInformationPane.newsPanelBody;
			this.pagePreview.appendChild(this.div6);
			this.div6.style.visibllity = true;
			this.div6.style.display = "block";
		} else if (item.outerText == "新产品") {
			this.div7 = this.orgProductsPane.newsPanelBody;
			this.pagePreview.appendChild(this.div7);
			this.div7.style.visibllity = true;
			this.div7.style.display = "block";
		} else if (item.outerText == "新闻公告") {
			this.div8 = this.orgNewsPanel.newsPanelBody;
			this.pagePreview.appendChild(this.div8);
			this.div8.style.visibllity = true;
			this.div8.style.display = "block";
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