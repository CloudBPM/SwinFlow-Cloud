/**
 * 
 */
package com.cloudibpm.core.buildtime.wfprocess.task;

public class AssignTask extends AbstractTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1169735870679318921L;
	private Assignment[] assignments = new Assignment[0];

	/**
	 * 
	 */
	public AssignTask() {
		setName("Assign Task");
		setClasstypename(this.getClass().getSimpleName());
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
		AssignTask assignTask = (AssignTask) super.clone();
		return assignTask;
	}

	/**
	 * @return the assignments
	 */
	public Assignment[] getAssignments() {
		return assignments;
	}

	/**
	 * @param assignments
	 *            the assignments to set
	 */
	public void setAssignments(Assignment[] assignments) {
		this.assignments = assignments;
	}
}
