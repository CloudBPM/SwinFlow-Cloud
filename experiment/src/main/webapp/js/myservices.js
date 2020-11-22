/**
 * 
 */

function MyService0(u, k, auth) {
	this.sevs = "MyService0";
	this.fsvrs = "FileServices";
	this.usr = u;// id
	this.key = k;// token
	this.auth = auth;// sd
	this.init();
};

MyService0.prototype = {
	init : function() {

	},
	api : function(n) {
		url = this.sevs + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth;
		return url;
	},
	api1 : function(n) {
		url = this.fsvrs + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth;
		return url;
	},


};
