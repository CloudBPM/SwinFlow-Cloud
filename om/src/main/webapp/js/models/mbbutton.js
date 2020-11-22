/**
 * 
 */

function MbButton() {
	this.id = null;
	this.name = "按钮"; // full name
	// true:editing; false:previewing
    this.editing = true;
	this.x0 = 0.5; // top left corner X
	this.y0 = 0.5; // top left corner Y
	this.x1 = 0.5; // bottom right corner X
	this.y1 = 0.5; // bottom right corner X
	this.selected = false; // is selected on canvas
	this.marks = []; // eight corner marks
	this.children = []; // 
	this.context = null;
	this.width = 50;
	this.height = 50;
	this.classtypename = "MbButton";
	this.fontfamilty = "Arial Black";
    this.fontsize = 16;
	this.fontWeight = "normal"; // italic; normal; bold
	this.frontgroundColor = null; // #000000
	this.backgroundColor = null; // #ffffff
	this.frontgroundIcon = null; // URL
	this.backgroundImage = null; // URL
    this.clickMe = 0;
    this.clickMeOption = 0;
    this.clickMeUrl = null;
    this.longPressMe = 0;
    this.longPressMeOption = 0;
    this.longPressMeUrl = null;
	this.createDateTime = null;
	this.lastupdate = null;
	this.parent = null; //
	this.owner = null;
	this.currOwner = null;
	this.alias = null;
};

MbButton.prototype = new WorkflowEntity();

MbButton.prototype.addChild = function(board) {
	this.children.push(board);
};

MbButton.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name; // full name
	this.createDateTime = json.createDateTime;
	this.parent = json.parent; // 
	this.lastupdate = json.lastupdate;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	this.width = json.width;
	this.height = json.height;
    this.fontsize = json.fontsize;
    this.fontfamilty = json.fontfamilty;
    this.clickMe = json.clickMe;
    this.clickMeOption = json.clickMeOption;
    this.clickMeUrl = json.clickMeUrl;
    this.longPressMe = json.longPressMe;
    this.longPressMeOption = json.longPressMeOption;
    this.longPressMeUrl = json.longPressMeUrl;
	// 0: italic; 1: normal; 2: bold
	this.fontWeight = json.fontWeight;
	this.frontgroundColor = json.frontgroundColor; // #000000
	this.backgroundColor = json.backgroundColor; // #ffffff
	this.frontgroundIcon = json.frontgroundIcon; // URL
	this.backgroundImage = json.backgroundImage; // URL
	this.alias = json.alias; //
};

MbButton.prototype.stringifyforJSON = function() {
	var b = new MbButton();
	b.id = this.id;
	b.name = this.name; // full name
	b.createDateTime = this.createDateTime;
	b.parent = this.parent; // 
	b.lastupdate = this.lastupdate;
	b.x0 = this.x0; // top left corner X
	b.y0 = this.y0; // top left corner Y
	b.x1 = this.x1; // bottom right corner X
	b.y1 = this.y1; // bottom right corner X
	b.width = this.width;
	b.height = this.height;
    b.fontsize = this.fontsize;
    b.fontfamilty = this.fontfamilty;
    b.clickMe = this.clickMe;
    b.clickMeOption = this.clickMeOption;
    b.clickMeUrl = this.clickMeUrl;
    b.longPressMe = this.longPressMe;
    b.longPressMeOption = this.longPressMeOption;
    b.longPressMeUrl = this.longPressMeUrl;
	b.fontWeight = this.fontWeight;
	b.frontgroundColor = this.frontgroundColor; // #000000
	b.backgroundColor = this.backgroundColor; // #ffffff
	b.frontgroundIcon = this.frontgroundIcon; // URL
	b.backgroundImage = this.backgroundImage; // URL
	b.alias = this.alias; //
	return b;
};

MbButton.prototype.findCovered = function(x, y) {
    if (this.x0 <= x && this.x1 >= x &&
        this.y0 <= y && this.y1 >= y) {
        return this;
    }
    return null;
};

MbButton.prototype.deselectAll = function() {
    this.selected = false;
};

MbButton.prototype.setSelected = function(selected) {
    this.selected = selected;
};

MbButton.prototype.setPreview = function() {
    this.editing = false;
};

