/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "omLicenceEditor";
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
	};

	Editor.prototype.init = function(options) {
		var mainframe = document.createElement("DIV");
		this.element.appendChild(mainframe);
		mainframe.id = "listPanel" + options.id;
		mainframe.style.width = options.width + "px";
		mainframe.style.margin = "0px";
		mainframe.style.marginTop = "2px";
		mainframe.style.padding = "0px";
		mainframe.style.overflow = "auto";

		this.outDiv = document.createElement("DIV");
		mainframe.appendChild(this.outDiv);
		this.outDiv.style.display = "none";
		this.outDiv.id = "outDiv";

		this.divShowPic = document.createElement("DIV");
		this.outDiv.appendChild(this.divShowPic);

		this.bigimg = document.createElement("IMG");
		this.divShowPic.appendChild(this.bigimg);
		this.bigimg.addEventListener("click", this, false);

		var div1 = document.createElement("DIV");
		mainframe.appendChild(div1);

		if (Utils.isIE() == 1) {
			div1.style.styleFloat = "left";
		} else {
			div1.style.cssFloat = "left";
		}

		div1.style.width = "33%";
		div1.className = "panel panel-success";
		div1.id = "div1";

		var div1_1 = document.createElement("DIV");
		div1.appendChild(div1_1);
		div1_1.className = "panel-heading";
		var label1 = document.createElement("LABEL");
		div1_1.appendChild(label1);
		label1.htmlFor = "licence";
		label1.innerHTML = "营业执照";

		var panelToolbar1 = document.createElement("UL");
		div1_1.appendChild(panelToolbar1);
		panelToolbar1.className = "nav navbar-nav navbar-right";
		panelToolbar1.style.paddingRight = "10px";

		this.refreshButton1 = this.createToolbarItem(panelToolbar1, "remove1",
				"删除", "glyphicon glyphicon-remove", "btn btn-danger btn-xs");
		this.refreshButton1.addEventListener('click', this, false);

		var div1_2 = document.createElement("DIV");
		div1.appendChild(div1_2);
		div1_2.className = "panel-body";
		div1_2.id = "license" + options.id;
		div1_2.style.height = (options.height - 94) + "px";

		var o1 = new Object();
		o1.ownerId = this.options.ownerId;
		o1.fid = this.options.id;
		o1.type = "licence";
		var p = $(div1_2).omUploadPlugin({
			id : "0167", // plugin id
			url : omservices.uploadapi(0, this.options.ownerId), // uploading
			// // arget
			// url
			extpara : o1, // extra parameters for uploading
			actnow : "1", // if 1, dochange method will work
			filer : "", // image.* or image/gif, image/jpeg
			multiple : "0", // if 1, input will can select multiple files
			parent : this, // parent plugin
			ownerId : this.options.ownerId,
		});

		this.p = p.data("omUploadPlugin");
		this.p.fileInput.type = "file";
		this.p.fileInput.id = "file";
		this.p.fileInput.name = "file";
		this.p.fileInput.className = "hide";

		this.box = document.createElement("DIV");
		div1_2.appendChild(this.box);
		this.box.style.width = "100%";
		this.box.style.height = "90%";
		this.box.style.border = "1px #5599FF dashed";
		this.box.style.display = "block";
		// this.box.style.display = "table-cell";
		this.box.style.verticalAlign = "middle";
		this.box.innerHTML = "&nbsp; &nbsp; &nbsp; 单击或将图片拖拽到此处";
		this.box.id = "box" + options.id;
		this.box.addEventListener("click", this, false);
		this.box.addEventListener('dragover', this, false);
		this.box.addEventListener('drop', this, false);

		this.img = document.createElement("IMG");
		div1_2.appendChild(this.img);
		this.img.style.width = "100%";
		this.img.style.height = "90%";
		this.img.className = "hide";

		if (Utils.isIE() == 1) {
			this.img.style.styleFloat = "left";
		} else {
			this.img.style.cssFloat = "left";
		}

		this.img.addEventListener("click", this, false);
		this.img.addEventListener('dragover', this, false);
		this.img.addEventListener('drop', this, false);
		this.img.addEventListener("dblclick", this, false);

		var div2 = document.createElement("DIV");
		mainframe.appendChild(div2);

		if (Utils.isIE() == 1) {
			div2.style.styleFloat = "left";
		} else {
			div2.style.cssFloat = "left";
		}

		div2.style.width = "33%";
		div2.className = "panel panel-info";
		div2.id = "div2";

		var div2_1 = document.createElement("DIV");
		div2.appendChild(div2_1);
		div2_1.className = "panel-heading";
		var label2 = document.createElement("LABEL");
		div2_1.appendChild(label2);
		label2.htmlFor = "idcard";
		label2.innerHTML = "法人有效证件";

		var panelToolbar2 = document.createElement("UL");
		div2_1.appendChild(panelToolbar2);
		panelToolbar2.className = "nav navbar-nav navbar-right";
		panelToolbar2.style.paddingRight = "10px";

		this.refreshButton2 = this.createToolbarItem(panelToolbar2, "remove2",
				"删除", "glyphicon glyphicon-remove", "btn btn-danger btn-xs");
		this.refreshButton2.addEventListener('click', this, false);

		var div2_2 = document.createElement("DIV");
		div2.appendChild(div2_2);
		div2_2.className = "panel-body";
		div2_2.id = "idcard" + options.id;
		div2_2.style.height = (options.height - 94) + "px";

		var o2 = new Object();
		o2.ownerId = this.options.ownerId;
		o2.fid = this.options.id;
		o2.type = "idcard";

		var p1 = $(div2_2).omUploadPlugin({
			id : "0168", // plugin id
			url : omservices.uploadapi(0, this.options.ownerId), // uploading
																	// // arget
																	// url
			extpara : o2, // extra parameters for uploading
			actnow : "1", // if 1, dochange method will work
			filer : "", // image.* or image/gif, image/jpeg
			multiple : "0", // if 1, input will can select multiple files
			parent : this, // parent plugin

		});
		this.p2 = p1.data("omUploadPlugin");
		this.p2.fileInput.type = "file";
		this.p2.fileInput.id = "file2";
		this.p2.fileInput.name = "file2";
		this.p2.fileInput.className = "hide";

		this.box2 = document.createElement("DIV");
		div2_2.appendChild(this.box2);
		this.box2.style.width = "100%";
		this.box2.style.height = "90%";
		this.box2.style.border = "1px #5599FF dashed";
		this.box2.style.display = "block";
		// this.box2.style.display = "table-cell";
		this.box2.style.verticalAlign = "middle";
		this.box2.innerHTML = "&nbsp; &nbsp; &nbsp; 单击或将图片拖拽到此处";
		this.box2.id = "box2" + options.id;
		this.box2.addEventListener("click", this, false);
		this.box2.addEventListener('dragover', this, false);
		this.box2.addEventListener('drop', this, false);

		this.img2 = document.createElement("IMG");
		div2_2.appendChild(this.img2);
		this.img2.style.width = "100%";
		this.img2.style.height = "90%";
		this.img2.className = "hide";

		if (Utils.isIE() == 1) {
			this.img2.style.styleFloat = "left";
		} else {
			this.img2.style.cssFloat = "left";
		}
		this.img2.addEventListener("click", this, false);
		this.img2.addEventListener('dragover', this, false);
		this.img2.addEventListener('drop', this, false);
		this.img2.addEventListener("dblclick", this, false);

		var div3 = document.createElement("DIV");
		mainframe.appendChild(div3);

		if (Utils.isIE() == 1) {
			div3.style.styleFloat = "left";
		} else {
			div3.style.cssFloat = "left";
		}

		div3.style.width = "33%";
		div3.className = "panel panel-info";
		div3.id = "div3";

		var div3_1 = document.createElement("DIV");
		div3.appendChild(div3_1);
		div3_1.className = "panel-heading";
		var label3 = document.createElement("LABEL");
		div3_1.appendChild(label3);
		label3.htmlFor = "companyLOGO";
		label3.innerHTML = "公司LOGO";

		var panelToolbar3 = document.createElement("UL");
		div3_1.appendChild(panelToolbar3);
		panelToolbar3.className = "nav navbar-nav navbar-right";
		panelToolbar3.style.paddingRight = "10px";

		this.refreshButton3 = this.createToolbarItem(panelToolbar3, "remove3",
			"删除", "glyphicon glyphicon-remove", "btn btn-danger btn-xs");
		this.refreshButton3.addEventListener('click', this, false);

		var div3_2 = document.createElement("DIV");
		div3.appendChild(div3_2);
		div3_2.className = "panel-body";
		div3_2.id = "companyLOGO" + options.id;
		div3_2.style.height = (options.height - 94) + "px";

		var o3 = new Object();
		o3.ownerId = this.options.ownerId;
		o3.fid = this.options.id;
		o3.type = "companyLOGO";
		var p3 = $(div3_2).omUploadPlugin({
			id : "0169", // plugin id
			url : omservices.uploadapi(0, this.options.ownerId), // uploading
			// // arget
			// url
			extpara : o3, // extra parameters for uploading
			actnow : "1", // if 1, dochange method will work
			filer : "", // image.* or image/gif, image/jpeg
			multiple : "0", // if 1, input will can select multiple files
			parent : this, // parent plugin

		});
		this.p3 = p3.data("omUploadPlugin");
		this.p3.fileInput.type = "file";
		this.p3.fileInput.id = "file2";
		this.p3.fileInput.name = "file2";
		this.p3.fileInput.className = "hide";

		this.box3 = document.createElement("DIV");
		div3_2.appendChild(this.box3);
		this.box3.style.width = "100%";
		this.box3.style.height = "90%";
		this.box3.style.border = "1px #5599FF dashed";
		this.box3.style.display = "block";
		// this.box3.style.display = "table-cell";
		this.box3.style.verticalAlign = "middle";
		this.box3.innerHTML = "&nbsp; &nbsp; &nbsp; 单击或将图片拖拽到此处";
		this.box3.id = "box3" + options.id;
		this.box3.addEventListener("click", this, false);
		this.box3.addEventListener('dragover', this, false);
		this.box3.addEventListener('drop', this, false);

		this.img3 = document.createElement("IMG");
		div3_2.appendChild(this.img3);
		this.img3.style.width = "100%";
		this.img3.style.height = "90%";
		this.img3.className = "hide";

		if (Utils.isIE() == 1) {
			this.img3.style.styleFloat = "left";
		} else {
			this.img3.style.cssFloat = "left";
		}
		this.img3.addEventListener("click", this, false);
		this.img3.addEventListener('dragover', this, false);
		this.img3.addEventListener('drop', this, false);
		this.img3.addEventListener("dblclick", this, false);

		this.loading();

	};

	Editor.prototype.createToolbarItem = function(parent, id, title, icon,
			classname) {
		var toolItem = document.createElement("li");
		toolItem.style.padding = "2px";
		parent.appendChild(toolItem);
		var toolButton = document.createElement("button");
		toolItem.appendChild(toolButton);
		toolButton.type = "button";
		toolButton.id = id;
		toolButton.className = classname;
		toolButton.setAttribute("title", title);
		toolButton.addEventListener("click", this, false);
		var toolSpan = document.createElement("span");
		toolSpan.className = icon;
		toolSpan.id = id;
		toolButton.appendChild(toolSpan);
		return toolButton;
	};

	Editor.prototype.loading = function() {
		var type = "";
		this.img.src = "";
		this.img2.src = "";
		var oid = this.options.ownerId;
		var fid = this.options.id;
		var that = this;
		$.post(omservices.uploadapi("3", this.options.ownerId), {
			ownerId : oid,
			fid : fid,
		}).complete(
				function(data) {
					data = data.responseJSON;
					if (data.status != null && data.status != ""
							&& data.status != undefined) {
						if (data.status == 0 || data.status == -10) {
							messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
							return;
						}
					}
					var url = "/file/org/";
					if (data.img1 != null && data.img1 == "1") {
						that.img.src = url + oid + "/om/licence/" + data.fname1;
						that.img.className = "show";
						that.box.className = "hide";
					}
					if (data.img2 != null && data.img2 == "1") {
						that.img2.src = url + oid + "/om/idcard/" + data.fname2;
						that.img2.className = "show";
						that.box2.className = "hide";
					}
					if (data.img3 != null && data.img3 == "1") {
						that.img3.src = url + oid + "/om/companyLOGO/" + data.fname3;
						that.img3.className = "show";
						that.box3.className = "hide";
					}

				});
	};

	Editor.prototype.getDirty = function() {
		return this.stack.isDirty();
	};

	Editor.prototype.complete = function(f, loaded, total, data, child) {
		var blob = new Blob([ child.uploadAction.fb ]);
		var url = URL.createObjectURL(blob);
		if (child.extpara.type == "licence") {
			this.img.src = url;
			this.box.className = "hide";
			this.img.className = "show";
		} else if (child.extpara.type == "idcard") {
			this.img2.src = url;
			this.box2.className = "hide";
			this.img2.className = "show";
		}else {
			this.img3.src = url;
			this.box3.className = "hide";
			this.img3.className = "show";
		}

	};

	Editor.prototype.removePicture = function(type) {// delete Image
		var oid = this.options.ownerId;
		var fid = this.options.id;

		$.post(omservices.uploadapi("1", this.options.ownerId), {
			ownerId : oid,
			fid : fid,
			type : type,
		}).complete(
				function(data) {
					data = data.responseJSON;
					if (data.status != null && data.status != ""
							&& data.status != undefined) {
						if (data.status == 0 || data.status == -10) {
							messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
							window.location.reload();
						}
					}
				});
	}

	Editor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		case "dragover":
			this.handleDragOver(e);
			break;
		case "drop":
			this.handleFileSelect(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;

		}
	};

	Editor.prototype.showBigPic = function(evt) {
		var src = "";
		if (evt.target == this.img) {
			src = this.img.src;

		} else if (evt.target == this.img2) {
			src = this.img2.src;

		}else if (evt.target == this.img3) {
			src = this.img3.src;

		}

		this.bigimg.style.width = "50%";// 以最终的宽度对图片缩放
		this.bigimg.src = src;

		$("#outDiv").fadeIn("fast");
		$("#div1").fadeOut("fast");
		$("#div2").fadeOut("fast");
		$("#div3").fadeOut("fast");
		this.propsheet.element.style.visibllity = false;
		this.propsheet.element.style.display = "none";
	};

	/**
	 * 刷新页面
	 */
	Editor.prototype.reload = function() {
		window.location.reload(true);
	};

	Editor.prototype.doClick = function(evt) {
		var type = "";
		if (evt.target == this.box) {
			this.p.fileInput.click();
		} else if (evt.target == this.box2) {
			this.p2.fileInput.click();
		} else if (evt.target == this.box3) {
			this.p3.fileInput.click();
		} else if (evt.target == this.img || evt.target == this.img2 || evt.target == this.img3) {
			this.showBigPic(evt);
		} else if (evt.target == this.bigimg) {
			$("#outDiv").fadeOut("fast");
			$("#div1").fadeIn("fast");
			$("#div2").fadeIn("fast");
			$("#div3").fadeIn("fast");
			this.propsheet.element.style.visibllity = true;
			this.propsheet.element.style.display = "block";
		} else if (evt.target.id == "remove1") {
			type = "licence";
			this.removePicture(type);
			this.img.className = "hide";
			this.box.className = "show";
			this.p.fileInput.value = "";
		} else if (evt.target.id == "remove2") {
			type = "idcard";
			this.removePicture(type);
			this.img2.className = "hide";
			this.box2.className = "show";
			this.p2.fileInput.value = "";
		}else if (evt.target.id == "remove3") {
			type = "companyLOGO";
			this.removePicture(type);
			this.img3.className = "hide";
			this.box3.className = "show";
			this.p3.fileInput.value = "";
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
