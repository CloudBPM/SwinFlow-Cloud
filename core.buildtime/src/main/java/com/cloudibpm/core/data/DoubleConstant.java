/**
 * 
 */
package com.cloudibpm.core.data;

import com.cloudibpm.core.buildtime.wfprocess.WfProcess;

/**
 * @author Dahai Cao created on 2017-11-27
 *
 */
public class DoubleConstant extends Constant implements Comparable<Constant> {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 5823925672504444973L;

	/**
	 * DoubleConstant
	 */
	public DoubleConstant() {
		this.setValue("");
		this.setDatatype(DataType.DOUBLE);
	}

	public DoubleConstant(String val) {
		this.setValue(val);
		this.setDatatype(DataType.DOUBLE);
	}

	@Override
	public Object clone(WfProcess owner) {
		DoubleConstant d = new DoubleConstant();
		d.setValue(this.getValue());
		return d;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof DoubleConstant) {
			if ((this.getValue() == null && ((DoubleConstant) obj).getValue() == null)
					|| (this.getValue() != null && this.getValue().equals(((DoubleConstant) obj).getValue()))) {
				return true;
			}
		} else if (obj instanceof String) {// it is used to recognize Expression
			if (this.getValue() != null && this.getValue().equals(obj)) {
				return true;
			}
		} else if (obj instanceof Integer) {
			if (this.getValue() != null) {
				try {
					if (Double.parseDouble(this.getValue()) == (Integer) obj) {
						return true;
					} else
						return false;
				} catch (Exception e) {
					return false;
				}
			}
		} else if (obj instanceof Double) {
			if (this.getValue() != null) {
				try {
					if (Double.parseDouble(this.getValue()) == (Double) obj) {
						return true;
					} else
						return false;
				} catch (Exception e) {
					return false;
				}
			}
		} else if (obj instanceof Float) {
			if (this.getValue() != null) {
				try {
					if (Double.parseDouble(this.getValue()) == (Float) obj) {
						return true;
					} else
						return false;
				} catch (Exception e) {
					return false;
				}
			}
		}
		return false;
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
		return this.getValue();
	}

	@Override
	public int compareTo(Constant o) {
		return 0;
	}
}