/**
 * 
 */
function ServerInfoDescriptor() {
	this.id = "Server ID 000";
	this.name = "My Server";
	this.classtypename = "ServerInfoDescriptor";
	this.status = 0; //
	this.serverDatetime = "";
	/** 操作系统，包括版本. */
	this.os = "";
	/** 处理器，2核，4核，8核CPU. */
	this.processors = "";
	/** 当前正在使用的（总的）物理内存. */
	this.totalPhysicalMemory = "";
	/** 剩余的物理内存. */
	this.freePhysicalMemory = "";
	/** 已使用的物理内存. */
	this.usedPhysicalMemory = "";
	this.ipv4 = "";
	this.ipv6 = null;
	/** 是否可以接收新的请求，0：不可以；1：可以。 */
	this.acceptable = 0;
	/** Java虚拟机包括版本. */
	this.jdkName = "";
	/** 总共虚拟机内存. */
	this.totalJVMMemory = 0;
	/** 剩余虚拟机内存. */
	this.freeJVMMemory = 0;
	/** 最大可使用内存. */
	this.maxJVMMemory = 0;
	/** 总共线程数 */
	this.totalThreads = 0;
	/** 峰值线程数 */
	this.peakThreads = 0;
	/** 活动线程数 */
	this.activeThreads = 0;
	/** 守护线程数 */
	this.demonThreads = 0;
	/** 中间件名 */
	this.mwName = "";
	/** 中间件访问端口 */
	this.mwPort = "";
	/** 启动参数 */
	this.mwParameters = "";
	/** 流程执行服务状态， 0：停止；1：运行；2：暂停； */
	this.peStatus = 0;
	/** 已经运行时间 */
	this.peRunned = "";
	/** 重启次数 */
	this.peRestarted = 0;
	this.pePoolSize = 0;
	this.peMaxPoolSize = 0;
	/** 运行实例数 */
	this.peRunning = 0;
	/** 排队实例数 */
	this.peQueuing = 0;
	/** 完成实例数 */
	this.peCompleted = 0;
	/** 暂停实例数 */
	this.peSuspended = 0;
	/** 中止实例数 */
	this.peTerminated = 0;
	/** 总吞吐量 */
	this.peThroughout = 0;
	/** 成功率 */
	this.peSuccessRate = 0;
	/** 事务执行服务状态， 0：停止；1：运行；2：暂停； */
	this.teStatus = 0;
	/** 已经运行时间 */
	this.teRunned = "";
	this.tePoolSize = 0;
	this.teMaxPoolSize = 0;
	/** 运行实例数 */
	this.teRunning = 0;
	/** 排队实例数 */
	this.teQueuing = 0;
	/** 完成实例数 */
	this.teCompleted = 0;
	/** 暂停实例数 */
	this.teSuspended = 0;
	/** 中止实例数 */
	this.teTerminated = 0;
	/** 总吞吐量 */
	this.teThroughout = 0;
	/** 成功率 */
	this.teSuccessRate = 0;
	/** 注册时间 */
	this.regDatetime = null;
	/** 最后更新 */
	this.Lastupdate = null;

};

ServerInfoDescriptor.prototype.parseFromJSON = function(obj) {
	this.id = obj.id;
	this.name = obj.name;
	this.status = obj.status; //
	this.serverDatetime = obj.serverDatetime;
	this.os = obj.os;
	this.processors = obj.processors;
	this.totalPhysicalMemory = obj.totalPhysicalMemory;
	this.freePhysicalMemory = obj.freePhysicalMemory;
	this.usedPhysicalMemory = obj.usedPhysicalMemory;
	this.ipv4 = obj.ipv4;
	this.ipv6 = obj.ipv6;
	this.acceptable = obj.acceptable;
	this.jdkName = obj.jdkName;
	this.totalJVMMemory = obj.totalJVMMemory;
	this.freeJVMMemory = obj.freeJVMMemory;
	this.maxJVMMemory = obj.maxJVMMemory;
	this.totalThreads = obj.totalThreads;
	this.peakThreads = obj.peakThreads;
	this.activeThreads = obj.activeThreads;
	this.demonThreads = obj.demonThreads;
	this.mwName = obj.mwName;
	this.mwPort = obj.mwPort;
	this.mwParameters = obj.mwParameters;
	this.peStatus = obj.peStatus;
	this.peRunned = obj.peRunned;
	this.peRestarted = obj.peRestarted;
	this.pePoolSize = obj.pePoolSize;
	this.peMaxPoolSize = obj.peMaxPoolSize;
	this.peRunning = obj.peRunning;
	this.peQueuing = obj.peQueuing;
	this.peCompleted = obj.peCompleted;
	this.peSuspended = obj.peSuspended;
	this.peTerminated = obj.peTerminated;
	this.peThroughout = obj.peThroughout;
	this.peSuccessRate = obj.peSuccessRate;
	this.teStatus = obj.teStatus;
	this.teRunned = obj.teRunned;
	this.tePoolSize = obj.tePoolSize;
	this.teMaxPoolSize = obj.teMaxPoolSize;
	this.teRunning = obj.teRunning;
	this.teQueuing = obj.teQueuing;
	this.teCompleted = obj.teCompleted;
	this.teSuspended = obj.teSuspended;
	this.teTerminated = obj.teTerminated;
	this.teThroughout = obj.teThroughout;
	this.teSuccessRate = obj.teSuccessRate;
	if (obj.regDatetime != null)
		this.regDatetime = Utils.getDateTime(obj.regDatetime);
	if (obj.lastupdate != null)
		this.Lastupdate = Utils.getDateTime(obj.lastupdate);
};
