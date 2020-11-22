/**
 * 
 */
package com.cloudibpm.core.data.variable;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.data.Constant;
import com.cloudibpm.core.data.DateTimeConstant;
import com.cloudibpm.core.data.NullValue;

/**
 * @author Dahai Cao created on 20171205
 *
 */
public class ExprFunction extends WorkflowEntity {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6710330972054850983L;
	private WorkflowEntity[] parameters = new Constant[0];
	private WorkflowEntity returned = new NullValue();
	private String format = "";
	private String descrition = "";
	private String classtypename = "Function";

	/**
	 * 
	 */
	public ExprFunction() {
		super();
	}

	/**
	 * @param id
	 */
	public ExprFunction(String id) {
		super(id);
		setName(id);
	}

	/**
	 * @return the parameters
	 */
	public WorkflowEntity[] getParameters() {
		return parameters;
	}

	/**
	 * @param parameters
	 *            the parameters to set
	 */
	public void setParameters(WorkflowEntity[] parameters) {
		this.parameters = parameters;
	}

	/**
	 * @return the returned
	 */
	public WorkflowEntity getReturned() {
		return returned;
	}

	/**
	 * @param returned
	 *            the returned to set
	 */
	public void setReturned(WorkflowEntity returned) {
		this.returned = returned;
	}

	/**
	 * @return the format
	 */
	public String getFormat() {
		return format;
	}

	/**
	 * @param format
	 *            the format to set
	 */
	public void setFormat(String format) {
		this.format = format;
	}

	/**
	 * 
	 */
	public void calculate() {
		if (getName() != null) {
			if (this.getName().equals("addLastElement")) {
				if (this.parameters.length < 2 || this.parameters.length > 2) {
					throw new RuntimeException("Number of parameters is 2, please check.");
				}
				if (!(this.parameters[0] instanceof ArrayDataVariable)) {
					throw new RuntimeException("The first parameter must be Array Data Variable");
				}
				if (!(this.parameters[1] instanceof Constant)) {
					throw new RuntimeException("The second parameter must be Array Data Variable");
				}
				if (!((ArrayDataVariable) this.parameters[0]).getDatatype()
						.equals(((Constant) this.parameters[1]).getDatatype())) {
					throw new RuntimeException("The data types of two parameters are different");
				}
				ArrayDataVariable p = (ArrayDataVariable) this.parameters[0];
				p.addLastElement((Constant) this.parameters[1]);
				this.returned = p;
			} else if (this.getName().equals("getCurrentDateTime")) {
				this.returned = new DateTimeConstant();
			}
		}
	}

	/**
	 * 
	 * @return
	 */
	public String toExpressionString() {
		return "F@" + getName();
	}

	/**
	 * 
	 */
	public String toString() {
		return getName();
	}

	/**
	 * @return the descrition
	 */
	public String getDescrition() {
		return descrition;
	}

	/**
	 * @param descrition
	 *            the descrition to set
	 */
	public void setDescrition(String descrition) {
		this.descrition = descrition;
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

}
