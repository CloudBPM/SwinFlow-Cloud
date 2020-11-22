// /**
//  *
//  */
//
// ;
// (function($, window, document, undefined) {
//     var pluginName = "contactsPane";
//     var defaults = {
//         id : "", // process ID
//         uid : "",
//         owner : "", // organization ID
//         ownerName : "",
//         width : 0,
//         height : 0,
//     };
//
//     var ContactsPanel = function(element, options) {
//         this.element = element;
//         this.options = $.extend({
//             id : "", // process ID
//             uid : "",
//             owner : "", // organization ID
//             ownerName : "",
//             width : 0,
//             height : 0,
//         }, defaults, options);
//         this._defaults = defaults;
//         this._name = pluginName;
//         this.rightpane = null;
//         this.init(options);
//     };
//
//     ContactsPanel.prototype.init = function(options) {
//         var editorPanel = document.createElement("DIV");
//         this.element.appendChild(editorPanel);
//
//         var psn = [];
//         var p1 = new Person();
//         p1.uid = "99999";
//         p1.uname = "张三";
//         p1.gender = "男";
//         p1.img = "./img/pic.jpg";
//         psn.push(p1);
//         var p2 = new Person();
//         p2.uid = "33333";
//         p2.uname = "李四";
//         p2.gender = "女";
//         p2.img = "./img/pic.jpg";
//         psn.push(p2);
//
//         for(var i = 0;i< psn.length;i++){
//             this.contact(editorPanel,psn[i]);
//         }
//     };
//
//     ContactsPanel.prototype.contact = function(parent, psn) {
//         var contactsLi = document.createElement("DIV");
//         contactsLi.className = "panel panel-default";
//         parent.appendChild(contactsLi);
//         contactsLi.style.margin = "0";
//         contactsLi.style.borderRadius = "0";
//         contactsLi.style.border = "none";
//         contactsLi.style.boxShadow = "none";
//         contactsLi.onmouseover = function () {
//             contactsLi.style.background = "#ddd";
//             contactsLi.style.cursor = "pointer";
//         }
//         contactsLi.onmouseleave = function () {
//             contactsLi.style.background = "#fff";
//         }
//         var contactsLink = document.createElement("DIV");
//         contactsLi.appendChild(contactsLink);
//         contactsLink.className = "panel-body";
//         contactsLink.style.padding = "5px 10px";
//
//         var personImg = document.createElement("img");
//         contactsLink.appendChild(personImg);
//         personImg.src = psn.img;
//         personImg.style.width = "45px";
//         personImg.style.height = "45px";
//         personImg.style.float = "left";
//         personImg.style.marginTop = "10px";
//
//         var pName = document.createElement("h5");
//         contactsLink.appendChild(pName);
//         pName.innerHTML = psn.uname;
//         pName.style.margin = "25px 0 0 60px"
//
//         var that = this;
//         contactsLink.addEventListener("click", function(evt) {
//             //Utils.stopDefaultEvent(evt);
//             that.rightpane.loaddata(psn);
// //	    	console.log(psn);
//         });
//
//     };
//
//     $.fn[pluginName] = function(options) {
//         return this.each(function() {
//             if (!$.data(this, pluginName)) {
//                 $.data(this, pluginName, new ContactsPanel(this, options));
//             } else if ($.isFunction(Plugin.prototype[options])) {
//                 $.data(this, pluginName)[options]();
//             }
//         });
//     };
//
// })(jQuery, window, document);