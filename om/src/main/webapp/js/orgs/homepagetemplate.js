/**
 * 
 */
function HomePageTemplate(){
	this.id = null;
	this.parent = null;
	this.owner = null; // organization ID
	this.skin = null; // skin ID
	this.imgURL = null;
	this.orgTitle = null;
	this.createdate = null;
	this.lastupdate = null;

};

HomePageTemplate.prototype = new WorkflowEntity();

HomePageTemplate.prototype.parseFromJSON = function(json) {
	
	this.id = json.id;
	this.parent = json.parent;
	this.owner = json.owner; // organization ID
	this.skin = json.skin; // skin ID
	this.imgURL = json.imgURL;
	this.orgTitle = json.orgTitle;
	this.createdate = json.createdate;
	this.lastupdate = json.lastupdate;
};

HomePageTemplate.prototype.stringifyforJSON = function(){
	var homePage = new HomePageTemplate();
	
	homePage.id = this.id;
	homePage.parent = this.parent;
	homePage.owner = this.owner; // organization ID
	homePage.skin = this.skin; // skin ID
	homePage.imgURL = this.imgURL;
	homePage.orgTitle = this.orgTitle;
	homePage.createdate = this.createdate;
	homePage.lastupdate = this.lastupdate;
	
	return homePage;
};


