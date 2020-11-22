/**
 * 微服务
 */
;
(function($, window, document, undefined) {
	var pluginName = "approvalLogPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		ownerId : "",
	};

	var ListPanel = function(element, options) {
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
		this.entity = options.entity;
		this.init(options);
	};

	ListPanel.prototype.init = function(options) {
		var p = $(this.element).readonlyTableViewer({
			id : options.id,
			basicpropsheet : "",
			propsheet : "",
			width : parseInt(options.topparent.style.width),
			height : (parseInt(options.topparent.style.height) - 4),
			parent : this,
			type : "",
		});
		this.listViewPane = p.data("readonlyTableViewer");
		this.listViewPane.init();
		this.listViewPane.createToolbar();
		this.listViewPane.headersize = 10;
		this.listViewPane.loading(1, this.listViewPane.pagesize, "",
				options.ownerId);
	};

	ListPanel.prototype.loading = function(pageno, pagesize, condition, owner) {
		$("progressbar").show();
		var that = this;
		$.getJSON(service.api("SN1"), {
			pn : pageno,
			psz : pagesize,
			cond : condition,
			objectid : this.entity.id,
		}).complete(function(data) {
			that.listViewPane.loadData(data.responseJSON);
			$("#progressbar").hide();
		});
	};

	ListPanel.prototype.createCells = function(obj) {
		 var log = new SubmittingApprovalLog();
		 log.parseFromJSON(obj);
		 this.listViewPane.objects.push(log);
		 var row = this.listViewPane.tableList.insertRow(-1);
		 row.setAttribute("key", log.id);
		 row.addEventListener("click", this, false);
		 row.addEventListener("dblclick", this, false);
		
		 this.listViewPane.createCell(0, log.objectName, row);
		 if (log.objectClass == "ReleasedWfProcess" || log.objectClass == "ReleasedForm") {
			 this.listViewPane.createCell(1, pfonlinestatus[log.status], row);
		 } else {
			 this.listViewPane.createCell(1, onlinestatus[log.status], row);
		 }
		
		 this.listViewPane.createCell(2, log.comment, row);
		 this.listViewPane.createCell(3, log.createTimeStamp, row);
		 this.listViewPane.createCell(4, log.submitter, row);
		 this.listViewPane.createCell(5, log.submitterPosition, row);
		 this.listViewPane.createCell(6, log.submittingOrg, row);
		 this.listViewPane.createCell(7, log.approver, row);
		 this.listViewPane.createCell(8, log.approverPosition, row);
		 this.listViewPane.createCell(9, log.approverOrg, row);

	};

	ListPanel.prototype.createIcon = function(parent, id, classname, name,
			title) {
		var button = document.createElement("BUTTON");
		parent.appendChild(button);
		button.id = id;
		button.className = "btn btn-default";
		button.style.borderRadius = "15px";
		button.style.width = "29px";
		button.style.padding = "3px";
		button.title = title;
		button.addEventListener("click", this, false);
		button.name = name;
		var rmspan = document.createElement("SPAN");
		button.appendChild(rmspan);
		rmspan.className = classname;
		rmspan.name = name;
		rmspan.setAttribute("aria-hidden", "true");
		rmspan.setAttribute("data-toggle", "modal");
		rmspan.setAttribute("data-target", "myModal");
		rmspan.setAttribute("canclick", "true"); // canclick 用于定义span 是否可点击
		rmspan.title = title;
		rmspan.id = id + "i";
		return rmspan;
	};

	ListPanel.prototype.handleEvent = function(e) {
		this.listViewPane.handleEvent(e);
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			break;
		}
	};

	ListPanel.prototype.doClick = function(evt) {
	};

	ListPanel.prototype.createHeaders = function(row) {
		this.listViewPane.createHead("审核对象", row);
		this.listViewPane.createHead("状态", row);
		this.listViewPane.createHead("意见", row);
		this.listViewPane.createHead("时间", row);
		this.listViewPane.createHead("提交人", row);
		this.listViewPane.createHead("提交职位", row);
		this.listViewPane.createHead("提交单位", row);
		this.listViewPane.createHead("审核人", row);
		this.listViewPane.createHead("审核职位", row);
		this.listViewPane.createHead("审核单位", row);
		
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ListPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);