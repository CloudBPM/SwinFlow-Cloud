/**
 * 
 */

function FMService(u, k, auth) {
	this.fm = "FmServices";
	this.usr = u;// id
	this.key = k;// token
	this.auth = auth;// sd
	this.init();
};

FMService.prototype = {
	init : function() {

	},
	api : function(n) {
		url = this.fm + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth;
		return url;
	},
	api1 : function(n, id) {
		url = this.fm + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth + "&refid=" + id;
		return url;
	},
	api2 : function(n, oid) {
		url = this.fm + "?usr=" + this.usr + "&api=" + n + "&oid=" + oid
				+ "&tkn=" + this.key + "&sessionId=" + this.auth;
		return url;
	},
};
