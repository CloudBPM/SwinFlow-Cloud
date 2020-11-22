/**
 * Undo / redo command for organization editing
 */
// Create new department/division/project command
function OMCreateDepartmentCmd(entity, selected, owner) {
    this.name = "Create department/division/project team";
    this.entity = entity;
    this.selected = selected;
    this.owner = owner;
    this.oldEditorStatus = map[this.owner.id].editorStatus;
    this.newEditorStatus = 3;
    this.curEditorStatus = this.newEditorStatus;

    this.oldOrgLastupdate = this.owner.lastupdate;
    this.newOrgLastupdate = new Date().getTime();// Utils.getCurrentDateTime();
    this.curOrgLastupdate = this.newOrgLastupdate;

    this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

OMCreateDepartmentCmd.prototype = new Command();

OMCreateDepartmentCmd.prototype = {
    execute: function () {
        // Command.prototype.execute.call(this);
        var instance = $('#treeview').jstree();
        if (this.cmd == 1) { // redo
            if (this.selected.length == 1) {
                var parent = this.selected[0];
                this.selected.splice(0, 1);
                this.entity.setParent(parent);// set parent
                parent.addChild(this.entity); // add into parent
                parent.setSelected(false);// deselect parent

                this.entity.setSelected(true);
                this.selected.push(this.entity); // put into selection array

                // create a tree view node
                var node = {
                    id: this.entity.id,
                    text: Utils.parse(this.entity.name),
                    data: "3|" + this.entity.owner + "|"
                        + this.entity.classtypename,
                    icon: "glyphicon glyphicon-folder-open",
                }; // parent: data.parent.id,

                // var parent = instance.get_selected(true)[0];
                var parentNode = instance.get_node(parent.id);
                instance.create_node(parentNode, node, "last");
                instance.redraw(true);
                $('#treeview').jstree('deselect_all', true);
                $('#treeview').jstree('select_node', this.entity.id);

            } else {
                // root depart, parent is null
                this.owner.addChild(this.entity); // add into parent

                this.entity.setSelected(true);
                this.selected.push(this.entity);
                var parentNode = instance.get_node(this.owner.id + "S");

                var node = {
                    id: this.entity.id,
                    text: Utils.parse(this.entity.name),
                    data: "3|" + this.entity.owner + "|"
                        + this.entity.classtypename,
                    icon: "glyphicon glyphicon-folder-open",
                }; // parent: data.parent.id,
                // var parent = instance.get_selected(true)[0];
                instance.create_node(parentNode, node, "last");
                instance.redraw(true);
                $('#treeview').jstree('deselect_all', true);
                $('#treeview').jstree('select_node', this.entity.id);

            }
        } else { // undo
            var parent = this.entity.parent;
            if (parent != null) {
                parent.removeChild(this.entity);
                parent.setSelected(true);// reselect parent
                // remove entity from selection array
                if (this.selected.length > 0) {
                    for (var j = 0; j < this.selected.length; j++) {
                        if (this.entity.id == this.selected[j].id) {
                            this.selected.splice(j, 1);
                            break;
                        }
                    }
                }
                this.entity.setSelected(false);
                this.selected.push(parent); // put into selection array

                var p = $('#treeview').jstree('get_node', this.entity.id);
                $('#treeview').jstree('delete_node', p);
                $('#treeview').jstree('select_node', parent.id);
                instance.redraw(true); // refresh
            } else {
                this.owner.removeChild(this.entity);
                this.entity.setSelected(false);
                // remove entity from selection array
                if (this.selected.length > 0) {
                    for (var j = 0; j < this.selected.length; j++) {
                        if (this.entity.id == this.selected[j].id) {
                            this.selected.splice(j, 1);
                            break;
                        }
                    }
                }
                var parentNode = instance.get_node(this.owner.id + "S");
                var p = $('#treeview').jstree('get_node', this.entity.id);
                $('#treeview').jstree('delete_node', p);
                $('#treeview').jstree('select_node', parentNode.id);
                instance.redraw(true); // refresh
            }

        }
        map[this.owner.id].selected = this.selected;
        this.owner.lastupdate = this.curOrgLastupdate;
        map[this.owner.id].repaint();
        map[this.owner.id].setPropertySheet();
        map[this.owner.id].setButtonStatus(this.editorstatus);
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        // load undo info ...
        this.cmd = 2;
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.oldOrgLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        // load redo info ...
        this.cmd = 1;
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.newOrgLastupdate;
        this.execute();
    },
};

// Change department parent command
function OMChangeParentCmd(selected, owner) {
    this.name = "Change paren of department/division/project team";
    this.changeParents = [];
    this.owner = owner;
    this.oldSelected = map[this.owner.id].cloneSelected(selected);
    this.newSelected = null;
    this.curSelected = this.newSelected;

    this.oldEditorStatus = map[this.owner.id].editorStatus;
    this.newEditorStatus = 2;
    this.curEditorStatus = this.newEditorStatus;

    this.oldOrgLastupdate = this.owner.lastupdate;
    this.newOrgLastupdate = new Date().getTime();// Utils.getCurrentDateTime();
    this.curOrgLastupdate = this.newOrgLastupdate;
};

OMChangeParentCmd.prototype = new Command();

OMChangeParentCmd.prototype = {
    update: function (selected) {
        this.newSelected = map[this.owner.id].cloneSelected(selected);
        if (selected.length > 0) {
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].input != null) {
                    var m = {
                        x: selected[i].input.x0,
                        y: selected[i].input.y0
                    };
                    var newparent = map[this.owner.id].lookupObjects(m,
                        this.owner.children);
                    if (newparent != null
                        && newparent.id != selected[i].input.source.id) {
                        var p = {
                            newp: newparent,
                            oldp: selected[i].input.source,
                            id: selected[i].id,
                        };
                        this.changeParents.push(p);
                        // remove old parent
                        selected[i].input.source.removeChild(selected[i]);
                        // got a new parent
                        newparent.addChild(selected[i]);
                        selected[i].input.source = newparent;
                        selected[i].input.target.parent = newparent;
                        selected[i].input.updatePosition();

                        var newchild = $('#treeview').jstree('get_node',
                            selected[i].id);
                        $('#treeview').jstree('move_node', newchild,
                            newparent.id, "last");
                        $('#treeview').jstree('open_node', newparent.id);
                    } else {

                    }
                }
            }
        }
        this.curSelected = selected;
    },
    execute: function () {
        this.owner.lastupdate = this.curOrgLastupdate;
        map[this.owner.id].repaint();
        map[this.owner.id].setPropertySheet();
        map[this.owner.id].setButtonStatus(this.curEditorStatus);
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        // load undo info ...
        map[this.owner.id].evalSelectedPositions(this.curSelected,
            this.oldSelected);
        if (this.changeParents.length > 0) {
            for (var i = 0; i < this.changeParents.length; i++) {
                var p = this.changeParents[i];
                for (var j = 0; j < this.curSelected.length; j++) {
                    if (p.id == this.curSelected[j].id) {
                        p.newp.removeChild(this.curSelected[j]);
                        p.oldp.addChild(this.curSelected[j]);
                        this.curSelected[j].input.source = p.oldp;
                        this.curSelected[j].input.target.parent = p.oldp;
                        this.curSelected[j].input.updatePosition();
                        var child = $('#treeview').jstree('get_node',
                            this.curSelected[j].id);
                        $('#treeview').jstree('move_node', child, p.oldp.id,
                            "last");
                        $('#treeview').jstree('open_node', p.oldp.id);
                    }
                }
            }
        }
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.oldOrgLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        // load redo info ...
        map[this.owner.id].evalSelectedPositions(this.curSelected,
            this.newSelected);
        if (this.changeParents.length > 0) {
            for (var i = 0; i < this.changeParents.length; i++) {
                var p = this.changeParents[i];
                for (var j = 0; j < this.curSelected.length; j++) {
                    if (p.id == this.curSelected[j].id) {
                        p.oldp.removeChild(this.curSelected[j]);
                        p.newp.addChild(this.curSelected[j]);
                        this.curSelected[j].input.source = p.newp;
                        this.curSelected[j].input.target.parent = p.newp;
                        this.curSelected[j].input.updatePosition();
                        var child = $('#treeview').jstree('get_node',
                            this.curSelected[j].id);
                        $('#treeview').jstree('move_node', child, p.newp.id,
                            "last");
                        $('#treeview').jstree('open_node', p.newp.id);
                    }
                }
            }
        }

        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.newOrgLastupdate;
        this.execute();
    },
};

