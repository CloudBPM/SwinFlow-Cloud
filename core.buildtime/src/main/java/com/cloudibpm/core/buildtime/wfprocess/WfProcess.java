package com.cloudibpm.core.buildtime.wfprocess;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.folder.Folder;

/**
 * 该类描述的是SaaS应用程序过程
 *
 * @author Dahai Cao
 */
public class WfProcess extends TreeNode {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8227738753369057249L;
    // 过程版本号，
    // this property is used to identify the process instance version
    private long ver = -1; // it will be used in future.
    // build time properties
    private String code;
    // 0 : '内部（绝密）',1 : '内部（机密）',2 : '内部（秘密）',
    // 3 : '内部（不公开）',4 : '内部（公开）',5 : '外部（公开）',
    private int accessLevel = 0;
    // 业务过程类型
    // Note: process type means the business categories of this process
    // workflow type means the enactment categories of this process
    // different workflow will be performed by different ways on
    // workflow enactment services.
    // 0 : '办公自动化',1 : '费用审批',2 : '金融审批',
    // 3 : '保险审批',4 : '行政许可审批',5 : '财务审批',
    // 6 :'合同审批',7 : '系统集成',8 : '其他',
    private int processType = 0;
    // 参与者应用类型
    // 0: automatic workflow (no participant)
    // 1: single participant workflow
    // 2: multiple participant workflow
    // 0 : 无人参与自动工作流;1 : 单人参与工作流;2 : 多人参与工作流;
    private int workflowType = ParticipationType.NO_PARTICIPANT_APP;
    // 过程说明
    private String description;
    private String keywords = null;
    // 应用创建人姓名
    // process creator。
    private String authorId;
    private String author;
    // this property support team work for process modeling
    // 0:unlocked ;1:locked
    private int status = 0;
    private long lastupdate = -1;
    private double purchasePrice = 0.0d;
    private double usagePrice = 0.0d;
    private String processContent = null;

    /**
     * Constructor
     */
    public WfProcess() {
        super();
    }

    /**
     * Get the version of the process instance
     *
     * @return
     */
    public long getVer() {
        return ver;
    }

    /**
     * Set the version of process instance
     *
     * @param ver
     */
    public void setVer(long ver) {
        this.ver = ver;
    }

    /**
     * Constructor
     *
     * @param id
     */
    public WfProcess(String id) {
        this();
        setId(id);
        setName("");
    }

    public int compareTo(TreeNode o) {
        if (o instanceof Folder) {
            return 1;
        } else {
            return this.getName().compareTo(((WorkflowEntity) o).getName());
        }
    }

    /**
     * Returns the code of business process for get the same processes of
     * different versions.
     */
    public String getCode() {
        return this.code;
    }

    /**
     * Sets the code of business process for get the same processes of different
     * versions.
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * Sets last update date time of the instantiated business process. The
     * format of the time is MM/DD/YYYY.
     *
     * @param lastupdate
     */
    public void setLastupdate(long lastupdate) {
        this.lastupdate = lastupdate;
    }

    /**
     * Return last update date time of the instantiated business process.The
     * format of the time is MM/DD/YYYY.
     *
     * @return lastupdate
     */
    public long getLastupdate() {
        return lastupdate;
    }


//
//	/**
//	 * @author Dahai CAO
//	 * @date 20/06/2011 12:44:39 PM
//	 * @return
//	 */
//	public boolean hasVariables() {
//		TreeNode[] nodes = this.getChildren();
//		for (int i = 0; i < nodes.length; i++)
//			if (nodes[i] instanceof DataVariable)
//				return true;
//		return false;
//	}
//
//	/**
//	 * @author Dahai CAO
//	 * @date 30/06/2011 3:26:43 PM
//	 * @return
//	 */
//	public DataVariable[] getProcessVariables() {
//		List<DataVariable> components = new ArrayList<DataVariable>();
//		for (TreeNode child : this.getChildren()) {
//			if (child instanceof DataVariable)
//				components.add((DataVariable) child);
//		}
//		return components.toArray(new DataVariable[components.size()]);
//	}
//
//	/**
//	 * @author Dahai CAO
//	 * @date 30/02/2012 3:26:43 PM
//	 * @return
//	 */
//	public AbstractTask[] getAllTasks() {
//		List<AbstractTask> tasks = new ArrayList<AbstractTask>();
//		for (TreeNode child : this.getChildren()) {
//			if (child instanceof AbstractTask)
//				tasks.add((AbstractTask) child);
//		}
//		return tasks.toArray(new AbstractTask[tasks.size()]);
//	}

