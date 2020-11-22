/**
 * 
 */
var map = {};
;
(function($, window, document, undefined) {
	var pluginName = "mainContent";
	var defaults = {
		id : "",
		author : "",
	};

	var MainContent = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			author : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.basicpropertySheets = null; // basic property setter;
		this.propertySheets = null; // advanced property setter;

		this.confirmInfoDialog = null;
		this.messageDialog = null;
		this.createModelDialog = null;
		this.renameDialog = null;

		this.treeviewer;
		this.propertySheets;
		this.contentRow;
		this.init(options);
		this.currentProcID = -1;
		this.menubar = null;

		window.addEventListener("load", this, false);
		window.addEventListener("resize", this, false);
		document.body.addEventListener('mousedown', this, false);
		document.body.addEventListener('mousemove', this, false);
		document.body.addEventListener('mouseup', this, false);
	};

	MainContent.prototype.init = function(options) {
		var mainframe = document.createElement("DIV");
		mainframe.className = "container-fluid";
		mainframe.id = "maincontent"
		this.element.appendChild(mainframe);

		var folderframe = document.createElement("DIV");
		folderframe.className = "col";
		folderframe.style.margin = "0px";
		folderframe.style.padding = "0px";
		folderframe.id = "treeviewerFrm";
		mainframe.appendChild(folderframe);

		var colresizebar1 = document.createElement("DIV");
		colresizebar1.className = "col";
		colresizebar1.style.width = "8px";
		colresizebar1.style.margin = "0px";
		colresizebar1.style.padding = "0px";
		colresizebar1.style.border = "0px solid black";
		colresizebar1.id = "treeviewerFrmBar";
		mainframe.appendChild(colresizebar1);

		var folderRow = document.createElement("DIV");
		folderRow.className = "row";
		folderRow.style.margin = "0px";
		folderRow.style.padding = "0px";
		folderframe.appendChild(folderRow);

		var panelDIV = document.createElement("DIV");
		panelDIV.className = "panel panel-default";
		folderRow.appendChild(panelDIV);

		var panelHeaderDIV = document.createElement("DIV");
		panelHeaderDIV.className = "panel-heading";
		panelHeaderDIV.innerHTML = "业务（流程）应用";
		panelDIV.appendChild(panelHeaderDIV);

		var panelBodyDIV = document.createElement("DIV");
		panelDIV.appendChild(panelBodyDIV);

		// loading business process folder viewer ...
		this.loadProcessFolderViewer(panelBodyDIV, this);

		var contentframe = document.createElement("DIV");
		contentframe.className = "col";
		contentframe.style.margin = "0px";
		contentframe.style.padding = "0px";
		contentframe.id = "maincontentFrm";
		mainframe.appendChild(contentframe);

		this.contentRow = document.createElement("DIV");
		this.contentRow.className = "row";
		this.contentRow.id = "canvasarea";
		this.contentRow.style.margin = "0px";
		this.contentRow.style.padding = "0px";
		contentframe.appendChild(this.contentRow);

		var tabHeader = document.createElement("UL");
		tabHeader.className = "nav nav-tabs maincontent-nav-tabs";
		tabHeader.id = "myTab";
		tabHeader.setAttribute("role", "tablist");
		this.contentRow.appendChild(tabHeader);

		var tabContent = document.createElement("DIV");
		tabContent.className = "tab-content";
		tabContent.id = "tabcontents";
		tabContent.style.border = "0px solid red";
		this.contentRow.appendChild(tabContent);

		var rowresizebar3 = document.createElement("DIV");
		rowresizebar3.style.margin = "0px";
		rowresizebar3.style.padding = "0px";
		rowresizebar3.style.height = "8px";
		rowresizebar3.style.border = "0px solid black";
		rowresizebar3.id = "advPropertyFrmBar";
		contentframe.appendChild(rowresizebar3);

		var advancedPropertySheet = document.createElement("DIV");
		advancedPropertySheet.className = "row";
		advancedPropertySheet.style.margin = "0px";
		advancedPropertySheet.style.padding = "0px";
		advancedPropertySheet.style.border = "0px solid red";
		advancedPropertySheet.id = "advancedPropFrm";
		contentframe.appendChild(advancedPropertySheet);

		var colresizebar2 = document.createElement("DIV");
		colresizebar2.className = "col";
		colresizebar2.style.width = "8px";
		colresizebar2.style.margin = "0px";
		colresizebar2.style.padding = "0px";
		colresizebar2.style.border = "0px solid black";
		colresizebar2.id = "basicPropertyFrmBar";
		mainframe.appendChild(colresizebar2);

		var basicPropertyFrame = document.createElement("DIV");
		basicPropertyFrame.className = "col";
		basicPropertyFrame.style.margin = "0px";
		basicPropertyFrame.style.padding = "0px";
		basicPropertyFrame.id = "basicPropertyFrm";
		mainframe.appendChild(basicPropertyFrame);

		var basicPropertySheet = document.createElement("DIV");
		basicPropertySheet.className = "row";
		basicPropertySheet.id = "basicpropertypanel";
		basicPropertySheet.style.margin = "0px";
		basicPropertySheet.style.padding = "0px";
		basicPropertyFrame.appendChild(basicPropertySheet);

		// advanced property sheet plugin
		var p = $(advancedPropertySheet).propertySheets({
			prop : "",
			topparent : this.element,
			url : this.domainname,
		});
		this.propertySheets = p.data("propertySheets");
		// basic property sheet plugin
		var p1 = $(basicPropertyFrame).basicPropertySheet({
			prop : "",
			topparent : this.element,
			url : this.domainname,
		});
		this.basicpropertySheets = p1.data("basicPropertySheet");
		// // create new model dialog plugin
		// var p4 = $(this.element).createModelDialog({
		// id : "004",
		// title : "云BPM - 新建",
		// parent : this,
		// });
		// this.createModelDialog = p4.data("createModelDialog");
		// // confirm message dialog plugin
		// var p2 = $(this.element).confirmInfoDialog({
		// id : "005",
		// title : "云BPM - 提示",
		// parent : this,
		// });
		// this.confirmInfoDialog = p2.data("confirmInfoDialog");
		// // general message dialog plugin
		// var p3 = $(this.element).messageDialog({
		// id : "006",
		// title : "云BPM - 提示",
		// parent : this,
		// });
		// this.messageDialog = p3.data("messageDialog");
		//
		// // rename dialog
		// var p5 = $(this.element).renameEditDialog({
		// id : "mrename009",
		// title : "云BPM - 重命名",
		// parent : this,
		// topparent : this.element,
		// url : this.domainname,
		// });
		// this.renameDialog = $(this.element).data("renameEditDialog");

		this.addListener(this);

	};

	MainContent.prototype.loadProcessFolderViewer = function(parent, manager) {
		this.treeviewer = document.createElement("DIV");
		this.treeviewer.id = "treeview";
		this.treeviewer.style.overflow = "auto";
		parent.appendChild(this.treeviewer);
		this.instance = $(this.treeviewer)
				.jstree(
						{
							"core" : {
								// so that create works
								// "multiple": false,
								// "themes": {"dots": false},
								"check_callback" : true,
								"data" : {
									"url" : service.api(0),
									"dataType" : "json" // needed only if you do
								// not
								// supply JSON
								// headers
								}
							},
							"plugins" : [ "contextmenu", "dnd" ],
							"contextmenu" : {
								"items" : {
									"create" : {
										"label" : "新建",
										"action" : function(obj) {
											var instance = $('#treeview')
													.jstree();
											var selected = instance
													.get_selected(true);
											if (selected.length > 0) {
												var fold = instance
														.get_selected(true)[0];
												var arry = fold.data.split("|");
												if (arry[0] == "2") {
													manager.createModelDialog
															.initData(arry[2]);
													manager.createModelDialog
															.show();
												}
											}
										},
									},
									"open" : {
										"label" : "打开",
										"action" : function(obj) {
											manager.openProcess("1");
										},
									},
									// "rename" : {
									// "separator_before" : true,
									// "separator_after" : true,
									// "label" : "重命名",
									// "action" : function(obj) {
									// var instance = $('#treeview')
									// .jstree();
									// var selected = instance
									// .get_selected(true);
									// if (selected.length > 0) {
									// var parent = instance
									// .get_selected(true)[0];
									// if (map[parent.id] == null) {
									// var type = manager.renameDialog
									// .setEntityId(
									// parent.id,
									// parent.text,
									// parent.data);
									// } else {
									// manager.renameDialog
									// .setEntity(map[parent.id].wfprocess);
									// }
									// manager.renameDialog.show();
									// }
									// },
									// },
									"delete" : {
										"label" : "删除",
										"action" : function(obj) {
											instance = $('#treeview').jstree();
											var selected = instance
													.get_selected(true);
											if (selected.length > 0) {
												var parent = instance
														.get_selected(true)[0];
												var s = parent.data.split("|");
												manager.confirmInfoDialog.show(
														"你确定要删除" + parent.text
																+ "？", 2,
														parent.id, s[1]);
											}
										},
									}
								}
							}
						}).on('create_node.jstree', function(e, data) {
				}).on('select_node.jstree', function(e, data) {
					if (data.node.data != "") {
						var arry = data.node.data.split("|");
						if (arry[0] == "2") {
							// manager.createModelDialog.initData(arry[2]);
							manager.menubar.newItem.removeAttribute("class");// enabled
						} else {
							manager.menubar.newItem.className = "disabled";// disabled
						}
					}
				});
		$(this.treeviewer).on("dblclick.jstree", this.dblclickJSTree);

	};

	MainContent.prototype.addListener = function(parent) {
		// get focus on editor
		$(".maincontent-nav-tabs").on("click", "a", function(e) {
			// tab
			e.preventDefault();
			$(this).tab('show');
			var s = $(this).attr('href');
			var id = s.substring(5);// #tab_000002A8AS
			parent.currentProcID = id;
			if (map[id] != null) {
				map[id].setPropertySheet();
			}
		}).on(
				"click",
				"span",
				function() {// close tab.
					var pp = this.getAttribute("data");
					if (map[pp] != null) {
						var dirty = map[pp].getDirty();
						if (dirty) {
							parent.confirmInfoDialog.show("当前"
									+ Utils.parse(map[pp].wfprocess.name)
									+ "已经修改，是否保存修改？", 1, pp);
						} else {
							var anchor = $(this).parent();
							parent.cloaseTab(pp, anchor);
						}
					} else {
						var anchor = $(this).parent();
						parent.cloaseTab(pp, anchor);
					}
				});
	};

	MainContent.prototype.clearPropertySheet = function(e) {
		// basic property
		this.basicpropertySheets.clearSheet();
		this.basicpropertySheets.initSheet();
		// advanced property
		this.propertySheets.clearSheet();
		this.propertySheets.initSheet();
	};

	MainContent.prototype.dblclickJSTree = function(e) {
		e.preventDefault();
		var instance = $('#treeview').jstree(true);
		var sel = instance.get_selected(true)[0];
		if (sel != null) {
			var selected = instance.is_leaf(sel);
			var arry = sel.data.split("|");
			if (selected && arry[0] == "3") {
				if (arry[3] == "P") {
					window.main.addNewTab(sel.text, sel.id, arry[1]);
				} else if (arry[3] == "R") {
					window.main.addNewTabForRP(sel.text, sel.id, arry[1]);
				}
			}
		}
	};

	MainContent.prototype.openProcess = function(a) {
		var instance = $('#treeview').jstree(true);
		var sel = instance.get_selected(true)[0];
		if (sel != null) {
			var selected = instance.is_leaf(sel);
			var arry = sel.data.split("|");
			if (selected && arry[0] == "3") {
				if (arry[3] == "P") {
					window.main.addNewTab(sel.text, sel.id, arry[1]);
				} else if (arry[3] == "R") {
					window.main.addNewTabForRP(sel.text, sel.id, arry[1]);
				}
			}
		}
	};

	MainContent.prototype.createFolder = function(parent, name, parentid,
			ownerid, type) {
		$("#progressbar").show();
		var icon = "glyphicon glyphicon-folder-open";
		if (type == 109) {
			icon = "glyphicon glyphicon-th-large";
		}
		$.post(service.api(3), {
			ename : Utils.stringify(name),
			pid : parentid,
			oid : ownerid,
			type : type,
		}, function(x) {
			var instance = $('#treeview').jstree();
			var node = {
				id : x.id,
				text : Utils.parse(x.name),
				data : "2|" + x.owner + "|" + type,
				// parent: data.parent.id,
				icon : icon,
			};
			instance.create_node(parent, node, "last");
			instance.redraw(true);
			$('#treeview').jstree('deselect_all', true);
			$('#treeview').jstree('select_node', node.id);
			$("#progressbar").hide();
		});
	};

	MainContent.prototype.createWfProcess = function(parent, name, parentid,
			ownerid) {
		$("#progressbar").show();
		var that = this;
		$.post(service.api(4), {
			ename : Utils.stringify(name),
			pid : parentid,
			oid : ownerid,
			author : this.options.author,
		}, function(x) {
			var node = {
				id : x.id,
				text : Utils.parse(x.text),
				data : x.data,
				icon : "glyphicon glyphicon-flash",
			};
			var instance = $('#treeview').jstree();
			instance.create_node(parent, node, "last");
			instance.redraw(true);
			$('#treeview').jstree('deselect_all', true);
			$('#treeview').jstree('select_node', node.id);
			that.addNewTab(node.text, node.id, ownerid);
			$("#progressbar").hide();
		});
	};

	MainContent.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "load":
			this.autoHeight();
			break;
		case "resize":
			this.autoHeight();
			break;
		case "mousedown":
			this.doMouseDown(e);
			break;
		case "mousemove":
			this.doMouseMove(e);
			break;
		case "mouseup":
			this.doMouseUp(e);
			break;
		}
	};

	MainContent.prototype.doYesAction = function(e, type, pid, orgid) {
		this.confirmInfoDialog.hide();
		if (type == 1) { // process modify
			this.saveChange(1, this);
		} else if (type == 2) { // process deletion
			// close process
			this.removeTab(pid);
			$("#progressbar").show();
			// delete process
			$.post(service.api(15), {
				id : pid,
				oid : orgid,
			}).complete(function(data) {
				$("#progressbar").hide();
			});
			// remove a node.
			instance = $('#treeview').jstree();
			var p = instance.get_selected(true)[0];
			$('#treeview').jstree('delete_node', p);
		}
	};

	MainContent.prototype.doNoAction = function(e, type, pid) {
		this.confirmInfoDialog.hide();
		if (type == 1) { // process modify
			this.removeTab(pid);
		} else if (type == 2) { // process deletion
			// nothing...
			this.removeTab(pid);
		}
	};

	MainContent.prototype.removeTab = function(pid) {
		var that = this;
		$(".maincontent-nav-tabs").children('li').each(function(entry) {
			var anchor = $(this).children("a")[0];
			var id = $(anchor).attr('href').substring(5);// #tab_000002A8AS
			if (pid == id) {
				that.cloaseTab(id, anchor);
			}
		});
	};

	MainContent.prototype.doSaveAction = function() {
		this.saveChange(0, this);
	};

	MainContent.prototype.doCreateNewAction = function() {
		this.createModelDialog.show();
	};

	MainContent.prototype.saveChange = function(closetab, parent) {
		$(".maincontent-nav-tabs").children('li').each(function(entry) {
			var anchor = $(this).children("a")[0];
			var s = $(anchor).attr('href');
			// #tab_000000000002A8AS (#tab_+process ID)
			var id = $(anchor).attr('href').substring(5);
			if (map[id].getDirty()) {
				parent.saveObject(id, anchor, closetab);
			}
		});
	};

	MainContent.prototype.saveObject = function(id, anchor, closetab) {
		var that = this;
		$("#progressbar").show();
		var cmd = 0;
		if (map[id].wfprocess instanceof WfProcess) {
			cmd = 5;
		} else if (map[id].wfprocess instanceof ReleasedWfProcess) {
			cmd = 22;
		}
		var process1 = map[id].wfprocess.stringifyforJSON();
		$.post(service.api(cmd), {
			process : JSON.stringify(process1),
		}, function(data) {
			map[id].stack.save();
			if (closetab == 1) {
				that.cloaseTab(id, anchor);
			}
			$("#progressbar").hide();
			// that.allSaved();
		});
	};

	// MainContent.prototype.allSaved = function() {
	// var saved = true;
	// $(".maincontent-nav-tabs").children('li').each(function(entry) {
	// console.log("b");
	// var anchor = $(this).children("a")[0];
	// var s = $(anchor).attr('href');
	// var id = $(anchor).attr('href').substring(5);
	// if (map[id].stack.isDirty()) {
	// saved = false;
	// return saved;
	// }
	// });
	// console.log(saved);
	// if (saved) {
	// console.log(saved);
	// this.messageDialog.show("您的修改已经保存成功。");
	// $("#progressbar").hide();
	// }
	// };

	MainContent.prototype.cloaseTab = function(procid, anchors) {
		delete map[procid];
		var anchor = $(anchors); // close tab
		$(anchor.attr('href')).remove(); // remove tab content;
		$(anchors).parent().remove(); // remove tab header <li>;
		// clear property sheet;
		this.clearPropertySheet();
		this.currentProcID = -1;
		$(".maincontent-nav-tabs li").children('a').first().click();
	};

	// myTabTitle: tab title, myTabID: released process ID, myOwnerID:
	// organization ID.
	MainContent.prototype.addNewTabForRP = function(myTabTitle, myTabID,
			myOwnerID) {
		if (map[myTabID] == undefined || map[myTabID] == null) {
			var tabheader = document.createElement("li");
			tabheader.setAttribute('role', 'presentation');
			var tablink = document.createElement("a");
			tablink.setAttribute('href', '#tab_' + myTabID + '');
			tablink.setAttribute('aria-controls', '#tab_' + myTabID + '');
			tablink.setAttribute('role', 'tab');
			tablink.setAttribute('data-toggle', 'tab');

			var tabTitle = document.createElement("text");
			tabTitle.innerHTML = "<font color='blue'>" + myTabTitle + "</font>"
					+ "&nbsp;&nbsp;";
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
			// var p = $(tabcontent).releasedWfProcessEditor({
			// id : myTabID,
			// basicpropsheet : this.basicpropertySheets,
			// propsheet : this.propertySheets,
			// height : this.tabsHeight,
			// owner : myOwnerID,
			// });
			// tabcontent.setAttribute("data", myTabID);
			// map[myTabID] = p.data("releasedWfProcessEditor");
			$("#tabcontents").append(tabcontent);
		}
		$('.maincontent-nav-tabs a[href="#tab_' + myTabID + '"]').tab('show');

	};

	// myTabTitle: tab title, myTabID: process ID, myOwnerID: organization ID.
	MainContent.prototype.addNewTab = function(myTabTitle, myTabID, myOwnerID) {
		var tabheader = document.createElement("li");
		tabheader.setAttribute('role', 'presentation');
		var tablink = document.createElement("a");
		tablink.setAttribute('href', '#tab_' + myTabID + '');
		tablink.setAttribute('aria-controls', '#tab_' + myTabID + '');
		tablink.setAttribute('role', 'tab');
		tablink.setAttribute('data-toggle', 'tab');

		var tabTitle = document.createElement("text");
		tabTitle.innerHTML = myTabTitle + "&nbsp;&nbsp;";
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
		// var p = $(tabcontent).wfProcessEditor({
		// id : myTabID,
		// owner : myOwnerID,
		// parent : this,
		// });
		// tabcontent.setAttribute("data", myTabID);
		// map[myTabID] = p.data("wfProcessEditor");
		$("#tabcontents").append(tabcontent);
		$('.maincontent-nav-tabs a[href="#tab_' + myTabID + '"]').tab('show');

	};

	MainContent.prototype.autoHeight = function() {
		// width
		var w = document.documentElement.clientWidth;
		var tvFrm = document.getElementById("treeviewerFrm");
		tvFrm.style.width = "250px";
		var bpFrm = document.getElementById("basicPropertyFrm");
		bpFrm.style.width = "250px";
		var mcFrm = document.getElementById("maincontentFrm");
		mcFrm.style.width = (w - 564) + "px";
		var adFrmBar = document.getElementById("advPropertyFrmBar");
		adFrmBar.style.width = (w - 564) + "px";

		// height
		// main content area
		var h = document.documentElement.clientHeight;
		var ca = document.getElementById("canvasarea");
		ca.style.height = (h - 332) + "px";
		var tv = document.getElementById("treeview");
		tv.style.height = (h - 176) + "px";
		var bp = document.getElementById("basicpropertysheet");
		if (bp != null) {
			bp.style.height = (h - 176) + "px";
		}

		this.tabsHeight = (h - 418); // tabs height
		var adpFrm = document.getElementById("advancedPropFrm");
		adpFrm.style.height = "193px"; // advanced property sheet height
		var adpp = document.getElementById("adpropertysheetPane");
		if (adpp != null) {
			adpp.style.height = "149px";
		}

		// column resize bar
		var bar1 = document.getElementById("treeviewerFrmBar");
		var bar2 = document.getElementById("basicPropertyFrmBar");
		bar1.style.height = (h - 130) + "px";
		bar2.style.height = (h - 130) + "px";

		$("#tabcontents").children('DIV').each(function(entry) {
			var id = this.getAttribute("data"); // id;
			var t = document.getElementById("convasPane" + id);
			if (t != null) {
				// process tab
				t.style.height = (h - 418) + "px";
			}
			var t1 = document.getElementById("canvasPanel" + id);
			if (t1 != null) {
				// content canvas
				t1.style.width = (w - 640) + "px";
			}
			var t2 = document.getElementById("canvasPanelRL" + id);
			if (t2 != null) {
				// content canvas
				t2.style.width = (w - 568) + "px";
			}
			var p = document.getElementById("accordion" + id);
			if (p != null) {
				// pallette
				p.style.height = (h - 418) + "px";
			}
		});
	};

	MainContent.prototype.doMouseDown = function(evt) {
		// evt.preventDefault();
		this.mouse0 = {
			x : evt.clientX,
			y : evt.clientY,
		};
		// code below prevents the mouse down from having an effect on the main
		// browser window:
		// if (evt.preventDefault) {
		// evt.preventDefault();
		// } // standard
		// else if (evt.returnValue) {
		// evt.returnValue = false;
		// } // older IE
	};

	MainContent.prototype.doMouseMove = function(evt) {
		// evt.preventDefault();
		this.mouse1 = {
			x : evt.clientX,
			y : evt.clientY,
		};
		var bar1 = document.getElementById("treeviewerFrmBar")
				.getBoundingClientRect();
		var bar2 = document.getElementById("basicPropertyFrmBar")
				.getBoundingClientRect();
		var bar3 = document.getElementById("advPropertyFrmBar")
				.getBoundingClientRect();
		if (this.mouse0 != null) {
			if (document.body.style.cursor == "e-resize") {
				var dx = this.mouse1.x - this.mouse0.x;
				var tv = document.getElementById("treeviewerFrm");
				if ((parseInt(tv.style.width) + dx) > 100
						&& (parseInt(tv.style.width) + dx) < 500) {
					tv.style.width = (parseInt(tv.style.width) + dx) + "px";
					var mc = document.getElementById("maincontentFrm");
					mc.style.width = (parseInt(mc.style.width) - dx) + "px";
					var ca = document.getElementById("canvasarea");
					ca.style.width = (parseInt(ca.style.width) - dx) + "px";
					var adFrm = document.getElementById("advancedPropFrm");
					adFrm.style.width = (parseInt(adFrm.style.width) - dx)
							+ "px";
					var adFrmBar = document.getElementById("advPropertyFrmBar");
					adFrmBar.style.width = (parseInt(adFrmBar.style.width) - dx)
							+ "px";
					$("#tabcontents")
							.children('DIV')
							.each(
									function(entry) {
										var id = this.getAttribute("data"); // id;
										var t = document
												.getElementById("canvasPanel"
														+ id);
										if (t != null) {
											// process tab
											t.style.width = (parseInt(t.style.width) - dx)
													+ "px";
										}
										var t1 = document
												.getElementById("canvasPanelRL"
														+ id);
										if (t1 != null) {
											// process tab
											t1.style.width = (parseInt(t1.style.width) - dx)
													+ "px";
										}
									})
					this.mouse0.x = this.mouse1.x;
					this.mouse0.y = this.mouse1.y;
					return;
				}
			}
			if (document.body.style.cursor == "w-resize") {
				var dx = this.mouse1.x - this.mouse0.x;
				var bp = document.getElementById("basicPropertyFrm");
				if ((parseInt(bp.style.width) - dx) > 100
						&& (parseInt(bp.style.width) - dx) < 500) {
					bp.style.width = (parseInt(bp.style.width) - dx) + "px";
					var mc = document.getElementById("maincontentFrm");
					mc.style.width = (parseInt(mc.style.width) + dx) + "px";
					var adFrm = document.getElementById("advancedPropFrm");
					adFrm.style.width = (parseInt(adFrm.style.width) + dx)
							+ "px";
					var adPa = document.getElementById("adpropertysheetPane");
					adPa.style.width = (parseInt(adPa.style.width) + dx) + "px";
					var adFBar = document.getElementById("advPropertyFrmBar");
					adFBar.style.width = (parseInt(adFBar.style.width) + dx)
							+ "px";
					$("#tabcontents")
							.children('DIV')
							.each(
									function(entry) {
										var id = this.getAttribute("data"); // id;
										var t = document
												.getElementById("canvasPanel"
														+ id);
										if (t != null) {
											// process tab
											t.style.width = (parseInt(t.style.width) + dx)
													+ "px";
										}
										var t1 = document
												.getElementById("canvasPanelRL"
														+ id);
										if (t1 != null) {
											// process tab
											t1.style.width = (parseInt(t1.style.width) + dx)
													+ "px";
										}
									});
					this.mouse0.x = this.mouse1.x;
					this.mouse0.y = this.mouse1.y;
					return;
				}
			}
			if (document.body.style.cursor == "n-resize") {
				var dy = this.mouse1.y - this.mouse0.y;
				var adFrm = document.getElementById("advancedPropFrm");
				if ((parseInt(adFrm.style.height) - dy) > 100
						&& (parseInt(adFrm.style.height) - dy) < 500) {
					adFrm.style.height = (parseInt(adFrm.style.height) - dy)
							+ "px";
					var adpp = document.getElementById("adpropertysheetPane");
					adpp.style.height = (parseInt(adpp.style.height) - dy)
							+ "px";

					$("#advancedproptabs")
							.children('DIV')
							.each(
									function(entry) {
										var id = this.getAttribute("data");
										var t = document
												.getElementById("tablediv" + id);
										if (t != null) {
											t.style.height = (parseInt(t.style.height) - dy)
													+ "px";
										}
									});

					var ca = document.getElementById("canvasarea");
					ca.style.height = (parseInt(ca.style.height) + dy) + "px";
					var tbFrm = document.getElementById("tabcontents");
					tbFrm.style.height = (parseInt(tbFrm.style.height) + dy)
							+ "px";

					this.tabsHeight = this.tabsHeight + dy; // tabs height
					$("#tabcontents")
							.children('DIV')
							.each(
									function(entry) {
										var id = this.getAttribute("data"); // id;
										var h = document.documentElement.clientHeight;
										var t = document
												.getElementById("convasPane"
														+ id);
										if (t != null) {
											// process tab
											t.style.height = (parseInt(t.style.height) + dy)
													+ "px";
										}
										var p = document
												.getElementById("accordion"
														+ id);
										if (p != null) {
											// pallette
											p.style.height = (parseInt(p.style.height) + dy)
													+ "px";
										}
									});
					this.mouse0.x = this.mouse1.x;
					this.mouse0.y = this.mouse1.y;
					return;
				}
			}
		} else {
			if (this.mouse1.x > bar1.left - 8
					&& this.mouse1.x < bar1.left + bar1.width + 8
					&& this.mouse1.y > bar1.top
					&& this.mouse1.y < bar1.top + bar1.height) {
				document.body.style.cursor = "e-resize";
			} else if (this.mouse1.x > bar2.left - 8
					&& this.mouse1.x < bar2.left + bar2.width + 8
					&& this.mouse1.y > bar2.top
					&& this.mouse1.y < bar2.top + bar2.height) {
				document.body.style.cursor = "w-resize";
			} else if (this.mouse1.y > bar3.top - 8
					&& this.mouse1.y < bar3.top + bar3.height + 8
					&& this.mouse1.x > bar3.left
					&& this.mouse1.y < bar3.left + bar3.width) {
				document.body.style.cursor = "n-resize";
			} else {
				document.body.style.cursor = "default";
			}
		}
		// code below prevents the mouse down from having an effect on the main
		// browser window:
		// if (evt.preventDefault) {
		// evt.preventDefault();
		// } // standard
		// else if (evt.returnValue) {
		// evt.returnValue = false;
		// } // older IE
	};

	MainContent.prototype.doMouseUp = function(evt) {
		// evt.preventDefault();
		this.mouse0 = null;
		this.mouse1 = null;
		// document.body.removeEventListener('mousemove', this, false);
		// document.body.removeEventListener('mouseup', this, false);
		// code below prevents the mouse down from having an effect on the main
		// browser window:
		// if (evt.preventDefault) {
		// evt.preventDefault();
		// } // standard
		// else if (evt.returnValue) {
		// evt.returnValue = false;
		// } // older IE
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