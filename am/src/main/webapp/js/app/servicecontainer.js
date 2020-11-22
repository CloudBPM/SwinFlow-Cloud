/**
 * 
 */
function ServiceContainer() {
	this.id = null;
	this.name = null;
	this.containerType = -1
	this.type = 116; // by default
	this.rank = 2; // by default
	this.containerName = null;
	this.containerId = null;
	this.imageName = null;
	this.imageVersion = null;
	this.containerPort = 0;
	this.exposedPort = 0;
	this.otherOptions = null;
	this.createDateTime = null;
	this.lastupdate = null;
	this.parent = null;
	this.owner = null; // organization ID
	this.classtypename = "ServiceContainer";
};

ServiceContainer.prototype = new WorkflowEntity();

ServiceContainer.prototype.parse = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.containerType = json.containerType;
	this.type = json.type;
	this.rank = json.rank;
	this.containerName = json.containerName;
	this.containerId = json.containerId;
	this.containerType = json.containerType;
	this.imageName = json.imageName;
	this.imageVersion = json.imageVersion;
	this.containerPort = json.containerPort;
	this.exposedPort = json.exposedPort;
	this.otherOptions = json.otherOptions;
	this.createDateTime = Utils.getDateTime(json.createDateTime);
	this.lastupdate = Utils.getDateTime(json.lastupdate)
	this.parent = json.parent;
	this.owner = json.owner; // organization ID
};