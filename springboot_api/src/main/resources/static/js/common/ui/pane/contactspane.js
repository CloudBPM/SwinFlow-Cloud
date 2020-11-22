/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "contactsPane";
    var defaults = {
        id: "", // process ID
        ownerId: "",
        imgUrl: ""
    };

    var ContactsPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "", // process ID
            ownerId: "",
            imgUrl: ""
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.rightpane = null;
        this.init(options);
    };


    ContactsPanel.prototype.init = function (options) {
        this.editorPanel = document.createElement("DIV");
        this.element.appendChild(this.editorPanel);
        this.editorPanel.style.height = "466px";
        this.editorPanel.style.overflow = "auto";
        this.editorPanel.style.border = "none";
    };

    ContactsPanel.prototype.loadData = function (jsonobj) {
        var psn = jsonobj.data;
        for (var i = 0; i < psn.length; i++) {
            this.rightpane.loaddata(psn[0]);
            this.contact(this.editorPanel, psn[i]);
            // this.doClick(psn[i]);
        }
    }

    ContactsPanel.prototype.contact = function (parent, psn) {
        var contactsLi = document.createElement("DIV");
        contactsLi.className = "panel panel-default";
        parent.appendChild(contactsLi);
        contactsLi.style.margin = "0";
        contactsLi.style.borderRadius = "0";
        contactsLi.style.border = "none";
        contactsLi.style.boxShadow = "none";
        contactsLi.onmouseover = function () {
            contactsLi.style.background = "#ddd";
            contactsLi.style.cursor = "pointer";
        }
        contactsLi.onmouseleave = function () {
            contactsLi.style.background = "#fff";
        }
        var contactsLink = document.createElement("DIV");
        contactsLi.appendChild(contactsLink);
        contactsLink.className = "panel-body";
        contactsLink.style.padding = "5px 10px";

        var personImg = document.createElement("img");
        contactsLink.appendChild(personImg);
        personImg.src = this.options.imgUrl + "/pic.jpg";
        personImg.style.width = "45px";
        personImg.style.height = "45px";
        personImg.style.textAlign = "left";
        personImg.style.margin = "10px 0";

        var pName = document.createElement("h5");
        contactsLink.appendChild(pName);
        pName.innerHTML = psn.fname;
        pName.style.margin = "25px 0 0 60px";
        // contactsLink.addEventListener("click", this, false);

        var that = this;
        contactsLink.addEventListener("click", function (evt) {
            that.rightpane.loaddata(psn);
            // console.log(psn);
        });

    };

    // ContactsPanel.prototype.handleEvent = function(e) {
    //     switch (e.type) {
    //         case "click":
    //             this.doClick(e);
    //             break;
    //     }
    // };

    // var that = this;
    // ContactsPanel.prototype.doClick = function(e) {
    //     e.preventDefault();
    //     console.log(this.psn);
    //     this.rightpane.loaddata(this.psn);
    //
    // };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new ContactsPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);