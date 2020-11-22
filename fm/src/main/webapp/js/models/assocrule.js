/**
 * This rule describes source component's behavior affects or associates target
 * component's behavior. Dahai Cao created and noted on 2017-05-15
 */
;
function PropagateRule() {
	this.behavior = null; // 
	this.conditions = null;// Condition object, the result is true or false
	this.tComId = "";
	this.tComAction = null;
	this.tComExpressions = null
	this.eComId = "";
	this.eComAction = null;
	this.eComExpressions = null;
};

PropagateRule.prototype.clone = function(oldowner) {
	var r = new PropagateRule();
	r.behavior = this.behavior;
	r.conditions = (this.conditions == null ? null : this.conditions
			.clone(oldowner));
	r.tComId = this.tComId;
	r.tComAction = this.tComAction;
	r.tComExpressions = (this.tComExpressions == null ? null
			: this.tComExpressions.clone(oldowner));
	r.eComId = this.eComId;
	r.eComAction = this.eComAction;
	r.eComExpressions = (this.eComExpressions == null ? null
			: this.eComExpressions.clone(oldowner));
	return r;
};

PropagateRule.prototype.parseFromJSON = function(json) {
	this.behavior = json.behavior; // 
	// Condition object, the result is true or false
	if (json.conditions != undefined && json.conditions != null) {
		var r = new Expressions();
		r.parseFromJSON(json.conditions);
		this.conditions = r;
	}
	this.tComId = json.tComId;
	this.tComAction = json.tComAction;
	if (json.tComExpressions != undefined && json.tComExpressions != null) {
		var r = new Expressions();
		r.parseFromJSON(json.tComExpressions);
		this.tComExpressions = r;
	}
	this.eComId = json.eComId;
	this.eComAction = json.eComAction;
	if (json.eComExpressions != undefined && json.eComExpressions != null) {
		var r = new Expressions();
		r.parseFromJSON(json.eComExpressions);
		this.eComExpressions = r;
	}
};

PropagateRule.prototype.parseExpressions = function(owner) {
	if (this.conditions != undefined && this.conditions != null) {
		this.conditions.parseExpressionString(owner);
	}
	if (this.tComExpressions != undefined && this.tComExpressions != null) {
		this.tComExpressions.parseExpressionString(owner);
	}
	if (this.eComExpressions != undefined && this.eComExpressions != null) {
		this.eComExpressions.parseExpressionString(owner);
	}
};
