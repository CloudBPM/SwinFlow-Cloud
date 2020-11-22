function Video() {
    this.id = null;
    this.userId = null;
    this.ownerId = null;
    this.videoName = null;
    this.videoPath = null;
    this.imagePath = null
    this.patchPath = null;
    this.videoDesc = null;
    this.sellType = 0;
    this.goodPrise = 0.00
    this.discountPrise = 0.00;
    this.createTime = -1;
}

Video.prototype.stringifyforJSON = function (v) {
    v.id = this.id;
    v.userId = this.userId;
    v.ownerId = this.ownerId;
    v.videoName = this.videoName;
    v.videoPath = this.videoPath;
    v.imagePath = this.imagePath;
    v.patchPath = this.patchPath;
    v.videoDesc = this.videoDesc;
    v.sellType = this.sellType;
    v.goodPrise = this.goodPrise;
    v.discountPrise = this.discountPrise;
    v.createTime = this.createTime;
    return v;
};
Video.prototype.parseFromJSON = function (json) {
    this.id = json.id;
    this.userId = json.userId;
    this.ownerId = json.ownerId;
    this.videoName = json.videoName;
    this.videoPath = json.videoPath;
    this.imagePath = json.imagePath;
    this.patchPath = json.patchPath;
    this.videoDesc = json.videoDesc;
    if (json.sellType == 1) {
        this.sellType = "是"
    } else if (json.sellType == 0) {
        this.sellType = "否"
    }
    this.goodPrise = json.goodPrise + ".00";
    if (json.discountPrise <= 0.00) {
        this.discountPrise = json.goodPrise + ".00";
    } else if (json.discountPrise > 0.00 && json.discountPrise <= json.goodPrise) {
        this.discountPrise = json.discountPrise+".00";
    }
    ;
    var dateTime = this.parseForDate(json.createTime);
    this.createTime =dateTime;
}
Video.prototype.parseForDate = function (data) {
    var longTypeDate = parseFloat(data);
    var date = new Date(longTypeDate);
    oYear = date.getFullYear(),
        oMonth = date.getMonth()+1,
        oDay = date.getDate(),
        oHour = date.getHours(),
        oMin = date.getMinutes(),
        oSen = date.getSeconds()
    oTime = oYear +'-'+ this.addZero(oMonth) +'-'+ this.addZero(oDay) +' '+ this.addZero(oHour) +':'+
        this.addZero(oMin) +':'+this.addZero(oSen);
    return oTime;
};
//补零操作
Video.prototype.addZero = function(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}