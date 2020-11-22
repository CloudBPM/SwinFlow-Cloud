/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "filemanagecontent";
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
		var p1 = $(this.element).listFilePane({
			id : options.id,
			ownerId : options.ownerId,
			basicpropsheet : options.basicpropsheet,
			propsheet : options.propsheet,
			width : options.width,
			height : options.height,
			parent : this,
		});
		this.listFilePane = p1.data("listFilePane");

		// confirm message dialog plugin
		var p2 = $(this.element).confirmInfoDialog({
			id : "005",
			title : "轩琦科技 - 提示",
			parent : this,
		});
		this.confirmInfoDialog = p2.data("confirmInfoDialog");
	};

	Editor.prototype.loading = function(child) {
		this.listFilePane = child;
		child.loadData();
		this.createCells(null);
	};

	Editor.prototype.setData = function(data) {
		this.listFilePane.loadData(data);
	};

	Editor.prototype.loadFileChildrenData = function(pid) {
		this.listFilePane.lastDirItem.className = "";
		this.listFilePane.loadFileChildren(pid);
	};

	Editor.prototype.getDateTime = function(a) {
		if (a != "" && a != null) {
			var date = new Date(a);
			var months = date.getMonth();
			months = months + 1;
			months = months < 10 ? '0' + months : months;
			var days = date.getDate();
			days = days < 10 ? '0' + days : days;
			var hours = date.getHours();
			hours = hours < 10 ? '0' + hours : hours;
			var minutes = date.getMinutes();
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var seconds = date.getSeconds();
			seconds = seconds < 10 ? '0' + seconds : seconds;
			var d = date.getFullYear() + "-" + months + "-" + days + " "
					+ hours + ":" + minutes + ":" + seconds;
			return d;
		}
		return "";
	};

	Editor.prototype.createCells = function(obj) {
		if (obj != null && obj != undefined) {
			this.listFilePane.headersize = 4;
			var row = this.listFilePane.tableList.insertRow(-1);
			row.setAttribute("key", obj.id);
			row.addEventListener("click", this, false);
			row.addEventListener("dblclick", this, false);
			var fileIconCell = this.listFilePane.createCell(0, "", row);

			var iconClassName = "";
			if (obj.filetype == "File") {
				if (obj.sufix == ".doc" || obj.sufix == ".docx") {
					iconClassName = "fa fa-file-word-o";
				} else if (obj.sufix == ".xml" || obj.sufix == ".java"
						|| obj.sufix == ".html" || obj.sufix == ".php") {
					iconClassName = "fa fa-file-code-o";
				} else if (obj.sufix == ".pdf") {
					iconClassName = "fa fa-file-pdf-o";
				} else if (obj.sufix == ".ppt" || obj.sufix == ".pptx") {
					iconClassName = "fa fa-file-powerpoint-o";
				} else if (obj.sufix == ".xls" || obj.sufix == ".xlsx") {
					iconClassName = "fa fa-file-excel-o";
				} else if (obj.sufix == ".mp3" || obj.sufix == ".mp4"
						|| obj.sufix == ".avi" || obj.sufix == ".rmvb"
						|| obj.sufix == ".mov" || obj.sufix == ".wmv"
						|| obj.sufix == ".flv") {
					iconClassName = "fa fa-file-video-o";
				} else if (obj.sufix == ".bmp" || obj.sufix == ".jpg"
						|| obj.sufix == ".png" || obj.sufix == ".jpeg"
						|| obj.sufix == ".gif") {
					iconClassName = "fa fa-file-image-o";
				} else {
					iconClassName = "fa fa-file-text-o";
				}
			} else {
				iconClassName = "fa fa-files-o";
			}
			this.createIcon(fileIconCell, "fileIcon", iconClassName, "文件夹",
					Utils.parse(obj.name), "");
			this.listFilePane.createCell(1, this.getDateTime(obj.lastupdate),
					row);
			this.listFilePane.createCell(2, obj.size == "0 byte" ? "--"
					: obj.size, row);
			var removeIconCell = this.listFilePane.createCell(3, "", row);
			if (obj.operation == 1 && obj.filetype == "File") {
				this.createIcon(removeIconCell, "trashIcon", "fa fa-trash-o",
						"删除", "", obj.path, null);
				this.createIcon(removeIconCell, "downloadIcon",
						"fa fa-download", "下载", "", obj.path, obj.name);
			}
		}
	};

	Editor.prototype.createIcon = function(parent, id, classname, filetype,
			filename, path, fname) {
		var rmspan = document.createElement("I");
		parent.appendChild(rmspan);
		rmspan.className = classname;
		rmspan.name = filetype;
		rmspan.setAttribute("aria-hidden", "true");
		rmspan.setAttribute("data-toggle", "modal");
		rmspan.setAttribute("data-target", "myModal");
		rmspan.setAttribute("canclick", "true"); // canclick 用于定义span 是否可点击
		rmspan.setAttribute("path", path); // canclick 用于定义span 是否可点击
		rmspan.setAttribute("filename", fname);
		rmspan.id = id;
		rmspan.addEventListener("click", this, false);
		var p = document.createElement("SPAN");
		parent.appendChild(p);
		p.innerHTML = "&nbsp;" + filename;
		return rmspan;
	};

	Editor.prototype.handleEvent = function(e) {
		Utils.stopBubble(e);
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	Editor.prototype.doClick = function(evt) {

		if (evt.target.id == "trashIcon") {
			this.confirmInfoDialog.show("您真的确定删除该文件么？(请谨慎操作，不可恢复)");
			this.confirmInfoDialog.yesButton.setAttribute("path",evt.target.attributes.path.value);
		} else if (evt.target.id == "downloadIcon") {
			var path = evt.target.attributes.path.value;
			var filename = evt.target.attributes.filename.value;
			var url = omservices.downloadapi(1, this.options.ownerId);
			var fd = new FormData();
			fd.append('oid', this.options.ownerId);
			fd.append('path', path);
			fd.append('filename', filename);
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.open('post', url, true);
			
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					var blob = xhr.response;
					if (blob.type == "application/json") {
						messageDialog.show("您所在的组织或个人可能因封禁等原因,暂时无法进行本次操作");
						window.location.reload();
					}
					var csvUrl = URL.createObjectURL(blob);
					var link = document.createElement('a');
					link.href = csvUrl;
					link.download = filename;
					link.click();
					
				}
			}
			xhr.send(fd);
			// var form = $("<form></form>").attr("action", url).attr("method",
			// "post");
			// form.append($("<input></input>").attr("type", "hidden").attr(
			// "name", "oid").attr("value", this.options.ownerId));
			// form.append($("<input></input>").attr("type", "hidden").attr(
			// "name", "path").attr("value", path));
			// form.append($("<input></input>").attr("type", "hidden").attr(
			// "name", "filename").attr("value", filename));
			// form.appendTo('body').submit().remove();
		}
	};

	Editor.prototype.doNoAction = function(evt) {
		Utils.stopBubble(evt);
		this.confirmInfoDialog.hide();
	};

	Editor.prototype.doYesAction = function(evt) {
		var path = evt.target.attributes.path.value;
		if (path != null && path != "") {
			this.listFilePane.deleteFile(path, this.options.parent.treeViewer);
			this.confirmInfoDialog.hide();
		}
	};

	Editor.prototype.createHeaders = function(row) {
		this.listFilePane.createHead("名称", row);
		this.listFilePane.createHead("修改日期", row);
		this.listFilePane.createHead("大小", row);
		this.listFilePane.createHead("操作", row);

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