// Move depart command
function OMMoveDepartCmd(selected, owner) {
    this.name = "Move selected departments/divisions/project teams";
    this.owner = owner;
    this.oldSelected = map[this.owner.id].cloneSelectedForMoving(selected);
    this.newSelected = null;
    this.curSelected = this.newSelected;

    this.oldEditorStatus = map[this.owner.id].editorStatus;
    this.newEditorStatus = 2;
    this.curEditorStatus = this.newEditorStatus;

    this.oldOrgLastupdate = this.owner.lastupdate;
    this.newOrgLastupdate = new Date().getTime();// Utils.getCurrentDateTime();
    this.curOrgLastupdate = this.newOrgLastupdate;
};

OMMoveDepartCmd.prototype = new Command();

OMMoveDepartCmd.prototype = {
    update: function (selected) {
        this.newSelected = map[this.owner.id]
            .cloneSelectedForMoving(selected);
        this.curSelected = selected;
    },
    execute: function () {
        this.owner.lastupdate = this.curOrgLastupdate;
        map[this.owner.id].repaint();
        map[this.owner.id].setPropertySheet();
        map[this.owner.id].setButtonStatus(this.curEditorStatus);
    },
    undo: function () {
        map[this.owner.id].evalMoveNodes(this.curSelected, this.oldSelected);
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.oldOrgLastupdate;
        this.execute();
    },
    redo: function () {
        map[this.owner.id].evalMoveNodes(this.curSelected, this.newSelected);
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.newOrgLastupdate;
        this.execute();
    },
};

// Resize department command
function OMResizeDepartCmd(selected, owner) {
    this.name = "Resize selected departments/divisions/project teams";
    this.owner = owner;
    this.oldSelected = map[this.owner.id].cloneSelectedForMoving(selected);
    this.newSelected = null;
    this.curSelected = this.newSelected;

    this.oldEditorStatus = map[this.owner.id].editorStatus;
    this.newEditorStatus = 2;
    this.curEditorStatus = this.newEditorStatus;

    this.oldOrgLastupdate = this.owner.lastupdate;
    this.newOrgLastupdate = new Date().getTime();// Utils.getCurrentDateTime();
    this.curOrgLastupdate = this.newOrgLastupdate;
};

OMResizeDepartCmd.prototype = new Command();

OMResizeDepartCmd.prototype = {
    update: function (selected) {
        this.newSelected = map[this.owner.id]
            .cloneSelectedForMoving(selected);
        this.curSelected = selected;
    },
    execute: function () {
        this.owner.lastupdate = this.curOrgLastupdate;
        map[this.owner.id].repaint();
        map[this.owner.id].setPropertySheet();
        map[this.owner.id].setButtonStatus(this.curEditorStatus);
    },
    undo: function () {
        map[this.owner.id].evalMoveNodes(this.curSelected, this.oldSelected);
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.oldOrgLastupdate;
        this.execute();
    },
    redo: function () {
        map[this.owner.id].evalMoveNodes(this.curSelected, this.newSelected);
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.newOrgLastupdate;
        this.execute();
    },
};

// Alignment department command
function OMAlignmentDepartCmd(selected, owner) {
    this.name = "Align selected departments/divisions/project teams";
    this.owner = owner;
    this.oldSelected = map[this.owner.id].cloneSelectedForMoving(selected);
    this.newSelected = null;
    this.curSelected = this.newSelected;

    this.oldEditorStatus = map[this.owner.id].editorStatus;
    this.newEditorStatus = 2;
    this.curEditorStatus = this.newEditorStatus;

    this.oldOrgLastupdate = this.owner.lastupdate;
    this.newOrgLastupdate = new Date().getTime();// Utils.getCurrentDateTime();
    this.curOrgLastupdate = this.newOrgLastupdate;
};

