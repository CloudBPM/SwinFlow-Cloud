/**
 * @author Dahai Cao created at 19:01 on 2019-01-11
 * @constructor
 */
function ReportService() {
    this.id = null;
    this.name = null;
    this.keywords = null;
    this.accessType = 1;
    this.comments = null;
    this.securityAccessKey = null;
    this.price = 0;
    this.usagePrice = 0;
    this.status = 0;
    this.onlineDateTime = 0;
    this.offlineDateTime = 0;
    this.lastupdate = 0;
    this.createDateTime = 0;
    this.parent = null;
    this.currOwner = null;
    this.owner = null;
    this.classtypename = "ReportService";
    // 0: 产生不分页式报表的报表服务；
    // 1：产生分页式报表的报表服务；
    // 2：产生统计报表的报表服务
    this.reportType = 0;
    // 用于保存过程所有的变量列表的，
    // 这个变量列表不需要存储在报表服务中
    this.children = [];
    // 查询条件列表
    this.queryCondition = [];
    // 0:不跨版本;1:跨版本
    this.crossVersion = 0;
    this.parentVersion = [];
    this.reportDefinition = [];
    this.parentCode = null;

};

ReportService.prototype = new WorkflowEntity();

ReportService.prototype.addChild = function(ch) {
    this.children.push(ch);
};

ReportService.prototype.addReportField = function(rf) {
    this.reportDefinition.push(rf);
};

ReportService.prototype.insertReportField = function(pos, rp) {
    this.reportDefinition.splice(pos, 0, rp);
};

ReportService.prototype.searchLeftList = function(condition) {
    var result = [];
    var list = this.children;
    for (var i = 0; i < list.length; i++) {
        if ((list[i].name != null && list[i].name.search(condition) >= 0)||
            (datatype[list[i].datatype] != null && datatype[list[i].datatype]
                .search(condition) >= 0)) {
            result.push(list[i]);
        }
    }
    return result;
};

ReportService.prototype.searchRightList = function(condition) {
    var result = [];
    var list = this.reportDefinition;
    for (var i = 0; i < list.length; i++) {
        if (list[i].name != null && list[i].name.search(condition) >= 0) {
            result.push(list[i]);
        }
    }
    return result;
};

ReportService.prototype.parseFromJSON = function(json) {
    this.id = json.id;
    this.name = json.name;
    this.keywords = json.keywords;
    this.accessType = json.accessType;
    this.comments = json.comments;
    this.securityAccessKey = json.securityAccessKey;
    this.price = json.price;
    this.usagePrice = json.usagePrice;
    this.status = json.status;
    this.onlineDateTime = json.onlineDateTime;
    this.offlineDateTime = json.onlineDateTime;
    this.lastupdate = json.lastupdate;
    this.createDateTime = json.createDateTime;
    this.parent = json.parent;
    this.currOwner = json.currOwner;
    this.owner = json.owner;
    this.crossVersion = json.crossVersion;
    this.reportType = json.reportType;
    this.parentCode = json.parentCode;
    if (json.parentVersion != null && json.parentVersion.length > 0) {
        for (var i = 0; i < json.parentVersion.length; i++) {
            this.parentVersion.push(json.parentVersion[i]);
        }
    }
    if (json.queryCondition != null && json.queryCondition.length > 0) {
        for (var i = 0; i < json.queryCondition.length; i++) {
            var cond = new QueryCondition();
            cond.parsefromJSON(json.queryCondition[i]);
            this.queryCondition.push(cond);
        }
    }
    if (json.children != null && json.children.length > 0) {
        for (var i = 0; i < json.children.length; i++) {
            var obj = json.children[i];
            if (obj.classtypename == "ArrayDataVariable") {
                var variable = new ArrayDataVariable();
                variable.parseObject(obj);
                this.addChild(variable);
            } else if (obj.classtypename == "DataVariable") {
                var variable = new DataVariable();
                variable.parseObject(obj);
                this.addChild(variable);
            }
        }
    }
    if (json.reportDefinition != null && json.reportDefinition.length > 0) {
        for (var i = 0; i < json.reportDefinition.length; i++) {
            var obj = json.reportDefinition[i];
            var rf = new ReportField();
            rf.parsefromJSON(obj);
            this.addReportField(rf);
        }
    }
};