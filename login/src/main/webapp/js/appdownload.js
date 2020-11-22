/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "mobileAppDownload";
	var defaults = {
		title : "",
		greeting : "",
		user : "",
	};

	var MobileAppDownload = function(element, options) {
		this.element = element;
		this.options = $.extend({
			title : "",
			greeting : "",
			user : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.title = options.title;
		this.init(options);
	};

	MobileAppDownload.prototype.init = function(options) {
		var modalframe = document.createElement("DIV");
		this.element.appendChild(modalframe);
		modalframe.className = "container-fluid";

		this.rowDIV = document.createElement("DIV");
		modalframe.appendChild(this.rowDIV);
		this.rowDIV.className = "row";
		this.createIpQrCode();
	}

	MobileAppDownload.prototype.drawQrCode = function(parent, message) {
		var qrcode = new QRCode(parent, {
			width : 100,
			height : 100,
		});
		qrcode.makeCode(message);
		return qrcode;
	}

	//这里是画二维码的时候循环调用了这个方法，好像代码的结构不太好看
	MobileAppDownload.prototype.createIpQrCode = function() {
		//获取服务器的ip
		this.ip_addr = document.location.hostname;
		this.port = document.location.port;
		this.ip_addr = this.ip_addr + ":" + this.port;
		if (this.ip_addr == "localhost" || this.ip_addr == "127.0.0.1") {
			//ajax获取局域网ip
			//this.getServerIp();
		} else {
			var colDIV1 = document.createElement("DIV");
			this.rowDIV.appendChild(colDIV1);
			colDIV1.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";

			var downloadQrCodeDIV = document.createElement("div");
			this.rowDIV.appendChild(downloadQrCodeDIV);
			downloadQrCodeDIV.className = "col-xs-12 col-sm-12 col-md-2 col-lg-2";

			var center0 = document.createElement("center");
			downloadQrCodeDIV.appendChild(center0);

			//下载apk的二维码
			this.downloadQrCode = document.createElement("div");
			center0.appendChild(this.downloadQrCode);
			this.downloadQrCode.id = "serverDownloadQrCode";
			this.downloadQrCode.src = this.drawQrCode(this.downloadQrCode, "http://" + this.ip_addr + "/login/myxuanqi.apk");

			var infoDiv0 = document.createElement("DIV");
			downloadQrCodeDIV.appendChild(infoDiv0);
			infoDiv0.style.textAlign = "center";
			infoDiv0.innerHTML = "手机扫码下载";

			var ipQrCodeDIV = document.createElement("div");
			this.rowDIV.appendChild(ipQrCodeDIV);
			ipQrCodeDIV.className = "col-xs-12 col-sm-12 col-md-2 col-lg-2";

			var center1 = document.createElement("center");
			ipQrCodeDIV.appendChild(center1);

			this.ipQrCode = document.createElement("div");
			center1.appendChild(this.ipQrCode);
			this.ipQrCode.id = "serverIpQrCode";
			this.ipQrCode.src = this.drawQrCode(this.ipQrCode, this.ip_addr);

			var infoDiv1 = document.createElement("DIV");
			ipQrCodeDIV.appendChild(infoDiv1);
			infoDiv1.style.textAlign = "center";
			infoDiv1.innerHTML = "手机扫码获取访问网址";

			var colDIV4 = document.createElement("DIV");
			this.rowDIV.appendChild(colDIV4);
			colDIV4.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
		}
	};

	//如果ip为localhost，则通过get请求获取ip
	MobileAppDownload.prototype.getServerIp = function() {
		that = this;
		// this.downloadQrCode.src = null;
		var serverIp = null;
		$.get("Authenticate", {
			api : 0,
		}, function(data) {
			// console.log(data);
			if (data.ip != null) {

				serverIp = data.ip;
				var ipArray = serverIp.split("|");
				for (var i = 0; i < ipArray.length; i++) {
					//显示服务器ip的二维码
					that.ipQrCode = document.createElement("div");
					that.rowDIV.appendChild(that.ipQrCode);
					that.ipQrCode.id = "serverIpQrCode";
					that.ipQrCode.src = that.drawQrCode(that.ipQrCode, ipArray[i]);
					that.ipQrCode.className = "col-xs-6 col-sm-6 col-md-6 col-lg-6";
					// that.ipQrCode.src = that.drawQrCode(that.ipQrCode, ipArray[i]);

					//下载apk的二维码
					that.downloadQrCode = document.createElement("div");
					that.rowDIV.appendChild(that.downloadQrCode);
					that.downloadQrCode.id = "serverDownloadQrCode";
					that.downloadQrCode.src = that.drawQrCode(that.downloadQrCode, "http://" + ipArray[i] + ":8080/login/1531913089.png");
					that.downloadQrCode.className = "col-xs-6 col-sm-6 col-md-6 col-lg-6";
					// that.downloadQrCode.src = that.drawQrCode(that.downloadQrCode, "http://" + ipArray[i] + ":8080/login/1531913089.png");
				}
				// that.downloadQrCode.src = that.drawQrCode(that.downloadQrCode, "http://" + ipArray[0] + ":8080/login/1531913089.png");
			}
		});
		this.serverIp = serverIp;
	};

	//这里是画下载的二维码
	MobileAppDownload.prototype.createDownloadQrCode = function() {
		//获取服务器的ip
		if (this.serverIp != null) {
			var ipArray = this.serverIp.split("|");
			this.ip_addr = ipArray[0];
		}
		if (this.ip_addr != "localhost" && this.ip_addr != "127.0.0.1") {
			return this.drawQrCode(this.downloadQrCode, "http://" + this.ip_addr + ":8080/login/1531913089.png");
		}
	};


	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new MobileAppDownload(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);