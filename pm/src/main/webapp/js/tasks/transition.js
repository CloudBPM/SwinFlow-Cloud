/**
 * This is transition link source task and target task.
 */
function Transition() {
	this.id = "Transition 00";
	this.name = "Transition";
	this.orderNumber = 0; // execution order
	this.description = null;
	this.status = 0;
	this.x0 = 0;
	this.y0 = 0;
	this.x1 = 0;
	this.y1 = 0;
	this.source = ""; // abstract task
	this.target = ""; // abstract task
	this.navigationRule = null;
	this.alwaysTrue = true; // ignore business rule, keep always true
	this.bendpoints = null;
	this.selected = false;
	this.points = []; // the points for drawing arrow

	this.currOwner = null; // process ID
	this.owner = null; // organization ID
	this.a = null;
	this.b = null;
	this.c = null;
};

Transition.prototype = new WorkflowEntity();

Transition.prototype.clone = function() {
	var a = new Transition();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0;
	a.y0 = this.y0;
	a.x1 = this.x1;
	a.y1 = this.y1;
	// a.orderNumber = this.orderNumber; // execution order
	// a.source = this.source; // abstract task
	// a.target = this.target; // abstract task
	// if (this.navigationRule != null) {
	// a.navigationRule = this.navigationRule.clone();
	// }
	a.status = this.status;
	// a.alwaysTrue = this.alwaysTrue; // ignore business rule, keep always
	// true.
	if (this.bendpoints != null) {
		a.bendpoints = {
			x : this.bendpoints.x,
			y : this.bendpoints.y,
		};
	} else {
		a.bendpoints = null;
	}
	a.points = [];
	if (this.points.length > 0) {
		for (i = 0; i < this.points.length; i++) {
			a.points[i] = {
				x1 : this.points[i].x1,
				y1 : this.points[i].y1,
			}
		}
	}
	a.selected = this.selected;
	// a.lastupdate = this.lastupdate;
	return a;
};

Transition.prototype.parse = function(t, proc) {
	this.id = t.id;
	this.name = t.name;
	this.orderNumber = t.orderNumber; // execution order
	if (t.source != null) {
		this.source = proc.seekChildByID(t.source); // abstract task
		if (this.source != null) {
			this.source.addOutput(this);
		}
	}
	if (t.target != null) {
		this.target = proc.seekChildByID(t.target); // abstract task
		if (this.target != null) {
			this.target.addInput(this);
		}
	}
	this.x0 = (this.source.x0 + this.source.x1) / 2;
	this.y0 = (this.source.y0 + this.source.y1) / 2;
	this.x1 = (this.target.x0 + this.target.x1) / 2;
	this.y1 = (this.target.y0 + this.target.y1) / 2;
	if (t.navigationRule != null) {
		var r = new Expression();
		r.expressionString = t.navigationRule;
		r.parseExpressionString(proc);
		this.navigationRule = r;
	}
	this.alwaysTrue = t.alwaysTrue; // ignore business rule, keep always true.
	if (t.bendpoints != null) {
		var b = {
			x : t.bendpoints.x,
			y : t.bendpoints.y,
		};
		this.bendpoints = b;
	}
	this.description = t.description;
	// this.lastupdate = Utils.getDateTime(t.lastupdate)
	this.currOwner = t.currOwner; // process ID
	this.owner = t.owner; // organization ID
	this.updatePosition();
};

Transition.prototype.stringifyforJSON = function() {
	var t = new Transition();
	t.id = this.id;
	t.name = this.name;
	t.orderNumber = this.orderNumber; // execution order
	t.source = this.source.id; // abstract task
	t.target = this.target.id; // abstract task
	if (this.navigationRule != null) {
		t.navigationRule = this.navigationRule.toExpressionString();
	}
	t.description = this.description;
	t.alwaysTrue = this.alwaysTrue; // ignore business rule, keep always true.
	if (this.bendpoints != null) {
		var b = {
			x : this.bendpoints.x,
			y : this.bendpoints.y,
		};
		t.bendpoints = b;
	}
	t.currOwner = this.currOwner; // process ID
	t.owner = this.owner; // organization ID
	return t;
};

