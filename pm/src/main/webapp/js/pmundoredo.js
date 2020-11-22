// rename
function PMRenameCmd(entity, newname) {
	this.name = "Rename command";
	this.entity = entity; // process object
	this.oldname = entity.name;
	this.newname = Utils.stringify(newname);
	this.curName = this.newname;
	this.oldProcLastupdate = entity.lastupdate;
	this.newProcLastupdate = new Date().getTime();//
	this.curProcLastupdate = this.newProcLastupdate;
};

PMRenameCmd.prototype = new Command();

PMRenameCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		// this.proc.setName(this.curName);
		if (this.entity != null) {
			this.entity.name = Utils.parse(this.curName);
			this.entity.lastupdate = this.curProcLastupdate;
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
			parent = instance.get_selected(true)[0];
			parent.text = Utils.parse(this.curName); // tree
			instance.redraw(true);
			// $(obj).find("a:first").text("My new node label.");
		}
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curName = this.oldname;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curName = this.newname;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Reorder transition up command
function PMReorderTransitionUpCmd(entity, parent, owner) {
	this.name = "Reorder transition up";
	this.entity = entity;

	this.parent = parent; // edit panel
	this.select = parent.orderListSelect; // select (list)
	this.upButton = parent.upButton;
	this.downButton = parent.downButton;
	this.owner = owner;

	this.oldCurIndex = this.select.selectedIndex; // current
	this.newCurIndex = this.select.selectedIndex - 1;
	this.curCurIndex = this.newCurIndex;

	this.oldPreviousIndex = this.select.selectedIndex - 1; // previous
	this.newPreviousIndex = this.select.selectedIndex;
	this.curPreviousIndex = this.newPreviousIndex;

	var v0 = this.select.options[this.curCurIndex].value; // current
	var v1 = this.select.options[this.curPreviousIndex].value; // previous
	var o0 = this.entity.getOutputById(v0); // current output
	var o1 = this.entity.getOutputById(v1); // previous output

	this.oldCurOrderNumber = o0.orderNumber; // current number
	this.newCurOrderNumber = o1.orderNumber; // previous number
	this.curCurOrderNumber = this.newCurOrderNumber;

	this.oldPreOrderNumber = o1.orderNumber; // previous number
	this.newPreOrderNumber = o0.orderNumber; // current number
	this.curPreOrderNumber = this.newPreOrderNumber;

	this.oldStatusUpBtton = this.parent.getButtonStatus(this.upButton);
	this.oldStatusDownBtton = this.parent.getButtonStatus(this.downButton);
	if (this.curCurIndex == 0) {
		this.newStatusUpBtton = false;
		this.newStatusDownBtton = true;
	} else if (this.curCurIndex == this.select.options.length - 1) {
		this.newStatusUpBtton = true;
		this.newStatusDownBtton = false;
	} else {
		this.newStatusUpBtton = true;
		this.newStatusDownBtton = true;
	}
	this.curStatusUpBtton = this.newStatusUpBtton;
	this.curStatusDownBtton = this.newStatusDownBtton;
	this.oldProcLastupdate = entity.owner.lastupdate;
	this.newProcLastupdate = new Date().getTime();// 
	this.curProcLastupdate = this.newProcLastupdate;
};

PMReorderTransitionUpCmd.prototype = new Command();

PMReorderTransitionUpCmd.prototype = {
	execute : function() {
		var v0 = this.select.options[this.curCurIndex].value;// current
		var v1 = this.select.options[this.curPreviousIndex].value;// previous
		var o0 = this.entity.getOutputById(v0);
		var o1 = this.entity.getOutputById(v1);
		o0.orderNumber = this.curCurOrderNumber;
		o1.orderNumber = this.curPreOrderNumber;
		this.parent.swapItems(this.entity.outputs, this.curPreviousIndex,
				this.curCurIndex);
		this.parent.setTask(this.entity);
		this.select.selectedIndex = this.curCurIndex;
		this.parent.setButtonStatus(this.upButton, this.curStatusUpBtton);
		this.parent.setButtonStatus(this.downButton, this.curStatusDownBtton);

		this.owner.lastupdate = this.curProcLastupdate;
		if (map[this.owner.id].selected[0] == this.entity) {
			this.parent.setTask(this.entity, this.owner);
		} else {
			map[this.owner.id].setPropertySheet();
		}
		this.select.selectedIndex = this.curCurIndex;
		map[this.owner.id].repaint();
	},
	undo : function() {
		this.curCurIndex = this.oldCurIndex;
		this.curPreviousIndex = this.oldPreviousIndex;
		this.curCurOrderNumber = this.oldCurOrderNumber;
		this.curPreOrderNumber = this.oldPreOrderNumber;
		this.curStatusUpBtton = this.oldStatusUpBtton;
		this.curStatusDownBtton = this.oldStatusDownBtton;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.curCurIndex = this.newCurIndex;
		this.curPreviousIndex = this.newPreviousIndex;
		this.curCurOrderNumber = this.newCurOrderNumber;
		this.curPreOrderNumber = this.newPreOrderNumber;
		this.curStatusUpBtton = this.newStatusUpBtton;
		this.curStatusDownBtton = this.newStatusDownBtton;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},

};

// Reorder transition down command
function PMReorderTransitionDownCmd(entity, parent, owner) {
	this.name = "Reorder transition down";
	this.entity = entity;
	this.owner = owner;
	this.parent = parent;
	this.select = parent.orderListSelect; // select (list)
	this.upButton = parent.upButton;
	this.downButton = parent.downButton;

	this.oldCurIndex = this.select.selectedIndex; // current
	this.newCurIndex = this.select.selectedIndex + 1;
	this.curCurIndex = this.newCurIndex;

	this.oldNextIndex = this.select.selectedIndex + 1; // next
	this.newNextIndex = this.select.selectedIndex;
	this.curNextIndex = this.newNextIndex;

	var v0 = this.select.options[this.curCurIndex].value; // current
	var v1 = this.select.options[this.curNextIndex].value; // next
	var o0 = this.entity.getOutputById(v0); // current output
	var o1 = this.entity.getOutputById(v1); // next output

	this.oldCurOrderNumber = o0.orderNumber; // current number
	this.newCurOrderNumber = o1.orderNumber; // next number
	this.curCurOrderNumber = this.newCurOrderNumber;

	this.oldNextOrderNumber = o1.orderNumber; // next number
	this.newNextOrderNumber = o0.orderNumber; // current number
	this.curNextOrderNumber = this.newNextOrderNumber;

	this.oldStatusUpBtton = this.parent.getButtonStatus(this.upButton);
	this.oldStatusDownBtton = this.parent.getButtonStatus(this.downButton);
	if (this.curCurIndex == 0) {
		this.newStatusUpBtton = false;
		this.newStatusDownBtton = true;
	} else if (this.curCurIndex == this.select.options.length - 1) {
		this.newStatusUpBtton = true;
		this.newStatusDownBtton = false;
	} else {
		this.newStatusUpBtton = true;
		this.newStatusDownBtton = true;
	}
	this.curStatusUpBtton = this.newStatusUpBtton;
	this.curStatusDownBtton = this.newStatusDownBtton;
	this.oldProcLastupdate = entity.owner.lastupdate;
	this.newProcLastupdate = new Date().getTime();// 
	this.curProcLastupdate = this.newProcLastupdate;
};

PMReorderTransitionDownCmd.prototype = new Command();

PMReorderTransitionDownCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		// var curIndex = this.select.selectedIndex;
		var v0 = this.select.options[this.curCurIndex].value;// current
		var v1 = this.select.options[this.curNextIndex].value;// next
		var o0 = this.entity.getOutputById(v0);
		var o1 = this.entity.getOutputById(v1);
		o0.orderNumber = this.curCurOrderNumber;
		o1.orderNumber = this.curNextOrderNumber;
		this.parent.swapItems(this.entity.outputs, this.curCurIndex,
				this.curNextIndex);
		this.parent.setTask(this.entity);
		this.select.selectedIndex = this.curCurIndex;
		this.parent.setButtonStatus(this.upButton, this.curStatusUpBtton);
		this.parent.setButtonStatus(this.downButton, this.curStatusDownBtton);
		this.entity.owner.lastupdate = this.curProcLastupdate;

		if (map[this.owner.id].selected[0] == this.entity) {
			this.parent.setTask(this.entity, this.owner);
		} else {
			map[this.owner.id].setPropertySheet();
		}
		this.select.selectedIndex = this.curCurIndex;
		map[this.owner.id].repaint();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curCurIndex = this.oldCurIndex;
		this.curNextIndex = this.oldNextIndex;
		this.curCurOrderNumber = this.oldCurOrderNumber;
		this.curNextOrderNumber = this.oldNextOrderNumber;
		this.curStatusUpBtton = this.oldStatusUpBtton;
		this.curStatusDownBtton = this.oldStatusDownBtton;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curCurIndex = this.newCurIndex;
		this.curNextIndex = this.newNextIndex;
		this.curCurOrderNumber = this.newCurOrderNumber;
		this.curNextOrderNumber = this.newNextOrderNumber;
		this.curStatusUpBtton = this.newStatusUpBtton;
		this.curStatusDownBtton = this.newStatusDownBtton;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Navigation rule edit command
function PMNavigationChangeCmd(entity, parent, checked, owner) {
	this.name = "Navigation changed";
	this.entity = entity;
	this.owner = owner;
	this.radio = parent.radioOption; // unconditional
	this.radio1 = parent.radioOption1; // conditional
	this.nrEditButton = parent.navigationEditButton;

	this.oldAlwaysTrue = entity.alwaysTrue;
	this.newAlwaysTrue = checked;
	this.curAlwaysTrue = this.newAlwaysTrue;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = new Date().getTime();// 
	this.curProcLastupdate = this.newProcLastupdate;
};

PMNavigationChangeCmd.prototype = new Command();

PMNavigationChangeCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		this.entity.alwaysTrue = this.curAlwaysTrue;
		if (this.curAlwaysTrue) {
			this.radio.checked = true;
			this.nrEditButton.setAttribute("disabled", "");
		} else {
			this.radio1.checked = true;
			this.nrEditButton.removeAttribute("disabled");
		}
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curAlwaysTrue = this.oldAlwaysTrue;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curAlwaysTrue = this.newAlwaysTrue;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Navigation rule edit rule
function PMNavigationRuleEditCmd(entity, newrule, owner) {
	this.name = "Navigation rule edit";
	this.entity = entity; // transition
	this.owner = owner; // process object
	if (entity.navigationRule != null) {
		this.oldNavigationRule = entity.navigationRule;
	} else {
		this.oldNavigationRule = null;
	}
	this.newNavigationRule = newrule;
	this.curNavigationRule = this.newNavigationRule;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = new Date().getTime();// 
	this.curProcLastupdate = this.newProcLastupdate;
};

PMNavigationRuleEditCmd.prototype = new Command();

