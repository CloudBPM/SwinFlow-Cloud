/**
 * 
 */
package com.cloudibpm.core.organization;

import java.io.Serializable;
import java.util.Date;

/**
 * 组织与组织之间的关系很复杂，千丝万缕，各种各样的关系总结起来，基本有以下几种，
 * 
 * @author Dahai Cao created on 2016-10-16, last updated at 16:48 on 2018-08-28
 *
 */
public class OrganizationRelationship implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 7990604776428534989L;
	/**
	 * the property describes that A and B are partnership. e.g., A is B's
	 * customer; A cooperates with B, that is, the relationship is peer to peer.
	 */
	public static final int PARTNERSHIP = 0;
	/**
	 * this property describes that A is B's parent relationship, e.g., A is
	 * mother organization or group organization, B is A's sub-organization and
	 * child organization.
	 */
	public static final int PARENT = 1;
	/**
	 * this property describes that A and B are child relationship, e.g., A is
	 * B's child organization or sub-organization.
	 */
	public static final int CHILDSHIP = 2;
	/**
	 * this property describes that A is B's administrator, B is under control
	 * of A.
	 */
	public static final int ADMINISTRATING = 3;
	/**
	 * this property describes that B is A's administrator, A is under control
	 * of B.
	 */
	public static final int ADMINISTRATED = 4;
	/**
	 * this property describes that B is under surveillance of A;
	 */
	public static final int SURVEILLANCE = 5;
	/**
	 * this property describes that A is under surveillance of B;
	 */
	public static final int UNDDERSURVEILLANCE = 6;

	private String orgAId = null;
	private String orgBId = null;
	private int relationship = PARTNERSHIP;
	private Date createDate = null;
	private Date invalidateDate = null;

	/**
	 * 
	 */
	public OrganizationRelationship() {
	}

	public String getOrgAId() {
		return orgAId;
	}

	public void setOrgAId(String orgAId) {
		this.orgAId = orgAId;
	}

	public String getOrgBId() {
		return orgBId;
	}

	public void setOrgBId(String orgBId) {
		this.orgBId = orgBId;
	}

	public int getRelationship() {
		return relationship;
	}

	public void setRelationship(int relationship) {
		this.relationship = relationship;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getInvalidateDate() {
		return invalidateDate;
	}

	public void setInvalidateDate(Date invalidateDate) {
		this.invalidateDate = invalidateDate;
	}

}
