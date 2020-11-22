/**
 * 
 */

function BLMService(u, k, auth) {
	this.rptm = "BillServices";
	this.usr = u;// id
	this.key = k;// token
	this.auth = auth;// sd
	this.init();
};

BLMService.prototype = {
	init : function() {

	},
	api : function(n) {
		url = this.rptm + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&auth=" + this.auth;
		return url;
	},
};
