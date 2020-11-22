/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "uploadFileEditor";
	var defaults = {
		id : "",
		ownerId : "",
		basicpropsheet : "",
		propsheet : "",
		width : 0,
		height : 0,
	};

	var UploadFileEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			basicpropsheet : "",
			propsheet : "",
			width : 0,
			height : 0,
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.title = options.title;
		this.maps = {};
		this.init(options);
	};

	UploadFileEditor.prototype.init = function(options) {
		var mainframe = document.createElement("DIV");
		this.element.appendChild(mainframe);

		var o = new Object();
		o.oid = "99999";
		o.pid = "00001";
		o.vid = "88888";
		o.fid = "kkkkkkkkkkkk";

		var inputDiv = document.createElement("DIV");
		this.element.appendChild(inputDiv);

		var p = $(inputDiv).uploadPlugin({
			id : "0167", // plugin id
			url : services.api1(0), // uploading arget url
			extpara : o, // extra parameters for uploading
			actnow : "0", // if 1, dochange method will work
			filer : "", // image.* or image/gif, image/jpeg
			multiple : "1", // if 1, input will can select multiple files
			parent : this, // parent plugin
			
		});
		this.maps["0167"] =  p.data("uploadPlugin");

		var inputDiv1 = document.createElement("DIV");
		this.element.appendChild(inputDiv1);

		var p1 = $(inputDiv1).uploadPlugin({
			id : "0168", // plugin id
			url : services.api1(0), // uploading arget url
			extpara : o, // extra parameters for uploading
			actnow : "0", // if 1, dochange method will work
			filer : "", // image.* or image/gif, image/jpeg
			multiple : "1", // if 1, input will can select multiple files
			parent : this, // parent plugin
		});
		
		this.maps["0168"] = p1.data("uploadPlugin");

		var inputDiv2 = document.createElement("DIV");
		this.element.appendChild(inputDiv2);

		var p2 = $(inputDiv2).uploadPlugin({
			id : "0169", // plugin id
			url : services.api1(0), // uploading arget url
			extpara : o, // extra parameters for uploading
			actnow : "0", // if 1, dochange method will work
			filer : "", // image.* or image/gif, image/jpeg
			multiple : "1", // if 1, input will can select multiple files
			parent : this, // parent plugin
		});
		this.maps["0169"] = p2.data("uploadPlugin");

		var buttonrow = document.createElement("DIV");
		this.element.appendChild(buttonrow);
		buttonrow.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		this.button = document.createElement("INPUT");
		buttonrow.appendChild(this.button);
		this.button.type = "button";
		this.button.className = "btn btn-primary";
		this.button.value = "Submit";
		this.button.addEventListener('click', this, false);
	};

	UploadFileEditor.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	UploadFileEditor.prototype.complete = function(f, loaded, total, data) {
		this.constant = new Object();
		this.constant.id = data.fid;
		this.constant.name = f.name;
		if (f.name.indexOf(".") > -1) {
			this.constant.sufix = f.name.substring(f.name.indexOf(".") + 1,
					f.name.length);
		}
		this.constant.filetype = (f.type || 'n/a');
		this.constant.lastupdate = f.lastModifiedDate;
		this.constant.size = f.size;
	};

	UploadFileEditor.prototype.doClick = function(evt) {
		if (evt.target == this.button) {
			for (x in this.maps) {
				this.maps[x].start();
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new UploadFileEditor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);