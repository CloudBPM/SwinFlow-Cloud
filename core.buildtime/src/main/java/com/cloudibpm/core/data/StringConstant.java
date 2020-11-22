/**
 * 
 */
package com.cloudibpm.core.data;

import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
//import com.cloudibpm.core.util.encode.Base64Util;

/**
 * @author Dahai Cao created on 2017-11-27
 *
 */
public class StringConstant extends Constant {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6446078959589167599L;

	/**
	 * 
	 */
	public StringConstant() {
		this.setValue("");
		this.setDatatype(DataType.STRING);
	}

	public StringConstant(String value) {
		this.setValue(value);
		this.setDatatype(DataType.STRING);
	}

	@Override
	public Object clone(WfProcess owner) {
		StringConstant d = new StringConstant();
		d.setValue(this.getValue());
		return d;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof StringConstant) {
			if ((this.getValue() == null && ((StringConstant) obj).getValue() == null)
					|| (this.getValue() != null && this.getValue().equals(((StringConstant) obj).getValue()))) {
				return true;
			}
		} else if (obj instanceof String) {// it is used to recognize Expression
			String s = (String) obj;
			if (((String) obj).startsWith("\"")) {
				s = ((String) obj).substring(1, ((String) obj).length() - 1);
			}
			if (this.getValue() != null && this.getValue().equals(s)) {
				return true;
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
		String[]  ary = str.split("@");
		this.setDatatype(ary[1]);
		if (str.length() >= 9 && str.indexOf("@") > 0) {
			this.setValue(str.substring(9, str.length()));
		} else {
			this.setValue(str);
		}
	};

	public String toString() {
		if (this.getValue() != null && !this.getValue().equals("")) {
			return this.getValue();
		}
		return "";
	}

}
