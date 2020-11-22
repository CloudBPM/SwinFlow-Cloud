// /**
//  * 沟通会话列表的列表信息
//  *
//  * @author Dahai Cao created at 9:29 on 2019-01-16
//  * @create Xuanqi Info Tech http://www.xuanqiyun.com copyright reserved from 2017
//  */
// ;
// (function($, window, document, undefined) {
//     var pluginName = "communicatingListPanel";
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
//         this.leftframe = document.createElement("div");
//         this.element.appendChild(this.leftframe);
//         this.leftframe.className = "row";
//
//         this.leftframe.innerHTML = "communication list.";
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