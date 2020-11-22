/**
 * 
 */
package com.cloudibpm.core.runtime.server;

import java.util.Date;

import com.cloudibpm.core.TreeNode;

/**
 * @author Dahai Cao created on 2018-02-01
 *
 */
public class ServerInfoDescriptor extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -2870891033093436285L;
	/** 云虚拟机日期时间 */
	private String serverDatetime = "";
	/** 操作系统，包括版本. */
	private String os = "";
	/** 处理器，2核，4核，8核CPU. */
	private String processors = "";
	/** 当前正在使用的（总的）物理内存. */
	private long totalPhysicalMemory = 0;
	/** 剩余的物理内存. */
	private long freePhysicalMemory = 0;
	/** 已使用的物理内存. */
	private long usedPhysicalMemory = 0;
	private String ipv4 = "";
	private String ipv6 = null;
	private int status = 0;
	/** 是否可以接收新的请求，0：不可以；1：可以。 */
	private int acceptable = 0;

	/** Java虚拟机包括版本. */
	private String jdkName = "";
	/** 总共虚拟机内存. */
	private long totalJVMMemory = 0;
	/** 剩余虚拟机内存. */
	private long freeJVMMemory = 0;
	/** 最大可使用内存. */
	private long maxJVMMemory = 0;
	/** 总共线程数 */
	private long totalThreads = 0;
	/** 峰值线程数 */
	private long peakThreads = 0;
	/** 活动线程数 */
	private long activeThreads = 0;
	/** 守护线程数 */
	private long demonThreads = 0;

	/** 中间件名 */
	private String mwName = "";
	/** 中间件访问端口 */
	private String mwPort = "";
	/** 启动参数 */
	private String mwParameters = "";

	/** 流程执行服务状态， 0：停止；1：运行；2：暂停； */
	private int peStatus = 0;
	/** 已经运行时间 */
	private String peRunned = "";
	/** 重启次数 */
	private int peRestarted = 0;

	private int pePoolSize = 0;

	private int peMaxPoolSize = 0;
	/** 运行实例数 */
	private long peRunning = 0;
	/** 排队实例数 */
	private long peQueuing = 0;
	/** 完成实例数 */
	private long peCompleted = 0;
	/** 暂停实例数 */
	private long peSuspended = 0;
	/** 中止实例数 */
	private long peTerminated = 0;
	/** 总吞吐量 */
	private long peThroughout = 0;
	/** 成功率 */
	private double peSuccessRate = 0;

	/** 事务执行服务状态， 0：停止；1：运行；2：暂停； */
	private int teStatus = 0;
	/** 已经运行时间 */
	private String teRunned = "";

	private int tePoolSize = 0;

	private int teMaxPoolSize = 0;
	/** 运行实例数 */
	private long teRunning = 0;
	/** 排队实例数 */
	private long teQueuing = 0;
	/** 完成实例数 */
	private long teCompleted = 0;
	/** 暂停实例数 */
	private long teSuspended = 0;
	/** 中止实例数 */
	private long teTerminated = 0;
	/** 总吞吐量 */
	private long teThroughout = 0;
	/** 成功率 */
	private double teSuccessRate = 0;
	/** 注册时间 */
	private Date regDatetime = null;
	/** 最后更新 */
	private Date Lastupdate = null;

	private long cachedIds = 0;

	/**
	 * @return the serverDatetime
	 */
	public String getServerDatetime() {
		return serverDatetime;
	}

	/**
	 * @param serverDatetime
	 *            the serverDatetime to set
	 */
	public void setServerDatetime(String serverDatetime) {
		this.serverDatetime = serverDatetime;
	}

	/**
	 * @return the os
	 */
	public String getOs() {
		return os;
	}

	/**
	 * @param os
	 *            the os to set
	 */
	public void setOs(String os) {
		this.os = os;
	}

	/**
	 * @return the processors
	 */
	public String getProcessors() {
		return processors;
	}

	/**
	 * @param processors
	 *            the processors to set
	 */
	public void setProcessors(String processors) {
		this.processors = processors;
	}

	/**
	 * @return the totalPhysicalMemory
	 */
	public long getTotalPhysicalMemory() {
		return totalPhysicalMemory;
	}

	/**
	 * @param totalPhysicalMemory
	 *            the totalPhysicalMemory to set
	 */
	public void setTotalPhysicalMemory(long totalPhysicalMemory) {
		this.totalPhysicalMemory = totalPhysicalMemory;
	}

	/**
	 * @return the freePhysicalMemory
	 */
	public long getFreePhysicalMemory() {
		return freePhysicalMemory;
	}

	/**
	 * @param freePhysicalMemory
	 *            the freePhysicalMemory to set
	 */
	public void setFreePhysicalMemory(long freePhysicalMemory) {
		this.freePhysicalMemory = freePhysicalMemory;
	}

	/**
	 * @return the usedPhysicalMemory
	 */
	public long getUsedPhysicalMemory() {
		return usedPhysicalMemory;
	}

	/**
	 * @param usedPhysicalMemory
	 *            the usedPhysicalMemory to set
	 */
	public void setUsedPhysicalMemory(long usedPhysicalMemory) {
		this.usedPhysicalMemory = usedPhysicalMemory;
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
	 * @return the jdkName
	 */
	public String getJdkName() {
		return jdkName;
	}

	/**
	 * @param jdkName
	 *            the jdkName to set
	 */
	public void setJdkName(String jdkName) {
		this.jdkName = jdkName;
	}

	/**
	 * @return the totalJVMMemory
	 */
	public long getTotalJVMMemory() {
		return totalJVMMemory;
	}

	/**
	 * @param totalJVMMemory
	 *            the totalJVMMemory to set
	 */
	public void setTotalJVMMemory(long totalJVMMemory) {
		this.totalJVMMemory = totalJVMMemory;
	}

	/**
	 * @return the freeJVMMemory
	 */
	public long getFreeJVMMemory() {
		return freeJVMMemory;
	}

	/**
	 * @param freeJVMMemory
	 *            the freeJVMMemory to set
	 */
	public void setFreeJVMMemory(long freeJVMMemory) {
		this.freeJVMMemory = freeJVMMemory;
	}

	/**
	 * @return the maxJVMMemory
	 */
	public long getMaxJVMMemory() {
		return maxJVMMemory;
	}

	/**
	 * @param maxJVMMemory
	 *            the maxJVMMemory to set
	 */
	public void setMaxJVMMemory(long maxJVMMemory) {
		this.maxJVMMemory = maxJVMMemory;
	}

	/**
	 * @return the totalThreads
	 */
	public long getTotalThreads() {
		return totalThreads;
	}

	/**
	 * @param totalThreads
	 *            the totalThreads to set
	 */
	public void setTotalThreads(long totalThreads) {
		this.totalThreads = totalThreads;
	}

	/**
	 * @return the peakThreads
	 */
	public long getPeakThreads() {
		return peakThreads;
	}

	/**
	 * @param peakThreads
	 *            the peakThreads to set
	 */
	public void setPeakThreads(long peakThreads) {
		this.peakThreads = peakThreads;
	}

	/**
	 * @return the activeThreads
	 */
	public long getActiveThreads() {
		return activeThreads;
	}

	/**
	 * @param activeThreads
	 *            the activeThreads to set
	 */
	public void setActiveThreads(long activeThreads) {
		this.activeThreads = activeThreads;
	}

	/**
	 * @return the demonThreads
	 */
	public long getDemonThreads() {
		return demonThreads;
	}

	/**
	 * @param demonThreads
	 *            the demonThreads to set
	 */
	public void setDemonThreads(long demonThreads) {
		this.demonThreads = demonThreads;
	}

	/**
	 * @return the mwName
	 */
	public String getMwName() {
		return mwName;
	}

	/**
	 * @param mwName
	 *            the mwName to set
	 */
	public void setMwName(String mwName) {
		this.mwName = mwName;
	}

	/**
	 * @return the mwPort
	 */
	public String getMwPort() {
		return mwPort;
	}

	/**
	 * @param mwPort
	 *            the mwPort to set
	 */
	public void setMwPort(String mwPort) {
		this.mwPort = mwPort;
	}

	/**
	 * @return the mwParameters
	 */
	public String getMwParameters() {
		return mwParameters;
	}

	/**
	 * @param mwParameters
	 *            the mwParameters to set
	 */
	public void setMwParameters(String mwParameters) {
		this.mwParameters = mwParameters;
	}

	/**
	 * @return the peStatus
	 */
	public int getPeStatus() {
		return peStatus;
	}

	/**
	 * @param peStatus
	 *            the peStatus to set
	 */
	public void setPeStatus(int peStatus) {
		this.peStatus = peStatus;
	}

	/**
	 * @return the peRunned
	 */
	public String getPeRunned() {
		return peRunned;
	}

	/**
	 * @param peRunned
	 *            the peRunned to set
	 */
	public void setPeRunned(String peRunned) {
		this.peRunned = peRunned;
	}

	/**
	 * @return the peRestarted
	 */
	public int getPeRestarted() {
		return peRestarted;
	}

	/**
	 * @param peRestarted
	 *            the peRestarted to set
	 */
	public void setPeRestarted(int peRestarted) {
		this.peRestarted = peRestarted;
	}

	/**
	 * @return the peRunning
	 */
	public long getPeRunning() {
		return peRunning;
	}

	/**
	 * @param peRunning
	 *            the peRunning to set
	 */
	public void setPeRunning(long peRunning) {
		this.peRunning = peRunning;
	}

	/**
	 * @return the peQueuing
	 */
	public long getPeQueuing() {
		return peQueuing;
	}

	/**
	 * @param peQueuing
	 *            the peQueuing to set
	 */
	public void setPeQueuing(long peQueuing) {
		this.peQueuing = peQueuing;
	}

	/**
	 * @return the peCompleted
	 */
	public long getPeCompleted() {
		return peCompleted;
	}

	/**
	 * @param peCompleted
	 *            the peCompleted to set
	 */
	public void setPeCompleted(long peCompleted) {
		this.peCompleted = peCompleted;
	}

	/**
	 * @return the peSuspended
	 */
	public long getPeSuspended() {
		return peSuspended;
	}

	/**
	 * @param peSuspended
	 *            the peSuspended to set
	 */
	public void setPeSuspended(long peSuspended) {
		this.peSuspended = peSuspended;
	}

	/**
	 * @return the peTerminated
	 */
	public long getPeTerminated() {
		return peTerminated;
	}

	/**
	 * @param peTerminated
	 *            the peTerminated to set
	 */
	public void setPeTerminated(long peTerminated) {
		this.peTerminated = peTerminated;
	}

	/**
	 * @return the peThroughout
	 */
	public long getPeThroughout() {
		return peThroughout;
	}

	/**
	 * @param peThroughout
	 *            the peThroughout to set
	 */
	public void setPeThroughout(long peThroughout) {
		this.peThroughout = peThroughout;
	}

	/**
	 * @return the peSuccessRate
	 */
	public double getPeSuccessRate() {
		return peSuccessRate;
	}

	/**
	 * @param peSuccessRate
	 *            the peSuccessRate to set
	 */
	public void setPeSuccessRate(double peSuccessRate) {
		this.peSuccessRate = peSuccessRate;
	}

	/**
	 * @return the pePoolSize
	 */
	public int getPePoolSize() {
		return pePoolSize;
	}

	/**
	 * @param pePoolSize
	 *            the pePoolSize to set
	 */
	public void setPePoolSize(int pePoolSize) {
		this.pePoolSize = pePoolSize;
	}

	/**
	 * @return the peMaxPoolSize
	 */
	public int getPeMaxPoolSize() {
		return peMaxPoolSize;
	}

	/**
	 * @param peMaxPoolSize
	 *            the peMaxPoolSize to set
	 */
	public void setPeMaxPoolSize(int peMaxPoolSize) {
		this.peMaxPoolSize = peMaxPoolSize;
	}

	/**
	 * @return the teStatus
	 */
	public int getTeStatus() {
		return teStatus;
	}

	/**
	 * @param teStatus
	 *            the teStatus to set
	 */
	public void setTeStatus(int teStatus) {
		this.teStatus = teStatus;
	}

	/**
	 * @return the teRunned
	 */
	public String getTeRunned() {
		return teRunned;
	}

	/**
	 * @param teRunned
	 *            the teRunned to set
	 */
	public void setTeRunned(String teRunned) {
		this.teRunned = teRunned;
	}

	/**
	 * @return the tePoolSize
	 */
	public int getTePoolSize() {
		return tePoolSize;
	}

	/**
	 * @param tePoolSize
	 *            the tePoolSize to set
	 */
	public void setTePoolSize(int tePoolSize) {
		this.tePoolSize = tePoolSize;
	}

	/**
	 * @return the teMaxPoolSize
	 */
	public int getTeMaxPoolSize() {
		return teMaxPoolSize;
	}

	/**
	 * @param teMaxPoolSize
	 *            the teMaxPoolSize to set
	 */
	public void setTeMaxPoolSize(int teMaxPoolSize) {
		this.teMaxPoolSize = teMaxPoolSize;
	}

	/**
	 * @return the teRunning
	 */
	public long getTeRunning() {
		return teRunning;
	}

	/**
	 * @param teRunning
	 *            the teRunning to set
	 */
	public void setTeRunning(long teRunning) {
		this.teRunning = teRunning;
	}

	/**
	 * @return the teQueuing
	 */
	public long getTeQueuing() {
		return teQueuing;
	}

	/**
	 * @param teQueuing
	 *            the teQueuing to set
	 */
	public void setTeQueuing(long teQueuing) {
		this.teQueuing = teQueuing;
	}

	/**
	 * @return the teCompleted
	 */
	public long getTeCompleted() {
		return teCompleted;
	}

	/**
	 * @param teCompleted
	 *            the teCompleted to set
	 */
	public void setTeCompleted(long teCompleted) {
		this.teCompleted = teCompleted;
	}

	/**
	 * @return the teSuspended
	 */
	public long getTeSuspended() {
		return teSuspended;
	}

	/**
	 * @param teSuspended
	 *            the teSuspended to set
	 */
	public void setTeSuspended(long teSuspended) {
		this.teSuspended = teSuspended;
	}

	/**
	 * @return the teTerminated
	 */
	public long getTeTerminated() {
		return teTerminated;
	}

	/**
	 * @param teTerminated
	 *            the teTerminated to set
	 */
	public void setTeTerminated(long teTerminated) {
		this.teTerminated = teTerminated;
	}

	/**
	 * @return the teThroughout
	 */
	public long getTeThroughout() {
		return teThroughout;
	}

	/**
	 * @param teThroughout
	 *            the teThroughout to set
	 */
	public void setTeThroughout(long teThroughout) {
		this.teThroughout = teThroughout;
	}

	/**
	 * @return the teSuccessRate
	 */
	public double getTeSuccessRate() {
		return teSuccessRate;
	}

	/**
	 * @param teSuccessRate
	 *            the teSuccessRate to set
	 */
	public void setTeSuccessRate(double teSuccessRate) {
		this.teSuccessRate = teSuccessRate;
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
	 * @return the acceptable
	 */
	public int getAcceptable() {
		return acceptable;
	}

	/**
	 * @param acceptable
	 *            the acceptable to set
	 */
	public void setAcceptable(int acceptable) {
		this.acceptable = acceptable;
	}

	/**
	 * @return the regDatetime
	 */
	public Date getRegDatetime() {
		return regDatetime;
	}

	/**
	 * @param regDatetime
	 *            the regDatetime to set
	 */
	public void setRegDatetime(Date regDatetime) {
		this.regDatetime = regDatetime;
	}

	/**
	 * @return the lastupdate
	 */
	public Date getLastupdate() {
		return Lastupdate;
	}

	/**
	 * @param lastupdate
	 *            the lastupdate to set
	 */
	public void setLastupdate(Date lastupdate) {
		Lastupdate = lastupdate;
	}

	/**
	 * @return the cachedIds
	 */
	public long getCachedIds() {
		return cachedIds;
	}

	/**
	 * @param cachedIds
	 *            the cachedIds to set
	 */
	public void setCachedIds(long cachedIds) {
		this.cachedIds = cachedIds;
	}

}