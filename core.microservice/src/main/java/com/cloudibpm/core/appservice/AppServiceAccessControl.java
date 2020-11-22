/**
 * 
 */
package com.cloudibpm.core.appservice;

import java.io.Serializable;
import java.util.Date;

/**
 * @author dev
 *
 */
public class AppServiceAccessControl implements Serializable {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6809964027528714916L;
	private String appServiceId = null;
	private String organizationId = null;
	private String organizationName = null;
	private Date createDateTime = null;
	private long accessCounting = 0;
	private String owner = null;

	/**
	 * 
	 */
	public AppServiceAccessControl() {
	}

	public String getAppServiceId() {
		return appServiceId;
	}

	public void setAppServiceId(String appServiceId) {
		this.appServiceId = appServiceId;
	}

	public String getOrganizationId() {
		return organizationId;
	}

	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}

	public Date getCreateDateTime() {
		return createDateTime;
	}

	public void setCreateDateTime(Date createDateTime) {
		this.createDateTime = createDateTime;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	/**
	 * @return the organizationName
	 */
	public String getOrganizationName() {
		return organizationName;
	}

	/**
	 * @param organizationName
	 *            the organizationName to set
	 */
	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	/**
	 * @return the accessCounting
	 */
	public long getAccessCounting() {
		return accessCounting;
	}

	/**
	 * @param accessCounting the accessCounting to set
	 */
	public void setAccessCounting(long accessCounting) {
		this.accessCounting = accessCounting;
	}

}
