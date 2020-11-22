/**
 *
 */

function CommentMsg() {
    this.commentId = null;//评论ID
    this.content = null;  //评论正文
    this.senderId = null; //评论人的id
    this.senderAvatarUrl = null;  //评论人头像url
    this.senderName = null; //评论人姓名
    this.articleId = null;  //被评论的文章id
    this.sendTime = 0;  //评论的发送时间
    this.messageType = null;//  评论类型  0 图片 ,1 文本
    this.likeNumber = 0;//点赞数量
    this.twoComments = [];
}

CommentMsg.prototype.parsefromJSON = function(json) {
    this.commentId = json.commentId;
    this.content = json.content;
    this.senderId = json.senderId;
    this.senderAvatarUrl = json.senderAvatarUrl;
    this.senderName = json.senderName;
    this.articleId = json.articleId;
    this.sendTime = json.sendTime;
    this.messageType = json.messageType;
    this.likeNumber = json.likeNumber;
    if (json.twoComments != null && json.twoComments != "") {
        var comt = JSON.parse(json.twoComments);
        for (var i = 0; i < comt.length; i++) {
            // var fc = new FileConstant();
            // fc.parseObject(atts[i]);
            this.twoComments.push(comt[i]);
        }
    }
};

CommentMsg.prototype.stringifyforJSON = function() {
    var commentMsg = new CommentMsg();
    commentMsg.commentId = this.commentId;
    commentMsg.content = this.content;
    commentMsg.senderId = this.senderId;
    commentMsg.senderAvatarUrl = this.senderAvatarUrl;
    commentMsg.senderName = this.senderName;
    commentMsg.articleId = this.articleId;
    commentMsg.sendTime = this.sendTime;
    commentMsg.messageType = this.messageType;
    commentMsg.likeNumber = this.likeNumber;
    return commentMsg;
};
