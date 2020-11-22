/**
 * Wait task class
 */

function WaitingTaskInstance() {
	this.id = "Waiting Task 00";
	this.name = "Waiting Task";
	this.x0 = 0; // top left corner X
	this.y0 = 0; // top left corner Y
	this.x1 = 0; // bottom right corner X
	this.y1 = 0; // bottom right corner X
	this.status = 0; //
	this.description = null;
	this.isParallelInput = 0; // 0:no; 1:yes
	this.isParallelOutput = 0; // 0:no; 1:yes
	this.currOwner = null; // process ID
	this.owner = null; // organization ID
	this.inputs = []; // input transitions (arcs)
	this.outputs = []; // output transitions (arcs)
	this.marks = []; // eight corner marks
	this.classtypename = "WaitTaskInstance";

	// true: specific; false: variable
	this.specificDuration = true;
	this.timeRule = null;
	// 0:workday; 1:day; 2:week; 3:month; 4:quarter(3 months); 
	// 5:hour; 6:minute; 7:second; 8:millisecond;
	this.timeUnit = 0;
	
	this.largeDuration = 0;
	// 0:workday; 1:day; 2:week: 3:month; 4:quarter
	this.largeDurationUnit = 0;
	this.hours = 0;
	this.minutes = 0;
	this.seconds = 0;
	this.milliseconds = 0;
	// runtime props
	this.startTime = -1;
	this.endTime = -1;
	this.definitionId;
	this.progress = 0.0;
	this.waitTime = 0;
};

WaitingTaskInstance.prototype = new WaitingTask();

WaitingTaskInstance.prototype.clone = function() {
	var a = new WaitingTaskInstance();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
//	a.status = this.status; //
	a.selected = this.selected; // is selected on canvas

//	a.specificDuration = this.specificDuration;
//	if (this.timeRule != null) {
//		a.timeRule = this.timeRule.clone();
//	}
//	a.largeDuration = this.largeDuration;
//	// 0:day; 1:week; 2:fortnight: 3:month; 4:quarter
//	a.largeDurationUnit = this.largeDurationUnit;
//	a.hours = this.hours;
//	a.minutes = this.minutes;
//	a.seconds = this.seconds;
//	a.milliseconds = this.milliseconds;


	return a;
};

WaitingTaskInstance.prototype.parse = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.x0 = json.x0; // top left corner X
	this.y0 = json.y0; // top left corner Y
	this.x1 = json.x1; // bottom right corner X
	this.y1 = json.y1; // bottom right corner X
	this.description = json.description;
	this.isParallelOutput = json.isParallelOutput;
	this.isParallelInput = json.isParallelInput;
	this.lastupdate = Utils.getDateTime(json.lastupdate)
	this.currOwner = json.currOwner; // process ID
	this.owner = json.owner; // organization ID
	this.status = json.status;
	this.specificDuration = json.specificDuration;
	if (json.timeRule != null) {
		var r = new Expression();
		r.expressionString = json.timeRule;
		this.timeRule = r;
	}
	this.timeUnit = json.timeUnit;
	this.largeDuration = json.largeDuration;
	// 0:day; 1:week; 2:fortnight: 3:month; 4:quarter
	this.largeDurationUnit = json.largeDurationUnit;
	this.hours = json.hours;
	this.minutes = json.minutes;
	this.seconds = json.seconds;
	this.milliseconds = json.milliseconds;
	this.startTime = json.startTime;
	this.endTime = json.endTime;
	this.definitionId = json.definitionId;
	this.progress = json.progress;
	this.waitTime = json.waitTime;
};

WaitingTaskInstance.prototype.stringifyforJSON = function() {
	var a = new WaitingTaskInstance();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.description = this.description;
	a.isParallelInput = this.isParallelInput;
	a.isParallelOutput = this.isParallelOutput;
	a.lastupdate = this.lastupdate;
	a.currOwner = this.currOwner; // process ID
	a.owner = this.owner; // organization ID
	a.specificDuration = this.specificDuration;
	if (this.timeRule != null) {
		a.timeRule = this.timeRule.toExpressionString();
	}
	a.timeUnit = this.timeUnit;
	a.largeDuration = this.largeDuration;
	// 0:day; 1:week; 2:fortnight: 3:month; 4:quarter
	a.largeDurationUnit = this.largeDurationUnit;
	a.hours = this.hours;
	a.minutes = this.minutes;
	a.seconds = this.seconds;
	a.milliseconds = this.milliseconds;
	a.startTime = this.startTime;
	a.endTime = this.endTime;
	a.definitionId = this.definitionId;
	a.progress = this.progress;
	a.waitTime = this.waitTime;
	return a;
};

// A function for drawing the particle.
WaitingTaskInstance.prototype.drawToContext = function() {
	var tmp = this.context.fillStyle;
	var tmp1 = this.context.strokeStyle;

	var cornerRadius = 8;
	this.context.beginPath();
	this.context.moveTo(this.x0 + cornerRadius, this.y0);
	this.context.lineTo(this.x1 - cornerRadius, this.y0);
	this.context.arcTo(this.x1, this.y0, this.x1, this.y0 + cornerRadius,
			cornerRadius);
	this.context.lineTo(this.x1, this.y1 - cornerRadius);
	this.context.arcTo(this.x1, this.y1, this.x1 - cornerRadius, this.y1,
			cornerRadius);
	this.context.lineTo(this.x0 + cornerRadius, this.y1);
	this.context.arcTo(this.x0, this.y1, this.x0, this.y1 - cornerRadius,
			cornerRadius);
	this.context.lineTo(this.x0, this.y0 + cornerRadius);
	this.context.arcTo(this.x0, this.y0, this.x0 + cornerRadius, this.y0,
			cornerRadius);
	this.context.closePath();
	this.context.fillStyle = 'rgb(244, 250, 255)';
	this.context.fill();
	this.context.strokeStyle = 'rgb(196, 210, 237)';
	this.context.stroke();
	this.context.moveTo(this.x0 + 1, this.y0 + 30);
	this.context.lineTo(this.x1 - 1, this.y0 + 30);
	this.context.stroke();

	this.context.fillStyle = tmp;
	this.context.strokeStyle = tmp1; // resume old color

	clockIcon48x48(this.context, this.x1 - 48, this.y1 - 48);

	var label = new TaskTextLabel(this.x0, this.y0, this.x1, this.y1, this.context);
	label.outputText(this.name, "C");
	
	var label1 = new TaskTextLabel(this.x0, this.y0+30, this.x1, this.y1, this.context);
	label1.outputText(this.description, "C");

	this.marks = Utils.createMarks(this.x0, this.y0, this.x1, this.y1);
	if (this.selected) {
		Utils.drawSelection(this.marks, this.context);
	}
};

WaitingTaskInstance.prototype.isInMark = function(x, y) {
	if (this.marks != null && this.marks.length > 0) {
		for (var i = 0; i < this.marks.length; i++) {
			if (this.marks[i].x0 - 4 <= x
					&& x <= this.marks[i].x0 + this.marks[i].width + 4
					&& this.marks[i].y0 - 4 <= y
					&& y <= this.marks[i].y0 + this.marks[i].height + 4) {
				return this.marks[i].name;
			}
		}
	}
	return "default";
};