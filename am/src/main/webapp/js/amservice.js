/**
 * 
 */

function AMService(u, k, auth) {
	this.usr = u;// id
	this.key = k;// token
	this.auth = auth;// sd
	this.am = "AmServices";
	this.test = "MSTestingService";
	this.dls = "AmFileDownloadServices";
	this.flm = "AmFileUploadServices";
	this.init();
};

AMService.prototype = {
	init : function() {

	},
	api : function(n) {
		url = this.am + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth;
		return url;
	},
	sendreq : function(n) {
		url = this.test + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth;
		return url;
	},
	downloadapi : function(n, oid, cid) {
		url = this.dls + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth + "&oid=" + oid + "&cid=" + cid;
		return url;
	},
	uploadapi : function(n, oid, cid) {
		url = this.flm + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth + "&oid=" + oid + "&cid=" + cid;
		return url;
	},
};
