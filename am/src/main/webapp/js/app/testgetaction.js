/**
 * This class is used to request some data and one or more files from server. It
 * is used to test the get request in AM.
 * 
 * @author Dahai Cao created at 12:53 on 2018-07-15
 */
function TestGETAction(console, url, mso) {
	this.console = console; // output message.
	this.url = url;// the url for request
	this.mso = mso;// micro service object
};

//
TestGETAction.prototype.doGet = function() {
	var that = this;
	$("#progressbar").show();
	var fd = new FormData();
	fd.append('fdata', JSON.stringify(this.mso));
	var xhh = new XMLHttpRequest();
	xhh.open("post", this.url, true);
	// xhh.overrideMimeType('text/plain; charset=x-user-defined');
	xhh.onreadystatechange = function() {
		if (xhh.readyState == 0) {
			// 请求未初始化（还没有调用 open()）。
		} else if (xhh.readyState == 1) {
			// 请求已经建立，但是还没有发送（已经调用open()，但还没有调用 send()）。
		} else if (xhh.readyState == 2) {
			// 请求已发送（已经调用 send()），正在处理中（通常现在可以从响应中获取内容头）。
			var contenttype = xhh.getResponseHeader("Content-Type");
			if (contenttype != null && contenttype.indexOf("text") >= 0) {
				xhh.responseType = 'text';// '' or 'text'
			} else {
				xhh.responseType = 'blob';// "blob"`也可以设置为"arrayBuffer"
			}
		} else if (xhh.readyState == 3) {
			// 请求在处理中；通常响应中已有部分数据可用了，但是服务器还没有完成响应的生成。
		} else if (xhh.readyState == 4) {
			// 响应已完成；您可以获取并使用服务器的响应了。
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
	};
	xhh.send(fd);
};

TestGETAction.prototype.saveFile = function(blob, fileName, contenttype) {
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
