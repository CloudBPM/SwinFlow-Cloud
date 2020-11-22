package com.cloudibpm.core.buildtime.wfprocess.task;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.wfprocess.Transition;

import java.util.Arrays;
import java.util.Collections;

/**
 * This is abstract task which is used as parent class all other task class.
 * 
 * @author Dahai Cao created 2008-08-01 
 */
public class AbstractTask extends TreeNode implements TaskStatus {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1405617949682070015L;

	private double x0 = 0;
	private double y0 = 0;
	private double x1 = 0;
	private double y1 = 0;
	private int isParallelInput = 0;
	private int isParallelOutput = 0;

	private int status = DEFAULT;
	private long lastupdate;
	private Transition[] outputs = new Transition[0];
	private Transition[] inputs = new Transition[0];
	private String classtypename = "AbstractTask";
	private String description = null;

	/**
	 * Constructor
	 */
	public AbstractTask() {
		super();
		setClasstypename(this.getClass().getSimpleName());
		this.setLastupdate(System.currentTimeMillis());
	}

	/**
	 * Construct this task with a unique ID(Primary key).
	 * 
	 * @param id
	 *            String
	 */
	public AbstractTask(String id) {
		super(id);
		setClasstypename(this.getClass().getSimpleName());
		this.setLastupdate(System.currentTimeMillis());
	}

	/**
	 * Add a new input transition to this task. It will be denoted as a target
	 * task of the input transition.
	 */
	public void addInput(Transition transition) {
		int oldCapacity = this.inputs.length;
		this.inputs = Arrays.copyOf(this.inputs, oldCapacity + 1);
		this.inputs[oldCapacity++] = transition;
		Collections.sort(Arrays.asList(this.inputs));
	}

	/**
	 * Add a new output transition to this task. It will be denoted as a source
	 * task of the output transition.
	 */
	public void addOutput(Transition transition) {
		int oldCapacity = this.outputs.length;
		this.outputs = Arrays.copyOf(this.outputs, oldCapacity + 1);
		this.outputs[oldCapacity++] = transition;
		Collections.sort(Arrays.asList(this.outputs));
	}

	public double getX0() {
		return x0;
	}

	public void setX0(double x0) {
		this.x0 = x0;
	}

	public double getY0() {
		return y0;
	}

	public void setY0(double y0) {
		this.y0 = y0;
	}

	public double getX1() {
		return x1;
	}

	public void setX1(double x1) {
		this.x1 = x1;
	}

	public double getY1() {
		return y1;
	}

	public void setY1(double y1) {
		this.y1 = y1;
	}

	/**
	 * @return the isParallellInput
	 */
	public int getIsParallelInput() {
		return isParallelInput;
	}

	/**
	 * @param isParallelInput
	 *            the isParallelInput to set
	 */
	public void setIsParallelInput(int isParallelInput) {
		this.isParallelInput = isParallelInput;
	}

	/**
	 * @return the isParallelOutput
	 */
	public int getIsParallelOutput() {
		return isParallelOutput;
	}

	/**
	 * @param isParallelOutput
	 *            the isParallelOutput to set
	 */
	public void setIsParallelOutput(int isParallelOutput) {
		this.isParallelOutput = isParallelOutput;
	}

	public boolean hasInputs() {
		return this.inputs.length > 0;
	}

	public boolean hasOutputs() {
		return this.outputs.length > 0;
	}

	/**
	 * Return list of all input transitions. The element of list is
	 * {@link Transition}
	 * 
	 * @return List<Transition>
	 */
	public Transition[] getInputs() {
		return this.inputs;
	}

	public void setInputs(Transition[] inputs) {
		this.inputs = inputs;
	}

	/**
	 * Return list of all output transitions. The element of list is
	 * {@link Transition}
	 * 
	 * @return List<Transition>
	 */
	public Transition[] getOutputs() {
		return this.outputs;
	}

	public void setOutputs(Transition[] outputs) {
		this.outputs = outputs;
	}

