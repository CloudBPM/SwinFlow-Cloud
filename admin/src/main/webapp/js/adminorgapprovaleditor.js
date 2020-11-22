/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "omOrgApprovalEditor";
	var defaults = {
		id : "",
		ownerId : "",
		basicpropsheet : "",
		propsheet : "",
		width : 0,
		height : 0,
		parent : "",
	};

	var Editor = function(element, options) {
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
		this.status = 99;
		this.init(options);
	};

	Editor.prototype.init = function(options) {
		// basic property sheet plugin
		var p1 = $(this.element).readonlyTableViewer({
			id : options.id,
			basicpropsheet : options.basicpropsheet,
			propsheet : options.propsheet,
			width : options.width,
			height : options.height,
			parent : this,
			type : "ext",
		});
		this.listViewPane = p1.data("readonlyTableViewer");
		this.listViewPane.init();
		this.listViewPane.createToolbar();
		this.listViewPane.headersize = 6;
		this.listViewPane.loading(1, this.listViewPane.pagesize, "",
				options.ownerId);

		// confirm message dialog plugin
		var p2 = $(this.element).confirmInfoDialog({
			id : "005",
			title : "轩琦科技 - 提示",
			parent : this,
		});
		this.confirmInfoDialog = p2.data("confirmInfoDialog");

	};

	Editor.prototype.getDirty = function() {
		return false;
	};

	Editor.prototype.createGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	Editor.prototype.addExtraButtons = function(parent) {
		var group = this.createGroup(parent);
		this.addButton = this.createSelection(group);
	};

	Editor.prototype.createSelection = function(group) {
		var colDIV2 = document.createElement("DIV");
		group.appendChild(colDIV2);
		colDIV2.className = "col-sm-10";

		this.statusSelect = document.createElement("SELECT");
		colDIV2.appendChild(this.statusSelect);
		this.statusSelect.className = "form-control";
		this.statusSelect.addEventListener("change", this, false);
		// 3:not in use;4:in use;5:write off
		this.addOptions(this.statusSelect, "--请选择状态--", -1, 0);
		this.addOptions(this.statusSelect, "全部", 99, 1);
		this.addOptions(this.statusSelect, "申请待上线", 3, 2);
		this.addOptions(this.statusSelect, "已上线", 4, 3);
		this.addOptions(this.statusSelect, "已封禁", 5, 4);
	};

	Editor.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	Editor.prototype.loading = function(pageno, pagesize, condition, owner) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(4), {
			pn : pageno,
			psz : pagesize,
			cond : condition,
			status : this.status,
		}).complete(function(data) {
			that.listViewPane.loadData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	Editor.prototype.createCells = function(obj) {
		var org = new Organization();
		org.parseFromJSON(obj);
		this.listViewPane.objects.push(org);
		var row = this.listViewPane.tableList.insertRow(-1);
		row.setAttribute("key", org.id);
		row.addEventListener("click", this, false);
		//row.addEventListener("dblclick", this, false);

		this.listViewPane.createCell(0, Utils.parse(org.name), row);
		this.listViewPane.createCell(1, Utils.parse(org.abbrLocal), row);
		this.listViewPane.createCell(2, Utils.parse(org.representative), row);
		this.listViewPane.createCell(3, Utils.parse(org.phoneNumber), row);
		this.listViewPane.createCell(4, Utils.parse(org.registrationCode), row);

		// 创建按钮
		var cell = this.listViewPane.createCell(5, null, row);
		this.createIcon(cell, org.id + "2", "fa fa-cloud-upload fa-lg",
				"upload", "上线", "");
		this.createIcon(cell, org.id + "3", "fa fa-cloud-download fa-lg",
				"download", "下线", "");
		this.createIcon(cell, org.id + "1", "fa fa-minus fa-lg", "ban", "封禁",
				"btn-danger");
		this.createIcon(cell, org.id + "4", "fa fa-trash-o fa-lg", "remove",
				"删除", "btn-danger");

		this.buttonSelected(org.status, org.id);
	};

	Editor.prototype.buttonSelected = function(status, id) {
		switch (status) {
		case 5:// 封禁
			$("#" + id + "1").addClass("active");
			$("#" + id + "1").attr("disabled", true);
			$("#" + id + "1i").attr("canclick", "false");
			break;
		case 3:// 未上线
			$("#" + id + "3").addClass("active");
			$("#" + id + "3").attr("disabled", true);
			$("#" + id + "3i").attr("canclick", "false");
			break;
		case 4:// 已上线
			$("#" + id + "2").addClass("active");
			$("#" + id + "2").attr("disabled", true);
			$("#" + id + "2i").attr("canclick", "false");
			break;
		default:
			break;
		}
	};

	Editor.prototype.buttonChanged = function(status, id) {
		var btnum = id.charAt(id.length - 1);
		var orgId = id.substring(0, id.length - 1);

		$("#" + id + "").addClass("active");
		$("#" + id + "").attr("disabled", true);
		$("#" + id + "i").attr("canclick", "false");
		for (var i = 1; i < 4; i++) {
			if (btnum != i) {
				$("#" + orgId + i + "").removeClass("active");
				$("#" + orgId + i + "").attr("disabled", false);
				$("#" + orgId + i + "i").attr("canclick", "true");
			}
		}
		for (var i = 0; i < this.listViewPane.objects.length; i++) {
			if (this.listViewPane.objects[i].id == orgId) {
				this.listViewPane.objects[i].status = parseInt(status);
				this.basicpropsheet.setSheet(this.listViewPane.objects[i]);
			}
		}
		var that = this;
		$.getJSON(service.api(5), {
			status : status,
			oid : orgId,
			lastupdate : new Date().getTime(),
		}).complete(function(data) {
			that.listViewPane.refresh();
		});
	};

	Editor.prototype.createIcon = function(parent, id, classname, name, title,
			style) {
		var button = document.createElement("BUTTON");
		parent.appendChild(button);
		button.id = id;
		button.className = "btn btn-default " + style;
		button.style.borderRadius = "15px";
		button.style.width = "29px";
		button.style.padding = "3px";
		button.title = title;
		var that=this;
		button.addEventListener("click", function(evt){
			var status = ""; // 用于存储组织状态 5封禁 3未上线 4已上线
			var id = ""; // 用于存储buttonId
			var flag = evt.target.attributes.canclick; // 获取span是否可点击

			if ((flag != "" && flag != null && flag != undefined && flag.nodeValue == "true")
				|| evt.target.tagName == "BUTTON") {
				if (evt.target.tagName == "SPAN") {
					id = evt.target.parentElement.id;
				} else {
					id = evt.target.id;
				}
				if (evt.target.name == "upload") {
					that.buttonChanged("4", id);
				} else if (evt.target.name == "download") {
                    that.buttonChanged("3", id);
				} else if (evt.target.name == "ban") {
                    that.buttonChanged("5", id);
				} else if (evt.target.name == "remove") {
					var oid = id.substring(0, id.length - 1);
                    that.delOid = oid;
                    that.confirmInfoDialog.show("您确定要删除该单位么？（请谨慎操作删除，数据将不可恢复！）");
					return;
				}
			}

		}, false);
		button.name = name;
		var rmspan = document.createElement("SPAN");
		button.appendChild(rmspan);
		rmspan.className = classname;
		rmspan.name = name;
		rmspan.setAttribute("aria-hidden", "true");
		rmspan.setAttribute("data-toggle", "modal");
		rmspan.setAttribute("data-target", "myModal");
		rmspan.setAttribute("canclick", "true"); // canclick 用于定义span 是否可点击
		rmspan.title = title;
		rmspan.id = id + "i";
		return rmspan;
	};

	Editor.prototype.parseStatus = function(status) {
		var statusText = "";
		switch (status) {
		case 3:
			statusText = "已申请上线";
			break;
		case 4:
			statusText = "已上线";
			break;
		case 5:
			statusText = "已封禁";
			break;
		}
		return statusText;
	};

	Editor.prototype.handleEvent = function(e) {
		this.listViewPane.handleEvent(e);
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		}
	};

	Editor.prototype.doChange = function(evt) {
		if (evt.target.value > -1) {
			this.status = evt.target.value;
			this.listViewPane.refresh();
		}
	}

	Editor.prototype.doNoAction = function(evt) {
		Utils.stopBubble(evt);
		this.confirmInfoDialog.hide();
	};

	Editor.prototype.doYesAction = function(evt) {
		Utils.stopBubble(evt);
		this.confirmInfoDialog.hide();
		var oid = this.delOid;
		var that = this;
		$.getJSON(service.api("6"), {
			oid : oid,
		}).complete(function(data) {
			that.listViewPane.refresh();
		});
	};

	Editor.prototype.doClick = function(evt) {
		var status = ""; // 用于存储组织状态 5封禁 3未上线 4已上线
		var id = ""; // 用于存储buttonId
		var flag = evt.target.attributes.canclick; // 获取span是否可点击

		if ((flag != "" && flag != null && flag != undefined && flag.nodeValue == "true")
				|| evt.target.tagName == "BUTTON") {
			if (evt.target.tagName == "SPAN") {
				id = evt.target.parentElement.id;
			} else {
				id = evt.target.id;
			}
			if (evt.target.name == "upload") {
				this.buttonChanged("4", id);
			} else if (evt.target.name == "download") {
				this.buttonChanged("3", id);
			} else if (evt.target.name == "ban") {
				this.buttonChanged("5", id);
			} else if (evt.target.name == "remove") {
				var oid = id.substring(0, id.length - 1);
				this.delOid = oid;
				this.confirmInfoDialog.show("您确定要删除该单位么？（请谨慎操作删除，数据将不可恢复！）");
				return;
			}
		}
	};

	Editor.prototype.createHeaders = function(row) {
		this.listViewPane.createHead("组织全称", row);
		this.listViewPane.createHead("简称", row);
		this.listViewPane.createHead("法人代表", row);
		this.listViewPane.createHead("法人联系电话", row);
		this.listViewPane.createHead("组织营业执照", row);
		this.listViewPane.createHead("操作", row);
	};

	Editor.prototype.setPropertySheet = function() {
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Editor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);
