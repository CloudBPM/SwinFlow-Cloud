package com.cloudibpm.core.reference;

import com.cloudibpm.core.TreeNode;

public class ReferenceDetail extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 2085223038637809067L;
	private String code = null;
	private String parentCode = null;
	private String description = null;
	private int status = 0; // 0: not in use; 1: in use;
	private String customColumn1 = null;
	private String customColumn2 = null;
	private String customColumn3 = null;

	public ReferenceDetail() {
	}

	public ReferenceDetail(String id) {
		super(id);
	}

	/**
	 * @return the code
	 */
	public String getCode() {
		return code;
	}

	/**
	 * @param code
	 *            the code to set
	 */
	public void setCode(String code) {
		this.code = code;
	}

	/**
	 * @return the parentCode
	 */
	public String getParentCode() {
		return parentCode;
	}

	/**
	 * @param parentCode
	 *            the parentCode to set
	 */
	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}

	/**
	 * @return the status
	 */
	public int getStatus() {
		return status;
	}

	/**
	 * @param status
	 *            the status to set
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description
	 *            the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the customColumn1
	 */
	public String getCustomColumn1() {
		return customColumn1;
	}

	/**
	 * @param customColumn1
	 *            the customColumn1 to set
	 */
	public void setCustomColumn1(String customColumn1) {
		this.customColumn1 = customColumn1;
	}

	/**
	 * @return the customColumn2
	 */
	public String getCustomColumn2() {
		return customColumn2;
	}

	/**
	 * @param customColumn2
	 *            the customColumn2 to set
	 */
	public void setCustomColumn2(String customColumn2) {
		this.customColumn2 = customColumn2;
	}

	/**
	 * @return the customColumn3
	 */
	public String getCustomColumn3() {
		return customColumn3;
	}

	/**
	 * @param customColumn3
	 *            the customColumn3 to set
	 */
	public void setCustomColumn3(String customColumn3) {
		this.customColumn3 = customColumn3;
	}
	
	public String toString() {
		return getName();
	}
}
