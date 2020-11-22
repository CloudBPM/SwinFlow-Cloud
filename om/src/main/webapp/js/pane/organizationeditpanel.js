;
(function($, window, document, undefined) {
	var pluginName = "organizationEditPanel";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
		topparent : "",
		currOwner : "",
	};

	var OrganizationEditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			parent : "",
			topparent : "",
			currOwner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent = options.topparent;
		this.init(options);
	};

	OrganizationEditPanel.prototype.init = function(options) {
		this.loadPane(options.entity, options.currOwner);
	};

	OrganizationEditPanel.prototype.loadPane = function(entity, currOwner) {
		this.entity = entity;
		this.currOwner = currOwner;
		var mainmodalframeDiv = document.createElement("div");
		mainmodalframeDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		mainmodalframeDiv.style.padding = "4px";
		this.element.appendChild(mainmodalframeDiv);

		// API access security key
		var mainmodalframe1 = document.createElement("div");
		mainmodalframe1.className = "panel panel-default";
		mainmodalframeDiv.appendChild(mainmodalframe1);

		// var modalframehead1 = document.createElement("div");
		// modalframehead1.className = "panel-heading";
		// mainmodalframe1.appendChild(modalframehead1);
		// modalframehead1.innerHTML = "外部应用API访问秘钥信息";

		var panelbody1 = document.createElement("div");
		panelbody1.className = "panel-body";
		mainmodalframe1.appendChild(panelbody1);

		var form = document.createElement("form");
		form.className = "form-horizontal";
		panelbody1.appendChild(form);

		// organization category
		var categroup = document.createElement("div");
		form.appendChild(categroup);
		categroup.style.padding = "2px";
		categroup.className = "form-group";

		var categoryLabel = document.createElement("label");
		categroup.appendChild(categoryLabel);
		categoryLabel.className = "col-sm-3 control-label";
		categoryLabel.innerHTML = "所属组织类别";

		var categorydiv = document.createElement("div");
		categorydiv.className = "col-sm-9 col-xs-12";
		categroup.appendChild(categorydiv);

		this.orgCateSelect = document.createElement("select");
		this.orgCateSelect.name = "orgCateSelect" + this.options.id;
		this.orgCateSelect.className = "form-control";
		categorydiv.appendChild(this.orgCateSelect);
		this.addOptions(this.orgCateSelect, "-- 请选择组织分类 --", "-1", 0);
		this.orgCateSelect.addEventListener("change", this, false);

		// // access key id
		// var accesskeygroup = document.createElement("div");
		// accesskeygroup.style.padding = "2px";
		// accesskeygroup.className = "form-group";
		// accesskeyform.appendChild(accesskeygroup);
		//
		// var accesskeyLabel = document.createElement("label");
		// accesskeyLabel.className = "col-sm-3 control-label";
		// accesskeyLabel.innerHTML = "外部应用访问关键字";
		// accesskeygroup.appendChild(accesskeyLabel);
		//
		// var accesskeyDiv = document.createElement("div");
		// accesskeyDiv.className = "col-sm-9";
		// accesskeygroup.appendChild(accesskeyDiv);
		//
		// this.accessKeyInput = document.createElement("input");
		// this.accessKeyInput.type = "text";
		// this.accessKeyInput.id = "accessKeyInput" + this.options.id;
		// this.accessKeyInput.name = "accessKeyInput" + this.options.id;
		// this.accessKeyInput.className = "form-control";
		// this.accessKeyInput.setAttribute("readonly", "readonly");
		// accesskeyDiv.appendChild(this.accessKeyInput);
		//
		// // security access key id
		// var securitykeygroup = document.createElement("div");
		// securitykeygroup.style.padding = "2px";
		// securitykeygroup.className = "form-group";
		// accesskeyform.appendChild(securitykeygroup);
		//
		// var securitykeyLabel = document.createElement("label");
		// securitykeyLabel.className = "col-sm-3 control-label";
		// securitykeyLabel.innerHTML = "外部应用访问密码";
		// securitykeygroup.appendChild(securitykeyLabel);
		//
		// var securitykeyDiv = document.createElement("div");
		// securitykeyDiv.className = "col-sm-9";
		// securitykeygroup.appendChild(securitykeyDiv);
		//
		// this.securityKeyInput = document.createElement("input");
		// this.securityKeyInput.type = "text";
		// this.securityKeyInput.id = "securityKeyInput" + this.options.id;
		// this.securityKeyInput.name = "securityKeyInput" + this.options.id;
		// this.securityKeyInput.className = "form-control";
		// this.securityKeyInput.setAttribute("readonly", "readonly");
		// securitykeyDiv.appendChild(this.securityKeyInput);

		this.loading(this.options);
	};

	OrganizationEditPanel.prototype.loading = function (options) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api(39, options.ownerId), {
			catetype: "135",
			owner: options.ownerId,
		}).complete(function (data) {
			var dat =  JSON.parse(data.responseText);
			for (var i = 0; i < dat.length; i++) {
				that.addOptions(that.orgCateSelect, dat[i].name, dat[i].id, i + 1);
			}
			if (that.entity.categoryId != null &&
				that.entity.categoryId != undefined) {
				that.orgCateSelect.value = that.entity.categoryId;
			} else {
				that.orgCateSelect.value = "-1";
			}
			$("#progressbar").hide();
		});
	};

	OrganizationEditPanel.prototype.addOptions = function (parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	OrganizationEditPanel.prototype.handleEvent = function (e) {
		switch (e.type) {
			case "change":
				this.doChange(e);
				break;
		}
	};

	OrganizationEditPanel.prototype.doChange = function (evt) {
		if (this.orgCateSelect.value != "-1") {
			map[this.entity.id].stack.execute(new OMOrgPropChangedCmd(
				this.entity, "categoryId", this.orgCateSelect.value));
		} else {
			map[this.entity.id].stack.execute(new OMOrgPropChangedCmd(
				this.entity, "categoryId", null));
		}
	};


	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new OrganizationEditPanel(this,
						options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);