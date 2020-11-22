/**
 * The basic framework plugin form the main content of all subsystems.
 * 
 * @author Dahai Cao created 2018-06-05
 * @version 1.0.0
 * @company XuanQi Hangzhou China
 */
var prefer = new Perference();
var curPrefer = null;// current page
;
(function($, window, document, undefined) {
	var pluginName = "mainContentPlugin";
	var defaults = {
		id : "",
		name : "",
		uid:"",
		parent : "",
		ownerId : "",
	};

	var MContentPlugin = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			name : "",
			uid : "",
			parent : "",
			ownerId : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;	
		this.uid = options.uid;
		this.loadPrefer();
		
		this.basicpropertySheets = null; // basic property setter;
		this.propertySheets = null; // advanced property setter;
		this.init(options);
		this.currentProcID = -1;
		this.tabsHeight = 0;
		
		this.maxsize = 500;
		this.minsize = 100;
		
		this.mousepressed = false;
		
		this.tvDefaultWidth = 250; // current tree viewer width
		this.bpvDefaultWidth = 250; // current tree viewer width
		this.apvDefaultHeight = 242; // current advanced prop viewer height
		this.apvhdDefaultHeight = 41; // current advanced prop viewer height
		
		this.currTVWidth = -1; // current tree viewer width
		this.currBPVWidth = -1; // current basic prop viewer width
		this.currAPVHeight = -1; // current advanced prop viewer height

		window.addEventListener("load", this, false);
		window.addEventListener("resize", this, false);
	};

	MContentPlugin.prototype.init = function(options) {
		var mainframe = document.createElement("DIV");
		this.element.appendChild(mainframe);
		mainframe.className = "container-fluid";
		mainframe.id = "maincontent";
		mainframe.style.minWidth = "700px";
		mainframe.addEventListener('mousedown', this, false);
		mainframe.addEventListener('mousemove', this, false);
		mainframe.addEventListener('mouseup', this, false);

		this.createLeftView(mainframe);
		this.createLeftResizeBar(mainframe);
		this.createMainContentArea(mainframe);
		this.createBottomResizeBar(this.mc);
		this.createAdvancedPropertySheet(this.mc);
		this.createRightResizeBar(mainframe);
		this.createRightView(mainframe);
		// confirm message dialog plugin
		var p2 = $(this.element).confirmInfoDialog({
			id : "005",
			title : "轩琦科技 - 提示",
			parent : this,
		});
		this.confirmInfoDialog = p2.data("confirmInfoDialog");
		this.addListener(this);
	};
	
	MContentPlugin.prototype.loadPrefer = function() {
		if (typeof(Storage) !== undefined) {
			var s = localStorage.getItem(this.uid);//get width and height
			if(s !== null){
				var o = JSON.parse(s);
				prefer.parseFromJSON(o);
			}
			if (this.options.name == "om") {
				curPrefer = prefer.om;
			} else if (this.options.name == "pm") {
				curPrefer = prefer.pm;
			} else if (this.options.name == "fm") {
				curPrefer = prefer.fm;
			} else if (this.options.name == "admin"){
				curPrefer = prefer.admin;
			} else if (this.options.name == "am") {
				curPrefer = prefer.am;
			} else if (this.options.name == "bdm") {
				curPrefer = prefer.bdm;
			} else if (this.options.name == "blm") {
				curPrefer = prefer.blm;
			} else if (this.options.name == "svm") {
				curPrefer = prefer.svm;
			}
		}
	};
	
	MContentPlugin.prototype.savePreferChange = function() {
		if (this.options.name == "om") {
			prefer.om = curPrefer;
		} else if (this.options.name == "pm") {
			prefer.pm = curPrefer;
		}else if (this.options.name == "fm") {
			prefer.fm = curPrefer;
		}else if (this.options.name == "admin") {
			prefer.admin = curPrefer;
		}else if (this.options.name == "am") {
			prefer.am = curPrefer;
		}else if (this.options.name == "bdm") {
			prefer.bdm = curPrefer;
		}else if (this.options.name == "blm") {
			prefer.blm = curPrefer;
		}else if (this.options.name == "svm") {
			prefer.blm = curPrefer;
		}
		var s = JSON.stringify(prefer);
		if (typeof(Storage) !== undefined) {
			var userId=localStorage.getItem("userId");
			localStorage.setItem(userId,s);
		}
	};
	
	MContentPlugin.prototype.createLeftView = function(parent) {
		// left view panel
		this.lvPane = document.createElement("DIV");
		parent.appendChild(this.lvPane);
		this.lvPane.id = "treeviewerFrm";
		this.lvPane.className = "col";
		this.lvPane.style.margin = "0px";
		this.lvPane.style.padding = "0px";

		var treeViewRow = document.createElement("DIV");
		this.lvPane.appendChild(treeViewRow);
		treeViewRow.className = "row";
		treeViewRow.style.margin = "0px";
		treeViewRow.style.padding = "0px";
		
		// tree viewer plugin
		if ($(treeViewRow).treeViewer != undefined) {
			var p = $(treeViewRow).treeViewer({
				title : "组织",
				topparent : this.element,
				parent: this.options.parent,
			});
			this.treeViewer = p.data("treeViewer");
		}
	};
	
	// load tag id from Storage
	MContentPlugin.prototype.loadfromStorage = function(parent) {
		// (1) select Node
		// (2) open (expend) node
		// (3) open editor
		if (parent.openEditor !== undefined) {
			var arr = curPrefer.ids;
			for (var i = 0;i < arr.length;i++) {
			   parent.openEditor(arr[i],i);  // open tag by id
			}
		}		
	};
	MContentPlugin.prototype.createLeftResizeBar = function(parent) {
		this.lBar = document.createElement("DIV");
		parent.appendChild(this.lBar);
		this.lBar.className = "col";
		this.lBar.style.width = "8px";
		this.lBar.style.margin = "0px";
		this.lBar.style.padding = "0px";
		this.lBar.id = "treeviewerFrmBar";
	};
	
	MContentPlugin.prototype.createBottomResizeBar = function(parent) {
		this.bBar = document.createElement("DIV");
		parent.appendChild(this.bBar);
		this.bBar.style.margin = "0px";
		this.bBar.style.padding = "0px";
		this.bBar.style.height = "8px";
		this.bBar.id = "advPropertyFrmBar";
	};

	MContentPlugin.prototype.createRightResizeBar = function(parent) {
		this.rBar = document.createElement("DIV");
		parent.appendChild(this.rBar);
		this.rBar.className = "col";
		this.rBar.style.width = "8px";
		this.rBar.style.margin = "0px";
		this.rBar.style.padding = "0px";
		this.rBar.id = "basicPropertyFrmBar";
	};
	
	MContentPlugin.prototype.createMainContentArea = function(parent) {
		// main content editor area
		this.mc = document.createElement("DIV");
		parent.appendChild(this.mc);
		this.mc.className = "col";
		this.mc.style.margin = "0px";
		this.mc.style.padding = "0px";
		this.mc.id = "maincontentFrm";

		this.contentRow = document.createElement("DIV");
		this.mc.appendChild(this.contentRow);
		this.contentRow.className = "row";
		this.contentRow.id = "canvasarea";
		this.contentRow.style.margin = "0px";
		this.contentRow.style.padding = "0px";

		var tabHeader = document.createElement("UL");
		this.contentRow.appendChild(tabHeader);
		tabHeader.className = "nav nav-tabs main-nav-tabs";
		tabHeader.id = "myTab";
		tabHeader.setAttribute("role", "tablist");

		var that = this;
		$("#myTab").on("click", "a", function(e) {
			e.preventDefault();
			$(this).tab('show');
			var currtabId = $(this).attr('href').substring(5);
			if (that.options.parent != undefined &&
				that.options.parent.clickTab != undefined) {
				that.options.parent.clickTab(currtabId);
			}
		});

		var tabContent = document.createElement("DIV");
		this.contentRow.appendChild(tabContent);
		tabContent.className = "tab-content";
		tabContent.id = "tabcontents";
	};
	
	MContentPlugin.prototype.createAdvancedPropertySheet = function(parent) {
		this.apSheet = document.createElement("DIV");
		parent.appendChild(this.apSheet);
		this.apSheet.className = "row";
		this.apSheet.style.margin = "0px";
		this.apSheet.style.padding = "0px";
		this.apSheet.id = "advancedPropFrm";
		// advanced property sheet plugin
		if ($(this.apSheet).propertySheets != undefined) {
			var p = $(this.apSheet).propertySheets({
				prop : "",
				topparent : this.element,
				ownerId : this.options.ownerId,
			});
			this.propertySheets = p.data("propertySheets");
		}
	};
	 
	MContentPlugin.prototype.createRightView = function(parent) {
		// right view panel for basic property sheet
		this.rvPane = document.createElement("DIV");
		parent.appendChild(this.rvPane);
		this.rvPane.className = "col";
		this.rvPane.style.margin = "0px";
		this.rvPane.style.padding = "0px";
		this.rvPane.id = "basicPropertyFrm";

		this.bpSheet = document.createElement("DIV");
		this.rvPane.appendChild(this.bpSheet);
		this.bpSheet.className = "row";
		this.bpSheet.id = "basicpropertypanel";
		this.bpSheet.style.margin = "0px";
		this.bpSheet.style.padding = "0px";
		// basic property sheet plugin
		if ($(this.bpSheet).basicPropertySheet != undefined) {
			var p1 = $(this.bpSheet).basicPropertySheet({
				prop : "",
				topparent : this.element,
				ownerId : this.options.ownerId,
			});
			this.basicpropertySheets = p1.data("basicPropertySheet");
		}
	};
	
	MContentPlugin.prototype.addListener = function(parent) {
		// get focus on editor tab
		$(".main-nav-tabs").on("click", "a", function(e) { 
			e.preventDefault();
			$(this).tab('show');
			var s = $(this).attr('href');
			var id = s.substring(5);// #tab_000002A8AS
			parent.currentProcID = id;
			$('#treeview').jstree('deselect_all', true);
			var instance = $('#treeview').jstree(true);
			instance.select_node(id);
			if (map[id] != null) {
				map[id].setPropertySheet();
			}
		}).on("click", "span", function() {// close tab.
			var pp = this.getAttribute("data");
			if (map[pp] != null) {
				var dirty = map[pp].getDirty();
				if (dirty) {
					parent.confirmInfoDialog.show("当前模型已经修改，是否保存修改？")
				} else {
					var anchor = $(this).parent();
					parent.cloaseTab(pp, anchor);
				}
			}
		});
	};

	MContentPlugin.prototype.clearPropertySheet = function(e) {
		// basic property
		this.basicpropertySheets.clearSheet();
		this.basicpropertySheets.initSheet();
		// advanced property
		this.propertySheets.clearSheet();
		this.propertySheets.initSheet();
	};

	MContentPlugin.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "load":
			this.autoResize();
			break;
		case "resize":
			this.autoResize();
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
	
	// this method is called by confirm dialog
	MContentPlugin.prototype.doYesAction = function(e) {
		this.confirmInfoDialog.hide();
		this.saveChange(1, this);
	};

	// this method is called by confirm dialog
	MContentPlugin.prototype.doNoAction = function(e) {
		 this.confirmInfoDialog.hide();
		var that = this;
		$(".main-nav-tabs").children('li').each(function(entry) {
			var anchor = $(this).children("a")[0];
			var id = $(anchor).attr('href').substring(5);// #tab_000002A8AS
			if (that.currentProcID == id) {
				that.cloaseTab(id, anchor);
			}
		});
	};

	// this method is called directly by the save button on main menu
	MContentPlugin.prototype.doSaveAction = function() {
		this.saveChange(0, this);
	};

	// if closetab is 1, need to close this tab, otherwise, not close this tab
	MContentPlugin.prototype.saveChange = function(closetab, parent) {
		var that = this;
		$(".main-nav-tabs").children('li').each(function(entry) {
			var anchor = $(this).children("a")[0];
			var id = $(anchor).attr('href').substring(5);// #tab_000002A8AS
			if (map[id] != null && map[id].getDirty()) {
				that.options.parent.saveObjects(id, closetab, parent, anchor);
			}
		});
	};
	
	// remove process tab from tab contents, pid is process id
	MContentPlugin.prototype.removeTab = function(pid) {
		var that = this;
		$(".main-nav-tabs").children('li').each(function(entry) {
			var anchor = $(this).children("a")[0];
			var id = $(anchor).attr('href').substring(5);// #tab_000002A8AS
			if (pid == id) {
				that.cloaseTab(id, anchor);
			}
		});
	};

	MContentPlugin.prototype.cloaseTab = function(id, anchors) {
		delete map[id];
		var anchor = $(anchors); // close tab
		$(anchor.attr('href')).remove(); // remove tab content;
		$(anchors).parent().remove(); // remove tab header <li>;
		// clear property sheet;
		this.clearPropertySheet();
		this.currentProcID = -1;
		$(".main-nav-tabs li").children('a').last().click();
		
		curPrefer.removeId(id); // remove tag by id
		this.savePreferChange();// save tag after remove id
	};

	MContentPlugin.prototype.addNewTab = function(myTabTitle, myTabID, ownerID,
			type) {
		if (map[myTabID] == undefined || map[myTabID] == null) {
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

			this.options.parent.addNewTab(tabcontent, 
					myTabTitle, myTabID, ownerID, type);
			
		}
		this.showTab(myTabID);
	};

	MContentPlugin.prototype.showTab = function(myTabID) {
		$('.main-nav-tabs a[href="#tab_' + myTabID + '"]').tab('show');
	};

	MContentPlugin.prototype.autoResize = function() {
		var that = this;
		// width and height of current browser's content area
		var w = document.documentElement.clientWidth;
		var h = document.documentElement.clientHeight;
		if(curPrefer != null && curPrefer.leftsize!==undefined){
			this.currTVWidth = curPrefer.leftsize;
		}
		if(curPrefer != null && curPrefer.rightsize!==undefined){
			this.currBPVWidth = curPrefer.rightsize;
		}
		if(curPrefer != null && curPrefer.bottomsize!==undefined){
			this.currAPVHeight = curPrefer.bottomsize;
		}
		
		// fixed initial width for left and right view panel
		if (this.currTVWidth !=  -1) {
			this.lvPane.style.width = this.currTVWidth + "px";
		} else {
			this.lvPane.style.width = this.tvDefaultWidth + "px";
		}
		if (this.currBPVWidth !=  -1) {
			this.rvPane.style.width = this.currBPVWidth + "px";
		} else {
			this.rvPane.style.width = this.bpvDefaultWidth + "px";
		}
		// 16 is the width summary of two resize bars
		// 250 is default width of view
		// 546 is 250 x 2 + 16 + 30 (right scroll bar width)
		if (this.currTVWidth ==  -1 && this.currBPVWidth ==  -1) {
			var w1 = w - this.bpvDefaultWidth - this.tvDefaultWidth - 16 - 30 - 20;
			if (w1 > this.minsize) {
				this.mc.style.width = w1 + "px";
			}
		} else if (this.currTVWidth !=  -1 && this.currBPVWidth ==  -1) {
			var w1 = w - this.currTVWidth - this.bpvDefaultWidth - 16 - 30 - 20;
			if (w1 > this.minsize) {
				this.mc.style.width = w1 + "px";
			}
		} else if (this.currTVWidth ==  -1 && this.currBPVWidth !=  -1) {
			var w1 = w - this.tvDefaultWidth - this.currBPVWidth - 16 - 30 - 20;
			if (w1 > this.minsize) {
				this.mc.style.width = w1 + "px";
			}
		} else if (this.currTVWidth !=  -1 && this.currBPVWidth !=  -1) {
			var w1 = w - this.currTVWidth - this.currBPVWidth - 16 - 30 - 20;
			if (w1 > this.minsize) {
				this.mc.style.width = w1 + "px";
			}
		}
		
		// this.bBar.style.width = (w - 564) + "px";
		// fixed initial height for three view panel
		// var ca = document.getElementById("canvasarea");
		// this following objects are not in this plugin
		var tv = document.getElementById("treeview");
		// 176 is 62 (status height) + 42(view header header) + 72(title header)
		tv.style.height = (h - 176) + "px";
		var bp = document.getElementById("basicpropertysheet");
		bp.style.height = (h - 176) + "px";
		var adpFrm = this.apSheet;
		var adpp = document.getElementById("adpropertysheetPane");
		// var adpFrm = document.getElementById("advancedPropFrm");
		// adpFrm.style.height = parseInt(h - 664) + "px";
		// adpp.style.height = this.apvDefaultHeight + "px";
		if (this.currAPVHeight == -1) {
			if (h >= 427) {
				// 285 is 142 (advanced prop viewer panel body body) +
				// 2 (border height)+ 41 (advanced prop viewer header height)
				// 427 is 285 (advance prop viewer height) + 72 (title height) +
				// 8 (bottom bar height) + 62 (Status bar height)
				this.contentRow.style.height = (h - 427) + "px";// main edit
																// area height
			}else {
				this.contentRow.style.height = "0px";
			}
			// this.apvDefaultHeight is 242
			// this.apvhdDefaultHeight is 41
			if (h <= 427) {
				if (h > 186) {
					// 186 is 176 + 10 (main content tab height)
					adpp.style.height = (h - 186)+ "px";
					// 2 is up and bottom's border height;
					adpFrm.style.height = (h - 186 + this.apvhdDefaultHeight + 2) + "px";
				} else {
					adpp.style.height = 1 + "px";
					adpFrm.style.height = 41 + "px";
				}
			} else {
				adpp.style.height = this.apvDefaultHeight+ "px";
				adpFrm.style.height = (this.apvDefaultHeight + this.apvhdDefaultHeight+ 2) + "px";
			}
		} else {
		    var ch = this.currAPVHeight + this.apvhdDefaultHeight + 2 + 72 + 8 + 62;
			if (h >= ch) {
				// 285 is 142 (advanced prop viewer panel body body) +
				// 2 (border height)+ 41 (advanced prop viewer header height)
				// 427 is 285 (advance prop viewer height) + 72 (title height) +
				// 8 (bottom bar height) + 62 (Status bar height)
				// main edit area height
				this.contentRow.style.height = (h - ch) + "px";
			} else {
				this.contentRow.style.height = "0px";
			}
			if (h <= ch) {
				if (h > 186) {
					// 186 is 176 + 10 (main content tab height)
					adpp.style.height = (h - 186)+ "px";
					// 2 is up and bottom's border height;
					adpFrm.style.height = (h - 186 + this.apvhdDefaultHeight + 2) + "px";
				} else {
					adpp.style.height = 1 + "px";
					adpFrm.style.height = 41 + "px";
				}
			} else {
				adpp.style.height = this.currAPVHeight+ "px";
				adpFrm.style.height = (this.currAPVHeight + this.apvhdDefaultHeight+ 2) + "px";
			}
		}

		// fixed column resize bar height
		this.lBar.style.height = (h - 130) + "px";
		this.rBar.style.height = (h - 130) + "px";
		// tabs height
		this.tabsHeight = parseInt(this.contentRow.style.height); 
		this.tabsWidth = parseInt(this.mc.style.width);
		if (this.currAPVHeight != -1)
		    {this.adpHeight = this.currAPVHeight + this.apvhdDefaultHeight+ 2;}
		else
			{this.adpHeight = this.apvDefaultHeight + this.apvhdDefaultHeight+ 2;}
		this.adpWidth = parseInt(this.mc.style.width);

		var that = this;
		$("#advancedproptabs").children('DIV').each(function(entry) {
			that.options.parent.doAutoResizeForAdPTabs(that.adpWidth, that.adpHeight, this.getAttribute("data"));
		});

		$("#tabcontents").children('DIV').each(function(entry) {
			that.options.parent.doAutoResizeForEditorTabs(that.tabsWidth, that.tabsHeight, this.getAttribute("data"));
		});
	};

	MContentPlugin.prototype.doMouseDown = function(evt) {
		// evt.preventDefault();
		this.mouse0 = {
			x : evt.clientX,
			y : evt.clientY,
		};	
		this.mousepressed = true;
		// code below prevents the mouse down from having an effect on the main
		// browser window:
		// if (evt.preventDefault) {
		// evt.preventDefault();
		// } // standard
		// else if (evt.returnValue) {
		// evt.returnValue = false;
		// } // older IE
	};

	MContentPlugin.prototype.doMouseMove = function(evt) {
		// evt.preventDefault();
		this.mouse1 = {
			x : evt.clientX,
			y : evt.clientY,
		};
		var that = this;
		if (this.mousepressed) {
			if (document.body.style.cursor == "e-resize") {
				var dx = this.mouse1.x - this.mouse0.x;
				if ((parseInt(this.rvPane.style.width) - dx) > this.minsize
						&& (parseInt(this.rvPane.style.width) - dx) < this.maxsize) {
					this.rvPane.style.width = (parseInt(this.rvPane.style.width) - dx) + "px";
					// var mc = document.getElementById("maincontentFrm");
					this.mc.style.width = (parseInt(this.mc.style.width) + dx) + "px";
					// var ca = document.getElementById("canvasarea");
					// this.contentRow.style.width =
					// (parseInt(this.contentRow.style.width) + dx) + "px";
					// var adFrm = document.getElementById("advancedPropFrm");
					this.apSheet.style.width = (parseInt(this.apSheet.style.width) + dx)
							+ "px";
					// var adFrmBar =
					// document.getElementById("advPropertyFrmBar");
					this.bBar.style.width = (parseInt(this.bBar.style.width) + dx)
							+ "px";
					$("#tabcontents")
							.children('DIV')
							.each(
									function(entry) {
										that.options.parent.doEastResize(evt, this.getAttribute("data"), dx);
									});
					if (parseInt(this.rvPane.style.width)<this.maxsize)
						this.currBPVWidth = parseInt(this.rvPane.style.width);
					else 
						this.currBPVWidth = this.maxsize;
					this.mouse0.x = this.mouse1.x;
					this.mouse0.y = this.mouse1.y;
					return;
				}
			}
			if (document.body.style.cursor == "w-resize") {
				var dx = this.mouse1.x - this.mouse0.x;
				// var bp = document.getElementById("basicPropertyFrm");
				if ((parseInt(this.lvPane.style.width) + dx) > this.minsize
						&& (parseInt(this.lvPane.style.width) + dx) < this.maxsize) {
					this.lvPane.style.width = (parseInt(this.lvPane.style.width) + dx) + "px";
					// var mc = document.getElementById("maincontentFrm");
					this.mc.style.width = (parseInt(this.mc.style.width) - dx) + "px";
					// /var adFrm = document.getElementById("advancedPropFrm");
					this.apSheet.style.width = (parseInt(this.apSheet.style.width) - dx)
							+ "px";
					// var adPa =
					// document.getElementById("adpropertysheetPane");
					// adPa.style.width = (parseInt(adPa.style.width) - dx) +
					// "px";

					// var adFBar =
					// document.getElementById("advPropertyFrmBar");
					this.bBar.style.width = (parseInt(this.bBar.style.width) - dx)
							+ "px";
					$("#tabcontents")
							.children('DIV')
							.each(
									function(entry) {
										// this.getAttribute("data") is id;
										that.options.parent.doWestResize(evt, this.getAttribute("data"), dx);
									});
					if (parseInt(this.lvPane.style.width)<this.maxsize)
					    this.currTVWidth = parseInt(this.lvPane.style.width);
					else 
						this.currTVWidth = this.maxsize;
					this.mouse0.x = this.mouse1.x;
					this.mouse0.y = this.mouse1.y;
					return;
				}
			}
			if (document.body.style.cursor == "n-resize") {
				var dy = this.mouse1.y - this.mouse0.y;
				var adFrm = this.apSheet;
				if ((parseInt(adFrm.style.height) - dy) > this.minsize
						&& (parseInt(adFrm.style.height) - dy) < this.maxsize) {
					adFrm.style.height = (parseInt(adFrm.style.height) - dy)
							+ "px";
					var adpp = document.getElementById("adpropertysheetPane");
					adpp.style.height = (parseInt(adpp.style.height) - dy)
							+ "px";
					$("#advancedproptabs")
							.children('DIV')
							.each(
									function(entry) {
										// this.getAttribute("data") is id;
										that.options.parent.doSouthResizeForAdPTabs(evt, this.getAttribute("data"), dy);
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
										// this.getAttribute("data") is id;
										that.options.parent.doSouthResizeForEditorTabs(evt, this.getAttribute("data"), dy);
									});
					if (parseInt(adFrm.style.height)<this.maxsize) {
					    this.currAPVHeight = parseInt(adFrm.style.height) - (this.apvhdDefaultHeight + 2);
					} else {
						this.currAPVHeight = this.maxsize - (this.apvhdDefaultHeight + 2);
					}
					this.mouse0.x = this.mouse1.x;
					this.mouse0.y = this.mouse1.y;
					return;
				}
			}
		} else {
			var bar1 = this.lBar.getBoundingClientRect();
			var bar2 = this.rBar.getBoundingClientRect();
			var bar3 = this.bBar.getBoundingClientRect();
			if (this.mouse1.x > bar2.left - 8
					&& this.mouse1.x < bar2.left + bar2.width + 8
					&& this.mouse1.y > bar2.top
					&& this.mouse1.y < bar2.top + bar2.height) {
				document.body.style.cursor = "e-resize";
			} else if (this.mouse1.x > bar1.left - 8
					&& this.mouse1.x < bar1.left + bar1.width + 8
					&& this.mouse1.y > bar1.top
					&& this.mouse1.y < bar1.top + bar1.height) {
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

	MContentPlugin.prototype.doMouseUp = function(evt) {
		evt.preventDefault();
		this.mousepressed = false;		
		var type = Utils.browserType();
		if (!this.mousepressed) {
			if (type!=="0") {
				if (document.body.style.cursor == "e-resize") {
					// saving
					var bpFrm = $("#basicPropertyFrm").width();
					curPrefer.rightsize = bpFrm;
				} else if (document.body.style.cursor == "w-resize") {
					// saving
					var tvFrm =$("#treeviewerFrm").width();
					curPrefer.leftsize = tvFrm;
				} else if (document.body.style.cursor == "n-resize") {
					// saving
					var apFrm = $("#adpropertysheetPane").height();
					curPrefer.bottomsize = apFrm;
				}
				this.savePreferChange();
			}
		}	
		// this.options.parent.doMouseUp(evt);
		if (evt.preventDefault) {
			evt.preventDefault();
		} else if (evt.returnValue) {
			evt.returnValue = false;
		} // older IE
		this.mouse0 = null;
		this.mouse1 = null;
		
		// code below prevents the mouse down from having an effect on the main
		// browser window:
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new MContentPlugin(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);