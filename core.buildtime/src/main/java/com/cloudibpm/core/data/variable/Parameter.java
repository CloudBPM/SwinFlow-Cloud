/**
 * @user Dahai CAO
 * @date 2011-8-7 下午08:43:46
 */
package com.cloudibpm.core.data.variable;

import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.data.Constant;
import com.cloudibpm.core.data.expression.Expression;

public class Parameter extends DataVariable {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8728284463388903421L;
	// this property describes the data type of this parameter.
	// such as int, float, string, double, etc.
	private String comments = null;

	public Parameter() {
		super();
	}

	/**
	 * 
	 * @author Dahai CAO
	 * @date 2011-9-25 下午06:11:12
	 * @return
	 */
	@Override
	public Object clone(WfProcess owner) {
		try {
			Parameter para = (Parameter) super.clone();
			if (this.getValue() != null)
				para.setValue(((Constant) this.getValue()).clone(owner));
			return para;
		} catch (CloneNotSupportedException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 
	 * @author Dahai CAO
	 * @date 2011-9-29 下午07:30:04
	 * @return
	 * @see workflow.core.data.variable.FormControl#toString()
	 */
	public String toString() {
		return getName();
	}

	/**
	 * This method is only used in HTTP parameter.
	 * 
	 * @return
	 */
	public String toStoreString() {
		if (getValue() != null)
			return getName() + ":" + getDatatype() + ":" + ((Constant) getValue()).getValue() + ":"
					+ (getComments() == null ? "" : getComments());
		else
			return getName() + ":" + getDatatype() + "::" + (getComments() == null ? "" : getComments());
	}

	/**
	 * 
	 * @date 2011-9-29 下午07:30:00
	 * @return
	 */
	public String toParameterString() {
		if (getValue() != null) {
			if (getValue() instanceof Constant) {
				return getName() + ":" + getDatatype() + ":" + ((Constant) getValue()).toExpressionString() + ":"
						+ (getComments() == null ? "" : getComments()) + ";";
			} else if (getValue() instanceof Expression) {
				return getName() + ":" + getDatatype() + ":" + ((Expression) getValue()).toExpressionString() + ":"
						+ (getComments() == null ? "" : getComments()) + ";";
			}
		} else
			return getName() + ":" + getDatatype() + "::" + (getComments() == null ? "" : getComments()) + ";";
		return "";
	}

	/**
	 * @return the comments
	 */
	public String getComments() {
		return comments;
	}

	/**
	 * @param comments
	 *            the comments to set
	 */
	public void setComments(String comments) {
		this.comments = comments;
	}

}
