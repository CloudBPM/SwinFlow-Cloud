/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "rightPane2";
    var defaults = {
        id: "", // process ID
        ownerId: "", // organization ID
        imgUrl: "",
        parent:""
    };

    var RightPanel2 = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "", // process ID
            ownerId: "", // organization ID
            imgUrl: "",
            parent:""
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.rightPane = null;
        this.init(options);
    };


    RightPanel2.prototype.init = function (options) {
        this.commentDiv = document.createElement("div");
        this.element.appendChild(this.commentDiv);

        var contectDiv = document.createElement("div");
        contectDiv.className = "panel panel-default";
        this.commentDiv.appendChild(contectDiv);
        contectDiv.style.margin = "0";
        contectDiv.style.borderRadius = "0 0 6px 0";
        contectDiv.style.boxShadow = "none";

        var contectMan = document.createElement("DIV");
        contectDiv.appendChild(contectMan);
        contectMan.className = "panel-body";
        contectMan.style.height = "580px";
        contectMan.style.padding = "80px 80px";
        contectMan.style.margin = "0";

        var manHead = document.createElement("DIV");
        contectMan.appendChild(manHead);
        manHead.style.height = "100px";
        manHead.style.borderBottom = "solid 1px #eee";

        this.manName = document.createElement("h4");
        manHead.appendChild(this.manName);
//    this.manName.innerHTML = "张三";
        this.manName.style.textAlign = "left";
        this.manName.style.margin = "0";


        this.manImg = document.createElement("img");
        manHead.appendChild(this.manImg);
        this.manImg.style.width = "60px";
        this.manImg.style.height = "60px";
        this.manImg.style.textAlign = "right";

        this.manGender = document.createElement("h6");
        manHead.appendChild(this.manGender);
        this.manGender.innerHTML = "男";
        this.manGender.style.clear = "both";
//    this.manGender.style.marginLeft = "10px";


        var manIntro = document.createElement("div");
        contectMan.appendChild(manIntro);
        manIntro.className = "row";
        manIntro.style.padding = "20px 0";
        manIntro.style.borderBottom = "solid 1px #eee";


        var propName1 = document.createElement("div");
        manIntro.appendChild(propName1);
        propName1.className = "col-lg-3 col-md-3 col-sm-3 col-xs-3";
        propName1.innerHTML = "备注";
        propName1.style.textAlign = "center";
        propName1.style.letterSpacing = "8px";
        propName1.style.padding = "10px 0 0"

        var propVal1 = document.createElement("div");
        manIntro.appendChild(propVal1);
        propVal1.className = "col-lg-9 col-md-9 col-sm-9 col-xs-9";
        propVal1.innerHTML = "小琦琦";
        propVal1.style.padding = "10px 15px 0";

        var propName2 = document.createElement("div");
        manIntro.appendChild(propName2);
        propName2.className = "col-lg-3 col-md-3 col-sm-3 col-xs-3";
        propName2.innerHTML = "账号";
        propName2.style.textAlign = "center";
        propName2.style.letterSpacing = "8px";
        propName2.style.padding = "10px 0 0"

        this.propVal2 = document.createElement("div");
        manIntro.appendChild(this.propVal2);
        this.propVal2.className = "col-lg-9 col-md-9 col-sm-9 col-xs-9";
        this.propVal2.style.padding = "10px 15px 0";

        var propName3 = document.createElement("div");
        manIntro.appendChild(propName3);
        propName3.className = "col-lg-3 col-md-3 col-sm-3 col-xs-3";
        propName3.innerHTML = "地区";
        propName3.style.textAlign = "center";
        propName3.style.letterSpacing = "8px";
        propName3.style.padding = "10px 0 0"

        var propVal3 = document.createElement("div");
        manIntro.appendChild(propVal3);
        propVal3.className = "col-lg-9 col-md-9 col-sm-9 col-xs-9";
        propVal3.innerHTML = "杭州";
        propVal3.style.padding = "10px 15px  0";

        this.sendBtn = document.createElement("button");
        contectMan.appendChild(this.sendBtn);
        this.sendBtn.className = "btn btn-default";
        this.sendBtn.innerHTML = "发消息";
        this.sendBtn.style.margin = "20px 0 0 250px";
        this.sendBtn.addEventListener("click", this, false);


    };

    RightPanel2.prototype.loaddata = function (psn) {
        this.manName.innerHTML = psn.fname;
        this.manImg.src = this.options.imgUrl + "/pic.jpg";
        this.propVal2.innerHTML = psn.userId;
        this.newPsn = psn;
    };

    RightPanel2.prototype.handleEvent = function(e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    RightPanel2.prototype.doClick = function(e) {
        e.preventDefault();
        if (e.target == this.sendBtn) {
            if (this.options.parent.showPane != undefined)
                this.options.parent.showPane(0);
            if (this.options.parent.showTab != undefined)
                this.options.parent.showTab(0);
        }
        // console.log(this.newPsn)
        function add0(m) {
            return m < 10 ? '0' + m : m
        }
        var myDate= new Date();
        var time = add0(myDate.getHours()) + ":" + add0(myDate.getMinutes());
        this.newPsn.time = time;
        this.options.parent.sessionPane.test(this.newPsn);
        this.options.parent.rightPane1.loaddata(this.newPsn);
        var arr = [];
        this.options.parent.rightPane1.clickMsg(arr);

    };

    RightPanel2.prototype.show = function (show) {
        if (show) {
            this.commentDiv.style.display = "";
        } else {
            this.commentDiv.style.display = "none";
        }
    };


    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new RightPanel2(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);
