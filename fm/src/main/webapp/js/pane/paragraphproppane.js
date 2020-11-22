/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "paragraphPropPane";
	var defaults = {
		id : "",
		parent : "",
		entity : "",
		topparent : "",
		currowner : "",
	};

	var BasicPropPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			parent : "",
			entity : "",
			topparent : "",
			currowner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = options.entity;
		this.init(options);
	};

	BasicPropPanel.prototype.loadPane = function(entity) {
		this.entity = entity;
		this.init(this.options);
	};

	BasicPropPanel.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		this.element.appendChild(modalframe);
		modalframe.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		modalframe.style.padding = "4px";

		var tb = document.createElement("form");
		tb.className = "form-inline col-lg-12 col-md-12 col-sm-12 col-xs-12";
		modalframe.appendChild(tb);

		var toolbar = document.createElement("DIV");
		tb.appendChild(toolbar);
		toolbar.className = "btn-toolbar";
		toolbar.setAttribute("role", "toolbar");
		toolbar.setAttribute("aria-label", "ptoolbar");

		var g1 = this.buttongroup("group1");
		toolbar.appendChild(g1);

		var c1 = "form-control";
		this.fstyle = this.createSelect(g1, "fs" + options.id, "字体风格", c1);
		this.addOptions(this.fstyle, "正常", 0, 0);
		this.addOptions(this.fstyle, "斜体", 1, 1);

		this.fsize = this.createSelect(g1, "fz" + options.id, "字体大小", c1);
		// 0:xx-small;1:x-small;2:small;3:medium;4:large;5:x-large;6:xx-large;
		this.addOptions(this.fsize, "超超小", 0, 0);
		this.addOptions(this.fsize, "超小", 1, 1);
		this.addOptions(this.fsize, "小", 2, 2);
		this.addOptions(this.fsize, "中", 3, 3);
		this.addOptions(this.fsize, "大", 4, 4);
		this.addOptions(this.fsize, "超大", 5, 5);
		this.addOptions(this.fsize, "超超大", 6, 6);

		// 0:normal;1:bold;2:bolder;3:lighter
		this.fweight = this.createSelect(g1, "fw" + options.id, "字体粗细", c1);
		this.addOptions(this.fweight, "正常", 0, 0);
		this.addOptions(this.fweight, "加粗", 1, 1);
		this.addOptions(this.fweight, "超粗", 2, 2);
		this.addOptions(this.fweight, "加细", 3, 3);

		this.hlight = this.createSelect(g1, "hl" + options.id, "字体显示", c1);
		this.addOptions(this.hlight, "正常显示", 0, 0);
		this.addOptions(this.hlight, "突出显示", 1, 1);

		this.clr = document.createElement("INPUT");
		this.clr.type = "color";
		this.clr.style.width = "50px";
		this.clr.setAttribute("title", "改变字体颜色");
		this.clr.className = c1;
		g1.appendChild(this.clr);

		var g2 = this.buttongroup("group1");
		toolbar.appendChild(g2);
		this.blBtn = this.createButton(g2, "bl" + options.id, "强调文字", c1, "i",
				"fa fa-bold");
		this.itBtn = this.createButton(g2, "it" + options.id, "斜体文字", c1, "i",
				"fa fa-italic");
		this.delBtn = this.createButton(g2, "dl" + options.id, "在文字中间划线", c1,
				"i", "fa fa-strikethrough");
		this.ulBtn = this.createButton(g2, "ul" + options.id, "在文字下面划线", c1,
				"i", "fa fa-underline");
		this.markBtn = this.createButton(g2, "mk" + options.id, "为文字做标记", c1,
				"i", "fa fa-thumb-tack");
		this.disableButton(this.blBtn);
		this.disableButton(this.itBtn);
		this.disableButton(this.delBtn);
		this.disableButton(this.ulBtn);
		this.disableButton(this.markBtn);

		var edt = document.createElement("DIV");
		edt.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		modalframe.appendChild(edt);

		var form1 = document.createElement("form");
		form1.className = "form-horizontal";
		edt.appendChild(form1);

		// default value
		var group3 = document.createElement("div");
		group3.className = "form-group";
		form1.appendChild(group3);

		var selDiv3 = document.createElement("div");
		selDiv3.className = "col-sm-12";
		group3.appendChild(selDiv3);

		this.defaultText = document.createElement("TEXTAREA");
		selDiv3.appendChild(this.defaultText);
		this.defaultText.id = "default" + options.id;
		this.defaultText.name = "default" + options.id;
		this.defaultText.className = "form-control";
		this.defaultText.setAttribute("placeholder", "我的段落正文内容");
		this.defaultText.addEventListener("change", this, false);
		this.defaultText.addEventListener("select", this, false);
		this.defaultText.rows = "5";

		this.loadData(this.entity);
		
		if (options.currowner instanceof ReleasedForm) {
			this.fstyle.disabled = true;
			this.fsize.disabled = true;
			this.fweight.disabled = true;
			this.hlight.disabled = true;
			this.clr.disabled = true;
			this.blBtn.disabled = true;
			this.itBtn.disabled = true;
			this.delBtn.disabled = true;
			this.ulBtn.disabled = true;
			this.markBtn.disabled = true;
			this.defaultText.disabled = true;
		}
	};

	BasicPropPanel.prototype.loadData = function(entity) {
		this.defaultText.value = this.entity.content;
		this.fstyle.value = this.entity.fontStyle;
		this.fsize.value = this.entity.fontSize;
		this.fweight.value = this.entity.fontWeight;
		this.hlight.value = this.entity.lead;
	};

	BasicPropPanel.prototype.buttongroup = function(name) {
		var group = document.createElement("DIV");
		group.className = "btn-group";
		group.style.padding = "2px";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", name);
		return group;
	};

	BasicPropPanel.prototype.createSelect = function(group, id, title, style) {
		var select = document.createElement("select");
		group.appendChild(select);
		select.className = style;
		select.setAttribute("title", title);
		select.id = id;
		select.addEventListener('change', this, false);
		return select;
	};

	BasicPropPanel.prototype.createButton = function(group, id, title, style,
			fonttag, fontclass) {
		var button = document.createElement("button");
		group.appendChild(button);
		button.className = style;
		button.setAttribute("title", title);
		button.type = "button";
		button.id = id;
		button.addEventListener('click', this, false);
		var icon = document.createElement(fonttag);
		button.appendChild(icon);
		icon.className = fontclass;
		icon.setAttribute("title", title);
		icon.setAttribute("aria-hidden", "true");
		icon.id = id;
		return button;
	};

	BasicPropPanel.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	BasicPropPanel.prototype.enableButton = function(button) {
		button.removeAttribute("disabled");
	};

	BasicPropPanel.prototype.disableButton = function(button) {
		button.setAttribute("disabled", "true");
	};

	BasicPropPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "change":
			this.doChange(e);
			break;
		case "click":
			this.doClick(e);
			break;
		case "select":
			this.doSelect(e);
			break;
		}
	};

	BasicPropPanel.prototype.doChange = function(evt) {
		if (evt.target == this.defaultText) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "content", this.defaultText.value,
					this.options.currowner));
		} else if (evt.target == this.fstyle) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "fontStyle", this.fstyle.value,
					this.options.currowner));
		} else if (evt.target == this.fsize) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "fontSize", this.fsize.value,
					this.options.currowner));
		} else if (evt.target == this.fweight) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "fontWeight", this.fweight.value,
					this.options.currowner));
		} else if (evt.target == this.hlight) {
			map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
					this.entity, "lead", this.hlight.value,
					this.options.currowner));
		}
		Utils.stopBubble(evt);
	};

	BasicPropPanel.prototype.doClick = function(evt) {
		if (evt.target == this.blBtn
				|| evt.target.id == ("bl" + this.options.id)) {
			this.defaultText.focus();
			var selectedText = window.getSelection().toString();
			if (selectedText.length > 0) {
				var s = this.doGetCaretPosition(this.defaultText);
				var t = s + selectedText.length;
				var news = this.insertAt(this.defaultText.value, s, "<b>");
				t = t + "<b>".length;
				news = this.insertAt(news, t, "</b>");
				this.defaultText.value = news;
			}
		} else if (evt.target == this.itBtn
				|| evt.target.id == ("it" + this.options.id)) {
			this.defaultText.focus();
			var selectedText = window.getSelection().toString();
			if (selectedText.length > 0) {
				var s = this.doGetCaretPosition(this.defaultText);
				var t = s + selectedText.length;
				var news = this.insertAt(this.defaultText.value, s, "<i>");
				t = t + "<i>".length;
				news = this.insertAt(news, t, "</i>");
				this.defaultText.value = news;
			}
		} else if (evt.target == this.delBtn
				|| evt.target.id == ("dl" + this.options.id)) {
			this.defaultText.focus();
			var selectedText = window.getSelection().toString();
			if (selectedText.length > 0) {
				var s = this.doGetCaretPosition(this.defaultText);
				var t = s + selectedText.length;
				var news = this.insertAt(this.defaultText.value, s, "<del>");
				t = t + "<del>".length;
				news = this.insertAt(news, t, "</del>");
				this.defaultText.value = news;
			}
		} else if (evt.target == this.ulBtn
				|| evt.target.id == ("ul" + this.options.id)) {
			this.defaultText.focus();
			var selectedText = window.getSelection().toString();
			if (selectedText.length > 0) {
				var s = this.doGetCaretPosition(this.defaultText);
				var t = s + selectedText.length;
				var news = this.insertAt(this.defaultText.value, s, "<u>");
				t = t + "<u>".length;
				news = this.insertAt(news, t, "</u>");
				this.defaultText.value = news;
			}
		} else if (evt.target == this.markBtnv
				|| evt.target.id == ("mk" + this.options.id)) {
			this.defaultText.focus();
			var selectedText = window.getSelection().toString();
			if (selectedText.length > 0) {
				var s = this.doGetCaretPosition(this.defaultText);
				var t = s + selectedText.length;
				var news = this.insertAt(this.defaultText.value, s, "<mark>");
				t = t + "<mark>".length;
				news = this.insertAt(news, t, "</mark>");
				this.defaultText.value = news;
			}
		}
		this.defaultText.dispatchEvent(new Event('change'));
		this.disableButton(this.blBtn);
		this.disableButton(this.itBtn);
		this.disableButton(this.delBtn);
		this.disableButton(this.ulBtn);
		this.disableButton(this.markBtn);
		Utils.stopBubble(evt);
	};

	BasicPropPanel.prototype.insertAt = function(oldStr, start, newSubStr) {
		return oldStr.substr(0, start) + newSubStr + oldStr.substr(start);
	};

	BasicPropPanel.prototype.doGetCaretPosition = function(oField) {
		// Initialize
		var iCaretPos = 0;
		// IE Support
		if (document.selection) {
			// Set focus on the element
			oField.focus();
			// To get cursor position, get empty selection range
			var oSel = document.selection.createRange();
			// Move selection start to 0 position
			oSel.moveStart('character', -oField.value.length);
			// The caret position is selection length
			iCaretPos = oSel.text.length;
		}
		// Firefox support
		else if (oField.selectionStart || oField.selectionStart == '0')
			iCaretPos = oField.selectionStart;
		// Return results
		return iCaretPos;
	}

	BasicPropPanel.prototype.doSelect = function(evt) {
		if (window.getSelection) {
			this.enableButton(this.blBtn);
			this.enableButton(this.itBtn);
			this.enableButton(this.delBtn);
			this.enableButton(this.ulBtn);
			this.enableButton(this.markBtn);
		} else {
			this.disableButton(this.blBtn);
			this.disableButton(this.itBtn);
			this.disableButton(this.delBtn);
			this.disableButton(this.ulBtn);
			this.disableButton(this.markBtn);
		}
		Utils.stopBubble(evt);
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new BasicPropPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);