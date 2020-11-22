function ReportPage() {
    this.id = null;
    this.pageNo = 1;
    this.pageSize = 30;
    this.allEntitiesCount = 0;
    this.allPagesCount = 0;
    this.pageIndex = 0;
    this.pageEntities = [];
    this.titles = [];
    this.classtypename = "ReportPage";
};

ReportPage.prototype = new Page();

ReportPage.prototype.parseFromJSON = function(json) {
    this.id = json.id;
    this.pageNo = json.pageNo;
    this.pageSize = json.pageSize;
    this.allEntitiesCount = json.allEntitiesCount;
    this.allPagesCount = json.allPagesCount;
    this.pageIndex = json.pageIndex;
    if (json.titles.length > 0) {
        for (var i = 0; i < json.titles.length; i++) {
            var f = new ReportField();
            f.parsefromJSON(json.titles[i])
            this.titles.push(f);
        }
    }
    if (json.pageEntities.length > 0) {
        for (var i = 0; i < json.pageEntities.length; i++) {
            var row = new ReportDataRow();
            row.parsefromJSON(json.pageEntities[i]);
            this.pageEntities.push(row);
        }
    }
}