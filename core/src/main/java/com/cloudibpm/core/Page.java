/**
 * 
 */
package com.cloudibpm.core;

/**
 * @author cdh
 * 
 */
public abstract class Page implements java.io.Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1904169539287454955L;
	/**
	 * Current page number, count from 1,2,3,...
	 */
	private int pageNo;
	/**
	 * Current page size.
	 */
	private int pageSize = 0;
	/**
	 * All entities counting.
	 */
	private long allEntitiesCount = 0;
	/**
	 * All pages counting.
	 */
	private long allPagesCount;
	/**
	 * The starting position of current page.
	 */
	private int pageIndex = 0;

	/**
	 * 
	 */
	public Page() {
		super();
	}

	public Page(int pageNo, int pageSize) {
		this();
		this.pageNo = pageNo;
		this.pageSize = pageSize;
		if (pageSize > 0)
			this.pageIndex = pageSize * (pageNo - 1);
	}

	/**
	 * @return the pageSize
	 */
	public long getPageSize() {
		if (pageSize > 0)
			return pageSize;
		else
			return allEntitiesCount;
	}

	/**
	 * @param pageSize
	 *            the pageSize to set
	 */
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	/**
	 * @return the allEntitiesCount
	 */
	public long getAllEntitiesCount() {
		return allEntitiesCount;
	}

	/**
	 * @param allEntitiesCount
	 *            the allEntitiesCount to set
	 */
	public void setAllEntitiesCount(long allEntitiesCount) {
		this.allEntitiesCount = allEntitiesCount;
		if (this.allEntitiesCount > 0 && this.pageSize > 0) {
			if (this.allEntitiesCount % this.pageSize == 0) {
				this.allPagesCount = this.allEntitiesCount / this.pageSize;
			} else {
				this.allPagesCount = this.allEntitiesCount / this.pageSize + 1;
			}
		}
	}

	/**
	 * @return the pageNo
	 */
	public int getPageNo() {
		return pageNo;
	}

	/**
	 * @param pageNo
	 *            the pageNo to set
	 */
	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}

	/**
	 * @return the allPagesCount
	 */
	public long getAllPagesCount() {
		return allPagesCount;
	}

	/**
	 * @param allPagesCount
	 *            the allPagesCount to set
	 */
	public void setAllPagesCount(long allPagesCount) {
		this.allPagesCount = allPagesCount;
	}

	/**
	 * @return the pageIndex
	 */
	public int getPageIndex() {
		return pageIndex;
	}

	/**
	 * @param pageIndex
	 *            the pageIndex to set
	 */
	public void setPageIndex(int pageIndex) {
		this.pageIndex = pageIndex;
	}
}