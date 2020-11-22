/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "conditionDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
		currOwner : "",
	};

	var ModalDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			currOwner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent;
		this.init(options);
	};

	ModalDialog.prototype.init = function(options) {
		this.topparent = options.topparent;
		// dialog
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);
		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

		var modaldialogDIV = document.createElement("div");
		this.modalframe.appendChild(modaldialogDIV);
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "770px"

		var dialogContentDIV = document.createElement("div");
		modaldialogDIV.appendChild(dialogContentDIV);
		dialogContentDIV.className = "modal-content";

		// dialog headding
		var dialogHeaderDIV = document.createElement("div");
		dialogContentDIV.appendChild(dialogHeaderDIV);
		dialogHeaderDIV.className = "modal-header";

		var closeButton = document.createElement("button");
		dialogHeaderDIV.appendChild(closeButton);
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");

		var closeSpan = document.createElement("span");
		closeButton.appendChild(closeSpan);
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";

		var titleH4 = document.createElement("h4");
		dialogHeaderDIV.appendChild(titleH4);
		titleH4.className = "modal-title";
		titleH4.id = "modal" + options.id;

		var infoIcon = document.createElement("i");
		titleH4.appendChild(infoIcon);
		infoIcon.className = "fa fa-plus-circle fa-lg";
		infoIcon.style.color = "green";

		var info = document.createElement("label");
		titleH4.appendChild(info);
		info.innerHTML = options.title;

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);

		var dialogBodyDIV = document.createElement("div");
		dialogForm.appendChild(dialogBodyDIV);
		dialogBodyDIV.className = "modal-body";

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);
		dialogBodyFrameDIV.className = "container-fluid";

		var bodyRow = document.createElement("div");
		dialogBodyFrameDIV.appendChild(bodyRow);
		bodyRow.className = "row";
		bodyRow.style.boxSizing = "border-box";
		bodyRow.id = "bodyrow" + options.id;

		// add form panel here...
		this.loadPanel(bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogForm.appendChild(dialogFooterDIV);
		dialogFooterDIV.className = "modal-footer";

		var saveButton = document.createElement("button");
		dialogFooterDIV.appendChild(saveButton);
		saveButton.type = "Button";
		saveButton.id = "OKButton" + options.id;
		saveButton.className = "btn btn-primary";
		saveButton.addEventListener("click", this, false);
		saveButton.innerHTML = "确定";

		var cancelButton = document.createElement("button");
		dialogFooterDIV.appendChild(cancelButton);
		cancelButton.type = "Button";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");

	};

	ModalDialog.prototype.loadPanel = function(parent) {
		var form = document.createElement("DIV");
		parent.appendChild(form);

		var plugin40 = $(form).conditionEditPanel({
			id : "cdned401",
			parent : this,
			currOwner : this.options.currOwner,
		});
		this.editpane40 = plugin40.data("conditionEditPanel");

		var dialog = $(parent).alertBox({
			id : this.options.id,
		});
		this.messageBox = dialog.data("alertBox");
	};

	ModalDialog.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	// entity is PropagateRule; currowner is UI component; owner is form object
	// type: 1: condition; 2: expression1; 3: expression2
	ModalDialog.prototype.show = function(entity, currowner, owner, type) {
		this.owner = owner;
		this.entity = entity;
		this.currowner = currowner;
		this.type = type;
		if (type == 1) {
			this.editpane40.setRule(entity.conditions);
		} else if (type == 2) {
			this.editpane40.setRule(entity.tComExpressions);
		} else if (type == 3) {
			this.editpane40.setRule(entity.eComExpressions);
		}
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	ModalDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	ModalDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		}
	};

	ModalDialog.prototype.doClick = function(evt) {
		evt.preventDefault();
		if (this.type == 1) {
			map[this.owner.id].stack.execute(new FMRuleValueChangedCmd(
					this.entity, "conditions", this.editpane40.fetchRule(),
					this.currowner, this.owner));
		} else if (this.type == 2) {
			map[this.owner.id].stack.execute(new FMRuleValueChangedCmd(
					this.entity, "tComExpressions",
					this.editpane40.fetchRule(), this.currowner, this.owner));
		} else if (this.type == 3) {
			map[this.owner.id].stack.execute(new FMRuleValueChangedCmd(
					this.entity, "eComExpressions",
					this.editpane40.fetchRule(), this.currowner, this.owner));
		}
		this.hide();
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ModalDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);