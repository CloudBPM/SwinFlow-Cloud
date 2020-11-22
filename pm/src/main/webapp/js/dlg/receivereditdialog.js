/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "receiverEditDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		msgtype : "",
		entity : "",
		currowner : "",
	};

	var ReceiverEditDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			msgtype : "",
			entity : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = options.entity;
		this.currOwner = options.currowner;
		this.init(options);
		this.tmpobjs = [];
		this.tmpobj = null;
		this.tmpobj1 = null;
		this.tmpobj2 = null;
	};

	ReceiverEditDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		this.modalframe.className = "modal fade";
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "rcEditModalLabel");

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "650px"
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		modaldialogDIV.appendChild(dialogContentDIV);

		// dialog heading
		var dialogHeaderDIV = document.createElement("div");
		dialogHeaderDIV.className = "modal-header";
		dialogContentDIV.appendChild(dialogHeaderDIV);

		var closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");

		var closeSpan = document.createElement("span");
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";
		closeButton.appendChild(closeSpan);
		dialogHeaderDIV.appendChild(closeButton);

		var titleH4 = document.createElement("h4");
		titleH4.className = "modal-title";
		dialogHeaderDIV.appendChild(titleH4);

		var infoIcon = document.createElement("i");
		infoIcon.className = "fa fa-pencil-square fa-lg";
		infoIcon.style.color = "green";
		titleH4.appendChild(infoIcon);

		var info = document.createElement("label");
		info.innerHTML = options.title;
		titleH4.appendChild(info);

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);
		dialogForm.className = "form-horizontal";
		dialogForm.setAttribute("role", "form");

		var dialogBodyDIV = document.createElement("div");
		dialogBodyDIV.className = "modal-body";
		dialogForm.appendChild(dialogBodyDIV);

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyFrameDIV.className = "container-fluid";
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);

		var bodyRow = document.createElement("div");
		bodyRow.className = "row";
		dialogBodyFrameDIV.appendChild(bodyRow);

		// body content
		// 0: workflow launcher
		var launcherDiv = document.createElement("div");
		bodyRow.appendChild(launcherDiv);
		launcherDiv.className = "radio";
		var launcherLbl = document.createElement("label");
		launcherDiv.appendChild(launcherLbl);
		this.launcherInput = document.createElement("input");
		launcherLbl.appendChild(this.launcherInput);
		this.launcherInput.type = "radio";
		this.launcherInput.name = "rcSetting" + options.id;
		this.launcherInput.value = "0";
		var launcherText = document.createElement("text");
		launcherLbl.appendChild(launcherText);
		launcherText.innerHTML = "业务发起人";

		// 1: all staffs in current organization
		var allstaffDiv = document.createElement("div");
		bodyRow.appendChild(allstaffDiv);
		allstaffDiv.className = "radio";
		var allstaffLbl = document.createElement("label");
		allstaffDiv.appendChild(allstaffLbl);
		this.allstaffInput = document.createElement("input");
		allstaffLbl.appendChild(this.allstaffInput);
		this.allstaffInput.type = "radio";
		this.allstaffInput.name = "rcSetting" + options.id;
		this.allstaffInput.value = "1";
		var allstaffText = document.createElement("text");
		allstaffLbl.appendChild(allstaffText);
		allstaffText.innerHTML = "本单位所有职员";

		// 2: all staffs in all associated organizations;
		var allstaffDiv1 = document.createElement("div");
		bodyRow.appendChild(allstaffDiv1);
		allstaffDiv1.className = "radio";
		var allstaffLbl1 = document.createElement("label");
		allstaffDiv1.appendChild(allstaffLbl1);
		this.allstaffInput1 = document.createElement("input");
		allstaffLbl1.appendChild(this.allstaffInput1);
		this.allstaffInput1.type = "radio";
		this.allstaffInput1.name = "rcSetting" + options.id;
		this.allstaffInput1.value = "2";
		var allstaffText1 = document.createElement("text");
		allstaffLbl1.appendChild(allstaffText1);
		allstaffText1.innerHTML = "本单位及所有相关单位的所有职员";

		// 3: specific position(s) or project roles;
		var orgsDiv = document.createElement("div");
		bodyRow.appendChild(orgsDiv);
		orgsDiv.className = "radio";
		var orgLbl = document.createElement("label");
		orgsDiv.appendChild(orgLbl);
		this.orgInput = document.createElement("input");
		orgLbl.appendChild(this.orgInput);
		this.orgInput.type = "radio";
		this.orgInput.name = "rcSetting" + options.id;
		this.orgInput.value = "3";

		var that = this;
		$("input[name=rcSetting" + options.id + "]").change(
				function() {
					var selectedvalue = $(
							"input[name=rcSetting" + options.id + "]:checked")
							.val();
					if (selectedvalue == 0) {
						that.oSelect.disabled = true;
						that.dSelect.disabled = true;
						$("input[id=potsions][type=checkbox]").attr('disabled',
								true);
						that.tmpobjs = [];
						if (that.newobjs != null && that.newobjs.length > 0) {
							for (var i = 0; i < that.newobjs.length; i++) {
								if (that.newobjs[i].receiverType == 3) {
									that.tmpobjs.push(that.newobjs[i]);
								}
							}
						}
						that.newobjs = [];
						var a = new MessageReceiver();
						a.id = null;
						a.taskId = that.entity.id;
						a.messageType = that.options.msgtype;
						a.organizationId = null;
						a.organizationName = null;
						a.departmentId = null;
						a.departmentName = null;
						a.positionId = null;
						a.positionName = null;
						a.userId = "WORKFLOW_LAUNCHR";
						a.userFullName = null;
						a.receiverType = 0;
						a.currOwner = that.entity.currOwner;
						a.owner = that.entity.owner;
						that.addReceiver(a, that.newobjs);
					} else if (selectedvalue == 1) {
						that.oSelect.disabled = true;
						that.dSelect.disabled = true;
						$("input[id=potsions][type=checkbox]").attr('disabled',
								true);
						that.tmpobjs = [];
						if (that.newobjs != null && that.newobjs.length > 0) {
							for (var i = 0; i < that.newobjs.length; i++) {
								if (that.newobjs[i].receiverType == 3) {
									that.tmpobjs.push(that.newobjs[i]);
								}
							}
						}
						that.newobjs = [];
						var a = new MessageReceiver();
						a.id = null;
						a.taskId = that.entity.id;
						a.messageType = that.options.msgtype;
						a.organizationId = null;
						a.organizationName = null;
						a.departmentId = null;
						a.departmentName = null;
						a.positionId = null;
						a.positionName = null;
						a.userId = "ALL_CUR_STAFFS";
						a.userFullName = null;
						a.receiverType = 1;
						a.currOwner = that.entity.currOwner;
						a.owner = that.entity.owner;
						that.addReceiver(a, that.newobjs);
					} else if (selectedvalue == 2) {
						that.oSelect.disabled = true;
						that.dSelect.disabled = true;
						$("input[id=potsions][type=checkbox]").attr('disabled',
								true);
						that.tmpobjs = [];
						if (that.newobjs != null && that.newobjs.length > 0) {
							for (var i = 0; i < that.newobjs.length; i++) {
								if (that.newobjs[i].receiverType == 3) {
									that.tmpobjs.push(that.newobjs[i]);
								}
							}
						}
						that.newobjs = [];
						var a = new MessageReceiver();
						a.id = null;
						a.taskId = that.entity.id;
						a.messageType = that.options.msgtype;
						a.organizationId = null;
						a.organizationName = null;
						a.departmentId = null;
						a.departmentName = null;
						a.positionId = null;
						a.positionName = null;
						a.userId = "ALL_ORG_STAFFS";
						a.userFullName = null;
						a.receiverType = 2;
						a.currOwner = that.entity.currOwner;
						a.owner = that.entity.owner;
						that.addReceiver(a, that.newobjs);
					} else if (selectedvalue == 3) {
						that.oSelect.disabled = false;
						that.dSelect.disabled = false;
						$("input[id=potsions][type=checkbox]").attr('disabled',
								false);
						that.newobjs = [];
						if (that.tmpobjs != null && that.tmpobjs.length > 0) {
							for (var i = 0; i < that.tmpobjs.length; i++) {
								that.newobjs.push(that.tmpobjs[i]);
							}
						}
					}
				});

		this.oSelect = document.createElement("select");
		this.oSelect.className = "form-control";
		this.oSelect.addEventListener("change", this, false);
		orgLbl.appendChild(this.oSelect);

		var departLbl = document.createElement("label");
		orgsDiv.appendChild(departLbl);
		this.dSelect = document.createElement("select");
		this.dSelect.className = "form-control";
		this.dSelect.addEventListener('change', this, false);
		departLbl.appendChild(this.dSelect);

		if (this.entity.receivers.length > 0) {
			for (var i = 0; i < this.entity.receivers.length; i++) {
				if (this.entity.receivers[i].receiverType == 0) {
					this.oSelect.disabled = true;
					this.dSelect.disabled = true;
					this.launcherInput.checked = true;
				} else if (this.entity.receivers[i].receiverType == 1) {
					this.oSelect.disabled = true;
					this.dSelect.disabled = true;
					this.allstaffInput.checked = true;
				} else if (this.entity.receivers[i].receiverType == 2) {
					this.oSelect.disabled = true;
					this.dSelect.disabled = true;
					this.allstaffInput1.checked = true;
				} else if (this.entity.receivers[i].receiverType == 3) {
					this.oSelect.disabled = false;
					this.dSelect.disabled = false;
					this.orgInput.checked = true;
				}
			}
		} else {
			if (this.orgInput.checked) {
				this.oSelect.disabled = false;
				this.dSelect.disabled = false;
			} else {
				this.oSelect.disabled = true;
				this.dSelect.disabled = true;
			}
		}

		var tableDiv = document.createElement("DIV");
		bodyRow.appendChild(tableDiv);
		tableDiv.id = "tablediv" + options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = "200px";
		this.positionlist = document.createElement("table");
		this.positionlist.className = "table table-striped table-hover";
		tableDiv.appendChild(this.positionlist);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		var saveButton = document.createElement("button");
		saveButton.type = "button";
		saveButton.id = "OK" + options.id;
		saveButton.name = "OK" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.innerHTML = "确定";
		saveButton.addEventListener("click", this, false);
		dialogFooterDIV.appendChild(saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "button";
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

		var dialog = $(bodyRow).alertBox({
			id : "receiverAlert" + this.options.id,
		});
		this.messageBox = dialog.data("alertBox");

		this.loadData(this.entity, this.currOwner);
	};

	ReceiverEditDialog.prototype.loadData = function(entity, process) {
		this.newobjs = entity.cloneReceiverList();
		this.cmd = new PMReceiverListChangedCmd(entity, process);
		$(this.positionlist).children().remove();
		this.loadingOrgs(entity, process);
	};

	ReceiverEditDialog.prototype.loadingOrgs = function(entity, process) {
		this.currOwner = process;
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(11, process.owner), {
			oid : process.owner,
		}).complete(function(data) {
			that.loadOrgData(entity, data.responseJSON);
			$("#progressbar").hide();
		});
	};

	ReceiverEditDialog.prototype.loadOrgData = function(entity, json) {
		var firstOrg = null;
		for (var i = 0; i < this.newobjs.length; i++) {
			if (this.newobjs[i].organizationId != null) {
				firstOrg = this.newobjs[i];
				break;
			}
		}
		$(this.oSelect).find('option').remove();
		this.addOptions(this.oSelect, "-请选择-", "-1", 0);
		for (var i = 0; i < json.length; i++) {
			if (json[i] != null) {
				this.addOptions(this.oSelect, json[i].name, json[i].id, i + 1);
			}
		}
		if (firstOrg != null) {
			this.loadingDpts(firstOrg.organizationId, firstOrg.departmentId,
					firstOrg.departmentName, firstOrg.organizationName);
		} else {
			this.loadingDpts(
					this.oSelect.options[this.oSelect.selectedIndex].value, -1,
					-1, this.oSelect.options[this.oSelect.selectedIndex].text);
		}
	};

	ReceiverEditDialog.prototype.loadingDpts = function(orgId, dptId, dptName,
			orgName) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(12, orgId), {}).complete(
				function(data) {
					that.loadDptData(data.responseJSON, dptId, dptName, orgId,
							orgName);
					$("#progressbar").hide();
				});
	};

	ReceiverEditDialog.prototype.loadDptData = function(json, dptId, dptName,
			orgId, orgName) {
		for (var i = 0; i < json.length; i++) {
			this.addOptions(this.dSelect, json[i].name, json[i].id, i);
		}
		if (dptId > -1) {
			this.loadingPositions(dptId, dptName, orgId, orgName);
		} else if (this.dSelect.selectedIndex > -1) {
			this.loadingPositions(
					this.dSelect.options[this.dSelect.selectedIndex].value,
					this.dSelect.options[this.dSelect.selectedIndex].text,
					orgId, orgName);
		}
	};

	ReceiverEditDialog.prototype.loadingPositions = function(dptId, dptName,
			orgId, orgName) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(13, orgId), {
			dptid : dptId,
		}).complete(
				function(data) {
					that.loadPosData(data.responseJSON, dptId, dptName, orgId,
							orgName);
					$("#progressbar").hide();
				});
	};

	ReceiverEditDialog.prototype.loadPosData = function(json, dptId, dptName,
			orgId, orgName) {
		var that = this;
		$(this.positionlist).children().remove();
		for (var i = 0; i < json.length; i++) {
			var f = false;
			for (var j = 0; j < this.newobjs.length; j++) {
				if (this.newobjs[j].receiverType == 3
						&& json[i].id == this.newobjs[j].positionId) {
					f = true;
					break;
				}
			}
			var row = this.positionlist.insertRow(-1);
			var cell = row.insertCell(0);
			cell.setAttribute("nowrap", "true");
			var check = document.createElement("input");
			cell.appendChild(check);
			check.type = "checkbox";
			check.name = json[i].id;
			check.id = "potsions";// "chk" + json[i].id;
			check.setAttribute("value", json[i].id);
			check.setAttribute("posName", json[i].name);
			check.setAttribute("dptId", dptId);
			check.setAttribute("dptName", dptName);
			check.setAttribute("orgId", orgId);
			check.setAttribute("orgName", orgName);
			if (f) {
				check.checked = true;
			}
			check.addEventListener("click", function() {
				if (this.checked) {
					var a = new MessageReceiver();
					a.taskId = that.entity.id;
					a.messageType = that.options.msgtype;
					a.positionId = this.name;
					a.positionName = this.getAttribute("posName");
					a.departmentId = this.getAttribute("dptId");
					a.departmentName = this.getAttribute("dptName");
					a.organizationId = this.getAttribute("orgId");
					a.organizationName = this.getAttribute("orgName");
					a.receiverType = 3;
					a.currOwner = that.entity.currOwner;
					a.owner = that.entity.owner;
					that.addReceiver(a, that.newobjs);
				} else {
					for (var i = 0; i < that.newobjs.length; i++) {
						if (that.newobjs[i].positionId = this.name) {
							that.newobjs.splice(i, 1);
							break;
						}
					}
				}
			});
			this.createCell(1, json[i].name, row);
		}
		this.addHeader();
		if (!this.orgInput.checked)
			$("input[id=potsions][type=checkbox]").attr('disabled', true);
		else
			$("input[id=potsions][type=checkbox]").attr('disabled', false);
	};

	ReceiverEditDialog.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	ReceiverEditDialog.prototype.addHeader = function() {
		var header = this.positionlist.createTHead();
		var row = header.insertRow(0);
		this.createHead("选项", row);
		// if (this.options.msgtype = 0) {
		this.createHead("接收人职位", row);
		// } else {
		// this.createHead("接收邮件的岗位", row);
		// }
	};

	ReceiverEditDialog.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		if (content == "") {
			cell.innerHTML = "&nbsp;";
		} else {
			$(cell).text(content);
		}
	};

	ReceiverEditDialog.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	ReceiverEditDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	ReceiverEditDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true,
		});
	};

	ReceiverEditDialog.prototype.doClick = function(evt) {
		if (evt.target.id == "OK" + this.options.id) {
			if ($("input[name='rcSetting" + this.options.id
					+ "'][type=radio]:checked").length == 0) {
				this.messageBox.show(4, "您没有选择任何选项。", false);
				return;
			}
			this.cmd.update(this.newobjs);
			map[this.currOwner.id].stack.execute(this.cmd);
			this.hide();
		}
	};

	ReceiverEditDialog.prototype.addReceiver = function(obj, list) {
		var that = this;
		// 获取一个ID.
		$.getJSON(service.api(2, this.currOwner.owner)).complete(
				function(data) {
					obj.id = data.responseText;
					list.push(obj);
				});
	};

	ReceiverEditDialog.prototype.doChange = function(evt) {
		if (evt.target == this.oSelect) {
			$(this.dSelect).find('option').remove().end();
			$(this.positionlist).children().remove();
			this.loadingDpts(
					this.oSelect.options[this.oSelect.selectedIndex].value, -1,
					-1, this.oSelect.options[this.oSelect.selectedIndex].text);
		} else if (evt.target == this.dSelect) {
			$(this.positionlist).children().remove();
			if (this.dSelect.selectedIndex > -1)
				this.loadingPositions(
						this.dSelect.options[this.dSelect.selectedIndex].value,
						this.dSelect.options[this.dSelect.selectedIndex].text,
						this.oSelect.options[this.oSelect.selectedIndex].value,
						this.oSelect.options[this.oSelect.selectedIndex].text);
		}

	};

	ReceiverEditDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new ReceiverEditDialog(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);