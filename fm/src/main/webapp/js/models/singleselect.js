/**
 * @author Dahai Cao created 2017-08 and last updated at 10:21 on 2019-03-05
 *
 */
function SingleSelect() {
	this.id = null;
	this.parent = null; // parent Id
	this.currOwner = null; // form Id
	// basic properties
	this.title = "单选下拉框";
	this.help = "我的帮助及提示"; // description
	this.required = 1; // 0: not required; 1: required;
	this.tabIndex = "-1";
	this.initValue = ""; // default value
	this.dsType = 0; // 0: general direct data; 1: reference data; 2: microservice
	this.options = null;
	this.refoptions = null; // reference Id
	this.refcode = null; // reference parent code
	this.msoptions = null; // microservice Id
	this.readOnly = 0; // 0:false; 1:true; 如果只读，就只显示内容而不显示文本框
	this.disabled = 0; // 0:false; 1:true
	this.hidden = 0; // 0: visible; 1: invisible
	this.varId = null; // process variable Id
	this.ac = null;
	this.evn = 0;
	this.prependType = "No"; // No; Text; Icon prepend;
	this.prepend = null;
	this.appendType = "No"; // No; Text; Icon prepend;
	this.append = null;

	this.classtypename = "SingleSelect";

	this.rules = []; // list of propagation rules
};

SingleSelect.prototype = new UIComponent();

// for previewing
SingleSelect.prototype.clone = function() {
	var t = new SingleSelect();
	t.id = this.id;
	t.parent = this.parent; // parent Id
	t.currOwner = this.currOwner; // form Id
	t.title = this.title;
	t.help = this.help; // description
	t.required = this.required;
	t.tabIndex = this.tabIndex;
	t.initValue = this.initValue;
	t.dsType = this.dsType;
	t.options = this.options;
	t.refoptions = this.refoptions;
	t.refcode = this.refcode;
	t.msoptions = this.msoptions;
	t.readOnly = this.readOnly; // 0:false; 1:true
	t.disabled = this.disabled; // 0:false; 1:true
	t.hidden = this.hidden;
	t.varId = this.varId;
	t.ac = this.ac;
	t.evn = this.evn;
	t.prependType = this.prependType; // No; Text; Icon prepend;
	t.prepend = this.prepend;
	t.appendType = this.appendType; // No; Text; Icon prepend;
	t.append = this.append;
	t.toDomForHTML();
	return t;
};

// for previewing
SingleSelect.prototype.cloneRules = function(owner, old) {
	this.f = owner;
	var o = old.seekObjectByID(this.id);
	if (o.rules.length > 0) {
		for (var i = 0; i < o.rules.length; i++) {
			this.rules.push(o.rules[i].clone(owner));
		}
	}
};

// for previewing
SingleSelect.prototype.toDomForHTML = function(parent) {
	this.dom = document.createElement("DIV");
	parent.appendChild(this.dom);
	this.dom.id = this.id;
	this.dom.className = "form-group";
	this.dom.tabIndex = "-1";
	this.updateDom();
	return this.dom;
};

SingleSelect.prototype.toDom = function(parent) {
	this.toDomforFormGroup(parent);
	this.updateDom();
};

