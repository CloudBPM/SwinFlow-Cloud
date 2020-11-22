/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "myWorkListPanelforPC";
    var defaults = {
        id : "",
        parent : "",
        uid : "",
        topparent : "",
        source : 0,
        websocket : "",
    };

    var ListPane = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            parent : "",
            uid : "",
            topparent : "",
            source : 0,
            websocket : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.currtabindex = 0;
        this.init(options);
    };

    ListPane.prototype.init = function (options) {
        this.modalframe = document.createElement("div");
        this.element.appendChild(this.modalframe);

        var tabDIV = document.createElement("DIV");
        this.modalframe.appendChild(tabDIV);
        tabDIV.style.marginTop = "4px";

        var tabUL = document.createElement("UL");
        tabUL.className = "nav nav-tabs nav-justified worklist-nav-tabs";
        tabUL.id = "worklist-input-nav-tabs";
        tabUL.setAttribute("role", "tablist");
        tabDIV.appendChild(tabUL);
        this.tabLink0 = this.newTabHead(tabUL, 0, "今天", true);
        this.tabLink1 = this.newTabHead(tabUL, 1, "紧急", false);
        this.tabLink2 = this.newTabHead(tabUL, 2, "本周", false);
        this.tabLink3 = this.newTabHead(tabUL, 3, "全部", false);

        var that = this;
        $("#worklist-input-nav-tabs").on("click", "a", function(e) {
            e.preventDefault();
            $(this).tab('show');
            that.currtabindex = parseInt($(this).attr('href').substring(6));
            if (that.currtabindex == 0) {
                that.workItemListPane1.refresh();
            } else if (that.currtabindex == 1) {
                that.workItemListPane2.refresh();
            } else if (that.currtabindex == 2) {
                that.workItemListPane3.refresh();
            } else if (that.currtabindex == 3) {
                that.workItemListPane4.refresh();
            }
            that.setBadage(that.tabLink0, "0");
            that.setBadage(that.tabLink1, "0");
            that.setBadage(that.tabLink2, "0");
            that.setBadage(that.tabLink3, "0");
        });

        var tabLi = document.createElement("li");
        tabUL.appendChild(tabLi);
        tabLi.setAttribute("role", "presentation");
        tabLi.className = "dropdown";

        var liA = document.createElement("a");
        tabLi.appendChild(liA);
        liA.className = "dropdown-toggle";
        liA.setAttribute("data-toggle", "dropdown");
        liA.setAttribute("href", "#");
        liA.setAttribute("role", "button");
        liA.setAttribute("aria-haspopup", "true");
        liA.setAttribute("aria-expanded", "false");

        var filter = document.createElement("span");
        liA.appendChild(filter);
        filter.className = "fa fa-filter fa-lg";

        liA.appendChild(document.createTextNode("筛选"));

        var caret = document.createElement("span");
        liA.appendChild(caret);
        caret.className = "caret";

        // var menuLi = document.createElement("UL");
        // tabLi.appendChild(menuLi);
        // menuLi.className = "dropdown-menu";

        // var filterLi = document.createElement("li");
        // menuLi.appendChild(filterLi);
        //
        // var filterForm = document.createElement("form");
        // menuLi.appendChild(filterLi);
        //
        // var filterDiv = document.createElement("div");
        // filterLi.appendChild(filterDiv);
        // filterDiv.className = "form-group";


        var tabContents = document.createElement("DIV");
        tabDIV.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "worklisttabs";

        this.tabContent0 = this.newTabContent(tabContents, 0, true);
        if ($(this.tabContent0).workItemListPane != undefined) {
            var plugin1 = $(this.tabContent0).workItemListPane({
                id: "pctab0",
                parent: options.parent,
                uid: options.uid,
                topparent: options.topparent,
                querytype : "0",
                prt : this,
            });
            this.workItemListPane1 = plugin1.data("workItemListPane");
        }

        this.tabContent1 = this.newTabContent(tabContents, 1, false);
        if ($(this.tabContent1).workItemListPane != undefined) {
            var plugin2 = $(this.tabContent1).workItemListPane({
                id: "pctab1",
                parent: options.parent,
                uid: options.uid,
                topparent: options.topparent,
                querytype : "1",
                prt : this,
            });
            this.workItemListPane2 = plugin2.data("workItemListPane");
        }

        this.tabContent2 = this.newTabContent(tabContents, 2, false);
        if ($(this.tabContent2).workItemListPane != undefined) {
            var plugin3 = $(this.tabContent2).workItemListPane({
                id: "pctab2",
                parent: options.parent,
                uid: options.uid,
                topparent: options.topparent,
                querytype : "2",
                prt : this,
            });
            this.workItemListPane3 = plugin3.data("workItemListPane");
        }

        this.tabContent3 = this.newTabContent(tabContents, 3, false);
        if ($(this.tabContent3).workItemListPane != undefined) {
            var plugin4 = $(this.tabContent3).workItemListPane({
                id: "pctab3",
                parent: options.parent,
                uid: options.uid,
                topparent: options.topparent,
                querytype : "3",
                prt : this,
            });
            this.workItemListPane4 = plugin4.data("workItemListPane");
        }

        $('#worklist-input-nav-tabs a[href="#pctab' + this.currtabindex + '"]').tab('show');
        this.setBadage(this.tabLink0, "0");
    };

    ListPane.prototype.newTabHead = function (parent, index, caption, active) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#pctab" + index);
        tabLink.setAttribute("aria-controls", "pctab" + index);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.appendChild(document.createTextNode(caption));
        var badage = document.createElement("SPAN");
        tabLink.appendChild(document.createTextNode(" "));
        tabLink.appendChild(badage);
        badage.className = "badge";
        badage.style.backgroundColor = "#DE3434";
        badage.style.color = "#fff";
        this.setBadage(tabLink, "0");
        return tabLink;
    };

    ListPane.prototype.refresh = function () {
        if (this.workItemListPane1.refresh != undefined)
            this.workItemListPane1.refresh();
        if (this.workItemListPane2.refresh != undefined)
            this.workItemListPane2.refresh();
        if (this.workItemListPane3.refresh != undefined)
            this.workItemListPane3.refresh();
        if (this.workItemListPane4.refresh != undefined)
            this.workItemListPane4.refresh();
    };

    ListPane.prototype.setTabBadges = function (num) {
        var c = this.tabLink0.childNodes[2].textContent;
        if (c != "") {
            c = parseInt(c) + parseInt(num.count);
        } else {
            c = num.count;
        }
        this.setBadage(this.tabLink0, c);

        var c1 = this.tabLink1.childNodes[2].textContent;
        if (c1 != "") {
            c1 = parseInt(c1) + parseInt(num.count);
        } else {
            c1 = num.count;
        }
        this.setBadage(this.tabLink1, c1);

        var c2 = this.tabLink2.childNodes[2].textContent;
        if (c2 != "") {
            c2 = parseInt(c2) + parseInt(num.count);
        } else {
            c2 = num.count;
        }
        this.setBadage(this.tabLink2, c2);

        var c3 = this.tabLink3.childNodes[2].textContent;
        if (c3 != "") {
            c3 = parseInt(c3) + parseInt(num.count);
        } else {
            c3 = num.count;
        }
        this.setBadage(this.tabLink3, c3);
    };

    ListPane.prototype.setBadage = function (parent, num) {
        if (num != 0 && num != "0" && num != "") {
            parent.childNodes[2].innerHTML = num;
        } else {
            parent.childNodes[2].innerHTML = "";
        }
    };

    ListPane.prototype.newTabContent = function (parent, index, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "pctab" + index);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "pctab" + index;
        return tabContent;
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new ListPane(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);