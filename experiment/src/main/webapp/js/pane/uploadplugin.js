/**
 * This plug in is used to upload a file to cloud platform.
 * @author Dahai Cao created at 15:43 on 2018-07-10
 */
;
(function($, window, document, undefined) {
	var pluginName = "uploadPlugin";
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
		this._name = pluginName;
		this.init(options);
	};

	UploadPlugin.prototype.init = function(options) {
		var mainframe = document.createElement("DIV");
		this.element.appendChild(mainframe);

		this.fileInput = document.createElement("INPUT");
		mainframe.appendChild(this.fileInput);
		this.fileInput.type = "file";
		this.fileInput.id = "drop_zone" + options.id;
		this.fileInput.className = "form-control";
		if (options.multiple == "1") {
			this.fileInput.multiple = true;
		}
		if (options.filter != "") {
			this.fileInput.accept = options.filter;
		}
		if (options.actnow == "1") {
			this.fileInput.addEventListener('change', this, false);
		}
		// this.fileOutput = document.createElement("DIV");
		// mainframe.appendChild(this.fileOutput);
		// this.fileOutput.id = "filedetails";

		this.progress = document.createElement("DIV");
		mainframe.appendChild(this.progress);
		this.progress.className = "col-lg-8 col-md-8 col-sm-8 col-xs-8";
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

		this.cancelBtnDiv = document.createElement("DIV");
		mainframe.appendChild(this.cancelBtnDiv);
		this.cancelBtnDiv.className = "col-lg-4 col-md-4 col-sm-4 col-xs-4";
		this.cancelBtnDiv.style.display = "none";

		this.cancelBtn = document.createElement("i");
		this.cancelBtnDiv.appendChild(this.cancelBtn);
		this.cancelBtn.className = "fa fa-times-circle fa-lg";
		this.cancelBtn.setAttribute("aria-hidden", "true");
		this.cancelBtn.style.color = "red";
		this.cancelBtn.addEventListener("click", this, false);

		this.uploadAction = new UploadAction(this, options.url, options.extpara);

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
		if (evt.target == this.cancelBtn) {
			this.uploadAction.doCancel();
			return;
		}
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
		// this.fileOutput.innerHTML = '(' + (f.type || 'n/a') + ') - '
		// + Utils.formatBytes(f.size, 2) + ','
		// + f.lastModifiedDate.toLocaleDateString();
		if (this.options.parent != null
				&& this.options.parent.complete != undefined) {
			this.options.parent.complete(f, loaded, total, data);
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
		this.cancelBtnDiv.style.display = "";
		// Reset progress indicator on new file selection.
		this.progressBar.style.width = '0%';
		this.setStatus(1, "0%");
	};

	UploadPlugin.prototype.endProgress = function() {
		this.progressBar.style.width = '100%';
		this.progressBar.innerHTML = '100%';
		this.progress.style.display = "none";
		this.cancelBtnDiv.style.display = "none";
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