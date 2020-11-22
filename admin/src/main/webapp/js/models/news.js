/**
 * 
 */

function News() {
	// 新闻动态ID
	this.id = "";  //编号
	this.name = "";  //编号
	// 新闻动态标题
	this.title = null;
	// 简介
	this.brief = null;
	// 标题照片 FileConstant object
	this.titleImage = null;
	// 原作者
	this.author = null;
	// 发表时间
	this.publishDateTime;
	// 新闻动态内容
	this.content = null;
	// 录入人ID
	this.writerId = null; 
	// 录入人
	this.writerName = null;
	// 发布单位ID
	this.organizationId = null;
	// 发布单位名称
	this.organizationName = null;
	// 发布日期时间
	this.lastUpdate = 0;
	// 新闻动态状态
	this.newsState = 0; // 默认为未发布状态
	// 0: 新闻动态；1：消息快讯；2：资讯；3：公告；4：文献资料；5：广告；6：评论
	this.newsCategory = 99;
	// 新闻小类
	this.newsClass = 0;
	// 0: 公开发布的新闻动态，所有用户都可以看到，（对外动态）
	// 1：组织内部的公开发布新闻动态，非组织内部职员无法看到，（内部动态）
	// 2：组织内部个别圈子内发布的新闻动态，（内部参考）
	this.accessLevel = 99;
	// 新闻动态内容所附图片、视频、文档资料
	// array of FileConstant objects
	this.attachments = [];
	this.commentAllowable = 0;//
	this.comments = [];
	this.currOwner = null;
	this.owner = null;
	this.classtypename = "News";  //不知是什么
};

News.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.title = json.title;
	this.brief = json.brief;
	if (json.titleImage != null) {
		var fc = new FileConstant();
		fc.parseObject(json.titleImage);
		this.titleImage = fc;
	}
	this.author = json.author;
	this.publishDateTime = json.publishDateTime;
	this.content = json.content;
	this.writerId = json.writerId; 
	this.writerName = json.writerName;
	this.organizationId = json.organizationId;
	this.organizationName = json.organizationName;
	this.lastUpdate = json.lastUpdate;
	this.newsState = json.newsState; // 默认为未发布状态
	this.newsCategory = json.newsCategory;
	this.newsClass = json.newsClass;
	this.accessLevel = json.accessLevel;
	if (json.attachments != null && json.attachments != "") {
		var atts = JSON.parse(json.attachments);
		for (var i = 0; i < atts.length; i++) {
			var fc = new FileConstant();
			fc.parseObject(atts[i]);
			this.attachments.push(fc);
		}
	}
	this.commentAllowable = json.commentAllowable;
	if (json.comments != null && json.comments != "") {
		// var comt = JSON.parse(json.comments);
		comt=json.comments;
		for (var i = 0; i < comt.length; i++) {
			// var fc = new FileConstant();
			// fc.parseObject(atts[i]);
			this.comments.push(comt[i]);
		}
	}
	this.currOwner = json.currOwner;
	this.owner = json.owner;
};

News.prototype.stringifyforJSON = function() {
	var news = new News();
	news.id = this.id;
	news.name = this.name;
	news.title = this.title;
	news.brief = this.brief;
	news.titleImage = this.titleImage;
	news.author = this.author;
	news.publishDateTime = this.publishDateTime;
	news.content = this.content;
	news.writerId = this.writerId; 
	news.writerName = this.writerName;
	news.organizationId = this.organizationId;
	news.organizationName = this.organizationName;
	news.lastUpdate = this.lastUpdate;
	news.newsState = this.newsState; // 默认为未发布状态
	news.newsCategory = this.newsCategory;
	news.newsClass = this.newsClass;
	news.accessLevel = this.accessLevel;
	news.attachments = this.attachments;
	news.currOwner = this.currOwner;
	news.owner = this.owner;
	return news;
};