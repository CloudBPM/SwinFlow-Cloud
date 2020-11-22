/**
 * This is workflow entity abstract class.
 * 
 * @author Dahai Cao on 20160124 in Melbourne
 */

function WorkflowEntity() {
	this.id;
	this.name;
	this.owner;
	this.context = null; // canvas context(2d) for HTML5
	this.classtypename = "WorkflowEntity";
	this.lastupdate = null;
};

function Page() {
	this.pageNo = 1;
	this.pageSize = 30;
	this.allEntitiesCount = 0;
	this.allPagesCount = 0;
	this.pageIndex = 0;
	this.pageEntities = [];
};

Page.prototype.parseFromJSON = function(json) {
	this.pageNo = json.pageNo;
	this.pageSize = json.pageSize;
	this.allEntitiesCount = json.allEntitiesCount;
	this.allPagesCount = json.allPagesCount;
	this.pageIndex = json.pageIndex;
	if (json.pageEntities.length > 0) {
		for (var i = 0; i < json.pageEntities.length; i++) {
			this.pageEntities.push(json.pageEntities[i]);
		}
	}
}

function Perference() {
	this.om = new MContent();
	this.am = new MContent();
	this.pm = new MContent();
	this.fm = new MContent();
	this.admin = new MContent();
	this.blm = new MContent();
	this.bdm = new MContent();
	this.svm = new MContent();
};

Perference.prototype.parseFromJSON = function(json) {
	var om = new MContent()
	om.parseFromJSON(json.om);
	this.om = om;
	var am = new MContent()
	am.parseFromJSON(json.am);
	this.am = am;
	var pm = new MContent()
	pm.parseFromJSON(json.pm);
	this.pm = pm;
	var fm = new MContent()
	fm.parseFromJSON(json.fm);
	this.fm = fm;
	var admin = new MContent()
	admin.parseFromJSON(json.admin);
	this.admin = admin;
	var blm = new MContent()
	blm.parseFromJSON(json.blm);
	this.blm = blm;
	var bdm = new MContent()
	bdm.parseFromJSON(json.bdm);
	this.bdm = bdm;
	var svm = new MContent()
	svm.parseFromJSON(json.svm);
	this.svm = svm;
};

function MContent() {
	this.leftsize;
	this.bottomsize;
	this.rightsize;
	// this.opened = new Opened();
	this.ids = [];
}
MContent.prototype.parseFromJSON = function(json) {
	this.leftsize = json.leftsize;
	this.bottomsize = json.bottomsize;
	this.rightsize = json.rightsize;
	if (json.ids != null && json.ids.length > 0) {
		for (var i = 0; i < json.ids.length; i++) {
			this.ids.push(json.ids[i]);
		}
	}
};

MContent.prototype.stringifyforJSON = function() {
	var m = new MContent();
	m.leftsize = this.leftsize;
	m.bottomsize = this.bottomsize;
	m.rightsize = this.rightsize;
	m.ids = this.ids;
};

/*
 * function Opened() { this.ids = []; }
 */
MContent.prototype.addId = function(id) {
	var f = false;
	for (var i = 0; i < this.ids.length; i++) {
		if (id == this.ids[i]) {
			f = true;
			break;
		}
	}
	if (!f) {
		this.ids.push(id);
	}
};

MContent.prototype.removeId = function(id) {
	for (var i = 0; i < this.ids.length; i++) {
		if (id == this.ids[i]) {
			this.ids.splice(i, 1);
			break;
		}
	}
};

function CornerMark() {
	this.x0;
	this.x1;
	this.y0;
	this.y1;
	this.width = 8;
	this.height = 8;
	this.half = 4;
};

/**
 * Undo Redo stack
 * 
 * @author Dahai Cao on 20160402
 */
function CommandStack() {
	this.commands = [];
	this.stackPosition = -1;
	this.savePosition = -1;
	this.undoButton = null;
	this.redoButton = null;
};

CommandStack.prototype = {
	execute : function(command) {
		this._clearRedo();
		this.redoButton.setAttribute("disabled", "");
		this.undoButton.removeAttribute("disabled");
		command.execute();
		// do something for limiting stack length.
		this.commands.push(command);
		this.stackPosition++;
		this.changed();
	},
	undo : function() {
		this.commands[this.stackPosition].undo();
		this.stackPosition--;
		this.changed();
		if (this.canUndo()) {
			this.undoButton.removeAttribute("disabled");
		} else {
			this.undoButton.setAttribute("disabled", "");
		}
		this.redoButton.removeAttribute("disabled");
	},
	canUndo : function() {
		return this.stackPosition >= 0;
	},
	redo : function() {
		this.stackPosition++;
		this.commands[this.stackPosition].redo();
		this.changed();
		if (this.canRedo()) {
			this.redoButton.removeAttribute("disabled");
		} else {
			this.redoButton.setAttribute("disabled", "");
		}
		this.undoButton.removeAttribute("disabled");
	},
	canRedo : function() {
		return this.stackPosition < this.commands.length - 1;
	},
	save : function() {
		this.savePosition = this.stackPosition;
		this.changed();
	},
	isDirty : function() {
		return this.stackPosition != this.savePosition;
	},
	_clearRedo : function() {
		this.commands = this.commands.slice(0, this.stackPosition + 1);
	},
	changed : function() {
		if (this.isDirty()) {
			$("#saveG").removeClass("disabled");
		} else {
			$("#saveG").addClass("disabled");
		}
	},
	clearStack : function() {
		this.commands = [];
		this.stackPosition = -1;
		this.savePosition = -1;
	}
};

/**
 * Command class
 * 
 * @author Dahai Cao on 20160402 in Melbourne
 */
function Command() {
	this.name;

};

Command.prototype = {
	execute : function() {
	},
	undo : function() {
		// load undo info ...
		this.execute();
	},
	redo : function() {
		// load redo info ...
		this.execute();
	},
};