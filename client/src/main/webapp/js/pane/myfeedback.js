/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "myFeedbackPane";
	var defaults = {
		id : "",
		ownerId : ""
	};

	var Board = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : ""
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	Board.prototype.init = function(options) {
		this.board = document.createElement("DIV");
		this.element.appendChild(this.board);
		this.show(false);


		var panel = document.createElement("DIV");
		this.board.appendChild(panel);
		panel.className = "container-fluid";

		// row0
		var panelRow0 = document.createElement("DIV");
		panel.appendChild(panelRow0);
		panelRow0.className = "row";

		var panelCol0 = document.createElement("DIV");
		panelRow0.appendChild(panelCol0);
		panelCol0.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		this.createTitle(panelCol0, "fa fa-commenting-o", "意见反馈", "#ab9208");

		var panelRow1 = document.createElement("DIV");
		panel.appendChild(panelRow1);
		panelRow1.className = "row";
		panelRow1.style.marginBottom = "15px";

		var panelCol1 = document.createElement("DIV");
		panelRow1.appendChild(panelCol1);
		panelCol1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		var text1 = document.createElement("text");
		panelCol1.appendChild(text1);
		text1.innerHTML = "您的意见是我们不断进步的动力，请留下您在使用中遇到的问题或提出宝贵的建议";

		var panelRow2 = document.createElement("DIV");
		panel.appendChild(panelRow2);
		panelRow2.className = "row";

		var panelCol2 = document.createElement("DIV");
		panelRow2.appendChild(panelCol2);
		panelCol2.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		var text2 = document.createElement("text");
		panelCol2.appendChild(text2);
		text2.innerHTML = "问题描述：";
		text2.style.textAlign = "left";

		this.div21 = document.createElement("div");
		panelCol2.appendChild(this.div21);
		this.div21.style.border = "solid 1px #ccc";
		this.div21.style.height = "80px";
		this.div21.style.width = "60%";
		this.div21.style.padding = "4px 8px 4px 8px";
		this.div21.style.marginLeft = "80px";
		this.div21.style.borderRadius = "4px";

		this.inputArea = document.createElement("textarea");
		this.div21.appendChild(this.inputArea);
		this.inputArea.style.height = "100%";
		this.inputArea.style.width = "100%";
		this.inputArea.style.border = "none";
		this.inputArea.style.resize = "none";
		this.inputArea.style.outline = "none";

		var panelCol3 = document.createElement("DIV");
		panelRow2.appendChild(panelCol3);
		panelCol3.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		panelCol3.style.marginTop = "35px";

		var text3 = document.createElement("text");
		panelCol3.appendChild(text3);
		text3.innerHTML = "您的称呼：";
		text3.style.textAlign = "left";

		this.inputName = document.createElement("input");
		panelCol3.appendChild(this.inputName);
		this.inputName.style.border = "solid 1px #ccc";
		this.inputName.style.width = "60%";
		this.inputName.style.padding = "4px 8px 4px 8px";
		this.inputName.style.marginLeft = "10px";
		this.inputName.style.outline = "none";
		this.inputName.style.borderRadius = "4px";

		var panelCol4 = document.createElement("DIV");
		panelRow2.appendChild(panelCol4);
		panelCol4.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		panelCol4.style.marginTop = "35px";

		var text4 = document.createElement("text");
		panelCol4.appendChild(text4);
		text4.innerHTML = "联系方式：";
		text4.style.textAlign = "left";

		this.inputConnect = document.createElement("input");
		panelCol4.appendChild(this.inputConnect);
		this.inputConnect.style.border = "solid 1px #ccc";
		this.inputConnect.style.width = "60%";
		this.inputConnect.style.padding = "4px 8px 4px 8px";
		this.inputConnect.style.marginLeft = "10px";
		this.inputConnect.style.outline = "none";
		this.inputConnect.style.borderRadius = "4px";
		this.inputConnect.setAttribute("placeholder", "手机/QQ/邮箱等");

		this.panelCol5 = document.createElement("DIV");
		panelRow2.appendChild(this.panelCol5);
		this.panelCol5.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.panelCol5.id = "uploadFile";
		this.panelCol5.style.marginTop = "35px";

		var text5 = document.createElement("span");
		this.panelCol5.appendChild(text5);
		text5.innerHTML = "上传截图：";
		text5.style.textAlign = "left";
		text5.style.marginRight= "10px";
		this.imgPath = [];

		if ($(this.panelCol5).backUploadFilesPlugin != undefined) {
			var pp = $(this.panelCol5).backUploadFilesPlugin({
				id : "uploadBack1", // plugin id
				url : service.uploadapi(0, this.options.ownerId),
				extpara : this.extpara, // extra parameters for uploading
				actnow : "1", // if 1, dochange method will work
				filer : "image/gif,image/jpeg,image/png,image/jpg", // image.* or image/gif, image/jpeg
				multiple : "0", // if 1, input will can select multiple files
				parent : this, // parent plugin
				ownerId : this.options.ownerId,
				width : "100px",
				height : 80
			});
			this.upld = pp.data("backUploadFilesPlugin");
		}

		var panelCol6 = document.createElement("DIV");
		panelRow2.appendChild(panelCol6);
		panelCol6.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		panelCol6.style.marginTop = "50px";

		this.subButton = document.createElement("Button");
		panelCol6.appendChild(this.subButton);
		this.subButton.type = "button";
		this.subButton.className = "btn btn-danger";
		this.subButton.innerHTML = "提交";
		this.subButton.style.marginLeft = "80px";
		this.subButton.style.padding = "6px 35px";
		this.subButton.style.outline = "none";
		this.subButton.addEventListener("click", this, false);

		var alertDiv = document.createElement("div");
		this.board.appendChild(alertDiv);
		alertDiv.className = "col-lg-8 col-md-8 col-sm-9 col-xs-9";
		alertDiv.style.marginTop = "50px";

		var dialog = $(alertDiv).alertBox({
			id : "alert" + this.options.id,
		});
		this.messageBox = dialog.data("alertBox");
	};

	Board.prototype.createTitle = function(parent, icon, title, color) {
		var titleSpan = document.createElement("SPAN");
		parent.appendChild(titleSpan);

		var h3 = document.createElement("H3");
		titleSpan.appendChild(h3);
		h3.className = "page-header";
		h3.style.margin = "0";

		var span = document.createElement("SPAN");
		h3.appendChild(span);
		span.className = icon;
		span.setAttribute("aria-hidden","true");
		span.style.color = color;

		var text = document.createTextNode(" " + title);
		h3.appendChild(text);

		return titleSpan;
	};

	Board.prototype.backImgShow = function(parent,data) {
		var picDiv = document.createElement("div");
		parent.appendChild(picDiv);
		picDiv.style.position = "relative";
		picDiv.style.float = "left";
		picDiv.style.marginRight= "20px";

		var backImg = document.createElement("img");
		picDiv.appendChild(backImg);
		backImg.id = "image";
		backImg.style.borderRadius= "4px";
		backImg.style.width = "100px";
		backImg.style.height = "100px";
		backImg.src = data;

		var removeDot = document.createElement("span");
		picDiv.appendChild(removeDot);
		for(var i = 0;i<this.imgPath.length;i++){
			removeDot.id = this.imgPath[i];
		}
		removeDot.style.width = "17px";
		removeDot.style.height = "17px";
		removeDot.style.borderRadius = "50%";
		removeDot.style.background = "#999999";
		removeDot.style.position = "absolute";
		removeDot.style.left = "90px";
		removeDot.style.top = "-5px";
		removeDot.style.textAlign = "center";
		removeDot.style.lineHeight = "17px";
		removeDot.style.color = "#fff";
		removeDot.style.fontSize = "16px";
		removeDot.innerHTML = "×";
		removeDot.style.cursor = "pointer"
		removeDot.addEventListener("click",function (ev) {
			picDiv.remove();
			$("#progressbar").show();
			$.post(service.uploadapi(2), {
				path:removeDot.id
			}).complete(function (data) {
				// console.log(data);
				$("#progressbar").hide();
			});
		})
	};

	Board.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	// 上传图片返回的图片存储路径
	Board.prototype.complete = function(f, loaded, total, data) {
		this.imgPath.push(data.path);
	};

	//图片预览路径
	Board.prototype.filePath = function(data) {
		this.backImgShow(this.panelCol5,data);
	};

	Board.prototype.show = function(show) {
		if (show) {
			this.board.style.display = "";
		} else {
			this.board.style.display = "none";
		}
	};

	Board.prototype.doClick = function(evt) {
		if(evt.target == this.subButton){
			if(this.inputArea.value == ""){
				this.messageBox.show(4, "问题描述不能为空", false);
			}else if(this.inputName.value == ""){
				this.messageBox.show(4, "您的称呼不能为空", false);
			}else if(this.inputConnect.value == ""){
				this.messageBox.show(4, "联系方式不能为空", false);
			}else{
				$("#progressbar").show();
				var that = this;
				$.post(service.api(14), {
					nickname:this.inputName.value,
					contactInformation:this.inputConnect.value,
					content:this.inputArea.value,
					attachments:JSON.stringify(this.imgPath)
				}).complete(function (data) {
					that.messageBox.show(2, "反馈成功(3s后返回首页)", false);
					that.inputArea.value = "";
					that.inputName.value = "";
					that.inputConnect.value = "";
					setTimeout(function () {
						location.reload();
					},3000);
					$("#progressbar").hide();
				});
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Board(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);