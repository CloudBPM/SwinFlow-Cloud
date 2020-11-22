/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "firstPagePane";
	var defaults = {
		id : "",
		ownerId : "",
		parent : "",
	};

	var Board = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			ownerId : "",
			parent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	Board.prototype.init = function(options) {
		this.board = document.createElement("DIV");
		this.board.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.element.appendChild(this.board);
		
		this.show(false);
		
		var leftDiv = document.createElement("DIV");
		this.board.appendChild(leftDiv);
		leftDiv.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";
		
		var middlePanel = document.createElement("DIV");
		this.board.appendChild(middlePanel);
		middlePanel.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";
		
		var rightDiv = document.createElement("DIV");
		this.board.appendChild(rightDiv);
		rightDiv.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";
		
		
		var detailPanel = document.createElement("DIV");
		middlePanel.appendChild(detailPanel);
		detailPanel.className = "container-fluid";
		
		var panelRow = document.createElement("DIV");
		detailPanel.appendChild(panelRow);
		panelRow.className = "row";
		
		
		this.panelCol1 = document.createElement("DIV");
		panelRow.appendChild(this.panelCol1);
		
		
		this.newsPanel = document.createElement("DIV");
		panelRow.appendChild(this.newsPanel);
		this.newsPanel.className = "panel panel-default";
		this.newsPanel.style.border = "1px";
		
		
		
		this.newsPanelBody = document.createElement("DIV");
		this.newsPanel.appendChild(this.newsPanelBody);
		this.newsPanelBody.className = "panel-body";
		this.newsPanelBody.style.padding = "2px";
		this.newsPanelBody.style.border = "solid";
		this.newsPanelBody.style.borderWidth = "1px";
		this.newsPanelBody.style.width = "35%";
		this.newsPanelBody.style.height = "300px";
		this.newsPanelBody.style.margin = "0 auto";
		
		
		var backDiv = document.createElement("DIV");
		this.newsPanelBody.appendChild(backDiv);
		backDiv.className = "col-md-12";
		

		this.backButton = document.createElement("BUTTON");
		backDiv.appendChild(this.backButton);
		this.backButton.className = "glyphicon glyphicon-arrow-left";
		this.backButton.addEventListener('click', this, false);
		this.backButton.id = "退出";
		
		var titleDiv = document.createElement("DIV");
		this.newsPanelBody.appendChild(titleDiv);
		titleDiv.className = "col-md-12";
		
		var h3 = document.createElement("H3");
		titleDiv.appendChild(h3);
		h3.innerHTML = "公司首页";
		h3.style.textAlign = "center";
		
		var companyDiv = document.createElement("DIV");
		this.newsPanelBody.appendChild(companyDiv);
		companyDiv.className = "col-md-5";
		
		var p = document.createElement("DIV");
		companyDiv.appendChild(p);
		p.style.fontSize = "9px";
		p.innerHTML = "公司";
		p.style.textAlign = "right";
		
		var timeDiv = document.createElement("DIV");
		this.newsPanelBody.appendChild(timeDiv);
		timeDiv.className = "col-md-5";
		
		var p1 = document.createElement("P");
		timeDiv.appendChild(p1);
		p1.style.fontSize = "9px";
		p1.style.textAlign = "right";
		p1.innerHTML = "时间";
		p1.style.textAlign = "right";
		
		var contentDetailDiv = document.createElement("DIV");
		this.newsPanelBody.appendChild(contentDetailDiv);
		contentDetailDiv.className = "col-md-12";	
		
	};

	Board.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	Board.prototype.show = function(show) {
		if (show) {
			this.board.style.display = "";
		} else {
			this.board.style.display = "none";
		}
	};

	Board.prototype.doClick = function(evt) {
		
		var that = this;
		if (evt.target == this.backButton){
//			this.options.parent.hiddenAll();
//			this.options.parent.dashboard.show(true);
//			this.removeChild(that.newsPanelBody);
//			this.options.parent.removeChild();
			this.options.parent.doClick(evt);
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