/**
 * This is workflow entity abstract class.
 * 
 * Author Dahai Cao on 20160124
 */

function startIcon48x48(status, context, x1, y1) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	
	var x0 = x1 + 24;
	var y0 = y1 + 24;
	var radius = 24;
	// draw round border and background
	context.beginPath();
	context.arc(x0, y0, radius, 0, 2 * Math.PI, false);
	context.fillStyle = Utils.toTaskBgColor(status);		
	context.fill();
	context.lineWidth = 1.5;
	context.strokeStyle = '#000000';
	context.stroke();
	context.closePath();
	// draw triangle in the middle
	context.beginPath();
	context.moveTo(x0 - 8, y0 - 13);
	context.lineTo(x0 - 8, y0 + 13);
	context.lineTo(x0 + 14, y0);
	context.lineTo(x0 - 8, y0 - 13);
	context.lineJoin = "round";
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	context.closePath();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function startIcon32x32(context, x1, y1) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	var radius = 15;
	var x0 = x1 + 16;
	var y0 = y1 + 16;
	context.beginPath();
	context.arc(x0, y0, radius, 0, 2 * Math.PI, false);
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1.5;
	context.strokeStyle = '#000000';
	context.stroke();
	context.closePath();
	context.beginPath();
	context.moveTo(x0 - 5, y0 - 9);
	context.lineTo(x0 - 5, y0 + 9);
	context.lineTo(x0 + 10, y0);
	context.lineTo(x0 - 5, y0 - 9);
	context.lineJoin = "round";
	context.closePath();
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function endIcon48x48(status, context, x0, y0) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	var x1 = x0 + 24;
	var y1 = y0 + 24;
	var radius1 = 24;
	
	context.beginPath();
	context.arc(x1, y1, radius1, 0, 2 * Math.PI, false);
	context.closePath();
	context.fillStyle = Utils.toTaskBgColor(status);
	context.fill();
	context.lineWidth = 1.5;
	context.strokeStyle = '#000000';
	context.stroke();
	
	context.beginPath();
	context.moveTo(x1 - 11, y1 - 11);
	context.lineTo(x1 - 11, y1 + 11);
	context.lineTo(x1 + 11, y1 + 11);
	context.lineTo(x1 + 11, y1 - 11);
	context.lineTo(x1 - 11, y1 - 11);
	context.lineJoin = "round";
	context.closePath();
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function endIcon32x32(context, x0, y0) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	var x1 = x0 + 16;
	var y1 = y0 + 16;
	var radius1 = 15;
	context.beginPath();
	context.arc(x1, y1, radius1, 0, 2 * Math.PI, false);
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1.5;
	context.strokeStyle = '#000000';
	context.stroke();
	context.closePath();
	context.beginPath();
	context.moveTo(x1 - 7, y1 - 7);
	context.lineTo(x1 - 7, y1 + 7);
	context.lineTo(x1 + 7, y1 + 7);
	context.lineTo(x1 + 7, y1 - 7);
	context.lineTo(x1 - 7, y1 - 7);
	context.lineJoin = "round";
	context.closePath();
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function mobileIcon40x40(context, x1, y1) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	var cornerRadius = 4;
	// outline mobile
	context.beginPath();
	context.moveTo(x2 + 10, y2);
	context.lineTo(x2 + 30, y2);
	// context.lineTo(rectX + rectWidth - cornerRadius, rectY);
	// context.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY +
	// cornerRadius, cornerRadius);
	context.arcTo(x2 + 30 + cornerRadius, y2, x2 + 30 + cornerRadius, y2
			+ cornerRadius, cornerRadius);
	// context.quadraticCurveTo(x2+34, y2, x2+34, y2+4);
	context.lineTo(x2 + 34, y2 + 36);
	context.arcTo(x2 + 30 + cornerRadius, y2 + 36 + cornerRadius, x2 + 30, y2
			+ 36 + cornerRadius, cornerRadius);
	// context.quadraticCurveTo(x2+34, y2+40, x2+30, y2+40);
	context.lineTo(x2 + 10, y2 + 40);
	context.arcTo(x2 + 10 - cornerRadius, y2 + 36 + cornerRadius, x2 + 10
			- cornerRadius, y2 + 36, cornerRadius);
	// context.quadraticCurveTo(x2+6, y2+40, x2+6, y2+36);
	context.lineTo(x2 + 6, y2 + 4);
	context.arcTo(x2 + 10 - cornerRadius, y2, x2 + 10, y2, cornerRadius);
	// context.quadraticCurveTo(x2+6, y2, x2+10, y2);
	context.lineJoin = "round";
	context.closePath();
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	// screen
	context.beginPath();
	context.moveTo(x2 + 8, y2 + 4);
	context.lineTo(x2 + 32, y2 + 4);
	context.lineTo(x2 + 32, y2 + 34);
	context.lineTo(x2 + 8, y2 + 34);
	context.lineTo(x2 + 8, y2 + 4);
	context.closePath();
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	// home button
	context.moveTo(x2 + 16, y2 + 37);
	context.lineTo(x2 + 24, y2 + 37);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function mobileSMSSendingIcon40x40(context, x2, y2) {
	mobileIcon40x40(context, x2, y2);

	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	var cornerRadius = 4;

	// SMS
	context.beginPath();
	context.moveTo(x2 + 10, y2 + 10);
	context.lineTo(x2 + 40, y2 + 10);
	context.lineTo(x2 + 40, y2 + 25);
	context.lineTo(x2 + 20, y2 + 25);// 5px gap
	context.lineTo(x2 + 12, y2 + 30);// vertex
	context.lineTo(x2 + 15, y2 + 25);
	context.lineTo(x2 + 10, y2 + 25);
	context.lineTo(x2 + 10, y2 + 10);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.strokeStyle = '#000000';
	context.stroke();
	// words
	context.moveTo(x2 + 12, y2 + 12);
	context.lineTo(x2 + 36, y2 + 12);
	context.strokeStyle = '#000000';
	context.stroke();
	context.moveTo(x2 + 12, y2 + 14);
	context.lineTo(x2 + 25, y2 + 14);
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function mobileSMSReceivingIcon40x40(context, x2, y2) {
	mobileIcon40x40(context, x2, y2);

	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	var cornerRadius = 4;

	// SMS
	context.beginPath();
	context.moveTo(x2, y2 + 10);
	context.lineTo(x2 + 30, y2 + 10);
	context.lineTo(x2 + 30, y2 + 25);
	context.lineTo(x2 + 25, y2 + 25);// 5px gap
	context.lineTo(x2 + 28, y2 + 30);// vertex
	context.lineTo(x2 + 20, y2 + 25);
	context.lineTo(x2, y2 + 25);
	context.lineTo(x2, y2 + 10);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// words
	context.moveTo(x2 + 2, y2 + 12);
	context.lineTo(x2 + 26, y2 + 12);
	context.strokeStyle = '#000000';
	context.stroke();
	context.moveTo(x2 + 2, y2 + 14);
	context.lineTo(x2 + 15, y2 + 14);
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function mobileIcon32x32(context, x2, y2) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	var cornerRadius = 4;
	// outline mobile
	context.beginPath();
	context.moveTo(x2 + 8, y2);
	context.lineTo(x2 + 24, y2);
	context.arcTo(x2 + 24 + cornerRadius, y2, x2 + 24 + cornerRadius, y2
			+ cornerRadius, cornerRadius);
	context.lineTo(x2 + 24 + cornerRadius, y2 + 28);
	context.arcTo(x2 + 24 + cornerRadius, y2 + 28 + cornerRadius, x2 + 24, y2
			+ 28 + cornerRadius, cornerRadius);
	context.lineTo(x2 + 8, y2 + 28 + cornerRadius);
	context
			.arcTo(x2 + 4, y2 + 28 + cornerRadius, x2 + 4, y2 + 28,
					cornerRadius);
	context.lineTo(x2 + 4, y2 + cornerRadius);
	context.arcTo(x2 + 4, y2, x2 + 8, y2, cornerRadius);
	context.lineJoin = "round";
	context.closePath();
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// screen
	context.beginPath();
	context.moveTo(x2 + 6, y2 + 4);
	context.lineTo(x2 + 26, y2 + 4);
	context.lineTo(x2 + 26, y2 + 27);
	context.lineTo(x2 + 6, y2 + 27);
	context.lineTo(x2 + 6, y2 + 4);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// home button
	context.moveTo(x2 + 14, y2 + 29);
	context.lineTo(x2 + 18, y2 + 29);
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function mobileReceivingIcon32x32(context, x2, y2) {
	mobileIcon32x32(context, x2, y2);

	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	// SMS
	context.beginPath();
	context.moveTo(x2 + 8, y2 + 8);
	context.lineTo(x2 + 32, y2 + 8);
	context.lineTo(x2 + 32, y2 + 20);
	context.lineTo(x2 + 18, y2 + 20);// 6px gap
	context.lineTo(x2 + 10, y2 + 25);// vertex
	context.lineTo(x2 + 12, y2 + 20);
	context.lineTo(x2 + 8, y2 + 20);
	context.lineTo(x2 + 8, y2 + 8);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function mobileSendingIcon32x32(context, x2, y2) {
	mobileIcon32x32(context, x2, y2);

	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	// SMS
	context.beginPath();
	context.moveTo(x2, y2 + 8);
	context.lineTo(x2 + 24, y2 + 8);
	context.lineTo(x2 + 24, y2 + 20);
	context.lineTo(x2 + 18, y2 + 20);// 6px gap
	context.lineTo(x2 + 20, y2 + 25);// vertex
	context.lineTo(x2 + 12, y2 + 20);
	context.lineTo(x2, y2 + 20);
	context.lineTo(x2, y2 + 8);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function emailIcon32x32(context, x2, y2) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	context.beginPath();
	context.moveTo(x2, y2 + 7);
	context.lineTo(x2 + 32, y2 + 7);
	context.lineTo(x2 + 32, y2 + 25);
	context.lineTo(x2, y2 + 25);
	context.lineTo(x2, y2 + 7);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// bottom cover
	context.beginPath();
	context.moveTo(x2, y2 + 25);
	context.lineTo(x2 + 16, y2 + 10);// vertex
	context.lineTo(x2 + 32, y2 + 25);
	context.lineTo(x2, y2 + 25);
	context.closePath();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// top cover
	context.beginPath();
	context.moveTo(x2, y2 + 7);
	context.lineTo(x2 + 16, y2 + 22);// vertex
	context.lineTo(x2 + 32, y2 + 7);
	context.lineTo(x2, y2 + 7);
	context.lineJoin = "round";
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = 'red';
	context.font = "bold 12px Arial";
	context.fillText("@", x2 + 9, y2 + 17);

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function emailReceivingIcon32x32(context, x2, y2) {
	emailIcon32x32(context, x2, y2);

	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	// down arrow
	context.beginPath();
	context.moveTo(x2 + 12, y2);
	context.lineTo(x2 + 20, y2);
	context.lineTo(x2 + 20, y2 + 3);
	context.lineTo(x2 + 24, y2 + 3);
	context.lineTo(x2 + 16, y2 + 14); // vertex
	context.lineTo(x2 + 8, y2 + 3);
	context.lineTo(x2 + 12, y2 + 3);
	context.lineTo(x2 + 12, y2);
	context.closePath();
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 0.8;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function emailSendingIcon32x32(context, x2, y2) {
	emailIcon32x32(context, x2, y2);

	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	// down arrow
	context.beginPath();
	context.moveTo(x2 + 12, y2 + 19);
	context.lineTo(x2 + 20, y2 + 19);
	context.lineTo(x2 + 20, y2 + 23);
	context.lineTo(x2 + 24, y2 + 23);
	context.lineTo(x2 + 16, y2 + 32); // vertex
	context.lineTo(x2 + 8, y2 + 23);
	context.lineTo(x2 + 12, y2 + 23);
	context.lineTo(x2 + 12, y2 + 19);
	context.closePath();
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 0.8;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function mobile48x48(status, context, x2, y2) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	var cornerRadius = 4;
	var mobileWith = 30;
	// outline mobile
	context.beginPath();
	context.moveTo(x2 + 10, y2);
	context.lineTo(x2 + 36, y2);
	context.arcTo(x2 + 36 + cornerRadius, y2, x2 + 36 + cornerRadius, y2
			+ cornerRadius, cornerRadius);
	context.lineTo(x2 + 40, y2 + 44);
	context.arcTo(x2 + 36 + cornerRadius, y2 + 44 + cornerRadius, x2 + 36, y2
			+ 44 + cornerRadius, cornerRadius);
	context.lineTo(x2 + 10, y2 + 48);
	context.arcTo(x2 + 10 - cornerRadius, y2 + 44 + cornerRadius, x2 + 10
			- cornerRadius, y2 + 44, cornerRadius);
	context.lineTo(x2 + 6, y2 + 4);
	context.arcTo(x2 + 10 - cornerRadius, y2, x2 + 10, y2, cornerRadius);
	context.closePath();
	context.fillStyle = Utils.toTaskBgColor(status);
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// screen
	context.beginPath();
	context.moveTo(x2 + 8, y2 + 4);
	context.lineTo(x2 + 38, y2 + 4);
	context.lineTo(x2 + 38, y2 + 42);
	context.lineTo(x2 + 8, y2 + 42);
	context.lineTo(x2 + 8, y2 + 4);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// home button
	context.moveTo(x2 + 19, y2 + 45);
	context.lineTo(x2 + 27, y2 + 45);
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function mobile48x48Receiving(status, context, x2, y2) {
	mobile48x48(context, x2, y2);
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	// SMS
	context.beginPath();
	context.moveTo(x2 + 10, y2 + 10);
	context.lineTo(x2 + 48, y2 + 10);
	context.lineTo(x2 + 48, y2 + 28);
	context.lineTo(x2 + 22, y2 + 28);// 8px gap
	context.lineTo(x2 + 11, y2 + 36);// vertex
	context.lineTo(x2 + 14, y2 + 28);
	context.lineTo(x2 + 10, y2 + 28);
	context.lineTo(x2 + 10, y2 + 10);
	context.closePath();
	context.fillStyle = Utils.toTaskBgColor(status);
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// words
	context.moveTo(x2 + 12, y2 + 12);
	context.lineTo(x2 + 36, y2 + 12);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	context.moveTo(x2 + 12, y2 + 14);
	context.lineTo(x2 + 25, y2 + 14);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

// 48pxx48px mobile SMS receiving
function mobile48x48SendingIcon(status, context, x2, y2) {
	mobile48x48(context, x2, y2);
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	// SMS
	context.beginPath();
	context.moveTo(x2, y2 + 10);
	context.lineTo(x2 + 36, y2 + 10);
	context.lineTo(x2 + 36, y2 + 28);
	context.lineTo(x2 + 30, y2 + 28);// 8px gap
	context.lineTo(x2 + 34, y2 + 36);// vertex
	context.lineTo(x2 + 22, y2 + 28);
	context.lineTo(x2, y2 + 28);
	context.lineTo(x2, y2 + 10);
	context.closePath();
	context.fillStyle = Utils.toTaskBgColor(status);
	context.fill();
	context.strokeStyle = '#000000';
	context.stroke();
	// words
	context.moveTo(x2 + 2, y2 + 12);
	context.lineTo(x2 + 26, y2 + 12);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	context.moveTo(x2 + 2, y2 + 14);
	context.lineTo(x2 + 15, y2 + 14);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function email48x48Icon(status, context, x2, y2) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	// evolope body
	context.beginPath();
	context.moveTo(x2, y2 + 10);
	context.lineTo(x2 + 48, y2 + 10);
	context.lineTo(x2 + 48, y2 + 38);
	context.lineTo(x2, y2 + 38);
	context.lineTo(x2, y2 + 10);
	context.closePath();
	context.fillStyle = Utils.toTaskBgColor(status);
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// bottom cover
	context.beginPath();
	context.moveTo(x2, y2 + 38);
	context.lineTo(x2 + 24, y2 + 16);
	context.lineTo(x2 + 48, y2 + 38);
	context.lineTo(x2, y2 + 38);
	context.closePath();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	// top cover
	context.beginPath();
	context.moveTo(x2, y2 + 10);
	context.lineTo(x2 + 24, y2 + 36);
	context.lineTo(x2 + 48, y2 + 10);
	context.lineTo(x2, y2 + 10);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = 'red';
	context.font = "bold 20px Arial";
	context.fillText("@", x2 + 13, y2 + 26);

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function email48x48IconReceiving(status, context, x2, y2) {
	email48x48Icon(context, x2, y2);

	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	// down arrow
	context.beginPath();
	context.moveTo(x2 + 18, y2);
	context.lineTo(x2 + 30, y2);
	context.lineTo(x2 + 30, y2 + 4);
	context.lineTo(x2 + 36, y2 + 4);
	context.lineTo(x2 + 24, y2 + 18); // vertex
	context.lineTo(x2 + 12, y2 + 4);
	context.lineTo(x2 + 18, y2 + 4);
	context.lineTo(x2 + 18, y2);
	context.closePath();
	context.fillStyle = Utils.toTaskBgColor(status);
	context.fill();
	context.lineWidth = 0.8;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function email48x48IconSending(status, context, x2, y2) {
	email48x48Icon(context, x2, y2);

	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	// down arrow
	context.beginPath();
	context.moveTo(x2 + 18, y2 + 30);
	context.lineTo(x2 + 30, y2 + 30);
	context.lineTo(x2 + 30, y2 + 34);
	context.lineTo(x2 + 36, y2 + 34);
	context.lineTo(x2 + 24, y2 + 48); // vertex
	context.lineTo(x2 + 12, y2 + 34);
	context.lineTo(x2 + 18, y2 + 34);
	context.lineTo(x2 + 18, y2 + 30);
	context.closePath();
	context.fillStyle = Utils.toTaskBgColor(status);
	context.fill();
	context.lineWidth = 0.8;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function clockIcon48x48(status, context, x0, y0) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	var radius = 24;
	context.beginPath();
	context.arc(x0 + 24, y0 + 24, radius, 0, 2 * Math.PI, false);
	context.closePath();
	context.fillStyle = Utils.toTaskBgColor(status);
	context.fill();
	context.lineWidth = 1.5;
	context.strokeStyle = '#000000';
	context.stroke();

	context.beginPath();
	context.arc(x0 + 24, y0 + 24, radius - 3, 0, 2 * Math.PI, false);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1.5;
	context.strokeStyle = '#000000';
	context.stroke();

	context.moveTo(x0 + 24, y0 + 6);
	context.lineTo(x0 + 24, y0 + 24);
	context.lineTo(x0 + 9, y0 + 24);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function clockIcon32x32(context, x2, y2) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	var radius = 15;

	var x0 = x2 + 16;
	var y0 = y2 + 16;

	context.beginPath();
	context.arc(x0, y0, radius, 0, 2 * Math.PI, false);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1.5;
	context.strokeStyle = '#000000';
	context.stroke();

	context.beginPath();
	context.arc(x0, y0, radius - 3, 0, 2 * Math.PI, false);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1.5;
	context.strokeStyle = '#000000';
	context.stroke();

	context.moveTo(x0, y0 - 10);
	context.lineTo(x0, y0);
	context.lineTo(x0 - 8, y0);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function assignIcon48x48(status, context, x2, y2) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	context.beginPath();
	context.moveTo(x2 + 4, y2);
	context.lineTo(x2 + 44, y2);
	context.lineTo(x2 + 44, y2 + 48);
	context.lineTo(x2 + 4, y2 + 48);
	context.lineTo(x2 + 4, y2);
	context.closePath();
	context.fillStyle = Utils.toTaskBgColor(status);;
	context.fill();
	context.lineWidth = 0.7;
	context.strokeStyle = '#000000';
	context.stroke();
	// words
	context.moveTo(x2 + 8, y2 + 8);
	context.lineTo(x2 + 38, y2 + 8);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.moveTo(x2 + 8, y2 + 12);
	context.lineTo(x2 + 26, y2 + 12);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.moveTo(x2 + 8, y2 + 16);
	context.lineTo(x2 + 22, y2 + 16);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// pencil
	context.beginPath();
	context.moveTo(x2 + 30, y2 + 12);
	context.lineTo(x2 + 14, y2 + 34);
	context.lineTo(x2 + 24, y2 + 42);
	context.lineTo(x2 + 40, y2 + 20);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 0.7;
	context.strokeStyle = '#000000';
	context.stroke();

	context.moveTo(x2 + 27, y2 + 17);
	context.lineTo(x2 + 36, y2 + 24);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.beginPath();
	context.moveTo(x2 + 14, y2 + 34);
	context.lineTo(x2 + 13, y2 + 46);
	context.lineTo(x2 + 24, y2 + 42);
	context.lineTo(x2 + 14, y2 + 34);
	context.closePath();
	context.fillStyle = '#000000';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function assignIcon32x32(context, x2, y2) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	context.beginPath();
	context.moveTo(x2 + 4, y2);
	context.lineTo(x2 + 28, y2);
	context.lineTo(x2 + 28, y2 + 32);
	context.lineTo(x2 + 4, y2 + 32);
	context.lineTo(x2 + 4, y2);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 0.7;
	context.strokeStyle = '#000000';
	context.stroke();
	// words
	context.moveTo(x2 + 8, y2 + 8);
	context.lineTo(x2 + 22, y2 + 8);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.moveTo(x2 + 8, y2 + 12);
	context.lineTo(x2 + 16, y2 + 12);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.moveTo(x2 + 8, y2 + 16);
	context.lineTo(x2 + 12, y2 + 16);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// pencil
	context.beginPath();
	context.moveTo(x2 + 23, y2 + 11);
	context.lineTo(x2 + 26, y2 + 13);
	context.lineTo(x2 + 18, y2 + 26);
	context.lineTo(x2 + 15, y2 + 24);
	context.lineTo(x2 + 23, y2 + 11);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 0.7;
	context.strokeStyle = '#000000';
	context.stroke();
	// decoration
	context.moveTo(x2 + 22, y2 + 14);
	context.lineTo(x2 + 25, y2 + 15);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// pencil top
	context.beginPath();
	context.moveTo(x2 + 18, y2 + 26);
	context.lineTo(x2 + 15, y2 + 24);
	context.lineTo(x2 + 15, y2 + 28);
	context.lineTo(x2 + 18, y2 + 26);
	context.closePath();
	context.fillStyle = '#000000';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function subProcessIcon48x48(status, context, x0, y0) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	startIcon48x48(status, context, x0, y0);

	context.moveTo(x0, y0);
	context.lineTo(x0 + 16, y0);
	context.arcTo(x0 + 16 + 6, y0, x0 + 16 + 6, y0 + 6, 6);
	context.lineTo(x0 + 16 + 6, y0 + 12);
	context.lineTo(x0 + 16, y0 + 6);
	context.lineWidth = 1;
	context.strokeStyle = 'red';
	context.stroke();

	context.moveTo(x0 + 26, y0 + 12);
	context.lineTo(x0 + 26, y0 + 6);
	context.arcTo(x0 + 26, y0, x0 + 32, y0, 6);
	context.lineTo(x0 + 48, y0);
	context.lineTo(x0 + 42, y0 + 6);
	context.lineWidth = 1;
	context.strokeStyle = 'red';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function subProcessIcon32x32(context, x0, y0) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;

	startIcon32x32(context, x0, y0);

	var radius = 6;

	context.moveTo(x0, y0);
	context.lineTo(x0 + 8, y0);
	context.arcTo(x0 + 8 + radius, y0, x0 + 8 + radius, y0 + radius, radius);
	context.lineTo(x0 + 8 + radius, y0 + 9);
	context.lineTo(x0 + 8, y0 + 6);
	context.lineWidth = 1;
	context.strokeStyle = 'red';
	context.stroke();

	context.moveTo(x0 + 18, y0 + 3 + radius);
	context.lineTo(x0 + 18, y0 + 3);
	context.arcTo(x0 + 18, y0, x0 + 24, y0, 6);
	context.lineTo(x0 + 32, y0);
	context.lineTo(x0 + 26, y0 + 6);
	context.lineWidth = 1;
	context.strokeStyle = 'red';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function manualTaskIcon32x32(context, x0, y0) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	// suite
	context.beginPath();
	context.moveTo(x0 + 2, y0 + 28);
	context.quadraticCurveTo(x0 + 16, y0 + 10, x0 + 30, y0 + 28);
	context.lineTo(x0 + 26, y0 + 28);
	context.quadraticCurveTo(x0 + 16, y0 + 36, x0 + 6, y0 + 28);
	context.lineTo(x0 + 2, y0 + 28);
	context.closePath();
	context.fillStyle = '#000000';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// collar
	context.beginPath();
	context.moveTo(x0 + 8, y0 + 8);
	context.lineTo(x0 + 16, y0 + 32);// vertex
	context.lineTo(x0 + 24, y0 + 8);
	context.lineTo(x0 + 8, y0 + 8);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// head
	var radius = 10;
	context.beginPath();
	context.arc(x0 + 16, y0 + 11, radius, 0, 2 * Math.PI, false);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1.5;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function manualTaskIcon48x48(status, context, x0, y0) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	// suite
	context.beginPath();
	context.moveTo(x0 + 4, y0 + 40);
	context.quadraticCurveTo(x0 + 24, y0 + 10, x0 + 44, y0 + 40);
	context.lineTo(x0 + 36, y0 + 40);
	context.quadraticCurveTo(x0 + 24, y0 + 48, x0 + 12, y0 + 40);
	context.lineTo(x0 + 4, y0 + 40);
	context.closePath();
	context.fillStyle = Utils.toTaskBgColor(status);
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// collar
	context.beginPath();
	context.moveTo(x0 + 18, y0 + 26);
	context.lineTo(x0 + 24, y0 + 44);// vertex
	context.lineTo(x0 + 30, y0 + 26);
	context.lineTo(x0 + 20, y0 + 26);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	// head
	var radius = 15;
	context.beginPath();
	context.arc(x0 + 24, y0 + 12, radius, 0, 2 * Math.PI, false);
	context.closePath();
	context.fillStyle = '#ffffff';
	context.fill();
	context.lineWidth = 1.5;
	context.strokeStyle = '#000000';
	context.stroke();

	context.fillStyle = tfs;
	context.strokeStyle = tss;
	context.lineWidth = lw;
}

function gearIcon48x48(status, context, x0, y0) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	// Copyright (C) Ken Fyrstenberg / Epistemex
	// MIT license (header required)

	var cx = x0 + 24, // center x
	cy = y0 + 24, // center y
	notches = 9, // num. of notches
	radiusO = 24, // outer radius
	radiusI = 16, // inner radius
	radiusH = 10, // hole radius
	taperO = 25, // outer taper %
	taperI = 10, // inner taper %

	pi2 = 2 * Math.PI, // cache 2xPI (360deg)
	angle = pi2 / (notches * 2), // angle between notches
	taperAI = angle * taperI * 0.005, // inner taper offset
	taperAO = angle * taperO * 0.005, // outer taper offset
	a = angle, // iterator (angle)
	toggle = false; // notch radis (i/o)

	ctx = context;
	ctx.beginPath();
	// starting point
	ctx.moveTo(cx + radiusO * Math.cos(taperAO), cy + radiusO
			* Math.sin(taperAO));
	// loop
	for (; a <= pi2; a += angle) {
		// draw inner part
		if (toggle) {
			ctx.lineTo(cx + radiusI * Math.cos(a - taperAI), cy + radiusI
					* Math.sin(a - taperAI));
			ctx.lineTo(cx + radiusO * Math.cos(a + taperAO), cy + radiusO
					* Math.sin(a + taperAO));
		}
		// draw outer part
		else {
			ctx.lineTo(cx + radiusO * Math.cos(a - taperAO), cy + radiusO
					* Math.sin(a - taperAO));
			ctx.lineTo(cx + radiusI * Math.cos(a + taperAI), cy + radiusI
					* Math.sin(a + taperAI));
		}
		// switch
		toggle = !toggle;
	}
	// close the final line
	ctx.closePath();
	ctx.fillStyle = Utils.toTaskBgColor(status);
	ctx.fill();
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.stroke();
	// Punch hole in gear
	ctx.beginPath();
	ctx.globalCompositeOperation = 'destination-out';
	ctx.moveTo(cx + radiusH, cy);
	ctx.arc(cx, cy, radiusH, 0, pi2);
	ctx.closePath();
	ctx.fill();
	ctx.globalCompositeOperation = 'source-over';
	ctx.stroke();

	ctx.fillStyle = tfs;
	ctx.strokeStyle = tss;
	ctx.lineWidth = lw;
}

function gearIcon32x32(context, x0, y0) {
	var tfs = context.fillStyle;
	var tss = context.strokeStyle;
	var lw = context.lineWidth;
	// Copyright (C) Ken Fyrstenberg / Epistemex
	// MIT license (header required)

	var cx = x0 + 16, // center x
	cy = y0 + 16, // center y
	notches = 9, // num. of notches
	radiusO = 15, // outer radius
	radiusI = 12, // inner radius
	radiusH = 8, // hole radius
	taperO = 25, // outer taper %
	taperI = 10, // inner taper %

	pi2 = 2 * Math.PI, // cache 2xPI (360deg)
	angle = pi2 / (notches * 2), // angle between notches
	taperAI = angle * taperI * 0.005, // inner taper offset
	taperAO = angle * taperO * 0.005, // outer taper offset
	a = angle, // iterator (angle)
	toggle = false; // notch radis (i/o)

	ctx = context;
	ctx.beginPath();
	// starting point
	ctx.moveTo(cx + radiusO * Math.cos(taperAO), cy + radiusO
			* Math.sin(taperAO));
	// loop
	for (; a <= pi2; a += angle) {
		// draw inner part
		if (toggle) {
			ctx.lineTo(cx + radiusI * Math.cos(a - taperAI), cy + radiusI
					* Math.sin(a - taperAI));
			ctx.lineTo(cx + radiusO * Math.cos(a + taperAO), cy + radiusO
					* Math.sin(a + taperAO));
		}
		// draw outer part
		else {
			ctx.lineTo(cx + radiusO * Math.cos(a - taperAO), cy + radiusO
					* Math.sin(a - taperAO));
			ctx.lineTo(cx + radiusI * Math.cos(a + taperAI), cy + radiusI
					* Math.sin(a + taperAI));
		}
		// switch
		toggle = !toggle;
	}
	// close the final line
	ctx.closePath();
	ctx.fillStyle = '#fff';
	ctx.fill();
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.stroke();
	// Punch hole in gear
	ctx.beginPath();
	ctx.globalCompositeOperation = 'destination-out';
	ctx.moveTo(cx + radiusH, cy);
	ctx.arc(cx, cy, radiusH, 0, pi2);
	ctx.closePath();
	ctx.fill();
	ctx.globalCompositeOperation = 'source-over';
	ctx.stroke();

	ctx.fillStyle = tfs;
	ctx.strokeStyle = tss;
	ctx.lineWidth = lw;
}
