/**
 * 
 */

function BDMService(u, k, auth) {
	this.rptm = "BDServices";
	this.usr = u;// id
	this.key = k;// token
	this.auth = auth;// sd
	this.init();
};

BDMService.prototype = {
	init : function() {

	},
	api : function(n) {
		url = this.rptm + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
				+ "&sessionId=" + this.auth;
		return url;
	},
	previewreport : function(id) {
		window.open("bdreportpreview.jsp?prtid=" + id + "&sessionId=" + this.auth);
		return url;
	},
};
