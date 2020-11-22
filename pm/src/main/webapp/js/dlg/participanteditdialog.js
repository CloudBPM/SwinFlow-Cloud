/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "participantEditDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		entity : "",
		currowner : "",
	};

	var ParticipantEditDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
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
	};

	ParticipantEditDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		this.modalframe.className = "modal fade";
		this.modalframe.id = "avEditorModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "ruleEditModalLabel");

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "700px"
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
		titleH4.id = "editModalLabel" + options.id;
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
		bodyRow.id = "bodyrow" + options.id;
		dialogBodyFrameDIV.appendChild(bodyRow);

		// body content
		var launcherDiv = document.createElement("div");
		bodyRow.appendChild(launcherDiv);
		launcherDiv.className = "checkbox";
		var launcherLbl = document.createElement("label");
		launcherDiv.appendChild(launcherLbl);
		this.launcherInput = document.createElement("input");
		launcherLbl.appendChild(this.launcherInput);
		this.launcherInput.type = "checkbox";
		this.launcherInput.name = "ptSetting" + options.id;
		var launcherText = document.createElement("text");
		launcherLbl.appendChild(launcherText);
		launcherText.innerHTML = "业务发起人";
		this.launcherInput.addEventListener('click', this, false);

		// console.log(this.entity);
		if (this.entity.participants.length > 0) {
			for (var i = 0; i < this.entity.participants.length; i++) {
				if (this.entity.participants[i].participationType == 1) {
					this.launcherInput.checked = true;
					break;
				}
			}
		}

		var orgsDiv = document.createElement("div");
		bodyRow.appendChild(orgsDiv);
		orgsDiv.className = "checkbox";
		var orgLbl = document.createElement("label");
		orgsDiv.appendChild(orgLbl);
		this.orgInput = document.createElement("input");
		orgLbl.appendChild(this.orgInput);
		this.orgInput.type = "checkbox";
		this.orgInput.name = "ptSetting" + options.id;
		this.orgInput.addEventListener('click', this, false);

		if (this.entity.participants.length > 0) {
			for (var i = 0; i < this.entity.participants.length; i++) {
				if (this.entity.participants[i].participationType == 0) {
					this.orgInput.checked = true;
					break;
				}
			}
		}

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

		var tableDiv = document.createElement("DIV");
		bodyRow.appendChild(tableDiv);
		tableDiv.id = "tablediv" + options.id;
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.style.height = "600px";
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

		this.loadData(this.entity, this.currOwner);
	};

	ParticipantEditDialog.prototype.loadData = function(entity, process) {
		this.newobjs = entity.cloneParticipantList();
		this.cmd = new PMParticipantListChangedCmd(entity, process);
		$(this.positionlist).children().remove();
		this.loadingOrgs(entity, process);
	};

	ParticipantEditDialog.prototype.loadingOrgs = function(entity, process) {
		// console.log("ran twice, why?");
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(11, process.owner), {
			oid : process.owner,
		}).complete(function(data) {
			that.loadOrgData(entity, data.responseJSON);
			$("#progressbar").hide();
		});
	};

	ParticipantEditDialog.prototype.loadOrgData = function(entity, json) {
		var firstOrg = null;
		for (var i = 0; i < this.newobjs.length; i++) {
			if (this.newobjs[i].organizationId != null) {
				firstOrg = this.newobjs[i];
				break;
			}
		}
		for (var i = 0; i < json.length; i++) {
			this.addOptions(this.oSelect, json[i].name, json[i].id, i);
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

	ParticipantEditDialog.prototype.loadingDpts = function(orgId, dptId,
			dptName, orgName) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(12, orgId), {
			oid : orgId,
		}).complete(
				function(data) {
					that.loadDptData(data.responseJSON, dptId, dptName, orgId,
							orgName);
					$("#progressbar").hide();
				});
	};

	ParticipantEditDialog.prototype.loadDptData = function(json, dptId,
			dptName, orgId, orgName) {
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

	ParticipantEditDialog.prototype.loadingPositions = function(dptId, dptName,
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

	ParticipantEditDialog.prototype.loadPosData = function(json, dptId,
			dptName, orgId, orgName) {
		var that = this;
		$(this.positionlist).children().remove();
		for (var i = 0; i < json.length; i++) {
			var f = false;
			for (var j = 0; j < this.newobjs.length; j++) {
				if (this.newobjs[j].participationType == 0
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
			check.addEventListener("click",
					function() {
						if (this.checked) {
							$('input[name=' + this.name + '][type=radio]')
									.attr('disabled', false);
							var a = new Participant();
							a.taskId = that.entity.id;
							a.positionId = this.name;
							a.positionName = this.getAttribute("posName");
							a.departmentId = this.getAttribute("dptId");
							a.departmentName = this.getAttribute("dptName");
							a.organizationId = this.getAttribute("orgId");
							a.organizationName = this.getAttribute("orgName");
							a.priority = parseInt($(
									'input[name=' + this.name
											+ '][type=radio]:checked').val());
							a.currOwner = that.entity.currOwner;
							a.owner = that.entity.owner;
							that.addParticipant(a, that.newobjs);
						} else {
							$('input[name=' + this.name + '][type=radio]')
									.attr('disabled', true);
							for (var i = 0; i < that.newobjs.length; i++) {
								if (that.newobjs[i].positionId = this.name) {
									that.newobjs.splice(i, 1);
									break;
								}
							}
						}
					});
			this.createCell(1, json[i].name, row);
			var cell1 = row.insertCell(2);
			cell1.setAttribute("nowrap", "true");
			var grp = document.createElement("label");
			cell1.appendChild(grp);
			var r1 = document.createElement("input");
			grp.appendChild(r1);
			r1.type = "radio";
			r1.name = json[i].id;
			r1.id = json[i].id;
			r1.checked = true;
			r1.setAttribute("value", "0");
			var rlebl = document.createElement("span");
			grp.appendChild(rlebl);
			rlebl.innerHTML = "普通" + "&nbsp;&nbsp;";
			if (!f) {
				r1.disabled = true;
			}
			for (var j = 0; j < this.newobjs.length; j++) {
				if (r1.name == this.newobjs[j].positionId
						&& this.newobjs[j].priority == 0) {
					r1.checked = true;
					break;
				}
			}
			r1.addEventListener("click", function() {
				for (var i = 0; i < that.newobjs.length; i++) {
					if (that.newobjs[i].positionId == this.name) {
						that.newobjs[i].priority = 0;
						break;
					}
				}
			});

			var grp1 = document.createElement("label");
			cell1.appendChild(grp1);
			var r2 = document.createElement("input");
			grp1.appendChild(r2);
			r2.type = "radio";
			r2.name = json[i].id;
			r2.id = json[i].id;
			r2.setAttribute("value", "1");
			var wlebl = document.createElement("span");
			grp1.appendChild(wlebl);
			wlebl.innerHTML = "重要" + "&nbsp;&nbsp;";
			if (!f) {
				r2.disabled = true;
			}
			for (var j = 0; j < this.newobjs.length; j++) {
				if (r2.name == this.newobjs[j].positionId
						&& this.newobjs[j].priority == 1) {
					r2.checked = true;
					break;
				}
			}
			r2.addEventListener("click", function() {
				for (var i = 0; i < that.newobjs.length; i++) {
					if (that.newobjs[i].positionId == this.name) {
						that.newobjs[i].priority = 1;
						break;
					}
				}
			});

			var grp2 = document.createElement("label");
			cell1.appendChild(grp2);
			var r3 = document.createElement("input");
			grp2.appendChild(r3);
			r3.type = "radio";
			r3.name = json[i].id;
			r3.id = json[i].id;
			r3.setAttribute("value", "2");
			var hlebl = document.createElement("span");
			grp2.appendChild(hlebl);
			hlebl.innerHTML = "优先";
			if (!f) {
				r3.disabled = true;
			}
			for (var j = 0; j < this.newobjs.length; j++) {
				if (r3.name == this.newobjs[j].positionId
						&& this.newobjs[j].priority == 2) {
					r3.checked = true;
					break;
				}
			}
			r3.addEventListener("click", function() {
				for (var i = 0; i < that.newobjs.length; i++) {
					if (that.newobjs[i].positionId == this.name) {
						that.newobjs[i].priority = 2;
						break;
					}
				}
			});
		}
		this.addHeader();
	};

	ParticipantEditDialog.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	ParticipantEditDialog.prototype.addAccessibleVar = function(dv, list) {
		list.push(dv);
	};

	ParticipantEditDialog.prototype.removeAccessibleVar = function(id, list) {
		for (var i = 0; i < list.length; i++) {
			if (list[i].varId == id) {
				list.splice(i, 1);
				break;
			}
		}
	};

	ParticipantEditDialog.prototype.addHeader = function() {
		var header = this.positionlist.createTHead();
		var row = header.insertRow(0);
		this.createHead("选项", row);
		this.createHead("办理岗位", row);
		this.createHead("优先级", row);
	};

	ParticipantEditDialog.prototype.createCell = function(no, content, row) {
		var cell = row.insertCell(no);
		cell.setAttribute("nowrap", "true");
		if (content == "") {
			cell.innerHTML = "&nbsp;";
		} else {
			$(cell).text(content);
		}
	};

	ParticipantEditDialog.prototype.createHead = function(content, row) {
		var th = document.createElement('th');
		th.setAttribute("nowrap", "true");
		th.innerHTML = content;
		row.appendChild(th);
	};

	ParticipantEditDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	ParticipantEditDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true,
		});
	};

	ParticipantEditDialog.prototype.doClick = function(evt) {
		if (evt.target == this.launcherInput) {
			// console.log(this.newobjs);
			if (evt.target.checked) {
				if (this.tmpobj == null) {
					var a = new Participant();
					a.id = null;
					a.taskId = this.entity.id;
					a.participationType = 1;
					a.organizationId = null;
					a.organizationName = null;
					a.departmentId = null;
					a.departmentName = null;
					a.positionId = null;
					a.positionName = null;
					a.userId = "WORKFLOW_LAUNCHR";
					a.userFullName = null;
					a.priority = 2;
					a.currOwner = this.entity.currOwner;
					a.owner = this.entity.owner;
					this.addParticipant(a, this.newobjs);
				} else {
					this.newobjs.push(this.tmpobj[0]);
				}
			} else {
				this.tmpobj = null;
				for (var i = 0; i < this.newobjs.length; i++) {
					if (this.newobjs[i].participationType == 0) {
						this.tmpobj = this.newobjs.splice(i, 1);
						break;
					}
				}
			}
			// console.log(this.newobjs);
		} else if (evt.target == this.orgInput) {
			// console.log(this.entity.participants);
			this.tmpobj = null;
			if (evt.target.checked) { // checked
				this.oSelect.disabled = false;
				this.dSelect.disabled = false;
				$("input[id=potsions][type=checkbox]").attr('disabled', false);
				if (this.tmpobjs.length > 0) {
					for (var i = 0; i < this.tmpobjs.length; i++) {
						// console.log(this.tmpobjs[i]);
						if (this.tmpobjs[i].participationType == 0) {
							$(
									"input[id=" + this.tmpobjs[i].positionId
											+ "][type=radio]").attr('disabled',
									false);
						}
						this.newobjs.push(this.tmpobjs[i]);
					}
				}
			} else { // not checked
				this.oSelect.disabled = true;
				this.dSelect.disabled = true;
				$("input[id=potsions][type=checkbox]").attr('disabled', true);
				$("input[type=radio]").attr('disabled', true);
				for (var i = 0; i < this.newobjs.length; i++) {
					if (this.newobjs[i] != null
							&& this.newobjs[i].participationType == 1) {
						this.tmpobj = this.newobjs.splice(i, 1);// splice array
						break;
					}
				}
				this.tmpobjs = this.newobjs;
				// console.log(this.tmpobjs);
				this.newobjs = [];
				if (this.tmpobj != null && this.tmpobj.length > 0) {
					this.newobjs.push(this.tmpobj[0]);
					this.tmpobj = null;
				}
				// console.log(this.newobjs);
			}
		}
		if (evt.target.id == "OK" + this.options.id) {
			// console.log(this.newobjs);
			this.cmd.update(this.newobjs);
			map[this.currOwner.id].stack.execute(this.cmd);
			this.hide();
		}
	};

	ParticipantEditDialog.prototype.addParticipant = function(obj, list) {
		var that = this;
		// console.log(obj);
		// console.log(list);
		$.getJSON(service.api(2)).complete(function(data) {
			obj.id = data.responseText;
			list.push(obj);
		});
	};

	ParticipantEditDialog.prototype.removeParticipant = function(id, list) {
		for (var i = 0; i < list.length; i++) {
			if (list[i].varId == id) {
				list.splice(i, 1);
				break;
			}
		}
	};

	ParticipantEditDialog.prototype.doChange = function(evt) {
		if (evt.target == this.oSelect) {
			$(this.dSelect).find('option').remove().end();
			// $(this.positionlist).children().remove();
			this.loadingDpts(
					this.oSelect.options[this.oSelect.selectedIndex].value, -1,
					-1, this.oSelect.options[this.oSelect.selectedIndex].text);
		} else if (evt.target == this.dSelect) {
			// $(this.positionlist).children().remove();
			if (this.dSelect.selectedIndex > -1)
				this.loadingPositions(
						this.dSelect.options[this.dSelect.selectedIndex].value,
						this.dSelect.options[this.dSelect.selectedIndex].text,
						this.oSelect.options[this.oSelect.selectedIndex].value,
						this.oSelect.options[this.oSelect.selectedIndex].text);
		}

	};

	ParticipantEditDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');    
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ParticipantEditDialog(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);