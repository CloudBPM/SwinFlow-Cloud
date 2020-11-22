/**
 *
 */

function FileConstant() {
    this.id = "";// file object id
    this.name = "空文件对象"; // file name, abc.doc, bc.pdf;
    this.suffix = ""; // suffix name or extension name .pdf, .txt
    this.size = -1; // long integer
    this.lastupdate = ""; // 2017-10-02 16:01:10
    this.value = "";
    this.datatype = "File";
    this.filetype = "application/octet-stream";
    this.currOwner = "";
    this.owner = "";
    this.isDirctory = 0;
    this.fileCount = 0;
    this.path = null;
};

FileConstant.prototype = new Constant();

FileConstant.prototype.clone = function (owner) {
    var d = new FileConstant();
    d.id = this.id;
    d.name = this.name;
    d.suffix = this.suffix;
    d.size = this.size;
    d.lastupdate = this.lastupdate;
    d.filetype = this.filetype;
    d.currOwner = this.currOwner;
    d.owner = this.owner;
    d.isDirctory = this.isDirctory;
    d.fileCount = this.fileCount;
    d.path = this.path;
    return d;
};

FileConstant.prototype.toExpressionString = function () {
    return "C@" + this.datatype + "@" + this.id + "|" + this.name + "|"
        + this.suffix + "|" + this.size + "|" + this.lastupdate + "|"
        + this.filetype + "|" + this.currOwner + "|"
        + this.owner + "|" + this.isDirctory + "|" + this.fileCount + "|" + this.path;
};

FileConstant.prototype.parseObject = function (o) {
    if (o != null && o != "") {
        this.datatype = o.datatype;
        this.id = o.id;
        this.name = o.name;
        this.suffix = o.suffix;
        this.size = o.size;
        this.lastupdate = o.lastupdate;
        this.filetype = o.filetype;
        this.value = o.value;
        this.currOwner = o.currOwner;
        this.owner = o.owner;
        this.isDirctory = o.isDirctory;
        this.fileCount = o.fileCount;
        this.path = o.path;
    }
};

FileConstant.prototype.parseString = function (str) {
    if (str != null && str != "") {
        var ary = str.split("@");
        this.datatype = ary[1];
        var ary1 = ary[2].split("|");
        if (ary1.length > 0)
            this.id = ary1[0];
        if (ary1.length > 1)
            this.name = ary1[1];
        if (ary1.length > 2)
            this.suffix = ary1[2];
        if (ary1.length > 3)
            this.size = ary1[3];
        if (ary1.length > 4)
            this.lastupdate = ary1[4];
        if (ary1.length > 5)
            this.filetype = ary1[5];
        if (ary1.length > 6)
            this.currOwner = ary1[6];
        if (ary1.length > 7)
            this.owner = ary1[7];
        if (ary1.length > 8)
            this.isDirctory = ary1[8];
        if (ary1.length > 9)
            this.fileCount = ary1[9];
        if (ary1.length > 10)
            this.path = ary1[9];
    }
};



// 5 Canvas 如何自适应屏幕大小
// http://lvxineye.iteye.com/blog/1671080
FileConstant.prototype.toString = function () {
    return this.name;
};