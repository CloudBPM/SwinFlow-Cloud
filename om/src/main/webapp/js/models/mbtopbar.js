/**
 * 
 */
function MbTopBar() {
	this.id = null;
	this.name = "MbTopBar"; // full name
	this.createDateTime = null;
	this.parent = null; // 
	this.lastupdate = null;
	// true:editing; false:previewing
	this.editing = true;
	this.x0 = 0.5; // top left corner X
	this.y0 = 0.5; // top left corner Y
	this.x1 = 0.5; // bottom right corner X
	this.y1 = 0.5; // bottom right corner X
    this.width = 0;
    this.height = 0;
	this.selected = false; // is selected on canvas
	this.marks = []; // eight corner marks
	this.children = []; // 
	this.context = null;
	this.classtypename = "MbTopBar";
	this.selectedIndex = 0;
};

MbTopBar.prototype = new WorkflowEntity();

MbTopBar.prototype.addChild = function(child) {
	this.children.push(child);
	this.selectedIndex = this.children.length - 1;
	child.name = "菜单项" + this.selectedIndex;
};

MbTopBar.prototype.isChildContentPanel = function(o) {
	for (var j = 0; j < this.children.length; j++) {
		if (this.children[j].children == o ||
			this.children[j].children.id == o.id) {
			return true;
		}
	}
	return false;
};

MbTopBar.prototype.insertChild = function(pos, child) {
	this.children.splice(pos, 0, child);
	this.selectedIndex = pos;
};

MbTopBar.prototype.removeChild = function(child) {
	for (var j = 0; j < this.children.length; j++) {
		if (this.children[j] == child) {
			this.children.splice(j, 1);
			if (j > 0) {
				this.selectedIndex = j - 1;
			} else {
				this.selectedIndex = j;
			}
			break;
		}
	}
};

MbTopBar.prototype.findPosition = function(x, y) {
	var j = -1;
	for (j = 0; j < this.children.length; j++) {
		var x00 = (this.children[j].x0 + this.children[j].x1) / 2;
		if (j == 0) {
			if (x <= x00) {
				return 0;
			}
		} else if (j == this.children.length - 1) {
			if (x > x00) {
				return j;
			}
		} else {
			var x01 = (this.children[j + 1].x0 + this.children[j + 1].x1) / 2;
			if (x <= x00) {
				return j;
			} else if (x > x00 && x <= x01) {
				return j + 1;
			}
		}

	}
	return j;
};

MbTopBar.prototype.findParent = function(o) {
    var p = null;
    if (this.children.length > 0) {
        for (var j = 0; j < this.children.length; j++) {
            if (this.children[j] == o) {
                p = this;
                break;
            }
        }
    }
    return p;
};

MbTopBar.prototype.moveLeft = function(o) {
    if (this.children.length > 0) {
        for (var j = 0; j < this.children.length; j++) {
            if (this.children[j] == o) {
                var t = this.children[j - 1];
                this.children[j - 1] = o;
                this.children[j] = t;
                break;
            }
        }
    }
};

MbTopBar.prototype.moveRight = function(o) {
    if (this.children.length > 0) {
        for (var j = 0; j < this.children.length; j++) {
            if (this.children[j] == o) {
                var t = this.children[j + 1];
                this.children[j + 1] = o;
                this.children[j] = t;
                break;
            }
        }
    }
};

MbTopBar.prototype.getPosition = function(o) {
    if (this.children.length > 0) {
        for (var j = 0; j < this.children.length; j++) {
            if (this.children[j] == o) {
                return j;
            }
        }
    }
    return -1;
};

// delete one child and return the child's parent
MbTopBar.prototype.removeObject = function(o) {
	var p = null;
	if (this.children.length > 0) {
		for (var j = 0; j < this.children.length; j++) {
			if (this.children[j] == o) {
				this.children.splice(j, 1);
				p = this;
				if (j > 0) {
					this.selectedIndex = j - 1;
				} else {
					this.selectedIndex = j;
				}
				break;
			}
		}
	}
	return p;
};

MbTopBar.prototype.findCovered = function(x, y) {
	var o = null;
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

MbTopBar.prototype.deselectAll = function() {
	this.selected = false;
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].deselectAll();
	}
};

MbTopBar.prototype.setSelected = function(selected) {
	this.selected = selected;
};

MbTopBar.prototype.getSelectedItem = function() {
	return this.children[this.selectedIndex];
};

MbTopBar.prototype.getFirstItem = function() {
	if (this.children.length > 0) {
		return this.children[0];
	}
	return null;
};

