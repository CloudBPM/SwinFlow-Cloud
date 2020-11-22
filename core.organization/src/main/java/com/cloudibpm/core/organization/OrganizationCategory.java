package com.cloudibpm.core.organization;

import com.cloudibpm.core.TreeNode;
/**
 * 
 * 单位类目
 * 
 * @author cuixk
 *
 */
public class OrganizationCategory extends TreeNode{

	/**
	 * 
	 */
	private static final long serialVersionUID = 4771850008825139810L;
	
	private String categoryDescription; //分类描述
	
	private String type; //类型编号
	
	private Integer rank;

	public String getCategoryDescription() {
		return categoryDescription;
	}

	public void setCategoryDescription(String categoryDescription) {
		this.categoryDescription = categoryDescription;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getRank() {
		return rank;
	}

	public void setRank(Integer rank) {
		this.rank = rank;
	}
	
	
}
