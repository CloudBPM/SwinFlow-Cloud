package com.cloudibpm.core.authorization;

import com.cloudibpm.core.TreeNode;

public class Authority extends TreeNode {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -8857889432567273928L;
	private String description;
	private int type;

	public Authority() {
		super();
	}

	public Authority(String name) {
		super();
		setName(name);
	}

	public int getType() {
		return type;
	}

	public String getDescription() {
		return description;
	}

	public void setType(int cls) {
		this.type = cls;
	}

	public void setDescription(String desc) {
		this.description = desc;
	}

	public String toString() {
		return getName();
	}
}