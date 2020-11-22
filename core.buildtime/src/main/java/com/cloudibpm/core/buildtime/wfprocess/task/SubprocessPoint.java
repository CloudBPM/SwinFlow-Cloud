/**
 * 
 */
package com.cloudibpm.core.buildtime.wfprocess.task;

public class SubprocessPoint extends AbstractTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1278436507510567570L;
	/**
	 * 该属性描述该任务是否与子任务处于同步执行状态。 如果该任务是原子任务，则该属性不起任务作用。<br>
	 * 如果该任务是复合任务，即该任务是带有子过程的虚任务， 那么该任务的执行可能等待子过程执行完毕，才继续执行，<br>
	 * 即所谓的同步概念；如果该任务不等待子过程执行完毕返回就继续执行， 即所谓的异步概念。
	 */
	private boolean synchronised = true;
	private String subprocessId = null;
	private String subprocessName = null;
	private Assignment[] subprocessInputs = new Assignment[0];
	private Assignment[] subprocessOutputs = new Assignment[0];

	/**
	 * Constructor
	 */
	public SubprocessPoint() {
		setName("Subprocess Point");
		setClasstypename(this.getClass().getSimpleName());
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
		SubprocessPoint subprocessPoint = (SubprocessPoint) super.clone();
		return subprocessPoint;
	}

	/**
	 * Sets subprocess as a synchronised point. If <code>true</code>, it means
	 * that the invoker process must wait completion of the subprocess to
	 * execute next step on the execution path once the subprocess is initiated
	 * and started at this point. Other wise, <code>false</code> means that the
	 * invoker process need not wait wait completion of the subprocess and
	 * execute continuously.
	 * 
	 * @date 20/10/2011 10:49:11 AM
	 * @param synchronised
	 */
	public void setSynchronised(boolean synchronised) {
		this.synchronised = synchronised;
	}

	/**
	 * Gets whether current point is a synchronised point. If <code>true</code>,
	 * it means that the invoker process must wait completion of the subprocess
	 * to execute next step on the execution path once the subprocess is
	 * initiated and started at this point. Other wise, <code>false</code> means
	 * that the invoker process need not wait wait completion of the subprocess
	 * and execute continuously.
	 * 
	 * @date 20/10/2011 10:56:09 AM
	 * @return
	 */
	public boolean isSynchronised() {
		return synchronised;
	}

	/**
	 * Gets input assignment list. The input assignment means that invoker
	 * process assigns its one or more variables to invoked process's variables
	 * with same type.
	 * 
	 * @author Dahai Cao
	 * @date 21/10/2011 2:36:24 PM; last updated at 17:27 on 2018-09-08
	 * @return
	 */
	public Assignment[] fetchInputAssignments() {
		return subprocessInputs;
	}

	/**
	 * Gets output assignment list. The output assignment means that one or more
	 * invoker process's variables are assigned to evaluate the completed
	 * invoked process's variable results.
	 * 
	 * @author Dahai Cao
	 * @date 21/10/2011 2:36:28 PM; last updated at 17:27 on 2018-09-08
	 * @return
	 */
	public Assignment[] fetchOutputAssignments() {
		return subprocessOutputs;
	}

	/**
	 * Gets whether there is input assignment to the specified subprocess. The
	 * input assignment means that invoker process assigns its one or more
	 * variables to invoked process's variables with same type.
	 * 
	 * @author Dahai Cao
	 * @date 24/10/2011 3:56:42 PM; last updated at 17:27 on 2018-09-08
	 * @return
	 */
	public boolean hasInputAssignments() {
		if (subprocessInputs != null) {
			return subprocessInputs.length > 0;
		}
		return false;
	}

	/**
	 * Gets whether there is output assignment to the specified subprocess. The
	 * output assignment means that one or more invoker process's variables are
	 * assigned to evaluate the completed invoked process's variable results.
	 * 
	 * @date 24/10/2011 3:56:45 PM
	 * @return
	 */
	public boolean hasOutputAssignments() {
		if (subprocessOutputs != null) {
			return subprocessOutputs.length > 0;
		}
		return false;
	}

	/**
	 * @return the subprocessId
	 */
	public String getSubprocessId() {
		return subprocessId;
	}

	/**
	 * @param subprocessId
	 *            the subprocessId to set
	 */
	public void setSubprocessId(String subprocessId) {
		this.subprocessId = subprocessId;
	}

	/**
	 * @return the subprocessName
	 */
	public String getSubprocessName() {
		return subprocessName;
	}

	/**
	 * @param subprocessName
	 *            the subprocessName to set
	 */
	public void setSubprocessName(String subprocessName) {
		this.subprocessName = subprocessName;
	}

	/**
	 * @return the subprocessInputs
	 */
	public Assignment[] getSubprocessInputs() {
		return subprocessInputs;
	}

	/**
	 * @param subprocessInputs
	 *            the subprocessInputs to set
	 */
	public void setSubprocessInputs(Assignment[] subprocessInputs) {
		this.subprocessInputs = subprocessInputs;
	}

	/**
	 * @return the subprocessOutputs
	 */
	public Assignment[] getSubprocessOutputs() {
		return subprocessOutputs;
	}

	/**
	 * @param subprocessOutputs
	 *            the subprocessOutputs to set
	 */
	public void setSubprocessOutputs(Assignment[] subprocessOutputs) {
		this.subprocessOutputs = subprocessOutputs;
	}
}
