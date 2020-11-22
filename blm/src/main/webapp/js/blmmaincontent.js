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
	};

	var MainContent = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			uid : "",
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
				name : "blm",
				uid : options.uid,
				parent : this,
			});
			this.mainContentPlugin = p4.data("mainContentPlugin");
		}
		// // create new model dialog plugin
		// var p4 = $(this.element).createModelDialog({
		// id : "004",
		// title : "轩琦科技 - 新建",
		// parent : this,
		// });
		// this.createModelDialog = p4.data("createModelDialog");
	};

	MainContent.prototype.loadTreeViewer = function(parent) {
		var that = this;
		var instance = $(parent)
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
							that.menubar.newItem.removeAttribute("class");// enabled
						} else {
							that.menubar.newItem.className = "disabled";// disabled
						}
					}
				}).on('load_node.jstree', function(e, data) {
					that.mainContentPlugin.loadfromStorage(that);
				}).on("dblclick.jstree", this.dblclickJSTree);

	};

	MainContent.prototype.dblclickJSTree = function(e) {
		e.preventDefault();
		var instance = $('#treeview').jstree(true);
		var sel = instance.get_selected(true)[0];
		if (sel != null) {
			var selected = instance.is_leaf(sel);
			var arry = sel.data.split("|");
			if (selected != null && arry[0] == "3") {
				window.main.mainContentPlugin.addNewTab(sel.text, sel.id, arry[1], arry[3]);
				
				prefer.blm.addId(sel.id);
				var s = JSON.stringify(prefer);
				if(typeof(Storage)!==undefined){
				var userId = localStorage.getItem("userId");
					localStorage.setItem(userId,s);
				}
			}
		}
	};

	MainContent.prototype.openEditor = function(eid,i) {
		if(eid != "" || eid != null) {	
			var d =$('#treeview').jstree('get_node',eid);
			var instance = $('#treeview').jstree(true);	
			var s = instance.select_node(eid);
			var sel = instance.get_selected(true)[i];
			if (sel != null) {
				var selected = instance.is_leaf(sel);
				var arry = sel.data.split("|");
				if (selected != null && arry[0] == "3") {
					window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
							arry[1], arry[3]);
				}
			}
		}else{
			var instance = $('#treeview').jstree(true);
			var sel = instance.get_selected(true)[0];
			if (sel != null) {
				var selected = instance.is_leaf(sel);
				var arry = sel.data.split("|");
				if (selected != null && arry[0] != "3") {
					window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
							arry[1], arry[3]);
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


	MainContent.prototype.doYesAction = function(e, type, pid, orgid) {
//		this.confirmInfoDialog.hide();
//		if (type == 1) { // process modify
//			this.saveChange(1, this);
//		} else if (type == 2) { // process deletion
//			// close process
//			this.removeTab(pid);
//			$("#progressbar").show();
//			// delete process
//			$.post(service.api(15), {
//				id : pid,
//				oid : orgid,
//			}).complete(function(data) {
//				$("#progressbar").hide();
//			});
//			// remove a node.
//			instance = $('#treeview').jstree();
//			var p = instance.get_selected(true)[0];
//			$('#treeview').jstree('delete_node', p);
//		}
	};

	MainContent.prototype.doNoAction = function(e, type, pid) {
//		this.confirmInfoDialog.hide();
//		if (type == 1) { // process modify
//			this.removeTab(pid);
//		} else if (type == 2) { // process deletion
//			// nothing...
//			this.removeTab(pid);
//		}
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
//		$(".maincontent-nav-tabs").children('li').each(function(entry) {
//			var anchor = $(this).children("a")[0];
//			var s = $(anchor).attr('href');
//			// #tab_000000000002A8AS (#tab_+process ID)
//			var id = $(anchor).attr('href').substring(5);
//			if (map[id].getDirty()) {
//				parent.saveObject(id, anchor, closetab);
//			}
//		});
	};

	MainContent.prototype.saveObject = function(id, anchor, closetab) {
//		var that = this;
//		$("#progressbar").show();
//		var cmd = 0;
//		if (map[id].wfprocess instanceof WfProcess) {
//			cmd = 5;
//		} else if (map[id].wfprocess instanceof ReleasedWfProcess) {
//			cmd = 22;
//		}
//		var process1 = map[id].wfprocess.stringifyforJSON();
//		$.post(service.api(cmd), {
//			process : JSON.stringify(process1),
//		}, function(data) {
//			map[id].stack.save();
//			if (closetab == 1) {
//				that.cloaseTab(id, anchor);
//			}
//			$("#progressbar").hide();
//			// that.allSaved();
//		});
	};

	// myTabTitle: tab title, myTabID: process ID, myOwnerID: organization ID.
	MainContent.prototype.addNewTab = function(tabcontent, myTabTitle, myTabID,
			myOwnerID) {
	};

	MainContent.prototype.doAutoResizeForAdPTabs = function(h, id) {
		var t = document.getElementById("tablediv" + id);
		if (t != null) {
			t.style.height = "67px";
		}
	};

	MainContent.prototype.doAutoResizeForEditorTabs = function(w, h, id) {
		var p = document.getElementById("accordion" + id);
		var t = document.getElementById("convasPane" + id);
		var t1 = document.getElementById("canvasPanel" + id);

		var t5 = document.getElementById("rlpcanvasPanel" + id);
		var t4 = document.getElementById("rlprocPane" + id);

		var t2 = document.getElementById("rlprocCanvasPanel" + id);
		var t3 = document.getElementById("rlprocConvasPane" + id);
		if (p != null) {
			p.style.height = (h - 84) + "px";
		}
		if (t != null) {
			// 84 is toolbar height + tab height;
			t.style.height = (h - 84) + "px";
		}
		if (t1 != null) {
			// 76 is 70(pallet width) + 2(border) + 4(gap)
			t1.style.width = (w - 76) + "px";
		}
		if (t4 != null) {
			t4.style.height = (h - 84) + "px";
		}
		if (t5 != null) {
			t5.style.width = (w - 2) + "px";
		}
		// 130 is 126 (2 tab height + tool bar height)
		// + 4 (2 gap height + 2 tab border height)
		if (t2 != null) {
			t2.style.width = (w - 2) + "px";
		}
		if (t3 != null) {
			t3.style.height = (h - 130) + "px";
		}
	};

	MainContent.prototype.doEastResize = function(evt, id, dx) {
		var t = document.getElementById("canvasPanel" + id);
		var t2 = document.getElementById("rlprocCanvasPanel" + id);
		var t4 = document.getElementById("rlprocPane" + id);
		if (t != null) {
			t.style.width = (parseInt(t.style.width) + dx) + "px";
		}
		if (t2 != null) {
			t2.style.width = (parseInt(t2.style.width) + dx) + "px";
		}
		if (t4 != null) {
			t4.style.width = (parseInt(t4.style.width) + dx) + "px";
		}
		var t5 = document.getElementById("rlpcanvasPanel" + id);
		if (t5 != null) {
			t5.style.width = (parseInt(t5.style.width) + dx) + "px";
		}
	};

	MainContent.prototype.doWestResize = function(evt, id, dx) {
		var t = document.getElementById("canvasPanel" + id);
		var t2 = document.getElementById("rlprocCanvasPanel" + id);
		var t4 = document.getElementById("rlprocPane" + id);
		if (t != null) {
			t.style.width = (parseInt(t.style.width) - dx) + "px";
		}
		if (t2 != null) {
			t2.style.width = (parseInt(t2.style.width) - dx) + "px";
		}
		if (t4 != null) {
			t4.style.width = (parseInt(t4.style.width) - dx) + "px";
		}
		var t5 = document.getElementById("rlpcanvasPanel" + id);
		if (t5 != null) {
			t5.style.width = (parseInt(t5.style.width) - dx) + "px";
		}
	};

	MainContent.prototype.doSouthResizeForAdPTabs = function(evt, id, dy) {
		var t = document.getElementById("tablediv" + id);
		if (t != null) {
			t.style.height = (parseInt(t.style.height) - dy) + "px";
		}
	};

	MainContent.prototype.doSouthResizeForEditorTabs = function(evt, id, dy) {
		var t = document.getElementById("convasPane" + id);
		var p = document.getElementById("accordion" + id);
		var t1 = document.getElementById("rlprocPane" + id);
		var t4 = document.getElementById("rlprocConvasPane" + id);
		if (t != null) {
			t.style.height = (parseInt(t.style.height) + dy) + "px";
		}
		if (p != null) {
			p.style.height = (parseInt(p.style.height) + dy) + "px";
		}
		if (t1 != null) {
			t1.style.height = (parseInt(t1.style.height) + dy) + "px";
		}
		if (t4 != null) {
			// editor tab
			t4.style.height = (parseInt(t4.style.height) + dy) + "px";
		}
	};

	MainContent.prototype.doMouseUp = function(evt) {
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