// A function for drawing the particle.
Transition.prototype.drawToContext = function() {
	var tmp = this.context.strokeStyle;

	this.context.strokeStyle = "black";
	if ((this.source != null && this.source.isParallelOutput != undefined && this.source.isParallelOutput == true)
			|| (this.target != null && this.target.isParallelInput != undefined && this.target.isParallelInput == true)) {
		this.context.strokeStyle = "blue";
	}
	this.context.lineWidth = 1;
	this.context.beginPath();
	this.context.moveTo(this.x0, this.y0);
	if (this.bendpoints == null) {
		this.context.lineTo(this.x1, this.y1);
	} else {
		this.context.quadraticCurveTo(this.bendpoints.x, this.bendpoints.y,
				this.x1, this.y1);

		// this.drawCurve(this.context, this.x0, this.y0, this.bendpoints.x,
		// this.bendpoints.y, this.x1, this.y1);
		//		
		// this.context.moveTo(this.x0, this.y0);
		// this.context.lineTo(this.bendpoints.x, this.bendpoints.y);
		// this.context.lineTo(this.x1, this.y1);
		// this.context.lineTo(this.x0, this.y0);
		// this.context.stroke();

	}
	if (this.points[0] != null && this.points[1] != null
			&& this.points[2] != null && this.points[3] != null) {
		this.context.moveTo(this.points[0].x1, this.points[0].y1);
		this.context.lineTo(this.points[1].x1, this.points[1].y1);
		this.context.lineTo(this.points[2].x1, this.points[2].y1);
		this.context.lineTo(this.points[3].x1, this.points[3].y1);
		this.context.closePath();
	}
	this.context.closePath();
	this.context.stroke();
	this.context.strokeStyle = tmp;

	if (this.selected) {
		tmp = this.context.strokeStyle;
		var x = Math.floor((this.x0 + this.x1) / 2) + 0.5;
		var y = Math.floor((this.y0 + this.y1) / 2) + 0.5;
		if (this.bendpoints != null) {
			x = Math.floor(this.bendpoints.x - 4) + 0.5;
			y = Math.floor(this.bendpoints.y - 4) + 0.5;
		}
		this.marks = Utils.createRelMarks(this.x0, this.y0, this.x1, this.y1,
				x, y);
		Utils.drawTransitionSelection(this.marks, this.context);
		// this.context.strokeStyle = 'black';
		// this.context.lineWidth = 0.5;
		// // this.context.lineJoin = 'round';
		// this.context.strokeRect(this.x0 - 4, this.y0 - 4, 8, 8);
		// this.context.strokeRect(this.x1 - 4, this.y1 - 4, 8, 8);
		// if (this.bendpoints == null) {
		// var x = (this.x0 + this.x1) / 2;
		// var y = (this.y0 + this.y1) / 2;
		// this.context.strokeRect(x - 4, y - 4, 8, 8);
		// } else {
		// this.context.strokeRect(this.bendpoints.x - 4,
		// this.bendpoints.y - 4, 8, 8);
		// }
		this.context.strokeStyle = tmp;
	}
};

Transition.prototype.isInMark = function(x, y) {
	if (this.marks != null && this.marks.length > 0) {
		if (this.marks[1].x0 - 4 <= x
				&& x <= this.marks[1].x0 + this.marks[1].width + 4
				&& this.marks[1].y0 - 4 <= y
				&& y <= this.marks[1].y0 + this.marks[1].height + 4) {
			return this.marks[1].name;
		}
	}
	return "default";
};

