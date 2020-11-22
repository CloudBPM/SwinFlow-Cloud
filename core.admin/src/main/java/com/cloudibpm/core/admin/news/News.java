package com.cloudibpm.core.admin.news;

import com.cloudibpm.core.WorkflowEntity;

/**
 * 该类描述了组织发布的动态新闻，消息（快讯），资讯，公告，广告，文献资料（科技、历史、文学、）
 * 
 * @author Dahai Cao created at 8:34 on 2018-10-18
 *
 */
public class News extends WorkflowEntity implements Comparable {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 3098597943069278865L;
	// 新闻动态标题
	private String title = null;
	// 简介
	private String brief = null;
	// 标题照片
	private String titleImage = null;
	// 原作者
	private String author = null;
	// 发表时间
	private long publishDateTime;
	// 新闻动态内容
	private String content = null;
	// 录入人ID
	private String writerId = null; 
	// 录入人
	private String writerName = null;
	// 发布单位ID
	private String organizationId = null;
	// 发布单位名称
	private String organizationName = null;
	// 发布日期时间
	private long lastUpdate;
	// 新闻动态状态
	private int newsState = NewsStatus.unpublished; // 默认为未发布状态
	// 0: 公开新闻；1：内部新闻；2：通知公告；3：文献资料；4：广告推广；
	private int newsCategory = 0;
	// 新闻小类
	private int newsClass = 0;
	// 0: 公开发布的新闻动态，所有用户都可以看到，（对外动态）
	// 1：组织内部的公开发布新闻动态，非组织内部职员无法看到，（内部动态）
	// 2：组织内部个别圈子内发布的新闻动态，（内部参考）
	private int accessLevel = 0;
	// accessLevel为2，意味着组织内部只有少数人可以看到
	// 这个数据是category ID数组。
	private String [] accessRange = null;
	// 新闻动态内容所附图片、视频、文档资料
	private String attachments = null;
	// on top新闻动态置顶，所有的置顶新闻都按照order排序。
	// 0: 不置顶；1：置顶
	private int top = 0;
	// 排序，1 ->.. ->100
	private int order = -1;
	// 允许评论，0:允许评论；1：不允许评论，默认允许
	private int commentAllowable = 0;
	// 评论列表
	private Comment [] comments = new Comment[0];

	public int getCommentAllowable() {
		return commentAllowable;
	}

	public void setCommentAllowable(int commentAllowable) {
		this.commentAllowable = commentAllowable;
	}

	public Comment[] getComments() {
		return comments;
	}

	public void setComments(Comment[] comments) {
		this.comments = comments;
	}

	public int getOrder() {
		return order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

	public int getTop() {
		return top;
	}

	public void setTop(int top) {
		this.top = top;
	}

	public String[] getAccessRange() {
		return accessRange;
	}

	public void setAccessRange(String[] accessRange) {
		this.accessRange = accessRange;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	/**
	 * @return the brief
	 */
	public String getBrief() {
		return brief;
	}

	/**
	 * @param brief
	 *            the brief to set
	 */
	public void setBrief(String brief) {
		this.brief = brief;
	}

	/**
	 * @return the titleImage
	 */
	public String getTitleImage() {
		return titleImage;
	}

	/**
	 * @param titleImage
	 *            the titleImage to set
	 */
	public void setTitleImage(String titleImage) {
		this.titleImage = titleImage;
	}



	/**
	 * @return the publishDateTime
	 */
	public long getPublishDateTime() {
		return publishDateTime;
	}

	/**
	 * @param publishDateTime
	 *            the publishDateTime to set
	 */
	public void setPublishDateTime(long publishDateTime) {
		this.publishDateTime = publishDateTime;
	}

	/**
	 * @return the writerId
	 */
	public String getWriterId() {
		return writerId;
	}

	/**
	 * @param writerId
	 *            the writerId to set
	 */
	public void setWriterId(String writerId) {
		this.writerId = writerId;
	}

	/**
	 * @return the writerName
	 */
	public String getWriterName() {
		return writerName;
	}

	/**
	 * @param writerName
	 *            the writerName to set
	 */
	public void setWriterName(String writerName) {
		this.writerName = writerName;
	}

	public String getOrganizationId() {
		return organizationId;
	}

	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	public long getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(long lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	public int getNewsState() {
		return newsState;
	}

	public void setNewsState(int newsState) {
		this.newsState = newsState;
	}

	/**
	 * @return the newsCategory
	 */
	public int getNewsCategory() {
		return newsCategory;
	}

	/**
	 * @param newsCategory
	 *            the newsCategory to set
	 */
	public void setNewsCategory(int newsCategory) {
		this.newsCategory = newsCategory;
	}

	/**
	 * @return the newsClass
	 */
	public int getNewsClass() {
		return newsClass;
	}

	/**
	 * @param newsClass
	 *            the newsClass to set
	 */
	public void setNewsClass(int newsClass) {
		this.newsClass = newsClass;
	}

	/**
	 * @return the accessLevel
	 */
	public int getAccessLevel() {
		return accessLevel;
	}

	/**
	 * @param accessLevel
	 *            the accessLevel to set
	 */
	public void setAccessLevel(int accessLevel) {
		this.accessLevel = accessLevel;
	}

	/**
	 * @return the attachments
	 */
	public String getAttachments() {
		return attachments;
	}

	/**
	 * @param attachments
	 *            the attachments to set
	 */
	public void setAttachments(String attachments) {
		this.attachments = attachments;
	}

	/**
	 * @return the author
	 */
	public String getAuthor() {
		return author;
	}

	/**
	 * @param author the author to set
	 */
	public void setAuthor(String author) {
		this.author = author;
	}

	/**
	 * @param   o the object to be compared.
	 * @return  a negative integer, zero, or a positive integer as this object
	 *          is less than, equal to, or greater than the specified object.
	 */
	@Override
	public int compareTo(Object o) {
		if (top == 1) {
			return order - ((News)o).getOrder();
		}
		return new Long((lastUpdate - ((News)o).getLastUpdate())).intValue();
	}
}
