/**
 * This plug in is used to upload a file to cloud platform.
 * @author Dahai Cao created at 15:43 on 2018-07-10
 */
;
(function($, window, document, undefined) {
	var pluginName = "uploadEditorPlugin";
	var defaults = {
		id : "", // plugin id
		url : "", // uploading arget url
		extpara : "", // extra parameters for uploading
		filer : "", // image.* or image/gif, image/jpeg
		parent : "", // parent plugin
	};

	var UploadPlugin = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "", // plugin id
			url : "", // uploading arget url
			extpara : "", // extra parameters for uploading
			filer : "", // image.* or image/gif, image/jpeg
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
		
		this.fileInputDiv = document.createElement("DIV");
		mainframe.appendChild(this.fileInputDiv);
		this.fileInputDiv.className = "col-lg-10 col-md-10 col-sm-10 col-xs-10";

		this.fInput = document.createElement("INPUT");
		this.fileInputDiv.appendChild(this.fInput);
		this.fInput.type = "file";
		this.fInput.id = "fileupload";
		this.fInput.className = "form-control";
		this.fInput.style.height = "27px";
		this.fInput.style.padding = "0px";
		if (options.filter != "") {
			this.fInput.accept = options.filter;
		}
		this.fInput.addEventListener("click", this, false);
		this.fInput.addEventListener("change", this, false);
		this.fInput.addEventListener("blur", this, false);
		this.fInput.style.display = "";
		this.fInput.focus();

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
		case "blur":
			this.doBlur(e);
			break;
		}
	};
	
	UploadPlugin.prototype.setEntity = function(v, extrapara) {
		this.v = v;
		this.extpara = extrapara;
		if (this.v.value != null && this.v.value.id != "") {
			this.fileOutput.innerHTML = this.v.value.name + '('
					+ (this.v.value.type || 'n/a') + ') - '
					+ Utils.formatBytes(this.v.value.size, 2) + ','
					+ Utils.convertGMTDateTime(this.v.value.lastupdate);
		}
	};
	
	UploadPlugin.prototype.doBlur = function(evt) {
		if (this.options.parent.editing == 0) {
			this.endEditing();
		}
	};

	UploadPlugin.prototype.doClick = function(evt) {
		this.options.parent.editing = 1;
		if (evt.target == this.cancelBtn) {
			this.uploadAction.doCancel();
			return;
		}
	};

	UploadPlugin.prototype.doChange = function(evt) {
		if (evt.target == this.fInput) {
			this.options.parent.editing = 1;
			if (evt.target.files.length > 0) {
				this.uploading(evt.target.files); // FileList object
			}
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
			var that = this;
			this.endProgress();
			this.options.parent.editing = 0;
			this.options.parent.endEditing();
		}
	};

	UploadPlugin.prototype.startProgress = function() {
		this.totalloaded = 0;
		this.fInput.style.display = "none";
		this.progress.style.display = "";
		this.progressBar.style.width = '0%';
		this.setStatus(1, "0%");
	};

	UploadPlugin.prototype.endProgress = function() {
		this.progressBar.style.width = '100%';
		this.progressBar.innerHTML = '100%';
		this.progress.style.display = "none";
		this.fileInputDiv.style.display = "none";
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