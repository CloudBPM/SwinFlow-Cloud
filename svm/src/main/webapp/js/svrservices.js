/**
 * 
 */

function SVRService(u, k, auth) {
	this.svrm = "SvmServices";
	this.usr = u;// id
	this.key = k;// token
	this.auth = auth;// sd
	this.init();
};

SVRService.prototype = {
	init : function() {

	},
	api : function(n) {
		url = this.svrm + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth;
		return url;
	},
};

function SvrInfoService() {
	this.init();
};

SvrInfoService.prototype = {
	init : function() {

	},
	api : function(ip, port, n) {
		url = "http://" + ip + ":" + port + "/bpmsvr/service11/api" + n + "";
		return url;
	},
};
