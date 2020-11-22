/**
 * 
 */
var map = {};
;
(function($, window, document, undefined) {
	var pluginName = "mainContent";
	var defaults = {
		id : "",
		uid : "",
		uname : "",
	};

	var MainContent = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			uid : "",
			uname : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.basicpropertySheets = null; // basic property setter;
		this.propertySheets = null; // advanced property setter;
		this.init(options);
		this.currentProcID = -1;
		this.menubar = null;

	};

	MainContent.prototype.init = function(options) {
		if ($(this.element).mainContentPlugin != undefined) {
			var p4 = $(this.element).mainContentPlugin({
				id : options.id,
				name : "admin",
				uid : options.uid,
				parent : this,
			});
			this.mainContentPlugin = p4.data("mainContentPlugin");
		}
	};

	MainContent.prototype.loadTreeViewer = function(parent) {
		var that = this;
		var instance = $(parent).jstree({
			"core" : {
				// so that create works
				"multiple" : false,
				// "themes": {"dots": false},
				"check_callback" : true,
				"data" : {
					"url" : service.api(0),
					"dataType" : "json"
				}
			},
			"plugins" : [ "contextmenu", "dnd" ],
			"contextmenu" : {
				'items' : that.customMenu,
			}
		}).on('create_node.jstree', function(e, data) {
		}).on('select_node.jstree', function(e, data) {
		}).on('load_node.jstree', function(e, data) {
			$(instance).jstree('open_all');
			that.mainContentPlugin.loadfromStorage(that);
		}).on("dblclick.jstree", this.dblclickJSTree);

	};

	MainContent.prototype.customMenu = function(node) {
		var arry = node.data.split("|");
		var items = {
			"open" : {
				"label" : "打开",
				"action" : function(obj) {
					window.main.openOneEditor(node);
				},
			},
		}
		if (arry[0] == "2") {
			var instance = $('#treeview').jstree(true);
			var leaf = instance.is_leaf(node);
			if (arry[0] == "2" && !leaf) {
				delete items.open;
			}
		}
		return items;
	};

	MainContent.prototype.dblclickJSTree = function(e) {
		e.preventDefault();
		var instance = $('#treeview').jstree(true);
		var sel = instance.get_selected(true)[0];
		if (sel != null) {
			// var leaf = instance.is_leaf(sel);
			var arry = sel.data.split("|");
			if (arry[0] == "1" || (arry[0] == "2" && arry[2] != "109")
					|| arry[0] == "3") {
				window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
						arry[1], arry[0]);
				window.main.savePrefer(sel.id);
			}
		}
	};

	MainContent.prototype.savePrefer = function(id) {
		prefer.admin.addId(id);
		var s = JSON.stringify(prefer);
		if (typeof (Storage) !== undefined) {
			var userId = localStorage.getItem("userId");
			localStorage.setItem(userId, s);
		}
	};

	MainContent.prototype.openEditor = function(eid, i) {
		if (eid != null && eid != "") {
			// $('#treeview').jstree('deselect_all', true);
			//var d = $('#treeview').jstree('get_node', eid);
			var instance = $('#treeview').jstree(true);
			var s = instance.select_node(eid);
			var sel = instance.get_selected(true)[i];
			if (sel != null) {
				// var leaf = instance.is_leaf(sel);
				var arry = sel.data.split("|");
				if (arry[0] == "1" || (arry[0] == "2" && arry[2] != "109")
						|| arry[0] == "3") {
					window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
							arry[1], arry[0]);
					window.main.savePrefer(sel.id);
				}
			}
		}
	};

	MainContent.prototype.openOneEditor = function(node) {
		var arry = node.data.split("|");
		window.main.mainContentPlugin.addNewTab(node.text, node.id, arry[1],
				arry[0]);
		window.main.savePrefer(node.id);
	}

	MainContent.prototype.doYesAction = function(e, type, pid, orgid) {
		this.mainContentPlugin.confirmInfoDialog.hide();
		// if (type == 1) { // process modify
		// 	this.saveChange(1, this);
		// } else if (type == 2) { // process deletion
		// 	// close process
		// 	this.removeTab(pid);
		// 	$("#progressbar").show();
		// 	// delete process
		// 	$.post(service.api(15), {
		// 		id : pid,
		// 		oid : orgid,
		// 	}).complete(function(data) {
		// 		$("#progressbar").hide();
		// 	});
		// 	// remove a node.
		// 	instance = $('#treeview').jstree();
		// 	var p = instance.get_selected(true)[0];
		// 	$('#treeview').jstree('delete_node', p);
		// }
	};

	MainContent.prototype.doNoAction = function(e, type, pid) {
		this.mainContentPlugin.confirmInfoDialog.hide();
		// if (type == 1) { // process modify
		// 	this.removeTab(pid);
		// } else if (type == 2) { // process deletion
		// 	// nothing...
		// 	this.removeTab(pid);
		// }
	};

	MainContent.prototype.removeTab = function(pid) {
		var that = this;
		$(".main-nav-tabs").children('li').each(function(entry) {
			var anchor = $(this).children("a")[0];
			var id = $(anchor).attr('href').substring(5);// #tab_000002A8AS
			if (pid == id) {
				that.cloaseTab(id, anchor);
			}
		});
	};

	MainContent.prototype.doSaveAction = function() {
		this.mainContentPlugin.saveChange(0, this);
	};

	MainContent.prototype.doCreateNewAction = function() {
		this.createModelDialog.show();
	};

	MainContent.prototype.saveObjects = function(id, anchor, closetab) {
		// var that = this;
		// $("#progressbar").show();
		// var cmd = 0;
		// if (map[id].currObject instanceof News) { //保存新闻
		// cmd = 11;
		// }
		// var currObject = JSON.stringify(map[id].currObject);
		// $.post(service.api(cmd), {
		// currObject : currObject,
		// }, function(data) {
		// if (data.status == 1) {
		// map[id].stack.save();
		// alert("保存成功")
		// $("#progressbar").hide();
		// } else {
		// $("#progressbar").hide();
		// alert("保存失败")
		// }
		// });
	};

	// myTabTitle: tab title, myTabID: released process ID, myOwnerID:
	// organization ID.
	MainContent.prototype.addNewTabForRPI = function(myTabTitle,
			myTabID, myOwnerID) {
		if (map[myTabID] == undefined || map[myTabID] == null) {
			var tabheader = document.createElement("li");
			tabheader.setAttribute('role', 'presentation');
			var tablink = document.createElement("a");
			tablink.setAttribute('href', '#tab_' + myTabID + '');
			tablink.setAttribute('aria-controls', '#tab_' + myTabID + '');
			tablink.setAttribute('role', 'tab');
			tablink.setAttribute('data-toggle', 'tab');

			var tabTitle = document.createElement("text");
			tabTitle.innerHTML = "<font color='green'><b>" + myTabTitle
					+ "</b></font>" + "&nbsp;&nbsp;";
			tablink.appendChild(tabTitle);

			var tabCloseSpan = document.createElement("span");
			tabCloseSpan.className = "glyphicon glyphicon-remove";
			tabCloseSpan.style.color = "red";
			tabCloseSpan.setAttribute("data", myTabID);
			tablink.appendChild(tabCloseSpan);

			tabheader.appendChild(tablink);
			$('#myTab').append(tabheader);

			var tabcontent = document.createElement("DIV");
			tabcontent.setAttribute('role', 'tabpanel');
			tabcontent.className = "tab-pane";
			tabcontent.id = "tab_" + myTabID;
			if ($(tabcontent).adminAppEditor != undefined) {
				var p = $(tabcontent)
						.runtimeWfProcessEditor(
								{
									id : myTabID,
									basicpropsheet : this.mainContentPlugin.basicpropertySheets,
									propsheet : this.mainContentPlugin.propertySheets,
									owner : myOwnerID,
									width : this.mainContentPlugin.tabsWidth,
									height : this.mainContentPlugin.tabsHeight,
								});
				tabcontent.setAttribute("data", myTabID);
				map[myTabID] = p.data("runtimeWfProcessEditor");
			}
			$("#tabcontents").append(tabcontent);
		}
		$('.main-nav-tabs a[href="#tab_' + myTabID + '"]').tab('show');

	};

	// myTabTitle: tab title, myTabID: process ID, myOwnerID: organization ID.
	MainContent.prototype.addNewTab = function(tabcontent, myTabTitle, myTabID,
			myOwnerID, type) {
		if (type == "1") {
			if ($(tabcontent).adminAllEditor != undefined) {
				var p = $(tabcontent)
						.adminAllEditor(
								{
									id : myTabID,
									uid : this.options.uid,
									basicpropsheet : this.mainContentPlugin.basicpropertySheets,
									propsheet : this.mainContentPlugin.propertySheets,
									owner : myOwnerID,
									width : this.mainContentPlugin.tabsWidth,
									height : this.mainContentPlugin.tabsHeight,
									topparent: this,
								});
				tabcontent.setAttribute("data", myTabID);
				map[myTabID] = p.data("adminAllEditor");
			}
		} else if (type == "3") {
			if ($(tabcontent).adminAppEditor != undefined) {
				var p = $(tabcontent)
						.adminAppEditor(
								{
									id : myTabID,
									uid : this.options.uid,
									basicpropsheet : this.mainContentPlugin.basicpropertySheets,
									propsheet : this.mainContentPlugin.propertySheets,
									owner : myOwnerID,
									width : this.mainContentPlugin.tabsWidth,
									height : this.mainContentPlugin.tabsHeight,
									topparent : this,
								});
				tabcontent.setAttribute("data", myTabID);
				map[myTabID] = p.data("adminAppEditor");
			}
		} else if (type == "2") {
			instance = $('#treeview').jstree();
			var sel = instance.get_selected(true)[0];
			var arry = sel.data.split("|");
			var root = instance.get_node("#");
			var children = root.children;
			for (var i = 0; i < children.length; i++) {
				if (children[i] == myOwnerID) {
					var ch = instance.get_node(myOwnerID);
					orgName = ch.text;
					orgId = ch.id;
					break;
				}
			}
			console.log(arry[2]);
			if (arry[2] == "114") {// 新闻发布审核
				if ($(tabcontent).adminNewsApproval != undefined) {
					var p = $(tabcontent)
							.adminNewsApproval(
									{
										id : myTabID,
										userId : this.options.uid,
										userfullname : this.options.uname,
										ownername : orgName,
										basicpropsheet : this.mainContentPlugin.basicpropertySheets,
										propsheet : this.mainContentPlugin.propertySheets,
										owner : myOwnerID,
										width : this.mainContentPlugin.tabsWidth,
										height : this.mainContentPlugin.tabsHeight,
										parent : this,
									});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("adminNewsApproval");
				}
			} else if (arry[2] == "115") {// 组织注册审核
				if ($(tabcontent).omOrgApprovalEditor != undefined) {
					var p = $(tabcontent)
							.omOrgApprovalEditor(
									{
										id : myTabID,
										basicpropsheet : this.mainContentPlugin.basicpropertySheets,
										propsheet : this.mainContentPlugin.propertySheets,
										owner : myOwnerID,
										width : this.mainContentPlugin.tabsWidth,
										height : this.mainContentPlugin.tabsHeight,
									});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("omOrgApprovalEditor");
				}
			} else if (arry[2] == "146") {// 发票审核
				if ($(tabcontent).fmRlFormEditor != undefined) {
					var p = $(tabcontent)
						.invoiceEditor(
							{
								id : myTabID,
								owner : myOwnerID,
								userId : this.options.uid,
								userfullname : this.options.uname,
								ownername : orgName,
								basicpropsheet : this.mainContentPlugin.basicpropertySheets,
								propsheet : this.mainContentPlugin.propertySheets,
								ownerId : myOwnerID,
								width : this.mainContentPlugin.tabsWidth,
								height : this.mainContentPlugin.tabsHeight,
								parent : "",
							});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("invoiceEditor");
				}

			}else if (arry[2] == "123") {// 应用发布审核
				if ($(tabcontent).pmRlWfProcessEditor != undefined) {
					var p = $(tabcontent)
							.pmRlWfProcessEditor(
									{
										id : myTabID,
										owner : myOwnerID,
										userId : this.options.uid,
										userfullname : this.options.uname,
										ownername : orgName,
										basicpropsheet : this.mainContentPlugin.basicpropertySheets,
										propsheet : this.mainContentPlugin.propertySheets,
										width : this.mainContentPlugin.tabsWidth,
										height : this.mainContentPlugin.tabsHeight,
										parent : "",
									});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("pmRlWfProcessEditor");
				}

			} else if (arry[2] == "124") {// 表单发布审核
				if ($(tabcontent).fmRlFormEditor != undefined) {
					var p = $(tabcontent)
							.fmRlFormEditor(
									{
										id : myTabID,
										owner : myOwnerID,
										userId : this.options.uid,
										userfullname : this.options.uname,
										ownername : orgName,
										basicpropsheet : this.mainContentPlugin.basicpropertySheets,
										propsheet : this.mainContentPlugin.propertySheets,
										ownerId : myOwnerID,
										width : this.mainContentPlugin.tabsWidth,
										height : this.mainContentPlugin.tabsHeight,
										parent : "",
									});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("fmRlFormEditor");
				}

			} else if (arry[2] == "125") {// 微服务发布审核
				if ($(tabcontent).amWebAppServiceEditor != undefined) {
					var p = $(tabcontent)
							.amWebAppServiceEditor(
									{
										id : myTabID,
										owner : myOwnerID,
										userId : this.options.uid,
										userfullname : this.options.uname,
										ownername : orgName,
										basicpropsheet : this.mainContentPlugin.basicpropertySheets,
										propsheet : this.mainContentPlugin.propertySheets,
										ownerId : myOwnerID,
										width : this.mainContentPlugin.tabsWidth,
										height : this.mainContentPlugin.tabsHeight,
										parent : "",
									});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("amWebAppServiceEditor");
				}

			} else if (arry[2] == "126") {// 新闻发布
				if ($(tabcontent).adminNewsList != undefined) {
					var p = $(tabcontent)
							.adminNewsList(
									{
										id : myTabID,
										userId : this.options.uid,
										userfullname : this.options.uname,
										ownername : orgName,
										basicpropsheet : this.mainContentPlugin.basicpropertySheets,
										propsheet : this.mainContentPlugin.propertySheets,
										owner : myOwnerID,
										width : this.mainContentPlugin.tabsWidth,
										height : this.mainContentPlugin.tabsHeight,
										parent : this,
									});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("adminNewsList");
				}

			} else if (arry[2] == "127") {// 系统通知
				var p = $(tabcontent)
						.systemNoticeViewEditor(
								{
									id : myTabID,
									uid : this.options.uid,
									basicpropsheet : this.mainContentPlugin.basicpropertySheets,
									propsheet : this.mainContentPlugin.propertySheets,
									owner : myOwnerID,
									width : this.mainContentPlugin.tabsWidth,
									height : this.mainContentPlugin.tabsHeight,
									parent : this,
								});
				tabcontent.setAttribute("data", myTabID);
				map[myTabID] = p.data("systemNoticeViewEditor");
			} else if (arry[2] == "128") {// 手机APP微服务发布审核
				if ($(tabcontent).adminMobileAppMSApproval != undefined) {
					var p = $(tabcontent)
						.adminMobileAppMSApproval(
							{
								id: myTabID,
								owner: myOwnerID,
								userId: this.options.uid,
								userfullname: this.options.uname,
								ownername: orgName,
								basicpropsheet: this.mainContentPlugin.basicpropertySheets,
								propsheet: this.mainContentPlugin.propertySheets,
								ownerId: myOwnerID,
								width: this.mainContentPlugin.tabsWidth,
								height: this.mainContentPlugin.tabsHeight,
								parent: "",
							});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("adminMobileAppMSApproval");
				}
			}else if (arry[2] == "141") {// 视频
				if ($(tabcontent).videoListEditor != undefined) {
					var p = $(tabcontent)
						.videoListEditor(
							{
								id: myTabID,
								owner: myOwnerID,
								userId: this.options.uid,
								userfullname: this.options.uname,
								ownername: orgName,
								basicpropsheet: this.mainContentPlugin.basicpropertySheets,
								propsheet: this.mainContentPlugin.propertySheets,
								ownerId: myOwnerID,
								width: this.mainContentPlugin.tabsWidth,
								height: this.mainContentPlugin.tabsHeight,
								parent: "",
							});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("videoListEditor");
				}
			}else if (arry[2] == "142") {// 电子书
				if ($(tabcontent).bookListEditor != undefined) {
					var p = $(tabcontent)
						.bookListEditor(
							{
								id: myTabID,
								owner: myOwnerID,
								userId: this.options.uid,
								userfullname: this.options.uname,
								ownername: orgName,
								basicpropsheet: this.mainContentPlugin.basicpropertySheets,
								propsheet: this.mainContentPlugin.propertySheets,
								ownerId: myOwnerID,
								width: this.mainContentPlugin.tabsWidth,
								height: this.mainContentPlugin.tabsHeight,
								parent: "",
							});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("bookListEditor");
				}
			}else if (arry[2] == "143") {// 直播
				if ($(tabcontent).liveListEditor != undefined) {
					var p = $(tabcontent)
						.liveListEditor(
							{
								id: myTabID,
								owner: myOwnerID,
								userId: this.options.uid,
								userfullname: this.options.uname,
								ownername: orgName,
								basicpropsheet: this.mainContentPlugin.basicpropertySheets,
								propsheet: this.mainContentPlugin.propertySheets,
								ownerId: myOwnerID,
								width: this.mainContentPlugin.tabsWidth,
								height: this.mainContentPlugin.tabsHeight,
								parent: "",
							});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("liveListEditor");
				}
			}else if (arry[2] == "144") {// 音频
				if ($(tabcontent).audioListEditor != undefined) {
					var p = $(tabcontent)
						.audioListEditor(
							{
								id: myTabID,
								owner: myOwnerID,
								userId: this.options.uid,
								userfullname: this.options.uname,
								ownername: orgName,
								basicpropsheet: this.mainContentPlugin.basicpropertySheets,
								propsheet: this.mainContentPlugin.propertySheets,
								ownerId: myOwnerID,
								width: this.mainContentPlugin.tabsWidth,
								height: this.mainContentPlugin.tabsHeight,
								parent: "",
							});
					tabcontent.setAttribute("data", myTabID);
					map[myTabID] = p.data("audioListEditor");
				}
			}else if (arry[2] == "132") {// 帮助
				var p = $(tabcontent).systemHelpViewEditor(
						{
							id : myTabID,
							owner : myOwnerID,
							uid : this.options.uid,
							userfullname : this.options.uname,
							ownername : orgName,
							basicpropsheet : this.mainContentPlugin.basicpropertySheets,
							ownerId : myOwnerID,
							width : this.mainContentPlugin.tabsWidth,
							height : this.mainContentPlugin.tabsHeight,
							parent : "",
						});
		tabcontent.setAttribute("data", myTabID);
		map[myTabID] = p.data("systemHelpViewEditor");
	}
		} else if (type == "newsDetails") { // 打开新的标签页，查看新闻详情
			var p = $(tabcontent).adminNewsDetails({
				id : myTabID,
				basicpropsheet : this.mainContentPlugin.basicpropertySheets,
				propsheet : this.mainContentPlugin.propertySheets,
				owner : myOwnerID,
				width : this.mainContentPlugin.tabsWidth,
				height : this.mainContentPlugin.tabsHeight,
			});
			tabcontent.setAttribute("data", myTabID);
			map[myTabID] = p.data("adminNewsDetails");
		} else if (type == "addNews") { // 打开新的标签页，新建新闻
			var news = new News();
			var instance = $('#treeview').jstree(true);
			var root = instance.get_node("#");
			var children = root.children;
			for (var i = 0; i < children.length; i++) {
				if (children[i] == myOwnerID) {
					var ch = instance.get_node(myOwnerID);
					orgName = ch.text;
					orgId = ch.id;
					break;
				}
			}
			news.id = myTabID;
			news.publisherId = this.options.uid;
			news.publisherName = this.options.uname;
			news.organizationId = orgId;
			news.organizationName = orgName;
			news.lastUpdate = (new Date()).valueOf();// 获取long型时间

			var p = $(tabcontent).adminAddNews({
				id : myTabID,
				news : news,
				basicpropsheet : this.mainContentPlugin.basicpropertySheets,
				propsheet : this.mainContentPlugin.propertySheets,
				owner : myOwnerID,
				width : this.mainContentPlugin.tabsWidth,
				height : this.mainContentPlugin.tabsHeight,
			});
			tabcontent.setAttribute("data", myTabID);
			var p1 = p.data("adminAddNews");
			// p1.loading(news);
			map[myTabID] = p1;
		}
		$("#tabcontents").append(tabcontent);

	};

	MainContent.prototype.doAutoResizeForAdPTabs = function(h, id) {
		// var t = document.getElementById("tablediv" + id);
		// if (t != null) {
		// t.style.height = "200px";
		// }
	};

	MainContent.prototype.doAutoResizeForEditorTabs = function(w, h, id) {
		var p = document.getElementById("accordion" + id);
		var t = document.getElementById("convasPane" + id);
		var t1 = document.getElementById("canvasPanel" + id);
		var t5 = document.getElementById("adminPanel" + id);
		var t4 = document.getElementById("canvasPanelRL" + id);
		if (p != null) {
			// pallette
			p.style.height = (h - 84) + "px";
		}
		if (t != null) {
			t.style.height = (h - 84) + "px";
		}
		if (t1 != null) {
			t1.style.width = (w - 76) + "px";
		}
		if (t4 != null) {
			t4.style.height = w + "px";
		}
		if (t5 != null) {
			t5.style.width = w + "px";
		}
		var t7 = document.getElementById("listPanel" + id);
		if (t7 != null) {
			t7.style.width = w + "px";
		}
		var t6 = document.getElementById("listPane" + id);
		if (t6 != null) {
			t6.style.height = (h - 84) + "px";
		}
		var t8 = document.getElementById("searchAllPane" + id);
		if (t8 != null) {
			t8.style.width = w + "px";
		}
		var t9 = document.getElementById("searchAppPane" + id);
		if (t9 != null) {
			t9.style.width = w + "px";
		}
	};

	MainContent.prototype.doEastResize = function(evt, id, dx) {
		var t = document.getElementById("canvasPanel" + id);
		var t2 = document.getElementById("adminPanel" + id);
		var t1 = document.getElementById("canvasPanelRL" + id);
		if (t != null) {
			t.style.width = (parseInt(t.style.width) + dx) + "px";
		}
		if (t2 != null) {
			t2.style.width = (parseInt(t2.style.width) + dx) + "px";
		}
		if (t1 != null) {
			t1.style.width = (parseInt(t1.style.width) + dx) + "px";
		}
		var t3 = document.getElementById("listPanel" + id);
		if (t3 != null) {
			t3.style.width = (parseInt(t3.style.width) + dx) + "px";
		}
		var t4 = document.getElementById("newsDetails" + id);
		if (t4 != null) {
			t4.style.width = (parseInt(t4.style.width) + dx) + "px";
		}
		var t5 = document.getElementById("addNews" + id);
		if (t5 != null) {
			t5.style.width = (parseInt(t5.style.width) + dx) + "px";
		}
		var t6 = document.getElementById("searchAllPane" + id);
		if (t6 != null) {
			t6.style.width = (parseInt(t6.style.width) + dx) + "px";
		}
		var t7 = document.getElementById("searchAppPane" + id);
		if (t7 != null) {
			t7.style.width = (parseInt(t7.style.width) + dx) + "px";
		}
	};

	MainContent.prototype.doWestResize = function(evt, id, dx) {
		var t = document.getElementById("canvasPanel" + id);
		if (t != null) {
			t.style.width = (parseInt(t.style.width) - dx) + "px";
		}
		var t2 = document.getElementById("adminPanel" + id);
		if (t2 != null) {
			t2.style.width = (parseInt(t2.style.width) - dx) + "px";
		}
		var t1 = document.getElementById("canvasPanelRL" + id);
		if (t1 != null) {
			t1.style.width = (parseInt(t1.style.width) - dx) + "px";
		}
		var t3 = document.getElementById("listPanel" + id);
		if (t3 != null) {
			t3.style.width = (parseInt(t3.style.width) - dx) + "px";
		}
		var t4 = document.getElementById("searchAllPane" + id);
		if (t4 != null) {
			t4.style.width = (parseInt(t4.style.width) - dx) + "px";
		}
		var t5 = document.getElementById("searchAppPane" + id);
		if (t5 != null) {
			t5.style.width = (parseInt(t5.style.width) - dx) + "px";
		}
	};

	MainContent.prototype.doSouthResizeForAdPTabs = function(evt, id, dy) {
		var t = document.getElementById("tablediv" + id);
		if (t != null) {
			t.style.height = (parseInt(t.style.height) - dy) + "px";
		}
		var t2 = document.getElementById("listPane" + id);
		if (t2 != null) {
			t2.style.height = (parseInt(t2.style.height) - dy) + "px";
		}
	};

	MainContent.prototype.doSouthResizeForEditorTabs = function(evt, id, dy) {
		var t = document.getElementById("convasPane" + id);
		var p = document.getElementById("accordion" + id);
		var t2 = document.getElementById("resultdiv" + id);
		if (t != null) {
			t.style.height = (parseInt(t.style.height) + dy) + "px";
		}
		if (p != null) {
			p.style.height = (parseInt(p.style.height) + dy) + "px";
		}
		if (t2 != null) {
			if (parseInt(t2.style.height) + dy > 0) {
				t2.style.height = (parseInt(t2.style.height) + dy) + "px";
			} else {
				t2.style.height = "0px";
			}
		}
		var t3 = document.getElementById("listPane" + id);
		if (t3 != null) {
			t3.style.height = (parseInt(t3.style.height) + dy) + "px";
		}

		// 设置编辑器部分上下高度
		var t4 = document.getElementById("newsContent" + id);
		var h = document.documentElement.clientHeight;
		if (t4 != null) {
			t4.style.height = (parseInt(t4.style.height) + dy) + "px";
			if (map[id].enditorInstance != undefined
					&& map[id].enditorInstance != null) {
				map[id].enditorInstance.resize(parseInt(t4.style.width),
						(parseInt(t4.style.height) + dy), true, false);
			}
		}

		// 设置编辑器部分上下高度
		// var t5 = document.getElementById("addNewsContent" + id);
		// if (t5 != null) {
		// t5.style.height = (parseInt(t5.style.height) + dy) + "px";
		// if (map[id].enditorInstance != undefined
		// && map[id].enditorInstance != null) {
		// map[id].enditorInstance.resize(parseInt(t5.style.width),
		// (parseInt(t5.style.height) + dy), true, false);
		// }
		// }
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new MainContent(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);