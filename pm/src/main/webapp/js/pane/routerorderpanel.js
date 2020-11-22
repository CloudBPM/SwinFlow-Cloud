;
(function($, window, document, undefined) {
	var pluginName = "routeOrderEditPanel";
	var defaults = {
		id : "",
		task : "",
		currOwner : "",
	};

	var RouteOrderEditPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			task : "",
			currOwner : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.entity = options.task;
		this.currOwner = options.currOwner;
		this.upButton;
		this.downButton;
		this.orderListSelect;
		this.init(options);
	};

	RouteOrderEditPanel.prototype.init = function(options) {
		var modalframe = document.createElement("div");
		this.element.appendChild(modalframe);

		var routeOrderTable = document.createElement("table");
		routeOrderTable.style.width = "100%";
		modalframe.appendChild(routeOrderTable);
		var row = routeOrderTable.insertRow(-1);
		var cell2 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		cell1.style.padding = 0;
		cell1.style.margin = 0;
		cell1.style.width = "44px";
		cell2.style.padding = 0;
		cell2.style.margin = 0;

		var routeOrderButtonDiv = document.createElement("div");
		routeOrderButtonDiv.style.margin = "0px";
		routeOrderButtonDiv.style.paddingTop = "0px";
		routeOrderButtonDiv.style.paddingBottom = "0px";
		routeOrderButtonDiv.style.paddingLeft = "2px";
		routeOrderButtonDiv.style.paddingRight = "2px";
		routeOrderButtonDiv.style.width = "44px";
		routeOrderButtonDiv.style.minWidth = "44px";
		routeOrderButtonDiv.style.maxWidth = "45px";

		this.upButton = document.createElement("button");
		this.upButton.type = "button";
		this.upButton.id = "upButton" + options.id;
		this.upButton.name = "upButton" + options.id;
		this.upButton.className = "btn btn-primary";
		var upArrow = document.createElement("span");
		upArrow.className = "glyphicon glyphicon-arrow-up";
		upArrow.id = "upButton" + options.id;
		this.upButton.appendChild(upArrow);
		this.upButton.setAttribute("disabled", "true");
		this.upButton.addEventListener("click", this, false);
		routeOrderButtonDiv.appendChild(this.upButton);

		this.downButton = document.createElement("button");
		this.downButton.type = "button";
		this.downButton.id = "downButton" + options.id;
		this.downButton.name = "downButton" + options.id;
		this.downButton.className = "btn btn-primary";
		var downArrow = document.createElement("span");
		downArrow.id = "downButton" + options.id;
		downArrow.className = "glyphicon glyphicon-arrow-down";
		this.downButton.appendChild(downArrow);
		this.downButton.setAttribute("disabled", "true");
		this.downButton.addEventListener("click", this, false);
		routeOrderButtonDiv.appendChild(this.downButton);
		cell1.appendChild(routeOrderButtonDiv);

		var routeOrderListDiv = document.createElement("div");
		routeOrderListDiv.style.margin = "0px";
		routeOrderListDiv.style.padding = "2px";
		routeOrderListDiv.style.width = "100%";
		cell2.appendChild(routeOrderListDiv);

		this.orderListSelect = document.createElement("select");
		this.orderListSelect.setAttribute("size", "10");
		this.orderListSelect.className = "form-control";
		this.orderListSelect.style.width = "100%";
		this.orderListSelect.addEventListener("change", this, false);

		routeOrderListDiv.appendChild(this.orderListSelect);

		this.setTask(this.entity);
	};

	RouteOrderEditPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	RouteOrderEditPanel.prototype.doClick = function(evt) {
		if (evt.target == this.upButton
				|| (evt.target.tagName == "SPAN" && evt.target.id == "upButton"
						+ this.options.id)) { // up button
			map[this.entity.currOwner].stack
					.execute(new PMReorderTransitionUpCmd(this.entity, this, this.currOwner));
		} else if (evt.target == this.downButton
				|| (evt.target.tagName == "SPAN" && evt.target.id == "downButton"
						+ this.options.id)) { // down button
			map[this.entity.currOwner].stack
					.execute(new PMReorderTransitionDownCmd(this.entity, this, this.currOwner));
		}
	};

	RouteOrderEditPanel.prototype.setTask = function(task) {
		$(this.orderListSelect).find('option').remove();
		var outs = [];
		for (i = 0; i < task.outputs.length; i++) {
			if (outs.length == 0) {
				outs.push(task.outputs[i]);
			} else {
				var inserted = false;
				for (k = 0; k < outs.length; k++) {
					if (task.outputs[i].orderNumber <= outs[k].orderNumber) {
						outs.splice(k, 0, task.outputs[i]);
						inserted = true;
						break;
					}
				}
				if (!inserted) {
					outs.push(task.outputs[i]);
				}
			}
		}
		task.outputs = outs;
		for (i = 0; i < task.outputs.length; i++) {
			var c1 = document.createElement("option");
			c1.text = task.outputs[i].orderNumber + ": "
					+ Utils.parse(task.outputs[i].name);
			c1.value = task.outputs[i].id;
			this.orderListSelect.options.add(c1, i);
		}
	};

	RouteOrderEditPanel.prototype.getButtonStatus = function(button) {
		if (button.getAttribute("disabled") == undefined) {
			return true;
		} else {
			return false;
		}
	};

	RouteOrderEditPanel.prototype.setButtonStatus = function(button, status) {
		if (status) {
			button.removeAttribute("disabled");
		} else {
			button.setAttribute("disabled", "true");
		}
	};

	RouteOrderEditPanel.prototype.swapItems = function(arr, index1, index2) {
		arr[index1] = arr.splice(index2, 1, arr[index1])[0];
		return arr;
	};

	RouteOrderEditPanel.prototype.doChange = function(evt) {
		if (evt.target == this.orderListSelect) {
			if (this.orderListSelect.options.length > 1) {
				if (this.orderListSelect.selectedIndex == 0) {
					this.upButton.setAttribute("disabled", "true");
					this.downButton.removeAttribute("disabled");
				} else if (this.orderListSelect.selectedIndex == this.orderListSelect.options.length - 1) {
					this.upButton.removeAttribute("disabled");
					this.downButton.setAttribute("disabled", "true");
				} else {
					this.upButton.removeAttribute("disabled");
					this.downButton.removeAttribute("disabled");
				}
			} else {
				this.upButton.setAttribute("disabled", "true");
				this.downButton.setAttribute("disabled", "true");
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$
						.data(this, pluginName, new RouteOrderEditPanel(this,
								options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);