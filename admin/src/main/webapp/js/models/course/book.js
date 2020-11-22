function Book() {
    this.id = null;
    this.userId = null;
    this.bookPath = null;
    this.bookImage = null;
    this.ownerId = null;
    this.bookName = null;
    this.bookAuthor = null;
    this.descript = null;
    this.sellType = 0;
    this.goodPrise = 0.00;
    this.discountPrise = 0.00;
    this.createTime = -1;
};
Book.prototype.stringifyforJSON = function (b) {
    b.id = this.id;
    b.userId = this.userId;
    b.ownerId = this.ownerId;
    b.bookName = this.bookName;
    b.bookAuthor = this.bookAuthor;
    b.descript = this.descript;
    b.sellType = this.sellType;
    b.goodPrise = this.goodPrise;
    b.discountPrise = this.discountPrise;
    b.createTime = this.createTime;
    return b;
};
Book.prototype.parseFromJSON = function (json) {
    this.id = json.id;
    this.userId = json.userId;
    this.bookPath = json.bookPath;
    this.bookImage = json.bookImage;
    this.ownerId = json.ownerId;
    this.bookName = json.bookName;
    this.bookAuthor = json.bookAuthor;
    this.descript = json.descript;
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
Book.prototype.parseForDate = function (data) {
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
Book.prototype.addZero = function(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}