PMNavigationRuleEditCmd.prototype = {
	execute : function() {
		this.entity.navigationRule = this.curNavigationRule;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		this.curNavigationRule = this.oldNavigationRule;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.curNavigationRule = this.newNavigationRule;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Remove task command
function PMRemoveCmd(selected, parent) {
	this.name = "Remove task";
	this.parent = parent;

	this.curSelected = selected;

	this.oldProcLastupdate = this.parent.lastupdate;
	this.newProcLastupdate = new Date().getTime();// 
	this.curProcLastupdate = this.newProcLastupdate;
	this.cmd = 1;// 1: redo(remove); 2: undo(add);
};

PMRemoveCmd.prototype = new Command();

PMRemoveCmd.prototype = {
	execute : function() {
		if (this.cmd == 1) {
			for (var i = 0; i < this.curSelected.length; i++) {
				this.parent.removeChild(this.curSelected[i]);
			}
		} else if (this.cmd == 2) {
			this.parent.addChildren(this.curSelected);
		}

		this.parent.lastupdate = this.curProcLastupdate;
		map[this.parent.id].repaint();
		map[this.parent.id].setPropertySheet();
	},
	undo : function() {
		this.cmd = 2;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Remove task command
// function PMRemoveTaskCmd(entity, parent, editor) {
// this.name = "Remove task";
// this.entity = entity;
// this.parent = parent;
//
// this.oldSelected = editor.selected;
// this.newSelecetd = null;
// this.curSelected = this.newSelecetd;
//
// this.index = this.parent.children.indexOf(entity);
//
// this.curTask = entity;
// // --
// this.oldProcLastupdate = this.parent.lastupdate;
// this.newProcLastupdate = new Date().getTime(); //
// this.curProcLastupdate = this.newProcLastupdate;
// this.cmd = 2;// 1: redo(add); 2: undo(remove);
// };
//
// PMRemoveTaskCmd.prototype = new Command();
//
// PMRemoveTaskCmd.prototype = {
// execute : function() {
// // Command.prototype.execute.call(this);
// if (this.cmd == 2) {
// if (this.curTask.inputs.length > 0) {
// for (j = 0; j < this.curTask.inputs.length; j++) {
// for (k = 0; k < this.curTask.inputs[j].source.outputs.length; k++) {
// if (this.curTask.inputs[j].id == this.curTask.inputs[j].source.outputs[k].id)
// {
// this.curTask.inputs[j].source.outputs.splice(k, 1);
// break;
// }
// }
// }
// }
// if (this.curTask.outputs.length > 0) {
// for (j = 0; j < this.curTask.outputs.length; j++) {
// for (var k = 0; k < this.curTask.outputs[j].target.inputs.length; k++) {
// if (this.curTask.outputs[j].id ==
// this.curTask.outputs[j].target.inputs[k].id) {
// this.curTask.outputs[j].target.inputs.splice(k, 1);
// break;
// }
// }
// }
// }
// if (this.index > -1) {
// this.parent.children.splice(this.index, 1);
// }
// } else if (this.cmd == 1) {
// this.parent.children.splice(this.index, 0, this.curTask);
// if (this.curTask.inputs.length > 0) {
// for (j = 0; j < this.curTask.inputs.length; j++) {
// this.curTask.inputs[j].source
// .addOutput(this.curTask.inputs[j]);
// }
// }
// if (this.curTask.outputs.length > 0) {
// for (j = 0; j < this.curTask.outputs.length; j++) {
// this.curTask.outputs[j].target
// .addInput(this.curTask.outputs[j]);
// }
// }
// }
//
// this.parent.lastupdate = this.curProcLastupdate;
// // map[this.parent.id].selected = this.curSelected;
// map[this.parent.id].repaint();
// map[this.parent.id].setPropertySheet();
// },
// undo : function() {
// // Command.prototype.undo.call(this);
// // load undo info ...
// this.cmd = 1;
// this.curSelected = this.oldSelected;
// this.curProcLastupdate = this.oldProcLastupdate;
// this.execute();
// },
// redo : function() {
// // Command.prototype.redo.call(this);
// // load redo info ...
// this.cmd = 2;
// this.curSelected = this.newSelecetd;
// this.curProcLastupdate = this.newProcLastupdate;
// this.execute();
// },
// };

// Remove transition command
// function PMRemoveTransitionCmd(entity, parent, editor) {
// this.name = "Remove transition";
// this.entity = entity; // transition
// this.parent = parent; // process
// this.oldSelected = editor.selected; // selected transition
// this.newSelecetd = null;
// this.curSelected = this.newSelecetd;
//
// this.curTransition = entity;
// // --
// this.oldProcLastupdate = this.parent.lastupdate;
// this.newProcLastupdate = new Date().getTime(); // 
// this.curProcLastupdate = this.newProcLastupdate;
//
// this.cmd = 2;// 1: redo(add); 2: undo(remove);
// };
//
// PMRemoveTransitionCmd.prototype = new Command();
//
// PMRemoveTransitionCmd.prototype = {
// execute : function() {
// // Command.prototype.execute.call(this);
// if (this.cmd == 2) {
// for (var k = 0; k < this.curTransition.source.outputs.length; k++) {
// if (this.curTransition.source.outputs[k].id == this.curTransition.id) {
// this.curTransition.source.outputs.splice(k, 1);
// break;
// }
// }
// for (var k = 0; k < this.curTransition.target.inputs.length; k++) {
// if (this.curTransition.target.inputs[k].id == this.curTransition.id) {
// this.curTransition.target.inputs.splice(k, 1);
// break;
// }
// }
// } else if (this.cmd == 1) {
// this.curTransition.source.addOutput(this.curTransition);
// this.curTransition.target.addInput(this.curTransition);
// }
//
// this.parent.lastupdate = this.curProcLastupdate;
// // map[this.parent.id].selected = this.curSelected;
// map[this.parent.id].repaint();
// map[this.parent.id].setPropertySheet();
// },
// undo : function() {
// // Command.prototype.undo.call(this);
// // load undo info ...
// this.cmd = 1;
// this.curSelected = this.oldSelected;
// this.curProcLastupdate = this.oldProcLastupdate;
// this.execute();
// },
// redo : function() {
// // Command.prototype.redo.call(this);
// // load redo info ...
// this.cmd = 2;
// this.curSelected = this.newSelecetd;
// this.curProcLastupdate = this.newProcLastupdate;
// this.execute();
// },
// };

// Move task command
function PMMoveTaskCmd(selected, parent) {
	this.name = "Move selected tasks";
	this.parent = parent;

	this.oldSelected = map[this.parent.id].cloneSelectedObjects(selected);
	this.newSelected = null;
	this.curSelected = this.newSelected;

	this.oldProcLastupdate = this.parent.lastupdate;
	this.newProcLastupdate = new Date().getTime(); // 
	this.curProcLastupdate = this.newProcLastupdate;
};

PMMoveTaskCmd.prototype = new Command();

PMMoveTaskCmd.prototype = {
	update : function(selected) {
		this.newSelected = map[this.parent.id].cloneSelectedObjects(selected);
		this.curSelected = selected;
	},
	execute : function() {
		this.parent.lastupdate = this.curProcLastupdate;
		map[this.parent.id].repaint();
		map[this.parent.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		map[this.parent.id].evalMoveNodes(this.curSelected, this.oldSelected);
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		map[this.parent.id].evalMoveNodes(this.curSelected, this.newSelected);
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Move and change transition bend point command
function PMMoveTransitionBendPointCmd(selected, parent) {
	this.name = "Move one or more transitions";
	this.parent = parent;

	this.oldSelected = map[this.parent.id].cloneSelectedObjects(selected);
	this.newSelected = null;
	this.curSelected = this.newSelected;

	this.oldProcLastupdate = this.parent.lastupdate;
	this.newProcLastupdate = new Date().getTime(); // 
	this.curProcLastupdate = this.newProcLastupdate;
};

PMMoveTransitionBendPointCmd.prototype = new Command();

PMMoveTransitionBendPointCmd.prototype = {
	update : function(selected) {
		this.newSelected = map[this.parent.id].cloneSelectedObjects(selected);
		this.curSelected = selected;
	},
	execute : function() {
		this.parent.lastupdate = this.curProcLastupdate;
		map[this.parent.id].repaint();
		map[this.parent.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		map[this.parent.id].evalMoveNodes(this.curSelected, this.oldSelected);
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		map[this.parent.id].evalMoveNodes(this.curSelected, this.newSelected);
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Alignment graph nodes command
function PMAlignmentNodesCmd(selected, owner) {
	this.name = "Align selected tasks and transitions";
	this.owner = owner;
	this.oldSelected = map[this.owner.id].cloneSelectedObjects(selected);
	this.newSelected = null;
	this.curSelected = this.newSelected;
	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = new Date().getTime(); // 
	this.curProcLastupdate = this.newProcLastupdate;
};

PMAlignmentNodesCmd.prototype = new Command();

PMAlignmentNodesCmd.prototype = {
	update : function(selected) {
		this.newSelected = map[this.owner.id].cloneSelectedObjects(selected);
		this.curSelected = selected;
	},
	execute : function() {
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		map[this.owner.id].evalMoveNodes(this.curSelected, this.oldSelected);
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		map[this.owner.id].evalMoveNodes(this.curSelected, this.newSelected);
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Resize department command
function PMResizeTaskShapeCmd(selected, owner) {
	this.name = "Resize selected process tasks";
	this.owner = owner;
	this.oldSelected = map[this.owner.id].cloneSelectedObjects(selected);
	this.newSelected = null;
	this.curSelected = this.newSelected;

	this.oldEditorStatus = map[this.owner.id].editorStatus;
	this.newEditorStatus = 2;
	this.curEditorStatus = this.newEditorStatus;

	// --
	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = new Date().getTime(); // 
	this.curProcLastupdate = this.newProcLastupdate;
};

PMResizeTaskShapeCmd.prototype = new Command();

PMResizeTaskShapeCmd.prototype = {
	update : function(selected) {
		this.newSelected = map[this.owner.id].cloneSelectedObjects(selected);
		this.curSelected = selected;
	},
	execute : function() {
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
		map[this.owner.id].setButtonStatus(this.curEditorStatus);
	},
	undo : function() {
		map[this.owner.id].evalMoveNodes(this.curSelected, this.oldSelected);
		this.curEditorStatus = this.newEditorStatus;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		map[this.owner.id].evalMoveNodes(this.curSelected, this.newSelected);
		this.curEditorStatus = this.newEditorStatus;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Add task command
function PMCreateTaskCmd(entity, parent, editor) {
	this.name = "Create new task";
	this.entity = entity;
	this.parent = parent;

	this.oldSelected = editor.selectionBuffer;
	this.newSelected = [ entity ];
	this.curSelected = this.newSelected;

	this.oldEditorStatus = editor.editorStatus;
	this.newEditorStatus = 3;
	this.curEditorStatus = this.newEditorStatus;

	// --
	this.oldProcLastupdate = this.parent.lastupdate;
	this.newProcLastupdate = new Date().getTime(); // 
	this.curProcLastupdate = this.newProcLastupdate;

	this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

PMCreateTaskCmd.prototype = new Command();

PMCreateTaskCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		if (this.cmd == 1) {
			this.parent.addChild(this.entity);
		} else {
			this.parent.removeChild(this.entity);
		}
		this.parent.lastupdate = this.curProcLastupdate;
		map[this.parent.id].disableSelectedObjects();
		map[this.parent.id].resumeSelectedNodes(this.curSelected);
		map[this.parent.id].setButtonStatus(this.editorstatus);
		map[this.parent.id].repaint();
		map[this.parent.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		// load undo info ...
		this.cmd = 2;
		this.curSelected = this.oldSelected;
		this.curEditorStatus = this.oldEditorStatus;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		// load redo info ...
		this.cmd = 1;
		this.curSelected = this.newSelected;
		this.curEditorStatus = this.newEditorStatus;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Add new transition command
function PMCreateTransitionCmd(entity, parent, editor) {
	this.name = "Create new transition";
	this.entity = entity; // transition
	this.parent = parent; // process

	this.oldSelected = editor.selectionBuffer;
	this.newSelected = [ entity ];
	this.curSelected = this.newSelected;

	this.oldEditorStatus = editor.editorStatus;
	this.newEditorStatus = 4; // create transition status
	this.curEditorStatus = this.newEditorStatus;

	this.oldProcLastupdate = this.parent.lastupdate;
	this.newProcLastupdate = new Date().getTime(); // 
	this.curProcLastupdate = this.newProcLastupdate;

	this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

PMCreateTransitionCmd.prototype = new Command();

PMCreateTransitionCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		if (this.cmd == 1) {
			this.entity.source.addOutput(this.entity);
			this.entity.target.addInput(this.entity);
		} else {
			this.entity.source.removeOutput(this.entity);
			this.entity.target.removeInput(this.entity);
		}
		this.parent.lastupdate = this.curProcLastupdate;
		map[this.parent.id].disableSelectedObjects();
		this.entity.selected = true;
		map[this.parent.id].resumeSelectedNodes(this.curSelected);
		map[this.parent.id].setButtonStatus(this.editorstatus);
		map[this.parent.id].repaint();
		map[this.parent.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.cmd = 2;
		this.curEditorStatus = this.oldEditorStatus;
		this.curSelected = this.oldSelected;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.cmd = 1;
		this.curEditorStatus = this.newEditorStatus;
		this.curSelected = this.newSelected;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Add data variable command
function PMCreateVariableCmd(entity, parent) {
	this.name = "Create new variable";
	this.entity = entity; // variable
	this.parent = parent; // process

	// --
	this.oldProcLastupdate = this.parent.lastupdate;
	this.newProcLastupdate = new Date().getTime(); // 
	this.curProcLastupdate = this.newProcLastupdate;

	this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

PMCreateVariableCmd.prototype = new Command();

PMCreateVariableCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		if (this.cmd == 1) {
			this.parent.addChild(this.entity);
		} else {
			this.parent.removeChild(this.entity);
		}
		this.parent.lastupdate = this.curProcLastupdate;
		map[this.parent.id].repaint();
		map[this.parent.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.cmd = 2;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.cmd = 1;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Remove a data variable command
function PMRemoveVariableCmd(entityId, parent) {
	this.name = "Remove a variable";
	this.entity = parent.seekChildByID(entityId); // variable
	this.parent = parent; // process

	this.oldProcLastupdate = this.parent.lastupdate;
	this.newProcLastupdate = new Date().getTime(); // 
	this.curProcLastupdate = this.newProcLastupdate;
	this.cmd = 2;// 1: redo(add); 2: undo(remove);
};

PMRemoveVariableCmd.prototype = new Command();

PMRemoveVariableCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		if (this.cmd == 1) {
			this.addNumber(this.entity.orderNumber);
			this.parent.addChild(this.entity);
		} else {
			this.parent.removeChild(this.entity);
			this.removeNumber(this.entity.orderNumber);
		}
		this.parent.resortVariables();
		this.parent.lastupdate = this.curProcLastupdate;
		map[this.parent.id].repaint();
		map[this.parent.id].setPropertySheet();
		if (this.entity.datatype == "File") {
			// 不可恢复删除。
			if (this.entity instanceof DataVariable) {
				this.entity.value = new FileConstant();
			} else if (this.entity instanceof ArrayDataVariable) {
				this.entity.values = [];
			}
			$("#progressbar").show();
			$.post(service.api2(2), {
				oid : this.parent.owner, // organization id
				pid : this.parent.id, // process id
				vid : this.entity.id,
			}).complete(function(data) {
				$("#progressbar").hide();
			});
		}
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.cmd = 1;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.cmd = 2;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
	// this method is used in remove a variable function
	removeNumber : function(k) {
		for (var i = 0; i < this.parent.children.length; i++) {
			if (this.parent.children[i] instanceof DataVariable
					&& this.parent.children[i].orderNumber > k) {
				this.parent.children[i].orderNumber = (this.parent.children[i].orderNumber - 1);
			}
		}
	},
	// this method is used in remove a variable function
	addNumber : function(k) {
		for (var i = 0; i < this.parent.children.length; i++) {
			if (this.parent.children[i] instanceof DataVariable
					&& this.parent.children[i].orderNumber >= k) {
				this.parent.children[i].orderNumber = (this.parent.children[i].orderNumber + 1);
			}
		}
	},
};

// Modify variable command
function PMModifyVariableCmd(entity, parent) {
	this.name = "Modify a variable";
	this.entity = entity; // data variable
	this.parent = parent; // process

	this.oldVariable = entity.clone(parent);
	this.newVariable = entity;
	this.curVariable = this.newVariable;

	this.oldProcLastupdate = this.parent.lastupdate;
	this.newProcLastupdate = new Date().getTime(); // 
	this.curProcLastupdate = this.newProcLastupdate;
	this.cmd = 2;// 1: redo(add); 2: undo(remove);
};

PMModifyVariableCmd.prototype = new Command();

PMModifyVariableCmd.prototype = {
	update : function(entity) {
		this.newVariable = entity.clone(this.parent);
	},
	execute : function() {
		// Command.prototype.execute.call(this);
		this.parent.lastupdate = this.curProcLastupdate;
		map[this.parent.id].repaint();
		map[this.parent.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.parent.setVariable(this.oldVariable);
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.parent.setVariable(this.newVariable);
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Wait delay option change command
function PMDelayOptionChangeCmd(entity, parent, checked, owner) {
	this.name = "Delay option change";
	this.entity = entity;
	this.parent = parent; // editor handler
	this.owner = owner; // process object

	this.oldDelayOption = entity.specificDuration;
	this.newDelayOption = checked;
	this.curDelayOption = this.newDelayOption;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMDelayOptionChangeCmd.prototype = new Command();

PMDelayOptionChangeCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		this.entity.specificDuration = this.curDelayOption;
		if (this.curDelayOption) {
			this.parent.radioOption.checked = true;
			this.parent.setSpecific(true);
		} else {
			this.parent.radioOption1.checked = true;
			this.parent.setSpecific(false);
		}
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curDelayOption = this.oldDelayOption;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curDelayOption = this.newDelayOption;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Wait delay duration rule edit
function PMWaitDelayRuleEditCmd(entity, newrule, parent, owner) {
	this.name = "Delay duration rule edit";
	this.entity = entity; // transition
	this.parent = parent; // navigation rule edit panel
	this.owner = owner; // process object

	if (entity.timeRule != null) {
		this.oldTimeRule = entity.timeRule;
	} else {
		this.oldTimeRule = null;
	}
	this.newTimeRule = newrule;
	this.curTimeRule = this.newTimeRule;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMWaitDelayRuleEditCmd.prototype = new Command();

PMWaitDelayRuleEditCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		this.entity.timeRule = this.curTimeRule;
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curTimeRule = this.oldTimeRule;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		// load redo info ...
		this.curTimeRule = this.newTimeRule;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Change setting command
function PMValueChangedCmd(entity, propname, newvalue, owner) {
	this.name = "Value changed";
	this.entity = entity;
	this.propname = propname;
	this.owner = owner;

	this.oldValue = entity[propname];
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMValueChangedCmd.prototype = new Command();

PMValueChangedCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		this.entity[this.propname] = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Add assignment command
function PMCreateAssignmentCmd(subprocesspoint, newassignment, type, owner) {
	this.name = "Create new assignment";
	this.entity = subprocesspoint; // AssignTask / SubprocessPoint
	// assignment/subprocesInput/subprocessOutput
	this.assignment = newassignment;
	// 0: Add assignment;1: add subprocess input; 2: add subprocess output
	this.type = type;
	this.owner = owner; // process object

	var ts = new Date().getTime(); // 
	this.oldLastupdate = subprocesspoint.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;

	this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

PMCreateAssignmentCmd.prototype = new Command();

PMCreateAssignmentCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		if (this.cmd == 1) {
			if (this.type == 0) {
				this.entity.addAssignment(this.assignment);
			} else if (this.type == 1) {
				this.entity.addSubInput(this.assignment);
			} else if (this.type == 2) {
				this.entity.addSubOutput(this.assignment);
			}
		} else {
			if (this.type == 0) {
				this.entity.removeAssignment(this.assignment);
			} else if (this.type == 1) {
				this.entity.removeSubInput(this.assignment);
			} else if (this.type == 2) {
				this.entity.removeSubOutput(this.assignment);
			}
		}
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Remove assignment command
function PMRemoveAssignmentCmd(assignmentId, entity, type, owner) {
	this.name = "Remove an assignment";
	this.entity = entity; // assign task/subprocess point
	this.parent = owner; // process object

	// 0: Add assignment;1: add subprocess input; 2: add subprocess output
	this.type = type;

	// assign task/subprocess input/subprocess output
	if (this.type == 0) {
		this.assignment = entity.getAssignmentById(assignmentId);
	} else if (this.type == 1) {
		this.assignment = entity.getSubInputById(assignmentId);
	} else if (this.type == 2) {
		this.assignment = entity.getSubOutputById(assignmentId);
	}

	// --
	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.parent.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;

	this.cmd = 2;// 1: redo(add); 2: undo(remove);
};

PMRemoveAssignmentCmd.prototype = new Command();

PMRemoveAssignmentCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		if (this.cmd == 1) {
			if (this.type == 0) {
				this.entity.addAssignment(this.assignment);
			} else if (this.type == 1) {
				this.entity.addSubInput(this.assignment);
			} else if (this.type == 2) {
				this.entity.addSubOutput(this.assignment);
			}
		} else {
			if (this.type == 0) {
				this.entity.removeAssignment(this.assignment);
			} else if (this.type == 1) {
				this.entity.removeSubInput(this.assignment);
			} else if (this.type == 2) {
				this.entity.removeSubOutput(this.assignment);
			}

		}
		this.entity.lastupdate = this.curLastupdate;
		this.parent.lastupdate = this.curProcLastupdate;
		map[this.parent.id].repaint();
		map[this.parent.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.cmd = 1;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.cmd = 2;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},

};

// Modify assignment command
function PMModifyAssignmentCmd(assignment, task, type, mainprocess, subprocess) {
	this.name = "Modify an assignment";
	this.entity = task; // assign task/subprocess point
	this.mainprocess = mainprocess; // main process object
	this.subprocess = subprocess; // sub process object
	this.type = type;

	if (type == 0) { // assignment
		this.oldAssignment = assignment.clone(mainprocess);
	} else if (type == 1) { // subprocess input
		this.oldAssignment = assignment.clone(mainprocess);
	} else if (type == 2) { // subprocess output
		this.oldAssignment = assignment.clone(subprocess);
	}

	this.newAssignment = assignment;
	this.curAssignment = this.newAssignment;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = this.entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.mainprocess.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMModifyAssignmentCmd.prototype = new Command();

PMModifyAssignmentCmd.prototype = {
	update : function(assignment) {
		if (this.type == 0) {
			this.newAssignment = assignment.clone(this.mainprocess);
		} else if (this.type == 1) {
			this.newAssignment = assignment.clone(this.mainprocess);
		} else if (this.type == 2) {
			this.newAssignment = assignment.clone(this.subprocess);
		}
	},
	execute : function() {
		// Command.prototype.execute.call(this);
		if (this.type == 0) {
			this.entity.setAssignment(this.curAssignment);
		} else if (this.type == 1) {
			this.entity.setSubInput(this.curAssignment);
		} else if (this.type == 2) {
			this.entity.setSubOutput(this.curAssignment);
		}
		this.entity.lastupdate = this.curLastupdate;
		this.mainprocess.lastupdate = this.curProcLastupdate;
		map[this.mainprocess.id].repaint();
		map[this.mainprocess.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curAssignment = this.oldAssignment;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curAssignment = this.newAssignment;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},

};

// Synchronization changed command
function PMSynchronizationChangeCmd(entity, parent, checked, owner) {
	this.name = "Synchronization changed";
	this.entity = entity;
	this.panel = parent;
	this.owner = owner;

	this.oldSynchronized = entity.synchronised;
	this.newSynchronized = checked;
	this.curSynchronized = this.newSynchronized;

	var ts = new Date().getTime(); //
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMSynchronizationChangeCmd.prototype = new Command();

PMSynchronizationChangeCmd.prototype = {
	execute : function() {
		// Command.prototype.execute.call(this);
		this.entity.synchronised = this.curSynchronized;
		if (this.curSynchronized) {
			this.panel.radioOption.checked = true;
			this.panel.setPanelStatus(true);
		} else {
			this.panel.radioOption1.checked = true;
			this.panel.setPanelStatus(false);
		}
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curSynchronized = this.oldSynchronized;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curSynchronized = this.newSynchronized;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Subprocess changed
function PMSubprocessChangeCmd(task, newSubprocessId, newSubprocessName,
		mainprocess) {
	this.name = "Subprocess changed";
	this.entity = task;
	this.owner = mainprocess; // process object

	this.oldSubprocessName = this.entity.subprocessName;
	this.newSubprocessName = newSubprocessName;
	this.curSubprocessName = this.newSubprocessName;

	this.oldSubprocessId = this.entity.subprocessId;
	this.newSubprocessId = newSubprocessId;
	this.curSubprocessId = this.newSubprocessId;

	this.oldSubInputs = this.entity.subprocessInputs;
	this.newSubInputs = [];
	this.curSubInputs = this.newSubInputs;

	this.oldSubOutputs = this.entity.subprocessOutputs;
	this.newSubOutputs = [];
	this.curSubOutputs = this.newSubOutputs;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = this.entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMSubprocessChangeCmd.prototype = new Command();

PMSubprocessChangeCmd.prototype = {
	execute : function() {
		this.entity.subprocessId = this.curSubprocessId;
		this.entity.subprocessName = this.curSubprocessName;
		this.entity.subprocessInputs = this.curSubInputs;
		this.entity.subprocessOutputs = this.curSubOutputs;
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		this.curSubprocessId = this.oldSubprocessId;
		this.curSubprocessName = this.oldSubprocessName;
		this.curSubInputs = this.oldSubInputs;
		this.curSubOutputs = this.oldSubOutputs;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.curSubprocessId = this.newSubprocessId;
		this.curSubprocessName = this.newSubprocessName;
		this.curSubInputs = this.newSubInputs;
		this.curSubOutputs = this.newSubOutputs;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Parameter initial value changed
function PMParameterInitialValueChangedCmd(entity, paraname, newvalue, owner,
		paratype) {
	this.name = "Parameter initial value changed";
	this.entity = entity; // system task
	this.parameterName = paraname;
	this.owner = owner; // process object
	// 0: parameter; 1: extra parameter; 2: file parameter
	this.paratype = paratype;

	var para = null;
	if (this.paratype == 0) {
		para = entity.getPathParameterByName(paraname);
	} else if (this.paratype == 1) {
		para = entity.getFormParameterByName(paraname);
	} else if (this.paratype == 2) {

	}
	if (para != null && para.value != null) {
		this.oldValue = para.value;
	} else {
		this.oldValue = null;
	}
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMParameterInitialValueChangedCmd.prototype = new Command();

PMParameterInitialValueChangedCmd.prototype = {
	execute : function() {
		if (this.paratype == 0) {
			this.entity
					.setPathParameterValue(this.parameterName, this.curValue);
		} else if (this.paratype == 1) {
			this.entity
					.setFormParameterValue(this.parameterName, this.curValue);
		} else if (this.paratype == 2) {

		}
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// System task Java App service API changed
function PMSystemTaskAPIChangedCmd(entity, newapi, owner, servicetype,
		serviceid, servicename, haskey) {
	this.name = "System task API changed";
	this.entity = entity; // system task
	this.owner = owner; // process object
	// basic props
	this.oldAppServiceName = entity.appServiceName;
	this.oldAppServiceType = entity.appServiceType;
	this.oldAppServiceId = entity.appServiceId;
	this.oldHasSecurityAccessKey = entity.hasSecurityAccessKey;
	this.oldSecurityAccessKey = entity.securityAccessKey;

	this.newAppServiceName = servicename;
	this.newAppServiceType = servicetype;
	this.newAppServiceId = serviceid;
	this.newHasSecurityAccessKey = haskey;
	this.newSecurityAccessKey = null;

	this.curAppServiceName = this.newAppServiceName;
	this.curAppServiceType = this.newAppServiceType;
	this.curAppServiceId = this.newAppServiceId;
	this.curHasSecurityAccessKey = this.newHasSecurityAccessKey;
	this.curSecurityAccessKey = this.newSecurityAccessKey;
	// special props
	this.oldDeclaredClass = entity.declaredClass;
	this.oldDeclaredMethod = entity.declaredMethod;
	this.newDeclaredClass = newapi.declaringClassName;
	this.newDeclaredMethod = newapi.declaringMethodName;
	this.curDeclaredClass = this.newDeclaredClass;
	this.curDeclaredMethod = this.newDeclaredMethod;

	this.oldParameterString = entity.javaParameterString;
	this.oldParameters = entity.parameters;
	this.newParameterString = newapi.javaParameterString;
	this.newParameters = newapi.parameters;
	this.curParameterString = this.newParameterString;
	this.curParameters = this.newParameters;

	this.oldExtraParameterString = entity.extraParameterString;
	this.oldExtraParameters = entity.extraParameters;
	this.newExtraParameterString = null;
	this.newExtraParameters = null;
	this.curExtraParameterString = this.newExtraParameterString;
	this.curExtraParameters = this.newExtraParameters;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMSystemTaskAPIChangedCmd.prototype = new Command();

PMSystemTaskAPIChangedCmd.prototype = {
	execute : function() {
		this.entity.appServiceName = this.curAppServiceName;
		this.entity.appServiceType = this.curAppServiceType;
		this.entity.appServiceId = this.curAppServiceId;
		this.entity.hasSecurityAccessKey = this.curHasSecurityAccessKey;
		this.entity.securityAccessKey = this.curSecurityAccessKey;

		this.entity.apiName = this.curDeclaredClass;
		this.entity.apiMethod = this.curDeclaredMethod;
		this.entity.parameterString = this.curParameterString;
		this.entity.parameters = this.curParameters;

		this.entity.extraParameterString = this.curExtraParameterString;
		this.entity.extraParameters = this.curExtraParameters;

		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		this.curAppServiceName = this.oldAppServiceName;
		this.curAppServiceType = this.oldAppServiceType;
		this.curAppServiceId = this.oldAppServiceId;
		this.curHasSecurityAccessKey = this.oldHasSecurityAccessKey;
		this.curSecurityAccessKey = this.oldSecurityAccessKey;

		this.curDeclaredClass = this.oldDeclaredClass;
		this.curDeclaredMethod = this.oldDeclaredMethod;
		this.curParameterString = this.oldParameterString;
		this.curParameters = this.oldParameters;

		this.curExtraParameterString = this.oldExtraParameterString;
		this.curExtraParameters = this.oldExtraParameters;

		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.curAppServiceName = this.newAppServiceName;
		this.curAppServiceType = this.newAppServiceType;
		this.curAppServiceId = this.newAppServiceId;
		this.curHasSecurityAccessKey = this.newHasSecurityAccessKey;
		this.curSecurityAccessKey = this.newSecurityAccessKey;

		this.curDeclaredClass = this.newDeclaredClass;
		this.curDeclaredMethod = this.newDeclaredMethod;
		this.curParameterString = this.newParameterString;
		this.curParameters = this.newParameters;

		this.curExtraParameterString = this.newExtraParameterString;
		this.curExtraParameters = this.newExtraParameters;

		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// System task micro service setting changed
function PMSystemTaskWebAppChangedCmd(entity, newwas, owner, servicetype,
		serviceid, servicename, haskey) {
	this.name = "System task Web app changed";
	this.entity = entity; // system task
	this.owner = owner; // process object
	// basic props
	this.oldAppServiceName = entity.appServiceName;
	this.oldAppServiceType = entity.appServiceType;
	this.oldAppServiceId = entity.appServiceId;
	this.oldHasSecurityAccessKey = entity.hasSecurityAccessKey;
	this.oldSecurityAccessKey = entity.securityAccessKey;

	this.newAppServiceName = servicename;
	this.newAppServiceType = servicetype;
	this.newAppServiceId = serviceid;
	this.newHasSecurityAccessKey = haskey;
	this.newSecurityAccessKey = null;

	this.curAppServiceName = this.newAppServiceName;
	this.curAppServiceType = this.newAppServiceType;
	this.curAppServiceId = this.newAppServiceId;
	this.curHasSecurityAccessKey = this.newHasSecurityAccessKey;
	this.curSecurityAccessKey = this.newSecurityAccessKey;
	// special props
	this.oldParameterString = entity.pathParameterString;
	this.oldParameters = entity.pathParameters;
	this.newParameterString = null;
	this.newParameters = newwas.pathParams;
	this.curParameterString = this.newParameterString;
	this.curParameters = this.newParameters;

	this.oldExtraParameterString = entity.formParameterString;
	this.oldExtraParameters = entity.formParameters;
	this.newExtraParameterString = null;
	this.newExtraParameters = newwas.formParams;
	this.curExtraParameterString = this.newExtraParameterString;
	this.curExtraParameters = this.newExtraParameters;

	this.oldReParameterString = entity.returnString;
	this.oldReParameters = entity.returnObject;
	this.newReParameterString = null;
	this.newReParameters = newwas.returnObject;
	this.curReParameterString = this.newReParameterString;
	this.curReParameters = this.newReParameters;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMSystemTaskWebAppChangedCmd.prototype = new Command();

PMSystemTaskWebAppChangedCmd.prototype = {
	execute : function() {
		this.entity.appServiceName = this.curAppServiceName;
		this.entity.appServiceType = this.curAppServiceType;
		this.entity.appServiceId = this.curAppServiceId;
		this.entity.hasSecurityAccessKey = this.curHasSecurityAccessKey;
		this.entity.securityAccessKey = this.curSecurityAccessKey;

		this.entity.pathParameterString = this.curParameterString;
		this.entity.pathParameters = this.curParameters;
		this.entity.formParameterString = this.curExtraParameterString;
		this.entity.formParameters = this.curExtraParameters;
		this.entity.returnString = this.curReParameterString;
		this.entity.returnObject = this.curReParameters;

		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		this.curAppServiceName = this.oldAppServiceName;
		this.curAppServiceType = this.oldAppServiceType;
		this.curAppServiceId = this.oldAppServiceId;
		this.curHasSecurityAccessKey = this.oldHasSecurityAccessKey;
		this.curSecurityAccessKey = this.oldSecurityAccessKey;

		this.curParameterString = this.oldParameterString;
		this.curParameters = this.oldParameters;
		this.curExtraParameterString = this.oldExtraParameterString;
		this.curExtraParameters = this.oldExtraParameters;
		this.curReParameterString = this.oldReParameterString;
		this.curReParameters = this.oldReParameters;

		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.curAppServiceName = this.newAppServiceName;
		this.curAppServiceType = this.newAppServiceType;
		this.curAppServiceId = this.newAppServiceId;
		this.curHasSecurityAccessKey = this.newHasSecurityAccessKey;
		this.curSecurityAccessKey = this.newSecurityAccessKey;

		this.curParameterString = this.newParameterString;
		this.curParameters = this.newParameters;
		this.curExtraParameterString = this.newExtraParameterString;
		this.curExtraParameters = this.newExtraParameters;
		this.curReParameterString = this.newReParameterString;
		this.curReParameters = this.newReParameters;

		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// System task micro service changed
// function PMSystemTaskAppAgentChangedCmd(entity, appagent, owner) {
// 	this.name = "System task Micro Service changed";
// 	this.entity = entity; // system task
// 	this.owner = owner;
// 	this.oldToolAgentId = entity.toolAgentId;
// 	this.oldToolAgentName = entity.toolAgentName;
// 	this.oldDeclaredClass = entity.declaredClass;
// 	this.oldDeclaredMethod = entity.declaredMethod;
// 	this.oldParameterString = entity.parameterString;
// 	this.oldParameters = entity.parameters;
//
// 	this.newToolAgentId = appagent.id;
// 	this.newToolAgentName = appagent.name;
// 	if (appagent.apis.length > 0) {
// 		this.newDeclaredClass = appagent.apis[0].declaringClassName;
// 		this.newDeclaredMethod = appagent.apis[0].declaringMethodName;
// 		this.newParameterString = appagent.apis[0].parameterString;
// 		this.newParameters = appagent.apis[0].parameters;
// 	} else {
// 		this.newDeclaredClass = null;
// 		this.newDeclaredMethod = null;
// 		this.newParameterString = null;
// 		this.newParameters = null;
// 	}
//
// 	this.curToolAgentId = this.newToolAgentId;
// 	this.curToolAgentName = this.newToolAgentName;
// 	this.curDeclaredClass = this.newDeclaredClass;
// 	this.curDeclaredMethod = this.newDeclaredMethod;
// 	this.curParameterString = this.newParameterString;
// 	this.curParameters = this.newParameters;
//
// 	var ts = new Date().getTime(); //
// 	this.oldLastupdate = entity.lastupdate;
// 	this.newLastupdate = ts;
// 	this.curLastupdate = this.newLastupdate;
//
// 	this.oldProcLastupdate = this.owner.lastupdate;
// 	this.newProcLastupdate = ts;
// 	this.curProcLastupdate = this.newProcLastupdate;
// };
//
// PMSystemTaskAppAgentChangedCmd.prototype = new Command();
//
// PMSystemTaskAppAgentChangedCmd.prototype = {
// 	execute : function() {
// 		this.entity.toolAgentId = this.curToolAgentId;
// 		this.entity.toolAgentName = this.curToolAgentName;
// 		this.entity.declaredClass = this.curDeclaredClass;
// 		this.entity.declaredMethod = this.curDeclaredMethod;
// 		this.entity.parameterString = this.curParameterString;
// 		this.entity.parameters = this.curParameters;
// 		this.entity.lastupdate = this.curLastupdate;
// 		this.owner.lastupdate = this.curProcLastupdate;
// 		map[this.owner.id].repaint();
// 		map[this.owner.id].setPropertySheet();
// 	},
// 	undo : function() {
// 		// Command.prototype.undo.call(this);
// 		this.curToolAgentId = this.oldToolAgentId;
// 		this.curToolAgentName = this.oldToolAgentName;
// 		this.curDeclaredClass = this.oldDeclaredClass;
// 		this.curDeclaredMethod = this.oldDeclaredMethod;
// 		this.curParameterString = this.oldParameterString;
// 		this.curParameters = this.oldParameters;
// 		this.curLastupdate = this.oldLastupdate;
// 		this.curProcLastupdate = this.oldProcLastupdate;
// 		this.execute();
// 	},
// 	redo : function() {
// 		// Command.prototype.redo.call(this);
// 		this.curToolAgentId = this.newToolAgentId;
// 		this.curToolAgentName = this.newToolAgentName;
// 		this.curDeclaredClass = this.newDeclaredClass;
// 		this.curDeclaredMethod = this.newDeclaredMethod;
// 		this.curParameterString = this.newParameterString;
// 		this.curParameters = this.newParameters;
// 		this.curLastupdate = this.newLastupdate;
// 		this.curProcLastupdate = this.newProcLastupdate;
// 		this.execute();
// 	},
// };

// Change accessible variale list command
function PMAccessibleVarListChangedCmd(entity, owner) {
	this.name = "Accessible variable list changed";
	this.entity = entity;
	this.owner = owner;
	this.oldList = entity.accessibleVars;
	this.newList = null;
	this.curList = this.newList;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMAccessibleVarListChangedCmd.prototype = new Command();

PMAccessibleVarListChangedCmd.prototype = {
	update : function(newobjs) {
		this.newList = newobjs;
		this.curList = this.newList;
	},
	execute : function() {
		// Command.prototype.execute.call(this);
		this.entity.accessibleVars = this.curList;
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curList = this.oldList;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curList = this.newList;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Change participant list command
function PMParticipantListChangedCmd(entity, owner) {
	this.name = "Manual task participant list changed";
	this.entity = entity;
	this.owner = owner;

	this.oldList = entity.participants;
	this.newList = null;
	this.curList = this.newList;

	var ts = new Date().getTime();// 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMParticipantListChangedCmd.prototype = new Command();

PMParticipantListChangedCmd.prototype = {
	update : function(newobjs) {
		this.newList = newobjs;
		this.curList = this.newList;
	},
	execute : function() {
		// Command.prototype.execute.call(this);
		this.entity.participants = this.curList;
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curList = this.oldList;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curList = this.newList;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Change receiver list command on sms sending task or email sending task.
function PMReceiverListChangedCmd(entity, owner) {
	this.name = "Receiver list changed";
	this.entity = entity;
	this.owner = owner;

	this.oldList = entity.receivers;
	this.newList = null;
	this.curList = this.newList;

	var ts = new Date().getTime(); //
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMReceiverListChangedCmd.prototype = new Command();

PMReceiverListChangedCmd.prototype = {
	update : function(newobjs) {
		this.newList = newobjs;
		this.curList = this.newList;
	},
	execute : function() {
		// Command.prototype.execute.call(this);
		this.entity.receivers = this.curList;
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		// Command.prototype.undo.call(this);
		this.curList = this.oldList;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		// Command.prototype.redo.call(this);
		this.curList = this.newList;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Add bound command
function FMAddBoundCmd(entity, form, varid, comid, owner) {
	this.name = "Add form and variable bound command";

	this.entity = entity;
	this.owner = owner;

	this.accvariable = entity.fetchAccessibleVar(varid);
	this.component = form.seekObjectByID(comid);

	this.oldAc = this.component.ac;
	this.newAc = this.accvariable.accessControl;
	this.currAc = this.newAc;

	this.oldComponentId = this.accvariable.componentId;
	this.newComponentId = comid;
	this.currComponentId = this.newComponentId;

	this.oldVarId = this.component.varId;
	this.newVarId = varid;
	this.currVarId = this.newVarId;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

FMAddBoundCmd.prototype = new Command();

FMAddBoundCmd.prototype = {
	execute : function() {
		this.accvariable.componentId = this.currComponentId;
		this.component.varId = this.currVarId;
		this.component.ac = this.currAc;
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		this.currComponentId = this.oldComponentId;
		this.currVarId = this.oldVarId;
		this.currAc = this.oldAc;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.currComponentId = this.newComponentId;
		this.currVarId = this.newVarId;
		this.currAc = this.newAc;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Remove bound command
function FMRemoveBoundCmd(entity, av, com, owner) {
	this.name = "Remove form and variable bound command";

	this.entity = entity;
	this.owner = owner;

	this.av = av;
	this.com = com;

	if (this.av != null)
		this.oldComId = this.av.componentId;
	else
		this.oldComId = null;
	this.newComId = null;
	this.currComId = this.newComId;

	if (this.com != null)
		this.oldVarId = this.com.varId;
	else
		this.oldVarId = null;
	this.newVarId = null;
	this.currVarId = this.newVarId;

	if (this.com != null)
		this.oldAc = this.com.ac;
	else
		this.oldAc = null;
	this.newAc = null;
	this.currAc = this.newAc;

	var ts = new Date().getTime(); //
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

FMRemoveBoundCmd.prototype = new Command();

FMRemoveBoundCmd.prototype = {
	execute : function() {
		if (this.av != null)
			this.av.componentId = this.currComId;
		if (this.com != null) {
			this.com.varId = this.currVarId;
			this.com.ac = this.currAc;
		}
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		this.currComId = this.oldComId;
		this.currVarId = this.oldVarId;
		this.currAc = this.oldAc;

		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.currComId = this.newComId;
		this.currVarId = this.newVarId;
		this.currAc = this.newAc;

		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

// Change prop value setting command
function PMCKEditorCotentChangedCmd(entity, parent) {
	this.name = "Value changed";
	this.entity = entity;
	this.parent = parent;

	var ts = new Date().getTime(); //
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
	// editor.resetUndo();
};

PMCKEditorCotentChangedCmd.prototype = new Command();

PMCKEditorCotentChangedCmd.prototype = {
	execute : function() {
		this.entity.template = this.parent.editor.getData();
		this.entity.lastupdate = this.curLastupdate;
		if (map[this.entity.currOwner] != undefined) {
			map[this.entity.currOwner].setPropertySheet();
		}
	},
	undo : function() {
		//this.parent.editor.execCommand('undo');
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		//this.parent.editor.execCommand('redo');
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

//Change setting email template command
function PMEmailTemplateChangedCmd(entity, templ, owner) {
	this.name = "Value changed";
	this.entity = entity;
	this.owner = owner;
	
	this.oldSubject = entity.subject;
	this.newSubject = templ.emailSubject;
	this.curSubject = this.newSubject;

	this.oldTemplateId = entity.templateId;
	this.newTemplateId = templ.id;
	this.curTemplateId = this.newTemplateId;
	
	this.oldTemplate = entity.template;
	this.newTemplate = templ.emailContent;
	this.curTemplate = this.newTemplate;
	
	this.oldVariables = entity.variables;
	this.newVariables = null;
	this.curVariables = this.newVariables;
	
	this.oldAttachments = entity.attachments;
	this.newAttachments = templ.attachments;
	this.curAttachments = this.newAttachments;

	var ts = new Date().getTime(); //
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMEmailTemplateChangedCmd.prototype = new Command();

PMEmailTemplateChangedCmd.prototype = {
	execute : function() {
		this.entity.templateId = this.curTemplateId;
		this.entity.subject = this.curSubject;
		this.entity.template = this.curTemplate;
		this.entity.variables = this.curVariables;
		this.entity.attachments = this.curAttachments;
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		this.curTemplateId = this.oldTemplateId;
		this.curSubject = this.oldSubject;
		this.curTemplate = this.oldTemplate;
		this.curVariables = this.oldVariables;
		this.curAttachments = this.oldAttachments;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.curTemplateId = this.newTemplateId;
		this.curSubject = this.newSubject;
		this.curTemplate = this.newTemplate;
		this.curVariables = this.newVariables;
		this.curAttachments = this.newAttachments;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};


// Edited email template command
function PMEmailTemplateEditedCmd(entity, newentity, owner) {
	this.name = "Email template changed";
	this.entity = entity;
	this.owner = owner;
	
	this.oldSubject = entity.subject;
	this.newSubject = newentity.subject;
	this.curSubject = this.newSubject;
	
	this.oldTemplate = entity.template;
	this.newTemplate = newentity.template;
	this.curTemplate = this.newTemplate;
	
	this.oldVariables = entity.variables;
	this.newVariables = newentity.variables;
	this.curVariables = this.newVariables;
	
	this.oldAttachments = entity.attachments;
	this.newAttachments = newentity.attachments;
	this.curAttachments = this.newAttachments;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMEmailTemplateEditedCmd.prototype = new Command();

PMEmailTemplateEditedCmd.prototype = {
	execute : function() {
		this.entity.subject = this.curSubject;
		this.entity.template = this.curTemplate;
		this.entity.variables = this.curVariables;
		this.entity.attachments = this.curAttachments;
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		this.curSubject = this.oldSubject;
		this.curTemplate = this.oldTemplate;
		this.curVariables = this.oldVariables;
		this.curAttachments = this.oldAttachments;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.curSubject = this.newSubject;
		this.curTemplate = this.newTemplate;
		this.curVariables = this.newVariables;
		this.curAttachments = this.newAttachments;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};

//Change setting SMS template command
function PMSMSTemplateChangedCmd(entity, templ, owner) {
	this.name = "Template value changed";
	this.entity = entity;
	this.owner = owner;
	
	this.oldTemplateId = entity.templateId;
	this.newTemplateId = templ.id;
	this.curTemplateId = this.newTemplateId;
	
	this.oldTemplate = entity.template;
	this.newTemplate = templ.smsContent;
	this.curTemplate = this.newTemplate;

	var ts = new Date().getTime(); // 
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.oldProcLastupdate = this.owner.lastupdate;
	this.newProcLastupdate = ts;
	this.curProcLastupdate = this.newProcLastupdate;
};

PMSMSTemplateChangedCmd.prototype = new Command();

PMSMSTemplateChangedCmd.prototype = {
	execute : function() {
		this.entity.templateId = this.curTemplateId;
		this.entity.template = this.curTemplate;
		this.entity.lastupdate = this.curLastupdate;
		this.owner.lastupdate = this.curProcLastupdate;
		map[this.owner.id].repaint();
		map[this.owner.id].setPropertySheet();
	},
	undo : function() {
		this.curTemplateId = this.oldTemplateId;
		this.curTemplate = this.oldTemplate;
		this.curLastupdate = this.oldLastupdate;
		this.curProcLastupdate = this.oldProcLastupdate;
		this.execute();
	},
	redo : function() {
		this.curTemplateId = this.newTemplateId;
		this.curTemplate = this.newTemplate;
		this.curLastupdate = this.newLastupdate;
		this.curProcLastupdate = this.newProcLastupdate;
		this.execute();
	},
};
