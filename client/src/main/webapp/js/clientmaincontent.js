/**
 *
 */
var map = {};
;
(function ($, window, document, undefined) {
    var pluginName = "clientMainContent";
    var defaults = {
        id: "",
        userId: "",
        ownerId: "",
        ownerName: "",
        imgUrl: "",
        userName: "",
        websocket: "",
        sessionId: "",
        mycate: "",
        mypos: "",
    };

    var MainContent = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            userId: "",
            ownerId: "",
            ownerName: "",
            imgUrl: "",
            userName: "",
            websocket: "",
            sessionId: "",
            mycate: "",
            mypos: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    MainContent.prototype.init = function (options) {
        var mainframe = document.createElement("DIV");
        this.element.appendChild(mainframe);
        mainframe.id = "wrapper";

        var menu = $(mainframe).clientLeftMenuBar({
            id: "leftmenubar",
            parent: this,
            sessionId: options.sessionId,
            mycate: options.mycate,
        });
        this.leftMenuBar = menu.data("clientLeftMenuBar");

        var mainContent = document.createElement("MAIN");
        mainframe.appendChild(mainContent);
        mainContent.id = "page-wrapper6";
        mainContent.style.top = "50px";

        if ($(mainContent).dashboard != undefined) {
            var board = $(mainContent).dashboard({
                id: "dashboard",
                parent: this,
                uid: options.userId,
                userName: options.userName,
                mycate: options.mycate,
                title: "首页",
            });
            this.dashboard = board.data("dashboard");
        }

        if ($(mainContent).newsBoard != undefined) {
            var board = $(mainContent).newsBoard({
                id: "newsBoard",
                userId: options.userId,
                parent: this,
                userName: options.userName,
            });
            this.newsBoard = board.data("newsBoard");
        }

        if ($(mainContent).notificationBoard != undefined) {
            var board = $(mainContent).notificationBoard({
                id: "notifcationBoard",
                userName: options.userName,
            });
            this.notificationBoard = board.data("notificationBoard");
        }

        if ($(mainContent).fileManagerPane != undefined) {
            var board = $(mainContent).fileManagerPane({
                id: "fileManager",
                userId: options.userId,
                ownerId: options.ownerId,
                ownerName: options.ownerName,
                userName: options.userName,
            });
            this.fileManagerPane = board.data("fileManagerPane");
        }

        if ($(mainContent).addBoard != undefined) {
            var board = $(mainContent).addBoard({
                id: "addBoard",
                userName: options.userName,
            });
            this.addBoard = board.data("addBoard");
        }

        if ($(mainContent).queuePane != undefined) {
            var board = $(mainContent).queuePane({
                id: "queuePane",
                parent: this,
                uid: options.userId,
                userName: options.userName,
            });
            this.queuePane = board.data("queuePane");
            this.queuePane.workItemPane.refresh();
        }

        if ($(mainContent).studentHomeworkPane != undefined) {
            var board = $(mainContent).studentHomeworkPane({
                id: "studentHomeworkPane",
                mypos: options.mypos,
                parent: this,
            });
            this.studentHomeworkPane = board.data("studentHomeworkPane");
        }

        if ($(mainContent).personalDetailPane != undefined) {
            var board = $(mainContent).personalDetailPane({
                id: "personalDetailPane",
                uid: options.userId,
                userName: options.userName,
            });
            this.personalDetailPane = board.data("personalDetailPane");
        }

        if ($(mainContent).myFavorPane != undefined) {
            var board = $(mainContent).myFavorPane({
                id: "myFavorPane",
            });
            this.myFavorPane = board.data("myFavorPane");
        }

        if ($(mainContent).myPaymentPane != undefined) {
            var board = $(mainContent).myPaymentPane({
                id: "myPaymentPane",
                parent: this,
                userId: this.options.userId,
                userName: this.options.userName,
            });
            this.myPaymentPane = board.data("myPaymentPane");
        }

        if ($(mainContent).updatePasswordPane != undefined) {
            var board = $(mainContent).updatePasswordPane({
                id: "updatePasswordPane",
                uid: options.userId,
            });
            this.updatePasswordPane = board.data("updatePasswordPane");
        }

        if ($(mainContent).mySettingPane != undefined) {
            var board = $(mainContent).mySettingPane({
                id: "mySettingPane",
                parent: this,
                userId: this.options.userId,
                userName: this.options.userName,
            });
            this.mySettingPane = board.data("mySettingPane");
        }

        if ($(mainContent).myFeedbackPane != undefined) {
            var board = $(mainContent).myFeedbackPane({
                id: "myFeedbackPane",
                ownerId: options.ownerId,
            });
            this.myFeedbackPane = board.data("myFeedbackPane");
        }

        if ($(mainContent).getHelpPane != undefined) {
            var board = $(mainContent).getHelpPane({
                id: "getHelpPane",
            });
            this.getHelpPane = board.data("getHelpPane");
        }

        if ($(mainContent).workbench != undefined) {
            var board = $(mainContent).workbench({
                id: "workbench",
                parent: this,
                uid: options.userId,
                userName: options.userName,
            });
            this.workbench = board.data("workbench");
        }

        if ($(mainContent).searchResultPane != undefined) {
            var board = $(mainContent).searchResultPane({
                id: "searchResultPane",
                parent: this,
                uid: options.userId,
            });
            this.searchResultPane = board.data("searchResultPane");
        }

        if ($(mainContent).launchSWfPane != undefined) {
            var board = $(mainContent).launchSWfPane({
                id: "launchSWfPane",
                parent: this,
            });
            this.launchSWfPane = board.data("launchSWfPane");
        }

        if ($(mainContent).launchMWfPane != undefined) {
            var board = $(mainContent).launchMWfPane({
                id: "launchMWfPane",
                parent: this,
            });
            this.launchMWfPane = board.data("launchMWfPane");
        }

        if ($(mainContent).newsDetailPane != undefined) {
            var board = $(mainContent).newsDetailPane({
                id: "newsDetailPane",
                parent: this,
                userId: this.options.userId,
                userName: this.options.userName
            });
            this.newsDetailPane = board.data("newsDetailPane");
        }

        if ($(mainContent).contentServicePane != undefined) {
            var board = $(mainContent).contentServicePane({
                id: "contentServicePane",
                parent: this,
                userId: this.options.userId,
                userName: this.options.userName
            });
            this.contentServicePane = board.data("contentServicePane");
        }

        if ($(mainContent).myOrderPane != undefined) {
            var board = $(mainContent).myOrderPane({
                id: "myOrderPane",
                parent: this,
                userId: this.options.userId,
                userName: this.options.userName
            });
            this.myOrderPane = board.data("myOrderPane");
        }

        if ($(mainContent).myInvoicePane != undefined) {
            var board = $(mainContent).myInvoicePane({
                id: "myInvoicePane",
                parent: this,
                userId: this.options.userId,
                userName: this.options.userName
            });
            this.myInvoicePane = board.data("myInvoicePane");
        }

        if ($(mainContent).myShoppingCartPane != undefined) {
            var board = $(mainContent).myShoppingCartPane({
                id: "myShoppingCartPane",
                parent: this,
                userId: options.userId,
                userName: options.userName
            });
            this.myShoppingCartPane = board.data("myShoppingCartPane");
        }

        if ($(mainContent).myConfirmPayPane != undefined) {
            var board = $(mainContent).myConfirmPayPane({
                id: "myConfirmPayPane",
                parent: this,
                userId: options.userId,
                userName: options.userName
            });
            this.myConfirmPayPane = board.data("myConfirmPayPane");
        }

        if ($(mainContent).homeworkAppPane != undefined) {
            var board = $(mainContent).homeworkAppPane({
                id: "homeworkAppPane",
                parent: this,
                userId: options.userId,
                userName: options.userName
            });
            this.homeworkAppPane = board.data("homeworkAppPane");
        }

    };

    MainContent.prototype.hiddenAll = function () {
        this.dashboard.show(false);
        this.newsBoard.show(false);
        this.notificationBoard.show(false);
        this.fileManagerPane.show(false);
        this.addBoard.show(false);
        this.queuePane.show(false);
        this.studentHomeworkPane.show(false);
        this.personalDetailPane.show(false);
        this.myFavorPane.show(false);
        this.myPaymentPane.show(false);
        this.updatePasswordPane.show(false);
        this.mySettingPane.show(false);
        this.myFeedbackPane.show(false);
        this.getHelpPane.show(false);
        this.workbench.show(false);
        this.searchResultPane.show(false);
        this.launchSWfPane.show(false);
        this.launchMWfPane.show(false);
        this.newsDetailPane.show(false);
        this.contentServicePane.show(false);
        this.myOrderPane.show(false);
        this.myShoppingCartPane.show(false);
        this.myInvoicePane.show(false);
        this.myConfirmPayPane.show(false);
        this.homeworkAppPane.show(false);
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new MainContent(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);