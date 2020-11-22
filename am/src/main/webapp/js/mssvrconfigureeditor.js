;
(function($, window, document, undefined) {
	var pluginName = "mServerConfigureEditor";
	var defaults = {
		id : "",
		cid : "",
		basicpropsheet : "",
		propsheet : "",
		width : "",
		height : "",
		parent : "",
	};

	var DockerImagePane = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			cid : "",
			basicpropsheet : "",
			propsheet : "",
			width : "",
			height : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.stack = options.parent.stack;
		this.basicpropsheet = options.basicpropsheet;
		this.propsheet = options.propsheet;
		this.initMainPanel(options);
		this.loading(options.cid);
	};

	DockerImagePane.prototype.initMainPanel = function(options) {
		var editorPanel = document.createElement("DIV");
		this.element.appendChild(editorPanel);
		editorPanel.id = "accAppPane3Div4" + options.cid;
		editorPanel.style.width = (options.width) + "px";
		editorPanel.style.margin = "0px";
		editorPanel.style.padding = "0px";

		var contentPanel = document.createElement("DIV");
		editorPanel.appendChild(contentPanel);
		contentPanel.className = "col";
		contentPanel.style.width = "100%";
		contentPanel.style.margin = "0px";
		contentPanel.style.marginTop = "2px";
		contentPanel.style.padding = "0px";

		var cntDivPanel = document.createElement("DIV");
		contentPanel.appendChild(cntDivPanel);
		cntDivPanel.className = "panel panel-default";
		cntDivPanel.id = "accAppPane4" + options.cid;
		cntDivPanel.style.height = options.height + "px";
		cntDivPanel.style.marginBottom = "0px";
		cntDivPanel.style.overflowX = "auto";
		cntDivPanel.style.overflowY = "auto";

		var bodyDivPane = document.createElement("DIV");
		cntDivPanel.appendChild(bodyDivPane);
		bodyDivPane.className = "panel-body";

		// create form
		var panelForm = document.createElement("Form");
		bodyDivPane.appendChild(panelForm);
		panelForm.className = "form-horizontal";
		panelForm.addEventListener("change", this, false);
		
		// row 1 
		
		var row1 = document.createElement("DIV");
		panelForm.appendChild(row1);
		row1.className = "row";
		
		var col11 = document.createElement("DIV");
		row1.appendChild(col11);
		col11.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		// create div for name
		this.divName = document.createElement("DIV");
		col11.appendChild(this.divName);
		this.divName.className = "form-group";
		this.divName.id = "Name";

		var label1 = document.createElement("LABEL");
		this.divName.appendChild(label1);
		label1.className = "col-sm-2 control-label";
		label1.innerHTML = "服务器名";

		this.colDIV1 = document.createElement("DIV");
		this.divName.appendChild(this.colDIV1);
		this.colDIV1.className = "col-sm-10";
		this.colDIV1.id = "inputbody1";

		this.inputName = document.createElement("INPUT");
		this.colDIV1.appendChild(this.inputName);
		this.inputName.id = "imageName" + options.cid;
		this.inputName.className = "form-control";
		this.inputName.type = "text";
		this.inputName.setAttribute("placeholder",
				"请输入名称，名称只能由A-Z和a-z和0-9和下划线组成，不能输中文");
		this.inputName.addEventListener("blur", this, false);
		this.inputName.addEventListener("change", this, false);
		this.inputName.addEventListener("keyup", this, false);
		
		var col12 = document.createElement("DIV");
		row1.appendChild(col12);
		col12.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		
		// create div for images
		this.divImages = document.createElement("DIV");
		col12.appendChild(this.divImages);
		this.divImages.className = "form-group";
		this.divImages.id = "divImages" + options.cid;

		var label3 = document.createElement("LABEL");
		this.divImages.appendChild(label3);
		label3.className = "col-sm-2 control-label";
		label3.innerHTML = "镜像";

		this.colDIV3 = document.createElement("DIV");
		this.divImages.appendChild(this.colDIV3);
		this.colDIV3.className = "col-sm-10";
		this.colDIV3.id = "inputbody3";

		this.select = document.createElement("SELECT");
		this.colDIV3.appendChild(this.select);
		this.select.id = "images" + options.cid;
		this.select.className = "form-control";
		this.select.addEventListener("change", this, false);
		
		// row 2
		
		var row2 = document.createElement("DIV");
		panelForm.appendChild(row2);
		row2.className = "row";
		
		var col21 = document.createElement("DIV");
		row2.appendChild(col21);
		col21.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		// create div for id
		this.divID = document.createElement("DIV");
		col21.appendChild(this.divID);
		this.divID.className = "form-group"
		this.divID.id = "ID";

		var label2 = document.createElement("LABEL");
		this.divID.appendChild(label2);
		label2.className = "col-sm-2 control-label";
		label2.innerHTML = "服务器ID";

		this.colDIV2 = document.createElement("DIV");
		this.divID.appendChild(this.colDIV2);
		this.colDIV2.className = "col-sm-10";
		this.colDIV2.id = "inputbody2";

		this.inputID = document.createElement("INPUT");
		this.colDIV2.appendChild(this.inputID);
		this.inputID.id = "imageID" + options.cid;
		this.inputID.className = "form-control";
		this.inputID.type = "text";
		this.inputID.setAttribute("placeholder",
				"微服务器ID会在启动时候自动获取");
		this.inputID.readOnly = "readOnly";

		var col22 = document.createElement("DIV");
		row2.appendChild(col22);
		col22.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		// create div for port
		this.divPort = document.createElement("DIV");
		col22.appendChild(this.divPort);
		this.divPort.className = "form-group";
		this.divPort.id = "port";

		var label4 = document.createElement("LABEL");
		this.divPort.appendChild(label4);
		label4.className = "col-sm-2 control-label";
		label4.innerHTML = "访问端口";

		this.colDIV4 = document.createElement("DIV");
		this.divPort.appendChild(this.colDIV4);
		this.colDIV4.className = "col-sm-10"
		this.colDIV4.id = "inputbody4";

		this.inputPort = document.createElement("INPUT");
		this.colDIV4.appendChild(this.inputPort);
		this.inputPort.id = "imagePort" + options.cid;
		this.inputPort.className = "form-control"
		this.inputPort.type = "text";
		this.inputPort.setAttribute("placeholder",
				"微服务器对外访问端口，由系统自动更生成");
		this.inputPort.readOnly = "readOnly";
		
		// row 3 
		
		var row3 = document.createElement("DIV");
		panelForm.appendChild(row3);
		row3.className = "row";
		
		var col31 = document.createElement("DIV");
		row3.appendChild(col31);
		col31.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		//create div for continerPort
        // this.divCPort = document.createElement("DIV");
        // col31.appendChild(this.divCPort);
        // this.divCPort.className = "form-group"
        // this.divCPort.id = "Cport";
        //
        // var label5 = document.createElement("LABEL");
        // this.divCPort.appendChild(label5);
        // label5.className = "col-sm-2 control-label";
        // label5.innerHTML = "服务器端口";
        //
        // this.colDIV5 = document.createElement("DIV");
        // this.divCPort.appendChild(this.colDIV5);
        // this.colDIV5.className = "col-sm-10";
        // this.colDIV5.id = "inputbody2";
        //
        // this.inputCPort = document.createElement("INPUT");
        // this.colDIV5.appendChild(this.inputCPort);
        // this.inputCPort.id = "CPort" + options.cid;
        // this.inputCPort.className = "form-control";
        // this.inputCPort.type = "text";
        // this.inputCPort.setAttribute("placeholder",
         //    "请填写服务器端口");
        //this.inputCPort.readOnly = "readOnly";

		var col32 = document.createElement("DIV");
		row3.appendChild(col32);
		col32.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		
		// row 4
		
		var row4 = document.createElement("DIV");
		panelForm.appendChild(row4);
		row4.className = "row";
		
		var col41 = document.createElement("DIV");
		row4.appendChild(col41);
		col41.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		
		var col42 = document.createElement("DIV");
		row4.appendChild(col42);
		col42.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		

		var dockerImages = new DockerImages();
		this.currImages = dockerImages;
		var serviceContainer = new ServiceContainer();
		this.currContainer = serviceContainer;
	};

	DockerImagePane.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	DockerImagePane.prototype.loading = function(id) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api("22"), {
			id : id,
		}).complete(
				function(data) {
					var newData = data.responseJSON;
					if (newData != null) {
						that.currContainer.parse(newData);
						that.options.parent.currObject = that.currContainer;
						that.setPropertySheet();
						if (that.currContainer.containerId != null
								&& that.currContainer.containerId != "") {
							that.setEntity(that.currContainer);
							that.checkStatus(newData);
							that.options.parent.dataStatistics.loading(that.currContainer.containerType);
						} else {
							that.loadingImages(newData);
						}
					}
					$("#progressbar").hide();
				});
	};

	DockerImagePane.prototype.loadingImages = function(data) {
		this.currContainer.parse(data);
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api("21"), {
			type : this.currContainer.containerType,
		}).complete(function(data1) {
			if (data1.responseJSON != null) {
				that.loadDataFromDK(data1.responseJSON);
			}
			$("#progressbar").hide();
		});
	};

	DockerImagePane.prototype.loadDataFromDK = function(jsondb) {
		this.addOptions(this.select, "- 请选择 -", "-1", 0);
		for (var i = jsondb.length - 1; i >= 0; i--) {
			this.currImages.parseFromJSON(jsondb[i]);
			this.addOptions(this.select, this.currImages.imagesTag, i, 0);
			this.inputPort.value = "";
		}
		this.options.parent.startbutton.disabled = false;
		this.options.parent.stopbutton.disabled = false;
		this.options.parent.startbutton.classList.remove("active");
		this.options.parent.stopbutton.classList.remove("active");
	};

	DockerImagePane.prototype.setEntity = function(entity) {
		this.inputName.value = entity.containerName;
		this.inputName.disabled = true;
		this.inputID.value = entity.containerId;
		var n = entity.imageName + ":";
		var Tag = n + entity.imageVersion;
		this.addOptions(this.select, Tag, 1, 0);
		this.select.disabled = "disabled";
		if (entity.exposedPort != 0) {
			this.inputPort.value = entity.exposedPort;
		} else {
			this.inputPort.value = "";
		}
	};

	DockerImagePane.prototype.refreshEntity = function(entity) {
		this.inputName.value = entity.containerName;
		this.setPropertySheet();
	};

	DockerImagePane.prototype.checkStatus = function(jsondb) {
		var that = this;
		$("#progressbar").show();
		$.getJSON(service.api("25"), {
			containerId : this.currContainer.containerId,
		}).complete(function(data) {
			if (data.responseText == "active") {
				that.options.parent.startbutton.disabled = true;
				that.options.parent.stopbutton.disabled = false;
			} else {
				that.options.parent.startbutton.disabled = true;
				that.options.parent.stopbutton.disabled = true;
			}
			$("#progressbar").hide();
		})
	};

	DockerImagePane.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		case "blur":
			this.doBlur(e);
			break;
		case "keyup":
			this.doKeyup(e);
			break;
		}
	};

	DockerImagePane.prototype.doBlur = function(evt) {
		if (evt.target == this.inputName) {
			this.currContainer.containerName = this.inputName.value;
		}
	};

	DockerImagePane.prototype.doChange = function(evt) {
		if (evt.target == this.select) {
			var id = this.select.id;
			this.currImages.imagesTag = $("#" + id + " option:selected").text();
		} else if (evt.target == this.inputName) {
			var newvalue = this.inputName.value;
			this.stack.execute(new AMImageConfigurePaneChangedCmd(
					this.currContainer, "containerName", newvalue));
		}
	};

	DockerImagePane.prototype.doKeyup = function(evt) {
		if (evt.target == this.inputName) {
			if (this.inputName.value == null || this.inputName.value == "") {

			} else {
				if (this.inputName.value
						.replace(
								/[^\u4E00-\u9FA5\!\@\#\$\%\^\&\*\(\)\-\+\=\~\`\[\]\{\}\;\:\"\'\,\.\/\<\>\?\！\、\【\】\：\；\”\“\，\。\《\》\？\——\ ]/g,
								'')) {
					// if(this.inputName.value.replace(/[^\a-\z\A-\Z0-9\_]/g,'')){
					console.log(this.options.parent);
					this.options.parent.messageDialog.show("名称只能是数字、字母或者字母数字组合");
					
					this.inputName.value = "";
				}
			}
		}
	};

	DockerImagePane.prototype.changeValue = function(tag, entity, prop,
			oldvalue, isnull) {
		var newvalue = $(tag).children("input").val();
		if (isnull == "n" && (newvalue == null || newvalue == "")) {
			this.options.parent.messageDialog.show("这个属性不能为空。");
			return false;
		} else {
			if (newvalue != oldvalue) {
				for (x in entity) {
					if (x == prop) {
						map[entity.parent].stack
								.execute(new AMImageConfigurePaneChangedCmd(
										entity, prop, newvalue));
						break;
					}
				}
				$(tag).text(newvalue);
			} else {
				$(tag).text(oldvalue);
			}
			return true;
		}
	};

	DockerImagePane.prototype.setPropertySheet = function() {
		// basic property setting
		if (this.basicpropsheet != null) {
			this.basicpropsheet.setSheet(this.currContainer);
		}
		// advanced property setting.
		if (this.propsheet != null) {
			this.propsheet.setSheet(this.currContainer, this.propsheet
					.getCurrTabIndex(this.currContainer));
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new DockerImagePane(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};
})(jQuery, window, document);