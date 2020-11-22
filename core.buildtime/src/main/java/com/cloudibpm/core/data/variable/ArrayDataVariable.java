/**
 * 
 */
package com.cloudibpm.core.data.variable;

import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.data.*;

import java.util.Arrays;

/**
 * @author Dahai Cao created on 2017-10-12
 *
 */
public class ArrayDataVariable extends DataVariable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -6149943770057742399L;
	// values is always used to store constants.
	private Object values = null;

	/**
	 * 
	 */
	public ArrayDataVariable() {
		this.setName("Array Data Variable");
		this.setDatatype("ArrayData");
		this.setClasstypename("ArrayDataVariable");
	}

	public Object clone(WfProcess owner) {
		ArrayDataVariable b = new ArrayDataVariable();
		b.setId(this.getId());
		b.setName(this.getName());
		b.setOrderNumber(this.getOrderNumber());
		b.setDescription(this.getDescription());
		Constant[] values = (Constant[]) this.values;
		if (values != null && values.length > 0) {
			Constant[] values1 = new Constant[values.length];
			for (int i = 0; i < values.length; i++) {
				values1[i] = (Constant) values[i].clone(owner);
			}
			b.values = values1;
		}
		b.setDatatype(this.getDatatype());
		b.setCurrOwner(this.getCurrOwner());
		b.setOwner(this.getOwner());
		return b;
	};

	/**
	 * @return the values
	 */
	public Object getValues() {
		return values;
	}

	/**
	 * @param values
	 *            the values to set
	 */
	public void setValues(Object values) {
		this.values = values;
	}

	public void addLastElement(Constant newone) {
		if (newone == null)
			return;
		if (this.values == null) {
			if (this.getDatatype().equals(DataType.INTEGER)) {
				this.values = new IntegerConstant[0];
			} else if (this.getDatatype().equals(DataType.DOUBLE)) {
				this.values = new DoubleConstant[0];
			} else if (this.getDatatype().equals(DataType.BOOLEAN)) {
				this.values = new BooleanConstant[0];
			} else if (this.getDatatype().equals(DataType.STRING)) {
				this.values = new StringConstant[0];
			} else if (this.getDatatype().equals(DataType.CURRENCY)) {
				this.values = new DoubleConstant[0];
			} else if (this.getDatatype().equals(DataType.FILE)) {
				this.values = new FileConstant[0];
			} else if (this.getDatatype().equals(DataType.DATE)) {
				this.values = new DateTimeConstant[0];
			} else if (this.getDatatype().equals(DataType.TIME)) {
				this.values = new DateTimeConstant[0];
			} else if (this.getDatatype().equals(DataType.DATETIME)) {
				this.values = new DateTimeConstant[0];
			} else if (this.getDatatype().equals(DataType.TIMEDURATION)) {
				this.values = new TimDurationConstant[0];
			} else if (this.getDatatype().equals(DataType.JSON)) {
				this.values = new JSONConstant[0];
			} else if (this.getDatatype().equals(DataType.HANDWRITING)) {
				this.values = new HandwritingConstant[0];
			}
		}
		Constant[] v = (Constant[]) this.values;
		int oldCapacity = v.length;
		v = Arrays.copyOf(v, oldCapacity + 1);
		v[oldCapacity++] = newone;
		this.values = v;
	}

}
