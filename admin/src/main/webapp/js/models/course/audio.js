function Audio() {
    this.id = null
    this.audioName = null;
    this.userId = null;
    this.ownerId = null;
    this.audioPath = null;
    this.audioImage = null;
    this.audioDesc = null;
    this.sellType = 0;
    this.goodPrise = 0.00;
    this.discountPrise = 0.00;
    this.createTime = -1;
}

Audio.prototype.stringifyforJSON = function (a) {
    a.id = this.id;
    a.audioName = this.audioName;
    a.userId = this.userId;
    a.ownerId = this.ownerId;
    a.audioPath = this.audioPath;
    a.audioImage = this.audioImage;
    a.audioDesc = this.audioDesc;
    a.sellType = this.sellType;
    a.goodPrise = this.goodPrise;
    a.discountPrise = this.discountPrise;
    a.createTime = this.createTime;
    return a;
};
Audio.prototype.parseFromJSON = function (json) {
    this.id = json.id;
    this.audioName = json.audioName;
    this.userId = json.userId;
    this.ownerId = json.ownerId;
    this.audioPath = json.audioPath;
    this.audioImage = json.audioImage;
    this.audioDesc = json.audioDesc;
    if (json.sellType == 1) {
        this.sellType = "是"
    } else if (json.sellType == 0) {
        this.sellType = "否"
    }
    this.goodPrise = json.goodPrise + ".00";
    if (json.discountPrise <= 0.00) {
        this.discountPrise = json.goodPrise + ".00";
    } else if (json.discountPrise > 0.00 && json.discountPrise <= json.goodPrise) {
        this.discountPrise = json.discountPrise + ".00";
    }
    ;
    var dateTime = this.parseForDate(json.createTime);
    this.createTime = dateTime;
}
Audio.prototype.parseForDate = function (data) {
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
Audio.prototype.addZero = function(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}