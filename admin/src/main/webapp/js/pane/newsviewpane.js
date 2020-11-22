/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "newsViewPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		ownerId : "",
	};

	var Editor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
			ownerId : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.host = "http://localhost:8080";
		this.init(options.entity);
	};

	Editor.prototype.init = function(entity) {
		this.entity = entity;
		var editorPanel = document.createElement("DIV");
		this.element.appendChild(editorPanel);
		editorPanel.style.padding = "2px";

		var panelDiv = document.createElement("DIV");
		editorPanel.appendChild(panelDiv);
		panelDiv.className = "panel panel-default";
		panelDiv.style.marginBottom = "0px";

		var panelBodyDiv = document.createElement("DIV");
		panelDiv.appendChild(panelBodyDiv);
		panelBodyDiv.className = "panel-body";
		panelBodyDiv.id = "tablediv" + this.options.id;
		panelBodyDiv.style.height = (parseInt(this.options.topparent.style.height) - 50)
				+ "px";
		panelBodyDiv.style.overflow = "auto";

		var panelTitleDiv = document.createElement("DIV");
		panelBodyDiv.appendChild(panelTitleDiv);
		panelTitleDiv.style.className = "col-lg-12 col-md-12 col-sm-12 col-xm-12";
		panelTitleDiv.style.padding = "0px";
		panelTitleDiv.style.border = "1px solid #eee";
		panelTitleDiv.style.borderRadius = "3px";

		var panelTitleTable = document.createElement("Table");
		panelTitleDiv.appendChild(panelTitleTable);
		panelTitleTable.style.width = "100%";
		panelTitleTable.style.height = "130px";

		var panelTitleTR = document.createElement("TR");
		panelTitleTable.appendChild(panelTitleTR);

		var panelTitleTD1 = document.createElement("TD");
		panelTitleTR.appendChild(panelTitleTD1);

		var panelTitleTD2 = document.createElement("TD");
		panelTitleTR.appendChild(panelTitleTD2);

		this.createTitleLabel(this.entity, panelTitleTD1, panelTitleTD2);

		this.createDetails(this.entity, panelBodyDiv);

	};

	Editor.prototype.createTitleLabel = function(entity, panelTitleTD1,
			panelTitleTD2) {
		panelTitleTD1.style.padding = "5px";
		var newsTitleDiv = document.createElement("DIV");
		panelTitleTD1.appendChild(newsTitleDiv);
		newsTitleDiv.innerHTML = "<h3>" + entity.title + "</h3>";

		var newsDateDiv = document.createElement("DIV");
		panelTitleTD1.appendChild(newsDateDiv);
		newsDateDiv.innerHTML = Utils.getDateTime(entity.publishDateTime)
				+ "&nbsp;&nbsp;" + entity.author;

		if (entity.attachments.length > 0) {
			var titleImg = document.createElement("IMG");
			panelTitleTD2.appendChild(titleImg);
			panelTitleTD2.style.width = "150px";
			titleImg.style.borderRadius = "3px";
			titleImg.style.height = "130px";
			titleImg.style.width = "150px";
			titleImg.title = entity.title;
			titleImg.src = this.host + "/file/" + entity.organizationId
					+ "/adm/news/" + entity.id + "/" + entity.attachments[0].id
					+ "_" + entity.attachments[0].name;
		}
	};

	Editor.prototype.createDetails = function(entity, panelBodyDiv) {
		var newsTitleDiv = document.createElement("DIV");
		panelBodyDiv.appendChild(newsTitleDiv);
		newsTitleDiv.innerHTML = "<h1><strong>" + this.entity.title
				+ "</strong></h1>";

		var newsDateDiv = document.createElement("DIV");
		panelBodyDiv.appendChild(newsDateDiv);
		newsDateDiv.innerHTML = Utils.getDateTime(entity.publishDateTime)
				+ "&nbsp;&nbsp;" + entity.author;

		this.showImages(entity, panelBodyDiv);

		var newsContentDiv = document.createElement("DIV");
		panelBodyDiv.appendChild(newsContentDiv);
		newsContentDiv.innerHTML = this.entity.content;

	};

	Editor.prototype.showImages = function(entity, panelBodyDiv) {
		if (entity.attachments.length > 0) {
			for (var i = 1; i < entity.attachments.length; i++) {
				var imageDiv = document.createElement("DIV");
				panelBodyDiv.appendChild(imageDiv);
				imageDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xm-12";
				imageDiv.style.padding = "10px";
				var imageP = document.createElement("P");
				imageDiv.appendChild(imageP);
				imageP.style.textAlign = "center";
				var titleImg = document.createElement("IMG");
				imageP.appendChild(titleImg);
				titleImg.style.align = "center";
				titleImg.src = this.host + "/file/" + entity.organizationId
						+ "/adm/news/" + entity.id + "/"
						+ entity.attachments[i].id + "_"
						+ entity.attachments[i].name;
			}
		}

	}

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