	/**
	 * Remove the input transition that is specified at parameters.
	 * 
	 * @param transition
	 *            Transition
	 */
	public void removeInput(Transition transition) {
		if (transition == null) {
			for (int index = 0; index < this.inputs.length; index++)
				if (this.inputs[index] == null) {
					fastRemove(index, this.inputs);
				}
		} else {
			for (int index = 0; index < this.inputs.length; index++)
				if (transition.equals(this.inputs[index])) {
					fastRemove(index, this.inputs);
				}
		}
	}

	public void removeAllInputs() {
		this.inputs = new Transition[0];
	}

	/**
	 * Return the output transition that is specified at parameters.
	 * 
	 * @param transition
	 *            Transition
	 */
	public void removeOutput(Transition transition) {
		if (transition == null) {
			for (int index = 0; index < this.outputs.length; index++)
				if (this.outputs[index] == null) {
					fastRemove(index, this.outputs);
				}
		} else {
			for (int index = 0; index < this.outputs.length; index++)
				if (transition.equals(this.outputs[index])) {
					fastRemove(index, this.outputs);
				}
		}
	}

	/**
	 * Private remove method that skips bounds checking and does not return the
	 * value removed.
	 */
	private void fastRemove(int index, Transition[] list) {
		int numMoved = list.length - index - 1;
		if (numMoved > 0)
			System.arraycopy(list, index + 1, list, index, numMoved);
		list[list.length - 1] = null; // Let gc do its work
		list = Arrays.copyOf(list, list.length - 1);
	}

	public void removeAllOutputs() {
		this.outputs = new Transition[0];
	}

	/**
	 * Sets the last update date time. This is a time stamp of task execution.
	 * 
	 * @param lastupdate
	 *            Date
	 */
	public void setLastupdate(long lastupdate) {
		this.lastupdate = lastupdate;
	}

	/**
	 * Returns the last update date time. This is a time stamp of task
	 * execution.
	 * 
	 * @return Date
	 */
	public long getLastupdate() {
		return lastupdate;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description
	 *            the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	public String toString() {
		return getName();
	}

	/**
	 * @author Dahai CAO
	 * @date 31/03/2011 11:20:05 AM
	 * @param o
	 * @return
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	@Override
	public int compareTo(TreeNode o) {
		return 0;
	}

	/**
	 * @return the classtypename
	 */
	public String getClasstypename() {
		return classtypename;
	}

	/**
	 * @param classtypename
	 *            the classtypename to set
	 */
	public void setClasstypename(String classtypename) {
		this.classtypename = classtypename;
	}

	/**
	 * Sets the status of task, these status include {@link TaskStatus#DEFAULT},
	 * {@link TaskStatus#ENABLED} {@link TaskStatus#RUNNING},
	 * {@link TaskStatus#COMPLETED}, {@link TaskStatus#EXCEPTION},
	 * {@link TaskStatus#SKIPPED}, {@link TaskStatus#TERMINATED},
	 * {@link TaskStatus#UNUSED}.
	 * 
	 * @param status
	 *            int
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	/**
	 * Return the status of task, these status include
	 * {@link TaskStatus#DEFAULT}, {@link TaskStatus#ENABLED}
	 * {@link TaskStatus#RUNNING}, {@link TaskStatus#COMPLETED},
	 * {@link TaskStatus#EXCEPTION}, {@link TaskStatus#SKIPPED},
	 * {@link TaskStatus#TERMINATED}, {@link TaskStatus#UNUSED}.
	 * 
	 * @return int
	 */
	public int getStatus() {
		return this.status;
	}

	/**
	 * Gets task status name.
	 * 
	 * @author Dahai CAO
	 * @date 2011-9-30 下午10:30:04
	 * @return
	 */
	public String getStatusName() {
		if (status == DEFAULT)
			return "Default"; //$NON-NLS-1$
		else if (status == ENABLED)
			return "Enabled"; //$NON-NLS-1$
		else if (status == RUNNING)
			return "Running"; //$NON-NLS-1$
		else if (status == COMPLETED)
			return "Completed"; //$NON-NLS-1$
		else if (status == UNUSED)
			return "Unused"; //$NON-NLS-1$
		else if (status == TERMINATED)
			return "Terminated"; //$NON-NLS-1$
		else if (status == EXCEPTION)
			return "Exception"; //$NON-NLS-1$
		else if (status == SKIPPED)
			return "Skipped"; //$NON-NLS-1$
		return null;
	}
}