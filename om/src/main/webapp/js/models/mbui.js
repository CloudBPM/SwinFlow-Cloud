/**
 * This UI is used to be assigned to category object.
 *
 * @author Dahai Cao created at 13:50 on 2018-11-06
 */
function MobileUI() {
    this.id = null;
    this.name = "MbUI"; // full name
    this.createDateTime = null;
    this.parent = null; //
    this.lastupdate = null;
    // true:editing; false:previewing
    this.editing = true;
    this.children = [new MbBoard()]; //
    this.classtypename = "MobileUI";
    this.currOwner = null;
    this.owner = null;
    this.selectBoardIndex = 0;
};

MobileUI.prototype = new WorkflowEntity();

MobileUI.prototype.addChild = function (child) {
    this.children.push(child);
    this.selectBoardIndex = this.children.length - 1;
};



MobileUI.prototype.removeChild = function (child) {
    for (var j = 0; j < this.children.length; j++) {
        if (this.children[j] == child) {
            this.children.splice(j, 1);
            if (j > 0) {
                this.selectBoardIndex = j - 1;
            } else {
                this.selectBoardIndex = j;
            }
            break;
        }
    }
};

MobileUI.prototype.findCurrentBoard = function () {
    return this.children[this.selectBoardIndex];
};

MobileUI.prototype.findCovered = function (x, y) {
    var o = null;
    if (this.selectBoardIndex >= 0) {
        o = this.children[this.selectBoardIndex].findCovered(x, y);
        if (o != null) {
            return o;
        }
    }
    if (o == null) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].x10 <= x && this.children[i].x11 >= x &&
                this.children[i].y10 <= y && this.children[i].y11 >= y) {
                this.selectBoardIndex = i;
                return this.children[this.selectBoardIndex];
            }
        }
    }
    return this;
};

// delete one child and return the child's parent
MobileUI.prototype.findParent = function (o) {
    var p = null;
    if (this.children.length > 0) {
        for (var j = 0; j < this.children.length; j++) {
            if (this.children[j] == o) {
                p = this;
                break;
            }
        }
        if (p == null) {
            if (this.selectBoardIndex >= 0) {
                p = this.children[this.selectBoardIndex].findParent(o);
                if (p != null) {
                    return p;
                }
            }
        }
    }
    return p;
};

// delete one child and return the child's parent
MobileUI.prototype.removeObject = function (o) {
    var p = null;
    if (this.children.length > 0) {
        for (var j = 0; j < this.children.length; j++) {
            if (this.children[j] == o) {
                this.children.splice(j, 1);
                p = this;
                break;
            }
        }
        if (p == null) {
            if (this.selectBoardIndex >= 0) {
                p = this.children[this.selectBoardIndex].removeObject(o);
                if (p != null) {
                    return p;
                }
            }
        }
    }
    return p;
};

MobileUI.prototype.deselectAll = function () {
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].deselectAll();
    }
};

MobileUI.prototype.setSelected = function (selected) {
    this.selected = selected;
};

MobileUI.prototype.setPreview = function () {
    this.editing = false;
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].setPreview();
    }
};

MobileUI.prototype.parseFromJSON = function (json) {
    this.id = json.id;
    this.name = json.name; // full name
    this.createDateTime = json.createDateTime;
    this.parent = json.parent; //
    this.lastupdate = json.lastupdate;
    this.selectBoardIndex = json.selectBoardIndex;
    this.currOwner = json.currOwner;
    this.owner = json.owner;
    this.children = [];
    if (json.children != null && json.children.length > 0) {
        for (var i = 0; i < json.children.length; i++) {
            var obj = json.children[i];
            var bar = new MbBoard();
            bar.parseFromJSON(obj);
            this.addChild(bar);
        }
    }
};

MobileUI.prototype.stringifyforJSON = function () {
    var b = new MobileUI();
    b.id = this.id;
    b.name = this.name; // full name
    b.createDateTime = this.createDateTime;
    b.parent = this.parent; //
    b.lastupdate = this.lastupdate;
    b.selectBoardIndex = this.selectBoardIndex;
    b.currOwner = this.currOwner;
    b.owner = this.owner;
    b.children = [];
    if (this.children != null && this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            var obj = this.children[i];
            b.addChild(obj.stringifyforJSON());
        }
    }
    return b;
};

