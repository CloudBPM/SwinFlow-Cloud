/**
 * 
 */

function ClientService(u, k, auth) {
	this.clt = "clientservices";
	this.clt1 = "VerifyPhoneCode";
	this.flm = "ClientFileServices";
	this.usr = u;// id
	this.key = k;// token
	this.auth = auth;// sd
	this.init();
};

ClientService.prototype = {
	init : function() {

	},
	api : function(n) {
		var url = this.clt + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth;
		return url;
	},
	api1 : function(n) {
		var url = this.clt1 + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth;
		return url;
	},
	uploadapi: function (n, oid) {
		url = this.flm + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key + "&sessionId=" + this.auth + "&oid=" + oid
			+ "&prsn=0000000002";
		return url;
	},
	downloadapi: function (n, oid) {
		url = this.flm + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
			+ "&sessionId=" + this.auth + "&oid=" + oid + "&prsn=0000000002";
		return url;
	},
};
