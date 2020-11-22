/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "importNormalStaffDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
		ownerId : "",
		newstaffdlg : "",
	};

	var importNormalStaffDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			ownerId : "",
			newstaffdlg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.modalframe;
		this.topparent;
		this.init(options);
	};

	importNormalStaffDialog.prototype.init = function(options) {
		this.topparent = options.topparent;
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
		modaldialogDIV.style.width = "650px"
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
		saveButton.type = "Button";
		saveButton.id = "OKButton" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.addEventListener("click", this, false);
		// saveButton.setAttribute("data-dismiss", "modal");
		saveButton.innerHTML = "确定";
		dialogFooterDIV.appendChild(saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "Button";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

	};

	importNormalStaffDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("form");
		form.className = "form-horizontal";
		parent.appendChild(form);

		// ID number
		var div2 = document.createElement("div");
		div2.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		form.appendChild(div2);

		var label2 = document.createElement("label");
		label2.setAttribute("for", "drop_zone");
		label2.innerHTML = "上传文件:";
		div2.appendChild(label2);

		this.inputDiv = document.createElement("div");
		div2.appendChild(this.inputDiv);
		
		var p3 = $(div2).staffUploadPlugin({
			id : "upload0161", // plugin id
			url : omservices.uploadapi(5, this.options.ownerId), // uploading arget url
			actnow : "0", // if 1, dochange method will work
			filer : "", // image.* or image/gif, image/jpeg
			multiple : "0", // if 1, input will can select multiple files
			parent : this, // parent plugin
			ownerId : this.options.ownerId,
		});
		this.staffUploadPlugin = p3.data("staffUploadPlugin");
		
		var o = new Object();
		o.ownerId = this.options.ownerId;
		o.fid = this.options.id;
		this.staffUploadPlugin.setEntity(null, o);
		
		// 格式文件下载
		var div3 = document.createElement("div");
		div3.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
		form.appendChild(div3);

		var label3 = document.createElement("label");
		label3.setAttribute("for", "drop_zone");
		label3.innerHTML = "格式文件下载:";
		div3.appendChild(label3);
		
		//创建一个a对象
		var a=document.createElement("A");
		//指定链接地址
//		a.href="http://www.baidu.com";
		a.href="员工信息表.xlsx"
		//指定链接内容
		a.innerHTML="员工信息表.xlsx";
		//将此对象加入dom节点中
		div3.appendChild(a);
		
		
//		var div21 = document.createElement("div");
//		div2.appendChild(div21);
//		div21.className = "col-sm-10";
//
//		this.input1 = document.createElement("input");
//		this.input1.type = "file";
//		this.input1.accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
//		div21.appendChild(this.input1);

	};
	
	importNormalStaffDialog.prototype.complete = function(data) {
		if (data.status != null && data.status != ""
			&& data.status != undefined) {
			if (this.options.parent != undefined) {
				console.log(data);
				this.options.parent.showImportResults(data);
			}
		}else{
			return;
		}
		
	};
	

	importNormalStaffDialog.prototype.addOptions = function(parent, title, value,
			index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	importNormalStaffDialog.prototype.show = function() {
//		this.input1.value = "";
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	importNormalStaffDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	importNormalStaffDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keydown":
			this.doKeydown(e);
			break;
		}
	};
	
	importNormalStaffDialog.prototype.doKeydown = function(evt) {
		var e = window.event ? window.event : (evt ? evt : arguments[0]);
		var key = e.keyCode || e.which;
		if (key == 13) {// 回车键
			if (evt.target.value != "") {
				this.staffUploadPlugin.start();
				var that = this;
				that.hide();
//				location.reload();

			}
			return false;
		}
	};
	
	importNormalStaffDialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		var that = this;
		if (evt.target.id == "OKButton" + this.options.id) {
			//this.doSearch(evt);
			var length=this.staffUploadPlugin.getLength();
			if(length>0){
				this.staffUploadPlugin.start();
				var that = this;
				that.hide();
//				location.reload();
			}

		}
	};

	importNormalStaffDialog.prototype.doSearch = function(evt) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(omservices.api(12, this.options.ownerId), {
			idnumber : this.input1.value.trim(),
			ownerid : this.options.ownerId,
		}).complete(
				function(data) {
					data = data.responseJSON;
					if (data != undefined && data.status != undefined
							&& data.status != null && data.status != "") {
						if (data.status == 0 || data.status == -10) {
							messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
							return;
						}
					}
					var staff = data;
					var newStaff = new Staff();
					if (staff != undefined) {
						newStaff.parseFromJSON(staff);
					} else {
						newStaff.user = new User();
						newStaff.user.idNumber = that.input1.value.trim();
					}
					that.options.newstaffdlg.loadData(newStaff);
					that.options.newstaffdlg.show();
					that.hide();
					$("#progressbar").hide();
				});
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new importNormalStaffDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);