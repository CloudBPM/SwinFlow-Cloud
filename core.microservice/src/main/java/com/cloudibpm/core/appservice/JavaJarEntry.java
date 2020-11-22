/**
 * 
 */
package com.cloudibpm.core.appservice;

import java.util.Calendar;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.file.FileUtil;

/**
 * This class describes a entry (Java class file or package directory item) in a
 * java jar file.
 * 
 * @date 2016-11-28 22:50 last updated.
 * @author cdh
 * 
 */
public class JavaJarEntry extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1605491540694890856L;
	private long lastUpdate = 0L;
	private long size = 0L;
	private String jarFileName = null;
	private String path = "";
	private String className = null;
	private String packageName = null;
	private String fileSize = null;
	private String lastModified = null;
	private String isDir = "N";

	/**
	 * Constructor
	 */
	public JavaJarEntry() {
	}

	/**
	 * Constructor
	 * 
	 * @param pathName
	 *            this parameter is like a com/workflow/MyCustomJava.class
	 * @param isDirectory
	 *            true: is a directory, otherwise, false
	 * @param size
	 *            file size (long integer type)
	 * @param lastupdate
	 *            last update date (long integer type)
	 */
	public JavaJarEntry(String pathName, boolean isDirectory, long size, long lastupdate) {
		this();
		this.lastUpdate = lastupdate;
		this.size = size;
		if (isDirectory)
			this.setIsDir("Y");
		if (!isDirectory)
			setName(pathName.substring(pathName.lastIndexOf("/") + 1, pathName.length()));
		if (pathName.lastIndexOf("/") > 0)
			this.path = pathName.substring(0, pathName.lastIndexOf("/"));
		if (getName() != null)
			this.className = getName().substring(0, getName().length() - 6);
		this.packageName = this.path.replace('/', '.');
		this.fileSize = FileUtil.computingSize(size);
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(lastupdate);
		this.lastModified = DateUtility.formatDatetime(calendar.getTime());
	}

	/**
	 * Return package name (package path) in a Jar entry, e.g.,
	 * com/ibm/workflow/
	 * 
	 * @date 20161128 22:37
	 * @return the path
	 */
	public String getPath() {
		return path;
	}

	/**
	 * Set package name (package path) in a Jar entry, e.g., com/ibm/workflow/
	 * 
	 * @date 20161128 22:37
	 * @param path
	 *            the path to set
	 */
	public void setPath(String path) {
		this.path = path;
	}

	/**
	 * Return long integer type file size;
	 * 
	 * @date 20161128 22:37
	 * @return
	 */
	public long getSize() {
		return size;
	}

	/**
	 * Set long integer type file size
	 * 
	 * @date 20161128 22:37
	 * @param size
	 */
	public void setSize(long size) {
		this.size = size;
	}

	/**
	 * Returns long integer type last update date time
	 * 
	 * @date 20161128 22:37
	 * @return
	 */
	public long getLastUpdate() {
		return lastUpdate;
	}

	/**
	 * Sets long integer type last update date time
	 * 
	 * @param lastUpdate
	 */
	public void setLastUpdate(long lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	/**
	 * Returns a class name. e.g., java.lang.String, here, it is String
	 * 
	 * @return
	 */
	public String getClassName() {
		return className;
	}

	/**
	 * Sets a class name.
	 * 
	 * @param className
	 */
	public void setClassName(String className) {
		this.className = className;
	}

	/**
	 * Returns a package name, e.g., java.lang
	 * 
	 * @return
	 */
	public String getPackageName() {
		return packageName;
	}

	/**
	 * Sets a package name, e.g., java.lang
	 * 
	 * @param packageName
	 */
	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	/**
	 * Returns a file size. it is a string. e.g., "23.5K", "1.3M", etc.
	 * 
	 * @return
	 */
	public String getFileSize() {
		return fileSize;
	}

	/**
	 * Sets a file size. it is a string. e.g., "23.5K", "1.3M", etc.
	 * 
	 * @param fileSize
	 */
	public void setFileSize(String fileSize) {
		this.fileSize = fileSize;
	}

	/**
	 * Returns a file last update date time. It is a string value. e.g.,
	 * "2016-11-12 23:48".
	 * 
	 * @return
	 */
	public String getLastModified() {
		return lastModified;
	}

	/**
	 * Sets a file last update date time. It is a string value. e.g.,
	 * "2016-11-12 23:48".
	 * 
	 * @param lastModified
	 */
	public void setLastModified(String lastModified) {
		this.lastModified = lastModified;
	}

	/**
	 * Returns whether it is a directory, by default, "N" is not a directory;
	 * otherwise, "Y".
	 * 
	 * @return the isDir
	 */
	public String getIsDir() {
		return isDir;
	}

	/**
	 * Sets it is a directory, by default, "N" is not a directory; otherwise,
	 * "Y".
	 * 
	 * @param isDir
	 *            the isDir to set
	 */
	public void setIsDir(String isDir) {
		this.isDir = isDir;
	}

	/**
	 * @return the jarFileName
	 */
	public String getJarFileName() {
		return jarFileName;
	}

	/**
	 * @param jarFileName the jarFileName to set
	 */
	public void setJarFileName(String jarFileName) {
		this.jarFileName = jarFileName;
	}

}
