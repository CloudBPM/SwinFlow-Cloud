// /**
//  * 联系人信息
//  *
//  * @author Dahai Cao created at 9:35 on 2019-01-16
//  * @create Xuanqi Info Tech http://www.xuanqiyun.com copyright reserved from 2017
//  */
// ;
// (function($, window, document, undefined) {
//     var pluginName = "contactInfoPanel";
//     var defaults = {
//         id : "",
//         parent : "",
//         uid : "",
//     };
//
//     var CommunicatePanel = function(element, options) {
//         this.element = element;
//         this.options = $.extend({
//             id : "",
//             parent : "",
//             uid : "",
//         }, defaults, options);
//         this._defaults = defaults;
//         this._name = pluginName;
//         this.init(options);
//     };
//
//     CommunicatePanel.prototype.init = function(options) {
//         var communicationframe = document.createElement("div");
//         this.element.appendChild(communicationframe);
//         communicationframe.className = "container";
//         communicationframe.style.width = "800px";
//         communicationframe.style.height = "450px";
//
//         var leftPane = document.createElement("div");
//         communicationframe.appendChild(leftPane);
//         leftPane.className = "col-lg-3 col-md-3 col-sm-3 col-xs-3";
//
//         var p3 = $(leftPane).contactsPanel({
//             id : "01701",
//             parent : this,
//             uid : this.options.uid,
//         });
//         this.contactsPanel = p3.data("contactsPanel");
//
//         var rightPane = document.createElement("div");
//         communicationframe.appendChild(rightPane);
//         rightPane.className = "col-lg-9 col-md-9 col-sm-9 col-xs-9";
//
//         var p4 = $(rightPane).contactingPanel({
//             id : "01703",
//             parent : this,
//             uid : this.options.uid,
//         });
//         this.contactingPanel = p4.data("contactingPanel");
//
//     };
//
//     $.fn[pluginName] = function(options) {
//         return this.each(function() {
//             if (!$.data(this, pluginName)) {
//                 $.data(this, pluginName, new CommunicatePanel(this, options));
//             } else if ($.isFunction(Plugin.prototype[options])) {
//                 $.data(this, pluginName)[options]();
//             }
//         });
//     };
//
// })(jQuery, window, document);