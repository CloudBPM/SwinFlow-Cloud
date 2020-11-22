/**
 * This mobile board can be treated as activity in Android system,
 * it has two types: the one is mobile home board,
 * the other is mobile secondary board.
 *
 * @Author Dahai Cao at 15:36 on 2018-12-06
 */
function MbBoard() {
	this.id = null;
	this.index = -1;
	this.name = "板块"; // full name
	this.createDateTime = null;
	this.parent = null; // 
	this.lastupdate = null;
	// true:editing; false:previewing
	this.editing = true;
	// 0: home board; 1: secondary board;
	this.type = 0;
	// board border range area
	this.x0 = 10.5; // top left corner X of board content
	this.y0 = 10.5; // top left corner Y of board content
	this.x1 = 550.5; // bottom right corner X of board content
	this.y1 = 1090.5; // bottom right corner Y of board content
	// main menu item border area range
	this.x10 = 0.5; // main menu item of board content
	this.y10 = 0.5; // main menu item of board content
	this.x11 = 0.5; // main menu item of board content
	this.y11 = 0.5; // main menu item of board content

	this.selected = false; // is selected on canvas
	this.marks = []; // eight corner marks
	this.children = []; // 
	this.context = null;
	this.classtypename = "MbBoard";
	this.boardIcon = "\uf015";
};

MbBoard.prototype = new WorkflowEntity();

MbBoard.prototype.addChild = function(child) {
	this.children.push(child);
};

MbBoard.prototype.removeContentPanel = function() {
	// 替换一个panel
	var o = null;
	for (var j = 0; j < this.children.length; j++) {
		if (this.children[j] instanceof MbContentPanel) {
			o = this.children[j];
			this.children.splice(j, 1);
			break;
		}
	}
	return o;
};

MbBoard.prototype.removeChild = function(child) {
	for (var j = 0; j < this.children.length; j++) {
		if (this.children[j] == child) {
			this.children.splice(j, 1);
			break;
		}
	}
};

MbBoard.prototype.hasMenubar = function() {
	for (var j = 0; j < this.children.length; j++) {
		if (this.children[j] instanceof MbTopBar) {
			return true;
		}
	}
	return false;
};

MbBoard.prototype.findParent = function(o) {
    var p = null;
    if (this.children.length > 0) {
        for (var j = 0; j < this.children.length; j++) {
            if (this.children[j] == o) {
                p = this;
                break;
            }
        }
        if (p == null) {
            for (var j = 0; j < this.children.length; j++) {
                p = this.children[j].findParent(o);
                if (p != null) {
                    return p;
                }
            }
        }
    }
    return p;
};

//delete one child and return the child's parent
MbBoard.prototype.removeObject = function(o) {
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
			for (var j = 0; j < this.children.length; j++) {
				p = this.children[j].removeObject(o);
				if (p != null) {
					return p;
				}
			}
		}
	}
	return p;
};

MbBoard.prototype.findCovered = function(x, y) {
	var o;
	for (var i = 0; i < this.children.length; i++) {
		o = this.children[i].findCovered(x, y);
		if (o != null) {
			return o;
		}
	}
	if (o == null) {
		if (this.x0 <= x && this.x1 >= x && this.y0 <= y && this.y1 >= y) {
			return this;
		}
	}
	return null;
};

MbBoard.prototype.deselectAll = function() {
	this.selected = false;
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].deselectAll();
	}
};

MbBoard.prototype.setSelected = function(selected) {
	this.selected = selected;
};

MbBoard.prototype.setPreview = function() {
	this.editing = false;
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].setPreview();
	}
};

MbBoard.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name; // full name
	this.index = json.index;
	this.createDateTime = json.createDateTime;
	this.parent = json.parent; // 
	this.lastupdate = json.lastupdate;
	this.boardIcon = json.boardIcon;
	this.type = json.type;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	this.x10 = json.x10; // main menu item of board content
	this.y10 = json.y10; // main menu item of board content
	this.x11 = json.x11; // main menu item of board content
	this.y11 = json.y11; // main menu item of board content
	this.width = json.width;
	this.height = json.height;
	if (json.children != null && json.children.length > 0) {
		for (var i = 0; i < json.children.length; i++) {
			var obj = json.children[i];
			if (obj.classtypename == "MbSearchBar") {
				var bar = new MbSearchBar();
				bar.parseFromJSON(obj);
				this.addChild(bar);
			} else if (obj.classtypename == "MbTopBar") {
				var bar = new MbTopBar();
				bar.parseFromJSON(obj);
				this.addChild(bar);
			} else if (obj.classtypename == "MbContentPanel") {
				var bar = new MbContentPanel();
				bar.parseFromJSON(obj);
				this.addChild(bar);
			}
		}
	}
};

MbBoard.prototype.stringifyforJSON = function() {
	var b = new MbBoard();
	b.id = this.id;
	b.name = this.name; // full name
	b.createDateTime = this.createDateTime;
	b.parent = this.parent; // 
	b.lastupdate = this.lastupdate;
	b.boardIcon = this.boardIcon;
	b.type = this.type;
	b.x0 = this.x0; // top left corner X
	b.y0 = this.y0; // top left corner Y
	b.x1 = this.x1; // bottom right corner X
	b.y1 = this.y1; // bottom right corner X
	b.x10 = this.x10; // main menu item of board content
	b.y10 = this.y10; // main menu item of board content
	b.x11 = this.x11; // main menu item of board content
	b.y11 = this.y11; // main menu item of board content
	b.width = this.width;
	b.height = this.height;
	if (this.children != null && this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			var obj = this.children[i];
			if (obj.classtypename == "MbSearchBar") {
				b.addChild(obj.stringifyforJSON());
			} else if (obj.classtypename == "MbTopBar") {
				b.addChild(obj.stringifyforJSON());
			} else if (obj.classtypename == "MbContentPanel") {
				var f1 = false;
				for (var k = 0; k < this.children.length; k++) {
					var obj1 = this.children[k];
					if (obj1.classtypename == "MbTopBar") {
					    f1 = true;
						var f = obj1.isChildContentPanel(obj);
						if (!f) {
							b.addChild(obj.stringifyforJSON());
							break;
						}
					}
				}
				if (!f1) {
					b.addChild(obj.stringifyforJSON());
				}
			}
		}
	}
	return b;
};

// A function for drawing the particle.
MbBoard.prototype.drawOnContext = function() {
	var halfbuttonheight = 13;
	var fontcolor = 'blue';
	var buttoncolor = 'rgb(200, 200, 200)';
	var fillcolor = 'rgb(230, 230, 230)';
	var bordercolor = 'rgb(154, 154, 154)';
	var dashedlinecolor = 'rgb(154, 154, 154)';
	var cameracolor = 'black';

	if (this.editing) {
		this.marks = [];
		if (this.selected) {
			this.marks = Utils.createMarks(this.x0, this.y0, this.x1, this.y1);
			Utils.drawSelection(this.marks, this.context);
		}
	}
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].context = this.context;
		// 计算孩子的起始位置。
		this.children[i].x0 = this.x0;
		this.children[i].x1 = this.x1;
		if (i == 0) {
			this.children[i].y0 = this.y0;
		} else if (i > 0) {
			this.children[i].y0 = this.children[i - 1].y1;
		}
		if (i == this.children.length - 1
				&& this.children[i] instanceof MbContentPanel) {
			this.children[i].y1 = this.y1;
		}
		this.children[i].drawOnContext();
	}

};

MbBoard.prototype.getTopBar = function() {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i] instanceof MbTopBar)
			return this.children[i];
	}
	return null;
};

MbBoard.prototype.isInMark = function(x, y) {
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