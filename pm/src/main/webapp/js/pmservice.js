/**
 * 
 */

function PMService(u, k, auth) {
	this.pm = "PmServices";
	this.flm = "FileServices";
	this.usr = u;// id
	this.key = k;// token
	this.auth = auth;// sd
	this.init();
};

PMService.prototype = {
	init : function() {
	},
	api : function(n, oid) {
		url = this.pm + "?usr=" + this.usr + "&api=" + n + "&oid=" + oid
				+ "&tkn=" + this.key + "&sessionId=" + this.auth
				+ "&prsn=0000000001";
		return url;
	},
	api2 : function(n, oid) {
		url = this.flm + "?usr=" + this.usr + "&api=" + n + "&oid=" + oid
				+ "&tkn=" + this.key + "&sessionId=" + this.auth
				+ "&prsn=0000000001";
		return url;
	},
};