Transition.prototype.drawCurve = function(context, x0, y0, xm, ym, x1, y1) {
	// if (x0 < xm) {
	context.moveTo(x0, y0);
	var x = x0;
	while (x < xm) {
		var y = this.a * x * x + this.b * x + this.c;
		context.lineTo(x, y);
		console.log(x);
		console.log(y);
		x++;
	}
	// } else {
	// if (x0 > xm) {
	// var x = xm;
	// while (x < x0) {
	// var y = this.a * x * x + this.b * x + this.c;
	// context.lineTo(x, y);
	// x++;
	// }
	// }
	// }
	// if (xm < x1) {
	// var x = xm;
	// while (x < x1) {
	// var y = this.a * x * x + this.b * x + this.c;
	// context.lineTo(x, y);
	// x++;
	// }
	// } else {
	// if (xm > x1) {
	// var x = x1;
	// while (x < xm) {
	// var y = this.a * x * x + this.b * x + this.c;
	// context.lineTo(x, y);
	// x++;
	// }
	// }
	// }
};

Transition.prototype.updatePosition = function() {
	this.computeCoordinate();
	this.computeArrow();
};

// A function for drawing the particle.
Transition.prototype.computeCoordinate = function() {
	// a means arc, same meaning with Transition
	var snode = this.source;
	var tnode = this.target;
	if (tnode != null) {
		// preparing calculation
		var x0 = (snode.x0 + snode.x1) / 2;
		var y0 = (snode.y0 + snode.y1) / 2;
		var w0 = Math.abs(snode.x1 - snode.x0) / 2;
		var h0 = Math.abs(snode.y1 - snode.y0) / 2;
		var x1 = (tnode.x0 + tnode.x1) / 2;
		var y1 = (tnode.y0 + tnode.y1) / 2;
		var w1 = Math.abs(tnode.x1 - tnode.x0) / 2;
		var h1 = Math.abs(tnode.y1 - tnode.y0) / 2;
		if (this.bendpoints != null) {
			// quadratic curve (parabola)
			var xm = this.bendpoints.x;
			var ym = this.bendpoints.y;
		}
		// if (x0 != x1 && x0 != xm && x1 != xm) {
		// // var a = ((y0 - ym) * (xm - x1) - (ym - y1) * (x0 - xm))
		// // / ((x0 * x0 - xm * xm) * (xm - x1) - (xm * xm - x1 * x1)
		// // * (x0 - xm));
		// // var b = ((y0 - y1) - a * (x0 * x0 - x1 * x1)) / (x0 - x1);
		// // var c = y0 - a * x0 * x0 - b * x0;
		//
		// var a = (y0 - y1) / ((x0 * x0 - x1 * x1) - 2 * xm * (x0 - x1));
		// var b = -2 * a * xm;
		// var c = ym + b * b / 4 * a;
		//
		// this.a = a;
		// this.b = b;
		// this.c = c;
		//
		// this.x0 = x0;
		// this.y0 = y0;
		// this.x1 = x1;
		// this.y1 = y1;

		/*
		 * var y = a * x * x + b * x + c;
		 * 
		 * var y11 = a * snode.x0 * snode.x0 + b * snode.x0 + c; var y12 = a *
		 * snode.x1 * snode.x1 + b * snode.x1 + c;
		 * 
		 * if (xm > x0) { if (y12 >= snode.y0 && y12 <= snode.y1) {
		 * console.log("1"); this.x0 = snode.x1; this.y0 = Math.floor(y12) +
		 * 0.5; } else { console.log("2.5"); if (ym > y0) { console.log("2");
		 * var x21 = Math.sqrt(snode.y0 - c / a) - b / 2 * a; this.x0 =
		 * Math.floor(x21) + 0.5; this.y0 = snode.y0; } else { console.log("3");
		 * var x22 = Math.sqrt(snode.y1 - c / a) - b / 2 * a; this.x0 =
		 * Math.floor(x22) + 0.5; this.y0 = snode.y1; } } } else { if (y11 >=
		 * snode.y0 && y11 <= snode.y1) { console.log("4"); this.x0 = snode.x0;
		 * this.y0 = Math.floor(y11) + 0.5; } else { console.log("4.5"); if (ym >
		 * y0) { console.log("5"); var x21 = Math.sqrt(snode.y0 - c / a) - b / 2 *
		 * a; this.x0 = Math.floor(x21) + 0.5; this.y0 = snode.y0; } else {
		 * console.log("6"); var x22 = Math.sqrt(snode.y1 - c / a) - b / 2 * a;
		 * this.x0 = Math.floor(x22) + 0.5; this.y0 = snode.y1; } } } // var d11 =
		 * Math.abs(y11 - y0); // var d12 = Math.abs(y12 - y0); // // if (a <
		 * d11) { // this.x0 = snode.x1; // if (y12 >= snode.y0 && y12 <=
		 * snode.y1) { // this.y0 = Math.floor(y12) + 0.5; // } else { //
		 * this.y0 = snode.y0; // } // } else { // this.x0 = snode.x0; // if
		 * (y11 >= snode.y0 && y11 <= snode.y1) { // this.y0 = Math.floor(y11) +
		 * 0.5; // } else { // this.y0 = snode.y0; // } // }
		 *  // var d21 = Math.abs(x21 - x0); // var d22 = Math.abs(x22 - x0); //
		 * if (d22 < d21) { // if (x22 >= snode.y0 && x22 <= snode.y1) { //
		 * this.x0 = Math.floor(x22) + 0.5; // this.y0 = snode.y1; // } // }
		 * else { // if (x21 >= snode.x0 && x21 <= snode.x1) { // this.x0 =
		 * Math.floor(x21) + 0.5; // this.y0 = snode.y0; // } // } // -- var y13 =
		 * a * tnode.x0 * tnode.x0 + b * tnode.x0 + c; var y14 = a * tnode.x1 *
		 * tnode.x1 + b * tnode.x1 + c;
		 * 
		 * if (xm < x1) { if (y13 >= tnode.y0 && y13 <= tnode.y1) {
		 * console.log("7"); this.x1 = tnode.x0; this.y1 = Math.floor(y13) +
		 * 0.5; } else { console.log("7.5"); if (ym > y0) { console.log("8");
		 * var x23 = Math.sqrt(tnode.y0 - c / a) - b / 2 * a; this.x1 =
		 * Math.floor(x23) + 0.5; this.y1 = tnode.y0; } else { console.log("9");
		 * var x24 = Math.sqrt(tnode.y1 - c / a) - b / 2 * a; this.x1 =
		 * Math.floor(x24) + 0.5; this.y1 = tnode.y1; } } } else { if (y14 >=
		 * tnode.y0 && y14 <= tnode.y1) { console.log("10"); this.x1 = tnode.x1;
		 * this.y1 = Math.floor(y14) + 0.5; } else { console.log("10.5"); if (ym >
		 * y0) { console.log("11"); var x23 = Math.sqrt(tnode.y0 - c / a) - b /
		 * 2 * a; this.x1 = Math.floor(x23) + 0.5; this.y1 = tnode.y0; } else {
		 * console.log("12"); var x24 = Math.sqrt(tnode.y1 - c / a) - b / 2 * a;
		 * this.x1 = Math.floor(x24) + 0.5; this.y1 = tnode.y1; } } } // var d13 =
		 * Math.abs(y13 - y1); // var d14 = Math.abs(y14 - y1); // if (d14 <
		 * d13) { // if (y14 >= tnode.y0 && y14 <= tnode.y1) { // this.x1 =
		 * tnode.x1; // this.y1 = Math.floor(y14) + 0.5; // } // } else { // if
		 * (y13 >= tnode.y0 && y13 <= tnode.y1) { // this.x1 = tnode.x0; //
		 * this.y1 = Math.floor(y13) + 0.5; // } // } var x23 =
		 * Math.sqrt(tnode.y0 - c / a) - b / 2 * a; var x24 = Math.sqrt(tnode.y1 -
		 * c / a) - b / 2 * a; // var d23 = Math.abs(x23 - x1); // var d24 =
		 * Math.abs(x24 - x1); // if (d24 < d23) { // if (x24 >= tnode.y0 && x24 <=
		 * tnode.y1) { // this.x1 = Math.floor(x24) + 0.5; // this.y1 =
		 * tnode.y1; // } // } else { // if (x23 >= tnode.x0 && x23 <= tnode.x1) { //
		 * this.x1 = Math.floor(x23) + 0.5; // this.y1 = tnode.y0; // } // }
		 */
		// } else {
		//
		// }
		// } else {
		// line
		if (x0 == x1 && y0 != y1) {
			if (y1 > y0) {
				this.x0 = x0;
				this.y0 = y0 + h0;
				this.x1 = x0;
				this.y1 = y1 - h1;
			} else if (y1 < y0) {
				this.x0 = x0;
				this.y0 = y0 - h0;
				this.x1 = x0;
				this.y1 = y1 + h1;
			}
		} else if (x0 != x1 && y0 == y1) {
			if (x1 > x0) {
				this.x0 = x0 + w0;
				this.y0 = y0;
				this.x1 = x1 - w1;
				this.y1 = y0;
			} else if (x1 < x0) {
				this.x0 = x0 - w0;
				this.y0 = y0;
				this.x1 = x1 + w1;
				this.y1 = y0;
			}
		} else if (x0 != x1 && y0 != y1) {
			var ka = 1.0 * (y1 - y0) / (x1 - x0);
			var kp = 0;
			if (x1 > x0 && y1 > y0) {
				kp = 1.0 * (snode.y1 - snode.y0) / (snode.x1 - snode.x0);
				if (ka == kp) {
					this.x0 = snode.x1;
					this.y0 = snode.y1;
				} else if (ka > kp) {
					this.x0 = (x0 + 1.0 * (snode.y1 - y0) / ka);
					this.y0 = snode.y1;
				} else if (0 < ka && ka < kp) {
					this.x0 = snode.x1;
					this.y0 = (y0 + ka * (snode.x1 - x0));
				}
			} else if (x1 < x0 && y1 > y0) {
				kp = 1.0 * (snode.y0 - snode.y1) / (snode.x1 - snode.x0);
				if (ka == kp) {
					this.x0 = snode.x0;
					this.y0 = snode.y1;
				} else if (ka < kp) {
					this.x0 = x0 - ((snode.y0 - y0) / ka);
					this.y0 = snode.y1;
				} else if (kp < ka && ka < 0) {
					this.x0 = snode.x0;
					this.y0 = y0 - (ka * (snode.x1 - x0));
				}
			} else if (x1 > x0 && y1 < y0) {
				kp = 1.0 * (snode.y0 - snode.y1) / (snode.x1 - snode.x0);
				if (ka == kp) {
					this.x0 = snode.x1;
					this.y0 = snode.y0;
				} else if (ka < kp) {
					this.x0 = x0 + ((snode.y0 - y0) / ka);
					this.y0 = snode.y0;
				} else if (kp < ka && ka < 0) {
					this.x0 = snode.x1;
					this.y0 = y0 + (ka * (snode.x1 - x0));
				}
			} else if (x1 < x0 && y1 < y0) {
				kp = 1.0 * (snode.y1 - snode.y0) / (snode.x1 - snode.x0);
				if (ka == kp) {
					this.x0 = snode.x0;
					this.y0 = snode.y0;
				} else if (ka > kp) {
					this.x0 = (x0 - 1.0 * (snode.y1 - y0) / ka);
					this.y0 = snode.y0;
				} else if (0 < ka && ka < kp) {
					this.x0 = snode.x0;
					this.y0 = y0 - (ka * (snode.x1 - x0));
				}
			}
			var kt = 0;
			if (x1 > x0 && y1 > y0) {
				kt = 1.0 * (tnode.y1 - tnode.y0) / (tnode.x1 - tnode.x0);
				if (ka == kt) {
					this.x1 = tnode.x0;
					this.y1 = tnode.y0;
				} else if (ka > kt) {
					this.x1 = (x1 + 1.0 * (tnode.y0 - y1) / ka);
					this.y1 = tnode.y0;
				} else if (0 < ka && ka < kt) {
					this.x1 = tnode.x0;
					this.y1 = (y1 + ka * (tnode.x0 - x1));
				}
			} else if (x1 < x0 && y1 > y0) {
				kt = 1.0 * (tnode.y0 - tnode.y1) / (tnode.x1 - tnode.x0);
				if (ka == kt) {
					this.x1 = tnode.x1;
					this.y1 = tnode.y0;
				} else if (ka < kt) {
					this.x1 = (x1 + 1.0 * (tnode.y0 - y1) / ka);
					this.y1 = tnode.y0;
				} else if (kt < ka && ka < 0) {
					this.x1 = tnode.x1;
					this.y1 = (y1 - ka * (tnode.x0 - x1));
				}
			} else if (x1 > x0 && y1 < y0) {
				kt = 1.0 * (tnode.y1 - tnode.y0) / (tnode.x0 - tnode.x1);
				if (ka == kt) {
					this.x1 = tnode.x0;
					this.y1 = tnode.y1;
				} else if (ka < kt) {
					this.x1 = (x1 - 1.0 * (tnode.y0 - y1) / ka);
					this.y1 = tnode.y1;
				} else if (kt < ka && ka < 0) {
					this.x1 = tnode.x0;
					this.y1 = (y1 + ka * (tnode.x0 - x1));
				}
			} else if (x1 < x0 && y1 < y0) {
				kt = 1.0 * (tnode.y1 - tnode.y0) / (tnode.x1 - tnode.x0);
				if (ka == kt) {
					this.x1 = tnode.x1;
					this.y1 = tnode.y1;
				} else if (ka > kt) {
					this.x1 = (x1 + 1.0 * (tnode.y1 - y1) / ka);
					this.y1 = tnode.y1;
				} else if (0 < ka && ka < kt) {
					this.x1 = tnode.x1;
					this.y1 = (y1 + ka * (tnode.x1 - x1));
				}
			}
		}
		// }
	} else {
		var x0 = (snode.x0 + snode.x1) / 2;
		var y0 = (snode.y0 + snode.y1) / 2;
		var w0 = (snode.x1 - snode.x0) / 2;
		var h0 = (snode.y1 - snode.y0) / 2;
		if (x0 == this.x1 && y0 != this.y1) {
			if (this.y1 > y0) {
				this.x0 = x0;
				this.y0 = y0 + h0;
			} else if (this.y1 < y0) {
				this.x0 = x0;
				this.y0 = y0 - h0;
			}
		} else if (x0 != this.x1 && y0 == this.y1) {
			if (this.x1 > x0) {
				this.x0 = x0 + w0;
				this.y0 = y0;
			} else if (this.x1 < x0) {
				this.x0 = x0 - w0;
				this.y0 = y0;
			}
		} else if (x0 != this.x1 && y0 != this.y1) {
			if (this.x1 > x0 && this.y1 > y0) {
				var kp = 1.0 * (snode.y1 - snode.y0) / (snode.x1 - snode.x0);
				var ka = 1.0 * (this.y1 - y0) / (this.x1 - x0);
				if (ka == kp) {
					this.x0 = snode.x1;
					this.y0 = snode.y1;
				} else if (ka > kp) {
					this.x0 = (x0 + 1.0 * (snode.y1 - y0) / ka);
					this.y0 = snode.y1;
				} else if (0 < ka && ka < kp) {
					this.x0 = snode.x1;
					this.y0 = (y0 + ka * (snode.x1 - x0));
				}

			} else if (this.x1 < x0 && this.y1 > y0) {
				var kp = 1.0 * (snode.y0 - snode.y1) / (snode.x1 - snode.x0);
				var ka = 1.0 * (this.y1 - y0) / (this.x1 - x0);
				if (ka == kp) {
					this.x0 = snode.x0;
					this.y0 = snode.y1;
				} else if (ka < kp) {
					this.x0 = x0 - ((snode.y0 - y0) / ka);
					this.y0 = snode.y1;
				} else if (kp < ka && ka < 0) {
					this.x0 = snode.x0;
					this.y0 = y0 - (ka * (snode.x1 - x0));
				}
			} else if (this.x1 > x0 && this.y1 < y0) {
				var kp = 1.0 * (snode.y0 - snode.y1) / (snode.x1 - snode.x0);
				var ka = 1.0 * (this.y1 - y0) / (this.x1 - x0);
				if (ka == kp) {
					this.x0 = snode.x1;
					this.y0 = snode.y0;
				} else if (ka < kp) {
					this.x0 = x0 + ((snode.y0 - y0) / ka);
					this.y0 = snode.y0;
				} else if (kp < ka && ka < 0) {
					this.x0 = snode.x1;
					this.y0 = y0 + (ka * (snode.x1 - x0));
				}
			} else if (this.x1 < x0 && this.y1 < y0) {
				var kp = 1.0 * (snode.y1 - snode.y0) / (snode.x1 - snode.x0);
				var ka = 1.0 * (this.y1 - y0) / (this.x1 - x0);
				if (ka == kp) {
					this.x0 = snode.x0;
					this.y0 = snode.y0;
				} else if (ka > kp) {
					this.x0 = (x0 - 1.0 * (snode.y1 - y0) / ka);
					this.y0 = snode.y0;
				} else if (0 < ka && ka < kp) {
					this.x0 = snode.x0;
					this.y0 = y0 - (ka * (snode.x1 - x0));
				}
			} // if end
		} // if end
	}

};

