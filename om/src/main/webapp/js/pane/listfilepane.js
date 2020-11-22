/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "listFilePane";
	var defaults = {
		id : "",
		ownerId : "",
		basicpropsheet : "",
		propsheet : "",
		width : 0,
		height : 0,
		parent : "",
	};

	var ListFilePane = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			basicpropsheet : "",
			propsheet : "",
			width : 0,
			height : 0,
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = new CommandStack();
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;

		this.currpage = null; // by default;
		this.objects = [];
		this.pagesize = 30;
		this.headersize = 0;

		this.init(options);
		this.createToolbar(options);
		this.loading();
	};

	ListFilePane.prototype.init = function(options) {
		var editorPanel = document.createElement("DIV");
		this.element.appendChild(editorPanel);
		editorPanel.style.margin = "0px";
		editorPanel.style.padding = "0px";
		editorPanel.style.overflow = "auto";
		editorPanel.id = "listPanel" + options.id;
		editorPanel.style.width = options.width + "px";

		this.toolbarRow = document.createElement("DIV");
		editorPanel.appendChild(this.toolbarRow);
		this.toolbarRow.className = "row";
		this.toolbarRow.style.margin = "0px";
		this.toolbarRow.style.padding = "0px";

		var painterRow = document.createElement("DIV");
		editorPanel.appendChild(painterRow);
		painterRow.className = "row";
		painterRow.style.margin = "0px";
		painterRow.style.padding = "0px";

		var tableDivPane = document.createElement("DIV");
		painterRow.appendChild(tableDivPane);
		tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		tableDivPane.id = "listFilePane" + options.id;
		tableDivPane.className = "table-responsive";
		tableDivPane.style.margin = "0px";
		tableDivPane.style.padding = "0px";
		tableDivPane.style.border = "1px solid #ddd";
		tableDivPane.style.height = (options.height - 45) + "px";
		tableDivPane.style.borderRadius = "4px";
		tableDivPane.style.overflowY = "auto";

		this.tableList = document.createElement("table");
		tableDivPane.appendChild(this.tableList);
		this.tableList.id = "filelist";
		this.tableList.className = "table table-striped table-hover";

	};

	ListFilePane.prototype.loading = function() {
		if (this.options.parent.loading != undefined) {
			this.options.parent.loading(this);
		}
	};

	ListFilePane.prototype.loadData = function(data) {
		if (data != null && data != "" && data != undefined) {
			this.fileconstants = [];
			this.filechildren = [];
			this.files = data.data;
			for (x in data.data) {
				var file = new FileConstant();
				if (x != "#") {
					file.name = data.data[x].text;
					file.id = data.data[x].id;
					file.parent = data.data[x].parent;
					file.children = data.data[x].children;
					var str = data.data[x].data;
					if (str != null) {
						var info = str.split("|");
						file.filetype = info[0]; // 文件类型 文件夹 or 文件
						file.size = info[1]; // 文件大小
						file.lastupdate = info[2]; // 修改日期
						file.path = info[3]; // 文件路径
						file.sufix = info[4].toLowerCase(); // 文件后缀
						file.operation = info[5]; // 文件操作级别
						this.filechildren.push(file);
						if (file.parent == "#") {
							this.fileconstants.push(file);
						}
					} else {
						messageDialog.show("您所在的组织或个人可能因封禁或其他原因,暂时无法进行本次操作");
						return;
					}
				}
			}
		}
		this.loadFiles(this.fileconstants);

	};

	ListFilePane.prototype.loadFiles = function(fileconstants) {// 初始加载文件
		this.lastDirItem.className = "disabled";
		$(this.tableList).children().remove();
		if (fileconstants != null && fileconstants.length > 0) {
			for (var i = 0; i < fileconstants.length; i++) {
				var currpath = this.filechildren[i].path;
				this.ppath = currpath.substring(0, currpath.lastIndexOf("\\"));
				if (this.options.parent != null) {
					this.options.parent.createCells(fileconstants[i]);
				}
			}
		}
		// this.initList(this.options);
		this.addListHeader(this.options);

	};

	ListFilePane.prototype.initList = function(options) {

		var row = this.tableList.insertRow(i);
		for (var j = 0; j < this.headersize; j++) {
			var cell1 = row.insertCell(j);
			cell1.innerHTML = "&nbsp;";
		}

	};

	ListFilePane.prototype.addListHeader = function(options) {
		var header = this.tableList.createTHead();
		var row = header.insertRow(0);
		if (this.options.parent != null)
			this.options.parent.createHeaders(row);

	};

	ListFilePane.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	ListFilePane.prototype.createCell = function(no, cellname, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		cell.innerHTML = cellname;
		cell.addEventListener("dblclick", this, false);
		return cell;
	};

	ListFilePane.prototype.createToolbar = function(options) {
		var toolbarForm = document.createElement("form");
		toolbarForm.className = "form-inline";
		this.toolbarRow.appendChild(toolbarForm);

		var toolbarDiv = document.createElement("DIV");
		toolbarForm.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		toolbarDiv.style.padding = "2px";
		this.createSearchGroup(toolbarDiv);
	};

	ListFilePane.prototype.createLabel = function(group, id, title) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.id = id;
		group.appendChild(label);
		return label;
	};

	ListFilePane.prototype.createSearchGroup = function(parent) {
		this.initHeader(this.options, parent);
	};

	ListFilePane.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	ListFilePane.prototype.crateSGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	ListFilePane.prototype.createTool = function(group, id, title, style,
			fonttag, fontclass) {
		var button = document.createElement("button");
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		group.appendChild(button);
		var icon = document.createElement(fonttag);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		button.appendChild(icon);
		return button;
	};

	ListFilePane.prototype.enableButton = function(button) {
		button.disabled = false;
	};

	ListFilePane.prototype.disableButton = function(button) {
		button.disabled = true;
	};

	ListFilePane.prototype.setPropertySheet = function(obj) {
		if (obj == null && this.objects != null && this.objects.length > 0) {
			obj = this.objects[0];
		}
		// basic property setting
		if (this.basicpropsheet != null) {
			this.basicpropsheet.tabId = this.options.id;
			this.basicpropsheet.setSheet(obj);
		}
		// advanced property setting.
		if (this.propsheet != null) {
			this.propsheet.tabId = this.options.id;
			this.propsheet.setSheet(obj);
		}
	};

	ListFilePane.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	ListFilePane.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {// 回车键
			evt.preventDefault();// 阻止该事件
			if (evt.target.value != "") {
				this.doNextPageAction(1);
				this.act = 6;
			}
			return false;
		}
	};

	ListFilePane.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			var child = evt.target;
			this.tableList.focus();
			if (child.parentElement != undefined
					&& child.parentElement.attributes.key != undefined
					&& child.parentElement.attributes.key.nodeValue != null) {
				this.pId = child.parentElement.attributes.key.nodeValue; // 获取父节点ID
				if (this.files[this.pId].data.indexOf("Directory") != -1) {
					this.loadFileChildren(this.pId);
					this.lastDirItem.className = "";
				} else {
					var fId = evt.target.parentElement.attributes.key.nodeValue;
					var path = this.files[fId].data.split("|")[3];
					var filename = this.files[fId].text;
					var url = omservices.downloadapi(1, this.options.ownerId);
					var fd = new FormData();
					fd.append('oid', this.options.ownerId);
					fd.append('path', path);
					fd.append('filename', filename);
					fd.append('fId', fId);
					var xhr = new XMLHttpRequest();
					xhr.responseType = 'blob';
					xhr.open('post', url, true);
					xhr.onreadystatechange = function(e) {

						if (xhr.readyState == 4 && xhr.status == 200) {
							var blob = xhr.response;
							if (blob.type == "application/json") {
								messageDialog
										.show("您所在的组织或个人可能因封禁等原因,暂时无法进行本次操作");
								window.location.reload();
							} else {
								var csvUrl = URL.createObjectURL(blob);
								var link = document.createElement('a');
								link.href = csvUrl;
								link.download = filename;
								link.click();
							}
						}
					}
					xhr.send(fd);
					// var form = $("<form></form>").attr("action",
					// url).attr("method",
					// "post");
					// form.append($("<input></input>").attr("type",
					// "hidden").attr(
					// "name", "oid").attr("value", this.options.ownerId));
					// form.append($("<input></input>").attr("type",
					// "hidden").attr(
					// "name", "path").attr("value", path));
					// form.append($("<input></input>").attr("type",
					// "hidden").attr(
					// "name", "filename").attr("value", filename));
					// form.appendTo('body').submit().remove();
				}
			}
		}
	};

	ListFilePane.prototype.doClick = function(evt) {
		if (evt.target.tagName == "SPAN" && evt.target.textContent == " 返回上一级") {
			if (evt.target.parentElement.parentElement.className = "disabled") {
				return false;
			} else {
				this.pId = this.files[this.pId].parent;
				if (this.pId == "#") {
					this.lastDirItem.className = "disabled";
					this.loadFiles(this.fileconstants);
				} else {
					this.loadFileChildren(this.pId);
				}
			}

		} else if (evt.target.tagName == "STRONG") {
			this.loadFiles(this.fileconstants);
		} else if (evt.target.textContent == " 上传文件") {
			this.o1.path = this.ppath;
			this.p.fileInput.click();
		}
	};

	ListFilePane.prototype.loadFileChildren = function(pId) {// 根据父文件ID查询其子文件
		var data = this.files[pId].data;
		if ((data != undefined && data.indexOf("Directory") != -1)
				|| pId == "#") {
			$(this.tableList).children().remove();
			this.ppath = data.split("|")[3];
			for (var i = 0; i < this.filechildren.length; i++) {
				if (this.filechildren[i].parent == pId) {
					if (this.options.parent != null) {
						this.options.parent.createCells(this.filechildren[i]);
					}
				}
			}
			this.addListHeader(this.options);
		}
	}

	ListFilePane.prototype.selectRow = function(id) {
		if (this.tableList.rows.length > 1) {
			for (var i = 0; i < this.tableList.rows.length; i++) {
				if (this.tableList.rows[i].getAttribute("key") == id) {
					this.tableList.rows[i].style.background = "#d1d1e0";
				}
			}
		}
		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].id == id) {
				this.setPropertySheet(this.objects[i]);
				break;
			}
		}
	};

	ListFilePane.prototype.clearProcessSheet = function(table) {
		if (table.rows.length > 0) {
			for (var i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
	};

	ListFilePane.prototype.initHeader = function(options, parent) {
		var menuNav = document.createElement("NAV");
		menuNav.className = "navbar navbar-default navbar-static-top";
		parent.appendChild(menuNav);

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
		titleA.setAttribute("target", "_blank");
		titleA.innerHTML = "<strong>" + "全部文件" + "</strong>";
		titleA.addEventListener("click", this, false);
		barheader.appendChild(titleA);

		var navbar = document.createElement("DIV");
		navbar.id = "navbar";
		navbar.className = "navbar-collapse collapse";
		mainbar.appendChild(navbar);

		var barUL = document.createElement("ul");
		barUL.className = "nav navbar-nav";
		navbar.appendChild(barUL);

		this.createDir = this.createMenuabarItem("newmodel", barUL,
				"glyphicon glyphicon-plus", "新建文件夹", 1);
		this.createDir.className = "disabled";

		this.o1 = new Object();
		this.o1.oid = this.options.ownerId;
		this.o1.fid = this.options.id;
		this.o1.path = "";
		var p = $(navbar).uploadPlugin({
			id : "", // plugin id
			url : omservices.uploadapi(2, this.options.ownerId), // uploading
			// arget url
			extpara : this.o1, // extra parameters for uploading
			actnow : "1", // if 1, dochange method will work
			filer : "", // image.* or image/gif, image/jpeg
			multiple : "0", // if 1, input will can select multiple files
			parent : this, // parent plugin

		});

		this.p = p.data("uploadPlugin");
		// this.p.element.className = "hide";
		this.p.fileInput.type = "file";
		this.p.fileInput.id = "file";
		this.p.fileInput.name = "file";
		this.p.fileInput.className = "hide";

		this.saveItem = this.createMenuabarItem("saveG", barUL,
				"glyphicon glyphicon-floppy-open", "上传文件", 1, "#");

		this.removeItem = this.createMenuabarItem("optionsG", barUL,
				"glyphicon glyphicon-trash", "删除", 1, "#");
		this.removeItem.className = "disabled";

		var barRightUL = document.createElement("ul");
		barRightUL.className = "nav navbar-nav navbar-right";
		navbar.appendChild(barRightUL);

		var barLiItem = document.createElement("li");
		barRightUL.appendChild(barLiItem);
		barLiItem.className = "dropdown";

		var barLiItemUl = document.createElement("UL");
		barLiItem.appendChild(barLiItemUl);
		barLiItemUl.className = "dropdown-menu";

		for (var i = 0; i < otherComponents.length; i++) {
			this.createDropdownItem(otherComponents[i].name, barLiItemUl,
					otherComponents[i].url);
		}

		this.lastDirItem = this.createMenuabarItem("lastfile", barRightUL,
				"glyphicon glyphicon-chevron-left", "返回上一级", 1, ""
						+ options.user);
		this.lastDirItem.className = "disabled";
	};

	ListFilePane.prototype.complete = function(f, loaded, total, data, child) {
		this.options.parent.options.parent.treeViewer.refreshButton.click();// 刷新树
	};

	ListFilePane.prototype.deleteFile = function(path, treeViewer) {
		// var that = this;
		// $.post(omservices.uploadapi(4, this.options.ownerId), {
		// 	oid : this.options.ownerId,
		// 	path : path,
		// }).complete(
		// 		function(data) {
		// 			data = data.responseJSON;
		// 			if (data.status != null && data.status != ""
		// 					&& data.status != undefined) {
		// 				if (data.status == 0 || data.status == -10) {
		// 					messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
		// 					window.location.reload();
		// 				}
		// 			}
		// 			if (data.status == "1") {
		// 				treeViewer.refreshButton.click();
		// 			}
		//
		// 		});
	};

	ListFilePane.prototype.createMenuabarItem = function(id, parent, icon,
			title, type, url) {
		var barLiItem = document.createElement("li");
		barLiItem.id = id;
		parent.appendChild(barLiItem);
		var liA = document.createElement("a");
		liA.setAttribute("href", "#");
		barLiItem.appendChild(liA);

		var iconSpan = document.createElement("span");
		iconSpan.className = icon;
		iconSpan.addEventListener("click", this, false);
		liA.appendChild(iconSpan);
		var itemTitle = document.createElement("span");
		itemTitle.style.fontSize = "16px";
		itemTitle.addEventListener("click", this, false);
		itemTitle.innerHTML = " " + title;
		liA.appendChild(itemTitle);
		return barLiItem;

	};

	ListFilePane.prototype.createDropdownItem = function(name, parent, url) {
		var barLiItemLi = document.createElement("li");
		parent.appendChild(barLiItemLi);
		var barLiItemLiA = document.createElement("A");
		barLiItemLi.appendChild(barLiItemLiA);
		barLiItemLiA.setAttribute("href", url);
		barLiItemLiA.setAttribute("target", "_blank");
		barLiItemLiA.innerHTML = name;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ListFilePane(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);