    public int getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(int accessLevel) {
        this.accessLevel = accessLevel;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }


    public int getProcessType() {
        return processType;
    }

    public void setProcessType(int processType) {
        this.processType = processType;
    }

    /**
     * @return the workflowType
     */
    public int getWorkflowType() {
        return workflowType;
    }

    /**
     * @param workflowType the workflowType to set
     */
    public void setWorkflowType(int workflowType) {
        this.workflowType = workflowType;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the purchasePrice
     */
    public double getPurchasePrice() {
        return purchasePrice;
    }

    /**
     * @param purchasePrice the purchasePrice to set
     */
    public void setPurchasePrice(double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    /**
     * @return the usagePrice
     */
    public double getUsagePrice() {
        return usagePrice;
    }

    /**
     * @param usagePrice the usagePrice to set
     */
    public void setUsagePrice(double usagePrice) {
        this.usagePrice = usagePrice;
    }

    public String toString() {
        return getName();
    }

    //	/**
//	 * Sets status of business process. The statuses include at build time:
//	 * {@link WfProcessStatus#LOCKED}, {@link WfProcessStatus#UNLOCKED},
//	 * {@link WfProcessStatus#RELEASED} and in runtime:
//	 * {@link WfProcessStatus#LAUNCHED},{@link WfProcessStatus#RUNNING} ,
//	 * {@link WfProcessStatus#SUSPENDED},{@link WfProcessStatus#TERMINATED},
//	 * {@link WfProcessStatus#COMPLETED}.
//	 * 
//	 * @param status
//	 */
    public void setStatus(int status) {
        this.status = status;
//		if (status == COMPLETED) {
//			this.notify();
//		}
    }
//
//	public synchronized boolean hasCompleted() throws InterruptedException {
//		if (getStatus() != COMPLETED) {
//			this.wait();
//		}
//		this.notify();
//		return true;
//	}

    /**
     * Returns status of business process. The statuses include at build time:
     * {@link WfProcessStatus#LOCKED}, {@link WfProcessStatus#UNLOCKED},
     * {@link WfProcessStatus#RELEASED} and in runtime:
     * {@link WfProcessStatus#LAUNCHED},{@link WfProcessStatus#RUNNING} ,
     * {@link WfProcessStatus#SUSPENDED},{@link WfProcessStatus#TERMINATED},
     * {@link WfProcessStatus#COMPLETED}.
     *
     * @return
     */
    public int getStatus() {
        return this.status;
    }

//	public String toNameWithStatus() {
//		String displayName = "";
//		if (this.getStatus() == LOCKED || this.getStatus() == UNLOCKED) {
//			displayName = this.getName();
//		} else if (this.getStatus() == RELEASED) {
//			displayName = this.getName();
//		} else if (this.getStatus() == LAUNCHED) {
//			displayName = this.getName() + " [Launched]";
//		} else if (this.getStatus() == RUNNING) {
//			displayName = this.getName() + " [Running]";
//		} else if (this.getStatus() == SUSPENDED) {
//			displayName = this.getName() + " [Suspended]";
//		} else if (this.getStatus() == TERMINATED) {
//			displayName = this.getName() + " [Terminated]";
//		} else if (this.getStatus() == COMPLETED) {
//			displayName = this.getName() + " [Completed]";
//		}
//		return displayName;
//	}

//	/**
//	 * @author Dahai CAO
//	 * @date 2011-9-21 下午01:47:03
//	 * @return
//	 */
//	public String getStatusName() {
//		if (getStatus() == UNLOCKED) {
//			return "Unlocked";
//		} else if (getStatus() == LOCKED) {
//			return "Locked";
//		} else if (getStatus() == RELEASED) {
//			return "Released";
//		} else if (getStatus() == LAUNCHED) {
//			return "Launched";
//		} else if (getStatus() == RUNNING) {
//			return "Running";
//		} else if (getStatus() == SUSPENDED) {
//			return "Suspended";
//		} else if (getStatus() == TERMINATED) {
//			return "Terminated";
//		} else if (getStatus() == COMPLETED) {
//			return "Completed";
//		}
//		return "Default";
//	}

    /**
     * @return the processContent
     */
    public String getProcessContent() {
        return processContent;
    }

    /**
     * @param processContent the processContent to set
     */
    public void setProcessContent(String processContent) {
        this.processContent = processContent;
    }


    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

}