OMAlignmentDepartCmd.prototype = new Command();

OMAlignmentDepartCmd.prototype = {
    update: function (selected) {
        this.newSelected = map[this.owner.id]
            .cloneSelectedForMoving(selected);
        this.curSelected = selected;
    },
    execute: function () {
        this.owner.lastupdate = this.curOrgLastupdate;
        map[this.owner.id].repaint();
        map[this.owner.id].setPropertySheet();
        map[this.owner.id].setButtonStatus(this.curEditorStatus);
    },
    undo: function () {
        map[this.owner.id].evalMoveNodes(this.curSelected, this.oldSelected);
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.oldOrgLastupdate;
        this.execute();
    },
    redo: function () {
        map[this.owner.id].evalMoveNodes(this.curSelected, this.newSelected);
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.newOrgLastupdate;
        this.execute();
    },
};

// Remove/Cancel department command
function OMRemoveDepartCmd(selected, cmd, owner) {
    this.name = "Remove/Cancel selected departments/divisions/project teams";
    this.changeParents = [];
    this.owner = owner;
    this.cmd = cmd; // 0: delete/remove; 1: cancel
    this.curSelected = selected;

    this.oldEditorStatus = map[this.owner.id].editorStatus;
    this.newEditorStatus = 0;
    this.curEditorStatus = this.newEditorStatus;

    this.oldOrgLastupdate = this.owner.lastupdate;
    this.newOrgLastupdate = new Date().getTime();// Utils.getCurrentDateTime();
    this.curOrgLastupdate = this.newOrgLastupdate;
    this.redoAction = true;// false: redo; true: undo
};

OMRemoveDepartCmd.prototype = new Command();

OMRemoveDepartCmd.prototype = {
    execute: function () {
        if (this.cmd == 0) { // delete
            if (this.redoAction) { // redo
                this.changeParents = [];
                for (var i = 0; i < this.curSelected.length; i++) {
                    if (this.curSelected[i].input != null) {
                        var p = {
                            oldp: this.curSelected[i].input.source,
                            id: this.curSelected[i].id,
                        };
                        this.changeParents.push(p);
                        this.curSelected[i].input.source
                            .removeChild(this.curSelected[i]);

                        var p = $('#treeview').jstree('get_node',
                            this.curSelected[i].id);
                        $('#treeview').jstree('delete_node', p);
                        $('#treeview').jstree('select_node',
                            this.curSelected[i].input.source.id);
                    } else {
                        var p = {
                            oldp: null,
                            id: this.curSelected[i].id,
                        };
                        this.changeParents.push(p);
                        this.owner.removeChild(this.curSelected[i]);

                        var parentNode = $('#treeview').jstree('get_node',
                            this.owner.id + "S");
                        var p = $('#treeview').jstree('get_node',
                            this.curSelected[i].id);
                        $('#treeview').jstree('delete_node', p);
                        $('#treeview').jstree('select_node', parentNode.id);
                    }
                }
            } else { // undo
                if (this.changeParents.length > 0) {
                    for (var i = 0; i < this.changeParents.length; i++) {
                        var p = this.changeParents[i];
                        for (var j = 0; j < this.curSelected.length; j++) {
                            if (p.id == this.curSelected[j].id) {
                                var instance = $('#treeview').jstree();
                                if (p.oldp != null) { // top node
                                    p.oldp.addChild(this.curSelected[j]);
                                    // create a tree view node
                                    var node = {
                                        id: this.curSelected[j].id,
                                        text: Utils
                                            .parse(this.curSelected[j].name),
                                        data: "3|"
                                            + this.curSelected[j].owner
                                            + "|"
                                            + this.curSelected[j].classtypename,
                                        icon: "glyphicon glyphicon-folder-open",
                                    }; // parent: data.parent.id,
                                    var parentNode = instance
                                        .get_node(p.oldp.id);
                                    instance.create_node(p.oldp, node, "last");
                                    instance.redraw(true);
                                    $('#treeview').jstree('deselect_all', true);
                                    $('#treeview').jstree('select_node',
                                        this.curSelected[j].id);
                                } else {
                                    this.owner.addChild(this.curSelected[j]);
                                    var parentNode = instance
                                        .get_node(this.owner.id + "S");
                                    var node = {
                                        id: this.curSelected[j].id,
                                        text: Utils
                                            .parse(this.curSelected[j].name),
                                        data: "3|"
                                            + this.curSelected[j].owner
                                            + "|"
                                            + this.curSelected[j].classtypename,
                                        icon: "glyphicon glyphicon-folder-open",
                                    }; // parent: data.parent.id,
                                    instance.create_node(parentNode, node,
                                        "last");
                                    instance.redraw(true);
                                    $('#treeview').jstree('deselect_all', true);
                                    $('#treeview').jstree('select_node',
                                        this.curSelected[j].id);
                                }

                            }
                        }
                    }
                }
            }
        } else { // cancel
            if (this.redoAction) { // redo
                for (var i = 0; i < this.curSelected.length; i++) {
                    if (this.curSelected[i].status == 1) {
                        this.curSelected[i].status = 0;
                    } else {
                        this.curSelected[i].status = 1;
                    }
                }
            } else { // undo
                for (var i = 0; i < this.curSelected.length; i++) {
                    if (this.curSelected[i].status == 0) {
                        this.curSelected[i].status = 1;
                    } else {
                        this.curSelected[i].status = 0;
                    }
                }
            }
        }
        this.owner.lastupdate = this.curOrgLastupdate;
        map[this.owner.id].repaint();
        map[this.owner.id].setPropertySheet();
        map[this.owner.id].setButtonStatus(this.curEditorStatus);
    },
    undo: function () {
        this.redoAction = false;
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.oldOrgLastupdate;
        this.execute();
    },
    redo: function () {
        this.redoAction = true;
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.newOrgLastupdate;
        this.execute();
    },
};

