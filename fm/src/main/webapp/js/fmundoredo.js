// rename
function FMRenameCmd(entity, newname) {
    this.name = "Rename form command";
    this.entity = entity; // form
    this.oldname = entity.name;
    this.newname = Utils.stringify(newname);
    this.curName = this.newname;
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;
};

FMRenameCmd.prototype = new Command();

FMRenameCmd.prototype = {
    execute: function () {
        // Command.prototype.execute.call(this);
        if (this.entity != null) {
            this.entity.name = Utils.parse(this.curName);
            this.entity.lastupdate = this.curLastupdate;
            var that = this;
            // update tab name
            $(".nav-tabs").children('li').each(function (entry) {
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
            if (this.entity instanceof Reference) {
                $('#detailtree' + this.entity.id).jstree('deselect_all', true);
                $('#detailtree' + this.entity.id).jstree('select_node', this.entity.id);
                var inst = $('#detailtree' + this.entity.id).jstree();
                var p = inst.get_selected(true)[0];
                p.text = Utils.parse(this.curName); // tree
                inst.redraw(true);
            }
        }
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        this.curName = this.oldname;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        this.curName = this.newname;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Change setting command
function FMValueChangedCmd(entity, propname, newvalue, owner) {
    this.name = "Value changed command";
    this.entity = entity;
    this.propname = propname;
    this.owner = owner;

    this.oldValue = entity[propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    var ts = new Date().getTime();
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = ts;
    this.curLastupdate = this.newLastupdate;

};

FMValueChangedCmd.prototype = new Command();

FMValueChangedCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = this.curValue;
        this.entity.lastupdate = this.curLastupdate;
        if (this.entity.updateDom)
            this.entity.updateDom();
        map[this.owner.id].setPropertySheet();
    },
    undo: function () {
        this.curValue = this.oldValue;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.curValue = this.newValue;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Change setting of value of UI component on Form
// entity : UI Form component
// propname : property name in entity
// newvalue : new value of property of entity
// owner : form ID.
function FMUIValueChangedCmd(entity, propname, newvalue, owner) {
    this.name = "Value changed command";
    this.entity = entity;
    this.propname = propname;
    this.owner = owner;

    this.oldValue = entity[propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    var ts = new Date().getTime();
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = ts;
    this.curLastupdate = this.newLastupdate;

};

FMUIValueChangedCmd.prototype = new Command();

FMUIValueChangedCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = this.curValue;
        this.entity.lastupdate = this.curLastupdate;
        if (this.entity.updateDom)
            this.entity.updateDom();
        map[this.owner].setPropertySheet();
    },
    undo: function () {
        this.curValue = this.oldValue;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.curValue = this.newValue;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Change setting command
function FMRuleValueChangedCmd(entity, propname, newvalue, currOwner, owner) {
    this.name = "Rule value changed command";
    this.entity = entity; // rule
    this.propname = propname; // rule props
    this.currOwner = currOwner; // UI component
    this.owner = owner; // form object

    this.oldValue = entity[propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    var ts = new Date().getTime();
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = ts;
    this.curLastupdate = this.newLastupdate;

};

FMRuleValueChangedCmd.prototype = new Command();

FMRuleValueChangedCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = this.curValue;
        this.entity.lastupdate = this.curLastupdate;
        this.currOwner.updateDom();
        map[this.owner.id].setPropertySheet();
    },
    undo: function () {
        this.curValue = this.oldValue;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.curValue = this.newValue;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

function FMInsertBeforeLayoutNodeCmd(entity, newchild, siblingId) {
    this.name = "Insert before layout row node command";
    this.entity = entity;
    this.newchild = newchild;
    this.siblingId = siblingId;

    if (this.entity instanceof Form) {
        this.oldLastupdate = entity.lastupdate;
        this.newLastupdate = new Date().getTime();
        this.curLastupdate = this.newLastupdate;
    } else if (this.entity instanceof Column) {
        this.oldLastupdate = map[this.entity.currOwner].currObject.lastupdate;
        this.newLastupdate = new Date().getTime();
        this.curLastupdate = this.newLastupdate;
    }

    this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

FMInsertBeforeLayoutNodeCmd.prototype = new Command();

FMInsertBeforeLayoutNodeCmd.prototype = {
    execute: function () {
        if (this.entity instanceof Form) {
            if (this.cmd == 1) {
                this.entity.insertChild(this.newchild, this.siblingId);
                map[this.entity.id].selected = this.newchild;
            } else {
                this.entity.removeChild(this.newchild);
                map[this.entity.id].selected = null;
            }
            this.entity.lastupdate = this.curLastupdate;
            map[this.entity.id].updateDom();
            map[this.entity.id].setPropertySheet();
        } else if (this.entity instanceof Column) {
            if (this.cmd == 1) {
                this.entity.insertChild(this.newchild, this.siblingId);
                map[this.entity.currOwner].selected = this.newchild;
            } else {
                this.entity.removeChild(this.newchild);
                map[this.entity.currOwner].selected = null;
            }
            map[this.entity.currOwner].currObject.lastupdate = this.curLastupdate;
            map[this.entity.currOwner].updateDom();
            map[this.entity.currOwner].setPropertySheet();
        }
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// newchild can be any UI component except that Form component
function FMAppendNodeCmd(entity, newchild) {
    this.name = "Append UI Component node command";

    this.entity = entity;
    this.newchild = newchild;

    if (this.entity instanceof Form) {
        this.oldLastupdate = entity.lastupdate;
        this.newLastupdate = new Date().getTime();
        this.curLastupdate = this.newLastupdate;
    } else if (this.entity instanceof Column) {
        this.oldLastupdate = map[this.entity.currOwner].currObject.lastupdate;
        this.newLastupdate = new Date().getTime();
        this.curLastupdate = this.newLastupdate;
    }

    this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

FMAppendNodeCmd.prototype = new Command();

FMAppendNodeCmd.prototype = {
    execute: function () {
        if (this.entity instanceof Form) {
            if (this.cmd == 1) {
                this.entity.addChild(this.newchild);
                map[this.entity.id].selected = this.newchild;
            } else {
                this.entity.removeChild(this.newchild);
                map[this.entity.id].selected = null;
            }
            this.entity.lastupdate = this.curLastupdate;
            map[this.entity.id].updateDom();
            map[this.entity.id].setPropertySheet();
        } else if (this.entity instanceof Column) {
            if (this.cmd == 1) {
                this.entity.addChild(this.newchild);
                map[this.entity.currOwner].selected = this.newchild;
            } else {
                this.entity.removeChild(this.newchild);
                map[this.entity.currOwner].selected = null;
            }
            map[this.entity.currOwner].currObject.lastupdate = this.curLastupdate;
            map[this.entity.currOwner].updateDom();
            map[this.entity.currOwner].setPropertySheet();
        }
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

function FMMoveBeforeLayoutNodeCmd(newparent, movedId, siblingId, owner) {
    this.name = "Move layout row node before command";

    this.moved = owner.seekObjectByID(movedId);
    this.oldParent = owner.seekObjectByID(this.moved.parent);
    this.oldSiblingId = null;
    if (this.moved.dom.nextSibling != undefined
        && this.moved.dom.nextSibling != null) {
        this.oldSiblingId = this.moved.dom.nextSibling.id;
    }
    this.newparent = newparent;
    this.siblingId = siblingId;
    this.owner = owner;

    var ts = new Date().getTime();
    this.oldLastupdate = owner.lastupdate;
    this.newLastupdate = ts;
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(move); 2: undo(recover);
};

FMMoveBeforeLayoutNodeCmd.prototype = new Command();

FMMoveBeforeLayoutNodeCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.oldParent.removeChild(this.moved);
            this.newparent.insertChild(this.moved, this.siblingId);
            map[this.owner.id].selected = this.moved;
        } else {
            this.newparent.removeChild(this.moved);
            if (this.oldSiblingId == null) {
                this.oldParent.addChild(this.moved);
            } else {
                this.oldParent.insertChild(this.moved, this.oldSiblingId);
            }
            map[this.owner.id].selected = null;
        }
        this.owner.lastupdate = this.curLastupdate;
        this.moved.updateDom();
        map[this.owner.id].updateDom();
        map[this.owner.id].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

function FMMoveLayoutNodeCmd(newparent, movedId, owner) {
    this.name = "Move layout row node command";
    this.moved = owner.seekObjectByID(movedId);
    this.oldParent = owner.seekObjectByID(this.moved.parent);
    this.oldSiblingId = null;
    if (this.moved.dom.nextSibling != undefined
        && this.moved.dom.nextSibling != null) {
        this.oldSiblingId = this.moved.dom.nextSibling.id;
    }
    this.newparent = newparent;
    this.owner = owner;

    var ts = new Date().getTime();
    this.oldLastupdate = owner.lastupdate;
    this.newLastupdate = ts;
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(move); 2: undo(recover);
};

FMMoveLayoutNodeCmd.prototype = new Command();

FMMoveLayoutNodeCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.oldParent.removeChild(this.moved);
            this.newparent.addChild(this.moved);
            map[this.owner.id].selected = this.moved;
        } else {
            this.newparent.removeChild(this.moved);
            if (this.oldSiblingId == null) {
                this.oldParent.addChild(this.moved);
            } else {
                this.oldParent.insertChild(this.moved, this.oldSiblingId);
            }
            map[this.owner.id].selected = null;
        }
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.id].updateDom();
        map[this.owner.id].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Remove row command
function FMRemoveRowCmd(rowId, owner) {
    this.name = "Remove UI Component command";
    this.removed = owner.seekObjectByID(rowId);
    this.parent = owner.seekObjectByID(this.removed.parent);
    this.siblingId = null;
    if (this.removed.dom.nextSibling != undefined
        && this.removed.dom.nextSibling != null) {
        this.siblingId = this.removed.dom.nextSibling.id;
    }
    this.owner = owner;

    this.oldLastupdate = owner.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(remove); 2: undo(add);
};

FMRemoveRowCmd.prototype = new Command();

FMRemoveRowCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.parent.removeChild(this.removed);
        } else if (this.cmd == 2) {
            if (this.siblingId == null) {
                this.parent.addChild(this.removed);
            } else {
                this.parent.insertChild(this.removed, this.siblingId);
            }
        }
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.id].updateDom();
        map[this.owner.id].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Remove all row command
function FMRemoveAllRowsCmd(owner) {
    this.name = "Remove all rows command";
    this.owner = owner;
    this.oldChildren = owner.children;

    this.oldLastupdate = owner.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(remove); 2: undo(add);
};

FMRemoveAllRowsCmd.prototype = new Command();

FMRemoveAllRowsCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.owner.removeAllChildren();
            map[this.owner.id].disableButton(map[this.owner.id].deletebutton);
        } else if (this.cmd == 2) {
            for (var i = 0; i < this.oldChildren.length; i++) {
                this.owner.children.push(this.oldChildren[i]);
                this.owner.dom.appendChild(this.oldChildren[i].dom);
            }
            map[this.owner.id].enableButton(map[this.owner.id].deletebutton);
        }
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.id].updateDom();
        map[this.owner.id].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Change prepend command
function FMChangePrependCmd(entity, newPendType, owner, pane) {
    this.name = "Change prepend command";
    this.entity = entity;
    this.owner = owner;

    this.oldPendType = entity.prependType;
    this.newPendType = newPendType;
    this.curPendType = this.newPendType;
    this.pane = pane;

    this.oldLastupdate = owner.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;
};

FMChangePrependCmd.prototype = new Command();

FMChangePrependCmd.prototype = {
    execute: function () {
        this.entity.prependType = this.curPendType;
        this.pane.update("prepend", this.curPendType);
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.id].selected = this.entity;
        this.entity.updateDom();
        map[this.owner.id].setPropertySheet();
    },
    undo: function () {
        this.curPendType = this.oldPendType;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.curPendType = this.newPendType;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Change append command
function FMChangeAppendCmd(entity, newPendType, owner, pane) {
    this.name = "Change append command";
    this.entity = entity;
    this.owner = owner;
    this.oldPendType = entity.appendType;
    this.newPendType = newPendType;
    this.curPendType = this.newPendType;
    this.pane = pane;

    this.oldLastupdate = owner.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;
};

FMChangeAppendCmd.prototype = new Command();

FMChangeAppendCmd.prototype = {
    execute: function () {
        this.entity.appendType = this.curPendType;
        this.pane.update("append", this.curPendType);
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.id].selected = this.entity;
        this.entity.updateDom();
        map[this.owner.id].setPropertySheet();
    },
    undo: function () {
        this.curPendType = this.oldPendType;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.curPendType = this.newPendType;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

function FMCreateRuleCmd(entity, newchild, rowIndex) {
    this.name = "Create new rule command";

    this.entity = entity; // UI Component
    this.newchild = newchild; // New rule
    this.rowIndex = rowIndex;

    this.oldLastupdate = map[this.entity.currOwner].currObject.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

FMCreateRuleCmd.prototype = new Command();

FMCreateRuleCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            if (this.rowIndex > 0)
                this.entity.insertRule(this.newchild, this.rowIndex);
            else
                this.entity.addRule(this.newchild);
        } else {
            this.entity.removeRule(this.newchild);
        }
        map[this.entity.currOwner].currObject.lastupdate = this.curLastupdate;
        map[this.entity.currOwner].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

function FMRemoveRuleCmd(entity, newchild, rowIndex) {
    this.name = "Create new rule command";

    this.entity = entity; // UI Component
    this.newchild = newchild; // New rule
    this.rowIndex = rowIndex;

    this.oldLastupdate = map[this.entity.currOwner].currObject.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(remove); 2: undo(add);
};

FMRemoveRuleCmd.prototype = new Command();

FMRemoveRuleCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.entity.removeRule(this.newchild);
        } else {
            if (this.rowIndex > 0)
                this.entity.insertRule(this.newchild, this.rowIndex - 1);
            else
                this.entity.addRule(this.newchild);
        }
        map[this.entity.currOwner].currObject.lastupdate = this.curLastupdate;
        map[this.entity.currOwner].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

function FMRorderUpRuleCmd(entity, rowIndex) {
    this.name = "Reorder up rule command";

    this.entity = entity; // UI Component
    for (var i = 0; i < entity.rules.length; i++) {
        if (i + 1 == rowIndex) {
            this.child = entity.rules[i]; // reorder rule
            break;
        }
    }
    this.rowIndex = rowIndex;

    this.oldLastupdate = map[this.entity.currOwner].currObject.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(up); 2: undo(recover);
};

FMRorderUpRuleCmd.prototype = new Command();

FMRorderUpRuleCmd.prototype = {
    execute: function () {
        this.entity.removeRule(this.child);
        if (this.cmd == 1) {
            this.entity.insertRule(this.child, this.rowIndex - 2);
        } else {
            this.entity.insertRule(this.child, this.rowIndex);
        }
        map[this.entity.currOwner].currObject.lastupdate = this.curLastupdate;
        map[this.entity.currOwner].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2; // up
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1; // recover
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

function FMRorderDownRuleCmd(entity, rowIndex) {
    this.name = "Reorder up rule command";

    this.entity = entity; // UI Component
    for (var i = 0; i < entity.rules.length; i++) {
        if (i + 1 == rowIndex) {
            this.child = entity.rules[i]; // reorder rule
            break;
        }
    }
    this.rowIndex = rowIndex;

    this.oldLastupdate = map[this.entity.currOwner].currObject.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(up); 2: undo(recover);
};

FMRorderDownRuleCmd.prototype = new Command();

FMRorderDownRuleCmd.prototype = {
    execute: function () {
        this.entity.removeRule(this.child);
        if (this.cmd == 1) {
            this.entity.insertRule(this.child, this.rowIndex + 1);
        } else {
            this.entity.insertRule(this.child, this.rowIndex - 1);
        }
        map[this.entity.currOwner].currObject.lastupdate = this.curLastupdate;
        map[this.entity.currOwner].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2; // up
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1; // recover
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

function FMAddReferenceCmd(entity, map, newchild) {
    this.name = "Add reference command";

    this.entity = entity; // reference
    this.map = map; // new detail list
    this.newchild = newchild; // reference detail

    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

FMAddReferenceCmd.prototype = new Command();

FMAddReferenceCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.map[this.newchild.id] = this.newchild;
            map[this.entity.id].addNewDetailToTree(this.newchild);
            map[this.entity.id].fillDetail(this.newchild);
            map[this.entity.id].enableInputs(true);
        } else {
            delete this.map[this.newchild.id];
            map[this.entity.id].removeNewDetailFromTree(this.newchild);
            map[this.entity.id].fillDetail(null);
            map[this.entity.id].enableInputs(false);
        }
        this.entity.lastupdate = this.curLastupdate;
        map[this.entity.id].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Reference detail updated command
function FMReferenceDetailUpdatedCmd(entity, propname, newvalue, owner) {
    this.name = "Reference detail changed command";
    this.entity = entity;
    this.propname = propname;
    this.owner = owner;

    this.oldValue = entity[propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    var ts = new Date().getTime();
    this.oldLastupdate = owner.lastupdate;
    this.newLastupdate = ts;
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(updated); 2: undo(recover);
};

FMReferenceDetailUpdatedCmd.prototype = new Command();

FMReferenceDetailUpdatedCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = this.curValue;
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.id].fillDetail(this.entity);
        map[this.owner.id].enableInputs(true);
        map[this.owner.id].setPropertySheet();
        if (this.cmd == 1) {
            if (map[this.owner.id].newlist[this.entity.id] == null) {
                map[this.owner.id].updatedlist[this.entity.id] = this.entity;
            }
        }
        if (this.propname == "code") {
            map[this.owner.id].updateDetailCode(this.entity.id, this.curValue);
        }
        if (this.propname == "name") {
            map[this.owner.id].updateDetailName(this.entity.id, this.curValue);
        }
    },
    undo: function () {
        this.cmd = 2;
        this.curValue = this.oldValue;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curValue = this.newValue;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

function FMRemoveReferenceCmd(entity, child) {
    this.name = "Remove reference command";

    this.entity = entity; // reference
    this.child = child; // reference detail

    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(remove); 2: undo(remove);
    this.source = -1;
};

FMRemoveReferenceCmd.prototype = new Command();

FMRemoveReferenceCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            if (map[this.entity.id].newlist[this.child.id] != null) {
                delete map[this.entity.id].newlist[this.child.id];
                this.source = 1;
            } else if (map[this.entity.id].updatedlist[this.child.id] != null) {
                delete map[this.entity.id].updatedlist[this.child.id];
                this.source = 2;
            } else {
                map[this.entity.id].removedlist[this.child.id] = this.child;
            }
            map[this.entity.id].removeNewDetailFromTree(this.child);
            map[this.entity.id].fillDetail(null);
            map[this.entity.id].enableInputs(false);

        } else {
            if (this.source == 1) {
                map[this.entity.id].newlist[this.child.id] = this.child;
            } else if (this.source == 2) {
                map[this.entity.id].updatedlist[this.child.id] = this.child;
            } else {
                delete map[this.entity.id].removedlist[this.child.id];
            }
            map[this.entity.id].addNewDetailToTree(this.child);
            map[this.entity.id].fillDetail(this.child);
            map[this.entity.id].enableInputs(true);

        }
        this.entity.lastupdate = this.curLastupdate;
        map[this.entity.id].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// rename
function FMReferenceRenameCmd(entity, newname) {
    this.name = "Rename reference command";
    this.entity = entity; // form
    this.oldname = entity.name;
    this.newname = Utils.stringify(newname);
    this.curName = this.newname;
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;
};

FMReferenceRenameCmd.prototype = new Command();

FMReferenceRenameCmd.prototype = {
    execute: function () {
        // Command.prototype.execute.call(this);
        if (this.entity != null) {
            this.entity.name = Utils.parse(this.curName);
            this.entity.lastupdate = this.curLastupdate;
            var that = this;
            // update tab name
            $(".nav-tabs").children('li').each(function (entry) {
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

            var instance1 = $("#detailtree" + this.entity.id).jstree();
            $("#detailtree" + this.entity.id).jstree('select_node',
                this.entity.id);
            var p = instance1.get_selected(true)[0];
            p.text = Utils.parse(this.curName); // tree
            instance1.redraw(true);
        }
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        this.curName = this.oldname;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        this.curName = this.newname;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Remove check/radio command
function FMRemoveCheckRadioCmd(comId, owner) {
    this.name = "Remove check/radio command";
    this.removed = owner.seekObjectByID(comId);
    this.parent = owner.seekObjectByID(this.removed.parent);
    this.siblingId = null;
    if (this.removed.dom.nextSibling != undefined
        && this.removed.dom.nextSibling != null) {
        this.siblingId = this.removed.dom.nextSibling.id;
    }
    this.owner = owner;

    this.oldLastupdate = owner.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(remove); 2: undo(add);
};

FMRemoveCheckRadioCmd.prototype = new Command();

FMRemoveCheckRadioCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.parent.removeChild(this.removed);
        } else if (this.cmd == 2) {
            if (this.siblingId == null) {
                this.parent.addChild(this.removed);
            } else {
                this.parent.insertChild(this.removed, this.siblingId);
            }
        }
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.id].updateDom();
        map[this.owner.id].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

//Add check/radio command
function FMAddCheckRadioCmd(check, parent, owner) {
    this.name = "Add check/radio command";
    this.added = check;
    this.parent = parent;
    this.owner = owner;

    this.oldLastupdate = owner.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

FMAddCheckRadioCmd.prototype = new Command();

FMAddCheckRadioCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.parent.addChild(this.added);
        } else if (this.cmd == 2) {
            this.parent.removeChild(this.added);
        }
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.id].updateDom();
        map[this.owner.id].setPropertySheet();
    },
    undo: function () {
        this.cmd = 2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.cmd = 1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

//Add check/radio command
// function FMAddCheckRadioCmd(checks, parent, owner) {
//     this.name = "Add check/radio command";
//     this.added = checks;
//     this.parent = parent;
//     this.owner = owner;
//
//     this.oldLastupdate = owner.lastupdate;
//     this.newLastupdate = new Date().getTime();
//     this.curLastupdate = this.newLastupdate;
//
//     this.cmd = 1;// 1: redo(add); 2: undo(remove);
// };
//
// FMAddCheckRadioCmd.prototype = new Command();
//
// FMAddCheckRadioCmd.prototype = {
//     execute: function () {
//         if (this.cmd == 1) {
//             if (this.added != null && this.added.length > 0) {
//                 for (var i = 0; i < this.added.length; i++) {
//                     this.parent.addChild(this.added[i]);
//                 }
//             }
//         } else if (this.cmd == 2) {
//             if (this.added != null && this.added.length > 0) {
//                 for (var i = 0; i < this.added.length; i++) {
//                     this.parent.removeChild(this.added[i]);
//                 }
//             }
//         }
//         this.owner.lastupdate = this.curLastupdate;
//         map[this.owner.id].setPropertySheet();
//     },
//     undo: function () {
//         this.cmd = 2;
//         this.curLastupdate = this.oldLastupdate;
//         this.execute();
//     },
//     redo: function () {
//         this.cmd = 1;
//         this.curLastupdate = this.newLastupdate;
//         this.execute();
//     },
// };