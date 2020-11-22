/**
 *
 */
package com.cloudibpm.core.runtime.wfprocess;

import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;

/**
 * This class is used to runtime process engine enactment.
 *
 * @author Dahai Cao created 2011-9-5 下午12:14:36; last updated at 14:50 on 2019-03-23
 */
public class WfProcessInstance extends ReleasedWfProcess {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5202847266627191722L;
    private String wfProcessId = null;
    private String launchUserId = null;
    private String launchUser = null; // launcher full name
    private String idType = null;
    private String idNumber = null;
    private String mobileNumber = null;
    // 0: not staff by default; 1: is staff
    private int staffLaunched = 0;
    /** the time stamp of launching this process instance on server */
    private long launchTime = -1;
    /** the time stamp of initializing this process instance on server */
    private long startTime = -1;
    /** the time stamp of completing this process instance on server */
    private long endTime = -1;
    /** the time stamp of launching this process instance on server */
    private long suspensionTime = -1;
    /** the the time stamp when this process instance was updated */
    private long updateTime = -1;
    /** the time stamp of terminating this process instance on server */
    private long terminationTime = -1;
    private String ipv4 = null; // client IPv4
    private String ipv6 = null; // client IPv6
    private String serverIp = null; // sever IP
    /** the device which client is launch this process instance */
    private String device = null;
    /** the longitude at which client device is */
    private String longitude = null;
    /** the latitude at which client device is */
    private String latitude = null;

    /**
     *
     */
    public WfProcessInstance() {
    }

    /**
     * @param id
     */
    public WfProcessInstance(String id) {
        super(id);
    }

    /**
     * This property stores process definition id. It is just used when this
     * process is instantiated as an instance for executing. This property can
     * be used to analyse process count.
     *
     * @return the wfProcessId
     */
    public String getWfProcessId() {
        return wfProcessId;
    }

    /**
     * This property stores process definition id. It is just used when this
     * process is instantiated as an instance for executing. This property can
     * be used to analyse process count.
     *
     * @param wfProcessId
     *            the wfProcessId to set
     */
    public void setWfProcessId(String wfProcessId) {
        this.wfProcessId = wfProcessId;
    }

    /**
     * Sets the date time that current business process is instantiated.
     *
     * @param startTime
     */
    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    /**
     * Return the date time that current business process is instantiated.
     *
     * @return
     */
    public long getStartTime() {
        return startTime;
    }

    /**
     * @return the launchTime
     */
    public long getLaunchTime() {
        return launchTime;
    }

    /**
     * @param launchTime
     *            the launchTime to set
     */
    public void setLaunchTime(long launchTime) {
        this.launchTime = launchTime;
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
     * @return the terminationTime
     */
    public long getTerminationTime() {
        return terminationTime;
    }

    /**
     * @param terminationTime
     *            the terminationTime to set
     */
    public void setTerminationTime(long terminationTime) {
        this.terminationTime = terminationTime;
    }

    /**
     * @return the endTime
     */
    public long getEndTime() {
        return endTime;
    }

    /**
     * @param endTime
     *            the endTime to set
     */
    public void setEndTime(long endTime) {
        this.endTime = endTime;
    }

    /**
     * @return the device
     */
    public String getDevice() {
        return device;
    }

    /**
     * @param device
     *            the device to set
     */
    public void setDevice(String device) {
        this.device = device;
    }

    /**
     * @return the longitude
     */
    public String getLongitude() {
        return longitude;
    }

    /**
     * @param longitude
     *            the longitude to set
     */
    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    /**
     * @return the latitude
     */
    public String getLatitude() {
        return latitude;
    }

    /**
     * @param latitude
     *            the latitude to set
     */
    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    /**
     * @return the launchUserId
     */
    public String getLaunchUserId() {
        return launchUserId;
    }

    /**
     * @param launchUserId
     *            the launchUserId to set
     */
    public void setLaunchUserId(String launchUserId) {
        this.launchUserId = launchUserId;
    }

    public String getLaunchUser() {
        return launchUser;
    }

    public void setLaunchUser(String launchUser) {
        this.launchUser = launchUser;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getIdType() {
        return idType;
    }

    public void setIdType(String idType) {
        this.idType = idType;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    /**
     * @return the ipv4
     */
    public String getIpv4() {
        return ipv4;
    }

    /**
     * @param ipv4
     *            the ipv4 to set
     */
    public void setIpv4(String ipv4) {
        this.ipv4 = ipv4;
    }

    /**
     * @return the ipv6
     */
    public String getIpv6() {
        return ipv6;
    }

    /**
     * @param ipv6
     *            the ipv6 to set
     */
    public void setIpv6(String ipv6) {
        this.ipv6 = ipv6;
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
     * @return the staffLaunched
     */
    public int getStaffLaunched() {
        return staffLaunched;
    }

    /**
     * @param staffLaunched
     *            the staffLaunched to set
     */
    public void setStaffLaunched(int staffLaunched) {
        this.staffLaunched = staffLaunched;
    }

    /**
     * @return the serverIp
     */
    public String getServerIp() {
        return serverIp;
    }

    /**
     * @param serverIp
     *            the serverIp to set
     */
    public void setServerIp(String serverIp) {
        this.serverIp = serverIp;
    }

}