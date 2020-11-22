/**
 * 
 */
package com.cloudibpm.core.data;

import com.cloudibpm.core.buildtime.wfprocess.WfProcess;

/**
 * @author Dahai Cao created on 2017-11-27
 *
 */
public class IntegerConstant extends Constant implements Comparable<Constant>{

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6886193911276266237L;
	// 0:decimal;1:octonary;2:hexadecimal
	private int numberSystem = 0;

	/**
	 * 
	 */
	public IntegerConstant() {
		this.setValue("");
		this.setDatatype(DataType.INTEGER);
	}

	public IntegerConstant(String val) {
		this.setValue(val);
		this.setDatatype(DataType.INTEGER);
	}

	@Override
	public Object clone(WfProcess owner) {
		IntegerConstant d = new IntegerConstant();
		d.setNumberSystem(this.getNumberSystem());
		d.setValue(this.getValue());
		return d;
	};

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof IntegerConstant) {
			if ((this.getValue() == null && ((IntegerConstant) obj).getValue() == null)
					|| (this.getValue() != null && this.getValue().equals(((IntegerConstant) obj).getValue()))) {
				return true;
			}
		} else if (obj instanceof String) {// it is used to recognize Expression
			if (this.getValue() != null && this.getValue().equals(obj)) {
				return true;
			}
		} else if (obj instanceof Integer) {
			if (this.getValue() != null) {
				try {
					if (Integer.parseInt(this.getValue()) == (Integer) obj) {
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
					if (Integer.parseInt(this.getValue()) == (Double) obj) {
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
					if (Integer.parseInt(this.getValue()) == (Float) obj) {
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

	/**
	 * @return the numberSystem
	 */
	public int getNumberSystem() {
		return numberSystem;
	}

	/**
	 * @param numberSystem
	 *            the numberSystem to set
	 */
	public void setNumberSystem(int numberSystem) {
		this.numberSystem = numberSystem;
	}

	@Override
	public String toExpressionString() {
		return "C@" + this.getDatatype() + "@" + this.getNumberSystem() + "@" + this.getValue();
	};

	@Override
	public void parseString(String str) {
		if (str != null && str != "") {
			String[] ary = str.split("@");
			this.setDatatype(ary[1]);
			this.setNumberSystem(Integer.parseInt(ary[2]));
			if (ary.length > 3)
				this.setValue(ary[3]);
		}
	};

	@Override
	public String toString() {
		return this.getValue();
	}

	@Override
	public int compareTo(Constant o) {
		return 0;
	};

}
