/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "buyhireServiceDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
		topparent : "",
	};

	var ServiceStoreDialog = function(element, options) {
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

	ServiceStoreDialog.prototype.init = function(options) {
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
		infoIcon.className = "glyphicon glyphicon-shopping-cart";
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
		this.saveButton.innerHTML = "下载";
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

	ServiceStoreDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		parent.appendChild(form);
		form.className = "form-horizontal";

		// search row
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
		this.searchInput.setAttribute("placeholder", "在应用商店中搜索可用的SaaS应用服务...");
		this.searchInput.name = "entityname";
		this.searchInput.className = "form-control";
		this.searchInput.id = "entityname";
		this.searchInput.addEventListener("keydown", this, false);

		var searchSpan = document.createElement("span");
		group.appendChild(searchSpan);
		searchSpan.className = "input-group-btn";
		
		this.searchBtn = this.createTool(searchSpan, "searchAppBtn"
				+ this.options.id, "搜索 ", "btn btn-primary", "i",
				"fa fa-search fa-lg");

		// search result row
		var searchResultContainer = document.createElement("div");
		parent.appendChild(searchResultContainer);

		var searchResultRowDiv = document.createElement("div");
		searchResultContainer.appendChild(searchResultRowDiv);
		searchResultRowDiv.className = "row";

		this.restultDiv = document.createElement("DIV");
		searchResultRowDiv.appendChild(this.restultDiv);
		this.restultDiv.className = "col-sm-8";
		this.restultDiv.style.overflowY = "auto";
		this.restultDiv.style.overflowX = "auto";
		this.restultDiv.style.height = "500px";

		this.testRightDiv = document.createElement("div");
		searchResultRowDiv.appendChild(this.testRightDiv);
		this.testRightDiv.className = "col-sm-4";
		this.testRightDiv.style.overflowY = "auto";
		this.testRightDiv.style.overflowX = "auto";
		this.testRightDiv.style.height = "500px";
		
		var navRowDiv = document.createElement("div");
		searchResultContainer.appendChild(navRowDiv);
		navRowDiv.className = "row";
		
		var searchColDiv = document.createElement("div");
		navRowDiv.appendChild(searchColDiv);
		searchColDiv.className = "col-sm-6";

		var navbarDiv = document.createElement("DIV");
		searchColDiv.appendChild(navbarDiv);
		navbarDiv.style.margin = "0px";
		navbarDiv.style.padding = "2px";
		this.createNavigationGroup(navbarDiv);
		
		var operationColDiv = document.createElement("div");
		navRowDiv.appendChild(operationColDiv);
		operationColDiv.className = "col-sm-6";
		
		var opbarDiv = document.createElement("DIV");
		operationColDiv.appendChild(opbarDiv);
		opbarDiv.style.margin = "0px";
		opbarDiv.style.padding = "2px";	
		
		var radioLabel1 = document.createElement("LABEL");
		opbarDiv.appendChild(radioLabel1);
		radioLabel1.className = "radio-inline";
		
		this.opRadio1 = document.createElement("input");
		radioLabel1.appendChild(this.opRadio1);
		this.opRadio1.type = "radio";
		this.opRadio1.name = "operation";
		//this.opRadio1.addEventListener("click", this, false);
		this.opRadio1.disabled = true;
		this.opRadio1.checked = true;
		
		radioLabel1.appendChild(document.createTextNode("我要修改该服务"));

		var radioLabel2 = document.createElement("LABEL");
		opbarDiv.appendChild(radioLabel2);
		radioLabel2.className = "radio-inline";
		
		this.opRadio2 = document.createElement("input");
		radioLabel2.appendChild(this.opRadio2);
		this.opRadio2.type = "radio";
		this.opRadio2.name = "operation";
		//this.opRadio2.addEventListener("click", this, false);
		this.opRadio2.disabled = true;
		
		radioLabel2.appendChild(document.createTextNode("不要修改该服务"));

		var dialog = $(parent).alertBox({
			id : this.options.id,
		});
		this.messageBox = dialog.data("alertBox");
	};

	ServiceStoreDialog.prototype.createTool = function(group, id, title,
			style, fonttag, fontclass) {
		var button = document.createElement("button");
		group.appendChild(button);
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		var icon = document.createElement(fonttag);
		button.appendChild(icon);
		icon.addEventListener('click', this, false);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		return button;
	};

//	ServiceStoreDialog.prototype.setProcess = function(id, owner) {
//		this.procId = id;
//		this.owner = owner;
//		if (id != undefined && id != null && id != "") {
//			this.searching(this.procId, this.procId, this.owner, 0, 30);
//		}
//	};

	ServiceStoreDialog.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {
			if (evt.target.value != "") {
				this.searching(this.procId, evt.target.value, this.owner,
								0, 30);
			} else {
				this.messageBox.show(4, "搜索对象不能为空，请输入一个搜索对象", false);
			}
			evt.preventDefault();
			return false;
		}
	};

	ServiceStoreDialog.prototype.searching = function(id, condition,
			owner, pageno, pagesize) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(19), {
			pid : id,// process id
			cond : condition,// search
			ownerid : owner,// organization id
			pageno : pageno,
			pagesize : pagesize,
		}).complete(function(data) {
			that.loadData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	ServiceStoreDialog.prototype.loadData = function(json) {
		if (json == null) {
			return;
		}
		$(this.restultDiv).children().remove();
		if (json.pageEntities != null && json.pageEntities.length == 0) {
			var entiyDiv = document.createElement("DIV");
			this.restultDiv.appendChild(entiyDiv);
			entiyDiv.innerHTML = "抱歉，没有搜索到符合条件的SaaS应用服务。";
			return;
		}
		for (var i = 0; i < json.pageEntities.length; i++) {
			if (json.pageEntities[i] != null) {
				var entiyDiv = document.createElement("DIV");
				this.restultDiv.appendChild(entiyDiv);
				entiyDiv.className = "radio";

				var radioLabel = document.createElement("LABEL");
				entiyDiv.appendChild(radioLabel);
				
				var appRadio = document.createElement("input");
				radioLabel.appendChild(appRadio);
				appRadio.type = "radio";
				appRadio.name = "proc";
				appRadio.id = json.pageEntities[i].id;
				appRadio.setAttribute("procname", json.pageEntities[i].procName);
				appRadio.setAttribute("purchasePrice",json.pageEntities[i].purchasePrice);
				appRadio.setAttribute("usagePrice",json.pageEntities[i].usagePrice);
				appRadio.value = json.pageEntities[i].id;
				appRadio.setAttribute("title", "请点击这里以选择该SaaS应用服务。");
				var that = this;
				
				appRadio.addEventListener("click", function() {
					that.opRadio1.disabled = false;
					that.opRadio2.disabled = false;
					that.enableButton(that.saveButton);
				});
				var titleH3 = document.createElement("STRONG");
				radioLabel.appendChild(titleH3);
				titleH3.style.color = "blue";
				titleH3.innerHTML = json.pageEntities[i].procName + " ";
				titleH3.innerHTML += (json.pageEntities[i].version != null
						&& json.pageEntities[i].version.trim() != "" ? "("
						+ json.pageEntities[i].version + ") " : " ");

				var commentDiv = document.createElement("DIV");
				entiyDiv.appendChild(commentDiv);
				commentDiv.innerHTML = Utils
						.getDateTime(json.pageEntities[i].lastupdate)
						+ "更新 - 简介："
						+ (json.pageEntities[i].description != null
								&& json.pageEntities[i].description.trim() != "" ? json.pageEntities[i].description
								: "无");

				var commentDiv1 = document.createElement("DIV");
				entiyDiv.appendChild(commentDiv1);
				commentDiv1.innerHTML = (json.pageEntities[i].releaseDate == null ? ""
						: (Utils.getDateTime(json.pageEntities[i].releaseDate) + "发布 - 公告："))
						+ (json.pageEntities[i].releaseStatement != null
								&& json.pageEntities[i].releaseStatement.trim() != "" ? json.pageEntities[i].releaseStatement
								: "无");

				var discussionDiv = document.createElement("DIV");
				entiyDiv.appendChild(discussionDiv);

				// star level
				var starsDiv = document.createElement("SPAN");
				discussionDiv.appendChild(starsDiv);

				var starDiv1 = document.createElement("SPAN");
				starsDiv.appendChild(starDiv1);
				starDiv1.className = "glyphicon glyphicon-star";

				var starDiv2 = document.createElement("SPAN");
				starsDiv.appendChild(starDiv2);
				starDiv2.className = "glyphicon glyphicon-star";

				var starDiv3 = document.createElement("SPAN");
				starsDiv.appendChild(starDiv3);
				starDiv3.className = "glyphicon glyphicon-star";

				var starDiv4 = document.createElement("SPAN");
				starsDiv.appendChild(starDiv4);
				starDiv4.className = "glyphicon glyphicon-star-empty";

				var starDiv5 = document.createElement("SPAN");
				starsDiv.appendChild(starDiv5);
				starDiv5.className = "glyphicon glyphicon-star-empty";

				var refDiv = document.createElement("SPAN");
				discussionDiv.appendChild(refDiv);
				refDiv.innerHTML = " 引用量：" + 1000 + " ";

				var useDiv = document.createElement("SPAN");
				discussionDiv.appendChild(useDiv);
				useDiv.innerHTML = " 成功率：" + 99.98 + "% ";

				var likeDiv = document.createElement("SPAN");
				discussionDiv.appendChild(likeDiv);
				likeDiv.innerHTML = " 获赞：" + 2300 + " ";

				var respDiv = document.createElement("SPAN");
				discussionDiv.appendChild(respDiv);
				respDiv.innerHTML = " 售价："
						+ (parseFloat(json.pageEntities[i].purchasePrice) == 0 ? "免费"
								: "￥" + json.pageEntities[i].purchasePrice)
						+ " ";

				var priceDiv = document.createElement("SPAN");
				discussionDiv.appendChild(priceDiv);
				priceDiv.innerHTML = " 使用价格："
						+ (parseFloat(json.pageEntities[i].usagePrice) == 0 ? "免费"
								: "￥" + json.pageEntities[i].usagePrice) + " ";

				var devDiv = document.createElement("DIV");
				entiyDiv.appendChild(devDiv);
				devDiv.innerHTML = "开发商：" + json.pageEntities[i].orgName;

				if (json.pageEntities[i].appType == "2") {
					this.loadAPIs(json.pageEntities[i], entiyDiv);
				}
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

	ServiceStoreDialog.prototype.createNavigationGroup = function(parent) {
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

	ServiceStoreDialog.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	ServiceStoreDialog.prototype.createLabel = function(group, id, title) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.id = id;
		group.appendChild(label);
		return label;
	};

	ServiceStoreDialog.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	ServiceStoreDialog.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	ServiceStoreDialog.prototype.show = function() {
		$(this.restultDiv).children().remove();
		this.opRadio1.disabled = true;
		this.opRadio2.disabled = true;
		this.disableButton(this.saveButton);
		 checked=false
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	ServiceStoreDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	ServiceStoreDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	ServiceStoreDialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		
		if (evt.target == this.saveButton
				|| evt.target.id == "OKButton" + this.options.id) {
			var proc=$("input[name=proc]:checked");
			if (this.opRadio1.checked) {
				this.options.parent.doBuyHireAction(proc.val(), 1, 1);
			}
			if (this.opRadio2.checked) {
				this.options.parent.doBuyHireAction(proc.val(), 1, 0);
			}
		} else if (evt.target == this.firstPageHButton
				|| (evt.target.id == ("firstPageH" + this.options.id))) {
			this.searching(this.appId, this.searchInput.value, this.owner, 0,
					30);
		} else if (evt.target == this.previousPageHButton
				|| (evt.target.id == ("previousPageH" + this.options.id))) {
			this.searching(this.appId, this.searchInput.value, this.owner,
					this.currpage.pageNo - 1, 30);
		} else if (evt.target == this.nextPageHButton
				|| (evt.target.id == ("nextPageH" + this.options.id))) {
			this.searching(this.appId, this.searchInput.value, this.owner,
					this.currpage.pageNo + 1, 30);
		} else if (evt.target == this.lastPageHButton
				|| (evt.target.id == ("lastPageH" + this.options.id))) {
			this.searching(this.appId, this.searchInput.value, this.owner,
					this.currpage.allPagesCount, 30);
		} else if (evt.target == this.searchBtn
				|| evt.target.id == "searchAppBtn" + this.options.id) {
			if (this.searchInput.value != "") {
				this.searching(this.appId, this.searchInput.value, this.owner,
						0, 30);
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
				$.data(this, pluginName, new ServiceStoreDialog(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);