SingleSelect.prototype.updateDom = function() {
	while (this.dom.hasChildNodes()) { // clear dom
		if (this.dom.lastChild.id != "rm" + this.id) {
			this.dom.removeChild(this.dom.lastChild);
		} else if (this.dom.children.length == 1) {
			break;
		}
	}
	var titlelabel = document.createElement("LABEL");
	titlelabel.className = "control-label";
	this.dom.appendChild(titlelabel);
	var titleNode = document.createTextNode(this.title);
	titlelabel.appendChild(titleNode);

	if (this.readOnly == 0) {
		var select = document.createElement("SELECT");
		select.id = "sel" + this.id;
		select.className = "select form-control";
		if (this.required == 0) { //
			var requiredSpan = document.createElement("SPAN");
			requiredSpan.style.color = "red";
			requiredSpan.innerHTML = " *";
			titlelabel.appendChild(requiredSpan);
			select.setAttribute("required", "");
		} else if (this.required == 1) { //
			select.removeAttribute("required");
		}
		select.tabIndex = this.tabIndex;
		select.addEventListener("focus", this, false);
		select.addEventListener("blur", this, false);
		select.addEventListener("change", this, false);
		if (this.disabled == 1)
			select.disabled = true;
		if (this.prependType != "No" || this.appendType != "No") {
			var inputGroup = document.createElement("DIV");
			inputGroup.className = "input-group";
			this.dom.appendChild(inputGroup);
			if (this.prependType == "Text") {
				var groupPreAddOn = document.createElement("DIV");
				groupPreAddOn.className = "input-group-addon";
				inputGroup.appendChild(groupPreAddOn);
				var textPrepend = document.createTextNode("");
				groupPreAddOn.appendChild(textPrepend);
				if (this.prepend != null) {
					textPrepend.textContent = this.prepend;
				} else {
					textPrepend.textContent = "";
				}
			} else if (this.prependType == "Icon") {
				var groupPreAddOn = document.createElement("DIV");
				groupPreAddOn.className = "input-group-addon";
				inputGroup.appendChild(groupPreAddOn);
				var preIcon = document.createElement("I");
				groupPreAddOn.appendChild(preIcon);
				if (this.prepend != null) {
					preIcon.className = "fa " + this.prepend;
				} else {
					preIcon.className = "";
				}
			}
			inputGroup.appendChild(select);
			if (this.appendType == "Text") {
				var groupPostAddOn = document.createElement("DIV");
				groupPostAddOn.className = "input-group-addon";
				inputGroup.appendChild(groupPostAddOn);
				var textAppend = document.createTextNode("");
				groupPostAddOn.appendChild(textAppend);
				if (this.append != null) {
					textAppend.textContent = this.append;
				} else {
					textAppend.textContent = "";
				}
			} else if (this.appendType == "Icon") {
				var groupPostAddOn = document.createElement("DIV");
				groupPostAddOn.className = "input-group-addon";
				inputGroup.appendChild(groupPostAddOn);
				var postIcon = document.createElement("I");
				groupPostAddOn.appendChild(postIcon);
				if (this.append != null) {
					postIcon.className = "fa " + this.append;
				} else {
					postIcon.className = "";
				}
			}
		} else {
			this.dom.appendChild(select);
		}
		if (this.help != null && this.help != "") {
			var helpNode = document.createElement("SPAN");
			helpNode.className = "help-block";
			helpNode.id = "hlp" + this.id;
			helpNode.textContent = this.help;
			this.dom.appendChild(helpNode);
		}

		if (this.dsType == 0) { // general data
			if (this.options != null && this.options != "") {
				if (this.required == 0) { // cannot be null
					this.parseOptions(select, this.options);
				} else {
					this.parseOptions(select, this.options);
					this.addOptions(select, "- 请选择 -", "", 0);
				}
				if (this.initValue != null && this.initValue != "") {
					select.value = this.initValue;
				} else
					select.selectedIndex = 0;
			} else {
				if (this.required == 0) { // can be null
					this.addOptions(select, "- 请选择 -", "", 0);
					select.selectedIndex = 0;
				}
			}
		} else if (this.dsType == 1) { // reference data
			if (this.refoptions != null && this.refoptions != "") {
				this.parseRefOptions(select, this.refoptions, this.refcode);
			} else {
				if (this.required == 0) { // can be null
					this.addOptions(select, "- 请选择 -", "", 0);
					select.selectedIndex = 0;
				}
			}
		} else if (this.dsType == 2) { // microsoft service data

		}

	} else {
		var input = document.createElement("DIV");
		input.id = "sel" + this.id;
		if (this.dsType == 0) { // general data
			if (this.options != null && this.options != "") {
				var lines = this.options.split(/\n/);
				if (lines.length > 0) {
					for (var i = 0; i < lines.length; i++) {
						var o = lines[i].split(':');
						if (o[0] == this.initValue) {
							input.innerText = o[1];
						}
					}
				}
			} else {
				input.innerText = "";
			}
		} else if (this.dsType == 1) { // reference data
			if (this.refoptions != null && this.refoptions != "") {
				this.parseRefOptions(input, this.refoptions, this.refcode);
			} else {
				input.innerText = "";
			}
		} else if (this.dsType == 2) { // microsoft service data
			if (this.msoptions != null && this.msoptions != "") {

			} else {
				input.innerText = "";
			}
		}
		this.dom.appendChild(input);
	}
	if (this.hidden == 0)
		this.dom.style.display = "";
	else
		this.dom.style.display = "none";
	this.select = select;
};

SingleSelect.prototype.editable = function(e) {
	var o = document.getElementById("sel" + this.id);
	if (e == "0") {
		o.readOnly = false;
	} else {
		o.readOnly = true;
	}
};

