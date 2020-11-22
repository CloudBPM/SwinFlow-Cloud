/**
 * 
 */
package com.cloudibpm.core.runtime.admin;

import java.io.Serializable;

/**
 * @author Dahai Cao created on 2018-02-15
 *
 */
public class AdminSearchResult implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 5626327894126195004L;
	private String instanceId = null;
	private String definitionId = null;
	private String processName = null;
	private String processVersion = null;
	private int status = -1;
	private String launcher = null;
	private String idType = "0";
	private String idNumber = null;
	private long startTime = 0;
	private long suspensionTime = -1;
	private long updateTime = -1;
	private String server = null;

	/**
	 * 
	 */
	public AdminSearchResult() {
	}

	/**
	 * @return the instanceId
	 */
	public String getInstanceId() {
		return instanceId;
	}

	/**
	 * @param instanceId
	 *            the instanceId to set
	 */
	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}

	/**
	 * @return the definitionId
	 */
	public String getDefinitionId() {
		return definitionId;
	}

	/**
	 * @param definitionId
	 *            the definitionId to set
	 */
	public void setDefinitionId(String definitionId) {
		this.definitionId = definitionId;
	}

	/**
	 * @return the processName
	 */
	public String getProcessName() {
		return processName;
	}

	/**
	 * @param processName
	 *            the processName to set
	 */
	public void setProcessName(String processName) {
		this.processName = processName;
	}

	/**
	 * @return the processVersion
	 */
	public String getProcessVersion() {
		return processVersion;
	}

	/**
	 * @param processVersion
	 *            the processVersion to set
	 */
	public void setProcessVersion(String processVersion) {
		this.processVersion = processVersion;
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
	 * @return the launcher
	 */
	public String getLauncher() {
		return launcher;
	}

	/**
	 * @param launcher
	 *            the launcher to set
	 */
	public void setLauncher(String launcher) {
		this.launcher = launcher;
	}

	/**
	 * @return the idType
	 */
	public String getIdType() {
		return idType;
	}

	/**
	 * @param idType
	 *            the idType to set
	 */
	public void setIdType(String idType) {
		this.idType = idType;
	}

	/**
	 * @return the idNumber
	 */
	public String getIdNumber() {
		return idNumber;
	}

	/**
	 * @param idNumber
	 *            the idNumber to set
	 */
	public void setIdNumber(String idNumber) {
		this.idNumber = idNumber;
	}

	/**
	 * @return the startTime
	 */
	public long getStartTime() {
		return startTime;
	}

	/**
	 * @param startTime
	 *            the startTime to set
	 */
	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	/**
	 * @return the suspensionTime
	 */
	public long getSuspensionTime() {
		return suspensionTime;
	}

	/**
	 * @param suspensionTime
	 *            the suspensionTime to set
	 */
	public void setSuspensionTime(long suspensionTime) {
		this.suspensionTime = suspensionTime;
	}

	/**
	 * @return the updateTime
	 */
	public long getUpdateTime() {
		return updateTime;
	}

	/**
	 * @param updateTime
	 *            the updateTime to set
	 */
	public void setUpdateTime(long updateTime) {
		this.updateTime = updateTime;
	}

	/**
	 * @return the server
	 */
	public String getServer() {
		return server;
	}

	/**
	 * @param server
	 *            the server to set
	 */
	public void setServer(String server) {
		this.server = server;
	}
}