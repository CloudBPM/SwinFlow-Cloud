;
(function($, window, document, undefined) {
	var pluginName = "scanCodeLogin";
	var defaults = {
		title : "",
		greeting : "",
		user : "",
	};

	var ScanCodeLogin = function(element, options) {
		this.element = element;
		this.options = $.extend({
			title : "",
			greeting : "",
			user : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent;
		this.title = options.title;
		this.init(options);
	};

	ScanCodeLogin.prototype.init = function(options) {
		var container = document.createElement("DIV");
		this.element.appendChild(container);
		container.style.marginTop = "2px";
		
		var panel = document.createElement("DIV");
		container.appendChild(panel);
		panel.className = "panel panel-default";
		panel.style.border = "0px";

		var panelbody = document.createElement("DIV");
		panelbody.className = "panel-body";
		panel.appendChild(panelbody);

		var form = document.createElement("form");
		form.className = "form-horizontal";
		panelbody.appendChild(form);

		//二维码
		this.gDiv15 = document.createElement("div");
		form.appendChild(this.gDiv15);
		this.gDiv15.id = "fm15";
		this.gDiv15.src = this.generateQRCode(12);
		this.gDiv15.className = "col-xs-6 col-sm-6 col-md-6 col-lg-6";
	};
	
	
	ScanCodeLogin.prototype.setStatus = function(active) {
		if (active) {
			this.gDiv15.style.display = "";
		} else {
			this.gDiv15.style.display = "none";
		}
	};
	
	//生成二维码,用长轮询发送请求
	ScanCodeLogin.prototype.generateQRCode = function(number) {
		var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		var UUID = "";
		for(var i = 0; i < number ; i ++) {
			var id = Math.ceil(Math.random()*35);
			UUID += chars[id];
		}
		//生成uuid
		var qrcode = new QRCode(this.gDiv15, {
			width : 200,
			height : 200,
		});
		qrcode.makeCode(UUID);
		return qrcode;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ScanCodeLogin(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);