// rename
function AMRenameCmd(entity, newname) {
	this.name = "Rename";
	this.entity = entity; // template or app service object or task object

	this.oldname = entity.name;
	this.newname = Utils.stringify(newname);
	this.curName = this.newname;

	var d = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = d;
	this.curLastupdate = this.newLastupdate;
};

AMRenameCmd.prototype = new Command();

AMRenameCmd.prototype = {
	execute : function() {
		if (this.entity != null) {
			this.entity.name = Utils.parse(this.curName);
			this.entity.lastupdate = this.curLastupdate;
			var that = this;
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
			if (map[this.entity.id].amRAppEditor != undefined) {
				map[this.entity.id].amRAppEditor.setPropertySheet();
			} else {
				map[this.entity.id].setPropertySheet();
			}
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
		this.curName = this.oldname;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curName = this.newname;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change prop value setting command
function AMValueChangedCmd(entity, propname, newvalue) {
	this.name = "Value changed";
	this.entity = entity;
	this.propname = propname;

	this.oldValue = entity[propname];
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMValueChangedCmd.prototype = new Command();

AMValueChangedCmd.prototype = {
	execute : function() {
		this.entity[this.propname] = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		if (map[this.entity.id].amRAppEditor != undefined) {
			map[this.entity.id].amRAppEditor.setPropertySheet();
		} else {
			map[this.entity.id].setPropertySheet();
		}
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change prop value setting command
function AMCKEditorCotentChangedCmd(entity) {
	this.name = "Value changed";
	this.entity = entity;

	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
	// editor.resetUndo();
};

AMCKEditorCotentChangedCmd.prototype = new Command();

AMCKEditorCotentChangedCmd.prototype = {
	execute : function() {
		map[this.entity.id].currObject.emailContent = map[this.entity.id].enditorInstance
				.getData();
		this.entity.lastupdate = this.curLastupdate;
		if (map[this.entity.id].amRAppEditor != undefined) {
			map[this.entity.id].amRAppEditor.setPropertySheet();
		} else {
			map[this.entity.id].setPropertySheet();
		}
	},
	undo : function() {
		map[this.entity.id].enditorInstance.execCommand('undo');
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		map[this.entity.id].enditorInstance.execCommand('redo');
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

//// Change Java API change command
//function AMAddJavaAPICmd(entity, newapi, checkInput) {
//	this.name = "Add Java API";
//	this.entity = entity;
//	this.input = checkInput;
//
//	this.newapi = newapi;
//
//	var ts = Utils.getCurrentDateTime();
//	this.oldLastupdate = entity.lastupdate;
//	this.newLastupdate = ts;
//	this.curLastupdate = this.newLastupdate;
//	this.cmd = 1;// 1: redo(add); 2: undo(remove);
//};
//
//AMAddJavaAPICmd.prototype = new Command();
//
//AMAddJavaAPICmd.prototype = {
//	execute : function() {
//		if (this.cmd == 1) {
//			this.entity.children.push(this.newapi);
//			this.input.checked = true;
//		} else {
//			for (var j = 0; j < this.entity.children.length; j++) {
//				if (this.entity.children[j].name == this.newapi.name) {
//					this.entity.children.splice(j, 1);
//					this.input.checked = false;
//					break;
//				}
//			}
//		}
//		this.entity.lastupdate = this.curLastupdate;
//		if (map[this.entity.id].amRAppEditor != undefined) {
//			map[this.entity.id].amRAppEditor.setPropertySheet();
//		} else {
//			map[this.entity.id].setPropertySheet();
//		}
//	},
//	undo : function() {
//		this.cmd = 2;
//		this.curLastupdate = this.oldLastupdate;
//		this.execute();
//	},
//	redo : function() {
//		this.cmd = 1;
//		this.curLastupdate = this.newLastupdate;
//		this.execute();
//	},
//};
//
//// Change Java API change command
//function AMRemoveJavaAPICmd(entity, oldapi, j, checkInput) {
//	this.name = "Add Java API";
//	this.entity = entity;
//	this.input = checkInput;
//
//	this.oldapi = oldapi;
//	this.j = j;
//
//	var ts = Utils.getCurrentDateTime();
//	this.oldLastupdate = entity.lastupdate;
//	this.newLastupdate = ts;
//	this.curLastupdate = this.newLastupdate;
//	this.cmd = 1;// 1: redo(remove); 2: undo(add);
//};
//
//AMRemoveJavaAPICmd.prototype = new Command();
//
//AMRemoveJavaAPICmd.prototype = {
//	execute : function() {
//		if (this.cmd == 1) {
//			this.entity.children.splice(this.j, 1);
//			this.input.checked = false;
//		} else {
//			this.entity.children.push(this.oldapi);
//			this.input.checked = true;
//		}
//		this.entity.lastupdate = this.curLastupdate;
//		if (map[this.entity.id].amRAppEditor != undefined) {
//			map[this.entity.id].amRAppEditor.setPropertySheet();
//		} else {
//			map[this.entity.id].setPropertySheet();
//		}
//	},
//	undo : function() {
//		this.cmd = 2;
//		this.curLastupdate = this.oldLastupdate;
//		this.execute();
//	},
//	redo : function() {
//		this.cmd = 1;
//		this.curLastupdate = this.newLastupdate;
//		this.execute();
//	},
//};

// Change web app service request method value in editor
function AMWebAppHeaderSolutionChangedCmd(entity, newvalue, headers) {
	this.name = "Web App header solution changed";
	this.entity = entity;

	this.oldHeaderSolution = entity.headerSolution;
	this.newHeaderSolution = newvalue;
	this.curHeaderSolution = this.newHeaderSolution;

	var h = [];
	if (entity.headers != null && entity.headers.length > 0) {
		for (var i = 0; i < entity.headers.length; i++) {
			h.push(entity.headers[i].clone());
		}
	}
	this.oldHeaders = h;
	this.newHeaders = headers;
	this.curHeaders = this.newHeaders;

	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMWebAppHeaderSolutionChangedCmd.prototype = new Command();

AMWebAppHeaderSolutionChangedCmd.prototype = {
	execute : function() {
		this.entity.headerSolution = this.curHeaderSolution;
		this.entity.headers = this.curHeaders;
		this.entity.lastupdate = this.curLastupdate;
		if (map[this.entity.id].amRAppEditor != undefined) {
			map[this.entity.id].amRAppEditor.changeHeaders(this.curHeaders);
			map[this.entity.id].amRAppEditor.setPropertySheet();
		} else {
			map[this.entity.id].setPropertySheet();
		}
	},
	undo : function() {
		this.curHeaderSolution = this.oldHeaderSolution;
		this.curHeaders = this.oldHeaders;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curHeaderSolution = this.newHeaderSolution;
		this.curHeaders = this.newHeaders;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change web app service request method value in editor
function AMWebAppMethodChangedCmd(entity, newvalue) {
	this.name = "Web App method changed";
	this.entity = entity;

	this.oldValue = entity.methodName;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	this.oldBody = entity.body;
	this.newBody = null;
	this.curBody = this.newBody;

	this.oldHeaderSolution = entity.headerSolution;
	this.newHeaderSolution = 0;
	this.curHeaderSolution = this.newHeaderSolution;

	var h = [];
	if (entity.headers != null && entity.headers.length > 0) {
		for (var i = 0; i < entity.headers.length; i++) {
			h.push(entity.headers[i].clone());
		}
	}
	this.oldHeaders = h;
	this.newHeaders = [];
	this.curHeaders = this.newHeaders;

	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMWebAppMethodChangedCmd.prototype = new Command();

AMWebAppMethodChangedCmd.prototype = {
	execute : function() {
		this.entity.methodName = this.curValue;
		this.entity.body = this.curBody;
		this.entity.headerSolution = this.curHeaderSolution;
		this.entity.headers = this.curHeaders;
		this.entity.lastupdate = this.curLastupdate;
		if (map[this.entity.id].amRAppEditor != undefined) {
			map[this.entity.id].amRAppEditor.mthdSelect.value = this.curValue;
			map[this.entity.id].amRAppEditor.showFormDataPane(this.curValue);
			map[this.entity.id].amRAppEditor.initHeaderSolution(this.entity);
			map[this.entity.id].amRAppEditor.setPropertySheet();
		} else {
			map[this.entity.id].setPropertySheet();
		}
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curBody = this.oldBody;
		this.curHeaderSolution = this.oldHeaderSolution;
		this.curHeaders = this.oldHeaders;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curBody = this.newBody;
		this.curHeaderSolution = this.newHeaderSolution;
		this.curHeaders = this.newHeaders;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change web app service URL value in editor
function AMWebAppURLChangedCmd(entity, propname, newvalue) {
	this.name = "Web app URL changed";
	this.entity = entity;
	this.propname = propname;

	this.oldValue = entity[propname];
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMWebAppURLChangedCmd.prototype = new Command();

AMWebAppURLChangedCmd.prototype = {
	execute : function() {
		this.entity[this.propname] = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.urlInput.value = this.curValue;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change web app service host value in editor
function AMWebAppHostChangedCmd(entity, propname, newvalue) {
	this.name = "Web app host changed";
	this.entity = entity;
	this.propname = propname;

	this.oldValue = entity[propname];
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMWebAppHostChangedCmd.prototype = new Command();

AMWebAppHostChangedCmd.prototype = {
	execute : function() {
		this.entity[this.propname] = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.hostInput.value = this.curValue;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Add parameter/header/form data command
function AMAddParaCmd(entity, parent, newPara, headbody) {
	this.name = "Add path parameter/body form data parameter";
	this.entity = entity;
	this.parent = parent;
	this.newPara = newPara;
	this.newIndex = -1;
	this.headbody = headbody;

	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
	this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

AMAddParaCmd.prototype = new Command();

AMAddParaCmd.prototype = {
	execute : function() {
		if (this.cmd == 1) {
			if (this.headbody == 1) {
				this.entity.pathParams.push(this.newPara);
			} else if (this.headbody == 2) {
				this.entity.formParams.push(this.newPara);
			}
			this.newIndex = this.parent.addNewRow(this.newPara);
		} else if (this.cmd == 2) {
			if (this.headbody == 1) {
				for (var i = 0; i < this.entity.pathParams.length; i++) {
					if (this.entity.pathParams[i].name == this.newPara.name) {
						this.entity.pathParams.splice(i, 1);
						this.parent.currRowIndex = -1;
						break;
					}
				}
			} else if (this.headbody == 2) {
				for (var i = 0; i < this.entity.formParams.length; i++) {
					if (this.entity.formParams[i].name == this.newPara.name) {
						this.entity.formParams.splice(i, 1);
						this.parent.currRowIndex = -1;
						break;
					}
				}
			}
			this.parent.removeRow(this.newIndex, this.newPara);
		}
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Remove parameter/header/form data command
function AMRemoveParaCmd(entity, parent, para, index, headbody) {
	this.name = "Remove path parameter/body form data parameter";
	this.para = para;
	this.index = index;
	this.entity = entity;
	this.parent = parent;
	this.rowIndex = -1;
	this.headbody = headbody;

	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
	this.cmd = 1;// 1: redo(remove); 2: undo(add);
};

AMRemoveParaCmd.prototype = new Command();

AMRemoveParaCmd.prototype = {
	execute : function() {
		if (this.cmd == 1) {
			if (this.headbody == 1) {
				for (var i = 0; i < this.entity.pathParams.length; i++) {
					if (this.entity.pathParams[i].name == this.para.name) {
						this.entity.pathParams.splice(i, 1);
						this.parent.currRowIndex = -1;
						break;
					}
				}
			} else if (this.headbody == 2) {
				for (var i = 0; i < this.entity.formParams.length; i++) {
					if (this.entity.formParams[i].name == this.para.name) {
						this.entity.formParams.splice(i, 1);
						this.parent.currRowIndex = -1;
						break;
					}
				}
			}
			this.parent.removeRow(this.index);
		} else {
			if (this.headbody == 1) {
				this.entity.pathParams.push(this.para);
			} else if (this.headbody == 2) {
				this.entity.formParams.push(this.para);
			}
			this.parent.currRowIndex = this.index - 1;
			this.parent.addNewRow(this.para);
		}
		this.parent.selectRowByIndex(this.index);
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change parameter name change command
function AMParaNameChangedCmd(entity, oldname, newname, table, currow,
		headbody, loc) {
	this.name = "Parameter name changed";
	this.entity = entity;
	this.table = table;
	this.headbody = headbody;
	this.currow = currow;
	this.oldValue = oldname;
	this.newValue = newname;
	this.curValue = this.newValue;
	this.pos = loc;

	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMParaNameChangedCmd.prototype = new Command();

AMParaNameChangedCmd.prototype = {
	execute : function() {
		this.table.rows[this.currow].cells[0].innerText = this.curValue;
		if (this.headbody == 1) {
			this.entity.pathParams[this.pos].name = this.curValue;
		} else if (this.headbody == 2) {
			this.entity.formParams[this.pos].name = this.curValue;
		}
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change parameter data type change command
function AMParaDataTypeChangedCmd(entity, oldvalue, newvalue, table, currow,
		loc, headbody) {
	this.name = "Parameter data type changed";
	this.entity = entity;
	this.table = table;
	this.loc = loc;
	this.headbody = headbody;
	this.currow = currow;

	this.oldValue = oldvalue;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
	if (this.headbody == 1) {
		this.oldVal = this.entity.pathParams[this.loc].value;
	} else if (this.headbody == 2) {
		this.oldVal = this.entity.formParams[this.loc].value;
	}
	this.newVal = "";
	this.curVal = this.newVal;

};

AMParaDataTypeChangedCmd.prototype = new Command();

AMParaDataTypeChangedCmd.prototype = {
	execute : function() {
		if (this.headbody == 1) {
			this.table.rows[this.currow].cells[1].innerText = pathdatatype[this.curValue];
			this.entity.pathParams[this.loc].datatype = this.curValue;
		} else if (this.headbody == 2) {
			var editor = this.createEditor();
			this.table.rows[this.currow].cells[1].innerText = formdatatype[this.curValue];
			this.entity.formParams[this.loc].datatype = this.curValue;
			// remove the children
			if (this.table.rows[this.currow].cells[2].childNodes.length > 0)
				this.table.rows[this.currow].cells[2]
						.removeChild(this.table.rows[this.currow].cells[2].childNodes[0]);
			if (this.curValue == "file" || this.curValue == "File") {
				editor.name = this.entity.formParams[this.loc].name;
				editor.id = this.entity.formParams[this.loc].name;
				this.table.rows[this.currow].cells[2].appendChild(editor)
			} else {
				this.table.rows[this.currow].cells[2].appendChild(document
						.createTextNode(this.curVal));
			}
		}
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.curVal = this.oldVal;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.curVal = this.newVal;
		this.execute();
	},
	createEditor : function() {
		var input = document.createElement("input");
		input.className = "form-control";
		input.style.height = "27px";
		input.style.padding = "0px";
		input.type = "file";
		input.multiple = true;
		return input;
	},
};

// Change parameter value change command
function AMParaValueChangedCmd(entity, oldvalue, newvalue, table, currow, loc,
		headbody) {
	this.name = "Parameter value changed";
	this.entity = entity;
	this.table = table;
	this.loc = loc;
	this.headbody = headbody;
	this.currow = currow;

	this.oldValue = oldvalue;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMParaValueChangedCmd.prototype = new Command();

AMParaValueChangedCmd.prototype = {
	execute : function() {
		this.table.rows[this.currow].cells[2].innerText = this.curValue;
		if (this.headbody == 1) {
			this.entity.pathParams[this.loc].value = this.curValue;
		} else if (this.headbody == 2) {
			this.entity.formParams[this.loc].value = this.curValue;
		}
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change parameter comments change command
function AMParaCommentChangedCmd(entity, oldvalue, newvalue, table, currow,
		loc, headbody) {
	this.name = "Parameter comment changed";
	this.entity = entity;
	this.table = table;
	this.loc = loc;
	this.headbody = headbody;
	this.currow = currow;

	this.oldValue = oldvalue;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMParaCommentChangedCmd.prototype = new Command();

AMParaCommentChangedCmd.prototype = {
	execute : function() {
		this.table.rows[this.currow].cells[3].innerText = this.curValue;
		if (this.headbody == 1) {
			this.entity.pathParams[this.loc].comments = this.curValue;
		} else if (this.headbody == 2) {
			this.entity.formParams[this.loc].comments = this.curValue;
		}
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change up order command
function AMUpOrderChangedCmd(parent) {
	this.name = "Up order change command";
	this.entity = parent.entity;
	this.parent = parent;
	this.headbody = parent.options.headbody;
	var row = parent.currTable.rows[parent.currRowIndex];
	var td = $(row).find("td")[0];
	var c = $(td).text();
	var row1 = parent.currTable.rows[parent.currRowIndex - 1];
	var td = $(row1).find("td")[0];
	var p = $(td).text();
	this.currRowIndex = parent.currRowIndex;

	this.c1 = -1;
	this.p1 = -1;

	if (this.headbody == 1) {
		for (var k = 0; k < this.entity.pathParams.length; k++) {
			if (this.entity.pathParams[k].name == c) {
				this.c1 = k;
			}
			if (this.entity.pathParams[k].name == p) {
				this.p1 = k;
			}
		}
	} else if (this.headbody == 2) {
		for (var k = 0; k < this.entity.formParams.length; k++) {
			if (this.entity.formParams[k].name == c) {
				this.c1 = k;
			}
			if (this.entity.formParams[k].name == p) {
				this.p1 = k;
			}
		}
	}

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = parent.entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.cmd = 1;// 1: redo; 2: undo
};

AMUpOrderChangedCmd.prototype = new Command();

AMUpOrderChangedCmd.prototype = {
	execute : function() {
		if (this.headbody == 1) {
			var t = this.entity.pathParams[this.p1];
			this.entity.pathParams[this.p1] = this.entity.pathParams[this.c1];
			this.entity.pathParams[this.c1] = t;
			this.parent.currTable.deleteRow(this.currRowIndex - 1);
			var row = this.parent.currTable.insertRow(this.currRowIndex);
			this.parent.createRow(row, t);
		} else if (this.headbody == 2) {
			var t = this.entity.formParams[this.p1];
			this.entity.formParams[this.p1] = this.entity.formParams[this.c1];
			this.entity.formParams[this.c1] = t;
			this.parent.currTable.deleteRow(this.currRowIndex - 1);
			var row = this.parent.currTable.insertRow(this.currRowIndex);
			this.parent.createRow(row, t);
		}
		this.parent.clearSelection(this.parent.currTable);
		if (this.cmd == 1) {
			this.parent.selectRowByIndex(this.currRowIndex - 1);
		} else {
			this.parent.selectRowByIndex(this.currRowIndex);
		}
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change down order command
function AMDownOrderChangedCmd(parent) {
	this.name = "Down order change command";
	this.entity = parent.entity;
	this.parent = parent;
	this.headbody = parent.options.headbody;
	this.currRowIndex = parent.currRowIndex;

	var row = parent.currTable.rows[parent.currRowIndex];
	var td = $(row).find("td")[0];
	var c = $(td).text();
	var row1 = parent.currTable.rows[parent.currRowIndex + 1];
	var td = $(row1).find("td")[0];
	var n = $(td).text();
	this.c1 = -1;
	this.n1 = -1;
	if (this.headbody == 1) {
		for (var k = 0; k < this.entity.pathParams.length; k++) {
			if (this.entity.pathParams[k].name == c) {
				this.c1 = k;
			}
			if (this.entity.pathParams[k].name == n) {
				this.n1 = k;
			}
		}
	} else if (this.headbody == 2) {
		for (var k = 0; k < this.entity.formParams.length; k++) {
			if (this.entity.formParams[k].name == c) {
				this.c1 = k;
			}
			if (this.entity.formParams[k].name == n) {
				this.n1 = k;
			}
		}
	}
	var ts = new Date().getTime();//Utils.getCurrentDateTime();
	this.oldLastupdate = parent.entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.cmd = 1;// 1: redo; 2: undo
};

AMDownOrderChangedCmd.prototype = new Command();

AMDownOrderChangedCmd.prototype = {
	execute : function() {
		if (this.headbody == 1) {
			var t = this.entity.pathParams[this.n1];
			this.entity.pathParams[this.n1] = this.entity.pathParams[this.c1];
			this.entity.pathParams[this.c1] = t;
			this.parent.currTable.deleteRow(this.currRowIndex + 1);
			var row = this.parent.currTable.insertRow(this.currRowIndex);
			this.parent.createRow(row, t);
		} else if (this.headbody == 2) {
			var t = this.entity.formParams[this.n1];
			this.entity.formParams[this.n1] = this.entity.formParams[this.c1];
			this.entity.formParams[this.c1] = t;
			this.parent.currTable.deleteRow(this.currRowIndex + 1);
			var row = this.parent.currTable.insertRow(this.currRowIndex);
			this.parent.createRow(row, t);
		}
		this.parent.clearSelection(this.parent.currTable);
		if (this.cmd == 1) {
			this.parent.selectRowByIndex(this.currRowIndex + 1);
		} else if (this.cmd == 2) {
			this.parent.selectRowByIndex(this.currRowIndex);
		}

		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Add header command
function AMAddHeaderCmd(entity, parent, newPara) {
	this.name = "Add header";
	this.entity = entity;
	this.parent = parent;
	this.newPara = newPara;
	this.newIndex = -1;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
	this.cmd = 1;// 1: redo(add); 2: undo(remove);
};

AMAddHeaderCmd.prototype = new Command();

AMAddHeaderCmd.prototype = {
	execute : function() {
		if (this.cmd == 1) {
			this.entity.headers.push(this.newPara);
			this.newIndex = this.parent.addNewRow(this.newPara);
		} else {
			for (var i = 0; i < this.entity.headers.length; i++) {
				if (this.entity.headers[i].key == this.newPara.key
						|| this.entity.headers[i] == this.newPara) {
					this.entity.headers.splice(i, 1);
					this.parent.currRowIndex = -1;
					break;
				}
			}
			this.parent.removeRow(this.newIndex, this.newPara);
		}
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Remove request header command
function AMRemoveHeaderCmd(entity, parent, para, index) {
	this.name = "Remove header";
	this.para = para;
	this.index = index;
	this.entity = entity;
	this.parent = parent;
	this.rowIndex = -1;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
	this.cmd = 1;// 1: redo(remove); 2: undo(add);
};

AMRemoveHeaderCmd.prototype = new Command();

AMRemoveHeaderCmd.prototype = {
	execute : function() {
		if (this.cmd == 1) {
			for (var i = 0; i < this.entity.headers.length; i++) {
				if (this.entity.headers[i].key == this.para.key) {
					this.entity.headers.splice(i, 1);
					this.parent.currRowIndex = -1;
					break;
				}
			}
			this.parent.removeRow(this.index);
		} else {
			this.entity.headers.push(this.para);
			this.parent.currRowIndex = this.index - 1;
			this.parent.addNewRow(this.para);
		}
		this.parent.selectRowByIndex(this.index);
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change head name change command
function AMHeaderNameChangedCmd(entity, oldname, newname, table, currow, loc) {
	this.name = "Header name changed";
	this.entity = entity;
	this.table = table;
	this.currow = currow;
	this.oldValue = oldname;
	this.newValue = newname;
	this.curValue = this.newValue;
	this.pos = loc;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMHeaderNameChangedCmd.prototype = new Command();

AMHeaderNameChangedCmd.prototype = {
	execute : function() {
		this.table.rows[this.currow].cells[0].innerText = this.curValue;
		this.entity.headers[this.pos].key = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change header value change command
function AMHeaderValueChangedCmd(entity, oldvalue, newvalue, table, currow, loc) {
	this.name = "Header value changed";
	this.entity = entity;
	this.table = table;
	this.loc = loc;
	this.currow = currow;

	this.oldValue = oldvalue;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMHeaderValueChangedCmd.prototype = new Command();

AMHeaderValueChangedCmd.prototype = {
	execute : function() {
		this.table.rows[this.currow].cells[1].innerText = this.curValue;
		this.entity.headers[this.loc].value = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change up header order command
function AMUpHeaderOrderChangedCmd(parent) {
	this.name = "Up header order change command";
	this.entity = parent.entity;
	this.parent = parent;
	var row = parent.currTable.rows[parent.currRowIndex];
	var td = $(row).find("td")[0];
	var c = $(td).text();// current row
	var row1 = parent.currTable.rows[parent.currRowIndex - 1];
	var td = $(row1).find("td")[0];
	var p = $(td).text();// previous row
	this.currRowIndex = parent.currRowIndex;

	this.c1 = -1;
	this.p1 = -1;

	for (var k = 0; k < this.entity.headers.length; k++) {
		if (this.entity.headers[k].key == c) {
			this.c1 = k;
		}
		if (this.entity.headers[k].key == p) {
			this.p1 = k;
		}
	}

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = parent.entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
	this.cmd = 1;// 1: redo; 2: undo
};

AMUpHeaderOrderChangedCmd.prototype = new Command();

AMUpHeaderOrderChangedCmd.prototype = {
	execute : function() {
		var t = this.entity.headers[this.p1];
		this.entity.headers[this.p1] = this.entity.headers[this.c1];
		this.entity.headers[this.c1] = t;

		this.parent.removeRow(this.currRowIndex - 1);
		var row = this.parent.currTable.insertRow(this.currRowIndex);
		this.parent.createRow(row, t);
		this.parent.clearSelection(this.parent.currTable);
		if (this.cmd == 1) {
			this.parent.selectRowByIndex(this.currRowIndex - 1);
		} else {
			this.parent.selectRowByIndex(this.currRowIndex);
		}

		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change down header order command
function AMDownHeaderOrderChangedCmd(parent) {
	this.name = "Down header order change command";
	this.entity = parent.entity;
	this.parent = parent;
	this.currRowIndex = parent.currRowIndex;

	var row = parent.currTable.rows[parent.currRowIndex];
	var td = $(row).find("td")[0];
	var c = $(td).text();// current row
	var row1 = parent.currTable.rows[parent.currRowIndex + 1];
	var td = $(row1).find("td")[0];
	var n = $(td).text();// next row

	this.c1 = -1;
	this.n1 = -1;

	for (var k = 0; k < this.entity.headers.length; k++) {
		if (this.entity.headers[k].key == c) {
			this.c1 = k;
		}
		if (this.entity.headers[k].key == n) {
			this.n1 = k;
		}
	}

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = parent.entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;

	this.cmd = 1; // 1: redo; 2: undo
};

AMDownHeaderOrderChangedCmd.prototype = new Command();

AMDownHeaderOrderChangedCmd.prototype = {
	execute : function() {
		var t = this.entity.headers[this.n1];
		this.entity.headers[this.n1] = this.entity.headers[this.c1];
		this.entity.headers[this.c1] = t;

		this.parent.removeRow(this.currRowIndex + 1);
		var row = this.parent.currTable.insertRow(this.currRowIndex);
		this.parent.createRow(row, t);
		this.parent.clearSelection(this.parent.currTable);

		if (this.cmd == 1) {
			this.parent.selectRowByIndex(this.currRowIndex + 1);
		} else if (this.cmd == 2) {
			this.parent.selectRowByIndex(this.currRowIndex);
		}

		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.cmd = 2;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.cmd = 1;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change RESTful setting for request command
function AMRESTfulRequestSettingChangedCmd(entity, newcheck, checkInput) {
	this.name = "RESTful request setting changed";
	this.entity = entity;
	this.checkInput = checkInput;

	this.oldValue = entity.restful;
	this.newValue = newcheck;
	this.curValue = this.newValue;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMRESTfulRequestSettingChangedCmd.prototype = new Command();

AMRESTfulRequestSettingChangedCmd.prototype = {
	execute : function() {
		if (this.curValue == 0)
			this.checkInput.checked = false;
		else
			this.checkInput.checked = true;
		this.entity.restful = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change authorization change command
function AMWebAppAuthorizationChangedCmd(entity, newvalue, authHeaders) {
	this.name = "Web App Authorization change command";
	this.entity = entity;

	this.oldValue = entity.authorizationType;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	this.oldAuths = entity.authorization;
	this.newAuths = authHeaders;
	this.curAuths = this.newAuths;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMWebAppAuthorizationChangedCmd.prototype = new Command();

AMWebAppAuthorizationChangedCmd.prototype = {
	execute : function() {
		this.entity.authorizationType = this.curValue;
		this.entity.authorization = this.curAuths;
		map[this.entity.id].amRAppEditor.authpane.authSelect.value = this.curValue;
		map[this.entity.id].amRAppEditor.authpane
				.showAuthorizationPane(this.curValue);
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curAuths = this.oldAuths;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curAuths = this.newAuths;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};


//Change return type command
function AMWebAppReturnTypeChangedCmd(entity, newvalue) {
	this.name = "Web App Return Type change command";
	this.entity = entity;

	this.oldValue = entity.returnType;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMWebAppReturnTypeChangedCmd.prototype = new Command();

AMWebAppReturnTypeChangedCmd.prototype = {
	execute : function() {
		this.entity.returnType = this.curValue;
		map[this.entity.id].amRAppEditor.resppane.respSelect.value = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

//Change return description command
function AMWebAppReturnDescChangedCmd(entity, newvalue) {
	this.name = "Web App Return Desc change command";
	this.entity = entity;

	this.oldValue = entity.returnTypeDescription;
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMWebAppReturnDescChangedCmd.prototype = new Command();

AMWebAppReturnDescChangedCmd.prototype = {
	execute : function() {
		this.entity.returnTypeDescription = this.curValue;
		map[this.entity.id].amRAppEditor.resppane.respTextArea.value = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

// Change web auth service host value in editor
function AMWebAuthHeaderChangedCmd(entity, propname, control) {
	this.name = "Web auth header changed";
	this.entity = entity;
	this.propname = propname;
	this.control = control;

	for (var i = 0; i < this.entity.authorization.length; i++) {
		if (this.entity.authorization[i].key == propname) {
			this.oldValue = this.entity.authorization[i].value;
			break;
		}
	}
	this.newValue = control.value;
	this.curValue = this.newValue;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMWebAuthHeaderChangedCmd.prototype = new Command();

AMWebAuthHeaderChangedCmd.prototype = {
	execute : function() {
		for (var i = 0; i < this.entity.authorization.length; i++) {
			if (this.entity.authorization[i].key == this.propname) {
				this.entity.authorization[i].value = this.curValue;
				break;
			}
		}
		this.entity.lastupdate = this.curLastupdate;
		this.control.value = this.curValue;
		map[this.entity.id].amRAppEditor.setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};

//change docker inputName value in editor
function AMImageConfigurePaneChangedCmd(entity, propname, newvalue){
	this.name = "inputName value changed command";
	this.entity = entity;
	this.propname = propname;
	this.editorid = entity.owner;

	this.oldValue = this.entity[this.propname];
	this.newValue = newvalue;
	this.curValue = this.newValue;
	
	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

AMImageConfigurePaneChangedCmd.prototype = new Command();

AMImageConfigurePaneChangedCmd.prototype = {
		execute : function() {
			this.entity[this.propname] = Utils.stringify(this.curValue);
			this.entity.lastupdate = this.curLastupdate;
			map[this.entity.id].containerData.refreshEntity(this.entity);
			//map[this.entity.id].containerData.setPropertySheet();
		},
		undo : function() {
			this.curValue = this.oldValue;
			this.curLastupdate = this.oldLastupdate;
			this.execute();
		},
		redo : function() {
			this.curValue = this.newValue;
			this.curLastupdate = this.newLastupdate;
			this.execute();
		},
};


// Change prop value setting command
function APKValueChangedCmd(entity, propname, newvalue) {
	this.name = "Value changed";
	this.entity = entity;
	this.propname = propname;

	this.oldValue = entity[propname];
	this.newValue = newvalue;
	this.curValue = this.newValue;

	var ts = new Date().getTime();// Utils.getCurrentDateTime();
	this.oldLastupdate = entity.lastupdate;
	this.newLastupdate = ts;
	this.curLastupdate = this.newLastupdate;
};

APKValueChangedCmd.prototype = new Command();

APKValueChangedCmd.prototype = {
	execute : function() {
		this.entity[this.propname] = this.curValue;
		this.entity.lastupdate = this.curLastupdate;
		map[this.entity.id].setPropertySheet();
	},
	undo : function() {
		this.curValue = this.oldValue;
		this.curLastupdate = this.oldLastupdate;
		this.execute();
	},
	redo : function() {
		this.curValue = this.newValue;
		this.curLastupdate = this.newLastupdate;
		this.execute();
	},
};





