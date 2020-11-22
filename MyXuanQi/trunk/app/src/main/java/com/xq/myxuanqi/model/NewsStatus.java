package com.xq.myxuanqi.model;

public interface NewsStatus {

	/**
	 * 新闻编辑中或完成编辑，未发布,默认
	 */
	public static final int unpublished = 0;
	/**
	 * 审核中
	 */
	public static final int underReview = 1;
	/**
	 * 已发布
	 */
	public static final int published = 2;
	/**
	 * 已下架
	 */
	public static final int removed = 3;
	/**
	 * 已删除，用户点击删除，可以只修改这个属性，而不是直接在数据库删除此条记录。注：需要考虑mongodb的skip()方法 直接删了算了orz
	 */
	public static final int deleted = 4;
	/**
	 * 审核失败
	 */
	public static final int notApproved = 5;
}