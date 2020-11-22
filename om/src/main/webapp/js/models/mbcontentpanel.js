/**
 * 
 */
function MbContentPanel() {
	this.id = null;
	this.name = "MbContentPanel"; // full name
	this.createDateTime = null;
	this.parent = null; // 
	this.lastupdate = null;
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
	this.classtypename = "MbContentPanel";
	this.selectedIndex = 0;
};

MbContentPanel.prototype = new WorkflowEntity();

MbContentPanel.prototype.addChild = function(child) {
	this.children.push(child);
	this.selectedIndex = this.children.length - 1;
};

MbContentPanel.prototype.insertChild = function(pos, child) {
	this.children.splice(pos, 0, child);
	this.selectedIndex = pos;
};

MbContentPanel.prototype.removeChild = function(child) {
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

MbContentPanel.prototype.findPosition = function(x, y) {
	var j = -1;
	for (j = 0; j < this.children.length; j++) {
		var y00 = (this.children[j].y0 + this.children[j].y1) / 2;
		if (j == 0) {
			if (y <= y00) {
				return 0;
			}
		} else if (j == this.children.length - 1) {
			if (y > y00) {
				return j;
			}
		} else {
			var y01 = (this.children[j + 1].y0 + this.children[j + 1].y1) / 2;
			if (y <= y00) {
				return j;
			} else if (y > y00 && y <= y01) {
				return j + 1;
			}
		}

	}
	return j;
};

MbContentPanel.prototype.findCovered = function(x, y) {
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

MbContentPanel.prototype.findParent = function(o) {
    var p = null;
    if (this.children.length > 0) {
        for (var j = 0; j < this.children.length; j++) {
            if (this.children[j] == o) {
                p = this;
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

// delete one child and return the child's parent
MbContentPanel.prototype.removeObject = function(o) {
	var p = null;
	if (this.children.length > 0) {
		for (var j = 0; j < this.children.length; j++) {
			if (this.children[j] == o) {
				this.children.splice(j, 1);
				p = this;
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

MbContentPanel.prototype.moveUp = function(o) {
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

MbContentPanel.prototype.moveDown = function(o) {
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

MbContentPanel.prototype.getPosition = function(o) {
    if (this.children.length > 0) {
        for (var j = 0; j < this.children.length; j++) {
            if (this.children[j] == o) {
                return j;
            }
        }
    }
    return -1;
};

MbContentPanel.prototype.deselectAll = function() {
	this.selected = false;
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].deselectAll();
	}
};

MbContentPanel.prototype.setSelected = function(selected) {
	this.selected = selected;
};

MbContentPanel.prototype.setPreview = function() {
	this.editing = false;
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].setPreview();
	}
};

MbContentPanel.prototype.parseFromJSON = function(json) {
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
			var obj = json.children[i];
			if (obj.classtypename == "MbRow") {
				var row = new MbRow();
				row.parseFromJSON(obj);
				this.addChild(row);
			}
		}
	}
};

MbContentPanel.prototype.stringifyforJSON = function() {
	var b = new MbContentPanel();
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
MbContentPanel.prototype.drawOnContext = function() {
	if (this.editing) {
		var dashedlinecolor = 'rgb(154, 154, 154)';
		var activecolor = 'rgba(222, 253, 215, 0.5)';
		// 4 is margin
		var x0 = this.x0 + 4;
		var y0 = this.y0 + 4;
		var x1 = this.x1 - 4;
		var y1 = this.y1 - 4;
		var tmp = this.context.fillStyle;
		var tmp1 = this.context.strokeStyle;
		Utils.drawingDashedLine(this.context, dashedlinecolor, x0, y0, x1, y0);
		Utils.drawingDashedLine(this.context, dashedlinecolor, x0, y1, x1, y1);
		Utils.drawingDashedLine(this.context, dashedlinecolor, x0, y0, x0, y1);
		Utils.drawingDashedLine(this.context, dashedlinecolor, x1, y0, x1, y1);
		this.context.fillStyle = tmp;
		this.context.strokeStyle = tmp1; // resume old color
		this.marks = [];
		if (this.selected) {
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
			// 8 is padding
			this.children[i].x0 = x0 + 8;
			if (i == 0) {
				this.children[i].y0 = y0 + 8;
			} else {
				this.children[i].y0 = this.children[i - 1].y1 + 16;
			}
			this.children[i].x1 = x1 - 8;
			this.children[i].y1 = y1 - 8;
			this.children[i].width = this.children[i].x1 - this.children[i].x0;
			this.children[i].height = this.children[i].y1 - this.children[i].y0;
			this.children[i].drawOnContext();
		}
	} else {
		var dashedlinecolor = 'rgb(154, 154, 154)';
		var activecolor = 'rgba(222, 253, 215, 0.5)';
		var x0 = this.x0;
		var y0 = this.y0;
		var x1 = this.x1;
		var y1 = this.y1;
		if (this.selected) {
			var f = this.context.fillStyle;
			this.context.fillStyle = activecolor;
			this.context.fillRect(x0, y0, x1 - x0, y1 - y0);
			this.context.fillStyle = f;
		}
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].context = this.context;
			this.children[i].x0 = x0;
			if (i == 0) {
				this.children[i].y0 = y0;
			} else {
				this.children[i].y0 = this.children[i - 1].y1;
			}
			this.children[i].x1 = x1;
			this.children[i].y1 = y1;
			this.children[i].drawOnContext();
		}
	}

};

MbContentPanel.prototype.isInMark = function(x, y) {
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