/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "fileObjectCellEditor";
	var defaults = {
		parent : "",
	};

	var TextCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this.editing = 0;
		this._name = pluginName;
	};

	TextCellEditor.prototype.loadEditor = function(tag, val, datatype, oid,
			pid, id) {
		this.v = val; // the element of file array variable
		this.oid = oid;
		this.pid = pid;
		this.vid = id;
		var that = this;
		this.editing = 1;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).text();
		$(tag).text("");

		var o = new Object();
		o.oid = oid;
		o.pid = pid;
		o.vid = id;
		o.fid = val.id;

		this.inputDiv = document.createElement("div");
		tag.appendChild(this.inputDiv);

		var p1 = $(this.inputDiv).uploadEditorPlugin({
			id : "aryfileupload", // plugin id
			url : service.api2(0, oid), // uploading arget url
			extpara : o, // extra parameters for uploading
			filer : "", // image.* or image/gif, image/jpeg
			parent : this, // parent plugin
		});
		this.uploadPlugin = p1.data("uploadEditorPlugin");
	};

	TextCellEditor.prototype.complete = function(f, loaded, total, data) {
		if (data != null && data.fid != undefined)
			this.v.id = data.fid;
		this.v.name = f.name;
		if (f.name.indexOf(".") > -1) {
			this.v.sufix = f.name.substring(f.name.indexOf(".") + 1,
					f.name.length);
		}
		this.v.filetype = (f.type || 'n/a');
		this.v.lastupdate = f.lastModifiedDate;
		this.v.host = "";
		this.v.owner = this.oid;
		this.v.currOwner = this.pid;
		this.v.size = f.size;
		//this.v.vid = this.vid;
	};

	TextCellEditor.prototype.endEditing = function() {
		$(this.inputDiv).remove();
		this.options.parent.refreshValues();
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new TextCellEditor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);