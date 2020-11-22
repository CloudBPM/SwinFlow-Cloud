/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "appServiceStoreDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
		topparent : "",
	};

	var AppServiceStoreDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.modalframe;
		this.topparent;
		this.init(options);
	};

	AppServiceStoreDialog.prototype.init = function(options) {
		this.topparent = options.topparent;
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		// dialog
		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "1000px"
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		modaldialogDIV.appendChild(dialogContentDIV);

		// dialog headding
		var dialogHeaderDIV = document.createElement("div");
		dialogHeaderDIV.className = "modal-header";
		dialogContentDIV.appendChild(dialogHeaderDIV);

		var closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");

		var closeSpan = document.createElement("span");
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";
		closeButton.appendChild(closeSpan);
		dialogHeaderDIV.appendChild(closeButton);

		var titleH4 = document.createElement("h4");
		titleH4.className = "modal-title";
		titleH4.id = "modal" + options.id;
		dialogHeaderDIV.appendChild(titleH4);

		var infoIcon = document.createElement("i");
		infoIcon.className = "fa fa-plus-circle fa-lg";
		infoIcon.style.color = "green";
		titleH4.appendChild(infoIcon);

		var info = document.createElement("label");
		info.innerHTML = options.title;
		titleH4.appendChild(info);

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);

		var dialogBodyDIV = document.createElement("div");
		dialogBodyDIV.className = "modal-body";
		dialogForm.appendChild(dialogBodyDIV);

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyFrameDIV.className = "container-fluid";
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);

		var bodyRow = document.createElement("div");
		bodyRow.className = "row";
		bodyRow.id = "bodyrow" + options.id;
		dialogBodyFrameDIV.appendChild(bodyRow);

		// add form panel here...
		this.loadPanel(bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		this.saveButton = document.createElement("button");
		this.saveButton.type = "Button";
		this.saveButton.id = "OKButton" + options.id;
		this.saveButton.className = "btn btn-primary";
		this.saveButton.addEventListener("click", this, false);
		this.saveButton.innerHTML = "确定";
		this.saveButton.disabled = true;
		dialogFooterDIV.appendChild(this.saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "Button";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

	};

	AppServiceStoreDialog.prototype.setApp = function(id, apptype, owner) {
		this.appId = id;
		this.owner = owner;
		this.apptype = apptype;
		if (id != undefined && id != null && id != "") {
			this.searching(this.appId, this.appId, this.apptype, this.owner, 0,
					30);
		}
	};

	AppServiceStoreDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		parent.appendChild(form);
		form.className = "form-horizontal";

		// --
		var searchDIV1 = document.createElement("div");
		searchDIV1.className = "form-group col-sm-12";
		form.appendChild(searchDIV1);

		var group = document.createElement("DIV");
		searchDIV1.appendChild(group);
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");

		this.searchInput = document.createElement("input");
		group.appendChild(this.searchInput);
		this.searchInput.type = "text";
		this.searchInput.setAttribute("placeholder", "在应用商店中搜索可用的微服务...");
		this.searchInput.name = "entityname";
		this.searchInput.className = "form-control";
		this.searchInput.id = "entityname";
		this.searchInput.addEventListener("keydown", this, false);

		var searchSpan = document.createElement("span");
		group.appendChild(searchSpan);
		searchSpan.className = "input-group-btn";

		var searchContainer = document.createElement("div");
		parent.appendChild(searchContainer);

		var searchRowDiv = document.createElement("div");
		searchContainer.appendChild(searchRowDiv);
		searchRowDiv.className = "row";

		var searchResultLeftDiv = document.createElement("div");
		searchRowDiv.appendChild(searchResultLeftDiv);
		searchResultLeftDiv.className = "col-sm-8 ";

		var group1 = document.createElement("div");
		searchResultLeftDiv.appendChild(group1);
		group1.className = "col-sm-12";

		var tableDiv = document.createElement("DIV");
		group1.appendChild(tableDiv);

		this.restultDiv = document.createElement("DIV");
		tableDiv.appendChild(this.restultDiv);
		this.restultDiv.className = "col-sm-12";
		this.restultDiv.style.overflowY = "auto";
		this.restultDiv.style.overflowX = "auto";
		this.restultDiv.style.height = "300px";

		var toolbarDiv = document.createElement("DIV");
		tableDiv.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		this.createNavigationGroup(toolbarDiv);

		this.testRightDiv = document.createElement("div");
		searchRowDiv.appendChild(this.testRightDiv);
		this.testRightDiv.className = "col-sm-4";

		var searchRowDiv = document.createElement("div");
		searchContainer.appendChild(searchRowDiv);
		searchRowDiv.className = "row";

		this.searchBtn = this.createTool(searchSpan, "searchAppBtn"
				+ this.options.id, "搜索 ", "btn btn-primary", "i",
				"fa fa-search fa-lg");

		var dialog = $(parent).alertBox({
			id : this.options.id,
		});
		this.messageBox = dialog.data("alertBox");
	};

	AppServiceStoreDialog.prototype.createTool = function(group, id, title,
			style, fonttag, fontclass) {
		var button = document.createElement("button");
		group.appendChild(button);
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		// button.addEventListener('mouseenter', function(){
		// this.style.background = "#006699";
		// });
		// button.addEventListener('mouseleave', function(){
		// this.style.background = "";
		// });
		var icon = document.createElement(fonttag);
		button.appendChild(icon);
		icon.addEventListener('click', this, false);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		return button;
	};

	AppServiceStoreDialog.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {
			if (evt.target.value != "") {
				this.searching(this.appId, evt.target.value, this.apptype,
						this.owner, 0, 30);
			} else {
				this.messageBox.show(4, "搜索对象不能为空，请输入一个搜索对象", false);
			}
			evt.preventDefault();
			return false;
		}
	};

	AppServiceStoreDialog.prototype.loadAPIs = function(entity, parentTag) {
		// var apiListTag = document.createElement("div");
		// parentTag.appendChild(apiListTag);
		// $("#progressbar").show();
		// var that = this;
		// $.getJSON(service.api(17), {
		// 	appid : entity.id,
		// }).complete(
		// 		function(data) {
		// 			that.loadAPIData(data.responseJSON, entity.id,
		// 					entity.password, entity.appName, apiListTag);
		// 			$("#progressbar").hide();
		// 		});
	};

	AppServiceStoreDialog.prototype.loadAPIData = function(json, appid, pw,
			appName, parent) {
		if (json == null) {
			return;
		}
		for (var i = 0; i < json.length; i++) {
			if (json[i] != null) {
				var entiyDiv = document.createElement("DIV");
				parent.appendChild(entiyDiv);
				entiyDiv.className = "form-group";
				entiyDiv.style.paddingLeft = "5px";

				var titleDiv = document.createElement("DIV");
				entiyDiv.appendChild(titleDiv);
				titleDiv.className = "radio";

				var radioLabel = document.createElement("LABEL");
				titleDiv.appendChild(radioLabel);

				var appRadio = document.createElement("input");
				titleDiv.appendChild(appRadio);
				appRadio.type = "radio";
				appRadio.name = "app";
				appRadio.id = json[i].id;
				appRadio.value = json[i].id;
				appRadio.setAttribute("appid", appid);
				appRadio.setAttribute("title", "请点击这里以选择该Java接口");
				appRadio.setAttribute("appname", appName);
				appRadio.setAttribute("apptype", "2");
				appRadio.setAttribute("pw", pw);
				var that = this;
				appRadio.addEventListener("click", function() {
					if (this.checked) {
						that.enableButton(that.saveButton);
					}
				});

				var titleH3 = document.createElement("TEXT");
				titleDiv.appendChild(titleH3);

				titleH3.innerHTML = json[i].name + " ";
			}
		}
	};

	AppServiceStoreDialog.prototype.searching = function(id, condition,
			apptype, owner, pageno, pagesize) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(16), {
			appid : id,// app id
			apptype : apptype,
			cond : condition,// search
			ownerid : owner,// organization id
			pageno : pageno,
			pagesize : pagesize,
		}).complete(function(data) {
			that.loadData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	AppServiceStoreDialog.prototype.loadData = function(json) {
		if (json == null) {
			return;
		}
		$(this.restultDiv).children().remove();
		if (json.pageEntities != null && json.pageEntities.length == 0) {
			var entiyDiv = document.createElement("DIV");
			this.restultDiv.appendChild(entiyDiv);
			entiyDiv.innerHTML = "抱歉，没有搜索到符合条件的微服务。";
			return;
		}
		for (var i = 0; i < json.pageEntities.length; i++) {
			if (json.pageEntities[i] != null) {

				var entiyDiv = document.createElement("DIV");
				this.restultDiv.appendChild(entiyDiv);
				entiyDiv.className = "form-group";
				entiyDiv.style.paddingLeft = "5px";

				var radioLabel = document.createElement("LABEL");
				entiyDiv.appendChild(radioLabel);
				radioLabel.className = "radio";

				// web app service
				// if (json.pageEntities[i].appType == "1") {
					var appRadio = document.createElement("input");
					radioLabel.appendChild(appRadio);
					appRadio.type = "radio";
					appRadio.name = "app";
					appRadio.id = json.pageEntities[i].id;
					appRadio.value = json.pageEntities[i].id;
					appRadio.setAttribute("appid", json.pageEntities[i].id);
					appRadio.setAttribute("title", "请点击这里以选择该微服务。");
					appRadio.setAttribute("appname",
							json.pageEntities[i].appName);
					appRadio.setAttribute("apptype", json.pageEntities[i].serviceType);
					appRadio.setAttribute("pw", json.pageEntities[i].password);
					var that = this;
					appRadio.addEventListener("click", function() {
						if (this.checked) {
							that.enableButton(that.saveButton);
						}
					});
				// }

				var titleDiv = document.createElement("DIV");
				radioLabel.appendChild(titleDiv);

				var titleH3 = document.createElement("H4");
				titleDiv.appendChild(titleH3);
				titleH3.style.color = "blue";

				titleH3.innerHTML = json.pageEntities[i].appName + " ";

				// if (json.pageEntities[i].appType == "2") {
				// 	titleH3.innerHTML += "(Java)" + " ";
				// } else {
					titleH3.innerHTML += "(微服务)" + " ";
				// }

				if (json.pageEntities[i].accessType == "2") {
					var earchIcon = document.createElement("I");
					titleH3.appendChild(earchIcon);
					earchIcon.className = "fa fa-globe fa-lg";
					earchIcon.style.color = "#4da6ff";
					earchIcon.setAttribute("aria-hidden", "true");
					earchIcon.setAttribute("title", "该应用是公共服务，可以被所有注册会员单位搜索到。");
				}

				if (json.pageEntities[i].password == "Y") {
					var lockIcon = document.createElement("I");
					titleH3.appendChild(lockIcon);
					lockIcon.className = "fa fa-lock fa-lg";
					lockIcon.setAttribute("aria-hidden", "true");
					lockIcon.setAttribute("title", "该应用有访问密码。");
					lockIcon.style.color = "#ff9980";
				} else {
					var lockIcon1 = document.createElement("I");
					titleH3.appendChild(lockIcon1);
					lockIcon1.className = "fa fa-unlock fa-lg";
					lockIcon1.setAttribute("aria-hidden", "true");
					lockIcon1.setAttribute("title", "该应用无访问密码。");
					lockIcon1.style.color = "#a6a6a6";
				}

				var commentDiv = document.createElement("DIV");
				entiyDiv.appendChild(commentDiv);
				commentDiv.innerHTML = Utils
						.getDateTime(json.pageEntities[i].lastupdate)
						+ " - " + json.pageEntities[i].comments;

				// var discussionDiv = document.createElement("DIV");
				// entiyDiv.appendChild(discussionDiv);

				// star level
				// var starsDiv = document.createElement("SPAN");
				// discussionDiv.appendChild(starsDiv);
				//
				// var starDiv1 = document.createElement("SPAN");
				// starsDiv.appendChild(starDiv1);
				// starDiv1.className = "glyphicon glyphicon-star";
				//
				// var starDiv2 = document.createElement("SPAN");
				// starsDiv.appendChild(starDiv2);
				// starDiv2.className = "glyphicon glyphicon-star";
				//
				// var starDiv3 = document.createElement("SPAN");
				// starsDiv.appendChild(starDiv3);
				// starDiv3.className = "glyphicon glyphicon-star";
				//
				// var starDiv4 = document.createElement("SPAN");
				// starsDiv.appendChild(starDiv4);
				// starDiv4.className = "glyphicon glyphicon-star-empty";
				//
				// var starDiv5 = document.createElement("SPAN");
				// starsDiv.appendChild(starDiv5);
				// starDiv5.className = "glyphicon glyphicon-star-empty";
				//
				// var refDiv = document.createElement("SPAN");
				// discussionDiv.appendChild(refDiv);
				// refDiv.innerHTML = " 引用量：" + 1000 + " ";
				//
				// var useDiv = document.createElement("SPAN");
				// discussionDiv.appendChild(useDiv);
				// useDiv.innerHTML = " 使用量：" + 23300 + " ";
				//
				// var respDiv = document.createElement("SPAN");
				// discussionDiv.appendChild(respDiv);
				// respDiv.innerHTML = " 访问用时：" + 2.4 + "秒";
				//
				// var likeDiv = document.createElement("SPAN");
				// discussionDiv.appendChild(likeDiv);
				// likeDiv.innerHTML = " 获赞：" + 2300 + " ";
				//
				// var priceDiv = document.createElement("SPAN");
				// discussionDiv.appendChild(priceDiv);
				// priceDiv.innerHTML = " 使用价格："
				// 		+ (parseFloat(json.pageEntities[i].price) == 0 ? "免费"
				// 				: "￥" + json.pageEntities[i].price) + " ";
				//
				// var devDiv = document.createElement("DIV");
				// entiyDiv.appendChild(devDiv);
				// devDiv.innerHTML = "开发商：" + json.pageEntities[i].orgName;

				// if (json.pageEntities[i].appType == "2") {
				// 	this.loadAPIs(json.pageEntities[i], entiyDiv);
				// }
			}
			this.pageno.innerHTML = "第" + json.pageNo + "页";
			this.totalpage.innerHTML = "/共" + json.allPagesCount + "页";
			if (json.allPagesCount <= 1) {
				this.disableButton(this.firstPageHButton);
				this.disableButton(this.previousPageHButton);
				this.disableButton(this.nextPageHButton);
				this.disableButton(this.lastPageHButton);
			} else if (json.allPagesCount > 1) {
				if (json.pageNo == 1) {
					this.disableButton(this.firstPageHButton);
					this.disableButton(this.previousPageHButton);
					this.enableButton(this.nextPageHButton);
					this.enableButton(this.lastPageHButton);
				} else if (json.pageNo == json.allPagesCount) {
					this.enableButton(this.firstPageHButton);
					this.enableButton(this.previousPageHButton);
					this.disableButton(this.nextPageHButton);
					this.disableButton(this.lastPageHButton);
				} else if (json.pageNo > 1 && json.pageNo < json.allPagesCount) {
					this.enableButton(this.firstPageHButton);
					this.enableButton(this.previousPageHButton);
					this.enableButton(this.nextPageHButton);
					this.enableButton(this.lastPageHButton);
				}
			}
		}

	};

	AppServiceStoreDialog.prototype.createNavigationGroup = function(parent) {
		var group = this.createGroup(parent);
		this.firstPageHButton = this.createTool(group, "firstPageH"
				+ this.options.id, "首页", "btn btn-default btn-sm", "i",
				"fa fa-step-backward fa-lg");
		this.previousPageHButton = this.createTool(group, "previousPageH"
				+ this.options.id, "前一页", "btn btn-default btn-sm", "i",
				"fa fa-backward fa-lg");
		this.nextPageHButton = this.createTool(group, "nextPageH"
				+ this.options.id, "后一页", "btn btn-default btn-sm", "i",
				"fa fa-forward fa-lg");
		this.lastPageHButton = this.createTool(group, "lastPageH"
				+ this.options.id, "末页", "btn btn-default btn-sm", "i",
				"fa fa-step-forward fa-lg");

		this.disableButton(this.firstPageHButton);
		this.disableButton(this.previousPageHButton);
		this.disableButton(this.nextPageHButton);
		this.disableButton(this.lastPageHButton);

		var group2 = this.createGroup(parent);
		this.pageno = this.createLabel(group2, "l1" + this.options.id, "");
		this.totalpage = this.createLabel(group2, "l2" + this.options.id, "");

	};

	AppServiceStoreDialog.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	AppServiceStoreDialog.prototype.createLabel = function(group, id, title) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.id = id;
		group.appendChild(label);
		return label;
	};

	AppServiceStoreDialog.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	AppServiceStoreDialog.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	AppServiceStoreDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	AppServiceStoreDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	AppServiceStoreDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	AppServiceStoreDialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		if (evt.target == this.saveButton
				|| evt.target.id == "OKButton" + this.options.id) {
			var t = $("input[name=app]:checked").attr("apptype");
			var v = $("input[name=app]:checked").val();
			var ap = $("input[name=app]:checked").attr("appid");
			var pw = $("input[name=app]:checked").attr("pw");
			var apn = $("input[name=app]:checked").attr("appname");
			this.options.parent.setAppSearchResult(apn, t, v, ap, pw);
			this.hide();
			return;
		} else if (evt.target == this.firstPageHButton
				|| (evt.target.id == ("firstPageH" + this.options.id))) {
			this.searching(this.appId, this.searchInput.value, this.apptype,
					this.owner, 0, 30);
		} else if (evt.target == this.previousPageHButton
				|| (evt.target.id == ("previousPageH" + this.options.id))) {
			this.searching(this.appId, this.searchInput.value, this.apptype,
					this.owner, this.currpage.pageNo - 1, 30);
		} else if (evt.target == this.nextPageHButton
				|| (evt.target.id == ("nextPageH" + this.options.id))) {
			this.searching(this.appId, this.searchInput.value, this.apptype,
					this.owner, this.currpage.pageNo + 1, 30);
		} else if (evt.target == this.lastPageHButton
				|| (evt.target.id == ("lastPageH" + this.options.id))) {
			this.searching(this.appId, this.searchInput.value, this.apptype,
					this.owner, this.currpage.allPagesCount, 30);
		} else if (evt.target == this.searchBtn
				|| evt.target.id == "searchAppBtn" + this.options.id) {
			if (this.searchInput.value != "") {
				this.searching(this.appId, this.searchInput.value,
						this.apptype, this.owner, 0, 30);
			} else {
				this.messageBox.show(4, "搜索对象不能为空，请输入一个搜索对象", false);
			}
			evt.preventDefault();
			return false;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new AppServiceStoreDialog(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);