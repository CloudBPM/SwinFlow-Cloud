/**
 * 
 */

function SMSSendingTask() {
	this.id = "SMS Sending 00"; // top left corner X
	this.name = "SMS Sending"; // top left corner Y
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
	this.classtypename = "SMSSendingTask";
	this.lastupdate = null;

	this.receivers = [];
	this.templateId = null;
	this.template = null;
}

SMSSendingTask.prototype = new AbstractTask();

SMSSendingTask.prototype.cloneReceiverList = function() {
	var parts = [];
	if (this.receivers != null && this.receivers.length > 0) {
		for (var i = 0; i < this.receivers.length; i++) {
			parts.push(this.receivers[i].clone());
		}
	}
	return parts;
};

SMSSendingTask.prototype.clone = function() {
	var a = new SMSSendingTask();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.selected = this.selected; // is selected on canvas
	return a;
};

SMSSendingTask.prototype.stringifyforJSON = function() {
	var a = new SMSSendingTask();
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
	a.receivers = this.receivers;
	a.templateId = this.templateId;
	a.template = this.template;
	return a;
};

SMSSendingTask.prototype.parse = function(json) {
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
	this.template = json.template;
	this.templateId = json.templateId;
	if (json.receivers != null && json.receivers.length > 0) {
		for (var i = 0; i < json.receivers.length; i++) {
			if (json.receivers[i].classtypename == "MessageReceiver") {
				var p = new MessageReceiver();
				p.id = json.receivers[i].id;
				p.name = json.receivers[i].name;
				p.taskId = json.receivers[i].parent;
				p.messageType = json.receivers[i].messageType;
				p.receiverType = json.receivers[i].receiverType;
				p.organizationId = json.receivers[i].organizationId;
				p.organizationName = json.receivers[i].organizationName;
				p.departmentId = json.receivers[i].departmentId;
				p.departmentName = json.receivers[i].departmentName;
				p.positionId = json.receivers[i].positionId;
				p.positionName = json.receivers[i].positionName;
				p.userId = json.receivers[i].userId;
				p.userFullName = json.receivers[i].userFullName;
				p.currOwner = json.receivers[i].currOwner;
				p.owner = json.receivers[i].owner;
				this.receivers.push(p);
			}
		}
	}
};

// A function for drawing the particle.
SMSSendingTask.prototype.drawToContext = function() {
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

	BuildTimeUtils.mobile48x48SendingIcon(this.context, this.x1 - 48, this.y1 - 48);

	var label = new TaskTextLabel(this.x0, this.y0, this.x1, this.y1,
			this.context);
	label.outputText(this.name, "C");

	var label1 = new TaskTextLabel(this.x0, this.y0 + 30, this.x1, this.y1,
			this.context);
	label1.outputText(this.description, "C");

	this.marks = Utils.createMarks(this.x0, this.y0, this.x1, this.y1);
	if (this.selected) {
		Utils.drawSelection(this.marks, this.context);
	}
};

SMSSendingTask.prototype.isInMark = function(x, y) {
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