package com.cloudibpm.core;

import java.io.Serializable;

/**
 * @author Dahai Cao
 */
public class WorkflowEntity implements Cloneable, Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -4596730357618650257L;
	private String id = null;
	private String name = null;
	private String owner = null;
	private String currOwner = null;

	/**
	 * 
	 */
	public WorkflowEntity() {
		super();
	}

	/**
	 * 
	 * @param id
	 *            String
	 */
	public WorkflowEntity(String id) {
		this();
		this.id = id;
	}

	/**
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (obj == null)
			return false;
		if (!(obj instanceof WorkflowEntity))
			return false;
		if (this.getId() != null && ((WorkflowEntity) obj).getId() != null) {
			if (this.getId().equals(((WorkflowEntity) obj).getId()))
				return true;
			else
				return false;
		}
		return super.equals(obj);

	}

	/**
	 * 
	 */
	@Override
	public Object clone() throws CloneNotSupportedException {
		WorkflowEntity o = null;
		try {
			o = (WorkflowEntity) super.clone();
		} catch (CloneNotSupportedException e) {
			e.printStackTrace();
		}
		return o;
	}

	/**
	 * 
	 */
	public String getId() {
		return this.id;
	}

	/**
	 * 
	 */
	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getOwner() {
		return this.owner;
	}

	/**
	 * @return the currOwner
	 */
	public String getCurrOwner() {
		return currOwner;
	}

	/**
	 * @param currOwner
	 *            the currOwner to set
	 */
	public void setCurrOwner(String currOwner) {
		this.currOwner = currOwner;
	}

	public String toString() {
		return getName();
	}

}