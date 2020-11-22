/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "pointUIEditPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var EditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.selComponent = null;
		this.selVar = null;
		this.entity = options.entity;
		this.init(options);
	};

	EditPanel.prototype.loadPane = function(entity) {
		this.entity = entity;
		this.init(this.options);
	};

	EditPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		modalframe.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		modalframe.style.padding = "4px";
		this.element.appendChild(modalframe);

		var form1 = document.createElement("form");
		modalframe.appendChild(form1);
		form1.className = "form-horizontal";

		// default value
		var group3 = document.createElement("div");
		form1.appendChild(group3);
		group3.className = "form-group";

		var div1 = document.createElement("div");
		group3.appendChild(div1);
		div1.className = "col-sm-12 radio";

		var label3 = document.createElement("label");
		div1.appendChild(label3);

		this.optionInput1 = document.createElement("INPUT");
		label3.appendChild(this.optionInput1);
		this.optionInput1.type = "radio";
		this.optionInput1.name = "uitype" + options.id;
		this.optionInput1.id = "uitype1" + options.id;
		this.optionInput1.value = "0";
		this.optionInput1.addEventListener("click", this, false);
		label3.appendChild(document.createTextNode("外部系统界面网址"));

		var group4 = document.createElement("div");
		form1.appendChild(group4);
		group4.className = "form-group";

		var urlLabel = document.createElement("label");
		group4.appendChild(urlLabel);

		urlLabel.setAttribute("for", "urlvalue" + options.id);
		urlLabel.className = "col-sm-2 control-label";
		urlLabel.innerHTML = "界面链接（URL）";

		var urlDiv = document.createElement("DIV");
		group4.appendChild(urlDiv);
		urlDiv.className = "col-sm-10";

		this.urlInput = document.createElement("INPUT");
		urlDiv.appendChild(this.urlInput);
		this.urlInput.type = "url";
		this.urlInput.addEventListener("change", this, false);
		this.urlInput.className = "form-control";
		this.urlInput.id = "urlvalue" + options.id;
		this.urlInput.name = "urlvalue" + options.id;
		this.urlInput.setAttribute("placeholder",
				"请输入操作界面的网址：http(s)://www.abc.com/a.jsp?p1=&p2=");
		this.urlInput.addEventListener("change", this, false);

		var group5 = document.createElement("div");
		form1.appendChild(group5);
		group5.className = "form-group";

		var div2 = document.createElement("div");
		group5.appendChild(div2);
		div2.className = "col-sm-12 radio";

		var label4 = document.createElement("label");
		div2.appendChild(label4);

		this.optionInput2 = document.createElement("INPUT");
		this.optionInput2.type = "radio";
		this.optionInput2.name = "uitype" + options.id;
		this.optionInput2.id = "uitype2" + options.id;
		this.optionInput2.value = "1";
		this.optionInput2.addEventListener("click", this, false);
		label4.appendChild(this.optionInput2);
		label4.appendChild(document.createTextNode("表单居"));

		var group6 = document.createElement("div");
		form1.appendChild(group6);
		group6.className = "form-group";

		var label5 = document.createElement("label");
		group6.appendChild(label5);
		label5.setAttribute("for", "formservice" + options.id);
		label5.className = "col-sm-2 control-label";
		label5.innerHTML = "选择表单";

		var formObjectDiv = document.createElement("div");
		group6.appendChild(formObjectDiv);
		formObjectDiv.className = "col-sm-10";

		var group7 = document.createElement("DIV");
		formObjectDiv.appendChild(group7);
		group7.className = "input-group";
		group7.style.padding = "2px";
		group7.setAttribute("role", "search");
		group7.setAttribute("aria-label", "");

		this.formObjectInput = document.createElement("input");
		group7.appendChild(this.formObjectInput);
		this.formObjectInput.className = "form-control";
		this.formObjectInput.id = "frm" + options.id;
		this.formObjectInput.setAttribute("placeholder", "选择并设置表单...");
		this.formObjectInput.readOnly = true;

		// open application service market
		var searchSpan = document.createElement("span");
		group7.appendChild(searchSpan);
		searchSpan.className = "input-group-btn";

		this.searchBtn = this.createTool(searchSpan, "searchFrmBtn"
				+ this.options.id, "打开表单商店查找可用的表单", "btn btn-primary", "i",
				"fa fa-search");

		// form setting.
		var group8 = document.createElement("div");
		form1.appendChild(group8);
		group8.className = "form-group";

		// form tree pane
		var formTreeDiv = document.createElement("div");
		group8.appendChild(formTreeDiv);
		formTreeDiv.className = "col-lg-5 col-md-5 col-sm-12 col-xs-12";

		this.trvwPnl = document.createElement("DIV");
		formTreeDiv.appendChild(this.trvwPnl);
		this.trvwPnl.className = "panel panel-default";
		this.trvwPnl.style.display = "";

		var trvwPnlBdy = document.createElement("DIV");
		this.trvwPnl.appendChild(trvwPnlBdy);
		trvwPnlBdy.style.height = "197px";
		trvwPnlBdy.style.overflow = "scroll";

		this.trvw = document.createElement("DIV");
		trvwPnlBdy.appendChild(this.trvw);
		this.trvw.id = "formtree";
		this.trvw.style.boxSizing = "border-box";

		// bound/unbound pane
		var bindButtonsDiv = document.createElement("div");
		group8.appendChild(bindButtonsDiv);
		bindButtonsDiv.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";

		var bindButtonsRow1 = document.createElement("div");
		bindButtonsRow1.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		bindButtonsDiv.appendChild(bindButtonsRow1);

		this.bindButton = this.createTool(bindButtonsRow1, "bindbtn"
				+ options.id, "绑定", "btn btn-primary", "i", "fa fa-link fa-lg");
		this.bindButton.disabled = true;

		var bindButtonsRow2 = document.createElement("div");
		bindButtonsRow2.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		bindButtonsDiv.appendChild(bindButtonsRow2);

		this.unbindButton = this.createTool(bindButtonsRow2, "unbindbtn"
				+ options.id, "解除绑定", "btn btn-primary", "i",
				"fa fa-unlink fa-lg");
		this.unbindButton.disabled = true;

		// accessible variable list pane
		var varlistDiv = document.createElement("div");
		group8.appendChild(varlistDiv);
		varlistDiv.className = "col-lg-5 col-md-5 col-sm-12 col-xs-12";

		var varPnl = document.createElement("DIV");
		varlistDiv.appendChild(varPnl);
		varPnl.className = "panel panel-default";
		varPnl.style.display = "";

		var varsPnlBdy = document.createElement("DIV");
		varPnl.appendChild(varsPnlBdy);
		varsPnlBdy.style.height = "197px";
		varsPnlBdy.style.overflow = "scroll";

		this.varlistDiv = document.createElement("DIV");
		varsPnlBdy.appendChild(this.varlistDiv);
		this.varlistDiv.id = "varlistdiv" + options.id;
		this.varlistDiv.style.boxSizing = "border-box";
		this.varlistDiv.className = "table-responsive";

		// linked variable setting.
		var group9 = document.createElement("div");
		form1.appendChild(group9);
		group9.className = "form-group";

		var linkedDiv = document.createElement("div");
		group9.appendChild(linkedDiv);
		linkedDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		var linkedvarPnl = document.createElement("DIV");
		linkedDiv.appendChild(linkedvarPnl);
		linkedvarPnl.className = "panel panel-default";
		linkedvarPnl.style.display = "";

		var linkedvarsPnlBdy = document.createElement("DIV");
		linkedvarPnl.appendChild(linkedvarsPnlBdy);
		linkedvarsPnlBdy.style.height = "500px";
		linkedvarsPnlBdy.style.overflow = "scroll";

		this.linkedvarlistDiv = document.createElement("DIV");
		linkedvarsPnlBdy.appendChild(this.linkedvarlistDiv);
		this.linkedvarlistDiv.id = "linkedvarlistdiv" + options.id;
		this.linkedvarlistDiv.style.boxSizing = "border-box";
		this.linkedvarlistDiv.className = "table-responsive";

		var plugin3 = $(this.element).formServiceStoreDialog({
			id : options.id,
			title : "轩琦科技 - 表单商店",
			parent : this,
			currowner : options.currowner,
			topparent : options.topparent,
		});
		this.storedialog = plugin3.data("formServiceStoreDialog");

		this.loadData(this.entity);

		if (this.options.currowner instanceof ReleasedWfProcess) {
			this.optionInput1.disabled = true;
			this.urlInput.disabled = true;
			this.optionInput2.disabled = true;
			this.formObjectInput.disabled = true;
			this.searchBtn.disabled = true;
			this.bindButton.disabled = true;
			this.unbindButton.disabled = true;
		}
	};

	EditPanel.prototype.loadData = function(entity) {
		if (entity instanceof StartPoint) {
			if (entity.launchUIType == 0) { // 0: launch form; 1: launch UI url
				this.optionInput1.checked = false;// url
				this.urlInput.disabled = true;

				this.optionInput2.checked = true;// form
				this.searchBtn.disabled = false;

			} else if (entity.launchUIType == 1) {
				this.optionInput1.checked = true;// url
				this.urlInput.disabled = false;

				this.optionInput2.checked = false;// form
				this.searchBtn.disabled = true;

			}
			this.urlInput.value = this.entity.launchUIUrl;
			this.frm = this.entity.launchFormContent;
			this.buildTree(this.entity.launchFormContent);
		} else if (entity instanceof EndPoint) {
			if (entity.endUIType == 0) {
				this.optionInput1.checked = false;// url
				this.urlInput.disabled = true;

				this.optionInput2.checked = true;// form
				this.searchBtn.disabled = false;
			} else if (entity.endUIType == 1) {
				this.optionInput1.checked = true;// url
				this.urlInput.disabled = false;

				this.optionInput2.checked = false;// form
				this.searchBtn.disabled = true;
			}
			this.urlInput.value = this.entity.endUIUrl;
			this.frm = this.entity.endFormContent;
			this.buildTree(this.entity.endFormContent);
		} else if (entity instanceof ManualTask) {
			if (entity.uiType == 0) {
				this.optionInput1.checked = false;// url
				this.urlInput.disabled = true;

				this.optionInput2.checked = true;// form
				this.searchBtn.disabled = false;
			} else if (entity.uiType == 1) {
				this.optionInput1.checked = true;// url
				this.urlInput.disabled = false;

				this.optionInput2.checked = false;// form
				this.searchBtn.disabled = true;
			}
			this.urlInput.value = this.entity.uiUrl;
			this.frm = this.entity.formContent;
			this.buildTree(this.entity.formContent);
		}
		this.setLinkedTable(this.entity, this.frm);
	};

	EditPanel.prototype.setLinkedTable = function(entity, form) {
		if (form == null)
			return;
		var formVars = form.fetchBoundComponents();
		var rows = [];
		if (formVars != null && formVars.length > 0) {
			for (var i = 0; i < formVars.length; i++) {
				var acv = null;
				var fmc = formVars[i];// UI form
				if (entity.accessibleVars != null
						&& entity.accessibleVars.length > 0) {
					for (var j = 0; j < entity.accessibleVars.length; j++) {
						if (entity.accessibleVars[j].varId == formVars[i].varId
								&& entity.accessibleVars[j].componentId == formVars[i].id) {
							acv = entity.accessibleVars[j];
							break;
						}
					}
				}
				if (acv != null) {
					var row1 = this.table.insertRow(1);
					if (this.options.currowner instanceof WfProcess) {
						row1.addEventListener("click", this, false);
					}
					var cell0 = row1.insertCell(0);
					cell0.innerHTML = "<font color='blue'><i class='fa fa-unlink fa-lg'></i></font>";
					var cell1 = row1.insertCell(1);
					var v = this.options.currowner.seekChildByID(acv.varId);
					cell1.innerHTML = v.name; // accessible variable
					cell1.setAttribute("vid", v.id);
					var cell2 = row1.insertCell(2);
					cell2.innerHTML = fmc.title; // form component name
					cell2.setAttribute("fid", fmc.id);
				}
			}
		}
		if (formVars != null && formVars.length > 0) {
			for (var i = 0; i < formVars.length; i++) {
				var acv = null;
				if (entity.accessibleVars != null
						&& entity.accessibleVars.length > 0) {
					for (var j = 0; j < entity.accessibleVars.length; j++) {
						if (entity.accessibleVars[j].varId == formVars[i].varId) {
							acv = entity.accessibleVars[j];
							break;
						}
					}
				}
				if (acv == null) {
					var row1 = this.table.insertRow(1);
					if (this.options.currowner instanceof WfProcess) {
						row1.addEventListener("click", this, false);
					}
					var cell0 = row1.insertCell(0);
					cell0.innerHTML = "<font color='red'><i class='fa fa-unlink fa-lg'></i></font>";
					var cell1 = row1.insertCell(1);
					cell1.innerHTML = "&nbsp;"; // accessible variable
					cell1.setAttribute("vid", formVars[i].varId);
					var cell2 = row1.insertCell(2);
					console.log(formVars[i]);
					cell2.innerHTML = formVars[i].title; // form component
					// name
					cell2.setAttribute("fid", formVars[i].id);
				}
			}
		}
		if (entity.accessibleVars != null && entity.accessibleVars.length > 0) {
			for (var j = 0; j < entity.accessibleVars.length; j++) {
				var fmc = null;
				if (entity.accessibleVars[j].componentId != null) {
					if (formVars != null && formVars.length > 0) {
						for (var i = 0; i < formVars.length; i++) {
							if (entity.accessibleVars[j].componentId == formVars[i].id) {
								fmc = formVars[i];
								break;
							}
						}
					}
					if (fmc == null) {
						var row1 = this.table.insertRow(1);
						if (this.options.currowner instanceof WfProcess) {
							row1.addEventListener("click", this, false);
						}
						var cell0 = row1.insertCell(0);
						cell0.innerHTML = "<font color='red'><i class='fa fa-unlink fa-lg'></i></font>";
						var cell1 = row1.insertCell(1);
						var v = this.options.currowner
								.seekChildByID(entity.accessibleVars[j].varId);
						cell1.innerHTML = v.name; // accessible variable
						cell1.setAttribute("vid", v.id);
						var cell2 = row1.insertCell(2);
						cell2.innerHTML = "&nbsp;";
						cell2.setAttribute("fid",
								entity.accessibleVars[j].componentId);
					}
				}
			}
		}
	};

	EditPanel.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	EditPanel.prototype.setNewForm = function(id) {
		var f = new ReleasedForm();
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(25), {
			id : id,
		}).complete(function(data) {
			f.parseFromJSON(data.responseJSON);
			that.changeForm(f);
			$("#progressbar").hide();
		});
	};

	EditPanel.prototype.changeForm = function(f) {
		if (this.entity instanceof StartPoint) {
			map[this.options.currowner.id].stack
					.execute(new PMValueChangedCmd(this.entity,
							"launchFormContent", f, this.options.currowner));
		} else if (this.entity instanceof EndPoint) {
			map[this.options.currowner.id].stack.execute(new PMValueChangedCmd(
					this.entity, "endFormContent", f, this.options.currowner));
		} else if (this.entity instanceof ManualTask) {
			map[this.options.currowner.id].stack.execute(new PMValueChangedCmd(
					this.entity, "formContent", f, this.options.currowner));
		}
	};

	EditPanel.prototype.buildTree = function(f) {
		this.loadVarlist(this.entity, this.varlistDiv, f);
		this.loadLinkedVarlist(this.entity, this.linkedvarlistDiv, f);
		if (f != null) {
			this.formObjectInput.value = f.name;
			var that = this;
			this.instance = $(this.trvw).jstree({
				"multiple" : false,
				"core" : {
					"check_callback" : true,
					"data" : f.toTree(),
				},
			}).on(
					'activate_node.jstree',
					function(e, data) {
						// select tree node
						var arry = data.node.data.split("|");
						if (arry[0] == "表单" || arry[0] == "列") {
							that.bindButton.disabled = true;
							that.selComponent = null;
						} else {
							that.selComponent = f.seekObjectByID(data.node.id);
							if (that.selVar != null
									&& that.selComponent != null) {
								if (!that.checkBoundVariable(that.entity,
										that.selComponent.id)) {
									that.bindButton.disabled = false;
								}
							}
						}
					}).on('loaded.jstree', function() {
				$(that.instance).jstree('open_all');
				that.selComponent = null;
			});
		}
	};

	// load all accessible variables
	EditPanel.prototype.loadVarlist = function(entity, parent, form) {
		var table = document.createElement("Table");
		parent.appendChild(table);
		table.id = "varlist" + this.options.id
		table.className = "table table-striped table-hover";

		if (entity.accessibleVars != null && entity.accessibleVars.length > 0) {
			for (var j = 0; j < entity.accessibleVars.length; j++) {
				var row1 = table.insertRow(j);
				if (this.options.currowner instanceof WfProcess) {
					row1.addEventListener("click", this, false);
				}
				var v = this.options.currowner
						.seekChildByID(entity.accessibleVars[j].varId);
				var cell2 = row1.insertCell(0);
				cell2.innerHTML = v.name;
				cell2.setAttribute("varid", entity.accessibleVars[j].varId);
			}
		}

		var header = table.createTHead();
		var row = header.insertRow(0);
		this.createHead("可访问变量名称", row);
	};

	EditPanel.prototype.loadLinkedVarlist = function(entity, parent, form) {
		this.table = document.createElement("Table");
		parent.appendChild(this.table);
		this.table.id = "linkedvarlist" + this.options.id
		this.table.className = "table table-striped table-hover";

		var row1 = this.table.insertRow(0);
		var cell0 = row1.insertCell(0);
		cell0.innerHTML = "&nbsp;";
		var cell1 = row1.insertCell(1);
		cell1.innerHTML = "&nbsp;";
		var cell2 = row1.insertCell(2);
		cell2.innerHTML = "&nbsp;";

		var header = this.table.createTHead();
		var row = header.insertRow(0);
		this.createHead("绑定状态", row);
		this.createHead("可访问变量名称", row);
		this.createHead("组件名称", row);
	};

	EditPanel.prototype.checkBoundVariable = function(entity, cId) {
		if (entity.accessibleVars != null && entity.accessibleVars.length > 0) {
			for (var j = 0; j < entity.accessibleVars.length; j++) {
				if (entity.accessibleVars[j].componentId == cId) {
					return true;
				}
			}
		}
		return false;
	};

	EditPanel.prototype.checkBoundComp = function(form, vId) {
		var formVars = form.fetchBoundComponents();
		if (formVars != null && formVars.length > 0) {
			for (var i = 0; i < formVars.length; i++) {
				if (formVars[i].varId == vId) {
					return true;
				}
			}
		}
		return false;
	};

	EditPanel.prototype.createTool = function(group, id, title, style, fonttag,
			fontclass) {
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
		icon.setAttribute("aria-hidden", "true");
		icon.id = id;
		return button;
	};

	EditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		case "click":
			this.doClick(e);
			break;
		}
	};

	EditPanel.prototype.doChange = function(evt) {
		if (evt.target == this.urlInput) {
			if (this.entity instanceof StartPoint) {
				map[this.options.currowner.id].stack
						.execute(new PMValueChangedCmd(this.entity,
								"launchUIUrl", this.urlInput.value,
								this.options.currowner));
			} else if (this.entity instanceof EndPoint) {
				map[this.options.currowner.id].stack
						.execute(new PMValueChangedCmd(this.entity, "endUIUrl",
								this.urlInput.value, this.options.currowner));
			} else if (this.entity instanceof ManualTask) {
				map[this.options.currowner.id].stack
						.execute(new PMValueChangedCmd(this.entity, "uiUrl",
								this.urlInput.value, this.options.currowner));
			}
		}
	};

	EditPanel.prototype.doClick = function(evt) {
		if (evt.target == this.optionInput1) {// url
			if (this.entity instanceof StartPoint) {
				map[this.options.currowner.id].stack
						.execute(new PMValueChangedCmd(this.entity,
								"launchUIType", 1, this.options.currowner));
			} else if (this.entity instanceof EndPoint) {
				map[this.options.currowner.id].stack
						.execute(new PMValueChangedCmd(this.entity,
								"endUIType", 1, this.options.currowner));
			} else if (this.entity instanceof ManualTask) {
				map[this.options.currowner.id].stack
						.execute(new PMValueChangedCmd(this.entity, "uiType",
								1, this.options.currowner));
			}
			Utils.stopBubble(evt);
			return;
		} else if (evt.target == this.optionInput2) { // form
			if (this.entity instanceof StartPoint) {
				map[this.options.currowner.id].stack
						.execute(new PMValueChangedCmd(this.entity,
								"launchUIType", 0, this.options.currowner));
			} else if (this.entity instanceof EndPoint) {
				map[this.options.currowner.id].stack
						.execute(new PMValueChangedCmd(this.entity,
								"endUIType", 0, this.options.currowner));
			} else if (this.entity instanceof ManualTask) {
				map[this.options.currowner.id].stack
						.execute(new PMValueChangedCmd(this.entity, "uiType",
								0, this.options.currowner));
			}
			Utils.stopBubble(evt);
			return;
		} else if (evt.target == this.searchBtn
				|| evt.target.id == "searchFrmBtn" + this.options.id) {
			this.storedialog.show();
			Utils.stopBubble(evt);
			return;
		} else if (evt.target == this.bindButton
				|| evt.target.id == "bindbtn" + this.options.id) {
			map[this.options.currowner.id].stack.execute(new FMAddBoundCmd(
					this.entity, this.frm, this.selVar.id,
					this.selComponent.id, this.options.currowner));
			Utils.stopBubble(evt);
			return;
		} else if (evt.target == this.unbindButton
				|| evt.target.id == "unbindbtn" + this.options.id) {
			var ac = this.entity.fetchAccessibleVar(this.vid);
			var component = null;
			if (this.frm != null && ac != null) {
				// this.selVar = this.options.currowner.seekChildByID(vid);
				component = this.frm.seekObjectByID(this.fid);
			}
			map[this.options.currowner.id].stack.execute(new FMRemoveBoundCmd(
					this.entity, ac, component, this.options.currowner));

			Utils.stopBubble(evt);
			return;
		} else if (evt.target.tagName == "TD") {
			var table = evt.target.parentElement.parentElement.parentElement;
			this.clearSelection(table);
			evt.target.parentElement.style.background = "#d1d1e0";
			if (table.id == "varlist" + this.options.id) {
				this.selVar = this.options.currowner.seekChildByID(evt.target
						.getAttribute("varid"));
				if (this.selVar != null && this.selComponent != null) {
					if (!this.checkBoundComp(this.frm, this.selVar.id)) {
						this.bindButton.disabled = false;
					}
				}
			} else if (table.id == "linkedvarlist" + this.options.id) {
				var r = evt.target.parentElement;
				this.vid = r.children[1].getAttribute("vid");
				this.fid = r.children[2].getAttribute("fid");
				this.unbindButton.disabled = false;
				this.bindButton.disabled = true;
			}
			Utils.stopBubble(evt);
			return;
		}

	};

	EditPanel.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
		this.selVarId = null;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new EditPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);