// A function for drawing the particle.
MobileUI.prototype.drawOnContext = function () {
    var mainmenuitemheight = 150;
    var bottompart = 70; // 画手机上半部分（含返回、home等按钮）
    var enabledfontcolor = 'blue';
    var disabledfontcolor = 'gray';
    var dashedlinecolor = 'rgb(154, 154, 154)';
    this.x0 = 10.5; // top left corner X
    this.y0 = 10.5; // top left corner Y
    this.x1 = 550.5; // bottom right corner X
    this.y1 = 1090.5; // bottom right corner X
    var x0 = this.x0;
    var y0 = this.y0;
    var x1 = this.x1; // bottom right corner X
    var y1 = this.y1; // bottom right corner X


    this.drawMobileUI(x0, y0, x1, y1);

    var tmp = this.context.fillStyle;
    var tmp1 = this.context.strokeStyle;
    // 画每个主菜单项。
    var itemwidth = 107;
    for (var i = 0; i < this.children.length; i++) {
        var x10 = x0 + itemwidth * i + 4;
        var x11 = x0 + itemwidth * (i + 1);
        var y10 = y1 - mainmenuitemheight + 4;
        var y11 = y1 - bottompart - 4;
        this.children[i].x10 = x10;
        this.children[i].y10 = y10;
        this.children[i].x11 = x11;
        this.children[i].y11 = y11;

        if (this.editing) {
            Utils.drawingDashedLine(this.context, dashedlinecolor, x10, y10,
                x11, y10);
            Utils.drawingDashedLine(this.context, dashedlinecolor, x10, y11,
                x11, y11);
            Utils.drawingDashedLine(this.context, dashedlinecolor, x10, y10,
                x10, y11);
            Utils.drawingDashedLine(this.context, dashedlinecolor, x11, y10,
                x11, y11);
        }
        if (i == this.selectBoardIndex) {
            ft = this.context.font;
            this.context.fillStyle = enabledfontcolor;
            this.context.font = '36px FontAwesome';
            this.context.fillText(this.children[i].boardIcon, x10 + 36, y10 + 40);
            this.context.font = '18px Arial Black';
            this.context.fillText(this.children[i].name, x10 + 35, y10 + 60);
            this.context.font = ft;
        } else {
            ft = this.context.font;
            this.context.fillStyle = disabledfontcolor;
            this.context.font = '36px FontAwesome';
            this.context.fillText(this.children[i].boardIcon, x10 + 36, y10 + 40);
            this.context.font = '18px Arial Black';
            this.context.fillText(this.children[i].name, x10 + 35, y10 + 60);
            this.context.font = ft;
        }
    }
    this.context.fillStyle = tmp;
    this.context.strokeStyle = tmp1;

    for (var i = 0; i < this.children.length; i++) {
        if (i == this.selectBoardIndex) {
            this.children[i].x0 = x0;
            // 50 is mobile top part height
            this.children[i].y0 = y0 + 50;
            this.children[i].x1 = x1;
            // 150 is main menu item height + mobile bottom part height
            this.children[i].y1 = y1 - 150;
            this.children[i].context = this.context;
            this.children[i].drawOnContext();
        }
    }
};

