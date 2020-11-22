/**
 * 
 */
var map = {};
;
(function($, window, document, undefined) {
	var pluginName = "amMainContent";
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
		this.contentRow;
		this.init(options);
		this.currentObjId = -1;
		this.menubar = null;

	};

	MainContent.prototype.init = function(options) {
		if ($(this.element).mainContentPlugin != undefined) {
			var p4 = $(this.element).mainContentPlugin({
				id : options.id,
				name : "am",
				uid : options.uid,
				parent : this,
			});
			this.mainContentPlugin = p4.data("mainContentPlugin");
		}
		// create new model dialog plugin
		var p4 = $(this.element).createModelDialog({
			id : "034",
			title : "轩琦科技 - 新建",
			parent : this,
		});
		this.createModelDialog = p4.data("createModelDialog");
		// rename dialog
		var p5 = $(this.element).renameEditDialog({
			id : "009",
			title : "轩琦科技 - 重命名",
			parent : this,
			topparent : this.element,
			url : this.domainname,
		});
		this.renameDialog = $(this.element).data("renameEditDialog");
		var p = document.createElement("DIV");
		this.element.appendChild(p);
		// confirm message dialog plugin
		var p2 = $(p).confirmInfoDialog({
			id : "005",
			title : "轩琦科技 - 提示",
			parent : this,
		});
		this.confirmInfoDialog = p2.data("confirmInfoDialog");
	};

	MainContent.prototype.loadTreeViewer = function(parent) {
		var that = this;
		var instance = $(parent).jstree({
			"core" : {
				"multiple" : false,
				"check_callback" : true,
				"data" : {
					"url" : service.api(0),
					"dataType" : "json" // needed only if you do not
				}
			},
			"plugins" : [ "contextmenu", "dnd" ],
			"contextmenu" : {
				'items' : that.customMenu,
			}
		}).on('create_node.jstree', function(e, data) {
		}).on('select_node.jstree', function(e, data) {
			if (data.node.data != "") {
				var arry = data.node.data.split("|");
				if (arry[0] == "2") {
					that.menubar.newItem.removeAttribute("class");// enabled
				} else if (arry[0] == "3" && arry[2] == "5") {
					var instance = $('#treeview').jstree(true);
					var sel = instance.get_selected(true)[0];
					if (!instance.is_parent(sel))
						that.menubar.newItem.removeAttribute("class");// enabled
					else
						that.menubar.newItem.className = "disabled";// disabled
				} else {
					that.menubar.newItem.className = "disabled";// disabled
				}
			}
		}).on('load_node.jstree', function(e, data) {
			$(instance).jstree('open_all');
			that.mainContentPlugin.loadfromStorage(that);
		}).on("dblclick.jstree", this.dblclickJSTree);
	};

	MainContent.prototype.customMenu = function(node) {
		var arry = node.data.split("|");
		var items = {
			"create" : {
				"label" : "新建",
				"icon" : "fa fa-plus",
				"action" : function(obj) {// obj is action object
					window.main.createModelDialog.show(node);
				},
			},
			"open" : {
				"label" : "打开",
				"action" : function(obj) {
					window.main.openOneEditor(node);
				},
			},
			"rename" : {
				"separator_before" : true,
				"separator_after" : true,
				"label" : "重命名",
				"action" : function(obj) {
					if (map[node.id] == null) {
						window.main.renameDialog.setEntityId(node.id,
								node.text, node.data);
					} else {
						window.main.renameDialog
								.setEntity(map[node.id].currObject);
					}
					window.main.renameDialog.show();
				},
			},
			"remove" : {
				"label" : "删除",
				"icon" : "fa fa-remove",
				"disabled" : "true",
				"action" : function(obj) {
					window.main.confirmInfoDialog.show("您确定要删除" + node.text
							+ "？", 2, node.id, arry[1], "0");
				},
			}
		}
		if (arry[0] == "1") {
			delete items.create;
			delete items.open;
			delete items.remove;
			delete items.rename;
		} else if (arry[0] == "2") {
			delete items.open;
			if (arry[3] == "0") {
				delete items.remove;
				delete items.rename;
			}
		} else if (arry[0] == "3") {
			if (arry[2] != "5")
				delete items.create;
		}
		return items;
	};

	MainContent.prototype.dblclickJSTree = function(e) {
		e.preventDefault();
		var instance = $('#treeview').jstree(true);
		var sel = instance.get_selected(true)[0];
		if (sel != null) {
			var arry = sel.data.split("|");
			if (arry[0] == "3") {
				window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
						arry[1], arry[2]);
				window.main.savePrefer(sel.id);
			}
		}
	};

	MainContent.prototype.savePrefer = function(id) {
		prefer.am.addId(id);
		var s = JSON.stringify(prefer);
		if (typeof (Storage) !== undefined) {
			var userId = localStorage.getItem("userId");
			localStorage.setItem(userId, s);
		}
	};

	MainContent.prototype.openOneEditor = function(node) {
		var arry = node.data.split("|");
		window.main.mainContentPlugin.addNewTab(node.text, node.id, arry[1],
				arry[2]);
		window.main.savePrefer(node.id);
	};

	MainContent.prototype.openEditor = function(eid, i) {
		if (eid != null && eid != "") {
			var d = $('#treeview').jstree('get_node', eid);
			var instance = $('#treeview').jstree(true);
			var s = instance.select_node(eid);
			var sel = instance.get_selected(true)[i];
			if (sel != null) {
				var arry = sel.data.split("|");
				if (arry[0] == "3") {
					window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
							arry[1], arry[2]);
				}
			}
		}
	};

	MainContent.prototype.create = function(parent, obj, type, ownerid) {
		$("#progressbar").show();
		var that = this;
		$.post(service.api(4), {
			appobj : JSON.stringify(obj),
		}, function(node) {
			var arry = node.data.split("|");
			var instance = $('#treeview').jstree();
			instance.create_node(parent, node, "last");
			instance.redraw(true);
			$('#treeview').jstree('deselect_all', true);
			$('#treeview').jstree('select_node', node.id);
			that.mainContentPlugin.addNewTab(node.text, node.id, arry[1],
					arry[2]);
			$("#progressbar").hide();
			that.savePrefer(node.id);
		});
	};

	// f: 0: it is process; 1: it is folder
	MainContent.prototype.doYesAction = function(e, type, id, oid, f) {
		this.confirmInfoDialog.hide();
		if (type == 1) { // template modify saving
			this.mainContentPlugin.saveChange(1, this);
		} else if (type == 2) { // template/service deletion
			if (f == 0) { // delete one process
				var instance = $('#treeview').jstree(true);
				var sel = instance.get_selected(true)[0];
				var arry = sel.data.split("|");
				var that = this;
				$("#progressbar").show();
				$.post(service.api(23), {
					id : id,
					etype : arry[2],
					oid : oid,
				}).complete(function(data) {
					$("#progressbar").hide();
					instance = $('#treeview').jstree();
					var p = instance.get_selected(true)[0];
					$('#treeview').jstree('delete_node', p);
					that.mainContentPlugin.removeTab(id);
				});
			}
		}
	};

	MainContent.prototype.doNoAction = function(e) {
		this.confirmInfoDialog.hide();
	};

	// entity: the renamed object;
	// entityId: the renamed folder id or object id;
	MainContent.prototype.doRenameAction = function(entity, entityId, newname) {
		if (entity != null) {
			map[entity.id].stack.execute(new AMRenameCmd(entity, newname));
		} else if (entityId != null) {
			// update treeview
			var instance = $('#treeview').jstree();
			$('#treeview').jstree('deselect_all', true);
			$('#treeview').jstree('select_node', entityId);
			var node = instance.get_selected(true)[0];
			node.text = newname;
			var arry = node.data.split("|");
			instance.redraw(true);
			// update to repository via web service.
			if (!this.renameDialog.isFolder) { // the node is folder
				this.updateName(entityId, Utils.stringify(newname), arry[2],
						Utils.getCurrentDateTime());
			}
		}
	};

	MainContent.prototype.updateName = function(id, name, ctype, lastupdatetime) {
		$("#progressbar").show();
		$.post(service.api(24), {
			id : id,
			ename : name,
			ctype : ctype,
			lastupdate : lastupdatetime,
		}, function(x) {
			$("#progressbar").hide();
		});
	};

	MainContent.prototype.doSaveAction = function() {
		this.mainContentPlugin.saveChange(0, this);
	};

	MainContent.prototype.doCreateNewAction = function() {
		var instance = $('#treeview').jstree(true);
		var sel = instance.get_selected(true)[0];
		this.createModelDialog.show(sel);
	};

	MainContent.prototype.saveObjects = function(id, closetab, parent, anchor) {
		var api = 0;
		if (map[id].currObject instanceof SMSTemplate) {
			api = 7;
		} else if (map[id].currObject instanceof EmailTemplate) {
			api = 8;
		//} else if (map[id].currObject instanceof JavaAppService) {
		//	api = 14;
		} else if (map[id].currObject instanceof WebAppService) {
			api = 16;
		} else if (map[id].currObject instanceof ServiceContainer) {
			api = 22;
		} else if (map[id].currObject instanceof AndroidAppPlugin) {
			api = 32;
		}
		$.post(service.api(api), {
			t : JSON.stringify(map[id].currObject),
		}, function(data) {
			map[id].stack.save();
			// need to close this tab
			if (closetab == 1) {
				parent.cloaseTab(id, anchor);
			}
			$("#progressbar").hide();
		});
	};

	// myTabTitle: tab title, myTabID: process ID, myOwnerID: organization ID.
	MainContent.prototype.addNewTab = function(tabcontent, myTabTitle, myTabID,
			myOwnerID, type) {
		if (type == "1") {
			var p = $(tabcontent).amSMSTemplateEditor({
				id : myTabID,
				basicpropsheet : this.mainContentPlugin.basicpropertySheets,
				propsheet : this.mainContentPlugin.propertySheets,
				owner : myOwnerID,
				width : this.mainContentPlugin.tabsWidth,
				height : this.mainContentPlugin.tabsHeight,
			});
			tabcontent.setAttribute("data", myTabID);
			map[myTabID] = p.data("amSMSTemplateEditor");
		} else if (type == "2") {
			var p = $(tabcontent).amEmailTemplateEditor({
				id : myTabID,
				basicpropsheet : this.mainContentPlugin.basicpropertySheets,
				propsheet : this.mainContentPlugin.propertySheets,
				owner : myOwnerID,
				width : this.mainContentPlugin.tabsWidth,
				height : this.mainContentPlugin.tabsHeight,
			});
			tabcontent.setAttribute("data", myTabID);
			map[myTabID] = p.data("amEmailTemplateEditor");
		} else if (type == "4") {
			var instance = $('#treeview').jstree();
			var root = instance.get_node("#");
			var children = root.children;
			var orgName = "";
			for (var i = 0; i < children.length; i++) {
				if (children[i] == myOwnerID) {
					var ch = instance.get_node(myOwnerID);
					orgName = ch.text;
					break;
				}
			}
			
			var p = $(tabcontent).amMicroServiceEditor({
				id : myTabID,
				userId : this.options.uid,
				userfullname : this.options.uname,
				ownername : orgName,
				basicpropsheet : this.mainContentPlugin.basicpropertySheets,
				propsheet : this.mainContentPlugin.propertySheets,
				owner : myOwnerID,
				width : this.mainContentPlugin.tabsWidth,
				height : this.mainContentPlugin.tabsHeight,
			});
			tabcontent.setAttribute("data", myTabID);
			map[myTabID] = p.data("amMicroServiceEditor");
		} else if (type == "5") {
			var p = $(tabcontent).amMSServerEditor({
				id : myTabID,
				basicpropsheet : this.mainContentPlugin.basicpropertySheets,
				propsheet : this.mainContentPlugin.propertySheets,
				owner : myOwnerID,
				width : this.mainContentPlugin.tabsWidth,
				height : this.mainContentPlugin.tabsHeight,
			});
			tabcontent.setAttribute("data", myTabID);
			map[myTabID] = p.data("amMSServerEditor");
        } else if (type == "6") {
			var instance = $('#treeview').jstree();
			var root = instance.get_node("#");
			var children = root.children;
			var orgName = "";
			for (var i = 0; i < children.length; i++) {
				if (children[i] == myOwnerID) {
					var ch = instance.get_node(myOwnerID);
					orgName = ch.text;
					break;
				}
			}


			var p = $(tabcontent).amAndroidAppMSPluginEditor({
                id : myTabID,
				userId : this.options.uid,
				userfullname : this.options.uname,
				ownername : orgName,
				basicpropsheet : this.mainContentPlugin.basicpropertySheets,
                propsheet : this.mainContentPlugin.propertySheets,
                owner : myOwnerID,
                width : this.mainContentPlugin.tabsWidth,
                height : this.mainContentPlugin.tabsHeight,
            });
            tabcontent.setAttribute("data", myTabID);
            map[myTabID] = p.data("amAndroidAppMSPluginEditor");
		}
		$("#tabcontents").append(tabcontent);
	};

	MainContent.prototype.doAutoResizeForAdPTabs = function(w, h, id) {
		var t = document.getElementById("tablediv" + id);
		if (t != null) {
			t.style.height = (h - 72) + "px";
		}
		var t1 = document.getElementById("resultdiv" + id);
		if (t1 != null) {
			t1.style.height = (h - 46) + "px";
		}
	};

	MainContent.prototype.doAutoResizeForEditorTabs = function(w, h, id) {
		var t = document.getElementById("convasPane" + id);
		if (t != null) {
			t.style.height = (h - 84) + "px";
		}
		var aap1 = document.getElementById("accAppPane1" + id);
		if (aap1) {
			aap1.style.height = (h - 84) + "px";
		}
		var aap2 = document.getElementById("accAppPane2" + id);
		if (aap2) {
			aap2.style.height = (h - 84) + "px";
		}
		var aap3 = document.getElementById("accAppPane3" + id);
		if (aap3) {
			aap3.style.height = (h - 84) + "px";
		}
		var aap4 = document.getElementById("accAppPane4" + id);
		if (aap4) {
			aap4.style.height = (h - 130) + "px";
		}
		var aap4 = document.getElementById("accAppPane4mstab" + id);
		if (aap4) {
			aap4.style.height = (h - 130) + "px";
		}
		if (aap4) {
			aap4.style.width = w + "px";
		}
		var aap5 = document.getElementById("accAppPane3Div4" + id);
		if (aap5) {
			aap5.style.width = w + "px";
		}
		var aap6 = document.getElementById("webappPanel" + id);
		if (aap6) {
			aap6.style.width = w + "px";
		}
		var aap6 = document.getElementById("webappPane" + id);
		if (aap6) {
			aap6.style.height = (h - 84) + "px";
		}
		var t2 = document.getElementById("authTabBodyHA" + id);
		if (t2 != null) {
			t2.style.height = (h - 340) + "px";
		}
		var aap7 = document.getElementById("fileManagePanel" + id);
		if (aap7) {
			aap7.style.width = w + "px";
		}
		var aap8 = document.getElementById("filetreePane" + id);
		if (aap8) {
			aap8.style.height = (h - 130) + "px";
		}

		var aap9 = document.getElementById("visitcount" + id);
		if (aap9) {
			aap9.style.height = (h - 130) + "px";
		}
		var aap10 = document.getElementById("visitingEditingPanel" + id);
		if (aap10) {
			aap10.style.width = w + "px";
		}
	};

	MainContent.prototype.doEastResize = function(evt, id, dx) {
		var aap3 = document.getElementById("accAppPane3Div4" + id);
		if (aap3 != null) {
			aap3.style.width = (parseInt(aap3.style.width) + dx) + "px";
		}
		var aap4 = document.getElementById("webappPanel" + id);
		if (aap4) {
			aap4.style.width = (parseInt(aap4.style.width) + dx) + "px";
		}
		var aap5 = document.getElementById("accAppPane4" + id);
		if (aap5 != null) {
			aap5.style.width = (parseInt(aap5.style.width) + dx) + "px";
		}
		var t1 = document.getElementById("listFilePane" + id);
		if (t1 != null) {
			t1.style.width = (parseInt(t1.style.width) + dx) + "px";
		}
		var aap7 = document.getElementById("fileManagePanel" + id);
		if (aap7) {
			aap7.style.width = (parseInt(aap7.style.width) + dx) + "px";
		}
		var aap8 = document.getElementById("visitingEditingPanel" + id);
		if (aap8) {
			aap8.style.width = (parseInt(aap8.style.width) + dx) + "px";
		}
	};

	MainContent.prototype.doWestResize = function(evt, id, dx) {
		var t1 = document.getElementById("filemanage" + id);
		if (t1 != null) {
			t1.style.width = (parseInt(t1.style.width) - dx) + "px";
		}
		var aap1 = document.getElementById("accAppPane3Div4" + id);
		if (aap1 != null) {
			aap1.style.width = (parseInt(aap1.style.width) - dx) + "px";
		}
		var aap1 = document.getElementById("accAppPane1" + id);
		if (aap1) {
			aap1.style.width = (parseInt(aap1.style.width) - dx) + "px";
		}
		var aap2 = document.getElementById("accAppPane2" + id);
		if (aap2) {
			aap2.style.width = (parseInt(aap2.style.width) - dx) + "px";
		}
		var aap3 = document.getElementById("accAppPane3" + id);
		if (aap3) {
			aap3.style.width = (parseInt(aap3.style.width) - dx) + "px";
		}
		var aap4 = document.getElementById("webappPanel" + id);
		if (aap4) {
			aap4.style.width = (parseInt(aap4.style.width) - dx) + "px";
		}
		var aap7 = document.getElementById("fileManagePanel" + id);
		if (aap7) {
			aap7.style.width = (parseInt(aap7.style.width) - dx) + "px";
		}
		var aap8 = document.getElementById("visitingEditingPanel" + id);
		if (aap8) {
			aap7.style.width = (parseInt(aap8.style.width) - dx) + "px";
		}
	};

	MainContent.prototype.doSouthResizeForAdPTabs = function(evt, id, dy) {
		var t = document.getElementById("tablediv" + id);
		if (t != null) {
			t.style.height = (parseInt(t.style.height) - dy) + "px";
		}
		var t1 = document.getElementById("resultdiv" + id);
		if (t1 != null) {
			t1.style.height = (parseInt(t1.style.height) - dy) + "px";
		}
	};

	MainContent.prototype.doSouthResizeForEditorTabs = function(evt, id, dy) {
		var t3 = document.getElementById("authTabBodyHA" + id);
		if (t3 != null) {
			t3.style.height = (parseInt(t3.style.height) + dy) + "px";
		}
		var t = document.getElementById("convasPane" + id);
		if (t != null) {
			t.style.height = (parseInt(t.style.height) + dy) + "px";
		}
		var t = document.getElementById("emailEditorPane" + id);
		var h = document.documentElement.clientHeight;
		if (t != null) {
			t.style.height = (parseInt(t.style.height) + dy) + "px";
			if (map[id].enditorInstance != undefined
					&& map[id].enditorInstance != null) {
				map[id].enditorInstance.resize(parseInt(t.style.width),
						(parseInt(t.style.height) + dy), true, false);
			}
		}
		var t2 = document.getElementById("fileconstent" + id);
		if (t2 != null) {
			t2.style.height = (parseInt(t2.style.height) + dy) + "px";
		}
		
		var t3 = document.getElementById("lc" + id);
		if (t3 != null) {
			t3.style.height = (parseInt(t3.style.height) + dy) + "px";
		}
		
		var t4 = document.getElementById("listFilePane" + id);
		if (t4 != null) {
			t4.style.height = (parseInt(t4.style.height) + dy) + "px";
			}
		
		var aap1 = document.getElementById("accAppPane1" + id);
		if (aap1) {
			aap1.style.height = (parseInt(aap1.style.height) + dy) + "px";
		}
		var aap2 = document.getElementById("accAppPane2" + id);
		if (aap2) {
			aap2.style.height = (parseInt(aap2.style.height) + dy) + "px";
		}
		var aap3 = document.getElementById("accAppPane3" + id);
		if (aap3) {
			aap3.style.height = (parseInt(aap3.style.height) + dy) + "px";
		}
		var aap6 = document.getElementById("webappPane" + id);
		if (aap6) {
			aap6.style.height = (parseInt(aap6.style.height) + dy) + "px";
		}
		var aap4 = document.getElementById("accAppPane4" + id);
		if (aap4) {
			aap4.style.height = (parseInt(aap4.style.height) + dy) + "px";
		}
		var aap41 = document.getElementById("lcmstab2" + id);
		if (aap41) {
			aap41.style.height = (parseInt(aap41.style.height) + dy) + "px";
		}
		var aap42 = document.getElementById("fileconstentmstab2" + id);
		if (aap42) {
			aap42.style.height = (parseInt(aap42.style.height) + dy) + "px";
		}
		var aap5 = document.getElementById("tabledivH" + id);
		if (aap5) {
			var dhPane = document.getElementById("reqHeaderH" + id);
			var h = (parseInt(aap5.style.height) + dy);
			if (h > 50) {
				dhPane.style.display = "";
			} else {
				dhPane.style.display = "none";
			}
			aap5.style.height = (h) + "px";
		}
		var aap7 = document.getElementById("prP" + id);
		if (aap7) {
			aap7.style.height = (parseInt(aap7.style.height) + dy) + "px";
		}
		var aap8 = document.getElementById("prFD" + id);
		if (aap8) {
			aap8.style.height = (parseInt(aap8.style.height) + dy) + "px";
		}


		var aap9 = document.getElementById("filetreePane" + id);
		if (aap9) {
			aap9.style.height = (parseInt(aap9.style.height) + dy) + "px";
		}

		var aap9 = document.getElementById("serviceTreeViewer" + id);
		if (aap9) {
			aap9.style.height = (parseInt(aap9.style.height) + dy) + "px";
		}

		var aap10 = document.getElementById("visitcount" + id);
		if (aap10) {
			aap10.style.height = (parseInt(aap10.style.height) + dy) + "px";
		}

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