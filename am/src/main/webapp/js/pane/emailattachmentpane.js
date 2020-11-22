/**
 * 
 */
(function($, window, document, undefined) {
	var pluginName = "emailAttachmentPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
	};
	var AdvancedPropPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent = options.topparent;
		this.imgUrl = imgUrl + "/icons/";
		this.entity = options.entity;
		this.currpage = null; // by default;
		this.init(options);
	};

	AdvancedPropPanel.prototype.init = function(options) {
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);
		modalframe.id = "main";

		var attachmentPane = document.createElement("DIV");
		modalframe.appendChild(attachmentPane);
		attachmentPane.id = "notoolbardiv" + options.id;
		attachmentPane.className = "form-control";
		attachmentPane.style.marginTop = "1px";
		attachmentPane.style.height = (parseInt(options.topparent.style.height) - 45)
				+ "px";
		this.i = 0;
		this.setEntity(options.entity);

	};

	AdvancedPropPanel.prototype.setEntity = function(entity) {
		this.entity = entity; // email template object
		$(this.attachmentPane).children().remove();
		if (this.entity.attachments != null
				&& this.entity.attachments.length > 0) {
			for (var i = 0; i < this.entity.attachments.length; i++) {
				var fc = this.entity.attachments[i];
				this.mainId = "main_" + i;
				this.fileId = "file_" + i;
				this.delButtonId = "delButton_" + i;
				this.boxId = "box_" + i;
				this.imgId = "img_" + i;
				this.spanId = "span_" + i;
				this.addUploadDiv(this.mainId, this.fileId, this.delButtonId,
						this.boxId, this.imgId, this.spanId, fc.id);
				this.i = i;

				var img = document.getElementById(this.imgId);
				var suffix = fc.suffix;// 获取文件后缀
				if (suffix == "avi" || suffix == "bmp" || suffix == "doc"
						|| suffix == "docx" || suffix == "fla"
						|| suffix == "gif" || suffix == "html"
						|| suffix == "jpeg" || suffix == "jpg"
						|| suffix == "jsf" || suffix == "midi"
						|| suffix == "mov" || suffix == "mp3"
						|| suffix == "mpeg" || suffix == "pdf"
						|| suffix == "png" || suffix == "ppt"
						|| suffix == "pptx" || suffix == "proj"
						|| suffix == "psd" || suffix == "pst"
						|| suffix == "pub" || suffix == "rar"
						|| suffix == "xml" || suffix == "txt"
						|| suffix == "wav" || suffix == "wma"
						|| suffix == "wmv" || suffix == "xls"
						|| suffix == "xlsx" || suffix == "zip") {
					$("#" + this.imgId).attr('src',
							this.imgUrl + suffix + ".png");
				} else if (suffix == "" || suffix == null) {
					continue;
				} else {
					$("#" + this.imgId).attr('src', this.imgUrl + "other.png");
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

	AdvancedPropPanel.prototype.addUploadDiv = function(mainId, fileId,
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
		img.src = this.imgUrl + "clip.jpg";
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

	AdvancedPropPanel.prototype.addPlus = function(fid) {
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

	AdvancedPropPanel.prototype.setStatus = function(s, msg, progress,
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

	AdvancedPropPanel.prototype.createToolbarItem = function(parent, id, title,
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

	AdvancedPropPanel.prototype.handleEvent = function(e) {
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
			//this.doDblClick(e);
			break;

		}
	};

	AdvancedPropPanel.prototype.updateProgress = function(evt, progressBar) {
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

	AdvancedPropPanel.prototype.handleFileSelect = function(evt) {
		var that = this;
		// f = evt.dataTransfer.files[0];
		f = evt.target.files[0];

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
			if (f.size > limit) {
				this.setStatus(0, "每个上传文件大小不能超100M", progress, progressBar);
				return;
			}

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
					that.upload(f.name, e.target.result, total, i, function(
							newid) {
						$("#file_" + i + "").attr('fid', newid);
						if (f.name.indexOf(".") > -1) {
							progressBar.style.width = '100%';
							progressBar.innerHTML = '100%';
							cancelBtnDiv.removeChild(cancelBtn);
							delBtn.className = "btn btn-danger btn-xs";
							delBtn.title = "删除";
							delBtn.children[0].id = "remove";
							delBtn.children[0].className = "glyphicon glyphicon-minus";
							setTimeout(function() {
								progress.parentElement.removeChild(progress);
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

	AdvancedPropPanel.prototype.upload = function(nm, r, t, i, onSuccess) {
		var blob = new Blob([ r ]);
		var fd = new FormData();
		fd.append('file', blob);
		fd.append('filename', encodeURI(nm));
		fd.append('flen', t);
		fd.append('oid', this.options.parent.entity.owner);// org id
		fd.append('fid', this.options.parent.entity.id);// template id
		fd.append("num", i);
		fd.append("lastupdate", Utils.getCurrentDateTime());
		var xhr = new XMLHttpRequest();
		xhr.open('post', service.uploadapi(2, this.options.parent.entity.owner,
				"0"), true);
		var that = this;
		xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var data = JSON.parse(xhr.responseText);
				if (onSuccess) {
					onSuccess(data.fid);
				}
			}
		}
		xhr.send(fd);
	};

	AdvancedPropPanel.prototype.handleDragOver = function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a
	};

	AdvancedPropPanel.prototype.doChange = function(evt) {
		if (this.whetherSelectFile($("#" + this.fileId + "").val(), evt)) {
			this.handleFileSelect(evt);
		}
	};

	AdvancedPropPanel.prototype.doClick = function(evt) {
		var input = document.getElementById(this.fileId);
		var i = this.fetchPresentI(evt);
		console.log(evt.target);
		var imgId = "img_" + i;
		var img = document.getElementById(imgId);
		if (evt.target.localName == "img") {// 已选择文件上传，图片点击不触发input点击
			if (i != this.i) {
				var url = service.downloadapi(2, this.options.parent.entity.owner, "0");
				var filename = img.title;
				var fileId = "file_" + i;
				var fid = $("#" + fileId + "").attr("fid");
				var form = $("<form></form>").attr("action", url).attr(
						"method", "post");
				form.append($("<input></input>").attr("type", "hidden").attr(
						"name", "filename").attr("value", filename));
				form.append($("<input></input>").attr("type", "hidden").attr(
						"name", "fid").attr("value", fid));
				form.append($("<input></input>").attr("type", "hidden").attr(
						"name", "oid").attr("value",
						this.options.parent.entity.owner));
				form.append($("<input></input>").attr("type", "hidden").attr(
						"name", "tid").attr("value",
						this.options.parent.entity.id));
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
				$.post(
						service.uploadapi("3",
								this.options.parent.entity.owner, "0"), {
							tid : this.options.parent.entity.id,
							fid : fid,
							num : i,
							filename : filename,
							lastupdate : Utils.getCurrentDateTime(),
						}).complete(function(data) {
				});
			} else if ((i < this.i) && (file == null || file == "")) {
				var filename = img.title;
				$.post(
						service.uploadapi("3",
								this.options.parent.entity.owner, "0"), {
							tid : this.options.parent.entity.id,
							fid : fid,
							num : i,
							filename : filename,
							lastupdate : Utils.getCurrentDateTime(),
						}).complete(function(data) {
				});
			} else {
				return;
			}
		} else if (evt.target.title == "添加" || evt.target.id == "add") {
			input.click();
		} else if (evt.target.id == "remove") {
			evt.target.parentElement.click();
		}
	};

	AdvancedPropPanel.prototype.whetherSelectFile = function(value, evt) {
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
				$("#" + this.imgId + "").attr(
						'src',
						"http://localhost:8080/api/img/icons/" + suffix
								+ ".png");
			} else {
				$("#" + this.imgId + "").attr('src',
						"http://localhost:8080/api/img/icons/other.png");
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

	AdvancedPropPanel.prototype.fetchPresentI = function(evt) {
		var id = evt.target.id;
		var dest = id.lastIndexOf("_");
		var presentI = id.substring(dest + 1, id.length);
		return presentI;
	};

	AdvancedPropPanel.prototype.fetchFileName = function(file) {
		var pos = file.lastIndexOf("\\");
		var fileName = file.substring(pos + 1);
		return fileName;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new AdvancedPropPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);