MbTopBar.prototype.setPreview = function() {
	this.editing = false;
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].setPreview();
	}
};

MbTopBar.prototype.parseFromJSON = function(json) {
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
	if (json.children != null && json.children.length > 0) {
		for (var i = 0; i < json.children.length; i++) {
			var item = new MbTopBarItem();
			item.parseFromJSON(json.children[i]);
			this.addChild(item);
		}
	}
};

MbTopBar.prototype.stringifyforJSON = function() {
	var b = new MbTopBar();
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
	if (this.children != null && this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			b.addChild(this.children[i].stringifyforJSON());
		}
	}
	return b;
};

// A function for drawing the particle.
MbTopBar.prototype.drawOnContext = function() {
	if (this.editing) {
		var height = 64;
		var dashedlinecolor = 'rgb(154, 154, 154)';
		var x0 = this.x0 + 4; // 4 is margin
		var y0 = this.y0 + 4; // 4 is margin
		var x1 = this.x1 - 4; // 4 is margin
		var y1 = this.y0 + height - 4; // 4 is margin
		this.y1 = y1;
		var tmp = this.context.fillStyle;
		var tmp1 = this.context.strokeStyle;
		Utils.drawingDashedLine(this.context, dashedlinecolor, x0, y0, x1, y0);
		Utils.drawingDashedLine(this.context, dashedlinecolor, x0, y1, x1, y1);
		Utils.drawingDashedLine(this.context, dashedlinecolor, x0, y0, x0, y1);
		Utils.drawingDashedLine(this.context, dashedlinecolor, x1, y0, x1, y1);
		this.context.fillStyle = tmp;
		this.context.strokeStyle = tmp1; // resume old color

		// 裁剪图形
		// this.context.save();
		// this.context.beginPath();
		// this.context.rect(x0 + 1, y0 + 1, x1 - 1 - (x0 + 1), y1 - 1 - (y0 +
		// 1));
		// this.context.clip();
		// this.context.beginPath();

		this.marks = [];
		if (this.selected) {
			var activecolor = 'rgba(222, 253, 215, 0.5)';
			var f = this.context.fillStyle;
			this.context.fillStyle = activecolor;
			this.context.fillRect(x0 + 1, y0 + 1, x1 - 1 - (x0 + 1), y1 - 1
					- (y0 + 1));
			this.context.fillStyle = f;

			this.marks = Utils.createMarks(x0, y0, x1, y1);
			Utils.drawSelection(this.marks, this.context);
		}

		for (var i = 0; i < this.children.length; i++) {
			this.children[i].context = this.context;
			if (i == 0) {
				this.children[i].x0 = x0 + 8;
			} else {
				this.children[i].x0 = this.children[i - 1].x1 + 8;
			}
			this.children[i].y0 = y0 + 8;
			this.children[i].x1 = x1 - 8;
			this.children[i].y1 = y1 - 8;
			this.children[i].drawOnContext();
		}

		this.context.closePath();
		this.context.restore();
	} else {
		var height = 64;
		var x0 = this.x0; // 4 is margin
		var y0 = this.y0; // 4 is margin
		var x1 = this.x1; // 4 is margin
		var y1 = this.y0 + height; // 4 is margin
		this.y1 = y1;

		// 裁剪图形
		// this.context.save();
		// this.context.beginPath();
		// this.context.rect(x0 + 1, y0 + 1, x1 - 1 - (x0 + 1), y1 - 1 - (y0 +
		// 1));
		// this.context.clip();
		// this.context.beginPath();

		this.marks = [];
		if (this.selected) {
			var activecolor = 'rgba(222, 253, 215, 0.5)';
			var f = this.context.fillStyle;
			this.context.fillStyle = activecolor;
			this.context.fillRect(x0 + 1, y0 + 1, x1 - 1 - (x0 + 1), y1 - 1
					- (y0 + 1));
			this.context.fillStyle = f;
		}

		for (var i = 0; i < this.children.length; i++) {
			this.children[i].context = this.context;
			// 4 is padding
			if (i == 0) {
				this.children[i].x0 = x0 + 8;
			} else {
				this.children[i].x0 = this.children[i - 1].x1 + 8;
			}
			this.children[i].y0 = y0 + 8;
			this.children[i].x1 = x1 - 8;
			this.children[i].y1 = y1 - 8;
			this.children[i].drawOnContext();
		}

		this.context.closePath();
		this.context.restore();
	}

};

MbTopBar.prototype.isInMark = function(x, y) {
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