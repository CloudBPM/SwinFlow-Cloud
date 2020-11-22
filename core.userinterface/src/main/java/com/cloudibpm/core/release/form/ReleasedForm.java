package com.cloudibpm.core.release.form;
/**
 * @author Cao Dahai
 * @version 1.0.0 上午12:21:35
 */

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.form.Form;

public class ReleasedForm extends Form {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8811753632754945623L;
	private String version = null;
	private String releaserId = null;
	private String releaser = null;
	private String releaseStatement = null;
	private long releaseDate = 0;
	// 1:deprecated(not use any more);0:still use
	private int deprecated = 0;
	// 0: no trial;
	// 1: 1 month trial;
	// 2: 3 months;
	// 3: 6 months;
	// 4: 9 months;
	// 5: 12 months;
	private int trialPeriod = 0;

	private long likeCounting = 0;
	private long totalDownloading = 0;
	private long totalUseCounting = 0;
	private long successCounting = 0;


	/**
	 * Constructor
	 */
	public ReleasedForm() {
		setName("ReleasedForm");//$NON-NLS-1$
		setId("0000000000");//$NON-NLS-1$
	}

	/**
	 * Constructor
	 * 
	 * @param id
	 */
	public ReleasedForm(String id) {
		this();
		setId(id);
	}

	/**
	 * Constructor
	 * 
	 * @param id
	 * @param owner
	 */
	public ReleasedForm(String id, WorkflowEntity owner) {
		this();
		setName("Form");//$NON-NLS-1$
		setId(id);
		setOwner(owner.getId());
	}

	/**
	 * 
	 * Create Date: 2010-4-9 上午11:33:57
	 * 
	 * @see workflow.core.form.component.FormComponent#clone()
	 */
	@Override
	public Object clone() {
		ReleasedForm form = new ReleasedForm();

		return form;
	}

	/**
	 * 重载该方法，是因为表单下面的表格布局的所有者和父亲均是表单本身，<br>
	 * 这样设计有利于表单的管理，表单中所有的元素均是表单所有，这样清除表单，也就把所有下面的元素清空了。
	 * 
	 * @param parent
	 *            表单对象
	 */
	@Override
	public void cloneChildren(TreeNode parent) {
		try {
			if (this.hasChildren()) {
				TreeNode[] nodes = this.getChildren();
				TreeNode[] newNodes = new TreeNode[nodes.length];
				for (int i = 0; i < nodes.length; i++) {
					newNodes[i] = (TreeNode) nodes[i].clone();
					newNodes[i].setParent(parent.getParent());
					newNodes[i].setOwner(parent.getId());
				}
				parent.setChildren(newNodes);
			}
		} catch (CloneNotSupportedException e) {
			e.printStackTrace();
		}
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getReleaser() {
		return releaser;
	}

	public void setReleaser(String releaser) {
		this.releaser = releaser;
	}

	public String getReleaseStatement() {
		return releaseStatement;
	}

	public void setReleaseStatement(String releaseStatement) {
		this.releaseStatement = releaseStatement;
	}

	public long getReleaseDate() {
		return releaseDate;
	}

	public void setReleaseDate(long releaseDate) {
		this.releaseDate = releaseDate;
	}

	public int getDeprecated() {
		return deprecated;
	}

	public void setDeprecated(int deprecated) {
		this.deprecated = deprecated;
	}

	public long getLikeCounting() {
		return likeCounting;
	}

	public void setLikeCounting(long likeCounting) {
		this.likeCounting = likeCounting;
	}

	public long getTotalUseCounting() {
		return totalUseCounting;
	}

	public void setTotalUseCounting(long totalUseCounting) {
		this.totalUseCounting = totalUseCounting;
	}

	public long getSuccessCounting() {
		return successCounting;
	}

	public void setSuccessCounting(long successCounting) {
		this.successCounting = successCounting;
	}

	/**
	 * @return the trialPeriod
	 */
	public int getTrialPeriod() {
		return trialPeriod;
	}

	/**
	 * Trial period type. 0: no trial; 1: 1 month trial; 2: 3 months; 3: 6
	 * months; 4: 9 months; 5: 12 months;
	 * 
	 * @param trialPeriod
	 *            the trialPeriod to set
	 */
	public void setTrialPeriod(int trialPeriod) {
		this.trialPeriod = trialPeriod;
	}

	/**
	 * Totally download counting.
	 * 
	 * @return the totalDownloading
	 */
	public long getTotalDownloading() {
		return totalDownloading;
	}

	public String getReleaserId() {
		return releaserId;
	}

	public void setReleaserId(String releaserId) {
		this.releaserId = releaserId;
	}

	/**
	 * @param totalDownloading
	 *            the totalDownloading to set
	 */
	public void setTotalDownloading(long totalDownloading) {
		this.totalDownloading = totalDownloading;
	}

	public int compareTo(TreeNode o) {
		return 0;
	}

	public String toString() {
		return getName();
	}


}