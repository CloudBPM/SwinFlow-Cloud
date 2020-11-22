/**
 * Create Date:  2010-5-18 上午10:47:33
 */
package com.cloudibpm.core.folder;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;

public class Folder extends TreeNode implements FolderType {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -3140326502583261456L;
	/**
	 * System level folder. This folder can be only deleted by
	 * administrator.
	 */
	public final static int SYSTEM = 0;
	/**
	 * Administrative level folder. This folder can be only deleted by
	 * administrator.
	 */
	public final static int ADMIN = 1;
	/**
	 * This type means user custom level, all folders that users created are at
	 * this level, the folders can be only deleted by user.
	 */
	public final static int CUSTOM = 2;
	/**
	 * System level by default.
	 */
	private int rank = SYSTEM;
	/**
	 * 
	 */
	private int type = 0;

	/**
	 * 
	 * Constructor
	 */
	public Folder() {
	}

	/**
	 * 
	 * Constructor
	 * 
	 * @param type
	 */
	public Folder(int type) {
		this.type = type;
	}

	/**
	 * 
	 * Constructor
	 * 
	 * @param id
	 */
	public Folder(String id) {
		this();
		this.setId(id);
	}

	/**
	 * 
	 * Constructor
	 * 
	 * @param name
	 *            folder name
	 * @param owner
	 *            folder owner
	 */
	public Folder(String name, WorkflowEntity owner) {
		this();
		this.setName(name);
		this.setOwner(owner.getId());
	}

	/**
	 * Create Date: 2010-5-18 上午10:47:33
	 * 
	 * @see workflow.core.AbstractTreeNodeEntity#clone()
	 */
	@Override
	public Folder clone() {
		Folder folder = new Folder();
		folder.setId(this.getId());
		folder.setName(this.getName());
		folder.setOwner(this.getOwner());
		folder.setParent(this.getParent());
		folder.setType(this.getType());
		this.cloneChildren(folder);
		return folder;
	}

	public String toString() {
		return getName();
	}

	/**
	 * Sets folder rank. The value of the rank can reference {@link #SYSTEM},
	 * {@link #ADMIN},{@link #CUSTOM}.
	 * 
	 * @param rank
	 *            folder rank.
	 */
	public int getRank() {
		return rank;
	}

	/**
	 * Returns folder type. The value of the folder types can reference
	 * {@link #PROCESS_FOLDER}, {@link #CALENDAR_FOLDER},{@link #GROUP_FOLDER},
	 * {@link #USER_FOLDER}, {@link #BASIC_DATA_FOLDER}, {@link #FORM_FOLDER},
	 * {@link #STRUCTURE_FOLDER}.
	 * 
	 * @return folder type.
	 */
	public int getType() {
		return type;
	}

	/**
	 * Return folder rank. The value of the rank can reference {@link #SYSTEM},
	 * {@link #ADMIN},{@link #CUSTOM}.
	 * 
	 * @return folder rank.
	 */
	public void setRank(int rank) {
		this.rank = rank;
	}

	/**
	 * Sets folder type. The value of the folder types can reference
	 * {@link #PROCESS_FOLDER}, {@link #CALENDAR_FOLDER},{@link #GROUP_FOLDER},
	 * {@link #USER_FOLDER}, {@link #BASIC_DATA_FOLDER}, {@link #FORM_FOLDER},
	 * {@link #STRUCTURE_FOLDER}.
	 * 
	 * @param type
	 */
	public void setType(int type) {
		this.type = type;
	}

	public int compareTo(TreeNode o) {
		if (o instanceof Folder) {
			return this.getName().compareTo(((Folder) o).getName());
		}
		return 0;
	}

}
