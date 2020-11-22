;(function ($, window, document, undefined) {
    var pluginName = "alertBox";
    var defaults = {
	        id: "",
        };
    
    var AlertBox = function (element, options) {
        this.element = element;
        this.options = $.extend( {
		    id: "",
	    }, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };
    
    AlertBox.prototype.init = function ( options ) {
    	this.modalframe = document.createElement("div");
		this.modalframe.style.display = "none";
		this.modalframe.setAttribute("role","alert");
		this.modalframe.className = "alert alert-danger";
		this.modalframe.innerHTML = "";
    	this.element.appendChild(this.modalframe);
	};
	
	/**
	 * @param type, 1: success; 2: info; 3: warning; 4: danger
	 * @param message, message string.
	 * @param bold, the font is bold. true: bold; false: normal
	 */
	AlertBox.prototype.show = function ( type, message, bold ) {
	    if (type == 1) {
		    this.modalframe.className = "alert alert-success";
		} else if (type == 2) { 
		    this.modalframe.className = "alert alert-info";
		} else if (type == 3) {
		    this.modalframe.className = "alert alert-warning";
		} else {
		    this.modalframe.className = "alert alert-danger";
		}
		var msg = message;
		if ( bold ) {
		    msg = "<strong>"+message+"</strong>"
		}
	    this.modalframe.innerHTML = msg;
	    $(this.modalframe).fadeTo(1, 1.0); // show
        $(this.modalframe).fadeTo(2500, 0.0); // fade to disappear
	};
	
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, pluginName )) {
                $.data( this, pluginName, new AlertBox( this, options ));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
  };

})(jQuery, window, document);