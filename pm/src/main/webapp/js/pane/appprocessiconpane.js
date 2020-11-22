/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "appProcessIconSettingPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
	};

	var IconSettingPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	IconSettingPanel.prototype.init = function(options) {
		this.entity = options.entity;

		var row = document.createElement("DIV");
		this.element.appendChild(row);
		row.className = "row";

		var cols = document.createElement("DIV");
		row.appendChild(cols);
		cols.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		cols.style.padding = "4px";

		var mainmodalframe = document.createElement("div");
		cols.appendChild(mainmodalframe);
		mainmodalframe.className = "panel panel-default";
		mainmodalframe.style.border = "0";

		var modalframe = document.createElement("div");
		mainmodalframe.appendChild(modalframe);
		modalframe.className = "panel-body";

		var iconlabel = document.createElement("label");
		modalframe.appendChild(iconlabel);
		iconlabel.innerHTML = "设置应用图标";

		var radioOptionDiv = document.createElement("div");
		modalframe.appendChild(radioOptionDiv);
		radioOptionDiv.className = "radio";

		var radioOptionLabel = document.createElement("label");
		radioOptionDiv.appendChild(radioOptionLabel);

		this.radioOption = document.createElement("input");
		radioOptionLabel.appendChild(this.radioOption);
		this.radioOption.type = "radio";
		this.radioOption.name = "iconSettingOption" + options.entity.id;
		this.radioOption.value = "1";
		this.radioOption.addEventListener("click", this, false);

		var radioOptionTxt = document.createElement("label");
		radioOptionLabel.appendChild(radioOptionTxt);
		radioOptionTxt.innerHTML = "搜索图标库";

		this.createSearchGroup(modalframe);

		// ------
		var radioOptionDiv1 = document.createElement("div");
		modalframe.appendChild(radioOptionDiv1);
		radioOptionDiv1.className = "radio";

		var radioOptionLabel1 = document.createElement("label");
		radioOptionDiv1.appendChild(radioOptionLabel1);

		this.radioOption1 = document.createElement("input");
		radioOptionLabel1.appendChild(this.radioOption1);
		this.radioOption1.type = "radio";
		this.radioOption1.name = "iconSettingOption" + options.entity.id;
		this.radioOption1.value = "1";
		this.radioOption1.addEventListener("click", this, false);

		var radioOptionTxt1 = document.createElement("label");
		radioOptionLabel1.appendChild(radioOptionTxt1);
		radioOptionTxt1.innerHTML = "上传图标";

		var uoloadRow = document.createElement("DIV");
		modalframe.appendChild(uoloadRow);
		uoloadRow.className = "row";
		uoloadRow.style.margin = "0px";
		uoloadRow.style.padding = "0px";

		var uploadFileDivPane = document.createElement("DIV");
		uoloadRow.appendChild(uploadFileDivPane);
		uploadFileDivPane.className = "col-lg-3 col-md-12 col-sm-12 col-xs-12";
		uploadFileDivPane.style.margin = "0px";
		uploadFileDivPane.style.padding = "0px";
		uploadFileDivPane.style.height = "84px";

		if ($(uploadFileDivPane).fmUploadFilesPlugin != undefined) {
			var pp = $(uploadFileDivPane).fmUploadFilesPlugin({
				id : "upload0167B", // plugin id
				url : service.api2(4, ""),
				extpara : this.extpara, // extra parameters for uploading
				actnow : "1", // if 1, dochange method will work
				filer : "image/gif,image/jpeg,image/png,image/jpg", // image.* or image/gif, image/jpeg
				multiple : "0", // if 1, input will can select multiple files
				parent : this, // parent plugin
				ownerId : this.entity.owner,
				width : "100px",
				height : 80,
			});
			this.upld = pp.data("fmUploadFilesPlugin");
		}

		var o1 = new Object();
		o1.ownerId = this.entity.owner;
		o1.targetpath = "/rlp/"+this.entity.id;
		this.upld.extpara = o1;

		var imgDivPane = document.createElement("DIV");
		uoloadRow.appendChild(imgDivPane);
		imgDivPane.className = "col-lg-9 col-md-9 col-sm-12 col-xs-12";
		imgDivPane.style.margin = "0px";
		imgDivPane.style.padding = "0px";
		imgDivPane.style.height = "100px";

		var img = document.createElement("IMG");
		imgDivPane.appendChild(img);
		img.style.width = "100px";
		img.style.height = "100px";
		img.alt = "该图标是应用的显示图标";
		img.src = "img/defaulticon.png";

	};

	IconSettingPanel.prototype.createSearchGroup = function(parent) {
		var group = this.crateSGroup(parent);
		this.search = document.createElement("input");
		this.search.type = "text";
		this.search.className = "form-control";
		this.search.setAttribute("placeholder", "搜索...");
		this.search.addEventListener('keydown', this, false);// 为回车键加监听事件
		group.appendChild(this.search);

		var searchSpan = document.createElement("span");
		searchSpan.className = "input-group-btn";
		group.appendChild(searchSpan);

		this.searchBtn = this.createTool(searchSpan, "searchS"
			+ this.options.id, "查找", "btn btn-primary", "i",
			"fa fa-search fa-lg");
	};

	IconSettingPanel.prototype.crateSGroup = function(parent) {
		var group = document.createElement("DIV");
		group.className = "input-group";
		group.style.padding = "2px";
		group.setAttribute("role", "search");
		group.setAttribute("aria-label", "");
		parent.appendChild(group);
		return group;
	};

	IconSettingPanel.prototype.createTool = function(group, id, title, style,
												  fonttag, fontclass) {
		var button = document.createElement("button");
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		group.appendChild(button);
		var icon = document.createElement(fonttag);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.id = id;
		button.appendChild(icon);
		return button;
	};


	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new IconSettingPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);