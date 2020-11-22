/**
 * 
 */
package com.cloudibpm.core.data;

import com.cloudibpm.core.buildtime.wfprocess.WfProcess;

/**
 * 
 * @author Dahai Cao created on 2017-11-27
 */
public class BooleanConstant extends Constant {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -905368186341673938L;

	/**
	 * BooleanConstant
	 */
	public BooleanConstant() {
		this.setValue("false");
		this.setDatatype(DataType.BOOLEAN);
	}

	public BooleanConstant(String value) {
		this.setValue(value);
		this.setDatatype(DataType.BOOLEAN);
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof BooleanConstant) {
			if ((this.getValue() == null && ((BooleanConstant) obj).getValue() == null) || (this.getValue() != null
					&& this.getValue().toLowerCase().equals(((BooleanConstant) obj).getValue().toLowerCase()))) {
				return true;
			}
		} else if (obj instanceof String) {// it is used to recognize Expression
			if (this.getValue() != null && this.getValue().toLowerCase().equals(obj)) {
				return true;
			}
		} else if (obj instanceof Boolean) {
			if (this.getValue() != null && this.getValue().toLowerCase().equals(((Boolean) obj).toString())) {
				return true;
			}
		}
		return false;
	}

	@Override
	public Object clone(WfProcess owner) {
		BooleanConstant d = new BooleanConstant();
		d.setValue(this.getValue());
		return d;
	}

	@Override
	public String toExpressionString() {
		return "C@" + this.getDatatype() + "@" + this.getValue();
	};

	@Override
	public void parseString(String str) {
		String[] ary = str.split("@");
		this.setDatatype(ary[1]);
		if (ary.length > 2)
			this.setValue(ary[2]);
	};

	public String toString() {
		return this.getValue().toLowerCase();
	}

}
