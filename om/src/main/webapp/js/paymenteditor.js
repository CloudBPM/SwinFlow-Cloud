/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "omPaymentEditor";
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
		this.init(options);
		this.createToolbar(options);
		
		//this.loading(1, this.pagesize, "", options.ownerId);
	};

	Editor.prototype.init = function(options) {
		this.editorPanel = document.createElement("DIV");
		this.element.appendChild(this.editorPanel);
		this.editorPanel.style.margin = "0px";
		this.editorPanel.style.padding = "0px";
		this.editorPanel.style.overflow = "auto";
		this.toolbarRow = document.createElement("DIV");
		this.editorPanel.appendChild(this.toolbarRow);
		this.toolbarRow.className = "row";
		this.toolbarRow.style.margin = "0px";
		this.toolbarRow.style.padding = "0px";
		this.painterRow = document.createElement("DIV");
		this.editorPanel.appendChild(this.painterRow);
		this.painterRow.className = "row";
		this.painterRow.style.margin = "0px";
		this.painterRow.style.padding = "0px";

		var canvasPanel = document.createElement("DIV");
		this.painterRow.appendChild(canvasPanel);
		canvasPanel.id = "userEditingPanel" + options.id;
		canvasPanel.className = "col";
		
		canvasPanel.style.width = options.width + "px";
		canvasPanel.style.margin = "0px";
		canvasPanel.style.marginLeft = "0px";
		canvasPanel.style.padding = "0px";

		// bank account info
		var mainmodalframe = document.createElement("div");
		mainmodalframe.className = "panel panel-default";
		canvasPanel.appendChild(mainmodalframe);
		
		var modalframehead = document.createElement("div");
		modalframehead.className = "panel-heading";
		mainmodalframe.appendChild(modalframehead);
		modalframehead.innerHTML = "开户行账号信息";

		var panelbody = document.createElement("div");
		panelbody.className = "panel-body";
		mainmodalframe.appendChild(panelbody);
		
		var accountform = document.createElement("form");
		accountform.className = "form-horizontal";
		panelbody.appendChild(accountform);
		
		// account number
		var accountgroup = document.createElement("div");
		accountgroup.style.padding = "2px";
		accountgroup.className = "form-group";
		accountform.appendChild(accountgroup);
		
		var accountLabel = document.createElement("label");
		accountLabel.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12 control-label";
		accountLabel.innerHTML = "开户银行账号";
		accountgroup.appendChild(accountLabel);
		
		var accountdiv = document.createElement("div");
		accountdiv.className = "col-lg-10 col-md-10 col-sm-12 col-xs-12";
		accountgroup.appendChild(accountdiv);

		this.accountInput = document.createElement("input");
		this.accountInput.type = "text";
		this.accountInput.id = "accountInput" + this.options.id;
		this.accountInput.name = "accountInput" + this.options.id;
		this.accountInput.className = "form-control";
		this.accountInput.setAttribute("placeholder", "请输入开户行账户");
		accountdiv.appendChild(this.accountInput);
		
		// account name
		var accountnamegroup = document.createElement("div");
		accountnamegroup.style.padding = "2px";
		accountnamegroup.className = "form-group";
		accountform.appendChild(accountnamegroup);
		
		var accountnameLabel = document.createElement("label");
		accountnameLabel.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12 control-label";
		accountnameLabel.innerHTML = "开户银行账户名";
		accountnamegroup.appendChild(accountnameLabel);
		
		var accountnameDiv = document.createElement("div");
		accountnameDiv.className = "col-lg-10 col-md-10 col-sm-12 col-xs-12";
		accountnamegroup.appendChild(accountnameDiv);

		this.accountNameInput = document.createElement("input");
		this.accountNameInput.type = "text";
		this.accountNameInput.id = "accountnameInput" + this.options.id;
		this.accountNameInput.name = "accountnameInput" + this.options.id;
		this.accountNameInput.className = "form-control";
		this.accountNameInput.setAttribute("placeholder", "请输入开户行账户名");
		accountnameDiv.appendChild(this.accountNameInput);
		
		// account address
		var accountaddressgroup = document.createElement("div");
		accountaddressgroup.style.padding = "2px";
		accountaddressgroup.className = "form-group";
		accountform.appendChild(accountaddressgroup);
		
		var accountaddressLabel = document.createElement("label");
		accountaddressLabel.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12 control-label";
		accountaddressLabel.innerHTML = "开户银行地址";
		accountaddressgroup.appendChild(accountaddressLabel);
		
		var accountaddressDiv = document.createElement("div");
		accountaddressDiv.className = "col-lg-10 col-md-10 col-sm-12 col-xs-12";
		accountaddressgroup.appendChild(accountaddressDiv);

		this.accountAddressInput = document.createElement("input");
		this.accountAddressInput.type = "text";
		this.accountAddressInput.id = "accountaddressInput" + this.options.id;
		this.accountAddressInput.name = "accountaddressInput" + this.options.id;
		this.accountAddressInput.className = "form-control";
		this.accountAddressInput.setAttribute("placeholder", "请输入开户行地址");
		accountaddressDiv.appendChild(this.accountAddressInput);

	};



	Editor.prototype.loading = function(pageno, pagesize, condition, ownerid) {
//		$("#progressbar").show();
//		var that = this;
//		$.getJSON(omservices.api(17,this.options.ownerId), {
//			cond : condition,
//			ownid : ownerid,
//			pn : pageno,
//			psz : pagesize,
//		}).complete(function(data) {
//		var data = data.responseJSON;
//		if (data.status != null && data.status != ""
//			&& data.status != undefined) {
//		if (data.status == 0 || data.status == -10) {
//			messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
//		}
//	} else {
//		that.loadData(data);
//	}
//			$("#progressbar").hide();
//		});
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.loadData = function(jsonobj) {

	};

	Editor.prototype.createToolbar = function(options) {
		var toolbarForm = document.createElement("form");
		toolbarForm.className = "form-inline";
		this.toolbarRow.appendChild(toolbarForm);

		var toolbarDiv = document.createElement("DIV");
		toolbarForm.appendChild(toolbarDiv);
		toolbarDiv.style.margin = "0px";
		toolbarDiv.style.padding = "2px";
		toolbarDiv.style.padding = "2px";
		this.createUndoRedoGroup(toolbarDiv);
	};

	Editor.prototype.createUndoRedoGroup = function(parent) {
		var group = this.createGroup(parent);
		this.undobutton = this.createTool(group, "undoG" + this.options.id,
				"撤销", "btn btn-default", "i", "fa fa-reply fa-lg");
		// fa-lg: 24px; fa-2x ：32px
		this.redobutton = this.createTool(group, "redoG" + this.options.id,
				"恢复", "btn btn-default", "i", "fa fa fa-share fa-lg");
		this.stack.undoButton = this.undobutton;
		this.stack.redoButton = this.redobutton;
		this.disableButton(this.undobutton);
		this.disableButton(this.redobutton);
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


	Editor.prototype.createTool = function(group, id, title, style, fonttag,
			fontclass) {
		var button = document.createElement("button");
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		group.appendChild(button);
		var icon = document.createElement(fonttag);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		button.appendChild(icon);
		return button;
	};

	Editor.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	Editor.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	Editor.prototype.setPropertySheet = function(obj) {
		if (obj == null && this.groups != null && this.groups.length > 0) {
			obj = this.groups[0];
		}
		// basic property setting
		if (this.basicpropsheet != null) {
			this.basicpropsheet.tabId = this.options.id;
			this.basicpropsheet.setSheet(obj);
		}
		// advanced property setting.
		if (this.propsheet != null) {
			this.propsheet.tabId = this.options.id;
			this.propsheet.setSheet(obj);
		}
	};

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	Editor.prototype.doClick = function(evt) {
		if (evt.target == this.undobutton
				|| (evt.target.id == ("undoG" + this.options.id))) {
			this.stack.undo();
		} else if (evt.target == this.redobutton
				|| (evt.target.id == ("redoG" + this.options.id))) {
			this.stack.redo();
		}
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
