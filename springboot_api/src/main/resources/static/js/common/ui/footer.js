/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "footer";
	var defaults = {
		id : "",
	};

	var FooterPlugin = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	FooterPlugin.prototype.init = function(options) {
		// footer area
		var fContainer = document.createElement("DIV");
		this.element.appendChild(fContainer);
		fContainer.className = "container-fluid";
		fContainer.style.width = "100%";
		
		// footer row
		var frow = document.createElement("DIV");
		fContainer.appendChild(frow);
		frow.className = "row";
		frow.style.backgroundColor = "#eee";

		// footer cols
		var col1 = document.createElement("DIV");
		frow.appendChild(col1);
		col1.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";

		var col2 = document.createElement("DIV");
		frow.appendChild(col2);
		col2.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

		var col3 = document.createElement("DIV");
		frow.appendChild(col3);
		col3.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";

		// footer
		var footer = document.createElement("DIV");
		col2.appendChild(footer);
		footer.className = "footer_bg";

		var footerBody = document.createElement("DIV");
		footer.appendChild(footerBody);
		footerBody.className = "footer-body";

		// // separate line
		// var separator = document.createElement("DIV");
		// footerBody.appendChild(separator);
		// separator.className = "clearfix";
		//		
		// var col = document.createElement("DIV");
		// separator.appendChild(col);
		// col.style.width = "100%";
		// col.style.height = "1px";
		// col.style.backgroundColor = "#ddd";

		// link row
		var linkrow = document.createElement("DIV");
		footerBody.appendChild(linkrow);
		linkrow.className = "clearfix";

		var linkcol1 = this.createLinkCol(linkrow);
		var linkSpan1 = this.createLinkTitle(linkcol1, "资源中心");
		var linkList1 = this.createLinkMenu(linkSpan1);
		this.createLinkMenuItem(linkList1, "帮助", "http://www.xuanqiyun.com", 1);
		this.createLinkMenuItem(linkList1, "用户案例", "http://www.xuanqiyun.com", 1);
		this.createLinkMenuItem(linkList1, "SDK", "http://www.xuanqiyun.com", 1);
		this.createLinkMenuItem(linkList1, "常见问题", "http://www.xuanqiyun.com", 1);

		var linkcol2 = this.createLinkCol(linkrow);
		var linkSpan2 = this.createLinkTitle(linkcol2, "关于我们");
		var linkList2 = this.createLinkMenu(linkSpan2);
		this.createLinkMenuItem(linkList2, "用户协议与隐私政策", "../om/agreement.html", 1);
		this.createLinkMenuItem(linkList2, "公司介绍", "http://www.xuanqiyun.com", 1);

		var linkcol3 = this.createLinkCol(linkrow);
		var linkSpan3 = this.createLinkTitle(linkcol3, "联系我们");
		var linkList3 = this.createLinkMenu(linkSpan3);
		this.createLinkMenuItem(linkList3, "杭州轩琦信息科技有限公司", "", 1);
		this.createLinkMenuItem(linkList3, "地址：浙江省杭州市经济技术开发区6号大街452号2号楼705",
				"", 1);
		this.createLinkMenuItem(linkList3, "联系电话：15701647476", "", 1);
		
		
		var linkcol4 = this.createLinkCol(linkrow);
		var linkSpan4 = this.createLinkBGTitle(linkcol4, "轩琦科技");
		var linkList4 = this.createLinkMenu(linkSpan4);
		this.createLinkMenuItem(linkList4, "企业客服：15701647476", "", 1);

		// --- footer row, the following codes can be used in future, if you want
		// var frow1 = document.createElement("DIV");
		// fContainer.appendChild(frow1);
		// frow1.className = "row";
		//
		// var lcol1 = document.createElement("DIV");
		// frow1.appendChild(lcol1);
		// lcol1.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
		//
		// var lcol2 = document.createElement("DIV");
		// frow1.appendChild(lcol2);
		// lcol2.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12
		// footer-body";
		//		
		// var content0 = document.createElement("DIV");
		// lcol2.appendChild(content0);
		// content0.className = "container footer-body";
		//
		// this.createLinkSpan(content0, "关于我们", "#");
		// this.createDevideSpan(content0, " | ");
		// this.createLinkSpan(content0, "联系我们", "#");
		// this.createDevideSpan(content0, " | ");
		// this.createLinkSpan(content0, "文档", "#");
		// this.createDevideSpan(content0, " | ");
		// this.createLinkSpan(content0, "用户案例", "#");
		//
		// var lcol3 = document.createElement("DIV");
		// frow1.appendChild(lcol3);
		// lcol3.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";

		// copyright row, certificate, authentication
		var frow3 = document.createElement("DIV");
		fContainer.appendChild(frow3);
		frow3.className = "row";
		frow3.style.backgroundColor = "#fff";
		
		var col31 = document.createElement("DIV");
		frow3.appendChild(col31);
		col31.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";

		var col32 = document.createElement("DIV");
		frow3.appendChild(col32);
		col32.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		
		var footer2 = document.createElement("DIV");
		col32.appendChild(footer2);
		footer2.className = "footer_bg";
		footer2.style.backgroundColor = "#fff";
		
		var footerBody2 = document.createElement("DIV");
		footer2.appendChild(footerBody2);
		footerBody2.className = "footer-body";

		this.createSpan(footerBody2, "Copyright © 2017 - 2019  杭州轩琦信息科技有限公司 版权所有");
		this.createSpan(footerBody2, " | ");
		this.createSpan(footerBody2, "浙ICP备18041581号");
		this.createSpan(footerBody2, " | ");
		this.createSpan(footerBody2, "浙公安网备33011802001550号");

		var col33 = document.createElement("DIV");
		frow3.appendChild(col33);
		col33.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
	};

	FooterPlugin.prototype.createLinkCol = function(parent) {
		var linkcol = document.createElement("DIV");
		parent.appendChild(linkcol);
		linkcol.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
		return linkcol;
	};

	FooterPlugin.prototype.createLinkTitle = function(parent, title) {
		var linkSpan = document.createElement("SPAN");
		parent.appendChild(linkSpan);
		linkSpan.className = "footer-title";
		linkSpan.innerHTML = title;
		return linkSpan;
	};
	
	FooterPlugin.prototype.createLinkBGTitle = function(parent, title) {
		var linkSpan = document.createElement("SPAN");
		parent.appendChild(linkSpan);
		linkSpan.className = "footer-title pagination-right";
		var linkSTR = document.createElement("STRONG");
		linkSpan.appendChild(linkSTR)
		var linkH = document.createElement("H3");
		linkSTR.appendChild(linkH);
		linkH.innerHTML = title;
		return linkSpan;
	};

	FooterPlugin.prototype.createLinkMenu = function(parent) {
		var linkList = document.createElement("UL");
		parent.appendChild(linkList);
		linkList.className = "footer-link-list";
		return linkList;
	};

	FooterPlugin.prototype.createLinkMenuItem = function(parent, title, url,
			blank) {
		var link = document.createElement("LI");
		parent.appendChild(link);
		if (url != "") {
			var linkA = document.createElement("A");
			link.appendChild(linkA);
			linkA.className = "footer-link";
			linkA.href = url;
			if (blank != undefined) {
				linkA.target = "_blank";
			}
			linkA.innerHTML = title;
			return link;
		} else {
			var linkA = document.createElement("SPAN");
			link.appendChild(linkA);
			linkA.className = "footer-link";
			linkA.innerHTML = title;
			return link;
		}

	};

	FooterPlugin.prototype.createLinkSpan = function(parent, content, url) {
		var span1 = document.createElement("SPAN");
		parent.appendChild(span1);
		var str = document.createElement("STRONG");
		span1.appendChild(str);
		var btn = document.createElement("A");
		str.appendChild(btn);
		btn.style.textDecoration = "none";
		btn.style.color = "#666";
		btn.href = url;
		btn.innerHTML = content;
	};

	FooterPlugin.prototype.createDevideSpan = function(parent, content) {
		var span1 = document.createElement("SPAN");
		parent.appendChild(span1);
		span1.innerHTML = content;
	};

	FooterPlugin.prototype.createSpan = function(parent, content) {
		var span1 = document.createElement("SPAN");
		parent.appendChild(span1);
		span1.style.color = "#333";
		span1.innerHTML = content;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new FooterPlugin(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);