//Rename an organization
function OMOrgRenameCmd(entity, newname) {
    this.name = "Org rename an organization";
    this.entity = entity;

    this.oldname = entity.name;
    this.newname = newname;
    this.curName = this.newname;

    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();// Utils.getCurrentDateTime();
    this.curLastupdate = this.newLastupdate;
};

OMOrgRenameCmd.prototype = new Command();

OMOrgRenameCmd.prototype = {
    execute: function () {
        // Command.prototype.execute.call(this);
        this.entity.name = Utils.stringify(this.curName);
        var that = this;
        // updating UI
        // update tab name
        $(".nav-tabs").children('li').each(function (entry) {
            var anchor = $(this).children("a")[0];
            var id = $(anchor).attr('href').substring(5);// #tab_000002A8AS
            if (id == that.entity.id) {
                var title = $(anchor).children("text")[0];
                $(title).html(that.curName + "&nbsp;&nbsp;");
            }
        });
        // update treeview
        $('#treeview').jstree('deselect_all', true);
        if (this.entity instanceof Organization) {
            $('#treeview').jstree('select_node', this.entity.id + "S");
        } else {
            $('#treeview').jstree('select_node', this.entity.id);
        }
        var instance = $('#treeview').jstree();
        var parent = instance.get_selected(true)[0];
        if (parent != null) {
            parent.text = this.curName; // tree
            instance.redraw(true);
        }

        // update basic property sheet
        if (this.entity instanceof Organization
            || this.entity instanceof Department
            || this.entity instanceof ProjectTeam
            || this.entity instanceof Division) {
            if (map[this.entity.id] != null) {
                map[this.entity.id].setPropertySheet();
                map[this.entity.id].repaint();
            } else {
                map[this.entity.owner].setPropertySheet();
                map[this.entity.owner].repaint();
            }
        } else if (this.entity instanceof Position
            || this.entity instanceof ProjectRole) {
            map[this.entity.currOwner].setPropertySheet();
            map[this.entity.currOwner].repaint();
        }
        this.entity.lastupdate = this.curLastupdate;
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        // load undo info ...
        this.curName = this.oldname;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        // load redo info ...
        this.curName = this.newname;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Change property value command
function OMOrgPropChangedCmd(entity, propname, newvalue) {
    this.name = "Org other property value changed";
    this.entity = entity;
    this.propname = propname;

    this.oldValue = entity[propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    //var ts = Utils.getCurrentDateTime();
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();// ;
    this.curLastupdate = this.newLastupdate;
};

OMOrgPropChangedCmd.prototype = new Command();

OMOrgPropChangedCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = this.curValue;
        this.entity.lastupdate = this.curLastupdate;
        // map[this.entity.id].repaint();
        map[this.entity.id].setPropertySheet();
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        // load undo info ...
        this.curValue = this.oldValue;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        // load redo info ...
        this.curValue = this.newValue;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Change property value command
function OMPositionPropChangedCmd(entity, propname, newvalue) {
    // department/division/project team
    this.name = "Sub Org other property value changed";
    this.entity = entity;
    this.propname = propname;

    this.oldValue = entity[propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    //var ts = Utils.getCurrentDateTime();
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();// ;
    this.curLastupdate = this.newLastupdate;
};

OMPositionPropChangedCmd.prototype = new Command();

OMPositionPropChangedCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = this.curValue;
        this.entity.lastupdate = this.curLastupdate;
        // map[this.entity.id].repaint();
        map[this.entity.currOwner].setPropertySheet();
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        // load undo info ...
        this.curValue = this.oldValue;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        // load redo info ...
        this.curValue = this.newValue;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};


// Change property value command
function OMDepartPropChangedCmd(entity, propname, newvalue, currOwner) {
    // department/division/project team
    this.name = "Sub Org other property value changed";
    this.entity = entity;
    this.propname = propname;
    this.currOwner = currOwner;

    this.oldValue = entity[propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    //var ts = Utils.getCurrentDateTime();
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();// ;
    this.curLastupdate = this.newLastupdate;
};

OMDepartPropChangedCmd.prototype = new Command();

OMDepartPropChangedCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = this.curValue;
        this.entity.lastupdate = this.curLastupdate;
        // map[this.entity.id].repaint();
        map[this.currOwner.id].setPropertySheet();
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        // load undo info ...
        this.curValue = this.oldValue;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        // load redo info ...
        this.curValue = this.newValue;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};


// Change property value command
function OMOrgTextPropChangedCmd(entity, propname, newvalue) {
    this.name = "Org text property value changed";
    this.entity = entity;
    this.propname = propname;

    this.oldValue = entity[propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    //var ts = Utils.getCurrentDateTime();
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;
};

OMOrgTextPropChangedCmd.prototype = new Command();

OMOrgTextPropChangedCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = Utils.stringify(this.curValue);
        this.entity.lastupdate = this.curLastupdate;
        map[this.entity.id].setPropertySheet();
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

// Create new position/project role command
function OMCreatePositionCmd(entity, selected, owner) {
    this.name = "Create position/project role";
    this.entity = entity;
    this.selected = selected;
    this.owner = owner;

    this.oldEditorStatus = map[this.owner.id].editorStatus;
    this.newEditorStatus = 3;
    this.curEditorStatus = this.newEditorStatus;

    this.oldOrgLastupdate = this.owner.lastupdate;
    this.newOrgLastupdate = new Date().getTime();// Utils.getCurrentDateTime();
    this.curOrgLastupdate = this.newOrgLastupdate;

    this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

OMCreatePositionCmd.prototype = new Command();

OMCreatePositionCmd.prototype = {
    execute: function () {
        // Command.prototype.execute.call(this);
        var instance = $('#treeview').jstree();
        if (this.cmd == 1) { // redo
            if (this.selected.length == 1) {
                var parent = this.selected[0];
                this.selected.splice(0, 1);
                this.entity.setParent(parent);// set parent
                parent.addChild(this.entity); // add into parent
                parent.setSelected(false);// deselect parent

                this.entity.setSelected(true);
                this.selected.push(this.entity); // put into selection array

            } else {
                // root depart, parent is null
                this.owner.addChild(this.entity); // add into parent

                this.entity.setSelected(true);
                this.selected.push(this.entity);

            }
        } else { // undo
            var parent = this.entity.parent;
            if (parent != null) {
                parent.removeChild(this.entity);
                parent.setSelected(true);// reselect parent
                // remove entity from selection array
                if (this.selected.length > 0) {
                    for (var j = 0; j < this.selected.length; j++) {
                        if (this.entity.id == this.selected[j].id) {
                            this.selected.splice(j, 1);
                            break;
                        }
                    }
                }
                this.entity.setSelected(false);
                this.selected.push(parent); // put into selection array

            } else {
                this.owner.removeChild(this.entity);
                this.entity.setSelected(false);
                // remove entity from selection array
                if (this.selected.length > 0) {
                    for (var j = 0; j < this.selected.length; j++) {
                        if (this.entity.id == this.selected[j].id) {
                            this.selected.splice(j, 1);
                            break;
                        }
                    }
                }

            }

        }
        map[this.owner.id].selected = this.selected;
        this.owner.lastupdate = this.curOrgLastupdate;
        map[this.owner.id].repaint();
        map[this.owner.id].setPropertySheet();
        map[this.owner.id].setButtonStatus(this.editorstatus);
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        // load undo info ...
        this.cmd = 2;
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.oldOrgLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        // load redo info ...
        this.cmd = 1;
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.newOrgLastupdate;
        this.execute();
    },
};

// User/Staff unicode text change command
function UserUnicodeTextChangeCmd(editorid, entity, propname, newvalue) {
    this.name = "User unicode text value changed";
    this.entity = entity;
    this.propname = propname;
    this.editorid = editorid;

    if (this.entity instanceof Staff) {
        this.oldValue = Utils.parse(this.entity.user[this.propname]);
        // console.log(this.entity.user[this.propname]);
    } else if (this.entity instanceof User) {
        this.oldValue = Utils.parse(this.entity[this.propname]);
    }
    this.newValue = newvalue;
    this.curValue = this.newValue;

    //var ts = Utils.getCurrentDateTime();
    if (this.entity instanceof Staff) {
        this.oldLastupdate = entity.user.lastupdate;
    } else if (this.entity instanceof User) {
        this.oldLastupdate = entity.lastupdate;
    }
    this.newLastupdate = new Date().getTime();//
    this.curLastupdate = this.newLastupdate;
};

UserUnicodeTextChangeCmd.prototype = new Command();

UserUnicodeTextChangeCmd.prototype = {
    execute: function () {
        if (this.entity instanceof Staff) {
            this.entity.user[this.propname] = Utils.stringify(this.curValue);
            this.entity.user.lastupdate = this.curLastupdate;
        } else if (this.entity instanceof User) {
            this.entity[this.propname] = Utils.stringify(this.curValue);
            this.entity.lastupdate = this.curLastupdate;
        }
        map[this.editorid].addUpdatedStaffs(this.entity);
        map[this.editorid].updateRow(this.entity.id, this.propname,
            this.curValue);
        map[this.editorid].selectRow(this.entity.id);
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

// User property change command
function UserPropsChangeCmd(editorid, entity, propname, newvalue) {
    this.name = "User property value changed";
    this.entity = entity;
    this.propname = propname;
    this.editorid = editorid;

    if (this.entity instanceof Staff) {
        this.oldValue = this.entity.user[this.propname];
    } else if (this.entity instanceof User) {
        this.oldValue = this.entity[this.propname];
    }
    this.newValue = newvalue;
    this.curValue = this.newValue;

    //var ts = Utils.getCurrentDateTime();
    if (this.entity instanceof Staff) {
        this.oldLastupdate = entity.user.lastupdate;
    } else if (this.entity instanceof User) {
        this.oldLastupdate = entity.lastupdate;
    }
    this.newLastupdate = new Date().getTime();//
    this.curLastupdate = this.newLastupdate;
};

UserPropsChangeCmd.prototype = new Command();

UserPropsChangeCmd.prototype = {
    execute: function () {
        if (this.entity instanceof Staff) {
            this.entity.user[this.propname] = this.curValue;
            this.entity.user.lastupdate = this.curLastupdate;
        } else if (this.entity instanceof User) {
            this.entity[this.propname] = this.curValue;
            this.entity.lastupdate = this.curLastupdate;
        }
        map[this.editorid].addUpdatedStaffs(this.entity);
        map[this.editorid].updateRow(this.entity.id, this.propname,
            this.curValue);
        map[this.editorid].selectRow(this.entity.id);
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

// Staff unicode text change command
function StaffUnicodeTextChangeCmd(editorid, entity, propname, newvalue) {
    this.name = "Staff unicode text value changed";
    this.entity = entity;
    this.propname = propname;
    this.editorid = editorid;

    this.oldValue = Utils.parse(this.entity[this.propname]);
    this.newValue = newvalue;
    this.curValue = this.newValue;

    //var ts = Utils.getCurrentDateTime();
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();//
    this.curLastupdate = this.newLastupdate;
};

StaffUnicodeTextChangeCmd.prototype = new Command();

StaffUnicodeTextChangeCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = Utils.stringify(this.curValue);
        this.entity.lastupdate = this.curLastupdate;
        map[this.editorid].addUpdatedStaffs(this.entity);
        map[this.editorid].updateRow(this.entity.id, this.propname,
            this.curValue);
        map[this.editorid].selectRow(this.entity.id);
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

// Staff property change command
function StaffPropsChangeCmd(editorid, entity, propname, newvalue) {
    this.name = "Staff property value changed";
    this.entity = entity;
    this.propname = propname;
    this.editorid = editorid;

    this.oldValue = this.entity[this.propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    // var ts = Utils.getCurrentDateTime();
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();//
    this.curLastupdate = this.newLastupdate;
};

StaffPropsChangeCmd.prototype = new Command();

StaffPropsChangeCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = this.curValue;
        this.entity.lastupdate = this.curLastupdate;
        map[this.editorid].addUpdatedStaffs(this.entity);
        map[this.editorid].updateRow(this.entity.id, this.propname,
            this.curValue);
        map[this.editorid].selectRow(this.entity.id);
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

// Group text property change command
function GroupPropsChangeCmd(editorid, entity, propname, newvalue) {
    this.name = "Group property value changed";
    this.entity = entity;
    this.propname = propname;
    this.editorid = editorid;

    this.oldValue = this.entity[this.propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;
};

GroupPropsChangeCmd.prototype = new Command();

GroupPropsChangeCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = Utils.stringify(this.curValue);
        map[this.editorid].addUpdatedGroups(this.entity);
        map[this.editorid].updateRow(this.entity.id, this.propname,
            this.curValue);
        map[this.editorid].selectRow(this.entity.id);
    },
    undo: function () {
        this.curValue = this.oldValue;
        this.execute();
    },
    redo: function () {
        this.curValue = this.newValue;
        this.execute();
    },
};


//HomePage property change command
function HomePageValueChangeCmd(entity, propname, newvalue) {
    this.name = "HomePage property value changed";
    this.entity = entity;
    this.propname = propname;
    this.editorid = entity.owner;

    this.oldValue = this.entity[this.propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    // var ts = Utils.getCurrentDateTime();
    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();//
    this.curLastupdate = this.newLastupdate;
};

HomePageValueChangeCmd.prototype = new Command();

HomePageValueChangeCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = Utils.stringify(this.curValue);
        this.entity.lastupdate = this.curLastupdate;
        map[this.entity.parent].addUpdateHomePage(this.entity);
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
//// Group authorization change command
//function GroupAuthsChangeCmd(editorid, entity, cmd, newvalue) {
//	this.name = "Group authorization changed";
//	this.entity = entity;
//	this.cmd = cmd;
//	this.editorid = editorid;
//
//	if (this.cmd == "add") {
//		console.log(this.entity.addedAuthIds);
//		var t = [];
//		for (var i = 0; i < this.entity.addedAuthIds.length; i++) {
//			t.push(this.entity.addedAuthIds[i]);
//		}
//		this.oldValue = t;
//	} else {
//		for (var i = 0; i < this.entity.removedAuthIds.length; i++) {
//			t.push(this.entity.removedAuthIds[i]);
//		}
//		this.oldValue = t;
//	}
//	this.newValue = newvalue;
//	this.curValue = this.newValue;
//	this.command = "redo";
//};
//
//GroupAuthsChangeCmd.prototype = new Command();
//
//GroupAuthsChangeCmd.prototype = {
//	execute : function() {
//		if (this.command == "redo") {
//			if (this.cmd == "add") {
//				for (var i = 0; i < this.curValue.length; i++) {
//					this.entity.putAddedAuthId(this.curValue[i]);
//				}
//			} else {
//				for (var i = 0; i < this.curValue.length; i++) {
//					this.entity.putRemovedAuthId(this.curValue[i]);
//				}
//			}
//		} else {
//			if (this.cmd == "add") {
//				this.entity.addedAuthIds = this.curValue;
//			} else {
//				this.entity.removedAuthIds = this.curValue;
//			}
//		}
//		map[this.editorid].addUpdatedGroups(this.entity);
//	},
//	undo : function() {
//		this.command = "undo";
//		this.curValue = this.oldValue;
//		this.execute();
//	},
//	redo : function() {
//		this.command = "redo";
//		this.curValue = this.newValue;
//		this.execute();
//	},
//};

//Create new mbui/board/mbrow/mbtopbar/mbtopbaritem/mbcontentpanel
function OMCreatePartCmd(entity, p, ui, owner) {
    this.name = "Create mbui part";
    this.entity = entity;
    this.mbui = ui;
    this.parent = p;
    this.owner = owner;
    this.oldEditorStatus = map[this.owner.id].mbUIEditor.editorStatus;
    this.newEditorStatus = 3;
    this.curEditorStatus = this.newEditorStatus;

    this.oldOrgLastupdate = this.owner.lastupdate;
    this.newOrgLastupdate = new Date().getTime();
    this.curOrgLastupdate = this.newOrgLastupdate;
    this.pane = null;

    this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

OMCreatePartCmd.prototype = new Command();

OMCreatePartCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.parent.addChild(this.entity);
            if (this.entity instanceof MbTopBarItem) {
                this.pane = this.mbui.findCurrentBoard().removeContentPanel();
                this.mbui.findCurrentBoard().addChild(this.entity.children);
            }
        } else if (this.cmd == 2) {
            this.parent.removeChild(this.entity);
            if (this.entity instanceof MbTopBarItem) {
                this.mbui.findCurrentBoard().removeContentPanel();
                if (this.pane != null) {
                    this.mbui.findCurrentBoard().addChild(this.pane);
                }
            }
        }
        console.log(this.parent);
        console.log(this.entity);
        this.owner.lastupdate = this.curOrgLastupdate;
        map[this.owner.id].mbUIEditor.repaint();
        map[this.owner.id].mbUIEditor.setPropertySheet();
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        this.cmd = 2;
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.oldOrgLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        this.cmd = 1;
        this.curEditorStatus = this.newEditorStatus;
        this.curOrgLastupdate = this.newOrgLastupdate;
        this.execute();
    },
};

// Change category's top category property value command
function OMCategoryTopCategoryChangedCmd(entity, newvalue1, newvalue2) {
    // entity is a category object
    this.name = "Category top category Id changed";
    this.entity = entity;

    this.oldValue1 = entity.assignCategoryId;
    this.newValue1 = newvalue1;
    this.curValue1 = this.newValue1;

    this.oldValue2 = entity.mbUIContent;
    this.newValue2 = newvalue2;
    this.curValue2 = this.newValue2;

    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();//
    this.curLastupdate = this.newLastupdate;
};

OMCategoryTopCategoryChangedCmd.prototype = new Command();

OMCategoryTopCategoryChangedCmd.prototype = {
    execute: function () {
        this.entity.assignCategoryId = this.curValue1;
        this.entity.mbUIContent = this.curValue2;
        this.entity.lastupdate = this.curLastupdate;
        map[this.entity.id].refresh();
    },
    undo: function () {
        this.curValue1 = this.oldValue1;
        this.curValue2 = this.oldValue2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.curValue1 = this.newValue1;
        this.curValue2 = this.newValue2;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Change property value command
function OMMbPropChangedCmd(entity, propname, newvalue, owner) {
    this.name = "Org mobile object property value changed";
    this.entity = entity;
    this.propname = propname;
    this.owner = owner; // category object ID

    this.oldValue = entity[propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();//
    this.curLastupdate = this.newLastupdate;
};

OMMbPropChangedCmd.prototype = new Command();

OMMbPropChangedCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = this.curValue;
        this.entity.lastupdate = this.curLastupdate;
        map[this.owner].repaint();
        map[this.owner].setPropertySheet();
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        // load undo info ...
        this.curValue = this.oldValue;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        // load redo info ...
        this.curValue = this.newValue;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Change double property value command
function OMMbDblPropChangedCmd(entity, propname, newvalue,
                               propname1, newvalue1, owner) {
    this.name = "Org mobile object property value changed";
    this.entity = entity;
    this.propname = propname;
    this.propname1 = propname1;
    this.owner = owner; // category object ID

    this.oldValue = entity[propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    this.oldValue1 = entity[propname1];
    this.newValue1 = newvalue1;
    this.curValue1 = this.newValue1;

    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();//
    this.curLastupdate = this.newLastupdate;
};

OMMbDblPropChangedCmd.prototype = new Command();

OMMbDblPropChangedCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = this.curValue;
        this.entity[this.propname1] = this.curValue1;
        this.entity.lastupdate = this.curLastupdate;
        map[this.owner].repaint();
        map[this.owner].setPropertySheet();
    },
    undo: function () {
        // Command.prototype.undo.call(this);
        // load undo info ...
        this.curValue = this.oldValue;
        this.curValue1 = this.oldValue1;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        // Command.prototype.redo.call(this);
        // load redo info ...
        this.curValue = this.newValue;
        this.curValue1 = this.newValue1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

// Change category's UI Content property value command
function OMCategoryUIContentChangeCmd(entity, newvalue1) {
    // entity is a category object
    this.name = "Category UI Content changed";
    this.entity = entity;

    this.oldValue1 = entity.mbUIContent;
    this.newValue1 = newvalue1;
    this.curValue1 = this.newValue1;

    this.oldLastupdate = entity.lastupdate;
    this.newLastupdate = new Date().getTime();//
    this.curLastupdate = this.newLastupdate;
};

OMCategoryUIContentChangeCmd.prototype = new Command();

OMCategoryUIContentChangeCmd.prototype = {
    execute: function () {
        this.entity.mbUIContent = this.curValue1;
        this.entity.lastupdate = this.curLastupdate;
        map[this.entity.id].mbUIEditor.loading(this.entity);
    },
    undo: function () {
        this.curValue1 = this.oldValue1;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.curValue1 = this.newValue1;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};

/// --------------------------------------------------------------------------------------------------------------------
// Desktop UI object commands

function FMDesktopUIInsertBeforeLayoutNodeCmd(entity, newchild, siblingId) {
    this.name = "Insert before layout row node command";
    this.entity = entity;
    this.newchild = newchild;
    this.siblingId = siblingId;

    if (this.entity instanceof PCDesktopUI) {
        this.oldLastupdate = entity.lastupdate;
        this.newLastupdate = new Date().getTime();
        this.curLastupdate = this.newLastupdate;
    } else if (this.entity instanceof PCDesktopColumn) {
        this.oldLastupdate = map[this.entity.cateId].pcDesktopEditor.currObject.lastupdate;
        this.newLastupdate = new Date().getTime();
        this.curLastupdate = this.newLastupdate;
    }

    this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

FMDesktopUIInsertBeforeLayoutNodeCmd.prototype = new Command();

FMDesktopUIInsertBeforeLayoutNodeCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.entity.insertChild(this.newchild, this.siblingId);
            map[this.entity.cateId].pcDesktopEditor.selected = this.newchild;
        } else {
            this.entity.removeChild(this.newchild);
            map[this.entity.cateId].pcDesktopEditor.selected = null;
        }
        this.entity.lastupdate = this.curLastupdate;
        map[this.entity.cateId].repaint();
        map[this.entity.cateId].setPropertySheet();
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

function FMDesktopUIAppendLayoutNodeCmd(entity, newchild) {
    this.name = "Append layout row node command";

    this.entity = entity;
    this.newchild = newchild;

    if (this.entity instanceof PCDesktopUI) {
        this.oldLastupdate = entity.lastupdate;
        this.newLastupdate = new Date().getTime();
        this.curLastupdate = this.newLastupdate;
    } else if (this.entity instanceof PCDesktopColumn) {
        this.oldLastupdate = map[this.entity.cateId].pcDesktopEditor.currObject.lastupdate;
        this.newLastupdate = new Date().getTime();
        this.curLastupdate = this.newLastupdate;
    }

    this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

FMDesktopUIAppendLayoutNodeCmd.prototype = new Command();

FMDesktopUIAppendLayoutNodeCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.entity.addChild(this.newchild);
            map[this.entity.cateId].pcDesktopEditor.selected = this.newchild;
        } else {
            this.entity.removeChild(this.newchild);
            map[this.entity.cateId].pcDesktopEditor.selected = null;
        }
        this.entity.lastupdate = this.curLastupdate;
        map[this.entity.cateId].repaint();
        map[this.entity.cateId].setPropertySheet();
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

function FMDesktopUIMoveBeforeLayoutNodeCmd(newparent, movedId, siblingId, owner) {
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

FMDesktopUIMoveBeforeLayoutNodeCmd.prototype = new Command();

FMDesktopUIMoveBeforeLayoutNodeCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.oldParent.removeChild(this.moved);
            this.newparent.insertChild(this.moved, this.siblingId);
            map[this.owner.cateId].pcDesktopEditor.selected = this.moved;
        } else {
            this.newparent.removeChild(this.moved);
            if (this.oldSiblingId == null) {
                this.oldParent.addChild(this.moved);
            } else {
                this.oldParent.insertChild(this.moved, this.oldSiblingId);
            }
            map[this.owner.cateId].pcDesktopEditor.selected = null;
        }
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.cateId].repaint();
        map[this.owner.cateId].setPropertySheet();
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

function FMDesktopUIMoveLayoutNodeCmd(newparent, movedId, owner) {
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

FMDesktopUIMoveLayoutNodeCmd.prototype = new Command();

FMDesktopUIMoveLayoutNodeCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.oldParent.removeChild(this.moved);
            this.newparent.addChild(this.moved);
            map[this.owner.cateId].pcDesktopEditor.selected = this.moved;
        } else {
            this.newparent.removeChild(this.moved);
            if (this.oldSiblingId == null) {
                this.oldParent.addChild(this.moved);
            } else {
                this.oldParent.insertChild(this.moved, this.oldSiblingId);
            }
            map[this.owner.cateId].pcDesktopEditor.selected = null;
        }
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.cateId].repaint();
        map[this.owner.cateId].setPropertySheet();
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
function FMDesktopUIRemoveAllRowsCmd(owner) {
    this.name = "Remove all rows command";
    this.owner = owner;
    this.oldChildren = owner.children;

    this.oldLastupdate = owner.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

    this.cmd = 1;// 1: redo(remove); 2: undo(add);
};

FMDesktopUIRemoveAllRowsCmd.prototype = new Command();

FMDesktopUIRemoveAllRowsCmd.prototype = {
    execute: function () {
        if (this.cmd == 1) {
            this.owner.removeAllChildren();
            map[this.owner.cateId].disableButton(map[this.owner.cateId].deletebutton);
        } else if (this.cmd == 2) {
            for (var i = 0; i < this.oldChildren.length; i++) {
                this.owner.children.push(this.oldChildren[i]);
                this.owner.dom.appendChild(this.oldChildren[i].dom);
            }
            map[this.owner.cateId].enableButton(map[this.owner.cateId].deletebutton);
        }
        this.owner.lastupdate = this.curLastupdate;
        map[this.owner.cateId].repaint();
        map[this.owner.cateId].setPropertySheet();
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
// owner is desktop ui object
function FMDesktopUIRemoveRowCmd(rowId, owner) {
    this.name = "Remove row command";
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

FMDesktopUIRemoveRowCmd.prototype = new Command();

FMDesktopUIRemoveRowCmd.prototype = {
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
        map[this.owner.cateId].repaint();
        map[this.owner.cateId].setPropertySheet();
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

//FM DesktopUI property change command
function FMDesktopUIValueChangeCmd(entity, propname, newvalue) {
    this.name = "Desktop UI component property value changed";
    this.entity = entity;
    this.propname = propname;

    this.oldValue = this.entity[this.propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    if (this.entity instanceof PCDesktopUI) {
        this.oldLastupdate = entity.lastupdate;
        this.newLastupdate = new Date().getTime();
        this.curLastupdate = this.newLastupdate;
    } else if (this.entity instanceof PCDesktopIcon) {
        this.oldLastupdate = map[this.entity.cateId].pcDesktopEditor.currObject.lastupdate;
        this.newLastupdate = new Date().getTime();
        this.curLastupdate = this.newLastupdate;
    }

};

FMDesktopUIValueChangeCmd.prototype = new Command();

FMDesktopUIValueChangeCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = Utils.stringify(this.curValue);
        this.entity.lastupdate = this.curLastupdate;
        map[this.entity.cateId].repaint();
        map[this.entity.cateId].setPropertySheet();
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


//FM DesktopUI multiple properties change command
function FMDesktopUIValuesChangeCmd(entity, propname, newvalue,
                                    propname1, newvalue1,
                                    propname2, newvalue2) {
    this.name = "Desktop UI component property value changed";
    this.entity = entity;
    this.propname = propname;
    this.propname1 = propname1;
    this.propname2 = propname2;

    this.oldValue = this.entity[this.propname];
    this.newValue = newvalue;
    this.curValue = this.newValue;

    this.oldValue1 = this.entity[this.propname1];
    this.newValue1 = newvalue1;
    this.curValue1 = this.newValue1;

    this.oldValue2 = this.entity[this.propname2];
    this.newValue2 = newvalue2;
    this.curValue2 = this.newValue2;

    this.oldLastupdate = map[this.entity.cateId].pcDesktopEditor.currObject.lastupdate;
    this.newLastupdate = new Date().getTime();
    this.curLastupdate = this.newLastupdate;

};

FMDesktopUIValuesChangeCmd.prototype = new Command();

FMDesktopUIValuesChangeCmd.prototype = {
    execute: function () {
        this.entity[this.propname] = Utils.stringify(this.curValue);
        this.entity[this.propname1] = Utils.stringify(this.curValue1);
        this.entity[this.propname2] = Utils.stringify(this.curValue2);
        this.entity.lastupdate = this.curLastupdate;
        map[this.entity.cateId].repaint();
        map[this.entity.cateId].setPropertySheet();
    },
    undo: function () {
        this.curValue = this.oldValue;
        this.curValue1 = this.oldValue1;
        this.curValue2 = this.oldValue2;
        this.curLastupdate = this.oldLastupdate;
        this.execute();
    },
    redo: function () {
        this.curValue = this.newValue;
        this.curValue1 = this.newValue1;
        this.curValue2 = this.newValue2;
        this.curLastupdate = this.newLastupdate;
        this.execute();
    },
};