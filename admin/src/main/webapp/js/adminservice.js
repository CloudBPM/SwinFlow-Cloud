/**
 * 
 */

function ADMINService(u, k, auth) {
	this.admin = "AdminServices";
	this.usr = u;// id
	this.key = k;// token
	this.auth = auth;// sd
	this.dls = "AmFileDownloadServices";
	this.flm = "AmFileUploadServices";
	this.init();
};

ADMINService.prototype = {
	init : function() {

	},
	api : function(n) {
		url = this.admin + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth;
		return url;
	},
	api2 : function(n, oid) {
		url = this.flm + "?usr=" + this.usr + "&api=" + n + "&oid=" + oid
				+ "&tkn=" + this.key + "&sessionId=" + this.auth
				+ "&prsn=0000000001";
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
	uploadapi1: function (n, oid) {
		url = this.flm + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key + "&sessionId=" + this.auth + "&oid=" + oid
			+ "&prsn=0000000002";
		return url;
	},
};
