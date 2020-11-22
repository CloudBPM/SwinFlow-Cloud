/**
 *
 */
function AndroidAppPlugin() {
    this.id = null;
    this.alias = null;
    this.name = null;
    this.keywords = null;
    this.accessType = 1;
    this.comments = null;
    this.securityAccessKey = null;
    this.price = 0;
    this.usagePrice = 0;
    this.status = 0;
    this.onlineDateTime = -1;
    this.offlineDateTime = -1;
    this.versionCode = 1;
    this.versionName = "1.0";
    this.apkFileName = null;
    this.deveoplerId = null;
    this.lastupdateInfo = null;
    this.lastupdate = null;
    this.createDateTime = null;
    this.parent = null;
    this.currOwner = null;
    this.owner = null;
    this.classtypename = "AndroidAppPlugin";

};

AndroidAppPlugin.prototype = new WorkflowEntity();

AndroidAppPlugin.prototype.parsefromJSON = function(json) {
    this.id = json.id;
    this.name = json.name;
    this.versionCode = json.versionCode;
    this.versionName = json.versionName;
    this.apkFileName = json.apkFileName;
    this.keywords = json.keywords;
    this.accessType = json.accessType;
    this.comments = json.comments;
    this.securityAccessKey = json.securityAccessKey;
    this.price = json.price;
    this.usagePrice = json.usagePrice;
    this.status = json.status;
    this.onlineDateTime = json.onlineDateTime;
    this.offlineDateTime = json.offlineDateTime;

    this.deveoplerId = json.deveoplerId;
    this.lastupdateInfo = json.lastupdateInfo;
    this.lastupdate = json.lastupdate;
    this.createDateTime = json.createDateTime;
    this.parent = json.parent;
    this.currOwner = json.currOwner;
    this.owner = json.owner;
    this.alias = json.alias;
};
