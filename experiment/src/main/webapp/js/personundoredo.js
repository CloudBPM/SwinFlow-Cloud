/**
 * 
 */
// Change setting command
function ValueChangedCmd(entity, propname, input) {
	this.name = "Value changed command";
	this.entity = entity;
	this.propname = propname;
	this.input = input;

	this.oldValue = entity[propname];
	this.newValue = input.value;
	this.curValue = this.newValue;
};

ValueChangedCmd.prototype = new Command();

ValueChangedCmd.prototype = {
	execute : function() {
		this.entity[this.propname] = this.curValue;
		//map[this.owner.id].setPropertySheet();
		console.log(this.input.value);
		this.input.value =  this.curValue;
	},
	undo : function() {
		console.log("a");
		this.curValue = this.oldValue;
		this.execute();
	},
	redo : function() {
		console.log("b");
		this.curValue = this.newValue;
		this.execute();
	},
};

//Change setting command
function ValueChangedCmd4Sheet(ownerid, entity, propname, newvalue) {
	this.name = "Value changed command";
	this.entity = entity;
	this.propname = propname;
	this.ownerid = ownerid;

	this.oldValue = entity[propname];
	this.newValue = newvalue;
	this.curValue = this.newValue;
};

ValueChangedCmd4Sheet.prototype = new Command();

ValueChangedCmd4Sheet.prototype = {
	execute : function() {
		this.entity[this.propname] = this.curValue;
		ommap[this.ownerid].refreshRow(this.entity);
		ommap[this.ownerid].setPropertySheet(this.entity);
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

//Change setting command
function GenderValueChangedCmd(entity, newvalue, input1, input2) {
	this.name = "Gender value changed command";
	this.entity = entity;
	this.input1 = input1;
	this.input2 = input2;

	this.oldValue = entity.gender;
	this.newValue = newvalue;
	this.curValue = this.newValue;
};

GenderValueChangedCmd.prototype = new Command();

GenderValueChangedCmd.prototype = {
	execute : function() {
		this.entity.gender = this.curValue;
		//map[this.owner.id].setPropertySheet();
		console.log(this.curValue);
		if (this.curValue == 0) {
			this.input1.checked = true;
			this.input2.checked = false;
		} else if (this.curValue == 1) {
			this.input1.checked = false;
			this.input2.checked = true;
		}
	},
	undo : function() {
		console.log("a");
		this.curValue = this.oldValue;
		this.execute();
	},
	redo : function() {
		console.log("b");
		this.curValue = this.newValue;
		this.execute();
	},
};