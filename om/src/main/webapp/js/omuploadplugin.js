/**
 * This plug in is used to upload a file to cloud platform.
 * 
 * @author Dahai Cao created at 15:43 on 2018-07-10
 */
;
(function($, window, document, undefined) {
	var pluginName = "omUploadPlugin";
	var defaults = {
		id : "", // plugin id
		url : "", // uploading arget url
		extpara : "", // extra parameters for uploading
		actnow : "", // if 1, dochange method will work
		filer : "", // image.* or image/gif, image/jpeg
		multiple : "", // if 1, input will can select multiple files
		parent : "", // parent plugin
	};

	var UploadPlugin = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "", // plugin id
			url : "", // uploading arget url
			extpara : "", // extra parameters for uploading
			actnow : "", // if 1, dochange method will work
			filer : "", // image.* or image/gif, image/jpeg
			multiple : "", // if 1, input will can select multiple files
			parent : "", // parent plugin
		}, defaults, options);
		this._defaults = defaults;
		this.extpara = options.extpara;
		this._name = pluginName;
		this.init(options);
	};

	UploadPlugin.prototype.init = function(options) {
		var mainframe = document.createElement("DIV");
		this.element.appendChild(mainframe);

		// general message dialog plugin
		var p3 = $(this.element).confirmInfoDialog({
			id : "0162",
			title : "轩琦科技 - 提示",
			parent : this,
		});
		this.messageDialog = p3.data("confirmInfoDialog");

		this.form = document.createElement("FORM");
		mainframe.appendChild(this.form);

		this.fileInputDiv = document.createElement("DIV");
		this.form.appendChild(this.fileInputDiv);
		this.fileInputDiv.className = "col-lg-10 col-md-10 col-sm-10 col-xs-10";



		this.fileInput = document.createElement("INPUT");
		this.fileInputDiv.appendChild(this.fileInput);
		this.fileInput.type = "file";
		this.fileInput.id = "drop_zone" + options.id;
		this.fileInput.className = "form-control";
		this.fileInput.style.height = "27px";
		this.fileInput.style.padding = "0px";
		if (options.multiple == "1") {
			this.fileInput.multiple = true;
		}
		if (options.filter != "") {
			this.fileInput.accept = options.filter;
		}
		if (options.actnow == "1") {
			this.fileInput.addEventListener('change', this, false);
		}

		this.fileOutput = document.createElement("DIV");
		this.fileInputDiv.appendChild(this.fileOutput);
		this.fileOutput.id = "filedetails";

		this.progress = document.createElement("DIV");
		this.fileInputDiv.appendChild(this.progress);
		this.progress.style.backgroundColor = "white";
		this.progress.style.padding = "1px";
		this.progress.style.borderRadius = "5px";
		this.progress.style.display = "none";

		this.progressBar = document.createElement("DIV");
		this.progress.appendChild(this.progressBar);
		this.progressBar.style.width = "100%";
		this.progressBar.style.borderRadius = "5px";
		this.progressBar.style.textAlign = "center";
		this.progressBar.innerHTML = "0%";

		// this.btnDiv = document.createElement("DIV");
		// this.form.appendChild(this.btnDiv);
		// this.btnDiv.className = "col-lg-2 col-md-2 col-sm-2 col-xs-2";
		//
		// this.cancelBtn = document.createElement("button");
		// this.btnDiv.appendChild(this.cancelBtn);
		// this.cancelBtn.type = "button";
		// this.cancelBtn.className = "btn btn-default";
		// this.cancelBtn.style.borderRadius = "15px";
		// this.cancelBtn.style.width = "28px";
		// this.cancelBtn.style.padding = "2px";

		// this.iconC = document.createElement("i");
		// this.cancelBtn.appendChild(this.iconC);
		// this.iconC.className = "fa fa-trash fa-lg";
		// this.iconC.setAttribute("aria-hidden", "true");
		// this.iconC.style.color = "red";
		// this.iconC.addEventListener("click", this, false);

		// var span = document.createElement("span");
		// this.btnDiv.appendChild(span);
		// span.innerHTML = "&nbsp;&nbsp;"

		// this.previewBtn = document.createElement("button");
		// this.btnDiv.appendChild(this.previewBtn);
		// this.previewBtn.type = "button";
		// this.previewBtn.className = "btn btn-default";
		// this.previewBtn.style.borderRadius = "15px";
		// this.previewBtn.style.width = "28px";
		// this.previewBtn.style.padding = "2px";

		// this.iconP = document.createElement("i");
		// this.previewBtn.appendChild(this.iconP);
		// this.iconP.className = "fa fa-download fa-lg";
		// this.iconP.setAttribute("aria-hidden", "true");
		// this.iconP.addEventListener("click", this, false);

		this.uploadAction = new UploadAction(this, options.url, options.extpara);

	};

	UploadPlugin.prototype.setEntity = function(v, extrapara) {
		this.v = v;
		//this.extpara = extrapara;
		this.uploadAction.opt = extrapara;
		if (this.v.value != null && this.v.value.id != "") {
			this.fileOutput.innerHTML = this.v.value.name + '('
					+ (this.v.value.type || 'n/a') + ') - '
					+ Utils.formatBytes(this.v.value.size, 2) + ','
					+ Utils.convertGMTDateTime(this.v.value.lastupdate);
		}
	};

	UploadPlugin.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	UploadPlugin.prototype.doClick = function(evt) {
		if (evt.target == this.iconC) {
			this.messageDialog.show("该删除不可恢复，您确定要删除吗？");
		} else if (evt.target == this.iconP) {
			var that = this;
			$("#progressbar").show();
		}
	};

	UploadPlugin.prototype.doYesAction = function(evt) {
		this.messageDialog.hide();
		var that = this;
		$("#progressbar").show();
		$.post(service.uploadapi(1, this.options.extpara.ownerId), {
			ownerId : this.options.extpara.ownerId,
			type : this.options.extpara.type,
			fid : this.options.extpara.fid,
		}).complete(function(data) {
			data = data.responseJSON;
			if (data.status != null && data.status == "1") {
				window.location.reload();
			}
		});
	};

	UploadPlugin.prototype.saveFile = function(blob, fileName, contenttype) {
		var b = Utils.getBrowserType();
		if (b == "Chrome") {
			var link = document.createElement('a');
			var file = new Blob([ blob ], {
				type : contenttype
			});
			link.href = window.URL.createObjectURL(file);
			link.download = fileName;
			link.click();
		} else if (b == "FF") {
			var file = new File([ blob ], fileName, {
				type : contenttype
			});
			var url = URL.createObjectURL(file);
			// window.location.href = url;
			parent.location.href = url;
		} else if (Utils.isIE()) {
			var file = new Blob([ blob ], {
				type : 'application/force-download'
			});
			window.navigator.msSaveBlob(file, fileName);
		}
	};

	UploadPlugin.prototype.doNoAction = function(evt) {
		this.messageDialog.hide();
	};

	UploadPlugin.prototype.doChange = function(evt) {
		if (evt.target == this.fileInput) {
			if (this.fileInput.files.length > 0) {
				this.uploading(evt.target.files); // FileList object
			}
		}
	};

	UploadPlugin.prototype.start = function() {
		if (this.fileInput.files.length > 0) {
			this.uploading(this.fileInput.files);
		}
	};
	
	UploadPlugin.prototype.hasUploadedFiles = function() {
		return this.fileInput.files.length;
	};

	UploadPlugin.prototype.uploading = function(files) {
		this.startProgress();
		var total = 0;
		for (var i = 0, f; f = files[i]; i++) {
			total = total + f.size;
		}
		for (var i = 0, f; f = files[i]; i++) {
			this.uploadAction.doReadandUpload(f, this.totalloaded, total);
		}
	};

	UploadPlugin.prototype.complete = function(f, loaded, total, data) {
		this.form.reset();
		this.fileOutput.innerHTML = '(' + (f.type || 'n/a') + ') - '
				+ Utils.formatBytes(f.size, 2) + ','
				+ f.lastModifiedDate.toLocaleDateString();
		if (this.options.parent != null
				&& this.options.parent.complete != undefined) {
			this.options.parent.complete(f, loaded, total, data, this);
		}
		this.totalloaded = this.totalloaded + loaded;
		if (this.totalloaded == total) {
			this.endProgress();
		}
	};

	UploadPlugin.prototype.startProgress = function() {
		this.totalloaded = 0;
		this.fileInput.style.display = "none";
		this.progress.style.display = "";
		// Reset progress indicator on new file selection.
		this.progressBar.style.width = '0%';
		this.setStatus(1, "0%");
	};

	UploadPlugin.prototype.endProgress = function() {
		this.progressBar.style.width = '100%';
		this.progressBar.innerHTML = '100%';
		this.progress.style.display = "none";
		this.fileInput.style.display = "";
	};

	UploadPlugin.prototype.updateProgress = function(evt, percentLoaded) {
		this.progressBar.style.width = percentLoaded + '%';
		this.progressBar.innerHTML = percentLoaded + '%';
	};

	UploadPlugin.prototype.setStatus = function(s, msg) {
		if (s == 1) { // normal
			this.progress.style.border = "solid 1px #2eb82e";
			this.progressBar.style.backgroundColor = "#33cc33";
		} else if (s == 0) { // exception
			this.progress.style.border = "solid 1px red";
			this.progressBar.style.backgroundColor = "red";
			this.progressBar.style.width = '100%';
		}
		this.progressBar.textContent = msg;
	};

	UploadPlugin.prototype.errorHandler = function(evt, parent) {
		if (evt.target.error != null) {
			switch (evt.target.error.code) {
			case evt.target.error.NOT_FOUND_ERR:
				parent.setStatus(0, "文件没找到！");
				break;
			case evt.target.error.NOT_READABLE_ERR:
				parent.setStatus(0, "文件不可读");
				break;
			case evt.target.error.ABORT_ERR:
				break; // noop
			default:
				parent.setStatus(0, "读文件错！");
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new UploadPlugin(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);