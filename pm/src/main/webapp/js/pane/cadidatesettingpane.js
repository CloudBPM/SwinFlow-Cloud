/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "candidateSettingPane";
    var defaults = {
        id: "",
        parent: "",
        entity: "",
        topparent: "",
        currowner: "",
    };

    var CandidateSettingPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            entity: "",
            topparent: "",
            currowner: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.topparent = options.topparent;
        this.entity = options.entity;
        this.init(options);
    };

    CandidateSettingPanel.prototype.init = function (options) {
        this.entity = options.entity;
        var modalframe = document.createElement("DIV");
        this.element.appendChild(modalframe);

        var tableDiv = document.createElement("DIV");
        modalframe.appendChild(tableDiv);
        tableDiv.id = "tablediv" + options.id;
        tableDiv.className = "table-responsive";
        tableDiv.style.overflowY = "auto";
        tableDiv.style.overflowX = "auto";
        tableDiv.style.height = (parseInt(options.topparent.style.height) - 44)
            + "px";// 82
        this.participantlist = document.createElement("table");
        this.participantlist.className = "table table-striped table-hover";
        tableDiv.appendChild(this.participantlist);

        // var plugin = $(this.element).participantEditDialog({
        // 	id : "pm091",
        // 	title : "轩琦科技 - 安排办理人或办理岗位",
        // 	parent : this,
        // 	entity : this.entity,
        // 	currowner : options.currowner,
        // });
        // this.participantEditDialog = plugin.data("participantEditDialog");

        this.loadData(this.entity);
    };

    /**
     *
     * String name = "";
     * if (s.length > 2 && s.length > 3) {
     *                                 if (s[2] != null && s[3] != null) {
     *                              name = s[2] + "" + s[3];// 姓名
     *                          } else {
     *                              name = s[4];// 昵称（网名）
     *                          }
     *                      }
     * staffs[j] = s[0] + "@" + s[1] + "@" + name + "@" +
     * t.getParticipants()[i].getPriority() + "@" +
     * t.getParticipants()[i].getParticipationType() + "@" +
     * t.getParticipants()[i].getPositionId() + "@" +
     * t.getParticipants()[i].getPositionName() + "@" +
     * t.getParticipants()[i].getDepartmentId() + "@" +
     * t.getParticipants()[i].getDepartmentName() + "@" +
     * t.getParticipants()[i].getOrganizationId() + "@" +
     * t.getParticipants()[i].getOrganizationName() + "@" +
     * t.getParticipants()[i].getUserId() + "@" +
     * t.getParticipants()[i].getUserFullName();
     * @param entity
     */
    CandidateSettingPanel.prototype.loadData = function (entity) {
        var objs = entity.candidates;
        $(this.participantlist).children().remove();
        if (objs != null && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                var row = this.participantlist.insertRow(-1);
                var candidate = objs[i].split("@");
                this.createCell(0, candidate[1], row);// user Id
                this.createCell(1, candidate[2], row);// user full name or used name
                this.createCell(2, candidate[3], row);// priority
                this.createCell(3, workpriority[candidate[4]], row);// priority
                this.createCell(4, participanttype[candidate[5]], row);// participation type
                this.createCell(5, candidate[7], row);// position name
                this.createCell(6, candidate[9], row);// department name
                this.createCell(7, candidate[11], row);// organization name
                // user full name name
                this.createCell(8, ((candidate[13]=="null" || candidate[13]=="")?"":candidate[13]), row);
            }
            if (objs.length < 30) {
                for (var i = objs.length; i < 30; i++) {
                    var row = this.participantlist.insertRow(i);
                    for (var j = 0; j < 9; j++) {
                        this.createCell(j, "", row);
                    }
                }
            }
        } else {
            this.initParticipantList();
        }
        this.addHeader();
    };

    CandidateSettingPanel.prototype.addHeader = function () {
        var header = this.participantlist.createTHead();
        var row = header.insertRow(0);
        this.createHead("用户ID", row);
        this.createHead("用户姓名", row);
        this.createHead("手机号", row);
        this.createHead("优先级", row);
        this.createHead("参与类型", row);
        this.createHead("职位名称", row);
        this.createHead("部门名称", row);
        this.createHead("政府企事业单位", row);
        this.createHead("特定执行人", row);
    };

    CandidateSettingPanel.prototype.createCell = function (no, content, row) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        if (content == "") {
            cell.innerHTML = "&nbsp;";
        } else {
            $(cell).text(content);
        }
    };

    CandidateSettingPanel.prototype.createHead = function (content, row) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        row.appendChild(th);
    };

    CandidateSettingPanel.prototype.initParticipantList = function () {
        // document.createElement('tbody');
        for (var i = 0; i < 30; i++) {
            var row = this.participantlist.insertRow(i);
            for (var j = 0; j < 9; j++) {
                this.createCell(j, "", row);
            }
        }
    };

    CandidateSettingPanel.prototype.addRow = function (evt) {
    };

    CandidateSettingPanel.prototype.modifyRow = function (evt) {
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new CandidateSettingPanel(this,
                    options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);