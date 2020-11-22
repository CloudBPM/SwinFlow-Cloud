/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "createModelDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
	};

	var CreateModelDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.modalframe;
		this.topparent;
		this.init(options);
	};

	CreateModelDialog.prototype.init = function(options) {
		this.topparent = options.topparent;
		// dialog
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);
		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

		var modaldialogDIV = document.createElement("div");
		this.modalframe.appendChild(modaldialogDIV);
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "650px"

		var dialogContentDIV = document.createElement("div");
		modaldialogDIV.appendChild(dialogContentDIV);
		dialogContentDIV.className = "modal-content";

		// dialog headding
		var dialogHeaderDIV = document.createElement("div");
		dialogContentDIV.appendChild(dialogHeaderDIV);
		dialogHeaderDIV.className = "modal-header";

		var closeButton = document.createElement("button");
		dialogHeaderDIV.appendChild(closeButton);
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");

		var closeSpan = document.createElement("span");
		closeButton.appendChild(closeSpan);
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";

		var titleH4 = document.createElement("h4");
		dialogHeaderDIV.appendChild(titleH4);
		titleH4.className = "modal-title";
		titleH4.id = "modal" + options.id;

		var infoIcon = document.createElement("i");
		titleH4.appendChild(infoIcon);
		infoIcon.className = "fa fa-plus-circle fa-lg";
		infoIcon.style.color = "green";

		var info = document.createElement("label");
		titleH4.appendChild(info);
		info.innerHTML = options.title;

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);

		var dialogBodyDIV = document.createElement("div");
		dialogForm.appendChild(dialogBodyDIV);
		dialogBodyDIV.className = "modal-body";

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);
		dialogBodyFrameDIV.className = "container-fluid";

		var bodyRow = document.createElement("div");
		dialogBodyFrameDIV.appendChild(bodyRow);
		bodyRow.className = "row";
		bodyRow.id = "bodyrow" + options.id;

		// add form panel here...
		this.loadPanel(bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogForm.appendChild(dialogFooterDIV);
		dialogFooterDIV.className = "modal-footer";

		var saveButton = document.createElement("button");
		dialogFooterDIV.appendChild(saveButton);
		saveButton.type = "Button";
		saveButton.id = "OKButton" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.addEventListener("click", this, false);
		saveButton.innerHTML = "创建";

		var cancelButton = document.createElement("button");
		dialogFooterDIV.appendChild(cancelButton);
		cancelButton.type = "Button";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");

	};

	CreateModelDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		parent.appendChild(form);

		var categroup = document.createElement("div");
		form.appendChild(categroup);
		categroup.className = "form-group";

		var categoryLabel = document.createElement("label");
		categroup.appendChild(categoryLabel);
		categoryLabel.setAttribute("for", "entitytype");
		categoryLabel.className = "control-label";
		categoryLabel.innerHTML = "创建对象类型";

		this.select = document.createElement("select");
		this.select.className = "form-control";
		this.select.name = "entitytype";
		categroup.appendChild(this.select);
		this.addOptions(this.select, "办公日历", "101", 0);
		this.addOptions(this.select, "职位/项目角色分类", "137", 1);
		this.addOptions(this.select, "部门/项目组分类", "136", 2);
		this.addOptions(this.select, "组织分类", "135", 3);
		this.addOptions(this.select, "级别分类", "138", 4);
		this.select.addEventListener("change", this, false);

		// --
		var radiosDIV5 = document.createElement("div");
		form.appendChild(radiosDIV5);
		radiosDIV5.className = "form-group";

		var radiosLabel5 = document.createElement("label");
		radiosDIV5.appendChild(radiosLabel5);
		radiosLabel5.setAttribute("for", "entityname");
		radiosLabel5.className = "control-label";
		radiosLabel5.innerHTML = "名称";

		this.nameInput = document.createElement("input");
		radiosDIV5.appendChild(this.nameInput);
		this.nameInput.type = "text";
		this.nameInput.setAttribute("placeholder", "请输入一个名称，名称不能为空。")
		this.nameInput.name = "entityname";
		this.nameInput.className = "form-control";
		this.nameInput.addEventListener("keydown", this, false);

		var dialog = $(parent).alertBox({
			id : this.options.id,
		});
		this.messageBox = dialog.data("alertBox");

	};

	CreateModelDialog.prototype.addOptions = function (parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	CreateModelDialog.prototype.show = function() {
		this.nameInput.value = "";
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	CreateModelDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	CreateModelDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};

	CreateModelDialog.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {
			if (evt.target.value != "") {
				var name1 = evt.target.value;
				var type = this.select.value;
				this.createNewObject(type, name1);
			} else {
				this.messageBox.show(4, "名称不能为空", false);
			}
			evt.preventDefault();
			return false;
		}
	};

	CreateModelDialog.prototype.doClick = function(evt) {
		if (evt.target.id == "OKButton" + this.options.id) {
			var name1 = this.nameInput.value;
			if (name1 == "") {
				this.messageBox.show(4, "名称不能为空", false);
				return;
			} else {
				$("#progressbar").show();
				var that = this;
				$.getJSON(service.api(30, this.ownerId), {
					name : name1,
					owner : this.ownerId,
				}).complete(function(data) {
					if (data.responseJSON == 6) { // no duplication
						that.createNewObject(name1);
					} else {
						that.messageBox.show(4, "名称重复了，请重新输入一个名称", false);
						Utils.stopBubble(evt);
					}
					$("#progressbar").hide();
				});
			}

		}
	};

	CreateModelDialog.prototype.initData = function(type, owner) {
		this.ownerId = owner;
		this.select.disabled = true;
		if (type == "101") {
			this.select.value = type;
		} else if (type == "135") {
			this.select.value = type;
		} else if (type == "136") {
			this.select.value = type;
		} else if (type == "137") {
			this.select.value = type;
		} else if (type == "138") {
			this.select.value = type;
		}
	};

	CreateModelDialog.prototype.createNewObject = function(name1) {
		var instance = $('#treeview').jstree();
		var selected = instance.get_selected(true);
		if (selected.length > 0) {// create category
			var parent = instance.get_selected(true)[0];
			var s = parent.data;
			var arry = s.split("|");
			var type = arry[0]; // folder type
			if (type == "2") { // folder type is 2
				if (arry[2] == "135" || arry[2] == "136" || arry[2] == "137"
						|| arry[2] == "138" || arry[2] == "101") {
					// var pID = instance.get_parent(parent);
					// $('#treeview').jstree('deselect_all', true);
					// $('#treeview').jstree('select_node', pID);
					// parent = instance.get_selected(true)[0];
					var parentID = parent.id;
					var ownerID = arry[1];
					this.options.parent.createObject(parent, name1, parentID,
							ownerID, arry[2], parentID);
				}
			} else if (type == "3") { // folder type is 3
				// var pID = instance.get_parent(parent);
				// $('#treeview').jstree('deselect_all', true);
				// $('#treeview').jstree('select_node', pID);
				// parent = instance.get_selected(true)[0];
				var parentID = parent.id;
				var ownerID = arry[1];
				this.options.parent.createObject(parent, name1, parentID,
						ownerID, arry[2], arry[3]);
			}
			this.hide();
		} else {
			this.messageBox.show(4, "你没有选择一个节点，请选择一个节点。", false);
		}

	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new CreateModelDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);