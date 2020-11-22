/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "basicPropertySheet";
	var defaults = {
		prop : "",
		topparent : "",
	};

	var BasicPropertySheet = function(element, options) {
		this.element = element;
		this.options = $.extend({
			prop : "",
			topparent : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.tabId = null;
		this.topparent = null;
		this.propertysheet = null;
		this.init(options);
		this.clearSheet();
		this.initSheet();
	};

	BasicPropertySheet.prototype.init = function(options) {
		this.topparent = options.topparent;
		var panelDiv = document.createElement("DIV");
		panelDiv.className = "panel panel-default";
		this.element.appendChild(panelDiv);

		var header = document.createElement("DIV");
		header.className = "panel-heading";
		header.innerHTML = "基本属性";
		panelDiv.appendChild(header);

		var tableDiv = document.createElement("DIV");
		tableDiv.className = "table-responsive";
		tableDiv.style.overflowY = "auto";
		tableDiv.style.overflowX = "auto";
		tableDiv.id = "basicpropertysheet";
		panelDiv.appendChild(tableDiv);

		this.propertysheet = document.createElement("table");
		this.propertysheet.id = "propertysheet";
		this.propertysheet.className = "table table-striped table-hover";
		tableDiv.appendChild(this.propertysheet);

		// general message dialog plugin
		var p3 = $(options.topparent).messageDialog({
			id : "016",
			title : "云BPM - 提示",
			parent : this,
		});
		this.messageDialog = p3.data("messageDialog");

		var plugin1 = $(this.propertysheet).textCellEditor({
			parent : this,
			msg : this.messageDialog,
		});
		this.editor = plugin1.data("textCellEditor");

//		var plugin2 = $(this.propertysheet).numberCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor2 = plugin2.data("numberCellEditor");
//
//		var plugin3 = $(this.propertysheet).textareaCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor3 = plugin3.data("textareaCellEditor");
//
//		var plugin4 = $(this.propertysheet).emailCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor4 = plugin4.data("emailCellEditor");
//
//		var plugin5 = $(this.propertysheet).dateCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor5 = plugin5.data("dateCellEditor");
//
//		var plugin6 = $(this.propertysheet).bcSelectCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor6 = plugin6.data("bcSelectCellEditor");
//
//		var plugin7 = $(this.propertysheet).bcdSelectCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor7 = plugin7.data("bcdSelectCellEditor");
//
//		var plugin8 = $(this.propertysheet).rankSelectCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor8 = plugin8.data("rankSelectCellEditor");
//
//		var plugin9 = $(this.propertysheet).staffNumberCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor9 = plugin9.data("staffNumberCellEditor");
//
//		var plugin10 = $(this.propertysheet).phoneNumberCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor10 = plugin10.data("phoneNumberCellEditor");
//
//		var plugin11 = $(this.propertysheet).yesnoCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor11 = plugin11.data("yesnoCellEditor");
//
//		var plugin12 = $(this.propertysheet).orgStatusCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor12 = plugin12.data("orgStatusCellEditor");
//
//		var plugin13 = $(this.propertysheet).orgFullNameCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor13 = plugin13.data("orgFullNameCellEditor");
//
//		var plugin14 = $(this.propertysheet).webCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor14 = plugin14.data("webCellEditor");
//
//		// user / staff property editor
//		var plugin15 = $(this.propertysheet).userFullNameCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor15 = plugin15.data("userFullNameCellEditor");
//
//		var plugin16 = $(this.propertysheet).userGenderCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor16 = plugin16.data("userGenderCellEditor");
//
//		var plugin17 = $(this.propertysheet).simpleDateCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor17 = plugin17.data("simpleDateCellEditor");
//
//		var plugin18 = $(this.propertysheet).userIdTypeCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor18 = plugin18.data("userIdTypeCellEditor");
//
//		var plugin181 = $(this.propertysheet).userIdNumCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor181 = plugin181.data("userIdNumCellEditor");
//
//		var plugin19 = $(this.propertysheet).userTextPropCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor19 = plugin19.data("userTextPropCellEditor");
//
//		var plugin20 = $(this.propertysheet).userNumPropCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor20 = plugin20.data("userNumPropCellEditor");
//
//		var plugin21 = $(this.propertysheet).userTextAreaPropCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor21 = plugin21.data("userTextAreaPropCellEditor");
//
//		var plugin22 = $(this.propertysheet).staffPropSelectCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor22 = plugin22.data("staffPropSelectCellEditor");
//
//		var plugin23 = $(this.propertysheet).staffTextPropCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor23 = plugin23.data("staffTextPropCellEditor");
//
//		var plugin24 = $(this.propertysheet).staffPhoneNumPropCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor24 = plugin24.data("staffPhoneNumPropCellEditor");
//
//		var plugin25 = $(this.propertysheet).staffDateCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor25 = plugin25.data("staffDateCellEditor");
//
//		var plugin26 = $(this.propertysheet).staffTextAreaPropCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor26 = plugin26.data("staffTextAreaPropCellEditor");
//		
//		var plugin27 = $(this.propertysheet).authGroupTextPropCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor27 = plugin27.data("authGroupTextPropCellEditor");
//		
//		var plugin28 = $(this.propertysheet).authGroupTextAreaPropCellEditor({
//			parent : this,
//			msg : this.messageDialog,
//		});
//		this.editor28 = plugin28.data("authGroupTextAreaPropCellEditor");

	};

	BasicPropertySheet.prototype.initSheet = function(options) {
		for (var i = 0; i < 20; i++) {
			var row = this.propertysheet.insertRow(-1);
			var cell1 = row.insertCell(0);
			cell1.innerHTML = "&nbsp;";
		}
	};

	BasicPropertySheet.prototype.clearSheet = function(options) {
		$(this.propertysheet).children().remove();
	};

	BasicPropertySheet.prototype.setSheet = function(obj) {
		this.clearSheet();
		this.entity = obj;
		var sheet = this.propertysheet;
		if (obj instanceof TrainingPerson) {
			for (x in obj) {
				if (x == "id" || x == "firstName" || x == "lastName"
						|| x == "gender" || x == "birthday" ) {
					var editable = "-1";
					var keyname = "";
					var isnull = "y";
					if (x == "id") {
						keyname = "系统标识";
						editable = "-1";
					} else if (x == "firstName") {
						keyname = "名";
						editable = "nme";// org name editable
						isnull = "n";
					} else if (x == "lastName") {
						keyname = "姓";
						editable = "snme"; // text editable
						isnull = "n";
					} else if (x == "gender") {
						keyname = "性别";
						editable = "gdr";
					}
					if (x == "firstName" || x == "lastName") {
						this.setPropertyCell(sheet, x, keyname,
								obj[x] != null ? Utils.parse(obj[x]) : "",
								editable, isnull);
					} else if (x == "gender") {
						this.setPropertyCell(sheet, x, keyname, gender[obj[x]],
								editable, isnull);
					} else {
						this.setPropertyCell(sheet, x, keyname, obj[x],
								editable, isnull);
					}
				}
			}
		}

	};

	BasicPropertySheet.prototype.setPropertyCell = function(table, key,
			keydesc, keyvalue, editable, isnull) {
		var row = table.insertRow(-1);
		row.addEventListener("click", this, false);
		row.addEventListener("dblclick", this, false);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		$(cell1).text(keydesc);
		// cell1.innerHTML = keydesc;
		cell1.setAttribute("nowrap", "true");
		cell1.setAttribute("key", key);
		cell1.setAttribute("type", "h");
		$(cell2).text(keyvalue);
		// cell2.innerHTML = keyvalue;
		cell2.setAttribute("key", key);
		cell2.setAttribute("type", editable);
		cell2.setAttribute("null", isnull);
	};

	BasicPropertySheet.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "dblclick":
			this.doDblClick(e);
			break;
		}
	};

	BasicPropertySheet.prototype.doDblClick = function(evt) {
		if (evt.target.tagName == "TD") {
			this.propertysheet.focus();
			this.startToEdit(evt.target);
		}
	};

	BasicPropertySheet.prototype.startToEdit = function(tag) {
		var t = tag.getAttribute("type");
		if (t == "nme") {
			this.editor.loadEditor(tag, this.entity, tag.getAttribute("key"),
					tag.getAttribute("null"));
		} else if (t == "snme") {
			this.editor.loadEditor(tag, this.entity, tag.getAttribute("key"),
					tag.getAttribute("null"));
		} else if (t == "gdr") {
			this.editor.loadEditor(tag, this.entity, tag.getAttribute("key"),
					tag.getAttribute("null"));
		} else if (t == "bod") {
			this.editor.loadEditor(tag, this.entity, tag.getAttribute("key"),
					tag.getAttribute("null"));
		}
//		} else if (t == "bcse") {
//			this.editor6.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "bcdse") {
//			this.editor7.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "rse") {
//			this.editor8.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "tae") {
//			this.editor3.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "ee") {
//			this.editor4.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "phe") {
//			this.editor10.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "ne") {
//			this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "scse") {
//			this.editor9.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "orgstse") {
//			this.editor12.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "ynse") {
//			this.editor11.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "nme") {
//			this.editor13.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "webe") {
//			this.editor14.loadEditor(tag, this.entity, tag.getAttribute("key"),
//					tag.getAttribute("null"));
//		} else if (t == "fullnme") { // user command
//			this.editor15.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "gender") { // user command
//			this.editor16.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "dob") { // user command
//			this.editor17.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "idtype") { // user command
//			this.editor18.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "idnumber") { // user command
//			this.editor181.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "textprop") { // user command
//			this.editor19.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "numprop") { // user command
//			this.editor20.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "texta") { // user command
//			this.editor21.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "staffselect") { // staff command
//			this.editor22.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "stafftext") { // staff command
//			this.editor23.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "staffphn") { // staff command
//			this.editor24.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "staffdate") { // staff command
//			this.editor25.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "stafftexta") { // staff command
//			this.editor26.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "grouptext") { // group command
//			this.editor27.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//		} else if (t == "grouptexta") { // group command
//			this.editor28.loadEditor(this.tabId, tag, this.entity, tag
//					.getAttribute("key"), tag.getAttribute("null"));
//
		
	};

	BasicPropertySheet.prototype.doClick = function(evt) {
		if (evt.target.tagName == "TD") {
			var table = evt.target.parentElement.parentElement;
			this.clearSelection(table);
			evt.target.parentElement.style.background = "#d1d1e0";
		}
	};

	BasicPropertySheet.prototype.clearSelection = function(table) {
		if (table.rows.length > 0) {
			for (var i = 0; i < table.rows.length; i++) {
				table.rows[i].style.background = "";
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, pluginName)) {
						$.data(this, pluginName, new BasicPropertySheet(this,
								options));
					} else if ($.isFunction(Plugin.prototype[options])) {
						$.data(this, pluginName)[options]();
					}
				});
	};

})(jQuery, window, document);