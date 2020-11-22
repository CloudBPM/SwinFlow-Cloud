/**
 *
 */

function OMService(u, k, auth) {
    this.om = "OmServices";
    this.regs = "RegistrationService";
    this.flm = "FileServices";
    this.dls = "FileDownloadServices";
    this.omps = "OmPageService";
    this.usr = u;// id
    this.key = k;// token
    this.auth = auth;// sd
    this.init();
};

OMService.prototype = {
    init: function () {

    },
    api: function (n, oid) {
        url = this.om + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
            + "&sessionId=" + this.auth + "&oid=" + oid + "&prsn=0000000002";
        return url;
    },
    cpmvapi: function (n, oid, type, pid) {
        url = this.om + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
            + "&sessionId=" + this.auth + "&oid=" + oid + "&prsn=0000000002&ftype=" + type + "&prtid=" + pid;
        return url;
    },
    regPost: function (oid) {
        return this.regs + "&oid=" + oid + "&prsn=0000000002";
    },
    regGet: function (n, oid) {
        return this.regs + "?api=" + n + "&oid=" + oid + "&prsn=0000000002";
    },
    uploadapi: function (n, oid) {
        url = this.flm + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key + "&sessionId=" + this.auth + "&oid=" + oid
            + "&prsn=0000000002";
        return url;
    },
    homepageapi: function (n, id, oid) {
        url = this.omps + "?usr=" + this.usr + "&api=" + n + "&id=" + id
            + "&tkn=" + this.key + "&sessionId=" + this.auth + "&oid=" + oid
            + "&prsn=0000000002";
        return url;
    },
    downloadapi: function (n, oid) {
        url = this.dls + "?usr=" + this.usr + "&api=" + n + "&tkn=" + this.key
            + "&sessionId=" + this.auth + "&oid=" + oid + "&prsn=0000000002";
        return url;
    },
    previewmbui: function (mbuiid, owner) {
        window.open("mbuipreview.jsp?sessionId=" + this.auth + "&cid=" + mbuiid + "&owner=" + owner);
        return;
    },
    previewdesktopui: function (appid, owner) {
        window.open("pcdesktopuipreview.jsp?sessionId=" + this.auth + "&cid=" + appid + "&owner=" + owner);
        return;
    },
};
