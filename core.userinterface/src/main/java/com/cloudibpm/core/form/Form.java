/**
 * @author Cao Dahai
 * @version 1.0.0 上午12:21:35
 */
package com.cloudibpm.core.form;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;

public class Form extends TreeNode {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8811753632754945623L;
	public final static int DEFAULT_BEGIN_X = 15;
	public final static int DEFAULT_BEGIN_Y = 15;
	private String code;
	private String description;
	private String keywords = null;
	private String authorId;
	private String author;
	// this property support team work for process modeling
	// 0:unlocked ;1:locked
	private int status = 0;
	private long createDatetime;
	private long lastupdate;
	private double purchasePrice = 0.0d;
	private double usagePrice = 0.0d;
	private String formContent = null;// this is form content
	// 3: data-collecting UI application service
	// 4: data-presentation UI application service
	// 5: data-listing UI application service
	// 6: data-statistics UI application service
	private int serviceType = 3;
	private int formType = 0;
	private int accessLevel = 0;

	/**
	 * Constructor
	 */
	public Form() {
		setName("Form");//$NON-NLS-1$
		setId("0000000000");//$NON-NLS-1$
	}

	/**
	 * Constructor
	 * 
	 * @param id
	 */
	public Form(String id) {
		this();
		setId(id);
	}

	/**
	 * Constructor
	 * 
	 * @param id
	 * @param owner
	 */
	public Form(String id, WorkflowEntity owner) {
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
		Form form = new Form();

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

	public int compareTo(TreeNode o) {
		return 0;
	}

	public String toString() {
		return getName();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
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

	/**
	 * @return the keywords
	 */
	public String getKeywords() {
		return keywords;
	}

	/**
	 * @param keywords
	 *            the keywords to set
	 */
	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}

	/**
	 * @return the author
	 */
	public String getAuthor() {
		return author;
	}

	/**
	 * @param author
	 *            the author to set
	 */
	public void setAuthor(String author) {
		this.author = author;
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
	 * @return the lastupdate
	 */
	public long getLastupdate() {
		return lastupdate;
	}

	/**
	 * @param lastupdate
	 *            the lastupdate to set
	 */
	public void setLastupdate(long lastupdate) {
		this.lastupdate = lastupdate;
	}

	/**
	 * @return the createDatetime
	 */
	public long getCreateDatetime() {
		return createDatetime;
	}

	/**
	 * @param createDatetime
	 *            the createDatetime to set
	 */
	public void setCreateDatetime(long createDatetime) {
		this.createDatetime = createDatetime;
	}

	/**
	 * @return the purchasePrice
	 */
	public double getPurchasePrice() {
		return purchasePrice;
	}

	/**
	 * @param purchasePrice
	 *            the purchasePrice to set
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
	 * @param usagePrice
	 *            the usagePrice to set
	 */
	public void setUsagePrice(double usagePrice) {
		this.usagePrice = usagePrice;
	}

	/**
	 * @return the formContent
	 */
	public String getFormContent() {
		return formContent;
	}

	/**
	 * @param formContent
	 *            the formContent to set
	 */
	public void setFormContent(String formContent) {
		this.formContent = formContent;
	}

	public int getFormType() {
		return formType;
	}

	public void setFormType(int formType) {
		this.formType = formType;
	}

	public int getServiceType() {
		return serviceType;
	}

	public void setServiceType(int serviceType) {
		this.serviceType = serviceType;
	}

	public int getAccessLevel() {
		return accessLevel;
	}

	public void setAccessLevel(int accessLevel) {
		this.accessLevel = accessLevel;
	}

	public String getAuthorId() {
		return authorId;
	}

	public void setAuthorId(String authorId) {
		this.authorId = authorId;
	}
}