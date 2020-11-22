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
				name : "svm",
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
							// var instance = $('#treeview')
							// .jstree();
							// var selected = instance
							// .get_selected(true);
							// if (selected.length > 0) {
							// var fold = instance
							// .get_selected(true)[0];
							// var arry = fold.data.split("|");
							// if (arry[0] == "2") {
							// manager.createModelDialog
							// .initData(arry[2]);
							// manager.createModelDialog
							// .show();
							// }
							// }
						},
					},
					"open" : {
						"label" : "打开",
						"action" : function(obj) {
							manager.openTab("1");
						},
					},

				// "delete" : {
				// "label" : "删除",
				// "action" : function(obj) {
				// instance = $('#treeview').jstree();
				// var selected = instance
				// .get_selected(true);
				// if (selected.length > 0) {
				// var parent = instance
				// .get_selected(true)[0];
				// manager.confirmInfoDialog.show(
				// "你确定要删除" + parent.text
				// + "？", 2,
				// parent.id);
				// }
				// },
				// }
				}
			}
		}).on('create_node.jstree', function(e, data) {
		}).on('select_node.jstree', function(e, data) {
			// if (data.node.data != "") {
			// var arry = data.node.data.split("|");
			// if (arry[0] == "2") {
			// manager.createModelDialog.initData(arry[2]);
			// manager.menubar.newItem.removeAttribute("class");// enabled
			// } else {
			// manager.menubar.newItem.className = "disabled";// disabled
			// }
			// }
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
			if (selected != null && arry[0] == "2") {
				window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
						arry[1], arry[0]);
				
				prefer.svm.addId(sel.id);
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
				if (selected != null && arry[i] != "1") {
					window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
							arry[1], arry[0]);
					}
			}
		}else{
			var instance = $('#treeview').jstree(true);
			var sel = instance.get_selected(true)[0];
			if (sel != null) {
				var selected = instance.is_leaf(sel);
				var arry = sel.data.split("|");	
					window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
							arry[1], arry[0]);
			}
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

	MainContent.prototype.saveChange = function(id, closetab, parent) {
	};

	// myTabTitle: tab title, myTabID: released process ID, myOwnerID:
	// organization ID.
	MainContent.prototype.addNewTab = function(tabcontent, myTabTitle, myTabID,
			myOwnerID, type) {
		if (type == "2") {
			var p = $(tabcontent).bpmServerEditor({
				id : myTabID,
				basicpropsheet : this.mainContentPlugin.basicpropertySheets,
				propsheet : this.mainContentPlugin.propertySheets,
				owner : myOwnerID,
				width : this.mainContentPlugin.tabsWidth,
				height : this.mainContentPlugin.tabsHeight,
				ip : "",
			});
			map[myTabID] = p.data("bpmServerEditor");
		} else if (type == "1") {
			var p = $(tabcontent).serverGroupEditor({
				id : myTabID,
				basicpropsheet : this.mainContentPlugin.basicpropertySheets,
				propsheet : this.mainContentPlugin.propertySheets,
				owner : myOwnerID,
				width : this.mainContentPlugin.tabsWidth,
				height : this.mainContentPlugin.tabsHeight,
			});
			map[myTabID] = p.data("serverGroupEditor");
		}
		tabcontent.setAttribute("data", myTabID);
		$("#tabcontents").append(tabcontent);
	};

	MainContent.prototype.doAutoResizeForAdPTabs = function(h, id) {
		var t = document.getElementById("tablediv" + id);
		if (t != null) {
			t.style.height = "67px";
		}
	};

	MainContent.prototype.doAutoResizeForEditorTabs = function(w, h, id) {
		var p = document.getElementById("infoPane" + id);
		var t = document.getElementById("convasPane" + id);
		var t1 = document.getElementById("canvasPanel" + id);
		var t5 = document.getElementById("infoPanel" + id);
		var t4 = document.getElementById("canvasPanelRL" + id);
		if (p != null) {
			// pallette
			p.style.height = (h - 84) + "px";
		}
		if (t != null) {
			t.style.height = (h - 84) + "px";
		}
		if (t1 != null) {
			t1.style.width = w + "px";
		}
		if (t4 != null) {
			t4.style.height = w + "px";
		}
		if (t5 != null) {
			t5.style.width = w + "px";
		}
	};

	MainContent.prototype.doEastResize = function(evt, id, dx) {
		var t = document.getElementById("canvasPanel" + id);
		var t2 = document.getElementById("infoPanel" + id);
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
	};

	MainContent.prototype.doWestResize = function(evt, id, dx) {
		var t = document.getElementById("canvasPanel" + id);
		if (t != null) {
			t.style.width = (parseInt(t.style.width) - dx) + "px";
		}
		var t2 = document.getElementById("infoPanel" + id);
		if (t2 != null) {
			t2.style.width = (parseInt(t2.style.width) - dx) + "px";
		}
		var t1 = document.getElementById("canvasPanelRL" + id);
		if (t1 != null) {
			t1.style.width = (parseInt(t1.style.width) - dx) + "px";
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
		var p = document.getElementById("infoPane" + id);
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