SingleSelect.prototype.show = function(d) {
	var o = document.getElementById(this.id);
	if (d == "1") {
		o.style.display = "";
	} else {
		o.style.display = "none";
	}
};

SingleSelect.prototype.updateValueforRuntime = function() {
	var o = document.getElementById("sel" + this.id);
	o.value = this.initValue;
};

SingleSelect.prototype.enable = function(e) {
	var o = document.getElementById("sel" + this.id);
	if (e == "1") {
		o.disabled = false;
	} else {
		o.disabled = true;
	}
};

SingleSelect.prototype.parseOptions = function(parent, options) {
	var lines = options.split(/\n/);
	if (lines.length > 0) {
		for (var i = 0; i < lines.length; i++) {
			var o = lines[i].split(':');
			this.addOptions(parent, o[1], o[0], i);
		}
	}
};

SingleSelect.prototype.parseRefOptions = function(parent, options, val) {
	$("#progressbar").show();
	var that = this;
	$.getJSON(service.api(14), {
		id : options,
		code : val,
	}).complete(function(data) {
		that.loadReferenceDetails(parent, data.responseJSON);
		$("#progressbar").hide();
	});
};

SingleSelect.prototype.loadReferenceDetails = function(parent, data) {
	if (data != null && data.length > 0) {
		if (this.readOnly == 0) {
			for (var i = 0; i < data.length; i++) {
				this.addOptions(parent, data[i].name, data[i].code, i);
			}
			if (this.required == 1) { // can be null
				this.addOptions(parent, "- 请选择 -", "", 0);
			}
			if (this.initValue != null) {
				parent.value = this.initValue;
			} else
				parent.selectedIndex = 0;
		} else {
			for (var i = 0; i < data.length; i++) {
				if (data[i].code == this.initValue) {
					parent.innerText = data[i].name;
				}
			}
		}
	}
};

SingleSelect.prototype.addOptions = function(parent, title, value, index) {
	var option = document.createElement("option");
	option.text = title;
	option.value = value;
	parent.options.add(option, index);
};

SingleSelect.prototype.toDomforFormGroup = function(parent) {
	this.dom = document.createElement("DIV");
	parent.appendChild(this.dom);
	this.dom.id = this.id;
	this.dom.className = "form-group comp_outline";
	this.dom.tabIndex = "-1";
	this.dom.draggable = "true";
	// dragged component
	this.dom.addEventListener("dragstart", this, false);
	this.dom.addEventListener("drag", this, false);
	this.dom.addEventListener("dragend", this, false);
	this.dom.addEventListener("click", this, false);
	this.dom.addEventListener("focus", this, false);
	this.dom.addEventListener("blur", this, false);

	var remove = document.createElement("A");
	remove.id = "rm" + this.id;
	remove.className = "remove";
	this.dom.appendChild(remove);
	var removeSpan = document.createElement("i");
	remove.appendChild(removeSpan);
	removeSpan.className = "glyphicon glyphicon-remove";
	removeSpan.addEventListener("click", this, false);
};

SingleSelect.prototype.toRealValue = function() {
	if (this.f != undefined) {
		var o = this.f.seekObjectByID(this.id);
		var sel = o.select;
		if (sel != undefined && sel != null) {
			return "\"" + sel.value + "\"";
		}
		return null;
	} else {
		var sel = document.getElementById("sel" + this.id);
		if (sel != undefined && sel != null) {
			return "\"" + sel.value + "\"";
		}
		return null;
	}

};

SingleSelect.prototype.handleEvent = function(e) {
	switch (e.type) {
	case "dragstart":// Events fired on the draggable target(source element)
		this.doDragStart(e);
		break;
	case "drag":// Events fired on the draggable target (the source element)
		this.doDrag(e);
		break;
	case "dragend":// Events fired on the draggable target(source element)
		this.doDragEnd(e);
		break;
	case "click":
		this.doClick(e);
		break;
	case "focus":
		this.doFocus(e);
		break;
	case "blur":
		this.doBlur(e);
		break;
	case "change":
		this.doChange(e);
		break;
	}
};

SingleSelect.prototype.doClick = function(evt) {
	if (this.evn == 0) {
		if (evt.target.className == "glyphicon glyphicon-remove") {
			if (map[this.currOwner] != null
				&& map[this.currOwner].currObject instanceof Form) {
				map[this.currOwner].stack.execute(new FMRemoveRowCmd(
					evt.target.parentNode.parentNode.id,
					map[this.currOwner].currObject));
			}
		} else {
			evt.target.focus();
			map[this.currOwner].selected = this;
			map[this.currOwner].enableEditButtons();
			map[this.currOwner].setPropertySheet();
		}
	} else if (this.evn == 1) {
	}
	Utils.stopBubble(evt);
};

