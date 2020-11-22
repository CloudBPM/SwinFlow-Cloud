/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "createNewsDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "",
		ownerId : "",
		userId : "",
		userfullname : "",
		ownerName : "",
	};

	var CreateNewsDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			ownerId : "",
			userId : "",
			userfullname : "",
			ownerName : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.host = "http://localhost:8088";
		this.imgUrl = this.host + "/api/img/icons/";
		this.init(options);
		this.createNews = false;
	};

	CreateNewsDialog.prototype.init = function(options) {
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		// dialog
		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "1000px"
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		modaldialogDIV.appendChild(dialogContentDIV);

		// dialog headding
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
		titleH4.id = "modal" + options.id;
		dialogHeaderDIV.appendChild(titleH4);

		var infoIcon = document.createElement("i");
		infoIcon.className = "fa fa-plus-circle fa-lg";
		infoIcon.style.color = "green";
		titleH4.appendChild(infoIcon);

		var info = document.createElement("label");
		info.innerHTML = options.title;
		titleH4.appendChild(info);

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);

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

		// add form panel here...
		this.loadPanel(bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		var saveButton = document.createElement("button");
		saveButton.type = "button";
		saveButton.id = "OKButton" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.addEventListener("click", this, false);
		// saveButton.setAttribute("data-dismiss", "modal");
		saveButton.innerHTML = "确定";
		dialogFooterDIV.appendChild(saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "button";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		// cancelButton.setAttribute("data-dismiss", "modal");
		cancelButton.addEventListener("click", this, false);
		dialogFooterDIV.appendChild(cancelButton);

		var dialog = $(bodyRow).alertBox({
			id : "myalert" + options.id,
		});
		this.messageBox = dialog.data("alertBox");

	};

	CreateNewsDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		form.className = "form-horizontal";
		parent.appendChild(form);

		// 新闻动态分类
		var div1 = document.createElement("div");
		div1.className = "form-group";
		form.appendChild(div1);

		var div11 = document.createElement("div");
		div1.appendChild(div11);
		div11.className = "col-sm-12";

		this.catSelect = document.createElement("SELECT");
		div11.appendChild(this.catSelect);
		this.catSelect.className = "form-control";
		this.catSelect.id = "newsCatSelect";
		// this.catSelect.addEventListener("change", this, false);
		// 0: 公开新闻；1：内部新闻；2：通知公告；3：文献资料
		this.addOptions(this.catSelect, " - 请选择分类 - ", 99, 0);
		this.addOptions(this.catSelect, newscategory[0], 0, 1);
		this.addOptions(this.catSelect, newscategory[1], 1, 2);
		this.addOptions(this.catSelect, newscategory[2], 2, 3);
		this.addOptions(this.catSelect, newscategory[3], 3, 4);
		this.catSelect.addEventListener("change",this,false);

		// 新闻动态访问级别
		var div5 = document.createElement("div");
		div5.className = "form-group";
		form.appendChild(div5);

		var div51 = document.createElement("div");
		div5.appendChild(div51);
		div51.className = "col-sm-12";

		this.levelSelect = document.createElement("SELECT");
		div51.appendChild(this.levelSelect);
		this.levelSelect.className = "form-control";
		this.levelSelect.id = "newsLevelSelect";
		// this.levelSelect.addEventListener("change", this, false);
		this.addOptions(this.levelSelect, " - 请选择传播范围 - ", 99, 0);
		this.addOptions(this.levelSelect, propogaterange[0], 0, 1);
		this.addOptions(this.levelSelect, propogaterange[1], 1, 2);
		this.addOptions(this.levelSelect, propogaterange[2], 2, 3);

		// 原作者
		var div6 = document.createElement("div");
		div6.className = "form-group";
		form.appendChild(div6);

		var div61 = document.createElement("div");
		div6.appendChild(div61);
		div61.className = "col-sm-6";

		this.input0 = document.createElement("input");
		div61.appendChild(this.input0);
		this.input0.id = "author" + this.options.id;
		this.input0.className = "form-control";
		this.input0.setAttribute("required", "true");
		this.input0.value = this.options.userfullname;
		// this.input0.addEventListener("change", this, false);
		this.input0.setAttribute("placeholder", "请输入作者，最多256个中文字");

		var div62 = document.createElement("div");
		div6.appendChild(div62);
		div62.className = "col-sm-6";

		this.fromDateInput = document.createElement("INPUT");
		div62.appendChild(this.fromDateInput);
		this.fromDateInput.className = "form-control";
		this.fromDateInput.value = Utils.getCurrentDateTime();
		this.fromDateInput.readOnly = true;

		$(this.fromDateInput).datetimepicker({
			dateFormat : "yy-mm-dd",
			timeFormat : "HH:mm:ss",
		});

		// 新闻标题
		var div2 = document.createElement("div");
		div2.className = "form-group";
		form.appendChild(div2);

		var div21 = document.createElement("div");
		div2.appendChild(div21);
		div21.className = "col-sm-6";

		this.input1 = document.createElement("input");
		div21.appendChild(this.input1);
		this.input1.id = "newsTitle" + this.options.id;
		this.input1.className = "form-control";
		this.input1.setAttribute("required", "true");
		this.input1.setAttribute("autofocus", "true");
		this.input1.setAttribute("maxlength", "256");
		// this.input1.addEventListener("change", this, false);
		this.input1.setAttribute("placeholder", "请输入标题，最多256个中文字");

		//是否允许评论
		var div22 = document.createElement("div");
		div2.appendChild(div22);
		div22.className = "col-sm-6";
		div22.style.padding = "6px 12px";

		// this.input21 = document.createElement("input");
		// div22.appendChild(this.input21);
		// this.input21.type = "checkbox";
		// this.input21.value = "0";
		// this.input21.id = "allowComments";
		// this.input21.style.marginRight = "2px";
		// this.input21.addEventListener('change', this, false);
		// var input21Text = document.createElement("text");
		// input21Text.innerHTML = "允许评论";
		// div22.appendChild(input21Text);

		this.input22 = document.createElement("input");
		div22.appendChild(this.input22);
		this.input22.type = "checkbox";
		this.input22.value = "1";
		this.input22.id = "notAllowComments";
		this.input22.style.margin = "0 2px 0 20px";
		var input22Text = document.createElement("text");
		input22Text.innerHTML = "不允许评论";
		div22.appendChild(input22Text);

		// 新闻动态内容
		var div3 = document.createElement("div");
		div3.className = "form-group";
		form.appendChild(div3);

		var div31 = document.createElement("div");
		div3.appendChild(div31);
		div31.className = "col-sm-12";

		this.input2 = document.createElement("textarea");
		div31.appendChild(this.input2);
		this.input2.className = "form-control";
		this.input2.setAttribute("required", "true");
		this.input2.setAttribute("maxlength", "2048");
		this.input2.setAttribute("placeholder", "请输入新闻内容，最多2000个中文字");
		this.input2.id = "newsContent" + this.options.id
				+ Utils.getRandomNumber();

		// 新闻附件(图片、新闻图片、附件)
		var div4 = document.createElement("div");
		div4.className = "form-group";
		form.appendChild(div4);

		var div42 = document.createElement("div");
		div4.appendChild(div42);
		div42.className = "col-sm-12";

		this.divAttachments = document.createElement("div");
		div42.appendChild(this.divAttachments);
		this.divAttachments.id = "notoolbardiv" + this.options.id;
		this.divAttachments.style.border = "1px solid #eee";
		this.divAttachments.style.height = "130px";
		this.i = 0;
	};

	CreateNewsDialog.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	CreateNewsDialog.prototype.loadData = function(entity, create) {
		if (this.enditorInstance == undefined) {
			this.enditorInstance = CKEDITOR.replace(this.input2.id, {
				language : 'zh-cn',
				height : 250,
			})
		}
		var that = this;
		this.createNews = create;
		this.enditorInstance.on('change', function() {
			entity.content = this.getData();
		});
		this.currObject = entity;
		this.currObject.owner = this.options.ownerId;
		if (entity.id == null || entity.id == "") {
			this.currObject.publishDateTime = new Date().getTime();
			this.currObject.author = this.options.userfullname;
			this.getId(this.currObject);
		} else {
			this.loading(this.currObject);
		}
	};

	CreateNewsDialog.prototype.loading = function(obj) {
		// 设置数据到组件
		this.input1.value = obj.title;
		this.enditorInstance.setData(obj.content);
		this.catSelect.value = obj.newsCategory;
		this.levelSelect.value = obj.accessLevel;
		this.input0.value = obj.author;
		this.fromDateInput.value = Utils.getDateTime(obj.publishDateTime);

		$(this.divTitleImage).children().remove();
		$(this.divAttachments).children().remove();
		if (this.currObject.titleImage != null
				&& this.currObject.titleImage != "") {

		}
		this.setAttachments(this.currObject);
	};

	CreateNewsDialog.prototype.getId = function(obj) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(service.api(26), {}).complete(function(data) {
			obj.id = data.responseText;
			that.loading(obj);
			$("#progressbar").hide();
		});
	};

	CreateNewsDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	CreateNewsDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	CreateNewsDialog.prototype.handleEvent = function(e) {
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
		}
		Utils.stopBubble(e);
	};

	CreateNewsDialog.prototype.doClick = function(evt) {
		var that = this;
		if (evt.target.id == "OKButton" + this.options.id) {
			evt.preventDefault();
			if (this.catSelect.value == "99") {
				this.messageBox.show(4, "请选择分类", false);
				return false;
			}
			if (this.levelSelect.value == "99") {
				this.messageBox.show(4, "请选择传播范围", false);
				return false;
			}
			if (this.input0.value.trim() == "") {
				this.messageBox.show(4, "作者不能为空", false);
				return false;
			}
			if (this.input1.value.trim() == "") {
				this.messageBox.show(4, "标题不能为空", false);
				return false;
			}
			if (this.enditorInstance.getData() == "") {
				this.messageBox.show(4, "内容不能为空", false);
				return false;
			}
			if (this.currObject.attachments.length == 0) {
				this.messageBox.show(4, "您必须要至少上传一张标题附图。", false);
				return false;
			}
			this.currObject.accessLevel = this.levelSelect.value;// 传播范围
			this.currObject.newsCategory = this.catSelect.value;// 分类
			this.currObject.newsClass = 0;// 分类
			this.currObject.title = this.input1.value.trim();// 标题
			if(this.input22.checked == true){
				this.currObject.commentAllowable = this.input22.value; //不允许评论
			}else {
				this.currObject.commentAllowable = 0;
			}
			// this.currObject.commentAllowable
			this.currObject.brief = "";// 简介
			this.currObject.titleImage = ""; // 标题图片...
			this.currObject.author = this.input0.value.trim();// 原作者
			this.currObject.publishDateTime = new Date(this.fromDateInput.value)
					.getTime();// 发布时间
			this.currObject.content = this.enditorInstance.getData();// 内容
			this.currObject.writerId = this.options.userId; // 录入人ID
			this.currObject.writerName = this.options.userfullname; // 录入人姓名
			this.currObject.organizationId = this.options.ownerId; // 发布单位ID
			this.currObject.organizationName = this.options.ownerName; // 发布单位名称
			this.currObject.lastUpdate = new Date().getTime();
			this.currObject.newsState = 0;// 发布状态，0：未发布。
			this.currObject.owner = this.options.ownerId; // 发布单位ID
			this.options.parent.saveObjects(this.currObject, this.createNews);
		} else if (evt.target.id == "CancelButton" + this.options.id) {
			if (this.createNews) {
				if (this.currObject.attachments.length > 0
						|| this.currObject.titleImage != null) {
					// 因为新的新闻还没有被保存，对话框就取消了，因此要把已经上传的文件附件删掉
					// delete the all attaments
					$.post(service.uploadapi("4", this.currObject.owner, "0"),
							{
								tid : this.currObject.id,
							}).complete(function(data) {
						that.hide();
					});
				} else {
					this.hide();
				}
			} else {
				this.hide();
			}
		} else {
			var input = document.getElementById(this.fileId);
			var i = this.fetchPresentI(evt);
			var imgId = "img_" + i;
			var img = document.getElementById(imgId);
			if (evt.target.localName == "img") {// 已选择文件上传，图片点击不触发input点击
				if (i != this.i) {
					var url = service
							.downloadapi(2, this.currObject.owner, "0");
					var filename = img.title;
					var fileId = "file_" + i;
					var fid = $("#" + fileId + "").attr("fid");
					var form = $("<form></form>").attr("action", url).attr(
							"method", "post");
					form.append($("<input></input>").attr("type", "hidden")
							.attr("name", "filename").attr("value", filename));
					form.append($("<input></input>").attr("type", "hidden")
							.attr("name", "fid").attr("value", fid));
					form.append($("<input></input>").attr("type", "hidden")
							.attr("name", "oid").attr("value",
									this.currObject.owner));
					form.append($("<input></input>").attr("type", "hidden")
							.attr("name", "tid").attr("value",
									this.currObject.id));
					form.appendTo('body').submit().remove();
				} else {
					input.click();
				}
			} else if (evt.target.title == "删除") {
				var fileId = "file_" + i;
				var file = $("#" + fileId + "").val();
				var fid = $("#" + fileId + "").attr("fid");
				var attach = document.getElementById("notoolbardiv"
						+ this.options.id);
				var mainId = "main_" + i;
				var mainDiv = document.getElementById(mainId);
				attach.removeChild(mainDiv);
				if (file != null && file != "") {
					var filename = this.fetchFileName(file);
					$.post(service.uploadapi("3", this.currObject.owner, "0"),
							{
								tid : this.currObject.id,
								fid : fid,
								num : i,
								filename : filename,
								lastupdate : Utils.getCurrentDateTime(),
							}).complete(function(data) {
						that.removeAttachment(that.currObject, fid);
					});
				} else if ((i < this.i) && (file == null || file == "")) {
					var filename = img.title;
					$.post(service.uploadapi("3", this.currObject.owner, "0"),
							{
								tid : this.currObject.id,
								fid : fid,
								num : i,
								filename : filename,
								lastupdate : Utils.getCurrentDateTime(),
							}).complete(function(data) {
						that.removeAttachment(that.currObject, fid);
					});
				} else {
					return;
				}
			} else if (evt.target.title == "添加" || evt.target.id == "add") {
				input.click();
			} else if (evt.target.id == "remove") {
				evt.target.parentElement.click();
			}
		}
	};

	CreateNewsDialog.prototype.removeAttachment = function(entity, fid) {
		if (entity.attachments != null && entity.attachments.length > 0) {
			for (var i = 0; i < entity.attachments.length; i++) {
				if (entity.attachments[i].id == fid) {
					entity.attachments.splice(i, 1);
					break;
				}
			}
		}
	};

	CreateNewsDialog.prototype.setAttachments = function(entity) {
		if (entity.attachments != null && entity.attachments.length > 0) {
			for (var i = 0; i < entity.attachments.length; i++) {
				var fc = entity.attachments[i];
				this.mainId = "main_" + i;
				this.fileId = "file_" + i;
				this.delButtonId = "delButton_" + i;
				this.boxId = "box_" + i;
				this.imgId = "img_" + i;
				this.spanId = "span_" + i;
				this.addUploadDiv(this.mainId, this.fileId, this.delButtonId,
						this.boxId, this.imgId, this.spanId, fc.id);
				this.i = i;
				var suffix = fc.suffix;// 获取文件后缀
				var img = document.getElementById(this.imgId);
				if (suffix == "bmp" || suffix == "jpg" || suffix == "jpeg"
						|| suffix == "gif" || suffix == "png") {
					img.src = this.host + "/file/" + this.options.ownerId
							+ "/adm/news/" + this.currObject.id + "/" + fc.id
							+ "_" + fc.name;
				} else if (suffix == "avi" || suffix == "doc"
						|| suffix == "docx" || suffix == "fla"
						|| suffix == "html" || suffix == "jsf"
						|| suffix == "midi" || suffix == "mov"
						|| suffix == "mp3" || suffix == "mpeg"
						|| suffix == "pdf" || suffix == "ppt"
						|| suffix == "pptx" || suffix == "proj"
						|| suffix == "psd" || suffix == "pst"
						|| suffix == "pub" || suffix == "rar"
						|| suffix == "xml" || suffix == "txt"
						|| suffix == "wav" || suffix == "wma"
						|| suffix == "wmv" || suffix == "xls"
						|| suffix == "xlsx" || suffix == "zip") {
					img.src = this.imgUrl + suffix + ".png";
				} else if (suffix == "" || suffix == null) {
					continue;
				} else {
					img.src = this.imgUrl + "other.png";
				}
				$("#" + this.imgId + "").attr('title', fc.name);
				if (fc.name.length > 5) {
					var ff = fc.name.substring(0, 5) + "...";
					$("#" + this.spanId + "").html("<p>" + ff + "</p>");
				} else {
					$("#" + this.spanId + "").html("<p>" + fc.name + "</p>");
				}
				delButton.className = "btn btn-danger btn-xs";
			}
		}
		this.i = this.i + 1;
		this.mainId = "main_" + this.i;
		this.fileId = "file_" + this.i;
		this.delButtonId = "delButton_" + this.i;
		this.boxId = "box_" + this.i;
		this.imgId = "img_" + this.i;
		this.spanId = "span_" + this.i;
		this.addUploadDiv(this.mainId, this.fileId, this.delButtonId,
				this.boxId, this.imgId, this.spanId, "");
	};

	CreateNewsDialog.prototype.addUploadDiv = function(mainId, fileId,
			delButtonId, boxId, imgId, spanId, fid) {
		var attach = document.getElementById("notoolbardiv" + this.options.id);
		var mainDiv = document.createElement("DIV");
		attach.appendChild(mainDiv);
		mainDiv.style.width = "64px";
		mainDiv.style.height = "64px";
		mainDiv.id = mainId;
		mainDiv.style.margin = "20px";
		if (Utils.isIE() == 1) {
			mainDiv.style.styleFloat = "left";
		} else {
			mainDiv.style.cssFloat = "left";
		}

		var input = document.createElement("INPUT");
		mainDiv.appendChild(input);
		input.type = "file";
		input.id = fileId;
		input.name = "file";
		input.setAttribute("fid", fid);// UIID
		input.addEventListener("change", this, false);
		input.className = "hide";

		var delDiv = document.createElement("DIV");
		mainDiv.appendChild(delDiv);
		var panelToolbar = document.createElement("UL");
		delDiv.appendChild(panelToolbar);
		panelToolbar.className = "nav navbar-nav navbar-right";
		panelToolbar.style.paddingRight = "1px";
		if (fid != "") {
			delButton = this.createToolbarItem(panelToolbar, "remove", "删除",
					"glyphicon glyphicon-minus", "btn btn-danger btn-xs");
			delButton.addEventListener('click', this, false);
			delButton.id = delButtonId;
		} else {
			delButton = this.createToolbarItem(panelToolbar, "add", "添加",
					"glyphicon glyphicon-plus", "btn btn-success btn-xs");
			delButton.addEventListener('click', this, false);
			delButton.id = delButtonId;
		}

		var box = document.createElement("DIV");
		mainDiv.appendChild(box);
		box.style.width = "64px";
		box.style.height = "64px";
		box.style.display = "block";
		box.style.display = "table-cell";
		box.style.verticalAlign = "middle";
		box.id = boxId + this.options.id;

		var img = document.createElement("IMG");
		box.appendChild(img);
		img.id = imgId;
		img.src = this.imgUrl + "plus.png";
		img.title = "添加新附件";
		img.style.width = "64px";
		img.style.height = "64px";
		img.addEventListener("click", this, false);
		img.addEventListener('dragover', this, false);
		img.addEventListener('drop', this, false);

		var span = document.createElement("SPAN");
		box.appendChild(span);
		span.id = spanId;

		var progress = document.createElement("DIV");
		mainDiv.appendChild(progress);
		progress.className = "col-lg-8 col-md-8 col-sm-8 col-xs-8";
		progress.style.backgroundColor = "white";
		progress.style.padding = "1px";
		progress.style.width = "40px";
		progress.id = "progress_" + this.i;
		progress.style.borderRadius = "5px";
		progress.style.display = "none";

		var progressBar = document.createElement("DIV");
		progress.appendChild(progressBar);
		progressBar.style.width = "100%";
		progressBar.style.borderRadius = "5px";
		progressBar.style.textAlign = "center";
		progressBar.id = "progressBar_" + this.i;
		progressBar.innerHTML = "0%";

		var cancelBtnDiv = document.createElement("DIV");
		mainDiv.appendChild(cancelBtnDiv);
		// cancelBtnDiv.className = "col-lg-4 col-md-4 col-sm-4 col-xs-4";
		cancelBtnDiv.style.display = "none";
		cancelBtnDiv.id = "cancelBtnDiv_" + this.i;

		var cancelBtn = document.createElement("i");
		cancelBtnDiv.appendChild(cancelBtn);
		cancelBtn.className = "fa fa-times-circle fa-lg";
		cancelBtn.setAttribute("aria-hidden", "true");
		cancelBtn.style.color = "red";
		cancelBtn.addEventListener("click", this, false);
		cancelBtn.id = "cancelBtn_" + this.i;

	};

	CreateNewsDialog.prototype.upload = function(nm, r, t, i, onSuccess) {
		var blob = new Blob([ r ]);
		var fd = new FormData();
		fd.append('file', blob);
		fd.append('filename', encodeURI(nm));
		fd.append('flen', t);
		fd.append('oid', this.currObject.owner);// org id
		fd.append('fid', this.currObject.id);// template id
		fd.append("num", i);
		fd.append("lastupdate", Utils.getCurrentDateTime());
		var xhr = new XMLHttpRequest();
		// console.log(service.uploadapi(2, this.currObject.owner, "0"));
		xhr
				.open('post', service.uploadapi(2, this.currObject.owner, "0"),
						true);
		var that = this;
		xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var data = JSON.parse(xhr.responseText);
				if (onSuccess) {
					onSuccess(data);
				}
			}
		}
		xhr.send(fd);
	};

	CreateNewsDialog.prototype.handleDragOver = function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a
	};

	CreateNewsDialog.prototype.doChange = function(evt) {
		if (this.whetherSelectFile($("#" + this.fileId + "").val(), evt)) {
			this.handleFileSelect(evt);
		}else if(evt.target.id == "newsCatSelect"){
			if(this.catSelect.value == "0"){
				$('#newsLevelSelect option[value="0"]').show();
				$('#newsLevelSelect option[value="1"]').hide();
				$('#newsLevelSelect option[value="2"]').hide();
			}else if(this.catSelect.value == "1" || this.catSelect.value == "2" || this.catSelect.value == "3"){
				$('#newsLevelSelect option[value="0"]').hide();
				$('#newsLevelSelect option[value="1"]').show();
				$('#newsLevelSelect option[value="2"]').show();
			}
		}
	};

	CreateNewsDialog.prototype.whetherSelectFile = function(value, evt) {
		var delButton = document.getElementById(this.delButtonId);

		if (value == "" || value == null) {
			delButton.className = "hide";
		} else {
			var imgs = document.getElementsByTagName("IMG");
			var i = this.fetchPresentI(evt);
			var file = value;
			var pos = file.lastIndexOf("\\");
			var fileName = file.substring(pos + 1);
			for (var j = 0; j < imgs.length; j++) {
				if (fileName == imgs[j].title) {
					alert("您上传的文件已存在相同的文件名,请选择其他文件或更改名称后重新上传");
					return false;
				}
			}
			var spanId = "span_" + i;
			var dest = file.lastIndexOf('.'); // 获取 . 出现的位置
			var suffix = file.substring(dest + 1, file.length).toLowerCase(); // 获取文件后缀
			if (suffix == "avi" || suffix == "bmp" || suffix == "doc"
					|| suffix == "docx" || suffix == "fla" || suffix == "gif"
					|| suffix == "html" || suffix == "jpeg" || suffix == "jpg"
					|| suffix == "jsf" || suffix == "midi" || suffix == "mov"
					|| suffix == "mp3" || suffix == "mpeg" || suffix == "pdf"
					|| suffix == "png" || suffix == "ppt" || suffix == "pptx"
					|| suffix == "proj" || suffix == "psd" || suffix == "pst"
					|| suffix == "pub" || suffix == "rar" || suffix == "xml"
					|| suffix == "txt" || suffix == "wav" || suffix == "wma"
					|| suffix == "wmv" || suffix == "xls" || suffix == "xlsx"
					|| suffix == "zip") {
				$("#" + this.imgId + "").attr('src',
						this.host + "/api/img/icons/" + suffix + ".png");
			} else {
				$("#" + this.imgId + "").attr('src',
						this.host + "/api/img/icons/other.png");
			}

			$("#" + this.imgId + "").attr('title', fileName);

			if (fileName.length > 5) {
				fileName = fileName.substring(0, 5) + "...";
			}
			$("#" + spanId + "").html("<p>" + fileName + "</p>");
			delButton.className = "btn btn-danger btn-xs";
			this.addPlus("");
			return true;
		}
	};

	CreateNewsDialog.prototype.addPlus = function(fid) {
		this.i = this.i + 1;
		this.mainId = "main_" + this.i;
		this.fileId = "file_" + this.i;
		this.delButtonId = "delButton_" + this.i;
		this.boxId = "box_" + this.i;
		this.imgId = "img_" + this.i;
		this.spanId = "span_" + this.i;
		this.addUploadDiv(this.mainId, this.fileId, this.delButtonId,
				this.boxId, this.imgId, this.spanId, fid);

	};

	CreateNewsDialog.prototype.setStatus = function(s, msg, progress,
			progressBar) {
		if (s == 1) { // normal
			progress.style.border = "solid 1px #2eb82e";
			progressBar.style.backgroundColor = "#33cc33";
		} else if (s == 0) { // exception
			progress.style.border = "solid 1px red";
			progressBar.style.backgroundColor = "red";
			progressBar.style.width = '100%';
		}
		progressBar.textContent = msg;
	};

	CreateNewsDialog.prototype.createToolbarItem = function(parent, id, title,
			icon, classname) {
		var toolItem = document.createElement("li");
		toolItem.style.padding = "0px";
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

	CreateNewsDialog.prototype.updateProgress = function(evt, progressBar) {
		// evt is an ProgressEvent.
		if (evt.lengthComputable) {
			var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
			// Increase the progress bar length.
			if (percentLoaded < 100) {
				progressBar.style.width = percentLoaded + '%';
				progressBar.innerHTML = percentLoaded + '%';
			}
		}
	};

	CreateNewsDialog.prototype.handleFileSelect = function(evt) {
		var that = this;
		// f = evt.dataTransfer.files[0];
		f = evt.target.files[0];
		// console.log(f);

		// 进度条
		var i = this.fetchPresentI(evt);
		var progressBarId = "progressBar_" + i;
		var progressBar = document.getElementById(progressBarId);
		var progressId = "progress_" + i;
		var cancelBtnDivId = "cancelBtnDiv_" + i;
		var cancelBtnId = "cancelBtn_" + i;
		var deleteBtnId = "delButton_" + i;

		var progress = document.getElementById(progressId);

		var cancelBtnDiv = document.getElementById(cancelBtnDivId);
		var cancelBtn = document.getElementById(cancelBtnId);
		var delBtn = document.getElementById(deleteBtnId);

		progress.style.display = "";
		cancelBtnDiv.style.display = "";
		// Reset progress indicator on new file selection.
		progressBar.style.width = '0%';
		this.setStatus(1, "0%", progress, progressBar);

		var limit = 1024 * 1024 * 100; // default is 100M
		var total = 0;

		// Check for the various File API support.
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			var startTime = new Date();
			// if (f.size > limit) {
			// this.setStatus(0, "每个上传文件大小不能超100M", progress, progressBar);
			// return;
			// }

			var j = 0;
			total = f.size;

			this.reader = new FileReader();
			// Read in the image file as a binary string.
			this.reader.onloadstart = function(e) {
			};
			this.reader.onload = function(e) {
			};
			this.reader.onloadend = function(e) {
				if (e.target.readyState == FileReader.DONE) { // DONE == 2
					var loaded = e.loaded;
					that
							.upload(
									f.name,
									e.target.result,
									total,
									i,
									function(f) {
										// console.log(f);
										$("#file_" + i + "").attr('fid', f.id);
										that.currObject.attachments.push(f);
										if (f.name.indexOf(".") > -1) {
											progressBar.style.width = '100%';
											progressBar.innerHTML = '100%';
											cancelBtnDiv.removeChild(cancelBtn);
											delBtn.className = "btn btn-danger btn-xs";
											delBtn.title = "删除";
											delBtn.children[0].id = "remove";
											delBtn.children[0].className = "glyphicon glyphicon-minus";
											setTimeout(function() {
												progress.parentElement
														.removeChild(progress);
											}, 3000);
										}
										return;
									});
				}
			};
			this.reader.onerror = function(e) {
				that.errorHandler(e, that);
			};
			this.reader.onprogress = function(e) {
				that.updateProgress(e, progressBar);
			};
			this.reader.onabort = function(e) {
				that.setStatus(0, "文件上传取消");
			};
			this.reader.readAsArrayBuffer(f);
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}
	};

	CreateNewsDialog.prototype.fetchPresentI = function(evt) {
		var id = evt.target.id;
		var dest = id.lastIndexOf("_");
		var presentI = id.substring(dest + 1, id.length);
		return presentI;
	};

	CreateNewsDialog.prototype.fetchFileName = function(file) {
		var pos = file.lastIndexOf("\\");
		var fileName = file.substring(pos + 1);
		return fileName;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new CreateNewsDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);