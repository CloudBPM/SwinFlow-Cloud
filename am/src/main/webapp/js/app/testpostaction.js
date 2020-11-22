/**
 * This class is used to submit some data and one or more files to server. It is
 * used to test the post request with attachments in AM.
 * 
 * @author Dahai Cao created at 15:43 on 2018-07-10 last updated at 12:53 on
 *         2018-07-15
 */
function TestPOSTAction(console, url, mso, uploads) {
	this.console = console; // output message.
	this.url = url;// the url for request
	this.mso = mso;// micro service object
	this.uploadLimit = 1024 * 1024 * 100;// default is 100M
	this.readers = []; // the uploading files
	this.uploads = uploads;
};

TestPOSTAction.prototype.doPost = function() {
	if (this.uploads != null && this.uploads.length > 0) {
		// Check for the various File API support.
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			var that = this;
			var count = 0;
			for (var i = 0; i < this.uploads.length; i++) {
				if (this.uploads[i].size > this.uploadLimit) {
					console.log("每个上传文件大小不能超100M");
					continue;
				}
				var reader = new FileReader();
				reader.name = this.uploads[i].name;
				// Read in the image file as a binary string.
				reader.onloadstart = function(e) {
				};
				reader.onload = function(e) {
					// it is replaced by onloadend;
				};
				reader.onloadend = function(e) {
					if (e.target.readyState == FileReader.DONE) { // DONE == 2
						count = count + 1;
						return that.postFormDataAndFiles(count,
								that.uploads.length);
					}
				};
				reader.onerror = function(e) {
				};
				reader.onprogress = function(e) {
				};
				reader.onabort = function(e) {
				};
				reader.readAsArrayBuffer(this.uploads[i]);
				this.readers[i] = reader;
			}
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}
	} else {
		this.postFormData();
	}
};

TestPOSTAction.prototype.postFormDataAndFiles = function(count, allreaded) {
	if (count == allreaded) { // 所有的文件读完了一起提交上传。
		$("#progressbar").show();
		var fd = new FormData();
		fd.append('fdata', JSON.stringify(this.mso));
		for (var i = 0; i < this.readers.length; i++) {
			fd.append(encodeURI(this.readers[i].name), new Blob(
					[ this.readers[i].result ]));
		}
		var xhr = new XMLHttpRequest();
		xhr.open('post', this.url, true);
		xhr.overrideMimeType('text/plain; charset=x-user-defined');
		this.processResponse(xhr);
		xhr.send(fd);
		this.readers = [];
	}
};

TestPOSTAction.prototype.postFormData = function() {
	$("#progressbar").show();
	var fd = new FormData();
	fd.append('fdata', JSON.stringify(this.mso));
	var xhr = new XMLHttpRequest();
	xhr.open('post', this.url, true);
	// xhr.overrideMimeType('text/plain; charset=x-user-defined');
	this.processResponse(xhr);
	xhr.send(fd);
	this.readers = [];
};

TestPOSTAction.prototype.processResponse = function(xhh) {
	var that = this;
	xhh.onreadystatechange = function(e) {
		if (xhh.readyState == 0) {
			// 请求未初始化（还没有调用 open()）。
		} else if (xhh.readyState == 1) {
			// 请求已经建立，但是还没有发送（已经调用open()，但还没有调用 send()）。
		} else if (xhh.readyState == 2) {
			// 请求已发送（已经调用 send()），正在处理中（通常现在可以从响应中获取内容头）。
			var contenttype = xhh.getResponseHeader("Content-Type");
			if (contenttype != null && contenttype.indexOf("text") >= 0) {// application/json
				xhh.responseType = 'text';// '' or 'text'
			} else {
				xhh.responseType = 'blob';// "blob"`也可以设置为"arrayBuffer"
			}
		} else if (xhh.readyState == 3) {
			// 请求在处理中；通常响应中已有部分数据可用了，但是服务器还没有完成响应的生成。
		} else if (xhh.readyState == 4) {
			if (xhh.status == 200) {
				var contenttype = xhh.getResponseHeader("Content-Type");
				if (contenttype != null) {
					if (contenttype.indexOf("text") >= 0) {
						that.console.outputMsg(this.responseText);
					} else {
						var filename = xhh
								.getResponseHeader("Content-Disposition");
						if (filename != null) {
							filename = filename.substring(21, filename.length);
							filename = decodeURI(filename, "utf-8");
						}
						that.saveFile(this.response, filename, contenttype);
					}
				} else {
					that.console.outputMsg("Response error.");
				}
			}
		}
		$("#progressbar").hide();
	}
};

TestPOSTAction.prototype.saveFile = function(blob, fileName, contenttype) {
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