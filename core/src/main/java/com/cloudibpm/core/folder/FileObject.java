/**
 * 
 */
package com.cloudibpm.core.folder;

import java.net.URL;
import java.util.Date;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.file.FileUtil;

/**
 * @author Dahai Cao created on 2011-09-11
 * @date lastupdated on 2017-10-11
 */
public class FileObject extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6412586310005793654L;

	/**
	 * Content-Type(Mime-Type)
	 */
	private String mimeType = null;
	/**
	 * Last modified date.
	 */
	private Date lastUpdate;
	/**
	 * File size.
	 */
	private long size = -1L;
	/**
	 * File's URL object
	 */
	private URL url;
	/**
	 * The host that the file locates.
	 */
	private String host;
	/**
	 * The path that the file locates.
	 */
	private String path;
	/**
	 * File's sufix and expended name.
	 */
	private String sufix;
	/**
	 * The binary content of current file.
	 */
	private byte[] binaryContent;
	
	private int Operatation; // 0 - cannt operate  1 - can operate 

	/**
	 * 
	 */
	public FileObject() {
		super();
	}

	/**
	 * @param id
	 */
	public FileObject(String id) {
		super(id);
	}

	public FileObject(String fileName, String location) {
		super();
		setName(fileName);
		setPath(location);
	}

	/**
	 * Returns mime type of file.
	 * 
	 * @return the mimeType
	 */
	public String getMimeType() {
		//if (mimeType == null) {
		//	return MIMETYPE.getInstance().getMIMEType(this.sufix);
		//}
		return mimeType;
	}

	/**
	 * Sets mime type of the file.
	 * 
	 * @param mimeType
	 *            the mimeType to set
	 */
	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

	/**
	 * Returns last modified date of the file.
	 * 
	 * @return the lastUpdate
	 */
	public Date getLastUpdate() {
		return lastUpdate;
	}

	/**
	 * Fetch string format of last modified date.
	 * 
	 * @date 12/07/2011 4:23:03 PM
	 * @return lastUpdate String
	 */
	public String fetchUpdate() {
		if (lastUpdate == null)
			return null;
		return DateUtility.formatDatetime(lastUpdate);
	}

	/**
	 * Sets last modified date of the file.
	 * 
	 * @param lastUpdate
	 *            the lastUpdate to set
	 */
	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	/**
	 * Returns size of long integer number.
	 * 
	 * @return the size
	 */
	public long getSize() {
		return size;
	}

	/**
	 * Returns size format of file size.
	 * 
	 * @date 04/03/2012 12:27:03 PM
	 * @return String
	 */
	public String fetchFileSize() {
		return FileUtil.computingSize(this.size);
	}

	/**
	 * Sets file size of long integer format.
	 * 
	 * @param size
	 *            the size to set
	 */
	public void setSize(long size) {
		this.size = size;
	}

	/**
	 * Returns file's URL object.
	 * 
	 * @return the url
	 */
	public URL getUrl() {
		return url;
	}

	/**
	 * Sets file's URL object.
	 * 
	 * @param url
	 *            the url to set
	 */
	public void setUrl(URL url) {
		this.url = url;
	}

	/**
	 * Sets file's host
	 * 
	 * @return the host
	 */
	public String getHost() {
		return host;
	}

	/**
	 * Returns file's host.
	 * 
	 * @param host
	 *            the host to set
	 */
	public void setHost(String host) {
		this.host = host;
	}

	/**
	 * Return file's path.
	 * 
	 * @return the path
	 */
	public String getPath() {
		return path;
	}

	/**
	 * Sets file's path
	 * 
	 * @param path
	 *            the path to set
	 */
	public void setPath(String path) {
		this.path = path;
	}

	/**
	 * Returns file's expended name.
	 * 
	 * @return the sufix
	 */
	public String getSufix() {
		return sufix;
	}

	/**
	 * Sets file's expended name.
	 * 
	 * @param sufix
	 *            the sufix to set
	 */
	public void setSufix(String sufix) {
		this.sufix = sufix;
	}

	/**
	 * Sets binary content of current file.
	 * 
	 * @return the binaryContent
	 */
	public byte[] getBinaryContent() {
		return binaryContent;
	}

	/**
	 * Returns binary content of current file.
	 * 
	 * @param binaryContent
	 *            the binaryContent to set
	 */
	public void setBinaryContent(byte[] binaryContent) {
		this.binaryContent = binaryContent;
	}

	public int getOperatation() {
		return Operatation;
	}

	public void setOperatation(int operatation) {
		Operatation = operatation;
	}
	
	
}
