function Live() {
    this.id= null;
    this.userId = null;
    this.ownerId = null;
    this.liveName = null;
    this.liveDesc = null;
    this.liveType = 0;
    this.liveDate = null;
    this.liveTime = -1;
    this.liveImage = null;
    this.liveInfo = null;
    this.sellType = 0;
    this.goodPrise = 0.00;
    this.discountPrise = 0.00;
    this.createTime = -1;
}
Live.prototype.stringifyforJSON = function (l) {
    l.id = this.id;
    l.userId = this.userId;
    l.ownerId = this.ownerId;
    l.liveName = this.liveName;
    l.liveDesc = this.liveDesc;
    l.liveType = this.liveType;
    l.liveDate = this.liveDate;
    l.liveTime = this.liveTime;
    l.liveImage = this.liveImage;
    l.liveInfo = this.liveInfo;
    l.sellType = this.sellType;
    l.goodPrise = this.goodPrise
    l.discountPrise = this.discountPrise;
    l.createTime = this.createTime;
    return l;
};

Live.prototype.parseFromJSON = function (json) {
    this.id = json.id;
    this.userId = json.userId;
    this.ownerId = json.ownerId;
    this.liveName = json.liveName;
    this.liveDesc = json.liveDesc;
    if(json.liveType==0){
        this.liveType = "语言图文直播";
    }else if (json.liveType==1){
        this.liveType = "视频录播+语言直播";
    }else if (json.liveType==2){
        this.liveType = "ppt直播";
    }
    var date = this.parseForDate(json.liveDate);
    this.liveDate =date;
    if(json.liveTime==1){
        this.liveTime ="一小时";
    }else if (json.liveTime==2){
        this.liveTime ="二小时";
    }else if (json.liveTime==3){
        this.liveTime ="三小时";
    }
    this.liveImage =json.liveImage;
    this.liveInfo = json.liveInfo;
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
};
Live.prototype.parseForDate = function (data) {
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
Live.prototype.addZero = function(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}