SingleSelect.prototype.doFocus = function(evt) {
	this.doHandle(evt, 4);

	bgcache = evt.target.style.backgroundColor;
	evt.target.style.backgroundColor = Utils.highLight();
	Utils.stopBubble(evt);
};

SingleSelect.prototype.doBlur = function(evt) {
	this.doHandle(evt, 5);

	evt.target.style.backgroundColor = bgcache;
	bgcache = null;
	Utils.stopBubble(evt);
};

SingleSelect.prototype.doChange = function(evt) {
	if (this.evn == 0) {
		this.doHandle(evt, 2);
		var e = document.getElementById("sel" + this.id);
		if (evt.target == e) {
			map[this.currOwner].stack.execute(new FMUIValueChangedCmd(this,
				"initValue", e.value, this.currOwner));
		}
	} else if (this.evn == 1) {
		map[this.currOwner].stack.execute(new CLValueChangedCmd(this,
			"initValue", evt, this.currOwner));
	}
	Utils.stopBubble(evt);
};

SingleSelect.prototype.doHandle = function(evt, cmd) {
	try {
		var e = document.getElementById("sel" + this.id);
		if (e == undefined || e == null) {
			return;
		}
		for (var i = 0; i < this.rules.length; i++) {
			if (this.rules[i].behavior == cmd) {
				if (this.rules[i].conditions == null
						|| this.rules[i].conditions.isNull()) {
					// execute two commands:
					// the first command:
					this.tCmd(evt, this.rules[i], e);
					// the second command:
					this.fCmd(evt, this.rules[i], e);
				} else {
					if (eval(this.rules[i].conditions.toRealValue())) {
						this.tCmd(evt, this.rules[i], e);
					} else {
						this.fCmd(evt, this.rules[i], e);
					}
				}
			}
		}
	} catch (exception) {
		console.log(exception);
	}
};

SingleSelect.prototype.message = function(evt, cmd, msg) {
	if (cmd == 10 || cmd == 11 || cmd == 12 || cmd == 13) {
		var t = document.getElementById("hlp" + this.id);
		if (t == null) {
			t = document.createElement("SPAN");
			this.dom.appendChild(t);
			t.className = "help-block";
			t.id = "hlp" + this.id;
		}
		if (cmd == 10) {
			t.classList.add("alert-success");
		} else if (cmd == 11) {
			t.classList.add("alert-info");
		} else if (cmd == 12) {
			t.classList.add("alert-warning");
		} else if (cmd == 13) {
			t.classList.add("alert-danger");
		}
		t.textContent = msg;
	}
};

SingleSelect.prototype.fCmd = function(evt, r, e) {
	if (r.eComId == null || r.eComId == "") {
		return;
	}
	if (r.eComId == 0) {
		this.message(evt, r.eComAction, (r.eComExpressions == null ? ""
				: eval(r.eComExpressions.toRealValue())));
	} else {
		if (this.f != undefined) {
			var o = this.f.seekObjectByID(r.eComId);
			this.act(evt, r.eComAction, o, e, (r.eComExpressions == null ? ""
					: eval(r.eComExpressions.toRealValue())));
		} else {
			var o = map[this.currOwner].currObject.seekObjectByID(r.eComId);
			this.act(evt, r.eComAction, o, e, (r.eComExpressions == null ? ""
					: eval(r.eComExpressions.toRealValue())));
		}
	}
};

SingleSelect.prototype.tCmd = function(evt, r, e) {
	if (r.tComId == null || r.tComId == "") {
		return;
	}
	if (r.tComId == 0) {
		this.message(evt, r.tComAction, (r.tComExpressions == null ? ""
				: eval(r.tComExpressions.toRealValue())));
	} else {
		if (this.f != undefined) {
			var o = this.f.seekObjectByID(r.tComId);
			this.act(evt, r.tComAction, o, e, (r.tComExpressions == null ? ""
					: eval(r.tComExpressions.toRealValue())));
		} else {
			var o = map[this.currOwner].currObject.seekObjectByID(r.tComId);
			this.act(evt, r.tComAction, o, e, (r.tComExpressions == null ? ""
					: eval(r.tComExpressions.toRealValue())));
		}
	}
};

