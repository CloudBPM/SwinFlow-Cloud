/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "createModelDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
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

		this.saveButton = document.createElement("button");
		dialogFooterDIV.appendChild(this.saveButton);
		this.saveButton.type = "Button";
		this.saveButton.className = "btn btn-primary";
		this.saveButton.addEventListener("click", this, false);
		this.saveButton.innerHTML = "创建";

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

		// -- new folder
		var radiosDIV1 = document.createElement("div");
		form.appendChild(radiosDIV1);
		radiosDIV1.className = "radio-inline";

		var radiosLabel1 = document.createElement("label");
		radiosDIV1.appendChild(radiosLabel1);

		this.radiosInput1 = document.createElement("input");
		radiosLabel1.appendChild(this.radiosInput1);
		this.radiosInput1.type = "radio";
		this.radiosInput1.name = "optionsRadios";
		this.radiosInput1.value = "1";
		this.radiosInput1.addEventListener("click", this, false);

		var radiosText1 = document.createElement("text");
		radiosLabel1.appendChild(radiosText1);
		radiosText1.innerHTML = "新文件夹";

		// -- new application process program

		var radiosDIV2 = document.createElement("div");
		form.appendChild(radiosDIV2);
		radiosDIV2.className = "radio-inline";

		var radiosLabel2 = document.createElement("label");
		radiosDIV2.appendChild(radiosLabel2);

		this.radiosInput2 = document.createElement("input");
		radiosLabel2.appendChild(this.radiosInput2);
		this.radiosInput2.type = "radio";
		this.radiosInput2.name = "optionsRadios";
		this.radiosInput2.value = "2";
		this.radiosInput2.addEventListener("click", this, false);

		var radiosText2 = document.createElement("text");
		radiosLabel2.appendChild(radiosText2);
		radiosText2.innerHTML = "新SaaS应用";

		// -- a process type
		var radiosDIV3 = document.createElement("div");
		form.appendChild(radiosDIV3);
		radiosDIV3.className = "radio-inline";

		var radiosLabel3 = document.createElement("label");
		radiosDIV3.appendChild(radiosLabel3);

		this.radiosInput3 = document.createElement("input");
		radiosLabel3.appendChild(this.radiosInput3);
		this.radiosInput3.type = "radio";
		this.radiosInput3.name = "optionsRadios1";
		this.radiosInput3.value = "0";

		var radiosText3 = document.createElement("text");
		radiosLabel3.appendChild(radiosText3);
		radiosText3.innerHTML = "自动应用";

		// -- s process type
		var radiosDIV4 = document.createElement("div");
		form.appendChild(radiosDIV4);
		radiosDIV4.className = "radio-inline";

		var radiosLabel4 = document.createElement("label");
		radiosDIV4.appendChild(radiosLabel4);

		this.radiosInput4 = document.createElement("input");
		radiosLabel4.appendChild(this.radiosInput4);
		this.radiosInput4.type = "radio";
		this.radiosInput4.name = "optionsRadios1";
		this.radiosInput4.value = "1";

		var radiosText4 = document.createElement("text");
		radiosLabel4.appendChild(radiosText4);
		radiosText4.innerHTML = "单人应用";

		// -- m process type
		var radiosDIV5 = document.createElement("div");
		form.appendChild(radiosDIV5);
		radiosDIV5.className = "radio-inline";

		var radiosLabel5 = document.createElement("label");
		radiosDIV5.appendChild(radiosLabel5);

		this.radiosInput5 = document.createElement("input");
		radiosLabel5.appendChild(this.radiosInput5);
		this.radiosInput5.type = "radio";
		this.radiosInput5.name = "optionsRadios1";
		this.radiosInput5.value = "2";

		var radiosText5 = document.createElement("text");
		radiosLabel5.appendChild(radiosText5);
		radiosText5.innerHTML = "多人应用";

		// --
		var radiosDIV3 = document.createElement("div");
		form.appendChild(radiosDIV3);
		radiosDIV3.className = "form-group";

		var radiosLabel3 = document.createElement("label");
		radiosDIV3.appendChild(radiosLabel3);
		radiosLabel3.setAttribute("for", "entityname");
		radiosLabel3.className = "control-label";
		radiosLabel3.innerHTML = "名称";

		this.nameInput = document.createElement("input");
		radiosDIV3.appendChild(this.nameInput);
		this.nameInput.type = "text";
		this.nameInput.setAttribute("placeholder", "请输入一个名称，名称不能为空。")
		this.nameInput.name = "entityname";
		this.nameInput.className = "form-control";
		this.nameInput.id = "entityname";
		this.nameInput.addEventListener("keydown", this, false);

		var dialog = $(parent).alertBox({
			id : this.options.id,
		});
		this.messageBox = dialog.data("alertBox");

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
				this.createNewObject($(
						'input[type="radio"][name="optionsRadios"]:checked')
						.val(), evt.target.value);
			} else {
				this.messageBox.show(4, "名称不能为空", false);
			}
			evt.preventDefault();
			return false;
		}
	};

	CreateModelDialog.prototype.doClick = function(evt) {
		if (evt.target == this.saveButton) {
			var name1 = $('input[name="entityname"]').val();
			// ftype is folder or SaaS app
			var ftype = $('input[type="radio"][name="optionsRadios"]:checked').val();
			var ptype = $('input[type="radio"][name="optionsRadios1"]:checked').val();
			if (name1 == "") {
				this.messageBox.show(4, "名称不能为空", false);
				return;
			}
			this.createNewObject(ftype, name1, ptype);
		} else if (evt.target == this.radiosInput1) {
			this.radiosInput3.disabled = true; // 自动应用
			this.radiosInput4.disabled = true; // 单人应用
			this.radiosInput5.disabled = true; // 多人应用
		} else if (evt.target == this.radiosInput2) {
			this.radiosInput3.disabled = false; // 自动应用
			this.radiosInput4.disabled = false; // 单人应用
			this.radiosInput5.disabled = false; // 多人应用
		}

	};
	
	CreateModelDialog.prototype.initData = function(type) {
		if (type == "109") { // 已发布应用，已发布应用文件夹下只能创建文件夹，不能创建SaaS应用
			this.radiosInput1.disabled = true; // 新文件夹
			this.radiosInput1.checked = true;  // 新文件夹
			this.radiosInput2.disabled = true; // 新SaaS应用
			this.radiosInput2.checked = false; // 新SaaS应用

			this.radiosInput3.disabled = true; // 自动应用
			this.radiosInput3.checked = false; // 自动应用
			this.radiosInput4.disabled = true; // 单人应用
			this.radiosInput4.checked = false; // 单人应用
			this.radiosInput5.disabled = true; // 多人应用
			this.radiosInput5.checked = false; // 多人应用

		} else if (type == "100") { // 未发布应用，未发布应用文件夹下能创建文件夹和SaaS应用
			this.radiosInput1.disabled = false;// 新文件夹
			this.radiosInput1.checked = false; // 新文件夹
			this.radiosInput2.disabled = false;// 新SaaS应用
			this.radiosInput2.checked = true;  // 新SaaS应用

			this.radiosInput3.disabled = false; // 自动应用
			this.radiosInput3.checked = true; // 自动应用
			this.radiosInput4.disabled = false; // 单人应用
			this.radiosInput4.checked = false; // 单人应用
			this.radiosInput5.disabled = false; // 多人应用
			this.radiosInput5.checked = false; // 多人应用
		}
	};

	CreateModelDialog.prototype.createNewObject = function(c, name1, pt) {
		var instance = $('#treeview').jstree();
		if (c == 1) { // create folder
			var selected = instance.get_selected(true);
			if (selected.length > 0) {// create folder
				var parent = instance.get_selected(true)[0];
				var parentID = parent.id;
				var s = parent.data;
				var arry = s.split("|");
				var owner = arry[1]; // owner id
				var type = arry[2]; // type
				var ownerID = "";
				if (owner == "null") {
					ownerID = parent.id;
				} else {
					ownerID = owner;
				}
				this.hide();
				this.options.parent.createFolder(parent, name1, parentID,
						ownerID, type);
			} else {
				this.messageBox.show(4, "你没有选择一个文件夹，请选择一个文件夹。", false);
			}
		} else if (c == 2) { // create SaaS process pro
			var selected = instance.get_selected(true);
			if (selected.length > 0) {// create process
				var parent = instance.get_selected(true)[0];
				var s = parent.data;
				var arry = s.split("|");
				var type = arry[0]; // type
				if (type == "1") {
					this.messageBox.show(4, "程序过程必须在文件夹下创建，请选择一个文件夹。", false);
					return;
				} else if (type == "3") {
					var pID = instance.get_parent(parent);
					$('#treeview').jstree('deselect_all', true);
					$('#treeview').jstree('select_node', pID);
					parent = instance.get_selected(true)[0];
				}
				var parentID = parent.id;
				var ownerID = arry[1];
				this.hide();
				this.options.parent.createSaaSAppProcess(parent, name1, parentID,
						ownerID, pt);
			} else {
				this.messageBox.show(4, "你没有选择一个文件夹，请选择一个文件夹。", false);
			}
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