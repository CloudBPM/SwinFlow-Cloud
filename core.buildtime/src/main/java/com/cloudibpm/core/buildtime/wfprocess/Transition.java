package com.cloudibpm.core.buildtime.wfprocess;

import com.cloudibpm.core.Location;
import com.cloudibpm.core.WorkflowEntity;

/**
 * @author CAODAHAI
 * @version 3.0.0
 */
public class Transition extends WorkflowEntity implements Comparable<Transition>, TransitionStatus {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1678998639477366522L;

	private int orderNumber;
	private Object source;
	private Object target;
	private Object navigationRule;
	private int status;
	private boolean alwaysTrue = true;
	// bending 点位置
	private Location bendPoint = null;
	private String description = null;

	/**
	 * Constructor
	 * 
	 * @param id
	 *            String
	 */
	public Transition(String id) {
		super(id);
		this.setName("a");
	}

	/**
	 * Constructor
	 */
	public Transition() {
		super();
		this.setName("a");
	}

	/**
	 * Clone Transition
	 */
	@Override
	public Object clone() throws CloneNotSupportedException {
		return null;
	}

	/**
	 * Returns the order number for this transition. This number cannot be set
	 * manually and must be set by system automatically. Workflow engine will
	 * select a number according to this number after the source task
	 * completing.
	 * 
	 * @return int
	 */
	public int getOrderNumber() {
		return this.orderNumber;
	}

	/**
	 * Sets the order number for this transition. This number cannot be set
	 * manually and must be set by system automatically. Workflow engine will
	 * select a number according to this number after the source task
	 * completing.
	 * 
	 * @param number
	 *            int
	 */
	public void setOrderNumber(int number) {
		this.orderNumber = number;
	}

	/**
	 * Sets source task where this transition arrow is from.
	 * 
	 * @param source
	 *            Task
	 */
	public void setSource(Object source) {
		this.source = source;
	}

	/**
	 * Sets target task where this transition arrow aims to.
	 * 
	 * @param target
	 *            Task
	 */
	public void setTarget(Object target) {
		this.target = target;
	}

	/**
	 * Returns target task where this transition arrow aims to.
	 * 
	 * @return Task
	 */
	public Object getTarget() {
		return this.target;
	}

	/**
	 * Returns source task where this transition arrow is from.
	 * 
	 * @return Task
	 */
	public Object getSource() {
		return this.source;
	}

	/**
	 * Set navigation rule. This rule control that whether the target task will
	 * be executed. If the value of rule is <tt>true</tt>, the task will be
	 * executed; otherwise, it will be not executed.
	 * 
	 * @param rule
	 *            Rule
	 */
	public void setNavigationRule(Object navigationRule) {
		this.navigationRule = navigationRule;
	}

	/**
	 * Returns navigation rule. This rule control that whether the target task
	 * will be executed. If the value of rule is <tt>true</tt>, the task will be
	 * executed; otherwise, it will be not executed.
	 */
	public Object getNavigationRule() {
		return this.navigationRule;
	}

	/**
	 * Returns whether this transition is always true. If this transition is
	 * always <tt>TRUE</tt>, navigation rule will be no use. And once system
	 * checks such transition, it will execute through this path.
	 * 
	 * @author Dahai CAO
	 * @date 19/05/2011 11:22:22 AM
	 * @return
	 * @see com.cloudibpm.core.buildtime.wfprocess.Transition#isAlwaysTrue()
	 */
	public boolean isAlwaysTrue() {
		return this.alwaysTrue;
	}

	/**
	 * Sets this transition is always true or not. If setting <tt>TRUE</tt>,
	 * navigation rule will be no use. And once system checks such transition,
	 * it will execute through this path. Otherwise, system will check its
	 * navigation rule.
	 * 
	 * @author Dahai CAO
	 * @date 19/05/2011 11:22:22 AM
	 * @param alwaysTrue
	 * @see com.cloudibpm.core.buildtime.wfprocess.Transition#setAlwaysTrue(boolean)
	 */
	public void setAlwaysTrue(boolean alwaysTrue) {
		this.alwaysTrue = alwaysTrue;
	}

	/**
	 * @return the bendPoint
	 */
	public Location getBendPoint() {
		return bendPoint;
	}

	/**
	 * @param bendPoint
	 *            the bendPoint to set
	 */
	public void setBendPoint(Location bendPoint) {
		this.bendPoint = bendPoint;
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

	@Override
	public int compareTo(Transition o) {
		return this.getOrderNumber() - o.getOrderNumber();
	}

	/**
	 * Return status of this transition. the status describes all the status of
	 * transition during business process instance execution. These status
	 * include, {@link TransitionStatus#DEFAULT},
	 * {@link TransitionStatus#ENABLED}, {@link TransitionStatus#DEFAULT},
	 * {@link TransitionStatus#COMPLETED}, {@link TransitionStatus#EXCEPTION},
	 * {@link TransitionStatus#UNUSED}.
	 * 
	 * @return int
	 */
	public int getStatus() {
		int status = this.status;
		return status;
	}

	/**
	 * Sets status of this transition. the status describes all the status of
	 * transition during business process instance execution. These status
	 * include, {@link TransitionStatus#DEFAULT},
	 * {@link TransitionStatus#ENABLED}, {@link TransitionStatus#DEFAULT},
	 * {@link TransitionStatus#COMPLETED}, {@link TransitionStatus#EXCEPTION},
	 * {@link TransitionStatus#UNUSED}.
	 * 
	 * @param status
	 *            int
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	/**
	 * @author Dahai CAO
	 * @date 2011-9-30 下午10:29:43
	 * @return
	 * @see com.cloudibpm.core.buildtime.wfprocess.Transition#getStatusName()
	 */
	public String getStatusName() {
		if (status == DEFAULT)
			return "Default"; //$NON-NLS-1$
		else if (status == ENABLED)
			return "Enabled"; //$NON-NLS-1$
		else if (status == COMPLETED)
			return "Completed"; //$NON-NLS-1$
		else if (status == UNUSED)
			return "Unused"; //$NON-NLS-1$
		else if (status == EXCEPTION)
			return "Exception"; //$NON-NLS-1$
		return null;
	}

}