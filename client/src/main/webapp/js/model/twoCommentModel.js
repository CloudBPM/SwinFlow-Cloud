/**
 *
 */

function TwoCommentMsg() {
    this.commentId = null;//评论ID
    this.content = null;  //评论正文
    this.senderId = null; //评论人的id
    this.senderAvatarUrl = null;  //评论人头像url
    this.senderName = null; //评论人姓名
    this.receiverId = null; //被评论人的id
    this.receiverAvatarUrl = null;  //被评论人头像url
    this.receiverName = null; //被评论人姓名
    this.articleId = null;  //被评论的文章id
    this.sendTime = 0;  //评论的发送时间
    this.messageType = null;//  评论类型  0 图片 ,1 文本
    this.likeNumber = 0;//点赞数量

}

TwoCommentMsg.prototype.parsefromJSON = function(json) {
    this.commentId = json.commentId;
    this.content = json.content;
    this.senderId = json.senderId;
    this.senderAvatarUrl = json.senderAvatarUrl;
    this.senderName = json.senderName;
    this.receiverId = json.receiverId;
    this.receiverAvatarUrl = json.receiverAvatarUrl;
    this.receiverName = json.receiverName;
    this.articleId = json.articleId;
    this.sendTime = json.sendTime;
    this.messageType = json.messageType;
    this.likeNumber = json.likeNumber;
};

TwoCommentMsg.prototype.stringifyforJSON = function() {
    var twoCommentMsg = new TwoCommentMsg();
    twoCommentMsg.commentId = this.commentId;
    twoCommentMsg.content = this.content;
    twoCommentMsg.senderId = this.senderId;
    twoCommentMsg.senderAvatarUrl = this.senderAvatarUrl;
    twoCommentMsg.senderName = this.senderName;
    twoCommentMsg.receiverId = this.receiverId;
    twoCommentMsg.receiverAvatarUrl = this.receiverAvatarUrl;
    twoCommentMsg.receiverName = this.receiverName;
    twoCommentMsg.articleId = this.articleId;
    twoCommentMsg.sendTime = this.sendTime;
    twoCommentMsg.messageType = this.messageType;
    twoCommentMsg.likeNumber = this.likeNumber;
    return twoCommentMsg;
};