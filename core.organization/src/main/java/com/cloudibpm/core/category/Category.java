/**
 *
 */
package com.cloudibpm.core.category;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.ui.mobile.MobileUI;

/**
 * 这个类别描述的是组织的分类、部门/项目组分类，岗位/项目角色分类
 *
 * @author Dahai Cao created at 15:50 on 2018-11-02
 *
 */
public class Category extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 2882722446300768976L;
	private String description = null;
	// 0: organization;
	// 1: department/project team;
	// 2: position/project role;
	private int categoryType = 0;
	private long createdDateTime = 0;
	private long lastupdate = 0;
	// 0:no use;1:in use
	private int usageStatus = 1;
	private MobileUI mbUIContent = null;
	private String tbUIContent = null;
	private Object pcUIContent = null;
    // 这个属性描述的是它属于哪个大类分类。
	private String rootCategoryId = null;
	// 这个属性描述的是它属于哪个大类分类。
	private String assignCategoryId = null;
	/**
	 *
	 */
	public Category() {
	}

	/**
	 * @param id
	 */
	public Category(String id) {
		super(id);
	}

	/**
	 * @return the categoryType
	 */
	public int getCategoryType() {
		return categoryType;
	}

	/**
	 * @param categoryType the categoryType to set
	 */
	public void setCategoryType(int categoryType) {
		this.categoryType = categoryType;
	}

	/**
	 * @return the createdDateTime
	 */
	public long getCreatedDateTime() {
		return createdDateTime;
	}

	/**
	 * @param createdDateTime the createdDateTime to set
	 */
	public void setCreatedDateTime(long createdDateTime) {
		this.createdDateTime = createdDateTime;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the usageStatus
	 */
	public int getUsageStatus() {
		return usageStatus;
	}

	/**
	 * @param usageStatus the usageStatus to set
	 */
	public void setUsageStatus(int usageStatus) {
		this.usageStatus = usageStatus;
	}

	/**
	 * @return the last update
	 */
	public long getLastupdate() {
		return lastupdate;
	}

	/**
	 * @param lastupdate the last update to set
	 */
	public void setLastupdate(long lastupdate) {
		this.lastupdate = lastupdate;
	}

	/**
	 * @return the mbUIContent
	 */
	public MobileUI getMbUIContent() {
		return mbUIContent;
	}

	/**
	 * @param mbUIContent the mbUIContent to set
	 */
	public void setMbUIContent(MobileUI mbUIContent) {
		this.mbUIContent = mbUIContent;
	}

	/**
	 * @return the tbUIContent
	 */
	public String getTbUIContent() {
		return tbUIContent;
	}

	/**
	 * @param tbUIContent the tbUIContent to set
	 */
	public void setTbUIContent(String tbUIContent) {
		this.tbUIContent = tbUIContent;
	}

	/**
	 * @return the pcUIContent
	 */
	public Object getPcUIContent() {
		return pcUIContent;
	}

	/**
	 * @param pcUIContent the pcUIContent to set
	 */
	public void setPcUIContent(Object pcUIContent) {
		this.pcUIContent = pcUIContent;
	}

	public String getRootCategoryId() {
		return rootCategoryId;
	}

	public void setRootCategoryId(String rootCategoryId) {
		this.rootCategoryId = rootCategoryId;
	}

	public String getAssignCategoryId() {
		return assignCategoryId;
	}

	public void setAssignCategoryId(String assignCategoryId) {
		this.assignCategoryId = assignCategoryId;
	}
}