/**
 * @param g
 *            Graphics2D
 * @param x0
 *            int
 * @param y0
 *            int
 * @param x1
 *            int
 * @param y1
 *            int
 */
Transition.prototype.computeArrow = function() {

	var x0 = this.x0;
	var y0 = this.y0;
	if (this.bendpoints != null) {
		x0 = this.bendpoints.x;
		y0 = this.bendpoints.y;
	}

	var x1 = this.x1;
	var y1 = this.y1;

	var ab = 10; // ab - arrowbody
	var wspr = 6; // wspr - wingspread
	var wspa = 5; // wspa - wingspan
	var points = [];
	if (x0 == x1 && y0 != y1) {
		if (y1 > y0) {
			points[0] = {
				x1 : x1,
				y1 : y1
			}; // A
			points[1] = {
				x1 : x1 + wspa,
				y1 : (y1 - ab)
			}; // D
			points[2] = {
				x1 : x1,
				y1 : (y1 - wspr)
			}; // B
			points[3] = {
				x1 : (x1 - wspa),
				y1 : (y1 - ab)
			}; // E
		} else if (y1 < y0) {
			points[0] = {
				x1 : (x1 - wspa),
				y1 : (y1 + ab)
			}; // E
			points[1] = {
				x1 : x1,
				y1 : (y1 + wspr)
			}; // B
			points[2] = {
				x1 : (x1 + wspa),
				y1 : (y1 + ab)
			}; // D
			points[3] = {
				x1 : x1,
				y1 : y1
			}; // A
		}
	} else if (x0 != x1 && y0 == y1) {
		if (x1 > x0) {
			points[0] = {
				x1 : x1,
				y1 : y1
			}; // A
			points[1] = {
				x1 : (x1 - ab),
				y1 : (y1 + wspa)
			}; // D
			points[2] = {
				x1 : (x1 - wspr),
				y1 : y1
			}; // B
			points[3] = {
				x1 : (x1 - ab),
				y1 : (y1 - wspa)
			}; // E
		} else if (x1 < x0) {
			points[0] = {
				x1 : x1,
				y1 : y1
			}; // A
			points[1] = {
				x1 : (x1 + ab),
				y1 : (y1 + wspa)
			}; // D
			points[2] = {
				x1 : (x1 + wspr),
				y1 : y1
			}; // B
			points[3] = {
				x1 : (x1 + ab),
				y1 : (y1 - wspa)
			}; // E
		}
	} else if (x0 != x1 && y0 != y1) {
		if (x1 > x0 && y1 > y0) {
			var k = (1.0 * (y1 - y0) / (x1 - x0));
			var d = Math.sqrt(1 + Math.pow(k, 2));
			points[0] = {
				x1 : x1,
				y1 : y1
			}; // A
			var xe1 = x1 + (wspa * k - ab) / d;
			var ye1 = y1 - (ab * k + wspa) / d;
			points[1] = {
				x1 : Math.round(xe1),
				y1 : Math.round(ye1)
			}; // E
			var xb = x1 - wspr / d;
			var yb = y1 - wspr * k / d;
			points[2] = {
				x1 : Math.round(xb),
				y1 : Math.round(yb)
			}; // B
			var xe2 = x1 - (wspa * k + ab) / d;
			var ye2 = y1 - (ab * k - wspa) / d;
			points[3] = {
				x1 : Math.round(xe2),
				y1 : Math.round(ye2)
			}; // E
		} else if (x1 < x0 && y1 > y0) {
			var k = (1.0 * (y0 - y1) / (x1 - x0));
			var d = Math.sqrt(1 + Math.pow(k, 2));
			points[0] = {
				x1 : x1,
				y1 : y1
			}; // A
			var xe1 = x1 + (ab - wspa * k) / d;
			var ye1 = y1 - (ab * k + wspa) / d;
			points[1] = {
				x1 : Math.round(xe1),
				y1 : Math.round(ye1)
			}; // E
			var xb = x1 + wspr / d;
			var yb = y1 - wspr * k / d;
			points[2] = {
				x1 : Math.round(xb),
				y1 : Math.round(yb)
			}; // B
			var xe2 = x1 + (ab + wspa * k) / d;
			var ye2 = y1 + (wspa - ab * k) / d;
			points[3] = {
				x1 : Math.round(xe2),
				y1 : Math.round(ye2)
			}; // E
		} else if (x1 > x0 && y1 < y0) {
			var k = (1.0 * (y0 - y1) / (x1 - x0));
			var d = Math.sqrt(1 + Math.pow(k, 2));
			points[0] = {
				x1 : x1,
				y1 : y1
			}; // A
			var xe1 = x1 - (ab + wspa * k) / d;
			var ye1 = y1 + (ab * k - wspa) / d;
			points[1] = {
				x1 : Math.round(xe1),
				y1 : Math.round(ye1)
			}; // E
			var xb = x1 - wspr / d;
			var yb = y1 + wspr * k / d;
			points[2] = {
				x1 : Math.round(xb),
				y1 : Math.round(yb)
			}; // B
			var xe2 = x1 - (ab - wspa * k) / d;
			var ye2 = y1 + (ab * k + wspa) / d;
			points[3] = {
				x1 : Math.round(xe2),
				y1 : Math.round(ye2)
			}; // E
		} else if (x1 < x0 && y1 < y0) {
			var k = (1.0 * (y1 - y0) / (x1 - x0));
			var d = Math.sqrt(1 + Math.pow(k, 2));
			points[0] = {
				x1 : x1,
				y1 : y1
			}; // A
			var xe1 = x1 + (wspa * k + ab) / d;
			var ye1 = y1 + (ab * k - wspa) / d;
			points[1] = {
				x1 : Math.round(xe1),
				y1 : Math.round(ye1)
			}; // E
			var xb = x1 + wspr / d;
			var yb = y1 + wspr * k / d;
			points[2] = {
				x1 : Math.round(xb),
				y1 : Math.round(yb)
			}; // B
			var xe2 = x1 + (ab - wspa * k) / d;
			var ye2 = y1 + (ab * k + wspa) / d;
			points[3] = {
				x1 : Math.round(xe2),
				y1 : Math.round(ye2)
			}; // E
		}
	}
	this.points = points;

};
