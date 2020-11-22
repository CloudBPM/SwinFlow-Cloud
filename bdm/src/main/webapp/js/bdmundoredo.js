// rename
function BDMRenameCmd(entity, newname) {
	this.name = "Rename command";
	this.entity = entity; // renamed object
	this.oldname = entity.name;
	this.newname = Utils.stringify(newname);
	this.curName = this.newname;
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = new Date().getTime();//
	this.curLastupdate = this.newLastupdate;
};

BDMRenameCmd.prototype = new Command();

BDMRenameCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		// this.proc.setName(this.curName);
		if (this.entity != null) {
			this.entity.name = Utils.parse(this.curName);
			this.entity.lastupdate = this.curLastupdate;
			var that = this;
			// updating UI
			// update tab name
			$(".nav-tabs").children('li').each(function(entry) {
				var anchor = $(this).children("a")[0];
				var id = $(anchor).attr('href').substring(5);// #tab_000002A8AS
				if (id == that.entity.id) {
					var title = $(anchor).children("text")[0];
					$(title).html(Utils.parse(that.curName) + "&nbsp;&nbsp;");
				}
			});
			// update basic property sheet
			map[this.entity.id].setPropertySheet();
			// update treeview
			$('#treeview').jstree('deselect_all', true);
			$('#treeview').jstree('select_node', this.entity.id);
			var instance = $('#treeview').jstree();
			var parent = instance.get_selected(true)[0];
			parent.text = Utils.parse(this.curName); // tree
			instance.redraw(true);
			// $(obj).find("a:first").text("My new node label.");
		}
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curName = this.oldname;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curName = this.newname;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};


// remove all report fields
function BDMRemoveAllCmd(entity, newvalue) {
	this.name = "BDM remove all cmd";
	this.entity = entity;

	this.oldValue = entity.reportDefinition;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = new Date().getTime();//
	this.curLastupdate = this.newLastupdate;
};

BDMRemoveAllCmd.prototype = new Command();

BDMRemoveAllCmd.prototype = {
	execute : function() {
		this.entity.reportDefinition = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].reportFieldsEditor.refresh();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		// load undo info ...
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		// load redo info ...
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

function BDMAddAllCmd(entity, newvalue) {
	this.name = "BDM add all cmd";
	this.entity = entity;

	this.oldValue = entity.reportDefinition;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = new Date().getTime();//
	this.curLastupdate = this.newLastupdate;
};

BDMAddAllCmd.prototype = new Command();

BDMAddAllCmd.prototype = {
	execute : function() {
		this.entity.reportDefinition = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].reportFieldsEditor.refresh();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		// load undo info ...
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		// load redo info ...
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

function BDMRemoveOneCmd(entity, newvalue, pos) {
	this.name = "BDM remove one cmd";
	this.entity = entity;
	this.k = pos;
	this.newValue = newvalue;

	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = new Date().getTime();//
	this.curLastupdate = this.newLastupdate;

	this.cmd = 1;
};

BDMRemoveOneCmd.prototype = new Command();

BDMRemoveOneCmd.prototype = {
	execute : function() {
		if (this.cmd == 1) {
			this.entity.reportDefinition.splice(this.k, 1);
		} else {
			this.entity.insertReportField(this.k, this.newValue);
		}
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].reportFieldsEditor.refresh();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		// load undo info ...
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		// load redo info ...
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};


function BDMAddOneCmd(entity, newvalue) {
	this.name = "BDM add one cmd";
	this.entity = entity;
	this.newValue = newvalue;

	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = new Date().getTime();//
	this.curLastupdate = this.newLastupdate;

	this.cmd = 1;
};

BDMAddOneCmd.prototype = new Command();

BDMAddOneCmd.prototype = {
	execute : function() {
		if (this.cmd == 1) {
			this.entity.reportDefinition.push(this.newValue);
		} else {
			for (var k = 0; k < this.entity.reportDefinition.length; k++) {
				if (this.newValue.id == this.entity.reportDefinition[k].id) {
					this.entity.reportDefinition.splice(k, 1);
					break;
				}
			}
		}
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].reportFieldsEditor.refresh();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		// load undo info ...
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		// load redo info ...
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};


function BDMChangeVersionsCmd(entity, newvalue) {
	this.name = "BDM Report service change versions cmd";
	this.entity = entity;
	this.oldValue = entity.parentVersion;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = new Date().getTime();//
	this.curLastupdate = this.newLastupdate;
};

BDMChangeVersionsCmd.prototype = new Command();

BDMChangeVersionsCmd.prototype = {
	execute : function() {
		this.entity.parentVersion = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].queryVersionRangePane.refreshList(this.entity.parentVersion);
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

function BDMMoveOneUpCmd(entity, currrow) {
	this.name = "BDM Report title move one up cmd";
	this.entity = entity;
	this.currrow = currrow;

	this.rf1 = entity.reportDefinition[currrow];
	this.rf2 = entity.reportDefinition[currrow - 1];

	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = new Date().getTime();//
	this.curLastupdate = this.newLastupdate;

	this.cmd = 1;
};

BDMMoveOneUpCmd.prototype = new Command();

BDMMoveOneUpCmd.prototype = {
	execute : function() {
		if (this.cmd == 1) {
			this.entity.reportDefinition[this.currrow - 1] = this.rf1;
			this.entity.reportDefinition[this.currrow] = this.rf2;
		} else {
			this.entity.reportDefinition[this.currrow] = this.rf1;
			this.entity.reportDefinition[this.currrow - 1] = this.rf2;
		}
		map[this.entity.id].reportFieldsEditor.loadRightData(this.entity);
	},
	undo : function() {
		this.cmd = 2;
		// Command.prototype.undo.call(this);
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		// Command.prototype.redo.call(this);
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

function BDMMoveOneDownCmd(entity, currrow) {
	this.name = "BDM Report title move one up cmd";
	this.entity = entity;
	this.currrow = currrow;

	this.rf1 = entity.reportDefinition[currrow];
	this.rf2 = entity.reportDefinition[currrow + 1];

	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = new Date().getTime();//
	this.curLastupdate = this.newLastupdate;

	this.cmd = 1;
};

BDMMoveOneDownCmd.prototype = new Command();

BDMMoveOneDownCmd.prototype = {
	execute : function() {
		if (this.cmd == 1) {
			this.entity.reportDefinition[this.currrow + 1] = this.rf1;
			this.entity.reportDefinition[this.currrow] = this.rf2;
		} else {
			this.entity.reportDefinition[this.currrow] = this.rf1;
			this.entity.reportDefinition[this.currrow + 1] = this.rf2;
		}
		map[this.entity.id].reportFieldsEditor.loadRightData(this.entity);
	},
	undo : function() {
		this.cmd = 2;
		// Command.prototype.undo.call(this);
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		// Command.prototype.redo.call(this);
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// entity: report service object
function BDMChangeQueryConditionCmd(entity, newvalue) {
	this.name = "BDM Report service change query condition cmd";
	this.entity = entity;
	this.oldValue = entity.queryCondition;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = new Date().getTime();//
	this.curLastupdate = this.newLastupdate;
};

BDMChangeQueryConditionCmd.prototype = new Command();

BDMChangeQueryConditionCmd.prototype = {
	execute : function() {
		this.entity.queryCondition = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].queryConditionPane.loadingFields(this.entity);
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};