MobileUI.prototype.drawMobileUI = function (x0, y0, x1, y1) {

    // 开启阴影设置
    this.context.save();
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    this.context.shadowBlur = 8;
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    var cornerRadius = 20;
    var toppart = 50; // 画手机上半部分（含摄像头的）
    var bottompart = 70; // 画手机上半部分（含返回、home等按钮）
    var halfbuttonheight = 13;
    var buttoncolor = 'rgb(100, 100, 100)';
    var fillcolor = 'rgb(230, 230, 230)';
    var fillbackcolor = 'rgb(255, 255, 255)';
    var bordercolor = 'rgb(154, 154, 154)';
    var shapebordercolor = 'rgb(0, 0, 0)';
    var cameracolor = 'black';
    var mainmenuitemheight = 150;

    var tmp = this.context.fillStyle;
    var tmp1 = this.context.strokeStyle;
    var lw = this.context.lineWidth;
    var ft = this.context.font;

    // 画手机形状
    this.context.beginPath();
    this.context.moveTo(x0 + cornerRadius, y0);
    this.context.lineTo(x1 - cornerRadius, y0);
    this.context.arcTo(x1, y0, x1, y0 + cornerRadius, cornerRadius);
    this.context.lineTo(x1, y1 - cornerRadius);
    this.context.arcTo(x1, y1, x1 - cornerRadius, y1, cornerRadius);
    this.context.lineTo(x0 + cornerRadius, y1);
    this.context.arcTo(x0, y1, x0, y1 - cornerRadius, cornerRadius);
    this.context.lineTo(x0, y0 + cornerRadius);
    this.context.arcTo(x0, y0, x0 + cornerRadius, y0, cornerRadius);
    this.context.closePath();
    this.context.strokeStyle = shapebordercolor;
    this.context.stroke();
    this.context.fillStyle = fillbackcolor;
    this.context.fill();

    // 画中间框
    this.context.beginPath();
    this.context.moveTo(x0 + 1, y0 + toppart);
    this.context.lineTo(x1 - 1, y0 + toppart);
    this.context.lineTo(x1 - 1, y1 - bottompart);
    this.context.lineTo(x0 + 1, y1 - bottompart);
    this.context.lineTo(x0 + 1, y0 + toppart);
    this.context.closePath();
    this.context.strokeStyle = shapebordercolor;
    this.context.stroke();
    this.context.fillStyle = fillbackcolor;
    this.context.fill();


    // 画手机上半部分（含摄像头的）
    this.context.beginPath();
    this.context.moveTo(x0 + cornerRadius, y0);
    this.context.lineTo(x1 - cornerRadius, y0);
    this.context.arcTo(x1, y0, x1, y0 + cornerRadius, cornerRadius);
    this.context.lineTo(x1, y0 + toppart);
    this.context.lineTo(x0, y0 + toppart);
    this.context.lineTo(x0, y0 + cornerRadius);
    this.context.arcTo(x0, y0, x0 + cornerRadius, y0, cornerRadius);
    this.context.closePath();
    this.context.strokeStyle = shapebordercolor;
    this.context.stroke();
    this.context.fillStyle = fillcolor;
    this.context.fill();

    // 摄像头
    this.context.beginPath();
    this.context.arc(Math.round((x0 + x1) / 2) + 0.5, (y0 + toppart / 2), 7, 0,
        Math.PI * 2, true);
    this.context.closePath();
    this.context.fillStyle = cameracolor;
    this.context.fill();
    this.context.strokeStyle = bordercolor;
    this.context.stroke();

    // 距离感应器
    this.context.beginPath();
    this.context.arc(Math.round((x0 + x1) / 2) + 30 + 0.5, (y0 + toppart / 2), 4, 0,
        Math.PI * 2, true);
    this.context.closePath();
    this.context.fillStyle = cameracolor;
    this.context.fill();
    this.context.strokeStyle = bordercolor;
    this.context.stroke();

    // 画手机的下半部分（包含home按钮）
    this.context.beginPath();
    this.context.moveTo(x0, y1 - bottompart);
    this.context.lineTo(x1, y1 - bottompart);
    this.context.lineTo(x1, y1 - cornerRadius);
    this.context.arcTo(x1, y1, x1 - cornerRadius, y1, cornerRadius);
    this.context.lineTo(x0 + cornerRadius, y1);
    this.context.arcTo(x0, y1, x0, y1 - cornerRadius, cornerRadius);
    this.context.lineTo(x0, y1 - bottompart);
    this.context.closePath();
    this.context.strokeStyle = shapebordercolor;
    this.context.stroke();
    this.context.fillStyle = fillcolor;
    this.context.fill();

    // HOME按钮
    this.context.beginPath();
    this.context.arc(Math.round((x0 + x1) / 2) + 0.5, (y1 - bottompart / 2), halfbuttonheight, 0,
        Math.PI * 2, true);
    this.context.closePath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = buttoncolor;
    this.context.stroke();

    // RETURN
    this.context.beginPath();
    this.context.moveTo((x0 + x1) / 2 - 100 + 0.5, (y1 - bottompart / 2));
    this.context.lineTo((x0 + x1) / 2 - 75 + 0.5, (y1 - bottompart / 2) - halfbuttonheight);
    this.context.lineTo((x0 + x1) / 2 - 75 + 0.5, (y1 - bottompart / 2) + halfbuttonheight);
    this.context.lineTo((x0 + x1) / 2 - 100 + 0.5, (y1 - bottompart / 2));
    this.context.closePath();
    this.context.strokeStyle = buttoncolor;
    this.context.stroke();

    // CLOSE
    this.context.beginPath();
    this.context.moveTo((x0 + x1) / 2 + 74 + 0.5, (y1 - bottompart / 2 - halfbuttonheight));
    this.context.lineTo((x0 + x1) / 2 + 100 + 0.5, (y1 - bottompart / 2 - halfbuttonheight));
    this.context.lineTo((x0 + x1) / 2 + 100 + 0.5, (y1 - bottompart / 2 + halfbuttonheight));
    this.context.lineTo((x0 + x1) / 2 + 74 + 0.5, (y1 - bottompart / 2 + halfbuttonheight));
    this.context.lineTo((x0 + x1) / 2 + 74 + 0.5, (y1 - bottompart / 2 - halfbuttonheight));
    this.context.closePath();
    this.context.strokeStyle = buttoncolor;
    this.context.stroke();
    this.context.lineWidth = lw;

    // 画下面的主菜单栏
    this.context.beginPath();
    this.context.moveTo(x0 + 1, y1 - mainmenuitemheight);
    this.context.lineTo(x1 - 1, y1 - mainmenuitemheight);
    this.context.closePath();
    this.context.strokeStyle = buttoncolor;
    this.context.stroke();


    // 恢复到无阴影设置
    this.context.restore();

    // 画中间框
    this.context.beginPath();
    this.context.moveTo(x0, y0 + toppart);
    this.context.lineTo(x1, y0 + toppart);
    this.context.lineTo(x1, y1 - bottompart);
    this.context.lineTo(x0, y1 - bottompart);
    this.context.lineTo(x0, y0 + toppart);
    this.context.closePath();
    this.context.strokeStyle = shapebordercolor;
    this.context.stroke();
    this.context.fillStyle = fillbackcolor;
    this.context.fill();

    // resume old color
    this.context.fillStyle = tmp;
    this.context.strokeStyle = tmp1;
};