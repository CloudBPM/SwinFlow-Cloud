/**
 * This class is used to upload a file to cloud platform.
 * 
 * @author Dahai Cao created at 15:43 on 2018-07-10
 */
function UploadAction(parent, url, opt) {
	this.uploadLimit = 1024 * 1024 * 100;// default is 100M
	this.parent = parent;
	this.url = url;
	this.opt = opt;
	this.completed = 0;// 0:incompleted;1:completed
};

UploadAction.prototype.doCancel = function(evt) {
	this.reader.abort();
};

// create a file reader for reading
UploadAction.prototype.doReadandUpload = function(f, loaded, total) {
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		var that = this;
		if (f.size > this.uploadLimit) {
			// if (this.parent != null && this.parent.setStatus != undefined) {
			// 	this.parent.setStatus(0, "每个上传文件大小不能超100M");
			// 	return;
			// }
		}
		this.reader = new FileReader();
		// Read in the image file as a binary string.
		this.reader.onloadstart = function(e) {
		};
		this.reader.onload = function(e) {
			// it is replaced by onloadend;
		};
		this.reader.onloadend = function(e) {
			if (e.target.readyState == FileReader.DONE) { // DONE == 2
				that.completed = 1;
				that.upload(f, e.target.result, function(data) {////>>>>>
					if (that.parent != null
							&& that.parent.complete != undefined) {
						that.parent.complete(f, e.loaded, total, data);
					}
				});
			}
		};
		this.reader.onerror = function(e) {
			if (that.parent != null && that.parent.errorHandler != undefined) {
				that.parent.errorHandler(e, that);
			}
		};
		this.reader.onprogress = function(e) {
			// e is an ProgressEvent.
			if (e.lengthComputable) {
				// evt.loaded / evt.total
				var percentLoaded = Math
						.round(((e.loaded + loaded) * 1.0 / total) * 100);
				// Increase the progress bar length.
				if (percentLoaded < 100) {
					if (that.parent != null
							&& that.parent.updateProgress != undefined) {
						that.parent.updateProgress(e, percentLoaded)
					}
				}
			}
		};
		this.reader.onabort = function(e) {
			that.setStatus(0, "文件上传取消");
		};
		this.reader.readAsArrayBuffer(f);
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
};

UploadAction.prototype.upload = function(f, fb, onSuccess) {
	var blob = new Blob([ fb ]);
	var fd = new FormData();
	this.fb = fb;
	fd.append('file', blob);
	fd.append('filename', encodeURI(f.name));
	fd.append('flen', f.size);
	// extra parameters, it is object format
	if (this.opt != undefined && this.opt != null && this.opt != "") {
		for (x in this.opt) {
			fd.append(x, this.opt[x]);
		}
	}
	var xhr = new XMLHttpRequest();
	xhr.open('post', this.url, true);
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
