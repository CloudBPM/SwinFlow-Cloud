/**
 * 
 */
package com.cloudibpm.core.container;

import com.cloudibpm.core.TreeNode;

/**
 * @author Dahai Cao created on 2018-06-20
 */
public class ServiceContainer extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1366133393417875627L;
	private int containerType = -1;
	private int type = 0;
	private int rank = 0;
	private long createDateTime = 0;
	private long lastupdate = 0;
	private String imageName = null;
	private String imageVersion = null;
	private String otherOptions = null;
	private String containerId = null;
	private String containerName = null;
	private int containerPort = 0;
	private int exposedPort = 0;

	/**
	 * 
	 */
	public ServiceContainer() {
	}

	/**
	 * @param id
	 */
	public ServiceContainer(String id) {
		super(id);
	}

	/**
	 * @return the containerType
	 */
	public int getContainerType() {
		return containerType;
	}

	/**
	 * @param containerType
	 *            the containerType to set
	 */
	public void setContainerType(int containerType) {
		this.containerType = containerType;
	}

	/**
	 * @return the type
	 */
	public int getType() {
		return type;
	}

	/**
	 * @param type
	 *            the type to set
	 */
	public void setType(int type) {
		this.type = type;
	}

	/**
	 * @return the rank
	 */
	public int getRank() {
		return rank;
	}

	/**
	 * @param rank
	 *            the rank to set
	 */
	public void setRank(int rank) {
		this.rank = rank;
	}

	/**
	 * @return the createDateTime
	 */
	public long getCreateDateTime() {
		return createDateTime;
	}

	/**
	 * @param createDateTime
	 *            the createDateTime to set
	 */
	public void setCreateDateTime(long createDateTime) {
		this.createDateTime = createDateTime;
	}

	/**
	 * @return the lastupdate
	 */
	public long getLastupdate() {
		return lastupdate;
	}

	/**
	 * @param lastupdate
	 *            the lastupdate to set
	 */
	public void setLastupdate(long lastupdate) {
		this.lastupdate = lastupdate;
	}

	/**
	 * @return the containerId
	 */
	public String getContainerId() {
		return containerId;
	}

	/**
	 * @param containerId
	 *            the containerId to set
	 */
	public void setContainerId(String containerId) {
		this.containerId = containerId;
	}

	/**
	 * @return the imageName
	 */
	public String getImageName() {
		return imageName;
	}

	/**
	 * @param imageName
	 *            the imageName to set
	 */
	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

	/**
	 * @return the imageVersion
	 */
	public String getImageVersion() {
		return imageVersion;
	}

	/**
	 * @param imageVersion
	 *            the imageVersion to set
	 */
	public void setImageVersion(String imageVersion) {
		this.imageVersion = imageVersion;
	}

	/**
	 * @return the containerName
	 */
	public String getContainerName() {
		return containerName;
	}

	/**
	 * @param containerName
	 *            the containerName to set
	 */
	public void setContainerName(String containerName) {
		this.containerName = containerName;
	}

	public int getContainerPort() {
		return containerPort;
	}

	public void setContainerPort(int containerPort) {
		this.containerPort = containerPort;
	}

	public int getExposedPort() {
		return exposedPort;
	}

	public void setExposedPort(int exposedPort) {
		this.exposedPort = exposedPort;
	}

	public String getOtherOptions() {
		return otherOptions;
	}

	public void setOtherOptions(String otherOptions) {
		this.otherOptions = otherOptions;
	}




}
