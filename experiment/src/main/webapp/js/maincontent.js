/**
 * 
 */
var ommap = {};
;
(function($, window, document, undefined) {
	var pluginName = "mainContent";
	var defaults = {
		id : "",
	};

	var MainContent = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.basicpropertySheets = null; // basic property setter;
		this.propertySheets = null; // advanced property setter;

		this.confirmInfoDialog;
		this.messageDialog;
		this.createModelDialog;

		this.treeviewer;
		this.contentRow;
		this.init(options);
		this.currentProcID = -1;
		this.tabsHeight = 0;

		window.addEventListener("load", this, false);
		window.addEventListener("resize", this, false);

	};

	MainContent.prototype.init = function(options) {
		var mainframe = document.createElement("DIV");
		mainframe.className = "container-fluid";
		mainframe.id = "maincontent"
		this.element.appendChild(mainframe);
		mainframe.addEventListener('mousedown', this, false);
		mainframe.addEventListener('mousemove', this, false);
		mainframe.addEventListener('mouseup', this, false);

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
		panelHeaderDIV.innerHTML = "所有组织";
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
		tabHeader.className = "nav nav-tabs";
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
		});
		this.propertySheets = p.data("propertySheets");
		// basic property sheet plugin
		var p1 = $(basicPropertyFrame).basicPropertySheet({
			prop : "",
			topparent : this.element,
		});
		this.basicpropertySheets = p1.data("basicPropertySheet");
		// create new model dialog plugin
		// var p4 = $(this.element).newStaffDetailsDialog({
		// id : "004",
		// title : "轩琦 - 创建",
		// parent : this,
		// });
		// this.createModelDialog = p4.data("newStaffDetailsDialog");
		// confirm message dialog plugin
		var p2 = $(this.element).confirmInfoDialog({
			id : "005",
			title : "轩琦 - 提示",
			parent : this,
		});
		this.confirmInfoDialog = p2.data("confirmInfoDialog");
		// general message dialog plugin
		var p3 = $(this.element).messageDialog({
			id : "006",
			title : "轩琦 - 提示",
			parent : this,
		});
		this.messageDialog = p3.data("messageDialog");

		this.addListener(this);

	};

	MainContent.prototype.loadProcessFolderViewer = function(parent, pmmanager) {
		this.treeviewer = document.createElement("DIV");
		this.treeviewer.id = "treeview";
		this.treeviewer.style.overflow = "auto";
		parent.appendChild(this.treeviewer);
		var that = this;
		this.instance = $(this.treeviewer).jstree({
			"core" : {
				// so that create works
				// "multiple": true,
				// "themes": {"dots": false},
				"check_callback" : true,
				"data" : {
					"url" : services.api(0),
					"dataType" : "json" // needed only if you do not supply JSON
				// headers
				}
			},
			"plugins" : [ "contextmenu", "dnd" ],
			"contextmenu" : {
				"items" : {
					"create" : {
						"label" : "打开",
						"action" : function(obj) {
							pmmanager.openEditor("a");
						},
					},
				}
			}

		}).on('create_node.jstree', function(e, data) {
		}).on('loaded.jstree', function() {
			$(that.instance).jstree('open_all');
		});
		$(this.treeviewer).on("dblclick.jstree", this.dblclickJSTree);

	};

	MainContent.prototype.addListener = function(parent) {
		$(".nav-tabs").on("click", "a", function(e) { // get focus on editor
			// tab
			e.preventDefault();
			$(this).tab('show');
			var s = $(this).attr('href');
			var id = s.substring(5);// #tab_000002A8AS
			parent.currentProcID = id;
			if (ommap[id] != null) {
				ommap[id].setPropertySheet();
			}
		}).on("click", "span", function() {// close tab.
			var pp = this.getAttribute("data");
			if (ommap[pp] != null) {
				var dirty = ommap[pp].getDirty();
				if (dirty) {
					parent.confirmInfoDialog.show("当前模型已经修改，是否保存修改？")
				} else {
					var anchor = $(this).parent();
					parent.cloaseTab(pp, anchor);
				}
			}
			var anchor = $(this).parent();
			parent.cloaseTab(pp, anchor);
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
			if (selected != null) {
				var myTabTitle = sel.text;
				var myTabID = sel.id;
				if (arry[0] != "2") {
					if (ommap[myTabID] == null) {
						window.main.addNewTab(myTabTitle, myTabID, arry[1],
								arry[2]);
					}
				} else if (arry[0] == "2") {
					window.main
							.addNewTab(myTabTitle, myTabID, arry[1], arry[2]);
				}
			}
		}
	};

	MainContent.prototype.openEditor = function(e) {
		var instance = $('#treeview').jstree(true);
		var sel = instance.get_selected(true)[0];
		if (sel != null) {
			var selected = instance.is_leaf(sel);
			var arry = sel.data.split("|");
			if (selected != null && arry[0] != "2") {
				var myTabTitle = sel.text;
				var myTabID = sel.id;
				var myOwnerID = null;
				if (ommap[myTabID] == null) {
					window.main
							.addNewTab(myTabTitle, myTabID, arry[1], arry[2]);
				}
			}
		}
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

	MainContent.prototype.doYesAction = function(e) {
		this.confirmInfoDialog.hide();
		this.saveChange(1, this);
	};

	MainContent.prototype.doNoAction = function(e) {
		this.confirmInfoDialog.hide();
		var that = this;
		$(".nav-tabs").children('li').each(function(entry) {
			var anchor = $(this).children("a")[0];
			var id = $(anchor).attr('href').substring(5);// #tab_000002A8AS
			if (that.currentProcID == id) {
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
		$(".nav-tabs").children('li').each(function(entry) {
			var anchor = $(this).children("a")[0];
			var id = $(anchor).attr('href').substring(5);// #tab_000002A8AS
			if (ommap[id] != null && ommap[id].getDirty()) {
				$("#progressbar").show();
				var cmd = 0;
				var org = "";
				if (id == "00000000000001C7") {
					// console.log("a");
					cmd = 3;
					org = ommap[id].person;
				} else if (id == "00000000000001CG") {
					cmd = 4;
					org = ommap[id].updatedPersons;
				}
				console.log(org);
				$.post(services.api(cmd), {
					psn : JSON.stringify(org),
				}, function(data) {
					if (data.status == 1) {
						ommap[id].stack.save();
						if (ommap[id].updatedPersons != undefined) {
							ommap[id].updatedPersons = [];
						}
						if (closetab == 1) {// need to close this tab
							parent.cloaseTab(id, anchor);
						}
					} else {

					}
					$("#progressbar").hide();
				});
			}
		});

	};

	// 当编辑被关闭的时候，这个变量会被清除出ommap，以防止内存溢出
	MainContent.prototype.cloaseTab = function(id, anchors) {
		delete ommap[id];
		var anchor = $(anchors); // close tab
		$(anchor.attr('href')).remove(); // remove tab content;
		$(anchors).parent().remove(); // remove tab header <li>;
		// clear property sheet;
		this.clearPropertySheet();
		this.currentProcID = -1;
		$(".nav-tabs li").children('a').first().click();
	};

	MainContent.prototype.addNewTab = function(myTabTitle, myTabID, ownerID,
			type) {
		if (ommap[myTabID] == undefined || ommap[myTabID] == null) {
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

			// 在一个编辑器被打开的时候，就会把这个编辑变量存入ommap中，key就是编辑器所编辑的Model的ID
			// ommap["00000000000001CG"]获取的就是一个编辑器
			if (myTabID == "00000000000001C7") {// new and update
				var p = $(tabcontent).personEditor({ // edit person info
					id : myTabID,
					ownerId : "",
					basicpropsheet : this.basicpropertySheets,
					propsheet : this.propertySheets,
					height : this.tabsHeight,
				});
				ommap[myTabID] = p.data("personEditor");// 把这个编辑变量存入ommap中
				tabcontent.setAttribute("data", myTabID);
				$("#tabcontents").append(tabcontent);
			} else if (myTabID == "00000000000001CG") { // view page
				var p = $(tabcontent).personViewEditor({
					id : myTabID,
					ownerId : "",
					basicpropsheet : this.basicpropertySheets,
					propsheet : this.propertySheets,
					height : this.tabsHeight,
				});
				ommap[myTabID] = p.data("personViewEditor");
				tabcontent.setAttribute("data", myTabID);
				$("#tabcontents").append(tabcontent);
			} else if (myTabID == "00000000000001CH") { // list view page
				var w = document.documentElement.clientWidth;
				var p = $(tabcontent).listViewPaneEditor({
					id : myTabID,
					ownerId : "",
					basicpropsheet : this.basicpropertySheets,
					propsheet : this.propertySheets,
					width : (w - 568),
					height : this.tabsHeight,
				});
				ommap[myTabID] = p.data("listViewPaneEditor");
				tabcontent.setAttribute("data", myTabID);
				$("#tabcontents").append(tabcontent);
			} else if (myTabID == "00000000000001CI") { // file upload page
				var w = document.documentElement.clientWidth;
				var p = $(tabcontent).uploadFileEditor({
					id : myTabID,
					ownerId : "",
					basicpropsheet : this.basicpropertySheets,
					propsheet : this.propertySheets,
					width : (w - 568),
					height : this.tabsHeight,
				});
				ommap[myTabID] = p.data("uploadFileEditor");
				tabcontent.setAttribute("data", myTabID);
				$("#tabcontents").append(tabcontent);
			}
		}
		$('.nav-tabs a[href="#tab_' + myTabID + '"]').tab('show');
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
		bp.style.height = (h - 176) + "px";

		this.tabsHeight = (h - 418); // tabs height
		var adpFrm = document.getElementById("advancedPropFrm");
		adpFrm.style.height = "193px"; // advanced property sheet height
		var adpp = document.getElementById("adpropertysheetPane");
		adpp.style.height = "149px";

		$("#advancedproptabs").children('DIV').each(function(entry) {
			var id = this.getAttribute("data"); // id;
			var t = document.getElementById("tablediv" + id);
			if (t != null) {
				t.style.height = "67px";
			}
		});

		// column resize bar
		var bar1 = document.getElementById("treeviewerFrmBar");
		var bar2 = document.getElementById("basicPropertyFrmBar");
		bar1.style.height = (h - 130) + "px";
		bar2.style.height = (h - 130) + "px";
		$("#tabcontents").children('DIV').each(function(entry) {
			var id = this.getAttribute("data"); // id;
			var t = document.getElementById("convasPane" + id);
			var t1 = document.getElementById("canvasPanel" + id);
			var t2 = document.getElementById("userEditingPanel" + id);
			var p = document.getElementById("accordion" + id);
			var h = document.documentElement.clientHeight;
			if (t != null) {
				// process tab
				t.style.height = (h - 418) + "px";
				// pallette
				if (p != null) {
					p.style.height = (h - 418) + "px";
				}
				// content canvas
				if (t1 != null) {
					t1.style.width = (w - 640) + "px";
				}
				if (t2 != null) {
					t2.style.width = (w - 570) + "px";
				}
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
										var t2 = document
												.getElementById("userEditingPanel"
														+ id);
										if (t != null) {
											t.style.width = (parseInt(t.style.width) - dx)
													+ "px";
										}
										if (t2 != null) {
											t2.style.width = (parseInt(t2.style.width) - dx)
													+ "px";
										}
									});
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
										var t2 = document
												.getElementById("userEditingPanel"
														+ id);
										if (t != null) {
											t.style.width = (parseInt(t.style.width) + dx)
													+ "px";
										}
										if (t2 != null) {
											t2.style.width = (parseInt(t2.style.width) + dx)
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
										var id = this.getAttribute("data"); // id;
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
										var t = document
												.getElementById("convasPane"
														+ id);
										var p = document
												.getElementById("accordion"
														+ id);
										var h = document.documentElement.clientHeight;
										if (t != null) {
											// editor tab
											t.style.height = (parseInt(t.style.height) + dy)
													+ "px";
											// pallette
											if (p != null) {
												p.style.height = (parseInt(p.style.height) + dy)
														+ "px";
											}
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