SingleSelect.prototype.act = function(evt, cmd, o, e, val) {
	if (cmd == 1) {
		o.show("0"); // hidden
	} else if (cmd == 2) {
		o.show("1"); // show
	} else if (cmd == 3) {
		if (o.editable)
			o.editable("0"); // writable
	} else if (cmd == 4) {
		if (o.editable)
			o.editable("1"); // read only
	} else if (cmd == 5) {
		if (o.enable)
			o.enable("1"); // enabled
	} else if (cmd == 6) {
		if (o.enable)
			o.enable("0"); // disabled
	} else if (cmd == 7) { // clear
		e.value = "";
		o.initValue = "";
	} else if (cmd == 8) { // update
		if (o instanceof SingleSelect || o instanceof ListSelect) {
			if (val != null && val != "") {
				o.dsType = 1; // 0: direct data; 1: reference data; 2:
								// microservice
				o.refoptions = this.refoptions; // reference Id
				o.refcode = val; // reference parent code
				o.updateDom();
			}
		}
	} else if (cmd == 9) { // verify

	}
};

SingleSelect.prototype.doDragStart = function(evt) {
	if (this.evn == 0) {
		if (map[this.currOwner] != null
			&& map[this.currOwner].currObject instanceof Form) {
			// this / e.target is the source node.
			evt.target.style.opacity = '0.7';
			evt.dataTransfer.effectAllowed = 'move';
			copyclip = evt.target.id; // critical
		}
	} else if (this.evn == 1) {
	}
	Utils.stopBubble(evt);
};

SingleSelect.prototype.doDrag = function(evt) {
	Utils.stopBubble(evt);
};

SingleSelect.prototype.doDragEnd = function(evt) {
	if (this.evn == 0) {
		if (map[this.currOwner] != null
			&& map[this.currOwner].currObject instanceof Form) {
			evt.target.style.opacity = '1';
		}
	} else if (this.evn == 1) {
	}
	Utils.stopBubble(evt);
};

SingleSelect.prototype.parseFromJSON = function(json, evn) {
	this.id = json.id;
	this.parent = json.parent; // parent Id
	this.currOwner = json.currOwner; // form Id

	this.title = json.title;
	this.help = json.help; // description
	this.required = json.required; // 0: not required; 1: required;
	this.tabIndex = json.tabIndex;
	this.disabled = json.disabled; // 0:false; 1:true
	this.hidden = json.hidden;
	this.dsType = json.dsType; // 0:direct data;1:reference data;2:microservice
	this.initValue = json.initValue; // default value
	this.readOnly = json.readOnly;
	this.refoptions = json.refoptions; // reference Id
	this.refcode = json.refcode;
	this.msoptions = json.msoptions; // microservice Id
	this.options = json.options; // direct data
	this.prependType = json.prependType; // No; Text; Icon prepend;
	this.prepend = json.prepend;
	this.appendType = json.appendType; // No; Text; Icon prepend;
	this.append = json.append;
	this.varId = json.varId;
	this.ac = json.ac;
	this.evn = evn;
	// parsing propagation rules firstly.
	if (json.rules != undefined && json.rules != null && json.rules.length > 0) {
		for (var i = 0; i < json.rules.length; i++) {
			var r = new PropagateRule();
			r.parseFromJSON(json.rules[i]);
			this.rules.push(r);
		}
	}
};

SingleSelect.prototype.parseExpressions = function(owner) {
	for (var i = 0; i < this.rules.length; i++) {
		this.rules[i].parseExpressions(owner);
	}
};

SingleSelect.prototype.toTree = function() {
	return {
		id : this.id,
		text : this.title,
		icon : "glyphicon glyphicon-collapse-down",
		data : "单选下拉框|" + (this.initValue == null ? "" : this.initValue),
	}
};

SingleSelect.prototype.fetchRuleByNum = function(number) {
	if (this.rules.length > 0) {
		for (var i = 0; i < this.rules.length; i++) {
			if (i + 1 == number) {
				return this.rules[i];
			}
		}
	}
	return null;
};

SingleSelect.prototype.toString = function() {
	return this.title == null ? "单行下拉选框" : this.title;
};

SingleSelect.prototype.addRule = function(r) {
	this.rules.push(r);
};

SingleSelect.prototype.insertRule = function(r, index) {
	this.rules.splice(index, 0, r);
};

SingleSelect.prototype.removeRule = function(r) {
	for (var i = 0; i < this.rules.length; i++) {
		if (this.rules[i] == r) {
			this.rules.splice(i, 1);
			break;
		}
	}
};
