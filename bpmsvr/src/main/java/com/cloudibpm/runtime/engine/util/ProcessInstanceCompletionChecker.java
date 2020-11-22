/**
 * 
 */
package com.cloudibpm.runtime.engine.util;

import java.io.Serializable;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.wfprocess.WfProcessStatus;
import com.cloudibpm.core.buildtime.wfprocess.task.SubprocessPoint;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SubprocessPointInstance;
import com.cloudibpm.runtime.engine.PEngine;

/**
 * @author Dahai Cao last updated on 20180228
 */
public class ProcessInstanceCompletionChecker implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 801051297869302027L;
	private static final ProcessInstanceCompletionChecker instance = new ProcessInstanceCompletionChecker();

	public static ProcessInstanceCompletionChecker getInstance() {
		return instance;
	}

	/**
	 * 
	 */
	private ProcessInstanceCompletionChecker() {
	}

	/**
	 * Returns whether current process completed. If current process is a
	 * subprocess,it only check whether its all tasks completed; if this process
	 * is a main process, it does not only check whether its all tasks
	 * completed, but also check whether its all subprocesses completed.
	 * 
	 * @param pengine
	 *            PEngine
	 * @return
	 * @throws InterruptedException
	 */
	public boolean isAllCompleted(PEngine pengine) throws InterruptedException {
		if (pengine.getInstance().getParent() != null) {
			// if this process is a subprocess, it only check whether its all
			// tasks completed.
			return isCurrentProcessCompleted(pengine);
		} else {
			// if this process is a main process, it does not only check whether
			// its all tasks completed, but also check whether its all
			// subprocesses completed.
			return isAllSubprocessesCompleted(pengine);
		}
	}

	/**
	 * Main process check whether its all subprocesses and tasks completed.
	 * 
	 * @param pengine
	 *            PEngine
	 * @return
	 * @throws InterruptedException
	 */
	private boolean isAllSubprocessesCompleted(PEngine pengine) throws InterruptedException {
		if (isCurrentProcessCompleted(pengine)) {
			for (TreeNode child : pengine.getInstance().getChildren()) {
				if (child instanceof SubprocessPoint && ((SubprocessPointInstance) child).hasSubprocess()) {
					WfProcessInstance subprocess = ((SubprocessPointInstance) child).fetchSubprocess();
					if (subprocess != null && !isSubprocessesCompleted(subprocess)) {
						return false;
					}
				}
			}
		} else
			return false;
		return true;
	}

	/**
	 * This method is called iteratively for checking whether its all
	 * subprocesses completed.
	 * 
	 * @param processInstance
	 * @return
	 * @throws InterruptedException
	 */
	private boolean isSubprocessesCompleted(WfProcessInstance processInstance) throws InterruptedException {
		if (processInstance.getStatus() == WfProcessStatus.COMPLETED) {
			for (TreeNode child : processInstance.getChildren()) {
				if (child instanceof SubprocessPoint && ((SubprocessPointInstance) child).hasSubprocess()) {
					WfProcessInstance subprocess = ((SubprocessPointInstance) child).fetchSubprocess();
					if (subprocess != null && !isSubprocessesCompleted(subprocess)) {
						return false;
					}
				}
			}
		} else
			return false;
		return true;
	}

	/**
	 * Returns whether the current process completed.
	 * 
	 * @param pengine
	 *            PEngine
	 * @return
	 * @throws InterruptedException
	 */
	public boolean isCurrentProcessCompleted(PEngine engine) throws InterruptedException {
		return engine.getTaskQueues().isEmpty();
	}

}
