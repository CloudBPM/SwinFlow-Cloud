// Change prop value setting command
function ADMINValueChangedCmd(entity, propname, newvalue, id) {
	this.name = "Value changed";
	this.entity = entity;
	this.propname = propname;
	this.id = id;//编辑器的id

	this.oldValue = entity[propname];
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = (new Date()).valueOf();//获取long型时间
	this.oldLastUpdate = entity.lastUpdate;
	this.newLastUpdate = ts;
	this.curLastUpdate = this.newLastUpdate;
};

ADMINValueChangedCmd.prototype = new Command();

ADMINValueChangedCmd.prototype = {
	execute : function() {
		this.entity[this.propname] = this.curValue;
		this.entity.lastUpdate = this.curLastUpdate;
//		if (map[this.id].amRAppEditor != undefined) {   //不知amRAppEditor是什么
//			map[this.id].amRAppEditor.setPropertySheet();
//		} else {
			map[this.id].setPropertySheet();
//		}
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastUpdate = this.oldLastUpdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastUpdate = this.newLastUpdate;
		this.execute();
	},
};

// Change prop value setting command
function ADMINCKEditorCotentChangedCmd(entity, id) {
	this.name = "Value changed";
	this.entity = entity;
	this.id = id;//编辑器的id

	var ts = (new Date()).valueOf();//获取long型时间
	this.oldLastUpdate = entity.lastUpdate;
	this.newLastUpdate = ts;
	this.curLastUpdate = this.newLastUpdate;
	// editor.resetUndo();
};

ADMINCKEditorCotentChangedCmd.prototype = new Command();

ADMINCKEditorCotentChangedCmd.prototype = {
	execute : function() {
		map[this.id].currObject.content = map[this.id].enditorInstance
				.getData();
		this.entity.lastUpdate = this.curLastUpdate;
//		if (map[this.id].amRAppEditor != undefined) {  //不知amRAppEditor是什么
//			map[this.id].amRAppEditor.setPropertySheet();
//		} else {
			map[this.id].setPropertySheet();
//		}
	},
	undo : function() {
		map[this.id].enditorInstance.execCommand('undo');
		this.curLastUpdate = this.oldLastUpdate;
		this.execute();
	},
	redo : function() {
		map[this.id].enditorInstance.execCommand('redo');
		this.curLastUpdate = this.newLastUpdate;
		this.execute();
	},
};