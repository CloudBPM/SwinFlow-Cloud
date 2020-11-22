;
(function ($, window, document, undefined) {
    var pluginName = "dateTimeRangePlugin";
    var defaults = {
        id: "",
        entity: "",
        opts: [],
        evn: "",
        disabled : 0,
    };

    var DateTimeRangePanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            entity: "",
            opts: [],
            evn: "",
            disabled : 0,
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this.init(options);
    };

    DateTimeRangePanel.prototype.init = function (options) {

        var durationPane = document.createElement("div");
        this.element.appendChild(durationPane);
        durationPane.className = "row";

        var rowDiv8 = document.createElement("div");
        rowDiv8.className = "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12";
        durationPane.appendChild(rowDiv8);

        var durDiv1 = document.createElement("div");
        rowDiv8.appendChild(durDiv1);
        durDiv1.className = "form-inline";

        // days
        var durDiv2 = document.createElement("div");
        durDiv1.appendChild(durDiv2);
        durDiv2.className = "input-group";

        this.dayInput = document.createElement("input");
        durDiv2.appendChild(this.dayInput);
        this.dayInput.type = "text";
        this.dayInput.id = "wDayInput";
        this.dayInput.name = "wwDayInput";
        if (options.disabled == 1)
            this.dayInput.disabled = true;
        this.dayInput.className = "form-control";
        this.dayInput.addEventListener("change", this, false);
        this.dayInput.addEventListener("keypress", this, false);

        var durDiv3 = document.createElement("div");
        durDiv2.appendChild(durDiv3);
        durDiv3.className = "input-group-btn";

        this.daySelect = document.createElement("select");
        durDiv3.appendChild(this.daySelect);
        this.daySelect.className = "form-control";
        this.daySelect.id = "wDaySelect";
        this.daySelect.name = "wDaySelect";
        this.daySelect.style.borderLeft = "0";
        if (options.disabled == 1)
            this.daySelect.disabled = true;
        this.daySelect.style.backgroundColor = "#eeeeee";
        this.daySelect.addEventListener("change", this, false);

        this.addOptions(this.daySelect, largeduration[0], "0", 0);
        this.addOptions(this.daySelect, largeduration[1], "1", 1);
        this.addOptions(this.daySelect, largeduration[2], "2", 2);
        this.addOptions(this.daySelect, largeduration[3], "3", 3);
        this.addOptions(this.daySelect, largeduration[4], "4", 4);

        // hour
        var hourgroup = document.createElement("div");
        durDiv1.appendChild(hourgroup);
        hourgroup.className = "input-group";

        this.hourInput = document.createElement("input");
        hourgroup.appendChild(this.hourInput);
        this.hourInput.type = "text";
        this.hourInput.id = "wHourInput";
        this.hourInput.name = "wHourInput";
        if (options.disabled == 1)
            this.hourInput.disabled = true;
        this.hourInput.value = "0";
        this.hourInput.className = "form-control";
        this.hourInput.addEventListener("change", this, false);
        this.hourInput.addEventListener("keypress", this, false);

        var hourLabel = document.createElement("div");
        hourgroup.appendChild(hourLabel);
        hourLabel.innerHTML = largeduration[5];
        hourLabel.className = "input-group-addon";
        hourLabel.setAttribute("for", "wHourInput");

        // minute
        var minutegroup = document.createElement("div");
        durDiv1.appendChild(minutegroup);
        minutegroup.className = "input-group";

        this.minuteInput = document.createElement("input");
        minutegroup.appendChild(this.minuteInput);
        this.minuteInput.type = "text";
        if (options.disabled == 1)
            this.minuteInput.disabled = true;
        this.minuteInput.id = "wMinuteInput";
        this.minuteInput.name = "wMinuteInput";
        this.minuteInput.className = "form-control";
        this.minuteInput.value = "0";
        this.minuteInput.addEventListener("change", this, false);
        this.minuteInput.addEventListener("keypress", this, false);

        var minuteLabel = document.createElement("div");
        minutegroup.appendChild(minuteLabel);
        minuteLabel.className = "input-group-addon";
        minuteLabel.innerHTML = largeduration[6];
        minuteLabel.setAttribute("for", "wMinuteInput");

        // second
        var secondgroup = document.createElement("div");
        durDiv1.appendChild(secondgroup);
        secondgroup.className = "input-group";

        this.secondInput = document.createElement("input");
        secondgroup.appendChild(this.secondInput);
        this.secondInput.type = "text";
        this.secondInput.id = "wSecondInput";
        this.secondInput.name = "wSecondInput";
        if (options.disabled == 1)
            this.secondInput.disabled = true;
        this.secondInput.className = "form-control";
        this.secondInput.value = "0";
        this.secondInput.addEventListener("change", this, false);
        this.secondInput.addEventListener("keypress", this, false);

        var secLabel = document.createElement("div");
        secondgroup.appendChild(secLabel);
        secLabel.className = "input-group-addon";
        secLabel.innerHTML = largeduration[7];
        secLabel.setAttribute("for", "wSecondInput");

        this.dayInput.value = this.options.entity.largeDuration;
        this.daySelect.value = this.options.entity.largeDurationUnit;
        this.hourInput.value = this.options.entity.hours;
        this.minuteInput.value = this.options.entity.minutes;
        this.secondInput.value = this.options.entity.seconds;

        if (options.opts != null) {
            if (options.opts[0] == 0) {
                durDiv2.style.display = "none";
            } else {
                durDiv2.style.display = "";
            }
            if (options.opts[1] == 0) {
                hourgroup.style.display = "none";
            } else {
                hourgroup.style.display = "";
            }
            if (options.opts[2] == 0) {
                minutegroup.style.display = "none";
            } else {
                minutegroup.style.display = "";
            }
            if (options.opts[3] == 0) {
                secondgroup.style.display = "none";
            } else {
                secondgroup.style.display = "";
            }
        }
    };

    DateTimeRangePanel.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    DateTimeRangePanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
            case "keypress":
                this.doKeypress(e);
                break;
        }
    };

    DateTimeRangePanel.prototype.doChange = function (event) {
        var owner = this.options.entity.currOwner;
        if (event.target == this.dayInput) {
            if (this.evn == 0) {
                map[owner].stack.execute(new FMUIValueChangedCmd(
                    this.options.entity, "largeDuration", this.dayInput.value, owner));
            } else {
                map[owner].stack.execute(new CLValueChangedCmd(this.options.entity,
                    "largeDuration", event));
            }
        } else if (event.target == this.daySelect) {
            if (this.evn == 0) {
                map[owner].stack.execute(new FMUIValueChangedCmd(
                    this.options.entity, "largeDurationUnit", this.daySelect.value, owner));
            } else {
                map[owner].stack.execute(new CLValueChangedCmd(this.options.entity,
                    "largeDurationUnit", event));
            }
        } else if (event.target == this.hourInput) {
            if (this.evn == 0) {
                map[owner].stack.execute(new FMUIValueChangedCmd(
                    this.options.entity, "hours", this.hourInput.value, owner));
            } else {
                map[owner].stack.execute(new CLValueChangedCmd(this.options.entity,
                    "hours", event));
            }
        } else if (event.target == this.minuteInput) {
            if (this.evn == 0) {
                map[owner].stack.execute(new FMUIValueChangedCmd(
                    this.options.entity, "minutes", this.minuteInput.value, owner));
            } else {
                map[owner].stack.execute(new CLValueChangedCmd(this.options.entity,
                    "minutes", event));
            }
        } else if (event.target == this.secondInput) {
            if (this.evn == 0) {
                map[owner].stack.execute(new FMUIValueChangedCmd(
                    this.options.entity, "seconds", this.secondInput.value, owner));
            } else {
                map[owner].stack.execute(new CLValueChangedCmd(this.options.entity,
                    "seconds", event));
            }
        }
    };

    DateTimeRangePanel.prototype.doKeypress = function (event) {
        if (event.target == this.dayInput) {
            Utils.blockNonNumbers(this.dayInput, event, false, false);
        } else if (event.target == this.hourInput) {
            Utils.blockNonNumbers(this.hourInput, event, false, false);
        } else if (event.target == this.minuteInput) {
            Utils.blockNonNumbers(this.minuteInput, event, false, false);
        } else if (event.target == this.secondInput) {
            Utils.blockNonNumbers(this.secondInput, event, false, false);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new DateTimeRangePanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})
(jQuery, window, document);