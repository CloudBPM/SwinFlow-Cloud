/**
 * 
 */

function EmailSendingTask() {
	this.id = "Email Sending 00"; // top left corner X
	this.name = "Email Sending"; // top left corner Y
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
	this.classtypename = "EmailSendingTask";
	this.lastupdate = null;

	this.subject = null;
	this.receivers = [];
	this.templateId = null; // template ID.
	this.variables = [];
	// the attachments only lists those in process in custom
	this.attachments = [];
	// template content
	this.template = null;
};

EmailSendingTask.prototype = new AbstractTask();

EmailSendingTask.prototype.cloneReceiverList = function() {
	var parts = [];
	if (this.receivers != null && this.receivers.length > 0) {
		for (var i = 0; i < this.receivers.length; i++) {
			parts.push(this.receivers[i].clone());
		}
	}
	return parts;
};

EmailSendingTask.prototype.cloneTemplate = function() {
	var t = new EmailSendingTask();
	if (this.variables != null && this.variables.length > 0) {
		for (var i = 0; i < this.variables.length; i++) {
			t.variables.push(this.variables[i]);
		}
	}
	if (this.attachments != null && this.attachments.length > 0) {
		for (var i = 0; i < this.attachments.length; i++) {
			t.attachments.push(this.attachments[i]);
		}
	}
	t.subject = this.subject;
	t.template = this.template;
	return t;
};

EmailSendingTask.prototype.clone = function() {
	var a = new EmailSendingTask();
	a.id = this.id;
	a.name = this.name;
	a.x0 = this.x0; // top left corner X
	a.y0 = this.y0; // top left corner Y
	a.x1 = this.x1; // bottom right corner X
	a.y1 = this.y1; // bottom right corner X
	a.selected = this.selected; // is selected on canvas
	return a;
};

EmailSendingTask.prototype.stringifyforJSON = function() {
	var a = new EmailSendingTask();
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
	a.subject = this.subject;
	a.receivers = this.receivers;
	a.template = this.template;
	a.templateId = this.templateId;
	if (this.variables != null && this.variables.length > 0) {
		var l = [];
		for (var i = 0; i < this.variables.length; i++) {
			l.push(this.variables[i].id);
		}
		a.variables = l;
	}
	if (this.attachments != null && this.attachments.length > 0) {
		var l = [];
		for (var i = 0; i < this.attachments.length; i++) {
			if (this.attachments[i] instanceof FileConstant) {
				l.push(this.attachments[i].toExpressionString());
			}
		}
		a.attachments = l;
	}
	return a;
};

EmailSendingTask.prototype.parse = function(json) {
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
	this.subject = json.subject;
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
	if (json.attachments != null && json.attachments.length > 0) {
		var l = [];
		for (var i = 0; i < json.attachments.length; i++) {
			var f = new FileConstant();
			f.parseString(json.attachments[i]);
			l.push(f);
		}
		this.attachments = l;
	}
	if (json.variables != null && json.variables.length > 0) {
		this.variables = json.variables;
	}
};

// A function for drawing the part.
EmailSendingTask.prototype.drawToContext = function() {
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

	BuildTimeUtils.email48x48IconSending(this.context, this.x1 - 48,
			this.y1 - 48);

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

EmailSendingTask.prototype.isInMark = function(x, y) {
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