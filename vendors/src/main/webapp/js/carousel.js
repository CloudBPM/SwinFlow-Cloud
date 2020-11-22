/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "carousel";
	var defaults = {
		id : "",
	};

	var Carousel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(options);
	};

	Carousel.prototype.init = function(options) {
		var carouselPanel = document.createElement("DIV");
		this.element.appendChild(carouselPanel);
		carouselPanel.id = "myCarousel" + options.id;
		carouselPanel.className = "carousel slide";
		carouselPanel.setAttribute("data-ride", "carousel slide");

		this.indicators = document.createElement("OL");
		carouselPanel.appendChild(this.indicators);
		this.indicators.className = "carousel-indicators";

		this.carouselInner = document.createElement("DIV");
		carouselPanel.appendChild(this.carouselInner);
		this.carouselInner.className = "carousel-inner";
		this.carouselInner.setAttribute("role", "listbox");

		// previous
		var leftArrow = document.createElement("A");
		carouselPanel.appendChild(leftArrow);
		leftArrow.className = "left carousel-control";
		leftArrow.href = "#myCarousel" + options.id;
		leftArrow.setAttribute("role", "button");
		leftArrow.setAttribute("data-slide", "prev");

		var leftSPAN = document.createElement("SPAN");
		leftArrow.appendChild(leftSPAN);
		leftSPAN.className = "glyphicon glyphicon-chevron-left";
		leftSPAN.setAttribute("aria-hidden", "true");

		var leftSPAN1 = document.createElement("SPAN");
		leftArrow.appendChild(leftSPAN1);
		leftSPAN1.className = "sr-only";
		leftSPAN1.innerHTML = "Previous";

		// next
		var rightArrow = document.createElement("A");
		carouselPanel.appendChild(rightArrow);
		rightArrow.className = "right carousel-control";
		rightArrow.href = "#myCarousel" + options.id;
		rightArrow.setAttribute("role", "button");
		rightArrow.setAttribute("data-slide", "next");

		var rightSPAN = document.createElement("SPAN");
		rightArrow.appendChild(rightSPAN);
		rightSPAN.className = "glyphicon glyphicon-chevron-right";
		rightSPAN.setAttribute("aria-hidden", "true");

		var rightSPAN1 = document.createElement("SPAN");
		rightArrow.appendChild(rightSPAN1);
		rightSPAN1.className = "sr-only";
		rightSPAN1.innerHTML = "Next";

	};

	Carousel.prototype.createIndicator = function(index, active) {
		var li = document.createElement("LI");
		this.indicators.appendChild(li);
		if (active != undefined) {
			li.className = "active";
		}
		li.setAttribute("data-target", "#myCarousel" + this.options.id);
		li.setAttribute("data-slide-to", index);
	};

	// bold is <H1> or <H2> or <H3> or <H4> or <H5> or <H6> or <H7>
	Carousel.prototype.createBanner = function(indexClass, url, bold,
			title, alt, active) {
		var bannerDIV = document.createElement("DIV");
		this.carouselInner.appendChild(bannerDIV);
		bannerDIV.className = "item";
		if (active != undefined) {
			bannerDIV.classList.add("active");
		}
		var bannerIMG = document.createElement("IMG");
		bannerDIV.appendChild(bannerIMG);
		bannerIMG.className = indexClass;
		bannerIMG.src = url;
		if (alt != undefined) {
			bannerIMG.setAttribute("alt", alt);
		}
		var imageCaption = document.createElement("DIV");
		bannerDIV.appendChild(imageCaption);
		imageCaption.className = "container";

		var caption = document.createElement("DIV");
		imageCaption.appendChild(caption);
		caption.className = "carousel-caption";
		if (bold != undefined) {
			var b = document.createElement(bold);
			caption.appendChild(b);
			b.innerHTML = title;
		} else {
			caption.innerHTML = title;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Carousel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);