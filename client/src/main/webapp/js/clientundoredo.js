// Change value command
function CLValueChangedCmd(entity, propname, evt, owner) {
	this.name = "Value changed command";
	this.entity = entity;
	this.propname = propname;
	this.owner = owner;
	this.evt = evt;

	this.oldValue = entity[propname];
	this.newValue = evt.target.value;
	this.curValue = this.newValue;

	//this.lastupdate = Utils.getCurrentDateTime();
};

CLValueChangedCmd.prototype = new Command();

CLValueChangedCmd.prototype = {
	execute : function() {
		this.entity[this.propname] = this.curValue;
		this.entity.doHandle(this.evt, 2);
		this.entity.updateValueforRuntime();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.execute();
	},
};