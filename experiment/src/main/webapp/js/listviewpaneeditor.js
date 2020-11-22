/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "listViewPaneEditor";
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
		// basic property sheet plugin
		var p1 = $(this.element).listViewPane({
			id : "",
			ownerId : "",
			basicpropsheet : options.basicpropsheet,
			propsheet : options.propsheet,
			width : options.width,
			height : options.height,
			parent : this,
		});
		this.listViewPane = p1.data("listViewPane");
	};

	Editor.prototype.loading = function(pageno, pagesize, condition, ownerID) {
		$("#progressbar").show();
		var that = this;
		$.getJSON(services.api(2), {
			pn : pageno,
			psz : pagesize,
			cond : condition,
			oid : ownerID,
		}).complete(function(data) {
			that.listViewPane.loadData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	Editor.prototype.createCells = function(obj) {
		this.listViewPane.headersize = 3;
		var p = new TrainingPerson();
		p.parseFromJSON(obj);
		this.listViewPane.objects.push(p);
		var row = this.listViewPane.tableList.insertRow(-1);
		row.setAttribute("key", p.id);
		row.addEventListener("click", this, false);
		row.addEventListener("dblclick", this, false);
		this.listViewPane.createCell(0, p.id, row);
		this.listViewPane.createCell(1, Utils.parse(p.lastName), row);
		this.listViewPane.createCell(2, Utils.parse(p.firstName), row);

	};

	Editor.prototype.createHeaders = function(row) {
		this.listViewPane.createHead("ID", row);
		this.listViewPane.createHead("姓", row);
		this.listViewPane.createHead("名", row);

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
