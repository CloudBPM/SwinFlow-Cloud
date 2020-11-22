/**
 * 
 */

function ServerService() {
	this.svrm = "service11";
	this.init();
};

ServerService.prototype = {
	init : function() {

	},
	api : function(n) {
		url = this.svrm + "/api" + n + "";
		return url;
	},
};
