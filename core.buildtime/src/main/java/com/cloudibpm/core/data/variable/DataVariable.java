/**
 * Create Date:  2010-4-6 10:20:52 am
 * 2016-10-06 updated.
 */
package com.cloudibpm.core.data.variable;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;

/**
 * 
 */
public class DataVariable extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6164919525358776279L;
	private int orderNumber = -1;
	private Object value = null;
	private String description = null;
	private String classtypename = "DataVariable";
	private String datatype = "Data";
	private String definitionId = null;

	/**
	 * Constructor
	 */
	public DataVariable() {
		this.setName("Data Variable");
		this.setDatatype("Data");
		this.setClasstypename("DataVariable");
	}

	/**
	 * Construct object with an unique <tt>id</tt> that is generated in
	 * repository.
	 * 
	 * @param id
	 *            unique id
	 */
	public DataVariable(String id) {
		super(id);
	}

	public Object clone(WfProcess owner) {
		return null;
	}

//	/**
//	 * Returns <tt>true</tt> if value of current input object is null,
//	 * otherwise, <tt>false</tt>.
//	 * <p>
//	 * Create Date: 2010-4-6 10:21:42 am
//	 * 
//	 * @see com.cloudibpm.core.buildtime.data.variable.DataVariable#isNull()
//	 * @return <tt>true</tt> if it is <tt>null</tt>, otherwise, not
//	 *         <tt>null</tt>.
//	 */
//	public boolean isNull() {
//		return false;
//	}

	public int getOrderNumber() {
		return this.orderNumber;
	}

	public void setOrderNumber(int orderNumber) {
		this.orderNumber = orderNumber;
	}

	/**
	 * @return the dataType
	 */
	public String getDatatype() {
		return this.datatype;
	}

	/**
	 * @param dataType
	 *            the dataType to set
	 */
	public void setDatatype(String dataType) {
		this.datatype = dataType;
	}

	/**
	 * Returns value of current input object.
	 * <p>
	 * Create Date: 2010-4-6 10:49:41 am
	 * 
	 * @return value object
	 */
	public Object getValue() {
		return this.value;
	}

	/**
	 * Sets value of current input object as the specified integer object.
	 * <p>
	 * Create Date: 2010-4-23 11:29:52 am
	 * 
	 * @param value
	 *            object
	 */
	public void setValue(Object value) {
		this.value = value;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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
	 * @return the definitionId
	 */
	public String getDefinitionId() {
		return definitionId;
	}

	/**
	 * @param definitionId
	 *            the definitionId to set
	 */
	public void setDefinitionId(String definitionId) {
		this.definitionId = definitionId;
	}
}