MbButton.prototype.drawOnContext = function() {
	var activecolor = 'rgba(222, 253, 215, 1)';
	var buttoncolor = 'rgba(222, 222, 222, 1)';
	if (this.backgroundColor != null) {
		buttoncolor = this.backgroundColor;
	}
	var that = this;
	if (this.editing) {
		var x0 = this.x0;
		var y0 = this.y0;
		var x1 = this.x1;
		var y1 = this.y1;
		this.y1 = y1;
		this.width = x1 - x0;
		this.heigth = y1 - y0;
		// if (this.backgroundImage != null && this.backgroundImage != "") {
		// 	var img = new Image();
		// 	img.src = this.backgroundImage;
		// 	console.log(this.backgroundImage);
		// 	img.onload = function () {
		// 		that.context.drawImage(img, x0, y0, that.width, that.heigth);
		// 	};
		// 	img = null;
		// }
		var tmp = this.context.fillStyle;
		var tmp1 = this.context.strokeStyle;
		this.marks = [];
		if (this.selected) {
			var f = this.context.fillStyle;
			this.context.fillStyle = activecolor;
			this.context.fillRect(x0, y0, this.width, this.height);
			this.context.fillStyle = f;
			this.marks = Utils.createMarks(x0, y0, x1, y1);
			Utils.drawSelection(this.marks, this.context);
		} else {
			this.context.strokeStyle = buttoncolor;
			this.context.strokeRect(x0, y0, this.width, this.height);
			var f = this.context.fillStyle;
			this.context.fillStyle = buttoncolor;
			this.context.fillRect(x0, y0, this.width, this.height);
			this.context.fillStyle = f;
		}
		this.context.fillStyle = tmp;
		this.context.strokeStyle = tmp1; // resume old color

        var fontcolor = 'rgb(0, 0, 0)';
        var ft = this.context.font;
        this.context.fillStyle = fontcolor;
        this.context.font = this.fontsize + "px " + this.fontfamilty;
        var w = 0;
        if (this.name != "") {
            w = this.context.measureText(this.name).width;
        }
        var yy = Math.round((y0 + y1) / 2) + 40 + 0.5;
        var xx = Math.round((x0 + x1) / 2 - w / 2) + 0.5;
        this.context.fillText(this.name, xx, yy);
		this.context.font = ft;
		this.context.fillStyle = f1;
		//http://www.w3school.com.cn/i/eg_tulip.jpg
		var xi = Math.round((x0 + x1) / 2 - 32) + 0.5;
		var yi = Math.round((y0 + y1) / 2 - 50) + 0.5;
		if (this.frontgroundIcon != null && this.frontgroundIcon != "") {
			var img = new Image();
			img.src = this.frontgroundIcon;
			img.onload=function(){
				that.context.drawImage(img, xi, yi, 64, 64);
			};
		} else {
			var img = new Image();
			img.src = "/om/img/default_button_icon.png";
			img.onload=function(){
				that.context.drawImage(img, xi, yi, 64, 64);
			};
		}


	} else {
		var dashedlinecolor = 'rgb(154, 154, 154)';
		var activecolor = 'rgba(222, 253, 215, 0.2)';
		var x0 = this.x0;
		var y0 = this.y0;
		var x1 = this.x1;
		var y1 = this.y1;
		this.width = x1 - x0;
		this.heigth = y1 - y0;
		// if (this.backgroundImage != null && this.backgroundImage != "") {
		// 	console.log(this.backgroundImage);
		// 	var img = new Image();
		// 	img.src = this.backgroundImage;
		// 	img.onload = function () {
		// 		that.context.drawImage(img, x0, y0, that.width, that.heigth);
		// 	};
		// }
		this.y1 = y1;
		this.marks = [];

        var f = this.context.fillStyle;
        if (this.selected) {
            this.context.fillStyle = activecolor;
        } else {
            this.context.fillStyle = buttoncolor;
        }
        this.context.fillRect(x0, y0, this.width, this.height);
        this.context.fillStyle = f;

        var fontcolor = 'rgb(0, 0, 0)';
        var ft = this.context.font;
        var f1 = this.context.fillStyle;
        this.context.fillStyle = fontcolor;
        this.context.font = this.fontsize + "px " + this.fontfamilty;
        var w = 0;
        if (this.name != "") {
        	w = this.context.measureText(this.name).width;
        }
        var yy = Math.round((y0 + y1) / 2) + 3 + 0.5;
        var xx = Math.round((x0 + x1)/2 - w/2) + 0.5;
        this.context.fillText(this.name, xx, yy);
        this.context.font = ft;
        this.context.fillStyle = f1;

		var yy = Math.round((y0 + y1) / 2) + 40 + 0.5;
		var xx = Math.round((x0 + x1) / 2 - w / 2) + 0.5;
		this.context.fillText(this.name, xx, yy);
		this.context.font = ft;
		this.context.fillStyle = f1;
		//http://www.w3school.com.cn/i/eg_tulip.jpg
		var xi = Math.round((x0 + x1) / 2 - 32) + 0.5;
		var yi = Math.round((y0 + y1) / 2 - 50) + 0.5;
		if (this.frontgroundIcon != null && this.frontgroundIcon != "") {
			var img = new Image();
			img.src = this.frontgroundIcon;
			img.onload=function(){
				that.context.drawImage(img, xi, yi, 64, 64);
			};
		} else {
			var img = new Image();
			img.src = "/om/img/default_button_icon.png";
			img.onload=function(){
				that.context.drawImage(img, xi, yi, 64, 64);
			};

		}
	}

};

MbButton.prototype.isInMark = function(x, y) {
	if (this.marks != null && this.marks.length > 0) {
		for (var i = 0; i < this.marks.length; i++) {
			if (this.marks[i].x0 - 4 <= x
					&& x <= this.marks[i].x0 + this.marks[i].width + 4
					&& this.marks[i].y0 - 4 <= y
					&& y <= this.marks[i].y0 + this.marks[i].height + 4) {
				return this.marks[i].name;
			}
		}
	}
	return "default";
};