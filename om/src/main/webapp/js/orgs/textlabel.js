/**
 * 
 */

function TextLabel(x0, y0, x1, y1, context) {
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x1;
	this.y1 = y1;
	this.padding = 5;
	this.lineHeight = 16;
	this.context = context;
};

// C: center; L: Left; R: right
TextLabel.prototype.outputText = function(text, alignment) {
	var maxWidth = this.x1 - this.x0 - this.padding * 2;
	var x = Math.floor(this.x0 + this.padding) + 0.5;
	var content = "";
	if (text != null)
		content = text;
	var rows = Utils.getY(this.context, content, x, maxWidth, this.lineHeight);
	var y = Math.floor((this.y0 + this.y1) / 2) + 0.5;
	// var y = Math.floor((this.y0 + this.y1)/2 - (rows * lineHeight)/2)+0.5;
	this.context.font = '12pt Calibri';
	tmp = this.context.fillStyle;
	this.context.fillStyle = '#000';
	Utils.outputText(this.context, content, x, y, maxWidth, this.lineHeight,
			alignment);
	this.context.fillStyle = tmp;
};